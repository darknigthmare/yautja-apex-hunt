import test from 'node:test';
import assert from 'node:assert/strict';
import { getShipPlayerReadout, getShipConsoleModel, getShipStationServices, getShipInspectionModel, formatShipInspectionSource } from '../src/ui/ShipConsoleView.js';
import { getShipNavigationModel, renderShipNavigationPlan } from '../src/ui/ShipNavigationView.js';
import { ShipServiceRuntime, SHIP_TRANSPORTS } from '../src/gameplay/ShipServiceRuntime.js';
import { HUDManager } from '../src/HUDManager.js';

test('the console reads ten live player fields and preserves unknown telemetry', () => {
  assert.equal(getShipPlayerReadout().length, 10);
  assert.ok(getShipPlayerReadout().every(item => item.value === '—'));
  const player = { health: 55, maxHealth: 100, energy: 33, maxEnergy: 120, stamina: 67, maxStamina: 110,
    honorScore: 1234, lifetimeHonor: 3456, ranks: ['Chasseur', 'Ancien'], honorRankIndex: 1,
    completedHunts: ['goliath', 'goliath'], completedDirectiveIds: ['standard_hunt'], discoveredPoiIds: [],
    customization: { hunterClassId: 'class_cleaner' } };
  let rows = new Map(getShipPlayerReadout(player).map(item => [item.id, item.value]));
  assert.equal(rows.get('health'), '55 / 100');
  assert.equal(rows.get('energy'), '33 / 120');
  assert.equal(rows.get('rank'), 'Ancien');
  assert.equal(rows.get('hunts'), '1');
  assert.equal(rows.get('discoveries'), '0');
  assert.match(rows.get('class'), /Cleaner/);
  player.energy = 120; player.completedHunts.push('xeno_queen');
  rows = new Map(getShipPlayerReadout(player).map(item => [item.id, item.value]));
  assert.equal(rows.get('energy'), '120 / 120');
  assert.equal(rows.get('hunts'), '2');
});

test('station services expose only actions implemented for that physical station', () => {
  assert.deepEqual(getShipStationServices({ interactionType: 'forge' }).map(item => item.id), ['armory', 'crafting', 'loadout']);
  assert.deepEqual(getShipStationServices({ interactionType: 'mission_contract', label: 'Rhynth' }).map(item => item.id), ['prepare_hunt']);
  assert.deepEqual(getShipStationServices({ interactionType: 'unknown' }), []);
  const restored = { health: 100, maxHealth: 100, stamina: 100, maxStamina: 100, energy: 120, maxEnergy: 120 };
  assert.equal(getShipStationServices({ interactionType: 'cryo' }, restored)[0].disabled, true);
  assert.equal(getShipStationServices({ interactionType: 'core' }, restored)[0].disabled, true);
  restored.health = 50; restored.energy = 15;
  assert.equal(getShipStationServices({ interactionType: 'cryo' }, restored)[0].disabled, false);
  assert.equal(getShipStationServices({ interactionType: 'core' }, restored)[0].disabled, false);
  assert.equal(restored.health, 50, 'opening a station must not heal automatically');
  assert.equal(restored.energy, 15, 'opening a station must not recharge automatically');
});

test('station records report the real compartment, both medical alerts and accomplished contracts', () => {
  const station = { id: 'medic', zoneId: 'medbay', interactionType: 'cleaner_lab', position: { x: 10, z: 20 } };
  const hub = { getZones: () => [{ id: 'medbay', label: 'Laboratoire Cleaner' }] };
  const unknown = getShipConsoleModel({ hub, station });
  assert.equal(unknown.medicalStatus, 'Télémétrie médicale indisponible');
  const model = getShipConsoleModel({ hub, station, player: { isBleeding: true, isAcidCorroded: true, completedHunts: ['goliath', 'goliath', 'unverified_fixture'] } });
  assert.equal(model.zone.label, 'Laboratoire Cleaner');
  assert.match(model.medicalStatus, /Corrosion/); assert.match(model.medicalStatus, /Hémorragie/);
  assert.equal(model.trophies.length, 1);
  assert.match(model.trophies[0], /Goliath/);
});

