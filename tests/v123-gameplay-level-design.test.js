import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  createThermalMudState,
  applyThermalMudCoating,
  updateThermalMudCoating,
} from '../src/gameplay/ThermalMudSystem.js';
import {
  CANOPY_CONSTANTS,
  createCanopyTraversalState,
  addCanopyBranchNode,
  findReachableCanopyNodes,
  initiatePredatoryLeap,
  updateCanopyTraversal,
} from '../src/gameplay/CanopyTraversalSystem.js';
import {
  PYRAMID_CONSTANTS,
  createPyramidLabyrinth,
  triggerLabyrinthShift,
  updatePyramidLabyrinth,
  isPathTraversable,
} from '../src/gameplay/PyramidLabyrinthDirector.js';
import {
  HAZARD_CONSTANTS,
  createEnvironmentalHazardsState,
  spawnAcidPool,
  neutralizeAcidPool,
  addSteamVent,
  updateEnvironmentalHazards,
} from '../src/gameplay/EnvironmentalHazardsDirector.js';
import {
  EXECUTION_STAGES,
  createTrophyExecutionState,
  canExecutePrey,
  startTrophyExecution,
  updateTrophyExecution,
  cancelTrophyExecution,
} from '../src/gameplay/TrophyExecutionSystem.js';
import {
  SLAUGHTERHOUSE_CONSTANTS,
  createSlaughterhouseSector,
  addHangingCarcass,
  perturbCarcass,
  triggerNitrogenRelease,
  updateSlaughterhouseSector,
  checkCarcassOcclusion,
} from '../src/gameplay/SlaughterhouseLevelSector.js';
import {
  SURFACE_TYPES,
  createClimbingState,
  attachToClimbableSurface,
  climbVertical,
  dismountClimb,
  updateClimbingState,
} from '../src/gameplay/VerticalClimbingSystem.js';
import {
  WEATHER_PRESETS,
  createEnvironmentalWeatherState,
  setWeatherType,
  triggerLightningStrike,
  updateEnvironmentalWeather,
} from '../src/gameplay/EnvironmentalWeatherSystem.js';
import {
  GUNNISON_ZONES,
  createGunnisonLevelState,
  triggerTownPowerBlackout,
  activateHospitalHelipadZone,
  updateGunnisonDirector,
} from '../src/gameplay/GunnisonLevelDirector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Camouflage thermique à la boue fluviale (Lore 1:1 Dutch 1987 / Prey 2022)', () => {
  const mudState = createThermalMudState();
  assert.equal(mudState.isCoated, false);
  assert.equal(mudState.thermalInvisibilityActive, false);

  const mockPlayer = {
    apparentTemperatureCelsius: 37.0,
    isMudCoated: false,
  };

  const applied = applyThermalMudCoating(mudState, mockPlayer, audioSynth);
  assert.equal(applied, true);
  assert.equal(mudState.isCoated, true);
  assert.equal(mockPlayer.isMudCoated, true);
  assert.equal(mockPlayer.apparentTemperatureCelsius, 14.2);

  // Écoulement normal du temps
  updateThermalMudCoating(mudState, 5.0, mockPlayer, { isInWater: false });
  assert.equal(mudState.isCoated, true);
  assert.ok(mudState.remainingDuration < 22.0);

  // Rincage rapide par immersion dans l'eau
  updateThermalMudCoating(mudState, 10.0, mockPlayer, { isInWater: true });
  assert.equal(mudState.isCoated, false);
  assert.equal(mockPlayer.isMudCoated, false);
  assert.equal(mockPlayer.apparentTemperatureCelsius, 37.0);
});

