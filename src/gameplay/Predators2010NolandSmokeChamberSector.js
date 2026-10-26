/**
 * Predators2010NolandSmokeChamberSector.js
 *
 * Chantier de Level Design 3 (v184) - Predators (2010)
 * 1:1 Canonical Level Design: Derelict Drill Crawler Smoke Chamber & Hydraulic Bulkhead Breach
 *
 * Canonical Scene: Inside the massive abandoned Weyland-Yutani thermal drill crawler ship,
 * Noland betrays the survivors, locking them in a reinforced steel cargo bay and pumping toxic
 * diesel exhaust fumes (CO >= 1,200 ppm, O2 <= 14%). Royce must fire his AA-12 explosive shotgun
 * at the hydraulic bulkhead door hinges to blow the hatch open before asphyxiation.
 */

export class Predators2010NolandSmokeChamberSector {
  /**
   * @param {Object} options
   * @param {number} [options.chamberVolumeM3=140.0] Volume du caisson étanche (m^3)
   * @param {number} [options.toxicCoPpmThreshold=1200.0] Seuil létal de monoxyde de carbone (ppm)
   * @param {number} [options.bulkheadHingeHp=300.0] Résistance structurelle des charnières en acier
   */
  constructor(options = {}) {
    this.chamberVolumeM3 = options.chamberVolumeM3 ?? 140.0;
    this.toxicCoPpmThreshold = options.toxicCoPpmThreshold ?? 1200.0;
    this.bulkheadHingeHp = options.bulkheadHingeHp ?? 300.0;

    // Métriques atmosphériques
    this.currentCoPpm = 50.0; // Baseline
    this.currentOxygenPct = 20.9;
    this.bulkheadSealed = true;
    this.exhaustSmokePumping = true;
    this.breachExploded = false;
    this.asphyxiationTimeLimitSeconds = 30.0;
    this.timeElapsedSeconds = 0.0;
  }

  /**
   * Mise à jour de la toxicité atmosphérique au fil du temps delta
   * @param {number} deltaSeconds
   */
  updateAtmosphereToxicity(deltaSeconds) {
    if (this.breachExploded || !this.bulkheadSealed) {
      // Évacuation immédiate des fumées
      this.currentCoPpm = Math.max(50.0, this.currentCoPpm - 400.0 * deltaSeconds);
      this.currentOxygenPct = Math.min(20.9, this.currentOxygenPct + 2.5 * deltaSeconds);
      return {
        sealed: false,
        coPpm: parseFloat(this.currentCoPpm.toFixed(1)),
        oxygenPct: parseFloat(this.currentOxygenPct.toFixed(1)),
        status: 'ATMOSPHERE_VENTING_TO_FRESH_AIR'
      };
    }

    this.timeElapsedSeconds += deltaSeconds;
    // Augmentation rapide du CO et chute de l'oxygène
    this.currentCoPpm = Math.min(2400.0, this.currentCoPpm + 75.0 * deltaSeconds);
    this.currentOxygenPct = Math.max(10.0, this.currentOxygenPct - 0.28 * deltaSeconds);

    const isLethal = this.currentCoPpm >= this.toxicCoPpmThreshold || this.currentOxygenPct <= 14.0;

    return {
      sealed: true,
      coPpm: parseFloat(this.currentCoPpm.toFixed(1)),
      oxygenPct: parseFloat(this.currentOxygenPct.toFixed(1)),
      isLethalAsphyxiation: isLethal,
      secondsBeforeCriticalCollapse: Math.max(0.0, this.asphyxiationTimeLimitSeconds - this.timeElapsedSeconds)
    };
  }

  /**
   * Tir de fusil d'assaut / calibre 12 FRAG-12 sur les charnières de la porte blindée
   * @param {number} blastDamage
   */
  blastBulkheadHinges(blastDamage = 160.0) {
    if (this.breachExploded) {
      return { success: false, reason: 'ALREADY_BREACHED' };
    }

    this.bulkheadHingeHp = Math.max(0.0, this.bulkheadHingeHp - blastDamage);
    if (this.bulkheadHingeHp === 0.0) {
      this.bulkheadSealed = false;
      this.breachExploded = true;
      this.exhaustSmokePumping = false;

      return {
        success: true,
        status: 'BULKHEAD_DOOR_BLOWN_OPEN',
        ventilationRestored: true,
        squadEscapedChamber: true,
        exteriorBerserkerAlertedByBlast: true // Le bruit du tir alerte le Berserker dehors
      };
    }

    return {
      success: false,
      status: 'HINGES_DAMAGED_STILL_SEALED',
      remainingHingeHp: this.bulkheadHingeHp
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010NolandSmokeChamberSector',
      bulkheadSealed: this.bulkheadSealed,
      currentCoPpm: this.currentCoPpm,
      currentOxygenPct: this.currentOxygenPct,
      breachExploded: this.breachExploded,
      bulkheadHingeHp: this.bulkheadHingeHp
    };
  }
}
