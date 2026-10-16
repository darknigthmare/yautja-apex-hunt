// Secteur de niveau Ruelle de Los Angeles 1990 & Penthouse Vaudou (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Massacre du cartel jamaïcain, cadavres écorchés suspendus et escaliers de secours

import { audioSynth } from '../AudioSynthesizer.js';

export function createPenthouseAlleySector() {
  return {
    fireEscapes: [
      { id: 'ladder_alley_1', x: -8, z: 12, bottomY: 0, topY: 12.0 },
      { id: 'balcony_penthouse', x: 10, z: -4, bottomY: 4.0, topY: 16.0 },
    ],
    skinnedVictims: [
      { id: 'victim_hanging_1', x: -7, y: 3.5, z: 10, isInspected: false, honorValue: 70 },
      { id: 'victim_hanging_2', x: 8, y: 5.0, z: -3, isInspected: false, honorValue: 85 },
    ],
    neonSigns: [
      { id: 'voodoo_neon_sign', x: -6, y: 4.0, z: 8, isBuzzing: true },
    ],
  };
}

export function inspectSkinnedVictim(sector, victimId, audio = audioSynth) {
  if (!sector) return null;
  const victim = sector.skinnedVictims.find(v => v.id === victimId);
  if (!victim || victim.isInspected) return null;

  victim.isInspected = true;

  if (audio && typeof audio.playBloodDripEcho === 'function') {
    audio.playBloodDripEcho();
  }

  return {
    species: 'Homo Sapiens',
    executionType: 'flayed_ritual_suspension',
    honorRating: victim.honorValue,
  };
}

export function climbFireEscape(sector, ladderId, currentElevation, directionY = 1.0) {
  if (!sector) return currentElevation;
  const ladder = sector.fireEscapes.find(l => l.id === ladderId);
  if (!ladder) return currentElevation;

  const targetY = directionY > 0 ? ladder.topY : ladder.bottomY;
  return targetY;
}

export function updatePenthouseAlley(sector, delta, audio = audioSynth) {
  if (!sector) return;
  // Bourdonnement occasionnel des néons
  if (audio && Math.random() < 0.04 && typeof audio.playNeonSignBuzz === 'function') {
    audio.playNeonSignBuzz();
  }
}
