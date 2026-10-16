// Secteur de Niveau : Rame de Métro Stroboscopique (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Massacre dans la rame de métro de Los Angeles sous néons stroboscopiques

import { audioSynth } from '../AudioSynthesizer.js';

export const SUBWAY_CONSTANTS = {
  CARRIAGE_LENGTH: 22.0,           // Longueur d'une voiture de métro (m)
  CARRIAGE_WIDTH: 3.2,             // Largeur étroite du couloir central (m)
  CARRIAGE_HEIGHT: 2.6,            // Hauteur sous plafond avec barres de maintien
  SWAY_FREQUENCY: 0.85,            // Oscillation latérale due au roulement sur rails (Hz)
  SWAY_AMPLITUDE: 0.35,            // Déport d'inertie latéral (m)
  STROBE_CYCLE_INTERVAL: 4.0,      // Période d'alternance des régimes d'éclairage
};

export const LIGHT_PHASES = {
  PITCH_BLACK: 'PITCH_BLACK',      // Obscurité totale : camouflage invisible (99%), terreur des passagers
  STROBE_FLASH: 'STROBE_FLASH',    // Clignotement violent à 12Hz : silhouettes découpées, tirs d'armes automatiques
  EMERGENCY_RED: 'EMERGENCY_RED',  // Éclairage de secours rougeoyant tamisé
};

export function createSubwayCarriageState() {
  return {
    currentPhase: LIGHT_PHASES.STROBE_FLASH,
    phaseTimer: 0,
    swayOffset: 0,
    swayPhase: 0,
    isTrainInMotion: true,
    lightFlickerRate: 12.0,
    flickerTimer: 0,
    isFlickerOn: true,
    passengerPanicLevel: 0.85,
    hunterVisibilityModifier: 0.2,
    handStrapNodes: [
      { id: 'strap_1', x: -0.6, y: 2.1, z: -8.0, swayAngle: 0 },
      { id: 'strap_2', x: 0.6, y: 2.1, z: -4.0, swayAngle: 0 },
      { id: 'strap_3', x: -0.6, y: 2.1, z: 0.0, swayAngle: 0 },
      { id: 'strap_4', x: 0.6, y: 2.1, z: 4.0, swayAngle: 0 },
      { id: 'strap_5', x: -0.6, y: 2.1, z: 8.0, swayAngle: 0 },
    ],
  };
}

export function updateSubwayCarriage(state, delta, audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Oscillation d'inertie du train sur les rails
  if (state.isTrainInMotion) {
    state.swayPhase += dt * Math.PI * 2 * SUBWAY_CONSTANTS.SWAY_FREQUENCY;
    state.swayOffset = Math.sin(state.swayPhase) * SUBWAY_CONSTANTS.SWAY_AMPLITUDE;

    for (const strap of state.handStrapNodes) {
      strap.swayAngle = Math.sin(state.swayPhase + strap.z * 0.1) * 0.4;
    }
  }

  // Gestion des cycles d'éclairage stroboscopique
  state.phaseTimer += dt;
  if (state.phaseTimer >= SUBWAY_CONSTANTS.STROBE_CYCLE_INTERVAL) {
    state.phaseTimer -= SUBWAY_CONSTANTS.STROBE_CYCLE_INTERVAL;

    if (state.currentPhase === LIGHT_PHASES.STROBE_FLASH) {
      state.currentPhase = LIGHT_PHASES.PITCH_BLACK;
      state.hunterVisibilityModifier = 0.01; // Invisibilité presque totale dans le noir absolu
    } else if (state.currentPhase === LIGHT_PHASES.PITCH_BLACK) {
      state.currentPhase = LIGHT_PHASES.EMERGENCY_RED;
      state.hunterVisibilityModifier = 0.45;
      if (audio && typeof audio.playSubwayFluorescentHum === 'function') {
        audio.playSubwayFluorescentHum();
      }
    } else {
      state.currentPhase = LIGHT_PHASES.STROBE_FLASH;
      state.hunterVisibilityModifier = 0.85; // Réfraction du camouflage révélée par les flashs
    }
  }

  // Battement stroboscopique ultra-rapide pendant la phase FLASH
  if (state.currentPhase === LIGHT_PHASES.STROBE_FLASH) {
    state.flickerTimer += dt;
    if (state.flickerTimer >= (1.0 / state.lightFlickerRate)) {
      state.flickerTimer = 0;
      state.isFlickerOn = !state.isFlickerOn;
      if (state.isFlickerOn && audio && typeof audio.playStrobeFlickerClick === 'function') {
        audio.playStrobeFlickerClick();
      }
    }
  } else {
    state.isFlickerOn = state.currentPhase === LIGHT_PHASES.EMERGENCY_RED;
  }
}

export function evaluateSubwayAimAccuracy(state, isShooting) {
  if (!state) return 1.0;
  // L'oscillation du train perturbe la visée des armes à feu et du plasmacaster
  const swayPenalty = Math.abs(state.swayOffset) * 0.35;
  const lightFactor = state.currentPhase === LIGHT_PHASES.PITCH_BLACK ? 0.3 : (state.isFlickerOn ? 1.0 : 0.6);
  return Math.max(0.2, (1.0 - swayPenalty) * lightFactor);
}
