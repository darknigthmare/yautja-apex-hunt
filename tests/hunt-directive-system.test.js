import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HUNT_DIRECTIVES,
  createDirectiveProgress,
  getDirectiveProgressSummary,
  getDirectiveSchedule,
  getHuntDirective,
  recordDirectiveNpcDefeat,
  resolveDirectiveBiome,
  resolveDirectiveReward,
} from '../src/gameplay/HuntDirectiveSystem.js';

function completeDirective(id) {
  const directive = getHuntDirective(id);
  return directive.objectives.reduce(
    (progress, entry) => recordDirectiveNpcDefeat(progress, entry.npcType),
    createDirectiveProgress(id),
  );
}

test('les douze directives et leurs collections imbriquées sont immuables', () => {
  assert.deepEqual(Object.keys(HUNT_DIRECTIVES), [
    'standard_hunt',
    'jungle_fireteam',
    'blooding_rite',
    'killer_eras',
    'deathworld_protocol',
    'stargazer_breach',
    'urban_heatwave_hunt',
    'avp_pyramid_trial',
    'gunnison_cleanup',
    'game_preserve_escape',
    'hive_containment_failure',
    'val_verde_1987_incursion',
    'great_plains_1719_hunt',
    'game_preserve_trio_trial',
    'bouvetoya_surface_infiltration',
    'field_medicomp_triage_1990',
    'squad_dutch_val_verde_1987',
    'squad_uscm_hadleys_hope_1986',
    'squad_nostromo_crew_1979',
    'squad_seegson_working_joes_pack',
    'squad_comanche_war_party_1719',
    'squad_bouvetoya_expedition_2004',
    'squad_weyland_blackops_containment',
    'squad_p2_lapd_harrigan_1997',
    'squad_p2_cartel_king_willie_posse',
    'squad_predators_royce_survivors_2010',
    'squad_predators_super_clan_berserkers',
    'squad_the_predator_loonies_2018',
    'squad_the_predator_stargazer_strike',
    'squad_avpr_gunnison_citizens_2007',
    'squad_avpr_predalien_infestation_swarm',
    'squad_badlands_twin_outcasts',
    'squad_badlands_weyland_scavenger_brigade',
    'squad_killers_of_killers_trio',
    'squad_concrete_jungle_borgia_syndicate',
    'squad_avp_young_bloods_trio',
    'squad_betty_mercenaries_1997',
    'squad_prey_french_voyageurs_1719',
    'squad_alien3_fiorina_inmates_1992',
    'squad_alien3_weyland_dog_catchers',
    'squad_prometheus_expedition_2093',
    'squad_prometheus_engineer_awakening',
    'squad_covenant_colonists_2104',
    'squad_covenant_neomorph_david_pack',
    'squad_romulus_corbelan_scavengers_2142',
    'squad_romulus_renaissance_offspring_hive',
    'squad_phg_fireteam_voodoo_2025',
    'squad_phg_yautja_legends_circle',
    'squad_afe_endeavor_marines_2202',
    'squad_afe_katanga_pathogen_swarm',
    'squad_cold_war_spetsnaz_1991',
    'squad_enforcers_council_arbiters',
    'squad_dark_descent_cerberus_marines',
    'squad_charon_kleist_rogue_swarm',
    'squad_ryushi_chian_am_ranchers',
    'squad_yautja_prime_proving_circle',
    'squad_predator_hunters_veterans_2017',
    'squad_bad_blood_renegade_pack',
    'squad_colonial_marines_uss_sephora_2013',
    'squad_labyrinth_innominata_research_1993',
    'squad_avp2010_bg386_elite_claw',
    'squad_fire_and_stone_perses_crew_2014',
    'squad_lost_tribe_1997_greyback_elders',
    'squad_pine_barrens_cia_hunters_1993',
    'squad_alien_earth_prodigy_tactical_2120',
    'squad_usm_auriga_perez_science_2381',
    'squad_capcom_avp_sanjose_alliance_1994',
    'squad_lv742_kainde_amedha_shrine_2003',
    'squad_ny_detective_john_schaefer_1989',
    'squad_killer_clan_bad_blood_pack',
    'squad_out_of_shadows_marion_miners_2159',
    'squad_upp_space_commandos_2184',
    'squad_life_and_death_hasdrubal_marines_2219',
    'squad_avp_eternal_suwa_syndicate_1998',
    'squad_london_1896_edward_soames',
    'squad_south_china_sea_pirates_1998',
    'squad_genocide_grant_xeno_zip_2190',
    'squad_cold_forge_rb323_science_2179',
    'squad_bunda_war_machiko_clan_2194',
    'squad_primal_hunt_ancient_lv1201_2002',
    'squad_pirates_raphael_andolini_1718',
    'squad_alaska_primal_rangers_1997',
    'squad_defiance_zula_hendricks_fireteam',
    'squad_nightmare_asylum_spears_command',
    'squad_deadliest_caryn_big_mama_clan',
    'squad_three_world_war_machiko_uscm',
    'squad_xenogenesis_spearhead_mercenaries_1999',
    'squad_blood_feud_samurai_clan_1993',
    'squad_berserker_max_exosuit_team_1995',
    'squad_stronghold_ernst_jeri_syndicate',
    'squad_ryushi_vault_archaeologists_mercs',
    'squad_extinction_council_veterans_lv742',
    'squad_dark_river_amazon_patrol',
    'squad_whitechapel_constabulary_guard',
    'squad_pala_station_security_detail',
    'squad_hadleys_hope_colonial_militia',
    'squad_ataegina_spear_phalanx',
    'squad_iron_bear_uscm_battalion',
    'squad_kseries_cloned_xeno_pack',
    'squad_machiko_ryushi_retinue',
    'squad_pred_captive_preserve_guards',
    'squad_pred_yellowstone_rangers',
    'squad_alien_charon_rogue_marines',
    'squad_alien_harvest_cyber_ants',
    'squad_avp_eternal_tokyo_mercs',
    'squad_avp_perses_fire_stone_crew',
    'squad_pred_nakai_corpse_creek_scouts',
    'squad_pred_adolini_guinea_pirates',
    'squad_alien_renaissance_salvagers',
    'squad_alien_genocide_red_drones',
    'squad_avp_killer_clan_wardogs',
    'squad_avp_ryushi_chigusa_settlers',
    'squad_pred_spratly_pirates',
    'squad_pred_bolderji_mercs',
    'squad_alien_stronghold_sec_drones',
    'squad_alien_lv178_miners',
    'squad_avp_uss_ryushi_marines',
    'squad_avp_web_shipyard_riggers',
    'squad_pred_hunters_ii_afghan',
    'squad_pred_hunters_iii_guatemala',
    'squad_alien_nemesis_berserkers',
    'squad_alien_shan_shen_guards',
    'squad_avp_delacroix_samara',
    'squad_avp_three_world_killer_clan',
    'squad_pred_turnabout_rangers',
    'squad_pred_western_front_infantry',
    'squad_alien_mendel_tech_sec',
    'squad_alien_leto_darwin_cultists',
    'squad_avp_lv742_ravager_hive',
    'squad_avp_bunda_top_knot_clan',
    'squad_pred_south_china_sea_pirates',
    'squad_pred_civil_war_platoon',
    'squad_alien_sevastopol_working_joes',
    'squad_alien_defiance_strike_team',
    'squad_avp_pirate_booty_raiders',
    'squad_avp_tokyo_yakuza_clan',
    'squad_pred_fleener_creek_posse',
    'squad_pred_demons_gold_expedition',
    'squad_alien_female_war_strike_team',
    'squad_alien_nightmare_asylum_battalion',
    'squad_avp_requiem_wolf_cleanup',
    'squad_avp_xenogenesis_strike_cadre',
    'squad_pred_dark_ages_knights',
    'squad_pred_siberia_spetsnaz_alpha',
    'squad_alien_earth_war_salvage',
    'squad_alien_thaw_drilling_crew',
    'squad_avp_lv1201_weyland_iron_guard',
    'squad_avp_chokehold_containment_unit',
    'squad_pred_norwegian_deep_divers',
    'squad_pred_louisiana_bayou_trappers',
    'squad_alien_synsound_security_forces',
    'squad_alien_fast_track_maintenance_rig',
    'squad_avp_pantha_stalker_unit',
    'squad_avp_three_world_war_vanguard',
    'squad_pred_inca_warrior_guard',
    'squad_pred_yautja_prime_initiates',
    'squad_alien_pala_security_detail',
    'squad_alien_sacrifice_zealots',
    'squad_avp_endeavor_strike_platoon',
    'squad_avp_gunnison_swat_survivors',
  ]);
  assert.ok(Object.isFrozen(HUNT_DIRECTIVES));

  for (const directive of Object.values(HUNT_DIRECTIVES)) {
    assert.ok(Object.isFrozen(directive), directive.id);
    assert.ok(Object.isFrozen(directive.objectives), directive.id);
    assert.ok(Object.isFrozen(directive.schedule), directive.id);
    directive.objectives.forEach((entry) => assert.ok(Object.isFrozen(entry), entry.id));
    directive.schedule.forEach((entry) => assert.ok(Object.isFrozen(entry), entry.npcType));
  }

  assert.throws(() => {
    HUNT_DIRECTIVES.jungle_fireteam.rewardMultiplier = 99;
  }, TypeError);
  assert.equal(HUNT_DIRECTIVES.jungle_fireteam.rewardMultiplier, 1.3);
});

