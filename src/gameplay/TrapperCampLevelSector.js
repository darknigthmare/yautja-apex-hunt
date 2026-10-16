// Secteur de niveau Camp des Trappeurs Français 1719 (Lore 1:1)
// Référence canonique : Prey (2022) - Camp des trappeurs, pièges à mâchoires d'ours et troncs calcinés

import { audioSynth } from '../AudioSynthesizer.js';

export const TRAPPER_CONSTANTS = {
  BEAR_TRAP_DAMAGE: 55.0,
  BEAR_TRAP_IMMOBILIZE_TIME: 4.5,
  EMBER_FIRE_DPS: 18.0,
};

export function createTrapperCampSector() {
  return {
    bearTraps: [
      { id: 'bear_trap_1', x: -6, y: 0, z: 8, isSprung: false, radius: 1.4 },
      { id: 'bear_trap_2', x: 12, y: 0, z: 14, isSprung: false, radius: 1.4 },
      { id: 'bear_trap_3', x: 0, y: 0, z: -10, isSprung: false, radius: 1.4 },
    ],
    smolderingLogs: [
      { id: 'log_fire_1', x: 5, y: 0, z: 2, radius: 2.5 },
    ],
  };
}

export function armBearTrap(sector, position) {
  if (!sector || !position) return null;
  const trap = {
    id: `bear_trap_${sector.bearTraps.length + 1}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    radius: 1.4,
    isSprung: false,
  };
  sector.bearTraps.push(trap);
  return trap;
}

export function checkBearTrapTrigger(sector, entity, audio = audioSynth) {
  if (!sector || !entity) return false;

  for (const trap of sector.bearTraps) {
    if (!trap.isSprung) {
      const dx = entity.x - trap.x;
      const dz = entity.z - trap.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= trap.radius) {
        trap.isSprung = true;

        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(TRAPPER_CONSTANTS.BEAR_TRAP_DAMAGE, 'steel_jaw_bear_trap');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - TRAPPER_CONSTANTS.BEAR_TRAP_DAMAGE);
        }

        entity.isImmobilized = true;
        entity.immobilizeTimer = TRAPPER_CONSTANTS.BEAR_TRAP_IMMOBILIZE_TIME;
        entity.trappedInId = trap.id;

        if (audio && typeof audio.playBearTrapSnap === 'function') {
          audio.playBearTrapSnap();
        }
        return true;
      }
    }
  }
  return false;
}

export function pryOpenBearTrap(trap, entity) {
  if (!trap || !entity) return false;
  trap.isSprung = false;
  entity.isImmobilized = false;
  entity.immobilizeTimer = 0;
  entity.trappedInId = null;
  return true;
}

export function updateTrapperCamp(sector, delta, entities = []) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Dégâts de brûlure des troncs calcinés
  for (const log of sector.smolderingLogs) {
    for (const entity of entities) {
      const dx = entity.x - log.x;
      const dz = entity.z - log.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= log.radius) {
        const fireDamage = TRAPPER_CONSTANTS.EMBER_FIRE_DPS * dt;
        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(fireDamage, 'smoldering_embers');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - fireDamage);
        }
      }
    }
  }

  // Décompte d'immobilisation des pièges
  for (const entity of entities) {
    if (entity.isImmobilized && entity.immobilizeTimer > 0) {
      entity.immobilizeTimer = Math.max(0, entity.immobilizeTimer - dt);
      if (entity.immobilizeTimer <= 0) {
        entity.isImmobilized = false;
      }
    }
  }
}
