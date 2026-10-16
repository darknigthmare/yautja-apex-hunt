import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  SUBWAY_CONSTANTS,
  LIGHT_PHASES,
  createSubwayCarriageState,
  updateSubwayCarriage,
  evaluateSubwayAimAccuracy,
} from '../src/gameplay/SubwayCarriageStrobeSector.js';
import {
  BONE_MASK_CONSTANTS,
  createFeralBoneMaskState,
  detachBoneMask,
  reattachBoneMask,
  reorientDetachedMask,
  computeHomingTargetPoint,
} from '../src/gameplay/FeralBoneMaskGuidanceSystem.js';
import {
  PLANT_HAZARD_CONSTANTS,
  createGamePreservePlantState,
  triggerPlantRupture,
  harvestPlantVenom,
  coatBladeWithNeurotoxin,
  updateGamePreservePlants,
} from '../src/gameplay/GamePreservePlantHazardSector.js';
import {
  PREDALIEN_CONSTANTS,
  createPredalienImplantationState,
  beginOralOvipositorImplantation,
  updatePredalienImplantation,
  applyBlueSolventCleansing,
} from '../src/gameplay/PredalienChestbursterImpregnation.js';
import {
  MUD_CAMO_CONSTANTS,
  createThermalMudWallowState,
  wallowInMud,
  washMudOff,
  updateMudCamouflage,
} from '../src/gameplay/ThermalInvisibilityMudWallowing.js';
import {
  HOUND_COMMANDS,
  WHISTLE_CONSTANTS,
  createHoundWhistleState,
  registerHoundToPack,
  issueHoundOrder,
  updateHoundWhistleSystem,
} from '../src/gameplay/PredatorHoundWhistleSystem.js';
import {
  DAGGER_CONSTANTS,
  createCeremonialDaggerState,
  drawCeremonialDagger,
  executeDaggerCarveOrSever,
  attemptInnerJawParry,
  updateCeremonialDagger,
} from '../src/gameplay/CeremonialDaggerDecapitation.js';
import {
  CEMETERY_CONSTANTS,
  createCemeterySectorState,
  evaluateFogVisibility,
  executePerchDropAmbush,
} from '../src/gameplay/CemeteryAmbushOverlookSector.js';
import {
  DRONE_MODES,
  FALCON_PERCH_CONSTANTS,
  createFalconDronePerchState,
  orderDroneToPerch,
  orderDroneRecall,
  updateFalconDronePerchDirector,
} from '../src/gameplay/FalconDronePerchDirector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Rame de métro stroboscopique et déport d\'inertie (Lore 1:1 Predator 2)', () => {
  const state = createSubwayCarriageState();
  assert.equal(state.isTrainInMotion, true);
  assert.equal(state.currentPhase, LIGHT_PHASES.STROBE_FLASH);

  // Mise à jour de l'oscillation des rails
  updateSubwayCarriage(state, 0.5, audioSynth);
  assert.ok(Math.abs(state.swayOffset) > 0, 'Le roulis latéral doit s\'appliquer');
  assert.ok(state.handStrapNodes[0].swayAngle !== 0);

  // Transition vers la phase PITCH_BLACK
  updateSubwayCarriage(state, SUBWAY_CONSTANTS.STROBE_CYCLE_INTERVAL, audioSynth);
  assert.equal(state.currentPhase, LIGHT_PHASES.PITCH_BLACK);
  assert.equal(state.hunterVisibilityModifier, 0.01);

  // Évaluation de la précision de tir avec la gîte du wagon
  const accuracy = evaluateSubwayAimAccuracy(state, true);
  assert.ok(accuracy < 1.0, 'La précision doit être pénalisée par l\'obscurité et les secousses');
});

