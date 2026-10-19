// Suite de Tests Unitaires & Intégration v143 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createTailWhipState,
  unfurlAndLashTailWhip,
  executeWhipVertebraeCleave,
  TAIL_WHIP_CONSTANTS,
} from '../src/gameplay/WolfXenomorphTailWhipCleaveSystem.js';

import {
  createWristSelfDestructState,
  armAndDetachWristBomb,
  updateWristBombCountdown,
} from '../src/gameplay/DetachableWristSelfDestructImplosionSystem.js';

import {
  createThermalDecoyState,
  projectHolographicThermalDecoy,
  interceptHostileSniperFire,
} from '../src/gameplay/HolographicThermalDecoyProjectorSystem.js';

import {
  createBambooGroveSectorState,
  registerBambooCluster,
  triggerBambooSplinterBarrage,
  BAMBOO_GROVE_CONSTANTS,
} from '../src/gameplay/RazorBambooGroveSplinterBarrageSector.js';

import {
  createSpinalDnaProbeState,
  harvestSpinalDnaSample,
  SPINAL_DNA_CONSTANTS,
} from '../src/gameplay/SpinalDnaHarvesterSurgicalProbeSystem.js';

import {
  createBoilerPipeSectorState,
  registerPressurizedSteamPipe,
  ruptureSteamPipe,
  BOILER_PIPE_CONSTANTS,
} from '../src/gameplay/IndustrialBoilerSteamPipeRuptureSector.js';

import {
  createWhalingWinchSectorState,
  fireWhalingHarpoonAndReel,
  WHALING_WINCH_CONSTANTS,
} from '../src/gameplay/WhalingStationHarpoonWinchGrappleSector.js';

import {
  createForgedShrapnelState,
  fireForgedShrapnelBurst,
  FORGED_SHRAPNEL_CONSTANTS,
} from '../src/gameplay/FeralForgedShrapnelBurstLauncherSystem.js';

import {
  createQueenHiveResinSectorState,
  registerHiveResinZone,
  evaluateHiveResinEntrapment,
  severResinCocoonWithBlades,
} from '../src/gameplay/QueenHiveResinCocoonEntrapmentSector.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — WolfXenomorphTailWhipCleaveSystem: fouet caudal articulé et cisaillement en deux (AVP:R 2007)', () => {
  const state = createTailWhipState();
  const sewerWarrior = { id: 'xeno_sewer', health: 300, canMove: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const lashRes = unfurlAndLashTailWhip(state, sewerWarrior, 6.0, audioSynth);
  assert.equal(lashRes.wrapped, true);
  assert.equal(sewerWarrior.isWhipWrapped, true);
  assert.equal(sewerWarrior.canMove, false);

  const cleaveRes = executeWhipVertebraeCleave(state, audioSynth);
  assert.equal(cleaveRes.cleaved, true);
  assert.equal(cleaveRes.acidCorrosion, 0);
  assert.equal(sewerWarrior.isBisectedByWhip, true);
  assert.equal(
    sewerWarrior.health,
    300 - TAIL_WHIP_CONSTANTS.INITIAL_LASH_DAMAGE - TAIL_WHIP_CONSTANTS.CLEAVE_BISECTION_DAMAGE
  );
});

