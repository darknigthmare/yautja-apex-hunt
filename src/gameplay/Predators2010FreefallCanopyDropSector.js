/**
 * Predators2010FreefallCanopyDropSector.js
 *
 * Chantier de Level Design 1 (v183) - Predators (2010)
 * 1:1 Canonical Level Design: High-Altitude Atmospheric Ejection & Freefall Canopy Awakening
 *
 * Canonical Scene: Royce awakens in freefall at 3,000m falling at terminal velocity (~54 m/s).
 * At 150m, his barometric parachute violently deploys, snagging in giant alien fern canopy branches.
 * The player must cut tangled risers with a combat knife before suspension failure, landing into the dense foliage.
 */

export class Predators2010FreefallCanopyDropSector {
  /**
   * @param {Object} options
   * @param {number} [options.initialAltitude=3000.0] Altitude de départ en chute libre (m)
   * @param {number} [options.bodyMass=85.0] Masse corporelle avec paquetage de combat (kg)
   * @param {number} [options.dragCoeff=1.2] Coefficient de traînée aérodynamique
   * @param {number} [options.deployAltitudeThreshold=150.0] Seuil barométrique d'ouverture de voile (m)
   */
  constructor(options = {}) {
    this.initialAltitude = options.initialAltitude ?? 3000.0;
    this.bodyMass = options.bodyMass ?? 85.0;
    this.dragCoeff = options.dragCoeff ?? 0.85;
    this.deployAltitudeThreshold = options.deployAltitudeThreshold ?? 150.0;

    // Constantes physiques
    this.gravity = 9.81; // m/s^2
    this.airDensity = 1.225; // kg/m^3
    this.projectedArea = 0.55; // m^2 (corps étalé en chute libre)

    // Calcul de la vitesse terminale canonique : vt = sqrt((2 * m * g) / (rho * Cd * A))
    this.terminalVelocity = Math.sqrt(
      (2 * this.bodyMass * this.gravity) / (this.airDensity * this.dragCoeff * this.projectedArea)
    ); // ~54.0 m/s

    // État runtime
    this.currentAltitude = this.initialAltitude;
    this.currentVelocity = 0.0;
    this.parachuteDeployed = false;
    this.canopySnagged = false;
    this.riserTension = 0.0; // N
    this.riserCutProgress = 0.0; // 0.0 -> 1.0
    this.landedSafely = false;
    this.foliageImpactAbsorption = 0.0; // %
    this.cutQteTimer = 2.0; // secondes avant rupture
  }

  /**
   * Simule la descente en chute libre sur un pas de temps delta
   * @param {number} deltaSeconds
   * @returns {{ altitude: number, velocity: number, terminalPct: number, deployed: boolean }}
   */
  simulateFreefallDescent(deltaSeconds) {
    if (this.canopySnagged || this.landedSafely) {
      return {
        altitude: this.currentAltitude,
        velocity: this.currentVelocity,
        terminalPct: 0,
        deployed: this.parachuteDeployed
      };
    }

    if (!this.parachuteDeployed) {
      // Accélération vers la vitesse terminale
      const dragForce = 0.5 * this.airDensity * this.dragCoeff * this.projectedArea * Math.pow(this.currentVelocity, 2);
      const netForce = (this.bodyMass * this.gravity) - dragForce;
      const acceleration = netForce / this.bodyMass;

      this.currentVelocity = Math.min(this.terminalVelocity, this.currentVelocity + acceleration * deltaSeconds);
      this.currentAltitude = Math.max(this.deployAltitudeThreshold, this.currentAltitude - this.currentVelocity * deltaSeconds);

      if (this.currentAltitude <= this.deployAltitudeThreshold) {
        this.deployParachute();
      }
    } else {
      // Voile ouverte : décélération rapide vers vitesse de glisse
      const glideVelocity = 7.2; // m/s
      this.currentVelocity = Math.max(glideVelocity, this.currentVelocity - 28.0 * deltaSeconds);
      this.currentAltitude = Math.max(0.0, this.currentAltitude - this.currentVelocity * deltaSeconds);

      if (this.currentAltitude <= 35.0 && !this.canopySnagged) {
        this.snagInCanopyBranches();
      }
    }

    return {
      altitude: parseFloat(this.currentAltitude.toFixed(1)),
      velocity: parseFloat(this.currentVelocity.toFixed(1)),
      terminalPct: parseFloat(((this.currentVelocity / this.terminalVelocity) * 100).toFixed(1)),
      deployed: this.parachuteDeployed
    };
  }

  /**
   * Déploiement automatique de la voile de secours
   */
  deployParachute() {
    this.parachuteDeployed = true;
    return {
      status: 'PARACHUTE_DEPLOYED',
      deployAltitude: this.currentAltitude,
      targetGlideSpeed: 7.2
    };
  }

  /**
   * Enchevêtrement violent dans les branches de fougères géantes à 35m
   */
  snagInCanopyBranches() {
    this.canopySnagged = true;
    this.currentVelocity = 0.0;
    this.riserTension = 1850.0; // N
    this.foliageImpactAbsorption = 88.5; // % d'énergie dissipée par la canopée
    return {
      status: 'CANOPY_SNAGGED',
      snagAltitude: this.currentAltitude,
      riserTensionN: this.riserTension,
      absorptionPct: this.foliageImpactAbsorption,
      qteTimeLimitSeconds: this.cutQteTimer
    };
  }

  /**
   * Action de coupe des suspentes au couteau de combat (QTE)
   * @param {number} sliceForceN Force appliquée sur la lame (N)
   */
  cutParachuteRisers(sliceForceN = 120.0) {
    if (!this.canopySnagged || this.landedSafely) {
      return { success: false, reason: 'NOT_SNAGGED_OR_ALREADY_LANDED' };
    }

    const cutIncrement = (sliceForceN / 100.0) * 0.45;
    this.riserCutProgress = Math.min(1.0, this.riserCutProgress + cutIncrement);

    if (this.riserCutProgress >= 1.0) {
      this.canopySnagged = false;
      this.currentAltitude = 0.0;
      this.landedSafely = true;
      return {
        success: true,
        status: 'RISERS_SEVERED_SAFE_TOUCHDOWN',
        landingAltitude: 0.0,
        groundRollAbsorption: 95.0
      };
    }

    return {
      success: false,
      status: 'RISERS_CUTTING_IN_PROGRESS',
      progressPct: parseFloat((this.riserCutProgress * 100).toFixed(1))
    };
  }

  /**
   * Rapport télémétrique complet pour l'audit QA
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010FreefallCanopyDropSector',
      initialAltitude: this.initialAltitude,
      currentAltitude: this.currentAltitude,
      currentVelocity: this.currentVelocity,
      terminalVelocity: this.terminalVelocity,
      parachuteDeployed: this.parachuteDeployed,
      canopySnagged: this.canopySnagged,
      riserCutProgress: this.riserCutProgress,
      landedSafely: this.landedSafely,
      foliageImpactAbsorption: this.foliageImpactAbsorption
    };
  }
}
