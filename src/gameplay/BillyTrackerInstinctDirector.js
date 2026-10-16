// Directeur d'Intuition et Sixième Sens du Pisteur Billy (Lore 1:1)
// Référence canonique : Predator (1987) - Billy Sole ressentant la présence invisible dans la canopée et duel au pont

import { audioSynth } from '../AudioSynthesizer.js';

export const TRACKER_INSTINCT_CONSTANTS = {
  PREMONITION_RADIUS: 12.0,       // Rayon de perception du sixième sens (m)
  PARRY_STANDOFF_WINDOW: 1.5,      // Fenêtre de blocage réflexe au grand coutelas
  TRACKING_TRAIL_LIFETIME: 15.0,   // Durée de persistance des indices environnementaux (s)
};

export function createBillyTrackerState() {
  return {
    sixthSenseTriggered: false,
    isInStandoffStance: false,
    spottedTrailPoints: [],
    facingDirection: { x: 0, z: -1 },
    premonitionCooldown: 0,
    timesAmbushDenied: 0,
  };
}

export function updateBillyTrackerInstinct(state, delta, trackerPos, hunterEntity, audio = audioSynth) {
  if (!state || !hunterEntity || hunterEntity.isDead) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.premonitionCooldown > 0) {
    state.premonitionCooldown = Math.max(0, state.premonitionCooldown - dt);
  }

  const hx = hunterEntity.x ?? (hunterEntity.position ? hunterEntity.position.x : 0);
  const hy = hunterEntity.y ?? (hunterEntity.position ? hunterEntity.position.y : 0);
  const hz = hunterEntity.z ?? (hunterEntity.position ? hunterEntity.position.z : 0);

  const dx = hx - trackerPos.x;
  const dy = hy - trackerPos.y;
  const dz = hz - trackerPos.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Détection du sixième sens même si le chasseur est camouflé et immobile
  if (dist <= TRACKER_INSTINCT_CONSTANTS.PREMONITION_RADIUS && state.premonitionCooldown <= 0) {
    state.sixthSenseTriggered = true;
    state.isInStandoffStance = true;
    state.premonitionCooldown = 8.0;

    // Se tourne directement vers l'observateur invisible dans les arbres
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    state.facingDirection = { x: dx / len, z: dz / len };

    if (audio && typeof audio.playTrackerSixthSenseSting === 'function') {
      audio.playTrackerSixthSenseSting();
    }
  }

  // Enregistrement des traces de pas / sang de Yautja
  if (hunterEntity.isBleeding || hunterEntity.isMoving) {
    state.spottedTrailPoints.push({
      x: hx,
      y: hy,
      z: hz,
      timestamp: Date.now(),
      type: hunterEntity.isBleeding ? 'glowing_blood' : 'broken_foliage',
    });
  }

  // Nettoyage des vieilles pistes
  const now = Date.now();
  state.spottedTrailPoints = state.spottedTrailPoints.filter(p => (now - p.timestamp) < TRACKER_INSTINCT_CONSTANTS.TRACKING_TRAIL_LIFETIME * 1000);
}

export function attemptFrontalAmbushOnBilly(state, attackerForwardDir) {
  if (!state || !state.isInStandoffStance) return { ambushSucceeded: true };

  // Produit scalaire face-à-face
  const dot = attackerForwardDir.x * state.facingDirection.x + attackerForwardDir.z * state.facingDirection.z;
  if (dot < -0.3) {
    // Attaque frontale anticipée et bloquée au coutelas
    state.timesAmbushDenied += 1;
    return {
      ambushSucceeded: false,
      isParried: true,
      message: 'Billy a anticipé l\'assaut et engagé le duel au couteau !',
    };
  }

  return { ambushSucceeded: true, isParried: false };
}
