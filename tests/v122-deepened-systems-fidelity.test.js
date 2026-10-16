import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  createCombiStickState,
  toggleCombiStickExtension,
  activateSpinParry,
  updateCombiStickState,
  checkProjectileDeflection,
  calculateCombiStickMeleeThrust,
  resolveThrownImpalement,
} from '../src/gameplay/CombiStickSystem.js';
import {
  NET_CONSTRICTION_STAGES,
  createNetCapture,
  updateNetConstriction,
  attemptSeverNet,
} from '../src/gameplay/NetgunConstrictionSystem.js';
import {
  BIOMASK_VISION_MODES,
  createBiomaskVisionState,
  cycleBiomaskVision,
  getPreyVisibilityRating,
} from '../src/gameplay/BiomaskVisionDirector.js';
import {
  HONOR_TARGET_CATEGORIES,
  CLAN_HONOR_STATUSES,
  evaluateTargetHonorability,
  processKillHonorAward,
  getHunterHonorStatus,
} from '../src/gameplay/HonorCodeEnforcement.js';
import {
  scanTargetPhysiology,
  formatTelemetrySummary,
} from '../src/gameplay/RetinalPreyTelemetry.js';
import {
  createSpearBoltProjectile,
  updateSpearBoltProjectile,
  tryReclaimEmbeddedBolt,
} from '../src/gameplay/SpeargunBallisticsSystem.js';
import {
  createWristHologramState,
  toggleWristHologram,
  updateWristHologram,
} from '../src/gameplay/WristHologramMapSystem.js';
import {
  BOSS_TACTICAL_STANCES,
  evaluateBossTacticalStance,
  executeBossTacticalAction,
} from '../src/gameplay/BossTacticalDirector.js';
import {
  CALIBRATION_UPGRADES,
  createArmoryCalibrationState,
  applyCalibrationUpgrade,
  getWeaponCalibrationModifiers,
} from '../src/gameplay/ArmoryCalibrationSystem.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Combi-stick : Extension pneumatique, parade rotative et empalement (Lore 1:1)', () => {
  // 1. Synthèses sonores Combi-stick
  ['playCombiStickExtend', 'playCombiStickSpinParry', 'playCombiStickImpactThud'].forEach((method) => {
    assert.equal(typeof audioSynth[method], 'function', `${method} doit exister sur audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  });

  const state = createCombiStickState();
  assert.equal(state.isExtended, true);
  assert.equal(state.lengthMeters, 2.4);

  // Rétraction télescopique
  toggleCombiStickExtension(state);
  assert.equal(state.isExtended, false);
  assert.equal(state.lengthMeters, 0.42);

  // Parade rotative à haute vélocité (moulinet déflecteur)
  const parryResult = activateSpinParry(state, 50);
  assert.equal(parryResult.success, true);
  assert.equal(state.isExtended, true, 'doit s\'étendre automatiquement pour parer');
  assert.ok(state.spinParryTimer > 0);

  // Déviation de projectiles
  const deflectBullet = checkProjectileDeflection(state, { type: 'bullet', damage: 35 });
  assert.equal(deflectBullet.deflected, true);

  updateCombiStickState(state, 2.0); // expiration du timer
  const deflectAfterExpire = checkProjectileDeflection(state, { type: 'bullet', damage: 35 });
  assert.equal(deflectAfterExpire.deflected, false);

  // Dégâts perforants avec bonus anti-blindage
  const thrustArmored = calculateCombiStickMeleeThrust(state, 5.0, { isArmored: true, armor: 50 });
  assert.equal(thrustArmored.hit, true);
  assert.ok(thrustArmored.damage > 80);

  // Empalement cinétique projeté
  const mockTarget = { position: { x: 0, y: 1, z: 12 }, health: 200, isDead: false };
  const throwResult = resolveThrownImpalement({ x: 0, y: 1, z: 12 }, { x: 0, y: 0, z: 1 }, mockTarget);
  assert.equal(throwResult.hit, true);
  assert.equal(throwResult.pinned, true);
  assert.equal(mockTarget.health, 65);
});

test('Chantier 2 — Lance-filet : Constriction mécanique, cisaillement et dissolution (Lore 1:1)', () => {
  assert.equal(typeof audioSynth.playNetConstrictSqueak, 'function');
  assert.doesNotThrow(() => audioSynth.playNetConstrictSqueak());

  const mockPrey = { health: 150, isDead: false };
  const capture = createNetCapture(mockPrey, { isAnchoredToWall: true });

  assert.equal(capture.stage, NET_CONSTRICTION_STAGES.LATCHED);

  // Progression de la constriction avec dégâts de cisaillement croissants
  updateNetConstriction(capture, 1.5);
  assert.equal(capture.stage, NET_CONSTRICTION_STAGES.CONSTRICTING);
  assert.ok(capture.totalDamageDealt > 0);

  updateNetConstriction(capture, 3.0);
  assert.equal(capture.stage, NET_CONSTRICTION_STAGES.DEEP_SLICING);

  // Résistance aux couteaux humains standards
  const humanCut = attemptSeverNet(capture, 'combat_knife');
  assert.equal(humanCut, false);
  assert.notEqual(capture.stage, NET_CONSTRICTION_STAGES.SEVERED);

  // Dissolution par acide xénomorphe (AVP 2004)
  const acidDissolve = attemptSeverNet(capture, 'xeno_acid');
  assert.equal(acidDissolve, true);
  assert.equal(capture.stage, NET_CONSTRICTION_STAGES.SEVERED);
});

test('Chantier 3 — Biomasque multispectral : Vision Neuro-Xénomorphe & EM (Lore 1:1)', () => {
  ['playNeuroVisionSwitch', 'playTechVisionHum'].forEach((method) => {
    assert.equal(typeof audioSynth[method], 'function');
    assert.doesNotThrow(() => audioSynth[method]());
  });

  assert.equal(BIOMASK_VISION_MODES.length, 4);
  const state = createBiomaskVisionState();

  // Mode initial : Thermal
  assert.equal(state.activeMode.id, 'thermal');

  // Cycle vers Tech EM
  cycleBiomaskVision(state);
  assert.equal(state.activeMode.id, 'tech');

  // Cycle vers Neuro-Alien (AVP 2004)
  cycleBiomaskVision(state);
  assert.equal(state.activeMode.id, 'neuro_alien');

  // Vérification des visibilités différentielles selon le lore canon
  const xenoInNeuro = getPreyVisibilityRating('neuro_alien', 'xeno_warrior');
  const xenoInThermal = getPreyVisibilityRating('thermal', 'xeno_warrior');
  assert.equal(xenoInNeuro, 1.0, 'Xénomorphe parfaitement lumineux en vision neuro');
  assert.ok(xenoInThermal < 0.35, 'Xénomorphe masqué dans le froid en vision thermique classique');

  const synthInTech = getPreyVisibilityRating('tech', 'weyland_synthetic');
  assert.equal(synthInTech, 1.0, 'Androïde mis en surbrillance par la vision EM');
});

test('Chantier 4 — Code d’honneur Yautja & Infractions Bad Blood (Lore 1:1)', () => {
  // 1. Évaluation des cibles selon le code
  const pregnantPrey = { isPregnant: true, hasWeapon: true };
  const evalPregnant = evaluateTargetHonorability(pregnantPrey);
  assert.equal(evalPregnant.isHonorable, false);
  assert.equal(evalPregnant.category, HONOR_TARGET_CATEGORIES.PREGNANT_FEMALE);

  const unarmedTarget = { isUnarmed: true, hasWeapon: false };
  const evalUnarmed = evaluateTargetHonorability(unarmedTarget);
  assert.equal(evalUnarmed.isHonorable, false);
  assert.equal(evalUnarmed.category, HONOR_TARGET_CATEGORIES.UNARMED_PREY);

  const armedSoldier = { isUnarmed: false, hasWeapon: true };
  const evalArmed = evaluateTargetHonorability(armedSoldier);
  assert.equal(evalArmed.isHonorable, true);

  // 2. Traitement des sanctions et de l'honneur
  const player = { honorScore: 1000, lifetimeHonor: 1000, badBloodInfractions: 0 };

  // Kill honorable à découvert
  const honorKill = processKillHonorAward(player, armedSoldier, false);
  assert.ok(honorKill.honorDelta > 0);
  assert.equal(honorKill.infractionCommitted, false);

  // Meurtre d'une cible protégée (infraction)
  const dishonorKill = processKillHonorAward(player, pregnantPrey, false);
  assert.ok(dishonorKill.honorDelta < 0);
  assert.equal(dishonorKill.infractionCommitted, true);
  assert.equal(player.badBloodInfractions, 1);

  // Deuxième infraction -> Statut Bad Blood Outcast
  processKillHonorAward(player, unarmedTarget, false);
  assert.equal(getHunterHonorStatus(player.honorScore, player.badBloodInfractions), CLAN_HONOR_STATUSES.BAD_BLOOD_OUTCAST);
});

test('Chantier 5 — Télémétrie rétinienne & Scanner biométrique (Lore 1:1)', () => {
  assert.equal(typeof audioSynth.playForensicScanChirp, 'function');
  assert.doesNotThrow(() => audioSynth.playForensicScanChirp());

  const humanSoldier = { name: 'Dutch', aiState: 'combat', hasWeapon: true };
  const soldierScan = scanTargetPhysiology(humanSoldier);
  assert.ok(soldierScan.heartRateBpm > 130, 'fréquence cardiaque élevée en combat');
  assert.equal(soldierScan.threatLevel, 'ÉLEVÉE');

  const synthPrey = { name: 'Ash', isSynthetic: true };
  const synthScan = scanTargetPhysiology(synthPrey);
  assert.equal(synthScan.heartRateBpm, 0, 'aucun pouls chez un synthétique');
  assert.ok(synthScan.coreTempCelsius < 25.0);

  const pregnantTarget = { name: 'Leona', isPregnant: true };
  const pregScan = scanTargetPhysiology(pregnantTarget);
  assert.equal(pregScan.isPregnant, true);
  assert.equal(pregScan.threatLevel, 'NULLE (PROTÉGÉE)');

  const summary = formatTelemetrySummary(soldierScan);
  assert.ok(summary.includes('BPM'));
  assert.ok(summary.includes('TEMP:'));
});

test('Chantier 6 — Speargun : Balistique de précision & Récupération forensic (Lore 1:1)', () => {
  assert.equal(typeof audioSynth.playSpearBoltRetrieve, 'function');
  assert.doesNotThrow(() => audioSynth.playSpearBoltRetrieve());

  const origin = { x: 0, y: 1.6, z: 0 };
  const direction = { x: 0, y: 0, z: 1 };

  // Tir furtif avec camouflage : multiplicateur 2.25x
  const stealthBolt = createSpearBoltProjectile(origin, direction, { isCloaked: true, baseDamage: 80 });
  assert.equal(stealthBolt.isStealthShot, true);
  assert.equal(stealthBolt.damage, 180);

  const mockPrey = { position: { x: 0, y: 1.6, z: 15 }, health: 250, isDead: false };

  // Déplacement et impact
  updateSpearBoltProjectile(stealthBolt, 0.15, [mockPrey]);
  assert.equal(stealthBolt.isEmbedded, true);
  assert.equal(mockPrey.health, 70);

  // Récupération du trait par le chasseur
  const playerPos = { x: 0, y: 1.6, z: 15 };
  const reclaimed = tryReclaimEmbeddedBolt(stealthBolt, playerPos);
  assert.equal(reclaimed, true);
  assert.equal(stealthBolt.reclaimed, true);
});

test('Chantier 7 — Gantelet : Projecteur holographique tactique 3D (Lore 1:1)', () => {
  assert.equal(typeof audioSynth.playHoloMapDeploy, 'function');
  assert.doesNotThrow(() => audioSynth.playHoloMapDeploy());

  const holoState = createWristHologramState();
  assert.equal(holoState.isActive, false);

  toggleWristHologram(holoState);
  assert.equal(holoState.isActive, true);

  const playerPos = { x: 0, y: 0, z: 0 };
  const targets = [
    { id: 'target_1', npcType: 'colonial_marine', position: { x: 25, y: 0, z: 40 } },
    { id: 'target_far', npcType: 'soldier', position: { x: 300, y: 0, z: 300 } }, // hors portée
  ];
  const pois = [
    { id: 'shrine_1', type: 'weapon_shrine', position: { x: 10, y: 0, z: 15 } },
  ];

  updateWristHologram(holoState, 0.5, playerPos, targets, pois);
  assert.equal(holoState.projectedBlips.length, 1);
  assert.equal(holoState.projectedBlips[0].id, 'target_1');
  assert.equal(holoState.poiMarkers.length, 1);
});

test('Chantier 8 — Boss IA : Stratégie de canopée et retraite Medicomp (Lore 1:1)', () => {
  const boss = {
    health: 25,
    maxHealth: 100,
    isDead: false,
    isCloaked: false,
    medicompUsed: false,
    position: { x: 0, y: 0, z: 0 },
  };

  // 1. Santé critique -> Stance de repli tactique Medicomp
  const stanceCritical = evaluateBossTacticalStance(boss, { x: 10, z: 10 });
  assert.equal(stanceCritical, BOSS_TACTICAL_STANCES.TACTICAL_RETREAT_HEAL);

  const action = executeBossTacticalAction(boss, stanceCritical, 0.1);
  assert.equal(action.action, 'initiate_medicomp_triage');
  assert.equal(boss.medicompActive, true);

  // 2. Évitement de l'eau si camouflé
  boss.health = 80;
  boss.isCloaked = true;
  const stanceWater = evaluateBossTacticalStance(boss, { x: 30, z: 30 }, { isNearWater: true });
  assert.equal(stanceWater, BOSS_TACTICAL_STANCES.WATER_EVASION);

  // 3. Avantage de la canopée
  boss.isPerched = true;
  const stanceCanopy = evaluateBossTacticalStance(boss, { x: 30, z: 30 });
  assert.equal(stanceCanopy, BOSS_TACTICAL_STANCES.CANOPY_SNIPING);
});

test('Chantier 9 — Armurerie du Vaisseau Mère : Calibration & Draw Calls (Lore 1:1)', () => {
  assert.equal(CALIBRATION_UPGRADES.length, 4);

  const calibState = createArmoryCalibrationState();
  assert.equal(getWeaponCalibrationModifiers(calibState, 'wristblades').damageMultiplier, 1.0);

  // Application de l'affûtage moléculaire
  applyCalibrationUpgrade(calibState, 'wristblade_molecular_honing');
  assert.ok(getWeaponCalibrationModifiers(calibState, 'wristblades').damageMultiplier > 1.1);

  // Collimation magnétique de plasma
  applyCalibrationUpgrade(calibState, 'plasma_collimator_focus');
  assert.ok(getWeaponCalibrationModifiers(calibState, 'plasmacaster_single').speedMultiplier > 1.15);

  // Intégration MothershipHub
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const details = hub.getArmoryCalibrationDetails();
    assert.equal(details.forgeActive, true);
    assert.equal(details.calibrationProfiles.length, 4);

    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);
  } finally {
    hub.dispose();
  }
});

test('Chantier 10 — Validation globale des 8 synthétiseurs audio et cohérence systémique', () => {
  const newMethods = [
    'playCombiStickExtend',
    'playCombiStickSpinParry',
    'playCombiStickImpactThud',
    'playNetConstrictSqueak',
    'playNeuroVisionSwitch',
    'playTechVisionHum',
    'playHoloMapDeploy',
    'playForensicScanChirp',
    'playSpearBoltRetrieve',
  ];
  newMethods.forEach((method) => {
    assert.equal(typeof audioSynth[method], 'function');
  });
});
