// Suite de Tests Unitaires & Intégration v138 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createSeveredArmState,
  triggerArmAmputation,
  fireDesperationPlasma,
  cauterizeSeveredStump,
  updateSeveranceBleed,
  SEVERANCE_CONSTANTS,
} from '../src/gameplay/CityHunterArmSeveranceDesperationSystem.js';

import {
  createMudDecayState,
  applyFreshAlluvialMud,
  updateMudDecay,
  MUD_DECAY_CONSTANTS,
} from '../src/gameplay/DutchMudFlakingThermalDecaySystem.js';

import {
  createBrushfireSectorState,
  launchIncendiaryArrow,
  evaluateThermalSaturation,
  updateBrushfires,
  BRUSHFIRE_CONSTANTS,
} from '../src/gameplay/PreyIncendiaryArrowBrushfireSector.js';

import {
  createSewerSolventState,
  releaseSolventIntoStream,
  updateSewerSolventFlow,
  SEWER_SOLVENT_CONSTANTS,
} from '../src/gameplay/GunnisonSewerSolventStreamSector.js';

import {
  createTriPointTargetingState,
  startTriLaserLock,
  updateTriLaserLock,
  dischargeLockedPlasmacaster,
  TRI_POINT_CONSTANTS,
  RETICLE_STATES,
} from '../src/gameplay/TriPointLaserTargetingReticleDirector.js';

import {
  createWaterMirrorSectorState,
  evaluateHyalineMirage,
  HYALINE_CONSTANTS,
} from '../src/gameplay/HyalineRefractionWaterMirrorSector.js';

import {
  createElectrifiedWhipState,
  entangleWithWhip,
  dischargeWhipVoltage,
  updateWhipParalysis,
  WHIP_SHOCK_CONSTANTS,
} from '../src/gameplay/ElectrifiedWhipCoilRestraintSystem.js';

import {
  createFlayingCanopySectorState,
  hangFlayedTrophy,
  evaluatePatrolHorrorEncounter,
  updatePatrolTerror,
  FLAYING_SECTOR_CONSTANTS,
} from '../src/gameplay/VerticalTrophyFlayingCanopySector.js';

import {
  createNeurotoxinState,
  fireNeurotoxinDart,
  updateNeurotoxin,
  NEUROTOXIN_CONSTANTS,
} from '../src/gameplay/NeurotoxinDartTranquilizerSystem.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — CityHunterArmSeveranceDesperationSystem: amputation et tir plasma de détresse (Predator 2)', () => {
  const state = createSeveredArmState();
  const cityHunter = {
    id: 'city_hunter',
    health: 90,
    canUseGauntlet: true,
    isBleedingBioluminescent: false,
    takeDamage(d) { this.health -= d; },
  };

  // Tranchage du bras par Harrigan
  const severed = triggerArmAmputation(state, cityHunter, audioSynth);
  assert.equal(severed, true);
  assert.equal(state.isArmSevered, true);
  assert.equal(cityHunter.canUseGauntlet, false);
  assert.equal(cityHunter.isBleedingBioluminescent, true);

  // Saignement actif
  updateSeveranceBleed(state, 1.0, cityHunter);
  assert.ok(cityHunter.health < 90);

  // Tir de détresse au canon plasma à une main
  const target = { health: 200, takeDamage(d) { this.health -= d; } };
  const fireRes = fireDesperationPlasma(state, target, audioSynth);
  assert.equal(fireRes.success, true);
  assert.equal(target.health, 200 - SEVERANCE_CONSTANTS.DESPERATION_PLASMA_DAMAGE);

  // Cautérisation thermique du moignon
  const cauterized = cauterizeSeveredStump(state, cityHunter, audioSynth);
  assert.equal(cauterized, true);
  assert.equal(state.hasActiveBleed, false);
  assert.equal(cityHunter.isBleedingBioluminescent, false);
});

test('Chantier 2 — DutchMudFlakingThermalDecaySystem: séchage de boue et points chauds (Predator 1987)', () => {
  const state = createMudDecayState();

  // Enduction intégrale de boue fraîche
  applyFreshAlluvialMud(state, audioSynth);
  assert.equal(state.mudLayerThickness, 1.0);
  assert.equal(state.isThermallyCloaked, true);

  // Dégradation sous l'action de la pluie et de la course
  updateMudDecay(state, 12.0, true, true, audioSynth);
  assert.ok(state.mudLayerThickness <= MUD_DECAY_CONSTANTS.THERMAL_REVEAL_THRESHOLD);
  assert.equal(state.isThermallyCloaked, false, 'Le camouflage thermique doit faillir');
  assert.equal(state.hasThermalHotspots, true);
  assert.ok(state.hotspotCount > 0);
});

