import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  MEDBAY_ITEMS,
  getMedbayItemById,
  createMedbayInventoryState,
  refillMedbayInventory,
  getMedbayDiagnostic,
  canApplyMedbayItem,
  applyMedbayItem,
  updateMedbayCooldowns,
} from '../src/gameplay/YautjaMedbaySystem.js';
import { MedbayInventoryOverlay } from '../src/ui/MedbayInventoryOverlay.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { getHuntDirective, resolveDirectiveReward } from '../src/gameplay/HuntDirectiveSystem.js';
import { resolveHuntNpcType } from '../src/entities/HuntNPC.js';
import {
  ARMOR_FINISHES,
  ARMOR_PRESET_WEAPON_VARIANTS,
  getArmorPresetWeaponTechVariant,
  getWeaponTechVariantById,
  sanitizeCustomization,
} from '../src/data/RuntimeEquipment.js';
import { getLoreEntryById } from '../src/data/LoreCodex.js';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { HUDManager } from '../src/HUDManager.js';

function createHudStub() {
  const hud = Object.create(HUDManager.prototype);
  hud.logTimeoutId = null;
  hud.logBanner = { textContent: '' };
  hud.setText = (el, val) => { el.textContent = String(val); };
  hud.setClassState = () => {};
  return hud;
}

test('Chantier 1 — Audio : Dépressurisation, Cautérisation, Agrafes et Stimulant', () => {
  for (const name of ['playMedicompOpen', 'playCauterizerSizzle', 'playStaplerSnap', 'playStimInjectorHiss']) {
    assert.equal(typeof audioSynth[name], 'function', `${name} doit exister sur audioSynth`);
    assert.doesNotThrow(() => audioSynth[name]());
  }
});

test('Chantier 2 — YautjaMedbaySystem : 6 outils canoniques et logiques de soins 1:1', () => {
  assert.equal(MEDBAY_ITEMS.length, 6, 'exactement 6 composants médicaux canoniques');
  assert.ok(Object.isFrozen(MEDBAY_ITEMS));

  const expectedIds = [
    'shrapnel_extractor',
    'dermal_stapler',
    'thermal_cauterizer',
    'coagulant_blue_paste',
    'acid_neutralizer_vial',
    'stimulant_injector',
  ];
  assert.deepEqual(MEDBAY_ITEMS.map((item) => item.id), expectedIds);

  const inventory = createMedbayInventoryState({ isMothership: false });
  assert.equal(inventory.charges.shrapnel_extractor, 3);
  assert.equal(inventory.charges.thermal_cauterizer, 2);

  const mothershipInv = createMedbayInventoryState({ isMothership: true });
  assert.equal(mothershipInv.charges.shrapnel_extractor, Number.POSITIVE_INFINITY);

  // Test diagnostic et soin
  const mockPlayer = {
    health: 40,
    maxHealth: 100,
    stamina: 80,
    maxStamina: 100,
    energy: 50,
    maxEnergy: 100,
    isAcidCorroded: true,
    isBleeding: true,
  };

  const diag = getMedbayDiagnostic(mockPlayer);
  assert.equal(diag.hasAcid, true);
  assert.equal(diag.hasBleeding, true);
  assert.equal(diag.overallCondition, 'CORROSION CRITIQUE');

  // Application fiole anti-acide
  const acidRes = applyMedbayItem(mockPlayer, 'acid_neutralizer_vial', inventory);
  assert.equal(acidRes.success, true);
  assert.equal(mockPlayer.isAcidCorroded, false);
  assert.ok(acidRes.curedStatuses.includes('acid_burn'));

  // Application cautérisation plasma
  const cauterizeRes = applyMedbayItem(mockPlayer, 'thermal_cauterizer', inventory);
  assert.equal(cauterizeRes.success, true);
  assert.equal(mockPlayer.isBleeding, false);
  assert.ok(cauterizeRes.curedStatuses.includes('bleeding'));

  // Cooldown update
  assert.ok(inventory.cooldowns.thermal_cauterizer > 0);
  updateMedbayCooldowns(inventory, 5.0);
  assert.equal(inventory.cooldowns.thermal_cauterizer, 0);
});

test('Chantier 3 — Interface Détachable : MedbayInventoryOverlay', () => {
  const fakePlayer = {
    health: 60,
    maxHealth: 100,
    stamina: 75,
    maxStamina: 100,
    energy: 90,
    maxEnergy: 100,
    isAcidCorroded: false,
    isBleeding: false,
  };
  const inventory = createMedbayInventoryState({ isMothership: false });

  let actionReport = null;
  const overlay = new MedbayInventoryOverlay({
    player: fakePlayer,
    inventoryState: inventory,
    onAction: (res) => { actionReport = res; },
  });

  const dom = overlay.mount();
  assert.ok(dom);
  assert.equal(dom.getAttribute('role'), 'dialog');

  overlay.open();
  assert.equal(overlay.isOpen, true);
  assert.equal(dom.classList.contains('hidden'), false);

  // Exécution d'une action via l'overlay
  overlay.executeItemAction('dermal_stapler');
  assert.ok(actionReport);
  assert.equal(actionReport.item.id, 'dermal_stapler');
  assert.equal(fakePlayer.health, 95);

  overlay.close();
  assert.equal(overlay.isOpen, false);
  overlay.destroy();
});

