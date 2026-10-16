// Système de Bouclier d'Os Déployable et Parade Balistique (Lore 1:1)
// Référence canonique : Prey (2022) - Bouclier d'avant-bras en éventail d'os et chitine du Feral Predator

import { audioSynth } from '../AudioSynthesizer.js';

export const BONE_SHIELD_CONSTANTS = {
  DEFLECTION_FACTOR: 0.95,         // 95% des dégâts balistiques frontaux absorbés/déviés
  SHIELD_BASH_DAMAGE: 55.0,        // Dégâts de percussion du coup de bouclier
  BASH_KNOCKBACK_FORCE: 8.5,       // Force de projection arrière de la cible
  MAX_KINETIC_CHARGE: 100.0,       // Charge cinétique accumulable via impacts absorbés
  FRONTAL_ANGLE_THRESHOLD: 0.35,   // Cône de couverture frontale (~180°)
};

export function createExpandableBoneShieldState() {
  return {
    isDeployed: false,
    currentKineticCharge: 0,
    totalDamageDeflected: 0,
    successfulBashesCount: 0,
    shieldDurability: 350.0,
  };
}

export function deployBoneShield(state, audio = audioSynth) {
  if (!state || state.isDeployed) return false;

  state.isDeployed = true;
  if (audio && typeof audio.playBoneShieldUnfold === 'function') {
    audio.playBoneShieldUnfold();
  }
  return true;
}

export function retractBoneShield(state) {
  if (!state || !state.isDeployed) return false;
  state.isDeployed = false;
  return true;
}

export function processShieldDeflection(state, hunterForward, incomingHitVector, incomingDamage, audio = audioSynth) {
  if (!state || !state.isDeployed) {
    return { isDeflected: false, remainingDamage: incomingDamage };
  }

  // Vérification de provenance frontale du tir
  const lenH = Math.sqrt(hunterForward.x * hunterForward.x + hunterForward.z * hunterForward.z) || 1;
  const lenHit = Math.sqrt(incomingHitVector.x * incomingHitVector.x + incomingHitVector.z * incomingHitVector.z) || 1;

  const hx = hunterForward.x / lenH;
  const hz = hunterForward.z / lenH;
  const ix = incomingHitVector.x / lenHit;
  const iz = incomingHitVector.z / lenHit;

  // Produit scalaire opposé (le vecteur d'impact vient face au bouclier)
  const dot = -(hx * ix + hz * iz);

  if (dot >= BONE_SHIELD_CONSTANTS.FRONTAL_ANGLE_THRESHOLD) {
    const deflected = incomingDamage * BONE_SHIELD_CONSTANTS.DEFLECTION_FACTOR;
    const remainingDamage = incomingDamage - deflected;

    state.totalDamageDeflected += deflected;
    state.currentKineticCharge = Math.min(
      BONE_SHIELD_CONSTANTS.MAX_KINETIC_CHARGE,
      state.currentKineticCharge + deflected * 0.4
    );

    if (audio && typeof audio.playBoneShieldDeflectClash === 'function') {
      audio.playBoneShieldDeflectClash();
    }

    return {
      isDeflected: true,
      deflectedDamage: deflected,
      remainingDamage,
      kineticCharge: state.currentKineticCharge,
    };
  }

  return { isDeflected: false, remainingDamage: incomingDamage };
}

export function executeShieldBash(state, targetEntity, audio = audioSynth) {
  if (!state || !state.isDeployed || !targetEntity || targetEntity.isDead) return null;

  const chargeBonus = (state.currentKineticCharge / BONE_SHIELD_CONSTANTS.MAX_KINETIC_CHARGE) * 30.0;
  const totalDamage = BONE_SHIELD_CONSTANTS.SHIELD_BASH_DAMAGE + chargeBonus;

  if (typeof targetEntity.takeDamage === 'function') {
    targetEntity.takeDamage(totalDamage, 'bone_shield_bash');
  } else if (typeof targetEntity.health === 'number') {
    targetEntity.health = Math.max(0, targetEntity.health - totalDamage);
  }

  targetEntity.isStaggered = true;
  targetEntity.isKnockedProne = true;
  state.currentKineticCharge = 0; // Libération de la charge cinétique
  state.successfulBashesCount += 1;

  if (audio && typeof audio.playBoneShieldDeflectClash === 'function') {
    audio.playBoneShieldDeflectClash();
  }

  return { damageDealt: totalDamage, knockedProne: true };
}
