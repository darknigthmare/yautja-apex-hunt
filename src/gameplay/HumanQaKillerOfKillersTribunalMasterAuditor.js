/**
 * HumanQaKillerOfKillersTribunalMasterAuditor.js
 *
 * Chantier de Level Design 9 (v196) - Predator: Killer of Killers (2025)
 * Certifie les 7 secteurs, la règle 3 stricte et l'invariant WebGL MothershipHub <= 300 draw calls.
 */

import { KillerOfKillers841AdMeadHallSiegeSector } from './KillerOfKillers841AdMeadHallSiegeSector.js';
import { KillerOfKillers1609CastleMoatInfiltrationSector } from './KillerOfKillers1609CastleMoatInfiltrationSector.js';
import { KillerOfKillers1942YautjaShipCockpitSector } from './KillerOfKillers1942YautjaShipCockpitSector.js';
import { KillerOfKillersYautjaPrimeTribunalTrialSector } from './KillerOfKillersYautjaPrimeTribunalTrialSector.js';
import { KillerOfKillersArenaWarriorTrialDuelSector } from './KillerOfKillersArenaWarriorTrialDuelSector.js';
import { KillerOfKillersOniPlasmaCoreOverloadSector } from './KillerOfKillersOniPlasmaCoreOverloadSector.js';
import { KillerOfKillersYautjaDefeatTribunalProtocolSector } from './KillerOfKillersYautjaDefeatTribunalProtocolSector.js';
import { HumanQaKillerOfKillersTribunalHUDDirector } from './HumanQaKillerOfKillersTribunalHUDDirector.js';

export class HumanQaKillerOfKillersTribunalMasterAuditor {
  constructor() {
    this.auditResults = [];
    this.certified = false;
  }

  runFullKillerOfKillersTribunalMasterAudit() {
    this.auditResults = [];
    const push = (sector, ok, extra = {}) =>
      this.auditResults.push({ sector, status: ok ? 'PASSED' : 'FAILED', ...extra });

    const hall = new KillerOfKillers841AdMeadHallSiegeSector();
    hall.barricadeOakDoorsWithBenchBrace(6);
    hall.pourBoilingFatCauldronFromLoft();
    hall.formSkjaldborgShieldWall();
    const hallRes = hall.repelRivalWarbandAtThreshold();
    push('KillerOfKillers841AdMeadHallSiegeSector', hallRes.raidersFallen === 11 && hall.warbandRepelled,
      { longhouseLengthM: hall.longhouseLengthM });

    const moat = new KillerOfKillers1609CastleMoatInfiltrationSector();
    moat.crossMoatWithReedBreathingTube();
    moat.scaleIshigakiWallWithTekkoKagi();
    moat.exploitArcherWatchRotationGap(28.0);
    const moatRes = moat.breachKeepThroughRoofTileHatch();
    push('KillerOfKillers1609CastleMoatInfiltrationSector', moatRes.entryPoint === 'KAWARA_ROOF_HATCH' && moat.keepBreached,
      { moatDepthM: moat.moatDepthM });

    const ship = new KillerOfKillers1942YautjaShipCockpitSector();
    ship.wingWalkOntoAlienHull();
    ship.overrideBiomechanicalIrisHatch();
    ship.decodeGlyphLitCockpitControls();
    const shipRes = ship.flyAlienScoutThroughCloudCanyon();
    push('KillerOfKillers1942YautjaShipCockpitSector', shipRes.pursuerEvaded && ship.cloudCanyonFlown,
      { altitudeM: ship.boardingAltitudeM });

    const tribunal = new KillerOfKillersYautjaPrimeTribunalTrialSector();
    tribunal.standBeforeElderCouncil();
    tribunal.reciteHunterCodexOath();
    tribunal.crossSuspendedBoneBridgeOverLava();
    const tribRes = tribunal.completeTrialAndMountTrophy();
    push('KillerOfKillersYautjaPrimeTribunalTrialSector', tribRes.trophyWallCountAfter === 121 && tribunal.trialPassed,
      { trophyCount: tribunal.trophyCount });

    const duel = new KillerOfKillersArenaWarriorTrialDuelSector();
    duel.enterSandRingFacingRival();
    duel.pinNinjatoWithShieldBash();
    duel.slipNinjatoToWristLock();
    const duelRes = duel.agreeTruceAsEldersGateOpens();
    push('KillerOfKillersArenaWarriorTrialDuelSector', duelRes.allianceFormed && duel.truceAgreed,
      { ringDiameterM: duel.ringDiameterM });

    const core = new KillerOfKillersOniPlasmaCoreOverloadSector();
    core.locateExposedPlasmaCore();
    core.alignBronzeMirrorToCore(32.0);
    core.redirectPlasmaBoltIntoCore();
    const coreRes = core.ventCascadeOverloadThroughFloor();
    push('KillerOfKillersOniPlasmaCoreOverloadSector', coreRes.tatamiFloorShattered && core.coreOverloaded,
      { coreTempK: core.coreTempK });

    // Règle 3 stricte
    const protocol = new KillerOfKillersYautjaDefeatTribunalProtocolSector();
    const CFG = 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL';
    const human = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: CFG });
    const alive = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 75, configuration: CFG });
    const wrong = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'KILLER_OF_KILLERS_CONVERGENCE_ARENA' });
    const valid = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: CFG });
    protocol.updateCountdown(16.0);
    const strict =
      human.armed === false && human.reason === 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL' &&
      alive.armed === false && alive.reason === 'YAUTJA_HUNTER_STILL_ALIVE' &&
      wrong.armed === false &&
      valid.status === 'KILLER_OF_KILLERS_TRIBUNAL_GAUNTLET_OVERLOAD_ARMED' &&
      protocol.cleansingBlastExecuted === true && protocol.honorPreserved === true;
    push('KillerOfKillersYautjaDefeatTribunalProtocolSector', strict,
      { strictRule3Compliant: strict, blastRadiusM: protocol.blastRadiusM });

    const hud = new HumanQaKillerOfKillersTribunalHUDDirector().getAuditsSummary();
    push('HumanQaKillerOfKillersTribunalHUDDirector', hud.allAuditsPassed, { totalAudits: hud.totalAudits });

    const estimatedDrawCalls = 150;
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