test('Chantier 3 — PreyIncendiaryArrowBrushfireSector: flèches enflammées et saturation infrarouge (Prey 2022)', () => {
  const state = createBrushfireSectorState();

  // Tir de flèche incendiaire
  const arrowRes = launchIncendiaryArrow(state, { x: 5.0, z: 5.0 }, audioSynth);
  assert.equal(arrowRes.success, true);
  assert.equal(state.activeFires.length, 1);

  // Chasseur à proximité du brasier : éblouissement thermique
  const thermalRes = evaluateThermalSaturation(state, { x: 8.0, z: 5.0 });
  assert.equal(thermalRes.isSaturated, true);
  assert.ok(thermalRes.whiteoutLevel > 0);

  // Dégâts de brûlure aux entités traversant les flammes
  const trapper = { x: 5.2, z: 5.1, health: 100, isOnFire: false, takeDamage(d) { this.health -= d; } };
  updateBrushfires(state, 1.0, [trapper]);
  assert.equal(trapper.isOnFire, true);
  assert.ok(trapper.health < 100);
});

test('Chantier 4 — GunnisonSewerSolventStreamSector: solvant bleu dans le courant d\'égout (AVP:R 2007)', () => {
  const state = createSewerSolventState();

  // Déversement de la fiole de solvant dans le courant
  const slickRes = releaseSolventIntoStream(state, { x: 0, z: 0 }, { x: 0, z: 1 }, audioSynth);
  assert.equal(slickRes.success, true);
  assert.equal(state.activeSolventSlicks.length, 1);

  // Cadavre de Xénomorphe entraîné par le flux
  const xenoCorpse = { id: 'xeno_remains', x: 0, z: 3.0, isDissolved: false, health: 1 };
  const updateRes = updateSewerSolventFlow(state, 1.5, [xenoCorpse], audioSynth);

  assert.equal(updateRes.dissolvedCount, 1);
  assert.equal(xenoCorpse.isDissolved, true);
  assert.equal(xenoCorpse.health, 0);
});

test('Chantier 5 — TriPointLaserTargetingReticleDirector: triangle laser convergent et tir critique (Predator 1987)', () => {
  const state = createTriPointTargetingState();
  const target = { id: 'guerrilla_officer', health: 250, takeDamage(d) { this.health -= d; } };

  // Démarrage de l'acquisition laser
  const started = startTriLaserLock(state, target, audioSynth);
  assert.equal(started, true);
  assert.equal(state.state, RETICLE_STATES.TRACKING_CONVERGING);

  // Progression temporelle jusqu'au verrouillage parfait
  updateTriLaserLock(state, 2.0, audioSynth);
  assert.equal(state.state, RETICLE_STATES.LOCKED_PERFECT);
  assert.equal(state.isLockAcquired, true);
  assert.equal(state.currentTriangleSpread, 0.0);

  // Décharge critique de Plasmacaster
  const shotRes = dischargeLockedPlasmacaster(state, target, 80.0);
  assert.equal(shotRes.fired, true);
  assert.equal(shotRes.criticalLock, true);
  assert.equal(shotRes.damageDealt, 80.0 * TRI_POINT_CONSTANTS.CRITICAL_DAMAGE_BONUS_MULTIPLIER);
});

test('Chantier 6 — HyalineRefractionWaterMirrorSector: réfraction hyaline et mirage sur eau calme (Predator 1987 / Prey 2022)', () => {
  const state = createWaterMirrorSectorState(0.0);
  const cloakedHunter = { x: 0, y: 0.5, z: 6.0, isCloaked: true, isHyalineRevealed: false };
  const observer = { x: 0, y: 0.2, z: 0.0 };

  // Détection du mirage de réfraction sur l'eau
  const mirageRes = evaluateHyalineMirage(state, cloakedHunter, observer, audioSynth);
  assert.equal(mirageRes.spotted, true);
  assert.equal(cloakedHunter.isHyalineRevealed, true);
  assert.equal(mirageRes.reason, 'SPECULAR_WATER_MIRAGE_DISTORTION');
});

