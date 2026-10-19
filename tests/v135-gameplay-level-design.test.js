import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

import {
  WHIP_CONSTANTS,
  createWolfTailWhipState,
  lashTailWhip,
  updateWolfTailWhip,
} from '../src/gameplay/WolfXenomorphTailWhipSystem.js';

import {
  WATER_CLOAK_CONSTANTS,
  createWaterCloakFailureState,
  evaluateWaterImmersion,
  updateWaterCloakFailure,
} from '../src/gameplay/WaterImmersionCloakFailureSystem.js';

import {
  DOMESTIC_HOUND_CONSTANTS,
  createDomesticatedHoundState,
  commandHoundFetch,
  commandHoundPin,
  updateDomesticatedHound,
} from '../src/gameplay/DomesticatedPredatorHoundDirector.js';

import {
  SELF_DESTRUCT_CONSTANTS,
  createSelfDestructState,
  armGauntletSelfDestruct,
  updateSelfDestruct,
} from '../src/gameplay/VocalMimicrySelfDestructCountdownSystem.js';

import {
  SPEARGUN_CONSTANTS,
  createSpeargunState,
  fireSpearDart,
  updateSpeargun,
} from '../src/gameplay/CityHunterSpeargunSniperSystem.js';

import {
  MUD_BOG_CONSTANTS,
  createMudBogState,
  updateMudBogSector,
} from '../src/gameplay/MudBogQuicksandTrapSector.js';

import {
  QUEEN_CHAMBER_CONSTANTS,
  createQueenChamberState,
  damageQueenShackles,
  updateQueenChamber,
} from '../src/gameplay/AlienQueenChamberIncubatorSector.js';

import {
  CAMP_CONSTANTS,
  createGuerillaCampState,
  damageFuelDrum,
} from '../src/gameplay/GuerillaCampInfiltrationSector.js';

import {
  DRONE_SHIP_CONSTANTS,
  createDroneShipState,
  initiateOrbitalLock,
  updateDroneShipDirector,
} from '../src/gameplay/PredatorDroneShipControlDirector.js';

test('Chantier 1 — WolfXenomorphTailWhipSystem: fouet barbelé et découpage de Xénomorphes (AVP:R 2007)', () => {
  const state = createWolfTailWhipState();
  const wielder = { x: 0, z: 0 };
  const xenoTarget = { id: 'warrior_xeno', x: 0, z: 5, health: 150 };

  const lash = lashTailWhip(state, wielder, Math.PI / 2, [xenoTarget]);
  assert.ok(lash.struck);
  assert.equal(lash.hitCount, 1);
  assert.ok(xenoTarget.isBisected, 'Le Xénomorphe doit être coupé en deux');
  assert.ok(xenoTarget.health < 150);

  updateWolfTailWhip(state, 1.5);
  assert.equal(state.isLashing, false);
});

test('Chantier 2 — WaterImmersionCloakFailureSystem: court-circuit du camouflage dans l’eau (Predator 1987)', () => {
  const state = createWaterCloakFailureState();
  const hunter = { id: 'jungle_hunter', isCloaked: true };

  // Immersion sous la cascade (profondeur 0.8m)
  evaluateWaterImmersion(state, hunter, 0.8);
  assert.equal(hunter.isCloaked, false, 'Le camouflage doit être coupé');
  assert.equal(hunter.cloakShortCircuited, true);
  assert.ok(state.circuitShortCircuited);

  // Sortie de l'eau et séchage
  evaluateWaterImmersion(state, hunter, 0.0);
  updateWaterCloakFailure(state, 5.0, hunter);
  assert.equal(state.circuitShortCircuited, false, 'Les circuits doivent être secs');
  assert.equal(hunter.cloakShortCircuited, false);
});

test('Chantier 3 — DomesticatedPredatorHoundDirector: molosse allié et rapport d’armes (The Predator 2018)', () => {
  const state = createDomesticatedHoundState({ x: 0, z: -2 });
  const ammoCrate = { id: 'dropped_crate', x: 0, z: 6, type: 'smart_disc_ammo' };

  // Ordre de récupération
  const commanded = commandHoundFetch(state, ammoCrate);
  assert.ok(commanded);
  assert.equal(state.hound.mode, 'FETCH');

  // Déplacement vers l'objet
  updateDomesticatedHound(state, 1.0, { x: 0, z: 0 });
  assert.equal(state.hound.retrievedItemType, 'smart_disc_ammo');
  assert.equal(state.hound.mode, 'HEEL');
});

