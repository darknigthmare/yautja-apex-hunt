// Directeur d'Armure Dermo-Squelettique de l'Upgrade Predator (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — L'Upgrade Predator de 3,30m doté d'un exosquelette chitineux naturel déviant les tirs d'armes légères

import { audioSynth } from '../AudioSynthesizer.js';

export const UPGRADE_PREDATOR_CONSTANTS = {
  BASE_HEALTH: 650.0,
  EXO_BALLISTIC_RESISTANCE: 0.70,      // 70% des dégâts par balles déviés naturellement
  SMASH_DAMAGE: 110.0,                 // Dégâts de charge de force brute
  KNOCKBACK_FORCE: 18.0,               // Projection cinétique de la cible
  PULSE_INTERVAL: 4.5,                 // Fréquence de pulsation thermique organique sans masque (s)
};

export function createUpgradePredatorState() {
  return {
    health: UPGRADE_PREDATOR_CONSTANTS.BASE_HEALTH,
    maxHealth: UPGRADE_PREDATOR_CONSTANTS.BASE_HEALTH,
    pulseTimer: 0.0,
    deflectedBullets: 0,
    trackedTargetsCount: 0,
  };
}

export function processExoArmorHit(state, rawDamage = 40.0, audio = audioSynth) {
  if (!state || state.health <= 0) return { absorbed: 0, damageTaken: 0 };

  const damage = Number(rawDamage) || 0;
  const absorbed = damage * UPGRADE_PREDATOR_CONSTANTS.EXO_BALLISTIC_RESISTANCE;
  const effectiveDamage = damage * (1.0 - UPGRADE_PREDATOR_CONSTANTS.EXO_BALLISTIC_RESISTANCE);

  state.health = Math.max(0, state.health - effectiveDamage);
  state.deflectedBullets++;

  if (audio && typeof audio.playUpgradeExoArmorDeflectPing === 'function') {
    audio.playUpgradeExoArmorDeflectPing();
  }

  return {
    absorbedDamage: absorbed,
    damageTaken: effectiveDamage,
    remainingHealth: state.health,
  };
}

export function performBruteForceSmash(state, victimEntity) {
  if (!state || !victimEntity || victimEntity.isDead) return false;

  const dmg = UPGRADE_PREDATOR_CONSTANTS.SMASH_DAMAGE;
  if (typeof victimEntity.takeDamage === 'function') {
    victimEntity.takeDamage(dmg, 'upgrade_brute_smash');
  } else if (typeof victimEntity.health === 'number') {
    victimEntity.health = Math.max(0, victimEntity.health - dmg);
  }

  victimEntity.isKnockedBack = true;
  victimEntity.knockbackForce = UPGRADE_PREDATOR_CONSTANTS.KNOCKBACK_FORCE;
  victimEntity.isStaggered = true;
  victimEntity.staggerTimer = 2.0;

  return true;
}

export function updateUpgradePredatorDirector(state, delta, targets = []) {
  if (!state || state.health <= 0) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.pulseTimer += dt;
  if (state.pulseTimer >= UPGRADE_PREDATOR_CONSTANTS.PULSE_INTERVAL) {
    state.pulseTimer = 0.0;

    // Scan thermique organique autonome sans bio-masque
    let tracked = 0;
    for (const t of targets) {
      if (!t || t.isDead) continue;
      t.isOrganicallyTracked = true;
      tracked++;
    }
    state.trackedTargetsCount = tracked;
  }
}
