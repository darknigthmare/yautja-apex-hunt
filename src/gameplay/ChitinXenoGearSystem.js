// Équipement rituel en chitine de Xénomorphe : Bouclier anti-acide et lance caudale (Lore 1:1)
// Référence canonique : Alien vs Predator (2004) - Scar forgeant le bouclier et la lance pour Lex Woods

import { audioSynth } from '../AudioSynthesizer.js';

export const CHITIN_GEAR_CONSTANTS = {
  ACID_IMMUNITY_FACTOR: 1.0,    // 100% d'immunité contre les projections d'acide
  TAIL_SPEAR_DAMAGE: 92.0,      // Dégâts perforants de base
  XENO_BONUS_MULTIPLIER: 1.45,  // +45% de dégâts contre les Xénomorphes
  BLEED_DPS: 16.0,
  BLEED_DURATION: 4.0,
};

export function craftChitinXenoGear(hasXenoSkullPlate = true, hasXenoTailBarb = true) {
  return {
    shield: hasXenoSkullPlate ? {
      name: 'Bouclier Carapace Xénomorphe',
      isAcidProof: true,
      durability: 350.0,
      deflectAngleDeg: 120.0,
    } : null,
    tailSpear: hasXenoTailBarb ? {
      name: 'Lance Caudale Dentelée',
      damage: CHITIN_GEAR_CONSTANTS.TAIL_SPEAR_DAMAGE,
      armorPiercing: true,
    } : null,
  };
}

export function deflectWithChitinShield(shield, attackType = 'acid_splash', audio = audioSynth) {
  if (!shield) return false;

  // Immunité absolue à l'acide moléculaire
  if (attackType === 'acid_splash' || attackType === 'molecular_acid') {
    if (audio && typeof audio.playShieldBulletDeflect === 'function') {
      audio.playShieldBulletDeflect();
    }
    return true; // Dégâts acides complètement annulés
  }

  // Protection contre attaques physiques
  shield.durability = Math.max(0, shield.durability - 15.0);
  if (audio && typeof audio.playShieldBulletDeflect === 'function') {
    audio.playShieldBulletDeflect();
  }
  return true;
}

export function strikeWithTailSpear(spear, targetEntity, audio = audioSynth) {
  if (!spear || !targetEntity) return 0;

  const isXenomorph = Boolean(
    targetEntity.species === 'Xenomorph' ||
    targetEntity.isXenomorph ||
    targetEntity.type?.includes('alien')
  );

  const multiplier = isXenomorph ? CHITIN_GEAR_CONSTANTS.XENO_BONUS_MULTIPLIER : 1.0;
  const finalDamage = spear.damage * multiplier;

  if (typeof targetEntity.applyDamage === 'function') {
    targetEntity.applyDamage(finalDamage, 'tail_spear_pierce');
  } else if (typeof targetEntity.health === 'number') {
    targetEntity.health = Math.max(0, targetEntity.health - finalDamage);
  }

  // Application du saignement dentelé
  targetEntity.isBleeding = true;
  targetEntity.bleedDps = CHITIN_GEAR_CONSTANTS.BLEED_DPS;
  targetEntity.bleedTimer = CHITIN_GEAR_CONSTANTS.BLEED_DURATION;

  return finalDamage;
}