test('Chantier 4 — VocalMimicrySelfDestructCountdownSystem: rire de Billy et détonation nucléaire (Predator 1987)', () => {
  const state = createSelfDestructState();
  assert.equal(state.isArmed, false);

  // Armement du compte à rebours
  armGauntletSelfDestruct(state);
  assert.ok(state.isArmed);

  // Évolution jusqu'à la détonation
  const victim = { id: 'guerrilla_target', x: 5, z: 5, health: 100 };
  const result = updateSelfDestruct(state, 8.5, [victim], { x: 0, z: 0 });

  assert.ok(result.detonated);
  assert.equal(state.hasDetonated, true);
  assert.equal(victim.health, 0, 'La cible dans la zone doit être anéantie');
});

test('Chantier 5 — CityHunterSpeargunSniperSystem: harpon supersonique et clouage mural (Predator 2)', () => {
  const state = createSpeargunState(5);
  const wall = { x: 0, z: 11 };
  const target = { id: 'gangster', x: 0, z: 10, health: 120 };

  // Tir de flèche de harpon
  const spear = fireSpearDart(state, { x: 0, z: 0 }, Math.PI / 2);
  assert.ok(spear);
  assert.equal(state.ammo, 4);

  // Impact et clouage mural
  updateSpeargun(state, 0.3, [target], [wall]);
  assert.ok(target.health < 120);
  assert.ok(target.isPinnedToWall, 'La cible doit être clouée au mur');
});

test('Chantier 6 — MudBogQuicksandTrapSector: bourbier mouvant et enlisement (Prey 2022)', () => {
  const state = createMudBogState({ x: 0, z: -15 });
  const feral = { id: 'feral_predator', x: 0, z: -15, health: 250 };

  // Entrée dans le bourbier
  updateMudBogSector(state, 5.0, [feral]);
  assert.ok(feral.isEnmiredInMud);
  assert.ok(feral.speedMultiplier < 0.5, 'La vitesse doit être lourdement ralentie');
  assert.ok(feral.sinkDepth > 0.5, 'La cible doit s’enfoncer dans la boue');
});

test('Chantier 7 — AlienQueenChamberIncubatorSector: Reine enchaînée et éclosion d’œufs (AVP 2004)', () => {
  const state = createQueenChamberState();
  assert.equal(state.queen.isShackled, true);

  // Dommages aux entraves hydrauliques
  const dmgRes = damageQueenShackles(state, 170);
  assert.ok(dmgRes.freed);
  assert.equal(state.queen.isShackled, false, 'La Reine doit être libérée');

  // Approche d'un explorateur humain près d'un œuf
  const explorer = { id: 'weyland_guard', x: -3.0, z: -20.0 };
  updateQueenChamber(state, 0.1, [explorer]);
  assert.ok(state.eggs[0].isOpen, 'L’œuf doit s’ouvrir devant l’hôte');
  assert.ok(state.facehuggersReleasedCount >= 1);
});

test('Chantier 8 — GuerillaCampInfiltrationSector: détonation de barils et effondrement de miradors (Predator 1987)', () => {
  const state = createGuerillaCampState();
  const soldier = { id: 'rebel_soldier', x: -5.0, z: -12.0, health: 100 };

  // Tir sur baril de carburant
  const boom = damageFuelDrum(state, 'drum_fuel_01', 30, [soldier]);
  assert.ok(boom.detonated);
  assert.ok(soldier.health <= 0 || soldier.isOnFire);
  assert.ok(state.watchtowers[0].isCollapsed, 'Le mirador adjacent doit s’effondrer');
});

test('Chantier 9 — PredatorDroneShipControlDirector: verrouillage laser et frappe orbitale (The Predator 2018)', () => {
  const state = createDroneShipState();
  const targetPos = { x: 5, z: 20 };
  const bunkerTarget = { id: 'stargazer_tank', x: 5, z: 20, health: 300 };

  // Acquisition des coordonnées
  const lock = initiateOrbitalLock(state, targetPos);
  assert.ok(lock);
  assert.ok(state.isLocking);

  // Finalisation du verrouillage et frappe
  const strike = updateDroneShipDirector(state, 2.2, [bunkerTarget]);
  assert.ok(strike.delivered);
  assert.ok(bunkerTarget.health < 100, 'La cible doit subir la frappe orbitale');
  assert.ok(bunkerTarget.isStaggered);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v135 et respect Draw Calls Mothership', () => {
  const v135AudioMethods = [
    'playXenoTailWhipSnapCrack',
    'playWhipWrapConstrictHiss',
    'playWaterImmersionCloakFritter',
    'playWaterSplashWadeSquelch',
    'playModifiedHoundWhistlePipe',
    'playModifiedHoundFetchBark',
    'playManiacalMimicLaughEcho',
    'playNuclearGlyphCountdownBeep',
    'playSpeargunPneumaticPuff',
    'playSpearDartWallImpaleThud',
    'playMudBogSuctionGurgle',
    'playMudStruggleWadeThud',
    'playQueenShackleHydraulicHiss',
    'playEggPodPetalOpenSquelch',
    'playFuelDrumExplosionBoom',
  ];

  v135AudioMethods.forEach(method => {
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
