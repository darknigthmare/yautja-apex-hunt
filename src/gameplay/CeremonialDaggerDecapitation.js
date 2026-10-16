// Système de Dague Cérémoniale Yautja au Mollet et Parade CQC (Lore 1:1)
// Référence canonique : AVP (2004) - Dague en obsidienne/chitine portée au fourreau du mollet droit par Scar, Celtic et Chopper

import { audioSynth } from '../AudioSynthesizer.js';

export const DAGGER_CONSTANTS = {
  MELEE_RANGE: 1.45,               // Allonge courte de combat au corps-à-corps (m)
  SLASH_DAMAGE: 64.0,              // Dégâts tranchants de la lame en alliage durci
  PARRY_WINDOW: 0.4,               // Fenêtre de contre-parade contre coup de mâchoire interne (s)
  EXECUTE_CHOP_DAMAGE: 160.0,      // Dégâts d'exécution sur cible à terre ou étourdie
};

export function createCeremonialDaggerState() {
  return {
    isDrawn: false,
    parryWindowActive: false,
    parryTimer: 0,
    trophiesCarvedCount: 0,
    facehuggersSeveredCount: 0,
    successfulParriesCount: 0,
  };
}

export function drawCeremonialDagger(state, audio = audioSynth) {
  if (!state) return false;
  state.isDrawn = true;
  state.parryWindowActive = true;
  state.parryTimer = DAGGER_CONSTANTS.PARRY_WINDOW;

  if (audio && typeof audio.playCeremonialDaggerDraw === 'function') {
    audio.playCeremonialDaggerDraw();
  }

  return true;
}

export function sheatheCeremonialDagger(state) {
  if (!state) return;
  state.isDrawn = false;
  state.parryWindowActive = false;
  state.parryTimer = 0;
}

export function executeDaggerCarveOrSever(state, hunterPos, targetEntity, audio = audioSynth) {
  if (!state || !state.isDrawn || !targetEntity || targetEntity.isDead) return null;

  const ex = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const ey = targetEntity.y ?? (targetEntity.position ? targetEntity.position.y : 0);
  const ez = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  const dx = ex - hunterPos.x;
  const dy = ey - hunterPos.y;
  const dz = ez - hunterPos.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist > DAGGER_CONSTANTS.MELEE_RANGE) return null;

  // Si la cible est un facehugger agrippé : section immédiate
  if (targetEntity.isFacehugger || targetEntity.species === 'facehugger') {
    targetEntity.isDead = true;
    targetEntity.health = 0;
    state.facehuggersSeveredCount += 1;

    if (audio && typeof audio.playChitinSeverChop === 'function') {
      audio.playChitinSeverChop();
    }
    return { action: 'facehugger_severed', damageDealt: DAGGER_CONSTANTS.SLASH_DAMAGE };
  }

  // Si la cible est étourdie ou à terre : décapitation rituelle pour prélèvement de trophée
  if (targetEntity.isStunned || targetEntity.isKnockedProne || targetEntity.health < 40) {
    if (typeof targetEntity.takeDamage === 'function') {
      targetEntity.takeDamage(DAGGER_CONSTANTS.EXECUTE_CHOP_DAMAGE, 'ceremonial_decapitation');
    } else {
      targetEntity.health = Math.max(0, targetEntity.health - DAGGER_CONSTANTS.EXECUTE_CHOP_DAMAGE);
    }

    if (targetEntity.health <= 0) {
      targetEntity.isDead = true;
      targetEntity.isDecapitated = true;
      state.trophiesCarvedCount += 1;
    }

    if (audio && typeof audio.playChitinSeverChop === 'function') {
      audio.playChitinSeverChop();
    }

    return { action: 'ritual_carve', damageDealt: DAGGER_CONSTANTS.EXECUTE_CHOP_DAMAGE };
  }

  // Frappe CQC standard
  if (typeof targetEntity.takeDamage === 'function') {
    targetEntity.takeDamage(DAGGER_CONSTANTS.SLASH_DAMAGE, 'dagger_slash');
  } else {
    targetEntity.health = Math.max(0, targetEntity.health - DAGGER_CONSTANTS.SLASH_DAMAGE);
  }

  if (audio && typeof audio.playChitinSeverChop === 'function') {
    audio.playChitinSeverChop();
  }

  return { action: 'slash', damageDealt: DAGGER_CONSTANTS.SLASH_DAMAGE };
}

export function attemptInnerJawParry(state, incomingAttackType) {
  if (!state || !state.isDrawn || !state.parryWindowActive) return false;

  if (incomingAttackType === 'inner_jaw_strike' || incomingAttackType === 'tail_thrust') {
    state.successfulParriesCount += 1;
    state.parryWindowActive = false; // Parade consommée avec succès
    return true;
  }

  return false;
}

export function updateCeremonialDagger(state, delta) {
  if (!state || !state.parryWindowActive) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.parryTimer -= dt;
  if (state.parryTimer <= 0) {
    state.parryWindowActive = false;
  }
}