test('les identifiants inconnus retombent explicitement sur la chasse standard', () => {
  const fallback = getHuntDirective('directive_absente');
  assert.equal(fallback, HUNT_DIRECTIVES.standard_hunt);

  const progress = createDirectiveProgress('directive_absente');
  assert.equal(progress.directiveId, 'standard_hunt');
  assert.equal(progress.requestedDirectiveId, 'directive_absente');
  assert.equal(progress.fallbackUsed, true);
  assert.deepEqual(progress.objectiveCounts, {});
  assert.deepEqual(JSON.parse(JSON.stringify(progress)), progress);

  const summary = getDirectiveProgressSummary(progress);
  assert.equal(summary.isComplete, true);
  assert.equal(summary.completionRatio, 1);
});

test('le biome recommandé prime, tandis que la chasse standard conserve la demande', () => {
  assert.equal(resolveDirectiveBiome('jungle_fireteam', 'genna'), 'jungle');
  assert.equal(resolveDirectiveBiome('blooding_rite', 'jungle'), 'hive_lv426');
  assert.equal(resolveDirectiveBiome('killer_eras', 'jungle'), 'yautja_prime');
  assert.equal(resolveDirectiveBiome('deathworld_protocol', 'jungle'), 'genna_deathworld');
  assert.equal(resolveDirectiveBiome('urban_heatwave_hunt', 'jungle'), 'los_angeles_1997');
  assert.equal(resolveDirectiveBiome('game_preserve_escape', 'hive_lv426'), 'jungle');
  assert.equal(resolveDirectiveBiome('hive_containment_failure', 'jungle'), 'hive_lv426');
  assert.equal(resolveDirectiveBiome('avp_pyramid_trial', 'jungle'), 'bouvetoya_pyramid');
  assert.equal(resolveDirectiveBiome('standard_hunt', 'hive_lv426'), 'hive_lv426');
  assert.equal(resolveDirectiveBiome('inconnue', 'ryushi_desert'), 'ryushi_desert');
  assert.equal(resolveDirectiveBiome('standard_hunt', ''), null);
});

