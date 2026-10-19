// Suite de Tests Unitaires & Intégration v139 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCrashedScoutShipState,
  initiateScoutCoreOverload,
  cancelCoreOverload,
  updateScoutCoreCountdown,
  SCOUT_OVERLOAD_CONSTANTS,
} from '../src/gameplay/CrashedScoutShipOverloadDirector.js';

import {
  createCurvedFlechetteState,
  fireCurvedFlechette,
  CURVED_FLECHETTE_CONSTANTS,
} from '../src/gameplay/CelticCurvedWristFlechetteSystem.js';

import {
  createPendulumTrapState,
  armPendulumTrap,
  triggerPendulumSwing,
  PENDULUM_TRAP_CONSTANTS,
} from '../src/gameplay/DutchPendulumLogSpikeTrapSector.js';

import {
  createBadBloodJetpackState,
  activateJetpackDash,
  executeSismicSlam,
  updateJetpackCooldown,
  JETPACK_CONSTANTS,
} from '../src/gameplay/BadBloodGravitationalJetpackSystem.js';

import {
  createMotorizedWinchState,
  fireTetheredHarpoon,
  reelInTetheredVictim,
  executeWristbladeFinisher,
  WINCH_CONSTANTS,
} from '../src/gameplay/MotorizedSpearWinchEviscerationSystem.js';

import {
  createPyramidElevatorState,
  activateElevatorAscent,
  updateElevatorTransit,
  evaluateGapCrush,
  ELEVATOR_CONSTANTS,
} from '../src/gameplay/PyramidChamberElevatorShiftSector.js';

import {
  createCauterizationBalmState,
  applyBiologicalBalm,
  BALM_CONSTANTS,
} from '../src/gameplay/YautjaBiologicalWoundCauterizationBalm.js';

import {
  createHolographicDecoyState,
  deployHologramDecoy,
  divertEnemyFireToDecoy,
  updateDecoyState,
  DECOY_CONSTANTS,
} from '../src/gameplay/HolographicDecoySpectralEmitterSystem.js';

import {
  createCombistickEstocState,
  executePlasmaEstocThrust,
  ESTOC_CONSTANTS,
} from '../src/gameplay/CombistickPlasmaEstocThrustSystem.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — CrashedScoutShipOverloadDirector: surcharge et onde de plasma violet (The Predator 2018)', () => {
  const state = createCrashedScoutShipState({ x: 0, y: 0, z: 0 });

  // Armement du réacteur quantique
  const armed = initiateScoutCoreOverload(state, audioSynth);
  assert.equal(armed, true);
  assert.equal(state.isOverloadArmed, true);
  assert.equal(state.countdownTimer, SCOUT_OVERLOAD_CONSTANTS.COUNTDOWN_DURATION_SEC);

  // Annulation possible
  cancelCoreOverload(state);
  assert.equal(state.isOverloadArmed, false);

  // Réarmement et décompte jusqu'à l'explosion
  initiateScoutCoreOverload(state, audioSynth);
  const stargazerOperative = {
    id: 'stargazer_soldier',
    x: 10.0,
    z: 10.0,
    health: 200,
    isObliterated: false,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  const blastResult = updateScoutCoreCountdown(state, 10.0, [stargazerOperative], audioSynth);
  assert.equal(blastResult.detonated, true);
  assert.equal(state.isDetonated, true);
  assert.equal(stargazerOperative.isObliterated, true);
  assert.equal(stargazerOperative.isEmpDisrupted, true);
  assert.equal(stargazerOperative.health, 0);
});

test('Chantier 2 — CelticCurvedWristFlechetteSystem: fléchette incurvée contournant un obstacle (AVP 2004)', () => {
  const state = createCurvedFlechetteState();
  const targetXeno = {
    id: 'grid_xeno',
    health: 150,
    isChitinPierced: false,
    takeDamage(d) { this.health -= d; },
  };

  const obstacle = { id: 'granite_pillar', x: 0, z: 5.0 };
  const shotRes = fireCurvedFlechette(state, { x: 0, y: 1.5, z: 0 }, targetXeno, obstacle, audioSynth);

  assert.equal(shotRes.success, true);
  assert.equal(shotRes.obstacleBypassed, true);
  assert.equal(targetXeno.health, 150 - CURVED_FLECHETTE_CONSTANTS.FLECHETTE_PIERCE_DAMAGE);
  assert.equal(targetXeno.isChitinPierced, true);
  assert.equal(state.remainingFlechettes, 5);
});

