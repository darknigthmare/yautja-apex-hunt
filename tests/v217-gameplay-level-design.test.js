import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987CanopyMedicompShriekAndCauterizationSector } from '../src/gameplay/Predator1987CanopyMedicompShriekAndCauterizationSector.js';
import { Predator21990SlaughterhouseNitrogenTrapAndMultispectralShiftSector } from '../src/gameplay/Predator21990SlaughterhouseNitrogenTrapAndMultispectralShiftSector.js';
import { Avp2004SarcophagusCasterTheftAndAcidClanMarkSector } from '../src/gameplay/Avp2004SarcophagusCasterTheftAndAcidClanMarkSector.js';
import { AvpRequiem2007ScoutShipPurgeAndDualPistolConvergenceSector } from '../src/gameplay/AvpRequiem2007ScoutShipPurgeAndDualPistolConvergenceSector.js';
import { Predators2010AncientDeadfallTrapAndStargazerBreachSector } from '../src/gameplay/Predators2010AncientDeadfallTrapAndStargazerBreachSector.js';
import { Prey2022GrizzlyBearBloodBathAndTetheredTomahawkSector } from '../src/gameplay/Prey2022GrizzlyBearBloodBathAndTetheredTomahawkSector.js';
import { PredatorFranchiseTitanApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseTitanApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseTitanApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseTitanApexHUDDirector.js';
import { HumanQaPredatorFranchiseTitanApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseTitanApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v217 - Predator Franchise Titan Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): canopy perch, medicomp kit, agony shriek & thermal cauterization (+350 Honor)', () => {
    const sector = new Predator1987CanopyMedicompShriekAndCauterizationSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.unfoldMedicompKitAndExtractClamps(), /Must secure canopy perch/);

    const perchRes = sector.secureCanopyTriagePerch({ perchElevationMeters: 28, branchWeightCapacityKg: 380 });
    assert.equal(perchRes.canopyPerchSecured, true);

    const kitRes = sector.unfoldMedicompKitAndExtractClamps({ surgicalPinCount: 6, clampTensileStrengthN: 450 });
    assert.equal(kitRes.medicompKitUnfolded, true);

    const shriekRes = sector.utterAgonizingMedicompShriek({ shriekDecibels: 118, jungleEchoRadiusMeters: 850 });
    assert.equal(shriekRes.agonyShriekEchoed, true);

    const cautRes = sector.applyDermalPinsAndThermalCauterization({ cauterizationHeatCelsius: 480, phosphorBloodLeakStoppedPercent: 100 });
    assert.equal(cautRes.cauterizationCompleted, true);
    assert.equal(cautRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): nitrogen sprayers, flashlight scattering, UV mode shift & rail leap (+400 Honor)', () => {
    const sector = new Predator21990SlaughterhouseNitrogenTrapAndMultispectralShiftSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.detectFlashlightBeamScattering(), /Must deploy nitrogen ambush/);

    const nitroRes = sector.deployLiquidNitrogenSprayerAmbush({ nitrogenCryoTempCelsius: -196, freezerRoomPressureKpa: 101.3 });
    assert.equal(nitroRes.nitrogenSprayersDeployed, true);

    const lightRes = sector.detectFlashlightBeamScattering({ beamLuminanceLux: 650, airborneIceParticleDensity: 0.82 });
    assert.equal(lightRes.flashlightBeamScatteringDetected, true);

    const uvRes = sector.shiftMultispectralVisionToUltraviolet({ wavelengthNanometers: 365, suitSilhouettesDiscovered: 7 });
    assert.equal(uvRes.multispectralModeShifted, true);

    const leapRes = sector.executeMeatHookRailCounterAndSlaughter({ railLeapVelocityMs: 14.5, smartDiscThrowForceJoules: 3200 });
    assert.equal(leapRes.meatHookRailCounterLanded, true);
    assert.equal(leapRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): sarcophagus casters, shoulder armature, acid clan cheek mark & carapace arms (+400 Honor)', () => {
    const sector = new Avp2004SarcophagusCasterTheftAndAcidClanMarkSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.mountShoulderArmatureAndCalibrate(), /Must retrieve plasma casters/);

    const casterRes = sector.retrieveStolenSarcophagusPlasmaCasters({ plasmaCastersFound: 3, ancientDialAlignmentDegrees: 180 });
    assert.equal(casterRes.sarcophagusCastersRetrieved, true);

    const mountRes = sector.mountShoulderArmatureAndCalibrate({ servoTorqueNewtonMeters: 72, triLaserSyncHz: 820 });
    assert.equal(mountRes.shoulderArmatureMounted, true);

    const markRes = sector.etchAcidClanMarkOnLexCheek({ acidNeutralizationScore: 0.96, symbolGlyph: 'LIGHTNING_BOLT_CLAN' });
    assert.equal(markRes.acidClanMarkEtched, true);

    const shieldRes = sector.forgeCarapaceShieldAndTailSpear({ carapaceArmorThicknessMm: 65, spearBarbLengthMm: 340 });
    assert.equal(shieldRes.carapaceShieldPresented, true);
    assert.equal(shieldRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): scout console meltdown, blue cleaner fluid, pistol mod & crossfire (+400 Honor)', () => {
    const sector = new AvpRequiem2007ScoutShipPurgeAndDualPistolConvergenceSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.vaporizeBioTracesWithBlueCleanerFluid(), /Must arm scout ship meltdown/);

    const meltRes = sector.armScoutShipConsoleMeltdown({ microPlasmaChargeJoules: 14500, countdownTimerSeconds: 12 });
    assert.equal(meltRes.scoutShipConsoleMeltArmed, true);

    const bioRes = sector.vaporizeBioTracesWithBlueCleanerFluid({ dissolutionVialCount: 4, vaporizationHeatCelsius: 460 });
    assert.equal(bioRes.bioTracesVaporized, true);

    const pistolRes = sector.modifyShoulderCastersIntoDualHandheldPistols({ gripErgonomicsScore: 0.94, batteryOutputMilliampHours: 2400 });
    assert.equal(pistolRes.dualPistolModificationCompleted, true);

    const fireRes = sector.fireConvergentPlasmaCrossfire({ convergentAngleDegrees: 35, combinedPlasmaDischargeJoules: 9600 });
    assert.equal(fireRes.convergentPlasmaCrossfireFired, true);
    assert.equal(fireRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): deadfall navigation, claymore hound defense, restraint snap & flechettes (+450 Honor)', () => {
    const sector = new Predators2010AncientDeadfallTrapAndStargazerBreachSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.detonateClaymoreHoundDefense(), /Must navigate deadfall zone/);

    const deadfallRes = sector.navigatePreserveDeadfallTraps({ tripwireSensitivityGrams: 85, deadfallLogMassKg: 420 });
    assert.equal(deadfallRes.preserveDeadfallNavigated, true);

    const houndRes = sector.detonateClaymoreHoundDefense({ directionalBallBearingCount: 700, houndBlastStaggerSeconds: 5.2 });
    assert.equal(houndRes.claymoreHoundDefenseExecuted, true);

    const snapRes = sector.shatterStargazerMedicalRestraints({ restraintTensileLimitKpa: 3200, burstStrengthMultiplier: 2.4 });
    assert.equal(snapRes.stargazerRestraintsShattered, true);

    const flechetteRes = sector.fireZeroGFlechetteBarrageAndReclaimMask({ flechetteVelocityMs: 120, mercenaryTargetsNeutralized: 5 });
    assert.equal(flechetteRes.zeroGFlechetteBarrageFired, true);
    assert.equal(flechetteRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): grizzly bear grapple, overhead blood shower, tethered tomahawk & Titan Covenant (+500 Honor)', () => {
    const sector = new Prey2022GrizzlyBearBloodBathAndTetheredTomahawkSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.executeOverheadLiftAndBloodShowerCloak(), /Must grapple grizzly bear/);

    const grappleRes = sector.engageGrizzlyBearRiverGrapple({ bearMassKg: 620, riverCurrentKnots: 14 });
    assert.equal(grappleRes.grizzlyBearGrappleEngaged, true);

    const showerRes = sector.executeOverheadLiftAndBloodShowerCloak({ liftHeightMeters: 3.2, bloodFlowRateLitersPerMin: 45, cloakRefractionIndex: 0.98 });
    assert.equal(showerRes.overheadBloodShowerCloakExecuted, true);

    const tomahawkRes = sector.whipTetheredTomahawkAroundTreeTrunk({ tetherRopeLengthMeters: 8.5, throwVelocityMs: 28, recoilCatchAccuracyScore: 0.97 });
    assert.equal(tomahawkRes.tetheredTomahawkRecoilLanded, true);

    const covenantRes = sector.consecrateEternalApexCovenantWithThiaAndBud({
      spireAltitudeMeters: 9000,
      synthSyncIndex: 0.99,
      eternalSealGlyph: 'ETERNAL_COVENANT_1987_2025'
    });
    assert.equal(covenantRes.eternalApexCovenantConsecrated, true);
    assert.equal(covenantRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Titan Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseTitanApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 75,
      arenaConfig: 'PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'NON_TITAN_ARENA'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterTitanGlyphsSequence({ glyphs: ['᚛', 'ᚈ', 'ᚓ', 'ᚎ', '᚜'] });
    assert.equal(glyphRes.titanGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 127, mockeryFrequencyHz: 460 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeTitanMicroNuclearPurge({ countdownSeconds: 15, blastRadiusMeters: 65 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Titan Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseTitanApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all sectors
    director.sectors.predator1987.secureCanopyTriagePerch();
    director.sectors.predator1987.unfoldMedicompKitAndExtractClamps();
    director.sectors.predator1987.utterAgonizingMedicompShriek();
    director.sectors.predator1987.applyDermalPinsAndThermalCauterization();

    director.sectors.predator21990.deployLiquidNitrogenSprayerAmbush();
    director.sectors.predator21990.detectFlashlightBeamScattering();
    director.sectors.predator21990.shiftMultispectralVisionToUltraviolet();
    director.sectors.predator21990.executeMeatHookRailCounterAndSlaughter();

    director.sectors.avp2004.retrieveStolenSarcophagusPlasmaCasters();
    director.sectors.avp2004.mountShoulderArmatureAndCalibrate();
    director.sectors.avp2004.etchAcidClanMarkOnLexCheek();
    director.sectors.avp2004.forgeCarapaceShieldAndTailSpear();

    director.sectors.avpRequiem2007.armScoutShipConsoleMeltdown();
    director.sectors.avpRequiem2007.vaporizeBioTracesWithBlueCleanerFluid();
    director.sectors.avpRequiem2007.modifyShoulderCastersIntoDualHandheldPistols();
    director.sectors.avpRequiem2007.fireConvergentPlasmaCrossfire();

    director.sectors.predators2010.navigatePreserveDeadfallTraps();
    director.sectors.predators2010.detonateClaymoreHoundDefense();
    director.sectors.predators2010.shatterStargazerMedicalRestraints();
    director.sectors.predators2010.fireZeroGFlechetteBarrageAndReclaimMask();

    director.sectors.prey2022.engageGrizzlyBearRiverGrapple();
    director.sectors.prey2022.executeOverheadLiftAndBloodShowerCloak();
    director.sectors.prey2022.whipTetheredTomahawkAroundTreeTrunk();
    director.sectors.prey2022.consecrateEternalApexCovenantWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_TITAN_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterTitanGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeTitanMicroNuclearPurge();

    const finalSnap = director.getTelemetrySnapshot();
    assert.equal(finalSnap.totalHonor, 3000);
    assert.equal(finalSnap.allCompleted, true);

    // Mock DOM test
    const mockContainer = {
      appendChild: (node) => { mockContainer.child = node; },
      child: null
    };
    const panel = director.render(mockContainer);
    assert.ok(panel);
    assert.equal(panel.className, 'predator-franchise-v217-titan-apex-hud-panel');

    director.destroy();
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (129 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseTitanApexMasterAuditor();
    const result = auditor.runFullAuditSuite();

    assert.equal(result.version, 'v217');
    assert.equal(result.totalHonor, 3000);
    assert.equal(result.allSectorsComplete, true);
    assert.equal(result.rule3TruthTablePassed, true);
    assert.equal(result.drawCallsBudgetMet, true);
    assert.ok(result.estimatedDrawCalls <= 300);
  });

  it('10. AudioSynthesizer: canopy acoustics, blood bath acoustics and 15 v217 SFX triggers', () => {
    const canopyAcoustics = audioSynth.computeEternalCanopyMedicompAcoustics({ shriekDecibels: 118, perchElevationMeters: 28 });
    assert.ok(canopyAcoustics.canopyDispersionRadius > 0);
    assert.ok(canopyAcoustics.resonancePeakHz > 0);

    const bloodAcoustics = audioSynth.computeEternalBloodBathAcoustics({ bloodFlowRateLitersPerMin: 45, bearMassKg: 620 });
    assert.ok(bloodAcoustics.impactViscosityDamping > 0);
    assert.ok(bloodAcoustics.splashFrequencyHz > 0);

    // Trigger all 15 SFX safely without unhandled errors
    assert.doesNotThrow(() => {
      audioSynth.playPredator1987EternalCanopyMedicompShriekSFX();
      audioSynth.playPredator1987EternalThermalCauterizationSFX();
      audioSynth.playPredator21990EternalNitrogenCryoHissSFX();
      audioSynth.playPredator21990EternalUvMultispectralShiftSFX();
      audioSynth.playPredator21990EternalMeatHookRailLeapSFX();
      audioSynth.playAvp2004EternalSarcophagusStoneGrindSFX();
      audioSynth.playAvp2004EternalAcidClanCheekSizzleSFX();
      audioSynth.playAvp2004EternalCarapaceShieldClangSFX();
      audioSynth.playAvpRequiem2007EternalScoutShipConsoleMeltSFX();
      audioSynth.playAvpRequiem2007EternalBlueCleanerVaporizeSFX();
      audioSynth.playAvpRequiem2007EternalDualPistolCrossfireSFX();
      audioSynth.playPredators2010EternalClaymoreHoundBlastSFX();
      audioSynth.playPredators2010EternalStargazerRestraintSnapSFX();
      audioSynth.playPrey2022EternalGrizzlyBearRoarClashSFX();
      audioSynth.playPredatorFranchiseEternalApexNuclearPurgeSFX();
    });
  });
});
