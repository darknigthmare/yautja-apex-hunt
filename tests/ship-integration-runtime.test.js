import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { ShipInteractionController } from '../src/gameplay/ShipInteractionController.js';
import { spawnShipDeploymentTransport } from '../src/gameplay/ShipDeploymentTransport.js';
import { SHIP_TRANSPORTS, ShipServiceRuntime } from '../src/gameplay/ShipServiceRuntime.js';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { ShipNavigation } from '../src/world/ShipNavigation.js';
import { HuntVehicle } from '../src/entities/HuntVehicle.js';
import { createMedbayInventoryState } from '../src/gameplay/YautjaMedbaySystem.js';
import { getRecommendedHuntLoadout, sanitizeHuntLoadout } from '../src/gameplay/HuntLoadoutSystem.js';
import { getVisualBounds } from '../src/utils/worldScale.js';
import { disposeObject3D } from '../src/utils/materialState.js';
import { MedbayInventoryOverlay } from '../src/ui/MedbayInventoryOverlay.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function station(id, interactionType, x) {
  return { id, label: id, zoneId: 'fixture-compartment', interactionType,
    position: new THREE.Vector3(x, 0, 0), approachPosition: new THREE.Vector3(x, 0, 3), interactionRadius: 6 };
}

function controllerFixture() {
  const stations = [station('cryo', 'cryo', 0), station('medical', 'cleaner_lab', 25), station('core', 'core', -25)];
  const calls = { consoles: [], tabs: [], medical: [], routes: [], saves: 0, notices: [] };
  const hub = Object.assign(Object.create(MothershipHub.prototype), {
    group: new THREE.Group(), disposed: false, allStations: stations,
    animatedProps: [],
    bounds: { minX: -50, maxX: 50, minZ: -50, maxZ: 50 }, colliders: [], doors: [],
    shipEquipmentDisplays: { entries: [] }, setTerminalContext(context) { calls.terminal = context; },
    setNavigationRoute(route) { calls.drawnRoute = route; },
  });
  hub.navigation = new ShipNavigation(hub.bounds, hub.colliders, { radius: 1.8 });
  hub.getNavigationRoute = function (...args) {
    calls.routes.push(args[0].clone());
    return MothershipHub.prototype.getNavigationRoute.apply(this, args);
  };
  const player = { position: new THREE.Vector3(0, 0, 3), mesh: new THREE.Group(),
    health: 20, maxHealth: 100, energy: 9, maxEnergy: 100, stamina: 15, maxStamina: 100,
    honorScore: 4321, lifetimeHonor: 5000, medbayInventory: createMedbayInventoryState(),
    requiresMedicalRecovery: false, isBleeding: false, isAcidCorroded: false,
    wristShieldIntegrity: 100, combatStatusTimers: {},
  };
  let open = false;
  const game = Object.assign(Object.create(Game.prototype), {
    hub, player, gameState: 'HUB', isGameStarted: true, isHubExploring: true,
    hud: {
      setShipInterfaceActionHandler(handler) { calls.action = handler; },
      isShipInterfaceOpen: () => open, hideShipInterfaces() { open = false; },
      showShipConsole(payload) { calls.consoles.push(payload); open = true; return true; },
      showShipNavigation() { open = true; return true; },
      showLogMessage(message) { calls.notices.push(message); },
      updateVitals() {}, updateShipHUD() {}, hideActionPrompt() {},
    },
    saveProgress() { calls.saves++; },
    resetKeyboardInput() {}, resetCameraTouchInput() {}, resetHubTouchInput() {}, syncInputDirection() {},
    setHubTouchControlsVisible() {}, requestPointerLockSafely() {},
    showMissionSelectionModal(tab) { calls.tabs.push(tab); },
    openMedbay(isMothership) { calls.medical.push(isMothership); },
  });
  game.shipInterface = new ShipInteractionController(game);
  return { game, player, hub, stations, calls, controller: game.shipInterface };
}

