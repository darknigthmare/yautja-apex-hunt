// Secteur de Niveau : Chambre Froide Industrielle & Carcasses Suspendues (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Abattoir frigorifique de Los Angeles où l'équipe OWLF de Peter Keyes traque le City Hunter

import { audioSynth } from '../AudioSynthesizer.js';

export const MEAT_LOCKER_CONSTANTS = {
  AMBIENT_TEMPERATURE_C: -15.0,        // Température sous zéro figeant le sang
  THERMAL_MASKING_RADIUS: 1.8,          // Proximité nécessaire avec une carcasse pour masquer la signature infrarouge
  THERMAL_MASKING_FACTOR: 0.78,         // Réduction de 78% de la visibilité thermique derrière une carcasse congelée
  CARCASS_MASS_KG: 280.0,               // Masse moyenne d'une carcasse bovine congelée
  CARCASS_SWING_DAMPING: 0.95,          // Amortissement pendulaire par seconde
  CARCASS_HEALTH: 140.0,                // Résistance balistique avant rupture du crochet de suspension
  FALL_CRUSH_DAMAGE: 85.0,              // Dégâts d'écrasement lorsqu'une carcasse chute
  FALL_STAGGER_DURATION: 2.2,           // Durée d'étourdissement au sol (s)
  RAIL_HEIGHT: 3.5,                     // Hauteur des rails de suspension au plafond (m)
};

export function createMeatLockerState(customRails = null) {
  const defaultCarcasses = [
    { id: 'carcass_rail_01', railX: -4.0, railZ: -10.0, length: 2.2, swingAngleX: 0, swingAngleZ: 0, angularVelX: 0, angularVelZ: 0, health: MEAT_LOCKER_CONSTANTS.CARCASS_HEALTH, isDetached: false, y: 1.3 },
    { id: 'carcass_rail_02', railX: -1.5, railZ: -12.5, length: 2.2, swingAngleX: 0, swingAngleZ: 0, angularVelX: 0, angularVelZ: 0, health: MEAT_LOCKER_CONSTANTS.CARCASS_HEALTH, isDetached: false, y: 1.3 },
    { id: 'carcass_rail_03', railX: 1.5,  railZ: -11.0, length: 2.2, swingAngleX: 0, swingAngleZ: 0, angularVelX: 0, angularVelZ: 0, health: MEAT_LOCKER_CONSTANTS.CARCASS_HEALTH, isDetached: false, y: 1.3 },
    { id: 'carcass_rail_04', railX: 4.0,  railZ: -14.0, length: 2.2, swingAngleX: 0, swingAngleZ: 0, angularVelX: 0, angularVelZ: 0, health: MEAT_LOCKER_CONSTANTS.CARCASS_HEALTH, isDetached: false, y: 1.3 },
    { id: 'carcass_rail_05', railX: -2.5, railZ: -16.0, length: 2.2, swingAngleX: 0, swingAngleZ: 0, angularVelX: 0, angularVelZ: 0, health: MEAT_LOCKER_CONSTANTS.CARCASS_HEALTH, isDetached: false, y: 1.3 },
    { id: 'carcass_rail_06', railX: 2.0,  railZ: -18.0, length: 2.2, swingAngleX: 0, swingAngleZ: 0, angularVelX: 0, angularVelZ: 0, health: MEAT_LOCKER_CONSTANTS.CARCASS_HEALTH, isDetached: false, y: 1.3 },
  ];

  return {
    ambientTemperature: MEAT_LOCKER_CONSTANTS.AMBIENT_TEMPERATURE_C,
    freezerFansActive: true,
    freezerFanHumTimer: 0,
    carcasses: customRails || defaultCarcasses,
    frostFogIntensity: 0.85,
  };
}

