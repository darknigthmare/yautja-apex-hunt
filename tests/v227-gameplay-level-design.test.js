import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MacShavingRazorTrackingAndClayTrapSector } from '../src/gameplay/Predator1987MacShavingRazorTrackingAndClayTrapSector.js';
import { Predator21990CityHunterNetCutterAndRooftopChasmLeapSector } from '../src/gameplay/Predator21990CityHunterNetCutterAndRooftopChasmLeapSector.js';
import { Avp2004CelticBattleAxeTailSeverAndFacehuggerNettingSector } from '../src/gameplay/Avp2004CelticBattleAxeTailSeverAndFacehuggerNettingSector.js';
import { AvpRequiem2007SewerTunnelMinefieldAndDualWhipLashSector } from '../src/gameplay/AvpRequiem2007SewerTunnelMinefieldAndDualWhipLashSector.js';
import { Predators2010BerserkerArmoredMaskHUDAndPlasmaCannonRipSector } from '../src/gameplay/Predators2010BerserkerArmoredMaskHUDAndPlasmaCannonRipSector.js';
import { Prey2022SnakeDecapitationAndOmnipotentSanctumSector } from '../src/gameplay/Prey2022SnakeDecapitationAndOmnipotentSanctumSector.js';
import { PredatorFranchiseOmnipotentApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseOmnipotentApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseOmnipotentApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseOmnipotentApexHUDDirector.js';
import { HumanQaPredatorFranchiseOmnipotentApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseOmnipotentApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v227 - Predator Franchise Omnipotent Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): Mac shaving razor snap vendetta, luminescent blood trail, canopy seismic detection & clay decoy trench (+350 Honor)', () => {
    const sector = new Predator1987MacShavingRazorTrackingAndClayTrapSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.trackLuminescentBloodTrailUnderbrush(), /Must snap shaving razor/);

    const snapRes = sector.snapShavingRazorVendetta({
      razorSnapForceNewtons: 280,
      whisperedVendettaVowConfirmed: true
    });
    assert.equal(snapRes.shavingRazorSnapped, true);

    const bloodRes = sector.trackLuminescentBloodTrailUnderbrush({
      luminescenceWavelengthNm: 520,
      bloodTrailDistanceMeters: 35
    });
    assert.equal(bloodRes.luminescentBloodTrailTracked, true);

    const detectRes = sector.detectBootVibrationsFromCanopy({
      seismicVibrationAmplitudeMm: 1.4,
      canopyBranchElevationMeters: 16
    });
    assert.equal(detectRes.canopyBootVibrationsDetected, true);

    const trenchRes = sector.constructClayDecoyTrenchAndDeadfall({
      trenchDepthMeters: 1.2,
      deadfallLogMassKg: 380
    });
    assert.equal(trenchRes.clayDecoyTrenchConstructed, true);
    assert.equal(trenchRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): rooftop parapet encirclement, net-cutter steel wire shears, 16m alley chasm leap & apartment skylight breach (+400 Honor)', () => {
    const sector = new Predator21990CityHunterNetCutterAndRooftopChasmLeapSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.severSteelCablesWithGauntletNetCutter(), /Must endure encirclement/);

    const encircleRes = sector.endureRooftopParapetEncirclement({
      swatOfficerCount: 8,
      spotlightLuminosityCandela: 85000
    });
    assert.equal(encircleRes.rooftopParapetCornered, true);

    const severRes = sector.severSteelCablesWithGauntletNetCutter({
      cableTensionNewtons: 3800,
      shearBladeSharpnessScore: 0.99
    });
    assert.equal(severRes.steelCablesSeveredWithNetCutter, true);

    const leapRes = sector.executeRooftopChasmLeap({
      chasmWidthMeters: 16,
      fallClearanceElevationMeters: 35
    });
    assert.equal(leapRes.rooftopChasmLeapExecuted, true);

    const breachRes = sector.breachApartmentSkylightIntoBathroom({
      skylightGlassImpactJoules: 6400,
      apartmentEscapeConfirmed: true
    });
    assert.equal(breachRes.apartmentSkylightBreached, true);
    assert.equal(breachRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): ceremonial battle axe, xenomorph tail blade sever, mid-air facehugger netting & corridor plasma incineration (+400 Honor)', () => {
    const sector = new Avp2004CelticBattleAxeTailSeverAndFacehuggerNettingSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.severLungingXenomorphTailBlade(), /Must wield battle axe/);

    const axeRes = sector.wieldCeremonialBattleAxe({
      axeBladeMassKg: 18.5,
      titaniumEdgeHardnessHrc: 64
    });
    assert.equal(axeRes.ceremonialBattleAxeWielded, true);

    const tailRes = sector.severLungingXenomorphTailBlade({
      cleaveForceNewtons: 8800,
      tailBladeLengthCm: 42
    });
    assert.equal(tailRes.xenomorphTailBladeSevered, true);

    const netRes = sector.interceptFacehuggerMidAirWithNetLauncher({
      leapInterceptionVelocityMs: 32,
      hieroglyphWallPinningScore: 0.99
    });
    assert.equal(netRes.facehuggerMidAirNetPinned, true);

    const sealRes = sector.sealCorridorWithPlasmaIncineration({
      plasmaIncinerationJoules: 14500,
      corridorBulkheadCollapsed: true
    });
    assert.equal(sealRes.plasmaIncinerationPassageSealed, true);
    assert.equal(sealRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): stormwater sewer wading, laser claymore minefield, dual tail whip lashing & storm drain bulkhead collapse (+400 Honor)', () => {
    const sector = new AvpRequiem2007SewerTunnelMinefieldAndDualWhipLashSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.plantLaserClaymoreMinefield(), /Must wade tunnel/);

    const wadeRes = sector.wadeStormwaterDrainageTunnel({
      toxicEffluentFlowLpm: 1200,
      tunnelWaterDepthMeters: 0.85
    });
    assert.equal(wadeRes.stormwaterTunnelWaded, true);

    const mineRes = sector.plantLaserClaymoreMinefield({
      mineSpacingMeters: 12,
      laserMineCount: 4
    });
    assert.equal(mineRes.laserClaymoreMinefieldPlanted, true);

    const whipRes = sector.executeDualTailWhipLash({
      whipCrackVelocityMs: 140,
      xenomorphCarapaceSeverCount: 3
    });
    assert.equal(whipRes.dualTailWhipLashExecuted, true);

    const collapseRes = sector.collapseStormDrainBulkhead({
      plasmaDemolitionJoules: 15800,
      tunnelFunnelingConfirmed: true
    });
    assert.equal(collapseRes.sewerBulkheadCollapsed, true);
    assert.equal(collapseRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): Berserker jaw bio-mask, blood-pulse tracking, cannon mount fracture & ripped cannon blast (+450 Honor)', () => {
    const sector = new Predators2010BerserkerArmoredMaskHUDAndPlasmaCannonRipSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.trackBloodPulseAndHeartRate(), /Must equip armored mask/);

    const maskRes = sector.equipBerserkerArmoredMask({
      xenomorphJawTrophyWeightGrams: 480,
      faceplateArmorHardnessMohs: 9.2
    });
    assert.equal(maskRes.berserkerArmoredMaskEquipped, true);

    const pulseRes = sector.trackBloodPulseAndHeartRate({
      quarryHeartRateBpm: 145,
      biometricTrackingAccuracyScore: 0.99
    });
    assert.equal(pulseRes.bloodPulseHeartRateTracked, true);

    const fractureRes = sector.fractureShoulderCannonMountPivot({
      axeStrikeImpactJoules: 5200,
      bracketFractureConfirmed: true
    });
    assert.equal(fractureRes.shoulderCannonPivotFractured, true);

    const blastRes = sector.dischargeRippedPlasmaCannonPointBlank({
      rippedCannonChargeJoules: 16200,
      pointBlankImpactConfirmed: true
    });
    assert.equal(blastRes.rippedPlasmaCannonDischarged, true);
    assert.equal(blastRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): rattlesnake mid-strike decapitation, pit organ infrared calibration, quicksand rim anchor & Sanctum ascension (+500 Honor)', () => {
    const sector = new Prey2022SnakeDecapitationAndOmnipotentSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.calibratePitOrganInfraredTelemetry(), /Must catch rattlesnake/);

    const snakeRes = sector.catchRattlesnakeMidStrike({
      reactionTimeSeconds: 0.08,
      thumbDecapitationForceNewtons: 850
    });
    assert.equal(snakeRes.rattlesnakeMidStrikeCaught, true);

    const calibRes = sector.calibratePitOrganInfraredTelemetry({
      pitOrganSensitivityMk: 3.5,
      maskSensorCalibrationScore: 0.99
    });
    assert.equal(calibRes.pitOrganInfraredCalibrated, true);

    const quicksandRes = sector.anchorQuicksandRimLeverage({
      hunterMassKg: 240,
      mudSinkLeverageScore: 0.99
    });
    assert.equal(quicksandRes.quicksandRimLeverageAnchored, true);

    const sanctumRes = sector.ascendToOmnipotentApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 15800,
      synthSyncIndex: 0.99,
      omnipotentSealGlyph: 'OMNIPOTENT_1987_2025'
    });
    assert.equal(sanctumRes.omnipotentApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseOmnipotentApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: isYautja: true, HP <= 0, valid arena -> ALLOWED
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_OMNIPOTENT_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: isYautja: false (Human player) -> FORBIDDEN
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_OMNIPOTENT_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: isYautja: true, HP > 0 (Hunter still alive) -> FORBIDDEN
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 45,
      arenaConfig: 'PREDATOR_FRANCHISE_OMNIPOTENT_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: isYautja: true, HP <= 0, wrong config -> FORBIDDEN
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'INVALID_PANTHEON_SECTOR'
    });
    assert.equal(c4.allowed, false);

    // Attempt arming under invalid condition throws
    assert.throws(() => sector.armDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_OMNIPOTENT_APEX_SANCTUM'
    }), /Rule 3 Violation/);

    // Valid arming & execution
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_OMNIPOTENT_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterOmnipotentGlyphsSequence({
      glyphs: ['᚛', 'ᚉ', 'ᚑ', 'ᚏ', '᚜']
    });
    assert.equal(glyphRes.omnipotentGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({
      laughterDecibels: 140,
      mockeryFrequencyHz: 590
    });
    assert.equal(roarRes.finalRoarEchoed, true);

    const purgeRes = sector.executeOmnipotentMicroNuclearPurge({
      countdownSeconds: 10.5,
      blastRadiusMeters: 105
    });
    assert.equal(purgeRes.nuclearDetonationExecuted, true);
    assert.equal(purgeRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const director = new HumanQaPredatorFranchiseOmnipotentApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v227');
    assert.equal(snapshot.pantheon, 'Omnipotent Apex (1987-2025)');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.snapShavingRazorVendetta({ razorSnapForceNewtons: 280, whisperedVendettaVowConfirmed: true });
    director.sectors.predator1987.trackLuminescentBloodTrailUnderbrush({ luminescenceWavelengthNm: 520, bloodTrailDistanceMeters: 35 });
    director.sectors.predator1987.detectBootVibrationsFromCanopy({ seismicVibrationAmplitudeMm: 1.4, canopyBranchElevationMeters: 16 });
    director.sectors.predator1987.constructClayDecoyTrenchAndDeadfall({ trenchDepthMeters: 1.2, deadfallLogMassKg: 380 });

    director.sectors.predator21990.endureRooftopParapetEncirclement({ swatOfficerCount: 8, spotlightLuminosityCandela: 85000 });
    director.sectors.predator21990.severSteelCablesWithGauntletNetCutter({ cableTensionNewtons: 3800, shearBladeSharpnessScore: 0.99 });
    director.sectors.predator21990.executeRooftopChasmLeap({ chasmWidthMeters: 16, fallClearanceElevationMeters: 35 });
    director.sectors.predator21990.breachApartmentSkylightIntoBathroom({ skylightGlassImpactJoules: 6400, apartmentEscapeConfirmed: true });

    director.sectors.avp2004.wieldCeremonialBattleAxe({ axeBladeMassKg: 18.5, titaniumEdgeHardnessHrc: 64 });
    director.sectors.avp2004.severLungingXenomorphTailBlade({ cleaveForceNewtons: 8800, tailBladeLengthCm: 42 });
    director.sectors.avp2004.interceptFacehuggerMidAirWithNetLauncher({ leapInterceptionVelocityMs: 32, hieroglyphWallPinningScore: 0.99 });
    director.sectors.avp2004.sealCorridorWithPlasmaIncineration({ plasmaIncinerationJoules: 14500, corridorBulkheadCollapsed: true });

    director.sectors.avpRequiem2007.wadeStormwaterDrainageTunnel({ toxicEffluentFlowLpm: 1200, tunnelWaterDepthMeters: 0.85 });
    director.sectors.avpRequiem2007.plantLaserClaymoreMinefield({ mineSpacingMeters: 12, laserMineCount: 4 });
    director.sectors.avpRequiem2007.executeDualTailWhipLash({ whipCrackVelocityMs: 140, xenomorphCarapaceSeverCount: 3 });
    director.sectors.avpRequiem2007.collapseStormDrainBulkhead({ plasmaDemolitionJoules: 15800, tunnelFunnelingConfirmed: true });

    director.sectors.predators2010.equipBerserkerArmoredMask({ xenomorphJawTrophyWeightGrams: 480, faceplateArmorHardnessMohs: 9.2 });
    director.sectors.predators2010.trackBloodPulseAndHeartRate({ quarryHeartRateBpm: 145, biometricTrackingAccuracyScore: 0.99 });
    director.sectors.predators2010.fractureShoulderCannonMountPivot({ axeStrikeImpactJoules: 5200, bracketFractureConfirmed: true });
    director.sectors.predators2010.dischargeRippedPlasmaCannonPointBlank({ rippedCannonChargeJoules: 16200, pointBlankImpactConfirmed: true });

    director.sectors.prey2022.catchRattlesnakeMidStrike({ reactionTimeSeconds: 0.08, thumbDecapitationForceNewtons: 850 });
    director.sectors.prey2022.calibratePitOrganInfraredTelemetry({ pitOrganSensitivityMk: 3.5, maskSensorCalibrationScore: 0.99 });
    director.sectors.prey2022.anchorQuicksandRimLeverage({ hunterMassKg: 240, mudSinkLeverageScore: 0.99 });
    director.sectors.prey2022.ascendToOmnipotentApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 15800,
      synthSyncIndex: 0.99,
      omnipotentSealGlyph: 'OMNIPOTENT_1987_2025'
    });

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_OMNIPOTENT_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterOmnipotentGlyphsSequence({ glyphs: ['᚛', 'ᚉ', 'ᚑ', 'ᚏ', '᚜'] });
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar({ laughterDecibels: 140, mockeryFrequencyHz: 590 });
    director.sectors.defeatProtocol.executeOmnipotentMicroNuclearPurge({ countdownSeconds: 10.5, blastRadiusMeters: 105 });

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseOmnipotentApexMasterAuditor();
    const results = auditor.runFullAuditSuite();

    assert.equal(results.version, 'v227');
    assert.equal(results.allSectorsCompleted, true);
    assert.equal(results.totalHonorAwarded, 3000);
    assert.equal(results.maxHonorPossible, 3000);
    assert.equal(results.rule3Compliant, true);
    assert.equal(results.rule3Validation.case1_validYautjaLossConfig, true);
    assert.equal(results.rule3Validation.case2_humanForbidden, true);
    assert.equal(results.rule3Validation.case3_aliveHunterForbidden, true);
    assert.equal(results.rule3Validation.case4_wrongArenaConfigForbidden, true);
    assert.equal(results.webglBudget.drawCalls <= 300, true);
    assert.equal(results.webglBudget.audioLatencyCompliant, true);
    assert.equal(results.isFullyCertified, true);
  });

  it('10. AudioSynthesizer: Omnipotent acoustic models & SFX synthesized', () => {
    const razorAcoustics = audioSynth.computeOmnipotentMacRazorAcoustics({
      razorSnapForceNewtons: 280,
      seismicVibrationAmplitudeMm: 1.4
    });
    assert.equal(razorAcoustics.razorSnapForceNewtons, 280);
    assert.equal(razorAcoustics.seismicVibrationAmplitudeMm, 1.4);
    assert.equal(typeof razorAcoustics.razorSteelSnapPitchHz, 'number');
    assert.equal(typeof razorAcoustics.groundSeismicThudDb, 'number');

    const sewerAcoustics = audioSynth.computeOmnipotentSewerMinefieldAcoustics({
      toxicEffluentFlowLpm: 1200,
      whipCrackVelocityMs: 140
    });
    assert.equal(sewerAcoustics.toxicEffluentFlowLpm, 1200);
    assert.equal(sewerAcoustics.whipCrackVelocityMs, 140);
    assert.equal(typeof sewerAcoustics.sewerFlowGurgleHz, 'number');
    assert.equal(typeof sewerAcoustics.whipShockwaveDecibels, 'number');

    const sfxMethods = [
      'playPredator1987OmnipotentRazorSnapSFX',
      'playPredator1987OmnipotentClayTrenchThudSFX',
      'playPredator21990OmnipotentNetCutterShearSFX',
      'playPredator21990OmnipotentChasmLeapSkylightCrashSFX',
      'playAvp2004OmnipotentBattleAxeTailCleaveSFX',
      'playAvp2004OmnipotentMidAirFacehuggerNetSFX',
      'playAvpRequiem2007OmnipotentSewerLaserMineSFX',
      'playAvpRequiem2007OmnipotentDualWhipBulkheadCollapseSFX',
      'playPredators2010OmnipotentJawMaskTelemetrySFX',
      'playPredators2010OmnipotentRippedCannonBlastSFX',
      'playPrey2022OmnipotentSnakeReflexDecapitationSFX',
      'playPrey2022OmnipotentQuicksandRimLeverageSFX',
      'playPredatorFranchiseOmnipotentApexNuclearPurgeSFX',
      'playPredatorFranchiseOmnipotentVictoryAnthemSFX',
      'playPredatorFranchiseOmnipotentSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
