import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { CityHunterBoss } from '../src/entities/CityHunterBoss.js';
import { SuperPredatorBoss } from '../src/entities/SuperPredatorBoss.js';
import { getHuntDirective, resolveDirectiveReward } from '../src/gameplay/HuntDirectiveSystem.js';
import { resolveHuntNpcType } from '../src/entities/HuntNPC.js';
import {
  ARMOR_FINISHES,
  ARMOR_PRESET_WEAPON_VARIANTS,
  WEAPON_TECH_VARIANTS,
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

test('Chantier 1 — Audio Predator 2 & Predators 2010 (Rebreather, Gatling, Whistle)', () => {
  for (const name of ['playCityHunterBreather', 'playBerserkerGatlingBurst', 'playTrackerWhistle']) {
    assert.equal(typeof audioSynth[name], 'function', `${name} doit exister`);
    assert.doesNotThrow(() => audioSynth[name]());
  }
});

test('Chantier 2 — Mécanique Boss : City Hunter rebreather & Berserker Gatling', () => {
  const spy = spyAudio(['playCityHunterBreather', 'playBerserkerGatlingBurst', 'playTrackerWhistle', 'playBerserkerRoar']);
  const scene = new THREE.Scene();

  const cityHunter = new CityHunterBoss(scene);
  try {
    assert.equal(cityHunter.rebreatherEngaged, false);
    cityHunter.breakMask();
    assert.equal(cityHunter.rebreatherEngaged, true);
    assert.equal(spy.calls.playCityHunterBreather, 1, 'le bris du masque déclenche le rebreather');
  } finally {
    cityHunter.dispose();
  }

  const berserker = new SuperPredatorBoss(scene);
  try {
    const shot = berserker.fireHeavyPlasma(new THREE.Vector3(0, 0, 10));
    assert.ok(shot);
    assert.equal(spy.calls.playBerserkerGatlingBurst, 1, 'le tir lourd déclenche la salve Gatling');

    // Passage sous 50% de vie -> enrage + sifflet de traque
    berserker.takeDamage(berserker.maxHealth * 0.55);
    assert.equal(berserker.isEnraged, true);
    assert.ok(spy.calls.playTrackerWhistle >= 1, 'l’enragement émet le sifflet de rappel de la meute');
    assert.ok(spy.calls.playBerserkerRoar >= 1);
  } finally {
    berserker.dispose();
    spy.restore();
  }
});

test('Chantier 3 — Directive Guerre des Clans 2010 sur la planète-réserve', () => {
  const directive = getHuntDirective('game_preserve_trio_trial');
  assert.ok(directive);
  assert.equal(directive.id, 'game_preserve_trio_trial');
  assert.equal(directive.provenance, 'SCREEN_ADAPTATION');
  assert.equal(directive.rewardMultiplier, 1.6);
  assert.deepEqual(
    directive.objectives.map((o) => o.npcType),
    ['hell_hound_alpha', 'river_ghost', 'hunting_hound'],
  );
  directive.schedule.forEach((entry) => {
    assert.equal(resolveHuntNpcType(entry.npcType), entry.npcType, `${entry.npcType} doit être résolu`);
  });
  assert.equal(resolveDirectiveReward('game_preserve_trio_trial', 1000), 1000);
});

test('Chantier 4 — Variantes d’Armes : Fléchette City Hunter & Plasma rotatif Berserker', () => {
  const dart = getArmorPresetWeaponTechVariant('city_1990', 'speargun');
  assert.ok(dart);
  assert.equal(dart.id, 'variant_city_hunter_speargun_dart');
  assert.equal(dart.baseWeaponId, 'speargun');
  assert.equal(dart.sourceTier, 'SCREEN');
  assert.deepEqual([...dart.sources], ['predator2']);
  assert.equal(dart.modifiers.damageMultiplier, 1.25);

  const rotary = getArmorPresetWeaponTechVariant('berserker_2010', 'plasmacaster_single');
  assert.ok(rotary);
  assert.equal(rotary.id, 'variant_berserker_rotary_plasma');
  assert.equal(rotary.sourceTier, 'SCREEN');
  assert.deepEqual([...rotary.sources], ['predators2010']);
  assert.equal(rotary.modifiers.burstCount, 3);
  assert.equal(rotary.modifiers.damageMultiplier, 1.32);
});

test('Chantier 5 — Finition Écailles et laque cramoisie Super Predator', () => {
  const finish = ARMOR_FINISHES.find(({ id }) => id === 'finish_super_predator_crimson');
  assert.ok(finish);
  assert.equal(finish.basisTier, 'SCREEN');
  assert.equal(finish.implementationOriginal, true);
  assert.deepEqual([...finish.sources], ['predators2010']);
  assert.equal(finish.roughness, 0.42);
  assert.equal(finish.metalness, 0.65);

  const sanitized = sanitizeCustomization({ armorFinishId: 'finish_super_predator_crimson' });
  assert.equal(sanitized.armorFinishId, 'finish_super_predator_crimson');
});

test('Chantier 6 — Relique du Pistolet de Raphael Adolini 1715 dans le Vaisseau-Mère', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const reliquary = hub.group.getObjectByName('vault-reliquary-adolini-1715');
    assert.ok(reliquary, 'Le reliquaire de Raphael Adolini 1715 doit être présent');
    assert.equal(reliquary.userData.relicId, 'adolini_1715_pistol');
    assert.equal(reliquary.userData.provenance, 'SCREEN');

    const stasis = reliquary.getObjectByName('adolini-stasis-field');
    assert.ok(stasis, 'Le champ de stase ambré doit envelopper la relique');

    const gun = reliquary.getObjectByName('adolini-1715-flintlock-mesh');
    assert.ok(gun?.isMesh, 'Le pistolet à silex est matérialisé en un mesh fusionné');
    assert.ok(gun.geometry.getAttribute('position').count > 0);

    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});

