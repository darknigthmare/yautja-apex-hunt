// Secteur de Chambre Submergée de la Pyramide (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les salles basses inondées par la fonte des glaces polaires où les Facehuggers nagent et attaquent en embuscade amphibie.

import { audioSynth } from '../AudioSynthesizer.js';

export const SUBMERGED_CHAMBER_CONSTANTS = {
  WATER_DEPTH_METERS: 0.85,          // Profondeur de l'eau noire dans la chambre
  AMPHIBIOUS_LUNGE_SPEED: 8.5,       // Vitesse de projection du Facehugger hors de l'eau (m/s)
  FACEHUGGER_POUNCE_DAMAGE: 40.0,    // Dégâts d'impact facial au contact
  PILLAR_SAFE_HEIGHT_METERS: 2.2,    // Hauteur des piliers hiéroglyphiques hors de l'eau
};

export function createSubmergedChamberState(chamberId = 'submerged_crypt_01') {
  return {
    chamberId,
    waterLevel: SUBMERGED_CHAMBER_CONSTANTS.WATER_DEPTH_METERS,
    amphibiousHuggersCount: 4,
    ripplesDetected: false,
    entitiesOnPillars: new Set(),
  };
}

export function evaluateWaterWadingRipples(state, entity, audio = audioSynth) {
  if (!state || !entity) return { ripplesCreated: false };

  // Si l'entité est perchée sur un pilier sec, pas de remous d'eau
  if (state.entitiesOnPillars.has(entity.id || 'entity_default')) {
    return { ripplesCreated: false, isPerched: true };
  }

  // Déplacement dans l'eau sombre
  state.ripplesDetected = true;

  if (audio && typeof audio.playSubmergedWaterSlosh === 'function') {
    audio.playSubmergedWaterSlosh();
  }

  // L'eau ralentit la marche terrestre et court-circuite le camouflage optique
  entity.isSlowedByWater = true;
  if (entity.isCloaked) {
    entity.isCloaked = false;
    entity.cloakFlickering = true;
  }

  return {
    ripplesCreated: true,
    waterDepth: state.waterLevel,
    cloakDisrupted: true,
  };
}

export function triggerAmphibiousLunge(state, target, audio = audioSynth) {
  if (!state || !target) return { success: false };
  if (state.amphibiousHuggersCount <= 0) return { success: false, reason: 'NO_AMPHIBIOUS_HUGGERS' };

  state.amphibiousHuggersCount--;

  if (audio && typeof audio.playAmphibiousPounceSplash === 'function') {
    audio.playAmphibiousPounceSplash();
  }

  const damage = SUBMERGED_CHAMBER_CONSTANTS.FACEHUGGER_POUNCE_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isFacehuggerLatched = true;

  return {
    success: true,
    damageDealt: damage,
    latched: true,
    remainingHuggers: state.amphibiousHuggersCount,
  };
}

export function climbPillarPerch(state, entity) {
  if (!state || !entity) return false;

  const entityId = entity.id || 'entity_default';
  state.entitiesOnPillars.add(entityId);

  entity.y = SUBMERGED_CHAMBER_CONSTANTS.PILLAR_SAFE_HEIGHT_METERS;
  entity.isSlowedByWater = false;
  entity.isSafeFromAmphibiousAmbush = true;

  return true;
}
