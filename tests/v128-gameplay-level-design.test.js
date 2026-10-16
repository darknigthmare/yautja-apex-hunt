import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  HARPOON_WINCH_CONSTANTS,
  createHarpoonWinchState,
  fireTetheredHarpoon,
  engageWinchRetract,
  anchorOverheadPoint,
  updateHarpoonWinch,
  resetHarpoonState,
} from '../src/gameplay/HarpoonWinchSystem.js';
import {
  SONIC_MINE_CONSTANTS,
  createSonicMineState,
  deploySonicMine,
  updateSonicMines,
} from '../src/gameplay/SonicDisruptionMine.js';
import {
  HEARTBEAT_VISION_CONSTANTS,
  createPulsedHeartbeatVisionState,
  togglePulsedHeartbeatVision,
  updatePulsedHeartbeatVision,
} from '../src/gameplay/PulsedHeartbeatVisionDirector.js';
import {
  CRYO_CHAMBER_CONSTANTS,
  CRYO_STAGES,
  createQueenCryoChamberState,
  triggerDefrostCycle,
  restoreCryoInflow,
  updateQueenCryoChamber,
} from '../src/gameplay/QueenCryoChamberSector.js';
import {
  CARAPACE_CONSTANTS,
  createUpgradeCarapaceState,
  processCarapaceImpact,
} from '../src/gameplay/UpgradeCarapaceSystem.js';
import {
  ROTARY_GATLING_CONSTANTS,
  createRotaryPlasmaGatlingState,
  beginRotarySpool,
  triggerRotaryGatlingBurst,
  updateRotaryPlasmaGatling,
} from '../src/gameplay/RotaryPlasmaGatlingSystem.js';
import {
  ACID_TAIL_CONSTANTS,
  createAcidTailWhipState,
  executeTailWhipSlash,
  updateAcidTailSystem,
} from '../src/gameplay/AcidTailWhipDecapitation.js';
import {
  CLAN_GLYPHS,
  HUNTER_RANKS,
  createBloodRitualState,
  performAcidBrandingRitual,
  verifyBloodedPrivileges,
} from '../src/gameplay/BloodRitualScarringSystem.js';
import {
  MAYAN_PYRAMID_CONSTANTS,
  createMayanPyramidSectorState,
  evaluatePyramidElevation,
  checkStairTraversalHazard,
  activateSacrificialAltar,
} from '../src/gameplay/MayanPyramidOverlookSector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Harpon tracté avec treuil motorisé et pendaison verticale (Lore 1:1 Predator 2 / Prey)', () => {
  const state = createHarpoonWinchState();
  const origin = { x: 0, y: 1.5, z: 0 };
  const targetDir = { x: 0, y: 0, z: -1 };

  const fired = fireTetheredHarpoon(state, origin, targetDir, audioSynth);
  assert.equal(fired, true);
  assert.equal(state.isFired, true);
  assert.equal(state.remainingHarpoons, 2);

  const humanPrey = {
    id: 'guerilla_commando',
    x: 0,
    y: 1.5,
    z: -10,
    health: 100,
    collisionRadius: 1.2,
    takeDamage(dmg) { this.health -= dmg; },
  };

  // Progression du harpon jusqu'à la cible
  updateHarpoonWinch(state, 0.2, origin, [humanPrey], audioSynth); // 55m/s * 0.2 = 11m
  assert.equal(state.isAttachedToTarget, true);
  assert.equal(humanPrey.isHarpooned, true);
  assert.equal(humanPrey.health, 100 - HARPOON_WINCH_CONSTANTS.HARPOON_DAMAGE);

  // Ancrage en hauteur sur une branche et treuillage vertical
  anchorOverheadPoint(state, { x: 0, y: 8.0, z: -10 });
  engageWinchRetract(state, true, audioSynth);
  assert.equal(state.winchEngaged, true);

  // Mise à jour de la traction vers le haut
  updateHarpoonWinch(state, 1.0, origin, [humanPrey], audioSynth);
  assert.ok(humanPrey.y > 1.5, 'La proie doit être soulevée par le treuil motorisé');
});

