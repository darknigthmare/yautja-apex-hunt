import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  LOG_TRAP_CONSTANTS,
  createLogCounterweightTrapState,
  triggerLogTrap,
  updateLogCounterweightTrap,
} from '../src/gameplay/LogCounterweightCrushTrap.js';
import {
  WATER_TOWER_CONSTANTS,
  createWaterTowerSectorState,
  damageWaterTank,
  updateWaterTowerSector,
} from '../src/gameplay/WaterTowerCoolantShockSector.js';
import {
  BONE_SHIELD_CONSTANTS,
  createExpandableBoneShieldState,
  deployBoneShield,
  retractBoneShield,
  processShieldDeflection,
  executeShieldBash,
} from '../src/gameplay/ExpandableBoneShieldDeflection.js';
import {
  PYRAMID_SHIFT_CONSTANTS,
  createPyramidShiftSectorState,
  triggerManualPyramidShift,
  updatePyramidShiftSector,
} from '../src/gameplay/SacrificialAltarChannelShiftSector.js';
import {
  HORN_CONSTANTS,
  createHellHoundHornState,
  soundHuntingWarHorn,
  updateHellHoundHornDirector,
} from '../src/gameplay/HellHoundHornSummonDirector.js';
import {
  NET_DRONE_CONSTANTS,
  createNetDroneSystemState,
  launchNetDrone,
  updateNetDroneSystem,
} from '../src/gameplay/PredatorDroneHunterNetSystem.js';
import {
  SEWER_STEAM_CONSTANTS,
  createSewerSteamSectorState,
  updateSewerSteamSector,
} from '../src/gameplay/SubterraneanSewerSteamSector.js';
import {
  TRACKER_INSTINCT_CONSTANTS,
  createBillyTrackerState,
  updateBillyTrackerInstinct,
  attemptFrontalAmbushOnBilly,
} from '../src/gameplay/BillyTrackerInstinctDirector.js';
import {
  TREE_AMBUSH_CONSTANTS,
  createCutTreeAmbushState,
  severTreeRopeTether,
  evaluateTrunkWalkwayTraversal,
} from '../src/gameplay/CutTreeTrapAmbushSector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Piège à contrepoids de tronc et écrasement lourd (Lore 1:1 Predator 1987)', () => {
  const trap = createLogCounterweightTrapState({ x: 0, y: 0, z: -10 });
  assert.equal(trap.isRigged, true);
  assert.equal(trap.hasImpacted, false);

  const hunterEnemy = {
    id: 'jungle_hunter',
    x: 0,
    y: 0,
    z: -10,
    health: 400,
    takeDamage(dmg) { this.health -= dmg; },
  };

  // Passage sur le fil de détente et déclenchement de la chute
  updateLogCounterweightTrap(trap, 0.1, [hunterEnemy], audioSynth);
  assert.equal(trap.isTriggered, true);

  // Chute du tronc massif jusqu'à l'impact au sol
  updateLogCounterweightTrap(trap, 1.0, [hunterEnemy], audioSynth);
  assert.equal(trap.hasImpacted, true);
  assert.equal(hunterEnemy.isKnockedProne, true);
  assert.equal(hunterEnemy.isPinnedUnderLog, true);
  assert.equal(hunterEnemy.health, 400 - LOG_TRAP_CONSTANTS.CRUSH_DAMAGE);
  assert.equal(trap.pinnedVictims.length, 1);
});

test('Chantier 2 — Château d\'eau de toiture et court-circuitage du camouflage (Lore 1:1 Predator 2)', () => {
  const state = createWaterTowerSectorState();
  const tank = state.tanks[0];

  // Rupture du réservoir par tirs
  const breached = damageWaterTank(state, tank.id, 150.0, { x: 0, z: 1 }, audioSynth);
  assert.equal(breached, true);
  assert.equal(state.activeDeluges.length, 1);

  const cloakedPredator = {
    id: 'city_hunter_predator',
    x: 0,
    y: 0,
    z: -14, // Dans le cône du déversement
    isCloaked: true,
    hasCamouflage: true,
    isMudCovered: true,
  };

  // Le déferlement d'eau frappe le chasseur camouflé
  updateWaterTowerSector(state, 0.5, [cloakedPredator], audioSynth);
  assert.equal(cloakedPredator.isCloaked, false);
  assert.equal(cloakedPredator.isCloakShortCircuited, true);
  assert.equal(cloakedPredator.isMudCovered, false);
  assert.equal(cloakedPredator.isDrenched, true);
  assert.ok(state.shortCircuitedEntities.includes('city_hunter_predator'));
});