test('main opens a physical station without applying its service and the controller rejects remote, foreign or disabled actions', () => {
  const { game, player, stations, calls, controller } = controllerFixture();
  const before = [player.health, player.energy, player.stamina, player.honorScore];
  assert.equal(game.attemptHubInteraction(), stations[0]);
  assert.deepEqual([player.health, player.energy, player.stamina, player.honorScore], before);
  assert.equal(calls.saves, 0); assert.equal(calls.consoles.length, 1);
  assert.equal(game.attemptHubInteraction(), false, 'E must not retrigger an already open console');
  assert.equal(controller.handleAction({ type: 'service', stationId: 'cryo', serviceId: 'recharge' }), false);
  assert.equal(controller.handleAction({ type: 'service', stationId: 'medical', serviceId: 'medical' }), false);
  player.position.set(40, 0, 40);
  assert.equal(controller.handleAction({ type: 'service', stationId: 'cryo', serviceId: 'restore_vitals' }), false);
  assert.equal(player.health, 20);
  player.position.copy(stations[0].approachPosition);
  assert.equal(controller.handleAction({ type: 'service', stationId: 'cryo', serviceId: 'restore_vitals' }), true);
  assert.deepEqual([player.health, player.stamina, player.energy], [100, 100, 9]);
  assert.equal(calls.saves, 1);
  assert.equal(controller.handleAction({ type: 'service', stationId: 'cryo', serviceId: 'restore_vitals' }), false);
  assert.equal(calls.saves, 1, 'a disabled repeated service must not create another transaction');
  game.gameState = 'HUNT';
  assert.equal(controller.handleAction({ type: 'service', stationId: 'cryo', serviceId: 'restore_vitals' }), false);
});

test('inspection uses a nearby attached surface and rechecks distance and occlusion before accepting an action', () => {
  const { game, player, hub, calls, controller } = controllerFixture();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
  mesh.position.set(40, 4.8, 45); hub.group.add(mesh);
  const entry = { id: 'fixture-wristblades', itemId: 'wristblades', label: 'Lames exposées', zone: 'armory',
    inspectionType: 'equipment', source: 'Predator (1987)', modelStatus: 'runtime_weapon_geometry', object: mesh };
  hub.shipEquipmentDisplays.entries.push(entry);
  player.position.set(40, 0, 40);
  try {
    assert.equal(game.attemptHubInteraction(), entry);
    assert.equal(calls.consoles.at(-1).station.interactionType, 'equipment_inspection');
    assert.equal(calls.consoles.at(-1).station.inspection.itemId, 'wristblades');
    assert.equal(player.honorScore, 4321); assert.equal(calls.saves, 0);
    player.position.set(-40, 0, -40);
    assert.equal(controller.handleAction({ type: 'service', stationId: entry.id, serviceId: 'loadout' }), false);
    player.position.set(40, 0, 40);
    hub.resolveCameraObstruction = (origin, end) => origin.clone().lerp(end, 0.5);
    assert.equal(controller.handleAction({ type: 'service', stationId: entry.id, serviceId: 'loadout' }), false,
      'a previously opened exhibit must not remain usable through a new obstruction');
    hub.resolveCameraObstruction = () => null;
    assert.equal(controller.handleAction({ type: 'service', stationId: entry.id, serviceId: 'loadout' }), true);
    assert.deepEqual(calls.tabs, ['loadout']); assert.equal(player.honorScore, 4321);
    mesh.visible = false;
    assert.equal(controller.openExhibit({ entry, point: new THREE.Vector3() }), false);
  } finally { disposeObject3D(mesh); }
});

test('a chosen real route is reused while stationary and recalculated only after the movement and time thresholds', () => {
  const { player, calls, controller, game } = controllerFixture();
  assert.equal(controller.setWaypoint('medical'), true);
  assert.equal(calls.routes.length, 1); assert.equal(calls.drawnRoute.stationId, 'medical');
  controller.update(10);
  assert.equal(calls.routes.length, 1, 'standing still for ten seconds must not rerun pathfinding');
  player.position.x += 3;
  controller.update(0.5); assert.equal(calls.routes.length, 1);
  controller.update(0.5); assert.equal(calls.routes.length, 2);
  assert.ok(calls.drawnRoute.points[0].distanceTo(player.position) < 1e-6);
  for (let frame = 0; frame < 180; frame++) {
    player.position.x += 0.001; controller.update(1 / 60);
  }
  assert.equal(calls.routes.length, 2, 'small frame-by-frame motion must not turn navigation into a per-frame query');
  assert.equal(controller.setWaypoint('nonexistent-station'), false);
  assert.equal(controller.waypointId, 'medical');
  game.gameState = 'HUNT'; player.position.x += 5; controller.update(5);
  assert.equal(calls.routes.length, 2);
  game.gameState = 'HUB';
  assert.equal(controller.setWaypoint(null), true); assert.equal(calls.drawnRoute, null);
});

