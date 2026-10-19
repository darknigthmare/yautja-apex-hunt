// Secteur de Niveau : Bourbier Mouvant & Piège d'Enlisement (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Le bourbier de glaise mouvante où Naru attire et piège le Feral Predator pour le combat final

import { audioSynth } from '../AudioSynthesizer.js';

export const MUD_BOG_CONSTANTS = {
  BOG_RADIUS: 5.2,                     // Rayon de la fondrière mouvante (m)
  SINK_RATE_PER_SEC: 0.18,             // Vitesse d'enfoncement dans la boue (m/s)
  CRITICAL_SUBMERSION_DEPTH: 1.6,      // Profondeur critique d'asphyxie (m)
  MUD_DRAG_SPEED_PENALTY: 0.80,        // -80% de mobilité dans la boue liquide
  SUCTION_BUBBLE_INTERVAL: 4.0,        // Intervalle de gargouillement de succion (s)
};

export function createMudBogState(origin = { x: 0, z: -15.0 }) {
  return {
    center: { x: origin.x || 0, z: origin.z || -15.0 },
    radius: MUD_BOG_CONSTANTS.BOG_RADIUS,
    suctionTimer: 0.0,
    enmiredCount: 0,
    submergedVictimsCount: 0,
  };
}

export function updateMudBogSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.suctionTimer += dt;
  if (state.suctionTimer >= MUD_BOG_CONSTANTS.SUCTION_BUBBLE_INTERVAL) {
    state.suctionTimer = 0;
    if (audio && typeof audio.playMudBogSuctionGurgle === 'function') {
      audio.playMudBogSuctionGurgle();
    }
  }

  const bx = state.center.x;
  const bz = state.center.z;

  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);
    const dist = Math.sqrt((ex - bx) ** 2 + (ez - bz) ** 2);

    if (dist <= state.radius) {
      ent.isEnmiredInMud = true;
      ent.speedMultiplier = 1.0 - MUD_BOG_CONSTANTS.MUD_DRAG_SPEED_PENALTY;
      ent.sinkDepth = Math.min(
        MUD_BOG_CONSTANTS.CRITICAL_SUBMERSION_DEPTH,
        (ent.sinkDepth || 0) + MUD_BOG_CONSTANTS.SINK_RATE_PER_SEC * dt
      );

      // Si complètement submergé dans la vase
      if (ent.sinkDepth >= MUD_BOG_CONSTANTS.CRITICAL_SUBMERSION_DEPTH) {
        ent.isSubmergedInBog = true;
        state.submergedVictimsCount++;

        const suffocationDamage = 35.0 * dt;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(suffocationDamage, 'bog_suffocation');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - suffocationDamage);
        }
      }
    } else {
      ent.isEnmiredInMud = false;
      if (ent.sinkDepth > 0) {
        ent.sinkDepth = Math.max(0, ent.sinkDepth - dt * 0.5);
      }
    }
  }
}
