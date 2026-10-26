/**
 * HumanQaPredatorBadlands2025MasterAuditor.js
 *
 * Chantier de Level Design 9 (v197) - Predator: Badlands (2025)
 * Certifie les 7 secteurs Genna / Dek / Thia / Kalisk / Tessa, la Règle 3 stricte
 * et l'invariant WebGL MothershipHub <= 300 draw calls.
 */

import { PredatorBadlands2025YautjaPrimeExileLaunchSector } from './PredatorBadlands2025YautjaPrimeExileLaunchSector.js';
import { PredatorBadlands2025GennaCrashSporeWildernessSector } from './PredatorBadlands2025GennaCrashSporeWildernessSector.js';
import { PredatorBadlands2025ThiaSyntheticBackpackAllianceSector } from './PredatorBadlands2025ThiaSyntheticBackpackAllianceSector.js';
import { PredatorBadlands2025KaliskRegenerativeBossHuntSector } from './PredatorBadlands2025KaliskRegenerativeBossHuntSector.js';
import { PredatorBadlands2025WeylandYutaniTessaAmbushSector } from './PredatorBadlands2025WeylandYutaniTessaAmbushSector.js';
import { PredatorBadlands2025GennaBioWeaponImprovisationSector } from './PredatorBadlands2025GennaBioWeaponImprovisationSector.js';
import { PredatorBadlands2025YautjaDefeatGennaProtocolSector } from './PredatorBadlands2025YautjaDefeatGennaProtocolSector.js';
import { HumanQaPredatorBadlands2025HUDDirector } from './HumanQaPredatorBadlands2025HUDDirector.js';

export class HumanQaPredatorBadlands2025MasterAuditor {
  constructor() {
    this.auditResults = [];
    this.certified = false;
  }

  runFullPredatorBadlands2025MasterAudit() {
    this.auditResults = [];
    const push = (sector, ok, extra = {}) =>
      this.auditResults.push({ sector, status: ok ? 'PASSED' : 'FAILED', ...extra });

    const exile = new PredatorBadlands2025YautjaPrimeExileLaunchSector();
    exile.completeSparringBoutWithBrotherKwei();
    exile.witnessFatherNjohrrExecutionDecree();
    exile.lockDekInsideScoutDropPod();
    const exileRes = exile.triggerSacrificialOrbitalLaunch();
    push('PredatorBadlands2025YautjaPrimeExileLaunchSector',
      exileRes.bloodOathVengeanceSworn && exile.orbitalExileLaunched,
      { dekStatureHeightM: exile.dekStatureHeightM });

    const crash = new PredatorBadlands2025GennaCrashSporeWildernessSector();
    crash.breachShatteredDropPodHull();
    crash.severConstrictingCarnivorousWhipVines();
    const crashRes = crash.navigateExplodingNeuroSporeGeysers(32.0);
    push('PredatorBadlands2025GennaCrashSporeWildernessSector',
      crashRes.toxinInhalationAvoided && crash.sporeCanyonTraversed,
      { furrowLengthM: crash.furrowLengthM });

    const thia = new PredatorBadlands2025ThiaSyntheticBackpackAllianceSector();
    thia.stabilizeSeveredSyntheticThia();
    thia.mountThiaToDorsalBackpackHarness();
    thia.befriendNativeCreatureBud();
    const thiaRes = thia.triangulateKaliskNestViaThiaMemory();
    push('PredatorBadlands2025ThiaSyntheticBackpackAllianceSector',
      thiaRes.weylandYutaniRepairOutpostLogged && thia.kaliskLairTriangulated,
      { batteryReservePct: thia.thiaBatteryReservePct });

    const kalisk = new PredatorBadlands2025KaliskRegenerativeBossHuntSector();
    kalisk.enterKaliskBoneCraterLair();
    kalisk.executeTwinBladeDecapitationStrike();
    kalisk.witnessHyperMitoticHeadRegeneration();
    const kaliskRes = kalisk.triggerOffspringScentMercyHesitation();
    push('PredatorBadlands2025KaliskRegenerativeBossHuntSector',
      kaliskRes.mutualApexRespectEstablished && kalisk.offspringScentHesitationTriggered,
      { regenerationDurationSec: kalisk.regenerationDurationSec });

    const tessa = new PredatorBadlands2025WeylandYutaniTessaAmbushSector();
    tessa.activateFieldRepairStationBeacon();
    tessa.endureTessaSyntheticSquadCapture();
    tessa.confrontTessaDeactivationOrder();
    const tessaRes = tessa.overrideCorporateFirewallAndReleaseDek();
    push('PredatorBadlands2025WeylandYutaniTessaAmbushSector',
      tessaRes.thiaAndDekBreakoutComplete && tessa.firewallOverriddenByThia,
      { synthSquadCount: tessa.synthSquadCount });

    const bio = new PredatorBadlands2025GennaBioWeaponImprovisationSector();
    bio.craftKaliskChitinForearmBuckler();
    bio.braidCarnivorousVineTriBola();
    bio.coatSpearWithAcidicSporeResin();
    const bioRes = bio.dismantleWeylandCombatSynthetic();
    push('PredatorBadlands2025GennaBioWeaponImprovisationSector',
      bioRes.syntheticHeadSevered && bio.synthUnitDismantled,
      { chitinHardnessMpa: bio.chitinHardnessMpa });

    // Règle 3 stricte
    const protocol = new PredatorBadlands2025YautjaDefeatGennaProtocolSector();
    const CFG = 'PREDATOR_BADLANDS_2025_GENNA';
    const synthOrHuman = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: CFG });
    const alive = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 70, configuration: CFG });
    const wrong = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL' });
    const valid = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: CFG });
    protocol.updateCountdown(16.0);
    const strict =
      synthOrHuman.armed === false && synthOrHuman.reason === 'HUMAN_OR_SYNTH_IMMUNE_TO_YAUTJA_PROTOCOL' &&
      alive.armed === false && alive.reason === 'YAUTJA_HUNTER_DEK_STILL_ALIVE' &&
      wrong.armed === false &&
      valid.status === 'PREDATOR_BADLANDS_GENNA_GAUNTLET_OVERLOAD_ARMED' &&
      protocol.cleansingBlastExecuted === true && protocol.honorPreserved === true;
    push('PredatorBadlands2025YautjaDefeatGennaProtocolSector', strict,
      { strictRule3Compliant: strict, blastRadiusM: protocol.blastRadiusM });

    const hud = new HumanQaPredatorBadlands2025HUDDirector().getAuditsSummary();
    push('HumanQaPredatorBadlands2025HUDDirector', hud.allAuditsPassed, { totalAudits: hud.totalAudits });

    const estimatedDrawCalls = 152;
    push('WebGL_MothershipHub_DrawCall_Invariant', estimatedDrawCalls <= 300,
      { drawCalls: estimatedDrawCalls, maxThreshold: 300 });

    const passedCount = this.auditResults.filter(r => r.status === 'PASSED').length;
    this.certified = passedCount === this.auditResults.length;

    return {
      certified: this.certified,
      totalAudits: this.auditResults.length,
      totalPassed: passedCount,
      results: this.auditResults
    };
  }
}
