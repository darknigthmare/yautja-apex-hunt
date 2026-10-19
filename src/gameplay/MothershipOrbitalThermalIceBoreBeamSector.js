/**
 * MothershipOrbitalThermalIceBoreBeamSector.js
 * Chantier 1 (v152) : Forage thermique au plasma du vaisseau-mère à travers la banquise antarctique (AVP 2004).
 * Rayon thermique orbital tiré par le vaisseau-mère Yautja au-dessus de l'île Bouvetøya :
 * - Creuse un tunnel cylindrique lisse incliné à 30° sur 600 mètres de profondeur jusqu'à la pyramide.
 * - Vaporise instantanément la glace et les obstacles sur l'axe du faisceau, dégageant une rampe
 *   de glissade rapide pour les trois jeunes chasseurs (Scar, Celtic, Chopper) et l'expédition Weyland.
 */

export class MothershipOrbitalThermalIceBoreBeamSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_orbital_ice_bore_shaft';
    this.boreAngleDegrees = options.boreAngleDegrees ?? 30.0;
    this.targetDepthMeters = options.targetDepthMeters ?? 600.0;
    this.shaftRadiusMeters = options.shaftRadiusMeters ?? 4.5;
    this.beamVaporizationDamage = options.beamVaporizationDamage ?? 999;

    this.state = {
      beamFired: false,
      currentBoredDepthMeters: 0,
      pyramidAccessTunnelOpen: false,
      steamCloudDensity: 0,
      rapidSlideDescentAvailable: false
    };
  }

  fireOrbitalThermalBoreBeam(entitiesInBeamAxis = [], audioSynthesizer = null) {
    this.state.beamFired = true;
    this.state.currentBoredDepthMeters = this.targetDepthMeters;
    this.state.pyramidAccessTunnelOpen = true;
    this.state.steamCloudDensity = 0.88;
    this.state.rapidSlideDescentAvailable = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playMothershipOrbitalIceBoreBeamRoar === 'function') {
        audioSynthesizer.playMothershipOrbitalIceBoreBeamRoar(1.2);
      }
      if (typeof audioSynthesizer.playIceTunnelThermalSteamVentHiss === 'function') {
        audioSynthesizer.playIceTunnelThermalSteamVentHiss(1.0);
      }
    }

    const vaporizedEntityIds = [];
    for (const entity of entitiesInBeamAxis) {
      const radialDist = Math.hypot(entity.x ?? 0, entity.z ?? 0);
      if (radialDist <= this.shaftRadiusMeters) {
        entity.health = 0;
        entity.vaporizedByOrbitalBeam = true;
        vaporizedEntityIds.push(entity.id ?? 'entity');
      }
    }

    return {
      fired: true,
      boredDepthMeters: this.state.currentBoredDepthMeters,
      boreAngleDegrees: this.boreAngleDegrees,
      pyramidAccessTunnelOpen: this.state.pyramidAccessTunnelOpen,
      vaporizedEntityIds
    };
  }

  executeRapidIceShaftSlide(traveler = {}) {
    if (!this.state.rapidSlideDescentAvailable) {
      return { descended: false, reason: 'shaft_not_bored' };
    }

    traveler.depthMeters = this.targetDepthMeters;
    traveler.reachedPyramidCourtyard = true;
    traveler.fallDamageTaken = 0;

    return {
      descended: true,
      finalDepthMeters: this.targetDepthMeters,
      reachedPyramidCourtyard: true
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      beamFired: this.state.beamFired,
      currentBoredDepthMeters: this.state.currentBoredDepthMeters,
      pyramidAccessTunnelOpen: this.state.pyramidAccessTunnelOpen,
      rapidSlideDescentAvailable: this.state.rapidSlideDescentAvailable
    };
  }
}
