// Moteur d'application du Code d'Honneur Yautja et infractions Bad Blood (Lore 1:1)
// Références canoniques : Predator (1987) (Dutch désarmé), Predator 2 (1990) (Leona Cantrell enceinte épargnée),
// et le cycle Dark Horse Comics : Bad Blood (1993)

export const HONOR_TARGET_CATEGORIES = Object.freeze({
  HONORABLE_COMBATANT: 'honorable_combatant', // Porteur d'arme capable de résister
  UNARMED_PREY: 'unarmed_prey',               // Cible sans arme (Dutch à terre)
  PREGNANT_FEMALE: 'pregnant_female',         // Gestation détectée au scanner rétinien (Leona Cantrell)
  TERMINALLY_ILL: 'terminally_ill',           // Organisme condamné par la maladie
  SURRENDERING: 'surrendering',               // Proie ayant jeté les armes et refusant le combat
  APEX_THREAT: 'apex_threat',                 // Xénomorphe, Boss ou Bad Blood
});

export const CLAN_HONOR_STATUSES = Object.freeze({
  HONORABLE_CHAMPION: 'honorable_champion', // Respect scrupuleux du code
  BLOODED_HUNTER: 'blooded_hunter',         // Conduite conforme
  WARNED_HUNTER: 'warned_hunter',           // Infraction mineure signalée
  BAD_BLOOD_OUTCAST: 'bad_blood_outcast',   // Bannissement du clan et mise à mort par les Enforcers
});

export function evaluateTargetHonorability(target) {
  if (!target) return { isHonorable: false, category: HONOR_TARGET_CATEGORIES.UNARMED_PREY };

  // Les menaces Apex (Xénomorphes, bêtes mutantes, guerriers augmentés) sont toujours honorables à abattre
  if (target.isApex || target.bossType || target.isXenomorph || target.npcType?.includes('xeno')) {
    return { isHonorable: true, category: HONOR_TARGET_CATEGORIES.APEX_THREAT, bonusHonor: 120 };
  }

  // Protection absolue de la gestation (Predator 2 - Métro)
  if (target.isPregnant) {
    return { isHonorable: false, category: HONOR_TARGET_CATEGORIES.PREGNANT_FEMALE, penaltyHonor: 500 };
  }

  // Protection des proies mourantes ou malades
  if (target.isTerminallyIll) {
    return { isHonorable: false, category: HONOR_TARGET_CATEGORIES.TERMINALLY_ILL, penaltyHonor: 350 };
  }

  // Combat sans arme ou cible en fuite sans hostile
  if (target.isUnarmed || target.hasWeapon === false) {
    return { isHonorable: false, category: HONOR_TARGET_CATEGORIES.UNARMED_PREY, penaltyHonor: 400 };
  }

  // Cible armée et prête à combattre
  return { isHonorable: true, category: HONOR_TARGET_CATEGORIES.HONORABLE_COMBATANT, bonusHonor: 60 };
}

export function processKillHonorAward(player, target, isCloaked = false) {
  const assessment = evaluateTargetHonorability(target);
  const result = {
    honorDelta: 0,
    category: assessment.category,
    infractionCommitted: false,
    newHonorScore: player?.honorScore ?? 0,
    status: CLAN_HONOR_STATUSES.HONORABLE_CHAMPION,
  };

  if (!player) return result;

  if (assessment.isHonorable) {
    // Combat honorable : bonus accru si accompli à visage découvert sans camouflage (Predator 1987)
    const multiplier = isCloaked ? 1.0 : 1.5;
    const awarded = Math.round((assessment.bonusHonor ?? 50) * multiplier);
    player.honorScore = (player.honorScore ?? 0) + awarded;
    player.lifetimeHonor = (player.lifetimeHonor ?? 0) + awarded;
    result.honorDelta = awarded;
  } else {
    // Infraction au code d'honneur : perte massive d'honneur et incrément des fautes Bad Blood
    const penalty = assessment.penaltyHonor ?? 400;
    player.honorScore = Math.max(0, (player.honorScore ?? 0) - penalty);
    player.badBloodInfractions = (player.badBloodInfractions ?? 0) + 1;
    result.honorDelta = -penalty;
    result.infractionCommitted = true;
  }

  result.newHonorScore = player.honorScore;
  result.status = getHunterHonorStatus(player.honorScore, player.badBloodInfractions ?? 0);
  return result;
}

export function getHunterHonorStatus(honorScore, infractions = 0) {
  if (infractions >= 2 || honorScore === 0) {
    return CLAN_HONOR_STATUSES.BAD_BLOOD_OUTCAST;
  }
  if (infractions === 1) {
    return CLAN_HONOR_STATUSES.WARNED_HUNTER;
  }
  if (honorScore >= 2000) {
    return CLAN_HONOR_STATUSES.HONORABLE_CHAMPION;
  }
  return CLAN_HONOR_STATUSES.BLOODED_HUNTER;
}
