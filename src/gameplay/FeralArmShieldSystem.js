// Bouclier d'avant-bras hexagonal déployable et frappe cinétique (Lore 1:1)
// Référence canonique : Prey (2022) - Le Feral Predator parant balles et flèches avec son bouclier en éventail

import { audioSynth } from '../AudioSynthesizer.js';

export const SHIELD_CONSTANTS = {
  MAX_DURABILITY: 300.0,
  FRONTAL_ARC_DEGREES: 160.0,   // Couverture angulaire frontale (±80°)
  BASH_DAMAGE: 72.0,            // Dégâts tranchants du coup de bouclier
  BASH_STUN_DURATION: 1.8,      // Durée de neutralisation de l'ennemi heurté
  ENERGY_DRAIN_PER_SECOND: 2.5, // Consommation d'énergie du champ de maintien
};

export function createFeralShieldState() {
  return {
    isDeployed: false,
    durability: SHIELD_CONSTANTS.MAX_DURABILITY,
    maxDurability: SHIELD_CONSTANTS.MAX_DURABILITY,
    isBroken: false,
    bashCooldown: 0,
  };
}

export function toggleFeralShield(state, audio = audioSynth) {
  if (!state || state.isBroken) return false;
  state.isDeployed = !state.isDeployed;

  if (state.isDeployed && audio && typeof audio.playShieldDeploy === 'function') {
    audio.playShieldDeploy();
  }
  return state.isDeployed;
}

export function blockIncomingAttack(state, incomingDamage, impactAngleDeg = 0, audio = audioSynth) {
  if (!state || !state.isDeployed || state.isBroken) return false;

  const angle = Math.abs(Number(impactAngleDeg) || 0);
  const halfArc = SHIELD_CONSTANTS.FRONTAL_ARC_DEGREES / 2.0;

  // L'attaque doit frapper dans l'arc frontal de 160°
  if (angle > halfArc) return false;

  const dmg = Number(incomingDamage) || 0;
  state.durability = Math.max(0, state.durability - dmg);

  if (state.durability <= 0) {
    state.isBroken = true;
    state.isDeployed = false;
  }

  if (audio && typeof audio.playShieldBulletDeflect === 'function') {
    audio.playShieldBulletDeflect();
  }
  return true; // Dégâts totalement absorbés
}

export function performShieldBash(state, targetEntity, audio = audioSynth) {
  if (!state || !state.isDeployed || state.isBroken || state.bashCooldown > 0) return false;

  state.bashCooldown = 1.2;

  if (targetEntity) {
    if (typeof targetEntity.applyDamage === 'function') {
      targetEntity.applyDamage(SHIELD_CONSTANTS.BASH_DAMAGE, 'hexagonal_shield_bash');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - SHIELD_CONSTANTS.BASH_DAMAGE);
    }
    targetEntity.isStaggered = true;
    targetEntity.stunTimer = SHIELD_CONSTANTS.BASH_STUN_DURATION;
  }

  if (audio && typeof audio.playShieldBashImpact === 'function') {
    audio.playShieldBashImpact();
  }
  return true;
}

export function updateFeralShield(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.bashCooldown > 0) {
    state.bashCooldown = Math.max(0, state.bashCooldown - dt);
  }

  // Régénération lente de durabilité si rétracté
  if (!state.isDeployed && state.durability < state.maxDurability) {
    state.durability = Math.min(state.maxDurability, state.durability + 15.0 * dt);
    if (state.durability > 50.0) {
      state.isBroken = false;
    }
  }
}
