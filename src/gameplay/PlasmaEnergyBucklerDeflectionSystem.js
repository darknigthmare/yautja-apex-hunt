// Système de Bouclier d'Énergie Plasma et Déviation de Roquettes (The Predator 2018 / Comics — Lore 1:1)
// Référence canonique : The Predator (2018) & Comics — Le Fugitive déployant un bouclier d'énergie plasma sur l'avant-bras gauche pour dévier les roquettes et renvoyer l'onde de choc vers l'ennemi.

import { audioSynth } from '../AudioSynthesizer.js';

export const BUCKLER_CONSTANTS = {
  SHIELD_CAPACITY_HP: 250.0,          // Capacité d'absorption du champ d'énergie plasma
  REFLECTED_BURST_DAMAGE: 120.0,      // Dégâts de l'onde de choc retournée à l'assaillant
  ENERGY_COST_DEPLOY: 12.0,           // Coût énergétique à l'activation
};

export function createPlasmaBucklerState() {
  return {
    isDeployed: false,
    currentShieldHp: BUCKLER_CONSTANTS.SHIELD_CAPACITY_HP,
    totalDeflectionsCount: 0,
  };
}

export function deployPlasmaBuckler(state, audio = audioSynth) {
  if (!state || state.isDeployed) return false;

  state.isDeployed = true;

  if (audio && typeof audio.playPlasmaBucklerDeployHum === 'function') {
    audio.playPlasmaBucklerDeployHum();
  }

  return true;
}

export function deflectHeavyProjectile(state, incomingDamage = 150.0, shooter = null, audio = audioSynth) {
  if (!state || !state.isDeployed) {
    return { deflected: false, damageTaken: incomingDamage };
  }

  state.totalDeflectionsCount++;

  if (audio && typeof audio.playRocketDeflectionEnergyRicochet === 'function') {
    audio.playRocketDeflectionEnergyRicochet();
  }

  // Renvoi de la charge explosive vers le tireur
  const reflectedDmg = BUCKLER_CONSTANTS.REFLECTED_BURST_DAMAGE;
  if (shooter) {
    if (typeof shooter.takeDamage === 'function') {
      shooter.takeDamage(reflectedDmg);
    } else if (typeof shooter.health === 'number') {
      shooter.health = Math.max(0, shooter.health - reflectedDmg);
    }
    shooter.isHitByReflectedBlast = true;
  }

  return {
    deflected: true,
    damageTaken: 0,
    reflectedDamageDealt: reflectedDmg,
  };
}

export function retractPlasmaBuckler(state) {
  if (!state) return false;
  state.isDeployed = false;
  return true;
}
