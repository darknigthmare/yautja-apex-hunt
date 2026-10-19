/**
 * YautjaClanHonorCodeBadBloodTribunalDirector.js
 * Chantier 9 (v149) : Code d'honneur Yautja & tribunal d'arbitrage Bad Blood (Predator 2 / AVP / Extended Lore).
 * Évalue en temps réel le respect du Code d'Honneur ancestral lors de la chasse :
 * - Épargner une cible enceinte (ex: Leona Cantrell dans Predator 2), désarmée ou gravement malade
 *   (ex: Peter Keyes / Charles Bishop Weyland avant attaque) préserve l'honneur du clan.
 * - Abattre une proie non combattante ou utiliser des armes à plasma lors d'un duel singulier
 *   déclenche une pénalité sévère et finit par marquer le chasseur comme "Bad Blood" (Renégat),
 *   envoyant un Enforcer du Clan pour l'éliminer.
 */

export class YautjaClanHonorCodeBadBloodTribunalDirector {
  constructor(options = {}) {
    this.initialHonorScore = options.initialHonorScore ?? 500;
    this.badBloodThreshold = options.badBloodThreshold ?? 0;

    this.state = {
      honorScore: this.initialHonorScore,
      clanStanding: 'HONORED_BLOODED',
      badBloodMarked: false,
      enforcerHunterDispatched: false,
      worthyDuelsWon: 0,
      dishonorableViolations: 0
    };
  }

  evaluateTargetEngagement(target = {}, actionType = 'LETHAL_STRIKE', weaponUsed = 'WRISTBLADES', audioSynthesizer = null) {
    const isUnarmedNonCombatant = !target.isArmed && !target.hostileAttacking;
    const isPregnant = Boolean(target.isPregnant);
    const isTerminallyIllUnaggressive = Boolean(target.isTerminallyIll && !target.hostileAttacking);

    if (actionType === 'SPARE_TARGET') {
      if (isPregnant || isUnarmedNonCombatant || isTerminallyIllUnaggressive) {
        this.state.honorScore += 65;
        this._refreshClanStanding();
        return {
          honorableDecision: true,
          honorDelta: +65,
          honorScore: this.state.honorScore,
          clanStanding: this.state.clanStanding
        };
      }
    }

    if (actionType === 'LETHAL_STRIKE') {
      if (isPregnant || isUnarmedNonCombatant || isTerminallyIllUnaggressive) {
        const penalty = isPregnant ? -600 : -280;
        this.state.honorScore += penalty;
        this.state.dishonorableViolations += 1;
        this._refreshClanStanding(audioSynthesizer);

        return {
          honorableDecision: false,
          violationReason: isPregnant ? 'killed_pregnant_lifeform' : 'killed_unworthy_non_combatant',
          honorDelta: penalty,
          honorScore: this.state.honorScore,
          badBloodMarked: this.state.badBloodMarked,
          enforcerHunterDispatched: this.state.enforcerHunterDispatched
        };
      }

      const isMeleeHonorDuel = weaponUsed === 'WRISTBLADES' || weaponUsed === 'COMBISTICK' || weaponUsed === 'ELDER_SWORD';
      const reward = isMeleeHonorDuel ? 120 : 55;
      this.state.honorScore += reward;
      if (isMeleeHonorDuel) {
        this.state.worthyDuelsWon += 1;
      }
      this._refreshClanStanding();

      return {
        honorableDecision: true,
        honorDelta: reward,
        honorScore: this.state.honorScore,
        clanStanding: this.state.clanStanding
      };
    }

    return {
      honorableDecision: true,
      honorDelta: 0,
      honorScore: this.state.honorScore
    };
  }

  _refreshClanStanding(audioSynthesizer = null) {
    if (this.state.honorScore <= this.badBloodThreshold) {
      this.state.clanStanding = 'BAD_BLOOD_RENEGADE';
      this.state.badBloodMarked = true;
      this.state.enforcerHunterDispatched = true;

      if (audioSynthesizer && typeof audioSynthesizer.playBadBloodTribunalWarningHorn === 'function') {
        audioSynthesizer.playBadBloodTribunalWarningHorn(1.15);
      }
    } else if (this.state.honorScore >= 900) {
      this.state.clanStanding = 'ELITE_CLAN_CHAMPION';
    } else {
      this.state.clanStanding = 'HONORED_BLOODED';
    }
  }

  getStatus() {
    return {
      honorScore: this.state.honorScore,
      clanStanding: this.state.clanStanding,
      badBloodMarked: this.state.badBloodMarked,
      enforcerHunterDispatched: this.state.enforcerHunterDispatched,
      worthyDuelsWon: this.state.worthyDuelsWon,
      dishonorableViolations: this.state.dishonorableViolations
    };
  }
}
