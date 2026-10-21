import test from 'node:test';
import assert from 'node:assert/strict';

import { MeatLockerAmmoniaCatwalkSector } from '../src/gameplay/MeatLockerAmmoniaCatwalkSector.js';
import { SubterraneanPyramidShiftingChamberSector } from '../src/gameplay/SubterraneanPyramidShiftingChamberSector.js';
import { TrapperOutpostBisonGraveyardSector } from '../src/gameplay/TrapperOutpostBisonGraveyardSector.js';
import { FugitiveShipCrashKineticForcefieldSector } from '../src/gameplay/FugitiveShipCrashKineticForcefieldSector.js';
import { ValVerdeCanopyHighwayVerticalitySector } from '../src/gameplay/ValVerdeCanopyHighwayVerticalitySector.js';
import { GamePreserveRiverGhostRavineSector } from '../src/gameplay/GamePreserveRiverGhostRavineSector.js';
import { GunnisonSubstationPowerGridBlackoutSector } from '../src/gameplay/GunnisonSubstationPowerGridBlackoutSector.js';
import { HumanQaLevelDesignVerticalityNavDirector } from '../src/gameplay/HumanQaLevelDesignVerticalityNavDirector.js';
import { HumanQaLevelDesignDestructibleCoverAuditor } from '../src/gameplay/HumanQaLevelDesignDestructibleCoverAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v170 Chantier LD 1: MeatLockerAmmoniaCatwalkSector simulates carcass conveyor shields, ammonia pipe rupture and catwalk plunge', () => {
  const meatLocker = new MeatLockerAmmoniaCatwalkSector();
  assert.equal(meatLocker.sectorId, 'la-meat-locker-catwalk-01');
  assert.equal(meatLocker.catwalkElevationM, 8.0);

  // Conveyor operation
  const conveyor = meatLocker.setConveyorOperation(true, 1.4);
  assert.equal(conveyor.conveyorMoving, true);
  assert.ok(conveyor.coverPeriodSec > 0);
  assert.equal(conveyor.thermalShieldingRating, 'HIGH');

  // Carcass cover impact
  const impact = meatLocker.resolveCarcassCoverImpact(180.0);
  assert.equal(impact.absorbedEnergyJoules, 180.0);
  assert.equal(impact.penetrationThrough, false);
  assert.equal(impact.thermalSilhouetteMasked, true);

  // Ammonia pipe rupture
  const ammonia = meatLocker.ruptureAmmoniaCoolantPipe(25.0);
  assert.equal(ammonia.success, true);
  assert.equal(ammonia.cloudTempC, -33.5);
  assert.equal(ammonia.thermalVisionOcclusionPct, 85.0);
  assert.ok(ammonia.cloudRadiusM > 10.0);

  // Catwalk plunge takedown
  const plunge = meatLocker.resolveCatwalkPlungeTakedown(3.0);
  assert.equal(plunge.takedownSuccess, true);
  assert.ok(plunge.fallVelocityMps > 12.0);
  assert.ok(plunge.impactDamage > 50);
  assert.equal(plunge.iFramesDurationMs, 200);
});

test('v170 Chantier LD 2: SubterraneanPyramidShiftingChamberSector simulates 10-minute clockwork, shifting monoliths and crush hazards', () => {
  const pyramid = new SubterraneanPyramidShiftingChamberSector();
  assert.equal(pyramid.reconfigurationIntervalSec, 600.0);

  // Clockwork timer
  const clockwork = pyramid.updatePyramidClockwork(10.0);
  assert.equal(clockwork.reconfigurationTimerSec, 590.0);
  assert.ok(clockwork.minutesUntilShift > 9.0);

  // Trigger reconfiguration
  const reconfig = pyramid.executeChamberReconfiguration();
  assert.ok(reconfig.phase >= 1);
  assert.ok(reconfig.seismicDisplacementJoules > 0);
  assert.equal(reconfig.stoneGrindDecibels, 94);

  // Monolith crush hazard
  pyramid.activeMonolithWalls[0].isOpen = false;
  const crush = pyramid.resolveMonolithCrushHazard('monolith-gate-alpha', true);
  assert.equal(crush.crushed, true);
  assert.equal(crush.crushForceN, 4500.0);
  assert.equal(crush.crushDamage, 350);
});

test('v170 Chantier LD 3: TrapperOutpostBisonGraveyardSector handles stockade damage, quicklime pit burns and bone clatter', () => {
  const trapper = new TrapperOutpostBisonGraveyardSector();
  assert.equal(trapper.stockadeIntegrity, 1.0);

  // Stockade damage
  const damage = trapper.damageStockadePalisade(260, true);
  assert.ok(damage.stockadeIntegrityRemaining < 0.5);
  assert.ok(damage.woodSplinterShards > 10);

  // Quicklime pit immersion
  const quicklime = trapper.resolveQuicklimePitImmersion(2.0);
  assert.equal(quicklime.pitActive, true);
  assert.equal(quicklime.totalCausticDamage, 120);
  assert.equal(quicklime.thermalBloomTempC, 152.0);
  assert.equal(quicklime.thermalContrastSaturated, true);

  // Bison bone pile rattle
  const boneRattle = trapper.triggerBisonBonePileAcousticRattle(4.0);
  assert.ok(boneRattle.acousticClatterDb > 70);
  assert.equal(boneRattle.alertTrapperGuards, true);
});

