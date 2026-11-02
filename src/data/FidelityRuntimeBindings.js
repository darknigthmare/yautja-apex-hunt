/** Data-only snapshots of the registered f3e375b renderers.
 * Cross-checked against live registries by fidelity-coverage.test.js.
 * These establish implementation bindings, never cinematic fidelity. */
const freezeRows = value => {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freezeRows(child);
    Object.freeze(value);
  }
  return value;
};

export const NPC_FIDELITY_BINDINGS = freezeRows([
  {
    "id": "xeno_drone",
    "name": "Drone xénomorphe",
    "builder": "makeXenoDrone",
    "texture": "/assets/textures/xeno-carapace.webp",
    "family": "xeno",
    "damageType": "corrosion",
    "behavior": "melee"
  },
  {
    "id": "hunting_hound",
    "name": "Molosse de chasse",
    "builder": "makeHuntingHound",
    "texture": "/assets/textures/hunting-hound-hide.webp",
    "family": "quadruped",
    "damageType": "laceration",
    "behavior": "melee"
  },
  {
    "id": "human_fireteam",
    "name": "Éclaireur de l'escouade humaine",
    "builder": "makeHumanFireteam",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "projectile"
  },
  {
    "id": "combat_synthetic",
    "name": "Synthétique de combat",
    "builder": "makeCombatSynthetic",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "energy",
    "behavior": "projectile"
  },
  {
    "id": "grizzly_territorial",
    "name": "Grizzly territorial",
    "builder": "makeGrizzlyTerritorial",
    "texture": "/assets/textures/hunting-hound-hide.webp",
    "family": "quadruped",
    "damageType": "impact",
    "behavior": "charge"
  },
  {
    "id": "thermal_trapper",
    "name": "Traqueur thermique de confinement",
    "builder": "makeThermalTrapper",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "disruption",
    "behavior": "projectile"
  },
  {
    "id": "genna_stalker",
    "name": "Traqueur organique de Genna",
    "builder": "makeGennaStalker",
    "texture": "/assets/textures/deathworld-alien-flora.webp",
    "family": "xeno",
    "damageType": "corrosion",
    "behavior": "melee"
  },
  {
    "id": "xeno_warrior",
    "name": "Guerrier xénomorphe",
    "builder": "makeXenoWarrior",
    "texture": "/assets/textures/xeno-carapace.webp",
    "family": "xeno",
    "damageType": "corrosion",
    "behavior": "melee"
  },
  {
    "id": "xeno_runner",
    "name": "Coureur xénomorphe",
    "builder": "makeXenoRunner",
    "texture": "/assets/textures/xeno-carapace.webp",
    "family": "quadruped",
    "damageType": "corrosion",
    "behavior": "melee"
  },
  {
    "id": "clan_sentry_drone",
    "name": "Drone sentinelle de clan",
    "builder": "makeClanSentryDrone",
    "texture": "/assets/textures/yautja-energy-lattice.webp",
    "family": "drone",
    "damageType": "energy",
    "behavior": "projectile"
  },
  {
    "id": "genna_grazer",
    "name": "Brouteur de Genna",
    "builder": "makeGennaGrazer",
    "texture": "/assets/textures/deathworld-alien-flora.webp",
    "family": "quadruped",
    "damageType": "impact",
    "behavior": "melee"
  },
  {
    "id": "jungle_scout",
    "name": "Éclaireur de jungle",
    "builder": "makeJungleScout",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "projectile"
  },
  {
    "id": "jungle_gunner",
    "name": "Mitrailleur de jungle",
    "builder": "makeJungleGunner",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "projectile"
  },
  {
    "id": "jungle_trapper",
    "name": "Piégeur de jungle",
    "builder": "makeJungleTrapper",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "disruption",
    "behavior": "projectile"
  },
  {
    "id": "era_viking_raider",
    "name": "Pillard de l’ère viking",
    "builder": "makeEraVikingRaider",
    "texture": "/assets/textures/hunting-hound-hide.webp",
    "family": "humanoid",
    "damageType": "impact",
    "behavior": "charge"
  },
  {
    "id": "era_feudal_duelist",
    "name": "Duelliste de l’ère féodale",
    "builder": "makeEraFeudalDuelist",
    "texture": "/assets/textures/yautja-leather-net.webp",
    "family": "humanoid",
    "damageType": "laceration",
    "behavior": "melee"
  },
  {
    "id": "era_wartime_pilot",
    "name": "Pilote de l’ère industrielle",
    "builder": "makeEraWartimePilot",
    "texture": "/assets/textures/ryushi-frontier-panels.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "projectile"
  },
  {
    "id": "genna_sporeback",
    "name": "Dos-à-spores de Genna",
    "builder": "makeGennaSporeback",
    "texture": "/assets/textures/genna-sporeback-carapace.webp",
    "family": "quadruped",
    "damageType": "corrosion",
    "behavior": "charge"
  },
  {
    "id": "hell_hound_alpha",
    "name": "Alpha Hell-Hound",
    "builder": "makeHellHoundAlpha",
    "texture": "/assets/textures/hunting-hound-hide.webp",
    "family": "quadruped",
    "damageType": "laceration",
    "behavior": "pack_leader"
  },
  {
    "id": "river_ghost",
    "name": "River Ghost évadé",
    "builder": "makeRiverGhost",
    "texture": "/assets/textures/deathworld-alien-flora.webp",
    "family": "xeno",
    "damageType": "laceration",
    "behavior": "evasive_prey"
  },
  {
    "id": "colonial_marine_smartgunner",
    "name": "Smartgunner colonial",
    "builder": "makeColonialMarineSmartgunner",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "suppressor"
  },
  {
    "id": "weyland_field_synthetic",
    "name": "Synthétique médical Weyland",
    "builder": "makeWeylandFieldSynthetic",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "energy",
    "behavior": "combat_support"
  },
  {
    "id": "xeno_facehugger",
    "name": "Facehugger embusqué",
    "builder": "makeXenoFacehugger",
    "texture": "/assets/textures/xeno-carapace.webp",
    "family": "facehugger",
    "damageType": "corrosion",
    "behavior": "ambush_pounce"
  },
  {
    "id": "stargazer_rifleman",
    "name": "Fusilier Stargazer",
    "builder": "makeStargazerRifleman",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "cover_burst"
  },
  {
    "id": "stargazer_net_trapper",
    "name": "Piégeur au filet Stargazer",
    "builder": "makeStargazerNetTrapper",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "disruption",
    "behavior": "net_reposition"
  },
  {
    "id": "modified_predator_hound",
    "name": "Molosse Predator modifié",
    "builder": "makeModifiedPredatorHound",
    "texture": "/assets/textures/hunting-hound-hide.webp",
    "family": "quadruped",
    "damageType": "laceration",
    "behavior": "pack_charger"
  },
  {
    "id": "urban_cartel_enforcer",
    "name": "Lieutenant armé du cartel",
    "builder": "makeUrbanCartelEnforcer",
    "texture": "/assets/textures/los-angeles-heatwave-urban.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "cover_burst"
  },
  {
    "id": "subway_armed_hunter",
    "name": "Chasseur armé du métro",
    "builder": "makeSubwayArmedHunter",
    "texture": "/assets/textures/los-angeles-heatwave-urban.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "suppressor"
  },
  {
    "id": "owlf_cryo_commando",
    "name": "Spécialiste cryogénique OWLF",
    "builder": "makeOwlfCryoCommando",
    "texture": "/assets/textures/los-angeles-heatwave-urban.webp",
    "family": "humanoid",
    "damageType": "disruption",
    "behavior": "net_reposition"
  },
  {
    "id": "weyland_expedition_guard",
    "name": "Garde de l’expédition Weyland",
    "builder": "makeWeylandExpeditionGuard",
    "texture": "/assets/textures/stargazer-tactical-composite.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "cover_burst"
  },
  {
    "id": "gunnison_national_guard",
    "name": "Fusilier de la Garde nationale",
    "builder": "makeGunnisonNationalGuard",
    "texture": "/assets/textures/gunnison-rain-urban.webp",
    "family": "humanoid",
    "damageType": "ballistic",
    "behavior": "cover_burst"
  }
]);

