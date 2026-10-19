import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

import {
  FLARE_CONSTANTS,
  createMagnesiumFlareState,
  igniteMagnesiumFlare,
  updateMagnesiumFlares,
} from '../src/gameplay/MagnesiumPyrotechnicFlareSystem.js';

import {
  LASER_MINE_CONSTANTS,
  createLaserGridMinesState,
  deployLaserGridMine,
  updateLaserGridMines,
} from '../src/gameplay/LaserGridMinesSystem.js';

import {
  NET_GUN_CONSTANTS,
  createBallisticNetGunState,
  fireBallisticNet,
  updateBallisticNetGun,
} from '../src/gameplay/BallisticMeshNetGunSystem.js';

import {
  CEREMONY_CONSTANTS,
  createTrophyCeremonyState,
  startTrophyCeremony,
  updateTrophyCeremony,
} from '../src/gameplay/SpineRipAcidSolventCeremonyDirector.js';

import {
  CANOPY_CONSTANTS,
  createCanopyTraverseState,
  hopToBranch,
  executeCanopyPounce,
  updateCanopyTraverse,
} from '../src/gameplay/JungleCanopyBranchTraverseSystem.js';

import {
  FERAL_WEAPONS_CONSTANTS,
  createFeralModularWeaponState,
  toggleCombistickSplit,
  deployFanShield,
  deflectWithFanShield,
} from '../src/gameplay/FeralCombistickShieldSplitDirector.js';

import {
  HONOR_DUEL_CONSTANTS,
  createHonorDuelState,
  initiateHonorChallenge,
  executeMeleeClash,
  updateHonorDuel,
} from '../src/gameplay/HanzoYakuzaKatanaDuelSector.js';

import {
  PYRAMID_SHIFT_CONSTANTS,
  createPyramidMatrixSectorState,
  triggerPyramidShift,
  updatePyramidMatrixSector,
} from '../src/gameplay/ChamberShiftPyramidMatrixSector.js';

import {
  UPGRADE_PREDATOR_CONSTANTS,
  createUpgradePredatorState,
  processExoArmorHit,
  performBruteForceSmash,
  updateUpgradePredatorDirector,
} from '../src/gameplay/UpgradePredatorExoskeletalArmorDirector.js';

test('Chantier 1 — MagnesiumPyrotechnicFlareSystem: torche pyrotechnique et calcination de résines (Predator 2 / AVP)', () => {
  const state = createMagnesiumFlareState(4);
  assert.equal(state.flaresCarried, 4);

  // Lancement de fusée
  const flare = igniteMagnesiumFlare(state, { x: 0, z: 0 }, 0, 10.0);
  assert.ok(flare);
  assert.equal(state.flaresCarried, 3);
  assert.equal(state.activeFlares.length, 1);

  // Éblouissement et embrasement de toile
  const mercenary = { id: 'merc', x: 2.0, z: 0, hasNightVisionGear: true };
  const resin = { id: 'resin_cluster', x: 1.5, z: 0, isBurning: false };
  updateMagnesiumFlares(state, 0.5, [mercenary], [resin]);

  assert.ok(mercenary.isBlinded, 'L’optique de nuit doit être aveuglée');
  assert.ok(resin.isBurning, 'La résine doit prendre feu');
});

test('Chantier 2 — LaserGridMinesSystem: mines murales à grille laser et démembrement (AVP:R 2007)', () => {
  const state = createLaserGridMinesState(4);
  const wallPos = { x: -4.0, z: -10.0 };
  const normal = { x: 1.0, z: 0.0 }; // Faisceau transversal selon l'axe X

  // Pose de la mine murale
  const mine = deployLaserGridMine(state, wallPos, normal, 8.0);
  assert.ok(mine);
  assert.equal(state.charges, 3);

  // Armement après délai
  updateLaserGridMines(state, 1.5, []);
  assert.ok(mine.isArmed);

  // Xénomorphe traversant le treillis laser
  const xeno = { id: 'drone_xeno', x: 0.0, z: -10.0, health: 150 };
  updateLaserGridMines(state, 0.1, [xeno]);

  assert.ok(xeno.isDismembered, 'Le Xénomorphe doit être découpé par la grille');
  assert.ok(xeno.health <= 0, 'Les dégâts doivent être létaux');
  assert.equal(state.totalDismemberments, 1);
});

