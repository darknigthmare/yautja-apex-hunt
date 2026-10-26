import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987ValVerdeHawkinsPonchoDragAndAnnaCaptureSector } from '../src/gameplay/Predator1987ValVerdeHawkinsPonchoDragAndAnnaCaptureSector.js';
import { Predator21990JamaicanVoodooPenthouseHeartTrophySector } from '../src/gameplay/Predator21990JamaicanVoodooPenthouseHeartTrophySector.js';
import { Avp2004ChopperPredatorGillAmbushAndLexBloodedMarkSector } from '../src/gameplay/Avp2004ChopperPredatorGillAmbushAndLexBloodedMarkSector.js';
import { AvpRequiem2007GunnisonDinerPizzaDeliveryAndSportingGoodsSector } from '../src/gameplay/AvpRequiem2007GunnisonDinerPizzaDeliveryAndSportingGoodsSector.js';
import { Predators2010TrackerPredatorFlushingHoundsAndNikolaiStandSector } from '../src/gameplay/Predators2010TrackerPredatorFlushingHoundsAndNikolaiStandSector.js';
import { Prey2022And2025AnthologyMissingChroniclesSector } from '../src/gameplay/Prey2022And2025AnthologyMissingChroniclesSector.js';
import { PredatorFranchisePanEraYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchisePanEraYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchisePanEraHUDDirector } from '../src/gameplay/HumanQaPredatorFranchisePanEraHUDDirector.js';
import { HumanQaPredatorFranchisePanEraMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchisePanEraMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v202 Pan-Era Predator Franchise Anthology (1987 -> 2025) Level Design Suite', () => {
  it('Chantier 1: Predator (1987) Anna underbrush escape, Hawkins canopy drag, Poncho log rib injury, and Anna Huey evacuation', () => {
    const sector = new Predator1987ValVerdeHawkinsPonchoDragAndAnnaCaptureSector();
    const intercept = sector.interceptAnnaEscapeInUnderbrush({
      sprintDistanceMeters: 42,
      annaUnarmedStatusVerified: true
    });
    assert.equal(intercept.annaInterceptedInUnderbrush, true);

    const drag = sector.executeCloakedHawkinsDragAmbush({
      dragVelocityMps: 11.5,
      annaSparedDueToHonorCode: true
    });
    assert.equal(drag.hawkinsDraggedIntoCanopy, true);
    assert.equal(drag.annaSparedByHonorCode, true);

    const poncho = sector.triggerCounterweightLogRibInjuryOnPoncho({
      logImpactJoules: 2900,
      ponchoCarriedByDutch: true
    });
    assert.equal(poncho.ponchoCarriedAfterLogInjury, true);

    const evac = sector.evacuateAnnaToHueyRopeLadder({
      chopperHoverAltitudeMeters: 14,
      dutchCoversRetreat: true
    });
    assert.equal(evac.annaEvacuatedToChopper, true);
    assert.equal(evac.honorAwarded, 350);
  });

  it('Chantier 2: Predator 2 (1990) Ramon Vega penthouse voodoo raid, 8.5m skylight breach, rafter hoist, and forensic sweep evasion', () => {
    const sector = new Predator21990JamaicanVoodooPenthouseHeartTrophySector();
    const raid = sector.infiltrateRamonVegaArtDecoPenthouse({
      voodooPosseMembers: 5,
      ritualIncenseDensity: 0.82
    });
    assert.equal(raid.vegaPenthouseInfiltrated, true);

    const breach = sector.breachStainedGlassSkylightFromRoof({
      dropHeightMeters: 8.5,
      glassShardsScattered: 140
    });
    assert.equal(breach.skylightBreachedFromRoof, true);

    const hoist = sector.hoistSkinnedPosseBodiesToCeilingRafters({
      hoistedBodiesCount: 5,
      ceilingHookTensionKn: 12.4
    });
    assert.equal(hoist.posseBodiesHoistedToRafters, true);

    const evade = sector.evadeHarriganAndLeonaForensicSweep({
      thermalCloakActive: true,
      ceilingBeamCrawlSilent: true
    });
    assert.equal(evade.harriganLeonaSweepEvaded, true);
    assert.equal(evade.honorAwarded, 350);
  });

  it('Chantier 3: AVP (2004) Chopper Predator Grid Alien tail impalement, Lex Woods Xeno gear, Blooded cheek mark, and Elder Combi-Spear gift', () => {
    const sector = new Avp2004ChopperPredatorGillAmbushAndLexBloodedMarkSector();
    const impale = sector.ambushChopperPredatorWithGridAlienTailImpalement({
      tailLiftHeightMeters: 2.6,
      scimitarBladesDropped: true
    });
    assert.equal(impale.chopperImpaledByGridTail, true);

    const forge = sector.forgeLexWoodsXenoHeadShieldAndTailSpear({
      carapaceAcidProofed: true,
      spearBalanceRatio: 0.94
    });
    assert.equal(forge.lexXenoGearForged, true);

    const mark = sector.etchAcidBloodedClanSymbolOnLexCheek({
      acidNeutralizedOnSkin: true,
      clanSymbolVerified: 'BLOODED_WARRIOR'
    });
    assert.equal(mark.lexCheekMarkedBlooded, true);

    const bestow = sector.bestowElderCeremonialCombiSpearInBlizzard({
      mothershipDecloaked: true,
      elderHonorGiftAccepted: true
    });
    assert.equal(bestow.elderCombiSpearBestowed, true);
    assert.equal(bestow.honorAwarded, 400);
  });

  it('Chantier 4: AVPR (2007) Gunnison Sporting Goods armory breach, window barrage defense, Wolf barehanded dual chokehold, and helipad route', () => {
    const sector = new AvpRequiem2007GunnisonDinerPizzaDeliveryAndSportingGoodsSector();
    const armory = sector.breachGunnisonSportingGoodsArmory({
      survivorsArmedCount: 6,
      nightVisionOpticsDistributed: true
    });
    assert.equal(armory.sportingGoodsArmoryBreached, true);

    const repel = sector.repelXenomorphWindowBreachBarrage({
      roundsExpended: 180,
      acidPoolAvoided: true
    });
    assert.equal(repel.windowBreachRepelled, true);

    const choke = sector.wolfDualChokeholdTwoXenomorphsBarehanded({
      gripForceNewtons: 6400,
      dualThroatCrush: true
    });
    assert.equal(choke.wolfDualChokeholdExecuted, true);

    const route = sector.extractSurvivorsTowardHospitalHelipad({
      militaryRadioIntercepted: true,
      helipadRouteChosen: true
    });
    assert.equal(route.helipadRouteSelected, true);
    assert.equal(route.honorAwarded, 400);
  });

  it('Chantier 5: Predators (2010) Tracker corner-plasma Noland kill & Nikolai dual-Claymore sacrifice + The Predator (2018) Fugitive lab breakout', () => {
    const sector = new Predators2010TrackerPredatorFlushingHoundsAndNikolaiStandSector();
    const noland = sector.vaporizeNolandInSubterraneanCorridorWithCornerPlasma({
      plasmaBoltYieldJoules: 5800,
      nolandCloakRigDestroyed: true
    });
    assert.equal(noland.nolandVaporizedByCornerPlasma, true);

    const nikolai = sector.engageTrackerPredatorWithNikolaiDualClaymores({
      claymoreBallBearingsCount: 1400,
      trackerPredatorKilled: true
    });
    assert.equal(nikolai.trackerKilledByNikolaiClaymores, true);

    const snap = sector.fugitivePredatorSnapTitaniumRestraintsInStargazerLab({
      snapTorqueNm: 1850,
      humanRifleUsedImprovised: true
    });
    assert.equal(snap.fugitiveTitaniumRestraintsSnapped, true);

    const mask = sector.recoverFugitiveBioMaskFromTechVault({
      retinalHudRebooted: true,
      rooftopLeapCompleted: true
    });
    assert.equal(mask.fugitiveBioMaskRecovered, true);
    assert.equal(mask.honorAwarded, 450);
  });

  it('Chantier 6: Trachtenberg Trilogy (2022-2025) Prey rattlesnake food-chain, Torres 1942 Wildcat repair, and Genna campfire sarcasm & grubs', () => {
    const sector = new Prey2022And2025AnthologyMissingChroniclesSector();
    const chain = sector.executePrey1719RattlesnakeFoodChainPrologue({
      foodChainTiers: 4,
      rattlesnakeSkinnedOnRock: true
    });
    assert.equal(chain.preyRattlesnakeFoodChainCompleted, true);

    const torres = sector.repairTorres1942WildcatEngineBeforeAbduction({
      cylinderCompressionPsi: 135,
      abductedIntoMothershipStasis: true
    });
    assert.equal(torres.torresWildcatEngineRepairedUnderFire, true);

    const campfire = sector.shareGennaCampfireSarcasmAndGrubMeal({
      thiaSarcasmSubroutineActive: true,
      glowingGrubsStolenByBud: 3
    });
    assert.equal(campfire.gennaCampfireSarcasmLessonCompleted, true);

    const seal = sector.sealTrachtenbergTrilogyPackLegacy({
      allThreeErasLinked: true
    });
    assert.equal(seal.trachtenbergTrilogyContinuitySealed, true);
    assert.equal(seal.honorAwarded, 500);
  });

  it('Chantier 7: Strict User Rule 3 verification in Pan-Era Anthology Arena (isYautja && health <= 0 && config === PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA)', () => {
    const sector = new PredatorFranchisePanEraYautjaDefeatProtocolSector();

    const nonYautja = sector.evaluateAndTriggerProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA'
    });
    assert.equal(nonYautja.protocolArmed, false);
    assert.equal(nonYautja.rejectionReason, 'REJECTED_NOT_YAUTJA');

    const yautjaAlive = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 60,
      levelConfiguration: 'PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA'
    });
    assert.equal(yautjaAlive.protocolArmed, false);
    assert.equal(yautjaAlive.rejectionReason, 'REJECTED_YAUTJA_STILL_ALIVE');

    const wrongLevel = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_UNIFIED_APEX_ARENA'
    });
    assert.equal(wrongLevel.protocolArmed, false);
    assert.equal(wrongLevel.rejectionReason, 'REJECTED_WRONG_CONFIGURATION');

    const validTrigger = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA'
    });
    assert.equal(validTrigger.protocolArmed, true);
    assert.deepEqual(validTrigger.glyphsEntered, ['᚛', 'ᚂ', 'ᚑ', 'ᚚ', '᚜']);
    assert.equal(validTrigger.panEraAnthologyArenaVaporized, true);
    assert.equal(validTrigger.honorAwarded, 500);
  });

  it('Chantier 8: HumanQaPredatorFranchisePanEraHUDDirector telemetry and defeat widget update', () => {
    const auditor = new HumanQaPredatorFranchisePanEraMasterAuditor();
    const cert = auditor.runFullCertification();
    const hud = new HumanQaPredatorFranchisePanEraHUDDirector();
    assert.equal(hud.qaPlaytesterAudits.length, 5);
    assert.equal(cert.hudState.panelClass, 'predator-franchise-v202-pan-era-hud-panel');
    assert.equal(cert.hudState.defeatWidgetVisible, true);
    assert.equal(cert.hudState.defeatGlyphBanner, '᚛-ᚂ-ᚑ-ᚚ-᚜');
    assert.equal(cert.hudState.totalHonorDisplayed, 2950);
  });

  it('Chantier 9: HumanQaPredatorFranchisePanEraMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaPredatorFranchisePanEraMasterAuditor();
    const result = auditor.runFullCertification();
    assert.equal(result.allSectorsCertified, true);
    assert.equal(result.rule3StrictVerified, true);
    assert.equal(result.webglDrawCalls.withinBudget, true);
    assert.ok(result.webglDrawCalls.estimated <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v202 SFX triggers', () => {
    const synth = audioSynth;
    const skylightAcoustics = synth.computeVegaPenthouseSkylightShatterAcoustics({
      dropHeightMeters: 8.5,
      glassShardsScattered: 140
    });
    assert.ok(skylightAcoustics.glassCrystallinePeakHz > 4500);
    assert.ok(skylightAcoustics.impactVelocityMps > 12);
    assert.ok(skylightAcoustics.scatterReverbMs > 600);

    const claymoreAcoustics = synth.computeNikolaiDualClaymoreCorridorBlastAcoustics({
      claymoreBallBearingsCount: 1400,
      corridorWidthMeters: 2.8
    });
    assert.ok(claymoreAcoustics.overpressureImpulseDb > 130);
    assert.ok(claymoreAcoustics.steelShrapnelRicochetHz > 2700);
    assert.ok(claymoreAcoustics.tunnelDecaySeconds >= 3.5);

    const sfxMethods = [
      'playHawkinsCanopyDragRustleSFX',
      'playPonchoCounterweightLogRibCrushSFX',
      'playAnnaHueyRopeLadderEvacSFX',
      'playRamonVegaSkylightShatterDropSFX',
      'playVoodooPenthouseRafterHoistCreakSFX',
      'playChopperPredatorGridTailImpaleSFX',
      'playLexWoodsAcidCheekBloodedMarkSFX',
      'playElderAntarcticCombiSpearBestowSFX',
      'playGunnisonSportingGoodsShotgunRackSFX',
      'playWolfBarehandedDualXenoChokeSFX',
      'playTrackerCornerPlasmaNolandVaporizeSFX',
      'playNikolaiDualClaymoreCorridorBlastSFX',
      'playFugitivePredatorTitaniumShackleSnapSFX',
      'playGennaCampfireBudGrubChirpSFX',
      'playPredatorFranchisePanEraNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof synth[method], 'function', `Missing SFX method: ${method}`);
      assert.doesNotThrow(() => synth[method]());
    }
  });
});
