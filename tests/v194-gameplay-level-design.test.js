import { describe, it } from 'node:test';
import assert from 'node:assert';

import { KillerOfKillers841AdVikingFjordSector } from '../src/gameplay/KillerOfKillers841AdVikingFjordSector.js';
import { KillerOfKillers1609FeudalCastleNinjaSector } from '../src/gameplay/KillerOfKillers1609FeudalCastleNinjaSector.js';
import { KillerOfKillers1942WildcatAerialDogfightSector } from '../src/gameplay/KillerOfKillers1942WildcatAerialDogfightSector.js';
import { KillerOfKillersYautjaPrimeConvergenceArenaSector } from '../src/gameplay/KillerOfKillersYautjaPrimeConvergenceArenaSector.js';
import { KillerOfKillersGrendelPredatorSubmergedHuntSector } from '../src/gameplay/KillerOfKillersGrendelPredatorSubmergedHuntSector.js';
import { KillerOfKillersOniBioMaskKusarigamaSector } from '../src/gameplay/KillerOfKillersOniBioMaskKusarigamaSector.js';
import { KillerOfKillersYautjaDefeatRitualProtocolSector } from '../src/gameplay/KillerOfKillersYautjaDefeatRitualProtocolSector.js';
import { HumanQaKillerOfKillersHUDDirector } from '../src/gameplay/HumanQaKillerOfKillersHUDDirector.js';
import { HumanQaKillerOfKillersMasterAuditor } from '../src/gameplay/HumanQaKillerOfKillersMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v194 Predator: Killer of Killers (2025) 1:1 Level Design & User Rule Suite', () => {
  it('Chantier 1: Viking Fjord 841 AD tracking, shield bash, horn alert, and Grendel ice shatter', () => {
    const sector = new KillerOfKillers841AdVikingFjordSector({ iceSheetThicknessCm: 32.0, ambientBlizzardTempC: -18.5, andersBoneHornDb: 96.0 });

    const prematureBash = sector.executeShieldWallBashAndAxeCleave(35.0);
    assert.strictEqual(prematureBash.success, false);

    const trackRes = sector.trackChieftainZoranAcrossFjordIce(45.0);
    assert.strictEqual(trackRes.status, 'CHIEFTAIN_ZORAN_TRACKED_ON_FROZEN_FJORD');
    assert.strictEqual(trackRes.longshipGraveyardVisible, true);
    assert.strictEqual(sector.zoranVendettaTracked, true);

    const bashRes = sector.executeShieldWallBashAndAxeCleave(35.0);
    assert.strictEqual(bashRes.status, 'SHIELD_WALL_BASH_AND_BEARDED_AXE_CLEAVE_EXECUTED');
    assert.strictEqual(bashRes.zoranBloodVengeanceFulfilled, true);
    assert.strictEqual(sector.shieldWallBashExecuted, true);

    const hornRes = sector.soundAndersCarvedBoneHorn();
    assert.strictEqual(hornRes.status, 'ANDERS_CARVED_BONE_HORN_SOUNDED');
    assert.strictEqual(hornRes.predatorNoticeTriggered, true);
    assert.strictEqual(sector.andersHornSounded, true);

    const shatterRes = sector.shatterFjordIceUnderGrendelWeight(240.0);
    assert.strictEqual(shatterRes.status, 'GRENDEL_YAUTJA_AMBUSH_FRACTURED_FJORD_ICE');
    assert.strictEqual(shatterRes.underwaterCombatPhaseInitiated, true);
    assert.strictEqual(sector.grendelAmbushTriggered, true);
    assert.strictEqual(sector.fjordIceFractured, true);
  });

  it('Chantier 2: Feudal Japan 1609 sibling katana duel, metsubushi smoke screen, and brothers alliance', () => {
    const sector = new KillerOfKillers1609FeudalCastleNinjaSector({ roofPitchAngleDeg: 38.0, smokePelletsCount: 2 });

    const duelRes = sector.engageSiblingKatanaDuelOnRooftop(0.4);
    assert.strictEqual(duelRes.status, 'SIBLING_KATANA_DUEL_ENGAGED_ON_ROOFTOP');
    assert.strictEqual(duelRes.sparksFromClashingSteel, true);
    assert.strictEqual(sector.siblingDuelEngaged, true);

    const smokeRes = sector.deployNinjaSmokeScreen(95.0);
    assert.strictEqual(smokeRes.status, 'NINJA_SMOKE_SCREEN_DEPLOYED');
    assert.strictEqual(smokeRes.thermalScanDisrupted, true);
    assert.strictEqual(sector.smokeScreenDeployed, true);
    assert.strictEqual(sector.smokePelletsCount, 1);

    const deflectRes = sector.deflectElectroPlasmaShuriken();
    assert.strictEqual(deflectRes.status, 'ELECTRO_PLASMA_SHURIKEN_DEFLECTED_BY_STEEL');
    assert.strictEqual(deflectRes.oniHunterPositionPinpointed, true);
    assert.strictEqual(sector.shurikenDeflected, true);

    const brothersRes = sector.uniteBrothersAgainstOniDemon();
    assert.strictEqual(brothersRes.status, 'BROTHERS_UNITED_AGAINST_ONI_YAUTJA');
    assert.strictEqual(brothersRes.ninjaSamuraiCrossTacticActive, true);
    assert.strictEqual(sector.brothersUnitedTactic, true);
  });

  it('Chantier 3: 1942 North African Wildcat aerial dogfight, .50 cal bursts, and ghost interceptor decloaking', () => {
    const sector = new KillerOfKillers1942WildcatAerialDogfightSector({ flightAltitudeM: 6500.0, airspeedKnots: 265.0, fiftyCalAmmoRounds: 1800 });

    const prematureDecloak = sector.decloakYautjaScoutInterceptor();
    assert.strictEqual(prematureDecloak.success, false);

    const diveRes = sector.diveIntoCumulonimbusCloudDeck();
    assert.strictEqual(diveRes.status, 'CUMULONIMBUS_CLOUD_DECK_ENTERED');
    assert.strictEqual(diveRes.plasmaLockBroken, true);
    assert.strictEqual(sector.cumulonimbusCloudEntered, true);

    const burstRes = sector.fireSynchronizedFiftyCalBurst(2.0);
    assert.strictEqual(burstRes.status, 'SYNCHRONIZED_FIFTY_CAL_BURST_DISCHARGED');
    assert.strictEqual(burstRes.tracerLeadStreamRevealingWake, true);
    assert.strictEqual(sector.machineGunBurstDischarged, true);

    const decloakRes = sector.decloakYautjaScoutInterceptor();
    assert.strictEqual(decloakRes.status, 'YAUTJA_SCOUT_INTERCEPTOR_DECLOAKED');
    assert.strictEqual(decloakRes.hullOpticalCamouflageShattered, true);
    assert.strictEqual(sector.yautjaScoutShipDecloaked, true);

    const rollRes = sector.executeHighGBarrelRollAndStrafingRun();
    assert.strictEqual(rollRes.status, 'HIGH_G_BARREL_ROLL_AND_STRAFING_RUN_EXECUTED');
    assert.strictEqual(rollRes.alienRepulsorPunctured, true);
    assert.strictEqual(sector.highGBarrelRollExecuted, true);
  });

  it('Chantier 4: Yautja Prime gladiator colosseum convergence and cross-era triad synchronization', () => {
    const sector = new KillerOfKillersYautjaPrimeConvergenceArenaSector({ arenaDiameterM: 140.0, plasmaGateVoltageKv: 75.0 });

    const prematureSync = sector.synchronizeCrossEraWarriorTriad();
    assert.strictEqual(prematureSync.success, false);

    const awakenRes = sector.awakenWarriorsInGladiatorPits();
    assert.strictEqual(awakenRes.status, 'WARRIORS_AWAKENED_IN_GLADIATOR_HOLDING_PITS');
    assert.strictEqual(awakenRes.warriorsCount, 3);
    assert.strictEqual(sector.warriorsAwakenedInHoldingCells, true);

    const syncRes = sector.synchronizeCrossEraWarriorTriad();
    assert.strictEqual(syncRes.status, 'CROSS_ERA_WARRIOR_TRIAD_SYNCHRONIZED');
    assert.strictEqual(syncRes.honorPledgeAffirmed, true);
    assert.strictEqual(sector.crossEraTriadSynchronized, true);

    const breachRes = sector.breachPlasmaContainmentGrids();
    assert.strictEqual(breachRes.status, 'PLASMA_CONTAINMENT_GRIDS_BREACHED');
    assert.strictEqual(breachRes.colosseumMainFloorExposed, true);
    assert.strictEqual(sector.plasmaContainmentGridsBreached, true);

    const challengeRes = sector.challengeApexColosseumChampion();
    assert.strictEqual(challengeRes.status, 'APEX_COLOSSEUM_CHAMPION_CHALLENGED');
    assert.strictEqual(challengeRes.ultimateHonorTrialInitiated, true);
    assert.strictEqual(sector.grandElderChampionChallenged, true);
  });

  it('Chantier 5: Submerged glacial fjord hunt, hypothermic stealth, and Grendel takedown', () => {
    const sector = new KillerOfKillersGrendelPredatorSubmergedHuntSector({ waterTempCelsius: 0.5, apneaDurationSec: 55.0 });

    const prematureInvis = sector.triggerHypothermicThermalInvisibility();
    assert.strictEqual(prematureInvis.success, false);

    const diveRes = sector.diveBeneathFracturedIceCeiling();
    assert.strictEqual(diveRes.status, 'SUBMERGED_BENEATH_FROZEN_FJORD_ICE');
    assert.strictEqual(sector.submergedInGlacialWater, true);

    const invisRes = sector.triggerHypothermicThermalInvisibility();
    assert.strictEqual(invisRes.status, 'HYPOTHERMIC_THERMAL_INVISIBILITY_ACTIVE');
    assert.strictEqual(invisRes.alienInfraredScanBlinded, true);
    assert.strictEqual(sector.hypothermicInvisibilityActive, true);

    const hookRes = sector.hookGrendelMandiblesWithBeardedAxe(2800.0);
    assert.strictEqual(hookRes.status, 'GRENDEL_MANDIBLES_HOOKED_WITH_BEARDED_AXE');
    assert.strictEqual(hookRes.alienPinnedAgainstIceCeiling, true);
    assert.strictEqual(sector.grendelMandibleHooked, true);

    const takedownRes = sector.executeSubmergedGrendelTakedown();
    assert.strictEqual(takedownRes.status, 'SUBMERGED_GRENDEL_YAUTJA_ELIMINATED');
    assert.strictEqual(takedownRes.walrusIvoryTrophyClaimed, true);
    assert.strictEqual(sector.grendelSubmergedDefeated, true);
  });

  it('Chantier 6: Oni horned bio-mask decoupling and kusarigama chain entanglement', () => {
    const sector = new KillerOfKillersOniBioMaskKusarigamaSector({ chainLengthM: 4.8, plasmaScytheJoules: 2200.0 });

    const evadeRes = sector.avoidKusarigamaPlasmaSwing(120.0);
    assert.strictEqual(evadeRes.evaded, true);
    assert.strictEqual(sector.kusarigamaSwingAvoided, true);

    const entangleRes = sector.entangleAlienWristGauntlet(1850.0);
    assert.strictEqual(entangleRes.status, 'ALIEN_WRIST_GAUNTLET_ENTANGLED');
    assert.strictEqual(entangleRes.plasmaCasterLockDisabled, true);
    assert.strictEqual(sector.alienWristGauntletEntangled, true);

    const severRes = sector.severOniBioMaskLatches();
    assert.strictEqual(severRes.status, 'ONI_BIO_MASK_SEVERED_AND_DETACHED');
    assert.strictEqual(severRes.vulnerableMandiblesExposed, true);
    assert.strictEqual(sector.oniBioMaskSevered, true);
    assert.strictEqual(sector.oniDemonExposed, true);
  });

  it('Chantier 7: Strict User Rule 3 verification in Killer of Killers Fjord (isYautja && health <= 0 && config === KILLER_OF_KILLERS_841AD_FJORD)', () => {
    const protocol = new KillerOfKillersYautjaDefeatRitualProtocolSector();

    // Human player defeated -> Should NEVER trigger self-destruct
    const humanCheck = protocol.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_841AD_FJORD'
    });
    assert.strictEqual(humanCheck.armed, false);
    assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

    // Yautja hunter alive -> Should NOT trigger
    const aliveCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 80,
      configuration: 'KILLER_OF_KILLERS_841AD_FJORD'
    });
    assert.strictEqual(aliveCheck.armed, false);
    assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

    // Wrong arena configuration -> Should NOT trigger
    const wrongArenaCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'PREY_1719_ASPEN_GROVE'
    });
    assert.strictEqual(wrongArenaCheck.armed, false);
    assert.strictEqual(wrongArenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

    // Valid defeat condition
    const validArming = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_841AD_FJORD'
    });
    assert.strictEqual(validArming.status, 'KILLER_OF_KILLERS_GAUNTLET_OVERLOAD_ARMED');
    assert.strictEqual(validArming.countdownSeconds, 15.0);
    assert.strictEqual(validArming.mockingLaughterDb, 105.0);
    assert.strictEqual(protocol.protocolArmed, true);

    // Delta update 5 seconds
    const midUpdate = protocol.updateCountdown(5.0);
    assert.strictEqual(midUpdate.active, true);
    assert.strictEqual(midUpdate.remainingSeconds, 10.0);

    // Final blast detonation
    const blastRes = protocol.updateCountdown(11.0);
    assert.strictEqual(blastRes.status, 'KILLER_OF_KILLERS_MICRO_NUCLEAR_CLEANSING_BLAST');
    assert.strictEqual(blastRes.blastRadiusM, 65.0);
    assert.strictEqual(blastRes.honorScoreGranted, 500);
    assert.strictEqual(protocol.cleansingBlastExecuted, true);
    assert.strictEqual(protocol.honorPreserved, true);
  });

  it('Chantier 8: HumanQaKillerOfKillersHUDDirector telemetry and defeat widget update', () => {
    const director = new HumanQaKillerOfKillersHUDDirector();
    const mountRes = director.mount();
    assert.strictEqual(typeof mountRes, 'object');

    const updateRes = director.updateDefeatWidget({
      protocolArmed: true,
      countdownTimerRemaining: 13.2,
      activeGlyph: 'ᚢ'
    });
    assert.strictEqual(updateRes.protocolArmed, true);
    assert.strictEqual(updateRes.activeGlyph, 'ᚢ');
    assert.strictEqual(updateRes.countdownRemainingS, 13.2);

    const summary = director.getAuditsSummary();
    assert.strictEqual(summary.totalAudits, 5);
    assert.strictEqual(summary.allAuditsPassed, true);
  });

  it('Chantier 9: HumanQaKillerOfKillersMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaKillerOfKillersMasterAuditor();
    const report = auditor.runFullKillerOfKillersMasterAudit();
    assert.strictEqual(report.certified, true);
    assert.strictEqual(report.totalAudits, 9);
    assert.strictEqual(report.totalPassed, 9);

    const webglAudit = report.results.find(r => r.sector === 'WebGL_MothershipHub_DrawCall_Invariant');
    assert.ok(webglAudit);
    assert.strictEqual(webglAudit.status, 'PASSED');
    assert.ok(webglAudit.drawCalls <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v194 SFX triggers', () => {
    const iceCrackAcoustics = audioSynth.computeVikingFjordIceCrackAcoustics(32.0, 240.0);
    assert.ok(iceCrackAcoustics.fundamentalHz > 0);
    assert.ok(iceCrackAcoustics.resonanceQ > 0);

    const radialAcoustics = audioSynth.computeWildcatRadialEngineAcoustics(2700.0, 6500.0);
    assert.ok(radialAcoustics.firingFrequencyHz > 0);
    assert.ok(radialAcoustics.engineRumbleGain > 0);

    // Call each of the 15 SFX methods
    assert.doesNotThrow(() => audioSynth.playVikingFjordBlizzardHowlSFX());
    assert.doesNotThrow(() => audioSynth.playAndersAurochsHornEchoSFX());
    assert.doesNotThrow(() => audioSynth.playBeardedAxeShieldBashSFX());
    assert.doesNotThrow(() => audioSynth.playFjordIceFractureShatterSFX());
    assert.doesNotThrow(() => audioSynth.playSubmergedHypothermicHeartbeatSFX());
    assert.doesNotThrow(() => audioSynth.playKawaraRoofTileSlideSFX());
    assert.doesNotThrow(() => audioSynth.playKatanaSteelClashRingSFX());
    assert.doesNotThrow(() => audioSynth.playMetsubushiSmokePopSFX());
    assert.doesNotThrow(() => audioSynth.playElectroShurikenWhirSFX());
    assert.doesNotThrow(() => audioSynth.playKusarigamaChainRattleSFX());
    assert.doesNotThrow(() => audioSynth.playWildcatRadialEngineRoarSFX());
    assert.doesNotThrow(() => audioSynth.playFiftyCalM2MachineGunBurstSFX());
    assert.doesNotThrow(() => audioSynth.playAlienScoutDecloakWarpSFX());
    assert.doesNotThrow(() => audioSynth.playConvergenceGladiatorGateHumSFX());
    assert.doesNotThrow(() => audioSynth.playKillerOfKillersMicroNuclearPurgeSFX());
  });
});
