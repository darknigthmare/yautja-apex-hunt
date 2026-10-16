import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  SHIELD_CONSTANTS,
  createFeralShieldState,
  toggleFeralShield,
  blockIncomingAttack,
  performShieldBash,
  updateFeralShield,
} from '../src/gameplay/FeralArmShieldSystem.js';
import {
  DUAL_PLASMA_MODES,
  DUAL_PLASMA_CONSTANTS,
  createDualPlasmacasterState,
  acquireDualTargets,
  fireTwinVolley,
  updateDualPlasmacasters,
} from '../src/gameplay/DualPlasmacasterSystem.js';
import {
  WHALING_CONSTANTS,
  createWhalingStationSector,
  toggleThermalMeshHeater,
  interactOilCauldron,
  updateWhalingStationSector,
} from '../src/gameplay/WhalingStationLevelSector.js';
import {
  TRAP_CONSTANTS,
  createSurvivalTrapState,
  armCounterweightLog,
  triggerCounterweightLog,
  armPunjiPit,
  checkPunjiTrigger,
} from '../src/gameplay/PrimitiveSurvivalTraps.js';
import {
  SEWER_CONSTANTS,
  createSewerLabyrinthSector,
  plantLaserMine,
  updateSewerLabyrinth,
} from '../src/gameplay/SewerLabyrinthSector.js';
import {
  LIGHTNING_CONSTANTS,
  createLightningRechargeState,
  canChannelLightning,
  channelLightningStrike,
  updateLightningSupercharge,
} from '../src/gameplay/LightningRechargeSystem.js';
import {
  CHITIN_GEAR_CONSTANTS,
  craftChitinXenoGear,
  deflectWithChitinShield,
  strikeWithTailSpear,
} from '../src/gameplay/ChitinXenoGearSystem.js';
import {
  HANDHELD_MODES,
  HANDHELD_CONSTANTS,
  createHandheldPlasmacasterState,
  convertPlasmacasterToHandheld,
  fireHandheldPlasma,
  firePointBlankPlasma,
  updateHandheldPlasmacaster,
} from '../src/gameplay/HandheldPlasmacasterSystem.js';
import {
  TRAPPER_CONSTANTS,
  createTrapperCampSector,
  armBearTrap,
  checkBearTrapTrigger,
  pryOpenBearTrap,
  updateTrapperCamp,
} from '../src/gameplay/TrapperCampLevelSector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Bouclier hexagonal Feral : Déploiement, parade frontale et Shield Bash (Lore 1:1 Prey 2022)', () => {
  const shield = createFeralShieldState();
  assert.equal(shield.isDeployed, false);

  toggleFeralShield(shield, audioSynth);
  assert.equal(shield.isDeployed, true);

  // Parade frontale (angle 20° <= 80°)
  const blocked = blockIncomingAttack(shield, 50.0, 20.0, audioSynth);
  assert.equal(blocked, true);
  assert.equal(shield.durability, 250.0);

  // Attaque dorsale non bloquée (angle 120° > 80°)
  const blockedBack = blockIncomingAttack(shield, 50.0, 120.0, audioSynth);
  assert.equal(blockedBack, false);

  // Coup de bouclier (Shield Bash)
  const enemy = { health: 100, isStaggered: false };
  performShieldBash(shield, enemy, audioSynth);
  assert.equal(enemy.health, 100 - SHIELD_CONSTANTS.BASH_DAMAGE);
  assert.equal(enemy.isStaggered, true);

  // Décompte de recharge
  updateFeralShield(shield, 1.5);
  assert.equal(shield.bashCooldown, 0);
});

