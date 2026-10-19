/**
 * SkyscraperServiceElevatorCableSeverSector.js
 * Chantier 1 (v153) : Ascenseur de service du gratte-ciel de Los Angeles & découpe du câble porteur (Predator 2).
 * Cage d'ascenseur industrielle de l'immeuble de Los Angeles 1997 :
 * - Infiltration silencieuse par la trappe de maintenance du toit de la cabine.
 * - Sectionnement des câbles porteurs en acier aux Wristblades ou au Smart Disc, précipitant
 *   la cabine et ses occupants armés en chute libre jusqu'au sous-sol.
 */

export class SkyscraperServiceElevatorCableSeverSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_skyscraper_service_elevator_shaft';
    this.currentFloor = options.currentFloor ?? 18;
    this.freefallCrushDamage = options.freefallCrushDamage ?? 420;

    this.state = {
      ceilingHatchOpen: false,
      hunterOnCabRoof: false,
      cablesIntactCount: 2,
      cabCrashedAtBasement: false,
      totalOccupantsNeutralized: 0
    };
  }

  infiltrateCabRoofHatch() {
    this.state.ceilingHatchOpen = true;
    this.state.hunterOnCabRoof = true;
    return {
      infiltrated: true,
      ceilingHatchOpen: true,
      currentFloor: this.currentFloor
    };
  }

  severHoistCablesAndDropCab(occupantsInsideCab = [], audioSynthesizer = null) {
    if (this.state.cabCrashedAtBasement) {
      return { dropped: false, reason: 'cab_already_crashed' };
    }

    this.state.cablesIntactCount = 0;
    this.state.cabCrashedAtBasement = true;
    this.currentFloor = 0;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playElevatorHoistCableSeverSnap === 'function') {
        audioSynthesizer.playElevatorHoistCableSeverSnap(1.0);
      }
      if (typeof audioSynthesizer.playServiceElevatorCabFreefallCrash === 'function') {
        audioSynthesizer.playServiceElevatorCabFreefallCrash(1.2);
      }
    }

    const neutralizedOccupantIds = [];
    for (const occ of occupantsInsideCab) {
      occ.health = Math.max(0, Number(occ.health ?? 150) - this.freefallCrushDamage);
      occ.crushedInElevatorDrop = true;
      neutralizedOccupantIds.push(occ.id ?? 'occupant');
      this.state.totalOccupantsNeutralized += 1;
    }

    return {
      dropped: true,
      finalFloor: 0,
      neutralizedOccupantIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      currentFloor: this.currentFloor,
      cablesIntactCount: this.state.cablesIntactCount,
      cabCrashedAtBasement: this.state.cabCrashedAtBasement,
      totalOccupantsNeutralized: this.state.totalOccupantsNeutralized
    };
  }
}
