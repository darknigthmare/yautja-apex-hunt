import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

import {
  MEAT_LOCKER_CONSTANTS,
  createMeatLockerState,
  pushCarcass,
  damageCarcass,
  calculateThermalMasking,
  updateMeatLockerSector,
} from '../src/gameplay/MeatLockerFrostSuspensionSector.js';

import {
  UV_CONSTANTS,
  createUVVisionState,
  toggleUVVision,
  addPhosphorFootprint,
  triggerNitrogenCoolantLeak,
  updateUVVisionDirector,
} from '../src/gameplay/UltravioletVisionDirector.js';

import {
  COMANCHE_TRAP_CONSTANTS,
  createComancheTetherTrapState,
  placeTetherTrap,
  triggerTetherTrap,
  severTetherCord,
  updateComancheTetherTraps,
} from '../src/gameplay/ComancheTetherTrapSector.js';

import {
  RIVER_GHOST_CONSTANTS,
  createRiverGhostState,
  damageRiverGhost,
  harvestMuskGland,
  updateRiverGhostDirector,
} from '../src/gameplay/RiverGhostCloakScentTrackDirector.js';

import {
  SHIELD_CRAFT_CONSTANTS,
  createCarapaceShieldCraftState,
  addCarapacePlates,
  craftCarapaceShield,
  evaluateShieldBlock,
} from '../src/gameplay/AcidResistantCeremonialShieldCrafting.js';

import {
  HOLO_SHIELD_CONSTANTS,
  createFugitiveEnergyShieldState,
  deployEnergyShield,
  retractEnergyShield,
  deflectIncomingProjectile,
  performShieldBash,
  updateFugitiveEnergyShield,
} from '../src/gameplay/FugitiveWristGauntletEnergyShield.js';

import {
  MATERNITY_CONSTANTS,
  createMaternityWardState,
  damageIncubatorPod,
  updateMaternityWardSector,
} from '../src/gameplay/MaternityWardInfestationSector.js';

import {
  MINIGUN_CONSTANTS,
  createBlainMinigunState,
  spinUpMinigun,
  stopMinigun,
  fireMinigunBarrage,
  updateBlainMinigunState,
} from '../src/gameplay/BlainMinigunSuppressionZone.js';

import {
  BERSERKER_CAMP_CONSTANTS,
  createBerserkerCampState,
  unlatchPreyCage,
  cutTotemBonds,
  updateBerserkerCampSector,
} from '../src/gameplay/BerserkerPreyCampCagesSector.js';

test('Chantier 1 — MeatLockerFrostSuspensionSector: carcasses oscillantes et masquage thermique (Predator 2)', () => {
  const state = createMeatLockerState();
  assert.equal(state.ambientTemperature, -15.0);
  assert.ok(state.carcasses.length >= 6);

  // Oscillation par impulsion
  const pushed = pushCarcass(state, 'carcass_rail_01', 1.5, 0.8);
  assert.ok(pushed);
  assert.ok(state.carcasses[0].angularVelX > 0);

  // Dégâts et chute de carcasse
  const dmgRes1 = damageCarcass(state, 'carcass_rail_01', 50);
  assert.equal(dmgRes1.detached, false);
  const dmgRes2 = damageCarcass(state, 'carcass_rail_01', 100);
  assert.equal(dmgRes2.detached, true);
  assert.ok(state.carcasses[0].isDetached);

  // Masquage thermique derrière une carcasse encore suspendue
  const hunter = { id: 'city_hunter', x: -1.5, z: -12.5 };
  const masking = calculateThermalMasking(state, hunter);
  assert.ok(masking >= 0.70, `Masquage thermique (${masking}) doit être >= 0.70`);

  updateMeatLockerSector(state, 0.1, [hunter]);
  assert.ok(hunter.isThermalConcealed);
});

test('Chantier 2 — UltravioletVisionDirector: détection multi-spectrale et traces phosphorescentes (Predator 2)', () => {
  const state = createUVVisionState();
  assert.equal(state.currentMode, UV_CONSTANTS.MODE_INFRARED);

  // Bascule en UV
  const mode = toggleUVVision(state);
  assert.equal(mode, UV_CONSTANTS.MODE_ULTRAVIOLET);

  // Agent OWLF avec combinaison thermique (invisible en IR, visible en UV grâce au matériel cryogénique)
  const owlfAgent = { id: 'keyes_agent', x: 2.0, z: 5.0, hasThermalInsulatedSuit: true, hasCryoGear: true };
  updateUVVisionDirector(state, 0.1, [owlfAgent]);

  assert.ok(owlfAgent.isMaskVisible, 'Agent cryo doit être visible en vision UV');
  assert.equal(owlfAgent.visionColorProfile, 'UV_BRIGHT_MAGENTA_PHOSPHOR');

  // Enregistrement de trace phosphorescente et fuite d'azote
  addPhosphorFootprint(state, 2.0, 5.0);
  assert.equal(state.phosphorFootprints.length, 1);
  triggerNitrogenCoolantLeak(state, 2.0, 5.0);
  assert.equal(state.nitrogenLeaks.length, 1);
});

