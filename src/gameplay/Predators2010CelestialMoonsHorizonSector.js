/**
 * Predators2010CelestialMoonsHorizonSector.js
 *
 * Chantier de Level Design 2 (v183) - Predators (2010)
 * 1:1 Canonical Level Design: Cliff Edge Panoramic Viewpoint & Tri-Moon Planetary Alignment
 *
 * Canonical Scene: The squad climbs to the summit ridge at 450m elevation, discovering they are on an
 * extraterrestrial Game Preserve planet when gazing at colossal ringed gas giants and multiple moons
 * suspended in the violet alien sky.
 */

export class Predators2010CelestialMoonsHorizonSector {
  /**
   * @param {Object} options
   * @param {number} [options.cliffElevation=450.0] Altitude du précipice panoramique (m)
   * @param {number} [options.atmosphericRefractionDeg=1.34] Réfraction atmosphérique optique (°)
   * @param {number} [options.skyVioletHue=278.0] Teinte de la voûte céleste (degrés HSL)
   */
  constructor(options = {}) {
    this.cliffElevation = options.cliffElevation ?? 450.0;
    this.atmosphericRefractionDeg = options.atmosphericRefractionDeg ?? 1.34;
    this.skyVioletHue = options.skyVioletHue ?? 278.0;

    // Définition canonique des corps célestes visibles
    this.celestialBodies = [
      {
        id: 'ringed_gas_giant_alpha',
        name: 'Ringed Gas Giant Primus',
        angularDiameterDeg: 28.5,
        ringInclinationDeg: 18.2,
        estimatedDistanceKm: 380000,
        colorHex: '#d8b4e2',
        ringBandsCount: 4
      },
      {
        id: 'volcanic_fissure_moon',
        name: 'Pyros Caldera Moon',
        angularDiameterDeg: 14.8,
        fissureTemperatureKelvin: 1200,
        colorHex: '#ff8a65',
        activeCalderas: 8
      },
      {
        id: 'methane_emerald_satellite',
        name: 'Viridian Methane Satellite',
        angularDiameterDeg: 9.2,
        cloudBandVelocityKmH: 420,
        colorHex: '#80cbc4',
        atmosphereDensity: 0.85
      }
    ];

    // État runtime
    this.viewpointReached = false;
    this.auroraMagneticFlux = 0.76; // Intensité du rideau d'aurores polaires
    this.squadCognitiveDisorientation = 0.0; // 0.0 -> 1.0 (choc psychologique)
    this.preserveNatureConfirmed = false;
  }

  /**
   * Approche du bord du précipice et déclenchement du panorama
   */
  reachCliffEdge() {
    this.viewpointReached = true;
    this.squadCognitiveDisorientation = 0.94; // Choc immédiat à la vue des lunes
    this.preserveNatureConfirmed = true;

    return {
      status: 'CLIFF_EDGE_PANORAMA_UNVEILED',
      elevation: this.cliffElevation,
      celestialCount: this.celestialBodies.length,
      disorientationIndex: this.squadCognitiveDisorientation,
      skyCondition: {
        hue: this.skyVioletHue,
        refractionDeg: this.atmosphericRefractionDeg,
        auroraFlux: this.auroraMagneticFlux
      }
    };
  }

  /**
   * Calcule le vecteur de distorsion optique d'un astre sous réfraction atmosphérique
   * @param {string} bodyId
   */
  computeCelestialOptics(bodyId) {
    const body = this.celestialBodies.find(b => b.id === bodyId) || this.celestialBodies[0];
    const apparentAltitude = 24.0 + (this.atmosphericRefractionDeg * Math.sin((body.angularDiameterDeg * Math.PI) / 180));
    const opticalLensingFactor = 1.0 + (this.atmosphericRefractionDeg / 10.0);

    return {
      bodyId: body.id,
      name: body.name,
      apparentAltitudeDeg: parseFloat(apparentAltitude.toFixed(2)),
      angularDiameterDeg: body.angularDiameterDeg,
      opticalLensingFactor: parseFloat(opticalLensingFactor.toFixed(3)),
      distanceKm: body.estimatedDistanceKm || 520000
    };
  }

  /**
   * Analyse médico-légale du choc de l'escouade
   */
  evaluateSquadPsyche() {
    return {
      confirmedNotEarth: this.preserveNatureConfirmed,
      squadMoralePenalty: -35.0,
      alienGamePreserveIdentified: true,
      tacticalConclusion: 'NO_EXTRACTION_POSSIBLE_HUNT_OR_BE_HUNTED'
    };
  }

  /**
   * Rapport télémétrique complet
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010CelestialMoonsHorizonSector',
      cliffElevation: this.cliffElevation,
      viewpointReached: this.viewpointReached,
      celestialBodiesCount: this.celestialBodies.length,
      squadCognitiveDisorientation: this.squadCognitiveDisorientation,
      preserveNatureConfirmed: this.preserveNatureConfirmed
    };
  }
}
