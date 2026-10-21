/**
 * SubterraneanPyramidShiftingChamberSector.js
 * 
 * Alien vs. Predator (2004) - Subterranean Bouvetøya Shifting Pyramid Labyrinth.
 * Simulates the colossal mechanical clockwork pyramid 2,000 ft beneath the Antarctic ice sheet:
 * - 10-minute cyclic reconfiguration countdown powered by subterranean counterweights
 * - Heavy monolithic granite sliding walls (20 tonnes each, 4500 N closing force, 350 crush damage)
 * - Rotating sacrificial altar slabs tilting into geothermal abyss fissures
 * - Shifting corridors converting open hallways into trap choke-points or vertical shaft escape routes.
 */

export class SubterraneanPyramidShiftingChamberSector {
  /**
   * @param {Object} options
   * @param {string} [options.pyramidId='bouvetoya-shifting-pyramid-01']
   * @param {number} [options.reconfigurationIntervalSec=600.0] // 10 minutes
   * @param {number} [options.graniteSlabMassTonnes=20.0]
   */
  constructor(options = {}) {
    this.pyramidId = options.pyramidId || 'bouvetoya-shifting-pyramid-01';
    this.reconfigurationIntervalSec = options.reconfigurationIntervalSec || 600.0;
    this.graniteSlabMassTonnes = options.graniteSlabMassTonnes || 20.0;

    this.reconfigurationTimerSec = this.reconfigurationIntervalSec;
    this.currentConfigurationPhase = 1; // 1 to 4 mechanical chamber states
    this.activeMonolithWalls = [
      { id: 'monolith-gate-alpha', isOpen: true, corridorId: 'corridor-channelling-hall', crushRisk: false },
      { id: 'monolith-gate-beta', isOpen: false, corridorId: 'corridor-sacrificial-chamber', crushRisk: true },
      { id: 'monolith-gate-gamma', isOpen: true, corridorId: 'corridor-queen-shaft', crushRisk: false }
    ];

    this.sacrificialAltarTilted = false;
    this.geothermalChasmOpen = false;
  }

  /**
   * Updates the pyramid's 10-minute reconfiguration clockwork mechanism.
   * @param {number} deltaSec
   * @returns {Object} Clockwork timer telemetry
   */
  updatePyramidClockwork(deltaSec = 1.0) {
    this.reconfigurationTimerSec -= deltaSec;
    let shiftTriggered = false;

    if (this.reconfigurationTimerSec <= 0) {
      shiftTriggered = true;
      this.reconfigurationTimerSec = this.reconfigurationIntervalSec;
      this.currentConfigurationPhase = (this.currentConfigurationPhase % 4) + 1;
      this.executeChamberReconfiguration();
    }

    const gearGrindSeismicHz = 32 + (4 - (this.reconfigurationTimerSec % 4)) * 6;
    const warningGearsRumbleActive = this.reconfigurationTimerSec <= 15.0;

    return {
      reconfigurationTimerSec: Number(this.reconfigurationTimerSec.toFixed(1)),
      currentConfigurationPhase: this.currentConfigurationPhase,
      shiftTriggered,
      warningGearsRumbleActive,
      gearGrindSeismicHz,
      minutesUntilShift: Number((this.reconfigurationTimerSec / 60.0).toFixed(2))
    };
  }

  /**
   * Executes the stone wall shift, toggling corridor gates and crushing anything in doorway thresholds.
   * @returns {Object} Reconfiguration execution telemetry
   */
  executeChamberReconfiguration() {
    this.activeMonolithWalls.forEach((wall, idx) => {
      wall.isOpen = (idx + this.currentConfigurationPhase) % 2 === 0;
      wall.crushRisk = !wall.isOpen;
    });

    this.sacrificialAltarTilted = this.currentConfigurationPhase === 3;
    this.geothermalChasmOpen = this.currentConfigurationPhase >= 2;

    const seismicDisplacementJoules = Math.round(this.graniteSlabMassTonnes * 1000 * 9.81 * 3.5);
    const stoneGrindDecibels = 94;

    return {
      phase: this.currentConfigurationPhase,
      walls: this.activeMonolithWalls,
      sacrificialAltarTilted: this.sacrificialAltarTilted,
      geothermalChasmOpen: this.geothermalChasmOpen,
      seismicDisplacementJoules,
      stoneGrindDecibels
    };
  }

  /**
   * Resolves entity collision with a closing monolith granite slab door.
   * Trapped entities suffer massive 350 crush damage and severe bone fractures.
   * @param {string} monolithId
   * @param {boolean} entityInThreshold
   * @returns {Object} Crush resolution telemetry
   */
  resolveMonolithCrushHazard(monolithId = 'monolith-gate-alpha', entityInThreshold = true) {
    const wall = this.activeMonolithWalls.find(w => w.id === monolithId);
    if (!wall) {
      return { success: false, reason: 'MONOLITH_GATE_NOT_FOUND' };
    }

    if (!wall.isOpen && entityInThreshold) {
      const crushForceN = 4500.0;
      const crushDamage = 350;
      const entrapmentFatal = crushDamage >= 300;

      return {
        crushed: true,
        monolithId: wall.id,
        crushForceN,
        crushDamage,
        entrapmentFatal,
        corridorSealed: true
      };
    }

    return { crushed: false, monolithId: wall.id, isOpen: wall.isOpen };
  }
}
