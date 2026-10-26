import test from 'node:test';
import assert from 'node:assert/strict';

import { ThePredator2018GeneticsCryoVaultSector } from '../src/gameplay/ThePredator2018GeneticsCryoVaultSector.js';
import { ThePredator2018SuburbanRooftopStalkingSector } from '../src/gameplay/ThePredator2018SuburbanRooftopStalkingSector.js';
import { ThePredator2018StadiumBleachersAmbushSector } from '../src/gameplay/ThePredator2018StadiumBleachersAmbushSector.js';
import { ThePredator2018TraegerPlasmacasterMisfireSector } from '../src/gameplay/ThePredator2018TraegerPlasmacasterMisfireSector.js';
import { ThePredator2018ForestNightMinefieldSector } from '../src/gameplay/ThePredator2018ForestNightMinefieldSector.js';
import { ThePredator2018PredatorKillerArmorVaultSector } from '../src/gameplay/ThePredator2018PredatorKillerArmorVaultSector.js';
import { ThePredator2018YautjaDefeatForestProtocolSector } from '../src/gameplay/ThePredator2018YautjaDefeatForestProtocolSector.js';
import { HumanQaThePredator2018ForestHUDDirector } from '../src/gameplay/HumanQaThePredator2018ForestHUDDirector.js';
import { HumanQaThePredator2018ForestMasterAuditor } from '../src/gameplay/HumanQaThePredator2018ForestMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v187 Chantier LD 1: ThePredator2018GeneticsCryoVaultSector accesses vault, samples transgenic DNA, and handles pressurized tank rupture', () => {
  const sector = new ThePredator2018GeneticsCryoVaultSector({ cryoTankPressureKpa: 380.0 });

  const access = sector.accessGeneticsVault();
  assert.strictEqual(access.status, 'GENETICS_CRYO_VAULT_ACCESSED');
  assert.strictEqual(sector.vaultAccessed, true);

  const sample = sector.sampleTransgenicDnaSequence();
  assert.strictEqual(sample.status, 'TRANSGENIC_YAUTJA_DNA_HARVESTED');
  assert.strictEqual(sector.transgenicDnaSampled, true);

  const rupture = sector.ruptureCryoTank(2500.0);
  assert.strictEqual(rupture.status, 'CRYO_TANK_SHATTERED_PRESSURIZED_FLOOD');
  assert.strictEqual(sector.containmentBreachTriggered, true);
  assert.strictEqual(sector.tanksIntact, 3);
});

test('v187 Chantier LD 2: ThePredator2018SuburbanRooftopStalkingSector executes rooftop leap, tracks mask signal, and evades patrol vans', () => {
  const sector = new ThePredator2018SuburbanRooftopStalkingSector({ roofElevationM: 7.5 });

  const leap = sector.executeRooftopLeap(9.2);
  assert.strictEqual(leap.status, 'ROOFTOP_LEAP_LANDED_ON_SHINGLES');
  assert.strictEqual(sector.rooftopLeapActive, true);

  const track = sector.trackBioMaskSignal(0.95);
  assert.strictEqual(track.status, 'MASK_TELEMETRY_PINPOINTED');
  assert.strictEqual(sector.roryLocationLocated, true);

  const evade = sector.evadeStargazerStreetPatrol();
  assert.strictEqual(evade.status, 'STARGAZER_VAN_PATROL_EVADED_OVERHEAD');
  assert.strictEqual(sector.stargazerVansEvaded, 1);
});

test('v187 Chantier LD 3: ThePredator2018StadiumBleachersAmbushSector severs floodlight cables, triggers arena blackout, and eliminates snipers', () => {
  const sector = new ThePredator2018StadiumBleachersAmbushSector({ floodlightTowerHeightM: 18.0 });

  const sever = sector.severFloodlightPowerCables();
  assert.strictEqual(sever.status, 'STADIUM_POWER_SEVERED_TOTAL_BLACKOUT');
  assert.strictEqual(sector.arenaInDarkness, true);
  assert.strictEqual(sector.retinalThermalAdvantage, true);

  const harvest = sector.eliminateTowerSnipers(3);
  assert.strictEqual(harvest.status, 'TOWER_SNIPERS_HARVESTED');
  assert.strictEqual(sector.snipersEliminated, 3);
  assert.strictEqual(harvest.fieldCleared, true);
});

test('v187 Chantier LD 4: ThePredator2018TraegerPlasmacasterMisfireSector induces optical backscatter, pivots cannon 180 degrees, and eliminates Traeger', () => {
  const sector = new ThePredator2018TraegerPlasmacasterMisfireSector();

  const mount = sector.mountSalvagedPlasmacaster();
  assert.strictEqual(mount.status, 'SALVAGED_PLASMACASTER_RIGGED_TO_HARNESS');
  assert.strictEqual(sector.plasmacasterMounted, true);

  const glitch = sector.induceThermalOpticBackscatter(0.9);
  assert.strictEqual(glitch.status, 'OPTIC_SENSOR_THERMAL_BACKSCATTER_LOOP');
  assert.strictEqual(sector.pivotAngleDeg, 180.0);

  const misfire = sector.pullTriggerWithGlitchedOptic();
  assert.strictEqual(misfire.status, 'CATASTROPHIC_BACKWARDS_MISFIRE_TRAEGER_VAPORIZED');
  assert.strictEqual(sector.traegerEliminated, true);
});

