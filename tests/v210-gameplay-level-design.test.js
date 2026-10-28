import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987ExplosiveBowCraftingAndTreePerchDropSector } from '../src/gameplay/Predator1987ExplosiveBowCraftingAndTreePerchDropSector.js';
import { Predator21990SlaughterhousePlasticCurtainAndBoneSawSector } from '../src/gameplay/Predator21990SlaughterhousePlasticCurtainAndBoneSawSector.js';
import { Avp2004CelticNetGunEnsnareAndGridPillarDuelSector } from '../src/gameplay/Avp2004CelticNetGunEnsnareAndGridPillarDuelSector.js';
import { AvpRequiem2007WolfAcidScarUnmaskAndPredalienMutualImpalementSector } from '../src/gameplay/AvpRequiem2007WolfAcidScarUnmaskAndPredalienMutualImpalementSector.js';
import { Predators2010IsabellePitSnipeAndUpgradeExoskeletonSector } from '../src/gameplay/Predators2010IsabellePitSnipeAndUpgradeExoskeletonSector.js';
import { Prey2022TomahawkPendulumRappelAndSuzerainApexCovenantSector } from '../src/gameplay/Prey2022TomahawkPendulumRappelAndSuzerainApexCovenantSector.js';
import { PredatorFranchiseSuzerainApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseSuzerainApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseSuzerainApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseSuzerainApexHUDDirector.js';
import { HumanQaPredatorFranchiseSuzerainApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseSuzerainApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v210 - Predator Franchise Suzerain Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): explosive arrow crafting, 16m bough perch, plasmacaster shatter & vine drop (+350 Honor)', () => {
    const sector = new Predator1987ExplosiveBowCraftingAndTreePerchDropSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_EXPLOSIVE_BOW_CRAFTING_AND_TREE_PERCH_DROP');

    const craftRes = sector.craftExplosiveArrowsWithSurvivalKnife({
      arrowsCraftedCount: 3,
      powderGramsPerArrow: 45
    });
    assert.equal(craftRes.explosiveArrowsCrafted, true);

    const climbRes = sector.climbToSixteenMeterTreeBoughPerch({
      boughHeightMeters: 16,
      concealmentFactor: 0.95
    });
    assert.equal(climbRes.treePerchClimbed, true);

    const arrowRes = sector.fireExplosiveArrowToShatterPlasmacaster({
      arrowSpeedMps: 85,
      directHitCasterMount: true
    });
    assert.equal(arrowRes.plasmacasterShatteredByArrow, true);

    const dropRes = sector.executeRopePendulumDropOntoHunterBack({
      dropHeightMeters: 16,
      handToHandForced: true
    });
    assert.equal(dropRes.ropeDropHandToHandForced, true);
    assert.equal(dropRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.ropeDropHandToHandForced, true);
  });

  it('2. Predator 2 (1990): scoped .44 Magnum aim, vinyl curtains, green blood trail & bone saw kick (+400 Honor)', () => {
    const sector = new Predator21990SlaughterhousePlasticCurtainAndBoneSawSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_SLAUGHTERHOUSE_PLASTIC_CURTAIN_AND_BONE_SAW');

    const magnumRes = sector.aimScopedMagnumThroughPlasticStripCurtains({
      muzzleVelocityMps: 440,
      bioMaskHoseSevered: true
    });
    assert.equal(magnumRes.scopedMagnumFired, true);

    const bloodRes = sector.trackLuminescentBloodTrailAcrossFreezerTiles({
      bloodLuminescenceLux: 24,
      trailFollowedMeters: 35
    });
    assert.equal(bloodRes.luminescentBloodTracked, true);

    const ripRes = sector.ripFreeFromSpearGunCoatPinWithAdrenaline({
      ripForceNewtons: 1200,
      coatSacrificed: true
    });
    assert.equal(ripRes.spearGunPinEscaped, true);

    const kickRes = sector.kickCityHunterIntoIndustrialBoneSaw({
      kickForceNewtons: 2600,
      boneSawEngaged: true
    });
    assert.equal(kickRes.boneSawKickDelivered, true);
    assert.equal(kickRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.boneSawKickDelivered, true);
  });

  it('3. AVP (2004): high-tensile net-gun, stone pillar pin, acid spray parry & mask crest recovery (+400 Honor)', () => {
    const sector = new Avp2004CelticNetGunEnsnareAndGridPillarDuelSector();
    assert.equal(sector.sectorId, 'AVP_2004_CELTIC_NET_GUN_ENSNARE_AND_GRID_PILLAR_DUEL');

    const netRes = sector.ensnareGridAlienAgainstStonePillar({
      netWireTensileStrengthMpa: 1450,
      pillarPinned: true
    });
    assert.equal(netRes.gridAlienEnsnaredAtPillar, true);

    const parryRes = sector.parryAcidBloodMeltSplashWithWristShield({
      parryAngleDegrees: 45,
      shieldIntegrityPercent: 88
    });
    assert.equal(parryRes.acidBloodSplashParried, true);

    const liftRes = sector.liftGridAlienInSpineClampBackbreaker({
      liftForceNewtons: 6200,
      spineClamped: true
    });
    assert.equal(liftRes.spineClampBackbreakerLifted, true);

    const crestRes = sector.recoverCelticBiomaskCrestInSacrifice({
      biomaskCrestRetrieved: true,
      honorPledgeSworn: true
    });
    assert.equal(crestRes.celticBiomaskCrestRecovered, true);
    assert.equal(crestRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): helipad unmasking, acid eye reveal, bare fist thorax punch & mutual impalement (+400 Honor)', () => {
    const sector = new AvpRequiem2007WolfAcidScarUnmaskAndPredalienMutualImpalementSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_WOLF_ACID_SCAR_UNMASK_AND_PREDALIEN_MUTUAL_IMPALEMENT');

    const unmaskRes = sector.unmaskWolfDamagedBiomaskToRevealAcidScars({
      pneumaticHoseDetached: true,
      acidBlindEyeRevealed: true
    });
    assert.equal(unmaskRes.wolfAcidScarsRevealed, true);

    const roarRes = sector.deliverMandibleToMandibleChallengeRoar({
      roarDecibels: 115,
      rainInterferenceDb: 35
    });
    assert.equal(roarRes.mandibleChallengeRoarDelivered, true);

    const punchRes = sector.punchBareFistThroughPredalienThorax({
      punchJoules: 9800,
      chestCavityBreached: true
    });
    assert.equal(punchRes.predalienThoraxBreachedByFist, true);

    const impaleRes = sector.endureMutualLethalImpalementUnderNuclearFlash({
      tailStabPenetrationMm: 140,
      b61NuclearDetonationWitnessed: true
    });
    assert.equal(impaleRes.mutualLethalImpalementEndured, true);
    assert.equal(impaleRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): Blaser R93 pit snipe, Berserker stagger & exoskeleton deflection (+450 Honor)', () => {
    const sector = new Predators2010IsabellePitSnipeAndUpgradeExoskeletonSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_ISABELLE_PIT_SNIPE_AND_UPGRADE_EXOSKELETON');

    const aimRes = sector.takePitTrapSniperAimWithBlaserR93({
      targetDistanceMeters: 85,
      windDriftCompensationMoa: 1.8
    });
    assert.equal(aimRes.pitTrapSniperAimEstablished, true);

    const hitRes = sector.fireHighCaliberArmorPiercingRoundIntoBerserkerShoulder({
      kineticEnergyJoules: 5200,
      staggerDurationSec: 3.5
    });
    assert.equal(hitRes.berserkerStaggeredBySniper, true);

    const deflectRes = sector.deflectAssaultRifleFireWithUpgradeExoskeleton({
      roundsDeflectedCount: 45,
      armorHardnessMohs: 9.4
    });
    assert.equal(deflectRes.upgradeExoskeletonDeflectedRounds, true);

    const bladeRes = sector.launchSpinalBladeProjectilesThroughTreeCanopy({
      projectileVelocityMps: 380,
      treePenetratedMm: 160
    });
    assert.equal(bladeRes.spinalBladeProjectilesLaunched, true);
    assert.equal(bladeRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): tomahawk pendulum rappel, Sarii distraction & Suzerain Apex Covenant (+500 Honor)', () => {
    const sector = new Prey2022TomahawkPendulumRappelAndSuzerainApexCovenantSector();
    assert.equal(sector.sectorId, 'PREY_2022_TOMAHAWK_PENDULUM_RAPPEL_AND_SUZERAIN_APEX_COVENANT');

    const anchorRes = sector.anchorTomahawkInHighTreeBoughForPendulumRappel({
      tetherLengthMeters: 8.5,
      anchorHoldingNewtons: 3200
    });
    assert.equal(anchorRes.tomahawkPendulumAnchored, true);

    const sariiRes = sector.signalSariiBarkDistractionToShiftFeralFocus({
      barkAcousticsDb: 82,
      feralAttentionDiverted: true
    });
    assert.equal(sariiRes.sariiDistractionSignaled, true);

    const arcRes = sector.swingDownInKineticPendulumArcToSeverFeralTendon({
      arcVelocityMps: 14.5,
      tendonSeveredClean: true
    });
    assert.equal(arcRes.kineticPendulumTendonSevered, true);

    const covenantRes = sector.consecrateSuzerainApexCovenantWithNineClanSeals({
      monolithSealsAffixed: 9,
      covenantSovereignProclaimed: true
    });
    assert.equal(covenantRes.suzerainApexCovenantConsecrated, true);
    assert.equal(covenantRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Suzerain Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseSuzerainApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateSuzerainApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUZERAIN_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚄ', 'ᚓ', 'ᚏ', '᚜']);
    assert.equal(c1.roarDecibels, 120);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.suzerainApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateSuzerainApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUZERAIN_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateSuzerainApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUZERAIN_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateSuzerainApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Suzerain Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const bow = new Predator1987ExplosiveBowCraftingAndTreePerchDropSector();
    bow.craftExplosiveArrowsWithSurvivalKnife();
    bow.climbToSixteenMeterTreeBoughPerch();
    bow.fireExplosiveArrowToShatterPlasmacaster();
    bow.executeRopePendulumDropOntoHunterBack();

    const boneSaw = new Predator21990SlaughterhousePlasticCurtainAndBoneSawSector();
    boneSaw.aimScopedMagnumThroughPlasticStripCurtains();
    boneSaw.trackLuminescentBloodTrailAcrossFreezerTiles();
    boneSaw.ripFreeFromSpearGunCoatPinWithAdrenaline();
    boneSaw.kickCityHunterIntoIndustrialBoneSaw();

    const celtic = new Avp2004CelticNetGunEnsnareAndGridPillarDuelSector();
    celtic.ensnareGridAlienAgainstStonePillar();
    celtic.parryAcidBloodMeltSplashWithWristShield();
    celtic.liftGridAlienInSpineClampBackbreaker();
    celtic.recoverCelticBiomaskCrestInSacrifice();

    const wolf = new AvpRequiem2007WolfAcidScarUnmaskAndPredalienMutualImpalementSector();
    wolf.unmaskWolfDamagedBiomaskToRevealAcidScars();
    wolf.deliverMandibleToMandibleChallengeRoar();
    wolf.punchBareFistThroughPredalienThorax();
    wolf.endureMutualLethalImpalementUnderNuclearFlash();

    const pitSnipe = new Predators2010IsabellePitSnipeAndUpgradeExoskeletonSector();
    pitSnipe.takePitTrapSniperAimWithBlaserR93();
    pitSnipe.fireHighCaliberArmorPiercingRoundIntoBerserkerShoulder();
    pitSnipe.deflectAssaultRifleFireWithUpgradeExoskeleton();
    pitSnipe.launchSpinalBladeProjectilesThroughTreeCanopy();

    const pendulum = new Prey2022TomahawkPendulumRappelAndSuzerainApexCovenantSector();
    pendulum.anchorTomahawkInHighTreeBoughForPendulumRappel();
    pendulum.signalSariiBarkDistractionToShiftFeralFocus();
    pendulum.swingDownInKineticPendulumArcToSeverFeralTendon();
    pendulum.consecrateSuzerainApexCovenantWithNineClanSeals();

    const defeatProtocol = new PredatorFranchiseSuzerainApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateSuzerainApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUZERAIN_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseSuzerainApexHUDDirector();
    const snap = hud.syncFromSectors({
      explosiveBowSector: bow,
      slaughterhouseBoneSawSector: boneSaw,
      celticNetGunSector: celtic,
      wolfAcidUnmaskSector: wolf,
      pitSnipeExoskeletonSector: pitSnipe,
      tomahawkPendulumSector: pendulum,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v210-suzerain-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('SUZERAIN APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (136 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseSuzerainApexMasterAuditor();
    const res = auditor.runFullSuzerainApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 136);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: explosive bow acoustics, high-speed bone saw acoustics and 15 v210 SFX triggers', () => {
    const bowAcoustics = audioSynth.computeExplosiveBowArrowAcoustics({
      arrowSpeedMps: 85,
      powderChargeGrams: 45
    });
    assert.equal(bowAcoustics.arrowSpeedMps, 85);
    assert.equal(bowAcoustics.powderChargeGrams, 45);
    assert.ok(bowAcoustics.blastJoules > 1000);
    assert.equal(bowAcoustics.detonationPrimed, true);

    const sawAcoustics = audioSynth.computeBoneSawHighSpeedAcoustics({
      bladeRpm: 4500,
      contactFrictionDecibels: 94
    });
    assert.equal(sawAcoustics.bladeRpm, 4500);
    assert.equal(sawAcoustics.contactFrictionDecibels, 94);
    assert.equal(sawAcoustics.sawHarmonicHz, 1200);
    assert.equal(sawAcoustics.boneCuttingActive, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playExplosiveArrowFlightWhistleSFX());
    assert.doesNotThrow(() => audioSynth.playPlasmacasterMountShatterBlastSFX());
    assert.doesNotThrow(() => audioSynth.playMagnumScopedGunshotEchoSFX());
    assert.doesNotThrow(() => audioSynth.playIndustrialBoneSawGrindWhineSFX());
    assert.doesNotThrow(() => audioSynth.playCelticNetGunWireConstrictSFX());
    assert.doesNotThrow(() => audioSynth.playGridAlienTailPillarSliceSFX());
    assert.doesNotThrow(() => audioSynth.playWolfAcidScarMandibleRoarSFX());
    assert.doesNotThrow(() => audioSynth.playPredalienMutualImpalementCrushSFX());
    assert.doesNotThrow(() => audioSynth.playIsabelleBlaserR93SnipeCrackSFX());
    assert.doesNotThrow(() => audioSynth.playUpgradeExoskeletonDeflectionPingSFX());
    assert.doesNotThrow(() => audioSynth.playTomahawkPendulumRappelSwooshSFX());
    assert.doesNotThrow(() => audioSynth.playSariiBarkDistractionEchoSFX());
    assert.doesNotThrow(() => audioSynth.playSuzerainApexMonolithSealChimeSFX());
    assert.doesNotThrow(() => audioSynth.playEternalPeaceCovenantGongSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseSuzerainApexNuclearPurgeSFX());
  });
});