test('Chantier 2 — Mine à disruption sonique haute fréquence & acouphène (Lore 1:1 AVP:R / Prey)', () => {
  const state = createSonicMineState();
  const mine = deploySonicMine(state, { x: 10, y: 0, z: 5 });
  assert.ok(mine);
  assert.equal(state.reserveCount, 3);
  assert.equal(mine.isArmed, false);

  // Armement après délai
  updateSonicMines(state, SONIC_MINE_CONSTANTS.ARMING_DELAY + 0.1, []);
  assert.equal(mine.isArmed, true);

  // Xénomorphe s'approchant : déclenchement et paralysie avec multiplicateur sensoriel crânien
  const xenoDrone = {
    id: 'xeno_warrior',
    species: 'xenomorph',
    x: 11,
    y: 0,
    z: 5,
    health: 120,
    takeDamage(dmg) { this.health -= dmg; },
  };

  const hunterPos = { x: 12, y: 1.5, z: 5 }; // Chasseur à portée
  const detonations = updateSonicMines(state, 0.1, [xenoDrone], hunterPos, audioSynth);

  assert.equal(detonations.length, 1);
  assert.equal(xenoDrone.isStunned, true);
  assert.ok(xenoDrone.stunTimer >= SONIC_MINE_CONSTANTS.DISORIENTATION_DURATION * SONIC_MINE_CONSTANTS.XENO_ANTENNA_STUN_MULT);
  assert.equal(state.tinnitusEffectActive, true);
  assert.ok(state.tinnitusTimer > 0);
});

test('Chantier 3 — Directeur de vision cardiaque pulsée Berserker (Lore 1:1 Predators 2010)', () => {
  const state = createPulsedHeartbeatVisionState();
  const activated = togglePulsedHeartbeatVision(state, true);
  assert.equal(activated, true);

  const hunterPos = { x: 0, y: 1.5, z: 0 };
  const hiddenSoldier = {
    id: 'mud_camouflaged_soldier',
    x: 15,
    y: 1.5,
    z: 0,
    isMudCovered: true,
    inCombat: true,
  };
  const synthAndroid = {
    id: 'weyland_synthetic',
    x: 10,
    y: 1.5,
    z: 0,
    isSynthetic: true,
  };

  // Progression de l'onde de pouls cardiaque
  updatePulsedHeartbeatVision(state, 0.6, hunterPos, [hiddenSoldier, synthAndroid], audioSynth);

  // L'onde détecte le soldat camouflé dans la boue grâce aux battements circulatoires
  assert.equal(state.detectedCirculatoryEchoes.length, 1);
  assert.equal(state.detectedCirculatoryEchoes[0].id, 'mud_camouflaged_soldier');
  assert.equal(state.detectedCirculatoryEchoes[0].isMudCovered, true);
  assert.ok(state.detectedCirculatoryEchoes[0].bpm >= 120, 'BPM élevé en combat');
});

test('Chantier 4 — Secteur Chambre Cryogénique de la Reine & chaînes d\'acier (Lore 1:1 AVP 2004)', () => {
  const state = createQueenCryoChamberState();
  assert.equal(state.stage, CRYO_STAGES.DEEP_FREEZE);
  assert.equal(state.liquidNitrogenLevel, 100.0);

  // Déclenchement du dégel d'urgence
  triggerDefrostCycle(state);
  assert.equal(state.nitrogenInjectorsActive, false);
  assert.equal(state.stage, CRYO_STAGES.THAWING);

  // Écoulement du temps : montée de la température et transition en Awakening
  updateQueenCryoChamber(state, 50.0, [], audioSynth);
  assert.equal(state.stage, CRYO_STAGES.AWAKENING);
  assert.ok(state.chainIntegrity < 100.0, 'Les chaînes subissent la tension des mouvements de la Reine');

  // Danger cryogénique au sol pour les entités traversant les vapeurs d'azote
  const explorer = {
    id: 'weyland_scientist',
    x: CRYO_CHAMBER_CONSTANTS.CHAMBER_CENTER.x,
    y: CRYO_CHAMBER_CONSTANTS.CHAMBER_CENTER.y,
    z: CRYO_CHAMBER_CONSTANTS.CHAMBER_CENTER.z,
    health: 80,
    takeDamage(dmg) { this.health -= dmg; },
  };

  updateQueenCryoChamber(state, 1.0, [explorer], audioSynth);
  assert.equal(explorer.isChilled, true);
  assert.ok(explorer.health < 80);
});

