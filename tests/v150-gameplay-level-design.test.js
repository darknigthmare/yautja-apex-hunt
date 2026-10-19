import test from 'node:test';
import assert from 'node:assert/strict';

import { BouvetoyaWhalingStationRailSledWinchSector } from '../src/gameplay/BouvetoyaWhalingStationRailSledWinchSector.js';
import { ThermalReflectiveFoilBivouacSniperCounterSystem } from '../src/gameplay/ThermalReflectiveFoilBivouacSniperCounterSystem.js';
import { ElderCeremonialMonomolecularSwordParrySystem } from '../src/gameplay/ElderCeremonialMonomolecularSwordParrySystem.js';
import { GunnisonFloodedSewerPredalienHiveResinSector } from '../src/gameplay/GunnisonFloodedSewerPredalienHiveResinSector.js';
import { HarriganCompressedNitrogenCryoSprayCounterSystem } from '../src/gameplay/HarriganCompressedNitrogenCryoSprayCounterSystem.js';
import { ComancheMedicineHerbPoulticeCoagulationSystem } from '../src/gameplay/ComancheMedicineHerbPoulticeCoagulationSystem.js';
import { YautjaScoutShipAutopilotCloakedExtractionSector } from '../src/gameplay/YautjaScoutShipAutopilotCloakedExtractionSector.js';
import { JungleDeadfallLogPendulumCrushTrapSector } from '../src/gameplay/JungleDeadfallLogPendulumCrushTrapSector.js';
import { BioMaskHeartbeatEcholocationRadarSystem } from '../src/gameplay/BioMaskHeartbeatEcholocationRadarSystem.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v150): BouvetoyaWhalingStationRailSledWinchSector launches sled across crevasse and rams enemies', () => {
  const sled = new BouvetoyaWhalingStationRailSledWinchSector();
  const xenosOnTrack = [{ id: 'xeno_drone_1', x: 0.5, z: 18.0, health: 160 }];
  const passengers = [{ id: 'lex_woods', z: 0 }];

  const res = sled.releaseWinchAndLaunchSled(xenosOnTrack, passengers, audioSynth);
  assert.equal(res.launched, true);
  assert.equal(res.crevasseCleared, true);
  assert.deepEqual(res.rammedEntityIds, ['xeno_drone_1']);
  assert.equal(xenosOnTrack[0].health, 0);
  assert.equal(passengers[0].transportedAcrossCrevasse, true);
});

test('Chantier 2 (v150): ThermalReflectiveFoilBivouacSniperCounterSystem hides sniper from IR until acoustic/tech mode', () => {
  const foil = new ThermalReflectiveFoilBivouacSniperCounterSystem();
  foil.deployFoilBivouac('sniper_alpha_ridge', audioSynth);

  const irScan = foil.evaluateBioMaskScan('THERMAL_IR');
  assert.equal(irScan.detectedCount, 0);

  const techScan = foil.evaluateBioMaskScan('ELECTROMAGNETIC_TECH');
  assert.equal(techScan.detectedCount, 2);
});

test('Chantier 3 (v150): ElderCeremonialMonomolecularSwordParrySystem cleaves Praetorian carapace and deflects plasma', () => {
  const sword = new ElderCeremonialMonomolecularSwordParrySystem();
  const praetorian = { id: 'praetorian_guard', isPraetorian: true, carapaceArmor: 150, health: 220 };

  const cleave = sword.executeMonomolecularCleave(praetorian, audioSynth);
  assert.equal(cleave.cleaved, true);
  assert.equal(cleave.carapaceBypassedAndSplit, true);
  assert.equal(praetorian.carapaceArmor, 0);

  const badBloodShooter = { id: 'renegade_caster', health: 160 };
  const parry = sword.attemptTimedPlasmaParry(0.12, badBloodShooter, audioSynth);
  assert.equal(parry.parried, true);
  assert.equal(badBloodShooter.struckByDeflectedPlasma, true);
  assert.equal(badBloodShooter.health, 20);
});

test('Chantier 4 (v150): GunnisonFloodedSewerPredalienHiveResinSector slows prey and dissolves under Wolf solvent', () => {
  const sewer = new GunnisonFloodedSewerPredalienHiveResinSector();
  const step = sewer.evaluateTraversalAt({ x: -8, z: 6 }, audioSynth);
  assert.ok(step.speedMultiplier <= 0.5);

  const dissolve = sewer.applyWolfBlueCorrosiveSolvent('resin_node_north_junction', audioSynth);
  assert.equal(dissolve.dissolved, true);
  assert.ok(dissolve.cleanerHonorEarned > 0);

  const postStep = sewer.evaluateTraversalAt({ x: -8, z: 6 }, audioSynth);
  assert.equal(postStep.inActiveResinNodeId, null);
});

