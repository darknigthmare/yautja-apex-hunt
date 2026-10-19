/**
 * ComancheRopeTetheredTomahawkRetrievalSystem.js
 * Chantier 5 (v148) : Tomahawk à corde de cuir et rappel de Naru (Prey 2022).
 * Hachette de pierre et bois reliée au poignet par une longue longe de cuir tressé :
 * - Lancer rotatif à distance moyenne avec retour instantané par traction sèche du poignet.
 * - Balayage circulaire bas par rotation de la corde pour faucher les jambes d'une cible.
 * - Permet d'accrocher et tirer à soi un bouclier, une arme tombée ou un piège.
 */

export class ComancheRopeTetheredTomahawkRetrievalSystem {
  constructor(options = {}) {
    this.maxRopeLengthMeters = options.maxRopeLengthMeters ?? 11.5;
    this.throwImpactDamage = options.throwImpactDamage ?? 68;
    this.yankBackBleedDamage = options.yankBackBleedDamage ?? 34;
    this.lowSweepRadiusMeters = options.lowSweepRadiusMeters ?? 4.2;

    this.state = {
      inHand: true,
      embeddedInTargetId: null,
      currentDistanceOutMeters: 0,
      totalThrows: 0,
      totalYankRetrievals: 0,
      totalLegSweeps: 0
    };
  }

  throwTetheredTomahawk(target = null, audioSynthesizer = null) {
    if (!this.state.inHand) {
      return { thrown: false, reason: 'tomahawk_not_in_hand' };
    }
    if (!target) {
      return { thrown: false, reason: 'no_target' };
    }

    const dist = Number(target.distanceMeters ?? 999);
    if (dist > this.maxRopeLengthMeters) {
      return { thrown: false, reason: 'target_beyond_rope_length', maxRopeLengthMeters: this.maxRopeLengthMeters };
    }

    this.state.inHand = false;
    this.state.currentDistanceOutMeters = dist;
    this.state.embeddedInTargetId = target.id ?? 'target';
    this.state.totalThrows += 1;

    target.health = Math.max(0, Number(target.health ?? 100) - this.throwImpactDamage);

    if (audioSynthesizer && typeof audioSynthesizer.playRopeTomahawkWhirlThrow === 'function') {
      audioSynthesizer.playRopeTomahawkWhirlThrow(1.0);
    }

    return {
      thrown: true,
      targetId: this.state.embeddedInTargetId,
      damageDealt: this.throwImpactDamage,
      remainingHealth: target.health,
      tetherEngaged: true
    };
  }

  yankRopeToRetrieve(embeddedTarget = null, audioSynthesizer = null) {
    if (this.state.inHand) {
      return { retrieved: false, reason: 'already_in_hand' };
    }

    let pullDamage = 0;
    let targetPulledOffBalance = false;

    if (embeddedTarget && (embeddedTarget.id ?? 'target') === this.state.embeddedInTargetId) {
      pullDamage = this.yankBackBleedDamage;
      embeddedTarget.health = Math.max(0, Number(embeddedTarget.health ?? 100) - pullDamage);
      embeddedTarget.offBalance = true;
      targetPulledOffBalance = true;
    }

    this.state.inHand = true;
    this.state.embeddedInTargetId = null;
    this.state.currentDistanceOutMeters = 0;
    this.state.totalYankRetrievals += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playRopeTetherYankRetrieveSnap === 'function') {
      audioSynthesizer.playRopeTetherYankRetrieveSnap(1.05);
    }

    return {
      retrieved: true,
      inHand: true,
      pullDamageDealt: pullDamage,
      targetPulledOffBalance
    };
  }

  executeCircularRopeLegSweep(nearbyTargets = [], audioSynthesizer = null) {
    if (!this.state.inHand) {
      this.yankRopeToRetrieve(null, audioSynthesizer);
    }

    this.state.totalLegSweeps += 1;
    if (audioSynthesizer && typeof audioSynthesizer.playRopeTomahawkWhirlThrow === 'function') {
      audioSynthesizer.playRopeTomahawkWhirlThrow(0.95);
    }

    const knockedDownIds = [];
    for (const target of nearbyTargets) {
      const dist = Number(target.distanceMeters ?? 999);
      if (dist <= this.lowSweepRadiusMeters) {
        target.knockedProne = true;
        target.health = Math.max(0, Number(target.health ?? 100) - 28);
        knockedDownIds.push(target.id ?? 'target');
      }
    }

    return {
      executed: true,
      knockedDownCount: knockedDownIds.length,
      knockedDownIds
    };
  }

  getStatus() {
    return {
      inHand: this.state.inHand,
      embeddedInTargetId: this.state.embeddedInTargetId,
      totalThrows: this.state.totalThrows,
      totalYankRetrievals: this.state.totalYankRetrievals,
      totalLegSweeps: this.state.totalLegSweeps
    };
  }
}
