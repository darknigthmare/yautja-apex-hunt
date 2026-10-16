// Secteur de Danger Environnemental : Flore Neurotoxique de la Planète Réserve (Lore 1:1)
// Référence canonique : Predators (2010) - Flore extraterrestre sécrétant une sève neurotoxique hautement paralysante

import { audioSynth } from '../AudioSynthesizer.js';

export const PLANT_HAZARD_CONSTANTS = {
  TRIGGER_RADIUS: 2.2,             // Rayon de détection tactile de la plante (m)
  SPORE_CLOUD_RADIUS: 5.0,         // Rayon de diffusion du nuage de spores neurotoxiques
  CLOUD_DURATION: 5.5,             // Persistance de l'aérosol toxique (s)
  TOXIN_ACCUMULATION_RATE: 28.0,   // Taux d'empoisonnement par seconde passée dans le nuage
  PARALYSIS_THRESHOLD: 100.0,      // Seuil d'empoisonnement déclenchant la paralysie totale
  PARALYSIS_DURATION: 3.5,         // Durée d'immobilisation motrice complète (s)
  HARVEST_VENOM_AMOUNT: 3,         // Doses de neurotoxine récoltables par bulbe mûr
};

export function createGamePreservePlantState() {
  return {
    plantNodes: [
      { id: 'plant_cluster_1', x: -14.0, y: 0, z: -25.0, isRuptured: false, hasVenom: true },
      { id: 'plant_cluster_2', x: 22.0,  y: 0, z: -35.0, isRuptured: false, hasVenom: true },
      { id: 'plant_cluster_3', x: 0.0,   y: 0, z: -55.0, isRuptured: false, hasVenom: true },
    ],
    activeGasClouds: [],
    harvestedVenomDoses: 0,
    coatedBladeCharges: 0,
  };
}

export function triggerPlantRupture(state, plantId, audio = audioSynth) {
  if (!state) return false;
  const plant = state.plantNodes.find(p => p.id === plantId);
  if (!plant || plant.isRuptured) return false;

  plant.isRuptured = true;

  const cloud = {
    id: `gas_cloud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: plant.x,
    y: plant.y + 0.6,
    z: plant.z,
    radius: PLANT_HAZARD_CONSTANTS.SPORE_CLOUD_RADIUS,
    durationRemaining: PLANT_HAZARD_CONSTANTS.CLOUD_DURATION,
  };

  state.activeGasClouds.push(cloud);

  if (audio && typeof audio.playNeurotoxinPodBurst === 'function') {
    audio.playNeurotoxinPodBurst();
  }
  if (audio && typeof audio.playParalyticHiss === 'function') {
    audio.playParalyticHiss();
  }

  return true;
}

export function harvestPlantVenom(state, plantId) {
  if (!state) return 0;
  const plant = state.plantNodes.find(p => p.id === plantId);
  if (!plant || !plant.hasVenom) return 0;

  plant.hasVenom = false;
  state.harvestedVenomDoses += PLANT_HAZARD_CONSTANTS.HARVEST_VENOM_AMOUNT;
  return PLANT_HAZARD_CONSTANTS.HARVEST_VENOM_AMOUNT;
}

export function coatBladeWithNeurotoxin(state) {
  if (!state || state.harvestedVenomDoses <= 0) return false;
  state.harvestedVenomDoses -= 1;
  state.coatedBladeCharges += 2; // Confère 2 frappes tranchantes empoisonnées
  return true;
}

export function updateGamePreservePlants(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Vérification de piétinement des bulbes
  for (const plant of state.plantNodes) {
    if (plant.isRuptured) continue;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - plant.x;
      const dz = ez - plant.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= PLANT_HAZARD_CONSTANTS.TRIGGER_RADIUS) {
        triggerPlantRupture(state, plant.id, audio);
        break;
      }
    }
  }

  // Évolution des nuages de gaz toxique et application de la neurotoxine
  state.activeGasClouds = state.activeGasClouds.filter(cloud => {
    cloud.durationRemaining -= dt;
    if (cloud.durationRemaining <= 0) return false;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      // Les synthétiques sont insensibles à la neurotoxine biologique
      if (ent.isSynthetic) continue;

      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ey = ent.y ?? (ent.position ? ent.position.y : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - cloud.x;
      const dy = ey - cloud.y;
      const dz = ez - cloud.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= cloud.radius) {
        ent.neurotoxinPoison = Math.min(
          PLANT_HAZARD_CONSTANTS.PARALYSIS_THRESHOLD,
          (ent.neurotoxinPoison || 0) + PLANT_HAZARD_CONSTANTS.TOXIN_ACCUMULATION_RATE * dt
        );

        ent.moveSpeedModifier = 0.5; // Ralentissement nerveux

        if (ent.neurotoxinPoison >= PLANT_HAZARD_CONSTANTS.PARALYSIS_THRESHOLD) {
          ent.isParalyzed = true;
          ent.paralysisTimer = PLANT_HAZARD_CONSTANTS.PARALYSIS_DURATION;
        }
      }
    }

    return true;
  });
}