test('Chantier 3 — Bouclier d\'os déployable et parade balistique (Lore 1:1 Prey 2022)', () => {
  const state = createExpandableBoneShieldState();
  assert.equal(state.isDeployed, false);

  deployBoneShield(state, audioSynth);
  assert.equal(state.isDeployed, true);

  const hunterForward = { x: 0, z: -1 };
  const incomingBulletDir = { x: 0, z: 1 }; // Arrive face au bouclier

  // Impact balistique frontal absorbé à 95%
  const result = processShieldDeflection(state, hunterForward, incomingBulletDir, 100.0, audioSynth);
  assert.equal(result.isDeflected, true);
  assert.equal(result.deflectedDamage, 95.0);
  assert.equal(result.remainingDamage, 5.0);
  assert.ok(state.currentKineticCharge > 0);

  // Coup de bouclier dévastateur libérant l'énergie cinétique
  const frenchTrapper = { id: 'trapper_brute', health: 120, takeDamage(dmg) { this.health -= dmg; } };
  const bashResult = executeShieldBash(state, frenchTrapper, audioSynth);
  assert.ok(bashResult);
  assert.equal(frenchTrapper.isKnockedProne, true);
  assert.ok(frenchTrapper.health < 120);
  assert.equal(state.currentKineticCharge, 0); // Déchargé
});

test('Chantier 4 — Labyrinthe pyramidal aux parois coulissantes et écrasement (Lore 1:1 AVP 2004)', () => {
  const state = createPyramidShiftSectorState();
  assert.equal(state.isShifting, false);

  // Déclenchement du réagencement mégalithique
  const shifted = triggerManualPyramidShift(state, audioSynth);
  assert.equal(shifted, true);
  assert.equal(state.isShifting, true);

  // Cible coincée dans l'embrasure d'une paroi qui se referme
  const gateToClose = state.slidingGates[0];
  const trappedVictim = {
    id: 'mercenary_unlucky',
    x: gateToClose.x,
    y: 0,
    z: gateToClose.z,
    health: 100,
  };

  updatePyramidShiftSector(state, 1.0, [trappedVictim], audioSynth);
  assert.equal(trappedVictim.isDead, true);
  assert.equal(trappedVictim.deathType, 'pyramid_wall_crush');

  // Fin du cycle de réagencement
  updatePyramidShiftSector(state, PYRAMID_SHIFT_CONSTANTS.TRANSITION_DURATION, [], audioSynth);
  assert.equal(state.isShifting, false);
  assert.equal(state.totalShiftsOccurred, 1);
});

test('Chantier 5 — Appel de meute au cor de guerre et frénésie (Lore 1:1 Predators 2010)', () => {
  const state = createHellHoundHornState();
  const hunterPos = { x: 0, y: 0, z: 0 };

  const dormantHound = {
    id: 'flusher_hound_1',
    role: 'hell_hound',
    x: 10,
    y: 0,
    z: 15,
    isAwakened: false,
  };

  const humanSoldier = {
    id: 'guerrilla_grunt',
    species: 'human',
    x: -12,
    y: 0,
    z: 20,
    health: 80,
  };

  // Sonnerie du cor de chasse du Tracker
  const sounded = soundHuntingWarHorn(state, hunterPos, [dormantHound, humanSoldier], audioSynth);
  assert.equal(sounded, true);
  assert.equal(dormantHound.isAwakened, true);
  assert.equal(dormantHound.inFrenzy, true);
  assert.equal(dormantHound.speedMultiplier, HORN_CONSTANTS.HOUND_FRENZY_SPEED_BUFF);

  // La proie humaine subit l'effet TERROR
  assert.equal(humanSoldier.isTerrified, true);
  assert.equal(humanSoldier.aimSwayPenalty, 0.6);
  assert.ok(state.cooldownTimer > 0);
});

