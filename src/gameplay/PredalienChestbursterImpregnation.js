// Système d'Implantation Directe d'Embryons et Gestation Prédalien (Lore 1:1)
// Référence canonique : AVP:R (2007) - Le Prédalien ("Chet") et son ovipositeur buccal insérant des grappes de chestbursters

import { audioSynth } from '../AudioSynthesizer.js';

export const PREDALIEN_CONSTANTS = {
  IMPLANT_GRAB_RANGE: 2.2,         // Portée de préhension de l'ovipositeur (m)
  IMPLANT_CHANNEL_TIME: 2.0,       // Temps de maintien pour insérer les embryons (s)
  GESTATION_DURATION: 8.0,         // Durée d'incubation accélérée avant éclosion (s)
  BURST_DAMAGE_LETHAL: 999.0,      // Rupture thoracique létale pour l'hôte
  EMBRYOS_PER_IMPLANT: 3,          // Nombre de chestbursters émergeant simultanément
};

export function createPredalienImplantationState() {
  return {
    isImplanting: false,
    channelTimer: 0,
    currentHost: null,
    activeIncubations: [],
    spawnedChestbursters: [],
    totalHostsBurst: 0,
  };
}

export function beginOralOvipositorImplantation(state, predalienPos, targetEntity, audio = audioSynth) {
  if (!state || !targetEntity || targetEntity.isDead || targetEntity.isImpregnated) return false;
  // Les synthétiques et les prédateurs adultes ne peuvent pas être incubés de cette manière
  if (targetEntity.isSynthetic || targetEntity.species === 'yautja') return false;

  const ex = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const ey = targetEntity.y ?? (targetEntity.position ? targetEntity.position.y : 0);
  const ez = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  const dx = ex - predalienPos.x;
  const dy = ey - predalienPos.y;
  const dz = ez - predalienPos.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist > PREDALIEN_CONSTANTS.IMPLANT_GRAB_RANGE) return false;

  state.isImplanting = true;
  state.channelTimer = PREDALIEN_CONSTANTS.IMPLANT_CHANNEL_TIME;
  state.currentHost = targetEntity;
  targetEntity.isImmobilized = true;

  if (audio && typeof audio.playPredalienOvipositorHiss === 'function') {
    audio.playPredalienOvipositorHiss();
  }

  return true;
}

export function updatePredalienImplantation(state, delta, audio = audioSynth) {
  if (!state) return [];
  const dt = Math.max(0, Number(delta) || 0);
  const newlySpawnedBursters = [];

  // Progression de la canalisation d'insertion buccale
  if (state.isImplanting && state.currentHost) {
    state.channelTimer -= dt;
    if (state.channelTimer <= 0) {
      // Implantation réussie de la grappe d'embryons
      const host = state.currentHost;
      host.isImpregnated = true;
      host.isImmobilized = false;
      host.embryoCount = PREDALIEN_CONSTANTS.EMBRYOS_PER_IMPLANT;

      state.activeIncubations.push({
        hostId: host.id || 'human_host',
        host: host,
        timeRemaining: PREDALIEN_CONSTANTS.GESTATION_DURATION,
        embryoCount: PREDALIEN_CONSTANTS.EMBRYOS_PER_IMPLANT,
      });

      state.isImplanting = false;
      state.currentHost = null;
    }
  }

  // Évolution de la gestation et rupture de cage thoracique
  state.activeIncubations = state.activeIncubations.filter(inc => {
    inc.timeRemaining -= dt;

    if (inc.timeRemaining <= 0) {
      // Éclosion massive
      const host = inc.host;
      if (host) {
        if (typeof host.takeDamage === 'function') {
          host.takeDamage(PREDALIEN_CONSTANTS.BURST_DAMAGE_LETHAL, 'chestburster_eruption');
        } else if (typeof host.health === 'number') {
          host.health = 0;
        }
        host.isDead = true;
        host.deathType = 'predalien_multi_chestburster';
      }

      state.totalHostsBurst += 1;

      for (let i = 0; i < inc.embryoCount; i++) {
        const burster = {
          id: `chestburster_${Date.now()}_${i}`,
          x: host ? (host.x ?? 0) : 0,
          y: host ? (host.y ?? 0) : 0,
          z: host ? (host.z ?? 0) : 0,
          health: 25.0,
          isAggressive: true,
        };
        state.spawnedChestbursters.push(burster);
        newlySpawnedBursters.push(burster);
      }

      if (audio && typeof audio.playMultiBursterSqueal === 'function') {
        audio.playMultiBursterSqueal();
      }

      return false; // Incubation terminée
    }

    return true;
  });

  return newlySpawnedBursters;
}

export function applyBlueSolventCleansing(state, hostEntity) {
  if (!state || !hostEntity || !hostEntity.isImpregnated) return false;

  // Le liquide bleu dissolvant neutralise les embryons in-utero
  hostEntity.isImpregnated = false;
  hostEntity.embryoCount = 0;
  state.activeIncubations = state.activeIncubations.filter(inc => inc.host !== hostEntity);
  return true;
}