test('medical emergency blocks deployment before committing, preserves the prepared contract and can be discharged only by its real station', () => {
  const { game, player, stations, controller, calls } = controllerFixture();
  const pending = { huntType: 'xeno_queen', planetType: 'hive_lv426', directiveId: 'standard_hunt', simulationContext: null };
  game.pendingHunt = pending; player.requiresMedicalRecovery = true;
  game.enterHubExploration = () => { game.isHubExploring = true; return true; };
  game.commitHuntLoadout = () => { throw new Error('an emergency must not commit a departure'); };
  assert.equal(game.deployPreparedHunt(), false);
  assert.equal(game.pendingHunt, pending); assert.equal(controller.waypointId, 'medical');
  assert.equal(game.startHunt('goliath', 'jungle'), false, 'direct start must also respect emergency recovery');
  player.position.copy(stations[1].approachPosition);
  controller.close(); assert.equal(controller.openStation(stations[1]), true);
  assert.equal(player.requiresMedicalRecovery, true, 'opening the medical console alone must not treat an emergency');
  assert.equal(controller.handleAction({ type: 'service', stationId: 'medical', serviceId: 'medical' }), true);
  assert.equal(player.requiresMedicalRecovery, false); assert.deepEqual(calls.medical, [true]);
  assert.equal(game.pendingHunt, pending);
  game.draftHuntLoadout = getRecommendedHuntLoadout({ huntType: 'xeno_queen', biomeId: 'hive_lv426' }).loadout;
  game.getLoadoutValidationOptions = () => ({});
  game.commitHuntLoadout = () => ({ applied: true });
  const launches = [];
  game.startHunt = (...args) => { launches.push(args); return false; };
  assert.equal(game.deployPreparedHunt(), false); assert.equal(game.pendingHunt, pending);
  game.startHunt = (...args) => { launches.push(args); return true; };
  assert.equal(game.deployPreparedHunt(), true);
  assert.equal(game.pendingHunt, null);
  assert.deepEqual(launches.at(-1), ['xeno_queen', 'hive_lv426', 'standard_hunt', null]);
});

test('the Medicomp slot opens its common kit without a living target and rejects a missing kit or disabled player', () => {
  const { game, player, calls } = controllerFixture();
  game.gameState = 'HUNT'; game.isPaused = false; game.activeBoss = null; game.activeEnemies = [];
  player.selectedWeapon = 6;
  game.activeHuntLoadout = sanitizeHuntLoadout({ slots: { support: 'medicomp' } });
  game.resolveCombatTarget = () => { throw new Error('opening a medical kit must not resolve a combat target'); };
  game.performAttack(); assert.deepEqual(calls.medical, [false]);
  assert.equal(player.health, 20); assert.equal(player.energy, 9);
  game.activeHuntLoadout = sanitizeHuntLoadout({ slots: { support: null } });
  game.performAttack(); assert.deepEqual(calls.medical, [false]);
  assert.match(calls.notices.at(-1), /NON EMBARQUÉ/);
  game.activeHuntLoadout = sanitizeHuntLoadout({ slots: { support: 'medicomp' } });
  player.health = 0; game.performAttack(); assert.deepEqual(calls.medical, [false]);
  player.health = 20; game.isPaused = true; game.performAttack(); assert.deepEqual(calls.medical, [false]);
});

