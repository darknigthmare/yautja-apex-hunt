import { HUNT_DEFINITIONS } from './GameConfig.js';
import { LORE_SOURCES, CURRENT_HUNTS } from './LoreCodex.js';
import { MEDIA_COVERAGE_CATALOG } from './MediaCoverageCatalog.js';
import { YautjaContentCatalog, MASK_VARIANTS } from './YautjaContentCatalog.js';
import { YautjaSkinsDatabase } from './YautjaLoreDatabase.js';
import { PLAYABLE_WEAPONS, PLAYER_GADGETS, HUNTER_CLASSES, ARMOR_PRESET_MASK_IDS,
  DREAD_STYLES, ARMOR_FINISHES, WARPAINT_PATTERNS, WEAPON_TECH_VARIANTS,
  ARMOR_PRESET_WEAPON_VARIANTS } from './RuntimeEquipment.js';
import { CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY, PREY_FACTIONS } from './PreyTaxonomyAndCrossoverCatalog.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS } from './CrossoverUniverseEncounters.js';
import { getPreyReferenceEvidence, getPreySimulationModelReference } from './PreyReferenceMetadata.js';
import { TROPHY_CRAFT_RECIPES } from '../gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';
import { normalizeCraftRecipeReference } from '../gameplay/CraftRecipeReferences.js';
import { NPC_FIDELITY_BINDINGS, BOSS_FIDELITY_BINDINGS,
  DEFAULT_SHIP_FIDELITY_ZONES, DEFAULT_SHIP_FIDELITY_STATIONS } from './FidelityRuntimeBindings.js';

export const FIDELITY_STATUSES = Object.freeze({
  verified: 'Réplique vérifiée',
  declared_reference: 'Référence déclarée',
  original: 'Création originale',
  proxy: 'Modèle d’entraînement',
  missing: 'Implémentation absente',
});

export const FIDELITY_POLICY = Object.freeze({
  referencePriority: 'documented_source_for_each_catalogue_entry',
  scope: 'catalogue_sources_and_explicit_runtime_bindings',
  publicationVerification: 'not_independently_performed_by_this_inventory',
  replicaVerification: 'requires_primary_references_measurements_and_comparison_evidence',
  countsAre: 'namespaced_catalogue_records_not_distinct_models',
  sectorPrototypesArePlayableLevels: false,
});

const deepFreeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
};
const unique = values => [...new Set(values.filter(Boolean))];
const byId = entries => new Map(entries.map(entry => [entry.id, entry]));
const masks = byId(MASK_VARIANTS);
const bosses = byId(BOSS_FIDELITY_BINDINGS);
const npcBindings = byId(NPC_FIDELITY_BINDINGS);
const media = byId(MEDIA_COVERAGE_CATALOG);
const huntLore = byId(CURRENT_HUNTS);
const registeredSources = new Map([
  ...Object.entries(LORE_SOURCES).map(([id, source]) => [id, { id, title: source.title, url: source.url, tier: source.tier }]),
  ...MEDIA_COVERAGE_CATALOG.map(work => [work.id, { id: work.id, title: work.title, url: work.sourceUrl, tier: work.provenanceTier }]),
]);

