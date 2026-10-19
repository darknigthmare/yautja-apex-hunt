// Secteur de Niveau : Leurre de Cuchillo & Piège à Claymores (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le Berserker utilise le corps de Cuchillo et un enregistrement vocal comme appât piégé à l'explosif

import { audioSynth } from '../AudioSynthesizer.js';

export const CUCHILLO_DECOY_CONSTANTS = {
  TRIGGER_RADIUS: 3.5,                 // Distance de déclenchement du fil de détente (m)
  CLAYMORE_BLAST_DAMAGE: 210.0,        // Dégâts de fragmentation de billes d'acier
  MIMIC_VOICE_INTERVAL: 3.2,           // Intervalle du murmure d'appel au secours (s)
};

export function createCuchilloDecoyState(origin = { x: 0, z: -20.0 }) {
  return {
    center: { x: origin.x || 0, z: origin.z || -20.0 },
    isRigged: true,
    isDetonated: false,
    isDisarmed: false,
    mimicVoiceTimer: 0.0,
    casualtiesCount: 0,
  };
}

export function disarmClaymoreTrap(state) {
  if (!state || !state.isRigged || state.isDetonated) return false;
  state.isRigged = false;
  state.isDisarmed = true;
  return true;
}

export function updateCuchilloDecoySector(state, delta, entities = [], audio = audioSynth) {
  if (!state || state.isDetonated || state.isDisarmed) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Émission de la boucle vocale factice "Help me..."
  state.mimicVoiceTimer += dt;
  if (state.mimicVoiceTimer >= CUCHILLO_DECOY_CONSTANTS.MIMIC_VOICE_INTERVAL) {
    state.mimicVoiceTimer = 0.0;
    if (audio && typeof audio.playCuchilloMimicWhisperHiss === 'function') {
      audio.playCuchilloMimicWhisperHiss();
    }
  }

  const cx = state.center.x;
  const cz = state.center.z;

  // Détection d'approche sur le fil piège
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);
    const dist = Math.sqrt((ex - cx) ** 2 + (ez - cz) ** 2);

    if (dist <= CUCHILLO_DECOY_CONSTANTS.TRIGGER_RADIUS) {
      state.isDetonated = true;
      state.isRigged = false;

      if (audio && typeof audio.playClaymoreBlastRing === 'function') {
        audio.playClaymoreBlastRing();
      }

      // Explosion directionnelle de la mine
      if (typeof ent.takeDamage === 'function') {
        ent.takeDamage(CUCHILLO_DECOY_CONSTANTS.CLAYMORE_BLAST_DAMAGE, 'claymore_mine');
      } else if (typeof ent.health === 'number') {
        ent.health = Math.max(0, ent.health - CUCHILLO_DECOY_CONSTANTS.CLAYMORE_BLAST_DAMAGE);
      }

      ent.isKnockedBack = true;
      ent.isStaggered = true;
      ent.staggerTimer = 2.5;
      state.casualtiesCount++;
      break;
    }
  }
}
