// Système de Balise de Repli & Micro-Téléportation Tactique (The Predator 2018 / Comics — Lore 1:1)
// Référence canonique : The Predator (2018) & Comics — Balise quantique de dégagement d'urgence avec onde de choc thermique résiduelle

import { audioSynth } from '../AudioSynthesizer.js';

export const BEACON_CONSTANTS = {
  TELEPORT_RANGE: 16.0,                // Distance de translation instantanée (m)
  THERMAL_BLAST_RADIUS: 4.5,           // Rayon de l'onde de choc résiduelle (m)
  THERMAL_BLAST_DAMAGE: 95.0,          // Dégâts thermiques infligés aux assaillants proches
  COOLDOWN_TIME: 20.0,                 // Temps de recharge du condensateur quantique (s)
};

export function createDisengagementBeaconState() {
  return {
    isBeaconDeployed: false,
    beaconPos: null,
    cooldownTimer: 0.0,
    teleportsExecuted: 0,
    enemiesRepelledCount: 0,
  };
}

export function deployQuantumBeacon(state, deployPos, audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return false;

  state.isBeaconDeployed = true;
  state.beaconPos = { x: deployPos.x || 0, z: deployPos.z || 0 };

  if (audio && typeof audio.playQuantumBeaconDeployHum === 'function') {
    audio.playQuantumBeaconDeployHum();
  }
  return true;
}

export function triggerEmergencyTeleport(state, hunterEntity, escapeAngle = 0, enemies = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0 || !hunterEntity) return false;

  const hx = hunterEntity.x ?? (hunterEntity.position ? hunterEntity.position.x : 0);
  const hz = hunterEntity.z ?? (hunterEntity.position ? hunterEntity.position.z : 0);

  // Translation du chasseur
  const destX = hx + Math.cos(escapeAngle) * BEACON_CONSTANTS.TELEPORT_RANGE;
  const destZ = hz + Math.sin(escapeAngle) * BEACON_CONSTANTS.TELEPORT_RANGE;

  if (hunterEntity.position) {
    hunterEntity.position.x = destX;
    hunterEntity.position.z = destZ;
  }
  hunterEntity.x = destX;
  hunterEntity.z = destZ;

  state.teleportsExecuted++;
  state.cooldownTimer = BEACON_CONSTANTS.COOLDOWN_TIME;
  state.isBeaconDeployed = false;

  if (audio && typeof audio.playTeleportThermalPulseZap === 'function') {
    audio.playTeleportThermalPulseZap();
  }

  // Onde de choc thermique au point d'origine
  for (const ent of enemies) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);
    const dist = Math.sqrt((ex - hx) ** 2 + (ez - hz) ** 2);

    if (dist <= BEACON_CONSTANTS.THERMAL_BLAST_RADIUS) {
      state.enemiesRepelledCount++;
      if (typeof ent.takeDamage === 'function') {
        ent.takeDamage(BEACON_CONSTANTS.THERMAL_BLAST_DAMAGE, 'teleport_thermal_blast');
      } else if (typeof ent.health === 'number') {
        ent.health = Math.max(0, ent.health - BEACON_CONSTANTS.THERMAL_BLAST_DAMAGE);
      }
      ent.isKnockedBack = true;
      ent.isStaggered = true;
      ent.staggerTimer = 1.8;
    }
  }

  return true;
}

export function updateDisengagementBeacon(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }
}
