import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 9 + Audit Testeur Humain QA #4 (v155) — Persona "Chasseur Tactique : Sécurité IFF des Mines Laser, Décrochage de Visée sous Camouflage & Fenêtre de Parade"
 * 1. Sécurité IFF (*Identification Friend or Foe*) sur les mines laser Yautja : met le faisceau en veille (`standby`) lorsque le chasseur propriétaire traverse son propre piège, évitant l'auto-mutilation frustrante.
 * 2. Verrouillage sur la Dernière Position Connue (*Last Known Position*) : dès que le Predator active son camouflage optique et se décale de plus de `2.5 m`, les tireurs ennemis cessent le suivi omniscient et tirent sur la position fantôme.
 * 3. Validation de la fenêtre de parade parfaite élargie à `180 ms` (`0.18 s`).
 */
export class HumanQaGameplayTrapSafetyAndParryWindowAuditor {
  constructor(options = {}) {
    this.perfectParryWindowSec = options.perfectParryWindowSec ?? 0.18;
  }

  evaluateLaserTrapPassage(actor = {}, trap = {}) {
    if (actor.id && trap.ownerId && actor.id === trap.ownerId) {
      audioSynth.playLaserTrapIffOwnerStandbyChirp?.();
      return {
        detonated: false,
        iffStandbyActivated: true,
        damageToOwner: 0
      };
    }

    return {
      detonated: true,
      iffStandbyActivated: false,
      damageDealt: trap.damage ?? 140
    };
  }

  evaluateEnemyTrackingTarget(hunterState = {}) {
    if (hunterState.cloakActive && (hunterState.lateralDisplacementSinceCloakMeters ?? 0) >= 2.5) {
      return {
        omniscientTrackingBroken: true,
        aimTargetPosition: { ...(hunterState.lastKnownPosition ?? { x: 0, y: 0, z: 0 }) }
      };
    }

    return {
      omniscientTrackingBroken: false,
      aimTargetPosition: { ...(hunterState.currentPosition ?? { x: 0, y: 0, z: 0 }) }
    };
  }

  evaluateParryTiming(deltaFromImpactSec = 0.12) {
    const absDelta = Math.abs(Number(deltaFromImpactSec) || 0);
    if (absDelta <= this.perfectParryWindowSec) {
      audioSynth.playGenerousParryWindowPerfectClang?.();
      return {
        perfectParry: true,
        damageMitigatedRatio: 1.0,
        attackerStaggered: true
      };
    }
    return {
      perfectParry: false,
      damageMitigatedRatio: 0.5,
      attackerStaggered: false
    };
  }
}
