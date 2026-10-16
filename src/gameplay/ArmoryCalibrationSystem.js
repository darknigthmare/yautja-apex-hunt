// Système d'ajustement et de calibration de l'armurerie du Vaisseau Mère (Lore 1:1)
// Références canoniques : AVP (2004) et Predator 2 (1990) (râtelier et forge de clan)

export const CALIBRATION_UPGRADES = Object.freeze([
  Object.freeze({
    id: 'wristblade_molecular_honing',
    name: 'Affûtage moléculaire des lames',
    targetWeapon: 'wristblades',
    effectType: 'bleed_enhancement',
    bonusMultiplier: 1.15,
    description: 'Micro-affûtage au diamant synthétique augmentant le saignement artériel de +15%.',
  }),
  Object.freeze({
    id: 'plasma_collimator_focus',
    name: 'Collimation magnétique de plasma',
    targetWeapon: 'plasmacaster_single',
    effectType: 'projectile_velocity',
    bonusMultiplier: 1.20,
    description: 'Bobines de confinement ajustées pour accélérer le tir plasma de +20%.',
  }),
  Object.freeze({
    id: 'smart_disc_gyro_balancing',
    name: 'Équilibrage gyroscopique du disque',
    targetWeapon: 'smart_disc',
    effectType: 'return_speed',
    bonusMultiplier: 1.18,
    description: 'Alignement dynamique du rotor réduisant le temps de retour en main de +18%.',
  }),
  Object.freeze({
    id: 'rebreather_catalytic_filter',
    name: 'Cartouche filtrante catalytique',
    targetWeapon: 'rebreather',
    effectType: 'environmental_resistance',
    bonusMultiplier: 1.30,
    description: 'Purification renforcée contre les gaz toxiques et le monoxyde urbain.',
  }),
]);

export function createArmoryCalibrationState() {
  return {
    appliedUpgrades: new Set(),
  };
}

export function applyCalibrationUpgrade(state, upgradeId) {
  if (!state || !upgradeId) return false;
  const upgrade = CALIBRATION_UPGRADES.find((u) => u.id === upgradeId);
  if (!upgrade) return false;

  state.appliedUpgrades.add(upgrade.id);
  return true;
}

export function getWeaponCalibrationModifiers(state, weaponId) {
  if (!state?.appliedUpgrades) return { damageMultiplier: 1.0, speedMultiplier: 1.0 };

  let damageMultiplier = 1.0;
  let speedMultiplier = 1.0;

  if (weaponId === 'wristblades' && state.appliedUpgrades.has('wristblade_molecular_honing')) {
    damageMultiplier *= 1.15;
  }
  if (weaponId === 'plasmacaster_single' && state.appliedUpgrades.has('plasma_collimator_focus')) {
    speedMultiplier *= 1.20;
  }
  if (weaponId === 'smart_disc' && state.appliedUpgrades.has('smart_disc_gyro_balancing')) {
    speedMultiplier *= 1.18;
  }

  return { damageMultiplier, speedMultiplier };
}