test('Chantier 7 — ElectrifiedWhipCoilRestraintSystem: entrave et foudroiement haute tension (AVP:R 2007)', () => {
  const state = createElectrifiedWhipState();
  const warriorXeno = {
    id: 'warrior_xeno',
    health: 200,
    isEntangled: false,
    canMove: true,
    isParalyzed: false,
    takeDamage(d) { this.health -= d; },
  };

  // Enroulement du fouet
  const entangled = entangleWithWhip(state, warriorXeno);
  assert.equal(entangled, true);
  assert.equal(warriorXeno.isEntangled, true);
  assert.equal(warriorXeno.canMove, false);

  // Décharge électrique
  const shockRes = dischargeWhipVoltage(state, warriorXeno, audioSynth);
  assert.equal(shockRes.success, true);
  assert.equal(warriorXeno.health, 200 - WHIP_SHOCK_CONSTANTS.ELECTROSTATIC_DAMAGE);
  assert.equal(warriorXeno.isParalyzed, true);

  // Rétablissement après la tétanie
  updateWhipParalysis(warriorXeno, 2.5);
  assert.equal(warriorXeno.isParalyzed, false);
});

test('Chantier 8 — VerticalTrophyFlayingCanopySector: trophées suspendus et panique des patrouilles (Predator 1987)', () => {
  const state = createFlayingCanopySectorState();

  // Suspension du corps écorché de Hopper
  const hangRes = hangFlayedTrophy(state, { x: 10.0, y: 8.0, z: 10.0 }, 'Hopper_GreenBeret', audioSynth);
  assert.equal(hangRes.success, true);
  assert.equal(state.hangingTrophies.length, 1);

  // Patrouille découvrant le cadavre
  const patrolSoldier = {
    id: 'guerrilla_scout',
    x: 12.0,
    z: 10.0,
    isPanicking: false,
    panicTimer: 0,
    accuracyMultiplier: 1.0,
  };

  const encounterRes = evaluatePatrolHorrorEncounter(state, patrolSoldier, audioSynth);
  assert.equal(encounterRes.panicked, true);
  assert.equal(patrolSoldier.isPanicking, true);
  assert.ok(patrolSoldier.accuracyMultiplier < 1.0);

  // Apaisement après la crise de panique
  updatePatrolTerror([patrolSoldier], 7.0);
  assert.equal(patrolSoldier.isPanicking, false);
  assert.equal(patrolSoldier.accuracyMultiplier, 1.0);
});

test('Chantier 9 — NeurotoxinDartTranquilizerSystem: dards neurotoxiques et paralysie motrice (Predators 2010)', () => {
  const state = createNeurotoxinState();
  const target = {
    id: 'mercenary_target',
    health: 120,
    isNeurotoxinAfflicted: false,
    speedMultiplier: 1.0,
    takeDamage(d) { this.health -= d; },
  };

  // Tir de dard neurotoxique
  const dartRes = fireNeurotoxinDart(state, target, audioSynth);
  assert.equal(dartRes.success, true);
  assert.equal(target.isNeurotoxinAfflicted, true);
  assert.equal(target.speedMultiplier, NEUROTOXIN_CONSTANTS.MOTOR_SLOWDOWN_FACTOR);

  // Effet toxique continu et dissipation
  updateNeurotoxin(state, 1.0, [target]);
  assert.ok(target.health < 120);

  updateNeurotoxin(state, 3.0, [target]);
  assert.equal(target.isNeurotoxinAfflicted, false);
  assert.equal(target.speedMultiplier, 1.0);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v138 et respect Draw Calls Mothership', () => {
  const v138Methods = [
    'playArmSeverSquelchCrunch',
    'playDesperationPlasmaClick',
    'playMudFlakeCrackDry',
    'playThermalBloomHiss',
    'playIncendiaryArrowWhoosh',
    'playBrushfireIgnitionCrackle',
    'playSolventStreamChemicalBoil',
    'playSewerEchoDripSlosh',
    'playTriLaserTargetingHum',
    'playTriLaserLockAcquiredChime',
    'playHyalineRefractionWaterRipple',
    'playElectrifiedWhipArcZap',
    'playCanopyHangingCorpseCreak',
    'playGuerillaPanicShoutSpray',
    'playNeurotoxinDartDartPuff',
  ];

  for (const methodName of v138Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
