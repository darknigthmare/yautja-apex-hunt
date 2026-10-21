import test from 'node:test';
import assert from 'node:assert/strict';

import { QueenChamberCryogenicRestraintSector } from '../src/gameplay/QueenChamberCryogenicRestraintSector.js';
import { GunnisonStormDrainSiphonLabyrinthSector } from '../src/gameplay/GunnisonStormDrainSiphonLabyrinthSector.js';
import { FluorescentTallGrassHoundKennelsSector } from '../src/gameplay/FluorescentTallGrassHoundKennelsSector.js';
import { StargazerAutopsyDecontaminationSector } from '../src/gameplay/StargazerAutopsyDecontaminationSector.js';
import { MudWaspBluffBeaverDamTransitSector } from '../src/gameplay/MudWaspBluffBeaverDamTransitSector.js';
import { PenthouseSkylightRainGargoyleSector } from '../src/gameplay/PenthouseSkylightRainGargoyleSector.js';
import { JungleClearingChopperExtractionSector } from '../src/gameplay/JungleClearingChopperExtractionSector.js';
import { HumanQaLevelDesignThermalAirflowHUDDirector } from '../src/gameplay/HumanQaLevelDesignThermalAirflowHUDDirector.js';
import { HumanQaLevelDesignDynamicTerrainAuditor } from '../src/gameplay/HumanQaLevelDesignDynamicTerrainAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v171 Chantier LD 1: QueenChamberCryogenicRestraintSector simulates cryogenic nitrogen blasts, chain tension and altar hazards', () => {
  const chamber = new QueenChamberCryogenicRestraintSector();
  assert.equal(chamber.queenHeightM, 9.0);
  assert.equal(chamber.queenRestrained, true);

  // Cryogenic blast
  const cryo = chamber.triggerCryogenicNitrogenBlast(2.0);
  assert.equal(cryo.success, true);
  assert.equal(cryo.cryogenicTempC, -196.0);
  assert.ok(cryo.frostFreezeRadiusM > 5.0);
  assert.equal(cryo.totalFreezeDamage, 150);

  // Chain stress and Queen rupture
  const stress = chamber.applyRestraintChainStress(120.0, true);
  assert.ok(stress.currentTensionKn > 180.0);
  assert.ok(stress.chainRuptureRiskPct > 60.0);

  // Altar platform tilt
  const altar = chamber.operateSacrificialPlatform(true);
  assert.equal(altar.platformTilted, true);
  assert.equal(altar.geothermalChasmDepthM, 45.0);
  assert.equal(altar.pitFallHazardActive, true);
});

test('v171 Chantier LD 2: GunnisonStormDrainSiphonLabyrinthSector handles low-overhead clearance, Wolf laser mines and acid puddles', () => {
  const sewer = new GunnisonStormDrainSiphonLabyrinthSector();
  assert.equal(sewer.tunnelClearanceM, 1.8);

  // Standing up penalty
  const standing = sewer.evaluateLowClearanceMovement(false, 3.5);
  assert.equal(standing.isCrouching, false);
  assert.equal(standing.headBumpPenalty, true);
  assert.ok(standing.effectiveSpeedMps <= 2.0);

  // Crouching stealth
  const crouching = sewer.evaluateLowClearanceMovement(true, 3.5);
  assert.equal(crouching.isCrouching, true);
  assert.equal(crouching.headBumpPenalty, false);
  assert.equal(crouching.stealthRating, 'SILENT_LOW_PROFILE_STALK');

  // Laser mine gauntlet disarm
  const disarm = sewer.resolveWolfLaserMineIntersection(false, true);
  assert.equal(disarm.disarmed, true);
  assert.equal(disarm.salvagedPlasmaCharges, 2);

  // Acid puddle contact
  const acid = sewer.resolveAcidSlimePuddleHazard(1.5);
  assert.equal(acid.acidPh, 0.5);
  assert.ok(acid.totalDamage > 50);
});

test('v171 Chantier LD 3: FluorescentTallGrassHoundKennelsSector evaluates tall grass concealment, ultrasonic whistle and bone kennels', () => {
  const savannah = new FluorescentTallGrassHoundKennelsSector();
  assert.equal(savannah.grassHeightM, 2.5);

  // Ground level concealment
  const ground = savannah.evaluateGrassSavannahConcealment(1.5);
  assert.equal(ground.isConcealedInGrass, true);
  assert.equal(ground.maxDirectSightlineM, 3.5);

  // Roost tree overwatch
  const elevated = savannah.evaluateGrassSavannahConcealment(16.0);
  assert.equal(elevated.isConcealedInGrass, false);
  assert.equal(elevated.highGroundThermalSuperiority, true);

  // Ultrasonic whistle
  const whistle = savannah.soundUltrasonicHoundWhistle(1.2);
  assert.equal(whistle.whistleActive, true);
  assert.equal(whistle.frequencyHz, 12500);
  assert.equal(whistle.humanAudibleWarning, false);

  // Bone kennel interaction
  const kennel = savannah.interactWithBoneKennelBarricade();
  assert.equal(kennel.houndEnclosureBreached, true);
  assert.equal(kennel.climbingElevationM, 4.5);
});

