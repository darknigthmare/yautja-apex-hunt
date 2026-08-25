import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HUDManager } from '../src/HUDManager.js';
import {
  ARMOR_ACCENTS,
  ARMOR_PALETTES,
  DREAD_PALETTES,
  MASK_VARIANTS,
  SKIN_PALETTES,
} from '../src/data/YautjaContentCatalog.js';
import { getArmorPresetCustomization, PLAYABLE_WEAPONS } from '../src/data/RuntimeEquipment.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { HuntNPC } from '../src/entities/HuntNPC.js';

globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');

const NO_INPUT = Object.freeze({ x: 0, z: 0, isSprinting: false });
const entry = (catalog, id) => catalog.find((item) => item.id === id);

function channelColors(player, channel) {
  const colors = [];
  player.mesh.traverse((child) => {
    if (child.isMesh && child.userData.appearanceChannel === channel) {
      colors.push(child.material.color?.getHex());
    }
  });
  return colors;
}

function assertChannelColor(player, channel, expected) {
  const colors = channelColors(player, channel);
  assert.ok(colors.length > 0, `Canal d'apparence absent : ${channel}`);
  colors.forEach((color) => assert.equal(color, expected));
}

test('la forge applique cinq canaux distincts et reconstruit réellement le masque', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  const previousGeometry = player.maskMesh.geometry;
  const customization = {
    maskId: 'mask_feral_2022',
    skinColorId: 'skin_bronze',
    dreadColorId: 'dread_ivoire',
    armorColorId: 'armor_sang',
    armorAccentColorId: 'accent_cyan',
  };

  player.applyCustomization(customization);

  assert.equal(player.customization.maskId, customization.maskId);
  assert.notEqual(player.maskMesh.geometry, previousGeometry);
  assert.equal(player.maskMesh.geometry.type, 'DodecahedronGeometry');
  assert.equal(player.maskLens.material.color.getHex(), entry(MASK_VARIANTS, customization.maskId).lensColor);
  assertChannelColor(player, 'skin', entry(SKIN_PALETTES, customization.skinColorId).hex);
  assertChannelColor(player, 'dread', entry(DREAD_PALETTES, customization.dreadColorId).hex);
  assertChannelColor(player, 'armor', entry(ARMOR_PALETTES, customization.armorColorId).hex);
  assertChannelColor(player, 'accent', entry(ARMOR_ACCENTS, customization.armorAccentColorId).hex);
  assertChannelColor(player, 'mask', entry(MASK_VARIANTS, customization.maskId).armorColor);
});

test('changer de masque sous camouflage ne révèle aucun ornement et restaure la lentille', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  let cloakDisposeEvents = 0;
  player.cloakMaterial.addEventListener('dispose', () => { cloakDisposeEvents += 1; });

  player.applyCustomization({ maskId: 'mask_tracker_2010' });
  assert.equal(player.maskDetailGroup.children.length, 2);
  player.toggleCloak();
  player.applyCustomization({
    maskId: 'mask_apex_ancestral',
    skinColorId: 'skin_nuit',
    armorColorId: 'armor_royal',
  });

  assert.equal(player.isCloaked, true);
  player.mesh.traverse((child) => {
    if (child.isMesh) assert.equal(child.material, player.cloakMaterial);
  });
  assert.equal(player.maskDetailGroup.children.length, 1);
  assert.equal(cloakDisposeEvents, 0);

  player.toggleCloak();
  assert.equal(player.maskLens.material.color.getHex(), entry(MASK_VARIANTS, 'mask_apex_ancestral').lensColor);
  assertChannelColor(player, 'skin', entry(SKIN_PALETTES, 'skin_nuit').hex);
  assertChannelColor(player, 'armor', entry(ARMOR_PALETTES, 'armor_royal').hex);
});

