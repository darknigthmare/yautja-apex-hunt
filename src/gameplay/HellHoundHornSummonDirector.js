// Directeur d'Appel de Meute au Cor de Guerre Yautja (Lore 1:1)
// Référence canonique : Predators (2010) - La corne de guerre du Tracker déclenchant la traque et la panique des proies

import { audioSynth } from '../AudioSynthesizer.js';

export const HORN_CONSTANTS = {
  CALL_RADIUS: 80.0,              // Portée de propagation acoustique du cor dans la jungle (m)
  TERROR_DURATION: 6.0,           // Durée de l'effet d'effroi sur les soldats humains (s)
  HOUND_FRENZY_SPEED_BUFF: 1.25,  // +25% de vitesse pour les molosses éveillés
  COOLDOWN_TIME: 15.0,            // Temps de récupération entre deux sonneries de cor (s)
};

export function createHellHoundHornState() {
  return {
    cooldownTimer: 0,
    timesSounded: 0,
    activeFrenzyHounds: [],
    terrifiedPreys: [],
  };
}

export function soundHuntingWarHorn(state, hunterPos, entities = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return false;

  state.cooldownTimer = HORN_CONSTANTS.COOLDOWN_TIME;
  state.timesSounded += 1;
  state.activeFrenzyHounds = [];
  state.terrifiedPreys = [];

  if (audio && typeof audio.playTrackerHornWarBellow === 'function') {
    audio.playTrackerHornWarBellow();
  }

  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    const dx = ex - hunterPos.x;
    const dz = ez - hunterPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= HORN_CONSTANTS.CALL_RADIUS) {
      // Si c'est un molosse de chasse : réveil et frénésie
      if (ent.role === 'hell_hound' || ent.species === 'hell_hound' || ent.type?.includes('hound')) {
        ent.isAwakened = true;
        ent.inFrenzy = true;
        ent.speedMultiplier = HORN_CONSTANTS.HOUND_FRENZY_SPEED_BUFF;
        state.activeFrenzyHounds.push(ent.id || 'hound');

        if (audio && typeof audio.playHoundFrenzyHowl === 'function') {
          audio.playHoundFrenzyHowl();
        }
      }

      // Si c'est une proie humaine/guérilla : panique et tremblements
      if (ent.species === 'human' || ent.role?.includes('soldier') || ent.role?.includes('commando')) {
        ent.isTerrified = true;
        ent.terrorTimer = HORN_CONSTANTS.TERROR_DURATION;
        ent.aimSwayPenalty = 0.6; // +60% de dispersion de visée
        state.terrifiedPreys.push(ent.id || 'human_prey');
      }
    }
  }

  return true;
}

export function updateHellHoundHornDirector(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }
}
