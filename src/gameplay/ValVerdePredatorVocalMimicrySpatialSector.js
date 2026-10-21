/**
 * ValVerdePredatorVocalMimicrySpatialSector.js
 * 
 * Chantier Level Design #2 - Moteur de Mimétisme Vocal Spatialisé dans la Canopée.
 * Canonical 1:1 Predator (1987) fidelity:
 * - The Jungle Hunter uses an onboard bio-mask recorder to playback captured human voices from the canopy.
 * - Iconic audio mimicry lines from the 1987 film:
 *   - "Over here... over here..." (Mac's nervous whisper)
 *   - "Turn around..." (whispered directly behind the listener)
 *   - "Anytime..." (Blain's cold swagger)
 *   - "Help me..." (distress lure into a punji / claymore killzone)
 *   - Billy's sardonic laugh (played back during the self-destruct sequence)
 * - 3D spatial placement: speaker branch elevation (18m), azimuth, foliage occlusion damping,
 *   and decoy lure disorientation score.
 */

export class ValVerdePredatorVocalMimicrySpatialSector {
  /**
   * @param {Object} options
   * @param {number} [options.canopySpeakerElevationM=18.0]
   */
  constructor(options = {}) {
    this.canopySpeakerElevationM = options.canopySpeakerElevationM ?? 18.0;

    this.recordedClips = [
      { id: 'MIMIC_OVER_HERE', transcript: 'Over here... over here...', speaker: 'Sergeant Mac Eliot', pitchShiftSemitones: -2, lurePowerScore: 88 },
      { id: 'MIMIC_TURN_AROUND', transcript: 'Turn around...', speaker: 'Unknown Soldier', pitchShiftSemitones: 0, lurePowerScore: 92 },
      { id: 'MIMIC_ANYTIME', transcript: 'Anytime...', speaker: 'Blain Cooper', pitchShiftSemitones: -4, lurePowerScore: 85 },
      { id: 'MIMIC_HELP_ME', transcript: 'Help me... please...', speaker: 'Guerrilla Scout', pitchShiftSemitones: 1, lurePowerScore: 78 },
      { id: 'MIMIC_BILLY_LAUGH', transcript: 'Ha ha ha ha ha...', speaker: 'Billy Sole', pitchShiftSemitones: -3, lurePowerScore: 98 }
    ];

    this.activeBroadcast = null;
  }

  /**
   * Broadcasts a spatialized vocal mimicry clip from a specific branch in the canopy.
   * @param {string} clipId - Clip identifier
   * @param {number} distanceM - Distance to target listener (m)
   * @param {number} azimuthDeg - Horizontal angle relative to listener's facing
   * @returns {Object} Acoustic spatialization telemetry
   */
  broadcastMimicryVoice(clipId = 'MIMIC_OVER_HERE', distanceM = 22.0, azimuthDeg = 45.0) {
    const clip = this.recordedClips.find(c => c.id === clipId) || this.recordedClips[0];

    // Foliage acoustic attenuation: ~0.35 dB/m in humid tropical rainforest
    const baseSplDb = 72.0;
    const distanceAttenuationDb = 20 * Math.log10(Math.max(1.0, distanceM));
    const foliageDampingDb = distanceM * 0.35;
    const receivedSplDb = Math.max(30.0, Math.round((baseSplDb - distanceAttenuationDb - foliageDampingDb) * 10) / 10);

    // Psychoacoustic disorientation: highest when sound comes from behind (azimuth 120-240 deg)
    const isBehindListener = Math.abs(azimuthDeg) > 90;
    const disorientationScore = Math.min(100, Math.round(clip.lurePowerScore * (isBehindListener ? 1.25 : 0.95)));

    this.activeBroadcast = {
      clipId: clip.id,
      transcript: clip.transcript,
      speaker: clip.speaker,
      elevationM: this.canopySpeakerElevationM,
      distanceM,
      azimuthDeg,
      receivedSplDb,
      isBehindListener,
      disorientationScore,
      decoyTargetingLockActive: true
    };

    return this.activeBroadcast;
  }

  /**
   * Evaluates if a human soldier turns to investigate the decoy sound.
   * @param {number} listenerPerceptionSkill - 0 to 100
   * @returns {Object} Investigation outcome
   */
  evaluateListenerInvestigation(listenerPerceptionSkill = 65) {
    if (!this.activeBroadcast) {
      return { investigated: false, reason: 'NO_ACTIVE_BROADCAST' };
    }

    // High disorientation score increases chance listener turns toward decoy
    const turnChancePct = Math.max(10, this.activeBroadcast.disorientationScore - listenerPerceptionSkill * 0.4);
    const investigated = turnChancePct >= 50;

    return {
      clipId: this.activeBroadcast.clipId,
      turnChancePct: Math.round(turnChancePct),
      investigated,
      targetExposedFlank: investigated,
      tacticalTrapSpringWindowSec: 3.5
    };
  }
}
