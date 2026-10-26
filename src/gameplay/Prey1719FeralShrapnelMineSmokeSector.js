/**
 * Prey1719FeralShrapnelMineSmokeSector.js
 *
 * Chantier de Level Design 2 (v193) - Prey (2022) Feral Predator Shrapnel Disc Mines & Smoke Dampeners
 * 1:1 Canonical Level Design:
 * - Floating kinetic disc mines thrown at ground level, spinning and ejecting razor-sharp metal shrapnel blades.
 * - 360-degree horizontal severance slicing off enemy limbs at knee height.
 * - Aerosol smoke dampening grenades snuffing out open campfires and creating pitch-black pockets.
 * - Tactical area denial and ambushing clustered groups of French musketeers.
 */

export class Prey1719FeralShrapnelMineSmokeSector {
  /**
   * @param {Object} options
   * @param {number} [options.shrapnelMinesReserve=3] Nombre de mines à fragmentation en réserve
   * @param {number} [options.smokeDampenersReserve=2] Nombre de grenades fumigènes occultantes
   */
  constructor(options = {}) {
    this.shrapnelMinesReserve = options.shrapnelMinesReserve ?? 3;
    this.smokeDampenersReserve = options.smokeDampenersReserve ?? 2;

    // État runtime
    this.shrapnelMineDeployed = false;
    this.shrapnelBladesEjectedCount = 0;
    this.smokeDampenerActive = false;
    this.campfiresExtinguished = 0;
    this.enemiesLimbSevered = 0;
  }

  /**
   * Lancer et armer une mine cinétique à fragmentation rotative
   * @param {number} targetRadiusM Rayon de dispersion des lames (m)
   */
  throwSpinningShrapnelDiscMine(targetRadiusM = 6.5) {
    if (this.shrapnelMinesReserve <= 0) {
      return { status: 'FAILED_OUT_OF_SHRAPNEL_MINES', success: false };
    }

    this.shrapnelMinesReserve -= 1;
    this.shrapnelMineDeployed = true;
    this.shrapnelBladesEjectedCount = 8;
    this.enemiesLimbSevered += 3;

    return {
      status: 'SPINNING_SHRAPNEL_DISC_MINE_DETONATED',
      dispersionRadiusM: targetRadiusM,
      bladesEjected: this.shrapnelBladesEjectedCount,
      enemiesSeveredAtKnees: 3,
      kineticEjectionVelocityMps: 95.0,
      minesRemaining: this.shrapnelMinesReserve
    };
  }

  /**
   * Déployer une grenade fumigène étouffant les feux de camp
   */
  deployAerosolSmokeDampener() {
    if (this.smokeDampenersReserve <= 0) {
      return { status: 'FAILED_OUT_OF_SMOKE_DAMPENERS', success: false };
    }

    this.smokeDampenersReserve -= 1;
    this.smokeDampenerActive = true;
    this.campfiresExtinguished += 2;

    return {
      status: 'AEROSOL_SMOKE_DAMPENER_DEPLOYED',
      campfiresExtinguished: 2,
      ambientLumensDropPct: 90.0,
      pitchBlackShadowCreated: true,
      infraredTrackingDominanceActive: true,
      dampenersRemaining: this.smokeDampenersReserve
    };
  }
}
