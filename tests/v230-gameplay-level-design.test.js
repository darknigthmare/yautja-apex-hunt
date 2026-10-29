import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MayanPyramidAcousticMimicrySector } from '../src/gameplay/Predator1987MayanPyramidAcousticMimicrySector.js';
import { Predator21990MeatLockerUltravioletScanSector } from '../src/gameplay/Predator21990MeatLockerUltravioletScanSector.js';
import { Avp2004WeylandCarcinomaScanAndTorchClashSector } from '../src/gameplay/Avp2004WeylandCarcinomaScanAndTorchClashSector.js';
import { AvpRequiem2007HospitalMaternitySteamBurstSector } from '../src/gameplay/AvpRequiem2007HospitalMaternitySteamBurstSector.js';
import { Predators2010CrucifiedClassicLiberationDuelSector } from '../src/gameplay/Predators2010CrucifiedClassicLiberationDuelSector.js';
import { Prey2022WolfSkullSkinningAndCosmiqueSanctumSector } from '../src/gameplay/Prey2022WolfSkullSkinningAndCosmiqueSanctumSector.js';
import { PredatorFranchiseCosmiqueSupremeApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseCosmiqueSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseCosmiqueSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseCosmiqueSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseCosmiqueSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseCosmiqueSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v230 - Predator Franchise Cosmique Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): Mayan pyramid altar ascent, rain acoustic filter, radio voice mimicry & aqueduct cloak stalking (+350 Honor)', () => {
    const sector = new Predator1987MayanPyramidAcousticMimicrySector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.calibrateRainAcousticBandpassFilter(), /Must ascend Mayan ruins/);

    const ascendRes = sector.ascendMayanPyramidAltar({
      ruinElevationMeters: 38,
      templeOvergrowthDensityScore: 0.94
    });
    assert.equal(ascendRes.mayanRuinsAscended, true);

    const filterRes = sector.calibrateRainAcousticBandpassFilter({
      rainNoiseDecibels: 78,
      bandpassLowHz: 400,
      bandpassHighHz: 3200
    });
    assert.equal(filterRes.rainAcousticFilteringCalibrated, true);

    const voiceRes = sector.broadcastSynthesizedRadioVoiceFragments({
      radioCaptureFidelityScore: 0.99,
      disorientationFactor: 0.95
    });
    assert.equal(voiceRes.radioVoiceMimicryBroadcasted, true);

    const stalkRes = sector.executeAqueductCloakStalking({
      waterCascadeFlowLpm: 950,
      opticalRefractionStabilityScore: 0.99
    });
    assert.equal(stalkRes.aqueductCloakStalkingExecuted, true);
    assert.equal(stalkRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): sub-zero meat locker infiltration, nitrogen thermal masking, UV spectrum switch & rail ambush (+400 Honor)', () => {
    const sector = new Predator21990MeatLockerUltravioletScanSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.detectNitrogenThermalMasking(), /Must infiltrate meat locker/);

    const infiltRes = sector.infiltrateSubZeroMeatLocker({
      ambientTemperatureCelsius: -12,
      hangingCarcassCount: 140
    });
    assert.equal(infiltRes.subZeroMeatLockerInfiltrated, true);

    const nitrogenRes = sector.detectNitrogenThermalMasking({
      infraredThermalSuppressionScore: 0.98,
      nitrogenVaporDensityLpm: 450
    });
    assert.equal(nitrogenRes.nitrogenThermalMaskingDetected, true);

    const uvRes = sector.switchBioMaskToUltravioletSpectrum({
      ultravioletWavelengthNm: 365,
      electromagneticBeaconIdentified: true
    });
    assert.equal(uvRes.ultravioletSpectrumSwitched, true);

    const ambushRes = sector.executeOverheadMeatRailAmbush({
      overheadDropElevationMeters: 5.8,
      wristBladeCleaveForceNewtons: 6400
    });
    assert.equal(ambushRes.overheadMeatRailAmbushExecuted, true);
    assert.equal(ambushRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): Weyland corridor standoff, lung carcinoma diagnostic scan, honor law mercy & oxygen torch clash (+400 Honor)', () => {
    const sector = new Avp2004WeylandCarcinomaScanAndTorchClashSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.diagnoseLungCarcinomaViaBioMask(), /Must initiate standoff/);

    const standRes = sector.initiatePyramidCorridorStandoff({
      weylandHealthPercent: 22,
      corridorNarrowWidthMeters: 3.2
    });
    assert.equal(standRes.pyramidCorridorStandoffInitiated, true);

    const diagRes = sector.diagnoseLungCarcinomaViaBioMask({
      carcinomaThermalGradientKelvin: 3.8,
      vascularTumorDetected: true
    });
    assert.equal(diagRes.lungCarcinomaTumorDetected, true);

    const mercyRes = sector.declareUnworthyPreyMercy({
      yautjaHonorCodexAffirmed: true,
      wristBladesRetracted: true
    });
    assert.equal(mercyRes.unworthyPreyMercyDeclared, true);

    const clashRes = sector.retaliateAgainstOxygenTorchDefiance({
      blowtorchFlameTemperatureCelsius: 1400,
      wristBladeStrikeExecuted: true
    });
    assert.equal(clashRes.oxygenTorchRetaliationExecuted, true);
    assert.equal(clashRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): maternity ward flooded tracking, whip security cleave, boiler steam rupture & plasma vapor (+400 Honor)', () => {
    const sector = new AvpRequiem2007HospitalMaternitySteamBurstSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.cleaveSecurityGateWithWhip(), /Must track maternity floor/);

    const floodRes = sector.trackMaternityWardFloodedFloor({
      floodWaterDepthCm: 8.5,
      incubatorRowDarknessLux: 1.2
    });
    assert.equal(floodRes.maternityWardFloorTracked, true);

    const whipRes = sector.cleaveSecurityGateWithWhip({
      whipLashForceNewtons: 4600,
      steelGateSevered: true
    });
    assert.equal(whipRes.securityGateWhipCleaved, true);

    const steamRes = sector.ruptureBoilerSteamPipes({
      boilerSteamPressureBars: 12,
      steamTemperatureCelsius: 180
    });
    assert.equal(steamRes.boilerSteamPipeRuptured, true);

    const blastRes = sector.dischargeTwinPlasmaThroughSteamCloud({
      twinPlasmaChargeJoules: 16800,
      denseSteamVaporizationConfirmed: true
    });
    assert.equal(blastRes.steamCloudPlasmaVaporizationCompleted, true);
    assert.equal(blastRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): crucified Classic location, wire severance, ship nav priming & elder duel (+450 Honor)', () => {
    const sector = new Predators2010CrucifiedClassicLiberationDuelSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.severBarbedWireRestraints(), /Must locate crucified classic/);

    const locateRes = sector.locateCrucifiedClassicPredator({
      totemTreeHeightMeters: 8.5,
      wireRestraintTensionNewtons: 4800
    });
    assert.equal(locateRes.crucifiedClassicLocated, true);

    const cutRes = sector.severBarbedWireRestraints({
      macheteSeverImpactJoules: 3600,
      classicPactConfirmed: true
    });
    assert.equal(cutRes.barbedWireBindingsSevered, true);

    const navRes = sector.primeShipNavigationComputer({
      navComputerFrequencyGhz: 14.8,
      launchSequenceInitialized: true
    });
    assert.equal(navRes.shipNavigationComputerPrimed, true);

    const duelRes = sector.engageBerserkerElderBloodDuel({
      wristBladeClashJoules: 10800,
      honorableClanDefianceRoared: true
    });
    assert.equal(duelRes.berserkerElderDuelEngaged, true);
    assert.equal(duelRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): timber wolf creek bed clash, combistick thrust, acidic skull polish & Cosmique Sanctum (+500 Honor)', () => {
    const sector = new Prey2022WolfSkullSkinningAndCosmiqueSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeWolfCombistickThrust(), /Must confront wolf/);

    const wolfRes = sector.confrontTimberWolfOnCreekBed({
      wolfMassKg: 65,
      creekCurrentVelocityMs: 3.4
    });
    assert.equal(wolfRes.creekBedWolfConfronted, true);

    const thrustRes = sector.executeWolfCombistickThrust({
      combistickThrustVelocityMs: 45,
      cleanLethalPunctureDepthCm: 22
    });
    assert.equal(thrustRes.wolfCombistickThrustExecuted, true);

    const polishRes = sector.polishWolfSkullWithAcidicSecretions({
      glandularSecretionPh: 1.1,
      boneTrophyCleanlinessScore: 0.99
    });
    assert.equal(polishRes.acidicTrophyPolishCompleted, true);

    const sanctumRes = sector.ascendToCosmiqueSupremeApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 18000,
      companionSyncScore: 0.99,
      cosmiqueGlyph: 'COSMIQUE_SUPREME_1987_2025'
    });
    assert.equal(sanctumRes.cosmiqueSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseCosmiqueSupremeApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: isYautja: true, HP <= 0, valid arena -> ALLOWED
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_COSMIQUE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: isYautja: false (Human player) -> FORBIDDEN
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_COSMIQUE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: isYautja: true, HP > 0 (Hunter still alive) -> FORBIDDEN
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 50,
      arenaConfig: 'PREDATOR_FRANCHISE_COSMIQUE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: isYautja: true, HP <= 0, wrong config -> FORBIDDEN
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'INVALID_ARENA_CONFIG'
    });
    assert.equal(c4.allowed, false);

    // Attempt arming under invalid condition throws
    assert.throws(() => sector.armDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_COSMIQUE_SUPREME_APEX_SANCTUM'
    }), /Rule 3 Violation/);

    // Valid arming & execution
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_COSMIQUE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterCosmiqueSupremeGlyphsSequence({
      glyphs: ['᚛', 'ᚉ', 'ᚑ', 'ᚄ', '᚜']
    });
    assert.equal(glyphRes.cosmiqueGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({
      laughterDecibels: 143,
      mockeryFrequencyHz: 620
    });
    assert.equal(roarRes.finalRoarEchoed, true);

    const purgeRes = sector.executeCosmiqueSupremeMicroNuclearPurge({
      countdownSeconds: 9.0,
      blastRadiusMeters: 120
    });
    assert.equal(purgeRes.nuclearDetonationExecuted, true);
    assert.equal(purgeRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const director = new HumanQaPredatorFranchiseCosmiqueSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v230');
    assert.equal(snapshot.pantheon, 'Cosmique Suprême Apex (1987-2025)');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.ascendMayanPyramidAltar({ ruinElevationMeters: 38, templeOvergrowthDensityScore: 0.94 });
    director.sectors.predator1987.calibrateRainAcousticBandpassFilter({ rainNoiseDecibels: 78, bandpassLowHz: 400, bandpassHighHz: 3200 });
    director.sectors.predator1987.broadcastSynthesizedRadioVoiceFragments({ radioCaptureFidelityScore: 0.99, disorientationFactor: 0.95 });
    director.sectors.predator1987.executeAqueductCloakStalking({ waterCascadeFlowLpm: 950, opticalRefractionStabilityScore: 0.99 });

    director.sectors.predator21990.infiltrateSubZeroMeatLocker({ ambientTemperatureCelsius: -12, hangingCarcassCount: 140 });
    director.sectors.predator21990.detectNitrogenThermalMasking({ infraredThermalSuppressionScore: 0.98, nitrogenVaporDensityLpm: 450 });
    director.sectors.predator21990.switchBioMaskToUltravioletSpectrum({ ultravioletWavelengthNm: 365, electromagneticBeaconIdentified: true });
    director.sectors.predator21990.executeOverheadMeatRailAmbush({ overheadDropElevationMeters: 5.8, wristBladeCleaveForceNewtons: 6400 });

    director.sectors.avp2004.initiatePyramidCorridorStandoff({ weylandHealthPercent: 22, corridorNarrowWidthMeters: 3.2 });
    director.sectors.avp2004.diagnoseLungCarcinomaViaBioMask({ carcinomaThermalGradientKelvin: 3.8, vascularTumorDetected: true });
    director.sectors.avp2004.declareUnworthyPreyMercy({ yautjaHonorCodexAffirmed: true, wristBladesRetracted: true });
    director.sectors.avp2004.retaliateAgainstOxygenTorchDefiance({ blowtorchFlameTemperatureCelsius: 1400, wristBladeStrikeExecuted: true });

    director.sectors.avpRequiem2007.trackMaternityWardFloodedFloor({ floodWaterDepthCm: 8.5, incubatorRowDarknessLux: 1.2 });
    director.sectors.avpRequiem2007.cleaveSecurityGateWithWhip({ whipLashForceNewtons: 4600, steelGateSevered: true });
    director.sectors.avpRequiem2007.ruptureBoilerSteamPipes({ boilerSteamPressureBars: 12, steamTemperatureCelsius: 180 });
    director.sectors.avpRequiem2007.dischargeTwinPlasmaThroughSteamCloud({ twinPlasmaChargeJoules: 16800, denseSteamVaporizationConfirmed: true });

    director.sectors.predators2010.locateCrucifiedClassicPredator({ totemTreeHeightMeters: 8.5, wireRestraintTensionNewtons: 4800 });
    director.sectors.predators2010.severBarbedWireRestraints({ macheteSeverImpactJoules: 3600, classicPactConfirmed: true });
    director.sectors.predators2010.primeShipNavigationComputer({ navComputerFrequencyGhz: 14.8, launchSequenceInitialized: true });
    director.sectors.predators2010.engageBerserkerElderBloodDuel({ wristBladeClashJoules: 10800, honorableClanDefianceRoared: true });

    director.sectors.prey2022.confrontTimberWolfOnCreekBed({ wolfMassKg: 65, creekCurrentVelocityMs: 3.4 });
    director.sectors.prey2022.executeWolfCombistickThrust({ combistickThrustVelocityMs: 45, cleanLethalPunctureDepthCm: 22 });
    director.sectors.prey2022.polishWolfSkullWithAcidicSecretions({ glandularSecretionPh: 1.1, boneTrophyCleanlinessScore: 0.99 });
    director.sectors.prey2022.ascendToCosmiqueSupremeApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 18000,
      companionSyncScore: 0.99,
      cosmiqueGlyph: 'COSMIQUE_SUPREME_1987_2025'
    });

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_COSMIQUE_SUPREME_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterCosmiqueSupremeGlyphsSequence({ glyphs: ['᚛', 'ᚉ', 'ᚑ', 'ᚄ', '᚜'] });
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar({ laughterDecibels: 143, mockeryFrequencyHz: 620 });
    director.sectors.defeatProtocol.executeCosmiqueSupremeMicroNuclearPurge({ countdownSeconds: 9.0, blastRadiusMeters: 120 });

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseCosmiqueSupremeApexMasterAuditor();
    const results = auditor.runFullAuditSuite();

    assert.equal(results.version, 'v230');
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

  it('10. AudioSynthesizer: Cosmique Suprême acoustic models & SFX synthesized', () => {
    const rainAcoustics = audioSynth.computeCosmiqueRainBandpassAcoustics({
      rainNoiseDecibels: 78,
      bandpassHighHz: 3200
    });
    assert.equal(rainAcoustics.rainNoiseDecibels, 78);
    assert.equal(rainAcoustics.bandpassHighHz, 3200);
    assert.equal(typeof rainAcoustics.acousticFilterResonanceHz, 'number');
    assert.equal(typeof rainAcoustics.rainCascadeRumbleDb, 'number');

    const steamAcoustics = audioSynth.computeCosmiqueSteamPressureAcoustics({
      boilerSteamPressureBars: 12,
      steamTemperatureCelsius: 180
    });
    assert.equal(steamAcoustics.boilerSteamPressureBars, 12);
    assert.equal(steamAcoustics.steamTemperatureCelsius, 180);
    assert.equal(typeof steamAcoustics.steamHissFrequencyHz, 'number');
    assert.equal(typeof steamAcoustics.pipeThermalExpansionDb, 'number');

    const sfxMethods = [
      'playPredator1987CosmiqueMayanAltarRainSFX',
      'playPredator1987CosmiqueRadioMimicryStaticSFX',
      'playPredator21990CosmiqueMeatLockerColdAmbienceSFX',
      'playPredator21990CosmiqueUvSpectrumSwitchSFX',
      'playAvp2004CosmiqueWeylandDiagnosticScanSFX',
      'playAvp2004CosmiqueOxygenTorchRetaliationSFX',
      'playAvpRequiem2007CosmiqueWhipGateCleaveSFX',
      'playAvpRequiem2007CosmiqueBoilerSteamBurstSFX',
      'playPredators2010CosmiqueClassicLiberationWireCutSFX',
      'playPredators2010CosmiqueBerserkerElderClashSFX',
      'playPrey2022CosmiqueWolfCombistickThrustSFX',
      'playPrey2022CosmiqueAcidicSkullPolishSFX',
      'playPredatorFranchiseCosmiqueSupremeApexNuclearPurgeSFX',
      'playPredatorFranchiseCosmiqueSupremeVictoryAnthemSFX',
      'playPredatorFranchiseCosmiqueSupremeSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
