// Système de Canon Gatling Rotatif à Plasma Berserker (Lore 1:1)
// Référence canonique : Predators (2010) - Canon d'épaule rotatif à 3 fûts du Berserker / Mr. Black

import { audioSynth } from '../AudioSynthesizer.js';

export const ROTARY_GATLING_CONSTANTS = {
  SPOOL_UP_TIME: 0.25,           // Temps de montée en régime rotative des fûts (s)
  BURST_BOLT_COUNT: 3,           // Rafale de 3 décharges plasma cycliques
  BOLT_DAMAGE: 45.0,             // Dégâts par projectile de plasma concentré
  BOLT_SPEED: 65.0,              // Vitesse balistique du projectile de plasma (m/s)
  DISPERSION_CONE_ANGLE: 0.045,  // Angle de dispersion centrifuge (radians)
  HEAT_PER_BURST: 28.0,          // Accumulation thermique par cycle de tir
  COOLING_RATE_PER_SEC: 35.0,    // Dissipation thermique passive
  OVERHEAT_THRESHOLD: 100.0,     // Seuil de surchauffe provoquant un verrouillage de sécurité
  OVERHEAT_LOCK_DURATION: 2.2,   // Durée de ventilation forcée
};

export function createRotaryPlasmaGatlingState() {
  return {
    isSpooling: false,
    spoolProgress: 0,
    currentHeat: 0,
    isOverheated: false,
    overheatTimer: 0,
    activePlasmaBolts: [],
    firingBurstRemaining: 0,
    burstIntervalTimer: 0,
    burstTarget: null,
    muzzleOrigin: null,
  };
}

export function beginRotarySpool(state, audio = audioSynth) {
  if (!state || state.isOverheated) return false;
  state.isSpooling = true;
  if (state.spoolProgress < 0.1 && audio && typeof audio.playRotarySpoolUp === 'function') {
    audio.playRotarySpoolUp();
  }
  return true;
}

export function triggerRotaryGatlingBurst(state, origin, targetDir, audio = audioSynth) {
  if (!state || state.isOverheated || state.spoolProgress < 1.0) return false;

  state.firingBurstRemaining = ROTARY_GATLING_CONSTANTS.BURST_BOLT_COUNT;
  state.burstIntervalTimer = 0;
  state.muzzleOrigin = { x: origin.x, y: origin.y, z: origin.z };

  const len = Math.sqrt(targetDir.x * targetDir.x + targetDir.y * targetDir.y + targetDir.z * targetDir.z) || 1;
  state.burstTarget = { x: targetDir.x / len, y: targetDir.y / len, z: targetDir.z / len };

  // Accumulation de chaleur
  state.currentHeat += ROTARY_GATLING_CONSTANTS.HEAT_PER_BURST;
  if (state.currentHeat >= ROTARY_GATLING_CONSTANTS.OVERHEAT_THRESHOLD) {
    state.isOverheated = true;
    state.overheatTimer = ROTARY_GATLING_CONSTANTS.OVERHEAT_LOCK_DURATION;
    state.isSpooling = false;
    state.spoolProgress = 0;
  }

  if (audio && typeof audio.playGatlingBurstCycle === 'function') {
    audio.playGatlingBurstCycle();
  }

  return true;
}

export function updateRotaryPlasmaGatling(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Gestion de surchauffe
  if (state.isOverheated) {
    state.overheatTimer -= dt;
    if (state.overheatTimer <= 0) {
      state.isOverheated = false;
      state.currentHeat = 20.0;
    }
  } else {
    state.currentHeat = Math.max(0, state.currentHeat - ROTARY_GATLING_CONSTANTS.COOLING_RATE_PER_SEC * dt);
  }

  // Montée ou descente en régime des fûts
  if (state.isSpooling && !state.isOverheated) {
    state.spoolProgress = Math.min(1.0, state.spoolProgress + dt / ROTARY_GATLING_CONSTANTS.SPOOL_UP_TIME);
  } else {
    state.spoolProgress = Math.max(0, state.spoolProgress - dt * 2.5);
  }

  // Émission séquentielle des bolts de la rafale
  if (state.firingBurstRemaining > 0) {
    state.burstIntervalTimer -= dt;
    if (state.burstIntervalTimer <= 0) {
      state.firingBurstRemaining -= 1;
      state.burstIntervalTimer = 0.08; // 80ms entre chaque projectile du burst

      // Dispersion angulaire aléatoire dans le cône de tir
      const spreadX = (Math.random() - 0.5) * ROTARY_GATLING_CONSTANTS.DISPERSION_CONE_ANGLE;
      const spreadY = (Math.random() - 0.5) * ROTARY_GATLING_CONSTANTS.DISPERSION_CONE_ANGLE;
      const dirX = state.burstTarget.x + spreadX;
      const dirY = state.burstTarget.y + spreadY;
      const dirZ = state.burstTarget.z;
      const dLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1;

      state.activePlasmaBolts.push({
        id: `bolt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        x: state.muzzleOrigin.x,
        y: state.muzzleOrigin.y,
        z: state.muzzleOrigin.z,
        vx: (dirX / dLen) * ROTARY_GATLING_CONSTANTS.BOLT_SPEED,
        vy: (dirY / dLen) * ROTARY_GATLING_CONSTANTS.BOLT_SPEED,
        vz: (dirZ / dLen) * ROTARY_GATLING_CONSTANTS.BOLT_SPEED,
        lifetime: 2.0,
      });
    }
  }

  // Progression balistique et impacts par segment balistique continu (anti-tunneling)
  state.activePlasmaBolts = state.activePlasmaBolts.filter(bolt => {
    bolt.lifetime -= dt;
    if (bolt.lifetime <= 0) return false;

    const prevX = bolt.x;
    const prevY = bolt.y;
    const prevZ = bolt.z;

    const segDx = bolt.vx * dt;
    const segDy = bolt.vy * dt;
    const segDz = bolt.vz * dt;
    const segLenSq = segDx * segDx + segDy * segDy + segDz * segDz;

    bolt.x += segDx;
    bolt.y += segDy;
    bolt.z += segDz;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ey = ent.y ?? (ent.position ? ent.position.y : 1.5);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const radius = ent.collisionRadius || 1.1;

      let t = 0;
      if (segLenSq > 0.00001) {
        t = Math.max(0, Math.min(1, ((ex - prevX) * segDx + (ey - prevY) * segDy + (ez - prevZ) * segDz) / segLenSq));
      }
      const closeX = prevX + segDx * t;
      const closeY = prevY + segDy * t;
      const closeZ = prevZ + segDz * t;

      const cdx = closeX - ex;
      const cdy = closeY - ey;
      const cdz = closeZ - ez;
      const dist = Math.sqrt(cdx * cdx + cdy * cdy + cdz * cdz);

      if (dist <= radius) {
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(ROTARY_GATLING_CONSTANTS.BOLT_DAMAGE, 'rotary_plasma');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - ROTARY_GATLING_CONSTANTS.BOLT_DAMAGE);
        }
        return false; // Bolt détruit sur impact
      }
    }

    return true;
  });
}
