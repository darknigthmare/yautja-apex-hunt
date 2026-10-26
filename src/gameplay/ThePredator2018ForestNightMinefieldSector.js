/**
 * ThePredator2018ForestNightMinefieldSector.js
 *
 * Chantier de Level Design 5 (v187) - The Predator (2018)
 * 1:1 Canonical Level Design: Georgia Pine Forest Improvised Claymore & Grenade Minefield
 *
 * Canonical Scene: Under the cover of night, the Loonies rig an 80m perimeter in the Georgia pine woods.
 * Coyle and Baxley string directional M18A1 Claymores, tripwire-activated M67 grenades, and punji deadfalls
 * to stagger the advancing 3.30m Upgrade Predator.
 */

export class ThePredator2018ForestNightMinefieldSector {
  /**
   * @param {Object} options
   * @param {number} [options.perimeterLengthM=80.0] Longueur du périmètre piégé (m)
   * @param {number} [options.claymoreMinesCount=4] Nombre de mines Claymore directionnelles
   * @param {number} [options.grenadeTripwiresCount=6] Nombre de pièges à grenades M67
   */
  constructor(options = {}) {
    this.perimeterLengthM = options.perimeterLengthM ?? 80.0;
    this.claymoreMinesCount = options.claymoreMinesCount ?? 4;
    this.grenadeTripwiresCount = options.grenadeTripwiresCount ?? 6;

    // État runtime
    this.minefieldArmed = false;
    this.claymoresDetonated = 0;
    this.grenadesDetonated = 0;
    this.titanStaggeredSeconds = 0.0;
    this.defensePerimeterHeld = false;
  }

  /**
   * Armement du rideau défensif entre les troncs de pins
   */
  armPerimeterDefenses() {
    this.minefieldArmed = true;
    return {
      status: 'FOREST_MINEFIELD_PERIMETER_ARMED',
      perimeterLengthM: this.perimeterLengthM,
      claymoresTotal: this.claymoreMinesCount,
      grenadeTrapsTotal: this.grenadeTripwiresCount,
      killzoneEstablished: true
    };
  }

  /**
   * Déclenchement de la vague de mines Claymore lors de la charge du titan
   * @param {number} minesTriggered
   */
  triggerClaymoreSalvo(minesTriggered = 2) {
    if (!this.minefieldArmed) {
      return { success: false, reason: 'MINEFIELD_NOT_ARMED' };
    }

    const detonated = Math.min(this.claymoreMinesCount - this.claymoresDetonated, minesTriggered);
    this.claymoresDetonated += detonated;
    this.titanStaggeredSeconds += detonated * 1.5;

    return {
      success: true,
      status: 'CLAYMORE_STEEL_BALL_BLAST_TRIGGERED',
      minesDetonatedCount: this.claymoresDetonated,
      steelBallBearingsCount: detonated * 700,
      titanStaggerDurationSeconds: this.titanStaggeredSeconds,
      shockwaveDb: 142.0
    };
  }

  /**
   * Rupture des fils pièges à grenades M67
   * @param {number} trapsSnapped
   */
  snapGrenadeTripwires(trapsSnapped = 3) {
    if (!this.minefieldArmed) {
      return { success: false, reason: 'MINEFIELD_NOT_ARMED' };
    }

    const count = Math.min(this.grenadeTripwiresCount - this.grenadesDetonated, trapsSnapped);
    this.grenadesDetonated += count;
    this.titanStaggeredSeconds += count * 0.8;

    if (this.claymoresDetonated >= 2 && this.grenadesDetonated >= 3) {
      this.defensePerimeterHeld = true;
    }

    return {
      success: true,
      status: 'GRENADE_TRIPWIRES_DETONATED',
      grenadesBlown: this.grenadesDetonated,
      shrapnelRadiusM: 15.0,
      perimeterHeld: this.defensePerimeterHeld
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018ForestNightMinefieldSector',
      minefieldArmed: this.minefieldArmed,
      claymoresDetonated: this.claymoresDetonated,
      grenadesDetonated: this.grenadesDetonated,
      titanStaggeredSeconds: this.titanStaggeredSeconds,
      defensePerimeterHeld: this.defensePerimeterHeld
    };
  }
}
