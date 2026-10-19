// Secteur de Niveau : Duel d'Honneur au Katana dans les Hautes Herbes (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le duel singulier entre Hanzo et le Falconer Super Predator respectant le code d'honneur Yautja

import { audioSynth } from '../AudioSynthesizer.js';

export const HONOR_DUEL_CONSTANTS = {
  ARENA_RADIUS: 16.0,                  // Périmètre de la clairière de duel (m)
  PARRY_WINDOW: 0.45,                  // Fenêtre de parade parfaite au katana (s)
  MUTUAL_STRIKE_DAMAGE: 80.0,          // Dégâts des passes d'armes mortelles
  HONOR_REWARD: 250,                   // Gain d'honneur pour duel singulier sans arme à distance
};

export function createHonorDuelState(center = { x: 0, z: -40.0 }) {
  return {
    arenaCenter: { x: center.x || 0, z: center.z || -40.0 },
    isChallengeIssued: false,
    isDuelAccepted: false,
    isDuelActive: false,
    clashExchangesCount: 0,
    winner: null,
  };
}

export function initiateHonorChallenge(state, humanDuelist, predatorDuelist) {
  if (!state || !humanDuelist || !predatorDuelist) return false;

  // Le duelliste humain rengaine ses armes à feu et dégaine sa lame d'acier
  humanDuelist.hasRangedWeaponsHolstered = true;
  humanDuelist.isWieldingKatana = true;
  state.isChallengeIssued = true;

  // Le Yautja répond au code d'honneur : désactive le camouflage et verrouille le canon plasma
  predatorDuelist.isCloaked = false;
  predatorDuelist.plasmaCasterLocked = true;
  predatorDuelist.isHonorableDuelStance = true;

  state.isDuelAccepted = true;
  state.isDuelActive = true;

  return true;
}

export function executeMeleeClash(state, humanFighter, predatorFighter, isParried = false, audio = audioSynth) {
  if (!state || !state.isDuelActive) return { clashed: false };

  state.clashExchangesCount++;

  if (audio && typeof audio.playKatanaBladeClashRing === 'function') {
    audio.playKatanaBladeClashRing();
  }

  if (isParried) {
    // Parade parfaite : déviation sans dommage
    return {
      clashed: true,
      parried: true,
      exchange: state.clashExchangesCount,
    };
  }

  // Échange de coups croisés (le coup fatal réciproque de Hanzo et Falconer)
  const dmg = HONOR_DUEL_CONSTANTS.MUTUAL_STRIKE_DAMAGE;

  if (typeof humanFighter.takeDamage === 'function') {
    humanFighter.takeDamage(dmg, 'yautja_wristblade');
  } else if (typeof humanFighter.health === 'number') {
    humanFighter.health = Math.max(0, humanFighter.health - dmg);
  }

  if (typeof predatorFighter.takeDamage === 'function') {
    predatorFighter.takeDamage(dmg, 'katana_blade');
  } else if (typeof predatorFighter.health === 'number') {
    predatorFighter.health = Math.max(0, predatorFighter.health - dmg);
  }

  return {
    clashed: true,
    parried: false,
    damageDealt: dmg,
    humanHealth: humanFighter.health,
    predatorHealth: predatorFighter.health,
  };
}

export function updateHonorDuel(state, delta, humanFighter, predatorFighter) {
  if (!state || !state.isDuelActive) return;

  if (humanFighter && humanFighter.health <= 0) {
    state.isDuelActive = false;
    state.winner = 'predator';
  } else if (predatorFighter && predatorFighter.health <= 0) {
    state.isDuelActive = false;
    state.winner = 'human';
    if (humanFighter) {
      humanFighter.honorEarned = (humanFighter.honorEarned || 0) + HONOR_DUEL_CONSTANTS.HONOR_REWARD;
    }
  }
}
