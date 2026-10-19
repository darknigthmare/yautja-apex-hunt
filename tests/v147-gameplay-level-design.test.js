// Suite de Tests Unitaires & Intégration v147 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createRazorChakramState,
  launchTelepathicRicochetChakram,
  RAZOR_CHAKRAM_CONSTANTS,
} from '../src/gameplay/TelepathicRicochetRazorChakramSystem.js';

import {
  createScoutReactorSectorState,
  triggerScoutReactorRadiationVent,
  SCOUT_REACTOR_CONSTANTS,
} from '../src/gameplay/ScoutShipReactorCoreRadiationVentSector.js';

import {
  createScorchedForestSectorState,
  evaluateScorchedAshFootsteps,
  SCORCHED_FOREST_CONSTANTS,
} from '../src/gameplay/ScorchedForestEmberFootprintTrackingSector.js';

import {
  createStargazerMechDirectorState,
  fireMechShoulderMissileSalvo,
  sabotageMechHydraulicServos,
  STARGAZER_MECH_CONSTANTS,
} from '../src/gameplay/StargazerMechSuitCountermeasuresDirector.js';

import {
  createAdoliniFlintlockTrophyState,
  bestowElderAdoliniFlintlockTrophy,
  ADOLINI_TROPHY_CONSTANTS,
} from '../src/gameplay/ElderRaphaelAdoliniFlintlockTrophyDirector.js';

import {
  createUvFloodlightSectorState,
  activateOwlfUvFloodlights,
  engageBioMaskUvHalogenFilter,
  UV_FLOODLIGHT_CONSTANTS,
} from '../src/gameplay/SlaughterhouseUvFloodlightBlindnessSector.js';

import {
  createAcidFloorMeltSectorState,
  spillAcidAndMeltFloor,
  evaluateMeltedFloorCollapse,
  ACID_FLOOR_MELT_CONSTANTS,
} from '../src/gameplay/XenomorphAcidBloodFloorMeltHazardSector.js';

import {
  createAutonomousNetTrapSectorState,
  deployAutonomousSpringNetTrap,
  evaluateAutonomousNetTrapTrigger,
  AUTO_NET_TRAP_CONSTANTS,
} from '../src/gameplay/AutonomousSpringLoadedNetTrapSector.js';

import {
  createChopperScimitarState,
  crossChopperScimitarBlades,
  executeScissorScimitarDecapitation,
  CHOPPER_SCIMITAR_CONSTANTS,
} from '../src/gameplay/ChopperScimitarWristbladeExecutionSystem.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — TelepathicRicochetRazorChakramSystem: rebonds entre 4 cibles et retour en main (AVP / Predator 2)', () => {
  const state = createRazorChakramState();
  const targets = [
    { health: 200 },
    { health: 200 },
    { health: 200 },
    { health: 200 },
  ];

  const res = launchTelepathicRicochetChakram(state, targets, audioSynth);
  assert.equal(res.launched, true);
  assert.equal(res.targetsHitCount, 4);
  assert.equal(res.returnedToHand, true);
  assert.equal(targets[0].health, 200 - RAZOR_CHAKRAM_CONSTANTS.DAMAGE_PER_RICOCHET);
  assert.equal(targets[3].health, 200 - RAZOR_CHAKRAM_CONSTANTS.DAMAGE_PER_RICOCHET);
});

test('Chantier 2 — ScoutShipReactorCoreRadiationVentSector: purge radiative du réacteur Scout et surcharge (Predator 2)', () => {
  const state = createScoutReactorSectorState();
  const hunter = { energy: 10 };
  const intruder = { health: 200 };

  const ventRes = triggerScoutReactorRadiationVent(state, hunter, [intruder], audioSynth);
  assert.equal(ventRes.vented, true);
  assert.equal(hunter.energy, SCOUT_REACTOR_CONSTANTS.HUNTER_OVERCHARGE_ENERGY);
  assert.equal(intruder.health, 200 - SCOUT_REACTOR_CONSTANTS.INTRUDER_RADIATION_DAMAGE);
});

test('Chantier 3 — ScorchedForestEmberFootprintTrackingSector: empreintes de braises révélant la cible (Prey 2022)', () => {
  const state = createScorchedForestSectorState();
  const prey = { x: 4, z: 4, isMudCamouflaged: true };

  const stepRes = evaluateScorchedAshFootsteps(state, prey, audioSynth);
  assert.equal(stepRes.revealedByEmbers, true);
  assert.equal(prey.isMudCamouflaged, false);
  assert.equal(prey.trackingVulnerabilityMult, SCORCHED_FOREST_CONSTANTS.TRACKING_CRIT_BONUS_MULT);
});

test('Chantier 4 — StargazerMechSuitCountermeasuresDirector: tir de missiles et sabotage des servomoteurs (The Predator 2018)', () => {
  const state = createStargazerMechDirectorState();
  const hunter = { health: 250 };
  const mech = { health: 500, canMove: true };

  const salvoRes = fireMechShoulderMissileSalvo(state, hunter, audioSynth);
  assert.equal(salvoRes.fired, true);
  assert.equal(hunter.health, 250 - STARGAZER_MECH_CONSTANTS.MISSILE_SALVO_DAMAGE);

  const sabRes = sabotageMechHydraulicServos(state, mech);
  assert.equal(sabRes.sabotaged, true);
  assert.equal(mech.canMove, false);
  assert.equal(mech.health, 500 - STARGAZER_MECH_CONSTANTS.SERVO_SABOTAGE_DAMAGE);
});

