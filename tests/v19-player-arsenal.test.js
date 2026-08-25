import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { PLAYABLE_WEAPONS, getPlayableWeaponByKey } from '../src/data/RuntimeEquipment.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { resolveMeleeStrike } from '../src/gameplay/combatRules.js';

const STILL = Object.freeze({ x: 0, z: 0, isSprinting: false });
const TARGET = new THREE.Vector3(0, 4, -40);

test('les quatre variantes v1.9 possèdent des touches et comportements de combat réels', () => {
  assert.deepEqual(
    PLAYABLE_WEAPONS.slice(10).map(({ slot, key }) => [slot, key]),
    [[10, 'Minus'], [11, 'Equal'], [12, 'BracketLeft'], [13, 'BracketRight']],
  );
  assert.equal(getPlayableWeaponByKey('Minus')?.id, 'feral_bolt_launcher');
  assert.equal(getPlayableWeaponByKey('BracketRight')?.id, 'father_sword');

  const feral = new YautjaPlayer(new THREE.Scene());
  feral.selectedWeapon = 10;
  feral.attack(TARGET);
  assert.equal(feral.energy, 91);
  assert.equal(feral.projectiles.at(-1).type, 'feral_bolt');
  assert.equal(feral.projectiles.at(-1).damage, 78);
  assert.equal(feral.projectiles.at(-1).speed, 136);

  const wolf = new YautjaPlayer(new THREE.Scene());
  wolf.selectedWeapon = 11;
  wolf.attack(TARGET);
  assert.equal(wolf.energy, 66);
  assert.equal(wolf.projectiles.length, 2);
  assert.ok(wolf.projectiles.every(({ type, damage }) => type === 'wolf_plasma' && damage === 34));

  const eye = new YautjaPlayer(new THREE.Scene());
  eye.selectedWeapon = 12;
  eye.attack(TARGET);
  assert.equal(eye.energy, 68);
  assert.equal(eye.attackTimer, 0.9);
  assert.equal(eye.projectiles.at(-1).type, 'eye_of_ra_plasma');
  assert.equal(eye.projectiles.at(-1).damage, 68);
  assert.equal(eye.projectiles.at(-1).lifetime, 2.8);

  const father = new YautjaPlayer(new THREE.Scene());
  father.selectedWeapon = 13;
  assert.equal(father.attack(TARGET), 'father_sword');
  assert.equal(father.stamina, 74);
  assert.equal(father.fatherSwordMesh.visible, true);
  const strike = resolveMeleeStrike(13, 9.5);
  assert.deepEqual(strike, { hit: true, damage: 92, honor: 34, kind: 'father_sword' });
  father.update(0.7, STILL, 0);
  assert.equal(father.fatherSwordMesh.visible, false);
});

test('le leurre Apex est un objet 3D persistant, attractif et borné par le delta', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  const decoy = player.deployApexDecoy(new THREE.Vector3(18, 0, -24));

  assert.ok(decoy?.isGroup);
  assert.equal(decoy.name, 'playerApexDecoy');
  assert.equal(decoy.userData.threatSource, 'apex_decoy');
  assert.equal(player.energy, 78);
  assert.equal(player.apexDecoyCooldown, 18);
  assert.equal(scene.children.includes(decoy), true);
  assert.equal(player.deployApexDecoy(new THREE.Vector3()), null, 'la recharge interdit un second leurre');

  player.update(4, STILL, 0);
  assert.equal(player.apexDecoy, decoy);
  assert.equal(player.apexDecoyTimer, 4);
  player.update(4, STILL, 0);
  assert.equal(player.apexDecoy, null);
  assert.equal(scene.children.includes(decoy), false);
  assert.equal(player.apexDecoyCooldown, 10);
});

test('le nettoyage de chasse retire aussi le leurre Apex de la scène', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  const decoy = player.deployApexDecoy(new THREE.Vector3(5, 0, 5));
  assert.equal(player.clearTransientGadgets(), true);
  assert.equal(player.apexDecoy, null);
  assert.equal(scene.children.includes(decoy), false);
  assert.equal(player.clearTransientGadgets(), false);
});

test('le leurre Apex s’ancre à la hauteur du terrain avec un repli isolé sûr', () => {
  const sampledScene = new THREE.Scene();
  const sampledPlayer = new YautjaPlayer(sampledScene);
  const sampled = sampledPlayer.deployApexDecoy(
    new THREE.Vector3(18, 14, -24),
    { sampleGroundHeight: ({ x, z }) => (x + z) / 4 },
  );
  assert.equal(sampled.position.y, -1.5);
  assert.equal(sampled.userData.groundAnchored, true);

  const isolatedScene = new THREE.Scene();
  const isolatedPlayer = new YautjaPlayer(isolatedScene);
  isolatedPlayer.position.y = 9;
  const isolated = isolatedPlayer.deployApexDecoy(new THREE.Vector3(4, 9, 7));
  assert.equal(isolated.position.y, 9, 'sans terrain, la hauteur fournie n’est jamais écrasée à zéro');
});

test('les statuts de combat modifient réellement le déplacement puis expirent', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  player.position.set(0, 0, 0);
  assert.equal(player.applyCombatStatus('snare', 1), true);
  assert.equal(player.applyCombatStatus('unknown', 3), false);

  player.update(0.5, { x: 1, z: 0, isSprinting: true }, 0);
  assert.equal(Number(player.position.length().toFixed(3)), 2);
  assert.equal(player.stamina, 100, 'l’entrave bloque le sprint et sa dépense');
  assert.equal(player.combatStatusTimers.snare, 0.5);

  player.update(0.6, { x: 0, z: 0, isSprinting: false }, 0);
  assert.equal(player.combatStatusTimers.snare, 0);
  assert.equal(player.getCombatMovementMultiplier(), 1);

  player.position.set(0, 0, 0);
  player.applyCombatStatus('suppression', 1);
  player.update(0.25, { x: 1, z: 0, isSprinting: true }, 0);
  assert.equal(Number(player.position.length().toFixed(3)), 2.8);

  player.position.set(0, 0, 0);
  player.clearCombatStatuses();
  player.applyCombatStatus('disorientation', 1);
  player.update(0.25, { x: 1, z: 0, isSprinting: false }, 0);
  assert.equal(Number(player.position.length().toFixed(3)), 2.2);
  assert.notEqual(Number(player.position.z.toFixed(3)), 0, 'la direction est visiblement perturbée');
});
