// Directeur de Boss : Xénomorphe Alpha (Comics Marvel Alien — Lore 1:1)
// Référence canonique : Comics Marvel Alien (Phillip Kennedy Johnson) — L'Alpha Xénomorphe, crête argentée, meneur télépathique de ruche et diffuseur d'aérosol acide

import { audioSynth } from '../AudioSynthesizer.js';

export const ALPHA_CONSTANTS = {
  MAX_HEALTH: 1400.0,
  SWEEP_TAIL_RANGE: 4.2,          // Allonge du balayage de queue barbelée (m)
  SWEEP_TAIL_DAMAGE: 92.0,         // Dégâts tranchants du coup de queue
  ACID_VENT_RADIUS: 4.8,           // Rayon de diffusion de la brume acide dorsale
  ACID_VENT_DPS: 28.0,             // Corrosion continue par seconde
  HIVE_CALL_COOLDOWN: 12.0,        // Fréquence d'appel de renforts de ruche
  ENRAGE_HEALTH_RATIO: 0.5,        // Passage en phase 2 à 50% de santé
};

export function createAlphaXenomorphState(spawnPos = { x: 0, y: 0, z: -25 }) {
  return {
    id: `alpha_xeno_${Date.now()}`,
    name: 'Xénomorphe Alpha (Apex Marvel Strain)',
    species: 'xenomorph_alpha',
    x: spawnPos.x,
    y: spawnPos.y,
    z: spawnPos.z,
    health: ALPHA_CONSTANTS.MAX_HEALTH,
    maxHealth: ALPHA_CONSTANTS.MAX_HEALTH,
    isEnraged: false,
    isVentingAcidMist: false,
    ventMistTimer: 0,
    hiveCallTimer: 4.0,
    connectedSwarmletsCount: 0,
    isDead: false,
    carapaceArmorBonus: 0.35,      // 35% de résistance passive aux projectiles légers
  };
}

export function updateAlphaXenomorphDirector(state, delta, hunterEntity, activeSwarmlets = [], audio = audioSynth) {
  if (!state || state.isDead) return { callsReinforcements: false, isAttacking: false };
  const dt = Math.max(0, Number(delta) || 0);

  // Transition de phase : Enrage à 50% HP
  if (!state.isEnraged && (state.health / state.maxHealth) <= ALPHA_CONSTANTS.ENRAGE_HEALTH_RATIO) {
    state.isEnraged = true;
    state.isVentingAcidMist = true;
    state.ventMistTimer = 8.0;

    if (audio && typeof audio.playAlphaXenoRoar === 'function') {
      audio.playAlphaXenoRoar();
    }
  }

  // Émission d'aérosol d'acide moléculaire par les conduits dorsaux
  if (state.isVentingAcidMist) {
    state.ventMistTimer -= dt;
    if (state.ventMistTimer <= 0) {
      state.isVentingAcidMist = state.isEnraged; // Continue en phase enragée
    }

    if (hunterEntity && !hunterEntity.isDead) {
      const hx = hunterEntity.x ?? (hunterEntity.position ? hunterEntity.position.x : 0);
      const hy = hunterEntity.y ?? (hunterEntity.position ? hunterEntity.position.y : 0);
      const hz = hunterEntity.z ?? (hunterEntity.position ? hunterEntity.position.z : 0);

      const dx = hx - state.x;
      const dy = hy - state.y;
      const dz = hz - state.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= ALPHA_CONSTANTS.ACID_VENT_RADIUS) {
        const dmg = ALPHA_CONSTANTS.ACID_VENT_DPS * dt;
        if (typeof hunterEntity.takeDamage === 'function') {
          hunterEntity.takeDamage(dmg, 'alpha_acid_mist');
        } else if (typeof hunterEntity.health === 'number') {
          hunterEntity.health = Math.max(0, hunterEntity.health - dmg);
        }
      }
    }
  }

  // Appel télépathique de renforts à la meute
  let callsReinforcements = false;
  state.hiveCallTimer -= dt;
  if (state.hiveCallTimer <= 0) {
    state.hiveCallTimer = ALPHA_CONSTANTS.HIVE_CALL_COOLDOWN;
    callsReinforcements = true;

    if (audio && typeof audio.playAlphaAcidVentHiss === 'function') {
      audio.playAlphaAcidVentHiss();
    }
  }

  state.connectedSwarmletsCount = activeSwarmlets.filter(s => s && !s.isDead).length;

  return { callsReinforcements, isVenting: state.isVentingAcidMist };
}

export function executeAlphaTailCleave(state, targetEntity, audio = audioSynth) {
  if (!state || state.isDead || !targetEntity || targetEntity.isDead) return null;

  const ex = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const ez = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  const dx = ex - state.x;
  const dz = ez - state.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist <= ALPHA_CONSTANTS.SWEEP_TAIL_RANGE) {
    if (typeof targetEntity.takeDamage === 'function') {
      targetEntity.takeDamage(ALPHA_CONSTANTS.SWEEP_TAIL_DAMAGE, 'alpha_tail_cleave');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - ALPHA_CONSTANTS.SWEEP_TAIL_DAMAGE);
    }

    targetEntity.isKnockedProne = true;

    if (audio && typeof audio.playAlphaXenoRoar === 'function') {
      audio.playAlphaXenoRoar();
    }

    return { damageDealt: ALPHA_CONSTANTS.SWEEP_TAIL_DAMAGE, targetStaggered: true };
  }

  return null;
}