test('la progression est fonctionnelle, sérialisable et limitée aux objectifs', () => {
  const initial = createDirectiveProgress('jungle_fireteam');
  const ignored = recordDirectiveNpcDefeat(initial, 'xeno_drone');
  assert.notEqual(ignored, initial);
  assert.deepEqual(initial.objectiveCounts, {
    jungle_scout: 0,
    jungle_gunner: 0,
    jungle_trapper: 0,
  });
  assert.deepEqual(ignored.objectiveCounts, initial.objectiveCounts);

  const scoutDefeated = recordDirectiveNpcDefeat(ignored, 'jungle_scout');
  const duplicateScout = recordDirectiveNpcDefeat(scoutDefeated, 'jungle_scout');
  assert.equal(duplicateScout.objectiveCounts.jungle_scout, 1);
  assert.equal(getDirectiveProgressSummary(duplicateScout).completedObjectives, 1);

  const restored = JSON.parse(JSON.stringify(duplicateScout));
  const gunnerDefeated = recordDirectiveNpcDefeat(restored, 'jungle_gunner');
  const complete = recordDirectiveNpcDefeat(gunnerDefeated, 'jungle_trapper');
  const summary = getDirectiveProgressSummary(complete);
  assert.equal(summary.completedObjectives, 3);
  assert.equal(summary.remainingObjectives, 0);
  assert.equal(summary.completionRatio, 1);
  assert.equal(summary.isComplete, true);
});

