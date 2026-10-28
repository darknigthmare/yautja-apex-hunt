import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987BillyLogBridgeStandAndMacheteSacrificeSector } from '../src/gameplay/Predator1987BillyLogBridgeStandAndMacheteSacrificeSector.js';
import { Predator21990LostTribeCloakedCircleAndElderPactSector } from '../src/gameplay/Predator21990LostTribeCloakedCircleAndElderPactSector.js';
import { Avp2004CelticGridGrappleAndAcidMaskEtchSector } from '../src/gameplay/Avp2004CelticGridGrappleAndAcidMaskEtchSector.js';
import { AvpRequiem2007HospitalShaftBrawlAndDissolvingVialSector } from '../src/gameplay/AvpRequiem2007HospitalShaftBrawlAndDissolvingVialSector.js';
import { Predators2010CrucifiedPredatorLiberationAndBerserkerClashSector } from '../src/gameplay/Predators2010CrucifiedPredatorLiberationAndBerserkerClashSector.js';
import { Prey2022AshForestWhirlwindAndChronoApexSanctumSector } from '../src/gameplay/Prey2022AshForestWhirlwindAndChronoApexSanctumSector.js';
import { PredatorFranchiseChronoApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseChronoApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseChronoApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseChronoApexHUDDirector.js';
import { HumanQaPredatorFranchiseChronoApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseChronoApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v216 - Predator Franchise Chrono Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): log bridge stand, chest carving, standoff holding & machete parry (+350 Honor)', () => {
    const sector = new Predator1987BillyLogBridgeStandAndMacheteSacrificeSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.performRitualChestCarvingChallenge(), /Must discard tactical firearm/);

    const discardRes = sector.discardRifleAndPrepareBlade({ macheteLengthInches: 18, bladeHarnessTensionPounds: 95 });
    assert.equal(discardRes.rifleDiscarded, true);

    const carveRes = sector.performRitualChestCarvingChallenge({ incisionDepthMillimeters: 3.5, warriorResolveIndex: 0.96 });
    assert.equal(carveRes.chestCarvingCompleted, true);

    const standRes = sector.holdBridgeStandoffForDutchEscape({ holdingDurationSeconds: 48, gorgeWindVelocityKnots: 22 });
    assert.equal(standRes.escapeWindowSecured, true);

    const parryRes = sector.executeMacheteParryAgainstCloakedHunter({ parryAngleDegrees: 42, bladeImpactForceJoules: 2850 });
    assert.equal(parryRes.macheteParryExecuted, true);
    assert.equal(parryRes.honorAwarded, 350);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('2. Predator 2 (1990): Lost Tribe circle decloak, Elder Greyback restraint & 1715 flintlock pact (+400 Honor)', () => {
    const sector = new Predator21990LostTribeCloakedCircleAndElderPactSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.enactElderPredatorRestraintCommand(), /Lost Tribe must decloak/);

    const decloakRes = sector.triggerLostTribeCircleDecloak({ clanMembersPresent: 9, stealthDisruptionRatePercent: 98 });
    assert.equal(decloakRes.alliesEncircled, true);

    const restraintRes = sector.enactElderPredatorRestraintCommand({ elderPrestigeTier: 'ELDER_GREYBACK', vocalCommandFrequencyHz: 84 });
    assert.equal(restraintRes.elderRestraintEnacted, true);

    const retrieveRes = sector.retrieveFallenCityHunterRemains({ biometricTrophyPreservation: true, carrierEscortGuards: 2 });
    assert.equal(retrieveRes.fallenHunterRetrieved, true);

    const pactRes = sector.concludeFlintlockGiftAndSafeExit({ engravingText: 'Raphael Adolini 1715', powderDrynessIndex: 0.94 });
    assert.equal(pactRes.flintlockPactConcluded, true);
    assert.equal(pactRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('3. AVP (2004): high-tensile net gun, acid mesh melt, megalith pillar throw & acid mask etch (+400 Honor)', () => {
    const sector = new Avp2004CelticGridGrappleAndAcidMaskEtchSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.detectAcidMeshMeltAndPrepareBrawl(), /Must deploy net snare/);

    const netRes = sector.deployHighTensileNetGunSnare({ wireTensileStrengthMpa: 1180, targetContainmentAreaM2: 2.4 });
    assert.equal(netRes.netGunSnareDeployed, true);

    const meltRes = sector.detectAcidMeshMeltAndPrepareBrawl({ acidPhLevel: 0.4, dissolutionRateSeconds: 4.8 });
    assert.equal(meltRes.acidMeshMeltDetected, true);

    const throwRes = sector.grappleAndThrowThroughMegalithPillar({ grappleThrowForceNewtons: 5600, pillarDestructionVolumeM3: 3.2 });
    assert.equal(throwRes.megalithPillarGrappleLanded, true);

    const strikeRes = sector.withstandAcidSprayAndStrikeWithWristBlades({ maskEtchDepthMicrons: 140, wristBladeExtensionMm: 450 });
    assert.equal(strikeRes.maskEtchWristBladeStrikeExecuted, true);
    assert.equal(strikeRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('4. AVP: Requiem (2007): elevator shaft rappel, razor segmented whip, Predalien brawl & blue vial cleanse (+400 Honor)', () => {
    const sector = new AvpRequiem2007HospitalShaftBrawlAndDissolvingVialSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.cleaveClingingXenosWithSegmentedWhip(), /Must rappel down/);

    const rappelRes = sector.rappelElevatorShaftWithGrappleWire({ descentDepthMeters: 34, descentVelocityMs: 4.8 });
    assert.equal(rappelRes.elevatorShaftRappelExecuted, true);

    const whipRes = sector.cleaveClingingXenosWithSegmentedWhip({ whipSegmentCount: 28, cleaveImpactCount: 4 });
    assert.equal(whipRes.whipCleaveTargetsEliminated >= 3, true);

    const grappleRes = sector.engagePredalienHallwayGrapple({ clashImpactForceNewtons: 6800, dualShoulderCasterLock: true });
    assert.equal(grappleRes.predalienHallwayGrappleEngaged, true);

    const purgeRes = sector.deployBlueDissolvingVialPurge({ vialLiquidVolumeMl: 350, dissolutionTemperatureCelsius: 420 });
    assert.equal(purgeRes.dissolvingVialPurgeCompleted, true);
    assert.equal(purgeRes.honorAwarded, 400);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('5. Predators (2010) & The Predator (2018): totem bonds release, gauntlet power-up, honor nod & Berserker clash (+450 Honor)', () => {
    const sector = new Predators2010CrucifiedPredatorLiberationAndBerserkerClashSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.powerUpGauntletAndPlasmaCaster(), /Must sever totem bonds/);

    const severRes = sector.severCrucifiedTotemBonds({ bladeSharpnessHrc: 62, bondCutTimeSeconds: 6.4 });
    assert.equal(severRes.crucifiedBondsSevered, true);

    const gauntletRes = sector.powerUpGauntletAndPlasmaCaster({ plasmaBatteryPercent: 92, triLaserCalibrationHz: 640 });
    assert.equal(gauntletRes.gauntletPlasmaCasterArmed, true);

    const nodRes = sector.exchangeWarriorHonorNod({ eyeContactDurationSeconds: 2.4, honorReciprocityScore: 0.95 });
    assert.equal(nodRes.mutualHonorNodExchanged, true);

    const clashRes = sector.engageBerserkerTitanClash({ wristBladeClashForceNewtons: 8200, plasmaBurstPointBlankJoules: 12500 });
    assert.equal(clashRes.berserkerTitanClashExecuted, true);
    assert.equal(clashRes.honorAwarded, 450);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('6. Prey (2022) & Badlands (2025): ash whirlwind combat, collapsible shield deflection, spear impale & Chrono Sanctum (+500 Honor)', () => {
    const sector = new Prey2022AshForestWhirlwindAndChronoApexSanctumSector();

    assert.equal(sector.isFullyCompleted(), false);
    assert.throws(() => sector.deployCollapsibleShieldDeflection(), /Must engage ash whirlwind combat/);

    const whirlRes = sector.engageAshForestWhirlwindCombat({ smokeVisibilityMeters: 3.5, feralMovementVelocityMs: 12.8 });
    assert.equal(whirlRes.ashForestWhirlwindEngaged, true);

    const shieldRes = sector.deployCollapsibleShieldDeflection({ shieldDiameterMm: 760, kineticAbsorptionJoules: 4800 });
    assert.equal(shieldRes.collapsibleShieldDeflectionExecuted, true);

    const spearRes = sector.hurlSegmentedCombiStickSpear({ throwSpeedMs: 45, impaledEnemyCount: 3 });
    assert.equal(spearRes.segmentedSpearMultiImpaleCount >= 2, true);

    const sanctumRes = sector.consecrateChronoApexSanctumWithThiaAndBud({
      spireAltitudeMeters: 8200,
      synthSyncIndex: 0.98,
      chronoSealGlyph: 'CHRONO_1987_2025'
    });
    assert.equal(sanctumRes.chronoApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Chrono Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseChronoApexYautjaDefeatProtocolSector();

    // Truth Table Case 1: Valid Yautja + Defeated (HP <= 0) + PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM
    const c1 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM'
    });
    assert.equal(c1.allowed, true);

    // Truth Table Case 2: Human playing (isYautja === false)
    const c2 = sector.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM'
    });
    assert.equal(c2.allowed, false);

    // Truth Table Case 3: Yautja still alive (healthPoints > 0)
    const c3 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 50,
      arenaConfig: 'PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM'
    });
    assert.equal(c3.allowed, false);

    // Truth Table Case 4: Invalid arena configuration
    const c4 = sector.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'INVALID_ARENA_CONFIG'
    });
    assert.equal(c4.allowed, false);

    // Attempting to arm with human throws Rule 3 error
    assert.throws(
      () => sector.armDefeatProtocol({ isYautja: false, healthPoints: 0, arenaConfig: 'PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM' }),
      /Rule 3 Violation/
    );

    // Legitimate arming
    const armRes = sector.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM'
    });
    assert.equal(armRes.protocolArmed, true);

    const glyphRes = sector.enterChronoGlyphsSequence({ glyphs: ['᚛', 'ᚏ', 'ᚓ', 'ᚎ', '᚜'] });
    assert.equal(glyphRes.chronoGlyphsEntered, true);

    const roarRes = sector.unleashDefiantLaughterAndRoar({ laughterDecibels: 126, mockeryFrequencyHz: 440 });
    assert.equal(roarRes.finalRoarEchoed, true);

    const detonateRes = sector.executeChronoMicroNuclearPurge({ countdownSeconds: 15, blastRadiusMeters: 65 });
    assert.equal(detonateRes.nuclearDetonationExecuted, true);
    assert.equal(detonateRes.honorAwarded, 500);

    assert.equal(sector.isFullyCompleted(), true);
  });

  it('8. Human QA Chrono Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const director = new HumanQaPredatorFranchiseChronoApexHUDDirector();

    const initialSnap = director.getTelemetrySnapshot();
    assert.equal(initialSnap.totalHonor, 0);
    assert.equal(initialSnap.allCompleted, false);

    // Complete all sectors
    director.sectors.predator1987.discardRifleAndPrepareBlade();
    director.sectors.predator1987.performRitualChestCarvingChallenge();
    director.sectors.predator1987.holdBridgeStandoffForDutchEscape();
    director.sectors.predator1987.executeMacheteParryAgainstCloakedHunter();

    director.sectors.predator21990.triggerLostTribeCircleDecloak();
    director.sectors.predator21990.enactElderPredatorRestraintCommand();
    director.sectors.predator21990.retrieveFallenCityHunterRemains();
    director.sectors.predator21990.concludeFlintlockGiftAndSafeExit();

    director.sectors.avp2004.deployHighTensileNetGunSnare();
    director.sectors.avp2004.detectAcidMeshMeltAndPrepareBrawl();
    director.sectors.avp2004.grappleAndThrowThroughMegalithPillar();
    director.sectors.avp2004.withstandAcidSprayAndStrikeWithWristBlades();

    director.sectors.avpRequiem2007.rappelElevatorShaftWithGrappleWire();
    director.sectors.avpRequiem2007.cleaveClingingXenosWithSegmentedWhip();
    director.sectors.avpRequiem2007.engagePredalienHallwayGrapple();
    director.sectors.avpRequiem2007.deployBlueDissolvingVialPurge();

    director.sectors.predators2010.severCrucifiedTotemBonds();
    director.sectors.predators2010.powerUpGauntletAndPlasmaCaster();
    director.sectors.predators2010.exchangeWarriorHonorNod();
    director.sectors.predators2010.engageBerserkerTitanClash();

    director.sectors.prey2022.engageAshForestWhirlwindCombat();
    director.sectors.prey2022.deployCollapsibleShieldDeflection();
    director.sectors.prey2022.hurlSegmentedCombiStickSpear();
    director.sectors.prey2022.consecrateChronoApexSanctumWithThiaAndBud();

    director.sectors.defeatProtocol.armDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      arenaConfig: 'PREDATOR_FRANCHISE_CHRONO_APEX_SANCTUM'
    });
    director.sectors.defeatProtocol.enterChronoGlyphsSequence();
    director.sectors.defeatProtocol.unleashDefiantLaughterAndRoar();
    director.sectors.defeatProtocol.executeChronoMicroNuclearPurge();

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
    assert.equal(panel.className, 'predator-franchise-v216-chrono-apex-hud-panel');

    director.destroy();
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (130 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseChronoApexMasterAuditor();
    const result = auditor.runFullAuditSuite();

    assert.equal(result.version, 'v216');
    assert.equal(result.totalHonor, 3000);
    assert.equal(result.allSectorsComplete, true);
    assert.equal(result.rule3TruthTablePassed, true);
    assert.equal(result.drawCallsBudgetMet, true);
    assert.ok(result.estimatedDrawCalls <= 300);
  });

  it('10. AudioSynthesizer: log bridge acoustics, ash dispersion acoustics and 15 v216 SFX triggers', () => {
    const bridgeAcoustics = audioSynth.computeChronoLogBridgeAcoustics({ spanMeters: 24, windVelocityKnots: 22 });
    assert.ok(bridgeAcoustics.creakFrequencyHz > 0);
    assert.ok(bridgeAcoustics.bridgeResonance > 0);

    const ashAcoustics = audioSynth.computeChronoAshDispersionAcoustics({ smokeDensity: 0.88, shieldRadiusMm: 760 });
    assert.ok(ashAcoustics.muffleFactor > 0);
    assert.ok(ashAcoustics.clangFrequencyHz > 0);

    // Trigger all 15 SFX safely without unhandled errors
    assert.doesNotThrow(() => {
      audioSynth.playPredator1987ChronoLogBridgeCreekSFX();
      audioSynth.playPredator1987ChronoChestCarvingChallengeSFX();
      audioSynth.playPredator1987ChronoMacheteWristBladeClashSFX();
      audioSynth.playPredator21990ChronoLostTribeCircleDecloakSFX();
      audioSynth.playPredator21990ChronoElderRestraintCommandSFX();
      audioSynth.playPredator21990ChronoFlintlockAdolini1715PactSFX();
      audioSynth.playAvp2004ChronoCelticHighTensileNetSFX();
      audioSynth.playAvp2004ChronoAcidMeshMeltHissSFX();
      audioSynth.playAvp2004ChronoMegalithPillarSmashSFX();
      audioSynth.playAvpRequiem2007ChronoHospitalShaftRappelSFX();
      audioSynth.playAvpRequiem2007ChronoSegmentedWhipCleaveSFX();
      audioSynth.playPredators2010ChronoCrucifiedTotemReleaseSFX();
      audioSynth.playPredators2010ChronoBerserkerTitanClashSFX();
      audioSynth.playPrey2022ChronoAshForestShieldDeflectSFX();
      audioSynth.playPredatorFranchiseChronoApexNuclearPurgeSFX();
    });
  });
});
