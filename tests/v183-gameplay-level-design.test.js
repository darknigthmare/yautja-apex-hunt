import test from 'node:test';
import assert from 'node:assert/strict';

import { Predators2010FreefallCanopyDropSector } from '../src/gameplay/Predators2010FreefallCanopyDropSector.js';
import { Predators2010CelestialMoonsHorizonSector } from '../src/gameplay/Predators2010CelestialMoonsHorizonSector.js';
import { Predators2010CuchilloPuppetDecoyTrapSector } from '../src/gameplay/Predators2010CuchilloPuppetDecoyTrapSector.js';
import { Predators2010NeurotoxicFloraSporeSector } from '../src/gameplay/Predators2010NeurotoxicFloraSporeSector.js';
import { Predators2010GamePreserveMonolithicRidgeSector } from '../src/gameplay/Predators2010GamePreserveMonolithicRidgeSector.js';
import { Predators2010DawnParachuteDropWaveSector } from '../src/gameplay/Predators2010DawnParachuteDropWaveSector.js';
import { YautjaDefeatSelfDestructProtocolSector } from '../src/gameplay/YautjaDefeatSelfDestructProtocolSector.js';
import { HumanQaPredators2010PreserveHUDDirector } from '../src/gameplay/HumanQaPredators2010PreserveHUDDirector.js';
import { HumanQaPredators2010PreserveAuditor } from '../src/gameplay/HumanQaPredators2010PreserveAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v183 Chantier LD 1: Predators2010FreefallCanopyDropSector simulates terminal velocity freefall, barometric deployment, and riser knife cut QTE', () => {
  const dropSector = new Predators2010FreefallCanopyDropSector({ initialAltitude: 3000.0 });

  assert.strictEqual(dropSector.currentAltitude, 3000.0);
  assert.ok(dropSector.terminalVelocity > 50.0 && dropSector.terminalVelocity < 60.0);

  // Freefall descent
  const freefall = dropSector.simulateFreefallDescent(15.0);
  assert.ok(freefall.altitude < 3000.0);

  // Deploy parachute
  const deploy = dropSector.deployParachute();
  assert.strictEqual(deploy.status, 'PARACHUTE_DEPLOYED');

  // Snag in canopy branches
  const snag = dropSector.snagInCanopyBranches();
  assert.strictEqual(snag.status, 'CANOPY_SNAGGED');
  assert.strictEqual(dropSector.riserTension, 1850.0);

  // Cut risers
  const cut1 = dropSector.cutParachuteRisers(120.0);
  assert.strictEqual(cut1.status, 'RISERS_CUTTING_IN_PROGRESS');

  const cut2 = dropSector.cutParachuteRisers(200.0);
  assert.strictEqual(cut2.status, 'RISERS_SEVERED_SAFE_TOUCHDOWN');
  assert.strictEqual(dropSector.landedSafely, true);
  assert.strictEqual(dropSector.currentAltitude, 0.0);
});

test('v183 Chantier LD 2: Predators2010CelestialMoonsHorizonSector renders 3 celestial bodies, atmospheric lensing, and squad disorientation', () => {
  const horizon = new Predators2010CelestialMoonsHorizonSector({ cliffElevation: 450.0 });

  const panorama = horizon.reachCliffEdge();
  assert.strictEqual(panorama.status, 'CLIFF_EDGE_PANORAMA_UNVEILED');
  assert.strictEqual(panorama.celestialCount, 3);
  assert.ok(horizon.squadCognitiveDisorientation >= 0.90);

  const optics = horizon.computeCelestialOptics('ringed_gas_giant_alpha');
  assert.strictEqual(optics.bodyId, 'ringed_gas_giant_alpha');
  assert.ok(optics.opticalLensingFactor > 1.0);

  const squad = horizon.evaluateSquadPsyche();
  assert.strictEqual(squad.confirmedNotEarth, true);
  assert.strictEqual(squad.tacticalConclusion, 'NO_EXTRACTION_POSSIBLE_HUNT_OR_BE_HUNTED');
});

