// Directeur des tactiques avancées de chasse des Boss Yautja (Lore 1:1)
// Références canoniques : Predator (1987) (traque en canopée), Predator 2 (1990) (retraite tactique Medicomp)

export const BOSS_TACTICAL_STANCES = Object.freeze({
  STALKING_CLOAKED: 'stalking_cloaked',       // Observation silencieuse depuis la hauteur
  CANOPY_SNIPING: 'canopy_sniping',           // Tir de harcèlement au canon à plasma
  AMBUSH_POUNCE: 'ambush_pounce',             // Saut plongeant toutes lames déployées
  MELEE_DUEL: 'melee_duel',                   // Combat rapproché honoraire
  TACTICAL_RETREAT_HEAL: 'tactical_retreat_heal', // Repli sous fumigène pour intervention Medicomp
  WATER_EVASION: 'water_evasion',             // Évitement des cours d'eau pour protéger le camouflage
});

export function evaluateBossTacticalStance(boss, playerPos, environment = {}) {
  if (!boss || boss.isDead) return BOSS_TACTICAL_STANCES.STALKING_CLOAKED;

  const currentHealth = Number(boss.health) || 0;
  const maxHealth = Number(boss.maxHealth) || 100;
  const healthRatio = currentHealth / maxHealth;

  const bossPos = boss.position ?? boss.mesh?.position ?? { x: 0, y: 0, z: 0 };
  const distToPlayer = Math.hypot(
    bossPos.x - (playerPos?.x ?? 0),
    bossPos.z - (playerPos?.z ?? 0),
  );

  // 1. Repli d'urgence chirurgical si santé critique (< 30%)
  if (healthRatio <= 0.30 && !boss.medicompUsed) {
    return BOSS_TACTICAL_STANCES.TACTICAL_RETREAT_HEAL;
  }

  // 2. Évitement de l'eau si camouflé (pour éviter le court-circuit)
  if (boss.isCloaked && environment.isNearWater) {
    return BOSS_TACTICAL_STANCES.WATER_EVASION;
  }

  // 3. Avantage de la canopée et hauteur
  if (boss.isPerched || (bossPos.y >= 6.0 && distToPlayer > 18.0)) {
    return BOSS_TACTICAL_STANCES.CANOPY_SNIPING;
  }

  // 4. Embuscade plongeante
  if (boss.isCloaked && distToPlayer <= 14.0 && distToPlayer > 6.0) {
    return BOSS_TACTICAL_STANCES.AMBUSH_POUNCE;
  }

  // 5. Duel au corps à corps
  if (distToPlayer <= 6.0) {
    return BOSS_TACTICAL_STANCES.MELEE_DUEL;
  }

  return BOSS_TACTICAL_STANCES.STALKING_CLOAKED;
}

export function executeBossTacticalAction(boss, stance, delta) {
  if (!boss) return null;

  switch (stance) {
    case BOSS_TACTICAL_STANCES.TACTICAL_RETREAT_HEAL:
      boss.aiState = 'retreat_medicomp';
      boss.medicompActive = true;
      return { action: 'initiate_medicomp_triage', healTarget: 40 };

    case BOSS_TACTICAL_STANCES.CANOPY_SNIPING:
      boss.laserLocked = true;
      boss.aiState = 'plasmacaster_aim';
      return { action: 'tri_laser_canopy_aim', rangeBonus: 1.25 };

    case BOSS_TACTICAL_STANCES.AMBUSH_POUNCE:
      boss.aiState = 'pounce';
      return { action: 'canopy_leap_strike', damageBonus: 1.4 };

    case BOSS_TACTICAL_STANCES.WATER_EVASION:
      return { action: 'reroute_dry_ground', avoidDisruption: true };

    default:
      return { action: 'stalk' };
  }
}
