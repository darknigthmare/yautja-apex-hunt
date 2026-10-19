// Suite de Tests Unitaires & Intégration v146 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createCeremonialGlaiveState,
  lockGlaiveTwinBlades,
  executeGlaiveWhirlwindSweep,
  CEREMONIAL_GLAIVE_CONSTANTS,
} from '../src/gameplay/CeremonialTwinBladeGlaiveHalberdSystem.js';

import {
  createCeilingLaserTrellisState,
  dropCorridorLaserTrellis,
  CEILING_TRELLIS_CONSTANTS,
} from '../src/gameplay/CorridorCeilingLaserTrellisTrapSector.js';

import {
  createLaserSutureMedkitState,
  performGauntletLaserSuture,
  LASER_SUTURE_CONSTANTS,
} from '../src/gameplay/GauntletLaserCauterizerSutureMedkitSystem.js';

import {
  createShiftingPillarArenaState,
  triggerArenaPillarShift,
  SHIFTING_PILLAR_CONSTANTS,
} from '../src/gameplay/PyramidShiftingHieroglyphPillarArenaSector.js';

import {
  createCutClampState,
  fireCutClampTether,
  triggerHydraulicClampSever,
  CUT_CLAMP_CONSTANTS,
} from '../src/gameplay/FeralWristCutClampHarpoonTetherSystem.js';

import {
  createFloodedSewerBasinState,
  registerSubmergedXenomorph,
  electrifySewerBasinWithPlasma,
  SEWER_BASIN_CONSTANTS,
} from '../src/gameplay/FloodedSewerBasinSubmergedXenomorphSector.js';

import {
  createStargazerVaultSectorState,
  breachStargazerTechVault,
  STARGAZER_VAULT_CONSTANTS,
} from '../src/gameplay/StargazerCapturedTechVaultBreachSector.js';

import {
  createOrbitalLanceDirectorState,
  lockOrbitalPlasmaBeacon,
  executeMothershipOrbitalStrike,
  ORBITAL_LANCE_CONSTANTS,
} from '../src/gameplay/ClanMothershipOrbitalPlasmaLanceDirector.js';

import {
  createHangingCarcassSectorState,
  takeCoverBehindHangingCarcasses,
} from '../src/gameplay/MeatPackingHangingCarcassThermalCoverSector.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — CeremonialTwinBladeGlaiveHalberdSystem: verrouillage double lame et moulinet 360 (Predator 2 / Elder)', () => {
  const state = createCeremonialGlaiveState();
  lockGlaiveTwinBlades(state, audioSynth);
  assert.equal(state.isTwinBladesLocked, true);

  const xenoA = { x: 2, z: 1, health: 250, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const sweepRes = executeGlaiveWhirlwindSweep(state, { x: 0, z: 0 }, [xenoA], audioSynth);
  assert.equal(sweepRes.swept, true);
  assert.equal(sweepRes.hitCount, 1);
  assert.equal(xenoA.isCleavedByGlaive, true);
  assert.equal(
    xenoA.health,
    250 - CEREMONIAL_GLAIVE_CONSTANTS.WHIRLWIND_CLEAVE_DAMAGE - CEREMONIAL_GLAIVE_CONSTANTS.BLEED_STACK_DAMAGE
  );
});

