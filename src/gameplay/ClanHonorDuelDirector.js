// Directeur du Cercle de Duel d'Honneur et Vendetta de Clan (Lore 1:1)
// Références canoniques : Predators (2010) - Duel rituel Classic Hunter vs Berserker ; Predator 2 (1990) - Code des Anciens

import { audioSynth } from '../AudioSynthesizer.js';

export const DUEL_CONSTANTS = {
  ARENA_RADIUS: 14.0,           // Rayon du cercle rituel
  HONOR_WIN_BONUS: 250,         // Points d'honneur du Clan décernés au vainqueur
};

export function createClanHonorDuelState() {
  return {
    isDuelActive: false,
    arenaCenter: { x: 0, y: 0, z: 0 },
    combatantA: null,
    combatantB: null,
    isCloakForbidden: true,
    isRangedForbidden: true,
    badBloodViolations: [],
    winner: null,
  };
}

export function initiateHonorDuel(state, combatantA, combatantB, arenaCenter = { x: 0, y: 0, z: 0 }, audio = audioSynth) {
  if (!state || !combatantA || !combatantB) return false;

  state.isDuelActive = true;
  state.arenaCenter = arenaCenter;
  state.combatantA = combatantA;
  state.combatantB = combatantB;
  state.badBloodViolations = [];
  state.winner = null;

  // Désactivation des armes à distance et du camouflage sous peine de déshonneur
  if (combatantA.cloakState) combatantA.cloakState.isCloaked = false;
  if (combatantB.cloakState) combatantB.cloakState.isCloaked = false;

  if (audio && typeof audio.playHonorGongChime === 'function') {
    audio.playHonorGongChime();
  }
  return true;
}

export function verifyDuelHonorIntegrity(state, combatant, attemptedAction = 'melee') {
  if (!state || !state.isDuelActive) return true;

  // Vérification de sortie du cercle
  const dx = combatant.x - state.arenaCenter.x;
  const dz = combatant.z - state.arenaCenter.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist > DUEL_CONSTANTS.ARENA_RADIUS) {
    state.badBloodViolations.push({ combatantId: combatant.id, reason: 'fled_arena_circle' });
    combatant.isBadBlood = true;
    return false;
  }

  // Interdiction du tir à distance et du camouflage en duel singulier
  if (attemptedAction === 'ranged_weapon' || attemptedAction === 'cloak') {
    state.badBloodViolations.push({ combatantId: combatant.id, reason: 'dishonorable_ranged_strike' });
    combatant.isBadBlood = true;
    return false;
  }

  return true;
}

export function resolveDuelVictory(state, winner, loser) {
  if (!state || !state.isDuelActive) return false;
  state.isDuelActive = false;
  state.winner = winner;

  if (winner) {
    winner.clanHonor = (winner.clanHonor || 0) + DUEL_CONSTANTS.HONOR_WIN_BONUS;
    winner.isDuelChampion = true;
  }
  if (loser) {
    loser.isDead = true;
    loser.health = 0;
  }
  return true;
}
