/**
 * HumanQaAcousticSensorPulseHUDDirector.js
 * 
 * Chantier 6 & Audit QA #1 (UI/UX):
 * Solves QA tester feedback: "The Bio-mask acoustic amplifier has no visual representation
 * on the HUD when tracking distant footsteps or heartbeats through walls. We need an acoustic
 * frequency ring with expanding sonic ripples and distance estimation."
 * 
 * Implements directional acoustic sensor processing, polar bearing calculation,
 * expanding sound wave ripples, decibel intensity metering, and acoustic filter profiles.
 */

export class HumanQaAcousticSensorPulseHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.sensorGainDb=24.0]
   * @param {string} [options.activeFilterProfile='ALL_SPECTRUM'] // 'HEARTBEAT', 'FOOTSTEPS', 'WEAPONS', 'ALL_SPECTRUM'
   */
  constructor(options = {}) {
    this.sensorGainDb = options.sensorGainDb || 24.0;
    this.activeFilterProfile = options.activeFilterProfile || 'ALL_SPECTRUM';

    this.detectedSoundSources = [];
    this.hudElement = null;
    this.acousticRipplesActive = false;
  }

  /**
   * Registers a sound event in the surrounding environment and processes acoustic telemetry.
   * @param {Object} soundEvent - { id, sourceX, sourceY, rawDecibels, frequencyHz, type }
   * @param {Object} listenerPos - { x, y }
   * @returns {Object} Acoustic HUD telemetry
   */
  registerSoundEmission(soundEvent = { id: 'heartbeat-prey', sourceX: 5, sourceY: 10, rawDecibels: 42, frequencyHz: 65, type: 'HEARTBEAT' }, listenerPos = { x: 0, y: 0 }) {
    const dx = soundEvent.sourceX - listenerPos.x;
    const dy = soundEvent.sourceY - listenerPos.y;
    const distanceM = +(Math.sqrt(dx * dx + dy * dy)).toFixed(1);
    
    // Polar bearing in degrees (0 to 360)
    let bearingDeg = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
    if (bearingDeg < 0) bearingDeg += 360;

    // Acoustic attenuation with distance
    const receivedDb = +(Math.max(0.0, soundEvent.rawDecibels - 20 * Math.log10(Math.max(1, distanceM)) + this.sensorGainDb)).toFixed(1);
    const audible = receivedDb >= 25.0;

    const processedSource = {
      id: soundEvent.id,
      type: soundEvent.type,
      distanceM,
      bearingDeg,
      receivedDb,
      audible,
      frequencyHz: soundEvent.frequencyHz,
      rippleRadiusPx: Math.round(distanceM * 8)
    };

    if (audible) {
      this.detectedSoundSources.push(processedSource);
      this.acousticRipplesActive = true;
    }

    return {
      audible,
      distanceM,
      bearingDeg,
      receivedDb,
      type: soundEvent.type,
      frequencyHz: soundEvent.frequencyHz
    };
  }

  /**
   * Toggles the acoustic bandpass filter profile on the helmet audio synthesizer.
   * @param {string} profile - 'HEARTBEAT', 'FOOTSTEPS', 'WEAPONS', or 'ALL_SPECTRUM'
   * @returns {Object} Filter status
   */
  setFilterProfile(profile = 'HEARTBEAT') {
    this.activeFilterProfile = profile;
    const filterBands = {
      HEARTBEAT: { lowCutHz: 30, highCutHz: 100 },
      FOOTSTEPS: { lowCutHz: 120, highCutHz: 500 },
      WEAPONS: { lowCutHz: 1000, highCutHz: 4000 },
      ALL_SPECTRUM: { lowCutHz: 20, highCutHz: 20000 }
    };

    return {
      activeFilterProfile: this.activeFilterProfile,
      filterBand: filterBands[profile] || filterBands.ALL_SPECTRUM
    };
  }

  /**
   * Updates or mounts the acoustic sensor pulse HUD overlay.
   * @param {HTMLElement|null} container
   * @returns {Object} UI status
   */
  updateHudAcousticView(container = null) {
    if (!container && typeof document !== 'undefined') {
      container = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (container && typeof document !== 'undefined') {
      let ring = container.querySelector('.acoustic-sensor-pulse-ring');
      if (!ring) {
        ring = document.createElement('div');
        ring.className = 'acoustic-sensor-pulse-ring active';
        ring.innerHTML = `
          <div class="sound-wave-ripple"></div>
          <div class="decibel-intensity-meter">0 dB</div>
        `;
        container.appendChild(ring);
      }

      this.hudElement = ring;
    }

    return {
      rendered: Boolean(this.hudElement),
      detectedSourcesCount: this.detectedSoundSources.length,
      acousticRipplesActive: this.acousticRipplesActive
    };
  }
}
