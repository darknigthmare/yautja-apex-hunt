import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { RhynthBoss, RHYNTH_ATTACK_SPECS } from '../src/entities/RhynthBoss.js';
import { VydrachBoss, VYDRACH_ATTACK_SPECS } from '../src/entities/VydrachBoss.js';
import { XenomorphKingBoss, XENOMORPH_KING_ATTACK_SPECS } from '../src/entities/XenomorphKingBoss.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

test('all seven native giant attacks inflict damage through Game only at their single impact', () => {
  for (const [type, Boss, specs] of [
    ['rhynth_titan', RhynthBoss, RHYNTH_ATTACK_SPECS],
    ['vydrach_prime', VydrachBoss, VYDRACH_ATTACK_SPECS],
    ['xeno_king', XenomorphKingBoss, XENOMORPH_KING_ATTACK_SPECS],
  ]) {
    const boss = new Boss(new THREE.Scene());
    try {
      for (const [attack, spec] of Object.entries(specs)) {
        const game = Object.create(Game.prototype);
        game.activeBoss = boss; game.currentHuntType = type;
        game.activeEnemies = []; game.eggClusters = []; game.activeFacehuggerCluster = null;
        game.enemyDamageCooldown = 0; game.goliathChargeWindow = 0; game.goliathChargeLatched = false;
        game.environment = { addThermalFootprint() {}, resolveProjectileCoverImpact() { return null; } };
        game.hud = { showLogMessage() {} };
        game.spawnBloodSpatterVFX = () => {};
        game.player = { position: boss.position.clone().add(new THREE.Vector3(0, 0, spec.range - 0.1)),
          projectiles: [], mines: [], inQTE: false, health: 1000,
          takeDamage(amount) { this.health -= amount; }, applyAcidCorrosion() {} };
        boss.cancelAttack(); boss.attackCooldown = 0;
        assert.equal(boss.startTelegraphedAttack(attack, game.player.position), true);
        game.checkCollisions(0.01);
        assert.equal(game.player.health, 1000, `${spec.id} damaged during windup`);
        boss.updateTelegraphedAttack(spec.windup + 0.001);
        game.checkCollisions(0.01);
        assert.ok(game.player.health < 1000, `${spec.id} is disconnected from Game damage`);
        const health = game.player.health;
        game.enemyDamageCooldown = 0;
        game.checkCollisions(0.01);
        assert.equal(game.player.health, health, `${spec.id} paid a second impact`);
        boss.cancelAttack(); boss.aiState = 'charge';
        game.enemyDamageCooldown = 0;
        game.checkCollisions(0.01);
        assert.equal(game.player.health, health, 'a cancelled attack must not fall back to Goliath charge damage');
      }
    } finally { boss.dispose(); }
  }
});
