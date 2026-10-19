/**
 * BouvetoyaWhalingStationRailSledWinchSector.js
 * Chantier 1 (v150) : Chariot élévateur sur rails de la station baleinière de Bouvetøya & treuil brise-glace (AVP 2004).
 * Plateforme industrielle sur rails inclinés le long du puits de forage thermique :
 * - Déverrouillage du treuil mécanique permettant au chariot de dévaler la pente glacée à grande vitesse.
 * - Permet de franchir la crevasse centrale tout en percutant et écrasant les Xénomorphes ou mercenaires
 *   présents sur la voie ferrée.
 */

export class BouvetoyaWhalingStationRailSledWinchSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_whaling_station_rail_incline';
    this.trackLengthMeters = options.trackLengthMeters ?? 42.0;
    this.sledCorridorHalfWidth = options.sledCorridorHalfWidth ?? 2.2;
    this.ramImpactDamage = options.ramImpactDamage ?? 240;

    this.state = {
      winchBrakeLocked: true,
      sledLaunched: false,
      currentTrackProgressMeters: 0,
      crevasseCleared: false,
      totalEntitiesRammed: 0
    };
  }

  releaseWinchAndLaunchSled(entitiesOnTrack = [], passengers = [], audioSynthesizer = null) {
    if (!this.state.winchBrakeLocked || this.state.sledLaunched) {
      return { launched: false, reason: 'sled_already_launched' };
    }

    this.state.winchBrakeLocked = false;
    this.state.sledLaunched = true;
    this.state.currentTrackProgressMeters = this.trackLengthMeters;
    this.state.crevasseCleared = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playWhalingStationRailSledWinchRelease === 'function') {
        audioSynthesizer.playWhalingStationRailSledWinchRelease(1.0);
      }
      if (typeof audioSynthesizer.playRailSledIceCrevasseCrash === 'function') {
        audioSynthesizer.playRailSledIceCrevasseCrash(1.15);
      }
    }

    for (const passenger of passengers) {
      passenger.transportedAcrossCrevasse = true;
      passenger.z = this.trackLengthMeters;
    }

    const rammedEntityIds = [];
    for (const entity of entitiesOnTrack) {
      const lateralOffset = Math.abs(Number(entity.x ?? 0));
      const trackZ = Number(entity.z ?? 0);
      if (lateralOffset <= this.sledCorridorHalfWidth && trackZ >= 0 && trackZ <= this.trackLengthMeters) {
        entity.health = Math.max(0, Number(entity.health ?? 150) - this.ramImpactDamage);
        entity.knockedOffRails = true;
        rammedEntityIds.push(entity.id ?? 'entity');
        this.state.totalEntitiesRammed += 1;
      }
    }

    return {
      launched: true,
      crevasseCleared: this.state.crevasseCleared,
      passengersTransportedCount: passengers.length,
      rammedEntityIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      winchBrakeLocked: this.state.winchBrakeLocked,
      sledLaunched: this.state.sledLaunched,
      crevasseCleared: this.state.crevasseCleared,
      totalEntitiesRammed: this.state.totalEntitiesRammed
    };
  }
}
