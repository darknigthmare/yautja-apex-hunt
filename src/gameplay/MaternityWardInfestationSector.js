// Secteur de Niveau : Maternité Infestée & Nids d'Incubation (AVP:R — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Le Predalien infeste le service maternité de l'hôpital de Gunnison avec des cocons de bio-résine

import { audioSynth } from '../AudioSynthesizer.js';

export const MATERNITY_CONSTANTS = {
  POD_HEALTH: 80.0,
  GESTATION_DURATION: 18.0,            // Temps avant émergence si les cocons ne sont pas détruits (s)
  SLIME_SLOW_FACTOR: 0.40,             // -40% de vitesse sur les flaques de sécrétions visqueuses
  SLIME_RADIUS: 2.2,
  ACID_BURST_DAMAGE: 50.0,             // Déflagration d'acide lors d'une perforation non cautérisée
  ACID_BURST_RADIUS: 3.2,
  BUBBLE_SOUND_INTERVAL: 4.5,          // Intervalle du gargouillis de bio-résine (s)
};

export function createMaternityWardState(customPods = null) {
  const defaultPods = [
    { id: 'pod_cradle_01', x: -4.5, y: 0.8, z: -12.0, health: MATERNITY_CONSTANTS.POD_HEALTH, gestationProgress: 0, isPurged: false, isRuptured: false },
    { id: 'pod_cradle_02', x: -1.0, y: 0.8, z: -15.5, health: MATERNITY_CONSTANTS.POD_HEALTH, gestationProgress: 4.0, isPurged: false, isRuptured: false },
    { id: 'pod_cradle_03', x: 3.5,  y: 0.8, z: -13.0, health: MATERNITY_CONSTANTS.POD_HEALTH, gestationProgress: 8.0, isPurged: false, isRuptured: false },
  ];

  return {
    pods: customPods || defaultPods,
    slimePools: [
      { id: 'slime_01', x: -4.5, z: -12.0, radius: MATERNITY_CONSTANTS.SLIME_RADIUS },
      { id: 'slime_02', x: 3.5,  z: -13.0, radius: MATERNITY_CONSTANTS.SLIME_RADIUS },
    ],
    bubbleTimer: 0,
    emergedBurstersCount: 0,
    purgedPodsCount: 0,
  };
}

export function damageIncubatorPod(state, podId, damageAmount, isThermalCauterized = false, audio = audioSynth) {
  if (!state || !state.pods) return { destroyed: false };
  const pod = state.pods.find(p => p.id === podId);
  if (!pod || pod.isPurged || pod.isRuptured) return { destroyed: false };

  pod.health = Math.max(0, pod.health - Number(damageAmount) || 0);

  if (pod.health <= 0) {
    if (isThermalCauterized) {
      // Destruction au plasma ou au feu: cautérise l'acide sans projection toxique
      pod.isPurged = true;
      state.purgedPodsCount++;
      return { destroyed: true, cauterized: true };
    } else {
      // Perforation par balle ou lame standard: projection acide explosive
      pod.isRuptured = true;
      state.purgedPodsCount++;
      return { destroyed: true, cauterized: false, acidExplosionRadius: MATERNITY_CONSTANTS.ACID_BURST_RADIUS };
    }
  }

  return { destroyed: false, remainingHealth: pod.health };
}

export function updateMaternityWardSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Ambiance de gargouillement de bio-résine
  state.bubbleTimer += dt;
  if (state.bubbleTimer >= MATERNITY_CONSTANTS.BUBBLE_SOUND_INTERVAL) {
    state.bubbleTimer = 0;
    if (audio && typeof audio.playIncubatorResinBubble === 'function') {
      audio.playIncubatorResinBubble();
    }
  }

  // Évolution de la gestation des cocons non purgés
  for (const pod of state.pods) {
    if (pod.isPurged || pod.isRuptured) continue;

    pod.gestationProgress += dt;
    if (pod.gestationProgress >= MATERNITY_CONSTANTS.GESTATION_DURATION) {
      // Éclosion des larves
      pod.isRuptured = true;
      state.emergedBurstersCount += 3;
    }
  }

  // Ralentissement sur les flaques de mucus/résine
  for (const ent of entities) {
    if (!ent || ent.isDead) continue;
    const ex = ent.x ?? (ent.position ? ent.position.x : 0);
    const ez = ent.z ?? (ent.position ? ent.position.z : 0);

    let onSlime = false;
    for (const pool of state.slimePools) {
      const dx = ex - pool.x;
      const dz = ez - pool.z;
      if (Math.sqrt(dx * dx + dz * dz) <= pool.radius) {
        onSlime = true;
        break;
      }
    }

    ent.isOnSlime = onSlime;
    if (onSlime) {
      ent.speedMultiplier = 1.0 - MATERNITY_CONSTANTS.SLIME_SLOW_FACTOR;
    } else if (!ent.isStumbled) {
      ent.speedMultiplier = 1.0;
    }
  }
}