test('Chantier 2 — Réseau de navigation en canopée & Sauts prédateurs de 18m (Lore 1:1)', () => {
  const canopyNetwork = { branches: [] };
  const b1 = addCanopyBranchNode(canopyNetwork, { x: 0, y: 12, z: 0 });
  const b2 = addCanopyBranchNode(canopyNetwork, { x: 12, y: 14, z: 0 });
  const bFar = addCanopyBranchNode(canopyNetwork, { x: 50, y: 15, z: 0 });

  assert.equal(canopyNetwork.branches.length, 3);

  const reachable = findReachableCanopyNodes(canopyNetwork, { x: 0, y: 12, z: 0 });
  assert.equal(reachable.length, 1);
  assert.equal(reachable[0].id, b2.id);

  const state = createCanopyTraversalState();
  const player = { x: 0, y: 12, z: 0, isPerched: false };

  // Saut trop loin refusé
  const leapTooFar = initiatePredatoryLeap(state, bFar, player, audioSynth);
  assert.equal(leapTooFar, false);

  // Saut valide vers b2
  const leapValid = initiatePredatoryLeap(state, b2, player, audioSynth);
  assert.equal(leapValid, true);
  assert.equal(state.isLeaping, true);

  // En vol (milieu de saut)
  updateCanopyTraversal(state, state.leapDuration * 0.5, player, audioSynth);
  assert.equal(state.isLeaping, true);
  assert.ok(player.y > 12);

  // Atterrissage et perchoir
  updateCanopyTraversal(state, state.leapDuration * 0.6, player, audioSynth);
  assert.equal(state.isLeaping, false);
  assert.equal(state.isPerched, true);
  assert.equal(player.isPerched, true);
  assert.equal(player.canopyStealthBonus, CANOPY_CONSTANTS.AMBUSH_STEALTH_BONUS);
});

test('Chantier 3 — Directeur du labyrinthe mégalithique de l\'Île Bouvet (Lore 1:1 AVP 2004)', () => {
  const labyrinth = createPyramidLabyrinth({ shiftInterval: 600.0 });
  assert.equal(labyrinth.shiftInterval, 600.0);
  assert.equal(labyrinth.currentConfigIndex, 0);

  // En config 0 : sacrificial_chamber -> hieroglyph_vestibule est ouvert
  assert.equal(isPathTraversable(labyrinth, 'sacrificial_chamber', 'hieroglyph_vestibule'), true);
  assert.equal(isPathTraversable(labyrinth, 'sacrificial_chamber', 'sarcophagus_vault'), false);

  // Déclenchement de la rotation des blocs mégalithiques
  const shifting = triggerLabyrinthShift(labyrinth, audioSynth);
  assert.equal(shifting, true);
  assert.equal(labyrinth.isShifting, true);

  // Durant le shift, tous les passages sont scellés par sécurité
  assert.equal(isPathTraversable(labyrinth, 'sacrificial_chamber', 'hieroglyph_vestibule'), false);

  // Fin de la transition
  updatePyramidLabyrinth(labyrinth, 13.0, audioSynth);
  assert.equal(labyrinth.isShifting, false);
  assert.equal(labyrinth.currentConfigIndex, 1);
  assert.equal(labyrinth.totalShiftsCount, 1);
});

test('Chantier 4 — Dangers environnementaux : Acide de Xénomorphe & Évents de vapeur (Lore 1:1)', () => {
  const hazards = createEnvironmentalHazardsState();

  // 1. Flaque d'acide
  const pool = spawnAcidPool(hazards, { x: 5, y: 0, z: 5 }, { radius: 2.0 }, audioSynth);
  assert.ok(pool);
  assert.equal(hazards.acidPools.length, 1);

  const victim = { x: 5, z: 5, health: 100 };
  updateEnvironmentalHazards(hazards, 1.0, victim, audioSynth);
  assert.ok(victim.health < 100, 'L acide a infligé des dégâts corrosifs');

  // Neutralisation par le solvant bleu Yautja
  const neutralized = neutralizeAcidPool(hazards, pool.id, audioSynth);
  assert.equal(neutralized, true);
  updateEnvironmentalHazards(hazards, 0.1, victim, audioSynth);
  assert.equal(hazards.acidPools.length, 0);

  // 2. Évent de vapeur aveuglant
  addSteamVent(hazards, { x: 0, y: 0, z: 0, burstInterval: 2.0 });
  updateEnvironmentalHazards(hazards, 2.5, { x: 0.5, y: 0, z: 0.5 }, audioSynth);
  assert.ok(hazards.activeThermalDistortions > 0.5);
});

