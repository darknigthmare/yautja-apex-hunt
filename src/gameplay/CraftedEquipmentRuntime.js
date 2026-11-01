import { HUNTER_CLASSES, DEFAULT_CUSTOMIZATION } from '../data/RuntimeEquipment.js';
import { MONSTER_HUNTER_CROWNS } from '../data/PreyTaxonomyAndCrossoverCatalog.js';

// Only these recipe statistics have runtime hooks. The remaining profile text
// is a design/archive description, not a promise of an implemented ability.
export const SUPPORTED_CRAFT_STATS = Object.freeze({
  healthBonus: { label: 'Santé maximale', unit: 'points' },
  defense: { label: 'Réduction des dégâts', unit: 'percent' },
  acidImmunity: { label: 'Résistance à l’acide', unit: 'ratio' },
  fireResistance: { label: 'Résistance au feu', unit: 'percent' },
  fireImmunity: { label: 'Résistance au feu', unit: 'ratio' },
  energyResist: { label: 'Résistance énergétique', unit: 'percent' },
  plasmaResistance: { label: 'Résistance au plasma', unit: 'percent' },
  ballisticDamping: { label: 'Résistance balistique', unit: 'percent' },
  damage: { label: 'Dégâts de mêlée', unit: 'points' },
  meleeDamage: { label: 'Dégâts de mêlée', unit: 'points' },
  rangedDamage: { label: 'Dégâts à distance', unit: 'points' },
  anomalyDamageBonus: { label: 'Dégâts en simulation crossover', unit: 'percent' },
  anomalyGiantDamageBonus: { label: 'Dégâts contre cibles géantes', unit: 'percent' },
  honorGainBonus: { label: 'Honneur gagné', unit: 'percent' },
  honorAura: { label: 'Honneur gagné', unit: 'percent' },
  queenDominationBonus: { label: 'Honneur sur famille royale xénomorphe', unit: 'percent' },
  sprintSpeed: { label: 'Vitesse de sprint', unit: 'percent' },
  energyRechargeRate: { label: 'Régénération d’énergie', unit: 'percent' },
  staminaRegen: { label: 'Régénération d’endurance', unit: 'percent' },
  sprintCostReduction: { label: 'Coût d’endurance du sprint', unit: 'reduction_percent' },
  plasmaRecharge: { label: 'Recharge du canon plasma', unit: 'percent' },
  cloakDuration: { label: 'Autonomie du camouflage', unit: 'percent' },
  goldCrownChance: { label: 'Chance relative des deux couronnes d’or', unit: 'percent' },
  goldCrownGiantChance: { label: 'Chance relative de couronne géante', unit: 'percent' },
});

const positive = (value, fallback = 0) => Number.isFinite(value) && value >= 0 ? value : fallback;
const ratio = value => Math.min(1, positive(value));
const DAMAGE_HOOK = Symbol('craftedDamageHook');

/** Cover internal damage-over-time calls as well as Game's direct attacks. */
export function installCraftedDamageHook(player, getPerks) {
  if (!player || typeof player.takeDamage !== 'function') return false;
  const installed = player[DAMAGE_HOOK];
  if (installed && player.takeDamage === installed.wrapper) {
    installed.getPerks = typeof getPerks === 'function' ? getPerks : installed.getPerks;
    player.craftedDamageHookInstalled = true;
    return true;
  }
  const state = { original: player.takeDamage, getPerks };
  state.wrapper = function craftedTakeDamage(amount, context, ...remaining) {
    const perks = (typeof state.getPerks === 'function' ? state.getPerks(this) : this.craftedEquipmentPerks) ?? {};
    const hitContext = typeof context === 'string' ? { type: context } : context;
    const damage = getCraftedIncomingDamage(amount, perks, hitContext);
    return state.original.call(this, damage, context, ...remaining);
  };
  Object.defineProperty(player, DAMAGE_HOOK, { configurable: true, value: state });
  player.takeDamage = state.wrapper;
  player.craftedDamageHookInstalled = true;
  return true;
}