export const BOSS_FIDELITY_BINDINGS = freezeRows([
  {
    "id": "goliath",
    "bossType": "megafauna",
    "file": "src/MegafaunaBoss.js",
    "className": "MegafaunaBoss",
    "textures": [
      "/assets/textures/goliath-armored-hide.webp",
      "/assets/textures/trophy-bone.webp"
    ]
  },
  {
    "id": "xeno_queen",
    "bossType": "xenoQueen",
    "file": "src/entities/XenomorphQueen.js",
    "className": "XenomorphQueen",
    "textures": [
      "/assets/textures/xeno-carapace.webp",
      "/assets/textures/hive-biomechanical-membrane.webp"
    ]
  },
  {
    "id": "bad_blood",
    "bossType": "badBlood",
    "file": "src/entities/BadBloodRival.js",
    "className": "BadBloodRival",
    "textures": [
      "/assets/textures/yautja-skin-mottled.webp",
      "/assets/textures/biomask-etched-alloy.webp"
    ]
  },
  {
    "id": "predalien",
    "bossType": "predalien",
    "file": "src/entities/PredalienBoss.js",
    "className": "PredalienBoss",
    "textures": [
      "/assets/textures/xeno-carapace.webp",
      "/assets/textures/yautja-skin-mottled.webp"
    ]
  },
  {
    "id": "super_predator",
    "bossType": "superPredator",
    "file": "src/entities/SuperPredatorBoss.js",
    "className": "SuperPredatorBoss",
    "textures": [
      "/assets/textures/yautja-skin-mottled.webp",
      "/assets/textures/biomask-etched-alloy.webp"
    ]
  },
  {
    "id": "feral_predator",
    "bossType": "feralPredator",
    "file": "src/entities/FeralPredatorBoss.js",
    "className": "FeralPredatorBoss",
    "textures": [
      "/assets/textures/feral-bone-composite.webp",
      "/assets/textures/yautja-skin-mottled.webp"
    ]
  },
  {
    "id": "wolf_cleaner",
    "bossType": "wolfCleaner",
    "file": "src/entities/WolfCleanerBoss.js",
    "className": "WolfCleanerBoss",
    "textures": [
      "/assets/textures/wolf-cleaner-alloy.webp",
      "/assets/textures/yautja-skin-mottled.webp"
    ]
  },
  {
    "id": "kalisk",
    "bossType": "kalisk",
    "file": "src/entities/KaliskBoss.js",
    "className": "KaliskBoss",
    "textures": [
      "/assets/textures/kalisk-adaptive-hide.webp",
      "/assets/textures/yautja-energy-lattice.webp"
    ]
  },
  {
    "id": "upgrade_predator",
    "bossType": "upgradePredator",
    "file": "src/entities/UpgradePredatorBoss.js",
    "className": "UpgradePredatorBoss",
    "textures": []
  },
  {
    "id": "city_hunter",
    "bossType": "cityHunter",
    "file": "src/entities/CityHunterBoss.js",
    "className": "CityHunterBoss",
    "textures": [
      "/assets/textures/los-angeles-heatwave-urban.webp",
      "/assets/textures/biomask-etched-alloy.webp",
      "/assets/textures/yautja-skin-mottled.webp"
    ]
  },
  {
    "id": "grid_alien",
    "bossType": "gridAlien",
    "file": "src/entities/GridAlienBoss.js",
    "className": "GridAlienBoss",
    "textures": [
      "/assets/textures/xeno-carapace.webp",
      "/assets/textures/hive-biomechanical-membrane.webp"
    ]
  },
  {
    "id": "jungle_hunter_1987",
    "bossType": "jungleHunter",
    "file": "src/entities/JungleHunterBoss.js",
    "className": "JungleHunterBoss",
    "textures": []
  },
  {
    "id": "vydrach_prime",
    "bossType": "vydrach",
    "file": "src/entities/VydrachBoss.js",
    "className": "VydrachBoss",
    "textures": []
  },
  {
    "id": "rhynth_titan",
    "bossType": "rhynth",
    "file": "src/entities/RhynthBoss.js",
    "className": "RhynthBoss",
    "textures": []
  },
  {
    "id": "xeno_king",
    "bossType": "xenoKing",
    "file": "src/entities/XenomorphKingBoss.js",
    "className": "XenomorphKingBoss",
    "textures": []
  }
]);

