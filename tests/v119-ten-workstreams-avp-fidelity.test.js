import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { WolfCleanerBoss } from '../src/entities/WolfCleanerBoss.js';
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
import { getMediaCoverageById } from '../src/data/MediaCoverageCatalog.js';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { HUDManager } from '../src/HUDManager.js';

function spyAudio(names) {
  const calls = Object.fromEntries(names.map((name) => [name, 0]));
  const originals = {};
  for (const name of names) {
    originals[name] = audioSynth[name];
    audioSynth[name] = () => { calls[name] += 1; };
  }
  return {
    calls,
    restore() {
      for (const name of names) audioSynth[name] = originals[name];
    },
  };
}

function createHudStub() {
  const hud = Object.create(HUDManager.prototype);
  hud.logTimeoutId = null;
  hud.logBanner = { textContent: '' };
  hud.setText = (el, val) => { el.textContent = String(val); };
  hud.setClassState = () => {};
  return hud;
}

test('Chantier 1 — Audio AVP 2004 & AVPR 2007 (Shuriken, Dissolvant, Mine Laser)', () => {
  for (const name of ['playShurikenThrow', 'playCleanerDissolve', 'playLaserGridHum']) {
    assert.equal(typeof audioSynth[name], 'function', `${name} doit exister sur audioSynth`);
    assert.doesNotThrow(() => audioSynth[name]());
  }
});

test('Chantier 2 — Câblage Audio Boss Wolf Cleaner & Shuriken Joueur', () => {
  const spy = spyAudio(['playCleanerDissolve', 'playLaserGridHum', 'playShurikenThrow']);
  const scene = new THREE.Scene();

  const wolf = new WolfCleanerBoss(scene);
  try {
    const fluidZone = wolf.deployDissolvingFluid(new THREE.Vector3(10, 0, 10));
    assert.ok(fluidZone, 'la zone de fluide dissolvant doit être créée');
    assert.equal(spy.calls.playCleanerDissolve, 1, 'déployer le fluide doit déclencher playCleanerDissolve');

    const mineZone = wolf.deployCleanerMine(new THREE.Vector3(15, 0, 15));
    assert.ok(mineZone, 'la mine cleaner doit être créée');
    assert.equal(spy.calls.playLaserGridHum, 1, 'poser une mine doit déclencher playLaserGridHum');
  } finally {
    wolf.dispose();
  }

  const player = new YautjaPlayer(scene);
  try {
    const launched = player.fireShuriken(new THREE.Vector3(0, 0, 20));
    assert.equal(launched, true);
    assert.equal(spy.calls.playShurikenThrow, 1, 'lancer le shuriken doit déclencher playShurikenThrow');
  } finally {
    player.clearTransientGadgets?.();
    spy.restore();
  }
});

test('Chantier 3 — Directive Infiltration de Bouvetøya 2004', () => {
  const directive = getHuntDirective('bouvetoya_surface_infiltration');
  assert.ok(directive, 'la directive bouvetoya_surface_infiltration doit exister');
  assert.equal(directive.id, 'bouvetoya_surface_infiltration');
  assert.equal(directive.provenance, 'AVP_SCREEN_ADAPTATION');
  assert.equal(directive.rewardMultiplier, 1.55);
  assert.deepEqual(
    directive.objectives.map((o) => o.npcType),
    ['weyland_expedition_guard', 'xeno_drone', 'xeno_runner'],
  );
  directive.schedule.forEach((entry) => {
    assert.equal(resolveHuntNpcType(entry.npcType), entry.npcType, `${entry.npcType} doit être résolu en NPC réel`);
  });
  assert.equal(resolveDirectiveReward('bouvetoya_surface_infiltration', 1000), 1000);
});

test('Chantier 4 — Variantes d’Armes AVP : Filet lourd de Celtic & Fouet d’épines de Wolf', () => {
  const netgun = getArmorPresetWeaponTechVariant('celtic_avp', 'netgun');
  assert.ok(netgun, 'variante lance-filet de Celtic requise');
  assert.equal(netgun.id, 'variant_celtic_heavy_netgun');
  assert.equal(netgun.baseWeaponId, 'netgun');
  assert.equal(netgun.sourceTier, 'AVP_SCREEN');
  assert.deepEqual([...netgun.sources], ['avp2004']);
  assert.equal(netgun.modifiers.damageMultiplier, 1.2);
  assert.equal(netgun.modifiers.snareDurationMultiplier, 1.25);

  const whip = getArmorPresetWeaponTechVariant('wolf_avpr', 'whip_thorns');
  assert.ok(whip, 'variante fouet segmenté de Wolf requise');
  assert.equal(whip.id, 'variant_wolf_segmented_whip');
  assert.equal(whip.baseWeaponId, 'whip_thorns');
  assert.equal(whip.sourceTier, 'AVP_SCREEN');
  assert.deepEqual([...whip.sources], ['avpRequiem2007']);
  assert.equal(whip.modifiers.damageMultiplier, 1.26);

  assert.equal(getWeaponTechVariantById('variant_celtic_heavy_netgun'), netgun);
  assert.equal(getWeaponTechVariantById('variant_wolf_segmented_whip'), whip);
});

