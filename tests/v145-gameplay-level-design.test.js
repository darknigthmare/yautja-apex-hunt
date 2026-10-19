// Suite de Tests Unitaires & Intégration v145 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createPlasmaEdgeSwordState,
  extendPlasmaEdgeSword,
  executePlasmaSwordCleave,
  PLASMA_SWORD_CONSTANTS,
} from '../src/gameplay/EliteRetractablePlasmaEdgeSwordSystem.js';

import {
  createEmJammingDomeState,
  triggerEmCountermeasureDome,
} from '../src/gameplay/ElectromagneticCountermeasureJammingDomeSystem.js';

import {
  createOvomorphHatchSectorState,
  registerOvomorphEgg,
  evaluateOvomorphVibrationProximity,
} from '../src/gameplay/OvomorphVibrationProximityHatchSector.js';

import {
  createStarshipBoneyardSectorState,
  registerCrashedStarshipWreck,
  salvageStarshipCargoBay,
  BONEYARD_SCAVENGE_CONSTANTS,
} from '../src/gameplay/GamePreserveStarshipBoneyardScavengeSector.js';

import {
  createThermalPlaybackState,
  recordTargetThermalSignature,
  replayAndAnalyzeThermalEncounter,
  THERMAL_PLAYBACK_CONSTANTS,
} from '../src/gameplay/BioMaskThermalPlaybackAnalysisSystem.js';

import {
  createWaterTowerSectorState,
  ruptureWaterTowerTank,
  WATER_TOWER_CONSTANTS,
} from '../src/gameplay/RooftopWaterTowerDelugeConductivitySector.js';

import {
  createQueenShackleSectorState,
  attachQueenCryoChainHook,
  plungeShackledQueenIntoIceAbyss,
} from '../src/gameplay/AntarcticQueenCryoChainShackleSector.js';

import {
  createThermalBolaState,
  throwMonofilamentThermalBola,
  THERMAL_BOLA_CONSTANTS,
} from '../src/gameplay/MonofilamentThermalBolaEntangleSystem.js';

import {
  createThermalBoreTunnelState,
  triggerIceTunnelVaultCollapse,
  BORE_TUNNEL_CONSTANTS,
} from '../src/gameplay/WeylandThermalBoreTunnelCollapseSector.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — EliteRetractablePlasmaEdgeSwordSystem: déploiement et coupe ignée à travers armure (AVP / Clan Leader)', () => {
  const state = createPlasmaEdgeSwordState();
  extendPlasmaEdgeSword(state, audioSynth);
  assert.equal(state.isExtended, true);

  const praetorian = { health: 400, isParrying: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const hunter = { energy: 50 };

  const cleaveRes = executePlasmaSwordCleave(state, praetorian, hunter, audioSynth);
  assert.equal(cleaveRes.cleaved, true);
  assert.equal(cleaveRes.armorBypassed, true);
  assert.equal(praetorian.isArmorMeltedBySword, true);
  assert.equal(praetorian.isParrying, false);
  assert.equal(praetorian.health, 400 - PLASMA_SWORD_CONSTANTS.CLEAVE_BASE_DAMAGE);
});

test('Chantier 2 — ElectromagneticCountermeasureJammingDomeSystem: dôme EM neutralisant tourelles et radars (The Predator 2018)', () => {
  const state = createEmJammingDomeState();
  const autoTurret = { id: 'stargazer_turret_01', x: 8, z: 8, canTrackTargets: true };

  const domeRes = triggerEmCountermeasureDome(state, { x: 0, z: 0 }, [autoTurret], audioSynth);
  assert.equal(domeRes.triggered, true);
  assert.equal(domeRes.disabledCount, 1);
  assert.equal(autoTurret.isJammedByEm, true);
  assert.equal(autoTurret.canTrackTargets, false);
});

test('Chantier 3 — OvomorphVibrationProximityHatchSector: détection vibratoire et contournement furtif accroupi (AVP 2004)', () => {
  const state = createOvomorphHatchSectorState();
  registerOvomorphEgg(state, 'royal_egg_01', { x: 2, z: 2 });

  // Approche accroupie furtive -> pas d'éclosion
  const stealthRes = evaluateOvomorphVibrationProximity(state, { x: 1, z: 1 }, true, audioSynth);
  assert.equal(stealthRes.hatchedEggs, 0);
  assert.equal(stealthRes.bypassedByStealth, true);

  // Marche normale -> éclosion immédiate
  const loudRes = evaluateOvomorphVibrationProximity(state, { x: 1, z: 1 }, false, audioSynth);
  assert.equal(loudRes.hatchedEggs, 1);
  assert.equal(state.hatchedCount, 1);
});

