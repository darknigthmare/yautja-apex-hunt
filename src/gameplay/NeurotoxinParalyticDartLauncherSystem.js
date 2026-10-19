/**
 * NeurotoxinParalyticDartLauncherSystem.js
 * Chantier 8 (v148) : Fléchette neuro-paralysante silencieuse (Predator 2 / Extended Lore).
 * Lance-fléchettes pneumatique de poignet tirant des aiguilles enduites de neurotoxine Yautja :
 * - Tir totalement silencieux qui ne rompt pas le camouflage optique actif.
 * - Paralyse les fonctions motrices et vocales de la cible (empêchant tout appel radio d'alerte)
 *   pour permettre une capture vivante en réserve de chasse ou un interrogatoire vocal.
 */

export class NeurotoxinParalyticDartLauncherSystem {
  constructor(options = {}) {
    this.maxDartsCapacity = options.maxDartsCapacity ?? 6;
    this.effectiveRangeMeters = options.effectiveRangeMeters ?? 28.0;
    this.paralysisDurationSeconds = options.paralysisDurationSeconds ?? 14.0;
    this.toxinTickDamage = options.toxinTickDamage ?? 12;

    this.state = {
      dartsRemaining: this.maxDartsCapacity,
      paralyzedTargets: new Map(),
      totalSilentHits: 0,
      totalRadioAlertsPrevented: 0
    };
  }

  fireSilentNeuroDart(target = null, shooterCloaked = true, audioSynthesizer = null) {
    if (this.state.dartsRemaining <= 0) {
      return { fired: false, reason: 'no_darts_remaining' };
    }
    if (!target) {
      return { fired: false, reason: 'no_target' };
    }

    const dist = Number(target.distanceMeters ?? 999);
    if (dist > this.effectiveRangeMeters) {
      return { fired: false, reason: 'out_of_range' };
    }

    this.state.dartsRemaining -= 1;
    this.state.totalSilentHits += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playNeurotoxinDartAirPuff === 'function') {
      audioSynthesizer.playNeurotoxinDartAirPuff(0.9);
    }

    const radioPrevented = Boolean(target.attemptingRadioCall || target.hasCommsUnit);
    if (radioPrevented) {
      target.attemptingRadioCall = false;
      this.state.totalRadioAlertsPrevented += 1;
    }

    target.health = Math.max(1, Number(target.health ?? 100) - this.toxinTickDamage);
    target.paralyzed = true;
    target.vocalCordsSuppressed = true;
    target.paralysisRemaining = this.paralysisDurationSeconds;

    const targetId = target.id ?? `target_${this.state.totalSilentHits}`;
    this.state.paralyzedTargets.set(targetId, target);

    return {
      fired: true,
      targetId,
      dartsRemaining: this.state.dartsRemaining,
      cloakPreserved: shooterCloaked,
      paralyzed: true,
      radioAlertSuppressed: radioPrevented,
      paralysisDurationSeconds: this.paralysisDurationSeconds
    };
  }

  update(dt = 0.016) {
    const safeDt = Math.max(0, Number(dt) || 0);
    for (const [id, target] of this.state.paralyzedTargets.entries()) {
      target.paralysisRemaining = Math.max(0, (target.paralysisRemaining ?? 0) - safeDt);
      if (target.paralysisRemaining === 0) {
        target.paralyzed = false;
        target.vocalCordsSuppressed = false;
        this.state.paralyzedTargets.delete(id);
      }
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      dartsRemaining: this.state.dartsRemaining,
      activeParalyzedCount: this.state.paralyzedTargets.size,
      totalSilentHits: this.state.totalSilentHits,
      totalRadioAlertsPrevented: this.state.totalRadioAlertsPrevented
    };
  }
}
