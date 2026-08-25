export const MELEE_WEAPONS = Object.freeze({
  1: { id: 'wristblades', damage: 48, range: 8.5, honor: 18 },
  8: { id: 'whip', damage: 60, range: 18, honor: 24 },
  13: { id: 'father_sword', damage: 92, range: 10, honor: 34 },
});

export function resolveMeleeStrike(weaponId, distance, { fromCanopy = false } = {}) {
  if (fromCanopy) {
    return distance <= 22
      ? { hit: true, damage: 320, honor: 180, kind: 'death_from_above' }
      : { hit: false, damage: 0, honor: 0, kind: 'death_from_above' };
  }

  const weapon = MELEE_WEAPONS[weaponId];
  if (!weapon || distance > weapon.range) {
    return { hit: false, damage: 0, honor: 0, kind: weapon?.id ?? 'unsupported' };
  }

  return { hit: true, damage: weapon.damage, honor: weapon.honor, kind: weapon.id };
}

export function calculateHonorAward(basePoints, isCloaked) {
  const safeBase = Math.max(0, Number(basePoints) || 0);
  return Math.round(safeBase * (isCloaked ? 1 : 1.5));
}