test('Chantier 2 — Double canon à plasma d\'épaule : Ciblage jumelé et tir simultané (Lore 1:1 AVP:R)', () => {
  const dualState = createDualPlasmacasterState();
  const targetA = { id: 'xeno_left', health: 100 };
  const targetB = { id: 'xeno_right', health: 100 };

  // Ciblage indépendant de deux cibles
  acquireDualTargets(dualState, targetA, targetB, audioSynth);
  assert.equal(dualState.mode, DUAL_PLASMA_MODES.INDEPENDENT_LOCK);
  assert.equal(dualState.leftLocked, true);
  assert.equal(dualState.rightLocked, true);

  // Tir de volée jumelée
  const volley = fireTwinVolley(dualState, 50.0, audioSynth);
  assert.ok(volley);
  assert.equal(volley.boltsFired, 2);
  assert.equal(targetA.health, 100 - DUAL_PLASMA_CONSTANTS.BASE_DAMAGE_PER_BOLT);
  assert.equal(targetB.health, 100 - DUAL_PLASMA_CONSTANTS.BASE_DAMAGE_PER_BOLT);

  // Cooldown actif
  assert.ok(dualState.cooldownTimer > 0);
  updateDualPlasmacasters(dualState, 1.5);
  assert.equal(dualState.cooldownTimer, 0);
});

test('Chantier 3 — Station Baleinière 1904 de Bouvet : Froid polaire et cuves d\'huile (Lore 1:1 AVP 2004)', () => {
  const whaling = createWhalingStationSector();
  assert.equal(whaling.ambientTemperature, WHALING_CONSTANTS.SUBZERO_TEMP_CELSIUS);
  assert.equal(whaling.thermalMeshActive, true);

  const mockHunter = { energy: 100, staminaRecoveryMultiplier: 1.0 };
  updateWhalingStationSector(whaling, 5.0, mockHunter, audioSynth);
  assert.ok(mockHunter.energy < 100, 'Le maillage thermique consomme de l énergie');

  // Interaction et détonation de cuve d'huile résiduelle
  const result = interactOilCauldron(whaling, 'cauldron_1', audioSynth);
  assert.equal(result.detonated, true);
  assert.ok(result.damage > 100);
});

test('Chantier 4 — Pièges primitifs de Dutch : Tronc contrepoids et pieux punji (Lore 1:1 Predator 1987)', () => {
  const trapState = createSurvivalTrapState();
  const log = armCounterweightLog(trapState, { x: 5, z: 5 });
  const punji = armPunjiPit(trapState, { x: 10, z: 10 });

  assert.equal(trapState.logTraps.length, 1);
  assert.equal(trapState.punjiPits.length, 1);

  // Déclenchement du tronc d'arbre contrepoids
  const predatorTarget = { health: 300, isStaggered: false };
  triggerCounterweightLog(trapState, log.id, predatorTarget, audioSynth);
  assert.equal(log.isTriggered, true);
  assert.ok(predatorTarget.health < 300);
  assert.equal(predatorTarget.isStaggered, true);

  // Marche sur la fosse de pieux punji
  const victim = { x: 10.2, z: 10.1, health: 100, isCrippled: false };
  const triggered = checkPunjiTrigger(trapState, victim, audioSynth);
  assert.equal(triggered, true);
  assert.equal(victim.isCrippled, true);
  assert.ok(victim.health < 100);
});

test('Chantier 5 — Égouts de Gunnison : Traînée d\'eau et mines laser murales (Lore 1:1 AVP:R)', () => {
  const sewer = createSewerLabyrinthSector();
  const mine = plantLaserMine(sewer, { x: 0, y: 1.5, z: 0 }, { x: 1, y: 0, z: 0 }, audioSynth);
  assert.ok(mine);
  assert.equal(mine.isArmed, true);

  // Ennemi traversant le faisceau de la mine laser
  const xenoDrone = { x: 2.0, y: 1.5, z: 0.1, health: 150 };
  updateSewerLabyrinth(sewer, 0.5, [xenoDrone], audioSynth);

  assert.equal(mine.isDetonated, true);
  assert.equal(xenoDrone.health, 0, 'Le xénomorphe a été cisaillé par le faisceau laser');
});