test('Chantier 7 — Codex Lore : Pistolet Adolini 1715 & Guerre des Clans 2010', () => {
  const adolini = getLoreEntryById('relique-pistolet-adolini-1715');
  assert.ok(adolini);
  assert.equal(adolini.sourceTier, 'SCREEN');
  assert.ok(adolini.sources.includes('predator2'));
  assert.ok(adolini.sources.includes('prey2022'));
  assert.match(adolini.body, /1719/);

  const clanWar = getLoreEntryById('culture-guerre-des-clans-super-predators');
  assert.ok(clanWar);
  assert.equal(clanWar.sourceTier, 'SCREEN');
  assert.ok(clanWar.sources.includes('predators2010'));
  assert.match(clanWar.summary, /planète-réserve/);
});

test('Chantier 8 — Catalogue Médiatique : Liaisons officielles 1990 et 2010', () => {
  const p2 = getMediaCoverageById('film_predator_2');
  assert.ok(p2, 'film_predator_2 doit exister');
  assert.ok(p2.coverageTargets.some((t) => t.id === 'adolini_1715_pistol' && t.type === 'relic'));
  assert.match(p2.gameCoverage.summary, /Adolini 1715/);

  const predators = getMediaCoverageById('film_predators_2010');
  assert.ok(predators, 'film_predators_2010 doit exister');
  assert.ok(predators.coverageTargets.some((t) => t.id === 'game_preserve_trio_trial' && t.type === 'directive'));
  assert.match(predators.gameCoverage.summary, /canon rotatif/);
});

test('Chantier 9 — Alertes Télémétriques HUD : Rebreather & Canon Rotatif', () => {
  const hud = createHudStub();
  const rebreatherMsg = hud.showRebreatherVentAlert(true);
  assert.match(rebreatherMsg, /REBREATHER MULTISPECTRAL ENGAGÉ/);
  assert.equal(hud.logBanner.textContent, rebreatherMsg);

  const rotaryMsg = hud.showRotaryPlasmaAlert(3);
  assert.match(rotaryMsg, /CANON ROTATIF EN SURCADENCE/);
  assert.match(rotaryMsg, /3 CHARGES/);
  assert.equal(hud.logBanner.textContent, rotaryMsg);

  clearTimeout(hud.logTimeoutId);
});

test('Chantier 10 — Cohérence croisée Directive / Codex / Hub / Couverture', () => {
  const directive = getHuntDirective('game_preserve_trio_trial');
  const predators = getMediaCoverageById('film_predators_2010');
  const codexClan = getLoreEntryById('culture-guerre-des-clans-super-predators');
  const codexAdolini = getLoreEntryById('relique-pistolet-adolini-1715');

  assert.ok(directive);
  assert.ok(predators.coverageTargets.some((t) => t.id === directive.id));
  assert.ok(codexClan);
  assert.ok(codexAdolini);
});
