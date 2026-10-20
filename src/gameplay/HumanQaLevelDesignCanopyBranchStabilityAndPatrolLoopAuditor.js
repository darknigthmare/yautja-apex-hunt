import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 10 + Audit Testeur Humain QA #5 (v157) — Persona "Level Designer & Testeur IA : Portance de Canopée & Boucles de Patrouille Lisses"
 * Résout deux anomalies de structure monde et de navigation :
 * 1. Portance dynamique des branches de la canopée : alerte acoustique préventive (craquement de fibre de bois) si la branche dépasse son seuil de charge (`branchMaxWeightKg`), accordant 0,8 s au joueur pour bondir vers un ancrage stable avant rupture.
 * 2. Lissage des boucles de patrouille NPC : élimine les demi-tours saccadés à 180° en insérant des arcs de courbure de transition sur les waypoints.
 */
export class HumanQaLevelDesignCanopyBranchStabilityAndPatrolLoopAuditor {
  constructor(options = {}) {
    this.reactionGraceWindowSec = options.reactionGraceWindowSec ?? 0.8;
  }

  evaluateCanopyBranchWeightCapacity(branch = {}, actorMassKg = 190) {
    const maxCapacity = Number(branch.maxWeightCapacityKg ?? 220);
    const isRotten = Boolean(branch.dryRottenWood);
    const effectiveCapacity = isRotten ? maxCapacity * 0.6 : maxCapacity;

    if (actorMassKg > effectiveCapacity) {
      audioSynth.playCanopyBoughStressCrackWarning?.();
      return {
        safe: false,
        warningEmitted: true,
        reactionGraceWindowSec: this.reactionGraceWindowSec,
        willSnapInSec: this.reactionGraceWindowSec,
        recommendedAction: 'leap_to_adjacent_bough'
      };
    }

    return {
      safe: true,
      warningEmitted: false,
      structuralMarginKg: effectiveCapacity - actorMassKg
    };
  }

  auditAndSmoothPatrolWaypoints(waypoints = []) {
    if (waypoints.length < 3) {
      return {
        isLoopClosed: false,
        smoothedCount: waypoints.length,
        hasSharpReversals: false,
        waypoints: [...waypoints]
      };
    }

    const smoothed = [];
    let sharpReversalsCount = 0;

    for (let i = 0; i < waypoints.length; i++) {
      const prev = waypoints[(i - 1 + waypoints.length) % waypoints.length];
      const curr = waypoints[i];
      const next = waypoints[(i + 1) % waypoints.length];

      const v1x = curr.x - prev.x;
      const v1z = curr.z - prev.z;
      const v2x = next.x - curr.x;
      const v2z = next.z - curr.z;

      const dot = v1x * v2x + v1z * v2z;
      const mag1 = Math.hypot(v1x, v1z);
      const mag2 = Math.hypot(v2x, v2z);

      if (mag1 > 0 && mag2 > 0 && dot / (mag1 * mag2) < -0.85) {
        sharpReversalsCount += 1;
        // Insertion d'un nœud d'arc pour adoucir le virage
        smoothed.push(curr);
        smoothed.push({
          id: `${curr.id}_bezier_fillet`,
          x: Number(((curr.x + next.x) / 2 + 1.2).toFixed(2)),
          z: Number(((curr.z + next.z) / 2 + 1.2).toFixed(2))
        });
      } else {
        smoothed.push(curr);
      }
    }

    return {
      isLoopClosed: true,
      smoothedCount: smoothed.length,
      sharpReversalsCorrected: sharpReversalsCount,
      waypoints: smoothed
    };
  }
}
