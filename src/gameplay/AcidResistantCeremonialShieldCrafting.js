// Système d'Artisanat de Bouclier Cérémonial en Chitine Xénomorphe (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Scar découpe la calotte crânienne d'un Xénomorphe pour forger un bouclier anti-acide à Lex Woods

import { audioSynth } from '../AudioSynthesizer.js';

export const SHIELD_CRAFT_CONSTANTS = {
  REQUIRED_CARAPACE_PLATES: 2,         // Nombre de plaques crâniennes nécessaires
  MAX_SHIELD_DURABILITY: 260.0,         // Durabilité totale du bouclier
  ACID_ABSORPTION_FACTOR: 1.0,         // 100% de neutralisation des projections d'acide
  PHYSICAL_ABSORPTION_FACTOR: 0.75,     // 75% de mitigation des attaques au corps-à-corps
  BLOCK_ARC_RADIANS: 2.1,              // Cône frontal de garde d'environ 120 degrés
};

export function createCarapaceShieldCraftState() {
  return {
    collectedPlates: 0,
    isShieldCrafted: false,
    isShieldEquipped: false,
    durability: 0.0,
    blockedAcidIncidents: 0,
    facehuggersRepelled: 0,
  };
}

export function addCarapacePlates(state, count = 1) {
  if (!state) return 0;
  state.collectedPlates += Math.max(0, parseInt(count, 10) || 0);
  return state.collectedPlates;
}

export function craftCarapaceShield(state, audio = audioSynth) {
  if (!state || state.collectedPlates < SHIELD_CRAFT_CONSTANTS.REQUIRED_CARAPACE_PLATES) {
    return { success: false, reason: 'Plaques insuffisantes' };
  }

  state.collectedPlates -= SHIELD_CRAFT_CONSTANTS.REQUIRED_CARAPACE_PLATES;
  state.isShieldCrafted = true;
  state.isShieldEquipped = true;
  state.durability = SHIELD_CRAFT_CONSTANTS.MAX_SHIELD_DURABILITY;

  if (audio && typeof audio.playChitinShieldCraftClank === 'function') {
    audio.playChitinShieldCraftClank();
  }

  return { success: true, durability: state.durability };
}

export function evaluateShieldBlock(state, attack, bearerFacingAngle = 0) {
  if (!state || !state.isShieldEquipped || state.durability <= 0) {
    return { blocked: false, damageTaken: attack?.damage || 0 };
  }

  const attackAngle = attack.angle ?? 0;
  // Calcul de la différence angulaire normalisée [-PI, PI]
  let angleDiff = Math.abs(bearerFacingAngle - attackAngle);
  while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

  const isInBlockArc = angleDiff <= (SHIELD_CRAFT_CONSTANTS.BLOCK_ARC_RADIANS / 2);
  if (!isInBlockArc) {
    return { blocked: false, damageTaken: attack.damage || 0 };
  }

  // Blocage réussi
  const attackType = attack.type || 'physical';
  let damageTaken = 0;

  if (attackType === 'acid' || attackType === 'acid_splash' || attackType === 'acid_mist') {
    // La chitine de tête xénomorphe est totalement invulnérable à son propre acide sanguin
    damageTaken = 0;
    state.blockedAcidIncidents++;
    // Pas de perte de durabilité contre l'acide !
  } else if (attackType === 'facehugger_leap') {
    // Repousse le saut du facehugger sans aucun dégât infligé au porteur
    damageTaken = 0;
    state.facehuggersRepelled++;
  } else {
    // Attaque physique (griffes, queue, balles)
    const baseDamage = attack.damage || 0;
    damageTaken = baseDamage * (1.0 - SHIELD_CRAFT_CONSTANTS.PHYSICAL_ABSORPTION_FACTOR);
    const absorbedDamage = baseDamage * SHIELD_CRAFT_CONSTANTS.PHYSICAL_ABSORPTION_FACTOR;
    state.durability = Math.max(0, state.durability - absorbedDamage * 0.5);

    if (state.durability <= 0) {
      state.isShieldEquipped = false;
    }
  }

  return {
    blocked: true,
    damageTaken,
    remainingDurability: state.durability,
  };
}