test('Chantier 3 — ComancheTetherTrapSector: pièges en babiche et trébuchement (Prey 2022)', () => {
  const state = createComancheTetherTrapState();
  assert.ok(state.traps.length >= 4);

  const feral = { id: 'feral_predator', x: 5.0, z: 12.0, isDead: false };
  updateComancheTetherTraps(state, 0.05, [feral]);

  assert.ok(feral.isStumbled, 'La cible doit trébucher');
  assert.ok(feral.speedMultiplier < 0.5, 'La vitesse doit être lourdement réduite');
  assert.ok(state.scoutAlertLevel > 0, 'Les guetteurs comanches doivent être alertés');

  // Tranchage de piège à la lame
  const severed = severTetherCord(state, 'comanche_trap_02', 60.0);
  assert.ok(severed);
});

test('Chantier 4 — RiverGhostCloakScentTrackDirector: fuite erratique et musc anti-molosses (Predators 2010)', () => {
  const state = createRiverGhostState({ x: 0, y: 0, z: -10 });
  assert.equal(state.ghost.isCloaked, true);

  // Blesser le River Ghost
  const dmgRes = damageRiverGhost(state, 40);
  assert.equal(state.ghost.isCloaked, false, 'Le choc désactive le camouflage');

  // Achever le River Ghost
  damageRiverGhost(state, 100);
  assert.ok(state.ghost.isDead);

  // Récolte du musc et application sur le chasseur
  const harvest = harvestMuskGland(state);
  assert.ok(harvest.success);
  assert.ok(state.scentMask.isActive);

  // Les molosses perdent la trace
  const hound = { id: 'hell_hound_01', species: 'hell_hound', scentLost: false };
  updateRiverGhostDirector(state, 0.1, [hound]);
  assert.equal(hound.scentLost, true, 'Le molosse doit perdre la piste olfactive');
});

test('Chantier 5 — AcidResistantCeremonialShieldCrafting: bouclier en crâne de xénomorphe (AVP 2004)', () => {
  const state = createCarapaceShieldCraftState();
  assert.equal(state.isShieldCrafted, false);

  addCarapacePlates(state, 2);
  const craft = craftCarapaceShield(state);
  assert.ok(craft.success);
  assert.equal(state.isShieldEquipped, true);

  // Blocage d'acide frontal : 100% invulnérabilité
  const acidBlock = evaluateShieldBlock(state, { type: 'acid_splash', damage: 80, angle: 0 }, 0);
  assert.ok(acidBlock.blocked);
  assert.equal(acidBlock.damageTaken, 0, 'Le sang acide doit infliger 0 dégât au bouclier en chitine');
  assert.equal(state.blockedAcidIncidents, 1);

  // Blocage d'attaque physique
  const meleeBlock = evaluateShieldBlock(state, { type: 'physical', damage: 40, angle: 0 }, 0);
  assert.ok(meleeBlock.blocked);
  assert.ok(meleeBlock.damageTaken <= 10, '75% de mitigation des attaques physiques');
});

test('Chantier 6 — FugitiveWristGauntletEnergyShield: champ hexagonal et déviation de tirs (The Predator 2018)', () => {
  const state = createFugitiveEnergyShieldState();
  assert.equal(state.isDeployed, false);

  const deployed = deployEnergyShield(state);
  assert.ok(deployed);
  assert.equal(state.isDeployed, true);

  // Déviation de tirs balistiques
  const deflect = deflectIncomingProjectile(state, 50.0);
  assert.ok(deflect.deflected);
  assert.ok(deflect.damagePassed <= 6.0, '90% des dégâts balistiques doivent être absorbés');
  assert.equal(state.deflectedCount, 1);

  // Coup de bouclier (Shield Bash)
  const target = { id: 'traitor_hunter', health: 100 };
  const bash = performShieldBash(state, target);
  assert.ok(bash.success);
  assert.ok(target.health < 100);
  assert.ok(target.isStaggered);

  // Mise à jour de la charge
  updateFugitiveEnergyShield(state, 1.0);
  assert.ok(state.charge < HOLO_SHIELD_CONSTANTS.MAX_CHARGE);
});