test('Chantier 4 — Intégration Joueur : applyMedicalTreatment et saignement', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);

  try {
    assert.ok(player.medbayInventory, 'le joueur doit posséder un inventaire médical initialisé');
    assert.equal(player.isBleeding, false);

    player.health = 50;
    player.isBleeding = true;

    // Déroulement d'un delta de frame avec saignement
    player.update(1.0, { x: 0, z: 0 }, 0);
    assert.ok(player.health < 50, 'l’hémorragie doit infliger des dégâts sur la durée');

    // Soin à l'agrafeuse dermique via applyMedicalTreatment
    const treatResult = player.applyMedicalTreatment('dermal_stapler');
    assert.equal(treatResult.success, true);
    assert.ok(player.health > 50);

    // Arrêt de l'hémorragie au cautériseur
    const cauterizeResult = player.applyMedicalTreatment('thermal_cauterizer');
    assert.equal(cauterizeResult.success, true);
    assert.equal(player.isBleeding, false);
  } finally {
    player.clearTransientGadgets?.();
  }
});

test('Chantier 5 — Sanctuaire Medbay du Vaisseau-Mère et budget WebGL', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const medbayStation = hub.allStations.find((s) => s.interactionType === 'cleaner_lab');
    assert.ok(medbayStation, 'La station interactive de baie médicale doit exister');
    assert.match(medbayStation.prompt, /MEDICOMP/);

    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});

test('Chantier 6 — 16e Directive Canonique : field_medicomp_triage_1990', () => {
  const directive = getHuntDirective('field_medicomp_triage_1990');
  assert.ok(directive, 'la directive field_medicomp_triage_1990 doit être enregistrée');
  assert.equal(directive.id, 'field_medicomp_triage_1990');
  assert.equal(directive.provenance, 'SCREEN_ADAPTATION');
  assert.equal(directive.rewardMultiplier, 1.65);
  assert.deepEqual(
    directive.objectives.map((o) => o.npcType),
    ['urban_cartel_enforcer', 'owlf_cryo_commando', 'xeno_runner'],
  );
  directive.schedule.forEach((entry) => {
    assert.equal(resolveHuntNpcType(entry.npcType), entry.npcType, `${entry.npcType} doit être résolu`);
  });
  assert.equal(resolveDirectiveReward('field_medicomp_triage_1990', 1000), 1000);
});

test('Chantier 7 — Équipement : Finition Bronze patiné Medicomp et Variantes', () => {
  const finish = ARMOR_FINISHES.find(({ id }) => id === 'finish_medicomp_burnished_bronze');
  assert.ok(finish, 'finish_medicomp_burnished_bronze doit exister');
  assert.equal(finish.metalness, 0.78);
  assert.equal(finish.roughness, 0.44);

  const citySurgical = getArmorPresetWeaponTechVariant('city_1990', 'medicomp');
  assert.ok(citySurgical, 'variante chirurgicale du City Hunter requise');
  assert.equal(citySurgical.id, 'variant_city_hunter_surgical_kit');
  assert.equal(citySurgical.modifiers.healingEfficiencyMultiplier, 1.25);

  const wolfAntidote = getArmorPresetWeaponTechVariant('wolf_avpr', 'medicomp');
  assert.ok(wolfAntidote, 'variante bio-neutralisant de Wolf requise');
  assert.equal(wolfAntidote.id, 'variant_wolf_cleaner_antidote');
  assert.equal(wolfAntidote.modifiers.acidPurgeBonus, 1.5);
});

test('Chantier 8 — Codex Lore : Science Médicale Yautja et Laboratoire Cleaner', () => {
  const medicompEntry = getLoreEntryById('technologie-medicomp-chirurgie-terrain');
  assert.ok(medicompEntry, 'entrée codex technologie-medicomp-chirurgie-terrain requise');
  assert.equal(medicompEntry.sourceTier, 'SCREEN');
  assert.ok(medicompEntry.sources.includes('predator2'));
  assert.match(medicompEntry.summary, /pinces/);
  assert.match(medicompEntry.body, /cautérise/);

  const labEntry = getLoreEntryById('science-laboratoire-medical-cleaner');
  assert.ok(labEntry, 'entrée codex science-laboratoire-medical-cleaner requise');
  assert.equal(labEntry.sourceTier, 'AVP_SCREEN');
  assert.ok(labEntry.sources.includes('avpRequiem2007'));
  assert.match(labEntry.body, /Wolf/);
});

test('Chantier 9 — Télémétrie HUD Diégétique : Alertes Soins, Anti-Acide et Hémorragie', () => {
  const hud = createHudStub();
  const treatMsg = hud.showMedicompTreatmentAlert('Agrafeuse dermique', 35);
  assert.match(treatMsg, /AGRAFEUSE DERMIQUE/);
  assert.match(treatMsg, /35 PV/);
  assert.equal(hud.logBanner.textContent, treatMsg);

  const acidMsg = hud.showAcidPurgedAlert();
  assert.match(acidMsg, /CONTAMINATION ACIDE PURGÉE/);

  const hemoMsg = hud.showHemorrhageTreatedAlert();
  assert.match(hemoMsg, /HÉMORRAGIE ARTÉRIELLE ENDIGUÉE/);

  clearTimeout(hud.logTimeoutId);
});

test('Chantier 10 — Cohérence et Intégrité Globale Système Medbay', () => {
  assert.ok(MEDBAY_ITEMS.every((item) => Object.isFrozen(item)));
  for (const item of MEDBAY_ITEMS) {
    assert.ok(item.id && item.name && item.lore);
    assert.ok(item.baseCharges >= 1);
  }
  const directive = getHuntDirective('field_medicomp_triage_1990');
  assert.ok(directive);
  const codex = getLoreEntryById('technologie-medicomp-chirurgie-terrain');
  assert.ok(codex);
});
