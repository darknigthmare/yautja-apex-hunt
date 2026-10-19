/**
 * PyramidHieroglyphSlidingStoneDoorMazeSector.js
 * Chantier 8 (v151) : Portes de pierre coulissantes à guillotine & labyrinthe de la pyramide (AVP 2004).
 * Système mécanique de reconfiguration cyclique de la pyramide de Bouvetøya :
 * - Abaissement brutal de lourdes dalles monolithiques isolant les couloirs et séparant les groupes.
 * - Toute entité surprise exactement sous le seuil au moment de la fermeture subit un écrasement fatal
 *   à moins d'exécuter une glissade d'urgence avant la fermeture complète.
 */

export class PyramidHieroglyphSlidingStoneDoorMazeSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_hieroglyph_guillotine_maze';
    this.doors = (options.doors ?? [
      { id: 'door_sacrificial_north', x: 0, z: 10, openRatio: 1.0, sealed: false },
      { id: 'door_crypt_west', x: -12, z: 0, openRatio: 1.0, sealed: false }
    ]).map((d) => ({ ...d }));

    this.state = {
      reconfigurationCycleCount: 0,
      totalCrushedUnderDoors: 0,
      isolatedEntitiesCount: 0
    };
  }

  triggerMazeReconfigurationSlam(doorId, entitiesNearDoor = [], audioSynthesizer = null) {
    const door = this.doors.find((d) => d.id === doorId);
    if (!door) {
      return { slammed: false, reason: 'door_not_found' };
    }

    this.state.reconfigurationCycleCount += 1;
    door.openRatio = 0.0;
    door.sealed = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playPyramidMazeReconfigurationRumble === 'function') {
        audioSynthesizer.playPyramidMazeReconfigurationRumble(1.0);
      }
      if (typeof audioSynthesizer.playPyramidStoneGuillotineDoorSlam === 'function') {
        audioSynthesizer.playPyramidStoneGuillotineDoorSlam(1.15);
      }
    }

    const crushedIds = [];
    const escapedBySlideIds = [];

    for (const entity of entitiesNearDoor) {
      const dist = Math.hypot((entity.x ?? 0) - door.x, (entity.z ?? 0) - door.z);
      if (dist <= 1.5) {
        if (entity.executingEmergencySlide) {
          escapedBySlideIds.push(entity.id ?? 'entity');
        } else {
          entity.health = 0;
          entity.crushedByStoneDoor = true;
          crushedIds.push(entity.id ?? 'entity');
          this.state.totalCrushedUnderDoors += 1;
        }
      } else {
        entity.isolatedByMazeWall = true;
        this.state.isolatedEntitiesCount += 1;
      }
    }

    return {
      slammed: true,
      doorId: door.id,
      crushedIds,
      escapedBySlideIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      reconfigurationCycleCount: this.state.reconfigurationCycleCount,
      totalCrushedUnderDoors: this.state.totalCrushedUnderDoors,
      isolatedEntitiesCount: this.state.isolatedEntitiesCount
    };
  }
}