// Alias the old novel key to its existing publisher locator, without inventing
// a primary locator for the vague Yautja Prime lore or Aliens: Rogue labels.
const sourceAliases = Object.freeze({ avpPrey1994: 'avpPreyOmnibus' });
const bossCatalogAliases = Object.freeze({
  boss_berserker_super_predator: 'super_predator', boss_feral_2022: 'feral_predator',
  boss_wolf_cleaner: 'wolf_cleaner', boss_kalisk_badlands: 'kalisk',
  boss_city_hunter_1990: 'city_hunter', boss_upgrade_predator_2018: 'upgrade_predator',
});
const npcCatalogIds = Object.freeze({
  xeno_drone: 'enemy_xenomorph_drone', hunting_hound: 'enemy_hunting_hound',
  human_fireteam: 'enemy_elite_commando', combat_synthetic: 'enemy_combat_synthetic_badlands',
  grizzly_territorial: 'enemy_grizzly', thermal_trapper: 'enemy_thermal_trap_team',
  genna_stalker: 'enemy_genna_hostile_fauna', xeno_warrior: 'enemy_xenomorph_warrior',
  xeno_runner: 'enemy_xenomorph_drone', clan_sentry_drone: null, genna_grazer: 'enemy_genna_hostile_fauna',
  jungle_scout: 'enemy_elite_commando', jungle_gunner: 'enemy_elite_commando', jungle_trapper: 'enemy_elite_commando',
  era_viking_raider: 'enemy_viking_raider', era_feudal_duelist: 'enemy_feudal_assassin',
  era_wartime_pilot: 'enemy_wartime_pilot', genna_sporeback: 'enemy_genna_hostile_fauna',
  hell_hound_alpha: 'enemy_hell_hound_alpha', river_ghost: 'enemy_river_ghost',
  colonial_marine_smartgunner: 'enemy_colonial_marine_smartgunner',
  weyland_field_synthetic: 'enemy_weyland_field_synthetic', xeno_facehugger: 'enemy_xeno_facehugger',
  stargazer_rifleman: 'enemy_stargazer_capture_team', stargazer_net_trapper: 'enemy_stargazer_capture_team',
  modified_predator_hound: 'enemy_modified_predator_hound_2018',
  urban_cartel_enforcer: 'enemy_urban_cartel_enforcer', subway_armed_hunter: 'enemy_subway_armed_hunter',
  owlf_cryo_commando: 'enemy_owlf_cryo_commando', weyland_expedition_guard: 'enemy_weyland_expedition_guard',
  gunnison_national_guard: 'enemy_gunnison_national_guard',
});
const enemyBossBindings = Object.freeze({
  enemy_super_predator: 'super_predator', enemy_xenomorph_queen: 'xeno_queen',
  enemy_predalien: 'predalien', enemy_kalisk: 'kalisk', enemy_goliath_akumo: 'goliath',
  enemy_upgrade_predator_2018: 'upgrade_predator',
});
const techItemBindings = Object.freeze({
  tech_biomask: 'biomask_vision', tech_cloak: 'optical_cloak', tech_wrist_blades: 'wristblades',
  tech_plasma_caster: 'plasmacaster_single', tech_medicomp: 'medicomp', tech_voice_mimic: 'voice_mimic',
  tech_smart_disc: 'smart_disc', tech_combistick: 'combi_stick', tech_net_launcher: 'netgun',
  tech_speargun: 'speargun', tech_wrist_rocket: 'wrist_rocket', tech_falcon_drone: 'scout_drone',
  tech_yautja_bow: 'yautja_bow', tech_wrist_shield: 'wrist_shield', tech_apex_decoy: 'apex_decoy',
  tech_shuriken_avp: 'shuriken', tech_feral_bolt_launcher: 'feral_bolt_launcher',
  tech_wolf_dual_plasma: 'wolf_dual_plasma', tech_wolf_segmented_whip: 'whip_thorns',
  tech_eye_of_ra_hg: 'eye_of_ra', tech_father_yautja_sword_hg: 'father_sword',
  tech_chopper_extended_wristblades: 'variant_chopper_extended_wristblades',
});
const gadgetSourceBindings = Object.freeze({
  wrist_shield: ['prey2022'], scout_drone: ['predators2010'], shuriken: ['avp2004', 'avpRequiem2007'],
  voice_mimic: ['predator1987', 'predator2'], biomask_vision: ['predator1987', 'predator2', 'prey2022'],
  optical_cloak: ['predator1987', 'predator2'], apex_decoy: [],
});
const originalNpcIds = new Set(['genna_stalker', 'genna_grazer', 'genna_sporeback', 'clan_sentry_drone', 'thermal_trapper']);
const characterAssets = ['/assets/models/hero-organic-body.glb', '/assets/textures/yautja-skin-albedo-v2.webp'];