test('Chantier 3 — BallisticMeshNetGunSystem: lance-filet balistique et cicatrice quadrillée (AVP 2004)', () => {
  const state = createBallisticNetGunState(3);
  const shooter = { x: 0, z: 0 };
  const target = { id: 'grid_xeno', x: 0, z: 5, health: 200 };

  // Tir de filet
  fireBallisticNet(state, shooter, target);
  assert.equal(state.ammo, 2);

  // Capture et début de constriction
  updateBallisticNetGun(state, 0.25, [target]);
  assert.ok(target.isNetSnared, 'La cible doit être immobilisée');
  assert.ok(target.hasGridScarring, 'L’alien doit porter la cicatrice en grille emblématique');

  // Constriction continue
  updateBallisticNetGun(state, 1.0, [target]);
  assert.ok(target.health < 200, 'Les mailles métalliques doivent cisailler les chairs');
});

test('Chantier 4 — SpineRipAcidSolventCeremonyDirector: arrachement vertébral et solvant bleu (Predator 1987 / AVP:R)', () => {
  const state = createTrophyCeremonyState();
  const victim = { id: 'billy_sole', species: 'human_warrior', isDead: true };

  // Démarrage de l'arrachement
  const start = startTrophyCeremony(state, victim);
  assert.ok(start.success);
  assert.equal(state.currentPhase, 'EXTRACTION');

  // Progression vers la phase du solvant bleu
  updateTrophyCeremony(state, 2.6);
  assert.equal(state.currentPhase, 'CLEANSE');

  // Décapage complet et attribution d'honneur
  const result = updateTrophyCeremony(state, 2.1);
  assert.ok(result.completed);
  assert.ok(result.honorAwarded >= 150);
  assert.equal(state.claimedTrophies.length, 1);
  assert.ok(state.claimedTrophies[0].isPolished);
});

test('Chantier 5 — JungleCanopyBranchTraverseSystem: branches de canopée et sauts plongeants (Predator 1987)', () => {
  const state = createCanopyTraverseState();
  assert.equal(state.isPerched, true);

  // Déplacement d'arbre en arbre
  const hopped = hopToBranch(state, 'branch_canopy_02');
  assert.ok(hopped);
  assert.equal(state.currentBranchId, 'branch_canopy_02');

  // Saut plongeant sur cible au sol
  const groundPatrol = { id: 'guerrilla_soldier', health: 120, x: 5.5, z: -16.0 };
  const pounce = executeCanopyPounce(state, groundPatrol);
  assert.ok(pounce.success);
  assert.ok(groundPatrol.health <= 0, 'La cible au sol doit être écrasée par le saut plongeant');
  assert.ok(groundPatrol.isStaggered);

  updateCanopyTraverse(state, 0.5);
});

test('Chantier 6 — FeralCombistickShieldSplitDirector: lance scindable et éventail osseux (Prey 2022)', () => {
  const state = createFeralModularWeaponState();
  assert.equal(state.isCombistickSplit, false);

  // Scission de la lance
  toggleCombistickSplit(state);
  assert.equal(state.isCombistickSplit, true, 'Le combistick doit être en mode doubles lames');

  // Déploiement de l'éventail osseux
  deployFanShield(state);
  assert.equal(state.isFanShieldDeployed, true);

  // Parade d'un coup de griffes au corps-à-corps
  const bearClawAttack = { damage: 80, isMelee: true, angle: 0 };
  const blockRes = deflectWithFanShield(state, bearClawAttack, 0);

  assert.ok(blockRes.blocked);
  assert.ok(blockRes.damagePassed <= 15.0, '85% des dégâts doivent être absorbés');
  assert.ok(blockRes.counterDamageDealt > 0, 'Le tranchant de l’éventail doit riposter');
});

