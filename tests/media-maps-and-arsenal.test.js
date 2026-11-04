import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MEDIA_MAPS_CATALOG,
  NPC_ARSENAL_CATALOG,
  FRANCHISE_UNIVERSES,
  getMediaMapById,
  getMediaMapsByUniverse,
  getMediaMapsByBiome,
  getNpcWeaponById,
  getNpcWeaponsByUniverse,
  getNpcWeaponsByFaction,
} from '../src/data/MediaMapsAndArsenalCatalog.js';
import {
  ARMOR_PRESET_WEAPON_VARIANTS,
  getWeaponTechVariantById,
} from '../src/data/RuntimeEquipment.js';
import { getNpcWeaponProfile } from '../src/entities/HuntNPC.js';
import { SQUAD_ENCOUNTERS } from '../src/data/SquadEncountersCatalog.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { LORE_CODEX_ENTRIES, getLoreEntryUniverse } from '../src/data/LoreCodex.js';

test('le catalogue des univers contient exactement PREDATOR, ALIEN et AVP', () => {
  assert.equal(Object.keys(FRANCHISE_UNIVERSES).length, 3);
  assert.ok(FRANCHISE_UNIVERSES.PREDATOR);
  assert.ok(FRANCHISE_UNIVERSES.ALIEN);
  assert.ok(FRANCHISE_UNIVERSES.AVP);
  for (const u of Object.values(FRANCHISE_UNIVERSES)) {
    assert.ok(u.id);
    assert.ok(u.label);
    assert.ok(u.emblem);
    assert.ok(u.color);
    assert.ok(u.description);
  }
});

test('le catalogue des cartes contient les 30 cartes canoniques réparties sur les 3 univers', () => {
  assert.equal(MEDIA_MAPS_CATALOG.length, 30);
  assert.ok(Object.isFrozen(MEDIA_MAPS_CATALOG));

  const predatorMaps = getMediaMapsByUniverse('PREDATOR');
  const alienMaps = getMediaMapsByUniverse('ALIEN');
  const avpMaps = getMediaMapsByUniverse('AVP');

  assert.equal(predatorMaps.length, 10, '10 cartes pour l\'univers Predator');
  assert.equal(alienMaps.length, 12, '12 cartes pour l\'univers Alien');
  assert.equal(avpMaps.length, 8, '8 cartes pour l\'univers AVP');

  const mapIds = new Set();
  for (const map of MEDIA_MAPS_CATALOG) {
    assert.ok(map.id, 'ID de carte manquant');
    assert.ok(!mapIds.has(map.id), `ID de carte dupliqué : ${map.id}`);
    mapIds.add(map.id);

    assert.ok(map.name, `Nom manquant pour ${map.id}`);
    assert.ok(map.originMedia, `Média manquant pour ${map.id}`);
    assert.ok(['PREDATOR', 'ALIEN', 'AVP'].includes(map.universe), `Univers invalide pour ${map.id}`);
    assert.ok(map.releaseYear >= 1979 && map.releaseYear <= 2030, `Année invalide pour ${map.id}`);
    assert.ok(map.biomeId, `Biome manquant pour ${map.id}`);
    assert.ok(map.recommendedBiomeLabel, `Label biome manquant pour ${map.id}`);
    assert.ok(map.environmentSummary, `Résumé d'environnement manquant pour ${map.id}`);
    assert.ok(Array.isArray(map.tacticalSectors) && map.tacticalSectors.length >= 3, `Secteurs insuffisants pour ${map.id}`);
    assert.ok(Array.isArray(map.environmentalHazards) && map.environmentalHazards.length >= 2, `Dangers insuffisants pour ${map.id}`);
    assert.ok(Array.isArray(map.keyPreyIds) && map.keyPreyIds.length >= 1, `Proies clés manquantes pour ${map.id}`);

    // Vérification de la cohérence avec le catalogue des proies
    for (const preyId of map.keyPreyIds) {
      const prey = CANON_PREY_CATALOG.find((p) => p.id === preyId);
      assert.ok(prey, `La proie clé ${preyId} de la carte ${map.id} n'a pas été trouvée dans CANON_PREY_CATALOG`);
    }

    // Vérification de la cohérence avec le catalogue des escouades
    if (map.heroSquadId) {
      const squad = SQUAD_ENCOUNTERS.find((s) => s.id === map.heroSquadId);
      assert.ok(squad, `L'escouade héro ${map.heroSquadId} de la carte ${map.id} n'a pas été trouvée dans SQUAD_ENCOUNTERS`);
    }
  }

  // Vérification des helpers
  assert.equal(getMediaMapById('map_val_verde_1987').name, 'Val Verde — Jungle Équatoriale & Guérilla (1987)');
  assert.equal(getMediaMapById('map_inconnue'), null);
  assert.ok(getMediaMapsByBiome('jungle').length >= 3);
});