test('Chantier 5 — Finition Alliage rituel de Celtic', () => {
  const finish = ARMOR_FINISHES.find(({ id }) => id === 'finish_celtic_battle_aged');
  assert.ok(finish, 'finish_celtic_battle_aged doit être présent dans ARMOR_FINISHES');
  assert.equal(finish.basisTier, 'AVP_SCREEN');
  assert.equal(finish.implementationOriginal, true);
  assert.deepEqual([...finish.sources], ['avp2004']);
  assert.equal(finish.roughness, 0.52);
  assert.equal(finish.metalness, 0.88);

  const sanitized = sanitizeCustomization({ armorFinishId: 'finish_celtic_battle_aged' });
  assert.equal(sanitized.armorFinishId, 'finish_celtic_battle_aged');
});

test('Chantier 6 — Relique sous champ de stase de la Mallette Cleaner de Wolf dans le Medbay', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const specimenCase = hub.group.getObjectByName('cleaner-medbay-specimen-case');
    assert.ok(specimenCase, 'Le reliquaire de la mallette Cleaner de Wolf doit être présent dans le hub');
    assert.equal(specimenCase.userData.relicId, 'wolf_cleaner_case');
    assert.equal(specimenCase.userData.provenance, 'AVP_SCREEN');

    const stasis = specimenCase.getObjectByName('cleaner-case-stasis-field');
    assert.ok(stasis, 'Le champ de stase bleuté doit envelopper la mallette');

    const caseMesh = specimenCase.getObjectByName('wolf-cleaner-case-mesh');
    assert.ok(caseMesh?.isMesh, 'La mallette Cleaner est matérialisée en un mesh fusionné unique');
    assert.ok(caseMesh.geometry.getAttribute('position').count > 0);

    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});

test('Chantier 7 — Codex Lore AVP/AVPR : Fluide dissolvant & Rite de Bouvetøya', () => {
  const solvent = getLoreEntryById('technologie-agent-dissolvant-cleaner');
  assert.ok(solvent, 'entrée codex technologie-agent-dissolvant-cleaner requise');
  assert.equal(solvent.sourceTier, 'AVP_SCREEN');
  assert.ok(solvent.sources.includes('avpRequiem2007'));
  assert.match(solvent.summary, /Cleaners/);

  const blooding = getLoreEntryById('culture-rite-du-sang-bouvetoya');
  assert.ok(blooding, 'entrée codex culture-rite-du-sang-bouvetoya requise');
  assert.equal(blooding.sourceTier, 'AVP_SCREEN');
  assert.ok(blooding.sources.includes('avp2004'));
  assert.match(blooding.body, /Scar, Celtic, Chopper/);
});

test('Chantier 8 — Catalogue Médiatique : Couverture officielle Alien vs. Predator et Requiem', () => {
  const avp = getMediaCoverageById('film_avp_2004');
  assert.ok(avp, 'film_avp_2004 doit exister');
  assert.ok(avp.coverageTargets.some((t) => t.id === 'bouvetoya_surface_infiltration' && t.type === 'directive'));
  assert.ok(avp.coverageTargets.some((t) => t.id === 'shuriken' && t.type === 'weapon'));
  assert.match(avp.gameCoverage.summary, /shuriken/);

  const avpr = getMediaCoverageById('film_avpr_2007');
  assert.ok(avpr, 'film_avpr_2007 doit exister');
  assert.ok(avpr.coverageTargets.some((t) => t.id === 'wolf_cleaner_case' && t.type === 'relic'));
  assert.match(avpr.gameCoverage.summary, /mallette Cleaner/);
});

test('Chantier 9 — Alertes Télémétriques HUD : Shuriken & Agent Dissolvant', () => {
  const hud = createHudStub();
  const shurikenMsg = hud.showShurikenLockAlert(6);
  assert.match(shurikenMsg, /DISQUE SHURIKEN ENGAGÉ/);
  assert.match(shurikenMsg, /6 LAMES/);
  assert.equal(hud.logBanner.textContent, shurikenMsg);

  const dissolveMsg = hud.showDissolvingAgentAlert(true);
  assert.match(dissolveMsg, /FLUIDE DISSOLVANT CLEANER DÉTECTÉ/);
  assert.equal(hud.logBanner.textContent, dissolveMsg);

  clearTimeout(hud.logTimeoutId);
});

test('Chantier 10 — Cohérence croisée Directive / Codex / Hub / Couverture AVP & AVPR', () => {
  const directive = getHuntDirective('bouvetoya_surface_infiltration');
  const avp = getMediaCoverageById('film_avp_2004');
  const avpr = getMediaCoverageById('film_avpr_2007');
  const codexBlooding = getLoreEntryById('culture-rite-du-sang-bouvetoya');
  const codexSolvent = getLoreEntryById('technologie-agent-dissolvant-cleaner');

  assert.ok(directive);
  assert.ok(avp.coverageTargets.some((t) => t.id === directive.id));
  assert.ok(avpr.coverageTargets.some((t) => t.id === 'wolf_cleaner_case'));
  assert.ok(codexBlooding);
  assert.ok(codexSolvent);
});
