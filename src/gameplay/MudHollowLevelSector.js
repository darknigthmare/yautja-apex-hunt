// Secteur de niveau Creux de Boue & Falaises Racines de Jungle (Lore 1:1)
// Référence canonique : Predator (1987) - Dutch s'enduisant de glaise fluviale sous l'enchevêtrement de racines

import { audioSynth } from '../AudioSynthesizer.js';

export const HOLLOW_CONSTANTS = {
  COOLED_TEMP_CELSIUS: 14.2,
  MUD_COATING_DURATION: 30.0,
  ROOT_CANOPY_COVER_RADIUS: 4.5,
};

export function createMudHollowSector() {
  return {
    hollows: [
      { id: 'riverbank_hollow_1', x: -15, y: -0.5, z: 20, radius: 3.2, hasRootOverhang: true },
      { id: 'waterfall_mud_bank', x: 25, y: -1.0, z: -10, radius: 4.0, hasRootOverhang: false },
    ],
  };
}

export function addMudHollow(sector, data) {
  if (!sector || !data) return null;
  const hollow = {
    id: data.id || `mud_hollow_${sector.hollows.length + 1}`,
    x: Number(data.x) || 0,
    y: Number(data.y) || 0,
    z: Number(data.z) || 0,
    radius: Number(data.radius) || 3.0,
    hasRootOverhang: Boolean(data.hasRootOverhang),
  };
  sector.hollows.push(hollow);
  return hollow;
}

export function interactMudHollow(sector, entity, audio = audioSynth) {
  if (!sector || !entity) return false;

  for (const hollow of sector.hollows) {
    const dx = entity.x - hollow.x;
    const dz = entity.z - hollow.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= hollow.radius) {
      entity.isMudCoated = true;
      entity.mudDuration = HOLLOW_CONSTANTS.MUD_COATING_DURATION;
      entity.apparentTemperatureCelsius = HOLLOW_CONSTANTS.COOLED_TEMP_CELSIUS;

      if (audio && typeof audio.playMudSquish === 'function') {
        audio.playMudSquish();
      }
      return true;
    }
  }
  return false;
}

export function checkRootOverhangCover(sector, position) {
  if (!sector || !position) return false;
  return sector.hollows.some(h => {
    if (!h.hasRootOverhang) return false;
    const dx = position.x - h.x;
    const dz = position.z - h.z;
    return Math.sqrt(dx * dx + dz * dz) <= h.radius;
  });
}
