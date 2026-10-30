/**
 * YautjaTrophyCraftsmanshipForgeSystem.js
 * Méga-Extension de Forge & Artisanat de Trophées (Pseudo-Craftsmanship Yautja).
 * Permet de forger des équipements uniques à partir des trophées prélevés sur les proies canoniques :
 * - Boucliers en tête / dôme de Xénomorphe & crête de Reine (Scar & Lex Woods AVP 2004 style)
 * - Lames, harpons et fouets en queue de Xénomorphe (Combi-spears, Cleaner whips)
 * - Bio-masques hybrides ornés de mâchoires, cornes et os de proies (Mr. Black, Broken Tusk)
 * - Cuirasses et armures en carapaces de Reine et peaux de Léviathans célestes
 * - Étendards de Clan & Totems de chasse rituels honorant les 5 gabarits métriques
 */

export const TROPHY_CRAFT_CATEGORIES = Object.freeze({
  SHIELDS: { id: 'SHIELDS', label: "Boucliers d'Os & Chitine", icon: '🛡️' },
  WEAPONS: { id: 'WEAPONS', label: "Lames & Hasts Caudaux", icon: '🗡️' },
  MASKS: { id: 'MASKS', label: "Bio-Masques Hybrides", icon: '🪖' },
  ARMOR: { id: 'ARMOR', label: "Cuirasses & Armures", icon: '🥋' },
  BANNERS: { id: 'BANNERS', label: "Étendards & Totems", icon: '🚩' },
});