function sourceRecord(entry = {}, { sources = entry.sources ?? [], title, original = false, scope = 'entry' } = {}) {
  const ids = unique(sources);
  const resolved = ids.flatMap(id => {
    const alias = sourceAliases[id];
    const value = registeredSources.get(alias ?? id);
    return value ? [{ ...value, ...(alias ? { declaredId: id, aliasOf: alias } : {}) }] : [];
  });
  const resolvedTiers = unique(resolved.map(source => source.tier));
  return {
    kind: original ? 'original_design' : 'declared_reference',
    declaredTitle: title ?? entry.originMedia ?? entry.origin ?? entry.continuity
      ?? (original ? 'Création originale Apex Hunt' : resolved.map(source => source.title).join(' / ') || ids.join(' / ') || entry.name || null),
    sourceTier: entry.sourceTier ?? entry.provenanceTier ?? (original ? 'ORIGINAL' : resolvedTiers.length === 1 ? resolvedTiers[0] : null),
    basisTier: entry.basisTier ?? null,
    scope, sourceIds: ids, locators: resolved,
    unresolvedSourceIds: ids.filter(id => !registeredSources.has(sourceAliases[id] ?? id)),
    publicationVerified: false,
    verificationScope: 'registered_locators_only_not_primary_work_inspection',
  };
}

function makeRecord(category, entry, { source = sourceRecord(entry), model = 'none', modelBindings = [],
  textures = [], textureStatus, mechanics = 'not_applicable', mechanicsBindings = [],
  runtimeStatus = entry.runtimeStatus ?? 'archive', reachable = null, replicaApplicable,
  dimensions = null, missing = [], details = {} } = {}) {
  const applies = replicaApplicable ?? source.kind !== 'original_design';
  const gaps = [...missing];
  if (applies && !source.locators.length) gaps.push('specific_reference_locator');
  if (source.unresolvedSourceIds.length) gaps.push('source_registry_key');
  if (applies && category !== 'media') {
    gaps.push('primary_reference_material', 'reference_comparison');
    if (model !== 'not_applicable') gaps.push('measured_reference_dimensions');
  }
  if (model === 'none' && category !== 'media') gaps.push('runtime_model');
  if (model === 'binding_not_verified') gaps.push('runtime_binding_to_verify');
  if (mechanics === 'archive_only') gaps.push('runtime_mechanics');
  if (model === 'training_proxy') {
    if (details.subjectModelMatched) {
      if (applies) gaps.push('subject_animation_reference_comparison', 'subject_texture_reference_comparison');
    } else gaps.push('dedicated_subject_model', 'subject_animation', 'subject_textures');
  }
  const status = model === 'training_proxy' ? 'proxy'
    : runtimeStatus === 'archive' && (model === 'none' || mechanics === 'archive_only') && category !== 'media' ? 'missing'
      : source.kind === 'original_design' ? 'original' : 'declared_reference';
  return deepFreeze({
    key: `${category}:${entry.id}`, id: entry.id, category, name: entry.name ?? entry.title ?? entry.label ?? entry.id,
    status, source,
    implementation: { runtimeStatus, reachable,
      model: { status: model, bindings: [...modelBindings] },
      textures: { status: textureStatus ?? (textures.length ? 'shared_authored_or_baked' : model === 'none' ? 'none' : 'procedural_or_unverified'), assets: [...textures] },
      mechanics: { status: mechanics, bindings: [...mechanicsBindings] } },
    dimensions, missing: unique(gaps), replicaApplicable: applies, fidelityVerified: false, ...details,
  });
}

function armorSource(entry) {
  const origin = entry.origin ?? '';
  const rules = [
    [/Hunting Grounds/, ['huntingGrounds']], [/Fire and Stone/, ['dh_fire_life_death']],
    [/Concrete Jungle/, ['game_concrete_jungle']], [/Comics et romans.*Aliens vs\. Predator/, ['avpOriginalComics', 'avpPreyOmnibus']],
    [/Lost Tribe|silhouette écran/, ['predator2', 'lostTribeDesigns']],
    [/Requiem/, ['avpRequiem2007']], [/Alien vs\. Predator \(2004\)/, ['avp2004']],
    [/Predator 2/, ['predator2']], [/Predators \(2010\)/, ['predators2010']],
    [/The Predator \(2018\)/, ['thePredator2018']], [/Killer of Killers/, ['killerOfKillers']],
    [/Badlands/, ['badlands2025']], [/Prey \(2022\)/, ['prey2022']], [/Predator \(1987\)/, ['predator1987']],
  ];
  const sources = entry.sources ?? rules.find(([pattern]) => pattern.test(origin))?.[1] ?? [];
  return sourceRecord(entry, { sources, title: origin, original: entry.sourceTier === 'ORIGINAL' && !/Hommage/.test(origin) });
}

