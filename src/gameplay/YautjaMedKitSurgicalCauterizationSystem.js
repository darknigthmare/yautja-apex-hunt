// Système Chirurgical de Trousse de Soin Yautja & Cautérisation (Predator 2 / Prey — Lore 1:1)
// Référence canonique : Predator 2 (1990) & Prey (2022) — Extraction de projectiles, pâte de cristal bleu et rugissement viscéral de douleur

import { audioSynth } from '../AudioSynthesizer.js';

export const MEDKIT_CONSTANTS = {
  MAX_CHARGES: 3,
  HEAL_AMOUNT: 90.0,                   // Points de vitalité régénérés
  SURGERY_DURATION: 2.2,               // Temps d'incantation chirurgicale vulnérable (s)
  ROAR_ALERT_RADIUS: 35.0,             // Rayon dans lequel les ennemis entendent le rugissement de douleur
  ROAR_STAGGER_RADIUS: 3.2,            // Rayon où le souffle du rugissement étourdit les cibles proches
  ROAR_STAGGER_DURATION: 1.2,          // Durée d'étourdissement des témoins directs (s)
};

export function createYautjaMedKitState(initialCharges = 3) {
  return {
    charges: Math.min(MEDKIT_CONSTANTS.MAX_CHARGES, Math.max(0, parseInt(initialCharges, 10) || 3)),
    isPerformingSurgery: false,
    surgeryProgress: 0.0,
    surgeriesCompleted: 0,
    lastRoarRadius: 0,
  };
}

export function startSurgicalCauterization(state, userEntity, audio = audioSynth) {
  if (!state || state.charges <= 0 || state.isPerformingSurgery) {
    return { success: false, reason: 'Charges épuisées ou soin déjà en cours' };
  }

  state.isPerformingSurgery = true;
  state.surgeryProgress = 0.0;

  if (audio && typeof audio.playMedKitCauterizeHiss === 'function') {
    audio.playMedKitCauterizeHiss();
  }

  return { success: true };
}

export function interruptSurgery(state) {
  if (!state || !state.isPerformingSurgery) return false;
  state.isPerformingSurgery = false;
  state.surgeryProgress = 0.0;
  return true;
}

export function updateSurgicalCauterization(state, delta, userEntity, nearbyEntities = [], audio = audioSynth) {
  if (!state || !state.isPerformingSurgery || !userEntity) return null;
  const dt = Math.max(0, Number(delta) || 0);

  state.surgeryProgress += dt;

  if (state.surgeryProgress >= MEDKIT_CONSTANTS.SURGERY_DURATION) {
    state.isPerformingSurgery = false;
    state.surgeryProgress = 0.0;
    state.charges = Math.max(0, state.charges - 1);
    state.surgeriesCompleted++;

    // Soin de vitalité et purge des afflictions (saignement, brûlure, acide)
    if (typeof userEntity.health === 'number') {
      const maxHp = userEntity.maxHealth || 150;
      userEntity.health = Math.min(maxHp, userEntity.health + MEDKIT_CONSTANTS.HEAL_AMOUNT);
    }
    userEntity.isBleeding = false;
    userEntity.isLuminescentBleeding = false;
    userEntity.isAcidBurned = false;

    // Déclenchement du rugissement de douleur et réverbération sonore
    state.lastRoarRadius = MEDKIT_CONSTANTS.ROAR_ALERT_RADIUS;
    if (audio && typeof audio.playSurgicalRoarEcho === 'function') {
      audio.playSurgicalRoarEcho();
    }

    const ux = userEntity.x ?? (userEntity.position ? userEntity.position.x : 0);
    const uz = userEntity.z ?? (userEntity.position ? userEntity.position.z : 0);

    // Alerte et étourdissement des entités aux alentours
    for (const ent of nearbyEntities) {
      if (!ent || ent.isDead || ent === userEntity) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dx = ex - ux;
      const dz = ez - uz;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= MEDKIT_CONSTANTS.ROAR_STAGGER_RADIUS) {
        ent.isStaggered = true;
        ent.staggerTimer = MEDKIT_CONSTANTS.ROAR_STAGGER_DURATION;
      }

      if (dist <= MEDKIT_CONSTANTS.ROAR_ALERT_RADIUS) {
        ent.isAlerted = true;
        ent.alertLocation = { x: ux, z: uz };
      }
    }

    return {
      completed: true,
      healedAmount: MEDKIT_CONSTANTS.HEAL_AMOUNT,
      remainingCharges: state.charges,
    };
  }

  return { completed: false, progress: state.surgeryProgress / MEDKIT_CONSTANTS.SURGERY_DURATION };
}
