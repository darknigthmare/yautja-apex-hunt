// Système d'Estoc au Combistick à Décharge Interne de Plasma (AVP 2004 / Comics — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) & Comics — L'estoc de lance Combistick couplé à une micro-capsule de plasma explosant à l'empalement pour pulvériser les cavités internes de proies massives.

import { audioSynth } from '../AudioSynthesizer.js';

export const ESTOC_CONSTANTS = {
  KINETIC_THRUST_DAMAGE: 110.0,        // Dégâts de pénétration de la pointe de lance
  INTERNAL_PLASMA_BURST_DAMAGE: 90.0,  // Dégâts de la détonation thermique interne
  PLASMA_ENERGY_COST: 20.0,            // Énergie de gantelet requise pour la charge de pointe
};

export function createCombistickEstocState() {
  return {
    isPlasmaCharged: true,
    totalEstocsExecuted: 0,
  };
}

export function executePlasmaEstocThrust(state, target, energyReserve = 50.0, audio = audioSynth) {
  if (!state || !target) return { success: false, reason: 'INVALID_PARAMS' };
  if (energyReserve < ESTOC_CONSTANTS.PLASMA_ENERGY_COST) {
    return { success: false, reason: 'INSUFFICIENT_ENERGY' };
  }

  if (audio && typeof audio.playCombistickPlasmaEstocBlast === 'function') {
    audio.playCombistickPlasmaEstocBlast();
  }

  const totalDamage = ESTOC_CONSTANTS.KINETIC_THRUST_DAMAGE + ESTOC_CONSTANTS.INTERNAL_PLASMA_BURST_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(totalDamage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - totalDamage);
  }

  target.isImpaledWithPlasma = true;
  state.totalEstocsExecuted++;

  return {
    success: true,
    kineticDamage: ESTOC_CONSTANTS.KINETIC_THRUST_DAMAGE,
    plasmaBurstDamage: ESTOC_CONSTANTS.INTERNAL_PLASMA_BURST_DAMAGE,
    totalDamageDealt: totalDamage,
    energyConsumed: ESTOC_CONSTANTS.PLASMA_ENERGY_COST,
  };
}