test('v171 Chantier LD 4: StargazerAutopsyDecontaminationSector resolves restraint breaking, airlock depressurization and glass shattering', () => {
  const autopsy = new StargazerAutopsyDecontaminationSector();
  assert.equal(autopsy.airlockPressureKpa, 101.3);

  // Restraint breaking
  const breakClamps = autopsy.breakAutopsyRestraintClamps(3200.0);
  assert.equal(breakClamps.success, true);
  assert.equal(breakClamps.magneticClampsActive, false);

  // Airlock depressurization
  const depressurize = autopsy.initiateAirlockVacuumDepressurization();
  assert.equal(depressurize.success, true);
  assert.equal(depressurize.finalPressureKpa, 12.0);
  assert.ok(depressurize.pressureDeltaKpa > 80.0);
  assert.equal(depressurize.airlockSealed, true);

  // Observation glass impact
  const glass = autopsy.strikeObservationGlassPartition(520.0);
  assert.equal(glass.isShattered, true);
  assert.equal(glass.breachedIntoObservationBooth, true);
});

test('v171 Chantier LD 5: MudWaspBluffBeaverDamTransitSector handles mud wasp swarms, beaver dam log balance and clay bluff collapse', () => {
  const bluff = new MudWaspBluffBeaverDamTransitSector();
  assert.equal(bluff.bluffHeightM, 12.0);

  // Drop mud wasp nest
  const nestDrop = bluff.dropMudWaspNest('wasp-nest-01');
  assert.equal(nestDrop.success, true);
  assert.equal(nestDrop.targetAccuracyPenaltyPct, 70.0);
  assert.equal(nestDrop.panicRunningTriggered, true);

  // Beaver dam traverse
  const traverse = bluff.traverseBeaverDamLogPath(4.0);
  assert.equal(traverse.success, true);
  assert.equal(traverse.submersionRisk, false);

  // Clay bluff collapse
  const collapse = bluff.triggerClayBluffCollapse();
  assert.equal(collapse.success, true);
  assert.equal(collapse.rubbleRampCreated, true);
  assert.equal(collapse.accessToBluffApexGranted, true);
});

test('v171 Chantier LD 6: PenthouseSkylightRainGargoyleSector simulates ceiling skylight breaches, gargoyle perches and lightning recharge', () => {
  const penthouse = new PenthouseSkylightRainGargoyleSector();
  assert.equal(penthouse.buildingStories, 45);
  assert.ok(penthouse.roofElevationM > 150.0);

  // Skylight plunge breach
  const breach = penthouse.breachPenthouseSkylightPlunge(140.0);
  assert.equal(breach.success, true);
  assert.equal(breach.skylightBreached, true);
  assert.ok(breach.impactVelocityMps > 10.0);
  assert.equal(breach.iFramesDurationMs, 180);

  // Gargoyle roost
  const gargoyle = penthouse.perchOnRoofGargoyleRoost();
  assert.ok(gargoyle.urbanSightlineRadiusM >= 380.0);
  assert.equal(gargoyle.lightningStrikeGroundingProtection, true);

  // Lightning recharge
  const lightning = penthouse.channelLightningConductorCharge(true);
  assert.equal(lightning.recharged, true);
  assert.equal(lightning.plasmaEnergyRecharged, 100.0);
});

test('v171 Chantier LD 7: JungleClearingChopperExtractionSector resolves bamboo thicket slicing, burning Huey fires and mud wallow trench', () => {
  const clearing = new JungleClearingChopperExtractionSector();
  assert.equal(clearing.clearingId, 'val-verde-extraction-01');

  // Bamboo thicket slicing
  const bamboo = clearing.sliceBambooThicketStealthPath(6.0);
  assert.equal(bamboo.success, true);
  assert.equal(bamboo.newTacticalFlankOpened, true);
  assert.ok(bamboo.stalksCutCount > 50);

  // Helicopter fire hazard
  const fire = clearing.resolveHelicopterFireHazard(2.0);
  assert.equal(fire.inHazard, true);
  assert.equal(fire.flameTemperatureC, 650.0);
  assert.equal(fire.tailRotorMetalCoverRating, 'FULL_BALLISTIC_COVER');

  // Mud drainage trench wallow
  const wallow = clearing.wallowInMudDrainageTrench(3.0);
  assert.equal(wallow.success, true);
  assert.equal(wallow.infraredSignatureReductionPct, 98.0);
  assert.equal(wallow.trenchConcealmentActive, true);
});

