import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  SMART_DISC_STATES,
  SMART_DISC_CONSTANTS,
  createSmartDiscState,
  launchSmartDisc,
  recallSmartDisc,
  updateSmartDisc,
} from '../src/gameplay/SmartDiscGuidanceSystem.js';
import {
  FLARE_CONSTANTS,
  createFlareSystemState,
  igniteFlare,
  updateFlareSystem,
  isTargetObscuredByFlare,
} from '../src/gameplay/FlareDistractionSystem.js';
import {
  PLASMA_CHARGE_STAGES,
  CHARGE_CONSTANTS,
  createPlasmacasterChargeState,
  startChargingPlasma,
  updateChargingPlasma,
  releasePlasmaShot,
} from '../src/gameplay/PlasmacasterOverchargeSystem.js';
import {
  MIMICRY_PHRASES,
  createSoundMimicryState,
  broadcastMimicryVoice,
  updateMimicrySystem,
} from '../src/gameplay/SoundMimicrySystem.js';
import {
  CAMP_CONSTANTS,
  createGuerrillaCampSector,
  addFuelDrum,
  addWatchtower,
  detonateFuelDrum,
  damageWatchtower,
} from '../src/gameplay/GuerrillaCampLevelSector.js';
import {
  WHIP_CONSTANTS,
  createWolfWhipState,
  performWhipSweep,
  attachWhipGrapple,
  updateWhipGrapple,
  releaseWhipGrapple,
} from '../src/gameplay/WolfWhipSystem.js';
import {
  CLEANER_CONSTANTS,
  createCleanerProtocolState,
  registerEvidenceTrace,
  deploySolventVial,
  updateCleanerProtocol,
  calculateCleanerHonorRating,
} from '../src/gameplay/SolventCleanerSystem.js';
import {
  SUBWAY_CONSTANTS,
  createSubwayTrainSector,
  triggerEmergencyBrake,
  toggleRooftopHatch,
  updateSubwayTrainSector,
  isStrobeDisorienting,
} from '../src/gameplay/SubwayTrainLevelSector.js';
import {
  WILDERNESS_CONSTANTS,
  createComancheWildernessSector,
  updateRiverPhysics,
  damageBeaverDam,
  checkBoneMaskDeflection,
} from '../src/gameplay/ComancheWildernessSector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Smart Disc : Guidage laser multi-cibles et rappel magnétique (Lore 1:1 Predator 2)', () => {
  const disc = createSmartDiscState();
  assert.equal(disc.state, SMART_DISC_STATES.HOLSTERED);

  const origin = { x: 0, y: 1.5, z: 0 };
  const target1 = { x: 10, y: 1.5, z: 0, id: 'target_1', health: 100 };
  const target2 = { x: 15, y: 1.5, z: 5, id: 'target_2', health: 100 };

  const launched = launchSmartDisc(disc, origin, [target1, target2], audioSynth);
  assert.equal(launched, true);
  assert.equal(disc.state, SMART_DISC_STATES.FLIGHT);

  // Vol offensif vers cible 1
  updateSmartDisc(disc, 0.35, origin, [target1, target2], audioSynth);
  assert.ok(target1.health < 100, 'La première cible a été tranchée');

  // Rappel magnétique vers le gantelet Yautja
  recallSmartDisc(disc);
  assert.equal(disc.state, SMART_DISC_STATES.RETURNING);

  // Capture finale dans la paume
  disc.position = { x: 0.5, y: 1.5, z: 0.5 };
  updateSmartDisc(disc, 0.1, origin, [], audioSynth);
  assert.equal(disc.state, SMART_DISC_STATES.HOLSTERED);
});

test('Chantier 2 — Fusées éclairantes au phosphore & Éblouissement infrarouge (Lore 1:1)', () => {
  const flareSystem = createFlareSystemState();
  const flare = igniteFlare(flareSystem, { x: 5, y: 0, z: 5 }, { duration: 15.0 }, audioSynth);

  assert.ok(flare);
  assert.equal(flareSystem.flares.length, 1);

  // Chasseur en vision thermique infrarouge à proximité de la fusée
  const mockBiomask = {
    position: { x: 6, y: 0, z: 5 },
    currentMode: 'thermal',
  };

  updateFlareSystem(flareSystem, 0.5, mockBiomask, audioSynth);
  assert.ok(flareSystem.activeThermalBloom > 0.7, 'Le capteur thermique est ébloui par le phosphore');
  assert.equal(flareSystem.forcedVisionSwitchNeeded, true);

  // Si le joueur passe en vision Tech ou Neuro, l'éblouissement disparaît
  mockBiomask.currentMode = 'tech_em';
  updateFlareSystem(flareSystem, 0.5, mockBiomask, audioSynth);
  assert.equal(flareSystem.activeThermalBloom, 0);

  // Vérification de masquage de proie
  const hiddenTarget = { x: 5.5, y: 0, z: 5.2 };
  assert.equal(isTargetObscuredByFlare(flareSystem, hiddenTarget), true);
});