function navigationFixture() {
  const station = { id: 'forge', label: 'Forge', zoneId: 'workshop', position: { x: 20, y: 0, z: 10 } };
  const position = { x: 0, y: 0, z: 0 };
  const calls = [];
  const hub = { getStations: () => [station], getZones: () => [{ id: 'workshop', label: 'Atelier de forge', bounds: { minX: 10, maxX: 30, minZ: 0, maxZ: 20 } }],
    getZoneAt: () => ({ id: 'corridor', label: 'Coursive centrale' }), getBounds: () => ({ minX: -40, maxX: 40, minZ: -80, maxZ: 80 }), getDoors: () => [],
    getNavigationRoute(from, stationId, options) { calls.push({ from, stationId, options }); return { status: 'ready', stationId,
      points: [from, { x: 0, y: 0, z: 10 }, station.position], distanceUnits: 30, distanceMeters: 10, doorIds: ['workshop-door'] }; } };
  return { hub, player: { position }, station, calls };
}

test('the navigation computes one chosen route, displays metres once and draws the actual detour', () => {
  const fixture = navigationFixture();
  const unselected = getShipNavigationModel(fixture);
  assert.equal(fixture.calls.length, 0); assert.equal(unselected.routeReady, false);
  const model = getShipNavigationModel({ ...fixture, selectedStationId: 'forge' });
  assert.equal(fixture.calls.length, 1);
  assert.deepEqual(fixture.calls[0], { from: fixture.player.position, stationId: 'forge', options: { radius: 1.8 } });
  assert.equal(model.distance, '10.0 m');
  const plan = renderShipNavigationPlan(model);
  assert.match(plan, /points="0.00,0.00 0.00,10.00 20.00,10.00"/);
  assert.match(plan, /viewBox="-45 -85 90 170"/);
  assert.match(plan, /Atelier de/);
});

test('unreachable and stale routes never become straight-line navigation or a valid waypoint', () => {
  const fixture = navigationFixture();
  fixture.hub.getNavigationRoute = () => ({ status: 'unreachable', stationId: 'forge', distanceUnits: 5, points: [fixture.player.position, fixture.station.position] });
  let model = getShipNavigationModel({ ...fixture, selectedStationId: 'forge' });
  assert.equal(model.routeReady, false); assert.equal(model.distance, 'Trajet indisponible');
  assert.doesNotMatch(renderShipNavigationPlan(model), /<polyline/);
  fixture.hub.getNavigationRoute = () => ({ status: 'ready', stationId: 'another', distanceUnits: 30, points: [] });
  model = getShipNavigationModel({ ...fixture, selectedStationId: 'forge' });
  assert.equal(model.routeReady, false);
  assert.match(renderShipNavigationPlan({ ...model, bounds: null }), /indisponible/);
});

test('the core remains usable with full energy when a shield or auxiliary system still needs maintenance', () => {
  const station = { interactionType: 'core' };
  for (const repair of [{ wristShieldIntegrity: 20 }, { wristShieldCooldown: 7 }, { scoutDroneCooldown: 3 },
    { shurikenCooldown: 5 }, { apexDecoyCooldown: 2 }, { waterDisruptionTimer: 4 }]) {
    const player = { maxEnergy: 100, energy: 100, wristShieldIntegrity: 100, ...repair };
    const runtime = new ShipServiceRuntime(player);
    assert.equal(getShipStationServices(station, player)[0].disabled, false);
    assert.equal(runtime.perform('recharge', { gameState: 'HUB', station }).success, true);
    assert.equal(getShipStationServices(station, player)[0].disabled, true);
    assert.equal(player.energy, 100);
    assert.equal(player.wristShieldIntegrity, 100);
  }
});

test('hangar and pod controls reflect all three real transport choices without inventing a selection', () => {
  const station = { interactionType: 'hangar' };
  assert.ok(getShipStationServices(station).filter(item => item.id.startsWith('select_transport_')).every(item => !item.selected));
  const player = {};
  const runtime = new ShipServiceRuntime(player);
  for (const kind of Object.keys(SHIP_TRANSPORTS)) {
    assert.equal(runtime.selectTransport(kind, { gameState: 'HUB' }).success, true);
    for (const type of ['hangar', 'escape_pods']) {
      const transportServices = getShipStationServices({ interactionType: type }, player).filter(item => item.id.startsWith('select_transport_'));
      assert.equal(transportServices.length, 3);
      assert.deepEqual(transportServices.filter(item => item.selected).map(item => item.id), [`select_transport_${kind}`]);
      assert.ok(transportServices.every(item => item.sourceLabel === 'TRANSPORT ORIGINAL DU JEU'));
    }
  }
  assert.ok(!getShipStationServices({ interactionType: 'airlock' }, player).some(item => item.id.startsWith('select_transport_')));
});

