import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 1 (v155) — Puits de Forage de la Station Baleinière de Bouvetøya & Treuil à Chaîne Glacée (*Alien vs. Predator 2004*)
 * Reproduit le combat final en surface dans le blizzard antarctique de Bouvetøya :
 * - La Reine Xénomorphe surgit du tunnel de forage thermique et détruit les baraquements de la station baleinière.
 * - Scar et Lex Woods enchaînent la Reine par le cou aux chaînes gelées du château d'eau métallique (*Water Tower*).
 * - Basculement du château d'eau au bord de la falaise de glace, entraînant la Reine au fond de l'océan Austral glacé.
 */
export class BouvetoyaWhalingStationWaterTowerQueenChainDropSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_whaling_station_water_tower_cliff';
    this.queenChainedToTower = false;
    this.towerSupportPinsIntact = options.towerSupportPinsIntact ?? 2;
    this.queenDraggedIntoAbyss = false;
    this.abyssDepthMeters = 950;
  }

  hookQueenCollarChainToWaterTower(queenState = {}) {
    this.queenChainedToTower = true;
    queenState.chainedToWaterTower = true;

    audioSynth.playBouvetoyaFrozenChainWinchratchet?.();

    return {
      chained: true,
      queenChainedToTower: this.queenChainedToTower,
      towerSupportPinsIntact: this.towerSupportPinsIntact
    };
  }

  releaseWaterTowerOverIceCliff(queenState = {}) {
    if (!this.queenChainedToTower) {
      return { plunged: false, reason: 'queen_not_chained_to_tower' };
    }

    this.towerSupportPinsIntact = 0;
    this.queenDraggedIntoAbyss = true;
    queenState.draggedIntoAntarcticAbyss = true;
    queenState.depthMeters = this.abyssDepthMeters;
    queenState.neutralized = true;

    audioSynth.playWaterTowerCliffCollapsePlunge?.();

    return {
      plunged: true,
      queenDraggedIntoAbyss: true,
      finalOceanDepthMeters: this.abyssDepthMeters
    };
  }
}