test('Chantier 3 — Plasmacaster : Charge de condensateur et décharge surcadencée (Lore 1:1)', () => {
  const chargeState = createPlasmacasterChargeState();
  assert.equal(chargeState.stage, PLASMA_CHARGE_STAGES.IDLE);

  // Énergie insuffisante refusée
  const failedStart = startChargingPlasma(chargeState, 5.0, audioSynth);
  assert.equal(failedStart, false);

  // Démarrage de charge avec énergie suffisante
  const started = startChargingPlasma(chargeState, 50.0, audioSynth);
  assert.equal(started, true);
  assert.equal(chargeState.stage, PLASMA_CHARGE_STAGES.CHARGING);

  // Montée en charge optimale (1.8s)
  updateChargingPlasma(chargeState, 1.85);
  assert.equal(chargeState.stage, PLASMA_CHARGE_STAGES.OPTIMAL);
  assert.equal(chargeState.chargeRatio, 1.0);

  // Tir de plasma surcadencé
  const shot = releasePlasmaShot(chargeState, audioSynth);
  assert.ok(shot);
  assert.equal(shot.isOvercharged, true);
  assert.ok(shot.damage >= 250);
  assert.ok(shot.blastRadius >= 5.0);
  assert.equal(shot.armorPenetration, true);
  assert.equal(chargeState.stage, PLASMA_CHARGE_STAGES.IDLE);
});

test('Chantier 4 — Vocalisation mimétique spatiale & Leurre acoustique (Lore 1:1 Predator 1987)', () => {
  const mimicry = createSoundMimicryState();
  const guards = [
    { id: 'guard_1', x: 10, z: 0, isBackExposed: false },
    { id: 'guard_2', x: 25, z: 0 },
  ];

  // Diffusion de "Turn around..." à proximité du garde 1
  const decoy = broadcastMimicryVoice(mimicry, 'TURN_AROUND', { x: 8, z: 0 }, guards, audioSynth);
  assert.ok(decoy);
  assert.equal(guards[0].aiState, 'SPIN_REVEAL_BACK');
  assert.equal(guards[0].isBackExposed, true);

  // Cooldown actif
  assert.ok(mimicry.cooldownTimer > 0);
  assert.equal(broadcastMimicryVoice(mimicry, 'ANYTIME', { x: 0, z: 0 }, guards, audioSynth), null);

  // Décompte de cooldown
  updateMimicrySystem(mimicry, 5.0);
  assert.equal(mimicry.cooldownTimer, 0);
});

test('Chantier 5 — Camp de Guérilla de Val Verde : Fûts explosifs et miradors (Lore 1:1)', () => {
  const camp = createGuerrillaCampSector();
  const drum1 = addFuelDrum(camp, { x: 10, z: 10 });
  const drum2 = addFuelDrum(camp, { x: 13, z: 10 }); // Adjacent (détonation en chaîne)
  const tower = addWatchtower(camp, { x: 20, z: 20 });

  assert.equal(camp.fuelDrums.length, 2);
  assert.equal(camp.watchtowers.length, 1);

  // Détonation du premier fût de carburant
  const enemies = [{ id: 'rebel_soldier', x: 11, z: 10, health: 100 }];
  detonateFuelDrum(camp, drum1.id, enemies, audioSynth);

  assert.equal(drum1.isExploded, true);
  assert.equal(drum2.isExploded, true, 'Le second fût a explosé par réaction en chaîne');
  assert.ok(enemies[0].health < 100);

  // Écroulement du mirador de sniper
  damageWatchtower(camp, tower.id, 150, audioSynth);
  assert.equal(tower.isCollapsed, true);
  assert.equal(tower.hasSniper, false);
});

test('Chantier 6 — Fouet vertébral de Wolf & Grappin cinétique (Lore 1:1 AVP:R 2007)', () => {
  const whipState = createWolfWhipState();
  const xenomorphs = [
    { id: 'xeno_1', x: 2, y: 0, z: 2, health: 80 },
    { id: 'xeno_2', x: 3, y: 0, z: 3, health: 80 },
    { id: 'xeno_far', x: 20, y: 0, z: 20, health: 80 },
  ];

  // Balayage tranchant à 360°
  const hits = performWhipSweep(whipState, { x: 0, y: 0, z: 0 }, xenomorphs, audioSynth);
  assert.equal(hits.length, 2);
  assert.equal(xenomorphs[0].health, 0);
  assert.equal(whipState.totalSeveredEnemies, 2);

  // Utilisation en grappin de traction
  const anchorPoint = { x: 10, y: 8, z: 0 };
  const hunterPos = { x: 0, y: 0, z: 0 };
  const attached = attachWhipGrapple(whipState, anchorPoint, hunterPos, audioSynth);
  assert.equal(attached, true);
  assert.equal(whipState.isGrappled, true);

  // Traction vers le chevron
  updateWhipGrapple(whipState, 0.25, hunterPos);
  assert.ok(hunterPos.x > 0);
  assert.ok(hunterPos.y > 0);

  releaseWhipGrapple(whipState);
  assert.equal(whipState.isGrappled, false);
});

