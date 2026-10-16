// Système d'armure crânienne et collier à pointes réfléchissant des Chiens Prédateurs (Lore 1:1)
// Références canoniques : Predators (2010) & The Predator (2018) - Chiens de chasse blindés et colliers épineux

import { audioSynth } from '../AudioSynthesizer.js';

export const HOUND_ARMOR_CONSTANTS = {
  FRONTAL_BULLET_REDUCTION: 0.65, // -65% de dégâts par balle sur la plaque crânienne
  COLLAR_REFLECT_PERCENT: 0.35,   // 35% des dégâts de mêlée renvoyés à l'attaquant
  COLLAR_BLEED_DPS: 14.0,
};

export function equipHoundArmor(hound) {
  if (!hound) return null;
  hound.hasCranialPlate = true;
  hound.hasBarbedCollar = true;
  hound.armorDurability = 200.0;
  return hound;
}

export function processHoundDamage(hound, incomingDamage, attackType = 'bullet', impactAngleDeg = 0, attacker = null, audio = audioSynth) {
  if (!hound) return 0;
  let finalDamage = Number(incomingDamage) || 0;

  // 1. Protection frontale de plaque crânienne contre les projectiles balistiques
  const isFrontal = Math.abs(Number(impactAngleDeg) || 0) <= 60.0;
  if (hound.hasCranialPlate && attackType === 'bullet' && isFrontal) {
    finalDamage *= (1.0 - HOUND_ARMOR_CONSTANTS.FRONTAL_BULLET_REDUCTION);
    if (audio && typeof audio.playHoundArmorRicochet === 'function') {
      audio.playHoundArmorRicochet();
    }
  }

  // 2. Renvoi de dégâts du collier à pointes contre les assauts de corps-à-corps
  if (hound.hasBarbedCollar && (attackType === 'melee' || attackType === 'wristblade') && attacker) {
    const reflectedDamage = incomingDamage * HOUND_ARMOR_CONSTANTS.COLLAR_REFLECT_PERCENT;
    if (typeof attacker.applyDamage === 'function') {
      attacker.applyDamage(reflectedDamage, 'spiked_collar_thorn_retaliation');
    } else if (typeof attacker.health === 'number') {
      attacker.health = Math.max(0, attacker.health - reflectedDamage);
    }
    attacker.isBleeding = true;

    if (audio && typeof audio.playHoundCollarClink === 'function') {
      audio.playHoundCollarClink();
    }
  }

  hound.health = Math.max(0, (hound.health || 100) - finalDamage);
  return finalDamage;
}