test('Chantier 5 (v150): HarriganCompressedNitrogenCryoSprayCounterSystem masks shooter and freezes Yautja cloak', () => {
  const cryo = new HarriganCompressedNitrogenCryoSprayCounterSystem();
  const harrigan = { id: 'harrigan' };
  const cityHunter = { id: 'city_hunter', distanceMeters: 4.5, cloakActive: true, health: 200 };

  const spray = cryo.dischargeCryoNitrogenBurst([cityHunter], harrigan, audioSynth);
  assert.equal(spray.discharged, true);
  assert.equal(harrigan.maskedByCryoFog, true);
  assert.equal(cityHunter.cloakActive, false);
  assert.equal(spray.frozenTargets[0].cloakRevealed, true);
});

test('Chantier 6 (v150): ComancheMedicineHerbPoulticeCoagulationSystem stops warm blood trails and cools body temp', () => {
  const poultice = new ComancheMedicineHerbPoulticeCoagulationSystem();
  const naru = { id: 'naru', health: 50, maxHealth: 100, isBleeding: true, leavingWarmBloodTrail: true };

  const res = poultice.applyHerbPoultice(naru, audioSynth);
  assert.equal(res.applied, true);
  assert.equal(res.bleedingStopped, true);
  assert.equal(naru.leavingWarmBloodTrail, false);
  assert.equal(naru.bodyTempCelsius, 26.5);
  assert.equal(naru.health, 95);
});

test('Chantier 7 (v150): YautjaScoutShipAutopilotCloakedExtractionSector summons cloaked ship and extracts hunter', () => {
  const lz = new YautjaScoutShipAutopilotCloakedExtractionSector();
  const hostile = { id: 'stargazer_merc', x: 3.0, z: 2.0, health: 100 };

  const summon = lz.summonAutopilotScoutShip([hostile], audioSynth);
  assert.equal(summon.summoned, true);
  assert.deepEqual(summon.pushedHostileIds, ['stargazer_merc']);

  const board = lz.boardExtractionRamp({ x: 1.0, z: 1.0, trophySkullsCarried: 4 }, audioSynth);
  assert.equal(board.extracted, true);
  assert.equal(board.extractedTrophiesCount, 4);
});

test('Chantier 8 (v150): JungleDeadfallLogPendulumCrushTrapSector crushes target under released log', () => {
  const deadfall = new JungleDeadfallLogPendulumCrushTrapSector();
  const target = { id: 'jungle_hunter', x: 0.5, z: -0.5, health: 260, cloakActive: true };

  const release = deadfall.cutHoldingVineAndReleaseLog([target], audioSynth);
  assert.equal(release.released, true);
  assert.equal(release.crushedCount, 1);
  assert.equal(target.health, 0);
  assert.equal(target.cloakActive, false);
});

test('Chantier 9 (v150): BioMaskHeartbeatEcholocationRadarSystem detects panicked heartbeats through thermal camo', () => {
  const radar = new BioMaskHeartbeatEcholocationRadarSystem();
  const candidates = [
    { id: 'panicked_sniper', x: 10, z: 12, heartRateBpm: 142, hasThermalFoil: true },
    { id: 'calm_dutch', x: 8, z: 6, heartRateBpm: 58, mudCamouflageRatio: 1.0 }
  ];

  const sweep = radar.performSubAcousticHeartbeatSweep({ x: 0, z: 0 }, candidates, audioSynth);
  assert.equal(sweep.detectedCount, 1);
  assert.equal(sweep.detectedPrey[0].id, 'panicked_sniper');
  assert.equal(sweep.detectedPrey[0].bypassedThermalCamo, true);
});

test('Chantier 10 (v150): AudioSynthesizer exposes all 15 v150 procedural Web Audio methods', () => {
  const methods = [
    'playWhalingStationRailSledWinchRelease',
    'playRailSledIceCrevasseCrash',
    'playThermalFoilBlanketUnfoldRustle',
    'playElderCeremonialSwordExtendRing',
    'playElderSwordPlasmaBoltDeflectZap',
    'playSewerPredalienResinSquelchStep',
    'playWolfCorrosiveSolventResinFizz',
    'playHarriganNitrogenCryoSprayHiss',
    'playCryoFrostCloakShortCircuitCrack',
    'playComancheHerbPoulticeCrushApply',
    'playScoutShipCloakedHoverDescentHum',
    'playScoutShipExtractionRampLockClunk',
    'playDeadfallLogVineSnapTwang',
    'playDeadfallLogPendulumCrushImpact',
    'playBioMaskHeartbeatEcholocationThump'
  ];

  for (const methodName of methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `Missing AudioSynthesizer.${methodName}`);
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});
