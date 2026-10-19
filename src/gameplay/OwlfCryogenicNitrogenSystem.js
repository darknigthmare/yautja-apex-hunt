// Système de Cryo-Congélation par Azote Liquide OWLF (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — L'équipe tactique de Peter Keyes utilisant des lances à azote liquide à -196°C pour briser le camouflage et geler le City Hunter dans l'abattoir.

import { audioSynth } from '../AudioSynthesizer.js';

export const OWLF_CRYO_CONSTANTS = {
  SPRAY_RANGE: 12.0,                  // Portée du jet cryogénique pressurisé (mètres)
  SPRAY_ARC_DEG: 45.0,                // Angle de dispersion du cône d'azote liquide
  FREEZE_RATE_PER_SEC: 0.65,          // Vitesse d'accumulation du givre par seconde d'exposition
  THAW_RATE_PER_SEC: 0.2,             // Vitesse de décongélation naturelle par seconde
  CLOAK_BREAK_THRESHOLD: 0.25,        // Seuil d'accumulation de givre brisant le camouflage réactif
  MAX_FROST_SLOWDOWN_MULTIPLIER: 0.3, // Réduction de vitesse à congélation maximale (70% de ralentissement)
};

export function createOwlfCryoState() {
  return {
    isSpraying: false,
    activeSprayers: [],
    frozenTargets: new Map(), // targetId -> { freezeLevel: 0..1, isCloakBroken: false }
  };
}

export function sprayLiquidNitrogen(state, origin, forwardDir, range = OWLF_CRYO_CONSTANTS.SPRAY_RANGE, delta = 0.1, targets = [], audio = audioSynth) {
  if (!state) return { affectedTargets: [] };

  state.isSpraying = true;
  const affected = [];

  if (audio && typeof audio.playNitrogenHissCold === 'function') {
    audio.playNitrogenHissCold();
  }

  // Normaliser le vecteur de visée
  const len = Math.hypot(forwardDir.x, forwardDir.z) || 1;
  const dirX = forwardDir.x / len;
  const dirZ = forwardDir.z / len;
  const cosMaxAngle = Math.cos((OWLF_CRYO_CONSTANTS.SPRAY_ARC_DEG * 0.5 * Math.PI) / 180);

  for (const target of targets) {
    if (!target) continue;
    const dx = (target.x ?? 0) - origin.x;
    const dz = (target.z ?? 0) - origin.z;
    const dist = Math.hypot(dx, dz);

    if (dist > 0 && dist <= range) {
      const dot = (dx * dirX + dz * dirZ) / dist;
      if (dot >= cosMaxAngle) {
        // La cible est dans le cône de dispersion cryogénique
        const targetId = target.id || 'target_default';
        let targetState = state.frozenTargets.get(targetId);
        if (!targetState) {
          targetState = { freezeLevel: 0, isCloakBroken: false };
          state.frozenTargets.set(targetId, targetState);
        }

        // Augmentation du gel
        targetState.freezeLevel = Math.min(1.0, targetState.freezeLevel + OWLF_CRYO_CONSTANTS.FREEZE_RATE_PER_SEC * delta);

        // Brisure du camouflage réactif par condensation de givre
        if (targetState.freezeLevel >= OWLF_CRYO_CONSTANTS.CLOAK_BREAK_THRESHOLD) {
          target.isCloaked = false;
          target.isFrostRevealed = true;
          targetState.isCloakBroken = true;
        }

        // Application du ralentissement
        const slowFactor = 1.0 - (1.0 - OWLF_CRYO_CONSTANTS.MAX_FROST_SLOWDOWN_MULTIPLIER) * targetState.freezeLevel;
        target.speedMultiplier = slowFactor;

        if (targetState.freezeLevel >= 0.8 && audio && typeof audio.playFrostFractureCrack === 'function') {
          audio.playFrostFractureCrack();
        }

        affected.push({
          id: targetId,
          freezeLevel: targetState.freezeLevel,
          speedMultiplier: slowFactor,
          cloakBroken: targetState.isCloakBroken,
        });
      }
    }
  }

  return { affectedTargets: affected };
}

export function updateCryoThaw(state, delta = 0.1, targets = []) {
  if (!state) return;

  state.frozenTargets.forEach((targetState, targetId) => {
    if (targetState.freezeLevel > 0) {
      targetState.freezeLevel = Math.max(0, targetState.freezeLevel - OWLF_CRYO_CONSTANTS.THAW_RATE_PER_SEC * delta);

      const target = targets.find((t) => (t.id || 'target_default') === targetId);
      if (target) {
        const slowFactor = 1.0 - (1.0 - OWLF_CRYO_CONSTANTS.MAX_FROST_SLOWDOWN_MULTIPLIER) * targetState.freezeLevel;
        target.speedMultiplier = slowFactor;

        if (targetState.freezeLevel === 0) {
          target.isFrostRevealed = false;
          targetState.isCloakBroken = false;
        }
      }
    }
  });
}
