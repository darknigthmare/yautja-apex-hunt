import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { HUNT_DIRECTIVES, getHuntDirective, resolveDirectiveReward } from '../src/gameplay/HuntDirectiveSystem.js';
import { BIOME_DEFINITIONS, HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { PLAYABLE_WEAPONS, WEAPON_TECH_VARIANTS, ARMOR_PRESET_MASK_IDS } from '../src/data/RuntimeEquipment.js';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { LORE_CODEX_ENTRIES, getLoreEntryById } from '../src/data/LoreCodex.js';
import { getMediaCoverageById } from '../src/data/MediaCoverageCatalog.js';
import { YautjaSkinsDatabase } from '../src/data/YautjaLoreDatabase.js';
import { YautjaContentCatalog, getYautjaContentById } from '../src/data/YautjaContentCatalog.js';
import { HUDManager } from '../src/HUDManager.js';
import { createBoss } from '../src/gameplay/BossFactory.js';

test('Chantier 1 — Audio & Vocalisations Canoniques 1987 / 1990 / AVP', () => {
  assert.equal(typeof audioSynth.playJungleHunterRoar, 'function', 'playJungleHunterRoar doit exister');
  assert.equal(typeof audioSynth.playCityHunterRoar, 'function', 'playCityHunterRoar doit exister');
  assert.equal(typeof audioSynth.playCombistickThrust, 'function', 'playCombistickThrust doit exister');
  assert.equal(typeof audioSynth.playBillyLaughMimic, 'function', 'playBillyLaughMimic doit exister');
  assert.equal(typeof audioSynth.playTriLaserLock, 'function', 'playTriLaserLock doit exister');
  assert.equal(typeof audioSynth.playMedicompUse, 'function', 'playMedicompUse doit exister');
  assert.equal(typeof audioSynth.playCloakDistortion, 'function', 'playCloakDistortion doit exister');
});

test('Chantier 2 — Directive Val Verde 1987 (HuntDirectiveSystem)', () => {
  const directive = getHuntDirective('val_verde_1987_incursion');
  assert.ok(directive, 'La directive val_verde_1987_incursion doit être définie');
  assert.equal(directive.id, 'val_verde_1987_incursion');
  assert.equal(directive.provenance, 'SCREEN_ADAPTATION');
  assert.equal(directive.recommendedBiomeId, 'jungle');
  assert.equal(directive.rewardMultiplier, 1.5);
  assert.deepEqual(
    directive.objectives.map((o) => o.npcType),
    ['jungle_scout', 'jungle_gunner', 'jungle_trapper'],
  );
  assert.deepEqual(
    directive.schedule.map((s) => s.npcType),
    ['jungle_scout', 'jungle_gunner', 'jungle_trapper'],
  );
});

test('Chantier 3 — Biome Jungle & Boss Val Verde 1987 (GameConfig)', () => {
  const jungle = BIOME_DEFINITIONS.jungle;
  assert.ok(jungle, 'Le biome jungle doit être défini');
  assert.equal(jungle.basisTier, 'SCREEN');

  const jhDefinition = HUNT_DEFINITIONS.jungle_hunter_1987;
  assert.ok(jhDefinition, 'La définition de boss jungle_hunter_1987 doit exister');
  assert.equal(jhDefinition.bossType, 'jungleHunter');
  assert.equal(jhDefinition.recommendedBiome, 'jungle');
  assert.equal(jhDefinition.reward, 2800);
});

test('Chantier 4 — Armurerie & Variantes d’Armes 1:1 (RuntimeEquipment)', () => {
  const wristblades = PLAYABLE_WEAPONS.find((w) => w.id === 'wristblades');
  const plasmacaster = PLAYABLE_WEAPONS.find((w) => w.id === 'plasmacaster_single');
  assert.ok(wristblades, 'Lames de poignet doivent être présentes');
  assert.ok(plasmacaster, 'Canon à plasma doit être présent');
  assert.equal(wristblades.sourceTier, 'SCREEN');
  assert.equal(plasmacaster.sourceTier, 'SCREEN');

  assert.ok(WEAPON_TECH_VARIANTS.length >= 5, 'Au moins 5 variantes technologiques');
  assert.ok(WEAPON_TECH_VARIANTS.some((v) => v.id === 'variant_wolf_dual_plasma'));
  assert.ok(WEAPON_TECH_VARIANTS.some((v) => v.id === 'variant_feral_bolt_launcher'));
});

test('Chantier 5 — Râtelier d’Armes & Forge du Vaisseau-Mère (MothershipHub)', () => {
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  const rack = hub.group.getObjectByName('forge-weapon-rack');
  assert.ok(rack, 'Le râtelier d’armes de la forge doit exister');
  assert.ok(rack.userData.weaponSilhouettes.includes('combistick'));
  assert.ok(rack.userData.weaponSilhouettes.includes('smart-disc'));
  assert.ok(rack.userData.weaponSilhouettes.includes('plasma-caster'));
  assert.ok(rack.userData.weaponSilhouettes.includes('wrist-blades'));
  hub.dispose();
});

test('Chantier 6 — Codex du Lore & Provenance 1:1 (LoreCodex)', () => {
  const valVerdeEntry = getLoreEntryById('culture-val-verde-incursion');
  assert.ok(valVerdeEntry, 'L’entrée culture-val-verde-incursion doit exister');
  assert.equal(valVerdeEntry.sourceTier, 'SCREEN');

  const vocalEntry = getLoreEntryById('technologie-vocalisation-mimique-1987');
  assert.ok(vocalEntry, 'L’entrée technologie-vocalisation-mimique-1987 doit exister');
  assert.equal(vocalEntry.sourceTier, 'SCREEN');

  const jhHunt = getLoreEntryById('jungle_hunter_1987');
  assert.ok(jhHunt, 'La fiche de chasse jungle_hunter_1987 doit exister');
  assert.equal(jhHunt.basisTier, 'SCREEN');
});

test('Chantier 7 — Catalogue des Œuvres Médiatiques (MediaCoverageCatalog)', () => {
  const film1987 = getMediaCoverageById('film_predator_1987');
  assert.ok(film1987, 'film_predator_1987 doit exister');
  assert.equal(film1987.gameCoverage.runtimeStatus, 'playable');
  assert.ok(film1987.coverageTargets.some((t) => t.id === 'val_verde_1987_incursion'), 'Directive Val Verde ciblée');
  assert.ok(film1987.coverageTargets.some((t) => t.id === 'jungle_hunter_1987'), 'Jungle Hunter ciblé');
});

test('Chantier 8 — Personnalisation & Presets de Clan (YautjaLoreDatabase & Catalog)', () => {
  const jhSkin = YautjaSkinsDatabase.find((s) => s.id === 'jungle_1987');
  assert.ok(jhSkin, 'Le preset jungle_1987 doit exister');
  assert.equal(jhSkin.sourceTier, 'SCREEN');
  assert.equal(ARMOR_PRESET_MASK_IDS.jungle_1987, 'mask_jungle_hunter_1987');

  const mask = getYautjaContentById('mask_jungle_hunter_1987');
  assert.ok(mask, 'mask_jungle_hunter_1987 doit exister dans le catalogue');
  assert.equal(mask.sourceTier, 'SCREEN');
});

test('Chantier 9 — Télémétrie HUD & Retours Diégétiques (HUDManager)', () => {
  const hud = Object.create(HUDManager.prototype);
  hud.logTimeoutId = null;
  hud.logBanner = { classList: new Set(), classes: new Set() };
  hud.targetScannedName = { textContent: '' };
  hud.setText = (el, val) => { el.textContent = String(val); };
  hud.setClassState = () => {};

  const countdownAlert = hud.showSelfDestructCountdownAlert(15);
  assert.match(countdownAlert, /15 S/);
  assert.match(hud.targetScannedName.textContent, /15 S/);

  const distortionAlert = hud.showThermalDistortionAlert(true);
  assert.match(distortionAlert, /PERTURBATION THERMIQUE/);
});

test('Chantier 10 — Boss Runtime & Duel 1987 (JungleHunterBoss)', () => {
  const scene = new THREE.Scene();
  const definition = HUNT_DEFINITIONS.jungle_hunter_1987;
  const boss = createBoss(scene, definition);

  assert.ok(boss, 'Le boss Jungle Hunter doit s’instancier');
  assert.equal(boss.nativeHighDetail, true);
  assert.equal(boss.maskIntact, true);
  assert.equal(boss.selfDestructTriggered, false);

  // Vérification de l'intégrité de l'arsenal 1987
  assert.ok(boss.mesh.getObjectByName('jungleHunterClassicMask'));
  assert.ok(boss.mesh.getObjectByName('jungleHunterSinglePlasmacaster'));
  assert.ok(boss.mesh.getObjectByName('jungleHunterWristblades'));
  assert.ok(boss.mesh.getObjectByName('jungleHunterWristComputer'));
  assert.ok(boss.mesh.getObjectByName('jungleHunterTriLaserEmitter'));

  boss.takeDamage(boss.maxHealth * 2);
  assert.equal(boss.selfDestructTriggered, true);
  assert.equal(boss.laughMimicPlayed, true);

  boss.dispose();
});
