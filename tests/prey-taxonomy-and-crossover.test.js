import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PREY_SCALE_TIERS,
  PREY_FACTIONS,
  CANON_PREY_CATALOG,
  MULTIVERSE_CROSSOVER_PREY,
  getMultiverseRotationState,
  filterPreyByScale,
  filterPreyByFaction,
  MONSTER_HUNTER_CROWNS,
  determineMonsterHunterCrown,
  ELEMENTAL_AFFINITIES,
} from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';

import {
  CANON_FACTION_COLORS,
  getYautjaClanLogo,
  getWeylandYutaniLogo,
  getUSCMLogo,
  getEngineerLogo,
  getXenomorphHiveLogo,
  getOWLFLogo,
  getStargazerLogo,
  getHuntCardLogo,
  getCrossoverLogo,
  renderFactionEmblem,
  getCraftsmanshipItemSvg,
} from '../src/ui/CanonLogosAndEmblems.js';
import {
  TROPHY_CRAFT_CATEGORIES,
  TROPHY_CRAFT_RECIPES,
  YautjaTrophyCraftsmanshipForgeSystem,
} from '../src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';

test('Taxonomie des proies : Les 5 paliers d’échelle (Géant, Grande, Moyen, Petite, Minuscule) sont rigoureusement définis', () => {
  const tiers = Object.keys(PREY_SCALE_TIERS);
  assert.deepEqual(tiers, ['GEANT', 'GRANDE', 'MOYEN', 'PETITE', 'MINUSCULE']);

  for (const tierKey of tiers) {
    const tier = PREY_SCALE_TIERS[tierKey];
    assert.ok(tier.id, `Le palier ${tierKey} doit avoir un id`);
    assert.ok(tier.label, `Le palier ${tierKey} doit avoir un label`);
    assert.ok(tier.sizeRange, `Le palier ${tierKey} doit spécifier une plage métrique`);
    assert.ok(tier.badgeClass, `Le palier ${tierKey} doit avoir une classe CSS`);
    assert.ok(typeof tier.honorMultiplier === 'number' && tier.honorMultiplier > 0, `Multiplicateur d'honneur valide pour ${tierKey}`);
  }

  assert.equal(PREY_SCALE_TIERS.GEANT.honorMultiplier, 2.5);
  assert.equal(PREY_SCALE_TIERS.MINUSCULE.honorMultiplier, 0.5);
});

test('Catalogue canonique : Distribution exhaustive des proies à travers les factions et gabarits 1:1', () => {
  assert.ok(CANON_PREY_CATALOG.length >= 175, `Le catalogue doit contenir au moins 175 proies canoniques, obtenu: ${CANON_PREY_CATALOG.length}`);

  const scalesPresent = new Set(CANON_PREY_CATALOG.map((p) => p.scale));
  assert.ok(scalesPresent.has('GEANT'), 'Présence de proies géantes');
  assert.ok(scalesPresent.has('GRANDE'), 'Présence de grandes proies');
  assert.ok(scalesPresent.has('MOYEN'), 'Présence de proies moyennes');
  assert.ok(scalesPresent.has('PETITE'), 'Présence de petites proies');
  assert.ok(scalesPresent.has('MINUSCULE'), 'Présence de proies minuscules');

  for (const prey of CANON_PREY_CATALOG) {
    assert.ok(prey.id, 'Id unique présent');
    assert.ok(prey.name, 'Nom présent');
    assert.ok(prey.faction, 'Faction présente');
    assert.ok(prey.scale, 'Échelle présente');
    assert.ok(typeof prey.sizeMeters === 'number' && prey.sizeMeters > 0, `Taille métrique présente pour ${prey.name}`);
    assert.ok(Array.isArray(prey.weakpoints) && prey.weakpoints.length > 0, `Points faibles présents pour ${prey.name}`);
    assert.ok(prey.baseHonor > 0, `Récompense en honneur positive pour ${prey.name}`);
    assert.ok(prey.originMedia, `Média d'origine présent pour ${prey.name}`);
  }
});

test('Factions canoniques : Couverture complète Yautja, Ingénieurs, Ruche Xénomorphe', () => {
  const factions = new Set(CANON_PREY_CATALOG.map((p) => p.faction));
  assert.ok(factions.has(PREY_FACTIONS.YAUTJA), 'Faction Yautja couverte');
  assert.ok(factions.has(PREY_FACTIONS.ENGINEER), 'Faction Ingénieurs couverte');
  assert.ok(factions.has(PREY_FACTIONS.XENOMORPH), 'Faction Xénomorphe couverte');
});

