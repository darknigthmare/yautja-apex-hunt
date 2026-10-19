// Secteur de Niveau : Camp de Guérilla & Barils Explosifs (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le campement rebelle de Val Verde avec barils de carburant combustibles et miradors destructibles

import { audioSynth } from '../AudioSynthesizer.js';

export const CAMP_CONSTANTS = {
  FUEL_DRUM_BLAST_RADIUS: 6.5,         // Rayon de déflagration d'un baril de carburant (m)
  FUEL_DRUM_DAMAGE: 175.0,             // Dégâts explosifs massifs
  TOWER_COLLAPSE_RADIUS: 4.0,          // Rayon d'écrasement lors de la chute d'un mirador (m)
};

export function createGuerillaCampState() {
  return {
    fuelDrums: [
      { id: 'drum_fuel_01', x: -5.0, z: -12.0, health: 25.0, isDetonated: false },
      { id: 'drum_fuel_02', x: 4.0,  z: -18.0, health: 25.0, isDetonated: false },
      { id: 'drum_fuel_03', x: 0.0,  z: -26.0, health: 25.0, isDetonated: false },
    ],
    watchtowers: [
      { id: 'tower_01', x: -6.0, z: -13.0, health: 80.0, isCollapsed: false },
      { id: 'tower_02', x: 5.0,  z: -28.0, health: 80.0, isCollapsed: false },
    ],
    explosionsCount: 0,
    collapsedTowersCount: 0,
  };
}

export function damageFuelDrum(state, drumId, damageAmount, entities = [], audio = audioSynth) {
  if (!state || !state.fuelDrums) return { detonated: false };
  const drum = state.fuelDrums.find(d => d.id === drumId);
  if (!drum || drum.isDetonated) return { detonated: false };

  drum.health -= Number(damageAmount) || 0;

  if (drum.health <= 0) {
    drum.isDetonated = true;
    state.explosionsCount++;

    if (audio && typeof audio.playFuelDrumExplosionBoom === 'function') {
      audio.playFuelDrumExplosionBoom();
    }

    // Dommages de zone aux entités
    let victimsHit = 0;
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dist = Math.sqrt((ex - drum.x) ** 2 + (ez - drum.z) ** 2);

      if (dist <= CAMP_CONSTANTS.FUEL_DRUM_BLAST_RADIUS) {
        victimsHit++;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(CAMP_CONSTANTS.FUEL_DRUM_DAMAGE, 'fuel_drum_explosion');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - CAMP_CONSTANTS.FUEL_DRUM_DAMAGE);
        }
        ent.isOnFire = true;
        ent.isKnockedBack = true;
      }
    }

    // Effondrement des miradors à proximité de l'explosion
    for (const tower of state.watchtowers) {
      if (tower.isCollapsed) continue;
      const tDist = Math.sqrt((tower.x - drum.x) ** 2 + (tower.z - drum.z) ** 2);
      if (tDist <= CAMP_CONSTANTS.FUEL_DRUM_BLAST_RADIUS) {
        tower.isCollapsed = true;
        state.collapsedTowersCount++;
      }
    }

    return { detonated: true, blastRadius: CAMP_CONSTANTS.FUEL_DRUM_BLAST_RADIUS, casualties: victimsHit };
  }

  return { detonated: false, remainingHealth: drum.health };
}
