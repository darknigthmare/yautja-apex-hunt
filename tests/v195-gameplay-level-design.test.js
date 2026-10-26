import { describe, it } from 'node:test';
import assert from 'node:assert';

import { KillerOfKillers841AdGlacialCrevasseSector } from '../src/gameplay/KillerOfKillers841AdGlacialCrevasseSector.js';
import { KillerOfKillers1609BambooGroveShojiSector } from '../src/gameplay/KillerOfKillers1609BambooGroveShojiSector.js';
import { KillerOfKillers1942SaharaDuneCrashSector } from '../src/gameplay/KillerOfKillers1942SaharaDuneCrashSector.js';
import { KillerOfKillersYautjaPrimeKaliskPitSector } from '../src/gameplay/KillerOfKillersYautjaPrimeKaliskPitSector.js';
import { KillerOfKillersGrendelRunicLongshipSector } from '../src/gameplay/KillerOfKillersGrendelRunicLongshipSector.js';
import { KillerOfKillersOniThroneRoomTatamiSector } from '../src/gameplay/KillerOfKillersOniThroneRoomTatamiSector.js';
import { KillerOfKillersYautjaDefeatConvergenceProtocolSector } from '../src/gameplay/KillerOfKillersYautjaDefeatConvergenceProtocolSector.js';
import { HumanQaKillerOfKillersConvergenceHUDDirector } from '../src/gameplay/HumanQaKillerOfKillersConvergenceHUDDirector.js';
import { HumanQaKillerOfKillersConvergenceMasterAuditor } from '../src/gameplay/HumanQaKillerOfKillersConvergenceMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v195 Predator: Killer of Killers (2025) Convergence & Historical Level Design Suite', () => {
  it('Chantier 1: Glacial crevasse green blood tracking, iron spike trap, and Anders diversion drop', () => {
    const sector = new KillerOfKillers841AdGlacialCrevasseSector({ crevasseDepthM: 42.0, ironTrapClampingForceN: 3200.0 });

    const prematureConceal = sector.concealIronSpikeTrapInDrift(35.0);
    assert.strictEqual(prematureConceal.success, false);

    const bloodRes = sector.trackPhosphorGreenBloodAcrossCrevasse(45.0);
    assert.strictEqual(bloodRes.status, 'PHOSPHOR_GREEN_BLOOD_TRACKED_IN_SNOW');
    assert.strictEqual(bloodRes.trailLeadsToIceBridge, true);
    assert.strictEqual(sector.greenBloodTracked, true);

    const trapRes = sector.concealIronSpikeTrapInDrift(35.0);
    assert.strictEqual(trapRes.status, 'IRON_SPIKE_TRAP_CONCEALED_IN_SNOW_DRIFT');
    assert.strictEqual(trapRes.chokepointSecured, true);
    assert.strictEqual(sector.spikeTrapConcealed, true);

    const divRes = sector.triggerAndersFlankingDiversion();
    assert.strictEqual(divRes.status, 'ANDERS_DIVERSION_TRIGGERED_ALIEN_LEAPED_INTO_TRAP');
    assert.strictEqual(divRes.alienLegSnaredInIronJaws, true);
    assert.strictEqual(sector.alienLegTrapped, true);

    const dropRes = sector.executeCrevasseIceShelfDropTakedown();
    assert.strictEqual(dropRes.status, 'CREVASSE_ICE_SHELF_DROP_TAKEDOWN_EXECUTED');
    assert.strictEqual(dropRes.runicArmorPlatingPunctured, true);
    assert.strictEqual(sector.iceShelfDropExecuted, true);
  });

  it('Chantier 2: Bamboo grove makibishi scattering, shoji shadow tracking, and fukidake dart cleave', () => {
    const sector = new KillerOfKillers1609BambooGroveShojiSector({ bambooCulmDensity: 85, makibishiStock: 24 });

    const caltropRes = sector.scatterMakibishiCaltropsOnTrail(16);
    assert.strictEqual(caltropRes.status, 'MAKIBISHI_CALTROPS_SCATTERED_ON_TRAIL');
    assert.strictEqual(caltropRes.droppedCount, 16);
    assert.strictEqual(sector.makibishiScattered, true);
    assert.strictEqual(sector.makibishiStock, 8);

    const shojiRes = sector.trackShadowSilhouetteThroughShoji(45.0);
    assert.strictEqual(shojiRes.status, 'SHADOW_SILHOUETTE_TRACKED_THROUGH_SHOJI');
    assert.strictEqual(shojiRes.targetCoordinatesLocked, true);
    assert.strictEqual(sector.shojiSilhouetteTracked, true);

    const dartRes = sector.dischargeFukidakeBlowdartThroughWashi();
    assert.strictEqual(dartRes.status, 'FUKIDAKE_BLOWDART_DISCHARGED_THROUGH_WASHI');
    assert.strictEqual(dartRes.washiPaperPuncturedSilently, true);
    assert.strictEqual(sector.blowdartDischarged, true);

    const cleaveRes = sector.cleaveThroughPaperScreenWithKatana();
    assert.strictEqual(cleaveRes.status, 'SHOJI_SCREEN_CLEAVED_WITH_KATANA');
    assert.strictEqual(cleaveRes.alienTorsoSlashed, true);
    assert.strictEqual(sector.shojiScreenCleaved, true);
  });

  it('Chantier 3: 1942 Libyan Sahara dune crash, heat mirage, phosphorus flare, and M1911 mag dump', () => {
    const sector = new KillerOfKillers1942SaharaDuneCrashSector({ sandDuneHeightM: 18.0, groundTempCelsius: 54.0, m1911RoundsRemaining: 7 });

    const prematureMirage = sector.utilizeSaharaHeatMirageCamouflage();
    assert.strictEqual(prematureMirage.success, false);

    const extricateRes = sector.extricateFromWildcatCockpitWreckage();
    assert.strictEqual(extricateRes.status, 'EXTRICATED_FROM_WILDCAT_WRECKAGE');
    assert.strictEqual(extricateRes.flarePistolSalvaged, true);
    assert.strictEqual(sector.cockpitExtricated, true);

    const mirageRes = sector.utilizeSaharaHeatMirageCamouflage();
    assert.strictEqual(mirageRes.status, 'SAHARA_HEAT_MIRAGE_CAMOUFLAGE_ACTIVE');
    assert.strictEqual(mirageRes.ambientInfraredBloomPct, 92.0);
    assert.strictEqual(sector.thermalMirageActive, true);

    const flareRes = sector.dischargePhosphorusFlareBlindness();
    assert.strictEqual(flareRes.status, 'PHOSPHORUS_FLARE_BLINDNESS_TRIGGERED');
    assert.strictEqual(flareRes.alienBiomaskOpticsSaturated, true);
    assert.strictEqual(sector.phosphorusFlareFired, true);

    const magDumpRes = sector.executePointBlankM1911MagDump();
    assert.strictEqual(magDumpRes.status, 'POINT_BLANK_M1911_MAG_DUMP_EXECUTED');
    assert.strictEqual(magDumpRes.roundsFired, 7);
    assert.strictEqual(sector.m1911RoundsRemaining, 0);
    assert.strictEqual(sector.m1911MagDumpExecuted, true);
  });

  it('Chantier 4: Yautja Prime Kalisk pit release, 360 phalanx formation, and Alpha takedown', () => {
    const sector = new KillerOfKillersYautjaPrimeKaliskPitSector({ kaliskHoundsCount: 4, pitSandFrictionMu: 0.35 });

    const prematurePhalanx = sector.formTriangularPhalanxFormation();
    assert.strictEqual(prematurePhalanx.success, false);

    const releaseRes = sector.releaseKaliskBeastPack();
    assert.strictEqual(releaseRes.status, 'KALISK_BEAST_PACK_RELEASED');
    assert.strictEqual(releaseRes.houndsCount, 4);
    assert.strictEqual(sector.beastPackReleased, true);

    const phalanxRes = sector.formTriangularPhalanxFormation();
    assert.strictEqual(phalanxRes.status, 'TRIANGULAR_PHALANX_FORMATION_FORMED');
    assert.strictEqual(phalanxRes.defensivePerimeterDeg, 360.0);
    assert.strictEqual(sector.triangularPhalanxFormed, true);

    const deflectRes = sector.executeSynchronizedCrossEraDeflection();
    assert.strictEqual(deflectRes.status, 'SYNCHRONIZED_CROSS_ERA_DEFLECTION_EXECUTED');
    assert.strictEqual(deflectRes.staggeredHoundsCount, 3);
    assert.strictEqual(sector.coordinatedParryExecuted, true);

    const alphaRes = sector.annihilateBeastAlphaAndClaimTrophy();
    assert.strictEqual(alphaRes.status, 'KALISK_ALPHA_BEAST_ANNIHILATED');
    assert.strictEqual(alphaRes.gateToGrandElderThroneOpened, true);
    assert.strictEqual(sector.kaliskAlphaDefeated, true);
  });

  it('Chantier 5: Burning Viking longship pyre boarding, meteorite armor, and dragon prow impalement', () => {
    const sector = new KillerOfKillersGrendelRunicLongshipSector({ longshipLengthM: 22.5, deckFlameTempC: 650.0 });

    const prematureArmor = sector.inspectGrendelRunicMeteoriteArmor();
    assert.strictEqual(prematureArmor.success, false);

    const boardRes = sector.boardBurningLongshipPyre();
    assert.strictEqual(boardRes.status, 'BURNING_LONGSHIP_PYRE_BOARDED');
    assert.strictEqual(boardRes.burningTimberCrackling, true);
    assert.strictEqual(sector.burningLongshipBoarded, true);

    const armorRes = sector.inspectGrendelRunicMeteoriteArmor();
    assert.strictEqual(armorRes.status, 'GRENDEL_RUNIC_METEORITE_ARMOR_ANALYZED');
    assert.strictEqual(armorRes.hardnessRockwellHrc, 68.0);
    assert.strictEqual(sector.runicArmorAnalyzed, true);

    const harpoonRes = sector.launchIronGrapplingHarpoonAtMast(3400.0);
    assert.strictEqual(harpoonRes.status, 'IRON_GRAPPLING_HARPOON_LAUNCHED');
    assert.strictEqual(harpoonRes.alienTetheredToRigging, true);
    assert.strictEqual(sector.mastHarpoonLaunched, true);

    const impaleRes = sector.impaleGrendelAgainstDragonProw();
    assert.strictEqual(impaleRes.status, 'GRENDEL_IMPALED_AGAINST_DRAGON_PROW');
    assert.strictEqual(impaleRes.vikingChieftainAvenged, true);
    assert.strictEqual(sector.dragonProwImpalementExecuted, true);
  });

  it('Chantier 6: Castle throne room tatami entrance, fusuma sliding, and shoulder plasma rail severing', () => {
    const sector = new KillerOfKillersOniThroneRoomTatamiSector({ tatamiMatsCount: 48, fusumaPartitionsCount: 6 });

    const prematureSlide = sector.slideGoldLeafFusumaScreens(90.0);
    assert.strictEqual(prematureSlide.success, false);

    const enterRes = sector.enterTatamiThroneRoom();
    assert.strictEqual(enterRes.status, 'TATAMI_THRONE_ROOM_ENTERED');
    assert.strictEqual(enterRes.goldLeafFusumaPresent, true);
    assert.strictEqual(sector.throneRoomEntered, true);

    const slideRes = sector.slideGoldLeafFusumaScreens(90.0);
    assert.strictEqual(slideRes.status, 'GOLD_LEAF_FUSUMA_SCREENS_SLID');
    assert.strictEqual(slideRes.brotherCrossStrikePositioned, true);
    assert.strictEqual(sector.fusumaScreensSlid, true);

    const counterRes = sector.executeDualWieldKabutoWariCounter();
    assert.strictEqual(counterRes.status, 'DUAL_WIELD_KABUTO_WARI_COUNTER_EXECUTED');
    assert.strictEqual(counterRes.oniHunterGuardCrushed, true);
    assert.strictEqual(sector.kabutoWariCounterExecuted, true);

    const severRes = sector.severOniShoulderPlasmaRail();
    assert.strictEqual(severRes.status, 'ONI_SHOULDER_PLASMA_RAIL_SEVERED');
    assert.strictEqual(severRes.plasmaCasterShatteredOnTatami, true);
    assert.strictEqual(sector.shoulderPlasmaRailSevered, true);
  });

  it('Chantier 7: Strict User Rule 3 verification in Convergence Arena (isYautja && health <= 0 && config === KILLER_OF_KILLERS_CONVERGENCE_ARENA)', () => {
    const protocol = new KillerOfKillersYautjaDefeatConvergenceProtocolSector();

    // Human player defeated -> Should NEVER trigger self-destruct
    const humanCheck = protocol.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_CONVERGENCE_ARENA'
    });
    assert.strictEqual(humanCheck.armed, false);
    assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

    // Yautja hunter alive -> Should NOT trigger
    const aliveCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 85,
      configuration: 'KILLER_OF_KILLERS_CONVERGENCE_ARENA'
    });
    assert.strictEqual(aliveCheck.armed, false);
    assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

    // Wrong arena configuration -> Should NOT trigger
    const wrongArenaCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_841AD_FJORD'
    });
    assert.strictEqual(wrongArenaCheck.armed, false);
    assert.strictEqual(wrongArenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

    // Valid defeat condition
    const validArming = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_CONVERGENCE_ARENA'
    });
    assert.strictEqual(validArming.status, 'KILLER_OF_KILLERS_CONVERGENCE_GAUNTLET_OVERLOAD_ARMED');
    assert.strictEqual(validArming.countdownSeconds, 15.0);
    assert.strictEqual(validArming.mockingLaughterDb, 105.0);
    assert.strictEqual(protocol.protocolArmed, true);

    // Delta update 5 seconds
    const midUpdate = protocol.updateCountdown(5.0);
    assert.strictEqual(midUpdate.active, true);
    assert.strictEqual(midUpdate.remainingSeconds, 10.0);

    // Final blast detonation
    const blastRes = protocol.updateCountdown(11.0);
    assert.strictEqual(blastRes.status, 'KILLER_OF_KILLERS_CONVERGENCE_MICRO_NUCLEAR_CLEANSING_BLAST');
    assert.strictEqual(blastRes.blastRadiusM, 65.0);
    assert.strictEqual(blastRes.honorScoreGranted, 500);
    assert.strictEqual(protocol.cleansingBlastExecuted, true);
    assert.strictEqual(protocol.honorPreserved, true);
  });

  it('Chantier 8: HumanQaKillerOfKillersConvergenceHUDDirector telemetry and defeat widget update', () => {
    const director = new HumanQaKillerOfKillersConvergenceHUDDirector();
    const mountRes = director.mount();
    assert.strictEqual(typeof mountRes, 'object');

    const updateRes = director.updateDefeatWidget({
      protocolArmed: true,
      countdownTimerRemaining: 14.1,
      activeGlyph: 'ᚖ'
    });
    assert.strictEqual(updateRes.protocolArmed, true);
    assert.strictEqual(updateRes.activeGlyph, 'ᚖ');
    assert.strictEqual(updateRes.countdownRemainingS, 14.1);

    const summary = director.getAuditsSummary();
    assert.strictEqual(summary.totalAudits, 5);
    assert.strictEqual(summary.allAuditsPassed, true);
  });

  it('Chantier 9: HumanQaKillerOfKillersConvergenceMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaKillerOfKillersConvergenceMasterAuditor();
    const report = auditor.runFullKillerOfKillersConvergenceMasterAudit();
    assert.strictEqual(report.certified, true);
    assert.strictEqual(report.totalAudits, 9);
    assert.strictEqual(report.totalPassed, 9);

    const webglAudit = report.results.find(r => r.sector === 'WebGL_MothershipHub_DrawCall_Invariant');
    assert.ok(webglAudit);
    assert.strictEqual(webglAudit.status, 'PASSED');
    assert.ok(webglAudit.drawCalls <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v195 SFX triggers', () => {
    const sandBlizzardAcoustics = audioSynth.computeSaharaSandBlizzardAcoustics(55.0, 0.25);
    assert.ok(sandBlizzardAcoustics.sandHissFrequencyHz > 0);
    assert.ok(sandBlizzardAcoustics.abrasiveGain > 0);

    const bambooAcoustics = audioSynth.computeBambooWindWhistleAcoustics(85, 22.0);
    assert.ok(bambooAcoustics.fundamentalHz > 0);
    assert.ok(bambooAcoustics.flutterGain > 0);

    // Call each of the 15 SFX methods
    assert.doesNotThrow(() => audioSynth.playGlacialCrevasseWindWhistleSFX());
    assert.doesNotThrow(() => audioSynth.playPhosphorGreenBloodDripSFX());
    assert.doesNotThrow(() => audioSynth.playIronWolfTrapSnapClampSFX());
    assert.doesNotThrow(() => audioSynth.playAndersBoneDaggerClinkSFX());
    assert.doesNotThrow(() => audioSynth.playBambooStalksCreakWindSFX());
    assert.doesNotThrow(() => audioSynth.playMakibishiCaltropScatterSFX());
    assert.doesNotThrow(() => audioSynth.playWashiShojiPaperPunctureSFX());
    assert.doesNotThrow(() => audioSynth.playFukidakeBlowdartHissSFX());
    assert.doesNotThrow(() => audioSynth.playSaharaHeatMirageHazeHumSFX());
    assert.doesNotThrow(() => audioSynth.playPhosphorusFlareHissBurnSFX());
    assert.doesNotThrow(() => audioSynth.playM1911FortyFiveDischargeSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskHoundSnarlPounceSFX());
    assert.doesNotThrow(() => audioSynth.playTriangularShieldWallClashSFX());
    assert.doesNotThrow(() => audioSynth.playBurningDrakkarTimberCrackSFX());
    assert.doesNotThrow(() => audioSynth.playKillerConvergenceMicroNuclearPurgeSFX());
  });
});