test('un préréglage historique persiste sous forme de masque et palette modulaires', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  const result = player.setSkin('berserker_2010');
  const armor = entry(ARMOR_PALETTES, result.armorColorId);

  assert.equal(result.armorPresetId, 'berserker_2010');
  assert.equal(result.maskId, 'mask_berserker_2010');
  assert.ok(armor);
  assert.notEqual(result.armorColorId, 'armor_gunmetal');
  assertChannelColor(player, 'armor', armor.hex);
});
test('les sept classes Hunting Grounds appliquent une silhouette procédurale dédiée', () => {
  const expected = {
    gladiator_hg: 'mask_gladiator_hg',
    anubis_hg: 'mask_anubis_hg',
    exalted_hg: 'mask_exalted_hg',
    witch_hg: 'mask_witch_hg',
    oni_hg: 'mask_oni_hg',
    jotun_hg: 'mask_jotun_hg',
    father_hg: 'mask_father_hg',
  };

  for (const [presetId, maskId] of Object.entries(expected)) {
    const customization = getArmorPresetCustomization(presetId);
    const mask = entry(MASK_VARIANTS, maskId);
    assert.equal(customization.maskId, maskId, `${presetId}: mapping absent`);
    assert.ok(mask, `${presetId}: masque introuvable`);
    assert.equal(typeof mask.geometry.browWidth, 'number');
  }
});


test('les armes 9 et 0 créent leurs projectiles avec coûts et seuils exacts', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  const target = player.position.clone().add(new THREE.Vector3(0, 2, -40));

  player.selectedWeapon = 9;
  player.stamina = 14;
  player.attack(target);
  assert.equal(player.projectiles.length, 0);
  assert.equal(player.stamina, 14);

  player.stamina = 15;
  player.attack(target);
  const arrow = player.projectiles.at(-1);
  assert.equal(player.stamina, 0);
  assert.deepEqual(
    { type: arrow.type, damage: arrow.damage, speed: arrow.speed, lifetime: arrow.lifetime },
    { type: 'arrow', damage: 72, speed: 88, lifetime: 3 },
  );
  assert.ok(scene.children.includes(arrow.mesh));

  player.update(0.5, NO_INPUT, 0);
  player.selectedWeapon = 0;
  player.energy = 9;
  player.attack(target);
  assert.equal(player.projectiles.length, 1);
  assert.equal(player.energy, 9);

  player.energy = 10;
  player.attack(target);
  const bolt = player.projectiles.at(-1);
  assert.equal(player.energy, 0);
  assert.deepEqual(
    { type: bolt.type, damage: bolt.damage, speed: bolt.speed, lifetime: bolt.lifetime },
    { type: 'speargun', damage: 88, speed: 118, lifetime: 2.4 },
  );
  assert.ok(scene.children.includes(bolt.mesh));
});

test('le registre jouable expose tous ses raccourcis uniques, dont Digit0 et la fusée v1.10', () => {
  assert.equal(PLAYABLE_WEAPONS.length, 15);
  assert.equal(new Set(PLAYABLE_WEAPONS.map(({ slot }) => slot)).size, PLAYABLE_WEAPONS.length);
  assert.equal(new Set(PLAYABLE_WEAPONS.map(({ key }) => key)).size, PLAYABLE_WEAPONS.length);
  assert.equal(PLAYABLE_WEAPONS.find(({ key }) => key === 'Digit0')?.slot, 0);
  for (const key of ['Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Backslash']) {
    assert.ok(PLAYABLE_WEAPONS.some((weapon) => weapon.key === key), `raccourci v1.9 absent: ${key}`);
  }
});

test('le hangar reste déterministe, borné et figé en mouvement réduit', () => {
  const hubA = new MothershipHub(new THREE.Scene());
  const hubB = new MothershipHub(new THREE.Scene());
  const craftA = hubA.vehicleDisplays[0];
  const craftB = hubB.vehicleDisplays[0];
  const baseY = hubA.animatedProps.find(({ mesh }) => mesh === craftA).baseY;

  hubA.update(0.25);
  hubA.update(0.75);
  hubB.update(1);
  assert.ok(Math.abs(craftA.position.y - craftB.position.y) < 1e-9);
  assert.ok(Math.abs(craftA.position.y - baseY) <= 0.0800001);

  const frozen = { time: hubA.animationTime, y: craftA.position.y, rotation: craftA.rotation.y };
  hubA.update(5, true);
  assert.deepEqual(
    { time: hubA.animationTime, y: craftA.position.y, rotation: craftA.rotation.y },
    frozen,
  );
});

