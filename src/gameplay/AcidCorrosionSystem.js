// Système de corrosion par acide moléculaire et résistance d'alliage des armes (Lore 1:1)
// Référence canonique : AVP (2004) (dissolution des lames de Celtic face à Grid), AVP:R (2007)

export const ACID_RESISTANT_FINISHES = new Set([
  'finish_cleaner_acid_resistant',
  'finish_avp_frosted_alloy',
  'finish_celtic_battle_aged',
]);

export function createWeaponCorrosionState() {
  return {
    corrosion: {
      wristblades: 0,   // 0 = intact, 100 = totalement rongé par l'acide
      whip: 0,
      father_sword: 0,
    },
    isBlunted: {
      wristblades: false,
      whip: false,
      father_sword: false,
    },
  };
}

export function isWeaponAcidResistant(weaponId, armorFinishId, activeVariants = []) {
  if (ACID_RESISTANT_FINISHES.has(armorFinishId)) return true;
  if (Array.isArray(activeVariants)) {
    if (activeVariants.some((v) => v.id === 'variant_wolf_power_glove' || v.id === 'variant_wolf_cleaner_antidote')) {
      return true;
    }
  }
  // Le fouet d'épines façonné dans une queue de Xéno est naturellement immunisé contre l'acide
  return weaponId === 'whip_thorns' || weaponId === 'whip';
}

export function applyAcidBloodSplash(state, weaponId, enemyType, armorFinishId = '', activeVariants = []) {
  if (!state?.corrosion) return { corroded: false, amount: 0, currentLevel: 0 };
  const wid = weaponId ?? 'wristblades';
  if (!Object.hasOwn(state.corrosion, wid)) return { corroded: false, amount: 0, currentLevel: 0 };

  // Seules les proies à sang acide causent cette corrosion
  const isAcidBlood = enemyType?.includes('xeno')
    || enemyType?.includes('alien')
    || enemyType?.includes('facehugger')
    || enemyType === 'gridAlien';

  if (!isAcidBlood) {
    return { corroded: false, amount: 0, currentLevel: state.corrosion[wid] };
  }

  const resistant = isWeaponAcidResistant(wid, armorFinishId, activeVariants);
  const baseCorrosion = resistant ? 2.5 : 28.0;

  state.corrosion[wid] = Math.min(100, state.corrosion[wid] + baseCorrosion);
  if (state.corrosion[wid] >= 40) {
    state.isBlunted[wid] = true;
  }

  return {
    corroded: true,
    amount: baseCorrosion,
    currentLevel: state.corrosion[wid],
    isBlunted: state.isBlunted[wid],
    resistant,
  };
}

export function getWeaponCorrosionDamageFactor(state, weaponId) {
  if (!state?.corrosion) return 1.0;
  const wid = weaponId ?? 'wristblades';
  const level = state.corrosion[wid] ?? 0;
  // Facteur de dégâts décroissant de 1.0 (0% corrosion) à 0.4 (100% corrosion)
  return Math.max(0.4, 1.0 - (level / 100) * 0.6);
}

export function neutralizeWeaponAcid(state, weaponId) {
  if (!state?.corrosion) return false;
  const wid = weaponId ?? 'wristblades';
  if (Object.hasOwn(state.corrosion, wid)) {
    state.corrosion[wid] = Math.max(0, state.corrosion[wid] - 50);
    if (state.corrosion[wid] < 40) {
      state.isBlunted[wid] = false;
    }
    return true;
  }
  return false;
}

export function fullRestoreWeapon(state, weaponId) {
  if (!state?.corrosion) return false;
  const wid = weaponId ?? 'wristblades';
  if (Object.hasOwn(state.corrosion, wid)) {
    state.corrosion[wid] = 0;
    state.isBlunted[wid] = false;
    return true;
  }
  return false;
}
