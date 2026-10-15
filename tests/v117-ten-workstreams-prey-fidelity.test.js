import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { FeralPredatorBoss } from '../src/entities/FeralPredatorBoss.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { getHuntDirective, resolveDirectiveReward } from '../src/gameplay/HuntDirectiveSystem.js';
import { resolveHuntNpcType } from '../src/entities/HuntNPC.js';
import {
  ARMOR_FINISHES,
  ARMOR_PRESET_WEAPON_VARIANTS,
  getArmorPresetWeaponTechVariant,
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

test('Chantier 1 — Audio Prey 2022 : bouclier segmenté et salve de traits', () => {
  for (const name of ['playFeralShieldDeploy', 'playFeralShieldDeflect', 'playFeralCrossboltVolley']) {
    assert.equal(typeof audioSynth[name], 'function', `${name} doit exister`);
    // Sans AudioContext (Node), l'appel doit rester un no-op sûr.
    assert.doesNotThrow(() => audioSynth[name]());
  }
});

test('Chantier 2 — Le Feral déploie, dévie puis perd son bouclier avec les sons dédiés', () => {
  const spy = spyAudio(['playFeralShieldDeploy', 'playFeralShieldDeflect', 'playFeralCrossboltVolley', 'playFeralRoar', 'playYautjaClick']);
  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);
  try {
    assert.equal(boss.deployShield(), true);
    assert.equal(spy.calls.playFeralShieldDeploy, 1);
    assert.equal(spy.calls.playYautjaClick, 0, 'le clic générique ne remplace plus le déploiement');

    const front = boss.position.clone().add(new THREE.Vector3(0, 0, 6));
    const hit = boss.takeDamage(100, front);
    assert.equal(hit.absorbed, 100);
    assert.equal(boss.shieldDeflectionCount, 1);
    assert.equal(spy.calls.playFeralShieldDeflect, 1);

    const breaking = boss.takeDamage(boss.maxShieldIntegrity, front);
    assert.equal(breaking.shieldBroken, true);
    assert.equal(spy.calls.playFeralShieldDeflect, 1, 'la rupture déclenche le rugissement, pas la déviation');
    assert.ok(spy.calls.playFeralRoar >= 1);

    boss.fireCrossboltVolley(new THREE.Vector3(0, 0, 0));
    assert.equal(spy.calls.playFeralCrossboltVolley, 1);
    assert.equal(boss.projectiles.length, 3);
  } finally {
    boss.dispose();
    spy.restore();
  }
});

test('Chantier 3 — Directive Grandes Plaines 1719 sur des PNJ résolubles', () => {
  const directive = getHuntDirective('great_plains_1719_hunt');
  assert.equal(directive.id, 'great_plains_1719_hunt');
  assert.equal(directive.provenance, 'SCREEN_ADAPTATION');
  assert.equal(directive.rewardMultiplier, 1.45);
  assert.deepEqual(directive.objectives.map((o) => o.npcType), ['grizzly_territorial', 'jungle_scout', 'jungle_trapper']);
  directive.schedule.forEach((entry) => {
    assert.equal(resolveHuntNpcType(entry.npcType), entry.npcType, `${entry.npcType} doit être un archétype réel`);
  });
  const times = directive.schedule.map((entry) => entry.at);
  assert.deepEqual(times, [...times].sort((a, b) => a - b));
  assert.ok(resolveDirectiveReward('great_plains_1719_hunt', 1000) >= 1000);
});

