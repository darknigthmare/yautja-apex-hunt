import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { XenomorphQueen } from '../src/entities/XenomorphQueen.js';
import { PredalienBoss } from '../src/entities/PredalienBoss.js';

globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');

function makeHarness(huntType, boss, playerPosition) {
  const damageEvents = [];
  let corrosionEvents = 0;
  const game = Object.create(Game.prototype);
  game.currentHuntType = huntType;
  game.activeBoss = boss;
  game.player = {
    position: playerPosition,
    projectiles: [],
    mines: [],
    inQTE: false,
    takeDamage(amount) { damageEvents.push(amount); },
    applyAcidCorrosion() { corrosionEvents += 1; },
  };
  game.environment = { addThermalFootprint() {} };
  game.eggClusters = [];
  game.activeFacehuggerCluster = null;
  game.enemyDamageCooldown = 0;
  game.goliathChargeWindow = 0;
  game.goliathChargeLatched = false;
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};
  game.spawnPlasmaShockwaveVFX = () => {};
  return { game, damageEvents, get corrosionEvents() { return corrosionEvents; } };
}

test('les morsures Reine et Predalien infligent un seul impact par attaque', () => {
  for (const [huntType, BossType] of [
    ['xeno_queen', XenomorphQueen],
    ['predalien', PredalienBoss],
  ]) {
    const scene = new THREE.Scene();
    const boss = new BossType(scene);
    boss.position.set(0, 0, 0);
    boss.mesh.position.copy(boss.position);
    const playerPosition = new THREE.Vector3(8, 0, 0);

    boss.update(0.016, playerPosition, false);
    assert.equal(boss.aiState, 'attack_jaw', `${huntType} doit entrer dans l’état de morsure`);

    const harness = makeHarness(huntType, boss, playerPosition);
    harness.game.checkCollisions(0.016);
    harness.game.checkCollisions(0.1);

    assert.deepEqual(harness.damageEvents, [30], `${huntType} doit infliger 30 dégâts`);
    assert.equal(harness.corrosionEvents, 0, 'la corrosion est réservée aux queues dans cette règle');
    boss.dispose();
  }
});