export const DEFAULT_SHIP_FIDELITY_ZONES = freezeRows([
  {
    "id": "bridge-cockpit",
    "label": "Pont de commandement et cockpit stellaire",
    "bounds": {
      "minX": -25,
      "maxX": 25,
      "minZ": -84,
      "maxZ": -56
    }
  },
  {
    "id": "trophy-vault",
    "label": "Galerie cérémonielle des trophées",
    "bounds": {
      "minX": -33,
      "maxX": 33,
      "minZ": -38,
      "maxZ": -26
    }
  },
  {
    "id": "mission-nexus",
    "label": "Nexus des contrats de chasse",
    "bounds": {
      "minX": -32,
      "maxX": 32,
      "minZ": -24,
      "maxZ": 14
    }
  },
  {
    "id": "armory-forge",
    "label": "Armurerie et forge moléculaire",
    "bounds": {
      "minX": 36,
      "maxX": 64,
      "minZ": -4,
      "maxZ": 30
    }
  },
  {
    "id": "cryo-gallery",
    "label": "Galerie de cryostase des chasseurs",
    "bounds": {
      "minX": -64,
      "maxX": -36,
      "minZ": -40,
      "maxZ": -10
    }
  },
  {
    "id": "escape-pod-bay",
    "label": "Baie des pods d’évacuation et de traque",
    "bounds": {
      "minX": -64,
      "maxX": -36,
      "minZ": -4,
      "maxZ": 30
    }
  },
  {
    "id": "cleaner-medbay",
    "label": "Medbay et laboratoire Cleaner",
    "bounds": {
      "minX": 36,
      "maxX": 64,
      "minZ": -40,
      "maxZ": -10
    }
  },
  {
    "id": "vehicle-hangar",
    "label": "Grand hangar des appareils de chasse",
    "bounds": {
      "minX": -64,
      "maxX": -16,
      "minZ": 40,
      "maxZ": 80
    }
  },
  {
    "id": "engine-core",
    "label": "Noyau énergétique et moteurs",
    "bounds": {
      "minX": 16,
      "maxX": 64,
      "minZ": 40,
      "maxZ": 80
    }
  },
  {
    "id": "rear-airlock",
    "label": "Sas arrière pressurisé",
    "bounds": {
      "minX": -14,
      "maxX": 14,
      "minZ": 58,
      "maxZ": 86
    }
  },
  {
    "id": "spine-corridor",
    "label": "Épine dorsale et coursives de circulation",
    "bounds": {
      "minX": -9,
      "maxX": 9,
      "minZ": -82,
      "maxZ": 82
    }
  }
]);