test('v170 Chantier LD 4: FugitiveShipCrashKineticForcefieldSector resolves kinetic deflections, node overloads and hull ramparts', () => {
  const ship = new FugitiveShipCrashKineticForcefieldSector();
  assert.equal(ship.forcefieldQuadrants.length, 4);
  assert.equal(ship.rampartElevationM, 16.0);

  // Forcefield kinetic deflection
  const bulletImpact = ship.resolveForcefieldBarrierImpact('quad-north', 'BALLISTIC_BULLET', 890.0);
  assert.equal(bulletImpact.penetrated, false);
  assert.equal(bulletImpact.action, 'KINETIC_DEFLECTION');
  assert.ok(bulletImpact.ricochetVelocityMps > 800.0);

  // Forcefield player repulsion
  const bodyImpact = ship.resolveForcefieldBarrierImpact('quad-north', 'PLAYER_BODY', 10.0);
  assert.equal(bodyImpact.penetrated, false);
  assert.equal(bodyImpact.action, 'BIOMECHANICAL_REPULSION');
  assert.equal(bodyImpact.repulsionForceN, 5400.0);

  // Power junction overload
  const overload = ship.overloadPowerJunctionNode('quad-north', 120);
  assert.equal(overload.success, true);
  assert.equal(overload.quadrantDisabled, true);
});

test('v170 Chantier LD 5: ValVerdeCanopyHighwayVerticalitySector evaluates 3-tier verticality, branch sprinting and plunge leaps', () => {
  const canopy = new ValVerdeCanopyHighwayVerticalitySector();
  assert.equal(canopy.upperCanopyHeightM, 24.0);
  assert.equal(canopy.currentTier, 3);

  // Branch sprint
  const sprint = canopy.sprintOnCanopyBranch('branch-node-01', 8.5);
  assert.equal(sprint.success, true);
  assert.equal(sprint.foliageConcealmentPct, 96.0);
  assert.equal(sprint.infrarougeVisibleToGroundGuards, false);

  // Vine swing transit
  const swing = canopy.executeVineSwingTransit(16.0);
  assert.equal(swing.success, true);
  assert.equal(swing.newTier, 2);
  assert.equal(swing.silentTransit, true);

  // Vertical plunge leap
  const plunge = canopy.executeCanopyVerticalPlunge(3);
  assert.equal(plunge.success, true);
  assert.ok(plunge.impactKineticEnergyJ > 30000);
  assert.equal(plunge.crushDamage, 320);
  assert.equal(plunge.iFramesDurationMs, 220);
  assert.equal(plunge.currentTier, 1);
});

test('v170 Chantier LD 6: GamePreserveRiverGhostRavineSector simulates canyon fissure climbing, bridge vantage and corpse bait traps', () => {
  const ravine = new GamePreserveRiverGhostRavineSector();
  assert.equal(ravine.cliffWallHeightM, 28.0);
  assert.equal(ravine.naturalArchBridgeElevationM, 18.0);

  // Fissure climbing
  const climb = ravine.climbCanyonWallFissure(14.0);
  assert.equal(climb.success, true);
  assert.equal(climb.climbedHeightM, 14.0);
  assert.ok(climb.tacticalOverwatchBonusPct > 40.0);

  // Bridge vantage
  const vantage = ravine.occupyNaturalRockBridgeVantage();
  assert.equal(vantage.bridgeElevationM, 18.0);
  assert.equal(vantage.chokePointCoveragePct, 100.0);
  assert.equal(vantage.aerialDropVectorReady, true);

  // Corpse claymore bait trap
  const trap = ravine.resolveCorpseClaymoreBaitTrap(2.0);
  assert.equal(trap.triggered, true);
  assert.equal(trap.blastDamage, 290);
  assert.equal(trap.shockwaveAcousticsDb, 104);
});

test('v170 Chantier LD 7: GunnisonSubstationPowerGridBlackoutSector handles city blackout, electrical arc hazards and tower apex', () => {
  const substation = new GunnisonSubstationPowerGridBlackoutSector();
  assert.equal(substation.powerGridOnline, true);
  assert.equal(substation.gridVoltageV, 13800.0);

  // Municipal grid blackout
  const blackout = substation.triggerMunicipalGridBlackout(150);
  assert.equal(blackout.success, true);
  assert.equal(blackout.powerGridOnline, false);
  assert.equal(blackout.blackoutActive, true);
  assert.equal(blackout.cityIlluminationDropPct, 92.5);
  assert.equal(blackout.yautjaThermalContrastMultiplier, 2.4);

  // Transformer electrical arc hazard (restore power for hazard test)
  substation.powerGridOnline = true;
  const arc = substation.resolveTransformerElectricalArcHazard(2.0, true);
  assert.equal(arc.arced, true);
  assert.ok(arc.shockDamage > 50);
  assert.equal(arc.arcVoltageV, 13800.0);

  // Tower apex
  const apex = substation.occupyTransmissionTowerApex();
  assert.equal(apex.towerHeightM, 35.0);
  assert.equal(apex.regionalScanRadiusM, 450.0);
});

