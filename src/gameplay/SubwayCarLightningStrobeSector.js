// Secteur de Niveau : Rame de Métro Stroboscopique & Arcs Électriques (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le massacre du métro de Los Angeles sous les éclairs stroboscopiques et courts-circuits

import { audioSynth } from '../AudioSynthesizer.js';

export const SUBWAY_STROBE_CONSTANTS = {
  STROBE_CYCLE_DURATION: 0.28,         // Fréquence stroboscopique des néons clignotants (s)
  DARKNESS_RATIO: 0.45,                // 45% du temps passé en obscurité totale
  ARC_DAMAGE: 45.0,                    // Dégâts de court-circuit électrique
  ARC_RADIUS: 2.2,                     // Rayon de décharge du 3e rail / câbles rompus
  DISORIENTATION_PENALTY: 0.45,        // -45% de précision de tir sous stroboscope
};

export function createSubwayStrobeState() {
  return {
    cycleTimer: 0.0,
    isLit: true,
    sparkArcs: [
      { id: 'arc_third_rail_01', x: -1.2, z: -10.0, active: true },
      { id: 'arc_broken_cable_02', x: 1.2, z: -22.0, active: true },
    ],
    disruptedCloaksCount: 0,
  };
}

export function triggerElectricalArc(state, x, z, audio = audioSynth) {
  if (!state) return;
  const newArc = {
    id: `arc_${Date.now()}`,
    x: Number(x) || 0,
    z: Number(z) || 0,
    active: true,
    timer: 3.5,
  };
  state.sparkArcs.push(newArc);

  if (audio && typeof audio.playUVPhosphorSizzle === 'function') {
    audio.playUVPhosphorSizzle();
  }
}

export function updateSubwayStrobeSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.cycleTimer += dt;
  if (state.cycleTimer >= SUBWAY_STROBE_CONSTANTS.STROBE_CYCLE_DURATION) {
    state.cycleTimer = 0.0;
    state.isLit = !state.isLit;
  }

  // Traitement des entités dans la rame
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    // Effet stroboscopique sur la précision et l'orientation
    ent.isStrobeDisoriented = !state.isLit;
    ent.accuracyPenalty = !state.isLit ? SUBWAY_STROBE_CONSTANTS.DISORIENTATION_PENALTY : 0.0;

    // Perturbation du camouflage optique Yautja synchronisée sur les décharges électriques
    if (ent.isCloaked && !state.isLit) {
      ent.isCloakFlickering = true;
      state.disruptedCloaksCount++;
    } else {
      ent.isCloakFlickering = false;
    }

    // Risque de décharge électrique au contact des câbles
    for (const arc of state.sparkArcs) {
      if (!arc.active) continue;
      const dx = ex - arc.x;
      const dz = ez - arc.z;
      if (Math.sqrt(dx * dx + dz * dz) <= SUBWAY_STROBE_CONSTANTS.ARC_RADIUS) {
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(SUBWAY_STROBE_CONSTANTS.ARC_DAMAGE * dt, 'electric_arc');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - SUBWAY_STROBE_CONSTANTS.ARC_DAMAGE * dt);
        }
      }
    }
  }
}