test('le catalogue d\'arsenal PNJ contient les 34 armes emblématiques de chaque média', () => {
  assert.equal(NPC_ARSENAL_CATALOG.length, 34);
  assert.ok(Object.isFrozen(NPC_ARSENAL_CATALOG));

  const predatorWeps = getNpcWeaponsByUniverse('PREDATOR');
  const alienWeps = getNpcWeaponsByUniverse('ALIEN');
  const avpWeps = getNpcWeaponsByUniverse('AVP');

  assert.equal(predatorWeps.length, 12, '12 armes pour l\'univers Predator');
  assert.equal(alienWeps.length, 15, '15 armes pour l\'univers Alien');
  assert.equal(avpWeps.length, 7, '7 armes pour l\'univers AVP');

  const wepIds = new Set();
  for (const wep of NPC_ARSENAL_CATALOG) {
    assert.ok(wep.id, 'ID d\'arme manquant');
    assert.ok(!wepIds.has(wep.id), `ID d\'arme dupliqué : ${wep.id}`);
    wepIds.add(wep.id);

    assert.ok(wep.name, `Nom d\'arme manquant pour ${wep.id}`);
    assert.ok(['PREDATOR', 'ALIEN', 'AVP'].includes(wep.universe), `Univers invalide pour ${wep.id}`);
    assert.ok(wep.faction, `Faction manquante pour ${wep.id}`);
    assert.ok(wep.originMedia, `Média manquant pour ${wep.id}`);
    assert.ok(wep.caliber, `Calibre manquant pour ${wep.id}`);
    assert.ok(wep.damageType, `Type de dégâts manquant pour ${wep.id}`);
    assert.ok(wep.effectiveRangeMeters > 0, `Portée invalide pour ${wep.id}`);
    assert.ok(wep.rateOfFire, `Cadence de tir manquante pour ${wep.id}`);
    assert.ok(wep.wieldedBy, `Porteur manquant pour ${wep.id}`);
    assert.ok(wep.yautjaCounterplay, `Contre-mesure manquante pour ${wep.id}`);
    assert.ok(wep.description, `Description manquante pour ${wep.id}`);
  }

  // Vérification des helpers
  assert.equal(getNpcWeaponById('npc_wep_m41a_pulse_rifle').name, 'Armat M41A Pulse Rifle');
  assert.equal(getNpcWeaponById('npc_wep_inconnue'), null);
  assert.ok(getNpcWeaponsByFaction('USCM').length >= 4);

  // Vérification de la fonction de profil d'arme dans HuntNPC
  assert.equal(getNpcWeaponProfile('colonial_marine_smartgunner'), 'npc_wep_m56_smartgun');
  assert.equal(getNpcWeaponProfile('jungle_gunner'), 'npc_wep_minigun_ol_painless');
  assert.equal(getNpcWeaponProfile('owlf_cryo_commando'), 'npc_wep_owlf_cryo_blaster');
  assert.equal(getNpcWeaponProfile('combat_synthetic'), 'npc_wep_seegson_stun_baton');
});

test('les 30 variantes d\'armes Yautja liées aux presets sont actives et immuables', () => {
  assert.equal(ARMOR_PRESET_WEAPON_VARIANTS.length, 30);
  assert.ok(Object.isFrozen(ARMOR_PRESET_WEAPON_VARIANTS));

  const variantIds = new Set();
  for (const variant of ARMOR_PRESET_WEAPON_VARIANTS) {
    assert.ok(variant.id);
    assert.ok(!variantIds.has(variant.id), `ID de variante dupliqué : ${variant.id}`);
    variantIds.add(variant.id);

    assert.ok(variant.armorPresetId);
    assert.ok(variant.baseWeaponId);
    assert.ok(variant.name);
    assert.ok(variant.behavior);
    assert.ok(variant.modifiers && Object.keys(variant.modifiers).length > 0);

    const resolved = getWeaponTechVariantById(variant.id);
    assert.equal(resolved, variant, `getWeaponTechVariantById doit résoudre ${variant.id}`);
  }

  // Vérification de variantes clés
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some((v) => v.id === 'variant_scarface_glaive'));
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some((v) => v.id === 'variant_alpha_bone_sickle'));
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some((v) => v.id === 'variant_cleopatra_solar_disc'));
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some((v) => v.id === 'variant_dek_kinetic_bow'));
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some((v) => v.id === 'variant_ahab_engineer_harpoon'));
  assert.ok(ARMOR_PRESET_WEAPON_VARIANTS.some((v) => v.id === 'variant_samurai_katana'));
});

test('le catalogue du Lore Codex contient les 42 dossiers répartis sur les 3 univers', () => {
  assert.equal(LORE_CODEX_ENTRIES.length, 42);
  assert.ok(Object.isFrozen(LORE_CODEX_ENTRIES));

  const byU = { PREDATOR: 0, ALIEN: 0, AVP: 0 };
  const ids = new Set();
  for (const entry of LORE_CODEX_ENTRIES) {
    assert.ok(entry.id);
    assert.ok(!ids.has(entry.id), `ID Lore dupliqué : ${entry.id}`);
    ids.add(entry.id);

    assert.ok(entry.title);
    assert.ok(entry.summary);
    assert.ok(entry.body);
    assert.ok(entry.sourceTier);
    assert.ok(Array.isArray(entry.sources) && entry.sources.length > 0);

    const universe = getLoreEntryUniverse(entry);
    assert.ok(['PREDATOR', 'ALIEN', 'AVP'].includes(universe));
    byU[universe]++;
  }

  assert.equal(byU.PREDATOR, 27);
  assert.equal(byU.ALIEN, 9);
  assert.equal(byU.AVP, 6);
});
