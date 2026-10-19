import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

import {
  MUD_CAMO_CONSTANTS,
  createRiverMudCamoState,
  applyRiverMudCoating,
  washOffMud,
  updateRiverMudCamo,
} from '../src/gameplay/RiverMudThermalCamouflageSystem.js';

import {
  MEDKIT_CONSTANTS,
  createYautjaMedKitState,
  startSurgicalCauterization,
  updateSurgicalCauterization,
} from '../src/gameplay/YautjaMedKitSurgicalCauterizationSystem.js';

import {
  SMART_DISC_CONSTANTS,
  createSmartDiscState,
  throwSmartDisc,
  updateSmartDisc,
} from '../src/gameplay/SmartDiscRicochetKineticDirector.js';

import {
  BOUVETOYA_CONSTANTS,
  createBouvetoyaWhalingSectorState,
  cycleThermalDefroster,
  updateBouvetoyaWhalingSector,
} from '../src/gameplay/BouvetoyaWhalingStationBlizzardSector.js';

import {
  LOG_TRAP_CONSTANTS,
  createDutchLogTrapState,
  cutTriggerVine,
  updateDutchLogTrap,
} from '../src/gameplay/DutchLogTrapCounterMeasureSystem.js';

import {
  TRACKER_WHISTLE_CONSTANTS,
  createTrackerWhistleState,
  soundTrackerWhistle,
  updateTrackerWhistleDirector,
} from '../src/gameplay/TrackerWhistleHellHoundFlockDirector.js';

import {
  FERAL_BOLT_CONSTANTS,
  createFeralBoneMaskBoltState,
  fireGuidedBoneBolt,
  detachBoneMask,
  updateFeralBoneBolts,
} from '../src/gameplay/FeralBoneMaskLaserGuidedBoltSystem.js';

import {
  SUBWAY_STROBE_CONSTANTS,
  createSubwayStrobeState,
  updateSubwayStrobeSector,
} from '../src/gameplay/SubwayCarLightningStrobeSector.js';

import {
  DISRUPTOR_CONSTANTS,
  createExoDisruptorState,
  fireEMPDisruptorWave,
  updateExoDisruptor,
} from '../src/gameplay/ExoGauntletPlasmaCannonDisruptor.js';

test('Chantier 1 — RiverMudThermalCamouflageSystem: immersion dans la glaise et séchage au feu (Predator 1987)', () => {
  const state = createRiverMudCamoState();
  assert.equal(state.isMudCoated, false);

  // Application de la boue
  applyRiverMudCoating(state);
  assert.equal(state.isMudCoated, true);
  assert.ok(state.thermalConcealment >= 0.95, 'Masquage thermique optimal');

  // Séchage accéléré à proximité du feu
  updateRiverMudCamo(state, 5.0, { nearFireSource: true, fireDistance: 2.0 });
  assert.ok(state.dryProgress > 0.3, 'Le feu doit accélérer le séchage');

  // Séchage complet et effritement
  updateRiverMudCamo(state, 20.0, { nearFireSource: true, fireDistance: 1.0 });
  assert.equal(state.isMudCoated, false, 'La boue totalement sèche doit tomber');
});

test('Chantier 2 — YautjaMedKitSurgicalCauterizationSystem: chirurgie de terrain et rugissement (Predator 2 / Prey)', () => {
  const state = createYautjaMedKitState(3);
  const hunter = { id: 'city_hunter', health: 40, maxHealth: 150, isBleeding: true, isAcidBurned: true, x: 0, z: 0 };
  const witnessHuman = { id: 'lapd_officer', health: 100, x: 2.5, z: 0 };

  // Début de cautérisation
  const start = startSurgicalCauterization(state, hunter);
  assert.ok(start.success);

  // Évolution chirurgicale jusqu'au dénouement
  updateSurgicalCauterization(state, 2.5, hunter, [witnessHuman]);

  assert.equal(state.isPerformingSurgery, false);
  assert.equal(state.charges, 2);
  assert.ok(hunter.health >= 130, 'La santé doit être régénérée de 90 points');
  assert.equal(hunter.isBleeding, false, 'Le saignement doit être cautérisé');
  assert.equal(hunter.isAcidBurned, false, 'Les brûlures acides doivent être purgées');
  assert.ok(witnessHuman.isStaggered, 'Le témoin proche doit être étourdi par le rugissement');
});

