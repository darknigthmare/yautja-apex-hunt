import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MudHeatDissipationTorchStandoffSector } from '../src/gameplay/Predator1987MudHeatDissipationTorchStandoffSector.js';
import { Predator21990SlaughterhouseNitrogenHalonSector } from '../src/gameplay/Predator21990SlaughterhouseNitrogenHalonSector.js';
import { Avp2004AltarAcidSpectrumMatrixSector } from '../src/gameplay/Avp2004AltarAcidSpectrumMatrixSector.js';
import { AvpRequiem2007RooftopFlareStandoffSector } from '../src/gameplay/AvpRequiem2007RooftopFlareStandoffSector.js';
import { Predators2010CampCageTrapEmissarySector } from '../src/gameplay/Predators2010CampCageTrapEmissarySector.js';
import { Prey2022BearTrapKineticShieldBadlandsSector } from '../src/gameplay/Prey2022BearTrapKineticShieldBadlandsSector.js';
import {
  PredatorFranchiseZenithSupremeApexYautjaDefeatProtocolSector,
  PREDATOR_FRANCHISE_ZENITH_SUPREME_APEX_SANCTUM
} from '../src/gameplay/PredatorFranchiseZenithSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseZenithSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseZenithSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseZenithSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseZenithSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v232 - Predator Franchise Zénith Suprême Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): Dutch riverbed mud cooling, thermal dissipation, bonfire decoys & tree standoff (+350 Honor)', () => {
    const sector = new Predator1987MudHeatDissipationTorchStandoffSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.dissipateThermalRadiation(), /Must apply full riverbed mud coat/);

    const mudRes = sector.applyRiverbedMudCoat({
      mudCoveragePercentage: 98,
      mudLayerThicknessMm: 6.5,
      riverbedTemperatureCelsius: 18.2
    });
    assert.equal(mudRes.mudCoatApplied, true);

    const thermRes = sector.dissipateThermalRadiation({
      bodyCoreTempCelsius: 37.0,
      surfaceThermalRadiationCelsius: 18.5,
      infraredSpectrumStealthFactor: 0.99
    });
    assert.equal(thermRes.thermalSignatureDissipated, true);

    const torchRes = sector.igniteTorchDecoyPerimeter({
      torchCount: 8,
      bonfireDecoyCoreTempCelsius: 780,
      infraredInterferenceSpikeLumens: 45000
    });
    assert.equal(torchRes.torchDecoyPerimeterIgnited, true);

    const standRes = sector.resolveJungleHunterTreeStandoff({
      jungleHunterDistanceMeters: 12.0,
      gutturalClickingEchoDb: 68,
      bioMaskThermalConfusionConfirmed: true
    });
    assert.equal(standRes.jungleHunterStandoffResolved, true);
    assert.equal(standRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): meat locker nitrogen freeze, UV spectrum switch, sprinkler pipe rupture & steam blind (+400 Honor)', () => {
    const sector = new Predator21990SlaughterhouseNitrogenHalonSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.activateUvSpectrumMode(), /Must endure nitrogen ambush/);

    const cryoRes = sector.endureLiquidNitrogenAmbush({
      nitrogenCryoTempCelsius: -196.0,
      sprayNozzlePressurePsi: 240,
      cityHunterArmorFrostIndex: 0.88
    });
    assert.equal(cryoRes.nitrogenSprayEndured, true);

    const uvRes = sector.activateUvSpectrumMode({
      uvWavelengthNanometers: 365,
      owlfBiometricPulseIdentified: true,
      bioMaskLensHue: 'EMERALD_ULTRAVIOLET'
    });
    assert.equal(uvRes.uvSpectrumModeActivated, true);

    const pipeRes = sector.targetIndustrialSprinklerPipe({
      ceilingPipeHeightMeters: 5.2,
      plasmacasterLockTimeMs: 180,
      waterMainValveAcquired: true
    });
    assert.equal(pipeRes.sprinklerPipeTargeted, true);

    const steamRes = sector.executeWarmWaterCountermeasure({
      burstFlowRateLpm: 1200,
      ambientSteamVolumeCubicMeters: 850,
      humanScopeBlindingFactor: 0.96
    });
    assert.equal(steamRes.warmWaterCountermeasureExecuted, true);
    assert.equal(steamRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): sacrificial altar approach, acid blood burn, neuro-electric matrix & Lex warrior clan mark (+400 Honor)', () => {
    const sector = new Avp2004AltarAcidSpectrumMatrixSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.endureAcidBloodSplash(), /Must approach sacrificial altar/);

    const altarRes = sector.approachSacrificialAltar({
      pyramidDepthMeters: 600,
      subterraneanChamberTempCelsius: -2.5
    });
    assert.equal(altarRes.sacrificialAltarApproached, true);

    const acidRes = sector.endureAcidBloodSplash({
      acidBloodPh: 0.1,
      corrosiveBurnPpm: 9500,
      armorAlloyResistanceScore: 0.92
    });
    assert.equal(acidRes.acidBloodSplashEndured, true);

    const matrixRes = sector.activateAcidSpectrumMatrix({
      neuroElectricFrequencyGhz: 12.8,
      chitinSilhouetteClarity: 0.99,
      bioMaskSpectrumMode: 'XENO_ACID_NEURO_ELECTRIC'
    });
    assert.equal(matrixRes.acidSpectrumMatrixActivated, true);

    const sigilRes = sector.engraveSacredClanMark({
      fingerTipSeveredXenoClaw: true,
      lexWoodsCheekMarked: true,
      scarForeheadMarked: true,
      warriorClanSigil: 'YAUTJA_BLOOD_ALLIANCE'
    });
    assert.equal(sigilRes.sacredClanMarkEngraved, true);
    assert.equal(sigilRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): hospital rooftop storm ascent, magnesium flare ignition, tail parry & tactical jet lock (+400 Honor)', () => {
    const sector = new AvpRequiem2007RooftopFlareStandoffSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.igniteMagnesiumExtractionFlare(), /Must ascend hospital rooftop/);

    const roofRes = sector.ascendHospitalRooftop({
      roofElevationMeters: 48,
      stormRainRateMmPerHour: 65,
      windGustKmh: 72
    });
    assert.equal(roofRes.hospitalRooftopAscended, true);

    const flareRes = sector.igniteMagnesiumExtractionFlare({
      flareLuminosityLumens: 15000,
      illuminationRadiusMeters: 80,
      magnesiumBurnTempCelsius: 2200
    });
    assert.equal(flareRes.magnesiumFlareIgnited, true);

    const parryRes = sector.parryPredalienTailStrike({
      tailImpactForceJoules: 9500,
      combistickBlockEfficiency: 0.98,
      razorWhipRecoilExecuted: true
    });
    assert.equal(parryRes.tailStrikeCombistickParried, true);

    const strikeRes = sector.triangulateTacticalStrike({
      f22RaptorMachSpeed: 2.2,
      radarLockDecibels: 108,
      evacuationCountdownSeconds: 30
    });
    assert.equal(strikeRes.tacticalStrikeTriangulated, true);
    assert.equal(strikeRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): totem camp bone cage, counterweight trap, Emissary hybrid DNA synthesis (+450 Honor)', () => {
    const sector = new Predators2010CampCageTrapEmissarySector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.neutralizeBoneCageDropTrap(), /Must discover totem camp/);

    const campRes = sector.discoverTotemCamp({
      totemSkullPoleCount: 14,
      suspendedCageHeightMeters: 8.5,
      planetaryBiomeGravityG: 0.96
    });
    assert.equal(campRes.totemCampDiscovered, true);

    const trapRes = sector.neutralizeBoneCageDropTrap({
      counterweightCableTensionNewtons: 4200,
      kineticDisarmTimeSec: 0.45,
      cageDropAvoided: true
    });
    assert.equal(trapRes.boneCageTrapNeutralized, true);

    const hybridRes = sector.decodeEmissaryHybridData({
      stargazerTelemetryBytes: 8192,
      dnaSplicingMatchPercentage: 94.8,
      emissarySpeciesTag: 'YAUTJA_HOMO_SAPIENS_HYBRID'
    });
    assert.equal(hybridRes.emissaryHybridDataDecoded, true);

    const synthRes = sector.synthesizeHybridGeneSequence({
      exonCodonSequences: 64,
      gauntletOverrideSuccess: true
    });
    assert.equal(synthRes.hybridGeneSequenceSynthesized, true);
    assert.equal(synthRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): bear trap prying, kinetic bone shield cleave, companion drone sync & Zénith Sanctum (+500 Honor)', () => {
    const sector = new Prey2022BearTrapKineticShieldBadlandsSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.pryOpenBearTrapJaws(), /Must encounter bear trap/);

    const trapRes = sector.encounterSerratedBearTrap({
      trapSteelWeightKg: 18.5,
      jawClampForceNewtons: 3200,
      voyageurTrapperAmbush: true
    });
    assert.equal(trapRes.bearTrapEncountered, true);

    const pryRes = sector.pryOpenBearTrapJaws({
      bareHandPryForceNewtons: 4800,
      legTendonDamageMitigationScore: 0.98,
      trapCastAside: true
    });
    assert.equal(pryRes.bearTrapJawsPriedOpen, true);

    const shieldRes = sector.deployKineticBoneShield({
      shieldSegmentCount: 6,
      musketBallDeflectionVelocityMps: 380,
      radialCleaveRadiusMeters: 2.4
    });
    assert.equal(shieldRes.kineticBoneShieldDeployed, true);

    const droneRes = sector.synchronizeBadlandsCompanionDrones({
      companionDroneCount: 2,
      canyonWastelandReconRadiusKm: 4.5,
      zenithSanctumMasteryConfirmed: true
    });
    assert.equal(droneRes.badlandsDronesSynchronized, true);
    assert.equal(droneRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const sector = new PredatorFranchiseZenithSupremeApexYautjaDefeatProtocolSector();

    // Case 1: Yautja + Defeated + In Zenith Sanctum -> NUCLEAR PURGE
    const case1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: -10,
      arenaConfiguration: PREDATOR_FRANCHISE_ZENITH_SUPREME_APEX_SANCTUM
    });
    assert.equal(case1.selfDestructTriggered, true);
    assert.equal(case1.reason, 'YAUTJA_DEFEAT_IN_SANCTUM_NUCLEAR_PURGE');
    assert.equal(case1.purgeYieldMegatons, 0.65);
    assert.equal(case1.honorAwarded, 500);
    assert.equal(sector.isFullyCompleted(), true);

    // Case 2: Yautja + Alive + In Zenith Sanctum -> LOCKED
    const case2 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 80,
      arenaConfiguration: PREDATOR_FRANCHISE_ZENITH_SUPREME_APEX_SANCTUM
    });
    assert.equal(case2.selfDestructTriggered, false);
    assert.equal(case2.reason, 'YAUTJA_STILL_ALIVE');

    // Case 3: Human / Synthetic + Defeated + In Zenith Sanctum -> LOCKED
    const case3 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ZENITH_SUPREME_APEX_SANCTUM
    });
    assert.equal(case3.selfDestructTriggered, false);
    assert.equal(case3.reason, 'NOT_A_YAUTJA');

    // Case 4: Yautja + Defeated + Outside Target Sanctum -> LOCKED
    const case4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: 'LV1201_ALIEN_HIVE_CORRIDOR'
    });
    assert.equal(case4.selfDestructTriggered, false);
    assert.equal(case4.reason, 'INVALID_ARENA_CONFIGURATION');
  });

  it('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const director = new HumanQaPredatorFranchiseZenithSupremeApexHUDDirector();
    const snapshot = director.getTelemetrySnapshot();

    assert.equal(snapshot.version, 'v232');
    assert.equal(snapshot.pantheon, 'Zénith Suprême Apex (1987-2025)');
    assert.equal(typeof snapshot.totalHonor, 'number');
    assert.equal(snapshot.playtesters.length, 5);

    // Node SSR render test returns non-DOM safe response
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);

    // Complete all sectors via director
    director.sectors.predator1987.applyRiverbedMudCoat({ mudCoveragePercentage: 98, mudLayerThicknessMm: 6.5, riverbedTemperatureCelsius: 18.2 });
    director.sectors.predator1987.dissipateThermalRadiation({ bodyCoreTempCelsius: 37.0, surfaceThermalRadiationCelsius: 18.5, infraredSpectrumStealthFactor: 0.99 });
    director.sectors.predator1987.igniteTorchDecoyPerimeter({ torchCount: 8, bonfireDecoyCoreTempCelsius: 780, infraredInterferenceSpikeLumens: 45000 });
    director.sectors.predator1987.resolveJungleHunterTreeStandoff({ jungleHunterDistanceMeters: 12.0, gutturalClickingEchoDb: 68, bioMaskThermalConfusionConfirmed: true });

    director.sectors.predator21990.endureLiquidNitrogenAmbush({ nitrogenCryoTempCelsius: -196.0, sprayNozzlePressurePsi: 240, cityHunterArmorFrostIndex: 0.88 });
    director.sectors.predator21990.activateUvSpectrumMode({ uvWavelengthNanometers: 365, owlfBiometricPulseIdentified: true, bioMaskLensHue: 'EMERALD_ULTRAVIOLET' });
    director.sectors.predator21990.targetIndustrialSprinklerPipe({ ceilingPipeHeightMeters: 5.2, plasmacasterLockTimeMs: 180, waterMainValveAcquired: true });
    director.sectors.predator21990.executeWarmWaterCountermeasure({ burstFlowRateLpm: 1200, ambientSteamVolumeCubicMeters: 850, humanScopeBlindingFactor: 0.96 });

    director.sectors.avp2004.approachSacrificialAltar({ pyramidDepthMeters: 600, subterraneanChamberTempCelsius: -2.5 });
    director.sectors.avp2004.endureAcidBloodSplash({ acidBloodPh: 0.1, corrosiveBurnPpm: 9500, armorAlloyResistanceScore: 0.92 });
    director.sectors.avp2004.activateAcidSpectrumMatrix({ neuroElectricFrequencyGhz: 12.8, chitinSilhouetteClarity: 0.99, bioMaskSpectrumMode: 'XENO_ACID_NEURO_ELECTRIC' });
    director.sectors.avp2004.engraveSacredClanMark({ fingerTipSeveredXenoClaw: true, lexWoodsCheekMarked: true, scarForeheadMarked: true, warriorClanSigil: 'YAUTJA_BLOOD_ALLIANCE' });

    director.sectors.avpRequiem2007.ascendHospitalRooftop({ roofElevationMeters: 48, stormRainRateMmPerHour: 65, windGustKmh: 72 });
    director.sectors.avpRequiem2007.igniteMagnesiumExtractionFlare({ flareLuminosityLumens: 15000, illuminationRadiusMeters: 80, magnesiumBurnTempCelsius: 2200 });
    director.sectors.avpRequiem2007.parryPredalienTailStrike({ tailImpactForceJoules: 9500, combistickBlockEfficiency: 0.98, razorWhipRecoilExecuted: true });
    director.sectors.avpRequiem2007.triangulateTacticalStrike({ f22RaptorMachSpeed: 2.2, radarLockDecibels: 108, evacuationCountdownSeconds: 30 });

    director.sectors.predators2010.discoverTotemCamp({ totemSkullPoleCount: 14, suspendedCageHeightMeters: 8.5, planetaryBiomeGravityG: 0.96 });
    director.sectors.predators2010.neutralizeBoneCageDropTrap({ counterweightCableTensionNewtons: 4200, kineticDisarmTimeSec: 0.45, cageDropAvoided: true });
    director.sectors.predators2010.decodeEmissaryHybridData({ stargazerTelemetryBytes: 8192, dnaSplicingMatchPercentage: 94.8, emissarySpeciesTag: 'YAUTJA_HOMO_SAPIENS_HYBRID' });
    director.sectors.predators2010.synthesizeHybridGeneSequence({ exonCodonSequences: 64, gauntletOverrideSuccess: true });

    director.sectors.prey2022.encounterSerratedBearTrap({ trapSteelWeightKg: 18.5, jawClampForceNewtons: 3200, voyageurTrapperAmbush: true });
    director.sectors.prey2022.pryOpenBearTrapJaws({ bareHandPryForceNewtons: 4800, legTendonDamageMitigationScore: 0.98, trapCastAside: true });
    director.sectors.prey2022.deployKineticBoneShield({ shieldSegmentCount: 6, musketBallDeflectionVelocityMps: 380, radialCleaveRadiusMeters: 2.4 });
    director.sectors.prey2022.synchronizeBadlandsCompanionDrones({ companionDroneCount: 2, canyonWastelandReconRadiusKm: 4.5, zenithSanctumMasteryConfirmed: true });

    director.sectors.defeatProtocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfiguration: PREDATOR_FRANCHISE_ZENITH_SUPREME_APEX_SANCTUM
    });

    assert.equal(director.isAllSectorsCompleted(), true);
    assert.equal(director.calculateTotalHonor(), 3000);
  });

  it('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseZenithSupremeApexMasterAuditor();
    const report = auditor.runFullAuditSuite();

    assert.equal(report.allSectorsPassed, true);
    assert.equal(report.rule3StrictCompliance, true);
    assert.equal(report.webglBudgetCompliant, true);
    assert.ok(report.drawCallsReported <= 300);

    assert.equal(report.rule3TruthTable.case1_YautjaDefeatedInSanctum, true);
    assert.equal(report.rule3TruthTable.case2_YautjaAliveInSanctum, true);
    assert.equal(report.rule3TruthTable.case3_HumanDefeatedInSanctum, true);
    assert.equal(report.rule3TruthTable.case4_YautjaDefeatedOutsideSanctum, true);
  });

  it('10. AudioSynthesizer: Zénith Suprême acoustic models & SFX synthesized', () => {
    // 1. Mud acoustic model
    const mudAcoustics = audioSynth.computeZenithMudThermalDissipationAcoustics({
      mudCoveragePercentage: 98,
      surfaceThermalRadiationCelsius: 18.5
    });
    assert.ok(mudAcoustics.thermalMufflingHz > 0);
    assert.ok(mudAcoustics.ambientSwampDecibels > 0);

    // 2. Sprinkler halon acoustic model
    const sprinklerAcoustics = audioSynth.computeZenithSprinklerHalonAcoustics({
      burstFlowRateLpm: 1200,
      nitrogenCryoTempCelsius: -196.0
    });
    assert.ok(sprinklerAcoustics.waterSprayNoiseDb > 0);
    assert.ok(sprinklerAcoustics.cryoVaporHissHz > 0);

    // 3. Verify all 15 SFX methods exist and execute cleanly
    const sfxMethods = [
      'playPredator1987ZenithMudSlatherSFX',
      'playPredator1987ZenithTorchIgnitionSFX',
      'playPredator21990ZenithNitrogenFreezeHissSFX',
      'playPredator21990ZenithSprinklerPipeRuptureSFX',
      'playAvp2004ZenithSacrificialAltarAmbushSFX',
      'playAvp2004ZenithAcidBurnHissSFX',
      'playAvp2004ZenithClanSigilEtchSFX',
      'playAvpRequiem2007ZenithRooftopStormDelugeSFX',
      'playAvpRequiem2007ZenithMagnesiumFlareBurnSFX',
      'playAvpRequiem2007ZenithPredalienTailParrySFX',
      'playPredators2010ZenithBoneCageDropTrapSFX',
      'playPredators2010ZenithEmissaryDnaSynthesizerSFX',
      'playPrey2022ZenithBearTrapPryClashSFX',
      'playPrey2022ZenithKineticBoneShieldCleaveSFX',
      'playPredatorFranchiseZenithSanctumNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof audioSynth[method], 'function', `Expected method ${method} on audioSynth`);
      assert.doesNotThrow(() => audioSynth[method]());
    }
  });
});
