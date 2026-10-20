import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 9 + Audit Testeur Humain QA #4 (v156) — Persona "Joueur Action Corps-à-Corps : Magnétisme Doux de Visée Mêlée & Bouclier d'Exécution Trophée"
 * 1. *Soft Melee Magnetism* : si le joueur attaque aux Wristblades à une distance `<= 2.2 m` et un angle `<= 25°` d'une cible agile (Facehugger, Runner), aligne doucement le pas de fente vers la cible pour éviter les coups dans le vide frustrants.
 * 2. *Trophy Execution Hyper-Armor* : accorde `85 %` de réduction de dégâts et repousse les ennemis adjacents (`fearKnockbackRadiusMeters = 3.5`) pendant l'animation d'arrachage de trophée (*Spine Rip*).
 */
export class HumanQaGameplayMeleeMagnetismAndExecutionShieldAuditor {
  constructor(options = {}) {
    this.maxSnapDistanceMeters = options.maxSnapDistanceMeters ?? 2.2;
    this.maxSnapAngleDegrees = options.maxSnapAngleDegrees ?? 25;
    this.executionDamageReductionRatio = options.executionDamageReductionRatio ?? 0.85;
  }

  evaluateSoftMeleeLungeAssist(strikeContext = {}) {
    const dist = Number(strikeContext.distanceToTargetMeters ?? 5.0);
    const angleDeg = Math.abs(Number(strikeContext.angleOffsetDegrees ?? 45));

    if (dist <= this.maxSnapDistanceMeters && angleDeg <= this.maxSnapAngleDegrees) {
      audioSynth.playSoftMeleeMagnetismLungeWhoosh?.();
      return {
        magnetismApplied: true,
        alignedAngleDegrees: 0,
        lungeStepMeters: Number(Math.max(0, dist - 0.9).toFixed(2)),
        hitGuaranteed: true
      };
    }

    return {
      magnetismApplied: false,
      hitGuaranteed: false
    };
  }

  mitigateDamageDuringTrophyExecution(incomingDamage = 40) {
    audioSynth.playTrophyExecutionHyperArmorPulse?.();
    const mitigated = Math.round(incomingDamage * (1 - this.executionDamageReductionRatio));
    return {
      hyperArmorActive: true,
      damageTaken: mitigated,
      damageMitigatedRatio: this.executionDamageReductionRatio,
      fearKnockbackRadiusMeters: 3.5
    };
  }
}
