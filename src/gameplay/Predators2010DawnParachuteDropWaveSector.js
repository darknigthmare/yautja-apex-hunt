/**
 * Predators2010DawnParachuteDropWaveSector.js
 *
 * Chantier de Level Design 6 (v183) - Predators (2010)
 * 1:1 Canonical Level Design: Dawn Sky Atmospheric Re-entry & 14 New Parachute Drops (Endless Hunt)
 *
 * Canonical Scene: Royce and Isabelle look up at dawn after defeating the Berserker.
 * The pink and orange morning sky is filled with 14 new parachutes dropping into the atmosphere,
 * proving that the Game Preserve is perpetual and new prey is continuously seeded.
 */

export class Predators2010DawnParachuteDropWaveSector {
  /**
   * @param {Object} options
   * @param {number} [options.newParachutesCount=14] Nombre canonique de nouvelles capsules larguées (14)
   * @param {number} [options.dawnAtmosphereHueDeg=28.0] Teinte aurorale (degrés HSL orange/rose)
   * @param {number} [options.dispersionRadiusM=1200.0] Rayon de dispersion des parachutes (m)
   */
  constructor(options = {}) {
    this.newParachutesCount = options.newParachutesCount ?? 14;
    this.dawnAtmosphereHueDeg = options.dawnAtmosphereHueDeg ?? 28.0;
    this.dispersionRadiusM = options.dispersionRadiusM ?? 1200.0;

    // Constantes de vent atmosphérique
    this.windShearSpeedMs = 8.5; // m/s
    this.windAzimuthDeg = 135.0; // Sud-Est
    this.podDescentRateMs = 6.8; // m/s sous voile

    // État runtime
    this.dawnTriggered = false;
    this.activePods = [];
    this.waveSpawned = false;
  }

  /**
   * Déclenchement de la transition vers l'aube et largage de la vague
   */
  triggerDawnAtmosphericEntry() {
    this.dawnTriggered = true;
    this.waveSpawned = true;

    this.activePods = [];
    for (let i = 0; i < this.newParachutesCount; i++) {
      const angle = (i / this.newParachutesCount) * Math.PI * 2;
      const distance = 200.0 + (Math.sin(i * 1.7) * 0.5 + 0.5) * (this.dispersionRadiusM - 200.0);
      const posX = Math.cos(angle) * distance;
      const posY = Math.sin(angle) * distance;

      this.activePods.push({
        id: `orbital_drop_pod_dawn_${i + 1}`,
        dropIndex: i + 1,
        altitudeM: 1800.0 - (i * 45.0),
        coordinateX: parseFloat(posX.toFixed(1)),
        coordinateY: parseFloat(posY.toFixed(1)),
        canopyColor: i % 2 === 0 ? 'red_and_white_checkered' : 'tactical_olive_drab',
        estimatedTouchdownSeconds: parseFloat(((1800.0 - i * 45.0) / this.podDescentRateMs).toFixed(1)),
        preyClassification: i % 3 === 0 ? 'ELITE_MERCENARY' : (i % 3 === 1 ? 'XENOFORM_SPECIMEN' : 'WAR_CRIMINAL')
      });
    }

    return {
      status: 'DAWN_PARACHUTE_WAVE_UNLEASHED',
      totalPods: this.newParachutesCount,
      skyHueDeg: this.dawnAtmosphereHueDeg,
      dispersionRadiusM: this.dispersionRadiusM,
      firstTouchdownEtaSeconds: this.activePods[this.activePods.length - 1].estimatedTouchdownSeconds
    };
  }

  /**
   * Simule la descente des nacelles au fil du temps delta
   * @param {number} deltaSeconds
   */
  updatePodsDescent(deltaSeconds) {
    if (!this.waveSpawned) {
      return { active: false, podsLanded: 0 };
    }

    let landedCount = 0;
    this.activePods.forEach(pod => {
      if (pod.altitudeM > 0) {
        pod.altitudeM = Math.max(0, pod.altitudeM - this.podDescentRateMs * deltaSeconds);
        // Dérive due au vent
        pod.coordinateX += Math.cos((this.windAzimuthDeg * Math.PI) / 180) * this.windShearSpeedMs * deltaSeconds * 0.2;
        pod.coordinateY += Math.sin((this.windAzimuthDeg * Math.PI) / 180) * this.windShearSpeedMs * deltaSeconds * 0.2;
      }
      if (pod.altitudeM === 0) {
        landedCount++;
      }
    });

    return {
      active: true,
      totalPods: this.newParachutesCount,
      podsLanded: landedCount,
      podsAirborne: this.newParachutesCount - landedCount
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010DawnParachuteDropWaveSector',
      newParachutesCount: this.newParachutesCount,
      dawnTriggered: this.dawnTriggered,
      waveSpawned: this.waveSpawned,
      activePodsCount: this.activePods.length,
      dispersionRadiusM: this.dispersionRadiusM
    };
  }
}
