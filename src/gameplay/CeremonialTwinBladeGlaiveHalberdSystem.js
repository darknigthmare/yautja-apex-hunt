// Hallebarde Glaive Cérémoniale à Double Lame Rétractable (Predator 2 / Elder Lore — Fidélité 1:1)
// Référence canonique : Predator 2 (Lost Tribe) & AVP — Le Glaive cérémonial à double fer incurvé permettant des moulinets circulaires anti-essaim à 360 degrés et des frappes d'hast lourdes.

import { audioSynth } from '../AudioSynthesizer.js';

export const CEREMONIAL_GLAIVE_CONSTANTS = {
  WHIRLWIND_RADIUS_M: 4.2,           // Rayon du moulinet circulaire à 360 degrés
  WHIRLWIND_CLEAVE_DAMAGE: 165,      // Dégâts de fente sur chaque cible dans le cercle
  BLEED_STACK_DAMAGE: 35,            // Hémorragie additionnelle par entaille de lame jumelle
};

export function createCeremonialGlaiveState() {
  return {
    isTwinBladesLocked: false,
    whirlwindsExecuted: 0,
  };
}

export function lockGlaiveTwinBlades(state, audio = audioSynth) {
  if (!state) return false;
  state.isTwinBladesLocked = true;

  if (audio && typeof audio.playCeremonialGlaiveTwinBladeSnap === 'function') {
    audio.playCeremonialGlaiveTwinBladeSnap();
  }

  return true;
}

export function executeGlaiveWhirlwindSweep(state, originPos = { x: 0, z: 0 }, surroundingEnemies = [], audio = audioSynth) {
  if (!state || !state.isTwinBladesLocked) {
    return { swept: false, hitCount: 0 };
  }

  state.whirlwindsExecuted++;

  if (audio && typeof audio.playGlaiveWhirlwindCleaveWhoosh === 'function') {
    audio.playGlaiveWhirlwindCleaveWhoosh();
  }

  let hitCount = 0;
  const totalDmg = CEREMONIAL_GLAIVE_CONSTANTS.WHIRLWIND_CLEAVE_DAMAGE + CEREMONIAL_GLAIVE_CONSTANTS.BLEED_STACK_DAMAGE;

  if (Array.isArray(surroundingEnemies)) {
    for (const enemy of surroundingEnemies) {
      if (!enemy) continue;
      const dist = Math.hypot((enemy.x || 0) - (originPos.x || 0), (enemy.z || 0) - (originPos.z || 0));
      if (dist <= CEREMONIAL_GLAIVE_CONSTANTS.WHIRLWIND_RADIUS_M) {
        enemy.isCleavedByGlaive = true;
        hitCount++;

        if (typeof enemy.takeDamage === 'function') {
          enemy.takeDamage(totalDmg);
        } else if (typeof enemy.health === 'number') {
          enemy.health = Math.max(0, enemy.health - totalDmg);
        }
      }
    }
  }

  return {
    swept: true,
    hitCount,
    damagePerTarget: totalDmg,
  };
}