test('Chantier 6 — Micro-drone largueur de filet monofilament (Lore 1:1 The Predator 2018)', () => {
  const state = createNetDroneSystemState();
  const origin = { x: 0, y: 1.5, z: 0 };
  const fugitiveSoldier = {
    id: 'stargazer_operative',
    x: 0,
    y: 0,
    z: -18,
    isDead: false,
  };

  // Lancement du drone autonome
  const launched = launchNetDrone(state, origin, fugitiveSoldier, audioSynth);
  assert.equal(launched, true);
  assert.ok(state.activeDrone);

  // Le drone transite vers le zénith de la cible et largue le filet
  updateNetDroneSystem(state, 1.0, audioSynth); // Transit rapide
  updateNetDroneSystem(state, 0.5, audioSynth); // Largage et resserrement

  assert.equal(fugitiveSoldier.isSnaredInNet, true);
  assert.equal(fugitiveSoldier.isKnockedProne, true);
  assert.ok(state.snaredVictims.includes('stargazer_operative'));
});

test('Chantier 7 — Conduits d\'égouts souterrains et jets de vapeur brûlante (Lore 1:1 AVP:R 2007)', () => {
  const state = createSewerSteamSectorState();
  assert.equal(state.steamVents.length, 3);

  const warriorXeno = {
    id: 'sewer_alien_warrior',
    x: 0,
    y: 1.2,
    z: -10.0, // Devant la soupape 1
    health: 120,
    takeDamage(dmg) { this.health -= dmg; },
  };

  // Écoulement du temps pour déclencher le jet de vapeur sous pression
  updateSewerSteamSector(state, 1.1, [warriorXeno], audioSynth);
  assert.equal(state.steamVents[0].isActive, true);
  assert.ok(warriorXeno.health < 120, 'Le jet de vapeur doit infliger des brûlures thermiques');
  assert.equal(warriorXeno.isThermalBlinded, true);
});

test('Chantier 8 — Sixième sens et intuition de pistage de Billy (Lore 1:1 Predator 1987)', () => {
  const state = createBillyTrackerState();
  const trackerPos = { x: 0, y: 0, z: 0 };

  const approachingHunter = {
    id: 'jungle_hunter_cloaked',
    x: 0,
    y: 2.0,
    z: -8.0, // À 8m dans les arbres
    isBleeding: true,
    isMoving: true,
  };

  // Le sixième sens s'éveille à l'approche du chasseur
  updateBillyTrackerInstinct(state, 0.1, trackerPos, approachingHunter, audioSynth);
  assert.equal(state.sixthSenseTriggered, true);
  assert.equal(state.isInStandoffStance, true);
  assert.ok(state.spottedTrailPoints.length > 0, 'Les gouttes de sang fluorescent sont repérées');

  // Tentative d'attaque frontale : bloquée par le coutelas de Billy
  const frontalAttackDir = { x: 0, z: 1 };
  const ambushCheck = attemptFrontalAmbushOnBilly(state, frontalAttackDir);
  assert.equal(ambushCheck.ambushSucceeded, false);
  assert.equal(ambushCheck.isParried, true);
  assert.equal(state.timesAmbushDenied, 1);
});

test('Chantier 9 — Arbres d\'embuscade abattus et ponts de franchissement (Lore 1:1 Prey 2022)', () => {
  const state = createCutTreeAmbushState();
  const tree = state.trees[0];

  // Section du câble de maintien du tronc de pin
  const severed = severTreeRopeTether(state, tree.id, 40.0, audioSynth);
  assert.equal(severed, true);
  assert.equal(tree.isFelled, true);
  assert.equal(state.activeBarricades.length, 1);

  // Progression équilibriste d'un chasseur sur le tronc au-dessus des pièges
  const actorOnTrunk = { x: -8.0, y: 1.8, z: -15.0 };
  const traversal = evaluateTrunkWalkwayTraversal(state, actorOnTrunk);
  assert.equal(traversal.isOnTrunkBridge, true);
  assert.equal(traversal.evadesGroundTraps, true);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v130 et respect des Draw Calls Mothership', () => {
  const v130AudioMethods = [
    'playLogDeadfallSnap',
    'playLogHeavyCrash',
    'playWaterDelugeGush',
    'playCloakShortCircuitFizz',
    'playBoneShieldUnfold',
    'playBoneShieldDeflectClash',
    'playPyramidGearShiftRumble',
    'playStoneWallGrind',
    'playTrackerHornWarBellow',
    'playHoundFrenzyHowl',
    'playMicroDroneLaunchWhir',
    'playMonofilamentNetDrop',
    'playSewerSteamBurst',
    'playTrackerSixthSenseSting',
    'playFelledTreeCrash',
  ];

  v130AudioMethods.forEach(method => {
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
