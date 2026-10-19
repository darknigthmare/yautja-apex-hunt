import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

import {
  BEACON_CONSTANTS,
  createDisengagementBeaconState,
  deployQuantumBeacon,
  triggerEmergencyTeleport,
} from '../src/gameplay/TacticalDisengagementBeaconSystem.js';

import {
  EXTRACTION_CONSTANTS,
  createSpinalFluidHarvestState,
  extractSpinalFluid,
  injectGeneticSerum,
  updateSpinalFluidHarvest,
} from '../src/gameplay/XenomorphSpinalFluidExtractionSystem.js';

import {
  TRI_NET_CONSTANTS,
  createTriNetState,
  fireTriDirectionalNets,
  updateTriNetLauncher,
} from '../src/gameplay/TriDirectionalNetLauncherSystem.js';

import {
  PREDATOR_KILLER_CONSTANTS,
  createPredatorKillerState,
  deployPredatorKillerSuit,
  fireTwinPlasmaVolley,
} from '../src/gameplay/PredatorKillerNanoExoskeletonDirector.js';

import {
  BRIDGE_CONSTANTS,
  createBridgeShowdownState,
  damageBridgeRope,
  updateBridgeShowdownSector,
} from '../src/gameplay/BillySoleBridgeShowdownSector.js';

import {
  CUCHILLO_DECOY_CONSTANTS,
  createCuchilloDecoyState,
  disarmClaymoreTrap,
  updateCuchilloDecoySector,
} from '../src/gameplay/CuchilloClaymoreDecoySector.js';

import {
  HORSEBACK_CONSTANTS,
  createHorsebackArcheryState,
  updateHorsebackArchery,
} from '../src/gameplay/TaabeHorsebackArcheryAssaultDirector.js';

import {
  ALTAR_CONSTANTS,
  createSacrificialAltarState,
  mercyKillHost,
  updateSacrificialAltarSector,
} from '../src/gameplay/SacrificialAltarChestburstingSector.js';

import {
  FLINTLOCK_CONSTANTS,
  createElderFlintlockState,
  awardFlintlockFromElder,
  fireFlintlockPistol,
  reloadFlintlock,
  updateFlintlock,
} from '../src/gameplay/ElderPredatorFlintlockPistolHonorReward.js';

test('Chantier 1 — TacticalDisengagementBeaconSystem: balise de repli quantique et onde thermique (The Predator / Comics)', () => {
  const state = createDisengagementBeaconState();
  const hunter = { x: 0, z: 0 };
  const pursuer = { id: 'xeno_pursuer', x: 2, z: 0, health: 150 };

  // Déploiement de la balise
  deployQuantumBeacon(state, hunter);
  assert.equal(state.isBeaconDeployed, true);

  // Téléportation de dégagement d'urgence vers l'arrière (angle PI)
  const escaped = triggerEmergencyTeleport(state, hunter, Math.PI, [pursuer]);
  assert.ok(escaped);
  assert.ok(hunter.x < -10, 'Le chasseur doit avoir été déplacé de 16m');
  assert.ok(pursuer.health < 150, 'L’assaillant doit subir l’onde thermique');
  assert.ok(pursuer.isKnockedBack);
});

test('Chantier 2 — XenomorphSpinalFluidExtractionSystem: prélèvement de liquide céphalo-rachidien et sérum (The Predator)', () => {
  const state = createSpinalFluidHarvestState();
  const slainWarrior = { id: 'dead_warrior', species: 'xenomorph', isDead: true };
  const hunter = { speedMultiplier: 1.0, damageMultiplier: 1.0 };

  // Prélèvement de fluide
  assert.ok(extractSpinalFluid(state, slainWarrior));
  assert.equal(state.collectedVials, 1);

  // Deuxième prélèvement
  const slainDrone = { id: 'dead_drone', species: 'xenomorph', isDead: true };
  assert.ok(extractSpinalFluid(state, slainDrone));
  assert.equal(state.collectedVials, 2);

  // Injection du sérum d'hybridation
  assert.ok(injectGeneticSerum(state, hunter));
  assert.ok(hunter.speedMultiplier > 1.3);
  assert.ok(hunter.damageMultiplier > 1.3);

  // Expiration du sérum
  updateSpinalFluidHarvest(state, 30.0, hunter);
  assert.equal(hunter.speedMultiplier, 1.0);
});

test('Chantier 3 — TriDirectionalNetLauncherSystem: tirs divergents de 3 filets (Predator 2)', () => {
  const state = createTriNetState(2);
  const shooter = { x: 0, z: 0 };

  // Tir en éventail de 3 filets
  const nets = fireTriDirectionalNets(state, shooter, Math.PI / 2);
  assert.equal(nets.length, 3);
  assert.equal(state.ammo, 1);

  // Interception de cibles dans le cône divergent
  const targetA = { id: 't_left',  x: -2, z: 6 };
  const targetB = { id: 't_center', x: 0, z: 6 };
  const targetC = { id: 't_right', x: 2, z: 6 };

  updateTriNetLauncher(state, 0.25, [targetA, targetB, targetC]);
  assert.ok(targetB.isNetSnared, 'La cible centrale doit être prise au filet');
});

test('Chantier 4 — PredatorKillerNanoExoskeletonDirector: exosquelette intégral et double canon plasma (The Predator)', () => {
  const state = createPredatorKillerState();
  const bearer = {};
  const targetTank = { id: 'stargazer_mech', health: 300 };

  // Déploiement de l'armure
  assert.ok(deployPredatorKillerSuit(state, bearer));
  assert.equal(bearer.hasPredatorKillerSuit, true);

  // Salve jumelée de canons plasma
  const volley = fireTwinPlasmaVolley(state, { x: 0, z: 0 }, targetTank);
  assert.ok(volley.fired);
  assert.ok(targetTank.health < 200, 'La salve doit infliger 160 dégâts');
  assert.ok(targetTank.isKnockedBack);
});

