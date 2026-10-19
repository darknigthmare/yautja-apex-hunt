// Système de Mines Murales Découpeuses à Grille Laser (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf déploie des mines murales créant un treillis laser planaire découpant les Xénomorphes en morceaux

import { audioSynth } from '../AudioSynthesizer.js';

export const LASER_MINE_CONSTANTS = {
  ARMING_TIME: 1.2,                    // Délai de magnétisation et d'activation du faisceau (s)
  BEAM_MAX_SPAN: 12.0,                 // Portée transversale maximale du treillis laser (m)
  CUT_DAMAGE: 220.0,                   // Dégâts tranchants létaux instantanés
  BEAM_THICKNESS_TOLERANCE: 0.8,       // Tolérance d'interception du faisceau (m)
};

export function createLaserGridMinesState(initialCharges = 4) {
  return {
    charges: Math.max(0, parseInt(initialCharges, 10) || 4),
    mines: [],
    totalDismemberments: 0,
  };
}

export function deployLaserGridMine(state, wallPos, normalVector = { x: 1, z: 0 }, beamSpan = 8.0, audio = audioSynth) {
  if (!state || state.charges <= 0) return null;

  const nx = normalVector.x || 0;
  const nz = normalVector.z || 0;
  const len = Math.sqrt(nx * nx + nz * nz) || 1.0;

  const mine = {
    id: `laser_mine_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: wallPos?.x || 0,
    y: wallPos?.y || 1.2,
    z: wallPos?.z || 0,
    dirX: nx / len,
    dirZ: nz / len,
    span: Math.min(LASER_MINE_CONSTANTS.BEAM_MAX_SPAN, Math.max(2.0, Number(beamSpan) || 8.0)),
    isArmed: false,
    armTimer: LASER_MINE_CONSTANTS.ARMING_TIME,
    triggerCount: 0,
  };

  state.charges--;
  state.mines.push(mine);

  if (audio && typeof audio.playLaserGridMineDeploy === 'function') {
    audio.playLaserGridMineDeploy();
  }

  return mine;
}

export function updateLaserGridMines(state, delta, entities = [], audio = audioSynth) {
  if (!state || state.mines.length === 0) return;
  const dt = Math.max(0, Number(delta) || 0);

  for (const mine of state.mines) {
    if (!mine.isArmed) {
      mine.armTimer -= dt;
      if (mine.armTimer <= 0) {
        mine.isArmed = true;
      }
      continue;
    }

    // Le faisceau laser est actif entre P0 (mine.x, mine.z) et P1 (mine.x + dirX*span, mine.z + dirZ*span)
    const p0x = mine.x;
    const p0z = mine.z;
    const p1x = mine.x + mine.dirX * mine.span;
    const p1z = mine.z + mine.dirZ * mine.span;
    const segDx = p1x - p0x;
    const segDz = p1z - p0z;
    const segLenSq = segDx * segDx + segDz * segDz;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      // Distance point-segment pour intercepter tout franchissement du faisceau
      const t = Math.max(0, Math.min(1, ((ex - p0x) * segDx + (ez - p0z) * segDz) / segLenSq));
      const projX = p0x + t * segDx;
      const projZ = p0z + t * segDz;
      const dist = Math.sqrt((ex - projX) ** 2 + (ez - projZ) ** 2);

      if (dist <= LASER_MINE_CONSTANTS.BEAM_THICKNESS_TOLERANCE) {
        // Découpage au laser
        mine.triggerCount++;
        state.totalDismemberments++;

        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(LASER_MINE_CONSTANTS.CUT_DAMAGE, 'laser_grid_mine');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - LASER_MINE_CONSTANTS.CUT_DAMAGE);
        }

        ent.isDismembered = true;
        ent.isSevered = true;

        if (audio && typeof audio.playLaserGridCutZap === 'function') {
          audio.playLaserGridCutZap();
        }
      }
    }
  }
}