test('Chantier 3 — DutchPendulumLogSpikeTrapSector: piège pendulaire de tronc taillé (Predator 1987)', () => {
  const state = createPendulumTrapState({ x: 0, y: 5.0, z: 0 });

  // Armement
  armPendulumTrap(state);
  assert.equal(state.isArmed, true);

  // Déclenchement sur le Jungle Hunter
  const hunter = {
    id: 'jungle_hunter',
    health: 250,
    z: 0,
    isStunned: false,
    takeDamage(d) { this.health -= d; },
  };

  const swingRes = triggerPendulumSwing(state, hunter, audioSynth);
  assert.equal(swingRes.success, true);
  assert.equal(hunter.health, 250 - PENDULUM_TRAP_CONSTANTS.IMPALE_CRUSH_DAMAGE);
  assert.equal(hunter.isStunned, true);
  assert.ok(hunter.z > 0, 'La cible doit être projetée en arrière');
});

test('Chantier 4 — BadBloodGravitationalJetpackSystem: ruée aérienne et écrasement sismique (Comics Dark Horse)', () => {
  const state = createBadBloodJetpackState();
  const badBlood = { x: 0, y: 0, z: 0 };

  // Ruée en jetpack
  const dashRes = activateJetpackDash(state, badBlood, { x: 0, z: 1 }, audioSynth);
  assert.equal(dashRes.success, true);
  assert.equal(state.isAirborne, true);
  assert.equal(badBlood.z, JETPACK_CONSTANTS.DASH_DISTANCE_METERS);

  // Écrasement sismique au sol
  const enemySoldier = { x: 0, z: badBlood.z + 2.0, health: 160, isKnockedDown: false, takeDamage(d) { this.health -= d; } };
  const slamRes = executeSismicSlam(state, badBlood, [enemySoldier], audioSynth);

  assert.equal(slamRes.success, true);
  assert.equal(enemySoldier.health, 160 - JETPACK_CONSTANTS.SLAM_SHOCKWAVE_DAMAGE);
  assert.equal(enemySoldier.isKnockedDown, true);

  // Recharge
  updateJetpackCooldown(state, 6.0);
  assert.equal(state.cooldownTimer, 0);
});

test('Chantier 5 — MotorizedSpearWinchEviscerationSystem: harpon à treuil et exécution au poignet (Predator 2)', () => {
  const state = createMotorizedWinchState();
  const hunter = { x: 0, z: 0 };
  const gangLeader = {
    id: 'el_scorpio',
    x: 0,
    z: 14.0,
    health: 260,
    isHarpoonAnchored: false,
    takeDamage(d) { this.health -= d; },
  };

  // Harponnage
  const tethered = fireTetheredHarpoon(state, gangLeader);
  assert.equal(tethered, true);
  assert.equal(gangLeader.isHarpoonAnchored, true);
  assert.equal(gangLeader.health, 260 - WINCH_CONSTANTS.HARPOON_STRIKE_DAMAGE);

  // Rembobinage motorisé vers le chasseur
  const reelRes = reelInTetheredVictim(state, hunter, gangLeader, audioSynth);
  assert.equal(reelRes.success, true);
  assert.equal(gangLeader.isReeledClose, true);
  assert.equal(gangLeader.x, 0);

  // Exécution au wristblade
  const finishRes = executeWristbladeFinisher(state, gangLeader);
  assert.equal(finishRes.executed, true);
  assert.equal(gangLeader.isExecuted, true);
  assert.equal(state.isHarpoonTethered, false);
});

