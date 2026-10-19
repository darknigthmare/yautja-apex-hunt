import test from 'node:test';
import assert from 'node:assert/strict';

import { SuperheatedPlasmaEnergyWhipLashSystem } from '../src/gameplay/SuperheatedPlasmaEnergyWhipLashSystem.js';
import { StargazerMagneticCraneCargoDropSector } from '../src/gameplay/StargazerMagneticCraneCargoDropSector.js';
import { SwampMethaneGasIgnitionSector } from '../src/gameplay/SwampMethaneGasIgnitionSector.js';
import { PyramidSacredPlasmacasterSarcophagusSector } from '../src/gameplay/PyramidSacredPlasmacasterSarcophagusSector.js';
import { ComancheRopeTetheredTomahawkRetrievalSystem } from '../src/gameplay/ComancheRopeTetheredTomahawkRetrievalSystem.js';
import { MothershipSkullTrophyWallSanctumDirector } from '../src/gameplay/MothershipSkullTrophyWallSanctumDirector.js';
import { VentilationShaftStealthInfiltrationSector } from '../src/gameplay/VentilationShaftStealthInfiltrationSector.js';
import { NeurotoxinParalyticDartLauncherSystem } from '../src/gameplay/NeurotoxinParalyticDartLauncherSystem.js';
import { PenthouseLightningRodStormConduitSector } from '../src/gameplay/PenthouseLightningRodStormConduitSector.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v148): SuperheatedPlasmaEnergyWhipLashSystem shatters shields and melts armor', () => {
  const whip = new SuperheatedPlasmaEnergyWhipLashSystem();
  const target = {
    id: 'heavy_stargazer_trooper',
    distanceMeters: 4.5,
    angleOffsetRadians: 0.2,
    hasRiotShield: true,
    armorRating: 100,
    health: 160
  };

  const sweep = whip.executeWidePlasmaSweep([target], 100);
  assert.equal(sweep.executed, true);
  assert.equal(sweep.targetsHitCount, 1);
  assert.equal(sweep.hitResults[0].shieldShattered, true);
  assert.ok(target.armorRating < 50);

  const pulse = whip.triggerCoiledThermalPulse(target, 100);
  assert.equal(pulse.triggered, true);
  assert.equal(target.armorRating, 0);
  assert.equal(target.thermallySevered, true);
});

test('Chantier 2 (v148): StargazerMagneticCraneCargoDropSector drops container to crush units and create heavy cover', () => {
  const sector = new StargazerMagneticCraneCargoDropSector();
  const units = [
    { id: 'merc_under_crane', x: -11.5, z: 8.2, health: 180 },
    { id: 'merc_nearby', x: -5.0, z: 8.0, health: 120 }
  ];

  const drop = sector.disengageElectromagnet('crane_alpha_north', units);
  assert.equal(drop.dropped, true);
  assert.deepEqual(drop.crushedUnitIds, ['merc_under_crane']);
  assert.equal(units[0].health, 0);
  assert.deepEqual(drop.staggeredUnitIds, ['merc_nearby']);
  assert.equal(sector.getSectorStatus().deployedHeavyCoversCount, 1);
});

test('Chantier 3 (v148): SwampMethaneGasIgnitionSector obscures optics then ignites into thermal whiteout blast', () => {
  const swamp = new SwampMethaneGasIgnitionSector();
  const preVis = swamp.sampleEnvironmentalVisibility({ x: -16, z: 10 });
  assert.ok(preVis.opticalFogDensity > 0.7);
  assert.equal(preVis.isThermalVisionOverloaded, false);

  const squad = [{ id: 'spec_ops_1', x: -15, z: 10, health: 150 }];
  const blast = swamp.triggerSparkOrPlasmaAt({ x: -16, z: 10 }, squad);
  assert.equal(blast.ignited, true);
  assert.ok(squad[0].health < 40);

  const postVis = swamp.sampleEnvironmentalVisibility({ x: -16, z: 10 });
  assert.equal(postVis.isThermalVisionOverloaded, true);
});

test('Chantier 4 (v148): PyramidSacredPlasmacasterSarcophagusSector unlocks via 4 glyphs or triggers trap on human theft', () => {
  const sarcophagus = new PyramidSacredPlasmacasterSarcophagusSector();
  for (const glyph of ['SOLSTICE_ECLIPSE', 'SERPENT_CROWN', 'STAR_HUNTER_MOON', 'BLOODED_CREST']) {
    const res = sarcophagus.inputWristbandGlyph(glyph);
    assert.equal(res.accepted, true);
  }
  assert.equal(sarcophagus.getStatus().sealUnlocked, true);

  const claim = sarcophagus.claimSacredPlasmacaster('YAUTJA_INITIATE');
  assert.equal(claim.claimed, true);
  assert.equal(claim.pyramidTrapTriggeredByTheft, false);

  const theftClaim = sarcophagus.claimSacredPlasmacaster('HUMAN_EXPEDITION');
  assert.equal(theftClaim.claimed, true);
  assert.equal(theftClaim.pyramidTrapTriggeredByTheft, true);
});