test('Chantier 5 — BillySoleBridgeShowdownSector: rupture du pont de cordes et chute dans la gorge (Predator 1987)', () => {
  const state = createBridgeShowdownState({ x: 0, z: -30 });
  const predator = { id: 'jungle_hunter', x: 0, z: -30, health: 250 };

  // Section des cordages
  damageBridgeRope(state, 'rope_left', 50.0);
  assert.equal(state.isCollapsed, false);
  const cut2 = damageBridgeRope(state, 'rope_right', 50.0);
  assert.ok(cut2.collapsed);
  assert.equal(state.isCollapsed, true);

  // Précipitation dans la faille
  updateBridgeShowdownSector(state, 0.1, [predator]);
  assert.ok(predator.hasPlunged);
  assert.equal(predator.health, 0);
  assert.equal(state.fallenVictimsCount, 1);
});

test('Chantier 6 — CuchilloClaymoreDecoySector: appât vocal et détonation de claymore (Predators 2010)', () => {
  const state = createCuchilloDecoyState({ x: 0, z: -20 });
  const rescuer = { id: 'isabelle', x: 0, z: -20, health: 100 };

  // Entrée dans le périmètre du piège
  updateCuchilloDecoySector(state, 0.1, [rescuer]);
  assert.equal(state.isDetonated, true);
  assert.ok(rescuer.health <= 0 || rescuer.isKnockedBack);
  assert.equal(state.casualtiesCount, 1);

  // Test de désamorçage
  const safeState = createCuchilloDecoyState({ x: 10, z: 0 });
  assert.ok(disarmClaymoreTrap(safeState));
  assert.equal(safeState.isDisarmed, true);
});

test('Chantier 7 — TaabeHorsebackArcheryAssaultDirector: ronde équestre et flèches comanches (Prey 2022)', () => {
  const state = createHorsebackArcheryState({ x: 0, z: 0 });
  const feral = { id: 'feral_predator', x: 0, z: 0, health: 300 };

  // Évolution circulaire et tirs
  updateHorsebackArchery(state, 2.5, feral);
  assert.ok(feral.isDistracted, 'Le Feral doit être distrait par la cavalcade');
  assert.ok(feral.health < 300, 'Les flèches comanches doivent blesser le chasseur');
  assert.ok(state.arrowsLandedCount >= 2);
});

test('Chantier 8 — SacrificialAltarChestburstingSector: autels sacrificiels et aspersion acide (AVP 2004)', () => {
  const state = createSacrificialAltarState();
  const weylandGuard = { id: 'guard_host', x: 0, z: -18, health: 100 };

  // Rupture costale de l'autel 3 (gestation initiale 10s)
  updateSacrificialAltarSector(state, 2.5, [weylandGuard]);
  assert.equal(state.altars[2].hasBurst, true);
  assert.equal(state.emergedBurstersCount, 1);
  assert.ok(weylandGuard.health < 100, 'L’aspersion acide doit infliger des dégâts');
  assert.ok(weylandGuard.isAcidBurned);

  // Mort de miséricorde sur l'autel 1
  assert.ok(mercyKillHost(state, 'altar_stone_01'));
  assert.equal(state.mercyKilledCount, 1);
});

test('Chantier 9 — ElderPredatorFlintlockPistolHonorReward: pistolet à silex 1715 et balle de plomb (Predator 2)', () => {
  const state = createElderFlintlockState();
  const harrigan = { id: 'mike_harrigan', honorPoints: 0 };
  const targetAlien = { id: 'warrior_xeno', health: 250 };

  // Remise du trophée par l'Elder
  assert.ok(awardFlintlockFromElder(state, harrigan));
  assert.equal(harrigan.hasFlintlock1715, true);
  assert.equal(harrigan.honorPoints, FLINTLOCK_CONSTANTS.HONOR_REWARD_POINTS);

  // Tir dévastateur à la poudre noire
  const shot = fireFlintlockPistol(state, targetAlien);
  assert.ok(shot.fired);
  assert.ok(targetAlien.health <= 60, '190 dégâts cinétiques');
  assert.ok(targetAlien.isKnockedBack);

  // Rechargement à la baguette
  assert.ok(reloadFlintlock(state));
  updateFlintlock(state, 3.5);
  assert.equal(state.ballsLoaded, 1);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v136 et respect Draw Calls Mothership', () => {
  const v136AudioMethods = [
    'playQuantumBeaconDeployHum',
    'playTeleportThermalPulseZap',
    'playSpinalFluidHarvesterSyringe',
    'playGeneticSerumSurgeHeartbeat',
    'playTripleNetLauncherBlast',
    'playPredatorKillerNanoArmorForm',
    'playTwinPlasmaSyncVolley',
    'playRopeBridgeSnapCreak',
    'playGorgePlungeWhoosh',
    'playCuchilloMimicWhisperHiss',
    'playClaymoreBlastRing',
    'playComancheArrowBowTwang',
    'playChestbursterRibcageCrack',
    'playFlintlockHammerClickSnap',
    'playFlintlockBlackPowderBoom',
  ];

  v136AudioMethods.forEach(method => {
    assert.equal(typeof audioSynth[method], 'function', `AudioSynthesizer.${method} doit exister`);
  });

  // Vérification stricte du plafond de draw calls (<= 300)
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `Draw calls (${snapshot.drawCallEstimate}) doit être <= 300`);
  } finally {
    hub.dispose();
  }
});