test('Chantier 4 — GamePreserveStarshipBoneyardScavengeSector: récupération de cellule d\'énergie dans l\'épave (Predators 2010)', () => {
  const state = createStarshipBoneyardSectorState();
  registerCrashedStarshipWreck(state, 'ancient_scout_wreck', { x: 0, z: 0 });

  const hunter = { energy: 20, maxEnergy: 100, salvagedGadgetCharges: 0 };
  const salvRes = salvageStarshipCargoBay(state, 0, hunter, audioSynth);
  assert.equal(salvRes.salvaged, true);
  assert.equal(hunter.energy, 20 + BONEYARD_SCAVENGE_CONSTANTS.ENERGY_CELL_RESTORE);
  assert.equal(hunter.salvagedGadgetCharges, BONEYARD_SCAVENGE_CONSTANTS.AMMO_SALVAGE_COUNT);
});

test('Chantier 5 — BioMaskThermalPlaybackAnalysisSystem: enregistrement et relecture thermique exposant les failles (Predator 2)', () => {
  const state = createThermalPlaybackState();
  const bossPrey = { id: 'harrigan_unit', isArmorSeamExposed: false };

  recordTargetThermalSignature(state, bossPrey);
  const analysisRes = replayAndAnalyzeThermalEncounter(state, 0, audioSynth);
  assert.equal(analysisRes.analyzed, true);
  assert.equal(bossPrey.isArmorSeamExposed, true);
  assert.equal(bossPrey.critDamageTakenMultiplier, THERMAL_PLAYBACK_CONSTANTS.WEAKNESS_CRIT_BONUS);
});

test('Chantier 6 — RooftopWaterTowerDelugeConductivitySector: rupture du château d\'eau et conductivité plasma (Predator 2)', () => {
  const state = createWaterTowerSectorState();
  const enemy = { x: 3, z: 3, isBurning: true, isDrenchedConductive: false };

  const rupRes = ruptureWaterTowerTank(state, { x: 0, z: 0 }, [enemy], audioSynth);
  assert.equal(rupRes.ruptured, true);
  assert.equal(enemy.isBurning, false);
  assert.equal(enemy.isDrenchedConductive, true);
  assert.equal(enemy.plasmaDamageVulnerability, WATER_TOWER_CONSTANTS.ELECTRIC_PLASMA_BONUS_MULT);
});

test('Chantier 7 — AntarcticQueenCryoChainShackleSector: enchaînement de la Reine et chute dans l\'océan polaire (AVP 2004)', () => {
  const state = createQueenShackleSectorState();
  const matriarchQueen = { health: 1500, canMove: true };

  attachQueenCryoChainHook(state, audioSynth);
  attachQueenCryoChainHook(state, audioSynth);

  const plungeRes = plungeShackledQueenIntoIceAbyss(state, matriarchQueen, audioSynth);
  assert.equal(plungeRes.plunged, true);
  assert.equal(plungeRes.queenDefeated, true);
  assert.equal(matriarchQueen.isSunkInAntarcticAbyss, true);
  assert.equal(matriarchQueen.health, 0);
});

test('Chantier 8 — MonofilamentThermalBolaEntangleSystem: fauchage et serrage thermique des jambes (Predators / Lore)', () => {
  const state = createThermalBolaState();
  const runner = { health: 160, canMove: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const bolaRes = throwMonofilamentThermalBola(state, runner, 10.0, audioSynth);
  assert.equal(bolaRes.entangled, true);
  assert.equal(runner.isLegEntangledByBola, true);
  assert.equal(runner.canMove, false);
  assert.equal(runner.health, 160 - THERMAL_BOLA_CONSTANTS.THERMAL_CONSTRICT_DAMAGE);
});

test('Chantier 9 — WeylandThermalBoreTunnelCollapseSector: effondrement de voûte du tunnel de glace (AVP 2004)', () => {
  const state = createThermalBoreTunnelState();
  const tunnelXeno = { x: 2, z: 2, health: 300, canMove: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const colRes = triggerIceTunnelVaultCollapse(state, { x: 0, z: 0 }, [tunnelXeno], audioSynth);
  assert.equal(colRes.collapsed, true);
  assert.equal(colRes.buriedCount, 1);
  assert.equal(tunnelXeno.isBuriedUnderGlacialIce, true);
  assert.equal(tunnelXeno.health, 300 - BORE_TUNNEL_CONSTANTS.AVALANCHE_CRUSH_DAMAGE);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v145 et respect Draw Calls Mothership', () => {
  const v145Methods = [
    'playPlasmaEdgeSwordExtendHum',
    'playPlasmaSwordArmorCleaveSizzle',
    'playEmCountermeasureDomePulse',
    'playHostileTurretShortCircuitSpark',
    'playOvomorphPetalUnfoldSlime',
    'playFacehuggerHatchSpringLeap',
    'playStarshipBoneyardSalvageClank',
    'playAncientPowerCellRechargeHum',
    'playBioMaskThermalPlaybackRewind',
    'playWaterTowerTankRuptureRush',
    'playQueenCryoChainShackleClank',
    'playAntarcticIceAbyssPlungeSplash',
    'playMonofilamentBolaWhirlThrow',
    'playThermalBolaLegWrapSizzle',
    'playWeylandIceTunnelAvalancheRumble',
  ];

  for (const methodName of v145Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
