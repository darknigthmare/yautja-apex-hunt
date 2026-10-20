import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { disposeObject3D } from '../src/utils/materialState.js';
import { HUNTER_CLASSES } from '../src/data/RuntimeEquipment.js';
import {
  HuntLoadoutSystem,
  createDefaultHuntLoadout,
  validateHuntLoadout,
  deserializeHuntLoadoutState,
} from '../src/gameplay/HuntLoadoutSystem.js';

test('le paquetage par défaut et le repli après corruption respectent le budget des dix classes', () => {
  for (const hunterClass of HUNTER_CLASSES) {
    const loadout = createDefaultHuntLoadout(hunterClass.id);
    assert.equal(loadout.hunterClassId, hunterClass.id);
    assert.equal(validateHuntLoadout(loadout).valid, true, hunterClass.id);
    const recovered = deserializeHuntLoadoutState('{corrompu', { hunterClassId: hunterClass.id });
    assert.equal(recovered.recovered, true);
    assert.equal(recovered.state.activeLoadout.hunterClassId, hunterClass.id);
    assert.equal(validateHuntLoadout(recovered.state.activeLoadout).valid, true, hunterClass.id);
  }
});

test('le paquetage reste opérationnel si la lecture du stockage lève SecurityError', () => {
  const storage = {
    getItem() { throw new DOMException('Access denied', 'SecurityError'); },
    setItem() { throw new DOMException('Access denied', 'SecurityError'); },
  };
  const system = new HuntLoadoutSystem({ storage });
  const load = system.load();
  assert.equal(load.recovered, true);
  assert.match(load.errors[0], /Stockage local indisponible/);
  assert.equal(validateHuntLoadout(load.state.activeLoadout).valid, true);

  const change = system.setActiveLoadout(createDefaultHuntLoadout('class_elder'));
  assert.equal(change.applied, true);
  assert.equal(change.persistence.saved, false);
  assert.equal(change.persistence.reason, 'storage_error');
  assert.equal(system.load().state.activeLoadout.hunterClassId, 'class_elder');
});

test('le paquetage démarre aussi lorsque la propriété localStorage elle-même est inaccessible', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new DOMException('Access denied', 'SecurityError'); },
  });
  try {
    const system = new HuntLoadoutSystem();
    assert.equal(system.load().recovered, true);
    const result = system.setActiveLoadout(createDefaultHuntLoadout('class_elder'));
    assert.equal(result.applied, true);
    assert.equal(result.persistence.reason, 'storage_unavailable');
    assert.equal(system.isWeaponEquipped('wristblades'), true);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});

test('récupérer le disque lancé sans coût ne crée pas d’énergie gratuite', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  try {
    // Isoler le bilan de l'arme de la régénération passive du chasseur.
    player.energyRegen = 0;
    player.energy = 10;
    player.selectedWeapon = 4;
    player.mesh.position.copy(player.position);
    player.attack(player.position.clone().add(new THREE.Vector3(0, 4, -20)));
    assert.equal(player.energy, 10);
    const disc = player.projectiles[0];
    assert.equal(disc.type, 'disc');
    for (let frame = 0; frame < 104; frame++) player.update(1 / 60, { x: 0, z: 0 }, 0);
    assert.ok(disc.lifetime < 1.8, 'le disque a atteint la phase de retour');
    // Le chasseur intercepte son disque durant le retour.
    player.position.copy(disc.mesh.position).add(new THREE.Vector3(0, -2, 0));
    player.update(1 / 60, { x: 0, z: 0 }, 0);
    assert.equal(player.projectiles.length, 0);
    assert.equal(scene.children.includes(disc.mesh), false);
    assert.equal(player.energy, 10, 'une récupération ne rembourse aucun coût inexistant');
  } finally {
    player.resetForHunt();
    disposeObject3D(player.mesh);
  }
});

test('le disque revient jusqu’au chasseur immobile avant expiration sans ralentir sa vitesse de vol', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    player.mesh.position.copy(player.position);
    player.selectedWeapon = 4;
    player.attack(player.position.clone().add(new THREE.Vector3(0, 4, -20)));
    const disc = player.projectiles[0];
    let returnFrames = 0;
    for (let frame = 0; frame < 210 && player.projectiles.length; frame++) {
      player.update(1 / 60, { x: 0, z: 0 }, 0);
      if (disc.lifetime < 1.8 && player.projectiles.includes(disc)) {
        returnFrames++;
        assert.ok(Math.abs(disc.dir.length() - 1) < 1e-10);
      }
    }
    assert.ok(returnFrames > 0, 'le vol inclut réellement la phase de retour');
    assert.equal(player.projectiles.length, 0);
    assert.ok(disc.lifetime > 0, 'le disque est récupéré, pas supprimé par expiration');
    assert.ok(disc.mesh.position.distanceTo(player.position.clone().add(new THREE.Vector3(0, 3, 0))) <= 3);
  } finally {
    player.resetForHunt();
    disposeObject3D(player.mesh);
  }
});
