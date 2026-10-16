import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  DRONE_STATES,
  DRONE_CONSTANTS,
  createFalconDroneState,
  launchFalconDrone,
  recallFalconDrone,
  updateFalconDrone,
} from '../src/gameplay/FalconDroneSystem.js';
import {
  HOLLOW_CONSTANTS,
  createMudHollowSector,
  addMudHollow,
  interactMudHollow,
  checkRootOverhangCover,
} from '../src/gameplay/MudHollowLevelSector.js';
import {
  createPenthouseAlleySector,
  inspectSkinnedVictim,
  climbFireEscape,
  updatePenthouseAlley,
} from '../src/gameplay/PenthouseAlleySector.js';
import {
  SACRIFICIAL_CONSTANTS,
  createSacrificialChamberSector,
  triggerEggPodHatch,
  updateSacrificialChamber,
} from '../src/gameplay/SacrificialChamberSector.js';
import {
  PHEROMONE_CONSTANTS,
  createPheromoneTrackingState,
  activatePheromoneMode,
  registerSlimeTrack,
  updatePheromoneTracking,
  getVisiblePheromoneTracks,
} from '../src/gameplay/PheromoneTrackingDirector.js';
import {
  HORN_COMMANDS,
  createHellHoundPackState,
  blowHuntingHorn,
  updateHoundPack,
} from '../src/gameplay/HellHoundHornSystem.js';
import {
  FIRE_CONSTANTS,
  createFirebrandState,
  igniteTorch,
  strikeWithFirebrand,
  updateFirebrandHazards,
} from '../src/gameplay/FirebrandHazardSystem.js';
import {
  DUEL_CONSTANTS,
  createClanHonorDuelState,
  initiateHonorDuel,
  verifyDuelHonorIntegrity,
  resolveDuelVictory,
} from '../src/gameplay/ClanHonorDuelDirector.js';
import {
  createTrophyArchiveSector,
  mountHarvestedTrophy,
  inspectTrophyPedestal,
  getArchiveCollectionSummary,
} from '../src/gameplay/TrophyArchiveVaultSector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Drone Faucon : Reconnaissance aérienne et balisage de proies (Lore 1:1 Predators 2010)', () => {
  const drone = createFalconDroneState();
  assert.equal(drone.state, DRONE_STATES.DOCKED);

  launchFalconDrone(drone, { x: 0, z: 0 }, audioSynth);
  assert.equal(drone.state, DRONE_STATES.SURVEYING);
  assert.equal(drone.altitude, DRONE_CONSTANTS.SURVEY_ALTITUDE);

  // Détection et balisage d'une proie au sol
  const humanPrey = { id: 'royce_commando', x: 12, z: 8 };
  updateFalconDrone(drone, 1.0, [humanPrey], audioSynth);
  assert.equal(drone.taggedTargets.length, 1);
  assert.equal(drone.taggedTargets[0].id, 'royce_commando');

  // Rappel du drone
  recallFalconDrone(drone);
  assert.equal(drone.state, DRONE_STATES.RETURNING);
  updateFalconDrone(drone, 3.0, [], audioSynth);
  assert.equal(drone.state, DRONE_STATES.DOCKED);
});

test('Chantier 2 — Creux de boue & Falaises Racines : Enduction thermique et couvert (Lore 1:1 Predator 1987)', () => {
  const mudSector = createMudHollowSector();
  assert.equal(mudSector.hollows.length, 2);

  const mockDutch = { x: -15, z: 20, isMudCoated: false };
  const coated = interactMudHollow(mudSector, mockDutch, audioSynth);
  assert.equal(coated, true);
  assert.equal(mockDutch.isMudCoated, true);
  assert.equal(mockDutch.apparentTemperatureCelsius, HOLLOW_CONSTANTS.COOLED_TEMP_CELSIUS);

  // Vérification de couvert aérien anti-pounce
  assert.equal(checkRootOverhangCover(mudSector, { x: -15, z: 20 }), true);
  assert.equal(checkRootOverhangCover(mudSector, { x: 50, z: 50 }), false);
});