test('Chantier 4 — Variante de preset Feral : bouclier-gantelet appliqué au joueur', () => {
  const variant = getArmorPresetWeaponTechVariant('feral_2022', 'wristblades');
  assert.equal(variant?.id, 'variant_feral_bone_shield');
  assert.equal(variant.sourceTier, 'SCREEN');
  assert.deepEqual([...variant.sources], ['prey2022']);
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some(({ id }) => id === 'variant_feral_bone_shield'));

  const player = new YautjaPlayer(new THREE.Scene());
  player.applyCustomization({ armorPresetId: 'feral_2022' });
  assert.equal(player.activeWristbladeVariantId, 'variant_feral_bone_shield');
  assert.equal(player.wristbladeDamageMultiplier, 1.22);
  assert.equal(player.wristShieldAbsorbBonus, 0.12);
  assert.equal(player.wristbladeRight.userData.feralShieldEdge, true);

  player.applyCustomization({ armorPresetId: 'jungle_1987' });
  assert.equal(player.wristShieldAbsorbBonus, 0, 'le bonus disparaît hors preset Feral');
});

test('Chantier 5 — Finition « Os gravé des Grandes Plaines »', () => {
  const finish = ARMOR_FINISHES.find(({ id }) => id === 'finish_feral_bone_carved');
  assert.ok(finish);
  assert.equal(finish.basisTier, 'SCREEN');
  assert.equal(finish.implementationOriginal, true);
  assert.ok(finish.metalness < 0.3, 'un fini osseux reste mat et peu métallique');
  assert.equal(sanitizeCustomization({ armorFinishId: 'finish_feral_bone_carved' }).armorFinishId, 'finish_feral_bone_carved');
});

test('Chantier 6 — Codex Prey : bouclier segmenté et Grandes Plaines 1719', () => {
  const shield = getLoreEntryById('technologie-bouclier-osseux-feral');
  assert.equal(shield?.sourceTier, 'SCREEN');
  assert.ok(shield.sources.includes('prey2022'));
  const culture = getLoreEntryById('culture-rituel-prey-1719');
  assert.equal(culture?.sourceTier, 'SCREEN');
  assert.equal(culture.relatedTier, 'LICENSED_EU');
  assert.match(culture.summary, /comanche/);
});

test('Chantier 7 — Couverture média Prey reliée à la directive 1719', () => {
  const prey = getMediaCoverageById('film_prey_2022');
  assert.ok(prey.coverageTargets.some((t) => t.type === 'directive' && t.id === 'great_plains_1719_hunt'));
  assert.equal(prey.gameCoverage.runtimeStatus, 'playable');
});

test('Chantier 8 — Bouclier du Feral exposé sur le râtelier de la forge', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const rack = hub.group.getObjectByName('forge-weapon-rack');
    assert.ok(rack.userData.weaponSilhouettes.includes('feral-shield'));
    const shield = rack.getObjectByName('rack-feral-shield');
    assert.ok(shield?.isMesh, 'bouclier fusionné en un seul mesh (un draw call)');
    assert.equal(shield.userData.segmentCount, 7);
    assert.ok(shield.geometry.getAttribute('position').count > 0);
    // Reste dans l'emprise du panneau arrière (z ∈ [-4.2, 4.2]).
    assert.ok(Math.abs(shield.position.z) + 0.78 < 4.2);
  } finally {
    hub.dispose();
  }
});

test('Chantier 9 — Relevé HUD de déviation par bouclier', () => {
  const hud = createHudStub();
  const deflect = hud.showShieldDeflectionBadge({ absorbed: 90, integrity: 180, maxIntegrity: 360 });
  assert.match(deflect, /90 ABSORBÉ/);
  assert.match(deflect, /INTÉGRITÉ 50%/);
  assert.equal(hud.logBanner.textContent, deflect);
  assert.match(hud.showShieldDeflectionBadge({ absorbed: 10, shieldBroken: true }), /BRISÉ/);
  clearTimeout(hud.logTimeoutId);
});

test('Chantier 10 — Cohérence croisée directive / codex / couverture', () => {
  const directive = getHuntDirective('great_plains_1719_hunt');
  const prey = getMediaCoverageById('film_prey_2022');
  assert.ok(prey.coverageTargets.some((t) => t.id === directive.id));
  assert.ok(getLoreEntryById('culture-rituel-prey-1719'));
  assert.ok(getLoreEntryById('technologie-bouclier-osseux-feral'));
});
