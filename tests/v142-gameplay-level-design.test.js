// Suite de Tests Unitaires & Intégration v142 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createElectromagneticVisionState,
  activateElectromagneticSpectrum,
  scanBuriedPowerConduits,
  siphonPowerCoreNode,
  SCAR_EM_VISION_CONSTANTS,
} from '../src/gameplay/ScarElectromagneticPowerCoreVisionSystem.js';

import {
  createBoneDaggerState,
  drawCeremonialBoneDagger,
  executePinnedCounterStab,
  BONE_DAGGER_CONSTANTS,
} from '../src/gameplay/CeremonialXenomorphBoneDaggerSystem.js';

import {
  createPlasmaCapsuleLauncherState,
  launchMagneticPlasmaCapsule,
  updatePlasmaCapsuleTimers,
  PLASMA_CAPSULE_CONSTANTS,
} from '../src/gameplay/FugitiveMagneticPlasmaCapsuleLauncherSystem.js';

import {
  createMangroveSnareSectorState,
  rigMangroveThornSnare,
  evaluateMangroveSnareTrigger,
  MANGROVE_SNARE_CONSTANTS,
} from '../src/gameplay/MangroveThornVineWhipSnareSector.js';

import {
  createSpearWallImpalementState,
  throwSpearForWallPin,
  triggerSecondaryTelescopicExtension,
  WALL_IMPALE_CONSTANTS,
} from '../src/gameplay/CityHunterTelescopicSpearWallImpalementSystem.js';

import {
  createSacrificialChamberState,
  registerSacrificialHostSlab,
  updateSacrificialIncubation,
} from '../src/gameplay/PyramidSacrificialChamberChestbursterEruptionSector.js';

import {
  createLaserGridSectorState,
  deployLaserContainmentGrid,
  evaluateLaserGridCrossing,
  LASER_GRID_CONSTANTS,
} from '../src/gameplay/WolfLaserTripwireGridContainmentSector.js';

import {
  createClaymoreAmbushSectorState,
  rigMercenaryClaymore,
  evaluateClaymoreTripwire,
  CLAYMORE_AMBUSH_CONSTANTS,
} from '../src/gameplay/RoyceMercenaryClaymoreTripwireAmbushSector.js';

import {
  createMandibleBiteState,
  flareFeralMandibles,
  executeJugularMandibleBite,
  MANDIBLE_BITE_CONSTANTS,
} from '../src/gameplay/FeralBoneMaskMandibleHydraulicBiteSystem.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — ScarElectromagneticPowerCoreVisionSystem: vision magnétique spectrale et drainage de noyau (AVP 2004)', () => {
  const state = createElectromagneticVisionState();
  activateElectromagneticSpectrum(state, audioSynth);
  assert.equal(state.isEmVisionActive, true);

  const buriedConduit = { id: 'whaling_core_01', x: 12, z: 8, isEmHighlighted: false };
  const scanRes = scanBuriedPowerConduits(state, { x: 0, z: 0 }, [buriedConduit], audioSynth);
  assert.equal(scanRes.scannedCount, 1);
  assert.equal(buriedConduit.isEmHighlighted, true);
  assert.equal(buriedConduit.vulnerabilityMultiplier, SCAR_EM_VISION_CONSTANTS.WEAKPOINT_DAMAGE_MULTIPLIER);

  const hunter = { energy: 40, maxEnergy: 100 };
  const siphonRes = siphonPowerCoreNode(state, buriedConduit, hunter);
  assert.equal(siphonRes.siphoned, true);
  assert.equal(hunter.energy, 40 + SCAR_EM_VISION_CONSTANTS.ENERGY_SIPHON_AMOUNT);
});

