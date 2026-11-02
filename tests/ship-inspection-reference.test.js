import assert from 'node:assert/strict';
import test from 'node:test';
import { getShipInspectionModel, getShipInspectionReference, getShipStationServices } from '../src/ui/ShipConsoleView.js';
import { ShipInteractionController } from '../src/gameplay/ShipInteractionController.js';

test('physical equipment inspection names its documentary works and keeps renderer bindings out of the visible source', () => {
  const controller = Object.create(ShipInteractionController.prototype);
  const entry = { itemId: 'combi_stick', label: 'Combi-stick', source: 'YautjaPlayer.fireCombiStick',
    sources: ['predator2'], modelStatus: 'runtime_weapon_geometry' };
  const metadata = controller.inspectionMetadata(entry);
  assert.equal(metadata.source, 'Predator 2 (1990)');
  assert.equal(metadata.implementationSource, 'YautjaPlayer.fireCombiStick');
  assert.deepEqual(metadata.sources, ['predator2']);
  const model = getShipInspectionModel({ interactionType: 'equipment_inspection', inspection: metadata });
  assert.equal(model.source, 'Predator 2 (1990)');
  assert.doesNotMatch(model.source, /YautjaPlayer|fireCombiStick/);
  assert.match(model.scope, /non vérifiée/);
  const wrapped = controller.inspectionMetadata({ itemId: entry.itemId, metadata: entry });
  assert.equal(wrapped.source, metadata.source);
});

test('a physical contract console with metadata shows its source without changing mandatory preparation', () => {
  const controller = Object.create(ShipInteractionController.prototype);
  const metadata = controller.inspectionMetadata({ itemId: 'rhynth_titan', label: 'Rhynth', source: 'Épreuve originale de Ryushi',
    sources: [], modelStatus: 'procedural_trophy_interpretation' });
  const station = { interactionType: 'mission_contract', huntId: 'rhynth_titan', label: 'Rhynth', inspection: metadata };
  const model = getShipInspectionModel(station);
  assert.match(model.source, /Aliens vs\. Predator: Prey/);
  assert.equal(model.artifact, 'Projection du contrat de chasse');
  assert.deepEqual(getShipStationServices(station).map(service => service.id), ['prepare_hunt']);
  assert.equal(getShipInspectionModel({ ...station, inspection: undefined }), null);
});

test('opening the actual contract-projection registry injects documentary Wolf metadata into the physical console', () => {
  const controller = Object.create(ShipInteractionController.prototype);
  const station = { id: 'contract-console-wolf_cleaner', huntId: 'wolf_cleaner', label: 'Wolf', interactionType: 'mission_contract' };
  let shown;
  controller.game = { gameState: 'HUB', isHubExploring: true, player: { position: {} },
    hub: { getNearbyStation: () => station, shipEquipmentDisplays: { entries: [
      { itemId: 'wolf_cleaner', inspectionType: 'contract_projection', label: 'Wolf', source: 'Épreuve originale de Gunnison',
        sources: [], modelStatus: 'procedural_trophy_interpretation' },
    ] } }, hud: { showShipConsole(context) { shown = context; return true; } } };
  controller.releaseInput = () => {};
  controller.syncTerminal = () => {};
  assert.equal(controller.openStation(station), true);
  const model = getShipInspectionModel(shown.station);
  assert.match(model.source, /Aliens vs\. Predator: Requiem \(2007\)/);
  assert.match(model.scope, /non vérifiée/);
  assert.equal(model.artifact, 'Projection du contrat de chasse');
  assert.deepEqual(getShipStationServices(shown.station).map(service => service.id), ['prepare_hunt']);
});

test('missing or hostile references do not become official sources or expose a renderer method', () => {
  assert.equal(getShipInspectionReference({ itemId: 'unknown', source: 'MothershipHub.createWeaponRack',
    sources: ['__proto__', 'constructor', 'not-a-source'] }), 'Référence documentaire non renseignée');
  const metadata = { source: { title: 'Étude originale' }, sources: [] };
  Object.defineProperty(metadata, 'secret', { get() { assert.fail('must not inspect undeclared metadata'); } });
  Object.defineProperty(metadata.sources, '0', { get() { assert.fail('must not execute source getters'); }, configurable: true });
  assert.equal(getShipInspectionReference(metadata), 'Étude originale');
});

test('a projected contract remains inspectable through its physical exhibit', () => {
  const controller = Object.create(ShipInteractionController.prototype);
  const hit = { entry: { id: 'projection-wolf', itemId: 'wolf_cleaner', label: 'Wolf',
    inspectionType: 'contract_projection', sources: [] }, point: { clone: () => ({}) } };
  let shown;
  controller.game = { player: {}, hub: {}, hud: { showShipConsole(context) { shown = context; return true; } } };
  controller.getNearbyExhibit = () => hit;
  controller.releaseInput = () => {};
  controller.syncTerminal = () => {};
  assert.equal(controller.openExhibit(hit), true);
  assert.equal(shown.station.interactionType, 'contract_inspection');
  assert.match(getShipInspectionModel(shown.station).source, /Requiem \(2007\)/);
});

test('stationary ship telemetry refreshes once per elapsed second without per-frame redraw', () => {
  const controller = Object.create(ShipInteractionController.prototype);
  controller.game = { gameState: 'HUB', isHubExploring: true, hub: {}, player: {}, hud: {} };
  Object.assign(controller, { routeElapsed: 0, displayElapsed: 0, terminalElapsed: 0, waypointId: null });
  let syncs = 0;
  controller.syncTerminal = () => { syncs += 1; };
  controller.update(0.4); controller.update(0.4);
  assert.equal(syncs, 0);
  controller.update(0.2);
  assert.equal(syncs, 1);
  controller.update(0.01);
  assert.equal(syncs, 1);
  controller.update(1);
  assert.equal(syncs, 2);
});

test('trophy inspection forwards its live owned flag without executing metadata or registry getters', () => {
  const controller = Object.create(ShipInteractionController.prototype);
  const object = { userData: { unlocked: true } };
  const entry = { itemId: 'wolf_cleaner', label: 'Étude de Wolf', source: 'AVP: Requiem', sources: [], object,
    modelStatus: 'procedural_trophy_interpretation' };
  Object.defineProperty(entry, 'unlocked', { get() { assert.fail('registry getters must not be executed'); } });
  const model = () => getShipInspectionModel({ interactionType: 'trophy_inspection', huntId: 'wolf_cleaner',
    inspection: controller.inspectionMetadata(entry) });
  assert.equal(model().artifact, 'Trophée acquis · étude exposée');
  object.userData.unlocked = false;
  assert.equal(model().artifact, 'Projection d’étude · trophée non acquis');
  assert.equal(controller.inspectionMetadata({ itemId: 'wolf_cleaner', unlocked: true }).unlocked, true,
    'a plain metadata flag remains supported when no model is attached');
});