test('main medical opening grants laboratory supplies only nearby, saves real component actions and restores controls on close', () => {
  const { game, player, stations, calls } = controllerFixture();
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const controls = [];
  let focused = 0, pointerRequests = 0;
  // Only the DOM boundary is substituted; Game.openMedbay and the complete
  // overlay open/action/close lifecycle run without replacing their methods.
  const element = () => ({ classList: { add() {}, remove() {}, contains: () => false },
    setAttribute() {}, getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [] });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    pointerLockElement: null, activeElement: null, body: { appendChild() {} }, createElement: element,
    querySelectorAll: () => [],
  } });
  game.setHubTouchControlsVisible = visible => controls.push(['hub', visible]);
  game.setHuntTouchControlsVisible = visible => controls.push(['hunt', visible]);
  game.resetHuntTouchInput = () => {};
  game.container = { focus: () => focused++ };
  game.requestPointerLockSafely = () => pointerRequests++;
  game.activeHuntLoadout = sanitizeHuntLoadout({ slots: { support: 'medicomp' } });
  delete game.openMedbay;
  player.medbayInventory.charges.dermal_stapler = 1;
  try {
    game.openMedbay(true);
    assert.equal(game.medbayOverlay.inventoryState.isMothership, false, 'being anywhere in the hub is insufficient for free laboratory supplies');
    assert.equal(player.health, 20); assert.equal(calls.saves, 0);
    game.medbayOverlay.close();
    assert.deepEqual(controls.slice(-2), [['hub', true], ['hunt', false]]);
    assert.equal(focused, 1); assert.equal(pointerRequests, 1);
    player.position.copy(stations[1].approachPosition);
    game.openMedbay(true);
    assert.equal(game.medbayOverlay.inventoryState.isMothership, true);
    const clinical = game.medbayOverlay.executeItemAction('coagulant_blue_paste');
    assert.equal(clinical.success, true); assert.equal(player.health, 75);
    assert.equal(player.medbayInventory.charges.coagulant_blue_paste, 2);
    assert.equal(calls.saves, 1);
    game.medbayOverlay.close();
    game.gameState = 'HUNT'; game.isPaused = false;
    game.openMedbay(true);
    assert.equal(game.medbayOverlay.inventoryState.isMothership, false, 'a caller flag cannot carry unlimited clinic treatment into a hunt');
    assert.equal(game.medbayOverlay.executeItemAction('dermal_stapler').success, true);
    assert.equal(player.medbayInventory.charges.dermal_stapler, 0); assert.equal(player.health, 100);
    assert.equal(calls.saves, 2);
    assert.equal(game.medbayOverlay.executeItemAction('dermal_stapler').success, false);
    assert.equal(calls.saves, 2);
    game.medbayOverlay.close();
    assert.deepEqual(controls.slice(-2), [['hub', false], ['hunt', true]]);
  } finally {
    game.medbayOverlay?.destroy();
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else delete globalThis.document;
  }
});

test('reopening one medical window synchronises field/lab/refill permissions and a retained hidden handler cannot refill in the field', () => {
  const { player } = controllerFixture();
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const nodes = new Map();
  let mounts = 0, persistedActions = 0;
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { hidden: false, disabled: false, textContent: '', listeners: new Map(),
      addEventListener(type, handler) { this.listeners.set(type, handler); } });
    return nodes.get(id);
  };
  let element;
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    activeElement: null, body: { appendChild() { mounts++; } },
    createElement() {
      element = { innerHTML: '', classList: { add() {}, remove() {} }, setAttribute() {},
        querySelector(selector) {
          const id = selector.slice(1);
          return ['medbay-btn-refill', 'medbay-location-tag'].includes(id) && this.innerHTML.includes(`id="${id}"`) ? node(id) : null;
        }, querySelectorAll: () => [] };
      return element;
    },
  } });
  const field = player.medbayInventory;
  field.charges.dermal_stapler = 0;
  const overlay = new MedbayInventoryOverlay({ player, inventoryState: field, onAction: () => persistedActions++ });
  try {
    overlay.open(player, { ...field, isMothership: false });
    const container = overlay.container;
    const refill = nodes.get('medbay-btn-refill'), mode = nodes.get('medbay-location-tag');
    assert.ok(refill, 'the permanently mounted button must exist before entering the lab');
    assert.equal(refill.hidden, true); assert.equal(refill.disabled, true); assert.match(mode.textContent, /TERRAIN/);
    const retainedClick = refill.listeners.get('click');
    retainedClick(); assert.equal(field.charges.dermal_stapler, 0); assert.equal(persistedActions, 0);
    overlay.close(); overlay.open(player, { ...field, isMothership: true });
    assert.equal(overlay.container, container); assert.equal(mounts, 1);
    assert.equal(refill.hidden, false); assert.equal(refill.disabled, false); assert.match(mode.textContent, /CROISEUR/);
    retainedClick();
    assert.equal(field.charges.dermal_stapler, 3); assert.equal(field.isMothership, false);
    assert.equal(persistedActions, 1, 'a successful replenishment must invoke the save callback');
    field.charges.dermal_stapler = 0;
    overlay.close(); overlay.open(player, { ...field, isMothership: false });
    assert.equal(overlay.container, container); assert.equal(mounts, 1);
    assert.equal(refill.hidden, true); assert.equal(refill.disabled, true); assert.match(mode.textContent, /TERRAIN/);
    retainedClick();
    assert.equal(field.charges.dermal_stapler, 0, 'DOM visibility alone must not be the resource permission check');
    assert.equal(persistedActions, 1);
  } finally {
    overlay.destroy();
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else delete globalThis.document;
  }
});

