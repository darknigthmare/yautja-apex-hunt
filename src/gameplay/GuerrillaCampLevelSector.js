// Secteur de niveau Camp de Guérilla de Val Verde (Lore 1:1)
// Référence canonique : Predator (1987) - Attaque du camp rebelle dans la jungle centraméricaine

import { audioSynth } from '../AudioSynthesizer.js';

export const CAMP_CONSTANTS = {
  FUEL_DRUM_BLAST_RADIUS: 6.5,
  FUEL_DRUM_DAMAGE: 160.0,
  WATCHTOWER_HEIGHT: 8.5,
  WATCHTOWER_BASE_HP: 120.0,
};

export function createGuerrillaCampSector() {
  return {
    fuelDrums: [],
    watchtowers: [],
    tripwires: [],
    activeExplosions: [],
  };
}

export function addFuelDrum(sector, drumData) {
  if (!sector || !drumData) return null;
  const drum = {
    id: drumData.id || `fuel_drum_${sector.fuelDrums.length + 1}`,
    x: Number(drumData.x) || 0,
    y: Number(drumData.y) || 0,
    z: Number(drumData.z) || 0,
    health: 40.0,
    isExploded: false,
    blastRadius: Number(drumData.blastRadius) || CAMP_CONSTANTS.FUEL_DRUM_BLAST_RADIUS,
    damage: Number(drumData.damage) || CAMP_CONSTANTS.FUEL_DRUM_DAMAGE,
  };
  sector.fuelDrums.push(drum);
  return drum;
}

export function addWatchtower(sector, towerData) {
  if (!sector || !towerData) return null;
  const tower = {
    id: towerData.id || `watchtower_${sector.watchtowers.length + 1}`,
    x: Number(towerData.x) || 0,
    y: Number(towerData.y) || 0,
    z: Number(towerData.z) || 0,
    height: Number(towerData.height) || CAMP_CONSTANTS.WATCHTOWER_HEIGHT,
    health: Number(towerData.health) || CAMP_CONSTANTS.WATCHTOWER_BASE_HP,
    isCollapsed: false,
    hasSniper: towerData.hasSniper !== false,
  };
  sector.watchtowers.push(tower);
  return tower;
}

export function detonateFuelDrum(sector, drumId, entities = [], audio = audioSynth) {
  if (!sector) return false;
  const drum = sector.fuelDrums.find(d => d.id === drumId && !d.isExploded);
  if (!drum) return false;

  drum.isExploded = true;
  drum.health = 0;

  if (audio && typeof audio.playFuelDrumExplode === 'function') {
    audio.playFuelDrumExplode();
  }

  // 1. Dégâts de souffle sur les entités dans le rayon
  for (const entity of entities) {
    const dx = entity.x - drum.x;
    const dy = (entity.y || 0) - drum.y;
    const dz = entity.z - drum.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= drum.blastRadius) {
      const dmg = drum.damage * (1.0 - dist / drum.blastRadius);
      if (typeof entity.applyDamage === 'function') {
        entity.applyDamage(dmg, 'fire_explosion');
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - dmg);
      }
    }
  }

  // 2. Détonation en chaîne sur les fûts de carburant adjacents
  for (const neighbor of sector.fuelDrums) {
    if (!neighbor.isExploded) {
      const ndx = neighbor.x - drum.x;
      const ndz = neighbor.z - drum.z;
      const ndist = Math.sqrt(ndx * ndx + ndz * ndz);
      if (ndist <= drum.blastRadius * 0.8) {
        detonateFuelDrum(sector, neighbor.id, entities, audio);
      }
    }
  }

  return true;
}

export function damageWatchtower(sector, towerId, damage, audio = audioSynth) {
  if (!sector) return false;
  const tower = sector.watchtowers.find(t => t.id === towerId && !t.isCollapsed);
  if (!tower) return false;

  tower.health = Math.max(0, tower.health - damage);
  if (tower.health <= 0) {
    tower.isCollapsed = true;
    tower.hasSniper = false;

    if (audio && typeof audio.playWatchtowerCollapse === 'function') {
      audio.playWatchtowerCollapse();
    }
    return true; // Écroulement
  }
  return false;
}
