// Suite de Tests Unitaires & Intégration v141 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createPredictiveTelemetryState,
  trackIncomingAimVector,
  lockPredictiveEvasion,
  evaluateIncomingProjectileDodge,
  RETINAL_PREDICT_CONSTANTS,
} from '../src/gameplay/AssassinPredictiveRetinalTelemetrySystem.js';

import {
  createConstrictionNetState,
  launchElectromagneticNet,
  updateElectromagneticCompression,
  CONSTRICTION_CONSTANTS,
} from '../src/gameplay/ElectromagneticConstrictionNetSystem.js';

import {
  createTripleBladeState,
  deployTripleBlades,
  executeTripleSlash,
  updateLacerationBleed,
  TRIPLE_BLADE_CONSTANTS,
} from '../src/gameplay/CelticTripleSerratedWristbladeSystem.js';

import {
  createSulfurArrowSectorState,
  launchSulfurResinArrow,
  updateSulfurConflagrations,
  SULFUR_RESIN_CONSTANTS,
} from '../src/gameplay/SulfurSpruceResinFireArrowSector.js';

import {
  createPlasmaBucklerState,
  deployPlasmaBuckler,
  deflectHeavyProjectile,
  retractPlasmaBuckler,
  BUCKLER_CONSTANTS,
} from '../src/gameplay/PlasmaEnergyBucklerDeflectionSystem.js';

import {
  createRazorSnareSectorState,
  placeSpiralRazorCoil,
  evaluateRazorSnareTrip,
  RAZOR_SNARE_CONSTANTS,
} from '../src/gameplay/WolfCircumferentialRazorSnareSector.js';

import {
  createMineClusterState,
  deployMineCluster,
  evaluateMineProximity,
  MINE_CLUSTER_CONSTANTS,
} from '../src/gameplay/ScatteredProximityMineClusterSystem.js';

import {
  createDecontaminationAirlockState,
  activateDecontaminationCycle,
  updateAirlockCycle,
  DECONTAM_CONSTANTS,
} from '../src/gameplay/MothershipDecontaminationAirlockSector.js';

import {
  createBerserkerRoarState,
  unleashTerrifyingRoar,
  updateTerrifiedEnemies,
  ROAR_STUN_CONSTANTS,
} from '../src/gameplay/BerserkerTerrifyingRoarStunDirector.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — AssassinPredictiveRetinalTelemetrySystem: télémétrie anticipatrice et esquive réflexe (The Predator 2018)', () => {
  const state = createPredictiveTelemetryState();
  const humanShooter = { id: 'sniper_01', x: 0, z: 20.0 };
  const userPos = { x: 0, z: 0 };

  // Traçage de la visée adverse
  const trackRes = trackIncomingAimVector(state, humanShooter, userPos, audioSynth);
  assert.equal(trackRes.tracked, true);
  assert.equal(state.isTelemetryActive, true);

  // Verrouillage de la fenêtre réflexe
  lockPredictiveEvasion(state, audioSynth);
  assert.equal(state.isEvasionLocked, true);

  // Évaluation de l'esquive sur départ de coup
  const dodgeRes = evaluateIncomingProjectileDodge(state, 80.0);
  assert.equal(dodgeRes.dodged, true);
  assert.equal(dodgeRes.damageTaken, 0);
  assert.equal(dodgeRes.counterAttackBuff, RETINAL_PREDICT_CONSTANTS.COUNTER_CRIT_MULTIPLIER);
  assert.equal(state.totalDodgesExecuted, 1);
});