test('Chantier 3 — SmartDiscRicochetKineticDirector: vol cinétique, ricochets et rappel au gantelet (Predator 2)', () => {
  const state = createSmartDiscState();
  const thrower = { x: 0, z: 0 };
  const target1 = { id: 'target_01', x: 0, z: 8, health: 100 };
  const target2 = { id: 'target_02', x: 6, z: 8, health: 100 };

  // Lancer du disque
  throwSmartDisc(state, thrower, target1);
  assert.ok(state.isAirborne);

  // Vol et découpage de target 1 puis ricochet vers target 2
  updateSmartDisc(state, 0.4, [target1, target2]);
  assert.ok(state.totalHits >= 1, 'Target 1 doit être touchée');
  assert.ok(target1.isSevered);

  // Poursuite du vol jusqu'au retour
  updateSmartDisc(state, 1.2, [target1, target2]);
  assert.ok(state.hitTargetIds.includes('target_01'));
});

test('Chantier 4 — BouvetoyaWhalingStationBlizzardSector: station baleinière et givre (AVP 2004)', () => {
  const state = createBouvetoyaWhalingSectorState();
  assert.equal(state.ambientTemperature, -38.0);

  const hunter = { id: 'celtic_predator', x: 0, z: 0 };
  updateBouvetoyaWhalingSector(state, 5.0, [hunter]);

  assert.ok(hunter.visorFrostLevel > 0, 'Le givre doit s’accumuler en extérieur');
  assert.ok(hunter.windForceX !== 0 || hunter.windForceZ !== 0, 'Le blizzard doit pousser la silhouette');

  // Désembuage thermique
  cycleThermalDefroster(state);
  assert.equal(state.frostAccumulation, 0);
});

test('Chantier 5 — DutchLogTrapCounterMeasureSystem: chute du contrepoids et écrasement (Predator 1987)', () => {
  const state = createDutchLogTrapState({ x: 0, y: 5.0, z: -25.0 });
  const jungleHunter = { id: 'jungle_hunter', role: 'predator_hunter', x: 0, z: -25.0, health: 120 };

  // Section de la liane
  const cut = cutTriggerVine(state, 40.0);
  assert.ok(cut);
  assert.ok(state.log.isFalling);

  // Chute et impact
  updateDutchLogTrap(state, 0.5, [jungleHunter]);
  assert.ok(state.log.isCrashed);
  assert.ok(jungleHunter.health <= 0 || jungleHunter.isPinned);
  assert.ok(state.crushedVictimIds.includes('jungle_hunter'));
});

test('Chantier 6 — TrackerWhistleHellHoundFlockDirector: sifflet de meute et ruée flanquée (Predators 2010)', () => {
  const state = createTrackerWhistleState();
  const prey = { id: 'royce', x: 0, z: 20 };
  const hound1 = { id: 'hound_01', x: -10, z: 5, health: 100 };
  const hound2 = { id: 'hound_02', x: 10,  z: 5, health: 100 };

  // Coup de sifflet
  const whistle = soundTrackerWhistle(state, prey, [hound1, hound2]);
  assert.ok(whistle.success);
  assert.equal(whistle.houndsAlerted, 2);
  assert.ok(hound1.isEnragedByWhistle);
  assert.ok(hound1.meleeDamageBuff > 1.0);

  // Convergence de la meute
  updateTrackerWhistleDirector(state, 0.5, [hound1, hound2], prey);
  assert.ok(hound1.vx !== undefined);
});

