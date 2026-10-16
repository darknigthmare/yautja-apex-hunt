// Perturbation du camouflage optique Yautja par l'eau et les intempéries (Lore 1:1)
// Référence canonique : Predator (1987) (cascade et ruisseau), Predator 2 (1990) (abattoir)

import { audioSynth } from '../AudioSynthesizer.js';

export function createCloakDisruptionTracker() {
  return {
    disruptionIntensity: 0,
    waterContactDuration: 0,
    isFlickering: false,
    forcedCloakDrop: false,
    soundCooldown: 0,
  };
}

export function evaluateEnvironmentalMoisture(playerPos, biomeId, weatherState = {}) {
  let moisture = 0;
  const y = Number(playerPos?.y) || 0;

  // Présence d'eau au sol (rivières, marais, étangs de jungle)
  if (biomeId === 'jungle' || biomeId === 'temple_bouvet') {
    if (y <= 0.6) {
      moisture += 0.85; // immersion partielle ou totale
    } else if (y <= 1.2) {
      moisture += 0.35; // éclaboussures
    }
  }

  // Pluie tropicale ou ruissellement intense
  if (weatherState.isRaining) {
    moisture += Number(weatherState.rainIntensity) || 0.45;
  }

  // Brume / condensation saturée
  if (weatherState.isFoggy || weatherState.steamActive) {
    moisture += 0.25;
  }

  return Math.min(1.0, moisture);
}

export function updateCloakDisruption(tracker, delta, playerPos, biomeId, weatherState = {}, playerEquipment = {}, audio = audioSynth) {
  if (!tracker) return { isFlickering: false, forcedCloakDrop: false, intensity: 0 };
  const dt = Math.max(0, Number(delta) || 0);

  tracker.soundCooldown = Math.max(0, tracker.soundCooldown - dt);

  const rawMoisture = evaluateEnvironmentalMoisture(playerPos, biomeId, weatherState);

  // Résistance de l'armure (ex: alliage étanche de Cleaner ou upgrade anti-acide)
  const hasWaterproofing = playerEquipment.hasAntiAcidCloak
    || playerEquipment.armorFinishId === 'finish_cleaner_acid_resistant'
    || playerEquipment.armorFinishId === 'finish_celtic_battle_aged';

  const dampeningFactor = hasWaterproofing ? 0.2 : 1.0;
  tracker.disruptionIntensity = rawMoisture * dampeningFactor;

  if (tracker.disruptionIntensity > 0.3) {
    tracker.waterContactDuration += dt;
    tracker.isFlickering = true;

    if (tracker.soundCooldown <= 0 && audio && typeof audio.playCloakShortCircuit === 'function') {
      audio.playCloakShortCircuit();
      tracker.soundCooldown = 1.4;
    }

    // Si immersion prolongée sans alliage étanche, coupure brutale du camouflage
    if (tracker.waterContactDuration >= 2.5 && !hasWaterproofing) {
      tracker.forcedCloakDrop = true;
    } else {
      tracker.forcedCloakDrop = false;
    }
  } else {
    tracker.waterContactDuration = Math.max(0, tracker.waterContactDuration - dt * 2.0);
    tracker.isFlickering = false;
    tracker.forcedCloakDrop = false;
  }

  return {
    intensity: tracker.disruptionIntensity,
    isFlickering: tracker.isFlickering,
    forcedCloakDrop: tracker.forcedCloakDrop,
    waterContactDuration: tracker.waterContactDuration,
  };
}