test('the three selectable original transports have different real geometry including a standing-height capsule', () => {
  const scene = new THREE.Group(), models = [];
  try {
    for (const profile of Object.values(SHIP_TRANSPORTS)) {
      const vehicle = new HuntVehicle(scene, { type: profile.vehicleType, reducedMotion: true });
      models.push(vehicle);
    }
    const sizes = models.map(vehicle => getVisualBounds(vehicle.mesh, { local: true }).getSize(new THREE.Vector3()));
    const signatures = models.map((vehicle, index) => JSON.stringify([vehicle.mesh.children.length,
      ...sizes[index].toArray().map(value => Number(value.toFixed(3)))]));
    assert.equal(new Set(signatures).size, 3, 'transport selection must change the visible model, not only its label');
    const shuttle = models.find(vehicle => vehicle.type === 'hunter_shuttle');
    assert.ok(shuttle.mesh.getObjectByName('transport-cargo-pods')?.isInstancedMesh);
    const capsule = sizes[models.findIndex(vehicle => vehicle.type === 'hunt_drop_pod')];
    assert.ok(capsule.y >= 7.21); assert.ok(capsule.y > capsule.x && capsule.y > capsule.z);
  } finally { models.forEach(vehicle => vehicle.dispose()); }
  assert.equal(scene.children.length, 0);
});

test('selected departure transport uses the safe insertion point, stays unrewarding and respects vehicle saturation', () => {
  const { game, player, controller } = controllerFixture();
  controller.services.selectTransport('pod', { gameState: 'HUB' });
  player.position.set(10, 2, 30); player.scanPulseTimer = 0; player.scanPulseRadius = 0;
  const director = { root: new THREE.Group(), vehicles: [], vehicleSpawnCount: 0, maxVehicles: 1,
    getNearbyColliderTop: () => 34 };
  game.eventDirector = director; game.settings = { reducedMotion: true };
  const requests = [];
  game.environment = { getSafeSpawnPosition(point, options) { requests.push({ point: point.clone(), options }); return new THREE.Vector3(15, 4, 17); } };
  const resources = () => JSON.stringify([player.health, player.energy, player.stamina, player.honorScore,
    player.lifetimeHonor, player.medbayInventory, player.scanPulseTimer, player.scanPulseRadius]);
  const before = resources();
  const transport = spawnShipDeploymentTransport(game);
  assert.equal(transport.type, 'hunt_drop_pod'); assert.equal(transport.state, 'leaving');
  assert.deepEqual(requests[0].point.toArray(), [10, 2, -6]); assert.equal(requests[0].options.clearance, 14);
  assert.deepEqual(transport.hoverPoint.toArray(), [15, 42, 17]);
  assert.equal(director.vehicles[0], transport); assert.equal(director.vehicleSpawnCount, 1);
  assert.equal(transport.mesh.userData.interactable, false);
  player.position.copy(transport.mesh.position);
  assert.equal(transport.interact(player), false, 'departure must not give the resupply/scan interaction of a field flyby');
  assert.equal(resources(), before);
  assert.equal(spawnShipDeploymentTransport(game), null);
  assert.equal(director.root.children.length, 1); assert.equal(director.vehicles.length, 1);
  transport.update(transport.durations.leaving + 0.1);
  assert.equal(transport.state, 'disposed'); assert.equal(director.root.children.length, 0);
  assert.equal(resources(), before);
});
