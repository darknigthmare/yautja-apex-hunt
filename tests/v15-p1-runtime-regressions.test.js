import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as THREE from 'three';
import { resolveHuntBiome } from '../src/data/GameConfig.js';
import { KaliskBoss } from '../src/entities/KaliskBoss.js';
import { WolfCleanerBoss } from '../src/entities/WolfCleanerBoss.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

function fireSweptShot(boss, origin, damage = 250, stepLength = 12) {
  const direction = boss.getAimPoint().sub(origin).normalize();
  let previousPosition = origin.clone();

  for (let step = 0; step < 32; step += 1) {
    const projectilePosition = previousPosition.clone().addScaledVector(direction, stepLength);
    const impact = boss.resolveProjectileImpact(projectilePosition, 1, previousPosition);
    if (impact) return { impact, outcome: boss.takeDamage(damage, impact) };
    previousPosition = projectilePosition;
  }

  return null;
}

test('Wolf expose des points de visée réels et ses deux volumes faibles restent atteignables', () => {
  const boss = new WolfCleanerBoss(new THREE.Scene());
  boss.position.set(7, 0, -18);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = Math.PI / 2;
  const origin = new THREE.Vector3(7, 4.25, 38);

  assert.ok(boss.getAimPoint().distanceTo(boss.getMaskWorldPosition()) < 1e-8);
  const maskShot = fireSweptShot(boss, origin);
  assert.ok(maskShot, 'le tir balayant doit rencontrer le masque malgré un pas supérieur à son diamètre');
  assert.equal(maskShot.outcome.maskHit, true);
  assert.equal(boss.maskIntact, false);

  assert.ok(boss.getAimPoint().distanceTo(boss.getCleanerKitWorldPosition()) < 1e-8);
  const kitShot = fireSweptShot(boss, origin);
  assert.ok(kitShot, 'le tir suivant doit rencontrer la mallette Cleaner');
  assert.equal(kitShot.outcome.cleanerKitHit, true);
  assert.equal(boss.cleanerKitIntact, false);
  boss.dispose();
});

test('le noyau exposé du Kalisk gagne la priorité sur le volume général du corps', () => {
  const boss = new KaliskBoss(new THREE.Scene());
  boss.position.set(-5, 0, -24);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = -Math.PI / 3;
  boss.exposeCore();
  const origin = new THREE.Vector3(-5, 4.25, 42);

  assert.ok(boss.getAimPoint().distanceTo(boss.getCoreWorldPosition()) < 1e-8);
  const coreShot = fireSweptShot(boss, origin, 100);
  assert.ok(coreShot, 'la trajectoire dirigée vers le noyau doit traverser son hit volume');
  assert.equal(coreShot.outcome.coreHit, true);
  assert.equal(coreShot.outcome.damage, 130);
  boss.dispose();
});

test('quitter un preset texturé restaure une seule base par matériau partagé', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  const appearanceMeshes = [];
  player.mesh.traverse((child) => {
    if (child.isMesh && ['armor', 'mask', 'accent'].includes(child.userData.appearanceChannel)) {
      appearanceMeshes.push(child);
    }
  });
  const materials = [...new Set(appearanceMeshes.map(({ material }) => material))];
  const baseMaps = new Map(materials.map((material) => [material, material.map ?? null]));
  assert.ok(appearanceMeshes.length > materials.length, 'le modèle doit réellement partager certains matériaux');

  const lostTribeTexture = new THREE.Texture();
  player.lostTribeTexture = lostTribeTexture;
  player.applyPresetMaterialTexture('boar_lost_tribe');
  materials.forEach((material) => assert.strictEqual(material.map, lostTribeTexture));

  player.applyPresetMaterialTexture('jungle_hunter_1987');
  materials.forEach((material) => assert.strictEqual(material.map, baseMaps.get(material)));
  materials.forEach((material) => assert.ok(
    Object.prototype.hasOwnProperty.call(material.userData, 'appearanceBaseMap'),
  ));
});

test('le clic mission impose le biome recommandé tout en préservant les chasses libres', () => {
  assert.equal(resolveHuntBiome('kalisk', 'jungle'), 'genna_deathworld');
  assert.equal(resolveHuntBiome('wolf_cleaner', 'ryushi_desert'), 'gunnison_outbreak');
  assert.equal(resolveHuntBiome('feral_predator', 'yautja_prime'), 'jungle');
  assert.equal(resolveHuntBiome('goliath', 'ryushi_desert'), 'ryushi_desert');
  assert.equal(resolveHuntBiome('goliath', 'secteur_obsolete'), 'jungle');

  const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(mainSource, /resolveHuntBiome\(huntType, planetSelector\?\.value\)/);
  assert.match(mainSource, /planetSelector\.value = planetType/);
});