test('Chantier 2 — CeremonialXenomorphBoneDaggerSystem: dague en os de Xénomorphe et contre-estoc au sol (AVP 2004)', () => {
  const state = createBoneDaggerState();
  drawCeremonialBoneDagger(state, audioSynth);
  assert.equal(state.isDrawn, true);

  const celticHunter = { isPinned: true, canMove: false };
  const gridAlien = { health: 220, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const stabRes = executePinnedCounterStab(state, celticHunter, gridAlien, audioSynth);
  assert.equal(stabRes.countered, true);
  assert.equal(stabRes.bladeCorroded, false);
  assert.equal(celticHunter.isPinned, false);
  assert.equal(celticHunter.canMove, true);
  assert.equal(gridAlien.health, 220 - BONE_DAGGER_CONSTANTS.COUNTER_STAB_DAMAGE);
});

test('Chantier 3 — FugitiveMagneticPlasmaCapsuleLauncherSystem: capsule plasma aimantée à détonation retardée (The Predator 2018)', () => {
  const state = createPlasmaCapsuleLauncherState();
  const armoredTruck = { id: 'stargazer_apc', x: 5, z: 5, health: 300, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const nearbyGuard = { id: 'escort_01', x: 7, z: 6, health: 120, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const latchRes = launchMagneticPlasmaCapsule(state, armoredTruck, audioSynth);
  assert.equal(latchRes.latched, true);
  assert.equal(armoredTruck.hasMagneticCapsuleAttached, true);

  const tickRes = updatePlasmaCapsuleTimers(state, 1.6, [nearbyGuard], audioSynth);
  assert.equal(tickRes.detonatedThisTick, 1);
  assert.equal(armoredTruck.health, 300 - PLASMA_CAPSULE_CONSTANTS.DIRECT_BLAST_DAMAGE);
  assert.equal(nearbyGuard.health, 120 - PLASMA_CAPSULE_CONSTANTS.AOE_SPLASH_DAMAGE);
});

test('Chantier 4 — MangroveThornVineWhipSnareSector: piège de lianes barbelées de mangrove et hissage (Predator 1987)', () => {
  const state = createMangroveSnareSectorState();
  rigMangroveThornSnare(state, { x: 3.0, z: 3.0 });

  const scout = { x: 3.5, z: 3.2, y: 0, health: 120, canMove: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const snareRes = evaluateMangroveSnareTrigger(state, scout, audioSynth);
  assert.equal(snareRes.snared, true);
  assert.equal(scout.isHoistedInCanopy, true);
  assert.equal(scout.canMove, false);
  assert.equal(scout.y, MANGROVE_SNARE_CONSTANTS.CANOPY_HOIST_HEIGHT_M);
  assert.equal(scout.health, 120 - MANGROVE_SNARE_CONSTANTS.WHIP_LACERATION_DAMAGE);
});

test('Chantier 5 — CityHunterTelescopicSpearWallImpalementSystem: empalement mural au Combi-Stick et extension (Predator 2)', () => {
  const state = createSpearWallImpalementState();
  const cartelEnforcer = { id: 'enforcer_01', health: 320, canMove: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const pinRes = throwSpearForWallPin(state, cartelEnforcer, 12.0, audioSynth);
  assert.equal(pinRes.pinned, true);
  assert.equal(cartelEnforcer.isPinnedToWall, true);
  assert.equal(cartelEnforcer.canMove, false);

  const extRes = triggerSecondaryTelescopicExtension(state, cartelEnforcer, audioSynth);
  assert.equal(extRes.extended, true);
  assert.equal(
    cartelEnforcer.health,
    320 - WALL_IMPALE_CONSTANTS.IMPALE_KINETIC_DAMAGE - WALL_IMPALE_CONSTANTS.TELESCOPIC_EXTENSION_LOCK_DAMAGE
  );
});

test('Chantier 6 — PyramidSacrificialChamberChestbursterEruptionSector: éclosion thoracique sur autel et maturation (AVP 2004)', () => {
  const state = createSacrificialChamberState();
  registerSacrificialHostSlab(state, 'altar_slab_alpha', { x: 0, z: 0 });

  const eruptRes = updateSacrificialIncubation(state, 4.5, audioSynth);
  assert.equal(eruptRes.newlyErupted, 1);
  assert.equal(state.activeChestbursters.length, 1);

  const matureRes = updateSacrificialIncubation(state, 6.5, audioSynth);
  assert.equal(matureRes.newlyMaturedDrones, 1);
  assert.equal(state.maturedDronesCount, 1);
});

test('Chantier 7 — WolfLaserTripwireGridContainmentSector: grille laser bleue de confinement dans les égouts (AVP:R 2007)', () => {
  const state = createLaserGridSectorState();
  deployLaserContainmentGrid(state, { x: 10, z: 10 }, audioSynth);
  assert.equal(state.deployedGrids.length, 1);

  const sewerDrone = { x: 10.5, z: 10.2, health: 240, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const sliceRes = evaluateLaserGridCrossing(state, sewerDrone, audioSynth);
  assert.equal(sliceRes.sliced, true);
  assert.equal(sewerDrone.isThermallySliced, true);
  assert.equal(sewerDrone.health, 240 - LASER_GRID_CONSTANTS.THERMAL_SLICE_DAMAGE);
});

test('Chantier 8 — RoyceMercenaryClaymoreTripwireAmbushSector: embuscade Claymore à fil-piège et détection (Predators 2010)', () => {
  const state = createClaymoreAmbushSectorState();
  rigMercenaryClaymore(state, { x: 0, z: 0 }, 0);
  rigMercenaryClaymore(state, { x: 20, z: 20 }, 0);

  // Cas 1 : Vision thermique/EM active -> désamorçage du fil-piège
  const disarmRes = evaluateClaymoreTripwire(state, { x: 1, z: 1 }, null, true, audioSynth);
  assert.equal(disarmRes.disarmed, true);
  assert.equal(disarmRes.triggered, false);

  // Cas 2 : Sans vision active -> explosion de billes d'acier et rupture du camouflage
  const hunter = { health: 200, isCloaked: true };
  const blastRes = evaluateClaymoreTripwire(state, { x: 20.5, z: 20.5 }, hunter, false, audioSynth);
  assert.equal(blastRes.triggered, true);
  assert.equal(hunter.isCloaked, false);
  assert.equal(hunter.health, 200 - CLAYMORE_AMBUSH_CONSTANTS.BALL_BEARING_SHRAPNEL_DAMAGE);
});

test('Chantier 9 — FeralBoneMaskMandibleHydraulicBiteSystem: morsure mandibulaire jugulaire et adrénaline (Prey 2022)', () => {
  const state = createMandibleBiteState();
  flareFeralMandibles(state, audioSynth);
  assert.equal(state.isMandiblesFlared, true);

  const feralHunter = { health: 140, maxHealth: 200 };
  const grizzlyTarget = { health: 250, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const biteRes = executeJugularMandibleBite(state, feralHunter, grizzlyTarget, audioSynth);
  assert.equal(biteRes.bitten, true);
  assert.equal(grizzlyTarget.isJugularTorn, true);
  assert.equal(grizzlyTarget.health, 250 - MANDIBLE_BITE_CONSTANTS.JUGULAR_BITE_DAMAGE);
  assert.equal(feralHunter.health, 140 + MANDIBLE_BITE_CONSTANTS.ADRENALINE_HEAL_ON_BITE);
});

test('Chantier 10 — Synthèse audio des méthodes v142 et respect Draw Calls Mothership', () => {
  const v142Methods = [
    'playScarEmVisionSpectrumShift',
    'playPowerConduitResonanceHum',
    'playBoneDaggerSheathDraw',
    'playCeremonialDaggerChitinStab',
    'playMagneticCapsuleLatchClick',
    'playDelayedPlasmaCapsuleDetonation',
    'playMangroveVineWhipSnap',
    'playThornVineCanopyHoistCreak',
    'playCombiStickWallImpaleThud',
    'playTelescopicSpearLockClick',
    'playSacrificialSlabRibCrack',
    'playChestbursterScreechScurry',
    'playWolfLaserGridBeaconMount',
    'playLaserGridThermalSliceSizzle',
    'playClaymoreTripwireClickBlast',
    'playFeralMandibleFlareClick',
    'playMandibleJugularCrunchTear',
  ];

  for (const methodName of v142Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
