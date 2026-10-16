// Secteur de niveau Abattoir frigorifique de Los Angeles 1990 (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Piège de l'OWLF (Peter Keyes) avec carcasses suspendues et azote liquide

import { audioSynth } from '../AudioSynthesizer.js';

export const SLAUGHTERHOUSE_CONSTANTS = {
  FROZEN_CARCASS_TEMP: -2.0,       // Température des carcasses de bœuf masquant la signature thermique
  NITROGEN_FREEZE_DURATION: 14.0,  // Durée du jet d'azote liquide
  NITROGEN_TEMPERATURE: -52.0,     // Température cryogénique de l'azote
};

export function createSlaughterhouseSector(options = {}) {
  return {
    carcasses: [],
    rails: [],
    nitrogenTrapsActive: false,
    nitrogenTimer: 0,
    nitrogenCooldown: 0,
    ambientTemperature: 2.0, // Chambre froide à 2°C
  };
}

export function addHangingCarcass(sector, carcass) {
  if (!sector || !carcass) return null;
  const item = {
    id: carcass.id || `beef_carcass_${sector.carcasses.length + 1}`,
    x: Number(carcass.x) || 0,
    y: Number(carcass.y) || 2.2, // Suspendu à ~2.2m de hauteur
    z: Number(carcass.z) || 0,
    swingAngle: 0,
    swingVelocity: 0,
    health: 200,
    temperatureCelsius: SLAUGHTERHOUSE_CONSTANTS.FROZEN_CARCASS_TEMP,
    radius: 0.8,
  };
  sector.carcasses.push(item);
  return item;
}

export function perturbCarcass(carcass, impulse = 1.0, audio = audioSynth) {
  if (!carcass) return;
  carcass.swingVelocity += impulse;
  if (audio && typeof audio.playMeatHookRattle === 'function') {
    audio.playMeatHookRattle();
  }
}

export function triggerNitrogenRelease(sector, audio = audioSynth) {
  if (!sector || sector.nitrogenTrapsActive || sector.nitrogenCooldown > 0) return false;

  sector.nitrogenTrapsActive = true;
  sector.nitrogenTimer = SLAUGHTERHOUSE_CONSTANTS.NITROGEN_FREEZE_DURATION;
  sector.ambientTemperature = SLAUGHTERHOUSE_CONSTANTS.NITROGEN_TEMPERATURE;

  if (audio && typeof audio.playNitrogenVentBlast === 'function') {
    audio.playNitrogenVentBlast();
  }
  return true;
}

export function updateSlaughterhouseSector(sector, delta, entity, audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  // 1. Oscillation physique des carcasses suspendues
  for (const c of sector.carcasses) {
    if (Math.abs(c.swingAngle) > 0.001 || Math.abs(c.swingVelocity) > 0.001) {
      c.swingVelocity -= c.swingAngle * 9.8 * dt; // Force de rappel pendulaire
      c.swingVelocity *= 0.95; // Amortissement frictionnel
      c.swingAngle += c.swingVelocity * dt;
    }
  }

  // 2. Gestion du piège d'azote cryogénique
  if (sector.nitrogenTrapsActive) {
    sector.nitrogenTimer -= dt;
    if (sector.nitrogenTimer <= 0) {
      sector.nitrogenTrapsActive = false;
      sector.ambientTemperature = 2.0;
      sector.nitrogenCooldown = 20.0;
    }

    if (entity) {
      // L'azote liquide désactive le camouflage optique et perturbe la visière infrarouge
      if (entity.cloakState) {
        entity.cloakState.isCloaked = false;
        entity.cloakState.circuitFrozen = true;
      }
      if (entity.apparentTemperatureCelsius !== undefined) {
        entity.apparentTemperatureCelsius = SLAUGHTERHOUSE_CONSTANTS.NITROGEN_TEMPERATURE;
      }
    }
  } else if (sector.nitrogenCooldown > 0) {
    sector.nitrogenCooldown = Math.max(0, sector.nitrogenCooldown - dt);
  }
}

export function checkCarcassOcclusion(sector, startPos, endPos) {
  if (!sector || !startPos || !endPos) return false;
  // Vérification de collision rayon-sphère/cylindre simplifié sur chaque carcasse
  for (const c of sector.carcasses) {
    const midX = (startPos.x + endPos.x) / 2;
    const midZ = (startPos.z + endPos.z) / 2;
    const distToCarcass = Math.sqrt((c.x - midX) ** 2 + (c.z - midZ) ** 2);
    if (distToCarcass < c.radius) {
      return true; // Occlusion thermique et pare-balles assurée
    }
  }
  return false;
}