test('v187 Chantier LD 5: ThePredator2018ForestNightMinefieldSector arms perimeter, triggers Claymore salvo, and snaps grenade tripwires', () => {
  const sector = new ThePredator2018ForestNightMinefieldSector({ perimeterLengthM: 80.0 });

  const arm = sector.armPerimeterDefenses();
  assert.strictEqual(arm.status, 'FOREST_MINEFIELD_PERIMETER_ARMED');
  assert.strictEqual(sector.minefieldArmed, true);

  const claymore = sector.triggerClaymoreSalvo(2);
  assert.strictEqual(claymore.status, 'CLAYMORE_STEEL_BALL_BLAST_TRIGGERED');
  assert.strictEqual(sector.claymoresDetonated, 2);

  const grenades = sector.snapGrenadeTripwires(3);
  assert.strictEqual(grenades.status, 'GRENADE_TRIPWIRES_DETONATED');
  assert.strictEqual(sector.grenadesDetonated, 3);
  assert.strictEqual(sector.defensePerimeterHeld, true);
});

test('v187 Chantier LD 6: ThePredator2018PredatorKillerArmorVaultSector unseals cargo sarcophagus, latches gauntlet, and deploys full nanotech suit', () => {
  const sector = new ThePredator2018PredatorKillerArmorVaultSector();

  const unseal = sector.unsealCargoSarcophagus();
  assert.strictEqual(unseal.status, 'PREDATOR_KILLER_SARCOPHAGUS_OPENED');
  assert.strictEqual(sector.sarcophagusUnsealed, true);

  const latch = sector.latchInitiationGauntlet();
  assert.strictEqual(latch.status, 'GAUNTLET_SECURED_TO_FOREARM');
  assert.strictEqual(sector.gauntletLatched, true);

  const suit = sector.deployFullNanotechExosuit();
  assert.strictEqual(suit.status, 'PREDATOR_KILLER_EXOSUIT_ONLINE');
  assert.strictEqual(sector.nanotechSuitDeployed, true);
  assert.strictEqual(sector.dualCannonsOperational, true);
});

test('v187 Chantier LD 7: ThePredator2018YautjaDefeatForestProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new ThePredator2018YautjaDefeatForestProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'THE_PREDATOR_2018_FOREST' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 50, configuration: 'THE_PREDATOR_2018_FOREST' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Chasseur Yautja perd (HP <= 0) en arène Forest The Predator 2018 -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_FOREST' });
  assert.strictEqual(defeatCheck.status, 'FOREST_YAUTJA_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.pneumaticCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(10.5);
  assert.strictEqual(blast.status, 'FOREST_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v187 Chantier LD 8: HumanQaThePredator2018ForestHUDDirector mounts forest HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaThePredator2018ForestHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 6.8,
    activeGlyph: 'ᛟ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᛟ');
});

test('v187 Chantier LD 9: AudioSynthesizer computes cryo tank rupture & nanotech deploy acoustics and executes 15 new v187 SFX methods', () => {
  const tankAcoustics = audioSynth.computeGeneticsCryoTankRuptureAcoustics(380.0, 850.0, 25.0);
  assert.ok(tankAcoustics.hydrodynamicShatterDb > 0);
  assert.ok(tankAcoustics.cavitationResonanceHz > 0);

  const nanoAcoustics = audioSynth.computePredatorKillerNanotechDeployAcoustics(100.0, 18.0, 450.0);
  assert.ok(nanoAcoustics.magneticMotorHumHz > 0);
  assert.ok(nanoAcoustics.servoLatchClickDb > 0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playCryoTankLiquidRuptureSFX',
    'playSuburbanRoofTileScrambleSFX',
    'playStadiumFloodlightShatterSFX',
    'playTracerSniperTowerShotSFX',
    'playPlasmacasterShoulderMisfireBackfireSFX',
    'playForestGrenadeTripwireBlastSFX',
    'playPredatorKillerSarcophagusHissSFX',
    'playNanotechArmorFormFittingHumSFX',
    'playDualShoulderCannonDeployClickSFX',
    'playTransgenicDNAExtractorWhineSFX',
    'playGauntletCrimsonLatchSpringSFX',
    'playAlienCountdownBeepPacingSFX',
    'playStargazerEchoingLaughSFX',
    'playPlasmaCoreVaporizationRumbleSFX',
    'playSuburbanHalloweenNightWindSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v187 Chantier LD 10: HumanQaThePredator2018ForestMasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaThePredator2018ForestMasterAuditor();
  const report = auditor.runFullForestMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
