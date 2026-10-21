import test from 'node:test';
import assert from 'node:assert/strict';

import { PyramidSacrificialPitChuteSector } from '../src/gameplay/PyramidSacrificialPitChuteSector.js';
import { GunnisonRainCemeteryCryptSector } from '../src/gameplay/GunnisonRainCemeteryCryptSector.js';
import { NolandDrillingShipRustMazeSector } from '../src/gameplay/NolandDrillingShipRustMazeSector.js';
import { StargazerGeneticArmoryContainmentSector } from '../src/gameplay/StargazerGeneticArmoryContainmentSector.js';
import { CaveBearDenRockPillarSector } from '../src/gameplay/CaveBearDenRockPillarSector.js';
import { ElRookApartmentBreachSector } from '../src/gameplay/ElRookApartmentBreachSector.js';
import { GuerrillaCampCompoundPerimeterSector } from '../src/gameplay/GuerrillaCampCompoundPerimeterSector.js';
import { HumanQaLevelDesignPenetrationMaterialHUDDirector } from '../src/gameplay/HumanQaLevelDesignPenetrationMaterialHUDDirector.js';
import { HumanQaLevelDesignWallBangDestructionAuditor } from '../src/gameplay/HumanQaLevelDesignWallBangDestructionAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v172 Chantier LD 1: PyramidSacrificialPitChuteSector simulates trapdoor drop chutes, hieroglyphic plates and grapple ascension', () => {
  const pit = new PyramidSacrificialPitChuteSector();
  assert.equal(pit.chuteDropDepthM, 18.0);
  assert.equal(pit.trapdoorOpen, false);

  // Trapdoor drop with grapple arrest
  const dropWithGrapple = pit.triggerTrapdoorDropChute(140.0, true);
  assert.equal(dropWithGrapple.triggered, true);
  assert.equal(dropWithGrapple.fallArrestedByGrapple, true);
  assert.equal(dropWithGrapple.fallDamage, 0);
  assert.ok(dropWithGrapple.fallVelocityMps > 15.0);

  // Hieroglyphic sequence plate
  const puzzle = pit.solveHieroglyphicPressurePlate('PYRAMID_RITUAL_SEQUENCE');
  assert.equal(puzzle.success, true);
  assert.equal(puzzle.escapeHatchUnlocked, true);

  // Vertical shaft ascent
  const ascent = pit.ascendVerticalShaftWithGrapple(12.0);
  assert.equal(ascent.success, true);
  assert.equal(ascent.upperChamberReached, true);
  assert.equal(ascent.staminaCost, 20);
});

test('v172 Chantier LD 2: GunnisonRainCemeteryCryptSector handles granite mausoleums, grave soil collapses and midnight lightning', () => {
  const cemetery = new GunnisonRainCemeteryCryptSector();
  assert.equal(cemetery.mausoleumCount, 6);

  // Mausoleum shelter access
  const cryptAccess = cemetery.accessMausoleumShelter('crypt-granite-01');
  assert.equal(cryptAccess.success, true);
  assert.equal(cryptAccess.interiorThermalShieldingPct, 99.0);
  assert.equal(cryptAccess.rainShielded, true);

  // Grave soil collapse
  const collapse = cemetery.evaluateGraveSoilStability(6.5, true);
  assert.equal(collapse.collapsed, true);
  assert.equal(collapse.vaultCaveInDepthM, 2.2);
  assert.ok(collapse.mudSlideEntrapmentDurationSec > 0);

  // Lightning flash
  const lightning = cemetery.triggerMidnightLightningFlash();
  assert.equal(lightning.lightningFlashActive, true);
  assert.equal(lightning.cloakRefractionFlareDurationMs, 250);
  assert.ok(lightning.thunderDecibels > 100);
});

test('v172 Chantier LD 3: NolandDrillingShipRustMazeSector simulates tin can tripwires, furnace flue thermal masking and bulkhead doors', () => {
  const rustMaze = new NolandDrillingShipRustMazeSector();
  assert.equal(rustMaze.furnaceTempC, 450.0);

  // Crouch sneak past tin can tripwire
  const sneak = rustMaze.checkTinCanAcousticTripwire('tripwire-can-01', true);
  assert.equal(sneak.triggered, false);
  assert.equal(sneak.silentPassage, true);

  // Sprint trigger tin can tripwire
  const trigger = rustMaze.checkTinCanAcousticTripwire('tripwire-can-01', false);
  assert.equal(trigger.triggered, true);
  assert.equal(trigger.acousticClatterDecibels, 78);
  assert.equal(trigger.ambushPositionCompromised, true);

  // Furnace chimney flue thermal mask
  const flue = rustMaze.enterFurnaceChimneyThermalMask();
  assert.equal(flue.success, true);
  assert.equal(flue.bodyHeatContrastSaturatedPct, 100.0);
  assert.equal(flue.infraredTrackingImmunity, true);

  // Bulkhead seal
  const bulkhead = rustMaze.sealRustedBulkheadDoor();
  assert.equal(bulkhead.success, true);
  assert.equal(bulkhead.bulkheadSealed, true);
});