function fakeElement() {
  const classes = new Set();
  return {
    textContent: '',
    style: {},
    classes,
    classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } },
    setAttribute() {},
  };
}

test('le HUD du Super Predator bascule le trophée exactement sous 60 pour cent', () => {
  const hud = Object.create(HUDManager.prototype);
  hud.renderCache = new WeakMap();
  hud.updateMeter = () => {};
  hud.bossDisplayName = fakeElement();
  hud.part1Label = fakeElement();
  hud.part2Label = fakeElement();
  hud.hornStatus = fakeElement();
  hud.tailStatus = fakeElement();
  hud.targetScannedName = fakeElement();

  const boss = { health: 1800, maxHealth: 1800, maskIntact: true, trophyIntegrity: 60 };
  hud.updateBossStatus(boss, 'super_predator');
  assert.equal(hud.tailStatus.textContent, 'PRÉSERVÉE');
  assert.ok(hud.tailStatus.classes.has('part-intact'));

  boss.trophyIntegrity = 59.9;
  hud.updateBossStatus(boss, 'super_predator');
  assert.equal(hud.tailStatus.textContent, 'ENDOMMAGÉE');
  assert.ok(hud.tailStatus.classes.has('part-destroyed'));
});

test('le joueur peut neutraliser un renfort vivant après la mort du boss', () => {
  const enemy = {
    isDead: false,
    position: new THREE.Vector3(2, 0, 0),
    takeDamage(damage) { this.isDead = true; return { killed: true, damage }; },
    dispose() {},
    name: 'renfort test',
  };
  const game = Object.create(Game.prototype);
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUNT';
  game.activeBoss = { isDead: true, position: new THREE.Vector3(50, 0, 0) };
  game.activeEnemies = [enemy];
  game.player = new YautjaPlayer(new THREE.Scene());
  game.player.position.set(0, 0, 0);
  game.player.mesh.position.copy(game.player.position);
  game.player.selectedWeapon = 1;
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};

  game.performAttack();

  assert.equal(enemy.isDead, true);
  assert.equal(game.activeEnemies.length, 0);
});

test('l’interaction récolte le trophée avant un conteneur voisin', () => {
  const game = Object.create(Game.prototype);
  let eventInteractions = 0;
  game.trophyHarvested = false;
  game.attemptTrophyHarvest = () => { game.trophyHarvested = true; };
  game.eventDirector = {
    tryInteract() { eventInteractions += 1; return { type: 'cache_opened' }; },
    drainSignals() {},
  };
  game.player = {};

  assert.equal(game.attemptContextInteraction(), true);
  assert.equal(eventInteractions, 0);
});

test('les PNJ sont repoussés hors des obstacles du biome', () => {
  const game = Object.create(Game.prototype);
  const enemy = { isDead: false, colliderRadius: 1, position: new THREE.Vector3(0, 0, 0) };
  game.player = { position: new THREE.Vector3(100, 0, 100), isPerched: false };
  game.activeBoss = null;
  game.activeEnemies = [enemy];
  game.environment = { obstacleColliders: [{ x: 0, z: 0, radius: 3 }] };

  game.handlePhysicalCollisions();

  assert.equal(enemy.position.x, 4);
  assert.equal(enemy.position.z, 0);
});

test('les PNJ de mêlée atteignent le joueur malgré le pushback de collision', () => {
  for (const type of ['hunting_hound', 'xeno_drone']) {
    const enemy = new HuntNPC(type, { position: [0, 0, 3.4] });
    const player = {
      position: new THREE.Vector3(0, 0, 0),
      isPerched: false,
      isCloaked: false,
      health: 100,
      takeDamage(damage) { this.health -= damage; },
      applyAcidCorrosion() { this.corroded = true; },
      toggleCloak() { this.isCloaked = !this.isCloaked; },
    };
    const game = Object.create(Game.prototype);
    game.player = player;
    game.activeBoss = null;
    game.activeEnemies = [enemy];
    game.eventDirector = null;
    game.activeHazard = null;
    game.environment = { obstacleColliders: [] };
    game.hud = { showLogMessage() {} };
    game.spawnBloodSpatterVFX = () => {};

    for (let frame = 0; frame < 20 && player.health === 100; frame += 1) {
      game.updateEncounterContent(0.1);
      game.handlePhysicalCollisions();
    }

    assert.ok(player.health < 100, `${type}: aucune attaque de mêlée dans la boucle Game`);
    assert.ok(
      player.position.distanceTo(enemy.position) >= 1.8 + enemy.colliderRadius - 1e-9,
      `${type}: le coup ne doit pas exiger une interpénétration`,
    );
    enemy.dispose();
  }
});