/** Rebuild class-dependent values, so repeated equips never stack or heal. */
export function applyCraftedEquipmentToPlayer(player, perks = {}, { refill = false } = {}) {
  if (!player) return null;
  const classId = player.customization?.hunterClassId ?? DEFAULT_CUSTOMIZATION.hunterClassId;
  const hunter = HUNTER_CLASSES.find(entry => entry.id === classId) ?? HUNTER_CLASSES[0];
  const oldMaximum = positive(player.maxHealth, hunter.maxHealth) || hunter.maxHealth;
  const healthRatio = Math.min(1, positive(player.health) / oldMaximum);
  player.maxHealth = hunter.maxHealth + positive(perks.bonusHealth);
  player.health = refill ? player.maxHealth : player.maxHealth * healthRatio;
  player.sprintSpeed = hunter.sprintSpeed * Math.max(1, positive(perks.sprintSpeedMultiplier, 1));
  player.energyRegen = hunter.energyRegen * Math.max(1, positive(perks.energyRegenMultiplier, 1));
  player.staminaRegen = 25 * Math.max(1, positive(perks.staminaRegenMultiplier, 1));
  player.sprintStaminaCost = 30 * (1 - Math.min(0.8, positive(perks.sprintCostReductionRatio)));
  // update() regenerates energy before subtracting the cloak drain. Retain a
  // strictly positive class NET cost, even with recharge and cloak bonuses.
  const duration = Math.max(1, positive(perks.cloakDurationBonusMultiplier, 1));
  const classNetCost = Math.max(0.5, 12 - hunter.energyRegen);
  player.cloakEnergyDrain = player.energyRegen + classNetCost / duration;
  player.craftedAcidResistanceRatio = ratio(perks.acidImmunityRatio);
  player.craftedEquipmentPerks = { ...perks };
  return { maxHealth: player.maxHealth, health: player.health,
    sprintSpeed: player.sprintSpeed, energyRegen: player.energyRegen,
    staminaRegen: player.staminaRegen, sprintStaminaCost: player.sprintStaminaCost,
    cloakEnergyDrain: player.cloakEnergyDrain, cloakNetCost: classNetCost / duration };
}

export function getCraftedOutgoingDamage(amount, perks = {}, context = {}) {
  const { kind = 'melee', isCrossover = false, isGiant = false } = context ?? {};
  const base = positive(amount);
  if (!base) return 0;
  const flatBonus = kind === 'melee' ? positive(perks.meleeDamageBonus)
    : kind === 'ranged' ? positive(perks.rangedDamageBonus) : 0;
  const crossover = isCrossover ? Math.max(1, positive(perks.crossoverDamageBonusMultiplier, 1)) : 1;
  const giant = isGiant ? Math.max(1, positive(perks.giantDamageBonusMultiplier, 1)) : 1;
  return (base + flatBonus) * crossover * giant;
}

export function getCraftedIncomingDamage(amount, perks = {}, context = {}) {
  const { type = 'generic' } = context ?? {};
  let resistance = 0;
  if (type === 'acid') resistance = ratio(perks.acidImmunityRatio);
  else if (type === 'fire') resistance = ratio(perks.fireResistanceRatio);
  else if (type === 'energy' || type === 'plasma') resistance = ratio(perks.energyResistanceRatio);
  else if (type === 'ballistic') resistance = ratio(perks.ballisticResistanceRatio);
  return positive(amount) * (1 - Math.min(0.85, positive(perks.damageReductionRatio))) * (1 - resistance);
}

export function getCraftedHonorAward(amount, perks = {}, { queenFamily = false } = {}) {
  const general = Math.max(1, positive(perks.honorScoreBonusMultiplier, 1));
  const queen = queenFamily ? Math.max(1, positive(perks.queenHonorBonusMultiplier, 1)) : 1;
  return Math.round(positive(amount) * general * queen);
}

/** Preserve both gold outcomes; bonuses increase their relative base chance. */
export function selectCraftedCrown(roll, perks = {}) {
  const value = Number.isFinite(roll) ? Math.min(1, Math.max(0, roll)) : 1;
  const general = ratio(perks.goldCrownChanceBonus);
  const giantOnly = ratio(perks.giantGoldCrownChanceBonus);
  const giantChance = 0.08 * (1 + general + giantOnly);
  const miniChance = 0.08 * (1 + general);
  if (value < giantChance) return MONSTER_HUNTER_CROWNS.GIANT_GOLD_CROWN;
  if (value < giantChance + miniChance) return MONSTER_HUNTER_CROWNS.MINI_GOLD_CROWN;
  if (value < giantChance + miniChance + 0.16) return MONSTER_HUNTER_CROWNS.SILVER_CROWN;
  return MONSTER_HUNTER_CROWNS.STANDARD;
}
