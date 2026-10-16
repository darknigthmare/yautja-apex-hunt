// Secteur de Niveau : Belvédère de la Pyramide Maya à Degrés (Lore 1:1)
// Référence canonique : Predator (1987 - Prologue jungle d'Amérique Centrale) & AVP (Lore précolombien)

export const MAYAN_PYRAMID_CONSTANTS = {
  PYRAMID_CENTER: { x: 35.0, y: 0, z: -60.0 },
  PINNACLE_ALTITUDE: 28.5,           // Hauteur du sommet surplombant la canopée (m)
  PINNACLE_RADIUS: 8.5,              // Rayon de la plate-forme sommitale
  BASE_RADIUS: 42.0,                 // Emprise au sol des degrés inférieurs
  STAIR_SLOPE_DEGREES: 48.0,         // Pente abrupte des escaliers cérémoniels
  STUMBLE_PROBABILITY_SPRINT: 0.18,  // Risque de trébucher en courant sur les marches étroites
  HIGH_GROUND_AIM_BONUS: 0.35,       // +35% de précision et portée optique depuis le sommet
  ALTAR_POI_COORDINATES: { x: 35.0, y: 28.5, z: -60.0 },
};

export function createMayanPyramidSectorState() {
  return {
    isPlayerAtPinnacle: false,
    sacrificialAltarActivated: false,
    stumbleEventsCount: 0,
    monolithCoverNodes: [
      { id: 'monolith_north', x: 35.0, y: 28.5, z: -65.5, width: 2.2, height: 3.5 },
      { id: 'monolith_south', x: 35.0, y: 28.5, z: -54.5, width: 2.2, height: 3.5 },
      { id: 'monolith_east',  x: 40.5, y: 28.5, z: -60.0, width: 2.2, height: 3.5 },
      { id: 'monolith_west',  x: 29.5, y: 28.5, z: -60.0, width: 2.2, height: 3.5 },
    ],
  };
}

export function evaluatePyramidElevation(position) {
  const dx = position.x - MAYAN_PYRAMID_CONSTANTS.PYRAMID_CENTER.x;
  const dz = position.z - MAYAN_PYRAMID_CONSTANTS.PYRAMID_CENTER.z;
  const distFromCenter = Math.sqrt(dx * dx + dz * dz);

  if (distFromCenter <= MAYAN_PYRAMID_CONSTANTS.PINNACLE_RADIUS) {
    return {
      isAtPinnacle: true,
      isOnSteps: false,
      elevationBonus: MAYAN_PYRAMID_CONSTANTS.HIGH_GROUND_AIM_BONUS,
      altitude: MAYAN_PYRAMID_CONSTANTS.PINNACLE_ALTITUDE,
    };
  }

  if (distFromCenter <= MAYAN_PYRAMID_CONSTANTS.BASE_RADIUS) {
    // Calcul de l'élévation graduelle sur les marches de la pyramide
    const fraction = (MAYAN_PYRAMID_CONSTANTS.BASE_RADIUS - distFromCenter) /
      (MAYAN_PYRAMID_CONSTANTS.BASE_RADIUS - MAYAN_PYRAMID_CONSTANTS.PINNACLE_RADIUS);
    const altitude = fraction * MAYAN_PYRAMID_CONSTANTS.PINNACLE_ALTITUDE;

    return {
      isAtPinnacle: false,
      isOnSteps: true,
      elevationBonus: fraction * MAYAN_PYRAMID_CONSTANTS.HIGH_GROUND_AIM_BONUS,
      altitude: Math.max(0, altitude),
    };
  }

  return {
    isAtPinnacle: false,
    isOnSteps: false,
    elevationBonus: 0,
    altitude: 0,
  };
}

export function checkStairTraversalHazard(state, actorPos, isSprinting, staminaCurrent) {
  if (!state) return { stumbled: false, tumbleDamage: 0 };

  const elevation = evaluatePyramidElevation(actorPos);
  if (!elevation.isOnSteps) return { stumbled: false, tumbleDamage: 0 };

  // Risque accru si sprintant avec endurance basse
  if (isSprinting) {
    const fatigueFactor = staminaCurrent < 25 ? 2.0 : 1.0;
    const roll = Math.random();
    if (roll < (MAYAN_PYRAMID_CONSTANTS.STUMBLE_PROBABILITY_SPRINT * fatigueFactor)) {
      state.stumbleEventsCount += 1;
      const tumbleDamage = 18.0 + Math.random() * 12.0;
      return {
        stumbled: true,
        tumbleDamage,
        message: 'Perte d\'équilibre sur les marches glissantes de la pyramide maya !',
      };
    }
  }

  return { stumbled: false, tumbleDamage: 0 };
}

export function activateSacrificialAltar(state, hunterHonorPoints) {
  if (!state) return false;
  if (hunterHonorPoints >= 200 && !state.sacrificialAltarActivated) {
    state.sacrificialAltarActivated = true;
    return true;
  }
  return false;
}
