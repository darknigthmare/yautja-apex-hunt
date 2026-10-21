/**
 * ValVerdeFallenLogRavineBridgeSector.js
 * 
 * Predator (1987) - Val Verde Fallen Giant Mossy Log Bridge Over 15m Ravine.
 * Simulates the tense perimeter defense and choke-point bridge:
 * - A colossal moss-covered fallen hardwood tree trunk spanning a 15.0m deep rocky chasm
 * - Wet moss footing friction (mu = 0.38) requiring controlled balance or slow traversal
 * - Perimeter defensive tripwires rigged with M26 frag grenades and M18A1 Claymore mines
 * - Suspended canopy rope net trap designed to hoist the Jungle Hunter into the air.
 */

export class ValVerdeFallenLogRavineBridgeSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='val-verde-log-bridge-01']
   * @param {number} [options.ravineDepthM=15.0]
   * @param {number} [options.logBridgeSpanM=18.5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'val-verde-log-bridge-01';
    this.ravineDepthM = options.ravineDepthM || 15.0;
    this.logBridgeSpanM = options.logBridgeSpanM || 18.5;

    this.mossFrictionMu = 0.38;
    this.claymoreTripwireArmed = true;
    this.canopyNetTrapArmed = true;
    this.chasmWindVelocityMps = 6.2;
  }

  /**
   * Traverses the 18.5m long mossy log bridge over the 15m ravine.
   * Moving too fast (speed > 3.5 m/s) tests balance against low friction mu = 0.38.
   * @param {number} speedMps
   * @returns {Object} Log bridge crossing telemetry
   */
  crossMossyLogBridge(speedMps = 3.2) {
    const slipRiskPct = speedMps > 3.5 ? Math.min(85.0, (speedMps - 3.5) * 32.0) : 4.0;
    const balanceLost = slipRiskPct > 50.0;
    const traversalDurationSec = Number((this.logBridgeSpanM / speedMps).toFixed(2));

    return {
      success: !balanceLost,
      speedMps,
      logBridgeSpanM: this.logBridgeSpanM,
      ravineDepthM: this.ravineDepthM,
      mossFrictionMu: this.mossFrictionMu,
      slipRiskPct: Number(slipRiskPct.toFixed(1)),
      balanceLost,
      traversalDurationSec,
      ravineFallHazard: balanceLost
    };
  }

  /**
   * Triggers or disarms the M18A1 Claymore anti-personnel mine tripwire rigged to the bridge approach.
   * Delivers 700 steel ball bearings in a 60° fan with 380 concussion damage.
   * @param {boolean} tripwireCutProperly
   * @returns {Object} Claymore tripwire telemetry
   */
  resolveClaymoreTripwireHazard(tripwireCutProperly = false) {
    if (!this.claymoreTripwireArmed) {
      return { triggered: false, reason: 'MINE_ALREADY_DETONATED_OR_DISARMED' };
    }

    if (tripwireCutProperly) {
      this.claymoreTripwireArmed = false;
      return {
        triggered: false,
        disarmed: true,
        action: 'CAREFUL_TRIPWIRE_CUT',
        salvagedC4Blocks: 1
      };
    }

    // Detonation
    this.claymoreTripwireArmed = false;
    const blastDamage = 380;
    const steelBallBearingsCount = 700;
    const lethalFanAngleDeg = 60.0;
    const blastRadiusM = 16.0;

    return {
      triggered: true,
      blastDamage,
      steelBallBearingsCount,
      lethalFanAngleDeg,
      blastRadiusM,
      acousticDetonationDb: 122,
      logBridgeScorched: true
    };
  }

  /**
   * Triggers the suspended canopy rope net trap designed by Dutch's team.
   * Hoists the hunter or quarry 6.5m above ground into a tightening mesh.
   * @returns {Object} Canopy net trap telemetry
   */
  triggerSuspendedNetTrap() {
    if (!this.canopyNetTrapArmed) {
      return { sprung: false, reason: 'NET_ALREADY_SPRUNG' };
    }

    this.canopyNetTrapArmed = false;
    const hoistHeightM = 6.5;
    const escapePryTimeSec = 2.4; // Time to slash ropes with wristblades

    return {
      sprung: true,
      hoistHeightM,
      escapePryTimeSec,
      targetEnsnared: true,
      netTighteningTensionN: 2200.0,
      requiresBladeSlashToFree: true
    };
  }
}