test('Chantier 7 — MaternityWardInfestationSector: cocons et flaques de mucus (AVP:R 2007)', () => {
  const state = createMaternityWardState();
  assert.ok(state.pods.length >= 3);
  assert.ok(state.slimePools.length >= 2);

  // Destruction cautérisée au plasma
  const purgeRes = damageIncubatorPod(state, 'pod_cradle_01', 90, true);
  assert.ok(purgeRes.destroyed);
  assert.ok(purgeRes.cauterized);

  // Destruction non-cautérisée : explosion d'acide
  const ruptureRes = damageIncubatorPod(state, 'pod_cradle_02', 90, false);
  assert.ok(ruptureRes.destroyed);
  assert.equal(ruptureRes.cauterized, false);

  // Ralentissement sur le mucus
  const nurse = { id: 'survivor', x: -4.5, z: -12.0 };
  updateMaternityWardSector(state, 0.1, [nurse]);
  assert.ok(nurse.isOnSlime);
  assert.ok(nurse.speedMultiplier < 1.0);
});

test('Chantier 8 — BlainMinigunSuppressionZone: Old Painless et fauchage de canopée (Predator 1987)', () => {
  const state = createBlainMinigunState(500);
  assert.equal(state.ammo, 500);

  // Démarrage de la rotation des canons
  spinUpMinigun(state);
  assert.ok(state.isSpinning);

  // Atteindre la pleine vitesse de rotation
  updateBlainMinigunState(state, 0.8);
  assert.ok(state.spinLevel >= 0.95);

  // Tir de saturation avec Predator camouflé dans le cône
  const cloakedPredator = { id: 'jungle_hunter', x: 0, z: 20, isCloaked: true, health: 300 };
  const foliage = { id: 'palm_cluster_01', x: 0, z: 15, durability: 50 };

  const fireRes = fireMinigunBarrage(state, { x: 0, z: 0 }, Math.PI / 2, 0.2, [cloakedPredator], [foliage]);

  assert.ok(fireRes.roundsFiredThisFrame >= 8);
  assert.equal(cloakedPredator.isCloaked, false, 'Le déluge de plomb doit disrupter le camouflage optique');
  assert.ok(cloakedPredator.isLuminescentBleeding, 'Le Predator doit saigner du sang vert luminescent');
  assert.ok(cloakedPredator.isSuppressed, 'Le tir doit infliger la suppression');
  assert.ok(foliage.isDestroyed, 'La canopée végétale doit être fauchée');
});

test('Chantier 9 — BerserkerPreyCampCagesSector: cages de gibier et totem du Jungle Hunter (Predators 2010)', () => {
  const state = createBerserkerCampState();
  assert.ok(state.cages.length >= 3);
  assert.equal(state.totem.isFreed, false);

  // Libération d'une cage
  const cageRes = unlatchPreyCage(state, 'cage_01');
  assert.ok(cageRes.success);
  assert.equal(state.freedCaptivesCount, 1);

  // Section des liens du totem du Jungle Hunter
  const cut1 = cutTotemBonds(state, 40);
  assert.equal(cut1.freed, false);
  const cut2 = cutTotemBonds(state, 50);
  assert.equal(cut2.freed, true);
  assert.equal(state.totem.isFreed, true);
  assert.equal(cut2.rewardGear, 'classic_jungle_hunter_plasma_caster');
});

test('Chantier 10 — Synthèse audio des 15 méthodes v132 et respect Draw Calls Mothership', () => {
  const v132AudioMethods = [
    'playMeatHookRattle',
    'playColdBovineThud',
    'playUltravioletHumChirp',
    'playRawhideSnapTwang',
    'playRiverGhostMuskHiss',
    'playChitinShieldCraftClank',
    'playHoloShieldEnergyHum',
    'playHoloShieldDeflectZap',
    'playIncubatorResinBubble',
    'playOldPainlessSpinUp',
    'playDefoliationBarrage',
    'playPredatorTotemCreak',
    'playCageRatchClink',
    'playUVPhosphorSizzle',
    'playMeatLockerFreezerFan',
  ];

  v132AudioMethods.forEach(method => {
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
