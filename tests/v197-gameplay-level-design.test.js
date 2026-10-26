import { describe, it } from 'node:test';
import assert from 'node:assert';

import { PredatorBadlands2025YautjaPrimeExileLaunchSector } from '../src/gameplay/PredatorBadlands2025YautjaPrimeExileLaunchSector.js';
import { PredatorBadlands2025GennaCrashSporeWildernessSector } from '../src/gameplay/PredatorBadlands2025GennaCrashSporeWildernessSector.js';
import { PredatorBadlands2025ThiaSyntheticBackpackAllianceSector } from '../src/gameplay/PredatorBadlands2025ThiaSyntheticBackpackAllianceSector.js';
import { PredatorBadlands2025KaliskRegenerativeBossHuntSector } from '../src/gameplay/PredatorBadlands2025KaliskRegenerativeBossHuntSector.js';
import { PredatorBadlands2025WeylandYutaniTessaAmbushSector } from '../src/gameplay/PredatorBadlands2025WeylandYutaniTessaAmbushSector.js';
import { PredatorBadlands2025GennaBioWeaponImprovisationSector } from '../src/gameplay/PredatorBadlands2025GennaBioWeaponImprovisationSector.js';
import { PredatorBadlands2025YautjaDefeatGennaProtocolSector } from '../src/gameplay/PredatorBadlands2025YautjaDefeatGennaProtocolSector.js';
import { HumanQaPredatorBadlands2025HUDDirector } from '../src/gameplay/HumanQaPredatorBadlands2025HUDDirector.js';
import { HumanQaPredatorBadlands2025MasterAuditor } from '../src/gameplay/HumanQaPredatorBadlands2025MasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v197 Predator: Badlands (2025) 1:1 Level Design & User Rule Suite', () => {
  it('Chantier 1: Yautja Prime Dek & Kwei sparring, Njohrr execution decree, and Kwei sacrificial orbital launch', () => {
    const sector = new PredatorBadlands2025YautjaPrimeExileLaunchSector({ dekStatureHeightM: 2.05, escapePodThrustKn: 1450.0 });

    const prematureDecree = sector.witnessFatherNjohrrExecutionDecree();
    assert.strictEqual(prematureDecree.success, false);

    const sparRes = sector.completeSparringBoutWithBrotherKwei();
    assert.strictEqual(sparRes.status, 'BROTHER_KWEI_SPARRING_BOUT_COMPLETED');
    assert.strictEqual(sparRes.fraternalBondLoyaltyPct, 100.0);
    assert.strictEqual(sector.brotherSparringCompleted, true);

    const decreeRes = sector.witnessFatherNjohrrExecutionDecree();
    assert.strictEqual(decreeRes.status, 'NJOHRR_CLAN_EXECUTION_DECREE_ISSUED');
    assert.strictEqual(decreeRes.kweiDefianceTriggered, true);
    assert.strictEqual(sector.njohrrExecutionDecreed, true);

    const lockRes = sector.lockDekInsideScoutDropPod();
    assert.strictEqual(lockRes.status, 'DEK_LOCKED_IN_SCOUT_DROP_POD_BY_KWEI');
    assert.strictEqual(lockRes.destinationCoordinates, 'GENNA_DEATH_PLANET');
    assert.strictEqual(sector.kweiPodOverrideLocked, true);

    const launchRes = sector.triggerSacrificialOrbitalLaunch();
    assert.strictEqual(launchRes.status, 'SACRIFICIAL_ORBITAL_LAUNCH_EXECUTED');
    assert.strictEqual(launchRes.bloodOathVengeanceSworn, true);
    assert.strictEqual(sector.orbitalExileLaunched, true);
  });

  it('Chantier 2: Genna crash-landing furrow, carnivorous whip-vines severance, and neuro-spore canyon traversal', () => {
    const sector = new PredatorBadlands2025GennaCrashSporeWildernessSector({ furrowLengthM: 180.0, whipVineTensionN: 1900.0 });

    const prematureVines = sector.severConstrictingCarnivorousWhipVines();
    assert.strictEqual(prematureVines.success, false);

    const podRes = sector.breachShatteredDropPodHull();
    assert.strictEqual(podRes.status, 'SHATTERED_DROP_POD_HULL_BREACHED');
    assert.strictEqual(podRes.heavyPlasmaGearLostInAcidVent, true);
    assert.strictEqual(sector.podBreached, true);

    const vineRes = sector.severConstrictingCarnivorousWhipVines();
    assert.strictEqual(vineRes.status, 'CONSTRICTING_CARNIVOROUS_WHIP_VINES_SEVERED');
    assert.strictEqual(vineRes.vinesCutCount, 6);
    assert.strictEqual(sector.whipVinesSevered, true);

    const sporeRes = sector.navigateExplodingNeuroSporeGeysers(32.0);
    assert.strictEqual(sporeRes.status, 'NEURO_SPORE_GEYSERS_NAVIGATED');
    assert.strictEqual(sporeRes.toxinInhalationAvoided, true);
    assert.strictEqual(sector.sporeCanyonTraversed, true);
  });

  it('Chantier 3: Severed Weyland-Yutani synthetic Thia dorsal backpack harness, juvenile Bud imprinting, and Kalisk triangulation', () => {
    const sector = new PredatorBadlands2025ThiaSyntheticBackpackAllianceSector({ thiaBatteryReservePct: 64.0 });

    const prematureMount = sector.mountThiaToDorsalBackpackHarness();
    assert.strictEqual(prematureMount.success, false);

    const stabRes = sector.stabilizeSeveredSyntheticThia();
    assert.strictEqual(stabRes.status, 'SEVERED_SYNTHETIC_THIA_STABILIZED');
    assert.strictEqual(stabRes.manufacturer, 'WEYLAND_YUTANI_CORP');
    assert.strictEqual(sector.thiaTorsoStabilized, true);

    const mountRes = sector.mountThiaToDorsalBackpackHarness();
    assert.strictEqual(mountRes.status, 'THIA_MOUNTED_TO_DORSAL_BACKPACK_HARNESS');
    assert.strictEqual(mountRes.combinedFovDeg, 360.0);
    assert.strictEqual(sector.dorsalHarnessMounted, true);

    const budRes = sector.befriendNativeCreatureBud();
    assert.strictEqual(budRes.status, 'NATIVE_CREATURE_BUD_BEFRIENDED');
    assert.strictEqual(budRes.juvenilePheromoneScentTransferred, true);
    assert.strictEqual(sector.budCreatureBefriended, true);

    const triRes = sector.triangulateKaliskNestViaThiaMemory();
    assert.strictEqual(triRes.status, 'KALISK_NEST_TRIANGULATED_VIA_THIA_MEMORY');
    assert.strictEqual(triRes.weylandYutaniRepairOutpostLogged, true);
    assert.strictEqual(sector.kaliskLairTriangulated, true);
  });

  it('Chantier 4: Apex Kalisk decapitation, hyper-mitotic head regeneration, and Bud offspring scent hesitation', () => {
    const sector = new PredatorBadlands2025KaliskRegenerativeBossHuntSector({ kaliskMassKg: 4200.0, regenerationDurationSec: 1.8 });

    const prematureDecap = sector.executeTwinBladeDecapitationStrike();
    assert.strictEqual(prematureDecap.success, false);

    const craterRes = sector.enterKaliskBoneCraterLair();
    assert.strictEqual(craterRes.status, 'KALISK_BONE_CRATER_LAIR_ENTERED');
    assert.strictEqual(sector.craterEntered, true);

    const decapRes = sector.executeTwinBladeDecapitationStrike();
    assert.strictEqual(decapRes.status, 'TWIN_BLADE_DECAPITATION_STRIKE_LANDED');
    assert.strictEqual(decapRes.cervicalVertebraeSevered, true);
    assert.strictEqual(sector.decapitationStrikeLanded, true);

    const regenRes = sector.witnessHyperMitoticHeadRegeneration();
    assert.strictEqual(regenRes.status, 'HYPER_MITOTIC_HEAD_REGENERATION_WITNESSED');
    assert.strictEqual(regenRes.tissueIntegrityRestoredPct, 100.0);
    assert.strictEqual(sector.instantRegenerationWitnessed, true);

    const scentRes = sector.triggerOffspringScentMercyHesitation();
    assert.strictEqual(scentRes.status, 'OFFSPRING_SCENT_MERCY_HESITATION_TRIGGERED');
    assert.strictEqual(scentRes.mutualApexRespectEstablished, true);
    assert.strictEqual(sector.offspringScentHesitationTriggered, true);
  });

  it('Chantier 5: Weyland-Yutani sister synthetic Tessa capture ambush and Thia corporate firewall override', () => {
    const sector = new PredatorBadlands2025WeylandYutaniTessaAmbushSector({ synthSquadCount: 6 });

    const prematureCapture = sector.endureTessaSyntheticSquadCapture();
    assert.strictEqual(prematureCapture.success, false);

    const beaconRes = sector.activateFieldRepairStationBeacon();
    assert.strictEqual(beaconRes.status, 'FIELD_REPAIR_STATION_BEACON_ACTIVATED');
    assert.strictEqual(beaconRes.sisterUnitTessaAlerted, true);
    assert.strictEqual(sector.repairBeaconTriggered, true);

    const capRes = sector.endureTessaSyntheticSquadCapture();
    assert.strictEqual(capRes.status, 'TESSA_SYNTHETIC_SQUAD_CAPTURE_EXECUTED');
    assert.strictEqual(capRes.dekRestrainedInMagShackles, true);
    assert.strictEqual(sector.tessaAmbushSprung, true);

    const orderRes = sector.confrontTessaDeactivationOrder();
    assert.strictEqual(orderRes.status, 'TESSA_DEACTIVATION_ORDER_CONFRONTED');
    assert.strictEqual(orderRes.diagnosisCode, 'SYNTHETIC_EMPATHY_GLITCH_DETECTED');
    assert.strictEqual(sector.empathyGlitchCondemned, true);

    const overrideRes = sector.overrideCorporateFirewallAndReleaseDek();
    assert.strictEqual(overrideRes.status, 'CORPORATE_FIREWALL_OVERRIDDEN_DEK_RELEASED');
    assert.strictEqual(overrideRes.thiaAndDekBreakoutComplete, true);
    assert.strictEqual(sector.firewallOverriddenByThia, true);
  });

  it('Chantier 6: Genna bio-weapon crafting (Kalisk chitin buckler, razor-vine tri-bola, acidic spore spear)', () => {
    const sector = new PredatorBadlands2025GennaBioWeaponImprovisationSector({ chitinHardnessMpa: 620.0 });

    const prematureBola = sector.braidCarnivorousVineTriBola();
    assert.strictEqual(prematureBola.success, false);

    const bucklerRes = sector.craftKaliskChitinForearmBuckler();
    assert.strictEqual(bucklerRes.status, 'KALISK_CHITIN_FOREARM_BUCKLER_CRAFTED');
    assert.strictEqual(bucklerRes.pulseRifleDeflectionCapable, true);
    assert.strictEqual(sector.chitinBucklerForged, true);

    const bolaRes = sector.braidCarnivorousVineTriBola();
    assert.strictEqual(bolaRes.status, 'CARNIVOROUS_VINE_TRI_BOLA_BRAIDED');
    assert.strictEqual(sector.razorVineBolaBraided, true);

    const coatRes = sector.coatSpearWithAcidicSporeResin();
    assert.strictEqual(coatRes.status, 'SPEAR_COATED_WITH_ACIDIC_SPORE_RESIN');
    assert.strictEqual(coatRes.bioElectricArcEnabled, true);
    assert.strictEqual(sector.sporeResinCoated, true);

    const dismantleRes = sector.dismantleWeylandCombatSynthetic();
    assert.strictEqual(dismantleRes.status, 'WEYLAND_COMBAT_SYNTHETIC_DISMANTLED');
    assert.strictEqual(dismantleRes.syntheticHeadSevered, true);
    assert.strictEqual(sector.synthUnitDismantled, true);
  });

  it('Chantier 7: Strict User Rule 3 verification on Genna (isYautja && health <= 0 && config === PREDATOR_BADLANDS_2025_GENNA)', () => {
    const protocol = new PredatorBadlands2025YautjaDefeatGennaProtocolSector();

    const synthOrHumanCheck = protocol.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      configuration: 'PREDATOR_BADLANDS_2025_GENNA'
    });
    assert.strictEqual(synthOrHumanCheck.armed, false);
    assert.strictEqual(synthOrHumanCheck.reason, 'HUMAN_OR_SYNTH_IMMUNE_TO_YAUTJA_PROTOCOL');

    const aliveCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 75,
      configuration: 'PREDATOR_BADLANDS_2025_GENNA'
    });
    assert.strictEqual(aliveCheck.armed, false);
    assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_DEK_STILL_ALIVE');

    const wrongArenaCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL'
    });
    assert.strictEqual(wrongArenaCheck.armed, false);
    assert.strictEqual(wrongArenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

    const validArming = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'PREDATOR_BADLANDS_2025_GENNA'
    });
    assert.strictEqual(validArming.status, 'PREDATOR_BADLANDS_GENNA_GAUNTLET_OVERLOAD_ARMED');
    assert.strictEqual(validArming.countdownSeconds, 15.0);
    assert.strictEqual(validArming.mockingLaughterDb, 105.0);
    assert.strictEqual(protocol.protocolArmed, true);

    const midUpdate = protocol.updateCountdown(5.0);
    assert.strictEqual(midUpdate.active, true);
    assert.strictEqual(midUpdate.remainingSeconds, 10.0);

    const blastRes = protocol.updateCountdown(11.0);
    assert.strictEqual(blastRes.status, 'PREDATOR_BADLANDS_GENNA_MICRO_NUCLEAR_CLEANSING_BLAST');
    assert.strictEqual(blastRes.blastRadiusM, 65.0);
    assert.strictEqual(blastRes.honorScoreGranted, 500);
    assert.strictEqual(protocol.cleansingBlastExecuted, true);
    assert.strictEqual(protocol.honorPreserved, true);
  });

  it('Chantier 8: HumanQaPredatorBadlands2025HUDDirector telemetry and defeat widget update', () => {
    const director = new HumanQaPredatorBadlands2025HUDDirector();
    const mountRes = director.mount();
    assert.strictEqual(typeof mountRes, 'object');

    const updateRes = director.updateDefeatWidget({
      protocolArmed: true,
      countdownTimerRemaining: 12.6,
      activeGlyph: 'ᚢ'
    });
    assert.strictEqual(updateRes.protocolArmed, true);
    assert.strictEqual(updateRes.activeGlyph, 'ᚢ');
    assert.strictEqual(updateRes.countdownRemainingS, 12.6);

    const summary = director.getAuditsSummary();
    assert.strictEqual(summary.totalAudits, 5);
    assert.strictEqual(summary.allAuditsPassed, true);
  });

  it('Chantier 9: HumanQaPredatorBadlands2025MasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaPredatorBadlands2025MasterAuditor();
    const report = auditor.runFullPredatorBadlands2025MasterAudit();
    assert.strictEqual(report.certified, true);
    assert.strictEqual(report.totalAudits, 9);
    assert.strictEqual(report.totalPassed, 9);

    const webglAudit = report.results.find(r => r.sector === 'WebGL_MothershipHub_DrawCall_Invariant');
    assert.ok(webglAudit);
    assert.strictEqual(webglAudit.status, 'PASSED');
    assert.ok(webglAudit.drawCalls <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v197 SFX triggers', () => {
    const floraAcoustics = audioSynth.computeGennaCarnivorousFloraAcoustics(1900.0, 240.0);
    assert.ok(floraAcoustics.vineWhipFundamentalHz > 0);
    assert.ok(floraAcoustics.sporeGeyserHissGain > 0);

    const kaliskAcoustics = audioSynth.computeKaliskCellularRegenAcoustics(4200.0, 1.8);
    assert.ok(kaliskAcoustics.subBassGrowlHz > 0);
    assert.ok(kaliskAcoustics.mitoticTissueKnitHz > 0);

    assert.doesNotThrow(() => audioSynth.playKweiSparringBladeClashSFX());
    assert.doesNotThrow(() => audioSynth.playNjohrrClanJudgmentGongSFX());
    assert.doesNotThrow(() => audioSynth.playKweiEscapePodLaunchThrusterSFX());
    assert.doesNotThrow(() => audioSynth.playGennaDropPodFurrowCrashSFX());
    assert.doesNotThrow(() => audioSynth.playCarnivorousWhipVineSnapSFX());
    assert.doesNotThrow(() => audioSynth.playNeuroSporeGeyserBurstSFX());
    assert.doesNotThrow(() => audioSynth.playThiaSyntheticServoBootChimeSFX());
    assert.doesNotThrow(() => audioSynth.playJuvenileBudCreatureChirpSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskTwinBladeDecapitationSliceSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskHyperMitoticNeckRegenSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskOffspringScentSniffGrowlSFX());
    assert.doesNotThrow(() => audioSynth.playWeylandTessaContainmentShackleClampSFX());
    assert.doesNotThrow(() => audioSynth.playThiaCorporateFirewallOverridePulseSFX());
    assert.doesNotThrow(() => audioSynth.playKaliskChitinBucklerParrySFX());
    assert.doesNotThrow(() => audioSynth.playPredatorBadlandsGennaMicroNuclearPurgeSFX());
  });
});