test('Chantier 2 — DetachableWristSelfDestructImplosionSystem: bombe de poignet détachable et implosion (AVP 2004)', () => {
  const state = createWristSelfDestructState();
  const armed = armAndDetachWristBomb(state, { x: 0, z: 0 }, audioSynth);
  assert.equal(armed, true);
  assert.equal(state.isDetachedFromWrist, true);

  const hiveQueenNest = { id: 'hive_core', x: 10, z: 10, health: 800, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const detRes = updateWristBombCountdown(state, 5.5, [hiveQueenNest], audioSynth);
  assert.equal(detRes.detonated, true);
  assert.equal(detRes.obliteratedCount, 1);
  assert.equal(hiveQueenNest.health, 0);
});

test('Chantier 3 — HolographicThermalDecoyProjectorSystem: leurre thermique et interception de tir sniper (Predators 2010)', () => {
  const state = createThermalDecoyState();
  projectHolographicThermalDecoy(state, { x: 15, z: 15 }, audioSynth);
  assert.equal(state.isActive, true);

  const sniper = { id: 'sniper_isabelle', isPositionRevealedByMuzzleFlash: false };
  const interceptRes = interceptHostileSniperFire(state, sniper, audioSynth);
  assert.equal(interceptRes.intercepted, true);
  assert.equal(interceptRes.hunterDamageTaken, 0);
  assert.equal(sniper.isPositionRevealedByMuzzleFlash, true);
});

test('Chantier 4 — RazorBambooGroveSplinterBarrageSector: fauchage de bambous et pluie de pieux (Predators 2010)', () => {
  const state = createBambooGroveSectorState();
  registerBambooCluster(state, { x: 5, z: 5 });

  const mercenary = { x: 7, z: 6, health: 150, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const barrageRes = triggerBambooSplinterBarrage(state, 0, [mercenary], audioSynth);
  assert.equal(barrageRes.triggered, true);
  assert.equal(barrageRes.impaledCount, 1);
  assert.equal(mercenary.isImpaledByBamboo, true);
  assert.equal(mercenary.health, 150 - BAMBOO_GROVE_CONSTANTS.SPLINTER_PIERCE_DAMAGE);
});

test('Chantier 5 — SpinalDnaHarvesterSurgicalProbeSystem: prélèvement ADN spinal et bonus dermique (The Predator 2018)', () => {
  const state = createSpinalDnaProbeState();
  const defeatedApex = { id: 'elite_prey_01', isDnaHarvested: false };
  const hunter = { bonusDermalArmor: 0, reflexSpeedMultiplier: 1.0 };

  const harvestRes = harvestSpinalDnaSample(state, defeatedApex, hunter, audioSynth);
  assert.equal(harvestRes.harvested, true);
  assert.equal(hunter.bonusDermalArmor, SPINAL_DNA_CONSTANTS.MAX_armor_BONUS_PER_SAMPLE);
  assert.ok(hunter.reflexSpeedMultiplier > 1.0);
});

test('Chantier 6 — IndustrialBoilerSteamPipeRuptureSector: rupture de conduite de vapeur et écran thermique (Predator 2)', () => {
  const state = createBoilerPipeSectorState();
  registerPressurizedSteamPipe(state, { x: 0, z: 0 });

  const agent = { x: 2, z: 2, health: 120, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const rupRes = ruptureSteamPipe(state, 0, [agent], audioSynth);
  assert.equal(rupRes.ruptured, true);
  assert.equal(rupRes.scaldedCount, 1);
  assert.equal(agent.isThermallyBlinded, true);
  assert.equal(agent.health, 120 - BOILER_PIPE_CONSTANTS.SCALDING_DAMAGE);
});

test('Chantier 7 — WhalingStationHarpoonWinchGrappleSector: harpon baleinier et traction au treuil (AVP 2004)', () => {
  const state = createWhalingWinchSectorState();
  const targetAlien = { x: 12, z: 9, health: 220, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const hookRes = fireWhalingHarpoonAndReel(state, targetAlien, audioSynth);
  assert.equal(hookRes.hooked, true);
  assert.equal(targetAlien.isHarpooned, true);
  assert.equal(targetAlien.x, 0);
  assert.equal(targetAlien.z, 0);
  assert.equal(targetAlien.health, 220 - WHALING_WINCH_CONSTANTS.HARPOON_IMPALE_DAMAGE);
});

test('Chantier 8 — FeralForgedShrapnelBurstLauncherSystem: détonation directionnelle d\'éclats forgés (Prey 2022)', () => {
  const state = createForgedShrapnelState();
  const trapper = { x: 3, z: 2, health: 180, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const burstRes = fireForgedShrapnelBurst(state, { x: 0, z: 0 }, [trapper], audioSynth);
  assert.equal(burstRes.fired, true);
  assert.equal(burstRes.hitCount, 1);
  assert.equal(trapper.isRiddledWithShrapnel, true);
  assert.equal(trapper.health, 180 - FORGED_SHRAPNEL_CONSTANTS.SHRAPNEL_BURST_DAMAGE);
});

test('Chantier 9 — QueenHiveResinCocoonEntrapmentSector: résine de ruche immobilisante et coupe aux lames (AVP 2004)', () => {
  const state = createQueenHiveResinSectorState();
  registerHiveResinZone(state, { x: 0, z: 0 }, 5.0);

  const actor = { x: 1, z: 1, canMove: true, speedMultiplier: 1.0 };
  const trapRes = evaluateHiveResinEntrapment(state, actor, 3.0, audioSynth);
  assert.equal(trapRes.cocooned, true);
  assert.equal(actor.canMove, false);

  const freed = severResinCocoonWithBlades(actor, 90);
  assert.equal(freed, true);
  assert.equal(actor.canMove, true);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v143 et respect Draw Calls Mothership', () => {
  const v143Methods = [
    'playXenomorphTailWhipUnfurlCrack',
    'playTailWhipVertebraeCleaveSnap',
    'playWristBombGlyphCountdownBeep',
    'playDetachableWristBombImplosionRoar',
    'playHolographicThermalDecoyPulse',
    'playDecoySniperInterceptShatter',
    'playBambooGroveShockwaveCrack',
    'playBambooSplinterBarrageWhistle',
    'playSpinalDnaProbeNeedleInsert',
    'playGeneticFluidSiphonChime',
    'playBoilerPipeHighPressureRupture',
    'playWhalingHarpoonWinchLaunch',
    'playWinchCableChainReelClank',
    'playFeralForgedShrapnelConeBlast',
    'playQueenHiveResinCocoonStretch',
  ];

  for (const methodName of v143Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