test('Chantier 5 — Carapace biomécanique renforcée et failles articulaires Assassin (Lore 1:1 The Predator 2018)', () => {
  const state = createUpgradeCarapaceState();

  // Tir frontal standard ricochant sur la cuirasse
  const frontHitVector = { x: 0, y: 0, z: -1 }; // Plein plastron
  const frontImpact = processCarapaceImpact(state, 100.0, frontHitVector, 'ballistic', audioSynth);
  assert.equal(frontImpact.isDeflected, true);
  assert.equal(frontImpact.isCritical, false);
  assert.equal(frontImpact.finalDamage, 15.0); // 100 - (100 * 0.85)

  // Frappe perforante ciblée sur l'interstice dorsal
  const dorsalHitVector = { x: 0, y: 0.2, z: 0.95 }; // Nuque / vertèbres dorsales
  const criticalImpact = processCarapaceImpact(state, 50.0, dorsalHitVector, 'combi_spear', audioSynth);
  assert.equal(criticalImpact.isCritical, true);
  assert.equal(criticalImpact.isDeflected, false);
  assert.equal(criticalImpact.finalDamage, 50.0 * CARAPACE_CONSTANTS.CRITICAL_WEAKPOINT_MULT);
  assert.equal(criticalImpact.weakpointId, 'dorsal_spine_gap');
});

test('Chantier 6 — Canon Gatling à plasma tri-fûts rotatif Berserker (Lore 1:1 Predators 2010)', () => {
  const state = createRotaryPlasmaGatlingState();
  const origin = { x: 0, y: 2.0, z: 0 };
  const targetDir = { x: 0, y: 0, z: -1 };

  // Démarrage de la rotation centrifuge
  beginRotarySpool(state, audioSynth);
  assert.equal(state.isSpooling, true);

  // Mise à jour de la montée en régime
  updateRotaryPlasmaGatling(state, ROTARY_GATLING_CONSTANTS.SPOOL_UP_TIME + 0.05, [], audioSynth);
  assert.equal(state.spoolProgress, 1.0);

  // Déclenchement de la rafale cyclique de 3 bolts
  const fired = triggerRotaryGatlingBurst(state, origin, targetDir, audioSynth);
  assert.equal(fired, true);
  assert.equal(state.firingBurstRemaining, ROTARY_GATLING_CONSTANTS.BURST_BOLT_COUNT);
  assert.ok(state.currentHeat >= ROTARY_GATLING_CONSTANTS.HEAT_PER_BURST);

  // Simulation de la séquence de tir des bolts
  const targetEnemy = {
    id: 'super_predator_hound',
    x: 0,
    y: 1.0,
    z: -8,
    health: 200,
    collisionRadius: 1.5,
    takeDamage(dmg) { this.health -= dmg; },
  };

  updateRotaryPlasmaGatling(state, 0.1, [targetEnemy], audioSynth);
  updateRotaryPlasmaGatling(state, 0.1, [targetEnemy], audioSynth);
  updateRotaryPlasmaGatling(state, 0.2, [targetEnemy], audioSynth);

  assert.ok(targetEnemy.health < 200, 'L\'ennemi doit subir les impacts de plasma');
});

test('Chantier 7 — Fouet caudal tranchant et projection d\'acide Nethead/Grid (Lore 1:1 AVP 2004)', () => {
  const state = createAcidTailWhipState();
  const origin = { x: 0, y: 1.5, z: 0 };
  const forwardDir = { x: 0, y: 0, z: 1 };

  const celticPredator = {
    id: 'celtic_young_blood',
    x: 0,
    y: 1.5,
    z: 2.5,
    health: 60,
    armorIntegrity: 100,
    takeDamage(dmg) { this.health -= dmg; },
  };

  const struck = executeTailWhipSlash(state, origin, forwardDir, [celticPredator], audioSynth);
  assert.equal(struck.length, 1);
  assert.equal(celticPredator.health, 60 - ACID_TAIL_CONSTANTS.WHIP_DAMAGE);
  assert.equal(celticPredator.isDecapitated, true); // Mort instantanée et décapitation
  assert.ok(state.acidPools.length > 0, 'Les flaques d\'acide sous pression doivent être générées');

  // Érosion de l'armure par les flaques acides
  updateAcidTailSystem(state, 1.0, [celticPredator]);
  assert.ok(celticPredator.armorIntegrity < 100);
});