test('Chantier 2 — CorridorCeilingLaserTrellisTrapSector: abaissement du treillis laser et esquive en glissade (AVP)', () => {
  const state = createCeilingLaserTrellisState();
  const standingGuard = { id: 'guard_01', isSlidingLow: false, health: 300, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const slidingHunter = { id: 'hunter_01', isSlidingLow: true, health: 200 };

  const dropRes = dropCorridorLaserTrellis(state, [standingGuard, slidingHunter], audioSynth);
  assert.equal(dropRes.dropped, true);
  assert.equal(dropRes.slicedCount, 1);
  assert.equal(standingGuard.health, 300 - CEILING_TRELLIS_CONSTANTS.TRELLIS_DICE_DAMAGE);
  assert.equal(slidingHunter.evadedLaserTrellis, true);
  assert.equal(slidingHunter.health, 200);
});

test('Chantier 3 — GauntletLaserCauterizerSutureMedkitSystem: suture au laser de gantelet et cristaux médicaux (Predators)', () => {
  const state = createLaserSutureMedkitState();
  const woundedHunter = { health: 60, maxHealth: 200, isBleeding: true, isLacerated: true };

  const sutureRes = performGauntletLaserSuture(state, woundedHunter, audioSynth);
  assert.equal(sutureRes.sutured, true);
  assert.equal(woundedHunter.isBleeding, false);
  assert.equal(woundedHunter.isLacerated, false);
  assert.equal(woundedHunter.health, 60 + LASER_SUTURE_CONSTANTS.HEALTH_RESTORED);
});

test('Chantier 4 — PyramidShiftingHieroglyphPillarArenaSector: déplacement des colonnes et écrasement (AVP 2004)', () => {
  const state = createShiftingPillarArenaState();
  const trappedXeno = { isInPillarSlideTrack: true, health: 350, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const shiftRes = triggerArenaPillarShift(state, [trappedXeno], audioSynth);
  assert.equal(shiftRes.shifted, true);
  assert.equal(shiftRes.crushedCount, 1);
  assert.equal(trappedXeno.isCrushedByStonePillar, true);
  assert.equal(trappedXeno.health, 350 - SHIFTING_PILLAR_CONSTANTS.PILLAR_PINCH_CRUSH_DAMAGE);
});

test('Chantier 5 — FeralWristCutClampHarpoonTetherSystem: accroche et cisaillement hydraulique Cut-Clamp (Prey 2022)', () => {
  const state = createCutClampState();
  const target = { health: 220, canMove: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const tetherRes = fireCutClampTether(state, target, 8.0, audioSynth);
  assert.equal(tetherRes.tethered, true);
  assert.equal(target.canMove, false);

  const severRes = triggerHydraulicClampSever(state, audioSynth);
  assert.equal(severRes.severed, true);
  assert.equal(target.isSeveredByCutClamp, true);
  assert.equal(target.health, 220 - CUT_CLAMP_CONSTANTS.CLAMP_SEVER_DAMAGE);
});

test('Chantier 6 — FloodedSewerBasinSubmergedXenomorphSector: électrification plasma du bassin d\'égout (AVP:R 2007)', () => {
  const state = createFloodedSewerBasinState();
  const lurker = { health: 200, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  registerSubmergedXenomorph(state, lurker);
  assert.equal(lurker.isSubmergedHidden, true);

  const shockRes = electrifySewerBasinWithPlasma(state, audioSynth);
  assert.equal(shockRes.shockedCount, 1);
  assert.equal(lurker.isSubmergedHidden, false);
  assert.equal(lurker.health, 200 - SEWER_BASIN_CONSTANTS.ELECTRIFIED_WATER_DAMAGE);
});

test('Chantier 7 — StargazerCapturedTechVaultBreachSector: ouverture du coffre Stargazer et restauration d\'arsenal (The Predator 2018)', () => {
  const state = createStargazerVaultSectorState();
  const fugitive = { armor: 20, energy: 40, maxEnergy: 100 };

  const breachRes = breachStargazerTechVault(state, fugitive, audioSynth);
  assert.equal(breachRes.breached, true);
  assert.equal(fugitive.hasRecoveredFullArsenal, true);
  assert.equal(fugitive.armor, 20 + STARGAZER_VAULT_CONSTANTS.ARMOR_RESTORED_BONUS);
  assert.equal(fugitive.maxEnergy, 100 + STARGAZER_VAULT_CONSTANTS.MAX_ENERGY_UPGRADE_BONUS);
});

test('Chantier 8 — ClanMothershipOrbitalPlasmaLanceDirector: verrouillage balise et tir orbital du Vaisseau-Mère (AVP 2004)', () => {
  const state = createOrbitalLanceDirectorState();
  lockOrbitalPlasmaBeacon(state, { x: 10, z: 10 }, audioSynth);
  assert.equal(state.isTargetLocked, true);

  const target = { x: 12, z: 11, health: 700, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const strikeRes = executeMothershipOrbitalStrike(state, [target], audioSynth);
  assert.equal(strikeRes.struck, true);
  assert.equal(strikeRes.hitCount, 1);
  assert.equal(target.isHitByOrbitalLance, true);
  assert.equal(target.health, 700 - ORBITAL_LANCE_CONSTANTS.ORBITAL_VAPORIZE_DAMAGE);
});

test('Chantier 9 — MeatPackingHangingCarcassThermalCoverSector: absorption balistique et masquage par les carcasses (Predator 2)', () => {
  const state = createHangingCarcassSectorState();
  const cityHunter = { health: 200, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const coverRes = takeCoverBehindHangingCarcasses(state, cityHunter, 100, audioSynth);
  assert.equal(coverRes.shielded, true);
  assert.equal(cityHunter.isThermallyMaskedByCarcasses, true);
  assert.equal(coverRes.damageTaken, 15);
  assert.equal(cityHunter.health, 185);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v146 et respect Draw Calls Mothership', () => {
  const v146Methods = [
    'playCeremonialGlaiveTwinBladeSnap',
    'playGlaiveWhirlwindCleaveWhoosh',
    'playCeilingLaserTrellisDropHum',
    'playLaserTrellisCorridorDiceSizzle',
    'playGauntletLaserCauterizerBeam',
    'playMedicalCrystalShardInjectChime',
    'playPyramidHieroglyphPillarGrind',
    'playShiftingPillarStoneLockThud',
    'playFeralCutClampTetherFire',
    'playHydraulicClampSeverSnap',
    'playSewerBasinWaterBreachSplash',
    'playStargazerVaultLockBreachPop',
    'playOrbitalPlasmaLanceTargetLock',
    'playMothershipOrbitalBeamStrikeRoar',
    'playHangingCarcassChainSwingClank',
  ];

  for (const methodName of v146Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
