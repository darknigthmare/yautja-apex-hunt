/**
 * Prey1719VoyageurTreeBaitSector.js
 *
 * Chantier de Level Design 2 (v192) - Prey (2022) Voyageur Decoy Tree Bait & Hemp Rope Sawing
 * 1:1 Canonical Level Design:
 * - Dead charred pine tree trunk in the center of the burnt clearing where Naru and Taabe are bound with thick hemp ropes.
 * - Cruel ambush trap set by the French trappers using human bait under burning pine pitch torches.
 * - Rhythmic rope sawing against a sharp jagged flint edge to sever the bindings (rope integrity 100% -> 0%).
 * - Nocturnal ambush by the Feral Predator slaughtering the trapper firing lines from the dark branches above.
 */

export class Prey1719VoyageurTreeBaitSector {
  /**
   * @param {Object} options
   * @param {number} [options.hempRopeThicknessMm=22.0] Épaisseur de la corde de chanvre (mm)
   * @param {number} [options.torchesCount=6] Nombre de torches de poix allumées
   */
  constructor(options = {}) {
    this.hempRopeThicknessMm = options.hempRopeThicknessMm ?? 22.0;
    this.torchesCount = options.torchesCount ?? 6;

    // État runtime
    this.boundToDeadTree = true;
    this.ropeIntegrityPct = 100.0;
    this.bindingsSevered = false;
    this.predatorNocturnalAssaultActive = false;
    this.trappersAnnihilated = false;
  }

  /**
   * Scier la corde de chanvre contre l'arête d'un éclat de silex tranchant
   * @param {number} sawingEffortCycles Nombre de cycles de sciage
   */
  sawHempRopeBindings(sawingEffortCycles = 4) {
    if (this.bindingsSevered) {
      return { status: 'ALREADY_FREED', severed: true };
    }

    const wear = sawingEffortCycles * 25.0;
    this.ropeIntegrityPct = Math.max(0.0, this.ropeIntegrityPct - wear);

    if (this.ropeIntegrityPct <= 0.0) {
      this.bindingsSevered = true;
      this.boundToDeadTree = false;
    }

    return {
      status: this.bindingsSevered ? 'HEMP_BINDINGS_SEVERED_FREE_TO_MOVE' : 'SAWING_HEMP_ROPE',
      severed: this.bindingsSevered,
      remainingRopeIntegrityPct: this.ropeIntegrityPct,
      stealthMaintained: true
    };
  }

  /**
   * Déclencher l'assaut nocturne du Feral Predator sur les trappeurs
   */
  triggerPredatorNocturnalAmbush() {
    this.predatorNocturnalAssaultActive = true;
    this.trappersAnnihilated = true;

    return {
      status: 'FERAL_PREDATOR_CANOPY_DROP_AMBUSH',
      trappersEngaged: 8,
      trapperCasualties: 8,
      chaosOpportunitySec: 6.0,
      torchesExtinguishedByBlood: 3,
      escapeWindowOpened: true
    };
  }
}
