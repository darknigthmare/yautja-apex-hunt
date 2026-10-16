// Système de Carapace Renforcée et Points d'Articulation Vulnérables (Lore 1:1)
// Référence canonique : The Predator (2018) - L'Upgrade / Ultimate Assassin Predator et sa cuirasse biomécanique

import { audioSynth } from '../AudioSynthesizer.js';

export const CARAPACE_CONSTANTS = {
  BASE_DEFLECTION_FACTOR: 0.85,    // 85% des dégâts balistiques/légers absorbés ou ricochés sur les plaques dures
  CRITICAL_WEAKPOINT_MULT: 3.2,    // Multiplicateur de dégâts massifs lors d'un coup dans une faille articulaire
  MAX_CARAPACE_DURABILITY: 600.0,  // Intégrité de la cuirasse avant écaillage partiel
};

export const WEAKPOINT_ZONES = [
  { id: 'neck_crease', name: 'Creux cervical sous dreadlocks', normal: { x: 0, y: 0.8, z: 0.6 }, tolerance: 0.25 },
  { id: 'dorsal_spine_gap', name: 'Interstice rachidien dorsal', normal: { x: 0, y: 0.2, z: 0.98 }, tolerance: 0.25 },
  { id: 'brachial_underarm_l', name: 'Artère brachiale gauche', normal: { x: -0.98, y: 0.1, z: 0.0 }, tolerance: 0.25 },
  { id: 'brachial_underarm_r', name: 'Artère brachiale droite', normal: { x: 0.98, y: 0.1, z: 0.0 }, tolerance: 0.25 },
];

export function createUpgradeCarapaceState() {
  return {
    durability: CARAPACE_CONSTANTS.MAX_CARAPACE_DURABILITY,
    isHardened: true,
    totalDeflectedDamage: 0,
    totalCriticalDamageTaken: 0,
    exposedWeakpoints: [...WEAKPOINT_ZONES],
  };
}

export function processCarapaceImpact(state, incomingDamage, hitVector, damageType = 'ballistic', audio = audioSynth) {
  if (!state) return { finalDamage: incomingDamage, isCritical: false, isDeflected: false };

  // Vérification de pénétration des points d'articulation
  let hitWeakpoint = null;
  let highestDot = -Infinity;
  const len = Math.sqrt(hitVector.x * hitVector.x + hitVector.y * hitVector.y + hitVector.z * hitVector.z) || 1;
  const normHit = { x: hitVector.x / len, y: hitVector.y / len, z: hitVector.z / len };

  for (const wp of state.exposedWeakpoints) {
    const wpLen = Math.sqrt(wp.normal.x * wp.normal.x + wp.normal.y * wp.normal.y + wp.normal.z * wp.normal.z) || 1;
    const nx = wp.normal.x / wpLen;
    const ny = wp.normal.y / wpLen;
    const nz = wp.normal.z / wpLen;

    // Produit scalaire pour alignement avec la vulnérabilité
    const dot = normHit.x * nx + normHit.y * ny + normHit.z * nz;
    if (dot >= (1.0 - wp.tolerance) && dot > highestDot) {
      highestDot = dot;
      hitWeakpoint = wp;
    }
  }

  if (hitWeakpoint) {
    // Coup critique perforant dans la faille biomécanique
    const finalDamage = incomingDamage * CARAPACE_CONSTANTS.CRITICAL_WEAKPOINT_MULT;
    state.totalCriticalDamageTaken += finalDamage;

    if (audio && typeof audio.playJointCriticalHit === 'function') {
      audio.playJointCriticalHit();
    }

    return {
      finalDamage,
      isCritical: true,
      isDeflected: false,
      weakpointId: hitWeakpoint.id,
      weakpointName: hitWeakpoint.name,
    };
  }

  // Si pas de coup dans une faille, la cuirasse absorbe et ricoche
  const deflectedAmount = incomingDamage * CARAPACE_CONSTANTS.BASE_DEFLECTION_FACTOR;
  const finalDamage = incomingDamage - deflectedAmount;
  state.durability = Math.max(0, state.durability - finalDamage * 0.4);
  state.totalDeflectedDamage += deflectedAmount;

  if (audio && typeof audio.playCarapaceDeflectClang === 'function') {
    audio.playCarapaceDeflectClang();
  }

  return {
    finalDamage,
    isCritical: false,
    isDeflected: true,
    deflectedAmount,
  };
}
