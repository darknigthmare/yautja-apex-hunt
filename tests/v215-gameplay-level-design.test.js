import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987PinePitchTorchAndPrimalValleyRoarSector } from '../src/gameplay/Predator1987PinePitchTorchAndPrimalValleyRoarSector.js';
import { Predator21990LostTribeTrophyShipChamberAndSmartDiscDuelSector } from '../src/gameplay/Predator21990LostTribeTrophyShipChamberAndSmartDiscDuelSector.js';
import { Avp2004WhalingStationOilTankChainAndCliffPlungeSector } from '../src/gameplay/Avp2004WhalingStationOilTankChainAndCliffPlungeSector.js';
import { AvpRequiem2007AcousticLureAndPredalienClawLockSector } from '../src/gameplay/AvpRequiem2007AcousticLureAndPredalienClawLockSector.js';
import { Predators2010GrassFieldKatanaDuelAndFalconDroneSector } from '../src/gameplay/Predators2010GrassFieldKatanaDuelAndFalconDroneSector.js';
import { Prey2022MudPitShieldTriggerAndEtherealApexSanctumSector } from '../src/gameplay/Prey2022MudPitShieldTriggerAndEtherealApexSanctumSector.js';
import { PredatorFranchiseEtherealApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseEtherealApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseEtherealApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseEtherealApexHUDDirector.js';
import { HumanQaPredatorFranchiseEtherealApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseEtherealApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v215 - Predator Franchise Ethereal Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): pine pitch torch, primal valley roar, thermal visor blind & counterweight log ramp (+350 Honor)', () => {
    const sector = new Predator1987PinePitchTorchAndPrimalValleyRoarSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_PINE_PITCH_TORCH_AND_PRIMAL_VALLEY_ROAR');

    const torchRes = sector.craftPinePitchTorchWithJungleSap({
      sapViscosityCpoise: 850,
      torchBurnMinutes: 25
    });
    assert.equal(torchRes.pinePitchTorchCrafted, true);

    const roarRes = sector.unleashPrimalValleyChallengeRoar({
      roarDecibels: 114,
      echoDurationSeconds: 4.2
    });
    assert.equal(roarRes.primalValleyRoarEchoed, true);

    const blindRes = sector.hurlBlazingTorchToOverwhelmThermalSensors({
      throwVelocityMps: 22,
      thermalFilterBlinded: true
    });
    assert.equal(blindRes.thermalSensorsBlindedWithTorch, true);

    const rampRes = sector.triggerCounterweightLogRampCrush({
      logRampMassKg: 750,
      rampDropJoules: 18200
    });
    assert.equal(rampRes.counterweightLogRampCrushTriggered, true);
    assert.equal(rampRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.counterweightLogRampCrushTriggered, true);
  });

  it('2. Predator 2 (1990): Lost Tribe ship interior, trophy wall skulls, smart-disc bulkhead duel & fatal chest slash (+400 Honor)', () => {
    const sector = new Predator21990LostTribeTrophyShipChamberAndSmartDiscDuelSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_LOST_TRIBE_TROPHY_SHIP_CHAMBER_AND_SMART_DISC_DUEL');

    const chamberRes = sector.discoverSubterraneanLostTribeTrophyChamber({
      shipDepthMeters: 35,
      trophyWallScanned: true
    });
    assert.equal(chamberRes.subterraneanTrophyChamberDiscovered, true);

    const skullsRes = sector.examineMountedXenomorphAndApexWarriorSkulls({
      skullsCount: 8,
      xenomorphChitinIdentified: true
    });
    assert.equal(skullsRes.mountedSkullsTrophyWallExamined, true);

    const duelRes = sector.duelCityHunterWithRicochetingSmartDisc({
      bulkheadBouncesCount: 4,
      discSpinRpm: 4500
    });
    assert.equal(duelRes.smartDiscBulkheadDuelWon, true);

    const slashRes = sector.deliverFatalSmartDiscChestSlashToCityHunter({
      slashDepthMm: 65,
      cityHunterTerminated: true
    });
    assert.equal(slashRes.fatalSmartDiscChestSlashDelivered, true);
    assert.equal(slashRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.fatalSmartDiscChestSlashDelivered, true);
  });

  it('3. AVP (2004): industrial winch chain, wrist-blade chain lock, oil tank cliff release & coastal snowdrift leap (+400 Honor)', () => {
    const sector = new Avp2004WhalingStationOilTankChainAndCliffPlungeSector();
    assert.equal(sector.sectorId, 'AVP_2004_WHALING_STATION_OIL_TANK_CHAIN_AND_CLIFF_PLUNGE');

    const chainRes = sector.secureIndustrialWinchChainToQueenCarapace({
      chainTensileKn: 650,
      linkPinned: true
    });
    assert.equal(chainRes.industrialWinchChainSecured, true);

    const bladeRes = sector.launchWristBladeToLockChainToOilReservoir({
      bladeSpeedMps: 48,
      reservoirTankLocked: true
    });
    assert.equal(bladeRes.wristBladeChainLockFired, true);

    const tankRes = sector.triggerTankReleaseDownOceanCliff({
      tankMassMetricTons: 18,
      cliffDropMeters: 110
    });
    assert.equal(tankRes.oilTankCliffReleaseTriggered, true);

    const leapRes = sector.leapClearOntoCoastalSnowdriftWithLexWoods({
      leapDistanceMeters: 6.2,
      queenPlungeConfirmed: true
    });
    assert.equal(leapRes.coastalSnowdriftLeapEscaped, true);
    assert.equal(leapRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): mimic acoustic lure, dual charged plasma volley, cooling tower claw lock & medicomp powder (+400 Honor)', () => {
    const sector = new AvpRequiem2007AcousticLureAndPredalienClawLockSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_ACOUSTIC_LURE_AND_PREDALIEN_CLAW_LOCK');

    const lureRes = sector.broadcastMimicCivilianAcousticLure({
      audioDecibels: 96,
      predalienBaitConfirmed: true
    });
    assert.equal(lureRes.mimicCivilianLureBroadcasted, true);

    const plasmaRes = sector.dischargeDualChargedPlasmaVolley({
      plasmaJoules: 16000,
      dreadlocksVaporized: true
    });
    assert.equal(plasmaRes.dreadlocksVaporizedPlasmaVolley, true);

    const clawRes = sector.engagePredalienInMutualClawLockClash({
      lockDurationSeconds: 8.5,
      gripForceNewtons: 7200
    });
    assert.equal(clawRes.mutualClawLockDuelEngaged, true);

    const medicompRes = sector.deployMedicompStypticPowderToShoulderWound({
      powderGrams: 15,
      woundCauterized: true
    });
    assert.equal(medicompRes.medicompStypticPowderApplied, true);
    assert.equal(medicompRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): barefoot grass field, falcon drone evasion, katana wristblade clash & mutual cut (+450 Honor)', () => {
    const sector = new Predators2010GrassFieldKatanaDuelAndFalconDroneSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_GRASS_FIELD_KATANA_DUEL_AND_FALCON_DRONE');

    const stepRes = sector.stepBarefootIntoWaistHighGrassField({
      windSpeedKnots: 14,
      silenceMaintained: true
    });
    assert.equal(stepRes.barefootGrassFieldStepped, true);

    const droneRes = sector.evadeFalconerDroneLaserStrafingRuns({
      strafeAltitudeMeters: 12,
      droneLaserEvaded: true
    });
    assert.equal(droneRes.falconDroneStrafingEvaded, true);

    const clashRes = sector.executeHonorableKatanaSlashAgainstWristblade({
      katanaStrikeJoules: 3200,
      bladeClashConfirmed: true
    });
    assert.equal(clashRes.katanaWristbladeDuelEngaged, true);

    const cutRes = sector.severFalconerPredatorTorsoInMutualStrike({
      torsoCutMm: 85,
      falconerDefeated: true
    });
    assert.equal(cutRes.falconerTorsoSeveredInMutualStrike, true);
    assert.equal(cutRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): mud pit vortex, severed gauntlet shield spring, Ethereal Sanctum ascent & Ethereal Covenant (+500 Honor)', () => {
    const sector = new Prey2022MudPitShieldTriggerAndEtherealApexSanctumSector();
    assert.equal(sector.sectorId, 'PREY_2022_MUD_PIT_SHIELD_TRIGGER_AND_ETHEREAL_APEX_SANCTUM');

    const mudRes = sector.lureFeralIntoBubblingMudPitVortex({
      mudViscosityKgMs: 120,
      feralImmobilized: true
    });
    assert.equal(mudRes.feralImmobilizedInMudPit, true);

    const shieldRes = sector.triggerSeveredGauntletShieldSpringLock({
      springVelocityMps: 32,
      throatImpactJoules: 4800
    });
    assert.equal(shieldRes.severedGauntletShieldTriggered, true);

    const ascentRes = sector.ascendEtherealApexSanctumWithThiaAndBud({
      pinnacleAltitudeMeters: 7600,
      cyberneticResonanceHz: 432
    });
    assert.equal(ascentRes.etherealApexSanctumAscended, true);

    const sanctumRes = sector.consecrateEtherealApexSanctumUnifyingAllNineFilms({
      etherealSanctumConsecrated: true,
      nineFilmsUnified: true
    });
    assert.equal(sanctumRes.etherealApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Ethereal Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseEtherealApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateEtherealApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ETHEREAL_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚏ', 'ᚓ', 'ᚏ', '᚜']);
    assert.equal(c1.roarDecibels, 125);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.etherealApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateEtherealApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ETHEREAL_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateEtherealApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_ETHEREAL_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateEtherealApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Ethereal Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const pine = new Predator1987PinePitchTorchAndPrimalValleyRoarSector();
    pine.craftPinePitchTorchWithJungleSap();
    pine.unleashPrimalValleyChallengeRoar();
    pine.hurlBlazingTorchToOverwhelmThermalSensors();
    pine.triggerCounterweightLogRampCrush();

    const trophy = new Predator21990LostTribeTrophyShipChamberAndSmartDiscDuelSector();
    trophy.discoverSubterraneanLostTribeTrophyChamber();
    trophy.examineMountedXenomorphAndApexWarriorSkulls();
    trophy.duelCityHunterWithRicochetingSmartDisc();
    trophy.deliverFatalSmartDiscChestSlashToCityHunter();

    const whaling = new Avp2004WhalingStationOilTankChainAndCliffPlungeSector();
    whaling.secureIndustrialWinchChainToQueenCarapace();
    whaling.launchWristBladeToLockChainToOilReservoir();
    whaling.triggerTankReleaseDownOceanCliff();
    whaling.leapClearOntoCoastalSnowdriftWithLexWoods();

    const acoustic = new AvpRequiem2007AcousticLureAndPredalienClawLockSector();
    acoustic.broadcastMimicCivilianAcousticLure();
    acoustic.dischargeDualChargedPlasmaVolley();
    acoustic.engagePredalienInMutualClawLockClash();
    acoustic.deployMedicompStypticPowderToShoulderWound();

    const katana = new Predators2010GrassFieldKatanaDuelAndFalconDroneSector();
    katana.stepBarefootIntoWaistHighGrassField();
    katana.evadeFalconerDroneLaserStrafingRuns();
    katana.executeHonorableKatanaSlashAgainstWristblade();
    katana.severFalconerPredatorTorsoInMutualStrike();

    const mud = new Prey2022MudPitShieldTriggerAndEtherealApexSanctumSector();
    mud.lureFeralIntoBubblingMudPitVortex();
    mud.triggerSeveredGauntletShieldSpringLock();
    mud.ascendEtherealApexSanctumWithThiaAndBud();
    mud.consecrateEtherealApexSanctumUnifyingAllNineFilms();

    const defeatProtocol = new PredatorFranchiseEtherealApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateEtherealApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ETHEREAL_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseEtherealApexHUDDirector();
    const snap = hud.syncFromSectors({
      pineTorchSector: pine,
      trophyShipSector: trophy,
      whalingChainSector: whaling,
      acousticLureSector: acoustic,
      katanaDuelSector: katana,
      mudPitSector: mud,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v215-ethereal-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('ETHEREAL APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (131 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseEtherealApexMasterAuditor();
    const res = auditor.runFullEtherealApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 131);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: pitch torch acoustics, mud pit damping acoustics and 15 v215 SFX triggers', () => {
    const torchAcoustics = audioSynth.computeEtherealPitchTorchLuminanceAcoustics({
      flameTemperatureCelsius: 650,
      airOxygenPercent: 21
    });
    assert.equal(torchAcoustics.flameTemperatureCelsius, 650);
    assert.equal(torchAcoustics.airOxygenPercent, 21);
    assert.ok(torchAcoustics.flickerFreqHz > 35);
    assert.ok(torchAcoustics.roarDecibels >= 55);
    assert.equal(torchAcoustics.pitchTorchAcousticsStable, true);

    const mudAcoustics = audioSynth.computeEtherealMudPitDampingAcoustics({
      mudViscosityKgMs: 120,
      splashFrequencyHz: 84
    });
    assert.equal(mudAcoustics.mudViscosityKgMs, 120);
    assert.equal(mudAcoustics.splashFrequencyHz, 84);
    assert.ok(mudAcoustics.dampingCoefficient > 0);
    assert.ok(mudAcoustics.dampedFreqHz > 0);
    assert.equal(mudAcoustics.mudDampingConfirmed, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playPinePitchTorchFlameHissSFX());
    assert.doesNotThrow(() => audioSynth.playPrimalValleyRoarEchoSFX());
    assert.doesNotThrow(() => audioSynth.playTorchThermalVisorBlindSizzleSFX());
    assert.doesNotThrow(() => audioSynth.playCounterweightLogRampImpactSFX());
    assert.doesNotThrow(() => audioSynth.playLostTribeShipHangarDoorSlideSFX());
    assert.doesNotThrow(() => audioSynth.playTrophyWallSkullScanChirpSFX());
    assert.doesNotThrow(() => audioSynth.playBulkheadSmartDiscRicochetSFX());
    assert.doesNotThrow(() => audioSynth.playIndustrialWinchChainTensionGroanSFX());
    assert.doesNotThrow(() => audioSynth.playOilTankCliffDropWhistleSFX());
    assert.doesNotThrow(() => audioSynth.playAcousticMimicDistressCallSFX());
    assert.doesNotThrow(() => audioSynth.playPredalienDreadlocksVaporizationSFX());
    assert.doesNotThrow(() => audioSynth.playWaistHighGrassFieldRustleSFX());
    assert.doesNotThrow(() => audioSynth.playHanzoKatanaClashFalconerBladeSFX());
    assert.doesNotThrow(() => audioSynth.playEtherealMudPitSuctionSquelchSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseEtherealApexNuclearPurgeSFX());
  });
});
