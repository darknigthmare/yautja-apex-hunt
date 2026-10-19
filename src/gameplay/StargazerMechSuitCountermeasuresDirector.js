// Exosquelette Mécanique Anti-Predator Stargazer & Sabotage Articulaire (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Les armures motorisées lourdes et prototypes anti-Yautja équipés de lance-missiles d'épaule, neutralisables en ciblant leurs servomoteurs hydrauliques dorsaux.

import { audioSynth } from '../AudioSynthesizer.js';

export const STARGAZER_MECH_CONSTANTS = {
  MISSILE_SALVO_DAMAGE: 140,         // Dégâts de la salve de micro-missiles du Mech
  SERVO_SABOTAGE_DAMAGE: 280,        // Dégâts critiques en arrachant les conduites hydrauliques
};

export function createStargazerMechDirectorState() {
  return {
    isMechActive: true,
    isServoSabotaged: false,
    salvosFired: 0,
  };
}

export function fireMechShoulderMissileSalvo(state, targetHunter, audio = audioSynth) {
  if (!state || !state.isMechActive || state.isServoSabotaged || !targetHunter) {
    return { fired: false, damageDealt: 0 };
  }

  state.salvosFired++;

  if (audio) {
    if (typeof audio.playStargazerMechSuitServoStomp === 'function') {
      audio.playStargazerMechSuitServoStomp();
    }
    if (typeof audio.playMechShoulderMissileSalvoWhoosh === 'function') {
      audio.playMechShoulderMissileSalvoWhoosh();
    }
  }

  if (typeof targetHunter.takeDamage === 'function') {
    targetHunter.takeDamage(STARGAZER_MECH_CONSTANTS.MISSILE_SALVO_DAMAGE);
  } else if (typeof targetHunter.health === 'number') {
    targetHunter.health = Math.max(0, targetHunter.health - STARGAZER_MECH_CONSTANTS.MISSILE_SALVO_DAMAGE);
  }

  return {
    fired: true,
    damageDealt: STARGAZER_MECH_CONSTANTS.MISSILE_SALVO_DAMAGE,
  };
}

export function sabotageMechHydraulicServos(state, mechEntity) {
  if (!state || !mechEntity) return { sabotaged: false };

  state.isServoSabotaged = true;
  mechEntity.isImmobilizedBySabotage = true;
  mechEntity.canMove = false;

  if (typeof mechEntity.takeDamage === 'function') {
    mechEntity.takeDamage(STARGAZER_MECH_CONSTANTS.SERVO_SABOTAGE_DAMAGE);
  } else if (typeof mechEntity.health === 'number') {
    mechEntity.health = Math.max(0, mechEntity.health - STARGAZER_MECH_CONSTANTS.SERVO_SABOTAGE_DAMAGE);
  }

  return {
    sabotaged: true,
    damageDealt: STARGAZER_MECH_CONSTANTS.SERVO_SABOTAGE_DAMAGE,
  };
}
