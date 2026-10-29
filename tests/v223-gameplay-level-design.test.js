import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987ThermalMudDiscoveryAndFlareStandoffSector } from '../src/gameplay/Predator1987ThermalMudDiscoveryAndFlareStandoffSector.js';
import { Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector } from '../src/gameplay/Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector.js';
import { Avp2004GauntletBombDeploymentAndWinchSledRocketSector } from '../src/gameplay/Avp2004GauntletBombDeploymentAndWinchSledRocketSector.js';
import { AvpRequiem2007PowerPlantSubstationLaserAndDualPlasmaSnipingSector } from '../src/gameplay/AvpRequiem2007PowerPlantSubstationLaserAndDualPlasmaSnipingSector.js';
import { Predators2010AncientLandingVesselCockpitAndCyberHoundWhistleSector } from '../src/gameplay/Predators2010AncientLandingVesselCockpitAndCyberHoundWhistleSector.js';
import { Prey2022AshPrairieSpringWireSnareAndLegendaireApexSanctumSector } from '../src/gameplay/Prey2022AshPrairieSpringWireSnareAndLegendaireApexSanctumSector.js';
import { PredatorFranchiseLegendaireApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseLegendaireApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseLegendaireApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseLegendaireApexHUDDirector.js';
import { HumanQaPredatorFranchiseLegendaireApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseLegendaireApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v223 - Predator Franchise Légendaire Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): thermal mud discovery, shallow water blue-shift scan, magnesium flare & optical dazzle (+350 Honor)', () => {
    const sector = new Predator1987ThermalMudDiscoveryAndFlareStandoffSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.endureHunterShallowWaterThermalScan(), /Must discover thermal mud camo/);

    const discRes = sector.discoverColdRiverMudThermalMask({
      clayTempCelsius: 18.5,
      foliageTempCelsius: 19.3
    });
    assert.equal(discRes.thermalMudCamoDiscovered, true);

    const scanRes = sector.endureHunterShallowWaterThermalScan({
      hunterDistanceMeters: 1.2,
      scanSpectrumShift: 'RED_SHIFT_TO_BLUE_SHIFT'
    });
    assert.equal(scanRes.hunterShallowWaterScanEndured, true);

    const primeRes = sector.primeMagnesiumFlareAndDeadfallTripwire({
      flareLuminosityCandela: 45000,
      deadfallTripwireTensionNewtons: 280
    });
    assert.equal(primeRes.magnesiumFlareTripwirePrimed, true);

    const dazzleRes = sector.igniteFlareAndTriggerOpticalDeadfall({
      opticalSensorDazzleDurationSeconds: 4.2,
      deadfallImpactJoules: 6800
    });
    assert.equal(dazzleRes.opticalDazzleDeadfallTriggered, true);
    assert.equal(dazzleRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): sub-zero nitrogen fog, blue-light spectrum shift, curved rail disc toss & Harrigan duel (+400 Honor)', () => {
    const sector = new Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.shiftMaskToBlueLightSpectrum(), /Must endure sub-zero fog/);

    const fogRes = sector.endureSubZeroNitrogenFog({
      nitrogenFogTempCelsius: -196,
      ambientVisibilityMeters: 2.5
    });
    assert.equal(fogRes.subZeroFogEndured, true);

    const shiftRes = sector.shiftMaskToBlueLightSpectrum({
      spectrumWavelengthNm: 460,
      conveyorRailInversionConfirmed: true
    });
    assert.equal(shiftRes.blueLightSpectrumShifted, true);

    const tossRes = sector.executeCurvedRailSmartDiscToss({
      discFlightVelocityMs: 58,
      steamConduitsSeveredCount: 3
    });
    assert.equal(tossRes.curvedRailDiscTossExecuted, true);

    const duelRes = sector.honorHarriganPointBlankDuel({
      shotgunSlugBlastJoules: 5200,
      combistickParrySuccessScore: 0.98
    });
    assert.equal(duelRes.harriganShotgunClashHonored, true);
    assert.equal(duelRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): pedestal bomb countdown, winch sled harness, 610m ice shaft rocket & blizzard breach (+400 Honor)', () => {
    const sector = new Avp2004GauntletBombDeploymentAndWinchSledRocketSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.secureWinchSledHarness(), /Must deploy pedestal bomb/);

    const bombRes = sector.deployPedestalGauntletBombTimer({
      countdownSeconds: 300,
      yieldEquivalentMegajoules: 120000
    });
    assert.equal(bombRes.altarGauntletBombDeployed, true);

    const harnessRes = sector.secureWinchSledHarness({
      harnessTensileStrengthKpa: 8500,
      cooperativeLockConfirmed: true
    });
    assert.equal(harnessRes.winchSledHarnessSecured, true);

    const ascentRes = sector.executeIceShaftRocketAscent({
      shaftHeightMeters: 610,
      ascentVelocityMs: 32
    });
    assert.equal(ascentRes.iceShaftAscentExecuted, true);

    const breachRes = sector.breachSurfaceWhalingStationRuins({
      surfaceGaleWindKnots: 48,
      cavernCollapseEvaded: true
    });
    assert.equal(breachRes.surfaceBlizzardBreached, true);
    assert.equal(breachRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): substation perimeter, 650 THz laser grid, dual plasma high-tension sniping & whip crack (+400 Honor)', () => {
    const sector = new AvpRequiem2007PowerPlantSubstationLaserAndDualPlasmaSnipingSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.synchronizeTurbineRoomLaserGrid(), /Must secure substation perimeter/);

    const subRes = sector.securePowerPlantSubstationPerimeter({
      substationVoltageKv: 24.5,
      transformerCoolantIntegrityPercent: 98
    });
    assert.equal(subRes.substationPerimeterSecured, true);

    const gridRes = sector.synchronizeTurbineRoomLaserGrid({
      laserFrequencyThz: 650,
      beamCuttingJoules: 8500
    });
    assert.equal(gridRes.turbineRoomLaserGridSynchronized, true);

    const snipeRes = sector.snipeCableWarriorsWithDualPlasma({
      cableTargetDistanceMeters: 45,
      dualConvergenceAccuracyScore: 0.99
    });
    assert.equal(snipeRes.highTensionDualPlasmaSnipingExecuted, true);

    const whipRes = sector.crackWhipAcrossChargingDroneVertebrae({
      whipCrackVelocityMs: 125,
      vertebraeSeverConfirmed: true
    });
    assert.equal(whipRes.generatorArrayWhipCrackCompleted, true);
    assert.equal(whipRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): ancient vessel fusion core, celestial star map, cyber-whistle & fusion shockwave (+450 Honor)', () => {
    const sector = new Predators2010AncientLandingVesselCockpitAndCyberHoundWhistleSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.navigateCelestialStarMapHologram(), /Must power up vessel core/);

    const coreRes = sector.powerUpAncientVesselFusionCore({
      corePowerOutputKw: 550,
      plasmaGridStabilized: true
    });
    assert.equal(coreRes.vesselCorePowered, true);

    const mapRes = sector.navigateCelestialStarMapHologram({
      yautjaPrimeCoordinates: 'YAUTJA_PRIME_CORE_SECTOR_7',
      hologramResolutionVoxels: 1048576
    });
    assert.equal(mapRes.celestialStarMapNavigated, true);

    const whistleRes = sector.interceptTrackerCyberWhistleSignal({
      whistleFrequencyKhz: 34.8,
      houndPackScatteredCount: 4
    });
    assert.equal(whistleRes.trackerCyberWhistleIntercepted, true);

    const overloadRes = sector.overloadSubLightFusionManifold({
      fusionSurgePercent: 100,
      defensiveShockwaveRadiusMeters: 85
    });
    assert.equal(overloadRes.subLightFusionShockwaveOverloaded, true);
    assert.equal(overloadRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): ash prairie spring-wire, 180° bone mask reflection, 360° fan shield & Légendaire Sanctum (+500 Honor)', () => {
    const sector = new Prey2022AshPrairieSpringWireSnareAndLegendaireApexSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.redirectBoneMaskTriLaserTelemetry(), /Must deploy spring wire traps/);

    const wireRes = sector.deployAshPrairieSpringWireTraps({
      springTensionNewtons: 4800,
      wireRazorSharpnessScore: 0.99
    });
    assert.equal(wireRes.springWireTrapsDeployed, true);

    const maskRes = sector.redirectBoneMaskTriLaserTelemetry({
      redirectionAngleDeg: 180,
      laserAlignmentPrecisionScore: 0.99
    });
    assert.equal(maskRes.triLaserTelemetryRedirected, true);

    const shieldRes = sector.executeFanShield360MusketDeflection({
      sweepAngleDeg: 360,
      musketVolleyDeflectionJoules: 6400
    });
    assert.equal(shieldRes.fanShield360DeflectionExecuted, true);

    const sanctumRes = sector.ascendToLegendaireApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 13200,
      synthSyncIndex: 0.99,
      legendaireSealGlyph: 'LEGENDAIRE_1987_2025'
    });
    assert.equal(sanctumRes.legendaireApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Légendaire Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseLegendaireApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 65,
      arenaConfig: 'PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_LEGENDAIRE_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterLegendaireGlyphsSequence({ glyphs: ['᚛', 'ᚂ', 'ᚑ', 'ᚏ', '᚜'] });
    assert.equal(glyphRes.legendaireGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 136, mockeryFrequencyHz: 550 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeLegendaireMicroNuclearPurge({ countdownSeconds: 12.5, blastRadiusMeters: 85 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Légendaire Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseLegendaireApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all 7 sectors
    director.sectors.predator1987.discoverColdRiverMudThermalMask();
    director.sectors.predator1987.endureHunterShallowWaterThermalScan();
    director.sectors.predator1987.primeMagnesiumFlareAndDeadfallTripwire();
    director.sectors.predator1987.igniteFlareAndTriggerOpticalDeadfall();

    director.sectors.predator21990.endureSubZeroNitrogenFog();
    director.sectors.predator21990.shiftMaskToBlueLightSpectrum();
    director.sectors.predator21990.executeCurvedRailSmartDiscToss();
    director.sectors.predator21990.honorHarriganPointBlankDuel();

    director.sectors.avp2004.deployPedestalGauntletBombTimer();
    director.sectors.avp2004.secureWinchSledHarness();
    director.sectors.avp2004.executeIceShaftRocketAscent();
    director.sectors.avp2004.breachSurfaceWhalingStationRuins();

    director.sectors.avpRequiem2007.securePowerPlantSubstationPerimeter();
    director.sectors.avpRequiem2007.synchronizeTurbineRoomLaserGrid();
    director.sectors.avpRequiem2007.snipeCableWarriorsWithDualPlasma();
    director.sectors.avpRequiem2007.crackWhipAcrossChargingDroneVertebrae();

    director.sectors.predators2010.powerUpAncientVesselFusionCore();
    director.sectors.predators2010.navigateCelestialStarMapHologram();
    director.sectors.predators2010.interceptTrackerCyberWhistleSignal();
    director.sectors.predators2010.overloadSubLightFusionManifold();

    director.sectors.prey2022.deployAshPrairieSpringWireTraps();
    director.sectors.prey2022.redirectBoneMaskTriLaserTelemetry();
    director.sectors.prey2022.executeFanShield360MusketDeflection();
    director.sectors.prey2022.ascendToLegendaireApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_LEGENDAIRE_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterLegendaireGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeLegendaireMicroNuclearPurge();

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
    assert.equal(completedSnap.playtesters.length, 5);

    // Verify SSR/Node DOM safe handling
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);
  });

  it('9. Human QA Légendaire Apex Master Auditor: full-spectrum certification, Rule 3 & draw calls <= 300', () => {
    const auditor = new HumanQaPredatorFranchiseLegendaireApexMasterAuditor();
    const results = auditor.runFullAuditSuite();

    assert.equal(results.allSectorsCompleted, true);
    assert.equal(results.totalHonorAwarded, 3000);
    assert.equal(results.maxHonorPossible, 3000);
    assert.equal(results.rule3Compliant, true);
    assert.equal(results.rule3Validation.case1_validYautjaLossConfig, true);
    assert.equal(results.rule3Validation.case2_humanForbidden, true);
    assert.equal(results.rule3Validation.case3_aliveHunterForbidden, true);
    assert.equal(results.rule3Validation.case4_wrongArenaConfigForbidden, true);

    // Rendering draw calls budget constraint
    assert.equal(results.webglBudget.drawCalls <= 300, true);
    assert.equal(results.webglBudget.audioLatencyCompliant, true);
    assert.equal(results.isFullyCertified, true);
  });

  it('10. AudioSynthesizer: Légendaire acoustic models & 15 dedicated SFX synthesized', () => {
    const thermalAcoustics = audioSynth.computeLegendaireThermalMudAcoustics({
      clayTempCelsius: 18.5,
      foliageTempCelsius: 19.3
    });
    assert.equal(thermalAcoustics.clayTempCelsius, 18.5);
    assert.equal(thermalAcoustics.foliageTempCelsius, 19.3);
    assert.equal(typeof thermalAcoustics.mudViscosityDampingDb, 'number');
    assert.equal(typeof thermalAcoustics.jungleHumidityFlutterHz, 'number');

    const sledAcoustics = audioSynth.computeLegendaireWinchSledAcoustics({
      shaftHeightMeters: 610,
      ascentVelocityMs: 32
    });
    assert.equal(sledAcoustics.shaftHeightMeters, 610);
    assert.equal(sledAcoustics.ascentVelocityMs, 32);
    assert.equal(typeof sledAcoustics.cableTensionWhineHz, 'number');
    assert.equal(typeof sledAcoustics.iceCavityResonanceDb, 'number');

    const sfxMethods = [
      'playPredator1987LegendaireThermalMudDiscoverySFX',
      'playPredator1987LegendaireFlareDazzleSFX',
      'playPredator21990LegendaireSubZeroNitrogenFogSFX',
      'playPredator21990LegendaireSmartDiscRailSeverSFX',
      'playAvp2004LegendairePedestalBombDeploySFX',
      'playAvp2004LegendaireWinchSledRocketAscentSFX',
      'playAvpRequiem2007LegendaireSubstationLaserGridSFX',
      'playAvpRequiem2007LegendaireDualPlasmaSnipingSFX',
      'playPredators2010LegendaireStarMapHologramSFX',
      'playPredators2010LegendaireTrackerCyberWhistleSFX',
      'playPrey2022LegendaireSpringWireSnareSFX',
      'playPrey2022LegendaireFanShield360DeflectionSFX',
      'playPredatorFranchiseLegendaireApexNuclearPurgeSFX',
      'playPredatorFranchiseLegendaireVictoryAnthemSFX',
      'playPredatorFranchiseLegendaireSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