test('le scan de navette révèle visuellement les cibles à portée puis se nettoie', () => {
  const scene = new THREE.Scene();
  const nearTarget = {
    isDead: false,
    colliderRadius: 2,
    position: new THREE.Vector3(20, 0, 0),
    mesh: new THREE.Group(),
  };
  const farTarget = {
    isDead: false,
    colliderRadius: 2,
    position: new THREE.Vector3(100, 0, 0),
    mesh: new THREE.Group(),
  };
  scene.add(nearTarget.mesh, farTarget.mesh);

  const game = Object.create(Game.prototype);
  game.scene = scene;
  game.vfxParticles = [];
  game.scanRevealedTargets = new Map();
  game.vehicleScanOrigin = null;
  game.player = {
    position: new THREE.Vector3(0, 0, 0),
    scanPulseTimer: 0,
    scanPulseRadius: 0,
  };
  game.activeBoss = nearTarget;
  game.activeEnemies = [farTarget];

  const revealedCount = game.activateVehicleScan({ scanDuration: 6, scanRadius: 85 });
  assert.equal(revealedCount, 1);
  assert.equal(game.player.scanPulseTimer, 6);
  assert.equal(game.player.scanPulseRadius, 85);
  assert.equal(game.scanRevealedTargets.has(nearTarget), true);
  assert.equal(game.scanRevealedTargets.has(farTarget), false);
  assert.equal(nearTarget.mesh.userData.scanRevealed, true);
  assert.equal(farTarget.mesh.userData.scanRevealed, undefined);
  assert.equal(game.vfxParticles.some(({ isScanPulse }) => isScanPulse), true);

  const marker = game.scanRevealedTargets.get(nearTarget);
  nearTarget.position.set(24, 0, 3);
  game.updateVehicleScan(1);
  assert.deepEqual(marker.position.toArray(), [24, 0, 3]);
  assert.equal(game.player.scanPulseTimer, 5);

  game.updateVehicleScan(5);
  assert.equal(game.player.scanPulseTimer, 0);
  assert.equal(game.scanRevealedTargets.size, 0);
  assert.equal(nearTarget.mesh.userData.scanRevealed, false);
  assert.equal(scene.children.includes(marker), false);

  game.updateVFX(1);
  assert.equal(game.vfxParticles.length, 0);
});

test('une défaite retire immédiatement les marqueurs et le pulse du scan', () => {
  const previousDocument = globalThis.document;
  const scene = new THREE.Scene();
  const marker = new THREE.Group();
  const target = { mesh: new THREE.Group() };
  target.mesh.userData.scanRevealed = true;
  scene.add(marker);

  const fakeModal = { textContent: '', classList: { add() {}, remove() {} } };
  globalThis.document = {
    pointerLockElement: null,
    getElementById: () => fakeModal,
  };

  try {
    const game = Object.create(Game.prototype);
    game.scene = scene;
    game.huntResultShown = false;
    game.victoryCountdown = 2;
    game.scanRevealedTargets = new Map([[target, marker]]);
    game.vehicleScanOrigin = new THREE.Vector3();
    game.player = {
      scanPulseTimer: 7,
      scanPulseRadius: 85,
      clearTransientGadgets() {},
      defeatReason: 'blessures',
      honorScore: 0,
      honorRankIndex: 0,
      ranks: ['Jeune sang'],
    };
    game.camera = { fov: 55, updateProjectionMatrix() {} };
    game.saveProgress = () => {};

    game.triggerDefeatScreen();

    assert.equal(game.scanRevealedTargets.size, 0);
    assert.equal(scene.children.includes(marker), false);
    assert.equal(game.player.scanPulseTimer, 0);
    assert.equal(target.mesh.userData.scanRevealed, false);
  } finally {
    globalThis.document = previousDocument;
  }
});