test('v172 Chantier LD 4: StargazerGeneticArmoryContainmentSector resolves epoxy floor slides, cryo tank ruptures and biometric overrides', () => {
  const armory = new StargazerGeneticArmoryContainmentSector();
  assert.equal(armory.epoxyFrictionMu, 0.22);

  // Epoxy power slide
  const slide = armory.executeEpoxyPowerSlide(8.5);
  assert.equal(slide.success, true);
  assert.ok(slide.slideDistanceM > 5.0);
  assert.equal(slide.duckedUnderCrossfire, true);
  assert.equal(slide.iFramesDurationMs, 180);

  // Rupture cryo tank
  const rupture = armory.ruptureCryoSpecimenTank(140);
  assert.equal(rupture.success, true);
  assert.equal(rupture.spillTempC, -196.0);
  assert.equal(rupture.floorConvertedToBrittleIce, true);

  // Biometric override
  const override = armory.overrideBiometricLockdown();
  assert.equal(override.success, true);
  assert.equal(override.blastDoorsLocked, false);
});

test('v172 Chantier LD 5: CaveBearDenRockPillarSector handles root curtain entrance, limestone pillar cover and ledge plunge strikes', () => {
  const den = new CaveBearDenRockPillarSector();
  assert.equal(den.ledgeElevationM, 7.5);

  // Tree root curtain
  const roots = den.passThroughTreeRootCurtain();
  assert.equal(roots.success, true);
  assert.equal(roots.entranceConcealmentPct, 100.0);
  assert.equal(roots.exteriorSnipersLineOfSightBlocked, true);

  // Pillar collision cover
  const pillarHit = den.resolvePillarCollisionCover('pillar-limestone-01', 450.0);
  assert.equal(pillarHit.success, true);
  assert.equal(pillarHit.absorbedEnergyJoules, 450.0);
  assert.equal(pillarHit.beastStunnedAgainstPillar, true);

  // Pebble floor acoustic crunch
  const crunch = den.treadPebbleFloor(false);
  assert.equal(crunch.gravelCrunchDecibels, 62);
  assert.equal(crunch.beastDetectionChancePct, 80.0);

  // Ledge plunge strike
  const plunge = den.executeLedgePlungeStrike();
  assert.equal(plunge.success, true);
  assert.equal(plunge.dropCrushDamage, 260);
  assert.ok(plunge.plungeKineticEnergyJ > 10000);
});

test('v172 Chantier LD 6: ElRookApartmentBreachSector simulates drywall wall-bang attacks, light shooting and fire escape vaults', () => {
  const apartment = new ElRookApartmentBreachSector();
  assert.equal(apartment.drywallThicknessCm, 12.0);

  // Drywall wall-bang
  const wallBang = apartment.resolveDrywallWallBangAttack(320.0, 'SPEARGUN');
  assert.equal(wallBang.penetrated, true);
  assert.equal(wallBang.targetBehindWallHit, true);
  assert.ok(wallBang.residualEnergyJoules > 200.0);

  // Shoot out hallway lights
  const lights = apartment.shootOutHallwayLightFixtures();
  assert.equal(lights.success, true);
  assert.equal(lights.hallwayLightsActive, false);
  assert.equal(lights.predatorThermalPredominance, true);

  // Fire escape vault
  const fireEscape = apartment.vaultToExteriorFireEscape();
  assert.equal(fireEscape.success, true);
  assert.equal(fireEscape.fireEscapeElevationM, 14.0);
});

test('v172 Chantier LD 7: GuerrillaCampCompoundPerimeterSector resolves fuel drum chain explosions, sandbag cover and watchtower perches', () => {
  const camp = new GuerrillaCampCompoundPerimeterSector();
  assert.equal(camp.fuelDrumCount, 8);

  // Fuel drum chain explosion
  const explosion = camp.detonateFuelDrumCache(true);
  assert.equal(explosion.detonated, true);
  assert.equal(explosion.totalBlastDamage, 920);
  assert.equal(explosion.blastRadiusM, 12.5);
  assert.equal(explosion.fireballTempC, 750.0);

  // Sandbag pillbox cover
  const pillbox = camp.resolveSandbagPillboxCover(450.0);
  assert.equal(pillbox.absorbedEnergyJoules, 450.0);
  assert.equal(pillbox.penetrated, false);
  assert.equal(pillbox.occupantProtected, true);

  // Watchtower infiltration
  const tower = camp.infiltrateGuardWatchtower();
  assert.equal(tower.success, true);
  assert.equal(tower.watchtowerElevationM, 10.0);
});