test('v183 Chantier LD 3: Predators2010CuchilloPuppetDecoyTrapSector detects acoustic mimicry loop and methodically disarms monofilament lattice', () => {
  const decoyTrap = new Predators2010CuchilloPuppetDecoyTrapSector({ clearingRadius: 25.0 });

  // Inspection from cover
  const inspect = decoyTrap.inspectClearingFromCover(25.0);
  assert.strictEqual(inspect.status, 'TRAP_IDENTIFIED_PUPPET_BAIT');
  assert.strictEqual(decoyTrap.trapIdentifiedByRoyce, true);

  // Safe disarm
  const partialDisarm = decoyTrap.severTripwiresSafely(3);
  assert.strictEqual(partialDisarm.status, 'DISARM_IN_PROGRESS');
  assert.strictEqual(decoyTrap.wiresIntact, 3);

  const fullDisarm = decoyTrap.severTripwiresSafely(3);
  assert.strictEqual(fullDisarm.status, 'KILLZONE_DISARMED_MIMICRY_SILENCED');
  assert.strictEqual(decoyTrap.safelyDisarmed, true);
  assert.strictEqual(decoyTrap.cuchilloVitals.isDecoySpeakerActive, false);
});

test('v183 Chantier LD 4: Predators2010NeurotoxicFloraSporeSector triggers pneumatic spore discharge and performs surgical scalpel venom harvest', () => {
  const flora = new Predators2010NeurotoxicFloraSporeSector({ proximityRadiusM: 2.4 });

  // Out of range check
  const dormant = flora.evaluateProximity(5.0);
  assert.strictEqual(dormant.status, 'SAFE_DISTANCE_BOTANICAL_DORMANT');

  // Trigger discharge
  const burst = flora.evaluateProximity(1.8);
  assert.strictEqual(burst.status, 'SPORE_POD_DETONATED_PNEUMATIC_DISCHARGE');
  assert.strictEqual(burst.dischargePressureKpa, 320.0);
  assert.strictEqual(flora.targetAfflicted, true);

  // Harvest venom
  const harvest = flora.extractVenomHarvest(true);
  assert.strictEqual(harvest.status, 'NEUROTOXIN_VIAL_HARVESTED');
  assert.strictEqual(harvest.potencyScore, 85);
  assert.strictEqual(flora.extractedVials, 1);

  // Update paralysis recovery
  const update = flora.updateParalysis(6.5);
  assert.strictEqual(update.active, false);
  assert.strictEqual(update.status, 'NEUROMUSCULAR_RECOVERY_COMPLETE');
});

test('v183 Chantier LD 5: Predators2010GamePreserveMonolithicRidgeSector accesses ridge summit, decodes petroglyphs, and sweeps 360 panoramic thermal radar', () => {
  const ridge = new Predators2010GamePreserveMonolithicRidgeSector({ ridgeAltitudeM: 680.0 });

  const summit = ridge.accessMonolithSpire();
  assert.strictEqual(summit.status, 'MONOLITH_RIDGE_SUMMIT_ACCESSED');
  assert.strictEqual(summit.altitudeM, 680.0);

  const lore = ridge.decodeAncestralPlasmaPetroglyphs();
  assert.strictEqual(lore.status, 'ANCIENT_YAUTJA_LORE_UNLOCKED');
  assert.strictEqual(lore.clanHonorReward, 220);

  const radar = ridge.executePanoramicThermalScan(800.0);
  assert.strictEqual(radar.status, 'PANORAMIC_THERMAL_SURVEY_COMPLETE');
  assert.strictEqual(radar.sectorsScanned, 4);
  assert.ok(radar.totalContacts > 0);
});

