/**
 * FeralPredatorBoneMaskLaserGuidedBoltSystem.js
 * Chantier 7 (v149) : Arbalète à carreaux guidés par viseur laser du masque osseux (Prey 2022 — Feral).
 * Lance-flèches métalliques de poignet couplé aux 3 diodes laser du bio-masque osseux de Feral :
 * - Tant que le masque osseux est porté et intact, les carreaux incurvent leur trajectoire en vol
 *   pour contourner les obstacles (arbres, rochers) et frapper exactement le point visé par les lasers.
 * - Si le masque est arraché ou endommagé (ou si Naru s'en sert contre lui), les carreaux suivent
 *   la direction actuelle du masque plutôt que celle du lanceur.
 */

export class FeralPredatorBoneMaskLaserGuidedBoltSystem {
  constructor(options = {}) {
    this.maxBolts = options.maxBolts ?? 12;
    this.guidedBoltDamage = options.guidedBoltDamage ?? 92;
    this.unguidedBoltDamage = options.unguidedBoltDamage ?? 60;

    this.state = {
      boltsRemaining: this.maxBolts,
      boneMaskIntactAndWorn: true,
      detachedMaskAimTargetId: null,
      totalGuidedHits: 0,
      totalDetachedMaskRedirectKills: 0
    };
  }

  setBoneMaskState(wornAndIntact = true, detachedAimTargetId = null) {
    this.state.boneMaskIntactAndWorn = Boolean(wornAndIntact);
    this.state.detachedMaskAimTargetId = detachedAimTargetId;
    return this.getStatus();
  }

  fireLaserGuidedBolt(intendedTarget = null, allEntities = [], audioSynthesizer = null) {
    if (this.state.boltsRemaining <= 0) {
      return { fired: false, reason: 'no_bolts_remaining' };
    }
    if (!intendedTarget) {
      return { fired: false, reason: 'no_intended_target' };
    }

    this.state.boltsRemaining -= 1;

    if (audioSynthesizer && typeof audioSynthesizer.playFeralLaserGuidedBoltWhistle === 'function') {
      audioSynthesizer.playFeralLaserGuidedBoltWhistle(1.0);
    }

    // Si le masque est porté : le carreau contourne tout couvert et touche la cible verrouillée
    if (this.state.boneMaskIntactAndWorn) {
      intendedTarget.health = Math.max(0, Number(intendedTarget.health ?? 100) - this.guidedBoltDamage);
      this.state.totalGuidedHits += 1;

      return {
        fired: true,
        guidedBypassCover: true,
        struckTargetId: intendedTarget.id ?? 'target',
        damageDealt: this.guidedBoltDamage,
        remainingHealth: intendedTarget.health
      };
    }

    // Si le masque a été détaché et pointe vers une autre entité (ex: le piège de Naru dans Prey 2022)
    if (this.state.detachedMaskAimTargetId) {
      const redirectedEntity = allEntities.find((e) => e.id === this.state.detachedMaskAimTargetId) ?? intendedTarget;
      redirectedEntity.health = Math.max(0, Number(redirectedEntity.health ?? 100) - this.guidedBoltDamage * 1.5);
      this.state.totalDetachedMaskRedirectKills += 1;

      return {
        fired: true,
        redirectedByDetachedBoneMask: true,
        struckTargetId: redirectedEntity.id ?? 'redirected_target',
        damageDealt: Math.round(this.guidedBoltDamage * 1.5),
        remainingHealth: redirectedEntity.health
      };
    }

    // Sans masque ni laser actif : tir rectiligne bloqué par le couvert
    if (intendedTarget.behindTreeOrRockCover) {
      return {
        fired: true,
        guidedBypassCover: false,
        blockedByCover: true,
        damageDealt: 0
      };
    }

    intendedTarget.health = Math.max(0, Number(intendedTarget.health ?? 100) - this.unguidedBoltDamage);
    return {
      fired: true,
      guidedBypassCover: false,
      struckTargetId: intendedTarget.id ?? 'target',
      damageDealt: this.unguidedBoltDamage,
      remainingHealth: intendedTarget.health
    };
  }

  getStatus() {
    return {
      boltsRemaining: this.state.boltsRemaining,
      boneMaskIntactAndWorn: this.state.boneMaskIntactAndWorn,
      detachedMaskAimTargetId: this.state.detachedMaskAimTargetId,
      totalGuidedHits: this.state.totalGuidedHits,
      totalDetachedMaskRedirectKills: this.state.totalDetachedMaskRedirectKills
    };
  }
}