test('v170 Chantier LD 8: HumanQaLevelDesignVerticalityNavDirector provides altimetric elevation, vantage scoring and fall risk ratings', () => {
  const nav = new HumanQaLevelDesignVerticalityNavDirector();

  // High ground evaluation
  const highGround = nav.evaluateVerticalVantage(24.0, 2.0, 8);
  assert.equal(highGround.currentElevationM, 24.0);
  assert.ok(highGround.vantageScorePct >= 75.0);
  assert.equal(highGround.tacticalRating, 'DOMINANT_HIGH_GROUND');
  assert.equal(highGround.fallRiskCategory, 'HEAVY_IMPACT_DAMAGE');

  // Canopy runway node graph
  const nodes = nav.updateCanopyRunwayNodes([
    { id: 'runway-1', heightM: 24.0, jumpDistanceM: 4.5 },
    { id: 'runway-2', heightM: 23.5, jumpDistanceM: 8.2 }
  ]);
  assert.equal(nodes.nodeCount, 2);
  assert.equal(nodes.reachableNodesCount, 1);
});

test('v170 Chantier LD 9: AudioSynthesizer computes level design acoustics and executes 15 procedural LD audio methods', () => {
  assert.equal(typeof audioSynth.computeAmmoniaVaporJetAcoustics, 'function');
  assert.equal(typeof audioSynth.computePyramidStoneMonolithGrindAcoustics, 'function');

  // Math Acoustics 1: Ammonia Vapor Jet
  const ammoniaAcoustics = audioSynth.computeAmmoniaVaporJetAcoustics(12.0, 25.0, -8.0);
  assert.ok(ammoniaAcoustics.sonicChokedFlowMps > 300.0);
  assert.ok(ammoniaAcoustics.jetHissDecibels > 100);
  assert.ok(ammoniaAcoustics.cryogenicFrostRadiusM > 4.0);

  // Math Acoustics 2: Monolith Stone Grind
  const stoneAcoustics = audioSynth.computePyramidStoneMonolithGrindAcoustics(20.0, 0.55, 0.65);
  assert.ok(stoneAcoustics.frictionForceN > 100000);
  assert.ok(stoneAcoustics.lowFreqSeismicRumbleHz < 40);
  assert.ok(stoneAcoustics.grindDecibels > 90);

  // 15 Procedural Level Design SFX methods
  const ldSfxMethods = [
    'playAmmoniaPipePunctureHiss',
    'playMeatCarcassConveyorRattle',
    'playPyramidMonolithStoneGrind',
    'playPyramidSacrificialPitSpikeThud',
    'playTrapperStockadeWoodSplinter',
    'playQuicklimePitCausticSizzle',
    'playKineticForcefieldHumLoop',
    'playForcefieldOverloadSparksBurst',
    'playCanopyBranchTraverseCreak',
    'playAerialPounceWindRush',
    'playRavineEchoWindHowl',
    'playSubstationTransformerHighVoltageHum',
    'playSubstationBlackoutPowerDown',
    'playBioMaskVerticalTopographyPing',
    'playCatwalkSteelMeshFootstepThud'
  ];

  for (const method of ldSfxMethods) {
    assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method](), `Calling ${method} should not throw`);
  }
});

test('v170 Chantier LD 10: HumanQaLevelDesignDestructibleCoverAuditor resolves material resistance, penetration, spalling and collapse', () => {
  const timberCover = new HumanQaLevelDesignDestructibleCoverAuditor({
    coverId: 'palisade-log-01',
    materialType: 'OAK_TIMBER',
    coverThicknessCm: 25.0,
    maxStructuralHealth: 350.0
  });

  assert.equal(timberCover.currentStructuralHealth, 350.0);

  // Ballistic impact with partial damage and spalling
  const hit1 = timberCover.resolveCoverImpact(180.0, 'BALLISTIC');
  assert.ok(hit1.currentHealth < 350.0);
  assert.equal(hit1.isCollapsed, false);
  assert.ok(hit1.spallFragmentCount > 0);

  // Massive plasma strike breaching and collapsing the cover
  const hit2 = timberCover.resolveCoverImpact(450.0, 'PLASMA');
  assert.equal(hit2.isCollapsed, true);
  assert.equal(hit2.isBreached, true);
  assert.equal(hit2.penetrated, true);
});
