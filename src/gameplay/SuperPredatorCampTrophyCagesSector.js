/**
 * SuperPredatorCampTrophyCagesSector.js
 * 
 * Predators (2010) - Super Predator Game Preserve Hunting Camp.
 * Simulates the ritualistic encampment of the Super Predators (Berserker, Tracker, Falconer) on the Game Preserve Planet:
 * suspended bone and spinal cages hung 6m above ground, guillotine tripwire booby traps with 3200N spring tension,
 * rotating razor stake traps, bio-luminescent alien undergrowth, and proximity-fused plasma claymore mines.
 */

export class SuperPredatorCampTrophyCagesSector {
  /**
   * @param {Object} options
   * @param {string} [options.campId='super-pred-camp-01']
   * @param {number} [options.suspendedCageCount=4]
   * @param {number} [options.foliageFluorescenceIntensity=0.85]
   */
  constructor(options = {}) {
    this.campId = options.campId || 'super-pred-camp-01';
    this.suspendedCageCount = options.suspendedCageCount || 4;
    this.foliageFluorescenceIntensity = options.foliageFluorescenceIntensity || 0.85;

    this.cages = [
      { id: 'cage-bone-01', heightM: 5.5, occupant: 'HUMAN_SURVIVOR', intact: true, latchLocked: true },
      { id: 'cage-bone-02', heightM: 6.2, occupant: 'RIVER_GHOST_SCOUT', intact: true, latchLocked: true },
      { id: 'cage-bone-03', heightM: 4.8, occupant: 'EMPTY_TROPHY_BONES', intact: true, latchLocked: false },
      { id: 'cage-bone-04', heightM: 7.0, occupant: 'CRUCIFIED_CLASSIC_YAUTJA', intact: true, latchLocked: true }
    ];

    this.guillotineSpringTensionN = 3200.0;
    this.plasmaClaymoreArmed = true;
    this.claymoreDetonated = false;
  }

  /**
   * Drops or releases a suspended bone cage, either to free a captive or crush enemies beneath.
   * @param {string} cageId
   * @param {boolean} cutSupportCable
   * @returns {Object} Cage drop telemetry
   */
  triggerCageDropOrRelease(cageId = 'cage-bone-01', cutSupportCable = true) {
    const cage = this.cages.find(c => c.id === cageId);
    if (!cage) {
      return { success: false, reason: 'CAGE_NOT_FOUND' };
    }

    if (cutSupportCable) {
      cage.intact = false;
      const impactVelocityMps = Math.sqrt(2 * 9.81 * cage.heightM);
      const groundCrushDamage = Math.round(impactVelocityMps * 18.5);
      const acousticImpactDb = Math.round(82 + cage.heightM * 2.2);

      return {
        success: true,
        action: 'CAGE_CABLE_SEVERED',
        cageId: cage.id,
        occupant: cage.occupant,
        impactVelocityMps: Number(impactVelocityMps.toFixed(2)),
        groundCrushDamage,
        acousticImpactDb,
        crushedAreaRadiusM: 2.8
      };
    } else {
      cage.latchLocked = false;
      return {
        success: true,
        action: 'CAGE_LATCH_OPENED',
        cageId: cage.id,
        occupant: cage.occupant,
        captiveFreed: true
      };
    }
  }

  /**
   * Resolves a spring-loaded guillotine wire trap triggered in the undergrowth.
   * @param {number} tripwireTensionThresholdN
   * @returns {Object} Guillotine trap resolution
   */
  triggerGuillotineRazorTrap(tripwireTensionThresholdN = 45.0) {
    const effectiveSeveranceForceN = this.guillotineSpringTensionN;
    const bladeSpeedMps = 24.5;
    const decapitationDamage = 185;
    const bladeMaterial = 'FORGED_TITANIUM_STEEL';

    return {
      triggered: true,
      bladeSpeedMps,
      effectiveSeveranceForceN,
      decapitationDamage,
      bladeMaterial,
      bleedingDurationSec: 6.0,
      severanceLimbRiskPercent: 85.0
    };
  }

  /**
   * Arms or triggers a Berserker proximity plasma claymore hidden among trophy skulls.
   * @param {number} targetDistanceM
   * @returns {Object} Claymore detonation telemetry
   */
  resolveBerserkerPlasmaClaymore(targetDistanceM = 3.5) {
    if (!this.plasmaClaymoreArmed || this.claymoreDetonated) {
      return { detonated: false, reason: 'CLAYMORE_INACTIVE_OR_ALREADY_DETONATED' };
    }

    if (targetDistanceM <= 6.0) {
      this.claymoreDetonated = true;
      this.plasmaClaymoreArmed = false;
      const plasmaConcussionDamage = Math.max(0, Math.round(340 * (1 - targetDistanceM / 6.0)));
      const blastRadiusM = 7.5;
      const thermalBurnRadiusM = 4.2;

      return {
        detonated: true,
        plasmaConcussionDamage,
        blastRadiusM,
        thermalBurnRadiusM,
        thermalDegreesC: 2800,
        foliageIgnited: true
      };
    }

    return { detonated: false, distanceM: targetDistanceM, armed: true };
  }
}
