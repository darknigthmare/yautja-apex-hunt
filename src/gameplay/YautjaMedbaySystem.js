import { audioSynth } from '../AudioSynthesizer.js';

export const MEDBAY_ITEMS = Object.freeze([
  Object.freeze({
    id: 'shrapnel_extractor',
    name: 'Pince chirurgicale d’extraction',
    shortName: 'PINCE ÉCLATS',
    lore: 'Pince articulée en alliage lourd utilisée par le City Hunter (1990) pour extirper plomb, éclats et débris avant traitement.',
    icon: 'pinces',
    sound: 'playMedicompUse',
    baseCharges: 3,
    cooldown: 2.0,
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator2']),
    effects: Object.freeze({
      health: 15,
      removeBleeding: true,
      cureShrapnel: true,
    }),
  }),
  Object.freeze({
    id: 'dermal_stapler',
    name: 'Agrafeuse dermique et pinces de chair',
    shortName: 'AGRAFES CHAIR',
    lore: 'Agrafeuse mécanique refermant les chairs ouvertes à l’aide d’agrafes chirurgicales en alliage yautja résorbable.',
    icon: 'agrafes',
    sound: 'playStaplerSnap',
    baseCharges: 3,
    cooldown: 1.5,
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987', 'predator2']),
    effects: Object.freeze({
      health: 35,
    }),
  }),
  Object.freeze({
    id: 'thermal_cauterizer',
    name: 'Brûleur thermique de cautérisation au plasma',
    shortName: 'CAUTÉRISATION',
    lore: 'Micro-torche plasma de haute précision scellant les plaies profondes et hémorragies artérielles au prix d’une douleur vive.',
    icon: 'plasma_torch',
    sound: 'playCauterizerSizzle',
    baseCharges: 2,
    cooldown: 3.0,
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator2']),
    effects: Object.freeze({
      health: 25,
      removeBleeding: true,
      staminaCost: 10,
    }),
  }),
  Object.freeze({
    id: 'coagulant_blue_paste',
    name: 'Pâte bleue régénératrice et poudre coagulante',
    shortName: 'PÂTE BLEUE',
    lore: 'Composé médical bleu emblématique provoquant une coagulation instantanée et accélérant la mitose cellulaire.',
    icon: 'blue_paste',
    sound: 'playMedicompHeal',
    baseCharges: 2,
    cooldown: 4.0,
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987', 'predator2']),
    effects: Object.freeze({
      health: 55,
      removeBleeding: true,
    }),
  }),
  Object.freeze({
    id: 'acid_neutralizer_vial',
    name: 'Fiole bio-neutralisante d’acide Cleaner',
    shortName: 'ANTI-ACIDE',
    lore: 'Réactif alcalin de la caste Cleaner (AVP:R 2007) dissolvant et purifiant instantanément le sang acide des Xénomorphes.',
    icon: 'vial_cleaner',
    sound: 'playAcidSizzle',
    baseCharges: 2,
    cooldown: 2.5,
    sourceTier: 'AVP_SCREEN',
    sources: Object.freeze(['avpRequiem2007']),
    effects: Object.freeze({
      health: 20,
      removeAcid: true,
    }),
  }),
  Object.freeze({
    id: 'stimulant_injector',
    name: 'Injecteur d’adrénaline cervicale',
    shortName: 'STIMULANT',
    lore: 'Injection neuro-musculaire sous pression restaurant instantanément l’endurance et l’énergie de combat du chasseur.',
    icon: 'injector',
    sound: 'playStimInjectorHiss',
    baseCharges: 3,
    cooldown: 3.5,
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator2', 'huntingGrounds']),
    effects: Object.freeze({
      stamina: 45,
      energy: 35,
    }),
  }),
]);

export const MEDBAY_ITEMS_MAP = Object.freeze(
  Object.fromEntries(MEDBAY_ITEMS.map((item) => [item.id, item]))
);

export function getMedbayItemById(id) {
  return MEDBAY_ITEMS_MAP[id] ?? null;
}

export function createMedbayInventoryState({ isMothership = false, chargesModifier = 1 } = {}) {
  const charges = {};
  const cooldowns = {};

  for (const item of MEDBAY_ITEMS) {
    charges[item.id] = isMothership
      ? Number.POSITIVE_INFINITY
      : Math.max(1, Math.round(item.baseCharges * chargesModifier));
    cooldowns[item.id] = 0;
  }

  return {
    isMothership: Boolean(isMothership),
    chargesModifier,
    charges,
    cooldowns,
    lastUsedItemId: null,
    totalTreatmentsApplied: 0,
  };
}

export function refillMedbayInventory(inventoryState) {
  if (!inventoryState?.charges) return inventoryState;
  for (const item of MEDBAY_ITEMS) {
    inventoryState.charges[item.id] = inventoryState.isMothership
      ? Number.POSITIVE_INFINITY
      : Math.max(1, Math.round(item.baseCharges * (inventoryState.chargesModifier || 1)));
    inventoryState.cooldowns[item.id] = 0;
  }
  return inventoryState;
}

export function updateMedbayCooldowns(inventoryState, delta = 0) {
  if (!inventoryState?.cooldowns || delta <= 0) return;
  for (const key of Object.keys(inventoryState.cooldowns)) {
    if (inventoryState.cooldowns[key] > 0) {
      inventoryState.cooldowns[key] = Math.max(0, inventoryState.cooldowns[key] - delta);
    }
  }
}

