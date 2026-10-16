// Système de Cracheur d'Acide / Spitter Xénomorphe (Comics Marvel — Lore 1:1)
// Référence canonique : Comics Marvel Alien (2021) — Caste spécialisée d'artillerie biologique projetant des orbes d'acide corrosif à distance

import { audioSynth } from '../AudioSynthesizer.js';

export const SPITTER_CONSTANTS = {
  FIRE_RANGE: 25.0,                // Portée de tir d'artillerie (m)
  PROJECTILE_SPEED: 24.0,          // Vitesse balistique du globe d'acide (m/s)
  IMPACT_DAMAGE: 45.0,             // Dégâts de brûlure directe à l'impact
  ACID_POOL_RADIUS: 2.2,           // Rayon de la flaque d'acide résiduelle
  ACID_POOL_DURATION: 5.0,         // Durée de persistance au sol (s)
  ACID_POOL_DPS: 24.0,             // Corrosion continue par seconde
  COOLDOWN_TIME: 3.2,              // Cadence de tir entre deux régurgitations (s)
};

export function createSpitterState(position = { x: 0, y: 0, z: -20 }) {
  return {
    id: `spitter_${Date.now()}`,
    x: position.x,
    y: position.y,
    z: position.z,
    health: 180.0,
    cooldownTimer: 0,
    activeGlobes: [],
    acidPools: [],
    isDead: false,
  };
}

export function fireAcidGlobe(spitterState, targetPos, audio = audioSynth) {
  if (!spitterState || spitterState.isDead || spitterState.cooldownTimer > 0) return null;

  spitterState.cooldownTimer = SPITTER_CONSTANTS.COOLDOWN_TIME;

  const dx = targetPos.x - spitterState.x;
  const dy = (targetPos.y || 1.5) - (spitterState.y + 1.2);
  const dz = targetPos.z - spitterState.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

  const globe = {
    id: `globe_${Date.now()}`,
    x: spitterState.x,
    y: spitterState.y + 1.2,
    z: spitterState.z,
    vx: (dx / dist) * SPITTER_CONSTANTS.PROJECTILE_SPEED,
    vy: (dy / dist) * SPITTER_CONSTANTS.PROJECTILE_SPEED,
    vz: (dz / dist) * SPITTER_CONSTANTS.PROJECTILE_SPEED,
    targetY: targetPos.y || 0,
    lifetime: 3.0,
  };

  spitterState.activeGlobes.push(globe);

  if (audio && typeof audio.playSpitterAcidGlobeLaunch === 'function') {
    audio.playSpitterAcidGlobeLaunch();
  }

  return globe;
}

export function updateSpitterSystem(spitterState, delta, targetEntity, audio = audioSynth) {
  if (!spitterState || spitterState.isDead) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (spitterState.cooldownTimer > 0) {
    spitterState.cooldownTimer = Math.max(0, spitterState.cooldownTimer - dt);
  }

  // Trajectoire des globes d'acide en vol
  spitterState.activeGlobes = spitterState.activeGlobes.filter(globe => {
    globe.lifetime -= dt;
    if (globe.lifetime <= 0) return false;

    const prevX = globe.x;
    const prevY = globe.y;
    const prevZ = globe.z;

    const segDx = globe.vx * dt;
    const segDy = globe.vy * dt;
    const segDz = globe.vz * dt;
    const segLenSq = segDx * segDx + segDy * segDy + segDz * segDz;

    globe.x += segDx;
    globe.y += segDy;
    globe.z += segDz;

    // Détection d'impact avec l'entité cible par segment continu
    if (targetEntity && !targetEntity.isDead) {
      const tx = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
      const ty = targetEntity.y ?? (targetEntity.position ? targetEntity.position.y : 1.5);
      const tz = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

      let t = 0;
      if (segLenSq > 0.00001) {
        t = Math.max(0, Math.min(1, ((tx - prevX) * segDx + (ty - prevY) * segDy + (tz - prevZ) * segDz) / segLenSq));
      }
      const closeX = prevX + segDx * t;
      const closeY = prevY + segDy * t;
      const closeZ = prevZ + segDz * t;

      const cdx = closeX - tx;
      const cdy = closeY - ty;
      const cdz = closeZ - tz;
      const dist = Math.sqrt(cdx * cdx + cdy * cdy + cdz * cdz);

      if (dist <= 1.8 || globe.y <= globe.targetY) {
        // Impact direct
        if (typeof targetEntity.takeDamage === 'function') {
          targetEntity.takeDamage(SPITTER_CONSTANTS.IMPACT_DAMAGE, 'spitter_acid_globe');
        } else if (typeof targetEntity.health === 'number') {
          targetEntity.health = Math.max(0, targetEntity.health - SPITTER_CONSTANTS.IMPACT_DAMAGE);
        }

        // Création de la flaque au sol
        spitterState.acidPools.push({
          id: `spitter_pool_${Date.now()}`,
          x: closeX,
          z: closeZ,
          radius: SPITTER_CONSTANTS.ACID_POOL_RADIUS,
          remainingDuration: SPITTER_CONSTANTS.ACID_POOL_DURATION,
        });

        if (audio && typeof audio.playSpitterAcidSplatImpact === 'function') {
          audio.playSpitterAcidSplatImpact();
        }

        return false;
      }
    }

    return true;
  });

  // Érosion des flaques d'acide au sol
  spitterState.acidPools = spitterState.acidPools.filter(pool => {
    pool.remainingDuration -= dt;
    if (pool.remainingDuration <= 0) return false;

    if (targetEntity && !targetEntity.isDead) {
      const tx = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
      const tz = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);
      const dx = tx - pool.x;
      const dz = tz - pool.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= pool.radius) {
        const poolDmg = SPITTER_CONSTANTS.ACID_POOL_DPS * dt;
        if (typeof targetEntity.takeDamage === 'function') {
          targetEntity.takeDamage(poolDmg, 'acid_pool_burn');
        } else if (typeof targetEntity.health === 'number') {
          targetEntity.health = Math.max(0, targetEntity.health - poolDmg);
        }
      }
    }

    return true;
  });
}
