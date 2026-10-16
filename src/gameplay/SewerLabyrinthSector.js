// Secteur de niveau Égouts de Gunnison et Mines Laser Murales (Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) - Traque souterraine de Wolf et pose de mines laser

import { audioSynth } from '../AudioSynthesizer.js';

export const SEWER_CONSTANTS = {
  WATER_SLOW_FACTOR: 0.72,       // Ralentissement dans l'eau croupie
  LASER_MINE_DAMAGE: 185.0,      // Dégâts de tranchant laser haute densité
  LASER_BEAM_LENGTH: 8.0,        // Portée du faisceau laser transversal
};

export function createSewerLabyrinthSector() {
  return {
    waterLevelHeight: 0.8,
    laserMines: [],
    dripTimer: 0,
    pipePerches: [
      { id: 'pipe_1', x: 0, y: 3.2, z: 10, length: 14.0 },
      { id: 'pipe_2', x: 0, y: 3.2, z: -10, length: 14.0 },
    ],
  };
}

export function plantLaserMine(sector, position, directionVector = { x: 1, y: 0, z: 0 }, audio = audioSynth) {
  if (!sector || !position) return null;

  const mine = {
    id: `laser_mine_${sector.laserMines.length + 1}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 1.5,
    z: Number(position.z) || 0,
    direction: directionVector,
    isArmed: true,
    isDetonated: false,
    beamLength: SEWER_CONSTANTS.LASER_BEAM_LENGTH,
  };

  sector.laserMines.push(mine);

  if (audio && typeof audio.playLaserMineArm === 'function') {
    audio.playLaserMineArm();
  }
  return mine;
}

export function updateSewerLabyrinth(sector, delta, entities = [], audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Ambiance de goutte d'eau réverbérée
  sector.dripTimer += dt;
  if (sector.dripTimer >= 4.0) {
    sector.dripTimer = 0;
    if (audio && typeof audio.playSewerEchoDrip === 'function') {
      audio.playSewerEchoDrip();
    }
  }

  // Ralentissement dans l'eau croupie des égouts
  for (const entity of entities) {
    const isWading = (entity.y || 0) <= sector.waterLevelHeight && !entity.isPerchedOnPipe;
    if (isWading) {
      entity.speedMultiplier = SEWER_CONSTANTS.WATER_SLOW_FACTOR;
    } else if (entity.speedMultiplier === SEWER_CONSTANTS.WATER_SLOW_FACTOR) {
      entity.speedMultiplier = 1.0;
    }
  }

  // Détection d'interception de faisceau des mines laser
  for (const mine of sector.laserMines) {
    if (mine.isArmed && !mine.isDetonated) {
      for (const entity of entities) {
        const dx = entity.x - mine.x;
        const dy = (entity.y || 1.5) - mine.y;
        const dz = entity.z - mine.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist <= mine.beamLength && Math.abs(dy) <= 1.0) {
          mine.isDetonated = true;
          mine.isArmed = false;

          if (typeof entity.applyDamage === 'function') {
            entity.applyDamage(SEWER_CONSTANTS.LASER_MINE_DAMAGE, 'laser_trip_mine_sever');
          } else if (typeof entity.health === 'number') {
            entity.health = Math.max(0, entity.health - SEWER_CONSTANTS.LASER_MINE_DAMAGE);
          }

          if (audio && typeof audio.playLaserMineDetonate === 'function') {
            audio.playLaserMineDetonate();
          }
          break;
        }
      }
    }
  }
}
