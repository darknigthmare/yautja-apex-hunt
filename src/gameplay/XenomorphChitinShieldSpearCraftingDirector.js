// Directeur d'Artisanat de Bouclier Crânien et Lance Caudale Xénomorphe (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Scar dépeçant un drone xénomorphe pour forger un bouclier dans sa calotte crânienne et une lance dans sa queue pour Lex Woods.

import { audioSynth } from '../AudioSynthesizer.js';

export const CHITIN_GEAR_CONSTANTS = {
  ACID_IMMUNITY: true,                // Immunité intégrale aux éclaboussures d'acide de sang
  SPEAR_THRUST_DAMAGE: 110.0,         // Dégâts d'estoc de la lance caudale
  ALLIANCE_RITUAL_SCORE: 300,         // Gain d'honneur pour alliance de chasse et transmission d'armement
};

export function createChitinGearCraftingState() {
  return {
    isCrafted: false,
    craftedForHero: null,
    totalSpearStrikes: 0,
  };
}

export function craftXenomorphEquipment(state, xenoCorpse, recipient, audio = audioSynth) {
  if (!state || !xenoCorpse || !recipient) return false;

  state.isCrafted = true;
  state.craftedForHero = recipient.id || 'hero_lex';

  recipient.hasChitinSkullShield = true;
  recipient.hasTailSpear = true;
  recipient.isAcidImmune = true;

  if (audio && typeof audio.playChitinShieldDeflectionThud === 'function') {
    audio.playChitinShieldDeflectionThud();
  }

  return true;
}

export function executeTailSpearThrust(state, recipient, target, audio = audioSynth) {
  if (!state || !state.isCrafted || !recipient?.hasTailSpear || !target) {
    return { success: false, reason: 'NOT_EQUIPPED' };
  }

  if (audio && typeof audio.playTailSpearJabCrunch === 'function') {
    audio.playTailSpearJabCrunch();
  }

  const damage = CHITIN_GEAR_CONSTANTS.SPEAR_THRUST_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  state.totalSpearStrikes++;
  target.isSkewered = true;

  return {
    success: true,
    damageDealt: damage,
    skewered: true,
  };
}
