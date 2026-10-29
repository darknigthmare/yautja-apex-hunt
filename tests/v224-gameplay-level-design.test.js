import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MedicompFieldSurgeryAndLogDecoySector } from '../src/gameplay/Predator1987MedicompFieldSurgeryAndLogDecoySector.js';
import { Predator21990PenthouseNetGunAndSpireLightningSector } from '../src/gameplay/Predator21990PenthouseNetGunAndSpireLightningSector.js';
import { Avp2004CryoChamberQueenChainBreachSector } from '../src/gameplay/Avp2004CryoChamberQueenChainBreachSector.js';
import { AvpRequiem2007CemeteryCrawlAndBlueDissolverStreamSector } from '../src/gameplay/AvpRequiem2007CemeteryCrawlAndBlueDissolverStreamSector.js';
import { Predators2010NikolaiClaymoreAndExoskeletonShieldSector } from '../src/gameplay/Predators2010NikolaiClaymoreAndExoskeletonShieldSector.js';
import { Prey2022RiverRapidsBeaverDamAndImperialSanctumSector } from '../src/gameplay/Prey2022RiverRapidsBeaverDamAndImperialSanctumSector.js';
import { PredatorFranchiseImperialApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseImperialApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseImperialApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseImperialApexHUDDirector.js';
import { HumanQaPredatorFranchiseImperialApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseImperialApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v224 - Predator Franchise Impérial Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): surgical pincer shrapnel extraction, luminescent blood cauterization, log decoy & ambush (+350 Honor)', () => {
    const sector = new Predator1987MedicompFieldSurgeryAndLogDecoySector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.cauterizeLuminescentBloodTrail(), /Must extract shrapnel/);

    const extRes = sector.extractShrapnelWithSurgicalPincers({
      shrapnelDepthMm: 24,
      pincerGripForceNewtons: 340
    });
    assert.equal(extRes.shrapnelExtracted, true);

    const cautRes = sector.cauterizeLuminescentBloodTrail({
      clampTemperatureCelsius: 380,
      luminescenceSuppressedPercent: 100
    });
    assert.equal(cautRes.luminescentBloodCauterized, true);

    const logRes = sector.deployFloatingLogThermalDecoy({
      logLengthMeters: 2.4,
      decoyHeatSignatureCelsius: 36.5
    });
    assert.equal(logRes.floatingLogDecoyDeployed, true);

    const ambushRes = sector.secureRiverbankUndercutAmbush({
      riverWaterDepthMeters: 1.3,
      hunterFalseScanConfirmed: true
    });
    assert.equal(ambushRes.riverbankAmbushSecured, true);
    assert.equal(ambushRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): penthouse triangular net-gun, wire constriction, Eastern Columbia storm spire & lightning strike (+400 Honor)', () => {
    const sector = new Predator21990PenthouseNetGunAndSpireLightningSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeNetWireConstriction(), /Must fire net-gun/);

    const netRes = sector.fireTriangularPenthouseNetGun({
      propulsionPressurePsi: 1800,
      targetVelocityMs: 42
    });
    assert.equal(netRes.penthouseNetGunFired, true);

    const wireRes = sector.executeNetWireConstriction({
      wireTensileForceNewtons: 3500,
      constrictionDiameterCm: 18
    });
    assert.equal(wireRes.netWireConstrictionExecuted, true);

    const spireRes = sector.ascendEasternColumbiaSpireInStorm({
      spireAltitudeMeters: 240,
      rainfallRateMmH: 95
    });
    assert.equal(spireRes.spireAscendedInStorm, true);

    const strikeRes = sector.channelCombistickLightningStrike({
      lightningAmperage: 120000,
      combistickDischargeConducted: true
    });
    assert.equal(strikeRes.combistickLightningChanneled, true);
    assert.equal(strikeRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): cryo defrost cycle, hydraulic stone shackles rupture, dorsal spine evasion & hive breach (+400 Honor)', () => {
    const sector = new Avp2004CryoChamberQueenChainBreachSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.ruptureHydraulicStoneShackles(), /Must initiate defrost cycle/);

    const defRes = sector.initiateCryoStasisDefrostCycle({
      targetTempCelsius: 37,
      coolantFlushRateLpm: 450
    });
    assert.equal(defRes.cryoStasisDefrostInitiated, true);

    const rupRes = sector.ruptureHydraulicStoneShackles({
      breakoutForceNewtons: 14500,
      shackleTensileLimitSurpassed: true
    });
    assert.equal(rupRes.hydraulicShacklesRuptured, true);

    const evaRes = sector.evadeThrashingDorsalSpines({
      spineClearanceMeters: 0.45,
      evasionDodgeScore: 0.98
    });
    assert.equal(evaRes.dorsalSpineThrashEvaded, true);

    const breachRes = sector.surviveSubterraneanHiveBreach({
      matriarchMassTons: 12.5,
      hiveCollapseEscaped: true
    });
    assert.equal(breachRes.subterraneanHiveBreachSurvived, true);
    assert.equal(breachRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): creek contaminant tracking, blue dissolver chemical, mausoleum cross parry & plasma eradication (+400 Honor)', () => {
    const sector = new AvpRequiem2007CemeteryCrawlAndBlueDissolverStreamSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.applyBlueCorrosiveDissolverLiquid(), /Must track contaminants/);

    const trackRes = sector.trackCreekBedContaminants({
      luminescentGreenSporePpm: 620,
      creekWaterTurbidityNtu: 45
    });
    assert.equal(trackRes.creekBedContaminantsTracked, true);

    const dripRes = sector.applyBlueCorrosiveDissolverLiquid({
      canisterDripVolumeMl: 120,
      organicTissueDissolutionPercent: 100
    });
    assert.equal(dripRes.blueDissolverPurificationApplied, true);

    const parryRes = sector.parryMausoleumCrossAmbush({
      diveVelocityMs: 19.5,
      wristBladeParryEfficiency: 0.99
    });
    assert.equal(parryRes.mausoleumCrossAmbushParried, true);

    const eradRes = sector.executePointBlankPlasmaEradication({
      plasmaBoltJoules: 9400,
      targetDematerializationConfirmed: true
    });
    assert.equal(eradRes.pointBlankPlasmaEradicationExecuted, true);
    assert.equal(eradRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): dual Claymore rigging, 700 ball-bearing detonation, exoskeleton shield & wrist darts (+450 Honor)', () => {
    const sector = new Predators2010NikolaiClaymoreAndExoskeletonShieldSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.detonatePointBlankClaymoreTrap(), /Must rig Claymores/);

    const rigRes = sector.rigDualDirectionalClaymores({
      claymoreCount: 2,
      c4ExplosiveChargeGrams: 1360
    });
    assert.equal(rigRes.dualClaymoresRigged, true);

    const detRes = sector.detonatePointBlankClaymoreTrap({
      steelBallBearingCount: 700,
      detonationVelocityMs: 12000
    });
    assert.equal(detRes.pointBlankClaymoreDetonated, true);

    const shieldRes = sector.activateOrganicExoskeletonShield({
      absorptionCapacityJoules: 10500,
      chitinousHardnessMohs: 9.4
    });
    assert.equal(shieldRes.exoskeletonShieldActivated, true);

    const dartRes = sector.counterWithExplosiveWristGauntletDarts({
      dartVolleyCount: 3,
      concussiveBlastRadiusMeters: 8.5
    });
    assert.equal(dartRes.gauntletExplosiveDartCounterFired, true);
    assert.equal(dartRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): rapids beaver dam dive, 99.5% water thermal cloaking, tomahawk rope strike & Impérial Sanctum (+500 Honor)', () => {
    const sector = new Prey2022RiverRapidsBeaverDamAndImperialSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.achieveWaterThermalAbsorptionCloak(), /Must submerge beneath beaver dam/);

    const diveRes = sector.submergeBeneathRapidsBeaverDam({
      waterVelocityMs: 6.8,
      logJamSubmersionDepthMeters: 1.8
    });
    assert.equal(diveRes.rapidsBeaverDamSubmerged, true);

    const cloakRes = sector.achieveWaterThermalAbsorptionCloak({
      waterThermalAbsorptionPercent: 99.5,
      thermalOpticsBreakConfirmed: true
    });
    assert.equal(cloakRes.waterThermalCloakingAchieved, true);

    const strikeRes = sector.strikeWithTomahawkRopeRetrieval({
      tetherTensileStrengthNewtons: 3800,
      kineticImpactJoules: 4200
    });
    assert.equal(strikeRes.tomahawkRopeRetrievalStruck, true);

    const sanctumRes = sector.ascendToImperialApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 13800,
      synthSyncIndex: 0.99,
      imperialSealGlyph: 'IMPERIAL_1987_2025'
    });
    assert.equal(sanctumRes.imperialApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Impérial Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseImperialApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 55,
      arenaConfig: 'PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_IMPERIAL_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterImperialGlyphsSequence({ glyphs: ['᚛', 'ᚃ', 'ᚑ', 'ᚏ', '᚜'] });
    assert.equal(glyphRes.imperialGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 137, mockeryFrequencyHz: 560 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeImperialMicroNuclearPurge({ countdownSeconds: 12.0, blastRadiusMeters: 90 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Impérial Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseImperialApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all 7 sectors
    director.sectors.predator1987.extractShrapnelWithSurgicalPincers();
    director.sectors.predator1987.cauterizeLuminescentBloodTrail();
    director.sectors.predator1987.deployFloatingLogThermalDecoy();
    director.sectors.predator1987.secureRiverbankUndercutAmbush();

    director.sectors.predator21990.fireTriangularPenthouseNetGun();
    director.sectors.predator21990.executeNetWireConstriction();
    director.sectors.predator21990.ascendEasternColumbiaSpireInStorm();
    director.sectors.predator21990.channelCombistickLightningStrike();

    director.sectors.avp2004.initiateCryoStasisDefrostCycle();
    director.sectors.avp2004.ruptureHydraulicStoneShackles();
    director.sectors.avp2004.evadeThrashingDorsalSpines();
    director.sectors.avp2004.surviveSubterraneanHiveBreach();

    director.sectors.avpRequiem2007.trackCreekBedContaminants();
    director.sectors.avpRequiem2007.applyBlueCorrosiveDissolverLiquid();
    director.sectors.avpRequiem2007.parryMausoleumCrossAmbush();
    director.sectors.avpRequiem2007.executePointBlankPlasmaEradication();

    director.sectors.predators2010.rigDualDirectionalClaymores();
    director.sectors.predators2010.detonatePointBlankClaymoreTrap();
    director.sectors.predators2010.activateOrganicExoskeletonShield();
    director.sectors.predators2010.counterWithExplosiveWristGauntletDarts();

    director.sectors.prey2022.submergeBeneathRapidsBeaverDam();
    director.sectors.prey2022.achieveWaterThermalAbsorptionCloak();
    director.sectors.prey2022.strikeWithTomahawkRopeRetrieval();
    director.sectors.prey2022.ascendToImperialApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_IMPERIAL_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterImperialGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeImperialMicroNuclearPurge();

    const completedSnap = director.getTelemetrySnapshot();
    assert.equal(completedSnap.totalHonor, 3000);
    assert.equal(completedSnap.allCompleted, true);
    assert.equal(completedSnap.playtesters.length, 5);

    // Verify SSR/Node DOM safe handling
    const renderRes = director.render();
    assert.equal(renderRes.rendered, false);
    assert.match(renderRes.reason, /DOM environment not present/);
  });

  it('9. Human QA Impérial Apex Master Auditor: full-spectrum certification, Rule 3 & draw calls <= 300', () => {
    const auditor = new HumanQaPredatorFranchiseImperialApexMasterAuditor();
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

  it('10. AudioSynthesizer: Impérial acoustic models & 15 dedicated SFX synthesized', () => {
    const surgeryAcoustics = audioSynth.computeImperialFieldSurgeryAcoustics({
      clampTemperatureCelsius: 380,
      shrapnelDepthMm: 24
    });
    assert.equal(surgeryAcoustics.clampTemperatureCelsius, 380);
    assert.equal(surgeryAcoustics.shrapnelDepthMm, 24);
    assert.equal(typeof surgeryAcoustics.cauterizationSizzleDb, 'number');
    assert.equal(typeof surgeryAcoustics.tissueTensionResonanceHz, 'number');

    const cryoAcoustics = audioSynth.computeImperialCryoDefrostAcoustics({
      targetTempCelsius: 37,
      coolantFlushRateLpm: 450
    });
    assert.equal(cryoAcoustics.targetTempCelsius, 37);
    assert.equal(cryoAcoustics.coolantFlushRateLpm, 450);
    assert.equal(typeof cryoAcoustics.hydraulicSurgeDb, 'number');
    assert.equal(typeof cryoAcoustics.frostFracturePitchHz, 'number');

    const sfxMethods = [
      'playPredator1987ImperialPincerShrapnelSFX',
      'playPredator1987ImperialBloodCauterizeSFX',
      'playPredator21990ImperialPenthouseNetGunSFX',
      'playPredator21990ImperialSpireLightningChannelSFX',
      'playAvp2004ImperialCryoDefrostFlushSFX',
      'playAvp2004ImperialQueenChainRuptureSFX',
      'playAvpRequiem2007ImperialBlueDissolverDripSFX',
      'playAvpRequiem2007ImperialMausoleumCrossParrySFX',
      'playPredators2010ImperialDualClaymoreBlastSFX',
      'playPredators2010ImperialExoskeletonShieldSFX',
      'playPrey2022ImperialBeaverDamSubmersionSFX',
      'playPrey2022ImperialTomahawkRopeStrikeSFX',
      'playPredatorFranchiseImperialApexNuclearPurgeSFX',
      'playPredatorFranchiseImperialVictoryAnthemSFX',
      'playPredatorFranchiseImperialSanctumAscentSFX'
    ];

    sfxMethods.forEach(method => {
      assert.equal(typeof audioSynth[method], 'function', `Method ${method} should be a function`);
      assert.doesNotThrow(() => audioSynth[method]());
    });
  });
});