export const TROPHY_CRAFT_RECIPES = Object.freeze([
  // 1. BOUCLIERS (SHIELDS)
  {
    id: 'craft_shield_xeno_warrior',
    name: 'Bouclier Céphalique en Dôme de Xénomorphe Guerrier',
    category: 'SHIELDS',
    originLore: 'AVP (2004) — Forgé par Scar pour Lex Woods au cœur de la pyramide de Bouvetøya.',
    requiredTrophy: 'Carapace Céphalique de Guerrier Xénomorphe',
    requiredHonor: 1800,
    stats: { defense: 35, acidImmunity: 1.0, parryBonus: 20 },
    perkName: 'PARADE ACIDE TOTALE',
    perkDescription: 'Confère une immunité absolue (100%) aux projections et flaques d\'acide moléculaire.',
    badgeClass: 'craft-shield',
  },
  {
    id: 'craft_shield_xeno_queen',
    name: 'Grande Égide Royale en Crête de Reine Xénomorphe',
    category: 'SHIELDS',
    originLore: 'Aliens (1986) & AVP — Forgé dans la crête osseuse d\'une Matriarche royale par les Maîtres de Clan.',
    requiredTrophy: 'Crête Dorée de la Reine-Mère Suprême',
    requiredHonor: 5000,
    stats: { defense: 75, acidImmunity: 1.0, plasmaDeflection: 30 },
    perkName: 'ÉGIDE TITANIQUE & PLASMA',
    perkDescription: 'Bloque les charges colossales de géants et dévie 30% des tirs énergétiques.',
    badgeClass: 'craft-shield',
  },
  {
    id: 'craft_shield_kalisk_bone',
    name: 'Bouclier Osseux Tribal en Plastron de Kalisk',
    category: 'SHIELDS',
    originLore: 'Predator: Badlands — Taillé dans le plastron adaptatif d\'un apex de Genna.',
    requiredTrophy: 'Plastron Osseux Adaptatif de Kalisk',
    requiredHonor: 3400,
    stats: { defense: 50, kineticAbsorb: 40, counterCharge: 25 },
    perkName: 'CONTRE-CHARGE BRUTALE',
    perkDescription: 'Absorbe les chocs cinétiques et renvoie 25% de la force d\'impact à l\'attaquant.',
    badgeClass: 'craft-shield',
  },
  {
    id: 'craft_shield_engineer_obsidian',
    name: 'Pavois Stellaire en Obsidienne Vivante d\'Ingénieur',
    category: 'SHIELDS',
    originLore: 'Prometheus / Fire and Stone — Façonné dans les panneaux d\'obsidienne stellaire des Architectes.',
    requiredTrophy: 'Plastron en Obsidienne Vivante d\'Ingénieur Altéré',
    requiredHonor: 4500,
    stats: { defense: 60, gravityField: 35, energyResist: 50 },
    perkName: 'RÉPULSION GRAVITATIONNELLE',
    perkDescription: 'Émet un micro-champ répulsif déséquilibrant les ennemis lors des corps-à-corps.',
    badgeClass: 'craft-shield',
  },

  // 2. LAMES & HASTS EN QUEUE (WEAPONS)
  {
    id: 'craft_weapon_tail_blade_glaive',
    name: 'Combi-Glaive à Pointe Caudale de Xénomorphe',
    category: 'WEAPONS',
    originLore: 'AVP (2004) — Lance télescopique sertie de la pointe caudale d\'un xénomorphe barbelé.',
    requiredTrophy: 'Pointe Caudale Barbelée de Xénomorphe',
    requiredHonor: 2200,
    stats: { damage: 45, armorPierce: 35, reach: 1.5 },
    perkName: 'ESTOCADE CORROSIVE',
    perkDescription: 'Pénètre les carapaces denses et inflige des perforations critiques aux points faibles.',
    badgeClass: 'craft-weapon',
  },
  {
    id: 'craft_weapon_cleaner_spinal_whip',
    name: 'Fouet Rachidien en Vertèbres de Xénomorphe',
    category: 'WEAPONS',
    originLore: 'AVP: Requiem (2007) — Arme de Wolf le Nettoyeur tressée à partir d\'un rachis de xénomorphe.',
    requiredTrophy: 'Vertèbres Caudales de Xénomorphe Concasseur',
    requiredHonor: 3900,
    stats: { damage: 55, crowdControl: 45, sweepRadius: 360 },
    perkName: 'BALAYAGE DE ZONE À 360°',
    perkDescription: 'Fauche instantanément les essaims de petites proies et tranche les membres périphériques.',
    badgeClass: 'craft-weapon',
  },
  {
    id: 'craft_weapon_praetorian_wrist_scythe',
    name: 'Double Faux de Poignet en Dard de Prétorien',
    category: 'WEAPONS',
    originLore: 'Aliens: Colonial Marines — Faux jumelées forgées dans les dards antérieurs d\'un garde prétorien.',
    requiredTrophy: 'Faux Chitinique Antérieure de Ravageur (1.2m)',
    requiredHonor: 4200,
    stats: { damage: 65, attackSpeed: 25, bleedAcid: 25 },
    perkName: 'SAIGNEMENT D\'ACIDE',
    perkDescription: 'Chaque taillade infecte la chair de la proie d\'un saignement caustique continu.',
    badgeClass: 'craft-weapon',
  },
  {
    id: 'craft_weapon_queen_spine_harpoon',
    name: 'Harpon Cérémonial d\'Épine Dorsale de Reine',
    category: 'WEAPONS',
    originLore: 'Aliens: Genocide — Harpon de traque colossal sculpté dans une épine dorsale royale.',
    requiredTrophy: 'Plaque Céphalique Écarlate de la Reine Rouge',
    requiredHonor: 5400,
    stats: { damage: 85, criticalChance: 35, partBreakBonus: 50 },
    perkName: 'BRISE-PARTIES LOURD',
    perkDescription: '+50% d\'efficacité pour trancher les queues, briser les cornes et fracturer les bio-masques.',
    badgeClass: 'craft-weapon',
  },

  // 3. BIO-MASQUES HYBRIDES (MASKS)
  {
    id: 'craft_mask_xeno_jaw_berserker',
    name: 'Bio-Masque Berserker à Mâchoire Inférieure de Xéno',
    category: 'MASKS',
    originLore: 'Predators (2010) — Heaume iconique de Berserker orné d\'une mandibule inférieure de xénomorphe.',
    requiredTrophy: 'Mandibule Inférieure de Xénomorphe Épineuse',
    requiredHonor: 3200,
    stats: { visionRange: 40, targetAcquisition: 30, trackingScore: 50 },
    perkName: 'VISION PHÉROMONALE DE TRAQUE',
    perkDescription: 'Révèle les traces de pas et les odeurs des proies camouflées à travers le décor.',
    badgeClass: 'craft-mask',
  },
  {
    id: 'craft_mask_goliath_bone',
    name: 'Bio-Masque Féral en Plaques Crâniennes de Goliath',
    category: 'MASKS',
    originLore: 'Prey (2022) & Fan Lore — Masque sculptural taillé dans le front corné d\'un Goliath.',
    requiredTrophy: 'Corne Frontale de Goliath Xeno-Akumo',
    requiredHonor: 3600,
    stats: { headshotDefense: 60, stunResistance: 40, opticsRange: 25 },
    perkName: 'RÉSISTANCE CRÂNIENNE FÉRALE',
    perkDescription: 'Immunité totale aux étourdissements et réduction de 60% des traumatismes à la tête.',
    badgeClass: 'craft-mask',
  },
  {
    id: 'craft_mask_broken_tusk_rhynth',
    name: 'Masque Sacré de Broken Tusk à Cornes de Rhynth',
    category: 'MASKS',
    originLore: 'AVP: Prey (1994) — Bio-masque légendaire de Dachande marqué du glyphe sacré par Machiko.',
    requiredTrophy: 'Corne de Rhynth Hexapode de Ryushi',
    requiredHonor: 4800,
    stats: { honorGainBonus: 25, leadershipAura: 40, parryWindow: 20 },
    perkName: 'GLYPHE SACRÉ DU CLAN',
    perkDescription: 'Octroie un bonus permanent de +25% de points d\'honneur sur toutes les chasses accomplies.',
    badgeClass: 'craft-mask',
  },
  {
    id: 'craft_mask_engineer_astrolabe',
    name: 'Heaume d\'Obsidienne d\'Ingénieur et Visière UV',
    category: 'MASKS',
    originLore: 'Prometheus (2012) — Casque scellé en bio-composite d\'Architecte aux optiques ultraviolettes.',
    requiredTrophy: 'Diadème Stellaire d\'Architecte Suprême',
    requiredHonor: 5500,
    stats: { thermalFilter: 50, zoomDistance: 60, anomalyScan: 100 },
    perkName: 'SCAN MULTISPECTRAL D\'ANOMALIE',
    perkDescription: 'Met en surbrillance instantanée tous les points faibles critiques dès le verrouillage.',
    badgeClass: 'craft-mask',
  },

  // 4. ARMURES EN MORCEAUX DE PROIES (ARMOR)
  {
    id: 'craft_armor_queen_carapace_cuirass',
    name: 'Cuirasse en Carapace Royale de Reine Xénomorphe',
    category: 'ARMOR',
    originLore: 'Aliens: Female War — Plastron lourd forgé dans la chitine royale impénétrable de la Reine.',
    requiredTrophy: 'Crête Chitinique Dorsale de Matriarche Primordiale',
    requiredHonor: 5800,
    stats: { healthBonus: 250, acidImmunity: 1.0, fireResistance: 50 },
    perkName: 'BLINDAGE ROYAL IMPÉNÉTRABLE',
    perkDescription: '+250 PV au porteur et réduction de 50% de tous les dégâts de feu et napalm.',
    badgeClass: 'craft-armor',
  },
  {
    id: 'craft_armor_drone_chitin_greaves',
    name: 'Grèves et Brassards en Chitine Noire de Drone',
    category: 'ARMOR',
    originLore: 'AVP Lore — Protections articulées légères confectionnées dans les carapaces de xénomorphes.',
    requiredTrophy: 'Chitine Brute de Drone Xénomorphe',
    requiredHonor: 2000,
    stats: { sprintSpeed: 20, dodgeCostReduction: 30, splashImmunity: 1.0 },
    perkName: 'MOBILITÉ DE CHITINE',
    perkDescription: 'Réduit le coût d\'endurance des roulades de 30% et augmente la vitesse de pointe de 20%.',
    badgeClass: 'craft-armor',
  },
  {
    id: 'craft_armor_vydrach_sky_cloak',
    name: 'Manteau de Cuir Aérien de Léviathan Vy\'drach',
    category: 'ARMOR',
    originLore: 'Yautja Prime Lore — Cape de cérémonie taillée dans les ailes du dragon volant céleste.',
    requiredTrophy: 'Membrane Alaire de Vy\'drach Céleste (16m)',
    requiredHonor: 4600,
    stats: { cloakDuration: 50, heatDispersion: 40, glideFall: true },
    perkName: 'FURTIVITÉ THERMIQUE AÉRIENNE',
    perkDescription: '+50% de durée de camouflage optique et suppression de tout dégât de chute en planant.',
    badgeClass: 'craft-armor',
  },
  {
    id: 'craft_armor_weyland_titanium_harness',
    name: 'Harnais Renforcé en Titane d\'Exosquelette Weyland',
    category: 'ARMOR',
    originLore: 'Aliens: Fireteam Elite — Plaques de blindage de méchas militaires Weyland adaptées au torse.',
    requiredTrophy: 'Module de Commande Tactique Weyland MK IV',
    requiredHonor: 3900,
    stats: { ammoCapacity: 50, plasmaRecharge: 35, recoilDamping: 40 },
    perkName: 'SURCHARGE ÉNERGÉTIQUE WEYLAND',
    perkDescription: '+35% de vitesse de recharge du canon plasma et doublement de la réserve de disques.',
    badgeClass: 'craft-armor',
  },

  // 5. ÉTENDARDS DE CLAN & TOTEMS RITUELS (BANNERS)
  {
    id: 'craft_banner_xeno_queen_crest',
    name: 'Grand Étendard Sacré à Crâne de Reine Xénomorphe',
    category: 'BANNERS',
    originLore: 'AVP Expanded Lore — Bannière totémique suprême célébrant la destruction totale d\'une Ruche.',
    requiredTrophy: 'Crâne Osseux de Reine Xénomorphe',
    requiredHonor: 5000,
    stats: { clanPrestige: 500, honorAura: 20, fearInduction: 35 },
    perkName: 'AURA DU PRÉDATEUR APEX',
    perkDescription: '+20% de points d\'honneur supplémentaires sur toutes les proies éliminées.',
    badgeClass: 'craft-banner',
  },
  {
    id: 'craft_banner_broken_tusk_machiko',
    name: 'Étendard d\'Honneur de Machiko Noguchi & Dachande',
    category: 'BANNERS',
    originLore: 'Aliens vs. Predator: War (1994) — Standard de guerre célébrant l\'alliance humaine-Yautja.',
    requiredTrophy: 'Bio-Masque Marqué du Sang Acide de Dachande',
    requiredHonor: 4400,
    stats: { coOpTactics: 40, parryWindow: 30, staminaRegen: 25 },
    perkName: 'PACTE DE LA CHASSE COMMUNE',
    perkDescription: 'Augmente la vitesse de régénération de l\'endurance de 25% et élargit la fenêtre de parade.',
    badgeClass: 'craft-banner',
  },
  {
    id: 'craft_totem_multiverse_challenger',
    name: 'Totem des Champions du Multivers aux Sceaux Runiques',
    category: 'BANNERS',
    originLore: 'Multiverse Canon Lore — Obélisque érigé pour défier les 60 anomalies dimensionnelles.',
    requiredTrophy: 'Trophée d\'Anomalie Multivers Majeure',
    requiredHonor: 6000,
    stats: { anomalyDamageBonus: 25, riftStability: 50, secretDropChance: 30 },
    perkName: 'DOMINATION DIMENSIONNELLE',
    perkDescription: '+25% de dégâts infligés contre toutes les proies d\'exception du Multivers Crossover.',
    badgeClass: 'craft-banner',
  },
  {
    id: 'craft_totem_ancestral_5_scales',
    name: 'Pilier Ancestral des Cinq Gabarits Métriques',
    category: 'BANNERS',
    originLore: 'Yautja Ancient Code — Le totem suprême honorant la maîtrise des 5 gabarits de proies.',
    requiredTrophy: 'Ensemble des 5 Trophées Paliers (Géant à Minuscule)',
    requiredHonor: 7000,
    stats: { goldCrownChance: 50, allScalesBonus: 15, supremeRankTitle: true },
    perkName: 'MAÎTRISE DES 5 GABARITS (MONSTER HUNTER)',
    perkDescription: '+50% de probabilité de faire apparaître des Couronnes d\'Or Géantes (👑) lors des chasses.',
    badgeClass: 'craft-banner',
  },
]);