test('Chantier 7 — Nettoyeur forensique et solvant bleu dissolvant (Lore 1:1 AVP:R Wolf)', () => {
  const cleaner = createCleanerProtocolState();
  assert.equal(cleaner.remainingVials, 6);

  const corpse1 = { x: 5, y: 0, z: 5 };
  const corpse2 = { x: 25, y: 0, z: 25 };

  registerEvidenceTrace(cleaner, corpse1, 'xenomorph_corpse');
  registerEvidenceTrace(cleaner, corpse2, 'yautja_gear');
  assert.equal(cleaner.evidenceTraces.length, 2);

  // Déploiement de solvant sur le cadavre 1
  deploySolventVial(cleaner, { x: 5.2, y: 0, z: 5.1 }, audioSynth);
  assert.equal(cleaner.remainingVials, 5);

  // Dissolution complète
  updateCleanerProtocol(cleaner, 2.6);
  assert.equal(cleaner.evidenceTraces.length, 1);
  assert.equal(cleaner.dissolvedTracesCount, 1);

  // Évaluation de l'honneur de nettoyeur (50% nettoyé)
  assert.equal(calculateCleanerHonorRating(cleaner), 50);
});

test('Chantier 8 — Métro de Los Angeles 1990 : Rame mobile, stroboscope & frein d\'urgence (Lore 1:1)', () => {
  const subway = createSubwayTrainSector();
  assert.equal(subway.isMoving, true);
  assert.equal(subway.emergencyBrakePulled, false);

  // Clignotement stroboscopique
  updateSubwayTrainSector(subway, 0.35, [], audioSynth);
  assert.ok(subway.strobeFlashCount > 0);

  // Déclenchement du frein d'urgence
  const passengers = [{ id: 'commuter_1', isAnchored: false, isStaggered: false }];
  triggerEmergencyBrake(subway, audioSynth);
  assert.equal(subway.emergencyBrakePulled, true);

  // Arrêt complet et déséquilibre
  updateSubwayTrainSector(subway, 2.0, passengers, audioSynth);
  assert.equal(passengers[0].isStaggered, true);
  assert.equal(subway.isMoving, false);
  assert.equal(subway.lightsPowered, false);
});

test('Chantier 9 — Territoire Comanche 1719 : Rapides, barrage de castors et masque d\'os (Lore 1:1 Prey)', () => {
  const sector = createComancheWildernessSector();
  const swimmer = { x: 0, y: 0.2, z: 0, isAnchored: false, isInWater: false };

  // Entraînement par les rapides de la rivière
  updateRiverPhysics(sector, 1.0, [swimmer], audioSynth);
  assert.equal(swimmer.isInWater, true);
  assert.ok(swimmer.z > 4.0, 'Le courant a emporté le nageur vers les Z positifs');

  // Dégâts et rupture du barrage de castors
  damageBeaverDam(sector, 300, audioSynth);
  assert.equal(sector.beaverDam.isBreached, true);

  // Déviation par le masque d'os du Feral Predator (angle frontal <= 45°)
  assert.equal(checkBoneMaskDeflection(15), true);
  assert.equal(checkBoneMaskDeflection(80), false);
});

test('Chantier 10 — Synthèse audio des 15 méthodes et validation Draw Calls', () => {
  const newAudioMethods = [
    'playSmartDiscHum',
    'playSmartDiscCatch',
    'playFlareIgnition',
    'playFlareSizzle',
    'playPlasmaChargeUp',
    'playPlasmaOverchargeBlast',
    'playMimicryAnytime',
    'playFuelDrumExplode',
    'playWatchtowerCollapse',
    'playWhipCrack',
    'playWhipLatch',
    'playSolventSizzle',
    'playSubwayTrainRattle',
    'playSubwayBrakeScreech',
    'playRiverCurrentRush',
  ];

  newAudioMethods.forEach(method => {
    assert.equal(typeof audioSynth[method], 'function', `AudioSynth.${method} doit exister`);
  });

  // Vérification de l'invariant des Draw Calls
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});