test('Chantier 5 — Exécution rituelle au corps-à-corps & Trophée vertébral (Lore 1:1 Spine Rip)', () => {
  const execState = createTrophyExecutionState();

  // Proie non éligible (civile désarmée ou enceinte)
  const unarmedCivilian = { isUnarmedCivilian: true, health: 50 };
  assert.equal(canExecutePrey(unarmedCivilian), false);
  assert.equal(startTrophyExecution(execState, unarmedCivilian, audioSynth), false);

  // Proie éligible chancelante
  const warriorPrey = {
    species: 'Human Elite Mercenary',
    health: 20,
    maxHealth: 100,
    isStaggered: true,
    honorRating: 95,
  };
  assert.equal(canExecutePrey(warriorPrey), true);

  // Démarrage de l'exécution
  startTrophyExecution(execState, warriorPrey, audioSynth);
  assert.equal(execState.stage, EXECUTION_STAGES.THROAT_GRASP);

  // Étape 1 : Throat Grasp -> Wristblade Sever
  updateTrophyExecution(execState, 0.9, audioSynth);
  assert.equal(execState.stage, EXECUTION_STAGES.WRISTBLADE_SEVER);

  // Étape 2 : Wristblade Sever -> Spine Rip
  updateTrophyExecution(execState, 1.1, audioSynth);
  assert.equal(execState.stage, EXECUTION_STAGES.SPINE_RIP);

  // Étape 3 : Spine Rip finalisée -> Trophy Secured
  updateTrophyExecution(execState, 1.6, audioSynth);
  assert.equal(execState.stage, EXECUTION_STAGES.TROPHY_SECURED);
  assert.equal(execState.harvestedTrophiesCount, 1);
  assert.equal(warriorPrey.health, 0);
});

test('Chantier 6 — Secteur Abattoir de Los Angeles 1990 & Piège cryogénique OWLF (Lore 1:1)', () => {
  const slaughterhouse = createSlaughterhouseSector();
  const carcass = addHangingCarcass(slaughterhouse, { x: 10, y: 2.2, z: 10 });
  assert.ok(carcass);
  assert.equal(slaughterhouse.carcasses.length, 1);

  perturbCarcass(carcass, 2.5, audioSynth);
  assert.ok(carcass.swingVelocity > 0);

  // Occlusion thermique et physique par carcasse
  const occluded = checkCarcassOcclusion(slaughterhouse, { x: 9.8, z: 9.8 }, { x: 10.2, z: 10.2 });
  assert.equal(occluded, true);

  // Déclenchement du piège à azote liquide
  const mockYautja = {
    cloakState: { isCloaked: true, circuitFrozen: false },
    apparentTemperatureCelsius: 37.0,
  };
  const released = triggerNitrogenRelease(slaughterhouse, audioSynth);
  assert.equal(released, true);
  assert.equal(slaughterhouse.nitrogenTrapsActive, true);

  updateSlaughterhouseSector(slaughterhouse, 1.0, mockYautja, audioSynth);
  assert.equal(mockYautja.cloakState.isCloaked, false);
  assert.equal(mockYautja.cloakState.circuitFrozen, true);
  assert.equal(mockYautja.apparentTemperatureCelsius, SLAUGHTERHOUSE_CONSTANTS.NITROGEN_TEMPERATURE);
});