test('Chantier 5 (v148): ComancheRopeTetheredTomahawkRetrievalSystem throws, yanks back, and sweeps legs', () => {
  const tomahawk = new ComancheRopeTetheredTomahawkRetrievalSystem();
  const enemy = { id: 'fur_trapper_1', distanceMeters: 7.0, health: 120 };

  const thrown = tomahawk.throwTetheredTomahawk(enemy);
  assert.equal(thrown.thrown, true);
  assert.equal(tomahawk.getStatus().inHand, false);

  const yanked = tomahawk.yankRopeToRetrieve(enemy);
  assert.equal(yanked.retrieved, true);
  assert.equal(yanked.targetPulledOffBalance, true);
  assert.equal(tomahawk.getStatus().inHand, true);

  const sweep = tomahawk.executeCircularRopeLegSweep([{ id: 'trapper_2', distanceMeters: 3.1, health: 100 }]);
  assert.equal(sweep.knockedDownCount, 1);
});

test('Chantier 6 (v148): MothershipSkullTrophyWallSanctumDirector mounts bleached skulls and bestows 1715 relic', () => {
  const sanctum = new MothershipSkullTrophyWallSanctumDirector();
  const mount = sanctum.mountBleachedSkullTrophy({
    species: 'APEX_QUEEN_GUARD',
    bleachedAndCleaned: true,
    honorValue: 300
  });

  assert.equal(mount.mounted, true);
  assert.equal(mount.elderRelicBestowed, true);
  assert.equal(mount.bestowedRelic.id, 'raphael_adolini_1715_flintlock_relic');
});

test('Chantier 7 (v148): VentilationShaftStealthInfiltrationSector unseals grates and executes ceiling drop ambush', () => {
  const vents = new VentilationShaftStealthInfiltrationSector();
  const entry = vents.laserUnsealAndEnterGrate('grate_morgue_north');
  assert.equal(entry.entered, true);
  assert.ok(entry.radarAcousticDampening > 0.9);

  const move = vents.traverseDuctToGrate('grate_corridor_central');
  assert.equal(move.traversed, true);

  const guard = { id: 'owly_guard', x: 2.2, z: 11.8, health: 100 };
  const ambush = vents.executeVentDropAmbush(guard);
  assert.equal(ambush.ambushed, true);
  assert.equal(guard.health, 0);
  assert.equal(guard.pulledIntoCeiling, true);
});

test('Chantier 8 (v148): NeurotoxinParalyticDartLauncherSystem silently paralyzes target and suppresses radio call', () => {
  const launcher = new NeurotoxinParalyticDartLauncherSystem();
  const sentry = {
    id: 'radio_operator',
    distanceMeters: 16.0,
    health: 100,
    attemptingRadioCall: true
  };

  const shot = launcher.fireSilentNeuroDart(sentry, true);
  assert.equal(shot.fired, true);
  assert.equal(shot.cloakPreserved, true);
  assert.equal(shot.radioAlertSuppressed, true);
  assert.equal(sentry.paralyzed, true);
});

test('Chantier 9 (v148): PenthouseLightningRodStormConduitSector channels storm lightning to overcharge energy', () => {
  const spire = new PenthouseLightningRodStormConduitSector();
  const hunter = { energy: 45, combistickRaised: true };
  const pursuer = { id: 'owly_agent', x: 3.0, z: 2.0, health: 110 };

  const strike = spire.channelAtmosphericLightning(hunter, [pursuer]);
  assert.equal(strike.channeled, true);
  assert.equal(hunter.energy, 150);
  assert.equal(hunter.weaponLightningInfused, true);
  assert.deepEqual(strike.electrocutedEnemyIds, ['owly_agent']);
  assert.equal(pursuer.health, 0);
});

test('Chantier 10 (v148): AudioSynthesizer exposes all 15 v148 procedural Web Audio methods', () => {
  const synth = audioSynth;
  const methods = [
    'playSuperheatedPlasmaWhipCrack',
    'playPlasmaWhipArmorMeltSizzle',
    'playMagneticCraneElectromagnetRelease',
    'playCargoContainerGroundCrushBoom',
    'playSwampMethaneGasWhooshIgnite',
    'playSacredSarcophagusGlyphChime',
    'playSacredPlasmacasterPedestalRise',
    'playRopeTomahawkWhirlThrow',
    'playRopeTetherYankRetrieveSnap',
    'playTrophyWallSkullMountClack',
    'playSanctumAncestralResonanceChord',
    'playVentilationGrateLaserUnseal',
    'playNeurotoxinDartAirPuff',
    'playPenthouseLightningRodThunderStrike',
    'playStormConduitEnergySurgeHum'
  ];

  for (const methodName of methods) {
    assert.equal(typeof synth[methodName], 'function', `Missing AudioSynthesizer.${methodName}`);
    assert.doesNotThrow(() => synth[methodName](0.5));
  }
});