export function pushCarcass(state, carcassId, impulseX = 0, impulseZ = 0, audio = audioSynth) {
  if (!state || !state.carcasses) return false;
  const carcass = state.carcasses.find(c => c.id === carcassId);
  if (!carcass || carcass.isDetached) return false;

  carcass.angularVelX += Number(impulseX) || 0;
  carcass.angularVelZ += Number(impulseZ) || 0;

  if (audio && typeof audio.playMeatHookRattle === 'function') {
    audio.playMeatHookRattle();
  }
  return true;
}

export function damageCarcass(state, carcassId, damageAmount, audio = audioSynth) {
  if (!state || !state.carcasses) return { detached: false };
  const carcass = state.carcasses.find(c => c.id === carcassId);
  if (!carcass || carcass.isDetached) return { detached: false };

  carcass.health = Math.max(0, carcass.health - damageAmount);
  if (carcass.health <= 0) {
    carcass.isDetached = true;
    carcass.y = 0; // Chute au sol
    carcass.angularVelX = 0;
    carcass.angularVelZ = 0;
    carcass.swingAngleX = 0;
    carcass.swingAngleZ = 0;

    if (audio && typeof audio.playColdBovineThud === 'function') {
      audio.playColdBovineThud();
    }
    return { detached: true, fallenAt: { x: carcass.railX, z: carcass.railZ } };
  }

  // Si non détachée, l'impact fait osciller la carcasse
  pushCarcass(state, carcassId, damageAmount * 0.03, damageAmount * 0.02, audio);
  return { detached: false, remainingHealth: carcass.health };
}

export function calculateThermalMasking(state, entityPos) {
  if (!state || !entityPos || !state.carcasses) return 0.0;
  let maxMasking = 0.0;

  for (const c of state.carcasses) {
    if (c.isDetached) continue;
    const currentX = c.railX + Math.sin(c.swingAngleX) * c.length;
    const currentZ = c.railZ + Math.sin(c.swingAngleZ) * c.length;
    const dx = entityPos.x - currentX;
    const dz = entityPos.z - currentZ;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= MEAT_LOCKER_CONSTANTS.THERMAL_MASKING_RADIUS) {
      const proximityFactor = 1.0 - (dist / MEAT_LOCKER_CONSTANTS.THERMAL_MASKING_RADIUS);
      const effectiveMask = MEAT_LOCKER_CONSTANTS.THERMAL_MASKING_FACTOR * proximityFactor;
      if (effectiveMask > maxMasking) {
        maxMasking = effectiveMask;
      }
    }
  }

  return Math.min(1.0, maxMasking);
}

export function updateMeatLockerSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Mise à jour de la boucle ambiante de ventilation frigorifique
  if (state.freezerFansActive) {
    state.freezerFanHumTimer += dt;
    if (state.freezerFanHumTimer >= 6.0) {
      state.freezerFanHumTimer = 0;
      if (audio && typeof audio.playMeatLockerFreezerFan === 'function') {
        audio.playMeatLockerFreezerFan();
      }
    }
  }

  // Simulation pendulaire des carcasses
  const gravity = 9.81;
  for (const c of state.carcasses) {
    if (c.isDetached) continue;

    // Équation pendulaire avec rappel élastique & gravité: d²θ/dt² = -(g/L)*sin(θ)
    const angularAccX = -(gravity / c.length) * Math.sin(c.swingAngleX);
    const angularAccZ = -(gravity / c.length) * Math.sin(c.swingAngleZ);

    c.angularVelX += angularAccX * dt;
    c.angularVelZ += angularAccZ * dt;

    // Amortissement
    const damping = Math.pow(MEAT_LOCKER_CONSTANTS.CARCASS_SWING_DAMPING, dt * 30.0);
    c.angularVelX *= damping;
    c.angularVelZ *= damping;

    c.swingAngleX += c.angularVelX * dt;
    c.swingAngleZ += c.angularVelZ * dt;
  }

  // Appliquer le masquage thermique aux entités présentes dans le secteur
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);
    const masking = calculateThermalMasking(state, { x: ex, z: ez });

    ent.thermalMaskingFactor = masking;
    ent.isThermalConcealed = masking > 0.45;
  }
}