function dossierRecord(category, entry, kind) {
  const reference = getPreyReferenceEvidence(entry);
  const binding = getPreySimulationModelReference(entry, { kind, factions: PREY_FACTIONS });
  const boss = bosses.get(binding?.huntType);
  const title = String(entry.originMedia ?? '').trim().toLocaleLowerCase('fr');
  const explicitSourceIds = binding?.subjectModelStatus === 'matching_subject_adaptation'
    ? huntLore.get(binding.huntType)?.sources ?? []
    : Object.entries(LORE_SOURCES).filter(([, source]) => source.title.toLocaleLowerCase('fr') === title).map(([id]) => id);
  return makeRecord(category, entry, {
    source: sourceRecord(entry, { sources: explicitSourceIds, title: reference.declaredTitle, original: reference.kind === 'original_design', scope: reference.scope }),
    model: 'training_proxy', modelBindings: boss ? [boss.file, binding.huntType] : [],
    textures: boss?.textures ?? [], mechanics: 'training_runtime',
    mechanicsBindings: ['src/gameplay/SimulationHuntRuntime.js', binding?.huntType].filter(Boolean),
    runtimeStatus: 'simulation', reachable: Boolean(boss),
    dimensions: { nominalMeters: entry.sizeMeters, axis: entry.dimensionAxis ?? 'unspecified', status: 'catalogue_estimate', citation: null },
    details: { trainingModel: binding?.huntType ?? null, trainingBiome: binding?.planetType ?? null,
      subjectModelMatched: binding?.subjectModelStatus === 'matching_subject_adaptation',
      subjectModelStatus: binding?.subjectModelStatus ?? 'generic_proxy',
      declaredReferencePreyId: entry.referencePreyId ?? null, sourceEvidence: reference },
  });
}

