import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MudBankSilenceAndLaughingCountdownSector } from '../src/gameplay/Predator1987MudBankSilenceAndLaughingCountdownSector.js';
import { Predator21990MeatLockerConveyorAndWallDiscRetrievalSector } from '../src/gameplay/Predator21990MeatLockerConveyorAndWallDiscRetrievalSector.js';
import { Avp2004SacrificialChamberClockworkTimerSector } from '../src/gameplay/Avp2004SacrificialChamberClockworkTimerSector.js';
import { AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector } from '../src/gameplay/AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector.js';
import { Predators2010HuntingCampTotemAndStargazerBreakoutSector } from '../src/gameplay/Predators2010HuntingCampTotemAndStargazerBreakoutSector.js';
import { Prey2022BearTrapForestLureAndKaliskBroodCavernSector } from '../src/gameplay/Prey2022BearTrapForestLureAndKaliskBroodCavernSector.js';
import { PredatorFranchiseImmortalApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseImmortalApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseImmortalApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseImmortalApexHUDDirector.js';
import { HumanQaPredatorFranchiseImmortalApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseImmortalApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v208 - Predator Franchise Immortal Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): mud bank breath hold, deadfall trunk crush, laughing countdown and blast escape (+350 Honor)', () => {
    const sector = new Predator1987MudBankSilenceAndLaughingCountdownSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_MUD_BANK_SILENCE_AND_LAUGHING_COUNTDOWN');

    const mudRes = sector.holdBreathInMudBankAsHunterStepsPast({
      breathHoldSeconds: 45,
      waterRippleDamped: true
    });
    assert.equal(mudRes.breathHeldInMudBank, true);

    const deadfallRes = sector.triggerDeadfallCounterweightLogToCrushTorso({
      deadfallDropJoules: 18500,
      hunterTorsoPinned: true
    });
    assert.equal(deadfallRes.deadfallLogCrushedTorso, true);

    const laughRes = sector.initiateMimicBillyLaughterWristCountdown({
      laughterDecibels: 98,
      countdownSeconds: 15
    });
    assert.equal(laughRes.mimicBillyLaughterTriggered, true);

    const escapeRes = sector.sprintFromNuclearMushroomBlastWave({
      sprintDistanceMeters: 420,
      blastWaveEscaped: true
    });
    assert.equal(escapeRes.nuclearBlastWaveEscaped, true);
    assert.equal(escapeRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.nuclearBlastWaveEscaped, true);
  });

  it('2. Predator 2 (1990): meat hook conveyor evasion, Smart-Disc pry, field-dress table & rooftop ladder (+400 Honor)', () => {
    const sector = new Predator21990MeatLockerConveyorAndWallDiscRetrievalSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_MEAT_LOCKER_CONVEYOR_AND_WALL_DISC_RETRIEVAL');

    const hookRes = sector.maneuverBetweenMovingMeatHookConveyors({
      hooksEvadedCount: 14,
      coldAirTempCelsius: -12
    });
    assert.equal(hookRes.meatHookConveyorsEvaded, true);

    const discRes = sector.prySmartDiscFromConcreteWallWithCrowbar({
      extractionForceNewtons: 3200,
      discRetrieved: true
    });
    assert.equal(discRes.smartDiscPriedFromWall, true);

    const dressRes = sector.interceptCityHunterFieldDressTableTrophy({
      skinningBladeParried: true,
      trophySecured: true
    });
    assert.equal(dressRes.fieldDressTableIntercepted, true);

    const ladderRes = sector.climbServiceLadderToRoofAheadOfCityHunter({
      rungsClimbedCount: 28,
      rooftopBreached: true
    });
    assert.equal(ladderRes.rooftopLadderClimbed, true);
    assert.equal(ladderRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.rooftopLadderClimbed, true);
  });

  it('3. AVP (2004): Bouvetoya sacrificial chamber, Celtic Facehugger defense, Grid Alien & stone maze (+400 Honor)', () => {
    const sector = new Avp2004SacrificialChamberClockworkTimerSector();
    assert.equal(sector.sectorId, 'AVP_2004_SACRIFICIAL_CHAMBER_CLOCKWORK_TIMER');

    const podRes = sector.reachBouvetoyaSacrificialChamberStasisPods({
      stasisPodsIdentified: 7,
      clockworkTimerSec: 600
    });
    assert.equal(podRes.sacrificialChamberReached, true);

    const facehuggerRes = sector.defendSacrificialAltarAgainstEmergingFacehuggers({
      facehuggersSlashedCount: 5,
      celticWristBladesReady: true
    });
    assert.equal(facehuggerRes.facehuggersDefended, true);

    const gridRes = sector.engageGridAlienInShadowCeilingAmbush({
      dropImpactForceNewtons: 5400,
      netGunTriggered: true
    });
    assert.equal(gridRes.gridAlienAmbushed, true);

    const mazeRes = sector.surviveStoneLabyrinthWallCrushSequence({
      stoneWallClearanceMm: 45,
      teamSeparationResolved: true
    });
    assert.equal(mazeRes.labyrinthShiftEscaped, true);
    assert.equal(mazeRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.labyrinthShiftEscaped, true);
  });

  it('4. AVP: Requiem (2007): National Guard armory raid, Wolf whip rain duel, 15kt B61 nuke airburst & helipad evac (+400 Honor)', () => {
    const sector = new AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_NATIONAL_GUARD_ARMORY_RAID_AND_NUKE_AIRBURST');

    const raidRes = sector.raidNationalGuardArmoryForHeavyCarbines({
      m4CarbinesEquipped: 6,
      m2HeavyFiftyCalMounted: true
    });
    assert.equal(raidRes.nationalGuardArmoryRaided, true);

    const duelRes = sector.dualWieldWolfCombiSpearAndBarbedWhipInRain({
      spearThrustRateHz: 3.2,
      whipCrackVelocityMps: 340
    });
    assert.equal(duelRes.wolfDualWieldDuelResolved, true);

    const nukeRes = sector.witnessFifteenKilotonB61NukeAirburst({
      yieldKilotonB61: 15,
      airburstAltitudeMeters: 650
    });
    assert.equal(nukeRes.nukeAirburstWitnessed, true);

    const helipadRes = sector.evacuateHospitalHelipadInShockwaveSlipstream({
      helipadLiftoffSpeedKmh: 140,
      shockwaveSurvived: true
    });
    assert.equal(helipadRes.helipadEvacuationSuccessful, true);
    assert.equal(helipadRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): totem skulls camp, Cuchillo monofilament tripwires & Stargazer glass (+450 Honor)', () => {
    const sector = new Predators2010HuntingCampTotemAndStargazerBreakoutSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_HUNTING_CAMP_TOTEM_AND_STARGAZER_BREAKOUT');

    const totemRes = sector.scoutSuperPredatorTotemSpikeEncampment({
      skullsCataloged: 18,
      huntingCampMapped: true
    });
    assert.equal(totemRes.totemCampScouted, true);

    const tripRes = sector.disarmCuchilloCorpseMonofilamentTripwires({
      tripwireTensionGrams: 45,
      monofilamentCut: true
    });
    assert.equal(tripRes.cuchilloTripwireDisarmed, true);

    const glassRes = sector.breakthroughStargazerReinforcedGlassEnclosure({
      glassThicknessMm: 75,
      impactJoules: 14200
    });
    assert.equal(glassRes.stargazerGlassShattered, true);

    const maskRes = sector.retrieveBioMaskFromObservationRoomConsole({
      biomaskInterfaced: true,
      energyPulseDischarged: true
    });
    assert.equal(maskRes.biomaskConsoleInterfaced, true);
    assert.equal(maskRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): bear trap forest lure, tomahawk arm sever, Kalisk brood caverns & Immortal Throne (+500 Honor)', () => {
    const sector = new Prey2022BearTrapForestLureAndKaliskBroodCavernSector();
    assert.equal(sector.sectorId, 'PREY_2022_BEAR_TRAP_FOREST_LURE_AND_KALISK_BROOD_CAVERN');

    const trapRes = sector.lureFeralPredatorThroughFrenchBearTrapMinefield({
      trapsTriggered: 6,
      feralLimbsSnared: true
    });
    assert.equal(trapRes.bearTrapMinefieldTriggered, true);

    const armRes = sector.sliceFeralArmWithCordedTomahawkToDropBoneShield({
      tomahawkStrikeJoules: 2800,
      shieldDropped: true
    });
    assert.equal(armRes.boneShieldDroppedByTomahawk, true);

    const cavernsRes = sector.traverseKaliskBroodGeothermalCavernsWithThia({
      broodEggsProtected: 12,
      geothermalVentTempCelsius: 85
    });
    assert.equal(cavernsRes.kaliskBroodCavernsTraversed, true);

    const throneRes = sector.claimGennaSovereigntyAndAscendImmortalThrone({
      wyExtractionDropshipsRepelled: true,
      immortalApexSovereignProclaimed: true
    });
    assert.equal(throneRes.immortalApexThroneAscended, true);
    assert.equal(throneRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Immortal Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseImmortalApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚎ', 'ᚓ', 'ᚚ', '᚜']);
    assert.equal(c1.roarDecibels, 118);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.immortalApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateImmortalApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Immortal Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const mudBank = new Predator1987MudBankSilenceAndLaughingCountdownSector();
    mudBank.holdBreathInMudBankAsHunterStepsPast();
    mudBank.triggerDeadfallCounterweightLogToCrushTorso();
    mudBank.initiateMimicBillyLaughterWristCountdown();
    mudBank.sprintFromNuclearMushroomBlastWave();

    const meatLocker = new Predator21990MeatLockerConveyorAndWallDiscRetrievalSector();
    meatLocker.maneuverBetweenMovingMeatHookConveyors();
    meatLocker.prySmartDiscFromConcreteWallWithCrowbar();
    meatLocker.interceptCityHunterFieldDressTableTrophy();
    meatLocker.climbServiceLadderToRoofAheadOfCityHunter();

    const sacrificial = new Avp2004SacrificialChamberClockworkTimerSector();
    sacrificial.reachBouvetoyaSacrificialChamberStasisPods();
    sacrificial.defendSacrificialAltarAgainstEmergingFacehuggers();
    sacrificial.engageGridAlienInShadowCeilingAmbush();
    sacrificial.surviveStoneLabyrinthWallCrushSequence();

    const armoryNuke = new AvpRequiem2007NationalGuardArmoryRaidAndNukeAirburstSector();
    armoryNuke.raidNationalGuardArmoryForHeavyCarbines();
    armoryNuke.dualWieldWolfCombiSpearAndBarbedWhipInRain();
    armoryNuke.witnessFifteenKilotonB61NukeAirburst();
    armoryNuke.evacuateHospitalHelipadInShockwaveSlipstream();

    const huntingCamp = new Predators2010HuntingCampTotemAndStargazerBreakoutSector();
    huntingCamp.scoutSuperPredatorTotemSpikeEncampment();
    huntingCamp.disarmCuchilloCorpseMonofilamentTripwires();
    huntingCamp.breakthroughStargazerReinforcedGlassEnclosure();
    huntingCamp.retrieveBioMaskFromObservationRoomConsole();

    const bearTrap = new Prey2022BearTrapForestLureAndKaliskBroodCavernSector();
    bearTrap.lureFeralPredatorThroughFrenchBearTrapMinefield();
    bearTrap.sliceFeralArmWithCordedTomahawkToDropBoneShield();
    bearTrap.traverseKaliskBroodGeothermalCavernsWithThia();
    bearTrap.claimGennaSovereigntyAndAscendImmortalThrone();

    const defeatProtocol = new PredatorFranchiseImmortalApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateImmortalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_IMMORTAL_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseImmortalApexHUDDirector();
    const snap = hud.syncFromSectors({
      mudBankSilenceSector: mudBank,
      meatLockerConveyorSector: meatLocker,
      sacrificialChamberSector: sacrificial,
      nationalGuardArmorySector: armoryNuke,
      huntingCampTotemSector: huntingCamp,
      bearTrapForestSector: bearTrap,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v208-immortal-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('IMMORTAL APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (138 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseImmortalApexMasterAuditor();
    const res = auditor.runFullImmortalApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 138);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: Billy mimic laughter, B61 nuke shockwave acoustics and 15 v208 SFX triggers', () => {
    const billyAcoustics = audioSynth.computeBillyMimicLaughterCountdownAcoustics({
      laughterFreqHz: 320,
      echoDecayMs: 800
    });
    assert.equal(billyAcoustics.laughterFreqHz, 320);
    assert.equal(billyAcoustics.echoDecayMs, 800);
    assert.equal(billyAcoustics.countdownToneHz, 880);
    assert.equal(billyAcoustics.audibleWarning, true);

    const nukeAcoustics = audioSynth.computeB61TacticalNukeShockwaveAcoustics({
      yieldKt: 15,
      distanceKm: 12
    });
    assert.equal(nukeAcoustics.yieldKt, 15);
    assert.equal(nukeAcoustics.distanceKm, 12);
    assert.ok(nukeAcoustics.overpressurePsi > 1);
    assert.ok(nukeAcoustics.shockwaveDelaySec > 30);
    assert.equal(nukeAcoustics.supersonicShockwave, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playMudBankBreathHoldHeartbeatSFX());
    assert.doesNotThrow(() => audioSynth.playBillyMimicLaughterEchoSFX());
    assert.doesNotThrow(() => audioSynth.playNuclearBlastRumbleCanopySFX());
    assert.doesNotThrow(() => audioSynth.playMeatHookConveyorRattleSFX());
    assert.doesNotThrow(() => audioSynth.playSmartDiscWallCrowbarPrySFX());
    assert.doesNotThrow(() => audioSynth.playClockworkChamberTimerClickSFX());
    assert.doesNotThrow(() => audioSynth.playStoneLabyrinthCrushRumbleSFX());
    assert.doesNotThrow(() => audioSynth.playNationalGuardArmoryRaidReloadSFX());
    assert.doesNotThrow(() => audioSynth.playB61TacticalNukeAirburstRoarSFX());
    assert.doesNotThrow(() => audioSynth.playTotemTripwireMonofilamentSnipSFX());
    assert.doesNotThrow(() => audioSynth.playStargazerObservationGlassShatterSFX());
    assert.doesNotThrow(() => audioSynth.playBearTrapSpringSnapJungleSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskBroodGeothermalSteamVentSFX());
    assert.doesNotThrow(() => audioSynth.playImmortalApexSovereignGongSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseImmortalApexNuclearPurgeSFX());
  });
});
