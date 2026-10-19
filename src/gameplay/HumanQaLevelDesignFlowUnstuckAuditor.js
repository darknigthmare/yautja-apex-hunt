import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 9 + Audit Testeur Humain QA #5 (v153) — Persona "Explorateur Level Design & Anti-Blocage Géométrique (Unstuck)"
 * Résout les cas de coincement géométrique (entre deux rochers, sous un ascenseur ou derrière une cloison de résine) :
 * 1. Détecteur de patinage géométrique : si le joueur maintient une intention de déplacement (`moveIntentMagnitude > 0.6`) pendant plus de `1.8 s` tout en parcourant moins de `0.15 m`, déclenche un recalage fluide (*Unstuck Snap*) vers le nœud de navigation sûr le plus proche.
 * 2. Audit de connectivité verticale de secteur : vérifie que chaque arène possède au moins une issue verticale (liane, branche d'arbre, corniche de gratte-ciel ou câble d'ascenseur) accessible au saut assisté Yautja.
 */
export class HumanQaLevelDesignFlowUnstuckAuditor {
  constructor(options = {}) {
    this.stuckThresholdSec = options.stuckThresholdSec ?? 1.8;
    this.minDisplacementMeters = options.minDisplacementMeters ?? 0.15;
    this.stuckTimerSec = 0;
    this.unstuckCount = 0;
    this.safeAnchors = options.safeAnchors ?? [
      { id: 'canopy-bough-north', x: 0, y: 6.5, z: -8 },
      { id: 'temple-plinth-center', x: 4, y: 2.0, z: 4 },
      { id: 'elevator-ledge-east', x: -6, y: 9.0, z: 2 }
    ];
  }

  samplePlayerMovement(stepData = {}) {
    const dt = Number(stepData.dt ?? 0.1);
    const moveIntent = Number(stepData.moveIntentMagnitude ?? 0);
    const displacement = Number(stepData.displacementMeters ?? 0);
    const pos = stepData.position ?? { x: 0, y: 0, z: 0 };

    if (moveIntent > 0.6 && displacement < this.minDisplacementMeters) {
      this.stuckTimerSec += dt;
    } else {
      this.stuckTimerSec = Math.max(0, this.stuckTimerSec - dt * 2);
    }

    if (this.stuckTimerSec >= this.stuckThresholdSec) {
      this.stuckTimerSec = 0;
      this.unstuckCount += 1;
      const nearestAnchor = this._findNearestSafeAnchor(pos);
      audioSynth.playLevelFlowUnstuckAnchorTeleportWhoosh?.();
      return {
        unstuckTriggered: true,
        unstuckCount: this.unstuckCount,
        relocatedTo: { ...nearestAnchor }
      };
    }

    return {
      unstuckTriggered: false,
      stuckTimerSec: Number(this.stuckTimerSec.toFixed(2))
    };
  }

  auditSectorVerticalEscapeRoutes(sectorNodes = []) {
    const verticalRoutes = sectorNodes.filter(
      n => n && (n.type === 'tree_bough' || n.type === 'elevator_cable' || n.type === ' gargoyle_ledge' || n.type === 'gargoyle_ledge' || n.elevation >= 4.0)
    );
    return {
      validVerticalFlow: verticalRoutes.length >= 1,
      verticalRouteCount: verticalRoutes.length,
      recommendedFallbackAnchor: verticalRoutes[0] ?? this.safeAnchors[0]
    };
  }

  _findNearestSafeAnchor(pos) {
    let best = this.safeAnchors[0];
    let bestDistSq = Infinity;
    for (const anchor of this.safeAnchors) {
      const dx = (anchor.x ?? 0) - (pos.x ?? 0);
      const dy = (anchor.y ?? 0) - (pos.y ?? 0);
      const dz = (anchor.z ?? 0) - (pos.z ?? 0);
      const dSq = dx * dx + dy * dy + dz * dz;
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        best = anchor;
      }
    }
    return best;
  }
}