function buildCoreRecords() {
  const records = [];
  for (const hunt of Object.values(HUNT_DEFINITIONS)) {
    const reference = huntLore.get(hunt.id);
    const sourceIds = hunt.id === 'bad_blood' ? ['predatorBadBloodComics'] : reference?.sources ?? [];
    const original = hunt.id === 'goliath';
    const binding = bosses.get(hunt.id);
    records.push(makeRecord('contract', hunt, {
      source: sourceRecord(hunt, { sources: sourceIds, title: hunt.continuity, original }),
      model: binding ? 'dedicated_procedural' : 'none', modelBindings: binding ? [binding.file, binding.className] : [],
      textures: binding?.textures ?? [], mechanics: 'runtime_bound', mechanicsBindings: ['src/gameplay/BossFactory.js', hunt.id],
      runtimeStatus: 'playable', reachable: Boolean(binding),
      details: { bossType: hunt.bossType, sourceDiscrepancies: hunt.id === 'bad_blood' && reference?.sources?.includes('predators2010')
        ? ['LoreCodex also cites Predators (2010); GameConfig identifies the Bad Blood comic adaptation. The direct reference here retains the comic locator.'] : [] },
    }));
  }
  const enemyCatalog = byId(YautjaContentCatalog.enemies);
  for (const npc of NPC_FIDELITY_BINDINGS) {
    const entry = enemyCatalog.get(npcCatalogIds[npc.id]);
    records.push(makeRecord('npc', npc, {
      source: sourceRecord(entry, { original: originalNpcIds.has(npc.id) }),
      model: 'dedicated_procedural', modelBindings: ['src/entities/HuntNPC.js', npc.builder],
      textures: [npc.texture], mechanics: 'runtime_bound', mechanicsBindings: ['src/entities/HuntNPC.js', npc.behavior, npc.damageType],
      runtimeStatus: 'encounter', reachable: true, details: { catalogueReferenceId: entry?.id ?? null, family: npc.family },
    }));
  }
  for (const weapon of PLAYABLE_WEAPONS) records.push(makeRecord('weapon', weapon, {
    model: 'procedural_assembly', modelBindings: ['src/entities/YautjaPlayer.js', weapon.id],
    textures: ['/assets/textures/biomask-etched-alloy.webp'], mechanics: 'runtime_bound',
    mechanicsBindings: ['src/entities/YautjaPlayer.js', 'src/main.js', weapon.behavior],
    runtimeStatus: 'playable', reachable: true, details: { slot: weapon.slot },
  }));
  for (const gadget of PLAYER_GADGETS) records.push(makeRecord('gadget', gadget, {
    source: sourceRecord(gadget, { sources: gadgetSourceBindings[gadget.id], original: gadget.id === 'apex_decoy' }),
    model: ['voice_mimic', 'biomask_vision', 'optical_cloak'].includes(gadget.id) ? 'shader_audio_or_worn_equipment' : 'procedural_assembly',
    modelBindings: ['src/entities/YautjaPlayer.js', gadget.id], mechanics: 'runtime_bound',
    mechanicsBindings: ['src/entities/YautjaPlayer.js', gadget.behavior], runtimeStatus: 'playable', reachable: true,
  }));
  for (const profile of HUNTER_CLASSES) records.push(makeRecord('class', profile, {
    source: sourceRecord(profile, { original: true }), model: 'not_applicable', mechanics: 'runtime_bound',
    mechanicsBindings: ['src/entities/YautjaPlayer.js', 'applyHunterClass', profile.id], runtimeStatus: 'playable', reachable: true, replicaApplicable: false,
  }));
  for (const mask of MASK_VARIANTS) records.push(makeRecord('mask', mask, {
    model: 'parameterized_variant', modelBindings: ['src/entities/YautjaPlayer.js', mask.shape, mask.id],
    textures: ['/assets/textures/biomask-etched-alloy.webp'], mechanics: 'customization',
    mechanicsBindings: ['src/data/RuntimeEquipment.js', 'maskId'], runtimeStatus: 'customization', reachable: true,
    details: { gameplayDescriptionIsNotAUniqueImplementedPerk: true },
  }));
  for (const armor of YautjaSkinsDatabase) records.push(makeRecord('armor', armor, {
    source: armorSource(armor), model: 'parameterized_shared_rig',
    modelBindings: ['src/entities/YautjaPlayer.js', armor.id], textures: characterAssets,
    mechanics: 'customization', mechanicsBindings: ['src/data/RuntimeEquipment.js', 'armorPresetId'],
    runtimeStatus: 'customization', reachable: true,
    details: { sharedBodyAsset: characterAssets[0], resolvedDefaultMaskId: ARMOR_PRESET_MASK_IDS[armor.id] ?? null,
      dedicatedMaskReference: masks.get(ARMOR_PRESET_MASK_IDS[armor.id])?.name ?? null },
  }));
  const appearance = [...DREAD_STYLES, ...ARMOR_FINISHES, ...WARPAINT_PATTERNS,
    ...YautjaContentCatalog.dreadPalettes, ...YautjaContentCatalog.skinPalettes,
    ...YautjaContentCatalog.armorPalettes, ...YautjaContentCatalog.armorAccents];
  for (const entry of appearance) records.push(makeRecord('appearance_detail', entry, {
    source: sourceRecord(entry, { original: !entry.sources?.length || entry.sourceTier === 'ORIGINAL' }),
    model: 'parameterized_variant', modelBindings: ['src/entities/YautjaPlayer.js', entry.id],
    mechanics: 'customization', runtimeStatus: 'customization', reachable: true,
  }));
  for (const variant of [...WEAPON_TECH_VARIANTS, ...ARMOR_PRESET_WEAPON_VARIANTS]) records.push(makeRecord('weapon_variant', variant, {
    model: 'parameterized_variant', modelBindings: ['src/entities/YautjaPlayer.js', variant.id],
    mechanics: 'runtime_bound', mechanicsBindings: ['src/data/RuntimeEquipment.js', variant.baseWeaponId, variant.behavior],
    runtimeStatus: 'playable', reachable: true,
  }));
  for (const [catalogueCategory, category] of [['technology', 'technology'], ['vehicles', 'vehicle'], ['enemies', 'enemy_reference'],
    ['levelEvents', 'level_event'], ['huntBosses', 'boss_reference'], ['support', 'support']]) {
    for (const entry of YautjaContentCatalog[catalogueCategory]) {
      const contractId = category === 'boss_reference' ? bossCatalogAliases[entry.id] ?? (HUNT_DEFINITIONS[entry.id] ? entry.id : null)
        : category === 'enemy_reference' ? enemyBossBindings[entry.id] : null;
      const relatedNpcs = category === 'enemy_reference' ? NPC_FIDELITY_BINDINGS.filter(npc => npcCatalogIds[npc.id] === entry.id).map(npc => npc.id) : [];
      const relatedEquipment = category === 'technology' ? techItemBindings[entry.id] : null;
      const bound = contractId || relatedNpcs.length || relatedEquipment;
      const archive = entry.runtimeStatus === 'archive' && !bound;
      records.push(makeRecord(category, entry, {
        source: sourceRecord(entry, { original: entry.sourceTier === 'ORIGINAL' && !entry.sources?.length }),
        model: archive ? 'none' : bound ? 'shared_runtime_subject' : 'binding_not_verified',
        modelBindings: [contractId, ...relatedNpcs, relatedEquipment].filter(Boolean),
        mechanics: archive ? 'archive_only' : bound ? 'runtime_bound' : 'catalogue_declaration',
        runtimeStatus: bound && entry.runtimeStatus === 'archive' ? (contractId ? 'playable' : 'encounter') : entry.runtimeStatus,
        reachable: bound ? true : archive ? false : null,
        details: { declaredRuntimeStatus: entry.runtimeStatus, correctedRuntimeReference: Boolean(bound && entry.runtimeStatus === 'archive') },
      }));
    }
  }
  for (const recipe of TROPHY_CRAFT_RECIPES) {
    const reference = normalizeCraftRecipeReference(recipe);
    const physical = reference.materialAvailability === 'physical_hunt';
    records.push(makeRecord('craft_recipe', recipe, {
      source: sourceRecord(recipe, { title: recipe.originLore, original: true }),
      model: 'not_applicable', mechanics: physical ? 'physical_material_runtime' : 'archive_only',
      mechanicsBindings: ['src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js', ...reference.trophySourceIds],
      runtimeStatus: physical ? 'craftable' : 'archive', reachable: physical,
      missing: physical ? ['unique_worn_asset_not_established'] : ['physical_material_source'],
      details: { physicalSources: reference.trophySourceIds, requiredTrophyCount: reference.requiredTrophyCount,
        materialAvailability: reference.materialAvailability, availabilityReason: reference.availabilityReason,
        preexistingLegacyCraftsRemainCompatible: true },
    }));
  }
  for (const entry of MEDIA_COVERAGE_CATALOG) records.push(makeRecord('media', entry, {
    source: sourceRecord(entry, { sources: [entry.id], title: entry.title }),
    model: 'not_applicable', runtimeStatus: entry.gameCoverage.runtimeStatus, replicaApplicable: false,
    details: { declaredReleaseStatus: entry.status, medium: entry.medium },
  }));
  records.push(...CANON_PREY_CATALOG.map(entry => dossierRecord('prey_dossier', entry, 'prey')),
    ...MULTIVERSE_CROSSOVER_PREY.map(entry => dossierRecord('crossover_dossier', entry, 'crossover')),
    ...CROSSOVER_UNIVERSE_ENCOUNTERS.map(entry => dossierRecord('universe_encounter', entry, 'crossover')));
  return deepFreeze(records);
}