test('Multivers Crossover : Les 60 proies d’exception officielles sont répertoriées avec fidélité 1:1', () => {
  assert.equal(MULTIVERSE_CROSSOVER_PREY.length, 60, 'Exactement 60 proies crossover majeures documentées');

  const expectedIds = [
    'crossover_batman',
    'crossover_joker',
    'crossover_terminator_t800',
    'crossover_judge_dredd',
    'crossover_superman_red_sun',
    'crossover_witchblade',
    'crossover_tarzan',
    'crossover_magnus',
    'crossover_grendel',
    'crossover_the_mask',
    'crossover_buffy',
    'crossover_archie',
    'crossover_the_darkness',
    'crossover_robocop',
    'crossover_mortal_kombat_kano',
    'crossover_x_files_mulder',
    'crossover_judge_anderson',
    'crossover_worlds_finest',
    'crossover_t_infinity',
    'crossover_machiko_noguchi',
    'crossover_green_lantern',
    'crossover_wildcats_grifter',
    'crossover_jla_league',
    'crossover_bloodlines_darkness',
    'crossover_wolverine',
    'crossover_black_panther',
    'crossover_spider_man',
    'crossover_iron_man',
    'crossover_captain_america',
    'crossover_thor_asgard',
    'crossover_scorpion_subzero',
    'crossover_hellboy_anung',
    'crossover_conan_cimmerian',
    'crossover_deadpool_wilson',
    'crossover_judge_death',
    'crossover_spawn_simmons',
    'crossover_riddick_furyan',
    'crossover_mandalorian_boba',
    'crossover_snake_plissken',
    'crossover_caryn_delacroix',
    'crossover_master_chief',
    'crossover_doom_slayer',
    'crossover_geralt_rivia',
    'crossover_solid_snake',
    'crossover_kratos_sparta',
    'crossover_samus_aran',
    'crossover_ghost_rider',
    'crossover_isaac_clarke',
    'crossover_lobo_czarnia',
    'crossover_sarah_connor',
    'crossover_blade_daywalker',
    'crossover_dredd_incubus',
    'crossover_robocop_prime',
    'crossover_vampirella_drakulon',
    'crossover_captain_nemo_nautilus',
    'crossover_zealot_wildcats',
    'crossover_batman_beyond',
    'crossover_darkness_jackie_ascendant',
    'crossover_terminator_t_infinity_prime',
    'crossover_predator_killer_suit',
  ];
  const ids = MULTIVERSE_CROSSOVER_PREY.map((c) => c.id);
  assert.deepEqual(ids, expectedIds);

  for (const crossover of MULTIVERSE_CROSSOVER_PREY) {
    assert.ok(crossover.universe, `Univers requis pour ${crossover.id}`);
    assert.ok(crossover.originMedia, `Média d'origine requis pour ${crossover.id}`);
    assert.ok(typeof crossover.crossoverYear === 'number', `Année du crossover requise pour ${crossover.id}`);
    assert.ok(crossover.trophy, `Trophée requis pour ${crossover.id}`);
    assert.ok(Array.isArray(crossover.weakpoints) && crossover.weakpoints.length >= 2, `Points faibles multiples requis pour ${crossover.id}`);
    assert.ok(crossover.honorReward >= 3000, `Honneur prestigieux requis pour ${crossover.id}`);
  }

  const batman = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_batman');
  assert.match(batman.originMedia, /Batman versus Predator \(1991/);
  assert.equal(batman.crossoverYear, 1991);

  const terminator = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_terminator_t800');
  assert.match(terminator.originMedia, /Aliens versus Predator versus The Terminator \(2000/);

  const superman = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_superman_red_sun');
  assert.match(superman.originMedia, /Superman vs\. Predator \(2000/);
  assert.equal(superman.scale, 'MOYEN');

  const tarzan = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_tarzan');
  assert.match(tarzan.originMedia, /Tarzan vs\. Predator/);

  const darkness = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_the_darkness');
  assert.match(darkness.originMedia, /Overkill/);

  const robocop = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_robocop');
  assert.match(robocop.originMedia, /RoboCop versus The Terminator/);

  const wolverine = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_wolverine');
  assert.match(wolverine.originMedia, /Predator vs\. Wolverine/);
  assert.equal(wolverine.crossoverYear, 2023);
  assert.equal(wolverine.universe, 'Marvel Comics');

  const hellboy = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_hellboy_anung');
  assert.match(hellboy.originMedia, /Hellboy \/ B\.P\.R\.D\./);
  assert.equal(hellboy.scale, 'MOYEN');

  const deadpool = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_deadpool_wilson');
  assert.match(deadpool.originMedia, /Deadpool vs\. Predator/);
  assert.equal(deadpool.crossoverYear, 2024);

  const mk = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_scorpion_subzero');
  assert.match(mk.originMedia, /Mortal Kombat X/);
  assert.equal(mk.crossoverYear, 2015);

  const chief = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_master_chief');
  assert.match(chief.originMedia, /Halo Universe/);
  assert.equal(chief.crossoverYear, 2001);

  const slayer = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_doom_slayer');
  assert.match(slayer.originMedia, /DOOM Universe/);
  assert.equal(slayer.scale, 'MOYEN');

  const kratos = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === 'crossover_kratos_sparta');
  assert.match(kratos.originMedia, /God of War/);
  assert.equal(kratos.honorReward, 6900);
});

test('Système de rotation temporelle : Cycle déterministe de 6 heures et compte à rebours précis', () => {
  const baseTimestamp = 1700000000000;
  const state1 = getMultiverseRotationState(baseTimestamp);

  assert.ok(state1.activePrey, 'Cible active définie');
  assert.equal(state1.upcomingPrey.length, 2, '2 cibles à venir fournies');
  assert.ok(state1.secondsRemaining > 0 && state1.secondsRemaining <= 6 * 3600, 'Secondes restantes valides');
  assert.match(state1.formattedCountdown, /^\d{2}:\d{2}:\d{2}$/, 'Format décompte HH:MM:SS');

  // Avancement de 6 heures : la cible active doit passer à la suivante
  const sixHoursMs = 6 * 3600 * 1000;
  const state2 = getMultiverseRotationState(baseTimestamp + sixHoursMs);
  assert.equal(state2.activePrey.id, state1.upcomingPrey[0].id, 'La cible active suivante correspond au premier des éléments à venir');

  // Avancement de 12 heures : la cible active doit correspondre au second élément à venir
  const state3 = getMultiverseRotationState(baseTimestamp + 2 * sixHoursMs);
  assert.equal(state3.activePrey.id, state1.upcomingPrey[1].id, 'La cible active après 12h correspond au second élément à venir');
});

test('Filtres de proies : filterPreyByScale et filterPreyByFaction fonctionnent conformément aux attentes', () => {
  const geants = filterPreyByScale('geant');
  assert.ok(geants.length > 0, 'Présence de proies géantes');
  assert.ok(geants.every((p) => p.scale === 'GEANT'), 'Toutes les proies retournées sont GEANT');

  const xenos = filterPreyByFaction(PREY_FACTIONS.XENOMORPH);
  assert.ok(xenos.length > 0, 'Présence de xénomorphes');
  assert.ok(xenos.every((p) => p.faction === PREY_FACTIONS.XENOMORPH), 'Toutes les proies retournées sont de la Ruche');

  const all = filterPreyByScale('all');
  assert.equal(all.length, CANON_PREY_CATALOG.length, 'Filtre "all" retourne tout le catalogue');
});

test('Logos et Emblèmes Canoniques 1:1 : Génération SVG vectorielle sans dépendance externe', () => {
  // 1. Logo Yautja Clan Oram-gai
  const yautjaSvg = getYautjaClanLogo(64);
  assert.match(yautjaSvg, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(yautjaSvg, /class="canon-logo logo-yautja"/);
  assert.match(yautjaSvg, /width="64"/);
  assert.match(yautjaSvg, /polygon/);

  // 2. Weyland-Yutani Logo
  const wySvg = getWeylandYutaniLogo(60);
  assert.match(wySvg, /logo-weyland-yutani/);
  assert.match(wySvg, /BUILDING BETTER WORLDS/);
  assert.match(wySvg, /width="120"/);

  // 3. USCM Crest
  const uscmSvg = getUSCMLogo(80);
  assert.match(uscmSvg, /logo-uscm/);
  assert.match(uscmSvg, /USCM/);

  // 4. Engineer Astrolabe & Sacrificial Urn
  const engineerSvg = getEngineerLogo(72);
  assert.match(engineerSvg, /logo-engineer/);

  // 5. Xenomorph Hive Sigil
  const xenoSvg = getXenomorphHiveLogo(72);
  assert.match(xenoSvg, /logo-xenomorph/);

  // 6. OWLF & Stargazer Logos
  const owlfSvg = getOWLFLogo(64);
  assert.match(owlfSvg, /logo-owlf/);
  assert.match(owlfSvg, /OWLF/);

  const stargazerSvg = getStargazerLogo(64);
  assert.match(stargazerSvg, /logo-stargazer/);
  assert.match(stargazerSvg, /STARGAZER/);

  // 7. Crossover Logos (all 60)
  for (const crossover of MULTIVERSE_CROSSOVER_PREY) {
    const badgeSvg = getCrossoverLogo(crossover.id, 64);
    assert.match(badgeSvg, /<svg/);
    assert.match(badgeSvg, /crossover-logo/);
    assert.match(badgeSvg, /logo-(batman|joker|terminator|dredd|superman|witchblade|tarzan|magnus|grendel|the-mask|buffy|archie|darkness|robocop|kano|xfiles|anderson|worlds-finest|t-infinity|machiko|green-lantern|grifter|jla|bloodlines|wolverine|black-panther|spider-man|iron-man|captain-america|thor|mk-kombat|hellboy|conan|deadpool|judge-death|spawn|riddick|boba-fett|plissken|caryn|master-chief|doom-slayer|geralt|solid-snake|kratos|samus|ghost-rider|isaac-clarke|lobo|sarah-connor|blade|incubus|prime|vampirella|nemo|zealot|beyond|ascendant|predator-killer)/);
  }

  // 8. 12 Hunt Card Logos
  const huntIds = [
    'goliath', 'xeno_queen', 'bad_blood', 'predalien',
    'super_predator', 'feral_predator', 'wolf_cleaner', 'kalisk',
    'upgrade_predator', 'city_hunter', 'grid_alien', 'jungle_hunter_1987',
  ];
  for (const hId of huntIds) {
    const huntSvg = getHuntCardLogo(hId, 50);
    assert.match(huntSvg, /<svg/);
    assert.match(huntSvg, /canon-logo/);
  }

  // 9. Universal Faction Emblems
  const yEmblem = renderFactionEmblem('Yautja Prime', 40);
  assert.match(yEmblem, /logo-yautja/);
  const engEmblem = renderFactionEmblem('Ingénieurs', 40);
  assert.match(engEmblem, /logo-engineer/);
  const xenoEmblem = renderFactionEmblem('Ruche Xénomorphe', 40);
  assert.match(xenoEmblem, /logo-xenomorph/);
  const wyEmblem = renderFactionEmblem('Weyland-Yutani', 40);
  assert.match(wyEmblem, /logo-weyland-yutani/);
  const seegsonEmblem = renderFactionEmblem('Seegson Synthetics', 40);
  assert.match(seegsonEmblem, /logo-seegson/);
  const borgiaEmblem = renderFactionEmblem('Borgia Industries', 40);
  assert.match(borgiaEmblem, /logo-borgia/);

  // Fallback
  const fallbackSvg = getCrossoverLogo('unknown_entity', 50);
  assert.match(fallbackSvg, /logo-yautja/);
});


test('Système Monster Hunter : Mécanique des Couronnes de taille d\'or et affinités élémentaires', () => {
  const crowns = Object.keys(MONSTER_HUNTER_CROWNS);
  assert.deepEqual(crowns, ['GIANT_GOLD_CROWN', 'MINI_GOLD_CROWN', 'SILVER_CROWN', 'STANDARD']);

  // Couronne d'or géante
  const giant = MONSTER_HUNTER_CROWNS.GIANT_GOLD_CROWN;
  assert.equal(giant.sizeMultiplier, 1.30);
  assert.equal(giant.honorBonusMultiplier, 1.50);
  assert.equal(giant.icon, '👑');

  // Couronne d'or miniature
  const mini = MONSTER_HUNTER_CROWNS.MINI_GOLD_CROWN;
  assert.equal(mini.sizeMultiplier, 0.72);
  assert.equal(mini.honorBonusMultiplier, 1.35);

  // Fonction de tirage
  const rolledGiant = determineMonsterHunterCrown({}, 0.05);
  assert.equal(rolledGiant.id, 'GIANT_GOLD_CROWN');

  const rolledMini = determineMonsterHunterCrown({}, 0.12);
  assert.equal(rolledMini.id, 'MINI_GOLD_CROWN');

  const rolledSilver = determineMonsterHunterCrown({}, 0.25);
  assert.equal(rolledSilver.id, 'SILVER_CROWN');

  const rolledStandard = determineMonsterHunterCrown({}, 0.75);
  assert.equal(rolledStandard.id, 'STANDARD');

  // Affinités élémentaires
  const elements = Object.keys(ELEMENTAL_AFFINITIES);
  assert.deepEqual(elements, ['PLASMA', 'ACID', 'CRYO', 'FIRE', 'KINETIC']);
  for (const elKey of elements) {
    const el = ELEMENTAL_AFFINITIES[elKey];
    assert.ok(el.id);
    assert.ok(el.label);
    assert.ok(el.color);
    assert.ok(el.icon);
  }
});


test('Bio-Forge des Trophées : Les 20 recettes d\'artisanat yautja couvrent les 5 catégories avec fidélité 1:1', () => {
  const cats = Object.keys(TROPHY_CRAFT_CATEGORIES);
  assert.deepEqual(cats, ['SHIELDS', 'WEAPONS', 'MASKS', 'ARMOR', 'BANNERS']);
  assert.equal(TROPHY_CRAFT_RECIPES.length, 20, 'Exactement 20 recettes d\'artisanat disponibles');

  // Chaque catégorie a 4 recettes dédiées
  for (const catKey of cats) {
    const catRecipes = TROPHY_CRAFT_RECIPES.filter((r) => r.category === TROPHY_CRAFT_CATEGORIES[catKey].id);
    assert.equal(catRecipes.length, 4, `La catégorie ${catKey} doit comporter exactement 4 recettes`);
  }

  // Chaque recette possède des métadonnées exhaustives
  for (const recipe of TROPHY_CRAFT_RECIPES) {
    assert.ok(recipe.id, 'Id unique requis');
    assert.ok(recipe.name, 'Nom requis');
    assert.ok(recipe.originLore || recipe.originMedia, 'Média canonique d\'origine requis');
    assert.ok(recipe.requiredHonor > 0, 'Coût d\'honneur requis');
    assert.ok(recipe.requiredTrophy || (Array.isArray(recipe.requiredTrophies) && recipe.requiredTrophies.length > 0), 'Trophées requis présents');
    assert.ok(recipe.perkDescription || recipe.passiveBonus, 'Bonus passif explicite requis');
    assert.ok(recipe.stats && typeof recipe.stats === 'object', 'Objet de stats requis');
  }

  // Vérification de la présence des pièces emblématiques demandées
  const scarShield = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_shield_xeno_warrior');
  assert.ok(scarShield, 'Bouclier en dôme de guerrier xénomorphe (Scar & Lex Woods) présent');
  assert.equal(scarShield.stats.acidImmunity, 1, 'Immunité totale 100% acide conférée');

  const queenShield = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_shield_xeno_queen');
  assert.ok(queenShield, 'Égide de crête de Reine Xénomorphe présente');

  const xenoSpear = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_weapon_tail_blade_glaive');
  assert.ok(xenoSpear, 'Combi-lance à pointe caudale xénomorphe présente');

  const whip = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_weapon_cleaner_spinal_whip');
  assert.ok(whip, 'Fouet spinal xénomorphe de Wolf (AVPR) présent');

  const mrBlackMask = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_mask_xeno_jaw_berserker');
  assert.ok(mrBlackMask, 'Bio-masque à mâchoire xénomorphe (Mr. Black) présent');

  const queenCuirass = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_armor_queen_carapace_cuirass');
  assert.ok(queenCuirass, 'Cuirasse en chitine de Reine présente');

  const clanStandard = TROPHY_CRAFT_RECIPES.find((r) => r.id === 'craft_banner_xeno_queen_crest');
  assert.ok(clanStandard, 'Étendard de crête de Reine du clan présent');
});

test('Artisanat SVG 1:1 : Chaque pièce d\'artisanat génère un visuel vectoriel dédié sans dépendance externe', () => {
  for (const recipe of TROPHY_CRAFT_RECIPES) {
    const svg = getCraftsmanshipItemSvg(recipe.id, 48);
    assert.ok(svg.startsWith('<svg'), `SVG valide pour ${recipe.id}`);
    assert.ok(svg.includes('class="craft-logo'), `Classe CSS adéquate pour ${recipe.id}`);
    assert.ok(svg.includes('width="48"'), `Dimension respectée pour ${recipe.id}`);
  }

  // Fallback
  const fallback = getCraftsmanshipItemSvg('unknown_recipe_id', 32);
  assert.ok(fallback.includes('<svg'));
});

test('YautjaTrophyCraftsmanshipForgeSystem : Mécaniques de forge, équipement par catégorie et calcul des perks cumulatifs', () => {
  const forge = new YautjaTrophyCraftsmanshipForgeSystem();

  // État initial
  assert.equal(forge.isCrafted('craft_shield_xeno_warrior'), false);
  assert.equal(forge.isEquipped('craft_shield_xeno_warrior'), false);

  // Vérification de craft sans honneur suffisant (requis 1800)
  const checkLow = forge.canCraft('craft_shield_xeno_warrior', 500);
  assert.equal(checkLow.canCraft, false);
  assert.equal(checkLow.reason, 'insufficient_honor');
  assert.equal(checkLow.missingHonor, 1300);

  // Forger avec honneur suffisant
  const craftResult = forge.craftItem('craft_shield_xeno_warrior', 1800);
  assert.equal(craftResult.success, true);
  assert.equal(forge.isCrafted('craft_shield_xeno_warrior'), true);
  // Auto-équipé car premier de sa catégorie
  assert.equal(forge.isEquipped('craft_shield_xeno_warrior'), true);

  // Forger un second bouclier (Queen Crest requis 5000)
  forge.craftItem('craft_shield_xeno_queen', 5000);
  assert.equal(forge.isCrafted('craft_shield_xeno_queen'), true);
  // Le premier reste équipé jusqu'à équipement explicite
  assert.equal(forge.isEquipped('craft_shield_xeno_warrior'), true);
  assert.equal(forge.isEquipped('craft_shield_xeno_queen'), false);

  // Équiper le second bouclier (doit remplacer le premier dans le slot bouclier)
  const equipResult = forge.equipItem('craft_shield_xeno_queen');
  assert.equal(equipResult.success, true);
  assert.equal(forge.isEquipped('craft_shield_xeno_queen'), true);
  assert.equal(forge.isEquipped('craft_shield_xeno_warrior'), false);

  // Forger et équiper une arme (partBreakBonus: 50)
  forge.craftItem('craft_weapon_queen_spine_harpoon', 5400);
  assert.equal(forge.isEquipped('craft_weapon_queen_spine_harpoon'), true);

  // Forger et équiper un masque (honorGainBonus: 25)
  forge.craftItem('craft_mask_broken_tusk_rhynth', 4800);
  assert.equal(forge.isEquipped('craft_mask_broken_tusk_rhynth'), true);

  // Forger et équiper un totem (anomalyDamageBonus: 25)
  forge.craftItem('craft_totem_multiverse_challenger', 6000);
  assert.equal(forge.isEquipped('craft_totem_multiverse_challenger'), true);

  // Calcul des perks actifs
  const perks = forge.getActiveCraftedPerks();
  assert.equal(perks.equippedList.length, 4);
  assert.ok(perks.acidImmunityRatio >= 1.0, 'Immunité acide active');
  assert.ok(perks.partBreakBonusMultiplier >= 1.50, 'Bonus de rupture de parties actif (1.5x)');
  assert.ok(perks.crossoverDamageBonusMultiplier >= 1.25, 'Bonus dégâts crossover actif (1.25x)');
  assert.ok(perks.honorScoreBonusMultiplier >= 1.25, 'Bonus d\'honneur actif (1.25x)');

  // Déséquipement
  forge.unequipItem('craft_totem_multiverse_challenger');
  assert.equal(forge.isEquipped('craft_totem_multiverse_challenger'), false);
  const updatedPerks = forge.getActiveCraftedPerks();
  assert.equal(updatedPerks.equippedList.length, 3);
});
