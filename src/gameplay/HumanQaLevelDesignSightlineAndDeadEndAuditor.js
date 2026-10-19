import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 10 + Audit Testeur Humain QA #5 (v154) — Persona "Architecte Level Design : Anti-Cul-de-Sac de Ruche, Télégraphe d'Effondrement & Lignes de Vue"
 * Corrige les pièges d'architecture injustes lors des reconfigurations de la pyramide (*AVP 2004*) ou des portes de confinement :
 * 1. Anti-Cul-de-Sac (*No Zero-Exit Room*) : si toutes les portes principales d'une salle se verrouillent, déverrouille automatiquement une trappe de maintenance ou un conduit supérieur Yautja.
 * 2. Télégraphe Anti-Écrasement (*Anti-Crush Bulkhead Eject*) : impose un préavis vibrant de `1.1 s` avant la chute d'une herse de pierre et repousse latéralement tout acteur situé exactement sous le seuil au lieu de le tuer instantanément sans prévenir.
 */
export class HumanQaLevelDesignSightlineAndDeadEndAuditor {
  constructor(options = {}) {
    this.bulkheadWarningDurationSec = options.bulkheadWarningDurationSec ?? 1.1;
  }

  auditRoomExitTopology(roomState = {}) {
    const openDoors = Number(roomState.openMainDoorsCount ?? 0);
    let openVents = Number(roomState.openCeilingVentsCount ?? 0);
    let emergencyVentPopped = false;

    if (openDoors <= 0 && openVents <= 0) {
      openVents = 1;
      emergencyVentPopped = true;
      audioSynth.playStoneBulkheadAntiCrushWarningRumble?.();
    }

    return {
      deadEndPrevented: true,
      totalAvailableExits: openDoors + openVents,
      emergencyVentPopped
    };
  }

  evaluateClosingStoneBulkhead(actorState = {}) {
    audioSynth.playStoneBulkheadAntiCrushWarningRumble?.();

    const underThreshold = Boolean(actorState.standingUnderDoorThreshold);
    if (!underThreshold) {
      return {
        warningDurationSec: this.bulkheadWarningDurationSec,
        instantCrushPrevented: true,
        ejectedToSafeSide: false
      };
    }

    return {
      warningDurationSec: this.bulkheadWarningDurationSec,
      instantCrushPrevented: true,
      ejectedToSafeSide: true,
      safeLateralOffsetMeters: 1.8,
      glancingDamageTaken: 10
    };
  }
}