test('medical recovery remains explicit after cryostase and disappears from both views only after real medical service', () => {
  const medical = { id: 'cleaner-lab-control', interactionType: 'cleaner_lab' };
  const hub = { getStations: () => [medical], getZones: () => [], getDoors: () => [] };
  const player = { maxHealth: 100, health: 100, maxStamina: 100, stamina: 100,
    requiresMedicalRecovery: true, isBleeding: false, isAcidCorroded: false };
  const runtime = new ShipServiceRuntime(player);
  let consoleModel = getShipConsoleModel({ hub, player, station: medical });
  let navigationModel = getShipNavigationModel({ hub, player });
  assert.equal(consoleModel.recovery.required, true);
  assert.equal(navigationModel.recovery.stationId, 'cleaner-lab-control');
  assert.match(consoleModel.recovery.message, /Départ suspendu/);
  runtime.perform('restore_vitals', { gameState: 'HUB', station: { interactionType: 'cryo' } });
  assert.equal(getShipConsoleModel({ hub, player, station: medical }).recovery.required, true);
  assert.equal(runtime.perform('medical', { gameState: 'HUB', station: medical }).success, true);
  consoleModel = getShipConsoleModel({ hub, player, station: medical });
  navigationModel = getShipNavigationModel({ hub, player });
  assert.equal(consoleModel.recovery.required, false);
  assert.equal(navigationModel.recovery.required, false);
});

test('cruiser HUD mode ends for a hunt and compartment labels use the live zone in both readouts', () => {
  const classes = new Set();
  const hud = Object.create(HUDManager.prototype);
  hud.renderCache = new WeakMap();
  hud.hudContainer = { classList: { toggle(name, active) { if (active) classes.add(name); else classes.delete(name); } } };
  hud.shipZoneLabel = {}; hud.targetScannedName = {};
  hud.showHubTarget();
  assert.equal(classes.has('ship-hub-mode'), true);
  hud.updateHubZoneInfo({ label: 'Laboratoire Cleaner' });
  assert.equal(hud.shipZoneLabel.textContent, 'Laboratoire Cleaner');
  assert.match(hud.targetScannedName.textContent, /LABORATOIRE CLEANER/);
  hud.setTargetType('rhynth_titan');
  assert.equal(classes.has('ship-hub-mode'), false);
  hud.showHubTarget();
  hud.updateBossStatus({ health: 100, maxHealth: 100 }, 'goliath');
  assert.equal(classes.has('ship-hub-mode'), false);
});

test('inspection references keep own textual metadata without invoking getters or inherited properties', () => {
  assert.equal(formatShipInspectionSource('Predator (1987)'), 'Predator (1987)');
  const metadata = Object.create({ title: 'Inherited false reference' });
  metadata.reference = 'Predator 2'; metadata.year = 1990;
  Object.defineProperty(metadata, 'label', { get() { throw new Error('A reference getter must not execute'); } });
  assert.equal(formatShipInspectionSource(metadata), 'Predator 2 · 1990');
  assert.equal(formatShipInspectionSource({ unknown: 'Not a declared reference field' }), 'Référence non renseignée');
  const station = { interactionType: 'equipment_inspection', label: 'Lames exposées', inspection: {
    itemId: 'wristblades', label: 'Lames de poignet', source: metadata, modelStatus: 'runtime_weapon_geometry' } };
  const inspection = getShipInspectionModel(station);
  assert.equal(inspection.source, 'Predator 2 · 1990');
  assert.match(inspection.scope, /non vérifiée/);
  assert.deepEqual(getShipStationServices(station).map(item => item.id), ['loadout', 'armory']);
});

test('trophy studies distinguish acquired from unacquired and only known hunt IDs can prepare a contract', () => {
  const station = { interactionType: 'trophy_inspection', label: 'Étude', huntId: 'goliath', inspection: {
    itemId: 'goliath', label: 'Étude crânienne', source: 'Création originale', modelStatus: 'procedural_trophy_interpretation', unlocked: false } };
  assert.match(getShipInspectionModel(station).artifact, /trophée non acquis/);
  assert.deepEqual(getShipStationServices(station).map(item => item.id), ['prepare_hunt', 'codex']);
  station.inspection.unlocked = true;
  assert.match(getShipInspectionModel(station).artifact, /^Trophée acquis/);
  const unknown = { interactionType: 'contract_inspection', label: 'Archive', huntId: '__proto__', inspection: { itemId: 'toString' } };
  assert.deepEqual(getShipStationServices(unknown).map(item => item.id), ['codex']);
  assert.equal(getShipInspectionModel(unknown).huntId, null);
});
