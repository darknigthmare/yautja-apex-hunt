import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 9 + Audit Testeur Humain QA #4 (v157) — Persona "Combattant Hardcore : Parade d'Embuscade Arrière & Ancrage des Serres en Pente"
 * Élimine deux blocages de gameplay relevés en session combat :
 * 1. Fenêtre de contre-parade arrière (0,22 s) : permet de repousser d'un coup de coude ou d'un revers de serres une frappe sournoise dans le dos (Facehugger bondissant, baïonnette) grâce à l'indice sonore d'alerte.
 * 2. Ancrage des serres pédieuses Yautja en pente abrupte : stabilise la traction sur rochers glissants ou talus boueux jusqu'à 60° d'inclinaison sans dérapage involontaire.
 */
export class HumanQaGameplayBackstabParryAndSlopeTractionAuditor {
  constructor(options = {}) {
    this.rearReflexWindowSec = options.rearReflexWindowSec ?? 0.22;
    this.maxTalonGripAngleDeg = options.maxTalonGripAngleDeg ?? 60.0;
  }

  evaluateRearAmbushParry(ambushEvent = {}, playerReactionTimeSec = 0.15) {
    const isRearAttack = ambushEvent.angleFromHunterDeg >= 120 && ambushEvent.angleFromHunterDeg <= 240;

    if (isRearAttack && playerReactionTimeSec <= this.rearReflexWindowSec) {
      audioSynth.playRearAmbushParryTalonClang?.();
      return {
        parried: true,
        attackerStaggered: true,
        counterDamageDealt: 45,
        rearDamageNegated: true
      };
    }

    return {
      parried: false,
      attackerStaggered: false,
      rearDamageTaken: Number(ambushEvent.damage ?? 60)
    };
  }

  evaluateSlopeGripAndTalonTraction(slopeAngleDeg = 35.0, talonsEngaged = true) {
    if (slopeAngleDeg <= 30.0) {
      return { slipping: false, stableGrip: true, speedMultiplier: 1.0 };
    }

    if (talonsEngaged && slopeAngleDeg <= this.maxTalonGripAngleDeg) {
      return {
        slipping: false,
        stableGrip: true,
        talonAnchored: true,
        speedMultiplier: 0.85
      };
    }

    return {
      slipping: true,
      stableGrip: false,
      downhillSlideVelocityMps: 4.5,
      speedMultiplier: 0.3
    };
  }
}