test('Chantier 3 — Ruelle Los Angeles 1990 : Cadavres écorchés suspendus et escaliers (Lore 1:1 Predator 2)', () => {
  const alley = createPenthouseAlleySector();
  assert.equal(alley.skinnedVictims.length, 2);

  // Inspection forensique d'un cadavre écorché
  const autopsy = inspectSkinnedVictim(alley, 'victim_hanging_1', audioSynth);
  assert.ok(autopsy);
  assert.equal(autopsy.executionType, 'flayed_ritual_suspension');
  assert.equal(autopsy.honorRating, 70);

  // Escalier de secours vers le toit
  const topY = climbFireEscape(alley, 'ladder_alley_1', 0, 1.0);
  assert.equal(topY, 12.0);

  updatePenthouseAlley(alley, 1.0, audioSynth);
});

test('Chantier 4 — Chambre Sacrificielle : Éclosion d\'ovomorphs et assaut de Facehuggers (Lore 1:1 AVP 2004)', () => {
  const chamber = createSacrificialChamberSector();
  assert.equal(chamber.eggPods.length, 3);

  // Éclosion forcée par approche
  const host = { x: 0, z: 2.2, health: 100, isFacehuggerLatched: false };
  updateSacrificialChamber(chamber, 0.5, [host], audioSynth);

  assert.equal(chamber.eggPods[1].isHatched, true);
  assert.equal(chamber.activeFacehuggers.length, 1);

  // Traque et saut du Facehugger sur le visage
  updateSacrificialChamber(chamber, 0.5, [host], audioSynth);
  assert.equal(host.isFacehuggerLatched, true);
  assert.ok(host.health < 100);
});

test('Chantier 5 — Visière forensique UV : Traque des traînées de phéromones fluorescentes (Lore 1:1 AVP:R)', () => {
  const tracker = createPheromoneTrackingState();
  assert.equal(tracker.isPheromoneModeActive, false);

  activatePheromoneMode(tracker, audioSynth);
  assert.equal(tracker.isPheromoneModeActive, true);

  // Enregistrement d'une traînée de bave acide de Xénomorphe
  registerSlimeTrack(tracker, { x: 10, y: 0, z: 5 }, 'Xenomorph Drone');
  assert.equal(tracker.slimeTracks.length, 1);

  const visible = getVisiblePheromoneTracks(tracker, { x: 10, z: 5 });
  assert.equal(visible.length, 1);
  assert.equal(visible[0].species, 'Xenomorph Drone');

  // Décroissance de la luminescence
  updatePheromoneTracking(tracker, 10.0);
  assert.ok(tracker.slimeTracks[0].luminescence < 1.0);
});

test('Chantier 6 — Corne de Chasse du Tracker : Commandes et débusquage par la meute (Lore 1:1 Predators)', () => {
  const pack = createHellHoundPackState();
  assert.equal(pack.hounds.length, 3);

  // Ordre de débusquage au son de la corne
  const blown = blowHuntingHorn(pack, HORN_COMMANDS.FLUSH_COVER, audioSynth);
  assert.equal(blown, true);
  assert.equal(pack.activeCommand, HORN_COMMANDS.FLUSH_COVER);

  const preyInFoliage = { x: 0, z: 2.5, health: 100, isFlushedFromCover: false };
  updateHoundPack(pack, 1.0, [preyInFoliage], audioSynth);

  assert.equal(preyInFoliage.isFlushedFromCover, true);
  assert.ok(preyInFoliage.health < 100);
});

