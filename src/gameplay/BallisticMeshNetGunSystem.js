// Système de Lance-Filet Balistique Rétractable en Alliage (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Celtic immobilise le Xénomorphe "Grid" dans un filet métallique qui se resserre sous l'effort

import { audioSynth } from '../AudioSynthesizer.js';

export const NET_GUN_CONSTANTS = {
  PROJECTILE_SPEED: 25.0,              // Vélocité du projectile déployable (m/s)
  SNARE_DURATION: 7.5,                 // Durée d'immobilisation de base (s)
  CONSTRICTION_DPS: 18.0,              // Dégâts de cisaillement progressif des mailles
  MAX_AMMO: 3,
};

export function createBallisticNetGunState(initialAmmo = 3) {
  return {
    ammo: Math.max(0, parseInt(initialAmmo, 10) || 3),
    flyingNets: [],
    snaredVictimsCount: 0,
  };
}

export function fireBallisticNet(state, shooterPos, targetPos, audio = audioSynth) {
  if (!state || state.ammo <= 0) return null;

  const sx = shooterPos?.x || 0;
  const sz = shooterPos?.z || 0;
  const tx = targetPos?.x || 0;
  const tz = targetPos?.z || 0;

  const dx = tx - sx;
  const dz = tz - sz;
  const dist = Math.sqrt(dx * dx + dz * dz) || 1.0;

  const net = {
    id: `net_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: sx,
    z: sz,
    vx: (dx / dist) * NET_GUN_CONSTANTS.PROJECTILE_SPEED,
    vz: (dz / dist) * NET_GUN_CONSTANTS.PROJECTILE_SPEED,
    targetX: tx,
    targetZ: tz,
    isDeployed: false,
  };

  state.ammo--;
  state.flyingNets.push(net);

  if (audio && typeof audio.playBallisticNetLaunchWhistle === 'function') {
    audio.playBallisticNetLaunchWhistle();
  }

  return net;
}

export function updateBallisticNetGun(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Vol des filets déployés
  for (let i = state.flyingNets.length - 1; i >= 0; i--) {
    const net = state.flyingNets[i];
    net.x += net.vx * dt;
    net.z += net.vz * dt;

    let hasTrapped = false;
    for (const ent of entities) {
      if (!ent || ent.isDead || ent.isNetSnared) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dx = ex - net.x;
      const dz = ez - net.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= 1.5) {
        // Capture dans le filet métallique
        hasTrapped = true;
        ent.isNetSnared = true;
        ent.snareTimer = NET_GUN_CONSTANTS.SNARE_DURATION;
        ent.hasGridScarring = true; // Cicatrice quadrillée emblématique (Grid Alien)
        state.snaredVictimsCount++;

        if (audio && typeof audio.playNetConstrictBiteChink === 'function') {
          audio.playNetConstrictBiteChink();
        }
        break;
      }
    }

    if (hasTrapped) {
      state.flyingNets.splice(i, 1);
    }
  }

  // Étranglement des victimes prises au piège
  for (const ent of entities) {
    if (!ent || ent.isDead || !ent.isNetSnared) continue;

    ent.snareTimer -= dt;
    ent.speedMultiplier = 0.0; // Immobilisation absolue au sol

    const constrictDmg = NET_GUN_CONSTANTS.CONSTRICTION_DPS * dt;
    if (typeof ent.takeDamage === 'function') {
      ent.takeDamage(constrictDmg, 'net_constriction');
    } else if (typeof ent.health === 'number') {
      ent.health = Math.max(0, ent.health - constrictDmg);
    }

    if (ent.snareTimer <= 0) {
      ent.isNetSnared = false;
      ent.speedMultiplier = 1.0;
    }
  }
}