export function getMedbayDiagnostic(player) {
  if (!player) return null;

  const currentHp = Math.max(0, Math.round(player.health || 0));
  const maxHp = Math.max(1, Math.round(player.maxHealth || 100));
  const hpRatio = currentHp / maxHp;

  const hasAcid = Boolean(player.isAcidCorroded || (player.acidTimer && player.acidTimer > 0) || player.combatStatusTimers?.acid_burn > 0);
  const hasBleeding = Boolean(player.isBleeding || player.combatStatusTimers?.bleeding > 0);
  const hasSnare = Boolean(player.combatStatusTimers?.snare > 0);
  const staminaExhausted = (player.stamina ?? 100) < 30;

  const injuries = [];
  if (hasAcid) injuries.push({ type: 'acid_burn', label: 'Brûlure corrosive d’acide moléculaire', severity: 'critical' });
  if (hasBleeding) injuries.push({ type: 'bleeding', label: 'Hémorragie artérielle active', severity: 'high' });
  if (hasSnare) injuries.push({ type: 'snare', label: 'Entrave motrice ou fibres résiduelles', severity: 'medium' });
  if (hpRatio < 0.4) injuries.push({ type: 'severe_damage', label: 'Déchirures dermiques et traumatismes osseux', severity: 'high' });
  else if (hpRatio < 0.8) injuries.push({ type: 'moderate_damage', label: 'Lacérations superficielles et impacts', severity: 'low' });

  return {
    currentHp,
    maxHp,
    hpRatio,
    stamina: Math.round(player.stamina || 0),
    maxStamina: Math.round(player.maxStamina || 100),
    energy: Math.round(player.energy || 0),
    maxEnergy: Math.round(player.maxEnergy || 100),
    hasAcid,
    hasBleeding,
    hasSnare,
    staminaExhausted,
    injuries,
    overallCondition: hasAcid ? 'CORROSION CRITIQUE' : hasBleeding ? 'HÉMORRAGIE' : hpRatio < 0.35 ? 'CRITIQUE' : hpRatio < 0.75 ? 'BLESSÉ' : 'OPÉRATIONNEL',
  };
}

export function canApplyMedbayItem(player, itemId, inventoryState) {
  const item = getMedbayItemById(itemId);
  if (!player || !item) return { allowed: false, reason: 'Équipement médical inconnu' };

  if (inventoryState) {
    const charges = inventoryState.charges[itemId] ?? 0;
    if (charges <= 0) return { allowed: false, reason: 'Réserve épuisée pour ce composant' };
    const cooldown = inventoryState.cooldowns[itemId] ?? 0;
    if (cooldown > 0) return { allowed: false, reason: `Refroidissement en cours (${cooldown.toFixed(1)}s)` };
  }

  if (item.effects.staminaCost && (player.stamina || 0) < item.effects.staminaCost) {
    return { allowed: false, reason: 'Endurance insuffisante pour endurer le choc de cautérisation' };
  }

  // Vérification de pertinence médicale
  const diag = getMedbayDiagnostic(player);
  if (itemId === 'acid_neutralizer_vial' && !diag.hasAcid) {
    if (player.health >= player.maxHealth) {
      return { allowed: false, reason: 'Aucune contamination acide à neutraliser' };
    }
  }

  return { allowed: true, item };
}

export function applyMedbayItem(player, itemId, inventoryState = null, audio = audioSynth) {
  const check = canApplyMedbayItem(player, itemId, inventoryState);
  if (!check.allowed) return { success: false, reason: check.reason };

  const item = check.item;
  const effects = item.effects;

  // Audio synchro
  if (audio && typeof audio[item.sound] === 'function') {
    audio[item.sound]();
  }

  let healthRestored = 0;
  let staminaRestored = 0;
  let energyRestored = 0;
  const curedStatuses = [];

  // Santé
  if (effects.health) {
    const prevHp = player.health;
    player.health = Math.min(player.maxHealth, player.health + effects.health);
    healthRestored = Math.max(0, player.health - prevHp);
  }

  // Stamina cost or restore
  if (effects.staminaCost) {
    player.stamina = Math.max(0, (player.stamina || 0) - effects.staminaCost);
  } else if (effects.stamina) {
    const prevStamina = player.stamina || 0;
    player.stamina = Math.min(player.maxStamina || 100, (player.stamina || 0) + effects.stamina);
    staminaRestored = player.stamina - prevStamina;
  }

  // Energy
  if (effects.energy) {
    const prevEnergy = player.energy || 0;
    player.energy = Math.min(player.maxEnergy || 100, (player.energy || 0) + effects.energy);
    energyRestored = player.energy - prevEnergy;
  }

  // Statuses
  if (effects.removeAcid) {
    player.isAcidCorroded = false;
    player.acidTimer = 0;
    if (player.combatStatusTimers) player.combatStatusTimers.acid_burn = 0;
    curedStatuses.push('acid_burn');
  }

  if (effects.removeBleeding) {
    player.isBleeding = false;
    if (player.combatStatusTimers) player.combatStatusTimers.bleeding = 0;
    curedStatuses.push('bleeding');
  }

  // Consommation et cooldown
  if (inventoryState) {
    if (inventoryState.charges[itemId] !== Number.POSITIVE_INFINITY) {
      inventoryState.charges[itemId] = Math.max(0, inventoryState.charges[itemId] - 1);
    }
    inventoryState.cooldowns[itemId] = item.cooldown;
    inventoryState.lastUsedItemId = itemId;
    inventoryState.totalTreatmentsApplied = (inventoryState.totalTreatmentsApplied || 0) + 1;
  }

  return {
    success: true,
    item,
    healthRestored,
    staminaRestored,
    energyRestored,
    curedStatuses,
    remainingCharges: inventoryState?.charges[itemId] ?? null,
  };
}
