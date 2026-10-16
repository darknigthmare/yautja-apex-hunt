// Directeur de Vision Cardiaque Pulsée / Rythme Artériel Berserker (Lore 1:1)
// Référence canonique : Predators (2010) - Biomask du Berserker / Mr. Black visualisant les flux circulatoires à travers la boue et le couvert

import { audioSynth } from '../AudioSynthesizer.js';

export const HEARTBEAT_VISION_CONSTANTS = {
  PULSE_FREQUENCY_BASE: 1.1,      // Battements de base par seconde (~66 BPM)
  PULSE_EXPANSION_SPEED: 40.0,    // Vitesse de propagation de l'onde de balayage sensoriel (m/s)
  MAX_DETECTION_RANGE: 65.0,      // Portée maximale de détection à travers les obstacles
  MUD_PENETRATION_FACTOR: 1.0,    // Traverse 100% de la boue thermique (contrairement à l'IR classique)
  ELEVATED_HEARTBEAT_MULT: 1.6,   // Amplification pour proies essoufflées ou en état d'alerte
};

export function createPulsedHeartbeatVisionState() {
  return {
    isActive: false,
    pulseTimer: 0,
    pulsePhase: 0,            // 0 à 1 (cycle systolique / diastolique)
    currentScanRadius: 0,
    detectedCirculatoryEchoes: [],
    bpmReadout: 72,
    syncAudio: true,
  };
}

export function togglePulsedHeartbeatVision(state, forceState = null) {
  if (!state) return false;
  state.isActive = forceState !== null ? Boolean(forceState) : !state.isActive;
  if (!state.isActive) {
    state.detectedCirculatoryEchoes = [];
    state.currentScanRadius = 0;
  }
  return state.isActive;
}

export function updatePulsedHeartbeatVision(state, delta, hunterPos, entities = [], audio = audioSynth) {
  if (!state || !state.isActive) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.pulseTimer += dt;
  const cyclePeriod = 1.0 / HEARTBEAT_VISION_CONSTANTS.PULSE_FREQUENCY_BASE;

  if (state.pulseTimer >= cyclePeriod) {
    state.pulseTimer -= cyclePeriod;
    state.currentScanRadius = 0; // Réinitialise l'onde d'expansion concentrique

    if (state.syncAudio && audio && typeof audio.playHeartbeatVisionPulse === 'function') {
      audio.playHeartbeatVisionPulse();
    }
  }

  // Phase du cycle cardiaque pour effets de shader et modulation visuelle
  state.pulsePhase = state.pulseTimer / cyclePeriod;
  state.currentScanRadius += HEARTBEAT_VISION_CONSTANTS.PULSE_EXPANSION_SPEED * dt;

  state.detectedCirculatoryEchoes = [];

  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    // Les synthétiques sans fluide sanguin circulant sont indétectables par ce mode
    if (ent.isSynthetic || ent.role === 'synthetic') continue;

    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    const dx = ex - hunterPos.x;
    const dy = ey - hunterPos.y;
    const dz = ez - hunterPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= HEARTBEAT_VISION_CONSTANTS.MAX_DETECTION_RANGE && dist <= state.currentScanRadius) {
      // Détermination du BPM de la proie
      const isInCombat = ent.inCombat || ent.isAlerted || (ent.target !== null && ent.target !== undefined);
      const bpm = isInCombat ? Math.round(135 + Math.random() * 25) : Math.round(68 + Math.random() * 12);
      const intensity = isInCombat ? 1.0 : (1.0 - (dist / HEARTBEAT_VISION_CONSTANTS.MAX_DETECTION_RANGE));

      state.detectedCirculatoryEchoes.push({
        id: ent.id || 'unknown_prey',
        x: ex,
        y: ey,
        z: ez,
        distance: dist,
        bpm: bpm,
        intensity: Math.max(0.1, intensity),
        isMudCovered: Boolean(ent.isMudCovered),
        cardiacPulseGlow: Math.sin(state.pulsePhase * Math.PI),
      });
    }
  }

  if (state.detectedCirculatoryEchoes.length > 0) {
    // Affiche le BPM moyen le plus élevé des cibles verrouillées
    state.bpmReadout = Math.max(...state.detectedCirculatoryEchoes.map(e => e.bpm));
  } else {
    state.bpmReadout = 65;
  }
}