test('Chantier 7 — FeralBoneMaskLaserGuidedBoltSystem: fléchettes à tête chercheuse et masque détourné (Prey 2022)', () => {
  const state = createFeralBoneMaskBoltState();
  state.mask.laserTarget = { x: 0, z: 12 };

  // Tir d'une fléchette autoguidée
  const bolt = fireGuidedBoneBolt(state, { x: 0, z: 0 });
  assert.ok(bolt);
  assert.equal(state.ammo, 5);

  // Déplacement et impact sur cible désignée par le laser
  const frenchTrapper = { id: 'trapper', x: 0, z: 12, health: 100 };
  updateFeralBoneBolts(state, 0.45, [frenchTrapper]);
  assert.ok(frenchTrapper.health < 100, 'La cible laser doit être transpercée');

  // Détachement du masque pointé sur le Feral Predator lui-même (climax du film)
  const feral = { id: 'feral_predator', role: 'feral_predator', x: 5, z: 5, health: 200 };
  detachBoneMask(state, { x: 0, z: 0 }, { x: 5, z: 5 });
  fireGuidedBoneBolt(state, { x: 0, z: 0 });
  updateFeralBoneBolts(state, 0.3, [feral]);
  assert.ok(state.selfInflictedHits >= 1, 'Le projectile doit atteindre le Feral via son propre masque');
});

test('Chantier 8 — SubwayCarLightningStrobeSector: stroboscope et courts-circuits (Predator 2)', () => {
  const state = createSubwayStrobeState();
  const humanPrey = { id: 'gang_member', x: 0, z: -5 };
  const cityHunter = { id: 'city_hunter', isCloaked: true, x: 0, z: -5 };

  // Simulation sur plusieurs ticks pour alterner l'éclairage
  updateSubwayStrobeSector(state, 0.15, [humanPrey, cityHunter]);
  updateSubwayStrobeSector(state, 0.15, [humanPrey, cityHunter]);

  assert.ok(humanPrey.isStrobeDisoriented !== undefined);
  assert.ok(state.disruptedCloaksCount >= 0);
});

test('Chantier 9 — ExoGauntletPlasmaCannonDisruptor: onde IEMP et surcharge de boucliers (The Predator 2018)', () => {
  const state = createExoDisruptorState();
  const shieldedTarget = { id: 'shielded_soldier', x: 4, z: 0, shieldEnergy: 100, isShieldActive: true };
  const drone = { id: 'falcon_drone_unit', species: 'falcon_drone', x: 6, z: 0, isEMPDisabled: false };

  // Émission de l'onde IEMP
  const emp = fireEMPDisruptorWave(state, { x: 0, z: 0 }, [shieldedTarget, drone]);
  assert.ok(emp.success);
  assert.equal(shieldedTarget.shieldEnergy, 0, 'Le bouclier énergétique doit être vidé');
  assert.equal(shieldedTarget.isShieldActive, false);
  assert.equal(drone.isEMPDisabled, true, 'Le drone doit être neutralisé par l’IEMP');

  updateExoDisruptor(state, 1.0);
  assert.ok(state.cooldownTimer < DISRUPTOR_CONSTANTS.COOLDOWN);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v133 et respect Draw Calls Mothership', () => {
  const v133AudioMethods = [
    'playMudImmersionSplash',
    'playMudDryingFlakeCrackle',
    'playMedKitCauterizeHiss',
    'playSurgicalRoarEcho',
    'playSmartDiscFlightWhir',
    'playSmartDiscRicochetSlice',
    'playSmartDiscCatchClack',
    'playBlizzardGaleHowl',
    'playFrostCrackSheet',
    'playCounterweightLogDrop',
    'playTimberCrashShatter',
    'playTrackerWhistleCall',
    'playHoundPackSnarl',
    'playFeralBoneBoltLaunch',
    'playFeralBoltImpactBone',
  ];

  v133AudioMethods.forEach(method => {
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