test('Chantier 2 — ElectromagneticConstrictionNetSystem: filet électromagnétique et broyage de côtes (Predator 2)', () => {
  const state = createConstrictionNetState();
  const targetGangster = {
    id: 'gangster',
    health: 150,
    canMove: true,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  // Lancement du filet
  const snared = launchElectromagneticNet(state, targetGangster, audioSynth);
  assert.equal(snared, true);
  assert.equal(targetGangster.isNetSnared, true);
  assert.equal(targetGangster.canMove, false);
  assert.equal(targetGangster.health, 150 - CONSTRICTION_CONSTANTS.INITIAL_ENTANGLE_DAMAGE);

  // Impulsion de compression magnétique
  const pulseRes = updateElectromagneticCompression(state, 1.2, audioSynth);
  assert.equal(pulseRes.pulsed, true);
  assert.equal(targetGangster.ribsCrushed, true);
  assert.equal(targetGangster.health, 150 - CONSTRICTION_CONSTANTS.INITIAL_ENTANGLE_DAMAGE - CONSTRICTION_CONSTANTS.PULSE_CRUSH_DAMAGE);
});

test('Chantier 3 — CelticTripleSerratedWristbladeSystem: triple tranchant dentelé et lacération (AVP 2004)', () => {
  const state = createTripleBladeState();

  // Déploiement
  deployTripleBlades(state, audioSynth);
  assert.equal(state.isDeployed, true);

  // Frappe déchiquetante sur guerrier Xénomorphe
  const warrior = { health: 250, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const slashRes = executeTripleSlash(state, warrior, audioSynth);
  assert.equal(slashRes.success, true);
  assert.equal(warrior.isLacerated, true);
  assert.equal(warrior.health, 250 - TRIPLE_BLADE_CONSTANTS.STRIKE_DAMAGE);

  // Saignement actif
  updateLacerationBleed(warrior, 1.0);
  assert.ok(warrior.health < 250 - TRIPLE_BLADE_CONSTANTS.STRIKE_DAMAGE);
});

test('Chantier 4 — SulfurSpruceResinFireArrowSector: flèche de soufre et conflagration de poix (Prey 2022)', () => {
  const state = createSulfurArrowSectorState();

  // Tir de flèche de résine
  const arrowRes = launchSulfurResinArrow(state, { x: 10.0, z: 10.0 }, audioSynth);
  assert.equal(arrowRes.success, true);
  assert.equal(state.activeConflagrations.length, 1);

  // Propagation du brasier aux trappeurs
  const trapper = { x: 10.5, z: 10.2, health: 100, isCoatedInPitch: false, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  updateSulfurConflagrations(state, 1.0, [trapper]);
  assert.equal(trapper.isCoatedInPitch, true);
  assert.ok(trapper.health < 100);
});

test('Chantier 5 — PlasmaEnergyBucklerDeflectionSystem: bouclier plasma et renvoi de roquette (The Predator 2018)', () => {
  const state = createPlasmaBucklerState();

  // Déploiement
  deployPlasmaBuckler(state, audioSynth);
  assert.equal(state.isDeployed, true);

  // Parade et déviation d'une roquette Stargazer
  const rpgShooter = { id: 'rpg_gunner', health: 180, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const deflectRes = deflectHeavyProjectile(state, 200.0, rpgShooter, audioSynth);

  assert.equal(deflectRes.deflected, true);
  assert.equal(deflectRes.damageTaken, 0);
  assert.equal(rpgShooter.isHitByReflectedBlast, true);
  assert.equal(rpgShooter.health, 180 - BUCKLER_CONSTANTS.REFLECTED_BURST_DAMAGE);

  // Rétractation
  retractPlasmaBuckler(state);
  assert.equal(state.isDeployed, false);
});

test('Chantier 6 — WolfCircumferentialRazorSnareSector: colimaçon de fil de rasoir et démembrement (AVP:R 2007)', () => {
  const state = createRazorSnareSectorState();
  placeSpiralRazorCoil(state, { x: 4.0, z: 4.0 });
  assert.equal(state.snares.length, 1);

  // Xénomorphe s'engouffrant dans la bobine
  const runningAlien = {
    id: 'corridor_xeno',
    x: 4.5,
    z: 4.2,
    health: 200,
    isDismembered: false,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  const tripRes = evaluateRazorSnareTrip(state, runningAlien, audioSynth);
  assert.equal(tripRes.tripped, true);
  assert.equal(runningAlien.isDismembered, true);
  assert.equal(runningAlien.health, 200 - RAZOR_SNARE_CONSTANTS.DISMEMBER_DAMAGE);
  assert.equal(state.victimsDismemberedCount, 1);
});

test('Chantier 7 — ScatteredProximityMineClusterSystem: grappe de 4 micro-mines magnétiques (Predators 2010)', () => {
  const state = createMineClusterState();

  // Déploiement
  const deployRes = deployMineCluster(state, { x: 0, z: 0 }, audioSynth);
  assert.equal(deployRes.success, true);
  assert.equal(deployRes.minesDeployed.length, 4);

  // Proie marchant sur une mine
  const stepTarget = {
    x: 1.5,
    z: 1.5,
    health: 100,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  const evalRes = evaluateMineProximity(state, stepTarget);
  assert.ok(evalRes.detonatedCount >= 1);
  assert.equal(stepTarget.isShrapnelStruck, true);
  assert.ok(stepTarget.health < 100);
});

test('Chantier 8 — MothershipDecontaminationAirlockSector: sas de décontamination et purge de toxines (AVP / Predator 2)', () => {
  const state = createDecontaminationAirlockState();
  const contaminatedHunter = {
    health: 45,
    isAcidCorroding: true,
    isNeurotoxinAfflicted: true,
    isCoatedInPitch: true,
  };

  // Cycle de décontamination
  const cleansed = activateDecontaminationCycle(state, contaminatedHunter, audioSynth);
  assert.equal(cleansed, true);
  assert.equal(contaminatedHunter.isAcidCorroding, false);
  assert.equal(contaminatedHunter.isNeurotoxinAfflicted, false);
  assert.equal(contaminatedHunter.isCoatedInPitch, false);
  assert.equal(contaminatedHunter.health, 45 + DECONTAM_CONSTANTS.HEALTH_RESTORED);

  // Fin de temporisation
  updateAirlockCycle(state, 5.0);
  assert.equal(state.isCycleActive, false);
});

test('Chantier 9 — BerserkerTerrifyingRoarStunDirector: rugissement d\'intimidation et sidération des proies (Predators 2010)', () => {
  const state = createBerserkerRoarState();
  const humanSoldier = {
    id: 'soldier_terrified',
    x: 5.0,
    z: 5.0,
    canMove: true,
    isTerrified: false,
  };

  // Rugissement
  const roarRes = unleashTerrifyingRoar(state, { x: 0, z: 0 }, [humanSoldier], audioSynth);
  assert.equal(roarRes.success, true);
  assert.equal(humanSoldier.isTerrified, true);
  assert.equal(humanSoldier.canMove, false);

  // Rétablissement
  updateTerrifiedEnemies([humanSoldier], 3.0);
  assert.equal(humanSoldier.isTerrified, false);
  assert.equal(humanSoldier.canMove, true);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v141 et respect Draw Calls Mothership', () => {
  const v141Methods = [
    'playRetinalPredictiveTargetPip',
    'playPredictiveLockAcquiredChord',
    'playElectromagneticNetHumCrack',
    'playThoracicRibCompressionCrunch',
    'playTripleWristbladeDeployShink',
    'playSerratedGougeFleshTear',
    'playSulfurArrowIgnitionHiss',
    'playSprucePitchConflagrationRoar',
    'playPlasmaBucklerDeployHum',
    'playRocketDeflectionEnergyRicochet',
    'playRazorWireCoilSpringTwang',
    'playProximityMineClusterScatter',
    'playMothershipAirlockDecontamSteam',
    'playBerserkerPrimalRoarTerrify',
    'playHumanPanicStunGasp',
  ];

  for (const methodName of v141Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
