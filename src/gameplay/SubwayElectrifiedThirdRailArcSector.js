// Secteur du Troisième Rail Électrifié de Métro et Court-Circuit Haute Tension (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — La fusillade dans la rame de métro heurtant le troisième rail à 750V, libérant des arcs électriques foudroyants et coupant l'éclairage de la rame.

import { audioSynth } from '../AudioSynthesizer.js';

export const SUBWAY_RAIL_CONSTANTS = {
  ARC_DISCHARGE_RADIUS_METERS: 4.5,   // Rayon d'éclair de l'arc haute tension
  ELECTROCUTION_DAMAGE: 135.0,        // Dégâts foudroyants instantanés
  BLACKOUT_DURATION_SEC: 8.0,         // Durée d'obscurité totale après disjonction
  STUN_PARALYSIS_SEC: 2.0,            // Tétanie musculaire consécutive au choc 750V
};

export function createSubwayRailSectorState() {
  return {
    isThirdRailLive: true,
    isBlackoutActive: false,
    blackoutTimer: 0.0,
    dischargesTriggeredCount: 0,
  };
}

export function triggerThirdRailArc(state, impactPos = { x: 0, z: 0 }, entities = [], audio = audioSynth) {
  if (!state || !state.isThirdRailLive) return { discharged: false };

  state.dischargesTriggeredCount++;
  state.isBlackoutActive = true;
  state.blackoutTimer = SUBWAY_RAIL_CONSTANTS.BLACKOUT_DURATION_SEC;

  if (audio && typeof audio.playSubwayThirdRailZapArc === 'function') {
    audio.playSubwayThirdRailZapArc();
  }
  if (audio && typeof audio.playSubwayBreakerFusesPop === 'function') {
    audio.playSubwayBreakerFusesPop();
  }

  const struck = [];
  const radius = SUBWAY_RAIL_CONSTANTS.ARC_DISCHARGE_RADIUS_METERS;

  for (const entity of entities) {
    if (!entity) continue;
    const dx = (entity.x || 0) - (impactPos.x || 0);
    const dz = (entity.z || 0) - (impactPos.z || 0);
    const dist = Math.hypot(dx, dz);

    if (dist <= radius) {
      const damage = SUBWAY_RAIL_CONSTANTS.ELECTROCUTION_DAMAGE;
      if (typeof entity.takeDamage === 'function') {
        entity.takeDamage(damage);
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - damage);
      }
      entity.isElectrocuted = true;
      entity.isParalyzed = true;
      entity.paralysisTimer = SUBWAY_RAIL_CONSTANTS.STUN_PARALYSIS_SEC;
      struck.push({ id: entity.id || 'target_subway', dist, damage });
    }
  }

  return {
    discharged: true,
    blackoutTriggered: true,
    entitiesStruck: struck,
  };
}

export function updateSubwayRailSector(state, delta = 0.1) {
  if (!state) return;

  if (state.isBlackoutActive && state.blackoutTimer > 0) {
    state.blackoutTimer = Math.max(0, state.blackoutTimer - delta);
    if (state.blackoutTimer === 0) {
      state.isBlackoutActive = false; // Rétablissement de l'éclairage de secours
    }
  }
}
