/**
 * Prey1719OrangeFlowerThermalSuppressionSector.js
 *
 * Chantier de Level Design 3 (v191) - Prey (2022) Orange Totokia Flower & Core Thermal Suppression
 * 1:1 Canonical Level Design:
 * - Alpine gathering of the rare orange fever-bane medicinal flower (totokia).
 * - Mortar and pestle grinding into a medicinal paste that severely suppresses blood circulation and lowers body heat.
 * - Core body temperature drops from 37.0°C to 11.2°C (simulating death/hypothermia).
 * - The Feral Predator walks directly over the chilled target without detecting thermal radiation.
 */

export class Prey1719OrangeFlowerThermalSuppressionSector {
  /**
   * @param {Object} options
   * @param {number} [options.flowerPetalsCount=4] Nombre de fleurs d'oranger médicinales en réserve
   * @param {number} [options.baselineBodyTempC=37.0] Température corporelle de référence (°C)
   */
  constructor(options = {}) {
    this.flowerPetalsCount = options.flowerPetalsCount ?? 4;
    this.baselineBodyTempC = options.baselineBodyTempC ?? 37.0;

    // État runtime
    this.flowerPastePrepared = false;
    this.pasteAdministered = false;
    this.currentCoreTempC = this.baselineBodyTempC;
    this.heartRateBpm = 75;
    this.infraredSignatureExtinguished = false;
  }

  /**
   * Broyer les pétales d'oranger en pâte médicinale rafraîchissante
   */
  grindOrangeFlowerPaste() {
    if (this.flowerPetalsCount <= 0) {
      return { status: 'FAILED_NO_FLOWERS', prepared: false };
    }

    this.flowerPastePrepared = true;
    this.flowerPetalsCount -= 1;

    return {
      status: 'ORANGE_TOTOKIA_PASTE_PREPARED',
      coolingPotencyRatio: 0.95,
      herbalSaltsActive: true,
      readyForIngestion: true
    };
  }

  /**
   * Ingérer ou administrer la pâte d'oranger pour abaisser radicalement la chaleur corporelle
   * @param {string} recipient Nom de la personne soignée ('Naru' | 'Raphael Adolini')
   */
  administerOrangeFlowerPaste(recipient = 'Naru') {
    if (!this.flowerPastePrepared) {
      return { status: 'FAILED_PASTE_NOT_PREPARED', success: false };
    }

    this.pasteAdministered = true;
    this.currentCoreTempC = 11.2;
    this.heartRateBpm = 24;
    this.infraredSignatureExtinguished = true;

    return {
      status: 'CORE_BODY_TEMPERATURE_SUPPRESSED',
      recipient,
      coreTemperatureCelsius: this.currentCoreTempC,
      heartRateBpm: this.heartRateBpm,
      infraredSignaturePct: 0.0,
      invisibleToYautjaThermalVision: true
    };
  }

  /**
   * Tester la détection par le Feral Predator en vision thermique
   * @param {number} predatorProximityM Distance du Feral Predator (m)
   */
  evaluatePredatorThermalScan(predatorProximityM = 1.5) {
    const detected = !this.infraredSignatureExtinguished;

    return {
      status: detected ? 'TARGET_DETECTED_BY_THERMAL_SCAN' : 'TARGET_OVERLOOKED_AS_INANIMATE_STONE',
      detected,
      predatorProximityM,
      targetTemperatureMatchWithTerrain: true,
      audioVulnerabilityActive: true // Le son peut encore trahir la position si le patient gémit
    };
  }
}