test('Chantier 7 — Tisons ardents & Barrières de feu thermiques (Lore 1:1 Predator 1987 / Prey 2022)', () => {
  const fireState = createFirebrandState();
  const torch = igniteTorch(fireState, { x: 5, z: 5 }, { lifetime: 30.0 }, audioSynth);

  assert.ok(torch);
  assert.equal(torch.temperatureCelsius, FIRE_CONSTANTS.THERMAL_BARRIER_TEMP);

  // Coup de tison enflammé
  const enemy = { health: 100, isOnFire: false };
  strikeWithFirebrand(torch, enemy, audioSynth);
  assert.equal(enemy.isOnFire, true);
  assert.ok(enemy.health < 100);

  // Dégâts de brûlure continus
  updateFirebrandHazards(fireState, 1.0, [enemy]);
  assert.ok(enemy.health < 55);
});

test('Chantier 8 — Cercle de Duel d\'Honneur & Interdiction Bad Blood (Lore 1:1 Predators / Predator 2)', () => {
  const duel = createClanHonorDuelState();
  const classicHunter = { id: 'classic_hunter', x: 0, z: 0, clanHonor: 100, cloakState: { isCloaked: true } };
  const berserkerBoss = { id: 'super_berserker', x: 2, z: 0, health: 500, isDead: false };

  // Début du duel
  initiateHonorDuel(duel, classicHunter, berserkerBoss, { x: 0, z: 0 }, audioSynth);
  assert.equal(duel.isDuelActive, true);
  assert.equal(classicHunter.cloakState.isCloaked, false); // Camouflage désactivé

  // Tentative de tir déloyale à distance -> violation Bad Blood
  const isActionHonorable = verifyDuelHonorIntegrity(duel, classicHunter, 'ranged_weapon');
  assert.equal(isActionHonorable, false);
  assert.equal(classicHunter.isBadBlood, true);

  // Victoire honorable
  resolveDuelVictory(duel, classicHunter, berserkerBoss);
  assert.equal(duel.isDuelActive, false);
  assert.ok(classicHunter.clanHonor >= 300);
  assert.equal(berserkerBoss.isDead, true);
});

test('Chantier 9 — Caveau des Trophées du Vaisseau Mère (Lore 1:1 Predator 2 / AVP)', () => {
  const vault = createTrophyArchiveSector();
  assert.equal(vault.pedestals.length, 3);

  // Inspection d'un socle historique
  const xenoPedestal = inspectTrophyPedestal(vault, 'pedestal_xeno_warrior');
  assert.equal(xenoPedestal.species, 'Xenomorph Warrior');
  assert.equal(xenoPedestal.material, 'Chitin Black');

  // Montage d'un trophée récolté récemment
  const newTrophy = { species: 'PredAlien Queen', honorRating: 150, weaponUsed: 'Combi-stick' };
  mountHarvestedTrophy(vault, newTrophy);
  assert.equal(vault.customHarvestedTrophies.length, 1);

  const summary = getArchiveCollectionSummary(vault);
  assert.equal(summary.totalTrophies, 3); // 2 déverrouillés + 1 custom
  assert.ok(summary.totalHonor >= 350);
  assert.equal(summary.vaultRank, 'Master Elder Arbiter');
});

test('Chantier 10 — Synthèse audio des 14 méthodes v126 et vérification Draw Calls Mothership', () => {
  const newAudioMethods = [
    'playDroneLaunch',
    'playDroneTelemetryPing',
    'playMudSquish',
    'playFoliageRustle',
    'playNeonSignBuzz',
    'playBloodDripEcho',
    'playEggPodHiss',
    'playFacehuggerSkitter',
    'playPheromoneScanHum',
    'playTrackerHornCall',
    'playHoundSnarlBurst',
    'playFirebrandIgnite',
    'playEmberWhoosh',
    'playHonorGongChime',
  ];

  newAudioMethods.forEach(method => {
    assert.equal(typeof audioSynth[method], 'function', `AudioSynth.${method} doit exister`);
  });

  // Vérification stricte du plafond de draw calls
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});