test('Chantier 2 — Masque d\'os Feral, découplage laser et risque d\'auto-guidage (Lore 1:1 Prey 2022)', () => {
  const state = createFeralBoneMaskState();
  const hunterPos = { x: 0, y: 1.5, z: 0 };
  const hunterAim = { x: 0, y: 0, z: -1 };

  // Guidage normal avec masque fixé sur le crâne
  const initialTarget = computeHomingTargetPoint(state, hunterPos, hunterAim);
  assert.equal(initialTarget.isDecoupled, false);
  assert.equal(state.isAttachedToHunter, true);

  // Décrochage du masque suite à un impact de corps-à-corps
  const groundPos = { x: 2.0, y: 0.1, z: -4.0 };
  const maskAim = { x: -1.0, y: 0.5, z: 1.5 }; // Le masque au sol pointe vers le chasseur
  const detached = detachBoneMask(state, groundPos, maskAim, audioSynth);
  assert.equal(detached, true);
  assert.equal(state.isDecoupled, true);

  // Re-calcul du ciblage : les projectiles guidés se dirigent désormais vers le faisceau du masque au sol
  const decoupledTarget = computeHomingTargetPoint(state, hunterPos, hunterAim);
  assert.equal(decoupledTarget.isDecoupled, true);

  // Orientation du masque au sol directement vers la tête du chasseur
  reorientDetachedMask(state, groundPos, { x: -2.0, y: 1.4, z: 4.0 });
  const selfTargetCheck = computeHomingTargetPoint(state, hunterPos, hunterAim);
  assert.equal(selfTargetCheck.isDecoupled, true);

  // Re-fixation du masque
  reattachBoneMask(state, audioSynth);
  assert.equal(state.isAttachedToHunter, true);
  assert.equal(state.isDecoupled, false);
});

test('Chantier 3 — Flore neurotoxique de la planète réserve et enduction de lame (Lore 1:1 Predators 2010)', () => {
  const state = createGamePreservePlantState();
  assert.equal(state.plantNodes.length, 3);

  // Piétinement d'un bulbe par un commando
  const soldier = {
    id: 'nikolai_spetsnaz',
    x: -14.0,
    y: 0,
    z: -25.0,
    health: 100,
    neurotoxinPoison: 0,
  };

  updateGamePreservePlants(state, 0.1, [soldier], audioSynth);
  assert.equal(state.plantNodes[0].isRuptured, true);
  assert.equal(state.activeGasClouds.length, 1);

  // Séjour dans le nuage neurotoxique : paralysie
  updateGamePreservePlants(state, 4.0, [soldier], audioSynth);
  assert.ok(soldier.neurotoxinPoison > 50.0);
  assert.equal(soldier.moveSpeedModifier, 0.5);

  // Récolte de sève et enduction de lame
  const doses = harvestPlantVenom(state, 'plant_cluster_2');
  assert.equal(doses, PLANT_HAZARD_CONSTANTS.HARVEST_VENOM_AMOUNT);
  const coated = coatBladeWithNeurotoxin(state);
  assert.equal(coated, true);
  assert.equal(state.coatedBladeCharges, 2);
});

test('Chantier 4 — Implantation directe d\'ovipositeur et éclosion Prédalien (Lore 1:1 AVP:R 2007)', () => {
  const state = createPredalienImplantationState();
  const predalienPos = { x: 5, y: 0, z: 5 };
  const civilianHost = {
    id: 'pregnant_patient',
    species: 'human',
    x: 6,
    y: 0,
    z: 5,
    health: 70,
  };

  // Saisie et insertion buccale directe d'embryons
  const grab = beginOralOvipositorImplantation(state, predalienPos, civilianHost, audioSynth);
  assert.equal(grab, true);
  assert.equal(state.isImplanting, true);

  // Achèvement de la canalisation
  updatePredalienImplantation(state, PREDALIEN_CONSTANTS.IMPLANT_CHANNEL_TIME + 0.1, audioSynth);
  assert.equal(civilianHost.isImpregnated, true);
  assert.equal(civilianHost.embryoCount, 3);
  assert.equal(state.activeIncubations.length, 1);

  // Éclosion massive après gestation
  const bursters = updatePredalienImplantation(state, PREDALIEN_CONSTANTS.GESTATION_DURATION + 0.1, audioSynth);
  assert.equal(bursters.length, 3);
  assert.equal(civilianHost.isDead, true);
  assert.equal(state.totalHostsBurst, 1);

  // Test de décontamination par solvent bleu
  const curedHost = { id: 'cured_patient', species: 'human', isImpregnated: true, embryoCount: 3 };
  state.activeIncubations.push({ host: curedHost, timeRemaining: 5.0, embryoCount: 3 });
  const cleaned = applyBlueSolventCleansing(state, curedHost);
  assert.equal(cleaned, true);
  assert.equal(curedHost.isImpregnated, false);
});

