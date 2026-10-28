import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987DillonSeveredArmDualMp5AndJunglePincerSector } from '../src/gameplay/Predator1987DillonSeveredArmDualMp5AndJunglePincerSector.js';
import { Predator21990EasternColumbiaLedgeAndSmartDiscForearmSeverSector } from '../src/gameplay/Predator21990EasternColumbiaLedgeAndSmartDiscForearmSeverSector.js';
import { Avp2004LexAcidEtchedClanMarkAndQueenIceShelfCollapseSector } from '../src/gameplay/Avp2004LexAcidEtchedClanMarkAndQueenIceShelfCollapseSector.js';
import { AvpRequiem2007CemeteryCryptInfiltrationAndDualTurretRigSector } from '../src/gameplay/AvpRequiem2007CemeteryCryptInfiltrationAndDualTurretRigSector.js';
import { Predators2010CaptiveCrucifixReleaseAndStargazerConvoyDartSector } from '../src/gameplay/Predators2010CaptiveCrucifixReleaseAndStargazerConvoyDartSector.js';
import { Prey2022QuicksandBogLaserReflectionAndSupremeApexCrownSector } from '../src/gameplay/Prey2022QuicksandBogLaserReflectionAndSupremeApexCrownSector.js';
import { PredatorFranchiseSupremeApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v209 - Predator Franchise Supreme Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): night pincer ambush, tri-laser acquisition, severed arm MP5 volley & wrist-blade lift (+350 Honor)', () => {
    const sector = new Predator1987DillonSeveredArmDualMp5AndJunglePincerSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_DILLON_SEVERED_ARM_DUAL_MP5_AND_JUNGLE_PINCER');

    const ambushRes = sector.coordinateNightPincerAmbushWithMac({
      flareIlluminationLux: 650,
      claymoresArmedCount: 4
    });
    assert.equal(ambushRes.nightPincerAmbushCoordinated, true);

    const laserRes = sector.detectTriLaserLockOnDillonChest({
      triLaserAcquired: true,
      heartRateBpm: 165
    });
    assert.equal(laserRes.triLaserLockAcquired, true);

    const volleyRes = sector.fireDualMp5AsSeveredArmContinuesVolley({
      roundsDischarged: 60,
      reflexFiringSustained: true
    });
    assert.equal(volleyRes.severedArmMp5VolleyDischarged, true);

    const liftRes = sector.endureWristBladeDualImpalementLift({
      bladePenetrationMm: 120,
      liftHeightMeters: 2.1
    });
    assert.equal(liftRes.wristBladeImpalementLifted, true);
    assert.equal(liftRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.wristBladeImpalementLifted, true);
  });

  it('2. Predator 2 (1990): 140m cornice ledge dangle, net-gun pin, Smart-Disc forearm cut & window plunge (+400 Honor)', () => {
    const sector = new Predator21990EasternColumbiaLedgeAndSmartDiscForearmSeverSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_EASTERN_COLUMBIA_LEDGE_AND_SMART_DISC_FOREARM_SEVER');

    const dangleRes = sector.dangleOverEasternColumbiaCorniceLedge({
      dropHeightMeters: 140,
      gripStrengthNewtons: 850
    });
    assert.equal(dangleRes.corniceLedgeDangled, true);

    const pinRes = sector.endureNetGunPinAgainstOrnamentalCornice({
      wireTensionNewtons: 2800,
      fleshIncisionMm: 8
    });
    assert.equal(pinRes.netGunCornicePinned, true);

    const severRes = sector.severCityHunterForearmWithSmartDisc({
      throwVelocityMps: 75,
      forearmSeveredClean: true
    });
    assert.equal(severRes.cityHunterForearmSevered, true);

    const plungeRes = sector.witnessCityHunterPlungeIntoApartmentWindow({
      plungeDistanceMeters: 18,
      windowShattered: true
    });
    assert.equal(plungeRes.apartmentWindowPlunged, true);
    assert.equal(plungeRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.apartmentWindowPlunged, true);
  });

  it('3. AVP (2004): acid clan mark etching, water tower anchor chain tether & Antarctic ice shelf collapse (+400 Honor)', () => {
    const sector = new Avp2004LexAcidEtchedClanMarkAndQueenIceShelfCollapseSector();
    assert.equal(sector.sectorId, 'AVP_2004_LEX_ACID_ETCHED_CLAN_MARK_AND_QUEEN_ICE_SHELF_COLLAPSE');

    const etchRes = sector.etchClanGlyphWithAcidSeveredFingerTip({
      skinCauterizationTempCelsius: 180,
      bloomedGlyphValid: true
    });
    assert.equal(etchRes.clanGlyphEtchedWithAcid, true);

    const tetherRes = sector.tetherQueenToWhalingStationIronWaterTower({
      cableTensionKiloNewtons: 450,
      towerBuckled: true
    });
    assert.equal(tetherRes.queenTetheredToTower, true);

    const collapseRes = sector.collapseAntarcticIceShelfUnderTowerMass({
      icePlateTonnage: 12000,
      shelfRuptureDepthMeters: 85
    });
    assert.equal(collapseRes.iceShelfRupturedAndCollapsed, true);

    const sinkRes = sector.witnessQueenDragIntoAbyssalOceanDepths({
      queenSubmergedDepthsMeters: 600,
      oceanSinkConfirmed: true
    });
    assert.equal(sinkRes.queenDraggedIntoOceanDepths, true);
    assert.equal(sinkRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): crypt infiltration, dual shoulder turret rig, twin salvo & blue solvent dissolve (+400 Honor)', () => {
    const sector = new AvpRequiem2007CemeteryCryptInfiltrationAndDualTurretRigSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_CEMETERY_CRYPT_INFILTRATION_AND_DUAL_TURRET_RIG');

    const cryptRes = sector.infiltrateGunnisonCemeteryMausoleumCrypt({
      facehuggerCocoonsFound: 8,
      cryptAmbientTempCelsius: 6
    });
    assert.equal(cryptRes.cemeteryCryptInfiltrated, true);

    const rigRes = sector.mountDualShoulderTurretSynchronizedRig({
      twinCannonsCalibrated: true,
      servoAngularSpeedDegPerSec: 180
    });
    assert.equal(rigRes.dualTurretRigMounted, true);

    const salvoRes = sector.dischargeSynchronizedTwinPlasmaSalvo({
      targetClustersNeutralized: 6,
      dischargeJoules: 18400
    });
    assert.equal(salvoRes.twinPlasmaSalvoDischarged, true);

    const dissolveRes = sector.dissolveContaminatedXenoBiomassWithBlueSolvent({
      solventFlasksApplied: 4,
      residueNeutralized: true
    });
    assert.equal(dissolveRes.contaminatedBiomassDissolved, true);
    assert.equal(dissolveRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): crucifix release, honor code exchange & armored convoy explosive darts (+450 Honor)', () => {
    const sector = new Predators2010CaptiveCrucifixReleaseAndStargazerConvoyDartSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_CAPTIVE_CRUCIFIX_RELEASE_AND_STARGAZER_CONVOY_DART');

    const bondsRes = sector.severClassicPredatorCrucifixBondsWithKukri({
      bondSeverJoules: 3400,
      captiveReleased: true
    });
    assert.equal(bondsRes.captiveCrucifixBondsSevered, true);

    const honorRes = sector.exchangeYautjaShipUnlockCodeForHonor({
      unlockCodesExchanged: true,
      respectSaluteExchanged: true
    });
    assert.equal(honorRes.honorCodeExchanged, true);

    const convoyRes = sector.ambushStargazerArmoredConvoyInPineForest({
      convoyTrucksAmbushedCount: 3,
      armorPierced: true
    });
    assert.equal(convoyRes.stargazerConvoyAmbushed, true);

    const dartRes = sector.dischargeExplosiveDartRoundsFromWristLauncher({
      dartVelocityMps: 410,
      targetEngineBlocksVaporized: true
    });
    assert.equal(dartRes.explosiveWristDartsDischarged, true);
    assert.equal(dartRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): quicksand bog submerge, water laser reflection & Supreme Apex Crown (+500 Honor)', () => {
    const sector = new Prey2022QuicksandBogLaserReflectionAndSupremeApexCrownSector();
    assert.equal(sector.sectorId, 'PREY_2022_QUICKSAND_BOG_LASER_REFLECTION_AND_SUPREME_APEX_CROWN');

    const bogRes = sector.submergeInQuicksandBogWithCoolingFlowerPaste({
      bodyTempDroppedCelsius: 31.2,
      thermalStealthActive: true
    });
    assert.equal(bogRes.quicksandBogSubmerged, true);

    const laserRes = sector.reflectTargetingLaserOffStillBogWaterSurface({
      angleOfIncidenceDegrees: 45,
      reflectionCoeff: 0.94
    });
    assert.equal(laserRes.laserReflectedOffWater, true);

    const inversionRes = sector.guideFlechetteBackIntoFeralPredatorHelmet({
      flechetteInversionAccurate: true,
      skullPenetrationMm: 65
    });
    assert.equal(inversionRes.flechetteHelmetInversionComplete, true);

    const crownRes = sector.forgeSupremeApexCrownInMoltenBasaltChamber({
      crownForged: true,
      supremeApexChieftainSovereign: true
    });
    assert.equal(crownRes.supremeApexCrownForged, true);
    assert.equal(crownRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Supreme Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseSupremeApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateSupremeApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚏ', 'ᚎ', 'ᚚ', '᚜']);
    assert.equal(c1.roarDecibels, 119);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.supremeApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateSupremeApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateSupremeApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUPREME_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateSupremeApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Supreme Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const pincer = new Predator1987DillonSeveredArmDualMp5AndJunglePincerSector();
    pincer.coordinateNightPincerAmbushWithMac();
    pincer.detectTriLaserLockOnDillonChest();
    pincer.fireDualMp5AsSeveredArmContinuesVolley();
    pincer.endureWristBladeDualImpalementLift();

    const columbia = new Predator21990EasternColumbiaLedgeAndSmartDiscForearmSeverSector();
    columbia.dangleOverEasternColumbiaCorniceLedge();
    columbia.endureNetGunPinAgainstOrnamentalCornice();
    columbia.severCityHunterForearmWithSmartDisc();
    columbia.witnessCityHunterPlungeIntoApartmentWindow();

    const lexQueen = new Avp2004LexAcidEtchedClanMarkAndQueenIceShelfCollapseSector();
    lexQueen.etchClanGlyphWithAcidSeveredFingerTip();
    lexQueen.tetherQueenToWhalingStationIronWaterTower();
    lexQueen.collapseAntarcticIceShelfUnderTowerMass();
    lexQueen.witnessQueenDragIntoAbyssalOceanDepths();

    const cryptTurret = new AvpRequiem2007CemeteryCryptInfiltrationAndDualTurretRigSector();
    cryptTurret.infiltrateGunnisonCemeteryMausoleumCrypt();
    cryptTurret.mountDualShoulderTurretSynchronizedRig();
    cryptTurret.dischargeSynchronizedTwinPlasmaSalvo();
    cryptTurret.dissolveContaminatedXenoBiomassWithBlueSolvent();

    const crucifixConvoy = new Predators2010CaptiveCrucifixReleaseAndStargazerConvoyDartSector();
    crucifixConvoy.severClassicPredatorCrucifixBondsWithKukri();
    crucifixConvoy.exchangeYautjaShipUnlockCodeForHonor();
    crucifixConvoy.ambushStargazerArmoredConvoyInPineForest();
    crucifixConvoy.dischargeExplosiveDartRoundsFromWristLauncher();

    const quicksandCrown = new Prey2022QuicksandBogLaserReflectionAndSupremeApexCrownSector();
    quicksandCrown.submergeInQuicksandBogWithCoolingFlowerPaste();
    quicksandCrown.reflectTargetingLaserOffStillBogWaterSurface();
    quicksandCrown.guideFlechetteBackIntoFeralPredatorHelmet();
    quicksandCrown.forgeSupremeApexCrownInMoltenBasaltChamber();

    const defeatProtocol = new PredatorFranchiseSupremeApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateSupremeApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_SUPREME_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseSupremeApexHUDDirector();
    const snap = hud.syncFromSectors({
      pincerSeveredArmSector: pincer,
      columbiaLedgeSector: columbia,
      lexAcidQueenSector: lexQueen,
      cemeteryCryptSector: cryptTurret,
      crucifixConvoySector: crucifixConvoy,
      quicksandBogSector: quicksandCrown,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v209-supreme-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('SUPREME APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (137 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseSupremeApexMasterAuditor();
    const res = auditor.runFullSupremeApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 137);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: Dillon severed arm MP5, bog water laser reflection acoustics and 15 v209 SFX triggers', () => {
    const mp5Acoustics = audioSynth.computeDillonSeveredArmDualMp5Acoustics({
      burstRateRpm: 800,
      muzzleFlashLux: 4500
    });
    assert.equal(mp5Acoustics.burstRateRpm, 800);
    assert.equal(mp5Acoustics.muzzleFlashLux, 4500);
    assert.equal(mp5Acoustics.severedReflexFired, true);

    const laserAcoustics = audioSynth.computeBogWaterLaserReflectionAcoustics({
      incidenceAngleDeg: 45,
      reflectionCoeff: 0.94
    });
    assert.equal(laserAcoustics.incidenceAngleDeg, 45);
    assert.equal(laserAcoustics.reflectionCoeff, 0.94);
    assert.equal(laserAcoustics.inversionTargetLocked, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playDillonSeveredArmDefiantBurstSFX());
    assert.doesNotThrow(() => audioSynth.playJunglePincerNightFlareHumSFX());
    assert.doesNotThrow(() => audioSynth.playEasternColumbiaCorniceCrumbleSFX());
    assert.doesNotThrow(() => audioSynth.playSmartDiscForearmSeverCleanZipSFX());
    assert.doesNotThrow(() => audioSynth.playLexAcidEtchedForeheadSizzleSFX());
    assert.doesNotThrow(() => audioSynth.playAntarcticIceShelfCrevasseGroanSFX());
    assert.doesNotThrow(() => audioSynth.playCemeteryCryptMausoleumDoorSlideSFX());
    assert.doesNotThrow(() => audioSynth.playDualTurretRigServoWhineSFX());
    assert.doesNotThrow(() => audioSynth.playCaptiveCrucifixKukriCutSFX());
    assert.doesNotThrow(() => audioSynth.playStargazerConvoyArmorPierceDartSFX());
    assert.doesNotThrow(() => audioSynth.playBogQuicksandSuctionBubbleSFX());
    assert.doesNotThrow(() => audioSynth.playLaserSightReflectionWaterChirpSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskQueenGeothermalHissSFX());
    assert.doesNotThrow(() => audioSynth.playSupremeApexCrownResonanceGongSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseSupremeApexNuclearPurgeSFX());
  });
});
