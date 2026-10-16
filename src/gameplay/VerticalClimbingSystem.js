// Système d'escalade verticale et d'ancrage aux troncs d'arbres géants (Lore 1:1)
// Références canoniques : Predator (1987) - Escalade des troncs de la jungle ; Predators (2010) ; Prey (2022)

import { audioSynth } from '../AudioSynthesizer.js';

export const SURFACE_TYPES = {
  WOOD_BARK: { name: 'WOOD_BARK', gripFriction: 1.0, maxClimbSpeed: 6.5 },
  STONE_MASONRY: { name: 'STONE_MASONRY', gripFriction: 0.85, maxClimbSpeed: 5.5 },
  ICE_SHEET: { name: 'ICE_SHEET', gripFriction: 0.4, maxClimbSpeed: 3.2 },
  METAL_LATTICE: { name: 'METAL_LATTICE', gripFriction: 0.95, maxClimbSpeed: 6.0 },
};

export function createClimbingState() {
  return {
    isClimbing: false,
    activeSurface: null,
    climbHeight: 0,
    maxHeight: 35.0,
    minHeight: 0,
    stamina: 100.0,
    staminaDrainRate: 3.5, // Épuisement progressif de l'endurance lors de l'ascension
    staminaRecoveryRate: 25.0,
    isAnchored: false,
    climbSpeed: 5.5,
  };
}

export function attachToClimbableSurface(state, surface, playerPos, audio = audioSynth) {
  if (!state || !surface) return false;
  state.isClimbing = true;
  state.activeSurface = surface;
  state.climbHeight = playerPos ? (playerPos.y || 0) : 0;
  state.maxHeight = surface.height || 35.0;
  state.isAnchored = true;

  if (audio && typeof audio.playClawBarkGrip === 'function') {
    audio.playClawBarkGrip();
  }
  return true;
}

export function climbVertical(state, directionY, delta, player, audio = audioSynth) {
  if (!state || !state.isClimbing || !state.activeSurface) return false;
  const dir = Math.sign(Number(directionY) || 0);
  if (dir === 0) {
    state.isAnchored = true;
    return true;
  }

  const dt = Math.max(0, Number(delta) || 0);
  const friction = state.activeSurface.surfaceType?.gripFriction || 1.0;
  const speed = (state.activeSurface.surfaceType?.maxClimbSpeed || state.climbSpeed) * friction;

  const movement = dir * speed * dt;
  state.climbHeight = Math.min(state.maxHeight, Math.max(state.minHeight, state.climbHeight + movement));
  state.stamina = Math.max(0, state.stamina - state.staminaDrainRate * dt);
  state.isAnchored = false;

  if (player) {
    player.y = state.climbHeight;
    player.isClimbing = true;
  }

  // Si on atteint le sommet de l'arbre/mur
  if (state.climbHeight >= state.maxHeight) {
    state.isAnchored = true;
  }

  return true;
}

export function dismountClimb(state, player) {
  if (!state || !state.isClimbing) return false;
  state.isClimbing = false;
  state.activeSurface = null;
  state.isAnchored = false;

  if (player) {
    player.isClimbing = false;
  }
  return true;
}

export function updateClimbingState(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (!state.isClimbing) {
    state.stamina = Math.min(100.0, state.stamina + state.staminaRecoveryRate * dt);
  } else if (state.isAnchored) {
    // En ancrage statique, l'endurance ne descend presque pas
    state.stamina = Math.max(0, state.stamina - (state.staminaDrainRate * 0.1) * dt);
  }
}