test('Chantier 6 — Canalisation de la foudre au sommet du gratte-ciel (Lore 1:1 Predator 2)', () => {
  const lightningState = createLightningRechargeState();
  const mockHunter = {
    y: 35.0, // En hauteur
    isCombiStickRaised: true,
    energy: 10,
    maxEnergy: 100,
    isSupercharged: false,
  };
  const mockEnv = { isThunderstorm: true };

  assert.equal(canChannelLightning(lightningState, mockHunter, mockEnv), true);

  // Frappe d'éclair canalisée
  channelLightningStrike(lightningState, mockHunter, audioSynth);
  assert.equal(lightningState.isSupercharged, true);
  assert.equal(mockHunter.energy, 100);
  assert.equal(mockHunter.isSupercharged, true);
  assert.equal(mockHunter.plasmaCostDiscount, LIGHTNING_CONSTANTS.ENERGY_COST_DISCOUNT);

  // Expiration du buff
  updateLightningSupercharge(lightningState, 21.0, mockHunter);
  assert.equal(lightningState.isSupercharged, false);
  assert.equal(mockHunter.isSupercharged, false);
});

test('Chantier 7 — Équipement rituel en chitine de Xénomorphe (Lore 1:1 AVP Lex & Scar)', () => {
  const gear = craftChitinXenoGear(true, true);
  assert.ok(gear.shield);
  assert.ok(gear.tailSpear);

  // Parade d'éclaboussure acide au bouclier de chitine
  const acidBlocked = deflectWithChitinShield(gear.shield, 'molecular_acid', audioSynth);
  assert.equal(acidBlocked, true);
  assert.equal(gear.shield.durability, 350.0, 'L acide n entame pas le bouclier en chitine');

  // Coup de lance caudale sur un Xénomorphe (+45% dégâts)
  const xenoTarget = { species: 'Xenomorph', health: 200, isBleeding: false };
  const dmg = strikeWithTailSpear(gear.tailSpear, xenoTarget, audioSynth);
  assert.ok(dmg >= 130);
  assert.equal(xenoTarget.isBleeding, true);
});

test('Chantier 8 — Canon à plasma portatif & Tir à bout portant (Lore 1:1 Predator 2 / AVP:R)', () => {
  const handheld = createHandheldPlasmacasterState();
  const mockHunter = { aimAgilityMultiplier: 1.0, canShootWhileSprinting: false };

  convertPlasmacasterToHandheld(handheld, mockHunter);
  assert.equal(handheld.mode, HANDHELD_MODES.HANDHELD_PISTOL);
  assert.equal(mockHunter.canShootWhileSprinting, true);
  assert.ok(mockHunter.aimAgilityMultiplier > 1.2);

  // Tir à bout portant (Point-blank)
  const closeTarget = { health: 150, isKnockedBack: false };
  firePointBlankPlasma(handheld, 30.0, closeTarget, audioSynth);
  assert.equal(closeTarget.health, 150 - HANDHELD_CONSTANTS.POINT_BLANK_DAMAGE);
  assert.equal(closeTarget.isKnockedBack, true);

  // Recharge
  updateHandheldPlasmacaster(handheld, 1.5);
  assert.equal(handheld.pointBlankCooldown, 0);
});

test('Chantier 9 — Camp des Trappeurs Français 1719 : Pièges à mâchoires d\'ours (Lore 1:1 Prey)', () => {
  const camp = createTrapperCampSector();
  const preyEntity = { x: -5.8, z: 8.1, health: 100, isImmobilized: false };

  // Piège à ours déclenché
  const sprung = checkBearTrapTrigger(camp, preyEntity, audioSynth);
  assert.equal(sprung, true);
  assert.equal(preyEntity.isImmobilized, true);
  assert.equal(preyEntity.health, 100 - TRAPPER_CONSTANTS.BEAR_TRAP_DAMAGE);

  // Libération du piège
  const trap = camp.bearTraps[0];
  pryOpenBearTrap(trap, preyEntity);
  assert.equal(preyEntity.isImmobilized, false);
});

test('Chantier 10 — Synthèse audio des 14 méthodes v125 et vérification Draw Calls Mothership', () => {
  const newAudioMethods = [
    'playShieldDeploy',
    'playShieldBulletDeflect',
    'playShieldBashImpact',
    'playDualPlasmaLock',
    'playTwinPlasmaFire',
    'playBlizzardHowl',
    'playOilCauldronClang',
    'playLogTrapSwing',
    'playPunjiImpale',
    'playSewerEchoDrip',
    'playLaserMineArm',
    'playLaserMineDetonate',
    'playCombiLightningChannel',
    'playBearTrapSnap',
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