test('v183 Chantier LD 6: Predators2010DawnParachuteDropWaveSector unleashes 14 atmospheric drop pods with wind shear drift simulation', () => {
  const dawnWave = new Predators2010DawnParachuteDropWaveSector({ newParachutesCount: 14 });

  const wave = dawnWave.triggerDawnAtmosphericEntry();
  assert.strictEqual(wave.status, 'DAWN_PARACHUTE_WAVE_UNLEASHED');
  assert.strictEqual(wave.totalPods, 14);
  assert.strictEqual(dawnWave.activePods.length, 14);

  const descent = dawnWave.updatePodsDescent(10.0);
  assert.strictEqual(descent.active, true);
  assert.strictEqual(descent.totalPods, 14);
});

test('v183 Chantier LD 7: YautjaDefeatSelfDestructProtocolSector verifies strict user condition (dormant if alive or human, armed only on Yautja defeat)', () => {
  const protocol = new YautjaDefeatSelfDestructProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain subit défaite -> Inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, inArenaConfiguration: true });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'PLAYER_IS_HUMAN_PROTOCOL_INERT');

  // Condition 2: Chasseur Yautja est toujours en vie (HP > 0) -> Dormant
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 45, inArenaConfiguration: true });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_ALIVE_PROTOCOL_DORMANT');

  // Condition 3: Chasseur Yautja perd (HP <= 0) en arène -> S'arme immédiatement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, inArenaConfiguration: true });
  assert.strictEqual(defeatCheck.armed, true);
  assert.strictEqual(defeatCheck.status, 'YAUTJA_DEFEAT_SELF_DESTRUCT_ARMED');
  assert.strictEqual(protocol.gauntletLidOpen, true);
  assert.strictEqual(protocol.laughterLoopActive, true);

  // Progression compte à rebours
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Détonation finale
  const blast = protocol.updateCountdown(10.5);
  assert.strictEqual(blast.status, 'TACTICAL_MICRO_NUCLEAR_DETONATION');
  assert.strictEqual(protocol.detonationExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v183 Chantier LD 8: HumanQaPredators2010PreserveHUDDirector mounts HUD panel and updates Yautja defeat overload telemetry', () => {
  const director = new HumanQaPredators2010PreserveHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 12.4,
    currentGlyph: 'ᛉ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.glyphActive, 'ᛉ');
});

test('v183 Chantier LD 9: AudioSynthesizer computes freefall riser & self-destruct laugh acoustics and executes 15 new v183 SFX methods', () => {
  const riserAcoustics = audioSynth.computeFreefallCanopyRiserAcoustics(54.0, 150.0, 1.2);
  assert.ok(riserAcoustics.dynamicPressureKpa > 0);
  assert.ok(riserAcoustics.windRoarFrequencyHz > 500);

  const laughAcoustics = audioSynth.computeYautjaSelfDestructLaughAcoustics(0.8, 340.0, 2);
  assert.strictEqual(laughAcoustics.activeHarmonics, 5);
  assert.ok(laughAcoustics.acousticOutputDb >= 100.0);

  // Verify that all 15 SFX methods exist and can be invoked without throw
  const sfxList = [
    'playFreefallWindRoarSFX',
    'playParachuteCanopyDeploySFX',
    'playCanopyRiserCutSFX',
    'playCelestialAuroraDroneSFX',
    'playCuchilloMimicryPleaSFX',
    'playTripwireTensionPingSFX',
    'playSporeCapsuleBurstSFX',
    'playNeurotoxinParalysisPulseSFX',
    'playMonolithicWindHowlSFX',
    'playDropWaveSonicBoomSFX',
    'playGauntletCoverFlipSFX',
    'playAlienGlyphScrollSFX',
    'playMockingLaughterSFX',
    'playPlasmaCoreOverloadWhineSFX',
    'playNuclearVaporizationBlastSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v183 Chantier LD 10: HumanQaPredators2010PreserveAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaPredators2010PreserveAuditor();
  const report = auditor.runFullPreserveAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
