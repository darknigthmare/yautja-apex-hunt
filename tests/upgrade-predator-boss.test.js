import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { BIOME_DEFINITIONS, HUNT_DEFINITIONS, resolveHuntBiome } from '../src/data/GameConfig.js';
import { UpgradePredatorBoss, UPGRADE_PREDATOR_TEXTURES } from '../src/entities/UpgradePredatorBoss.js';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

test('la chasse Upgrade force le complexe Stargazer et construit un boss HD original', () => {
  const definition = HUNT_DEFINITIONS.upgrade_predator;
  assert.equal(definition.bossType, 'upgradePredator');
  assert.equal(definition.recommendedBiome, 'stargazer_blacksite');
  assert.equal(resolveHuntBiome(definition.id, 'jungle'), 'stargazer_blacksite');
  assert.equal(BIOME_DEFINITIONS.stargazer_blacksite.structureTexture, UPGRADE_PREDATOR_TEXTURES.bioArmor);

  const scene = new THREE.Scene();
  const boss = createBoss(scene, definition);
  assert.ok(boss instanceof UpgradePredatorBoss);
  assert.equal(boss.colliderRadius, 6.4);
  assert.equal(boss.mesh.userData.combatIdentity, 'bio_armor_leap_regenerator');
  assert.ok(boss.mesh.getObjectByName('upgradeBioArmor'));
  assert.ok(boss.mesh.getObjectByName('upgradeAdaptiveGlands'));
  assert.ok(countBossVisualTriangles(boss.mesh) >= 10_000, 'la silhouette complète conserve le budget HD des boss');
  assert.deepEqual(boss.mesh.userData.runtimeTexturePaths, Object.values(UPGRADE_PREDATOR_TEXTURES));
  boss.dispose();
});

test('la bio-armure absorbe les impacts avant de révéler les tissus', () => {
  const boss = new UpgradePredatorBoss(new THREE.Scene());
  const exposed = boss.mesh.getObjectByName('upgradeExposedTissue');
  const startHealth = boss.health;

  boss.takeDamage(400, boss.position.clone().add(new THREE.Vector3(5, 3, 0)));
  assert.equal(boss.health, startHealth - 168);
  assert.equal(boss.bioArmorIntegrity, 440);
  assert.equal(boss.bioArmorIntact, true);
  assert.equal(exposed.visible, false);

  boss.takeDamage(400, boss.position.clone().add(new THREE.Vector3(5, 3, 0)));
  assert.equal(boss.bioArmorIntact, false);
  assert.equal(boss.bioArmorIntegrity, 0);
  assert.equal(boss.mesh.getObjectByName('upgradeBioArmor').visible, false);
  assert.equal(exposed.visible, true);
  boss.dispose();
});

test('les glandes régénèrent une réserve bornée et restent destructibles par ciblage', () => {
  const boss = new UpgradePredatorBoss(new THREE.Scene());
  boss.takeDamage(800, boss.position.clone().add(new THREE.Vector3(5, 3, 0)));
  boss.takeDamage(1000, boss.position.clone().add(new THREE.Vector3(5, 3, 0)));
  assert.ok(boss.health < boss.maxHealth * 0.62);
  const damagedHealth = boss.health;

  boss.regenerationDelay = 0;
  const healed = boss.updateRegeneration(0.2);
  assert.equal(healed, 4);
  assert.equal(boss.health, damagedHealth + 4);
  assert.equal(boss.regenerationBudget, 516);

  const glandImpact = boss.position.clone().add(new THREE.Vector3(0, 6.15, 1.7));
  boss.takeDamage(300, glandImpact);
  assert.equal(boss.adaptiveGlandsIntact, false);
  assert.equal(boss.glandIntegrity, 0);
  assert.equal(boss.regenerationBudget, 0);
  assert.equal(boss.updateRegeneration(0.2), 0);
  boss.dispose();
});

test('le bond d’écrasement est spatial, télégraphié et ne produit qu’un impact', () => {
  const boss = new UpgradePredatorBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  const target = new THREE.Vector3(24, 0, 0);

  assert.equal(boss.beginCrushingLeap(target), true);
  assert.equal(boss.aiState, 'leap_crush');
  assert.equal(boss.consumeAttackImpact(), false);
  while (boss.leapTimer > 0) boss.update(0.2, target, false);

  assert.equal(boss.aiState, 'leap_impact');
  assert.ok(boss.position.x >= 14, 'le bond déplace réellement le boss dans le monde');
  assert.equal(boss.mesh.position.y, 0);
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false);
  boss.dispose();
});
