// Système de Disrupteur Énergétique IEMP & Double Canon Plasma (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Onde IEMP de gantelet exo-technologique désactivant les boucliers d'énergie et systèmes électroniques

import { audioSynth } from '../AudioSynthesizer.js';

export const DISRUPTOR_CONSTANTS = {
  EMP_RADIUS: 16.0,                    // Portée de l'onde de choc électromagnétique (m)
  SHIELD_DRAIN_AMOUNT: 120.0,          // Épuisement instantané des boucliers holographiques
  ENERGY_COST: 35.0,                   // Coût en énergie du gantelet
  COOLDOWN: 6.0,                       // Temps de recharge de l'émetteur (s)
  DRONE_DISABLE_DURATION: 3.2,         // Durée de neutralisation des drones automatiques (s)
};

export function createExoDisruptorState() {
  return {
    energyReserve: 100.0,
    cooldownTimer: 0.0,
    disruptedEntitiesCount: 0,
    pulsesFired: 0,
  };
}

export function fireEMPDisruptorWave(state, originPos, targets = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0 || state.energyReserve < DISRUPTOR_CONSTANTS.ENERGY_COST) {
    return { success: false, reason: 'Énergie insuffisante ou en recharge' };
  }

  state.energyReserve -= DISRUPTOR_CONSTANTS.ENERGY_COST;
  state.cooldownTimer = DISRUPTOR_CONSTANTS.COOLDOWN;
  state.pulsesFired++;

  if (audio && typeof audio.playHoloShieldDeflectZap === 'function') {
    audio.playHoloShieldDeflectZap();
  }

  let affected = 0;
  const ox = originPos?.x || 0;
  const oz = originPos?.z || 0;

  for (const target of targets) {
    if (!target || target.isDead) continue;
    const tx = target.x ?? (target.position ? target.position.x : 0);
    const tz = target.z ?? (target.position ? target.position.z : 0);
    const dx = tx - ox;
    const dz = tz - oz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= DISRUPTOR_CONSTANTS.EMP_RADIUS) {
      affected++;
      state.disruptedEntitiesCount++;

      // Épuisement des boucliers d'énergie
      if (typeof target.shieldEnergy === 'number') {
        target.shieldEnergy = Math.max(0, target.shieldEnergy - DISRUPTOR_CONSTANTS.SHIELD_DRAIN_AMOUNT);
      }
      if (target.isShieldActive) {
        target.isShieldActive = false;
      }

      // Neutralisation des drones et synthétiques
      if (target.species === 'synthetic' || target.species === 'falcon_drone' || target.role === 'drone') {
        target.isEMPDisabled = true;
        target.empDisableTimer = DISRUPTOR_CONSTANTS.DRONE_DISABLE_DURATION;
      }
    }
  }

  return { success: true, targetsAffected: affected };
}

export function updateExoDisruptor(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  if (state.energyReserve < 100.0) {
    state.energyReserve = Math.min(100.0, state.energyReserve + dt * 8.0);
  }
}
