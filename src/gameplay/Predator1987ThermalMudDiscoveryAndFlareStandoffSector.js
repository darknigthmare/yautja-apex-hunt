/**
 * Predator1987ThermalMudDiscoveryAndFlareStandoffSector (v223)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator (1987):
 * 1. Dutch realizing cold river clay silt drops body thermal emission below ambient jungle foliage.
 * 2. Jungle Hunter stepping into shallow waters, switching thermal spectrum from Red-Shift to Blue-Shift.
 * 3. Priming M43 magnesium flare and counterweighted bamboo deadfall tripwire.
 * 4. Lighting flare to dazzle Hunter's optical sensors and triggering deadfall drop.
 */
export class Predator1987ThermalMudDiscoveryAndFlareStandoffSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_THERMAL_MUD_DISCOVERY_AND_FLARE_STANDOFF';
    this.filmReference = 'Predator (1987) - River Clay Thermal Mask Discovery & Magnesium Flare Standoff';
    this.reset();
  }

  reset() {
    this.thermalMudCamoDiscovered = false;
    this.hunterShallowWaterScanEndured = false;
    this.magnesiumFlareTripwirePrimed = false;
    this.opticalDazzleDeadfallTriggered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  discoverColdRiverMudThermalMask({
    clayTempCelsius = 18.5,
    foliageTempCelsius = 19.3
  } = {}) {
    const clay = Number(clayTempCelsius) || 0;
    const foliage = Number(foliageTempCelsius) || 0;
    const delta = Math.abs(clay - foliage);
    this.thermalMudCamoDiscovered = delta <= 1.0 && clay <= 22;
    this.eventLog.push({
      step: 'THERMAL_MUD_CAMO_DISCOVERED',
      clayTempCelsius: clay,
      foliageTempCelsius: foliage,
      deltaCelsius: delta,
      thermalMudCamoDiscovered: this.thermalMudCamoDiscovered
    });
    return {
      thermalMudCamoDiscovered: this.thermalMudCamoDiscovered,
      deltaCelsius: delta
    };
  }

  endureHunterShallowWaterThermalScan({
    hunterDistanceMeters = 1.2,
    scanSpectrumShift = 'RED_SHIFT_TO_BLUE_SHIFT'
  } = {}) {
    if (!this.thermalMudCamoDiscovered) {
      throw new Error('Must discover thermal mud camo before enduring shallow water scan.');
    }
    const dist = Math.max(0, Number(hunterDistanceMeters) || 0);
    const validShift = scanSpectrumShift === 'RED_SHIFT_TO_BLUE_SHIFT';
    this.hunterShallowWaterScanEndured = dist <= 2.0 && validShift;
    this.eventLog.push({
      step: 'HUNTER_SHALLOW_WATER_SCAN_ENDURED',
      hunterDistanceMeters: dist,
      scanSpectrumShift,
      hunterShallowWaterScanEndured: this.hunterShallowWaterScanEndured
    });
    return {
      hunterShallowWaterScanEndured: this.hunterShallowWaterScanEndured
    };
  }

  primeMagnesiumFlareAndDeadfallTripwire({
    flareLuminosityCandela = 45000,
    deadfallTripwireTensionNewtons = 280
  } = {}) {
    if (!this.hunterShallowWaterScanEndured) {
      throw new Error('Must endure water scan before priming flare and tripwire.');
    }
    const candela = Math.max(0, Number(flareLuminosityCandela) || 0);
    const tension = Math.max(0, Number(deadfallTripwireTensionNewtons) || 0);
    this.magnesiumFlareTripwirePrimed = candela >= 30000 && tension >= 200;
    this.eventLog.push({
      step: 'MAGNESIUM_FLARE_TRIPWIRE_PRIMED',
      flareLuminosityCandela: candela,
      deadfallTripwireTensionNewtons: tension,
      magnesiumFlareTripwirePrimed: this.magnesiumFlareTripwirePrimed
    });
    return {
      magnesiumFlareTripwirePrimed: this.magnesiumFlareTripwirePrimed
    };
  }

  igniteFlareAndTriggerOpticalDeadfall({
    opticalSensorDazzleDurationSeconds = 4.2,
    deadfallImpactJoules = 6800
  } = {}) {
    if (!this.magnesiumFlareTripwirePrimed) {
      throw new Error('Must prime flare and tripwire before igniting flare and triggering deadfall.');
    }
    const duration = Math.max(0, Number(opticalSensorDazzleDurationSeconds) || 0);
    const joules = Math.max(0, Number(deadfallImpactJoules) || 0);
    this.opticalDazzleDeadfallTriggered = duration >= 3.0 && joules >= 5000;
    if (this.opticalDazzleDeadfallTriggered) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'OPTICAL_DAZZLE_DEADFALL_TRIGGERED',
      opticalSensorDazzleDurationSeconds: duration,
      deadfallImpactJoules: joules,
      opticalDazzleDeadfallTriggered: this.opticalDazzleDeadfallTriggered,
      honorAwarded: this.honorAwarded
    });
    return {
      opticalDazzleDeadfallTriggered: this.opticalDazzleDeadfallTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.thermalMudCamoDiscovered &&
      this.hunterShallowWaterScanEndured &&
      this.magnesiumFlareTripwirePrimed &&
      this.opticalDazzleDeadfallTriggered &&
      this.honorAwarded === 350
    );
  }
}