test('Chantier 5 — Camouflage de boue fluviale et blocage spectral infrarouge (Lore 1:1 Predator 1987)', () => {
  const state = createThermalMudWallowState();
  assert.equal(state.isCovered, false);

  // Enrobage dans la glaise du lit de rivière
  wallowInMud(state, audioSynth);
  assert.equal(state.isCovered, true);
  assert.equal(state.mudLayerThickness, 100.0);
  assert.equal(state.thermalSignature, MUD_CAMO_CONSTANTS.THERMAL_SIGNATURE_FRESH);

  // Séchage naturel sans effort
  updateMudCamouflage(state, 10.0, false, false, false, audioSynth);
  assert.ok(state.mudLayerThickness < 100.0);
  assert.ok(state.thermalSignature > MUD_CAMO_CONSTANTS.THERMAL_SIGNATURE_FRESH);

  // Séchage accéléré par sprint
  updateMudCamouflage(state, 15.0, true, false, false, audioSynth);
  assert.ok(state.mudLayerThickness <= 50.0);

  // Immersion dans un cours d'eau : rinçage instantané
  updateMudCamouflage(state, 1.0, false, false, true, audioSynth);
  assert.equal(state.isCovered, false);
  assert.equal(state.thermalSignature, 1.0);
});

test('Chantier 6 — Sifflet ultrasonique de meute et manœuvres en tenaille (Lore 1:1 The Predator 2018)', () => {
  const state = createHoundWhistleState();
  const houndAlpha = { id: 'hound_1', isDead: false };
  const houndBeta = { id: 'hound_2', isDead: false };

  registerHoundToPack(state, houndAlpha);
  registerHoundToPack(state, houndBeta);
  assert.equal(state.managedHounds.length, 2);

  const hunterPos = { x: 0, y: 0, z: 0 };
  const targetPos = { x: 0, y: 0, z: 20 };

  // Ordre FLANK : encerclement en tenaille
  const issued = issueHoundOrder(state, HOUND_COMMANDS.FLANK, targetPos, hunterPos, audioSynth);
  assert.equal(issued, true);
  assert.equal(houndAlpha.behaviorMode, 'pincer_flank');
  assert.equal(houndBeta.behaviorMode, 'pincer_flank');
  assert.ok(houndAlpha.targetVector.x !== houndBeta.targetVector.x, 'Les deux molosses doivent diverger de chaque côté');

  // Cooldown de commande
  updateHoundWhistleSystem(state, 2.5);
  assert.equal(state.commandCooldown, 0);

  // Ordre RALLY : repli défensif au pied du maître
  issueHoundOrder(state, HOUND_COMMANDS.RALLY, null, hunterPos, audioSynth);
  assert.equal(houndAlpha.behaviorMode, 'guard');
});

test('Chantier 7 — Dague cérémoniale au mollet, contre-parade CQC et scalp (Lore 1:1 AVP 2004)', () => {
  const state = createCeremonialDaggerState();
  const hunterPos = { x: 0, y: 0, z: 0 };

  // Dégainement réflexe depuis le fourreau de mollet
  drawCeremonialDagger(state, audioSynth);
  assert.equal(state.isDrawn, true);
  assert.equal(state.parryWindowActive, true);

  // Contre-parade d'un coup de mâchoire interne de Xénomorphe
  const parrySuccess = attemptInnerJawParry(state, 'inner_jaw_strike');
  assert.equal(parrySuccess, true);
  assert.equal(state.successfulParriesCount, 1);
  assert.equal(state.parryWindowActive, false); // Fenêtre consommée

  // Section d'un Facehugger agrippé
  const facehugger = { id: 'hugger_ambush', isFacehugger: true, health: 15, x: 0.5, y: 0, z: 0 };
  const severResult = executeDaggerCarveOrSever(state, hunterPos, facehugger, audioSynth);
  assert.equal(severResult.action, 'facehugger_severed');
  assert.equal(facehugger.isDead, true);
  assert.equal(state.facehuggersSeveredCount, 1);

  // Découpe cérémoniale de la calotte crânienne d'un guerrier à terre
  const downedXeno = { id: 'downed_warrior', isStunned: true, health: 30, x: 0.8, y: 0, z: 0 };
  const carveResult = executeDaggerCarveOrSever(state, hunterPos, downedXeno, audioSynth);
  assert.equal(carveResult.action, 'ritual_carve');
  assert.equal(downedXeno.isDecapitated, true);
  assert.equal(state.trophiesCarvedCount, 1);
});

