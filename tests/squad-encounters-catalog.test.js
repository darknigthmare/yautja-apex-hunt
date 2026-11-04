import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SQUAD_ENCOUNTERS,
  SQUAD_CATEGORIES,
  getSquadById,
  getSquadsByBiome,
  filterSquadsByCategory,
} from '../src/data/SquadEncountersCatalog.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { HUNT_DIRECTIVES, getHuntDirective } from '../src/gameplay/HuntDirectiveSystem.js';
import { getSquadLogo } from '../src/ui/CanonLogosAndEmblems.js';
import { resolveSimulationSelection } from '../src/gameplay/SimulationHuntRuntime.js';

test('le catalogue des escouades contient les 40 groupes légendaires canoniques (héros & antagonistes)', () => {
  assert.equal(SQUAD_ENCOUNTERS.length, 52);
  assert.ok(Object.isFrozen(SQUAD_ENCOUNTERS));

  const expectedSquadIds = [
    'squad_dutch_val_verde_1987',
    'squad_uscm_hadleys_hope_1986',
    'squad_nostromo_crew_1979',
    'squad_betty_mercenaries_1997',
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
  ];

  assert.deepEqual(SQUAD_ENCOUNTERS.map((s) => s.id), expectedSquadIds);

  for (const squad of SQUAD_ENCOUNTERS) {
    assert.ok(squad.name, `Nom manquant pour ${squad.id}`);
    assert.ok(squad.shortName, `Nom court manquant pour ${squad.id}`);
    assert.ok(squad.originMedia, `Média d'origine manquant pour ${squad.id}`);
    assert.ok(squad.description, `Description manquante pour ${squad.id}`);
    assert.ok(squad.tactics, `Tactiques manquantes pour ${squad.id}`);
    assert.equal(squad.scale, 'MOYEN', `Le palier de gabarit d'un groupe humain doit être MOYEN (${squad.id})`);
    assert.ok(squad.totalMembers > 0, `Nombre de membres invalide pour ${squad.id}`);
    assert.equal(squad.members.length, squad.totalMembers, `Incohérence membres/totalMembers pour ${squad.id}`);
    assert.ok(squad.totalHonorReward > 0, `Récompense d'honneur invalide pour ${squad.id}`);
    assert.ok(squad.soloVariantId, `Variante solo manquante pour ${squad.id}`);
  }
});

test('chaque escouade possède une cible solo équivalente vérifiée dans le catalogue canonique', () => {
  for (const squad of SQUAD_ENCOUNTERS) {
    const solo = CANON_PREY_CATALOG.find((p) => p.id === squad.soloVariantId);
    assert.ok(
      solo,
      `La cible solo ${squad.soloVariantId} de l'escouade ${squad.id} n'a pas été trouvée dans CANON_PREY_CATALOG`,
    );
    assert.ok(solo.name, `Nom manquant pour la cible solo ${squad.soloVariantId}`);
    assert.ok(
      ['PETITE', 'MOYEN', 'GRANDE'].includes(solo.scale),
      `Le gabarit physique de ${solo.id} doit être valide (trouvé: ${solo.scale})`,
    );
    assert.ok(
      ['PETITE', 'MOYEN', 'GRANDE'].includes(solo.encounterTier ?? solo.declaredScale),
      `Le palier d'affrontement tactique de ${solo.id} doit être valide`,
    );
  }
});

test('chaque escouade correspond à une directive de chasse tactique structurée', () => {
  const squadsWithDirectives = SQUAD_ENCOUNTERS.map(s => s.id);

  for (const squadId of squadsWithDirectives) {
    const directive = getHuntDirective(squadId);
    assert.notEqual(directive, HUNT_DIRECTIVES.standard_hunt, `Directive orpheline pour ${squadId}`);
    assert.equal(directive.id, squadId);
    assert.ok(directive.objectives.length > 0, `Objectifs manquants pour ${squadId}`);
    assert.ok(directive.schedule.length > 0, `Planning manquant pour ${squadId}`);
    assert.ok(directive.rewardMultiplier >= 1.5, `Multiplicateur de récompense trop faible pour l'escouade ${squadId}`);
  }
});

test('chaque membre d’escouade possède un profil de combat complet', () => {
  for (const squad of SQUAD_ENCOUNTERS) {
    for (const member of squad.members) {
      assert.ok(member.id, `ID membre manquant dans ${squad.id}`);
      assert.ok(member.name, `Nom membre manquant dans ${squad.id}`);
      assert.ok(member.role, `Rôle membre manquant dans ${squad.id}`);
      assert.ok(member.weapon, `Arme membre manquante dans ${squad.id}`);
      assert.ok(member.hp > 0, `PV membre invalides (${member.name}) dans ${squad.id}`);
      assert.ok(member.armor >= 0, `Armure membre invalide (${member.name}) dans ${squad.id}`);
      assert.ok(member.trophy, `Trophée membre manquant (${member.name}) dans ${squad.id}`);
    }
  }
});

test('les fonctions d’interrogation et de filtrage d’escouade sont fonctionnelles', () => {
  const dutchSquad = getSquadById('squad_dutch_val_verde_1987');
  assert.ok(dutchSquad);
  assert.equal(dutchSquad.totalMembers, 7);

  const unknownSquad = getSquadById('squad_inexistant');
  assert.equal(unknownSquad, null);

  const jungleSquads = getSquadsByBiome('jungle');
  assert.ok(jungleSquads.length >= 2);
  assert.ok(jungleSquads.some((s) => s.id === 'squad_dutch_val_verde_1987'));
  assert.ok(jungleSquads.some((s) => s.id === 'squad_comanche_war_party_1719'));

  const commandos = filterSquadsByCategory(SQUAD_CATEGORIES.MILITARY_COMMANDO.id);
  assert.ok(commandos.length >= 1);
  assert.equal(commandos[0].id, 'squad_dutch_val_verde_1987');

  const allSquads = filterSquadsByCategory('all');
  assert.equal(allSquads.length, 52);
});

test('chaque escouade génère un insigne vectoriel SVG valide', () => {
  for (const squad of SQUAD_ENCOUNTERS) {
    const svg = getSquadLogo(squad.id, 48);
    assert.ok(svg.includes('<svg'), `SVG d'insigne manquant pour ${squad.id}`);
    assert.ok(svg.includes('</svg>'), `Fermeture SVG manquante pour ${squad.id}`);
    assert.ok(svg.includes('width="48"'), `Dimension incorrecte pour l'insigne ${squad.id}`);
  }
});

test('le runtime de simulation résout correctement les contextes d’escouade', () => {
  const squadContext = { kind: 'squad', id: 'squad_dutch_val_verde_1987' };
  const simulation = resolveSimulationSelection(squadContext);

  assert.ok(simulation);
  assert.equal(simulation.kind, 'squad');
  assert.equal(simulation.target.id, 'squad_dutch_val_verde_1987');
  assert.equal(simulation.planetType, 'jungle');
  assert.equal(simulation.directiveId, 'squad_dutch_val_verde_1987');
});
