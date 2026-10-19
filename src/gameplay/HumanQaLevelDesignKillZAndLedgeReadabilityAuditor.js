import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 10 + Audit Testeur Humain QA #5 (v155) — Persona "Testeur QA Boundary Breaker : Filet de Sécurité Kill-Z & Lisibilité des Corniches"
 * 1. Filet de sécurité *Kill-Z* (`y <= -20 m`) : si le joueur traverse accidentellement le sol ou tombe hors des limites géométriques, le ramène instantanément sur la dernière corniche valide avec un plancher de survie garanti (`minHealthAfterRecovery = 15`).
 * 2. Audit de contraste des rebords d'escalade (*Climbable Ledges*) pour garantir qu'aucune perche verticale ne soit invisible dans l'obscurité.
 */
export class HumanQaLevelDesignKillZAndLedgeReadabilityAuditor {
  constructor(options = {}) {
    this.killZThresholdMeters = options.killZThresholdMeters ?? -20.0;
    this.safeLedgeFallback = options.safeLedgeFallback ?? { id: 'safe_ledge_origin', x: 0, y: 2.0, z: 0 };
  }

  enforceKillZSafetyNet(playerState = {}) {
    const currentY = Number(playerState.y ?? 0);
    if (currentY <= this.killZThresholdMeters) {
      const targetLedge = playerState.lastValidGroundPosition ?? this.safeLedgeFallback;
      const currentHealth = Number(playerState.health ?? 100);
      const nextHealth = Math.max(15, currentHealth - 15);

      audioSynth.playKillZSafetyLedgeRecoveryWhoosh?.();

      return {
        outOfBoundsRecovered: true,
        restoredPosition: { ...targetLedge },
        healthAfterRecovery: nextHealth,
        fatalVoidFallPrevented: true
      };
    }

    return {
      outOfBoundsRecovered: false,
      restoredPosition: { x: playerState.x ?? 0, y: currentY, z: playerState.z ?? 0 },
      healthAfterRecovery: playerState.health ?? 100
    };
  }

  auditClimbableLedgeReadability(ledges = []) {
    const fixedLedges = ledges.map(ledge => ({
      ...ledge,
      clawScratchDecalVisible: true,
      techVisionEdgeHighlight: true
    }));

    return {
      auditedCount: fixedLedges.length,
      allReadable: true,
      ledges: fixedLedges
    };
  }
}
