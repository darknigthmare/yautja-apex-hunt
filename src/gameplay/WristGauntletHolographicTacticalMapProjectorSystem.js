/**
 * WristGauntletHolographicTacticalMapProjectorSystem.js
 * Chantier 9 (v151) : Projecteur holographique 3D de poignet & télémétrie de structure (AVP 2004).
 * Console holographique rouge/ambrée projetée au-dessus du gantelet gauche Yautja :
 * - Scanne et affiche en fil de fer 3D l'architecture complète d'un complexe ou de la pyramide.
 * - Suit en temps réel le statut vital des frères de clan (Celtic, Chopper, Scar) et l'emplacement
 *   des armes sacrées ou brèches structurelles.
 */

export class WristGauntletHolographicTacticalMapProjectorSystem {
  constructor(options = {}) {
    this.clanMates = (options.clanMates ?? [
      { id: 'scar_initiate', status: 'ACTIVE', roomId: 'sacrificial_chamber' },
      { id: 'celtic_leader', status: 'ACTIVE', roomId: 'main_pillared_hall' },
      { id: 'chopper_hunter', status: 'ACTIVE', roomId: 'hieroglyph_corridor' }
    ]).map((c) => ({ ...c }));

    this.state = {
      hologramProjected: false,
      mappedRoomsCount: 12,
      activeClanMatesCount: 3,
      fallenClanMatesLocations: []
    };
  }

  projectTacticalHologramMap(structureRooms = [], audioSynthesizer = null) {
    this.state.hologramProjected = true;
    if (structureRooms.length > 0) {
      this.state.mappedRoomsCount = structureRooms.length;
    }

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playWristHologramProjectorActivateChime === 'function') {
        audioSynthesizer.playWristHologramProjectorActivateChime(1.0);
      }
      if (typeof audioSynthesizer.playHologramClanMateTelemetryPing === 'function') {
        audioSynthesizer.playHologramClanMateTelemetryPing(0.95);
      }
    }

    return {
      projected: true,
      mappedRoomsCount: this.state.mappedRoomsCount,
      clanMatesTelemetry: this.clanMates.map((c) => ({ ...c }))
    };
  }

  registerClanMateFallenAlert(clanMateId, audioSynthesizer = null) {
    const mate = this.clanMates.find((c) => c.id === clanMateId);
    if (!mate) {
      return { updated: false, reason: 'clan_mate_not_found' };
    }

    mate.status = 'FALLEN_IN_HUNT';
    this.state.activeClanMatesCount = this.clanMates.filter((c) => c.status === 'ACTIVE').length;
    this.state.fallenClanMatesLocations.push({ id: mate.id, roomId: mate.roomId });

    if (audioSynthesizer && typeof audioSynthesizer.playHologramClanMateTelemetryPing === 'function') {
      audioSynthesizer.playHologramClanMateTelemetryPing(1.15);
    }

    return {
      updated: true,
      fallenClanMateId: mate.id,
      roomId: mate.roomId,
      activeClanMatesCount: this.state.activeClanMatesCount
    };
  }

  getStatus() {
    return {
      hologramProjected: this.state.hologramProjected,
      mappedRoomsCount: this.state.mappedRoomsCount,
      activeClanMatesCount: this.state.activeClanMatesCount,
      fallenClanMatesLocations: [...this.state.fallenClanMatesLocations]
    };
  }
}
