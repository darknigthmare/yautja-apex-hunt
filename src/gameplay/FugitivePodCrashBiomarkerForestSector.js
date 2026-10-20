/**
 * FugitivePodCrashBiomarkerForestSector.js
 * 
 * The Predator (2018) - Mexican forest crash site of the Fugitive Predator escape pod.
 * Simulates bio-beacon telemetry, thruster thermal bloom dissipation, armored chitin pod analysis,
 * and hybridized Predator Hound pack encirclement tactics.
 */

export class FugitivePodCrashBiomarkerForestSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='fugitive-crash-site-01']
   * @param {number} [options.craterRadiusM=16.5]
   * @param {number} [options.podHullIntegrity=0.42]
   * @param {number} [options.biomarkerFrequencyKhz=142.8]
   * @param {number} [options.houndsAttractedCount=3]
   * @param {number} [options.thrusterThermalKelvin=1280]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'fugitive-crash-site-01';
    this.craterRadiusM = options.craterRadiusM !== undefined ? options.craterRadiusM : 16.5;
    this.podHullIntegrity = options.podHullIntegrity !== undefined ? options.podHullIntegrity : 0.42;
    this.biomarkerFrequencyKhz = options.biomarkerFrequencyKhz !== undefined ? options.biomarkerFrequencyKhz : 142.8;
    this.houndsAttractedCount = options.houndsAttractedCount !== undefined ? options.houndsAttractedCount : 3;
    this.thrusterThermalKelvin = options.thrusterThermalKelvin !== undefined ? options.thrusterThermalKelvin : 1280;

    this.beaconActive = true;
    this.ambientKelvin = 295.15; // ~22 C
    this.cacheLooted = false;
  }

  /**
   * Emits a bio-tracking pulse and returns pack aggro updates.
   * @param {number} pulseIntervalMs
   * @returns {Object} Pulse telemetry
   */
  emitBiomarkerSignal(pulseIntervalMs = 1000) {
    if (!this.beaconActive) {
      return {
        beaconActive: false,
        pulseFrequencyKhz: 0,
        houndAggroRadiusM: 0,
        signalStrengthDb: 0
      };
    }

    // Signal strength decreases if pulse interval is very long
    const signalStrengthDb = +(85 - Math.min(30, (pulseIntervalMs - 500) / 100)).toFixed(1);
    const houndAggroRadiusM = +(25.0 + (signalStrengthDb / 85) * 45.0).toFixed(1);

    return {
      beaconActive: true,
      pulseFrequencyKhz: this.biomarkerFrequencyKhz,
      signalStrengthDb,
      houndAggroRadiusM,
      dnaSignatureMatch: 'YAUTJA_HYBRID_PRIME_99.4%'
    };
  }

  /**
   * Cools thruster atmospheric re-entry thermal bloom over time.
   * @param {number} deltaSeconds
   * @param {string} [coolingAgent='NATURAL_AIR'] - 'NATURAL_AIR', 'CRYO_BURST', 'MUD_SLURRY'
   * @returns {Object} Updated thermal stats
   */
  coolThrusterResidue(deltaSeconds = 1.0, coolingAgent = 'NATURAL_AIR') {
    let coolingMultiplier = 1.0;
    if (coolingAgent === 'CRYO_BURST') coolingMultiplier = 14.5;
    else if (coolingAgent === 'MUD_SLURRY') coolingMultiplier = 5.2;

    const tempDelta = (this.thrusterThermalKelvin - this.ambientKelvin) * 0.045 * coolingMultiplier * deltaSeconds;
    this.thrusterThermalKelvin = Math.max(this.ambientKelvin, +(this.thrusterThermalKelvin - tempDelta).toFixed(1));

    const thermalMaskInterferenceLevel = +(Math.min(1.0, (this.thrusterThermalKelvin - 350) / 900)).toFixed(2);

    return {
      thrusterThermalKelvin: this.thrusterThermalKelvin,
      ambientKelvin: this.ambientKelvin,
      coolingAgent,
      thermalMaskInterferenceLevel,
      irGlowExtinguished: this.thrusterThermalKelvin < 400
    };
  }

  /**
   * Scans and breaches the pod's hybridized chitin alloy hull.
   * @param {string} scannerType - 'BIO_SCANNER', 'OPTICAL', 'ELECTROMAGNETIC'
   * @returns {Object} Hull analysis and cache availability
   */
  analyzePodChitinHull(scannerType = 'BIO_SCANNER') {
    const isBioScan = scannerType === 'BIO_SCANNER' || scannerType === 'ELECTROMAGNETIC';
    const armorHardnessMohs = 9.4;
    const cacheAccessible = !this.cacheLooted && this.podHullIntegrity < 0.65;

    return {
      podHullIntegrity: this.podHullIntegrity,
      alloyComposition: 'TITANIUM_CHITIN_EXOSKELETON_COMPOSITE',
      armorHardnessMohs,
      cacheAccessible,
      salvageAvailable: cacheAccessible ? ['FUGITIVE_GAUNTLET_BLADE', 'BIO_MASK_NEURAL_INTERFACE'] : [],
      scanConfidence: isBioScan ? 0.98 : 0.62
    };
  }

  /**
   * Calculates Predator Hound pack encircling flanking angles and pounce readiness.
   * @param {Array<{x: number, y: number}>} houndPositions
   * @param {{x: number, y: number}} playerPos
   * @returns {Object} Flanking coordinates and pack tactics
   */
  calculateHoundPackFlanking(houndPositions, playerPos) {
    if (!Array.isArray(houndPositions) || houndPositions.length === 0) {
      return {
        packSize: 0,
        flankingAnglesDeg: [],
        pounceImminent: false,
        encirclementScore: 0
      };
    }

    const angles = houndPositions.map(pos => {
      const dx = pos.x - playerPos.x;
      const dy = pos.y - playerPos.y;
      let angleDeg = Math.round(Math.atan2(dy, dx) * (180 / Math.PI));
      if (angleDeg < 0) angleDeg += 360;
      return angleDeg;
    });

    angles.sort((a, b) => a - b);

    // Compute angular spread coverage
    let maxGap = 0;
    for (let i = 0; i < angles.length; i++) {
      const nextAngle = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1];
      const gap = nextAngle - angles[i];
      if (gap > maxGap) maxGap = gap;
    }

    // Lower max gap means better 360-degree encirclement
    const encirclementScore = +(Math.max(0, Math.min(1.0, (360 - maxGap) / 240))).toFixed(2);
    const pounceImminent = encirclementScore > 0.65 && houndPositions.some(pos => {
      const dist = Math.hypot(pos.x - playerPos.x, pos.y - playerPos.y);
      return dist <= 6.5;
    });

    return {
      packSize: houndPositions.length,
      flankingAnglesDeg: angles,
      encirclementScore,
      pounceImminent
    };
  }

  /**
   * Retrieves overall sector telemetry.
   * @returns {Object}
   */
  getSectorState() {
    return {
      sectorId: this.sectorId,
      craterRadiusM: this.craterRadiusM,
      podHullIntegrity: this.podHullIntegrity,
      biomarkerFrequencyKhz: this.biomarkerFrequencyKhz,
      houndsAttractedCount: this.houndsAttractedCount,
      thrusterThermalKelvin: this.thrusterThermalKelvin,
      beaconActive: this.beaconActive,
      cacheLooted: this.cacheLooted
    };
  }
}