test('v171 Chantier LD 8: HumanQaLevelDesignThermalAirflowHUDDirector calculates 3D air vectors, scent dispersion and thermal chimney boost', () => {
  const director = new HumanQaLevelDesignThermalAirflowHUDDirector();
  assert.equal(director.windBearingDeg, 225.0);

  // Upwind stealth calculation
  const upwind = director.computeAirflowPropagationModifiers(45.0); // Facing into wind
  assert.equal(upwind.isUpwind, true);
  assert.equal(upwind.scentDetectionMultiplier, 0.25);
  assert.equal(upwind.stealthAdvantage, 'OPTIMAL_UPWIND_MASK');

  // Downwind hazard calculation
  const downwind = director.computeAirflowPropagationModifiers(225.0); // Wind blowing from hunter
  assert.equal(downwind.isDownwind, true);
  assert.equal(downwind.scentDetectionMultiplier, 2.1);

  // Thermal chimney updraft
  const chimney = director.evaluateThermalChimneyUpdraft(70.0);
  assert.equal(chimney.inThermalChimney, true);
  assert.equal(chimney.jumpElevationBoostPct, 25.0);
});

test('v171 Chantier LD 9: AudioSynthesizer computes cryogenic & airlock acoustics and executes 15 procedural LD audio methods', () => {
  assert.equal(typeof audioSynth.computeCryogenicNitrogenDecompressionAcoustics, 'function');
  assert.equal(typeof audioSynth.computeDecontaminationAirlockVacuumDepressurizationAcoustics, 'function');

  // Math Acoustics 1: Cryogenic Nitrogen Decompression
  const cryoAcoustics = audioSynth.computeCryogenicNitrogenDecompressionAcoustics(8.5, 16.0, 30.0);
  assert.equal(cryoAcoustics.sonicChokedMach, 3.1);
  assert.ok(cryoAcoustics.whistlingPeakHz > 6000);
  assert.ok(cryoAcoustics.ventDecibels > 100);

  // Math Acoustics 2: Airlock Vacuum Depressurization
  const airlockAcoustics = audioSynth.computeDecontaminationAirlockVacuumDepressurizationAcoustics(45.0, 12.0, 3.5);
  assert.ok(airlockAcoustics.pressureDropDelta > 85.0);
  assert.ok(airlockAcoustics.lowFreqCavitationRumbleHz > 40);
  assert.ok(airlockAcoustics.airlockDepressurizationDb > 95);

  // 15 Procedural Level Design SFX methods
  const v171SfxMethods = [
    'playCryogenicNitrogenVentHiss',
    'playQueenRestraintChainRattle',
    'playSewerDrainSlimeDripEcho',
    'playWolfLaserMineArmChirp',
    'playTallFluorescentGrassRustle',
    'playHoundUltrasonicWhistleBlast',
    'playAirlockDecompressionVacuumRoar',
    'playAutopsyObservationGlassCrack',
    'playMudWaspNestDisturbBuzz',
    'playBeaverPondLogFloatingCreak',
    'playPenthouseSkylightGlassShatterCascade',
    'playGargoyleStonePerchRainDrip',
    'playHelicopterTailRotorCrashCreak',
    'playBambooThicketSlicingWhoosh',
    'playThermalChimneyUpdraftWhoosh'
  ];

  for (const method of v171SfxMethods) {
    assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method](), `Calling ${method} should not throw`);
  }
});

test('v171 Chantier LD 10: HumanQaLevelDesignDynamicTerrainAuditor resolves moisture transitions, ice thawing, fire spread and footing grip', () => {
  const dynamicTerrain = new HumanQaLevelDesignDynamicTerrainAuditor();
  assert.equal(dynamicTerrain.currentState, 'DRY_SOIL');
  assert.equal(dynamicTerrain.frictionCoeffMu, 0.85);

  // Precipitation transition: DRY_SOIL -> MUD_SLURRY
  const rain = dynamicTerrain.applyPrecipitationMoisture(30.0, 20.0);
  assert.equal(rain.currentState, 'MUD_SLURRY');
  assert.equal(rain.frictionCoeffMu, 0.32);
  assert.ok(rain.movementSpeedMultiplier < 0.5);

  // Footing grip test on mud slurry
  const footing = dynamicTerrain.evaluateFootingKinematics(7.5);
  assert.equal(footing.tractionLoss, true);
  assert.equal(footing.staminaDrainMultiplier, 1.5);

  // Thermal heat input on ice: SURFACE_ICE -> OPEN_WATER
  const iceTerrain = new HumanQaLevelDesignDynamicTerrainAuditor({ initialState: 'SURFACE_ICE' });
  const thawed = iceTerrain.applyThermalHeatInput(35000.0, 'SURFACE_ICE');
  assert.equal(thawed.currentState, 'OPEN_WATER');
  assert.equal(thawed.swimmingRequired, true);

  // Thermal heat input on brush: DRY_BRUSH -> IGNITED_INFERNO
  const brushTerrain = new HumanQaLevelDesignDynamicTerrainAuditor({ initialState: 'DRY_BRUSH' });
  const ignited = brushTerrain.applyThermalHeatInput(25000.0, 'DRY_BRUSH');
  assert.equal(ignited.currentState, 'IGNITED_INFERNO');
  assert.ok(ignited.hazardRadiusM > 5.0);
});