/**
 * Système de gestion de l'artisanat et de la forge de trophées Yautja.
 */
// Normalize recipe aliases for cross-compatibility
TROPHY_CRAFT_RECIPES.forEach((r) => {
  if (!r.originMedia) r.originMedia = r.originLore;
  if (!r.requiredTrophies) r.requiredTrophies = [r.requiredTrophy];
  if (!r.passiveBonus) r.passiveBonus = r.perkDescription;
  if (!r.perks) r.perks = r.stats;
});

export class YautjaTrophyCraftsmanshipForgeSystem {
  constructor(storageKey = 'yautja_apex_trophy_craftsmanship_state') {
    this.storageKey = storageKey;
    this.state = {
      craftedItemIds: [],
      equippedItemIds: [], // Peut équiper 1 item par catégorie
    };
    this.load();
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.state.craftedItemIds = Array.isArray(parsed.craftedItemIds) ? parsed.craftedItemIds : [];
          this.state.equippedItemIds = Array.isArray(parsed.equippedItemIds) ? parsed.equippedItemIds : [];
        }
      }
    } catch {
      // Ignorer erreur de lecture en environnement restreint
    }
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      }
    } catch {
      // Ignorer erreur d'écriture en environnement restreint
    }
  }

  getRecipes(categoryFilter = 'all') {
    if (!categoryFilter || categoryFilter === 'all') {
      return TROPHY_CRAFT_RECIPES;
    }
    return TROPHY_CRAFT_RECIPES.filter((r) => r.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  getRecipeById(id) {
    return TROPHY_CRAFT_RECIPES.find((r) => r.id === id) || null;
  }

  isCrafted(id) {
    return this.state.craftedItemIds.includes(id);
  }

  isEquipped(id) {
    return this.state.equippedItemIds.includes(id);
  }

  canCraft(recipeId, playerHonorScore = 0) {
    const recipe = this.getRecipeById(recipeId);
    if (!recipe) return { canCraft: false, reason: 'unknown_recipe' };
    if (this.isCrafted(recipeId)) return { canCraft: false, reason: 'already_crafted' };
    if (playerHonorScore < recipe.requiredHonor) {
      return { canCraft: false, reason: 'insufficient_honor', missingHonor: recipe.requiredHonor - playerHonorScore };
    }
    return { canCraft: true, recipe };
  }

  craftItem(recipeId, playerHonorScore = 0) {
    const check = this.canCraft(recipeId, playerHonorScore);
    if (!check.canCraft) return check;

    this.state.craftedItemIds.push(recipeId);
    // Équipe automatiquement le premier item forgé dans sa catégorie
    const recipe = check.recipe;
    const sameCatEquipped = this.state.equippedItemIds.find((id) => {
      const other = this.getRecipeById(id);
      return other && other.category === recipe.category;
    });
    if (!sameCatEquipped) {
      this.state.equippedItemIds.push(recipeId);
    }

    this.save();
    return {
      success: true,
      recipe,
      equipped: this.isEquipped(recipeId),
    };
  }

  equipItem(recipeId) {
    if (!this.isCrafted(recipeId)) return { success: false, reason: 'not_crafted_yet' };
    const recipe = this.getRecipeById(recipeId);
    if (!recipe) return { success: false, reason: 'unknown_recipe' };

    // Déseéquipe tout autre équipement de la même catégorie
    this.state.equippedItemIds = this.state.equippedItemIds.filter((id) => {
      const other = this.getRecipeById(id);
      return other && other.category !== recipe.category;
    });

    this.state.equippedItemIds.push(recipeId);
    this.save();
    return { success: true, equippedItem: recipe };
  }

  unequipItem(recipeId) {
    this.state.equippedItemIds = this.state.equippedItemIds.filter((id) => id !== recipeId);
    this.save();
    return { success: true, unequippedId: recipeId };
  }

  getActiveCraftedPerks() {
    const equipped = this.state.equippedItemIds.map((id) => this.getRecipeById(id)).filter(Boolean);
    const perks = {
      acidImmunityRatio: 0,
      partBreakBonusMultiplier: 1.0,
      goldCrownChanceBonus: 0,
      crossoverDamageBonusMultiplier: 1.0,
      honorScoreBonusMultiplier: 1.0,
      bonusHealth: 0,
      cloakDurationBonusMultiplier: 1.0,
      equippedList: equipped,
    };

    for (const item of equipped) {
      if (item.stats.acidImmunity) {
        perks.acidImmunityRatio = Math.max(perks.acidImmunityRatio, item.stats.acidImmunity);
      }
      if (item.stats.partBreakBonus) {
        perks.partBreakBonusMultiplier += item.stats.partBreakBonus / 100;
      }
      if (item.stats.goldCrownChance) {
        perks.goldCrownChanceBonus += item.stats.goldCrownChance / 100;
      }
      if (item.stats.anomalyDamageBonus) {
        perks.crossoverDamageBonusMultiplier += item.stats.anomalyDamageBonus / 100;
      }
      if (item.stats.honorGainBonus || item.stats.honorAura) {
        perks.honorScoreBonusMultiplier += ((item.stats.honorGainBonus || 0) + (item.stats.honorAura || 0)) / 100;
      }
      if (item.stats.healthBonus) {
        perks.bonusHealth += item.stats.healthBonus;
      }
      if (item.stats.cloakDuration) {
        perks.cloakDurationBonusMultiplier += item.stats.cloakDuration / 100;
      }
    }

    return perks;
  }
}
