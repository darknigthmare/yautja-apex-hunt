/**
 * Predator1987ThermalWaterDispersionAndMudReflectionSector (v220)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator (1987):
 * 1. Crawling out of the river onto muddy riverbank during sudden tropical rainfall.
 * 2. Jungle Hunter optical camo short-circuiting as rainwater cascades over active suit mesh.
 * 3. Thermal refraction analysis showing Dutch's clay-coated skin matching wet jungle ambient temperature (0 delta).
 * 4. Jungle Hunter standing inches away in breathless standoff, scanning in vain before stepping away into darkness.
 */
export class Predator1987ThermalWaterDispersionAndMudReflectionSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_THERMAL_WATER_DISPERSION_AND_MUD_REFLECTION';
    this.filmReference = 'Predator (1987) - Riverbank Rainfall, Optical Camo Dielectric Spark & Thermal Mask Standoff';
    this.reset();
  }

  reset() {
    this.riverbankMudCrawlCompleted = false;
    this.opticCamoWaterSparkTriggered = false;
    this.thermalDeltaNeutralized = false;
    this.breathlessStandoffEndured = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  crawlOntoRiverbankInRainstorm({
    crawlDistanceMeters = 8.5,
    rainfallRateMmPerHour = 48
  } = {}) {
    const dist = Math.max(0, Number(crawlDistanceMeters) || 0);
    const rain = Math.max(0, Number(rainfallRateMmPerHour) || 0);
    this.riverbankMudCrawlCompleted = dist >= 5 && rain >= 30;
    this.eventLog.push({
      step: 'RIVERBANK_MUD_CRAWL_COMPLETED',
      crawlDistanceMeters: dist,
      rainfallRateMmPerHour: rain,
      riverbankMudCrawlCompleted: this.riverbankMudCrawlCompleted
    });
    return {
      riverbankMudCrawlCompleted: this.riverbankMudCrawlCompleted
    };
  }

  triggerOpticCamoWaterSparkInterference({
    waterConductivityUsm = 280,
    camoSparkFrequencyHz = 14.5
  } = {}) {
    if (!this.riverbankMudCrawlCompleted) {
      throw new Error('Must complete riverbank crawl before triggering camo water spark interference.');
    }
    const cond = Math.max(0, Number(waterConductivityUsm) || 0);
    const freq = Math.max(0, Number(camoSparkFrequencyHz) || 0);
    this.opticCamoWaterSparkTriggered = cond >= 200 && freq >= 10;
    this.eventLog.push({
      step: 'OPTIC_CAMO_WATER_SPARK_TRIGGERED',
      waterConductivityUsm: cond,
      camoSparkFrequencyHz: freq,
      opticCamoWaterSparkTriggered: this.opticCamoWaterSparkTriggered
    });
    return {
      opticCamoWaterSparkTriggered: this.opticCamoWaterSparkTriggered
    };
  }

  verifyThermalDeltaNeutralization({
    skinTempCelsius = 21.0,
    foliageTempCelsius = 21.0
  } = {}) {
    if (!this.opticCamoWaterSparkTriggered) {
      throw new Error('Must observe camo spark interference before verifying thermal delta neutralization.');
    }
    const skin = Number(skinTempCelsius) || 0;
    const foliage = Number(foliageTempCelsius) || 0;
    const delta = Math.abs(skin - foliage);
    this.thermalDeltaNeutralized = delta <= 0.5;
    this.eventLog.push({
      step: 'THERMAL_DELTA_NEUTRALIZED',
      skinTempCelsius: skin,
      foliageTempCelsius: foliage,
      deltaCelsius: delta,
      thermalDeltaNeutralized: this.thermalDeltaNeutralized
    });
    return {
      thermalDeltaNeutralized: this.thermalDeltaNeutralized,
      deltaCelsius: delta
    };
  }

  endureBreathlessHunterStandoff({
    hunterProximityMeters = 0.45,
    holdBreathDurationSeconds = 24
  } = {}) {
    if (!this.thermalDeltaNeutralized) {
      throw new Error('Must neutralize thermal delta before enduring breathless hunter standoff.');
    }
    const prox = Math.max(0, Number(hunterProximityMeters) || 0);
    const duration = Math.max(0, Number(holdBreathDurationSeconds) || 0);
    this.breathlessStandoffEndured = prox <= 1.0 && duration >= 15;
    if (this.breathlessStandoffEndured) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'BREATHLESS_STANDOFF_ENDURED',
      hunterProximityMeters: prox,
      holdBreathDurationSeconds: duration,
      breathlessStandoffEndured: this.breathlessStandoffEndured,
      honorAwarded: this.honorAwarded
    });
    return {
      breathlessStandoffEndured: this.breathlessStandoffEndured,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.riverbankMudCrawlCompleted &&
      this.opticCamoWaterSparkTriggered &&
      this.thermalDeltaNeutralized &&
      this.breathlessStandoffEndured &&
      this.honorAwarded === 350
    );
  }
}
