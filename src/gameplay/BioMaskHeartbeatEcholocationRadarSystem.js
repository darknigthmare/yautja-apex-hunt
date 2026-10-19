/**
 * BioMaskHeartbeatEcholocationRadarSystem.js
 * Chantier 9 (v150) : Mode radar d'écholocation cardiaque & détection respiratoire du Bio-Masque (Predator 2 / AVP).
 * Filtre sensoriel sub-acoustique du masque Yautja :
 * - Isole les battements cardiaques et la respiration haletante dans un rayon de 32 mètres,
 *   même à travers les cloisons fines, la boue sèche ou les bâches isolantes thermiques.
 * - Seules les proies maîtrisant parfaitement leur rythme cardiaque (< 65 BPM) échappent au balayage.
 */

export class BioMaskHeartbeatEcholocationRadarSystem {
  constructor(options = {}) {
    this.maxDetectionRadiusMeters = options.maxDetectionRadiusMeters ?? 32.0;
    this.calmHeartRateThresholdBpm = options.calmHeartRateThresholdBpm ?? 65;

    this.state = {
      radarActive: false,
      lastDetectedPreyIds: [],
      totalSweepsPerformed: 0
    };
  }

  performSubAcousticHeartbeatSweep(hunterPos = { x: 0, z: 0 }, candidates = [], audioSynthesizer = null) {
    this.state.radarActive = true;
    this.state.totalSweepsPerformed += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playBioMaskHeartbeatEcholocationThump === 'function') {
      audioSynthesizer.playBioMaskHeartbeatEcholocationThump(1.0);
    }

    const detectedPrey = [];
    for (const candidate of candidates) {
      const dist = Math.hypot((candidate.x ?? 0) - (hunterPos.x ?? 0), (candidate.z ?? 0) - (hunterPos.z ?? 0));
      if (dist > this.maxDetectionRadiusMeters) continue;

      const bpm = Number(candidate.heartRateBpm ?? 110);
      if (bpm > this.calmHeartRateThresholdBpm) {
        const signalStrength = Math.min(1.0, (bpm - this.calmHeartRateThresholdBpm) / 100);
        detectedPrey.push({
          id: candidate.id ?? 'prey',
          distanceMeters: Number(dist.toFixed(2)),
          heartRateBpm: bpm,
          signalStrength: Number(signalStrength.toFixed(2)),
          bypassedThermalCamo: Boolean(candidate.hasThermalFoil || candidate.mudCamouflageRatio > 0)
        });
      }
    }

    this.state.lastDetectedPreyIds = detectedPrey.map((p) => p.id);

    return {
      swept: true,
      detectedCount: detectedPrey.length,
      detectedPrey
    };
  }

  getStatus() {
    return {
      radarActive: this.state.radarActive,
      lastDetectedPreyIds: [...this.state.lastDetectedPreyIds],
      totalSweepsPerformed: this.state.totalSweepsPerformed
    };
  }
}
