// Secteur d'Égouts de Gunnison et Nappe de Solvant Bleu Dilué en Flux (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf versant des fioles de solvant bleu corrosif dans le réseau d'égouts pluviaux pour dissoudre les carcasses et mucus de xénomorphes.

import { audioSynth } from '../AudioSynthesizer.js';

export const SEWER_SOLVENT_CONSTANTS = {
  FLOW_SPEED_METERS_PER_SEC: 2.5,     // Vélocité du courant d'eaux usées emportant le solvant
  DISSOLUTION_RADIUS: 3.2,            // Rayon d'action de la nappe chimique active
  DISSOLUTION_DURATION_SEC: 7.0,      // Persistance de la réaction chimique corrosive
  CLEANER_HONOR_SCORE: 150,           // Points d'honneur pour nettoyage forensique réussi
};

export function createSewerSolventState() {
  return {
    activeSolventSlicks: [], // Array of { id, x, z, flowDirection: {x, z}, remainingTime }
    dissolvedTracesCount: 0,
  };
}

export function releaseSolventIntoStream(state, originPos = { x: 0, z: 0 }, flowDir = { x: 0, z: 1 }, audio = audioSynth) {
  if (!state || !originPos) return null;

  if (audio && typeof audio.playSolventStreamChemicalBoil === 'function') {
    audio.playSolventStreamChemicalBoil();
  }

  const slickId = `solvent_slick_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const slick = {
    id: slickId,
    x: originPos.x || 0,
    z: originPos.z || 0,
    flowDir: { x: flowDir.x || 0, z: flowDir.z || 1 },
    remainingTime: SEWER_SOLVENT_CONSTANTS.DISSOLUTION_DURATION_SEC,
    radius: SEWER_SOLVENT_CONSTANTS.DISSOLUTION_RADIUS,
  };

  state.activeSolventSlicks.push(slick);

  return {
    success: true,
    slick,
  };
}

export function updateSewerSolventFlow(state, delta = 0.1, organicTargets = [], audio = audioSynth) {
  if (!state) return { dissolvedCount: 0 };

  let newlyDissolved = 0;

  for (let i = state.activeSolventSlicks.length - 1; i >= 0; i--) {
    const slick = state.activeSolventSlicks[i];

    // Progression de la nappe le long du canal d'égout
    slick.x += slick.flowDir.x * SEWER_SOLVENT_CONSTANTS.FLOW_SPEED_METERS_PER_SEC * delta;
    slick.z += slick.flowDir.z * SEWER_SOLVENT_CONSTANTS.FLOW_SPEED_METERS_PER_SEC * delta;
    slick.remainingTime -= delta;

    // Dissolution des résidus organiques Xénomorphes
    for (const target of organicTargets) {
      if (!target || target.isDissolved) continue;
      const dx = (target.x || 0) - slick.x;
      const dz = (target.z || 0) - slick.z;
      if (Math.hypot(dx, dz) <= slick.radius) {
        target.isDissolved = true;
        target.health = 0;
        state.dissolvedTracesCount++;
        newlyDissolved++;
      }
    }

    if (slick.remainingTime <= 0) {
      state.activeSolventSlicks.splice(i, 1);
    }
  }

  return { dissolvedCount: newlyDissolved, totalDissolved: state.dissolvedTracesCount };
}