test('Chantier 7 — HanzoYakuzaKatanaDuelSector: duel honorable au sabre et passes d’armes (Predators 2010)', () => {
  const state = createHonorDuelState({ x: 0, z: -40 });
  const hanzo = { id: 'hanzo', health: 100 };
  const falconer = { id: 'falconer_predator', isCloaked: true, health: 150 };

  // Engagement du duel d'honneur
  initiateHonorChallenge(state, hanzo, falconer);
  assert.equal(state.isDuelActive, true);
  assert.equal(falconer.isCloaked, false, 'Le Predator doit désactiver son camouflage pour le duel');
  assert.equal(falconer.plasmaCasterLocked, true, 'Le canon plasma doit être verrouillé');

  // Échange de passes d'armes mortelles
  const clash = executeMeleeClash(state, hanzo, falconer, false);
  assert.ok(clash.clashed);
  assert.equal(clash.damageDealt, HONOR_DUEL_CONSTANTS.MUTUAL_STRIKE_DAMAGE);

  // Fin du duel et attribution d'honneur
  falconer.health = 0;
  updateHonorDuel(state, 0.1, hanzo, falconer);
  assert.equal(state.winner, 'human');
  assert.ok(hanzo.honorEarned >= 250);
});

test('Chantier 8 — ChamberShiftPyramidMatrixSector: coulissement des dalles et labyrinthe (AVP 2004)', () => {
  const state = createPyramidMatrixSectorState();
  assert.ok(state.slabs.length >= 3);

  // Déclenchement d'une reconfiguration cyclique
  triggerPyramidShift(state);
  assert.equal(state.isShifting, true);

  // Entité sous la dalle en mouvement
  const explorer = { id: 'sebastian_de_rosa', x: -6.0, z: -15.0, health: 100 };
  updatePyramidMatrixSector(state, 0.1, [explorer]);
  assert.ok(explorer.isTrappedInSlab);

  // Fin du coulissement des dalles
  updatePyramidMatrixSector(state, 3.5, []);
  assert.equal(state.isShifting, false);
});

test('Chantier 9 — UpgradePredatorExoskeletalArmorDirector: blindage chitineux et pulsation thermique (The Predator 2018)', () => {
  const state = createUpgradePredatorState();
  assert.equal(state.health, UPGRADE_PREDATOR_CONSTANTS.BASE_HEALTH);

  // Impact par balles de fusil d'assaut
  const hitRes = processExoArmorHit(state, 50.0);
  assert.ok(hitRes.absorbedDamage >= 35.0, '70% des dégâts balistiques doivent être absorbés');
  assert.equal(state.deflectedBullets, 1);

  // Charge de force brute
  const soldier = { id: 'fugitive_guard', health: 120 };
  performBruteForceSmash(state, soldier);
  assert.ok(soldier.health < 120);
  assert.ok(soldier.isKnockedBack);

  // Pulsation thermique organique sans casque
  const preyTarget = { id: 'target_human' };
  updateUpgradePredatorDirector(state, 5.0, [preyTarget]);
  assert.ok(preyTarget.isOrganicallyTracked);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v134 et respect Draw Calls Mothership', () => {
  const v134AudioMethods = [
    'playMagnesiumFlareIgnite',
    'playMagnesiumFlareBurnHum',
    'playLaserGridMineDeploy',
    'playLaserGridCutZap',
    'playBallisticNetLaunchWhistle',
    'playNetConstrictBiteChink',
    'playSpineRipCrackTear',
    'playBlueSolventSizzleFoam',
    'playCanopyBranchCreakSway',
    'playCanopyDropPounceThud',
    'playCombistickSplitTwist',
    'playFanShieldDeploySnap',
    'playKatanaBladeClashRing',
    'playPyramidSlabSlideGrind',
    'playUpgradeExoArmorDeflectPing',
  ];

  v134AudioMethods.forEach(method => {
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
