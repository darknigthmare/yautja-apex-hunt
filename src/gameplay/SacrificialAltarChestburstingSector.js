// Secteur de Niveau : Autels Sacrificiels & Émergence de Chestbursters (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — La chambre des sacrifices de la pyramide où les hôtes fécondés subissent la rupture costale

import { audioSynth } from '../AudioSynthesizer.js';

export const ALTAR_CONSTANTS = {
  GESTATION_TIME: 12.0,                // Temps avant émergence du Chestburster (s)
  ACID_SPRAY_RADIUS: 3.2,              // Projection d'acide lors de l'éclatement du sternum (m)
  ACID_SPRAY_DAMAGE: 40.0,             // Dégâts corrosifs de l'aspersion
};

export function createSacrificialAltarState() {
  const defaultAltars = [
    { id: 'altar_stone_01', x: -4.0, z: -12.0, isOccupied: true, gestation: 0.0, hasBurst: false },
    { id: 'altar_stone_02', x: 4.0,  z: -12.0, isOccupied: true, gestation: 6.0, hasBurst: false },
    { id: 'altar_stone_03', x: 0.0,  z: -18.0, isOccupied: true, gestation: 10.0, hasBurst: false },
  ];

  return {
    altars: defaultAltars,
    emergedBurstersCount: 0,
    mercyKilledCount: 0,
  };
}

export function mercyKillHost(state, altarId) {
  if (!state || !state.altars) return false;
  const altar = state.altars.find(a => a.id === altarId);
  if (!altar || !altar.isOccupied || altar.hasBurst) return false;

  altar.isOccupied = false;
  altar.hasBurst = true;
  state.mercyKilledCount++;
  return true;
}

export function updateSacrificialAltarSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  for (const altar of state.altars) {
    if (!altar.isOccupied || altar.hasBurst) continue;

    altar.gestation += dt;

    if (altar.gestation >= ALTAR_CONSTANTS.GESTATION_TIME) {
      altar.hasBurst = true;
      state.emergedBurstersCount++;

      if (audio && typeof audio.playChestbursterRibcageCrack === 'function') {
        audio.playChestbursterRibcageCrack();
      }

      // Projection d'acide lors de la perforation costale
      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);
        const dist = Math.sqrt((ex - altar.x) ** 2 + (ez - altar.z) ** 2);

        if (dist <= ALTAR_CONSTANTS.ACID_SPRAY_RADIUS) {
          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(ALTAR_CONSTANTS.ACID_SPRAY_DAMAGE, 'chestburster_acid_spray');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - ALTAR_CONSTANTS.ACID_SPRAY_DAMAGE);
          }
          ent.isAcidBurned = true;
        }
      }
    }
  }
}
