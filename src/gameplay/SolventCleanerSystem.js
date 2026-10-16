// Protocole de nettoyage forensique et solvant bleu dissolvant (Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) - Wolf le Nettoyeur effaçant toute trace technologique et biologique

import { audioSynth } from '../AudioSynthesizer.js';

export const CLEANER_CONSTANTS = {
  SOLVENT_RADIUS: 2.4,          // Rayon d'action de la fiole de solvant
  DISSOLUTION_DURATION: 2.5,    // Temps pour dissoudre totalement un corps ou équipement
  MAX_SOLVENT_VIALS: 6,
};

export function createCleanerProtocolState() {
  return {
    remainingVials: CLEANER_CONSTANTS.MAX_SOLVENT_VIALS,
    evidenceTraces: [],
    activeDissolutions: [],
    dissolvedTracesCount: 0,
    totalTracesGenerated: 0,
  };
}

export function registerEvidenceTrace(state, entity, traceType = 'xenomorph_corpse') {
  if (!state || !entity) return null;
  const trace = {
    id: `trace_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(entity.x) || 0,
    y: Number(entity.y) || 0,
    z: Number(entity.z) || 0,
    traceType, // 'xenomorph_corpse', 'facehugger', 'human_victim', 'yautja_gear'
    severity: traceType === 'yautja_gear' ? 100 : 50,
    isDissolved: false,
  };
  state.evidenceTraces.push(trace);
  state.totalTracesGenerated += 1;
  return trace;
}

export function deploySolventVial(state, position, audio = audioSynth) {
  if (!state || state.remainingVials <= 0 || !position) return false;

  state.remainingVials -= 1;

  const dissolution = {
    id: `dissolution_${Date.now()}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    radius: CLEANER_CONSTANTS.SOLVENT_RADIUS,
    timer: CLEANER_CONSTANTS.DISSOLUTION_DURATION,
  };

  state.activeDissolutions.push(dissolution);

  if (audio && typeof audio.playSolventSizzle === 'function') {
    audio.playSolventSizzle();
  }
  return true;
}

export function updateCleanerProtocol(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.activeDissolutions = state.activeDissolutions.filter(dissolution => {
    dissolution.timer -= dt;

    // Dissolution des preuves dans la flaque de solvant
    for (const trace of state.evidenceTraces) {
      if (!trace.isDissolved) {
        const dx = trace.x - dissolution.x;
        const dy = (trace.y || 0) - dissolution.y;
        const dz = trace.z - dissolution.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist <= dissolution.radius) {
          trace.isDissolved = true;
          state.dissolvedTracesCount += 1;
        }
      }
    }

    return dissolution.timer > 0;
  });

  // Nettoyage de la liste des traces dissoutes
  state.evidenceTraces = state.evidenceTraces.filter(t => !t.isDissolved);
}

export function calculateCleanerHonorRating(state) {
  if (!state) return 0;
  if (state.totalTracesGenerated === 0) return 100;
  const dissolvedRatio = state.dissolvedTracesCount / state.totalTracesGenerated;
  return Math.round(dissolvedRatio * 100);
}
