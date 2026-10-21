/**
 * StargazerExosuitHangarBipedalMechSector.js
 * 
 * The Predator (2018) - Project Stargazer Military Staging Hangar & Bipedal Mech.
 * Simulates heavy mechanized warfare in the subterranean military hangar:
 * 3.5-ton bipedal security mechs with dual 20mm rotary vulcan cannons (3,500 rpm),
 * EMP pulse grenade guidance destabilization, and micro-fusion reactor core overload blasts.
 */

export class StargazerExosuitHangarBipedalMechSector {
  /**
   * @param {Object} options
   * @param {string} [options.hangarSectorId='stargazer-mech-hangar-01']
   * @param {number} [options.mechArmorHealth=2400.0]
   * @param {number} [options.rotaryVulcanRpm=3500.0]
   * @param {number} [options.mechMassKg=3500.0]
   */
  constructor(options = {}) {
    this.hangarSectorId = options.hangarSectorId || 'stargazer-mech-hangar-01';
    this.mechArmorHealth = options.mechArmorHealth || 2400.0;
    this.rotaryVulcanRpm = options.rotaryVulcanRpm || 3500.0;
    this.mechMassKg = options.mechMassKg || 3500.0;

    this.mechEmpStunned = false;
    this.reactorOverloaded = false;
    this.vulcanFiring = false;
  }

  /**
   * Fires a sustained burst from the mech's dual 20mm rotary vulcan cannons.
   * @param {number} burstDurationSec
   * @returns {Object} Vulcan barrage telemetry
   */
  fireRotaryVulcanBarrage(burstDurationSec = 1.2) {
    if (this.mechEmpStunned || this.reactorOverloaded) {
      return { fired: false, reason: 'MECH_DISABLED_OR_OVERLOADED' };
    }

    this.vulcanFiring = true;
    const roundsFired = Math.round((this.rotaryVulcanRpm / 60.0) * burstDurationSec); // ~70 rounds
    const barrageDamage = Math.round(roundsFired * 18);
    const audioRoarDecibels = 118;

    return {
      fired: true,
      burstDurationSec,
      roundsFired,
      barrageDamage,
      audioRoarDecibels,
      suppressiveSpreadMeters: 4.5
    };
  }

  /**
   * Throws an EMP pulse grenade to short-circuit the bipedal mech's fire control computer.
   * @param {number} empChargeMegaJoules
   * @returns {Object} EMP stun outcome
   */
  detonateEmpGrenadeOnMech(empChargeMegaJoules = 2.5) {
    const stunDurationSec = +(empChargeMegaJoules * 1.8).toFixed(1);
    this.mechEmpStunned = true;
    this.vulcanFiring = false;

    return {
      success: true,
      empChargeMegaJoules,
      mechEmpStunned: this.mechEmpStunned,
      stunDurationSec,
      targetingSensorsBlinded: true,
      hydraulicLocomotionFrozen: true
    };
  }

  /**
   * Overloads the micro-fusion reactor core of the mech to trigger a catastrophic hangar explosion.
   * @returns {Object} Core overload telemetry
   */
  triggerReactorCoreOverload() {
    this.reactorOverloaded = true;
    this.mechArmorHealth = 0;
    const blastRadiusM = 25.0;
    const catastrophicDamage = 850;
    const shockwaveOverpressureKpa = 320;

    return {
      reactorOverloaded: true,
      blastRadiusM,
      catastrophicDamage,
      shockwaveOverpressureKpa,
      hangarStructuralCollapseTriggered: true,
      lingeringEmpRadiusM: 35.0
    };
  }
}
