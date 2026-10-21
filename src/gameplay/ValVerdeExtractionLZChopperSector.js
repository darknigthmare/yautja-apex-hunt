/**
 * ValVerdeExtractionLZChopperSector.js
 * 
 * Chantier Level Design #7 - L'Héliport d'Évacuation & la Zone d'Atterrissage du Général Phillips.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Following the atomic gauntlet blast, Dutch sprints through scorched jungle to the designated extraction clearing.
 * - Massive nuclear mushroom cloud visible on the horizon with falling ash rain.
 * - UH-1 Iroquois "Huey" helicopter piloted under General Phillips' search and rescue directive.
 * - Helicopter rotor downdraft (24 m/s wind wash) kicking up charred foliage and cordite smoke.
 * - Deployment of red M18 signal smoke grenade to mark the extraction perimeter.
 * - Boarding sequence, medical triage, and dramatic takeoff above the smoldering Val Verde crater.
 */

export class ValVerdeExtractionLZChopperSector {
  /**
   * @param {Object} options
   * @param {number} [options.clearingRadiusM=30.0]
   * @param {number} [options.rotorDowndraftMps=24.0]
   */
  constructor(options = {}) {
    this.clearingRadiusM = options.clearingRadiusM ?? 30.0;
    this.rotorDowndraftMps = options.rotorDowndraftMps ?? 24.0;

    this.signalSmokePopped = false;
    this.chopperLanded = false;
    this.dutchBoarded = false;
    this.ashFalloutActive = true;
  }

  /**
   * Deploys red M18 smoke grenade to signal the circling search helicopter.
   * @param {string} [smokeColor='RED']
   * @returns {Object} Signal smoke telemetry
   */
  deployExtractionSignalSmoke(smokeColor = 'RED') {
    this.signalSmokePopped = true;

    return {
      success: true,
      smokeColor,
      signalVisibilityRangeKm: 8.5,
      chopperInboundTimeSec: 12.0,
      lzCoordinatesConfirmed: true
    };
  }

  /**
   * Simulates the descent of the Huey helicopter into the jungle clearing.
   * @param {number} hoverAltitudeM
   * @returns {Object} Helicopter landing dynamics
   */
  descendRescueChopper(hoverAltitudeM = 0.0) {
    this.chopperLanded = hoverAltitudeM <= 0.5;

    return {
      success: true,
      chopperModel: 'BELL_UH1_HUEY',
      hoverAltitudeM,
      chopperLanded: this.chopperLanded,
      rotorAcousticThumpDb: 108,
      rotorDowndraftMps: this.rotorDowndraftMps,
      ashFalloutDispersalRadiusM: 45.0,
      pilotCallsign: 'AIR_CAV_RESCUE_ONE',
      generalPhillipsOnboard: true
    };
  }

  /**
   * Dutch boards the helicopter and the rescue transport lifts off.
   * @returns {Object} Evacuation outcome
   */
  executeFinalEvacuation() {
    if (!this.chopperLanded) {
      return { success: false, message: 'CHOPPER_NOT_TOUCHED_DOWN' };
    }

    this.dutchBoarded = true;

    return {
      success: true,
      dutchBoarded: true,
      campaignCompleted: true,
      mushroomCloudVisibleInDistance: true,
      evacuationAltitudeM: 350.0,
      creditsMusicCue: 'ALAN_SILVESTRI_PREDATOR_THEME'
    };
  }
}
