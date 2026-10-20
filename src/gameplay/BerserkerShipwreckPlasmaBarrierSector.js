/**
 * BerserkerShipwreckPlasmaBarrierSector.js
 * 
 * Predators (2010) - Super Predator scout vessel shipwreck in the jungle game preserve.
 * Simulates oscillating high-energy ion plasma containment barriers (3.2 GHz),
 * optical bio-mask frequency decrypter hacking, generator capacitor kinetic overloads,
 * and disintegration passage hazards.
 */

export class BerserkerShipwreckPlasmaBarrierSector {
  /**
   * @param {Object} options
   * @param {string} [options.shipwreckId='berserker-ship-01']
   * @param {boolean} [options.barrierActive=true]
   * @param {number} [options.barrierFrequencyGhz=3.2]
   * @param {number} [options.generatorCapacitorHealth=300]
   * @param {number} [options.opticalHackProgress=0.0]
   */
  constructor(options = {}) {
    this.shipwreckId = options.shipwreckId || 'berserker-ship-01';
    this.barrierActive = options.barrierActive !== undefined ? options.barrierActive : true;
    this.barrierFrequencyGhz = options.barrierFrequencyGhz !== undefined ? options.barrierFrequencyGhz : 3.2;
    this.generatorCapacitorHealth = options.generatorCapacitorHealth !== undefined ? options.generatorCapacitorHealth : 300;
    this.opticalHackProgress = options.opticalHackProgress !== undefined ? options.opticalHackProgress : 0.0;

    this.barrierDisrupted = false;
  }

  /**
   * Attempts an optical frequency override hack using the Yautja bio-mask tech scanner.
   * @param {string} visorMode - e.g. 'TECH_SCANNER', 'THERMAL', 'ELECTROMAGNETIC'
   * @param {number} deltaSeconds
   * @returns {Object} Hack progress
   */
  attemptOpticalFrequencyHack(visorMode = 'TECH_SCANNER', deltaSeconds = 1.0) {
    if (!this.barrierActive) {
      return { hacked: true, barrierActive: false, opticalHackProgress: 1.0 };
    }

    if (visorMode !== 'TECH_SCANNER' && visorMode !== 'ELECTROMAGNETIC') {
      return {
        hacked: false,
        reason: 'INCOMPATIBLE_VISOR_MODE',
        opticalHackProgress: this.opticalHackProgress
      };
    }

    const rate = visorMode === 'TECH_SCANNER' ? 0.35 : 0.15;
    this.opticalHackProgress = Math.min(1.0, +(this.opticalHackProgress + rate * deltaSeconds).toFixed(2));

    if (this.opticalHackProgress >= 1.0) {
      this.barrierActive = false;
      this.barrierDisrupted = true;
      return {
        hacked: true,
        barrierActive: false,
        opticalHackProgress: 1.0,
        frequencyDephased: true
      };
    }

    return {
      hacked: false,
      opticalHackProgress: this.opticalHackProgress,
      barrierActive: true,
      timeRemainingSec: +((1.0 - this.opticalHackProgress) / rate).toFixed(1)
    };
  }

  /**
   * Inflicts kinetic or energetic damage to the exposed generator capacitor.
   * Smart Discs and heavy plasma bolts can shatter the containment housing.
   * @param {string} projectileType - 'SMART_DISC', 'PLASMACASTER', 'WRISTBLADE'
   * @param {number} damage
   * @returns {Object} Capacitor damage status
   */
  strikeGeneratorCapacitor(projectileType = 'SMART_DISC', damage = 120) {
    if (this.generatorCapacitorHealth <= 0) {
      return { destroyed: true, generatorCapacitorHealth: 0, barrierActive: false };
    }

    let damageMultiplier = 1.0;
    if (projectileType === 'SMART_DISC') damageMultiplier = 1.5; // Ricochet shear damage
    else if (projectileType === 'PLASMACASTER') damageMultiplier = 1.25;

    const actualDamage = Math.round(damage * damageMultiplier);
    this.generatorCapacitorHealth = Math.max(0, this.generatorCapacitorHealth - actualDamage);

    if (this.generatorCapacitorHealth <= 0) {
      this.barrierActive = false;
      this.barrierDisrupted = true;
      return {
        destroyed: true,
        damageDealt: actualDamage,
        generatorCapacitorHealth: 0,
        barrierActive: false,
        capacitorOverloadPop: true
      };
    }

    return {
      destroyed: false,
      damageDealt: actualDamage,
      generatorCapacitorHealth: this.generatorCapacitorHealth,
      barrierActive: true
    };
  }

  /**
   * Evaluates biological passage through the containment barrier plane.
   * @param {Object} entity
   * @param {number} entity.health
   * @param {boolean} [entity.isYautja=true]
   * @returns {Object} Passage resolution
   */
  evaluateBarrierPassage(entity) {
    if (!this.barrierActive) {
      return {
        passed: true,
        disintegrated: false,
        damageTaken: 0,
        barrierActive: false
      };
    }

    // Barrier is active: devastating plasma vaporization
    const vaporizeDamage = 950;
    const finalHealth = Math.max(0, (entity.health || 100) - vaporizeDamage);
    if (entity) entity.health = finalHealth;

    return {
      passed: false,
      disintegrated: finalHealth === 0,
      damageTaken: vaporizeDamage,
      barrierActive: true,
      vaporizationEffect: 'IONIC_PLASMA_INCINERATION'
    };
  }

  /**
   * Returns current shipwreck telemetry.
   * @returns {Object}
   */
  getShipwreckState() {
    return {
      shipwreckId: this.shipwreckId,
      barrierActive: this.barrierActive,
      barrierFrequencyGhz: this.barrierFrequencyGhz,
      generatorCapacitorHealth: this.generatorCapacitorHealth,
      opticalHackProgress: this.opticalHackProgress,
      barrierDisrupted: this.barrierDisrupted
    };
  }
}
