/**
 * SubwayTunnelHighVoltageThirdRailHazardSector.js
 * Chantier 6 (v151) : Tunnel de métro de Los Angeles & troisième rail haute tension (Predator 2).
 * Voies souterraines du métro de Los Angeles 1997 :
 * - Troisième rail alimenté en 750V DC : projeter une cible ou électrifier une flaque d'eau
 *   conductrice inflige une décharge létale et fait sauter les disjoncteurs d'éclairage du tunnel.
 * - Passage périodique de rames à grande vitesse sur la voie centrale.
 */

export class SubwayTunnelHighVoltageThirdRailHazardSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_subway_third_rail_tunnel';
    this.thirdRailVoltage = 750;
    this.arcElectroDamage = options.arcElectroDamage ?? 160;
    this.puddleConductionRadiusMeters = options.puddleConductionRadiusMeters ?? 5.5;

    this.state = {
      railPowered: true,
      tunnelEmergencyStrobeOnly: false,
      totalElectrocutedCount: 0
    };
  }

  triggerThirdRailContactOrArc(contactPosition = { x: 0, z: 0 }, entities = [], audioSynthesizer = null) {
    if (!this.state.railPowered) {
      return { triggered: false, reason: 'rail_breaker_tripped' };
    }

    if (audioSynthesizer && typeof audioSynthesizer.playSubwayThirdRailHighVoltageArc === 'function') {
      audioSynthesizer.playSubwayThirdRailHighVoltageArc(1.1);
    }

    const shockedEntityIds = [];
    for (const entity of entities) {
      const dist = Math.hypot((entity.x ?? 0) - (contactPosition.x ?? 0), (entity.z ?? 0) - (contactPosition.z ?? 0));
      if (dist <= this.puddleConductionRadiusMeters) {
        entity.health = Math.max(0, Number(entity.health ?? 140) - this.arcElectroDamage);
        entity.electrocutedByThirdRail = true;
        shockedEntityIds.push(entity.id ?? 'entity');
        this.state.totalElectrocutedCount += 1;
      }
    }

    this.state.tunnelEmergencyStrobeOnly = true;

    return {
      triggered: true,
      voltageDischarged: this.thirdRailVoltage,
      tunnelEmergencyStrobeOnly: this.state.tunnelEmergencyStrobeOnly,
      shockedEntityIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      railPowered: this.state.railPowered,
      tunnelEmergencyStrobeOnly: this.state.tunnelEmergencyStrobeOnly,
      totalElectrocutedCount: this.state.totalElectrocutedCount
    };
  }
}