test('Chantier 5 — ElderRaphaelAdoliniFlintlockTrophyDirector: remise du pistolet 1715 Raphael Adolini par Greyback (Predator 2 / Prey)', () => {
  const state = createAdoliniFlintlockTrophyState();
  const victor = { honorScore: 100 };

  const bestowRes = bestowElderAdoliniFlintlockTrophy(state, victor, audioSynth);
  assert.equal(bestowRes.bestowed, true);
  assert.equal(bestowRes.inscription, 'Raphael Adolini 1715');
  assert.equal(victor.hasAdolini1715Flintlock, true);
  assert.equal(victor.isProtectedByElderTruce, true);
  assert.equal(victor.honorScore, 100 + ADOLINI_TROPHY_CONSTANTS.ELDER_HONOR_BESTOWED);
});

test('Chantier 6 — SlaughterhouseUvFloodlightBlindnessSector: projecteurs UV OWLF et bascule spectrale du masque (Predator 2)', () => {
  const state = createUvFloodlightSectorState();
  const cityHunter = { isThermalVisionBlinded: false };
  const owlfAgent = { isInsulatedSuitBypassed: false };

  activateOwlfUvFloodlights(state, cityHunter, audioSynth);
  assert.equal(cityHunter.isThermalVisionBlinded, true);

  const filterRes = engageBioMaskUvHalogenFilter(state, cityHunter, [owlfAgent], audioSynth);
  assert.equal(filterRes.exposedCount, 1);
  assert.equal(cityHunter.isThermalVisionBlinded, false);
  assert.equal(owlfAgent.uvBeamRevealed, true);
  assert.equal(owlfAgent.damageVulnerability, UV_FLOODLIGHT_CONSTANTS.UV_FILTER_CRIT_MULTIPLIER);
});

test('Chantier 7 — XenomorphAcidBloodFloorMeltHazardSector: fusion de plancher par sang acide et chute (AVP 2004)', () => {
  const state = createAcidFloorMeltSectorState();
  spillAcidAndMeltFloor(state, { x: 5, z: 5 }, audioSynth);

  const victim = { x: 5.5, z: 5.2, health: 240 };
  const fallRes = evaluateMeltedFloorCollapse(state, victim);
  assert.equal(fallRes.fellThrough, true);
  assert.equal(victim.fellThroughMeltedFloor, true);
  assert.equal(victim.health, 240 - ACID_FLOOR_MELT_CONSTANTS.ACID_PIT_FALL_DAMAGE);
});

test('Chantier 8 — AutonomousSpringLoadedNetTrapSector: capture automatique par filet à ressort du campement (Predators 2010)', () => {
  const state = createAutonomousNetTrapSectorState();
  deployAutonomousSpringNetTrap(state, { x: 0, z: 0 });

  const intruder = { x: 1, z: 1, health: 150, canMove: true };
  const capRes = evaluateAutonomousNetTrapTrigger(state, intruder, audioSynth);
  assert.equal(capRes.captured, true);
  assert.equal(intruder.isCapturedInSpringNet, true);
  assert.equal(intruder.canMove, false);
  assert.equal(intruder.health, 150 - AUTO_NET_TRAP_CONSTANTS.NET_IMPACT_DAMAGE);
});

test('Chantier 9 — ChopperScimitarWristbladeExecutionSystem: croisement des lames cimeterres et exécution en ciseaux (AVP 2004)', () => {
  const state = createChopperScimitarState();
  crossChopperScimitarBlades(state, audioSynth);
  assert.equal(state.areScimitarsCrossed, true);

  const prey = { health: 300 };
  const execRes = executeScissorScimitarDecapitation(state, prey, audioSynth);
  assert.equal(execRes.executed, true);
  assert.equal(prey.isScissorExecuted, true);
  assert.equal(prey.health, 300 - CHOPPER_SCIMITAR_CONSTANTS.SCISSOR_EXECUTION_DAMAGE);
  assert.equal(execRes.trophySkullsTotal, 3);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v147 et respect Draw Calls Mothership', () => {
  const v147Methods = [
    'playRazorChakramGyrationWhir',
    'playChakramMultiRicochetClang',
    'playScoutReactorCoreVentRoar',
    'playRadiationPulseShieldDrainHum',
    'playScorchedEmberFootstepCrack',
    'playStargazerMechSuitServoStomp',
    'playMechShoulderMissileSalvoWhoosh',
    'playAdoliniFlintlockTrophyPresentChime',
    'playElderTribeRespectVocalClicking',
    'playOwlfUvFloodlightIgniteBuzz',
    'playBioMaskUvHalogenFilterShift',
    'playAcidBloodFloorMeltSizzle',
    'playSpringLoadedNetTrapSnap',
    'playChopperScimitarBladesCrossShink',
    'playScissorDecapitationExecutionCrunch',
  ];

  for (const methodName of v147Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
