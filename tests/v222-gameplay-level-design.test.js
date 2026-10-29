import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MudCamoReapplicationAndWaterfallPlungeSector } from '../src/gameplay/Predator1987MudCamoReapplicationAndWaterfallPlungeSector.js';
import { Predator21990SubCarriageTrackSweepAndJerryMacheteSector } from '../src/gameplay/Predator21990SubCarriageTrackSweepAndJerryMacheteSector.js';
import { Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector } from '../src/gameplay/Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector.js';
import { AvpRequiem2007MaternityWardNestAndDissolverBombSector } from '../src/gameplay/AvpRequiem2007MaternityWardNestAndDissolverBombSector.js';
import { Predators2010BerserkerGatlingOverloadAndClassicLiberationSector } from '../src/gameplay/Predators2010BerserkerGatlingOverloadAndClassicLiberationSector.js';
import { Prey2022QuicksandDecoyAndGalactiqueApexSanctumSector } from '../src/gameplay/Prey2022QuicksandDecoyAndGalactiqueApexSanctumSector.js';
import { PredatorFranchiseGalactiqueApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseGalactiqueApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseGalactiqueApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseGalactiqueApexHUDDirector.js';
import { HumanQaPredatorFranchiseGalactiqueApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseGalactiqueApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v222 - Predator Franchise Galactique Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): waterfall drop, mineral mud packing, bamboo deadfall & thermal torch decoy (+350 Honor)', () => {
    const sector = new Predator1987MudCamoReapplicationAndWaterfallPlungeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.packMineralMudClayAcrossBody(), /Must complete waterfall plunge/);

    const plungeRes = sector.plungeDownRushingWaterfall({
      waterfallDropMeters: 38,
      poolEntrySpeedMs: 26.5
    });
    assert.equal(plungeRes.waterfallPlungeCompleted, true);

    const mudRes = sector.packMineralMudClayAcrossBody({
      mudLayerThicknessMm: 16,
      skinCoveragePercent: 100
    });
    assert.equal(mudRes.mineralMudClayPacked, true);

    const trapRes = sector.constructBambooDeadfallTrap({
      logSpikeCount: 14,
      counterweightMassKg: 320
    });
    assert.equal(trapRes.bambooDeadfallConstructed, true);

    const torchRes = sector.igniteTorchAndLureHunterToKillzone({
      torchThermalOutputCelsius: 680,
      hunterInKillzoneConfirmed: true
    });
    assert.equal(torchRes.thermalTorchDecoyLured, true);
    assert.equal(torchRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): third-rail arcs, commuter catwalk, undercarriage disc sweep & caster shatter (+400 Honor)', () => {
    const sector = new Predator21990SubCarriageTrackSweepAndJerryMacheteSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.evacuateCommutersToTunnelCatwalk(), /Must evade third-rail arcs/);

    const arcRes = sector.evadeThirdRailElectricalArcs({
      thirdRailVoltage: 750,
      sparkGapMeters: 0.8
    });
    assert.equal(arcRes.thirdRailArcEvaded, true);

    const evacRes = sector.evacuateCommutersToTunnelCatwalk({
      commuterCount: 18,
      catwalkSecured: true
    });
    assert.equal(evacRes.commutersEvacuatedToCatwalk, true);

    const discRes = sector.executeUndercarriageSmartDiscSweep({
      discRotationRpm: 6400,
      steelConduitSevered: true
    });
    assert.equal(discRes.undercarriageDiscSweepExecuted, true);

    const shatterRes = sector.shatterCasterMountWithPointBlankSlug({
      slugImpactJoules: 4900,
      casterMountDestroyed: true
    });
    assert.equal(shatterRes.plasmaCasterMountShattered, true);
    assert.equal(shatterRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): drone tail sever, carapace shield forge, acid clan mark & Grid Alien impale (+400 Honor)', () => {
    const sector = new Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.forgeAcidProofCarapaceShield(), /Must sever tail barb/);

    const severRes = sector.severDroneTailBarbAtSacrificialAltar({
      tailSeverForceNewtons: 7400,
      barbLengthCm: 38
    });
    assert.equal(severRes.droneTailBarbSevered, true);

    const shieldRes = sector.forgeAcidProofCarapaceShield({
      dorsalPlateThicknessMm: 28,
      acidResistancePh: 0.2
    });
    assert.equal(shieldRes.carapaceShieldForged, true);

    const etchRes = sector.etchClanLightningBoltMarkWithAcid({
      fingertipAcidImmersionSeconds: 2.5,
      clanMarkSymbol: 'LIGHTNING_BOLT_CLAN_MARK'
    });
    assert.equal(etchRes.acidClanMarkEtched, true);

    const repelRes = sector.repelGridAlienAmbushWithShieldAndSpear({
      shieldDeflectionJoules: 6200,
      tailSpearImpaleConfirmed: true
    });
    assert.equal(repelRes.gridAlienAmbushRepelled, true);
    assert.equal(repelRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): maternity ward infiltration, laser claymores, dissolver canister & hive liquefaction (+400 Honor)', () => {
    const sector = new AvpRequiem2007MaternityWardNestAndDissolverBombSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.deployLaserClaymorePerimeterMines(), /Must infiltrate hive/);

    const infilRes = sector.infiltrateMaternityWardHive({
      hiveSporeConcentrationPpm: 480,
      ambientDarknessLux: 1.2
    });
    assert.equal(infilRes.maternityWardHiveInfiltrated, true);

    const clayRes = sector.deployLaserClaymorePerimeterMines({
      laserTripwireCount: 4,
      enclosureCorridorAreaM2: 60
    });
    assert.equal(clayRes.laserClaymorePerimeterDeployed, true);

    const plantRes = sector.plantCentralPillarDissolverCharge({
      canisterLiquidVolumeMl: 750,
      purityPercentage: 99.8
    });
    assert.equal(plantRes.dissolverCanisterPlanted, true);

    const detRes = sector.detonateDissolverAndLiquefyHive({
      blastRadiusMeters: 25,
      biomassDissolvedPercent: 100
    });
    assert.equal(detRes.hiveOrganicLiquefactionExecuted, true);
    assert.equal(detRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): Classic liberation, gauntlet re-arm, rotary minigun overload & twin blade duel (+450 Honor)', () => {
    const sector = new Predators2010BerserkerGatlingOverloadAndClassicLiberationSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.rearmGauntletAndAlignPlasmaCaster(), /Must liberate Classic Predator/);

    const libRes = sector.liberateClassicPredatorFromTotem({
      bondCuttingForceNewtons: 5600,
      classicHonorCodeAcknowledged: true
    });
    assert.equal(libRes.classicPredatorLiberated, true);

    const armRes = sector.rearmGauntletAndAlignPlasmaCaster({
      plasmaCapacitorJoules: 8500,
      targetingAlignmentScore: 0.99
    });
    assert.equal(armRes.gauntletPlasmaCasterArmed, true);

    const overRes = sector.detonateRotaryGatlingWithPlasmaVolley({
      duelPlasmaVolleyJoules: 15200,
      minigunDetonationConfirmed: true
    });
    assert.equal(overRes.rotaryGatlingOverloadDetonated, true);

    const duelRes = sector.engageBerserkerTwinBladeMeleeDuel({
      berserkerBloodRageVelocityMs: 18.5,
      twinBladeParryEfficiency: 0.98
    });
    assert.equal(duelRes.berserkerTwinBladeDuelEngaged, true);
    assert.equal(duelRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): clay mud pit decoy, bone mask reflection, 180° flechette curve & Galactique Sanctum (+500 Honor)', () => {
    const sector = new Prey2022QuicksandDecoyAndGalactiqueApexSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.positionBoneMaskAndReflectTriLaser(), /Must lure Feral into mud pit/);

    const lureRes = sector.lureFeralIntoOrangeClayMudPit({
      mudSinkDepthMeters: 1.6,
      feralImmobilizedScore: 0.98
    });
    assert.equal(lureRes.clayMudPitDecoyLured, true);

    const maskRes = sector.positionBoneMaskAndReflectTriLaser({
      stakeDistanceMeters: 3.2,
      laserAlignmentPrecisionScore: 0.99
    });
    assert.equal(maskRes.boneMaskTriLaserReflected, true);

    const curveRes = sector.confirm180DegreeFlechetteCurveImpact({
      projectileCurveAngleDeg: 180,
      kineticImpactJoules: 5800
    });
    assert.equal(curveRes.flechette180CurveConfirmed, true);

    const sanctumRes = sector.ascendToGalactiqueApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 12500,
      synthSyncIndex: 0.99,
      galactiqueSealGlyph: 'GALACTIQUE_1987_2025'
    });
    assert.equal(sanctumRes.galactiqueApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Galactique Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseGalactiqueApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 75,
      arenaConfig: 'PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_GALACTIQUE_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterGalactiqueGlyphsSequence({ glyphs: ['᚛', 'ᚌ', 'ᚑ', 'ᚏ', '᚜'] });
    assert.equal(glyphRes.galactiqueGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 135, mockeryFrequencyHz: 540 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeGalactiqueMicroNuclearPurge({ countdownSeconds: 13.0, blastRadiusMeters: 80 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Galactique Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseGalactiqueApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all 7 sectors
    director.sectors.predator1987.plungeDownRushingWaterfall();
    director.sectors.predator1987.packMineralMudClayAcrossBody();
    director.sectors.predator1987.constructBambooDeadfallTrap();
    director.sectors.predator1987.igniteTorchAndLureHunterToKillzone();

    director.sectors.predator21990.evadeThirdRailElectricalArcs();
    director.sectors.predator21990.evacuateCommutersToTunnelCatwalk();
    director.sectors.predator21990.executeUndercarriageSmartDiscSweep();
    director.sectors.predator21990.shatterCasterMountWithPointBlankSlug();

    director.sectors.avp2004.severDroneTailBarbAtSacrificialAltar();
    director.sectors.avp2004.forgeAcidProofCarapaceShield();
    director.sectors.avp2004.etchClanLightningBoltMarkWithAcid();
    director.sectors.avp2004.repelGridAlienAmbushWithShieldAndSpear();

    director.sectors.avpRequiem2007.infiltrateMaternityWardHive();
    director.sectors.avpRequiem2007.deployLaserClaymorePerimeterMines();
    director.sectors.avpRequiem2007.plantCentralPillarDissolverCharge();
    director.sectors.avpRequiem2007.detonateDissolverAndLiquefyHive();

    director.sectors.predators2010.liberateClassicPredatorFromTotem();
    director.sectors.predators2010.rearmGauntletAndAlignPlasmaCaster();
    director.sectors.predators2010.detonateRotaryGatlingWithPlasmaVolley();
    director.sectors.predators2010.engageBerserkerTwinBladeMeleeDuel();

    director.sectors.prey2022.lureFeralIntoOrangeClayMudPit();
    director.sectors.prey2022.positionBoneMaskAndReflectTriLaser();
    director.sectors.prey2022.confirm180DegreeFlechetteCurveImpact();
    director.sectors.prey2022.ascendToGalactiqueApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_GALACTIQUE_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterGalactiqueGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeGalactiqueMicroNuclearPurge();

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
    assert.equal(completedSnap.playtesters.length, 5);

    // Verify SSR/Node DOM safe handling
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);
  });

  it('9. Human QA Galactique Apex Master Auditor: full-spectrum certification, Rule 3 & draw calls <= 300', () => {
    const auditor = new HumanQaPredatorFranchiseGalactiqueApexMasterAuditor();
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

  it('10. AudioSynthesizer: Galactique acoustic models & 15 dedicated SFX synthesized', () => {
    const waterfallAcoustics = audioSynth.computeGalactiqueWaterfallPlungeAcoustics({
      waterfallDropMeters: 38,
      poolEntrySpeedMs: 26.5
    });
    assert.equal(waterfallAcoustics.waterfallDropMeters, 38);
    assert.equal(waterfallAcoustics.poolEntrySpeedMs, 26.5);
    assert.equal(typeof waterfallAcoustics.hydraulicTurbulenceDecibels, 'number');
    assert.equal(typeof waterfallAcoustics.cavitationRumbleHz, 'number');

    const hospitalAcoustics = audioSynth.computeGalactiqueHospitalNestAcoustics({
      hiveSporeConcentrationPpm: 480,
      canisterLiquidVolumeMl: 750
    });
    assert.equal(hospitalAcoustics.hiveSporeConcentrationPpm, 480);
    assert.equal(hospitalAcoustics.canisterLiquidVolumeMl, 750);
    assert.equal(typeof hospitalAcoustics.bioResonancePitchHz, 'number');
    assert.equal(typeof hospitalAcoustics.dissolutionHissDecibels, 'number');

    const sfxMethods = [
      'playPredator1987GalactiqueWaterfallPlungeSFX',
      'playPredator1987GalactiqueMudPackingSFX',
      'playPredator21990GalactiqueThirdRailSparkSFX',
      'playPredator21990GalactiqueSubCarriageDiscCleaveSFX',
      'playAvp2004GalactiqueCarapaceShieldForgeSFX',
      'playAvp2004GalactiqueAcidClanMarkBurnSFX',
      'playAvpRequiem2007GalactiqueLaserClaymoreDeploySFX',
      'playAvpRequiem2007GalactiqueDissolverCanisterBlastSFX',
      'playPredators2010GalactiqueClassicPredatorRoarSFX',
      'playPredators2010GalactiqueGatlingOverloadBurstSFX',
      'playPrey2022GalactiqueQuicksandLureSFX',
      'playPrey2022GalactiqueGuidedFlechetteCurveSFX',
      'playPredatorFranchiseGalactiqueApexNuclearPurgeSFX',
      'playPredatorFranchiseGalactiqueVictoryAnthemSFX',
      'playPredatorFranchiseGalactiqueSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