export const DEFAULT_SHIP_FIDELITY_STATIONS = freezeRows([
  {
    "id": "mission-nexus",
    "label": "Nexus des contrats",
    "interactionType": "contracts"
  },
  {
    "id": "armory-forge",
    "label": "Forge et armurerie",
    "interactionType": "forge"
  },
  {
    "id": "trophy-vault",
    "label": "Galerie des trophées",
    "interactionType": "trophies"
  },
  {
    "id": "vehicle-hangar",
    "label": "Hangar des véhicules",
    "interactionType": "hangar"
  },
  {
    "id": "bridge-navigation",
    "label": "Navigation stellaire",
    "interactionType": "navigation"
  },
  {
    "id": "cryo-control",
    "label": "Contrôle de la cryostase",
    "interactionType": "cryo"
  },
  {
    "id": "escape-pod-control",
    "label": "Contrôle des pods de traque",
    "interactionType": "escape_pods"
  },
  {
    "id": "cleaner-lab-control",
    "label": "Baie médicale et laboratoire Cleaner",
    "interactionType": "cleaner_lab"
  },
  {
    "id": "engine-core-control",
    "label": "Noyau énergétique",
    "interactionType": "core"
  },
  {
    "id": "rear-airlock-control",
    "label": "Sas arrière",
    "interactionType": "airlock"
  },
  {
    "id": "contract-console-goliath",
    "label": "Goliath Xeno-Akumo",
    "interactionType": "mission_contract",
    "huntId": "goliath"
  },
  {
    "id": "contract-console-xeno_queen",
    "label": "Reine xénomorphe",
    "interactionType": "mission_contract",
    "huntId": "xeno_queen"
  },
  {
    "id": "contract-console-bad_blood",
    "label": "Bad Blood — prédateur renégat",
    "interactionType": "mission_contract",
    "huntId": "bad_blood"
  },
  {
    "id": "contract-console-predalien",
    "label": "Predalien — toit de Gunnison",
    "interactionType": "mission_contract",
    "huntId": "predalien"
  },
  {
    "id": "contract-console-super_predator",
    "label": "Berserker — Super Predator",
    "interactionType": "mission_contract",
    "huntId": "super_predator"
  },
  {
    "id": "contract-console-feral_predator",
    "label": "Feral Predator — Grande Plaine",
    "interactionType": "mission_contract",
    "huntId": "feral_predator"
  },
  {
    "id": "contract-console-wolf_cleaner",
    "label": "Wolf — opération Cleaner",
    "interactionType": "mission_contract",
    "huntId": "wolf_cleaner"
  },
  {
    "id": "contract-console-kalisk",
    "label": "Kalisk — apex de Genna",
    "interactionType": "mission_contract",
    "huntId": "kalisk"
  },
  {
    "id": "contract-console-upgrade_predator",
    "label": "Assassin Predator — brèche Stargazer",
    "interactionType": "mission_contract",
    "huntId": "upgrade_predator"
  },
  {
    "id": "contract-console-city_hunter",
    "label": "City Hunter — épreuve urbaine 1997",
    "interactionType": "mission_contract",
    "huntId": "city_hunter"
  },
  {
    "id": "contract-console-grid_alien",
    "label": "Grid Alien — épreuve de Bouvetøya",
    "interactionType": "mission_contract",
    "huntId": "grid_alien"
  },
  {
    "id": "contract-console-jungle_hunter_1987",
    "label": "Jungle Hunter — Val Verde 1987",
    "interactionType": "mission_contract",
    "huntId": "jungle_hunter_1987"
  },
  {
    "id": "contract-console-vydrach_prime",
    "label": "Vy'drach — Léviathan Céleste de Yautja Prime",
    "interactionType": "mission_contract",
    "huntId": "vydrach_prime"
  },
  {
    "id": "contract-console-rhynth_titan",
    "label": "Rhynth — Béhémoth Titanesque de Ryushi",
    "interactionType": "mission_contract",
    "huntId": "rhynth_titan"
  },
  {
    "id": "contract-console-xeno_king",
    "label": "Roi Xénomorphe — Rogue Titan Colossal",
    "interactionType": "mission_contract",
    "huntId": "xeno_king"
  }
]);
