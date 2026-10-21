/**
 * Predator2SubwayStrobeMassacreSector.js
 * 
 * Chantier Level Design #2 - Rame de Métro sous Stroboscope & Scan de Gestation de Leona.
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - High-speed Los Angeles Metro train carriage hurtling through tunnel at 70 km/h.
 * - Electrical short-circuits inducing 4 Hz fluorescent strobe flicker: intermittent darkness, high-contrast silhouette jumps.
 * - Bio-mask physiological embryonic scanner:
 *   - The City Hunter grabs Detective Leona Cantrell by the throat.
 *   - Diagnostic scanner isolates a secondary rhythmic pulse inside her abdomen (140 bpm embryonic fetus heartbeat).
 *   - Yautja Honor Code: pregnant prey bearing unborn life is sacred and forbidden from being hunted. The City Hunter drops Leona unharmed.
 * - Jerry Lambert's last stand: firing 9mm service pistol and swinging a machete to buy time for commuters before being claimed as a spine trophy.
 */

export class Predator2SubwayStrobeMassacreSector {
  /**
   * @param {Object} options
   * @param {number} [options.trainSpeedKmh=70.0]
   * @param {number} [options.strobeFrequencyHz=4.0]
   */
  constructor(options = {}) {
    this.trainSpeedKmh = options.trainSpeedKmh ?? 70.0;
    this.strobeFrequencyHz = options.strobeFrequencyHz ?? 4.0;

    this.strobeLightActive = true;
    this.leonaScanned = false;
    this.jerryLambertLastStandActive = false;
  }

  /**
   * Simulates the 4 Hz strobe lighting and tunnel rhythmic click-clack environment.
   * @returns {Object} Subway atmospheric telemetry
   */
  getCarriageAtmosphericState() {
    return {
      trainSpeedKmh: this.trainSpeedKmh,
      strobeFrequencyHz: this.strobeFrequencyHz,
      strobeLightActive: this.strobeLightActive,
      intermittentDarknessMs: 125,
      commuterPanicRating: 'EXTREME',
      trackAcousticClickClackDb: 74,
      fluorescentFlickerBuzzDb: 48
    };
  }

  /**
   * Bio-mask scans target for physiological parameters, vital signs, and pregnancy status.
   * @param {string} targetName - 'LEONA_CANTRELL' | 'JERRY_LAMBERT'
   * @returns {Object} Physiological scan result
   */
  executeBioMaskPhysiologicalScan(targetName = 'LEONA_CANTRELL') {
    if (targetName === 'LEONA_CANTRELL') {
      this.leonaScanned = true;
      return {
        targetName,
        maternalHeartRateBpm: 125,
        embryonicHeartRateBpm: 140,
        gestationDetected: true,
        gestationAgeWeeks: 6,
        yautjaHonorCodeViolationIfKilled: true,
        mandatedAction: 'RELEASE_UNHARMED_PREGNANT_FEMALE',
        honorBonusPoints: 100,
        acousticBioScanBeepHz: 1850
      };
    } else {
      // JERRY_LAMBERT
      return {
        targetName,
        heartRateBpm: 165,
        gestationDetected: false,
        weaponsDrawn: ['9MM_SERVICE_PISTOL', 'STEEL_MACHETE'],
        yautjaHonorCodeViolationIfKilled: false,
        mandatedAction: 'ENGAGE_HONORABLE_ARMED_COMBATANT',
        honorBonusPoints: 150,
        acousticBioScanBeepHz: 1850
      };
    }
  }

  /**
   * Resolves Jerry Lambert's heroic last stand in the subway car.
   * @param {number} roundsFired - Number of 9mm rounds emptied
   * @returns {Object} Last stand outcome
   */
  resolveJerryLambertLastStand(roundsFired = 15) {
    this.jerryLambertLastStandActive = true;

    return {
      success: true,
      roundsFired,
      macheteClashesCount: 3,
      commutersEvacuationTimeSec: 18.0,
      jerryClaimedAsTrophy: true,
      trophyType: 'SPINE_AND_SKULL_TROPHY',
      gunfireMuzzleFlashesCount: roundsFired,
      gunfireAcousticDb: 124
    };
  }
}
