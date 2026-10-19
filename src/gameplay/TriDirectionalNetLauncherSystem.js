// Système de Lance-Filet Triple Directionnel en Éventail (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Variante urbaine tirant 3 filets métalliques divergents pour piéger des escouades entières

import { audioSynth } from '../AudioSynthesizer.js';

export const TRI_NET_CONSTANTS = {
  PROJECTILE_SPEED: 26.0,              // Vélocité de propulsion des 3 filets (m/s)
  SPREAD_ANGLE_RADIANS: 0.32,          // Angle de divergence entre les 3 trajectoires (~18 degrés)
  SNARE_DURATION: 6.5,                 // Durée d'immobilisation de chaque filet (s)
  MAX_AMMO: 2,
};

export function createTriNetState(initialAmmo = 2) {
  return {
    ammo: Math.max(0, parseInt(initialAmmo, 10) || 2),
    activeNets: [],
    multiSnaredVictimsCount: 0,
  };
}

export function fireTriDirectionalNets(state, shooterPos, centerAimAngle = 0, audio = audioSynth) {
  if (!state || state.ammo <= 0) return [];

  state.ammo--;
  const sx = shooterPos?.x || 0;
  const sz = shooterPos?.z || 0;
  const angles = [
    centerAimAngle - TRI_NET_CONSTANTS.SPREAD_ANGLE_RADIANS,
    centerAimAngle,
    centerAimAngle + TRI_NET_CONSTANTS.SPREAD_ANGLE_RADIANS,
  ];

  const spawnedNets = angles.map((ang, idx) => ({
    id: `tri_net_${Date.now()}_${idx}`,
    x: sx,
    z: sz,
    vx: Math.cos(ang) * TRI_NET_CONSTANTS.PROJECTILE_SPEED,
    vz: Math.sin(ang) * TRI_NET_CONSTANTS.PROJECTILE_SPEED,
    isSpent: false,
  }));

  state.activeNets.push(...spawnedNets);

  if (audio && typeof audio.playTripleNetLauncherBlast === 'function') {
    audio.playTripleNetLauncherBlast();
  }

  return spawnedNets;
}

export function updateTriNetLauncher(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  for (let i = state.activeNets.length - 1; i >= 0; i--) {
    const net = state.activeNets[i];
    net.x += net.vx * dt;
    net.z += net.vz * dt;

    let hit = false;
    for (const ent of entities) {
      if (!ent || ent.isDead || ent.isNetSnared) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dist = Math.sqrt((ex - net.x) ** 2 + (ez - net.z) ** 2);

      if (dist <= 1.4) {
        hit = true;
        ent.isNetSnared = true;
        ent.snareTimer = TRI_NET_CONSTANTS.SNARE_DURATION;
        ent.speedMultiplier = 0.0;
        state.multiSnaredVictimsCount++;

        if (audio && typeof audio.playNetConstrictBiteChink === 'function') {
          audio.playNetConstrictBiteChink();
        }
        break;
      }
    }

    if (hit) {
      state.activeNets.splice(i, 1);
    }
  }

  // Décroissance du temps d'immobilisation
  for (const ent of entities) {
    if (!ent || ent.isDead || !ent.isNetSnared) continue;
    ent.snareTimer -= dt;
    if (ent.snareTimer <= 0) {
      ent.isNetSnared = false;
      ent.speedMultiplier = 1.0;
    }
  }
}