test('Chantier 8 — Rite de scarification acide et promotion au rang "Blooded" (Lore 1:1 AVP 2004)', () => {
  const state = createBloodRitualState();
  assert.equal(state.currentRank, HUNTER_RANKS.YOUNG_BLOOD);
  assert.equal(state.isMarked, false);

  // Tentative avec trophée invalide
  const invalidTrophy = { name: 'Crâne humain', isXenomorphPart: false };
  const failResult = performAcidBrandingRitual(state, invalidTrophy);
  assert.equal(failResult.success, false);

  // Rite sacré avec doigt/pointe de queue imprégnée d'acide Xénomorphe
  const acidGlandTrophy = { name: 'Pointe caudale de Grid Alien', isXenomorphPart: true, type: 'acid_gland' };
  const successResult = performAcidBrandingRitual(state, acidGlandTrophy, 'glyph_scar', audioSynth);

  assert.equal(successResult.success, true);
  assert.equal(state.currentRank, HUNTER_RANKS.BLOODED);
  assert.equal(state.biomaskBranded, true);
  assert.equal(state.foreheadBranded, true);
  assert.equal(state.carvedGlyph.id, 'glyph_scar');
  assert.equal(state.totalSacredHonorBonus, 400);

  const privileges = verifyBloodedPrivileges(state);
  assert.equal(privileges.hasPrestigeStance, true);
  assert.equal(privileges.elderArmoryAccess, true);
});

test('Chantier 9 — Belvédère de la Pyramide Maya à degrés et risques de trébuchement (Lore 1:1 Predator / AVP)', () => {
  const state = createMayanPyramidSectorState();

  // Test de position au sommet de la pyramide (+28.5m)
  const summitPos = { x: 35.0, y: 28.5, z: -60.0 };
  const summitEval = evaluatePyramidElevation(summitPos);
  assert.equal(summitEval.isAtPinnacle, true);
  assert.equal(summitEval.isOnSteps, false);
  assert.equal(summitEval.altitude, MAYAN_PYRAMID_CONSTANTS.PINNACLE_ALTITUDE);
  assert.equal(summitEval.elevationBonus, MAYAN_PYRAMID_CONSTANTS.HIGH_GROUND_AIM_BONUS);

  // Test de position sur les marches inclinées à 48 degrés
  const stairPos = { x: 35.0, y: 14.0, z: -40.0 };
  const stairEval = evaluatePyramidElevation(stairPos);
  assert.equal(stairEval.isAtPinnacle, false);
  assert.equal(stairEval.isOnSteps, true);
  assert.ok(stairEval.elevationBonus > 0);

  // Activation de l'autel sacrificiel maya avec honneur suffisant
  const activated = activateSacrificialAltar(state, 250);
  assert.equal(activated, true);
  assert.equal(state.sacrificialAltarActivated, true);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v128 et vérification Draw Calls MothershipHub', () => {
  const v128AudioMethods = [
    'playHarpoonCableFire',
    'playWinchMotorWhine',
    'playPreyHoistChoke',
    'playSonicMinePulse',
    'playTinnitusRinging',
    'playHeartbeatVisionPulse',
    'playCryoSteamHiss',
    'playChainRattleHeavy',
    'playQueenRoarMuffled',
    'playCarapaceDeflectClang',
    'playJointCriticalHit',
    'playRotarySpoolUp',
    'playGatlingBurstCycle',
    'playAcidTailSlice',
    'playAcidEtchSizzle',
  ];

  v128AudioMethods.forEach(method => {
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
