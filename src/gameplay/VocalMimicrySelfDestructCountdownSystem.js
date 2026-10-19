// Système de Mimétisme Vocal & Compte à Rebours d'Autodestruction Nucléaire (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le Jungle Hunter mourant active l'autodestruction en répétant le rire de Billy Sole ("Run! Get to the chopper!")

import { audioSynth } from '../AudioSynthesizer.js';

export const SELF_DESTRUCT_CONSTANTS = {
  COUNTDOWN_DURATION: 8.0,             // Durée du compte à rebours des glyphes (s)
  BLAST_RADIUS: 45.0,                  // Rayon de l'onde de choc thermonucléaire (m)
  BLAST_DAMAGE: 999.0,                 // Annihilation totale dans la zone
  MIMIC_VOICE_INTERVAL: 2.4,           // Intervalle de répétition du rire enregistré (s)
};

export function createSelfDestructState() {
  return {
    isArmed: false,
    countdownTimer: SELF_DESTRUCT_CONSTANTS.COUNTDOWN_DURATION,
    hasDetonated: false,
    mimicVoiceTimer: 0.0,
    beepTimer: 0.0,
    victimsObliteratedCount: 0,
  };
}

export function armGauntletSelfDestruct(state, audio = audioSynth) {
  if (!state || state.isArmed || state.hasDetonated) return false;

  state.isArmed = true;
  state.countdownTimer = SELF_DESTRUCT_CONSTANTS.COUNTDOWN_DURATION;
  state.mimicVoiceTimer = 0.0;
  state.beepTimer = 0.0;

  if (audio && typeof audio.playManiacalMimicLaughEcho === 'function') {
    audio.playManiacalMimicLaughEcho();
  }
  if (audio && typeof audio.playNuclearGlyphCountdownBeep === 'function') {
    audio.playNuclearGlyphCountdownBeep();
  }

  return true;
}

export function updateSelfDestruct(state, delta, entities = [], blastOrigin = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || !state.isArmed || state.hasDetonated) return null;
  const dt = Math.max(0, Number(delta) || 0);

  state.countdownTimer -= dt;

  // Bips périodiques de décompte des glyphes
  state.beepTimer += dt;
  if (state.beepTimer >= 0.8) {
    state.beepTimer = 0.0;
    if (audio && typeof audio.playNuclearGlyphCountdownBeep === 'function') {
      audio.playNuclearGlyphCountdownBeep();
    }
  }

  // Répétition sardonique du rire de Billy via le vocodeur
  state.mimicVoiceTimer += dt;
  if (state.mimicVoiceTimer >= SELF_DESTRUCT_CONSTANTS.MIMIC_VOICE_INTERVAL) {
    state.mimicVoiceTimer = 0.0;
    if (audio && typeof audio.playManiacalMimicLaughEcho === 'function') {
      audio.playManiacalMimicLaughEcho();
    }
  }

  // Détonation finale
  if (state.countdownTimer <= 0) {
    state.isArmed = false;
    state.hasDetonated = true;

    if (audio && typeof audio.playFuelDrumExplosionBoom === 'function') {
      audio.playFuelDrumExplosionBoom();
    }

    const bx = blastOrigin.x || 0;
    const bz = blastOrigin.z || 0;
    let victims = 0;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dx = ex - bx;
      const dz = ez - bz;

      if (Math.sqrt(dx * dx + dz * dz) <= SELF_DESTRUCT_CONSTANTS.BLAST_RADIUS) {
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(SELF_DESTRUCT_CONSTANTS.BLAST_DAMAGE, 'nuclear_self_destruct');
        } else if (typeof ent.health === 'number') {
          ent.health = 0;
        }
        ent.isDead = true;
        victims++;
      }
    }

    state.victimsObliteratedCount = victims;
    return { detonated: true, blastRadius: SELF_DESTRUCT_CONSTANTS.BLAST_RADIUS, casualties: victims };
  }

  return { detonated: false, remainingTime: state.countdownTimer };
}
