import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 10 + Audit Testeur Humain QA #5 (v158) — Persona "Level Designer : Espacement des Piliers de Couvert & Anti-Coincement Dièdre"
 * Assure la fluidité des déplacements en environnement encombré (Pyramide, Abattoir, Station) :
 * 1. Espacement minimal des piliers de couvert (>= 1,3 m) pour garantir le passage en sprint et esquive latérale sans blocage de collision.
 * 2. Détection et correction des angles dièdres étroits (< 60°) formant des "coins morts" où le joueur risque de rester coincé : application d'une impulsion de dégagement fluide (Nudge vectoriel).
 */
export class HumanQaLevelDesignCoverPillarSpacingAndDihedralAngleAuditor {
  constructor(options = {}) {
    this.minClearanceSpacingMeters = options.minClearanceSpacingMeters ?? 1.3;
    this.minDihedralAngleDeg = options.minDihedralAngleDeg ?? 60.0;
  }

  auditPillarsClearanceAndSpacing(pillarNodes = []) {
    let tooClosePairsCount = 0;
    const adjustedPairs = [];

    for (let i = 0; i < pillarNodes.length; i++) {
      for (let j = i + 1; j < pillarNodes.length; j++) {
        const p1 = pillarNodes[i];
        const p2 = pillarNodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.z - p2.z);

        if (dist < this.minClearanceSpacingMeters) {
          tooClosePairsCount += 1;
          adjustedPairs.push({
            p1Id: p1.id,
            p2Id: p2.id,
            measuredSpacingMeters: Number(dist.toFixed(2)),
            recommendedSpacingMeters: this.minClearanceSpacingMeters
          });
        }
      }
    }

    return {
      pillarsAuditedCount: pillarNodes.length,
      spacingViolationsCount: tooClosePairsCount,
      adjustedPairs,
      navigableCorridorsValid: tooClosePairsCount === 0
    };
  }

  resolveDihedralCornerNudge(playerPosition = { x: 0, z: 0 }, cornerData = {}) {
    const cornerAngleDeg = Number(cornerData.interiorAngleDeg ?? 90);

    if (cornerAngleDeg < this.minDihedralAngleDeg) {
      audioSynth.playDihedralCornerAntiJamNudgeHum?.();
      const nx = cornerData.outwardNormalX ?? 0.7;
      const nz = cornerData.outwardNormalZ ?? 0.7;

      return {
        trappedInAcuteCorner: true,
        nudgeApplied: true,
        nudgedPosition: {
          x: Number((playerPosition.x + nx * 0.45).toFixed(2)),
          z: Number((playerPosition.z + nz * 0.45).toFixed(2))
        },
        freedFromJam: true
      };
    }

    return {
      trappedInAcuteCorner: false,
      nudgeApplied: false,
      nudgedPosition: { ...playerPosition }
    };
  }
}