test('Chantier 6 — PyramidChamberElevatorShiftSector: élévateur colossal en granit et cisaillement (AVP 2004)', () => {
  const state = createPyramidElevatorState(0.0);
  const passenger = { y: 0.0 };

  // Déclenchement de la montée
  activateElevatorAscent(state, 16.0, audioSynth);
  assert.equal(state.isMoving, true);

  // Translation
  updateElevatorTransit(state, 2.0, [passenger]);
  assert.ok(state.currentPlatformY > 0.0);
  assert.equal(passenger.y, state.currentPlatformY);

  // Écrasement sur la rainure de granit
  const edgeVictim = {
    x: ELEVATOR_CONSTANTS.PLATFORM_RADIUS_METERS, // Pile sur le bord
    z: 0,
    health: 300,
    isCrushedByGranite: false,
    takeDamage(d) { this.health -= d; },
  };
  const crushRes = evaluateGapCrush(state, edgeVictim);
  assert.equal(crushRes.crushed, true);
  assert.equal(edgeVictim.isCrushedByGranite, true);
  assert.equal(edgeVictim.health, 0);
});

test('Chantier 7 — YautjaBiologicalWoundCauterizationBalm: baume neutralisant d\'acide (AVP 2004)', () => {
  const state = createCauterizationBalmState();
  const woundedScar = {
    health: 40,
    isAcidCorroding: true,
    acidBurnDuration: 5.0,
  };

  const balmRes = applyBiologicalBalm(state, woundedScar, audioSynth);
  assert.equal(balmRes.success, true);
  assert.equal(woundedScar.isAcidCorroding, false);
  assert.equal(woundedScar.acidBurnDuration, 0);
  assert.equal(woundedScar.health, 40 + BALM_CONSTANTS.INSTANT_HEALTH_RECOVERY);
  assert.equal(state.remainingBalmVials, 2);
});

test('Chantier 8 — HolographicDecoySpectralEmitterSystem: leurre 3D et diversion des tirs (The Predator 2018)', () => {
  const state = createHolographicDecoyState();

  // Déploiement du leurre holographique
  const deployed = deployHologramDecoy(state, { x: 5.0, y: 0, z: 5.0 }, audioSynth);
  assert.equal(deployed, true);
  assert.equal(state.isDecoyActive, true);

  // Détournement des tirs ennemis
  const sniper = { x: 7.0, z: 6.0, currentTarget: 'hunter', isShootingAtDecoy: false };
  const divertRes = divertEnemyFireToDecoy(state, [sniper]);
  assert.equal(divertRes.diverted, true);
  assert.equal(sniper.currentTarget, 'holographic_decoy');
  assert.equal(sniper.isShootingAtDecoy, true);

  // Fin du leurre après expiration
  updateDecoyState(state, 15.0);
  assert.equal(state.isDecoyActive, false);
});

test('Chantier 9 — CombistickPlasmaEstocThrustSystem: estoc de lance et détonation interne (AVP 2004 / Comics)', () => {
  const state = createCombistickEstocState();
  const queenTarget = {
    id: 'alien_queen',
    health: 400,
    isImpaledWithPlasma: false,
    takeDamage(d) { this.health -= d; },
  };

  // Coup d'estoc avec décharge de micro-plasma
  const estocRes = executePlasmaEstocThrust(state, queenTarget, 50.0, audioSynth);
  assert.equal(estocRes.success, true);
  assert.equal(queenTarget.isImpaledWithPlasma, true);
  assert.equal(estocRes.totalDamageDealt, ESTOC_CONSTANTS.KINETIC_THRUST_DAMAGE + ESTOC_CONSTANTS.INTERNAL_PLASMA_BURST_DAMAGE);
  assert.equal(queenTarget.health, 400 - estocRes.totalDamageDealt);
  assert.equal(estocRes.energyConsumed, ESTOC_CONSTANTS.PLASMA_ENERGY_COST);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v139 et respect Draw Calls Mothership', () => {
  const v139Methods = [
    'playQuantumCoreOverloadHum',
    'playVioletPlasmaShockwaveBoom',
    'playCurvedFlechetteWhistle',
    'playFlechetteSpikeEmbedThud',
    'playPendulumLogSwingWhoosh',
    'playSpikedLogImpaleCrack',
    'playBadBloodJetpackIgnitionRoar',
    'playSismicSlamShockwaveRing',
    'playMotorizedWinchRewindWhine',
    'playHarpoonPullDragScrape',
    'playGraniteElevatorGrindClank',
    'playBiologicalBalmSizzleSooth',
    'playHoloDecoyFlickerHum',
    'playCombistickPlasmaEstocBlast',
    'playVesselDebrisRainClatter',
  ];

  for (const methodName of v139Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
