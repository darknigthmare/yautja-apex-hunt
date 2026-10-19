// Secteur de Corrosion Acide de Visière de Bio-Masque et Recalibrage Optique (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Le bio-masque de Scar attaqué par des éclaboussures d'acide de sang xénomorphe, altérant les capteurs optiques et nécessitant une purge thermique.

import { audioSynth } from '../AudioSynthesizer.js';

export const MASK_ETCH_CONSTANTS = {
  MAX_MASK_INTEGRITY: 100.0,           // Intégrité initiale de la visière
  HUD_DISTORTION_THRESHOLD: 65.0,      // Seuil d'intégrité en-dessous duquel les artéfacts HUD apparaissent
  PURGE_CYCLE_DURATION_SEC: 2.5,       // Durée de la purge thermique par micro-décharge
  MAX_CHROMATIC_ABERRATION: 0.85,      // Intensité maximale de distorsion kaléidoscopique
};

export function createBioMaskAcidState() {
  return {
    maskIntegrity: MASK_ETCH_CONSTANTS.MAX_MASK_INTEGRITY,
    isHudDistorted: false,
    distortionIntensity: 0.0,
    isPurging: false,
    purgeTimer: 0.0,
  };
}

export function applyAcidSplashToMask(state, acidDamage = 25.0, audio = audioSynth) {
  if (!state) return { damaged: false };

  state.maskIntegrity = Math.max(0, state.maskIntegrity - acidDamage);

  if (audio && typeof audio.playAcidGlassCorrosionSizzle === 'function') {
    audio.playAcidGlassCorrosionSizzle();
  }

  if (state.maskIntegrity <= MASK_ETCH_CONSTANTS.HUD_DISTORTION_THRESHOLD) {
    state.isHudDistorted = true;
    const lossRatio = (MASK_ETCH_CONSTANTS.HUD_DISTORTION_THRESHOLD - state.maskIntegrity) / MASK_ETCH_CONSTANTS.HUD_DISTORTION_THRESHOLD;
    state.distortionIntensity = Math.min(MASK_ETCH_CONSTANTS.MAX_CHROMATIC_ABERRATION, lossRatio);
  }

  return {
    damaged: true,
    currentIntegrity: state.maskIntegrity,
    hudDistorted: state.isHudDistorted,
    distortionLevel: state.distortionIntensity,
  };
}

export function initiateMaskOpticalPurge(state) {
  if (!state) return false;

  state.isPurging = true;
  state.purgeTimer = MASK_ETCH_CONSTANTS.PURGE_CYCLE_DURATION_SEC;

  return true;
}

export function updateMaskAcidState(state, delta = 0.1) {
  if (!state) return;

  if (state.isPurging && state.purgeTimer > 0) {
    state.purgeTimer = Math.max(0, state.purgeTimer - delta);

    if (state.purgeTimer === 0) {
      // Purge terminée : l'acide a été consumé thermiquement
      state.isPurging = false;
      state.maskIntegrity = MASK_ETCH_CONSTANTS.MAX_MASK_INTEGRITY;
      state.isHudDistorted = false;
      state.distortionIntensity = 0.0;
    }
  }
}
