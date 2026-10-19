// Lance-Filet Piégé Automatique de Campement Super Predator (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Les pièges à ressort autonomes disséminés autour du campement de chasse qui projettent un filet métallique sur tout intrus franchissant le périmètre.

import { audioSynth } from '../AudioSynthesizer.js';

export const AUTO_NET_TRAP_CONSTANTS = {
  TRIGGER_RADIUS_M: 2.8,             // Rayon de déclenchement du piège mécanique
  NET_IMPACT_DAMAGE: 70,             // Dégâts de contusion et serrage initial
};

export function createAutonomousNetTrapSectorState() {
  return {
    netTraps: [],
    capturedCount: 0,
  };
}

export function deployAutonomousSpringNetTrap(state, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.netTraps.push({
    x: position.x || 0,
    z: position.z || 0,
    armed: true,
  });
  return true;
}

export function evaluateAutonomousNetTrapTrigger(state, actor, audio = audioSynth) {
  if (!state || !actor || !Array.isArray(state.netTraps)) {
    return { captured: false };
  }

  for (const trap of state.netTraps) {
    if (!trap.armed) continue;
    const dist = Math.hypot((actor.x || 0) - trap.x, (actor.z || 0) - trap.z);
    if (dist <= AUTO_NET_TRAP_CONSTANTS.TRIGGER_RADIUS_M) {
      trap.armed = false;
      state.capturedCount++;

      if (audio && typeof audio.playSpringLoadedNetTrapSnap === 'function') {
        audio.playSpringLoadedNetTrapSnap();
      }

      actor.isCapturedInSpringNet = true;
      actor.canMove = false;

      if (typeof actor.takeDamage === 'function') {
        actor.takeDamage(AUTO_NET_TRAP_CONSTANTS.NET_IMPACT_DAMAGE);
      } else if (typeof actor.health === 'number') {
        actor.health = Math.max(0, actor.health - AUTO_NET_TRAP_CONSTANTS.NET_IMPACT_DAMAGE);
      }

      return {
        captured: true,
        damageDealt: AUTO_NET_TRAP_CONSTANTS.NET_IMPACT_DAMAGE,
      };
    }
  }

  return { captured: false };
}
