// Système de vocalisation mimétique et leurre acoustique spatialisé (Lore 1:1)
// Référence canonique : Predator (1987) - "Anytime...", "Over here...", rire sardonique de Billy Sole

import { audioSynth } from '../AudioSynthesizer.js';

export const MIMICRY_PHRASES = {
  ANYTIME: {
    id: 'ANYTIME',
    text: 'Anytime...',
    effectRadius: 18.0,
    aiReaction: 'PARANOID_ALERT',
  },
  OVER_HERE: {
    id: 'OVER_HERE',
    text: 'Over here... over here...',
    effectRadius: 24.0,
    aiReaction: 'INVESTIGATE_SOURCE',
  },
  TURN_AROUND: {
    id: 'TURN_AROUND',
    text: 'Turn around...',
    effectRadius: 12.0,
    aiReaction: 'SPIN_REVEAL_BACK',
  },
  MANIACAL_LAUGHTER: {
    id: 'MANIACAL_LAUGHTER',
    text: 'Billy Sole Maniacal Laugh',
    effectRadius: 30.0,
    aiReaction: 'PANIC_SUPPRESSION',
  },
};

export function createSoundMimicryState() {
  return {
    recordedPhrases: Object.keys(MIMICRY_PHRASES),
    activeDecoys: [],
    cooldownTimer: 0,
    cooldownDuration: 4.5,
  };
}

export function broadcastMimicryVoice(state, phraseKey, emitterPos, targetNpcs = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return null;
  const phrase = MIMICRY_PHRASES[phraseKey];
  if (!phrase) return null;

  const decoy = {
    id: `mimic_decoy_${Date.now()}`,
    phraseKey,
    position: { x: emitterPos.x, y: emitterPos.y || 0, z: emitterPos.z },
    lifetime: 3.0,
    affectedNpcIds: [],
  };

  // Traitement des réactions IA des cibles dans le rayon acoustique
  for (const npc of targetNpcs) {
    const dx = npc.x - emitterPos.x;
    const dy = (npc.y || 0) - (emitterPos.y || 0);
    const dz = npc.z - emitterPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= phrase.effectRadius) {
      decoy.affectedNpcIds.push(npc.id || 'npc');
      npc.aiState = phrase.aiReaction;
      npc.acousticDistractionTarget = { x: emitterPos.x, z: emitterPos.z };

      if (phrase.aiReaction === 'SPIN_REVEAL_BACK') {
        // L'ennemi se retourne de 180°, exposant son dos à l'angle mort
        npc.isBackExposed = true;
        if (typeof npc.setFacingAngle === 'function') {
          npc.setFacingAngle((npc.facingAngle || 0) + Math.PI);
        }
      }
    }
  }

  state.activeDecoys.push(decoy);
  state.cooldownTimer = state.cooldownDuration;

  if (audio) {
    if (phraseKey === 'ANYTIME' && typeof audio.playMimicryAnytime === 'function') {
      audio.playMimicryAnytime();
    } else if (phraseKey === 'OVER_HERE' && typeof audio.playMimicryLure === 'function') {
      audio.playMimicryLure('over_here');
    }
  }

  return decoy;
}

export function updateMimicrySystem(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  state.activeDecoys = state.activeDecoys.filter(decoy => {
    decoy.lifetime -= dt;
    return decoy.lifetime > 0;
  });
}