function shipRecords(ship) {
  const zones = ship?.getZones?.() ?? DEFAULT_SHIP_FIDELITY_ZONES;
  const stations = ship?.getStations?.() ?? DEFAULT_SHIP_FIDELITY_STATIONS;
  return [
    ...zones.map(zone => makeRecord('ship_compartment', { ...zone, name: zone.label }, {
      source: sourceRecord(zone, { title: 'Architecture originale du croiseur Apex Hunt', original: true }),
      model: 'authored_level_geometry', modelBindings: ['src/world/MothershipHub.js', zone.id],
      mechanics: 'runtime_bound', mechanicsBindings: ['src/world/MothershipHub.js', 'getZoneAt'],
      runtimeStatus: 'playable', reachable: true, replicaApplicable: false,
      details: { inventorySource: ship ? 'live_hub' : 'f3e375b_registry_snapshot' },
    })),
    ...stations.map(station => makeRecord('ship_station', { ...station, name: station.label }, {
      source: sourceRecord(station, { title: 'Services originaux du croiseur Apex Hunt', original: true }),
      model: 'world_interaction', modelBindings: ['src/world/MothershipHub.js', station.id],
      mechanics: 'runtime_bound', mechanicsBindings: ['src/main.js', 'attemptHubInteraction', station.interactionType],
      runtimeStatus: 'interactive', reachable: true, replicaApplicable: false,
      details: { interactionType: station.interactionType, huntId: station.huntId ?? null,
        inventorySource: ship ? 'live_hub' : 'f3e375b_registry_snapshot', serviceDepthVerified: false },
    })),
  ];
}

