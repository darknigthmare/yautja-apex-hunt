import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987MacThornyBrushTrackAndCanopyFlareSector } from '../src/gameplay/Predator1987MacThornyBrushTrackAndCanopyFlareSector.js';
import { Predator21990PenthouseCombistickThrustAndBreathingApparatusRuptureSector } from '../src/gameplay/Predator21990PenthouseCombistickThrustAndBreathingApparatusRuptureSector.js';
import { Avp2004HieroglyphicLabyrinthNetPinAndAcidEvasionSector } from '../src/gameplay/Avp2004HieroglyphicLabyrinthNetPinAndAcidEvasionSector.js';
import { AvpRequiem2007HexagonalLaserGridTrapAndDropshipSalvageSector } from '../src/gameplay/AvpRequiem2007HexagonalLaserGridTrapAndDropshipSalvageSector.js';
import { Predators2010RiverRapidsGorgeHoundCollarAndEmpWaveSector } from '../src/gameplay/Predators2010RiverRapidsGorgeHoundCollarAndEmpWaveSector.js';
import { Prey2022BeaverDamDeadfallTrapAndZenithalApexCitadelSector } from '../src/gameplay/Prey2022BeaverDamDeadfallTrapAndZenithalApexCitadelSector.js';
import { PredatorFranchiseZenithalApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseZenithalApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseZenithalApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseZenithalApexHUDDirector.js';
import { HumanQaPredatorFranchiseZenithalApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseZenithalApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v213 - Predator Franchise Zenithal Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): Mac thorny brush tracking, knife grip mantra, banyan razor-wire snare & canopy flare (+350 Honor)', () => {
    const sector = new Predator1987MacThornyBrushTrackAndCanopyFlareSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_MAC_THORNY_BRUSH_TRACK_AND_CANOPY_FLARE');

    const trackRes = sector.trackLuminescentBloodTrailThroughThornyBrush({
      bloodGlowLux: 28,
      thornyDensityPercent: 85
    });
    assert.equal(trackRes.luminescentBloodTrailTracked, true);

    const mantraRes = sector.whisperMacMantraAndPrimeCombatKnife({
      whisperDecibels: 18,
      knifeGripConfirmed: true
    });
    assert.equal(mantraRes.macMantraWhispered, true);

    const snareRes = sector.rigBanyanTreeRazorWireSnareTrap({
      wireTensileMpa: 920,
      anchorBanyanTreesCount: 2
    });
    assert.equal(snareRes.banyanRazorWireSnareRigged, true);

    const flareRes = sector.launchHighAngleCanopyFlareToExposeShimmer({
      flareIlluminationLux: 1200,
      camouflageDisrupted: true
    });
    assert.equal(flareRes.canopyFlareIlluminatedShimmer, true);
    assert.equal(flareRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.canopyFlareIlluminatedShimmer, true);
  });

  it('2. Predator 2 (1990): King Willie penthouse altar, combistick wall thrust, nitrogen mask puncture & medicomp sever (+400 Honor)', () => {
    const sector = new Predator21990PenthouseCombistickThrustAndBreathingApparatusRuptureSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_PENTHOUSE_COMBISTICK_THRUST_AND_BREATHING_APPARATUS_RUPTURE');

    const altarRes = sector.investigateKingWilliePenthouseDecapitationSite({
      ritualAltarScanned: true,
      bloodSpatterAnalyzed: true
    });
    assert.equal(altarRes.penthouseDecapitationSiteInvestigated, true);

    const thrustRes = sector.evadeTelescopingCombistickWallPenetration({
      partitionThicknessMm: 45,
      combistickVelocityMps: 65
    });
    assert.equal(thrustRes.combistickWallThrustEvaded, true);

    const maskRes = sector.dischargeCloseQuartersShotgunIntoBreathingMask({
      muzzleVelocityMps: 410,
      nitrogenTankPunctured: true
    });
    assert.equal(maskRes.nitrogenBreathingMaskRuptured, true);

    const severRes = sector.severCityHunterMedicompWristMountWithBlade({
      severForceNewtons: 780,
      medicompDislodged: true
    });
    assert.equal(severRes.medicompWristMountSevered, true);
    assert.equal(severRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.medicompWristMountSevered, true);
  });

  it('3. AVP (2004): shifting hieroglyphic labyrinth, Grid Alien wall pin, acid tail shield dodge & gauntlet sync (+400 Honor)', () => {
    const sector = new Avp2004HieroglyphicLabyrinthNetPinAndAcidEvasionSector();
    assert.equal(sector.sectorId, 'AVP_2004_HIEROGLYPHIC_LABYRINTH_NET_PIN_AND_ACID_EVASION');

    const labRes = sector.traverseShiftingHieroglyphicLabyrinth({
      shiftCycleSeconds: 600,
      labyrinthDepthMeters: 620
    });
    assert.equal(labRes.hieroglyphicLabyrinthNavigated, true);

    const pinRes = sector.pinGridAlienAgainstSacrificialWallWithCombistick({
      thrustJoules: 4200,
      wallPinned: true
    });
    assert.equal(pinRes.gridAlienPinnedAgainstWall, true);

    const shieldRes = sector.evadeBarbedTailAcidSprayWithShieldDodge({
      acidDodgeAngleDegrees: 45,
      shieldIntegrityPercent: 92
    });
    assert.equal(shieldRes.acidTailSprayShieldEvaded, true);

    const purgeRes = sector.calibrateWristGauntletCountdownWithLexWoods({
      syncLatencyMs: 12,
      purgeTimerSeconds: 300
    });
    assert.equal(purgeRes.wristGauntletPurgeCalibrated, true);
    assert.equal(purgeRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): dropship crater salvage, hexagonal laser grid, corridor swarm lure & dual wristblade decapitation (+400 Honor)', () => {
    const sector = new AvpRequiem2007HexagonalLaserGridTrapAndDropshipSalvageSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_HEXAGONAL_LASER_GRID_TRAP_AND_DROPSHIP_SALVAGE');

    const salvageRes = sector.salvagePlasmaCapsulesFromDropshipCraters({
      cratersSearched: 3,
      plasmaCellsRetrieved: 6
    });
    assert.equal(salvageRes.plasmaCellsSalvaged, true);

    const gridRes = sector.deployHexagonalLaserTripwireGridInCorridor({
      laserBeamsCount: 6,
      tripwireGridArmed: true
    });
    assert.equal(gridRes.hexagonalLaserGridArmed, true);

    const swarmRes = sector.lureDroneSwarmIntoHexagonalLaserCrossfire({
      dronesIncineratedCount: 4,
      corridorSealed: true
    });
    assert.equal(swarmRes.corridorSwarmIncinerated, true);

    const decapRes = sector.executeDualWristbladeDecapitationOnAmbushingDrone({
      bladeExtensionSpeedMps: 18,
      decapitationConfirmed: true
    });
    assert.equal(decapRes.dualWristbladeDecapitationExecuted, true);
    assert.equal(decapRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): rapids gorge traverse, hound spike collar disarm, Stargazer plasma rifle & gauntlet EMP (+450 Honor)', () => {
    const sector = new Predators2010RiverRapidsGorgeHoundCollarAndEmpWaveSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_RIVER_RAPIDS_GORGE_HOUND_COLLAR_AND_EMP_WAVE');

    const rapidsRes = sector.navigatePreserveRiverRapidsGorge({
      waterCurrentKnots: 18,
      gorgeElevationMeters: 120
    });
    assert.equal(rapidsRes.riverRapidsGorgeTraversed, true);

    const collarRes = sector.disarmTrackerHoundProximitySpikeCollars({
      collarSensorsBypassed: true,
      houndPacksDiverted: 2
    });
    assert.equal(collarRes.houndSpikeCollarsNeutralized, true);

    const rifleRes = sector.recoverStargazerPrototypePlasmaRifle({
      batteryChargePercent: 95,
      riflePrimed: true
    });
    assert.equal(rifleRes.prototypePlasmaRifleRecovered, true);

    const empRes = sector.dischargeEmpWaveToShortBiometricGauntlet({
      empPulseMegawatts: 4.5,
      gauntletCircuitsFried: true
    });
    assert.equal(empRes.biometricGauntletEmpFired, true);
    assert.equal(empRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): beaver dam lure, deadfall tree laser sever, Zenithal Citadel ascent & Zenithal Covenant (+500 Honor)', () => {
    const sector = new Prey2022BeaverDamDeadfallTrapAndZenithalApexCitadelSector();
    assert.equal(sector.sectorId, 'PREY_2022_BEAVER_DAM_DEADFALL_TRAP_AND_ZENITHAL_APEX_CITADEL');

    const damRes = sector.lureFeralPredatorAcrossBeaverDamMarsh({
      marshSiltDepthMeters: 1.2,
      sariiDecoyBarkActive: true
    });
    assert.equal(damRes.beaverDamMarshLured, true);

    const logRes = sector.triggerDeadfallTreeToSeverTargetingLaserLock({
      logMassKg: 850,
      laserLockSevered: true
    });
    assert.equal(logRes.deadfallLogLaserSevered, true);

    const ascentRes = sector.ascendZenithalApexCitadelWithThiaAndBud({
      citadelHeightMeters: 5400,
      syntheticTwinDuoSynchronized: true
    });
    assert.equal(ascentRes.zenithalApexCitadelAscended, true);

    const covenantRes = sector.consecrateZenithalApexCovenantUnifyingNineCinematicEras({
      covenantConsecrated: true,
      nineErasUnified: true
    });
    assert.equal(covenantRes.zenithalApexCovenantConsecrated, true);
    assert.equal(covenantRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Zenithal Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseZenithalApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateZenithalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ZENITHAL_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚍ', 'ᚓ', 'ᚏ', '᚜']);
    assert.equal(c1.roarDecibels, 123);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.zenithalApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateZenithalApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ZENITHAL_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateZenithalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_ZENITHAL_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateZenithalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Zenithal Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const mac = new Predator1987MacThornyBrushTrackAndCanopyFlareSector();
    mac.trackLuminescentBloodTrailThroughThornyBrush();
    mac.whisperMacMantraAndPrimeCombatKnife();
    mac.rigBanyanTreeRazorWireSnareTrap();
    mac.launchHighAngleCanopyFlareToExposeShimmer();

    const penthouse = new Predator21990PenthouseCombistickThrustAndBreathingApparatusRuptureSector();
    penthouse.investigateKingWilliePenthouseDecapitationSite();
    penthouse.evadeTelescopingCombistickWallPenetration();
    penthouse.dischargeCloseQuartersShotgunIntoBreathingMask();
    penthouse.severCityHunterMedicompWristMountWithBlade();

    const labyrinth = new Avp2004HieroglyphicLabyrinthNetPinAndAcidEvasionSector();
    labyrinth.traverseShiftingHieroglyphicLabyrinth();
    labyrinth.pinGridAlienAgainstSacrificialWallWithCombistick();
    labyrinth.evadeBarbedTailAcidSprayWithShieldDodge();
    labyrinth.calibrateWristGauntletCountdownWithLexWoods();

    const laser = new AvpRequiem2007HexagonalLaserGridTrapAndDropshipSalvageSector();
    laser.salvagePlasmaCapsulesFromDropshipCraters();
    laser.deployHexagonalLaserTripwireGridInCorridor();
    laser.lureDroneSwarmIntoHexagonalLaserCrossfire();
    laser.executeDualWristbladeDecapitationOnAmbushingDrone();

    const rapids = new Predators2010RiverRapidsGorgeHoundCollarAndEmpWaveSector();
    rapids.navigatePreserveRiverRapidsGorge();
    rapids.disarmTrackerHoundProximitySpikeCollars();
    rapids.recoverStargazerPrototypePlasmaRifle();
    rapids.dischargeEmpWaveToShortBiometricGauntlet();

    const beaver = new Prey2022BeaverDamDeadfallTrapAndZenithalApexCitadelSector();
    beaver.lureFeralPredatorAcrossBeaverDamMarsh();
    beaver.triggerDeadfallTreeToSeverTargetingLaserLock();
    beaver.ascendZenithalApexCitadelWithThiaAndBud();
    beaver.consecrateZenithalApexCovenantUnifyingNineCinematicEras();

    const defeatProtocol = new PredatorFranchiseZenithalApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateZenithalApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ZENITHAL_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseZenithalApexHUDDirector();
    const snap = hud.syncFromSectors({
      macThornySector: mac,
      penthouseSector: penthouse,
      labyrinthSector: labyrinth,
      laserGridSector: laser,
      rapidsEmpSector: rapids,
      beaverDamSector: beaver,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v213-zenithal-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('ZENITHAL APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (133 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseZenithalApexMasterAuditor();
    const res = auditor.runFullZenithalApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 133);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: canopy reflectance, plasma pulse decay and 15 v213 SFX triggers', () => {
    const reflectance = audioSynth.computeZenithalCanopyAcousticReflectance({
      leafDensityIndex: 0.82,
      canopyHeightMeters: 35
    });
    assert.equal(reflectance.leafDensityIndex, 0.82);
    assert.equal(reflectance.canopyHeightMeters, 35);
    assert.ok(reflectance.canopyReflectionFactor > 0.5);
    assert.ok(reflectance.echoDelayMs > 100);
    assert.equal(reflectance.canopyEchoConfirmed, true);

    const decay = audioSynth.computeZenithalPlasmaPulseDecayRate({
      pulsePeakAmplitudeDb: 124,
      decayTimeMs: 380
    });
    assert.equal(decay.pulsePeakAmplitudeDb, 124);
    assert.equal(decay.decayTimeMs, 380);
    assert.ok(decay.decayRateDbPerMs > 0.2);
    assert.equal(decay.residualHarmonicHz, 48);
    assert.equal(decay.pulseDecayStabilized, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playMacThornyBloodDripSFX());
    assert.doesNotThrow(() => audioSynth.playMacCombatKnifeGripSFX());
    assert.doesNotThrow(() => audioSynth.playCanopyFlareLaunchEchoSFX());
    assert.doesNotThrow(() => audioSynth.playPenthouseCombistickThrustSFX());
    assert.doesNotThrow(() => audioSynth.playNitrogenMaskPunctureHissSFX());
    assert.doesNotThrow(() => audioSynth.playMedicompConsoleSeverClangSFX());
    assert.doesNotThrow(() => audioSynth.playHieroglyphicStoneShiftLabyrinthSFX());
    assert.doesNotThrow(() => audioSynth.playAcidSprayShieldDeflectionSFX());
    assert.doesNotThrow(() => audioSynth.playHexagonalLaserTripwireHumSFX());
    assert.doesNotThrow(() => audioSynth.playDualWristbladeDecapitationSnapSFX());
    assert.doesNotThrow(() => audioSynth.playRapidsGorgeTorrentialRumbleSFX());
    assert.doesNotThrow(() => audioSynth.playHoundSpikeCollarDeactivationBeepSFX());
    assert.doesNotThrow(() => audioSynth.playPrototypePlasmaRifleEmpDischargeSFX());
    assert.doesNotThrow(() => audioSynth.playBeaverDamDeadfallTreeCrashSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseZenithalApexNuclearPurgeSFX());
  });
});
