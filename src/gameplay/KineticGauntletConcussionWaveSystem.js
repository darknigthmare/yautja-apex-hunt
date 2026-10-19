// Gantelet de Choc Cinétique & Onde de Concussion (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Le gantelet de frappe cinétique projetant une onde de choc directionnelle qui pulvérise les boucliers balistiques et projette les escouades Stargazer.

import { audioSynth } from '../AudioSynthesizer.js';

export const KINETIC_GAUNTLET_CONSTANTS = {
  SHOCKWAVE_RANGE_M: 6.0,            // Portée de l'onde de choc sismique
  CONCUSSION_DAMAGE: 135,            // Dégâts d'impact cinétique
  SHIELD_BREACH_MULTIPLIER: 2.0,     // Double dégâts contre cibles équipées de bouclier
};

export function createKineticGauntletState() {
  return {
    kineticCharge: 100,
    shieldsShatteredCount: 0,
  };
}

export function unleashKineticConcussionSlam(state, originPos = { x: 0, z: 0 }, hostiles = [], audio = audioSynth) {
  if (!state || state.kineticCharge < 50) {
    return { unleashed: false, affectedCount: 0 };
  }

  state.kineticCharge -= 50;

  if (audio && typeof audio.playKineticGauntletShockwaveSlam === 'function') {
    audio.playKineticGauntletShockwaveSlam();
  }

  let affectedCount = 0;
  if (Array.isArray(hostiles)) {
    for (const enemy of hostiles) {
      if (!enemy) continue;
      const dist = Math.hypot((enemy.x || 0) - (originPos.x || 0), (enemy.z || 0) - (originPos.z || 0));
      if (dist <= KINETIC_GAUNTLET_CONSTANTS.SHOCKWAVE_RANGE_M) {
        affectedCount++;
        enemy.isKnockedDown = true;

        if (enemy.hasRiotShield) {
          enemy.hasRiotShield = false;
          state.shieldsShatteredCount++;
          if (audio && typeof audio.playRiotShieldShatterCrunch === 'function') {
            audio.playRiotShieldShatterCrunch();
          }
        }

        const dmg = KINETIC_GAUNTLET_CONSTANTS.CONCUSSION_DAMAGE;
        if (typeof enemy.takeDamage === 'function') {
          enemy.takeDamage(dmg);
        } else if (typeof enemy.health === 'number') {
          enemy.health = Math.max(0, enemy.health - dmg);
        }
      }
    }
  }

  return {
    unleashed: true,
    affectedCount,
    shieldsShattered: state.shieldsShatteredCount,
  };
}