test('le bonus de récompense ne s’applique qu’après tous les objectifs', () => {
  const incomplete = recordDirectiveNpcDefeat(
    createDirectiveProgress('jungle_fireteam'),
    'jungle_scout',
  );
  assert.equal(resolveDirectiveReward('jungle_fireteam', 1000, incomplete), 1000);
  assert.equal(resolveDirectiveReward('jungle_fireteam', 1000, completeDirective('jungle_fireteam')), 1300);
  assert.equal(resolveDirectiveReward('blooding_rite', 1000, completeDirective('blooding_rite')), 1300);
  assert.equal(resolveDirectiveReward('killer_eras', 1000, completeDirective('killer_eras')), 1400);
  assert.equal(resolveDirectiveReward('deathworld_protocol', 1000, completeDirective('deathworld_protocol')), 1350);
  assert.equal(resolveDirectiveReward('game_preserve_escape', 1000, completeDirective('game_preserve_escape')), 1300);
  assert.equal(resolveDirectiveReward('hive_containment_failure', 1000, completeDirective('hive_containment_failure')), 1400);
  assert.equal(resolveDirectiveReward('avp_pyramid_trial', 1000, completeDirective('avp_pyramid_trial')), 1500);
  assert.equal(resolveDirectiveReward('standard_hunt', 1000), 1000);
  assert.equal(resolveDirectiveReward('directive_absente', 1000), 1000);
  assert.equal(resolveDirectiveReward('standard_hunt', Number.NaN), 0);
});

test('chaque planning est trié, immuable et couvre exactement ses objectifs', () => {
  assert.deepEqual(getDirectiveSchedule('standard_hunt'), []);
  assert.equal(getDirectiveSchedule('directive_absente'), HUNT_DIRECTIVES.standard_hunt.schedule);

  for (const directive of Object.values(HUNT_DIRECTIVES).filter(({ objectives }) => objectives.length > 0)) {
    const schedule = getDirectiveSchedule(directive.id);
    assert.equal(schedule, directive.schedule);
    assert.ok(Object.isFrozen(schedule));
    assert.deepEqual(
      schedule.map(({ npcType }) => npcType),
      directive.objectives.map(({ npcType }) => npcType),
      directive.id,
    );
    schedule.forEach((entry, index) => {
      assert.equal(entry.kind, 'directive_wave');
      assert.equal(entry.type, 'directive_wave');
      assert.equal(entry.count, 1);
      assert.deepEqual(entry.enemyTypes, [entry.npcType]);
      assert.ok(Object.isFrozen(entry.enemyTypes), `${directive.id}:${entry.npcType}`);
      if (index > 0) assert.ok(entry.at > schedule[index - 1].at, directive.id);
    });
    assert.throws(() => schedule.push({ at: 999, kind: 'directive_wave' }), TypeError);
  }
});

test('les directives v1.9 rendent les cinq rôles orphelins accessibles avec une provenance honnête', () => {
  const preserve = HUNT_DIRECTIVES.game_preserve_escape;
  assert.equal(preserve.provenance, 'SCREEN_ADAPTATION');
  assert.equal(preserve.recommendedBiomeId, 'jungle');
  assert.deepEqual(
    preserve.objectives.map(({ npcType }) => npcType),
    ['hell_hound_alpha', 'river_ghost'],
  );
  assert.deepEqual(preserve.schedule.map(({ at }) => at), [11, 41]);

  const containment = HUNT_DIRECTIVES.hive_containment_failure;
  assert.equal(containment.provenance, 'CROSSOVER_SCREEN_ADAPTATION');
  assert.equal(containment.recommendedBiomeId, 'hive_lv426');
  assert.deepEqual(
    containment.objectives.map(({ npcType }) => npcType),
    ['colonial_marine_smartgunner', 'weyland_field_synthetic', 'xeno_facehugger'],
  );
  assert.deepEqual(containment.schedule.map(({ at }) => at), [9, 33, 57]);

  const accessibleTypes = new Set(Object.values(HUNT_DIRECTIVES)
    .flatMap(({ schedule }) => schedule.map(({ npcType }) => npcType)));
  for (const npcType of [...preserve.objectives, ...containment.objectives].map(({ npcType }) => npcType)) {
    assert.ok(accessibleTypes.has(npcType), npcType);
  }
});

test('l’épreuve v1.11 raccorde Bouvetøya, l’expédition et les castes xénomorphes', () => {
  const trial = HUNT_DIRECTIVES.avp_pyramid_trial;
  assert.equal(trial.provenance, 'AVP_SCREEN_ADAPTATION');
  assert.equal(trial.recommendedBiomeId, 'bouvetoya_pyramid');
  assert.equal(trial.rewardMultiplier, 1.5);
  assert.deepEqual(
    trial.objectives.map(({ npcType }) => npcType),
    ['weyland_expedition_guard', 'xeno_facehugger', 'xeno_warrior'],
  );
  assert.deepEqual(trial.schedule.map(({ at }) => at), [11, 36, 63]);
});
