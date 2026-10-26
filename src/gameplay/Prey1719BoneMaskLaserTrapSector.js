/**
 * Prey1719BoneMaskLaserTrapSector.js
 *
 * Chantier de Level Design 2 (v191) - Prey (2022) Bone Mask Tri-Laser Alignment & Self-Inflicted Flechette Climax
 * 1:1 Canonical Level Design:
 * - Glacial mud pit arena where the Feral Predator is lured into knee-deep suction mire.
 * - Planting the detached carved bone mask into the mud embankment.
 * - Aligning the tri-laser targeting sights to project backward toward the Feral Predator's skull coordinates.
 * - The Feral Predator firing its guided flechette boltgun, which curves 180° in mid-air and impales its own cranium.
 */

export class Prey1719BoneMaskLaserTrapSector {
  /**
   * @param {Object} options
   * @param {number} [options.mudPitDepthM=1.2] Profondeur de la fosse de boue finale (m)
   * @param {number} [options.trapAngleDegrees=180.0] Angle de rétroaction balistique (degrés)
   */
  constructor(options = {}) {
    this.mudPitDepthM = options.mudPitDepthM ?? 1.2;
    this.trapAngleDegrees = options.trapAngleDegrees ?? 180.0;

    // État runtime
    this.boneMaskPlantedInMud = false;
    this.triLaserAlignedToPredatorCranium = false;
    this.feralPredatorLuredIntoPit = false;
    this.boltgunFiredByPredator = false;
    this.selfInflictedImpaleLethal = false;
  }

  /**
   * Planter le masque d'os dans le remblai de boue
   */
  plantBoneMaskInMudWall() {
    this.boneMaskPlantedInMud = true;

    return {
      status: 'BONE_MASK_EMBEDDED_IN_MUD_WALL',
      elevationAbovePitM: 0.85,
      maskAnchorStable: true,
      laserOpticsPowered: true
    };
  }

  /**
   * Aligner le tri-laser vers la position exacte du Feral Predator
   * @param {Object} craniumCoords Coordonnées de la tête du chasseur
   */
  alignTriLaserToPredatorCranium(craniumCoords = { x: 12.0, y: 2.3, z: 8.0 }) {
    if (!this.boneMaskPlantedInMud) {
      return { status: 'FAILED_MASK_NOT_PLANTED', aligned: false };
    }

    this.triLaserAlignedToPredatorCranium = true;

    return {
      status: 'TRI_LASER_ALIGNED_TO_PREDATOR_SKULL',
      craniumCoords,
      retroactionAngleDeg: this.trapAngleDegrees,
      homingLockActive: true
    };
  }

  /**
   * Attirer le Feral Predator dans la fosse de boue
   */
  lureFeralPredatorIntoMudPit() {
    this.feralPredatorLuredIntoPit = true;

    return {
      status: 'FERAL_PREDATOR_TRAPPED_IN_MUD_MIRE',
      mireDepthM: this.mudPitDepthM,
      mobilityPenaltyPct: 65.0,
      stanceFixedInLaserPath: true
    };
  }

  /**
   * Provoquer le tir du pistolet à fléchettes qui fait demi-tour et transperce le chasseur
   */
  triggerGuidedFlechetteSelfInflictedKill() {
    if (!this.triLaserAlignedToPredatorCranium || !this.feralPredatorLuredIntoPit) {
      return { status: 'FAILED_CONDITIONS_NOT_MET', lethal: false };
    }

    this.boltgunFiredByPredator = true;
    this.selfInflictedImpaleLethal = true;

    return {
      status: 'GUIDED_FLECHETTE_CURVED_INTO_PREDATOR_SKULL',
      boltTrajectoryCurvatureDeg: 180.0,
      impactJoules: 7500.0,
      cranialPerforationLethal: true,
      feralPredatorDefeated: true,
      trophyPistolClaimed: 'RAPHAEL_ADOLINI_1715'
    };
  }
}
