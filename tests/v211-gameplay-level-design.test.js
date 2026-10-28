import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987BillySoleTalismanCarvingAndLeafBloodAnalysisSector } from '../src/gameplay/Predator1987BillySoleTalismanCarvingAndLeafBloodAnalysisSector.js';
import { Predator21990JerryLambertSubwayStandAndMeshArmorSlashSector } from '../src/gameplay/Predator21990JerryLambertSubwayStandAndMeshArmorSlashSector.js';
import { Avp2004ScarHologramPyramidCartographyAndChitinForgeSector } from '../src/gameplay/Avp2004ScarHologramPyramidCartographyAndChitinForgeSector.js';
import { AvpRequiem2007HospitalPediatricWardAndSonicWhipStrikeSector } from '../src/gameplay/AvpRequiem2007HospitalPediatricWardAndSonicWhipStrikeSector.js';
import { Predators2010RoyceMudClayBaitAndBerserkerMaskShatterSector } from '../src/gameplay/Predators2010RoyceMudClayBaitAndBerserkerMaskShatterSector.js';
import { Prey2022FlintlockAdolini1715AndPrimordialApexAltarSector } from '../src/gameplay/Prey2022FlintlockAdolini1715AndPrimordialApexAltarSector.js';
import { PredatorFranchisePrimordialApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchisePrimordialApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchisePrimordialApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchisePrimordialApexHUDDirector.js';
import { HumanQaPredatorFranchisePrimordialApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchisePrimordialApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v211 - Predator Franchise Primordial Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): blood on leaves analysis, bone talisman carving, ridge stalker sensing & bridge challenge (+350 Honor)', () => {
    const sector = new Predator1987BillySoleTalismanCarvingAndLeafBloodAnalysisSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_BILLY_SOLE_TALISMAN_CARVING_AND_LEAF_BLOOD_ANALYSIS');

    const bloodRes = sector.analyzeLuminescentBloodOnJungleLeaves({
      copperOdorDetected: true,
      nonHumanOriginConfirmed: true
    });
    assert.equal(bloodRes.leafBloodAnalyzed, true);

    const talismanRes = sector.carveProtectiveBoneTalismanWithMachete({
      talismanCarved: true,
      spiritualFocusRatio: 0.96
    });
    assert.equal(talismanRes.boneTalismanCarved, true);

    const stalkerRes = sector.perceiveUnseenRidgeStalkerWithPrimalIntuition({
      ridgeDistanceMeters: 75,
      sensoryAlertnessHz: 42
    });
    assert.equal(stalkerRes.unseenRidgeStalkerPerceived, true);

    const standRes = sector.prepareSacredBridgeStandWithMacheteAcrossChest({
      macheteDrawn: true,
      warCryEchoed: true
    });
    assert.equal(standRes.sacredBridgeStandPrepared, true);
    assert.equal(standRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.sacredBridgeStandPrepared, true);
  });

  it('2. Predator 2 (1990): subway commuter evacuation, "jawbreaker" quote, mesh armor blade slash & ceiling vent hoist (+400 Honor)', () => {
    const sector = new Predator21990JerryLambertSubwayStandAndMeshArmorSlashSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_JERRY_LAMBERT_SUBWAY_STAND_AND_MESH_ARMOR_SLASH');

    const evacRes = sector.drawSidearmsToCoverSubwayCommuterEvacuation({
      roundsChambered: 16,
      evacuationSecured: true
    });
    assert.equal(evacRes.subwayEvacuationCovered, true);

    const jawbreakerRes = sector.deliverJawbreakerQuoteAndEmptyMagazine({
      roundsFired: 15,
      quoteDelivered: true
    });
    assert.equal(jawbreakerRes.jawbreakerQuoteDelivered, true);

    const slashRes = sector.slashCityHunterMeshArmorWithCombatBlade({
      bladeSlashJoules: 1850,
      meshSeveredMm: 45
    });
    assert.equal(slashRes.cityHunterMeshArmorSlashed, true);

    const ventRes = sector.liftJerryIntoCeilingVentilationShaft({
      liftHeightMeters: 2.4,
      trophyExtracted: true
    });
    assert.equal(ventRes.jerryHoistedIntoCeilingVent, true);
    assert.equal(ventRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.jerryHoistedIntoCeilingVent, true);
  });

  it('3. AVP (2004): 3D pyramid hologram blueprint, barbed tail spear forge, skull shield & staircase escape (+400 Honor)', () => {
    const sector = new Avp2004ScarHologramPyramidCartographyAndChitinForgeSector();
    assert.equal(sector.sectorId, 'AVP_2004_SCAR_HOLOGRAM_PYRAMID_CARTOGRAPHY_AND_CHITIN_FORGE');

    const mapRes = sector.activateHolographicPyramidCartography({
      pyramidDepthMeters: 610,
      thermalShaftLocated: true
    });
    assert.equal(mapRes.hologramCartographyActive, true);

    const spearRes = sector.forgeBarbedTailSpearFromQueenChitin({
      spearLengthMeters: 2.4,
      acidResistancePercent: 100
    });
    assert.equal(spearRes.barbedTailSpearForged, true);

    const shieldRes = sector.craftChitinShieldCarapaceForLexWoods({
      shieldDiameterMm: 750,
      xenomorphSkullUsed: true
    });
    assert.equal(shieldRes.chitinSkullShieldCrafted, true);

    const escapeRes = sector.escapeCollapsingHieroglyphicStaircase({
      climbSpeedMps: 4.8,
      queenEruptionDodged: true
    });
    assert.equal(escapeRes.staircaseEruptionEscaped, true);
    assert.equal(escapeRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): pediatric ward tracking, sonic whip drone bissection, medicomp chest injection & stairwell defense (+400 Honor)', () => {
    const sector = new AvpRequiem2007HospitalPediatricWardAndSonicWhipStrikeSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_HOSPITAL_PEDIATRIC_WARD_AND_SONIC_WHIP_STRIKE');

    const trackRes = sector.trackPredalienContaminationInPediatricWard({
      sporeTracesIdentified: 12,
      nightVisionActive: true
    });
    assert.equal(trackRes.pediatricWardContaminationTracked, true);

    const bisectRes = sector.bisectAmbushingDronesWithSonicWhipStrike({
      whipTipVelocityMps: 350,
      dronesBisectedCount: 3
    });
    assert.equal(bisectRes.dronesBisectedByWhip, true);

    const injectRes = sector.selfInjectMedicompHealingSerumIntoChestWound({
      serumDosageMl: 25,
      tissueRegenerationRatePercent: 45
    });
    assert.equal(injectRes.medicompSerumInjected, true);

    const defendRes = sector.defendHelipadStairwellDoorForCivilianEscape({
      survivorsEscortedCount: 3,
      stairwellSealed: true
    });
    assert.equal(defendRes.helipadStairwellDefended, true);
    assert.equal(defendRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): mud clay thermal mask, bonfire ring, bone club mask shatter & shock collar overload (+450 Honor)', () => {
    const sector = new Predators2010RoyceMudClayBaitAndBerserkerMaskShatterSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_ROYCE_MUD_CLAY_BAIT_AND_BERSERKER_MASK_SHATTER');

    const coatRes = sector.coatBodyInRiverbankMudClayToBlockThermals({
      clayLayerMm: 18,
      thermalSignatureObscured: true
    });
    assert.equal(coatRes.mudClayThermalMaskActive, true);

    const fireRes = sector.igniteBonfireCircleToOverwhelmThermalSpectra({
      bonfiresLitCount: 6,
      ambientTempCelsius: 450
    });
    assert.equal(fireRes.bonfireRingIgnited, true);

    const shatterRes = sector.shatterBerserkerBioMaskLensesWithBoneClub({
      strikeJoules: 4800,
      lensShattered: true
    });
    assert.equal(shatterRes.berserkerMaskLensesShattered, true);

    const collarRes = sector.triggerDirectionalPlasmacasterOverloadOnShockCollar({
      dischargeJoules: 14500,
      collarDisintegrated: true
    });
    assert.equal(collarRes.shockCollarDisintegrated, true);
    assert.equal(collarRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): Raphael Adolini 1715 flintlock retrieval, quicksand bog shot & Primordial Apex Altar (+500 Honor)', () => {
    const sector = new Prey2022FlintlockAdolini1715AndPrimordialApexAltarSector();
    assert.equal(sector.sectorId, 'PREY_2022_FLINTLOCK_ADOLINI_1715_AND_PRIMORDIAL_APEX_ALTAR');

    const flintlockRes = sector.retrieveEngravedFlintlockFromRaphaelAdolini({
      inscriptionMatched: 'Raphael Adolini 1715',
      primedWithBlackPowder: true
    });
    assert.equal(flintlockRes.flintlock1715Retrieved, true);

    const shotRes = sector.fireLeadBallThroughFeralPredatorLeg({
      muzzleVelocityMps: 280,
      bogQuicksandTrapSprung: true
    });
    assert.equal(shotRes.flintlockLeadBallFiredIntoFeralLeg, true);

    const peakRes = sector.ascendPrimordialPeakOnYautjaPrimeWithFlintlock({
      peakAltitudeMeters: 3400,
      councilChamberReached: true
    });
    assert.equal(peakRes.primordialPeakAscended, true);

    const altarRes = sector.consecratePrimordialApexAltarUnifyingThirtyEightYearSaga({
      flintlockPlacedOnAltar: true,
      thirtyEightYearSagaUnified: true
    });
    assert.equal(altarRes.primordialApexAltarConsecrated, true);
    assert.equal(altarRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Primordial Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchisePrimordialApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluatePrimordialApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_PRIMORDIAL_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚈ', 'ᚓ', 'ᚏ', '᚜']);
    assert.equal(c1.roarDecibels, 121);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.primordialApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluatePrimordialApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_PRIMORDIAL_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluatePrimordialApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_PRIMORDIAL_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluatePrimordialApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Primordial Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const billy = new Predator1987BillySoleTalismanCarvingAndLeafBloodAnalysisSector();
    billy.analyzeLuminescentBloodOnJungleLeaves();
    billy.carveProtectiveBoneTalismanWithMachete();
    billy.perceiveUnseenRidgeStalkerWithPrimalIntuition();
    billy.prepareSacredBridgeStandWithMacheteAcrossChest();

    const jerry = new Predator21990JerryLambertSubwayStandAndMeshArmorSlashSector();
    jerry.drawSidearmsToCoverSubwayCommuterEvacuation();
    jerry.deliverJawbreakerQuoteAndEmptyMagazine();
    jerry.slashCityHunterMeshArmorWithCombatBlade();
    jerry.liftJerryIntoCeilingVentilationShaft();

    const scar = new Avp2004ScarHologramPyramidCartographyAndChitinForgeSector();
    scar.activateHolographicPyramidCartography();
    scar.forgeBarbedTailSpearFromQueenChitin();
    scar.craftChitinShieldCarapaceForLexWoods();
    scar.escapeCollapsingHieroglyphicStaircase();

    const pediatric = new AvpRequiem2007HospitalPediatricWardAndSonicWhipStrikeSector();
    pediatric.trackPredalienContaminationInPediatricWard();
    pediatric.bisectAmbushingDronesWithSonicWhipStrike();
    pediatric.selfInjectMedicompHealingSerumIntoChestWound();
    pediatric.defendHelipadStairwellDoorForCivilianEscape();

    const royce = new Predators2010RoyceMudClayBaitAndBerserkerMaskShatterSector();
    royce.coatBodyInRiverbankMudClayToBlockThermals();
    royce.igniteBonfireCircleToOverwhelmThermalSpectra();
    royce.shatterBerserkerBioMaskLensesWithBoneClub();
    royce.triggerDirectionalPlasmacasterOverloadOnShockCollar();

    const flintlock = new Prey2022FlintlockAdolini1715AndPrimordialApexAltarSector();
    flintlock.retrieveEngravedFlintlockFromRaphaelAdolini();
    flintlock.fireLeadBallThroughFeralPredatorLeg();
    flintlock.ascendPrimordialPeakOnYautjaPrimeWithFlintlock();
    flintlock.consecratePrimordialApexAltarUnifyingThirtyEightYearSaga();

    const defeatProtocol = new PredatorFranchisePrimordialApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluatePrimordialApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_PRIMORDIAL_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchisePrimordialApexHUDDirector();
    const snap = hud.syncFromSectors({
      billyTalismanSector: billy,
      jerrySubwaySector: jerry,
      scarHologramSector: scar,
      pediatricWhipSector: pediatric,
      royceMudClaySector: royce,
      flintlockAltarSector: flintlock,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v211-primordial-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('PRIMORDIAL APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (135 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchisePrimordialApexMasterAuditor();
    const res = auditor.runFullPrimordialApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 135);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: 1715 flintlock acoustics, mud clay thermal shield acoustics and 15 v211 SFX triggers', () => {
    const flintlockAcoustics = audioSynth.computeFlintlockAdolini1715Acoustics({
      flintStrikeDelayMs: 45,
      blackPowderGrams: 28
    });
    assert.equal(flintlockAcoustics.flintStrikeDelayMs, 45);
    assert.equal(flintlockAcoustics.blackPowderGrams, 28);
    assert.equal(flintlockAcoustics.sparkFreqHz, 2800);
    assert.equal(flintlockAcoustics.flintlockPrimed, true);

    const clayAcoustics = audioSynth.computeMudClayThermalShieldAcoustics({
      clayThicknessMm: 18,
      bodyTempCelsius: 31.4
    });
    assert.equal(clayAcoustics.clayThicknessMm, 18);
    assert.equal(clayAcoustics.bodyTempCelsius, 31.4);
    assert.equal(clayAcoustics.thermalAttenuated, true);
    assert.equal(clayAcoustics.stealthActive, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playBillyLeafBloodDripEchoSFX());
    assert.doesNotThrow(() => audioSynth.playBillyTalismanBoneCarveSFX());
    assert.doesNotThrow(() => audioSynth.playJerrySubwayJawbreakerGunshotSFX());
    assert.doesNotThrow(() => audioSynth.playCityHunterMeshArmorSlashSFX());
    assert.doesNotThrow(() => audioSynth.playScarHologramPyramidMapHumSFX());
    assert.doesNotThrow(() => audioSynth.playChitinSpearForgeClangSFX());
    assert.doesNotThrow(() => audioSynth.playHospitalLockerWhipBisectSFX());
    assert.doesNotThrow(() => audioSynth.playWolfMedicompChestInjectHissSFX());
    assert.doesNotThrow(() => audioSynth.playRoyceClayMudSquelchCoverSFX());
    assert.doesNotThrow(() => audioSynth.playBerserkerBioMaskShatterCrackSFX());
    assert.doesNotThrow(() => audioSynth.playFlintlockAdolini1715FlintSparkSFX());
    assert.doesNotThrow(() => audioSynth.playFlintlockAdolini1715SmokeBlastSFX());
    assert.doesNotThrow(() => audioSynth.playPrimordialPeakWindResonanceSFX());
    assert.doesNotThrow(() => audioSynth.playPrimordialApexAltarConsecrationGongSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchisePrimordialApexNuclearPurgeSFX());
  });
});
