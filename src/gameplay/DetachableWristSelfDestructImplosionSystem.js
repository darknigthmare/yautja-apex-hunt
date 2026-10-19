// Séquence d'Autodestruction Miniature de Poignet Détachable & Implosion (AVP 2004 / Predator 1987 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Scar détachant son module d'autodestruction de gantelet après avoir entré la séquence en glyphes rouges Yautja pour anéantir le nid de la Reine et la pyramide.

import { audioSynth } from '../AudioSynthesizer.js';

export const WRIST_BOMB_CONSTANTS = {
  COUNTDOWN_DURATION_SEC: 5.0,       // Compte à rebours avant implosion thermonucléaire miniature
  BLAST_RADIUS_M: 28.0,              // Rayon de rasement du dôme d'implosion
  IMPLOSION_CORE_DAMAGE: 950,        // Dégâts létaux d'annihilation de ruche/pyramide
};

export function createWristSelfDestructState() {
  return {
    isArmed: false,
    isDetachedFromWrist: false,
    plantedPosition: null,
    remainingCountdownSec: 0,
    hasDetonated: false,
  };
}

export function armAndDetachWristBomb(state, position = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || state.isArmed) return false;

  state.isArmed = true;
  state.isDetachedFromWrist = true;
  state.plantedPosition = { x: position.x || 0, z: position.z || 0 };
  state.remainingCountdownSec = WRIST_BOMB_CONSTANTS.COUNTDOWN_DURATION_SEC;

  if (audio && typeof audio.playWristBombGlyphCountdownBeep === 'function') {
    audio.playWristBombGlyphCountdownBeep();
  }

  return true;
}

export function updateWristBombCountdown(state, dt, entitiesInSector = [], audio = audioSynth) {
  if (!state || !state.isArmed || state.hasDetonated || dt <= 0) {
    return { detonated: false, obliteratedCount: 0 };
  }

  state.remainingCountdownSec -= dt;

  if (state.remainingCountdownSec > 0) {
    if (audio && typeof audio.playWristBombGlyphCountdownBeep === 'function') {
      audio.playWristBombGlyphCountdownBeep();
    }
    return { detonated: false, obliteratedCount: 0 };
  }

  state.hasDetonated = true;
  state.remainingCountdownSec = 0;

  if (audio && typeof audio.playDetachableWristBombImplosionRoar === 'function') {
    audio.playDetachableWristBombImplosionRoar();
  }

  let obliteratedCount = 0;
  const bx = state.plantedPosition ? state.plantedPosition.x : 0;
  const bz = state.plantedPosition ? state.plantedPosition.z : 0;

  if (Array.isArray(entitiesInSector)) {
    for (const ent of entitiesInSector) {
      if (!ent) continue;
      const dist = Math.hypot((ent.x || 0) - bx, (ent.z || 0) - bz);
      if (dist <= WRIST_BOMB_CONSTANTS.BLAST_RADIUS_M) {
        ent.isVaporizedByWristBomb = true;
        obliteratedCount++;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(WRIST_BOMB_CONSTANTS.IMPLOSION_CORE_DAMAGE);
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - WRIST_BOMB_CONSTANTS.IMPLOSION_CORE_DAMAGE);
        }
      }
    }
  }

  return {
    detonated: true,
    obliteratedCount,
  };
}