test('v172 Chantier LD 8: HumanQaLevelDesignPenetrationMaterialHUDDirector scans wall density, thickness and wall-bang feasibility', () => {
  const scanner = new HumanQaLevelDesignPenetrationMaterialHUDDirector();

  // Drywall scan
  const drywallScan = scanner.scanWallPartitionProperties('PLASTERBOARD_DRYWALL', 12.0, 2.5);
  assert.equal(drywallScan.materialType, 'PLASTERBOARD_DRYWALL');
  assert.equal(drywallScan.wallBangFeasible, true);
  assert.ok(drywallScan.speargunPenetrationPct > 65);

  // Concrete scan
  const concreteScan = scanner.scanWallPartitionProperties('REINFORCED_CONCRETE', 30.0, 2.0);
  assert.equal(concreteScan.materialType, 'REINFORCED_CONCRETE');
  assert.equal(concreteScan.speargunPenetrationPct < 50, true);
});

test('v172 Chantier LD 9: AudioSynthesizer computes thermal flue & wall-bang acoustics and executes 15 procedural LD audio methods', () => {
  assert.equal(typeof audioSynth.computeFurnaceFlueThermalConvectionAcoustics, 'function');
  assert.equal(typeof audioSynth.computeWallBangPenetrationAcoustics, 'function');

  // Math Acoustics 1: Furnace Flue Thermal Convection
  const flueAcoustics = audioSynth.computeFurnaceFlueThermalConvectionAcoustics(22.0, 450.0, 14.2);
  assert.ok(flueAcoustics.flueFundamentalResonanceHz > 0);
  assert.ok(flueAcoustics.thermalUpdraftDecibels > 80);
  assert.ok(flueAcoustics.acousticMaskingRadiusM > 10.0);

  // Math Acoustics 2: Wall-Bang Penetration
  const wallBangAcoustics = audioSynth.computeWallBangPenetrationAcoustics('PLASTERBOARD_DRYWALL', 480.0, 12.0);
  assert.equal(wallBangAcoustics.peakExitHz, 3400);
  assert.ok(wallBangAcoustics.penetrationImpactDecibels > 80);
  assert.ok(wallBangAcoustics.spallDebrisDurationMs > 50.0);

  // 15 Procedural Level Design SFX methods
  const v172SfxMethods = [
    'playPyramidTrapdoorHingedDropThud',
    'playCemeteryGraniteMausoleumDoorSlide',
    'playNolandRustCorridorCanTripwireClatter',
    'playFurnaceFlueThermalRoar',
    'playEpoxyFloorPowerSlideSqueal',
    'playCaveBearGravelFootstepCrunch',
    'playDrywallWallBangPenetrationSnap',
    'playFuelDrumExplosiveChainDetonation',
    'playMausoleumRainDripCavernEcho',
    'playSandbagPillboxBulletThud',
    'playBiometricBlastDoorHydraulicHiss',
    'playTreeRootCurtainPartingRustle',
    'playTinBarracksRoofRainDrumming',
    'playWallPenetrationScanPulsePing',
    'playFireEscapeRustedLadderRattle'
  ];

  for (const method of v172SfxMethods) {
    assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method](), `Calling ${method} should not throw`);
  }
});

test('v172 Chantier LD 10: HumanQaLevelDesignWallBangDestructionAuditor resolves ballistic through-wall dissipation and breach holes', () => {
  const auditor = new HumanQaLevelDesignWallBangDestructionAuditor();

  // Drywall speargun shot
  const shot1 = auditor.resolveThroughWallBallisticShot(350.0, 'SPEARGUN', 'PLASTERBOARD_DRYWALL', 12.0);
  assert.equal(shot1.penetrated, true);
  assert.ok(shot1.residualEnergyJoules > 250.0);
  assert.equal(shot1.lineOfSightOpened, true);
  assert.equal(shot1.totalBreachesCount, 1);

  // Line of sight murder hole gap calculation
  const gap = auditor.calculateLineOfSightBreachGap(shot1.breachHoleDiameterCm);
  assert.equal(gap.thermalSilhouetteVisible, true);
  assert.ok(gap.sightlineApertureAngleDeg > 0);
});
