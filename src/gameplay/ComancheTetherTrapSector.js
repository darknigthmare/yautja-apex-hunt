// Secteur de Pièges à Lanières de Cuir Brut & Trébuchement Comanche (Prey — Lore 1:1)
// Référence canonique : Prey (2022) — Naru et les chasseurs Comanches dissimulent des cordes en babiche et racines tendues dans les hautes herbes

import { audioSynth } from '../AudioSynthesizer.js';

export const COMANCHE_TRAP_CONSTANTS = {
  TRIPWIRE_TRIGGER_RADIUS: 1.25,        // Rayon de déclenchement du lacet au sol
  CORD_HEALTH: 45.0,                   // Résistance de la lanière avant d'être tranchée par des lames de poignet
  STUMBLE_DURATION: 2.4,               // Durée du déséquilibre / trébuchement (s)
  STUMBLE_SPEED_PENALTY: 0.65,         // -65% de vitesse pendant le déséquilibre
  SCOUT_ALERT_RADIUS: 32.0,            // Rayon d'alerte des guetteurs comanches
  ALERT_DECAY_RATE: 0.05,              // Décroissance de la vigilance par seconde
};

export function createComancheTetherTrapState(initialTraps = null) {
  const defaultTraps = [
    { id: 'comanche_trap_01', x: 5.0,  z: 12.0, isArmed: true, isTripped: false, cordHealth: COMANCHE_TRAP_CONSTANTS.CORD_HEALTH },
    { id: 'comanche_trap_02', x: -3.5, z: 18.0, isArmed: true, isTripped: false, cordHealth: COMANCHE_TRAP_CONSTANTS.CORD_HEALTH },
    { id: 'comanche_trap_03', x: 0.0,  z: 25.0, isArmed: true, isTripped: false, cordHealth: COMANCHE_TRAP_CONSTANTS.CORD_HEALTH },
    { id: 'comanche_trap_04', x: 8.5,  z: 30.0, isArmed: true, isTripped: false, cordHealth: COMANCHE_TRAP_CONSTANTS.CORD_HEALTH },
  ];

  return {
    traps: initialTraps || defaultTraps,
    scoutAlertLevel: 0.0,              // Entre 0.0 (calme) et 1.0 (alerte maximale)
    trappedVictims: [],
  };
}

export function placeTetherTrap(state, x, z) {
  if (!state || !state.traps) return null;
  const newTrap = {
    id: `comanche_trap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(x) || 0,
    z: Number(z) || 0,
    isArmed: true,
    isTripped: false,
    cordHealth: COMANCHE_TRAP_CONSTANTS.CORD_HEALTH,
  };
  state.traps.push(newTrap);
  return newTrap;
}

export function triggerTetherTrap(state, trap, entity, audio = audioSynth) {
  if (!state || !trap || !trap.isArmed || trap.isTripped) return false;

  trap.isTripped = true;
  trap.isArmed = false;

  if (entity) {
    entity.isStumbled = true;
    entity.stumbleTimer = COMANCHE_TRAP_CONSTANTS.STUMBLE_DURATION;
    entity.speedMultiplier = 1.0 - COMANCHE_TRAP_CONSTANTS.STUMBLE_SPEED_PENALTY;
    state.trappedVictims.push(entity.id || 'target');
  }

  // Augmentation du niveau d'alerte des éclaireurs
  state.scoutAlertLevel = Math.min(1.0, state.scoutAlertLevel + 0.35);

  if (audio && typeof audio.playRawhideSnapTwang === 'function') {
    audio.playRawhideSnapTwang();
  }

  return true;
}

export function severTetherCord(state, trapId, bladeDamage = 50.0) {
  if (!state || !state.traps) return false;
  const trap = state.traps.find(t => t.id === trapId);
  if (!trap || !trap.isArmed) return false;

  trap.cordHealth -= bladeDamage;
  if (trap.cordHealth <= 0) {
    trap.isArmed = false;
    trap.isSevered = true;
    return true;
  }
  return false;
}

export function updateComancheTetherTraps(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Décroissance naturelle de l'alerte des éclaireurs comanches
  if (state.scoutAlertLevel > 0) {
    state.scoutAlertLevel = Math.max(0, state.scoutAlertLevel - COMANCHE_TRAP_CONSTANTS.ALERT_DECAY_RATE * dt);
  }

  // Mise à jour de l'état de trébuchement des entités
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;

    if (ent.isStumbled && ent.stumbleTimer > 0) {
      ent.stumbleTimer -= dt;
      if (ent.stumbleTimer <= 0) {
        ent.isStumbled = false;
        ent.speedMultiplier = 1.0;
      }
    }

    // Détection de contact avec les pièges armés
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    for (const trap of state.traps) {
      if (!trap.isArmed || trap.isTripped) continue;

      const dx = ex - trap.x;
      const dz = ez - trap.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= COMANCHE_TRAP_CONSTANTS.TRIPWIRE_TRIGGER_RADIUS) {
        triggerTetherTrap(state, trap, ent, audio);
      }
    }
  }
}
