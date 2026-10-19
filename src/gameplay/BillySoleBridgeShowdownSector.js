// Secteur de Niveau : Défilé du Pont de Cordes & Sacrifice de Billy Sole (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le duel d'arrière-garde de Billy sur le pont de troncs et cordes surplombant la gorge

import { audioSynth } from '../AudioSynthesizer.js';

export const BRIDGE_CONSTANTS = {
  BRIDGE_LENGTH: 18.0,                 // Longueur du pont au-dessus de la faille (m)
  BRIDGE_WIDTH: 2.2,                   // Largeur étroite du passage
  GORGE_DEPTH: 40.0,                   // Profondeur mortelle du ravin (m)
  FALL_LETHAL_DAMAGE: 400.0,           // Dégâts de chute fatale dans les rochers
  ROPE_MAX_HEALTH: 45.0,
};

export function createBridgeShowdownState(origin = { x: 0, z: -30.0 }) {
  return {
    center: { x: origin.x || 0, z: origin.z || -30.0 },
    ropes: [
      { id: 'rope_left',  health: BRIDGE_CONSTANTS.ROPE_MAX_HEALTH, isCut: false },
      { id: 'rope_right', health: BRIDGE_CONSTANTS.ROPE_MAX_HEALTH, isCut: false },
    ],
    isCollapsed: false,
    fallenVictimsCount: 0,
  };
}

export function damageBridgeRope(state, ropeId, damageAmount = 50.0, audio = audioSynth) {
  if (!state || state.isCollapsed) return { collapsed: false };
  const rope = state.ropes.find(r => r.id === ropeId);
  if (!rope || rope.isCut) return { collapsed: false };

  rope.health -= Number(damageAmount) || 0;
  if (rope.health <= 0) {
    rope.isCut = true;

    if (audio && typeof audio.playRopeBridgeSnapCreak === 'function') {
      audio.playRopeBridgeSnapCreak();
    }

    // Si les deux câbles sont rompus, effondrement total du pont
    const allCut = state.ropes.every(r => r.isCut);
    if (allCut) {
      state.isCollapsed = true;
      return { collapsed: true };
    }
  }

  return { collapsed: false, remainingHealth: rope.health };
}

export function updateBridgeShowdownSector(state, delta, entities = [], audio = audioSynth) {
  if (!state || !state.isCollapsed) return;

  const bx = state.center.x;
  const bz = state.center.z;

  // Précipitation dans le vide des entités situées sur le tablier du pont
  for (const ent of entities) {
    if (!ent || ent.isDead || ent.hasPlunged) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    const onBridgeX = Math.abs(ex - bx) <= (BRIDGE_CONSTANTS.BRIDGE_WIDTH / 2);
    const onBridgeZ = Math.abs(ez - bz) <= (BRIDGE_CONSTANTS.BRIDGE_LENGTH / 2);

    if (onBridgeX && onBridgeZ) {
      ent.hasPlunged = true;
      ent.isDead = true;
      state.fallenVictimsCount++;

      if (typeof ent.takeDamage === 'function') {
        ent.takeDamage(BRIDGE_CONSTANTS.FALL_LETHAL_DAMAGE, 'gorge_chasm_fall');
      } else if (typeof ent.health === 'number') {
        ent.health = 0;
      }

      if (audio && typeof audio.playGorgePlungeWhoosh === 'function') {
        audio.playGorgePlungeWhoosh();
      }
    }
  }
}