test('Chantier 7 — Escalade verticale et ancrage par griffes de gantelet (Lore 1:1)', () => {
  const climbState = createClimbingState();
  assert.equal(climbState.isClimbing, false);

  const giantTree = { height: 30.0, surfaceType: SURFACE_TYPES.WOOD_BARK };
  const mockPlayer = { y: 0, isClimbing: false };

  attachToClimbableSurface(climbState, giantTree, mockPlayer, audioSynth);
  assert.equal(climbState.isClimbing, true);
  assert.equal(climbState.isAnchored, true);

  // Escalade vers le haut
  climbVertical(climbState, 1.0, 2.0, mockPlayer, audioSynth);
  assert.ok(climbState.climbHeight > 0);
  assert.equal(mockPlayer.y, climbState.climbHeight);
  assert.ok(climbState.stamina < 100);

  // Descente et désancrage
  dismountClimb(climbState, mockPlayer);
  assert.equal(climbState.isClimbing, false);
  assert.equal(mockPlayer.isClimbing, false);

  // Régénération d'endurance au sol
  updateClimbingState(climbState, 2.0);
  assert.ok(climbState.stamina > 90);
});

test('Chantier 8 — Météo de mousson tropicale & Scintillement du camouflage (Lore 1:1)', () => {
  const weather = createEnvironmentalWeatherState('CLEAR');
  assert.equal(weather.rainIntensity, 0.0);

  setWeatherType(weather, 'THUNDERSTORM');
  assert.equal(weather.rainIntensity, 1.0);
  assert.equal(weather.thunderChance, 0.45);

  const cloakedPlayer = {
    cloakState: { isCloaked: true, flicker: 0 },
  };

  updateEnvironmentalWeather(weather, 0.5, cloakedPlayer, audioSynth);
  assert.equal(weather.isCloakShortCircuiting, true);
  assert.ok(weather.cloakFlickerIntensity > 0.5);
  assert.ok(cloakedPlayer.cloakState.flicker > 0.5);

  // Impact de foudre
  triggerLightningStrike(weather, audioSynth);
  assert.equal(weather.lightningFlashIntensity, 1.0);
});

test('Chantier 9 — Directeur du niveau Gunnison : Crypte, Blackout et Évacuation Héliport (Lore 1:1 AVP:R)', () => {
  const gunnison = createGunnisonLevelState();
  assert.equal(gunnison.activeZone, GUNNISON_ZONES.CEMETERY_CRYPTS.id);
  assert.equal(gunnison.powerGridOnline, true);

  // Blackout de la ville
  triggerTownPowerBlackout(gunnison);
  assert.equal(gunnison.powerGridOnline, false);
  assert.equal(gunnison.activeZone, GUNNISON_ZONES.DOWNTOWN_BLACKOUT.id);

  // Activation de la zone d'évacuation sur le toit de l'hôpital
  activateHospitalHelipadZone(gunnison);
  assert.equal(gunnison.activeZone, GUNNISON_ZONES.HOSPITAL_ROOFTOP.id);
  assert.equal(gunnison.evacuationActive, true);

  // Décompte de survie et alerte de frappe thermonucléaire militaire
  const survivors = [{ id: 'ricky', health: 100 }, { id: 'dallas', health: 80 }];
  updateGunnisonDirector(gunnison, 95.0, survivors);
  assert.equal(gunnison.militaryNukeAlert, true);

  // Survie finale jusqu'à l'évacuation
  updateGunnisonDirector(gunnison, 30.0, survivors);
  assert.equal(gunnison.evacuationCompleted, true);
  assert.equal(gunnison.hospitalDefended, true);
});

test('Chantier 10 — Synthèse audio des 13 nouvelles méthodes et budget Draw Calls Mothership', () => {
  const newAudioMethods = [
    'playMudSlurryCoat',
    'playMudWashOff',
    'playCanopyBranchRustle',
    'playCanopyBranchCreak',
    'playPyramidStoneGrind',
    'playAcidPoolBubble',
    'playSteamVentHiss',
    'playSpineRipCrack',
    'playFleshSeverSlash',
    'playMeatHookRattle',
    'playNitrogenVentBlast',
    'playClawBarkGrip',
    'playThunderCrack',
  ];

  newAudioMethods.forEach(method => {
    assert.equal(typeof audioSynth[method], 'function', `AudioSynth.${method} doit exister`);
  });

  // Test du budget de Draw Calls MothershipHub
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});
