/**
 * Chantier 1 (v202) : Embuscade de Rick Hawkins, Blessure de Poncho & Évacuation d'Anna à Val Verde (Predator - 1987)
 * Complète en fidélité 1:1 le premier sang du Jungle Hunter dans Predator (1987) : fuite de la
 * prisonnière Anna Gonsalves sur 42 m dans les fougères, attaque furtive sur l'opérateur radio
 * Rick Hawkins traîné à 11,5 m/s (Anna épargnée car désarmée : « No sport »), blessure aux côtes
 * de Jorge « Poncho » Ramirez par un contrepoids (2 900 J) et évacuation d'Anna vers l'échelle du Huey.
 */
export class Predator1987ValVerdeHawkinsPonchoDragAndAnnaCaptureSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_HAWKINS_AMBUSH_PONCHO_AND_ANNA_EVAC';
    this.filmReference = 'Predator (1987) - Hawkins First-Blood Ambush, Anna Spared & Poncho Evacuation';
    this.reset();
  }

  reset() {
    this.annaInterceptedInUnderbrush = false;
    this.hawkinsDraggedIntoCanopy = false;
    this.annaSparedByHonorCode = false;
    this.ponchoCarriedAfterLogInjury = false;
    this.annaEvacuatedToChopper = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  interceptAnnaEscapeInUnderbrush({
    sprintDistanceMeters = 42,
    annaUnarmedStatusVerified = true
  } = {}) {
    const dist = Math.max(0, Number(sprintDistanceMeters) || 0);
    this.annaInterceptedInUnderbrush =
      dist >= 35 && Boolean(annaUnarmedStatusVerified);
    this.eventLog.push({
      step: 'ANNA_INTERCEPTED_IN_UNDERBRUSH',
      sprintDistanceMeters: dist,
      annaUnarmedStatusVerified: Boolean(annaUnarmedStatusVerified),
      annaInterceptedInUnderbrush: this.annaInterceptedInUnderbrush
    });
    return {
      annaInterceptedInUnderbrush: this.annaInterceptedInUnderbrush,
      sprintDistanceMeters: dist
    };
  }

  executeCloakedHawkinsDragAmbush({
    dragVelocityMps = 11.5,
    annaSparedDueToHonorCode = true
  } = {}) {
    if (!this.annaInterceptedInUnderbrush) {
      throw new Error('Anna escape must be intercepted before the Jungle Hunter ambushes Hawkins.');
    }
    const velocity = Math.max(0, Number(dragVelocityMps) || 0);
    this.annaSparedByHonorCode = Boolean(annaSparedDueToHonorCode);
    this.hawkinsDraggedIntoCanopy = velocity >= 9.0 && this.annaSparedByHonorCode;
    this.eventLog.push({
      step: 'HAWKINS_CLOAKED_DRAG_AMBUSH',
      dragVelocityMps: velocity,
      annaSparedByHonorCode: this.annaSparedByHonorCode,
      hawkinsDraggedIntoCanopy: this.hawkinsDraggedIntoCanopy
    });
    return {
      hawkinsDraggedIntoCanopy: this.hawkinsDraggedIntoCanopy,
      annaSparedByHonorCode: this.annaSparedByHonorCode
    };
  }

  triggerCounterweightLogRibInjuryOnPoncho({
    logImpactJoules = 2900,
    ponchoCarriedByDutch = true
  } = {}) {
    if (!this.hawkinsDraggedIntoCanopy) {
      throw new Error('Hawkins ambush must occur before Poncho suffers the counterweight log rib injury.');
    }
    const joules = Math.max(0, Number(logImpactJoules) || 0);
    this.ponchoCarriedAfterLogInjury =
      joules >= 2200 && Boolean(ponchoCarriedByDutch);
    this.eventLog.push({
      step: 'PONCHO_LOG_RIB_INJURY_AND_CARRY',
      logImpactJoules: joules,
      ponchoCarriedAfterLogInjury: this.ponchoCarriedAfterLogInjury
    });
    return {
      ponchoCarriedAfterLogInjury: this.ponchoCarriedAfterLogInjury,
      logImpactJoules: joules
    };
  }

  evacuateAnnaToHueyRopeLadder({
    chopperHoverAltitudeMeters = 14,
    dutchCoversRetreat = true
  } = {}) {
    if (!this.ponchoCarriedAfterLogInjury) {
      throw new Error('Poncho carry sequence must complete before evacuating Anna to the Huey rope ladder.');
    }
    const alt = Math.max(0, Number(chopperHoverAltitudeMeters) || 0);
    this.annaEvacuatedToChopper = alt >= 10 && Boolean(dutchCoversRetreat);
    if (this.annaEvacuatedToChopper) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'ANNA_EVACUATED_TO_HUEY_ROPE_LADDER',
      chopperHoverAltitudeMeters: alt,
      annaEvacuatedToChopper: this.annaEvacuatedToChopper,
      honorAwarded: this.honorAwarded
    });
    return {
      annaEvacuatedToChopper: this.annaEvacuatedToChopper,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      annaInterceptedInUnderbrush: this.annaInterceptedInUnderbrush,
      hawkinsDraggedIntoCanopy: this.hawkinsDraggedIntoCanopy,
      annaSparedByHonorCode: this.annaSparedByHonorCode,
      ponchoCarriedAfterLogInjury: this.ponchoCarriedAfterLogInjury,
      annaEvacuatedToChopper: this.annaEvacuatedToChopper,
      honorAwarded: this.honorAwarded
    };
  }
}