test('Chantier 8 — Embuscade du cimetière dans la brume et saut plongeant (Lore 1:1 Predator 2)', () => {
  const cemetery = createCemeterySectorState();
  assert.equal(cemetery.perchNodes.length, 3);

  const perchHunterPos = { x: 0, y: 6.8, z: -15.0 }; // Perché sur le toit du mausolée
  const groundTargetPos = { x: 0.5, y: 0, z: -14.5 };
  const groundCopPos = { x: 15.0, y: 0, z: -14.5 };

  // Vue plongeante dégagée depuis le perchoir au-dessus de la nappe de brouillard
  const elevatedVis = evaluateFogVisibility(cemetery, perchHunterPos, groundTargetPos);
  assert.equal(elevatedVis, 1.0);

  // Vue obstruée entre deux acteurs au sol dans la brume
  const groundVis = evaluateFogVisibility(cemetery, groundCopPos, groundTargetPos);
  assert.ok(groundVis < 0.25, 'La visibilité au sol dans la brume doit être fortement réduite');

  // Attaque plongeante surprise depuis le toit du mausolée
  const copTarget = { id: 'jerry_lambert', x: 0.5, y: 0, z: -14.5, health: 120 };
  const ambushResult = executePerchDropAmbush(cemetery, perchHunterPos, copTarget);
  assert.ok(ambushResult);
  assert.equal(ambushResult.success, true);
  assert.equal(copTarget.isKnockedProne, true);
  assert.equal(copTarget.health, 120 - CEMETERY_CONSTANTS.AMBUSH_DROP_DAMAGE_BONUS);
  assert.equal(cemetery.ambushKillsExecuted, 1);
});

test('Chantier 9 — Perchage et relais radar du drone Falcon (Lore 1:1 Predators 2010)', () => {
  const state = createFalconDronePerchState();
  assert.equal(state.mode, DRONE_MODES.FLIGHT_RECON);

  // Ordre de perchage sur une haute cime d'arbre (+14m)
  const branchPerch = { x: 10.0, y: 14.0, z: -20.0, id: 'high_canopy_branch' };
  const parked = orderDroneToPerch(state, branchPerch, audioSynth);
  assert.equal(parked, true);
  assert.equal(state.mode, DRONE_MODES.PERCHED_SURVEILLANCE);
  assert.equal(state.telemetryRelayActive, true);

  // Émission du ping radar automatique toutes les 3 secondes
  const targets = [
    { id: 'guerrilla_sniper', x: 15.0, y: 1.0, z: -25.0, threatLevel: 'high' },
    { id: 'distant_target',   x: 100.0, y: 1.0, z: -20.0, threatLevel: 'low' }, // Hors de portée (45m)
  ];

  updateFalconDronePerchDirector(state, FALCON_PERCH_CONSTANTS.RADAR_PING_INTERVAL + 0.1, targets, audioSynth);
  assert.equal(state.totalPingsEmitted, 1);
  assert.equal(state.spottedPreyList.length, 1);
  assert.equal(state.spottedPreyList[0].id, 'guerrilla_sniper');
  assert.equal(targets[0].isTargetPainted, true);

  // Rappel du drone
  orderDroneRecall(state);
  assert.equal(state.mode, DRONE_MODES.RETURNING);
  assert.equal(state.telemetryRelayActive, false);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v129 et conformité Draw Calls Mothership', () => {
  const v129AudioMethods = [
    'playSubwayFluorescentHum',
    'playStrobeFlickerClick',
    'playBoneMaskClickChirp',
    'playMaskDetachedWhistle',
    'playNeurotoxinPodBurst',
    'playParalyticHiss',
    'playPredalienOvipositorHiss',
    'playMultiBursterSqueal',
    'playMudWallowSquelch',
    'playMudDryingCrackle',
    'playHoundWhistleHighPitch',
    'playHoundFlankBark',
    'playCeremonialDaggerDraw',
    'playChitinSeverChop',
    'playFalconPerchChirp',
  ];

  v129AudioMethods.forEach(method => {
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
