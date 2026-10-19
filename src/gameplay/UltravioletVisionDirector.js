// Directeur de Vision Ultraviolette & Détection Multi-Spectrale (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le City Hunter commute son bio-masque en spectre UV pour traquer l'équipe OWLF de Peter Keyes

import { audioSynth } from '../AudioSynthesizer.js';

export const UV_CONSTANTS = {
  MODE_INFRARED: 'INFRARED',
  MODE_ULTRAVIOLET: 'ULTRAVIOLET',
  MODE_ELECTROMAGNETIC: 'ELECTROMAGNETIC',
  UV_ENERGY_DRAIN_PER_SEC: 1.5,
  PHOSPHOR_TRAIL_LIFETIME: 10.0,
  CRYO_LEAK_DETECTION_RANGE: 24.0,
  UV_DETECTION_CONFIDENCE: 0.98,
};

export function createUVVisionState() {
  return {
    currentMode: UV_CONSTANTS.MODE_INFRARED,
    energyReserve: 100.0,
    phosphorFootprints: [],
    nitrogenLeaks: [],
    highlightedEntities: [],
  };
}

export function toggleUVVision(state, forcedMode = null, audio = audioSynth) {
  if (!state) return UV_CONSTANTS.MODE_INFRARED;

  if (forcedMode) {
    state.currentMode = forcedMode;
  } else {
    state.currentMode = state.currentMode === UV_CONSTANTS.MODE_ULTRAVIOLET 
      ? UV_CONSTANTS.MODE_INFRARED 
      : UV_CONSTANTS.MODE_ULTRAVIOLET;
  }

  if (audio && typeof audio.playUltravioletHumChirp === 'function') {
    audio.playUltravioletHumChirp();
  }

  return state.currentMode;
}

export function addPhosphorFootprint(state, x, z, intensity = 1.0) {
  if (!state) return;
  state.phosphorFootprints.push({
    id: `phosphor_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(x) || 0,
    z: Number(z) || 0,
    intensity: Math.min(1.0, Math.max(0.1, Number(intensity) || 1.0)),
    lifetime: UV_CONSTANTS.PHOSPHOR_TRAIL_LIFETIME,
  });
}

export function triggerNitrogenCoolantLeak(state, x, z, audio = audioSynth) {
  if (!state) return;
  const leak = {
    id: `leak_${Date.now()}`,
    x: Number(x) || 0,
    z: Number(z) || 0,
    active: true,
    lifetime: 8.0,
  };
  state.nitrogenLeaks.push(leak);

  if (audio && typeof audio.playUVPhosphorSizzle === 'function') {
    audio.playUVPhosphorSizzle();
  }
}

export function updateUVVisionDirector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Consommation d'énergie en mode UV
  if (state.currentMode === UV_CONSTANTS.MODE_ULTRAVIOLET) {
    state.energyReserve = Math.max(0, state.energyReserve - UV_CONSTANTS.UV_ENERGY_DRAIN_PER_SEC * dt);
    if (state.energyReserve <= 0) {
      toggleUVVision(state, UV_CONSTANTS.MODE_INFRARED, audio);
    }
  }

  // Décroissance des traces phosphorescentes
  for (let i = state.phosphorFootprints.length - 1; i >= 0; i--) {
    const fp = state.phosphorFootprints[i];
    fp.lifetime -= dt;
    fp.intensity = Math.max(0, fp.lifetime / UV_CONSTANTS.PHOSPHOR_TRAIL_LIFETIME);
    if (fp.lifetime <= 0) {
      state.phosphorFootprints.splice(i, 1);
    }
  }

  // Décroissance des fuites d'azote
  for (let i = state.nitrogenLeaks.length - 1; i >= 0; i--) {
    const leak = state.nitrogenLeaks[i];
    leak.lifetime -= dt;
    if (leak.lifetime <= 0) {
      state.nitrogenLeaks.splice(i, 1);
    }
  }

  state.highlightedEntities = [];

  // Évaluation de visibilité multi-spectrale des entités
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    if (state.currentMode === UV_CONSTANTS.MODE_INFRARED) {
      // Sous Infrarouge: Les combinaisons isothermes (Keyes/OWLF) ou carcasses froides bloquent la détection
      const isThermalMasked = ent.isThermalConcealed || ent.hasThermalInsulatedSuit;
      ent.isMaskVisible = !isThermalMasked;
      ent.visionColorProfile = ent.isMaskVisible ? 'THERMAL_HEAT_GRADIENT' : 'COLD_BLUE_STEALTH';
    } else if (state.currentMode === UV_CONSTANTS.MODE_ULTRAVIOLET) {
      // Sous Ultraviolet: Révèle les poussières traceuses, le phosphore, les batteries électroniques et l'azote liquide
      const hasUVPhosphor = ent.hasUVTracerDust || ent.hasCryoGear || ent.equipment?.includes('cryo_sprayer');
      
      // Proximité avec une trace au sol
      let nearPhosphor = false;
      for (const fp of state.phosphorFootprints) {
        const dx = ex - fp.x;
        const dz = ez - fp.z;
        if (Math.sqrt(dx * dx + dz * dz) <= 1.8) {
          nearPhosphor = true;
          break;
        }
      }

      if (hasUVPhosphor || nearPhosphor) {
        ent.isMaskVisible = true;
        ent.visionColorProfile = 'UV_BRIGHT_MAGENTA_PHOSPHOR';
        state.highlightedEntities.push(ent);
      } else {
        // Objets ordinaires sans signature UV apparaissent assombris
        ent.isMaskVisible = false;
        ent.visionColorProfile = 'UV_DARK_MONOCHROME';
      }
    }
  }
}
