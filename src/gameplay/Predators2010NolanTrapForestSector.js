/**
 * Predators2010NolanTrapForestSector.js
 * 
 * Chantier Level Design #3 - Forêt de Pièges Mortels & Pendule de Pieux Aiguisés.
 * Canonical 1:1 Predators (2010) fidelity:
 * - Sector of dense jungle fortified with lethal guerrilla traps set by deceased US Special Forces soldier.
 * - Camouflaged tripwires strung between ironwood trunks at ankle height (15 cm).
 * - Pendulum Spike Trap:
 *   - Heavy 150 kg ironwood log spiked with fire-hardened hardwood stakes swung by counterweight rope.
 *   - Lethal kinetic sweeping arc (velocity 14 m/s) impaling whatever triggers the cord.
 * - Concealed punji stick drop pits: 2.2m deep trench concealed under woven vine mats and fern litter.
 * - Disarming traps grants salvaged paracord and steel spikes for craftable defenses.
 */

export class Predators2010NolanTrapForestSector {
  /**
   * @param {Object} options
   * @param {number} [options.trapsCount=4]
   */
  constructor(options = {}) {
    this.trapsCount = options.trapsCount ?? 4;
    this.tripwireSpotted = false;
    this.spikePendulumDisarmed = false;
    this.punjiPitNavigated = false;
    this.salvagedParacordMeters = 0;
  }

  /**
   * Scans the forest floor to detect camouflaged tripwires.
   * @param {number} perceptionSkillPct
   * @returns {Object} Tripwire detection telemetry
   */
  detectCamouflagedTripwire(perceptionSkillPct = 85.0) {
    this.tripwireSpotted = perceptionSkillPct >= 60.0;

    return {
      success: true,
      tripwireSpotted: this.tripwireSpotted,
      tripwireHeightCm: 15.0,
      cordMaterial: 'MILITARY_OD_GREEN_PARACORD',
      connectedMechanism: 'SWINGING_SPIKE_PENDULUM_LOG',
      detectionConfidencePct: perceptionSkillPct,
      leafFoliageCamouflageRating: 'VERY_HIGH'
    };
  }

  /**
   * Carefully disarms the counterweighted spike pendulum log.
   * @returns {Object} Trap disarm telemetry
   */
  disarmSpikePendulumTrap() {
    if (!this.tripwireSpotted) {
      return { success: false, reason: 'TRIPWIRE_NOT_SPOTTED' };
    }

    this.spikePendulumDisarmed = true;
    this.salvagedParacordMeters += 12;

    return {
      success: true,
      spikePendulumDisarmed: true,
      logMassKg: 150.0,
      spikesDefusedCount: 16,
      salvagedParacordMeters: this.salvagedParacordMeters,
      counterweightRopeSecured: true,
      tripwireTwangAcousticDb: 48,
      hazardNeutralized: true
    };
  }

  /**
   * Navigates around or leaps across a concealed punji stick drop pit.
   * @param {number} jumpDistanceM - Jump distance in meters
   * @returns {Object} Pit navigation outcome
   */
  navigateConcealedPunjiPit(jumpDistanceM = 2.5) {
    this.punjiPitNavigated = jumpDistanceM >= 2.0;

    return {
      success: this.punjiPitNavigated,
      pitDepthM: 2.2,
      punjiSpikesMaterial: 'FIRE_HARDENED_POISON_BAMBOO',
      pitWidthM: 1.8,
      jumpDistanceM,
      pitEvadedSafely: this.punjiPitNavigated,
      branchCreakAcousticDb: 52
    };
  }
}