let cachedCore;
export function getFidelityStatusLabel(status) { return FIDELITY_STATUSES[status] ?? 'État non renseigné'; }

/**
 * A complete inventory, not a fidelity percentage. Pass the current hub so its
 * stations/compartments reflect the real layout rather than the baseline.
 * Multiple categories can refer to one model; keys are namespaced accordingly.
 */
export function getFidelityCoverage({ category = null, status = null, ship = null } = {}) {
  cachedCore ??= buildCoreRecords();
  const complete = [...cachedCore, ...shipRecords(ship)];
  const categories = Object.fromEntries([...new Set(complete.map(entry => entry.category))]
    .map(id => [id, complete.filter(entry => entry.category === id).length]));
  const entries = complete.filter(entry => (!category || entry.category === category) && (!status || entry.status === status));
  const countStatus = id => entries.filter(entry => entry.status === id).length;
  return deepFreeze({ policy: FIDELITY_POLICY, categories, entries,
    summary: { records: entries.length, totalRecords: complete.length,
      statuses: Object.fromEntries(Object.keys(FIDELITY_STATUSES).map(id => [id, countStatus(id)])),
      verifiedReplicas: entries.filter(entry => entry.fidelityVerified === true).length,
      sourcePublicationsIndependentlyVerified: entries.filter(entry => entry.source.publicationVerified === true).length,
      trainingDossiers: entries.filter(entry => entry.implementation.model.status === 'training_proxy').length,
      matchingSubjectTrainingDossiers: entries.filter(entry => entry.implementation.model.status === 'training_proxy' && entry.subjectModelMatched).length,
      genericTrainingDossiers: entries.filter(entry => entry.implementation.model.status === 'training_proxy' && !entry.subjectModelMatched).length,
      dedicatedRuntimeArchetypes: entries.filter(entry => ['npc', 'contract'].includes(entry.category)).length,
      physicalCraftRecipes: entries.filter(entry => entry.category === 'craft_recipe' && entry.materialAvailability === 'physical_hunt').length,
      archiveCraftRecipes: entries.filter(entry => entry.category === 'craft_recipe' && entry.materialAvailability === 'archive_only').length,
    } });
}

export function getFidelityEntry(id, { category = null, ship = null } = {}) {
  const matches = getFidelityCoverage({ category, ship }).entries.filter(entry => entry.id === id || entry.key === id);
  // A bare ID shared by a catalogue reference and a runtime subject is ambiguous.
  return matches.length === 1 ? matches[0] : null;
}
