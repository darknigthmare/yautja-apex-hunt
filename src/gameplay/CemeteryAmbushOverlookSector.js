// Secteur de Niveau : Embuscade du Cimetière sous Brume Nocturne (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Embuscade du City Hunter dans le cimetière de Los Angeles depuis les statues gothiques

export const CEMETERY_CONSTANTS = {
  FOG_CEILING_Y: 2.2,              // Hauteur de la nappe de brouillard lourd au sol (m)
  GROUND_VISIBILITY_RANGE: 8.5,    // Visibilité réduite au niveau du sol par la brume
  PERCH_ALTITUDE_MIN: 5.5,         // Hauteur des perchoirs sur les mausolées et croix
  AMBUSH_DROP_DAMAGE_BONUS: 85.0,  // Bonus de frappe d'embuscade lors d'un saut plongeant
};

export function createCemeterySectorState() {
  return {
    fogDensity: 0.85,
    perchNodes: [
      { id: 'mausoleum_roof_central', x: 0.0,   y: 6.8, z: -15.0, type: 'gothic_mausoleum' },
      { id: 'gargoyle_statue_east',    x: 12.0,  y: 7.5, z: -8.0,  type: 'stone_angel' },
      { id: 'granite_cross_west',      x: -14.0, y: 5.8, z: -22.0, type: 'celtic_cross' },
    ],
    destructibleHeadstones: [
      { id: 'grave_01', x: 2.0,  y: 0, z: -6.0,  durability: 40.0, isDestroyed: false },
      { id: 'grave_02', x: -3.0, y: 0, z: -10.0, durability: 40.0, isDestroyed: false },
      { id: 'grave_03', x: 5.0,  y: 0, z: -18.0, durability: 40.0, isDestroyed: false },
    ],
    ambushKillsExecuted: 0,
  };
}

export function evaluateFogVisibility(cemeteryState, observerPos, targetPos) {
  if (!cemeteryState) return 1.0;

  // Si l'observateur est posté sur un perchoir au-dessus de la nappe de brume
  if (observerPos.y >= CEMETERY_CONSTANTS.FOG_CEILING_Y) {
    return 1.0; // Vue plongeante dégagée en vision infrarouge
  }

  // Si l'observateur est au sol dans la brume
  const dx = targetPos.x - observerPos.x;
  const dz = targetPos.z - observerPos.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist > CEMETERY_CONSTANTS.GROUND_VISIBILITY_RANGE) {
    return 0.15; // Cible masquée par le brouillard
  }

  return 1.0 - (dist / CEMETERY_CONSTANTS.GROUND_VISIBILITY_RANGE) * cemeteryState.fogDensity;
}

export function executePerchDropAmbush(cemeteryState, hunterPos, targetEntity) {
  if (!cemeteryState || !targetEntity || hunterPos.y < CEMETERY_CONSTANTS.PERCH_ALTITUDE_MIN) {
    return null;
  }

  const ex = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const ez = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  const dx = ex - hunterPos.x;
  const dz = ez - hunterPos.z;
  const horizontalDist = Math.sqrt(dx * dx + dz * dz);

  if (horizontalDist <= 3.5) {
    // Chute plongeante d'embuscade réussie
    const damage = CEMETERY_CONSTANTS.AMBUSH_DROP_DAMAGE_BONUS;
    if (typeof targetEntity.takeDamage === 'function') {
      targetEntity.takeDamage(damage, 'perch_drop_ambush');
    } else {
      targetEntity.health = Math.max(0, targetEntity.health - damage);
    }

    targetEntity.isKnockedProne = true;
    cemeteryState.ambushKillsExecuted += 1;

    return {
      success: true,
      damageDealt: damage,
      landingPos: { x: ex, y: 0, z: ez },
    };
  }

  return null;
}
