// Secteur de Niveau : Station Baleinière de Bouvetøya & Blizzard Antarctique (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Station baleinière norvégienne abandonnée sous un blizzard à -38°C dominant la pyramide

import { audioSynth } from '../AudioSynthesizer.js';

export const BOUVETOYA_CONSTANTS = {
  AMBIENT_TEMP_C: -38.0,               // Température polaire extrême
  WIND_GALE_SPEED: 14.5,               // Vélocité des bourrasques de neige (m/s)
  FROST_ACCUMULATION_RATE: 0.08,       // Vitesse d'engivrement de la visière par seconde
  SHELTER_WARMTH_RECOVERY: 0.25,       // Dégivrage naturel sous abri
  MAX_FROST_OBSCURATION: 0.85,         // Niveau maximal d'occultation visuelle par le givre
  GALE_SOUND_INTERVAL: 6.5,            // Périodicité du hurlement du blizzard (s)
};

export function createBouvetoyaWhalingSectorState(customShelters = null) {
  const defaultShelters = [
    { id: 'whaling_cabin_01', x: -10.0, z: -18.0, radius: 4.5 },
    { id: 'rendering_vat_01', x: 8.0,   z: -24.0, radius: 3.8 },
    { id: 'boiler_shed',      x: 0.0,   z: -32.0, radius: 5.0 },
  ];

  return {
    ambientTemperature: BOUVETOYA_CONSTANTS.AMBIENT_TEMP_C,
    blizzardActive: true,
    windAngle: Math.PI * 0.75,         // Vent venant du Nord-Ouest
    shelters: customShelters || defaultShelters,
    frostAccumulation: 0.0,            // 0.0 (visière nette) à 1.0 (visière opacifiée)
    galeSoundTimer: 0.0,
    defrostCyclesCount: 0,
  };
}

export function cycleThermalDefroster(state, audio = audioSynth) {
  if (!state) return false;

  state.frostAccumulation = 0.0;
  state.defrostCyclesCount++;

  if (audio && typeof audio.playFrostCrackSheet === 'function') {
    audio.playFrostCrackSheet();
  }
  return true;
}

export function updateBouvetoyaWhalingSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Ambiance du hurlement des rafales de neige
  state.galeSoundTimer += dt;
  if (state.galeSoundTimer >= BOUVETOYA_CONSTANTS.GALE_SOUND_INTERVAL) {
    state.galeSoundTimer = 0;
    if (audio && typeof audio.playBlizzardGaleHowl === 'function') {
      audio.playBlizzardGaleHowl();
    }
  }

  // Traitement climatique pour chaque entité
  const windDirX = Math.cos(state.windAngle);
  const windDirZ = Math.sin(state.windAngle);

  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    // Vérification de la présence dans une zone abritée
    let isSheltered = false;
    for (const sh of state.shelters) {
      const dx = ex - sh.x;
      const dz = ez - sh.z;
      if (Math.sqrt(dx * dx + dz * dz) <= sh.radius) {
        isSheltered = true;
        break;
      }
    }

    ent.isInsideShelter = isSheltered;

    if (isSheltered) {
      // Dégivrage progressif dans la cabane ou derrière la cuve à suif
      state.frostAccumulation = Math.max(0, state.frostAccumulation - BOUVETOYA_CONSTANTS.SHELTER_WARMTH_RECOVERY * dt);
      ent.windForceX = 0;
      ent.windForceZ = 0;
    } else {
      // Accumulation de givre en extérieur sous la tempête
      state.frostAccumulation = Math.min(
        BOUVETOYA_CONSTANTS.MAX_FROST_OBSCURATION,
        state.frostAccumulation + BOUVETOYA_CONSTANTS.FROST_ACCUMULATION_RATE * dt
      );

      // Poussée continue du vent
      ent.windForceX = windDirX * BOUVETOYA_CONSTANTS.WIND_GALE_SPEED * 0.15;
      ent.windForceZ = windDirZ * BOUVETOYA_CONSTANTS.WIND_GALE_SPEED * 0.15;
    }

    ent.visorFrostLevel = state.frostAccumulation;
    ent.isBlindedinBlizzard = state.frostAccumulation >= 0.70;
  }
}
