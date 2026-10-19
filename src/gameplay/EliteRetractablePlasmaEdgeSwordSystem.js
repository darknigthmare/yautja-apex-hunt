// Épée Énergétique Rétractable d'Élite Yautja (AVP / Clan Leader Lore — Fidélité 1:1)
// Référence canonique : Aliens vs. Predator & Clan Leader Lore — L'épée monomoléculaire rétractable à fil chauffé au plasma maniée par les Élites et Anciens pour trancher net les blindages lourds et exosquelettes de Praetorians.

import { audioSynth } from '../AudioSynthesizer.js';

export const PLASMA_SWORD_CONSTANTS = {
  CLEAVE_BASE_DAMAGE: 215,           // Dégâts de coupe ignée à une main
  ARMOR_IGNORE_RATIO: 1.0,           // Ignore 100% de la réduction d'armure et des parades
  ENERGY_DRAIN_PER_SWING: 12,        // Consommation d'énergie plasma par taillade
};

export function createPlasmaEdgeSwordState() {
  return {
    isExtended: false,
    totalArmorsCleaved: 0,
  };
}

export function extendPlasmaEdgeSword(state, audio = audioSynth) {
  if (!state) return false;
  state.isExtended = true;

  if (audio && typeof audio.playPlasmaEdgeSwordExtendHum === 'function') {
    audio.playPlasmaEdgeSwordExtendHum();
  }

  return true;
}

export function executePlasmaSwordCleave(state, target, hunter = null, audio = audioSynth) {
  if (!state || !state.isExtended || !target) {
    return { cleaved: false, damageDealt: 0 };
  }

  if (hunter && typeof hunter.energy === 'number') {
    if (hunter.energy < PLASMA_SWORD_CONSTANTS.ENERGY_DRAIN_PER_SWING) {
      return { cleaved: false, reason: 'insufficient_energy' };
    }
    hunter.energy -= PLASMA_SWORD_CONSTANTS.ENERGY_DRAIN_PER_SWING;
  }

  if (audio && typeof audio.playPlasmaSwordArmorCleaveSizzle === 'function') {
    audio.playPlasmaSwordArmorCleaveSizzle();
  }

  target.isArmorMeltedBySword = true;
  target.isParrying = false;
  state.totalArmorsCleaved++;

  const dmg = PLASMA_SWORD_CONSTANTS.CLEAVE_BASE_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(dmg);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - dmg);
  }

  return {
    cleaved: true,
    damageDealt: dmg,
    armorBypassed: true,
  };
}
