import test from 'node:test';
import assert from 'node:assert/strict';

import { CanopyAnkleSnareHoistTrapSector } from '../src/gameplay/CanopyAnkleSnareHoistTrapSector.js';
import { PyramidQueenCryoOvipositorIncubationSector } from '../src/gameplay/PyramidQueenCryoOvipositorIncubationSector.js';
import { BerserkerRotaryTriLaserPlasmacasterSystem } from '../src/gameplay/BerserkerRotaryTriLaserPlasmacasterSystem.js';
import { PyramidChainDrawbridgeChasmCollapseSector } from '../src/gameplay/PyramidChainDrawbridgeChasmCollapseSector.js';
import { DutchImprovisedExplosiveTippedBowSystem } from '../src/gameplay/DutchImprovisedExplosiveTippedBowSystem.js';
import { GunnisonPowerPlantGridBlackoutSector } from '../src/gameplay/GunnisonPowerPlantGridBlackoutSector.js';
import { FeralPredatorBoneMaskLaserGuidedBoltSystem } from '../src/gameplay/FeralPredatorBoneMaskLaserGuidedBoltSystem.js';
import { ValVerdeWaterfallMudSlideEscapeSector } from '../src/gameplay/ValVerdeWaterfallMudSlideEscapeSector.js';
import { YautjaClanHonorCodeBadBloodTribunalDirector } from '../src/gameplay/YautjaClanHonorCodeBadBloodTribunalDirector.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v149): CanopyAnkleSnareHoistTrapSector hoists prey into canopy and lures squadmates', () => {
  const sector = new CanopyAnkleSnareHoistTrapSector();
  const prey = { id: 'merc_scout', x: -9.5, z: 5.8, health: 100 };
  const ally = { id: 'merc_medic', x: -3.0, z: 6.0, health: 100 };

  const res = sector.evaluateFootstepTrigger(prey, [ally], audioSynth);
  assert.equal(res.triggered, true);
  assert.equal(prey.suspendedUpsideDown, true);
  assert.equal(prey.disarmed, true);
  assert.deepEqual(res.luredAllies, ['merc_medic']);

  const cut = sector.severSnareCable('snare_banyan_north', prey);
  assert.equal(cut.severed, true);
  assert.equal(prey.suspendedUpsideDown, false);
});

test('Chantier 2 (v149): PyramidQueenCryoOvipositorIncubationSector thaws Queen and snaps chains under acid damage', () => {
  const chamber = new PyramidQueenCryoOvipositorIncubationSector();
  const thaw = chamber.initiateCentennialThawCycle(6, audioSynth);
  assert.equal(thaw.thawed, true);
  assert.equal(thaw.eggsDeliveredToSacrificialChamber, 6);

  const dmg = chamber.inflictRestraintChainDamage(220, 'ACID_BLOOD', audioSynth);
  assert.equal(dmg.queenUnchained, true);
  assert.equal(chamber.getStatus().restraintChainIntegrity, 0);
});

test('Chantier 3 (v149): BerserkerRotaryTriLaserPlasmacasterSystem locks 3 targets and fires rapid rotary barrage', () => {
  const rotary = new BerserkerRotaryTriLaserPlasmacasterSystem();
  const targets = [
    { id: 'prey_1', health: 120 },
    { id: 'prey_2', health: 120 },
    { id: 'prey_3', health: 120 }
  ];

  const locks = rotary.acquireTriLaserLocks(targets, audioSynth);
  assert.equal(locks.locked, true);
  assert.equal(locks.lockedTargetIds.length, 3);

  const salvo = rotary.fireRotarySalvoBarrage(targets, 100, audioSynth);
  assert.equal(salvo.fired, true);
  assert.equal(salvo.boltsFired, 3);
  assert.ok(targets[0].health < 40);
});

test('Chantier 4 (v149): PyramidChainDrawbridgeChasmCollapseSector collapses bridge when both chains are severed', () => {
  const bridge = new PyramidChainDrawbridgeChasmCollapseSector();
  const squad = [{ id: 'raider_1', x: 0, z: 0, health: 100 }];

  const firstCut = bridge.severSupportChain('NORTH', squad, audioSynth);
  assert.equal(firstCut.bridgeCollapsed, false);

  const secondCut = bridge.severSupportChain('SOUTH', squad, audioSynth);
  assert.equal(secondCut.bridgeCollapsed, true);
  assert.deepEqual(secondCut.plungedUnitIds, ['raider_1']);
  assert.equal(squad[0].health, 0);
});

test('Chantier 5 (v149): DutchImprovisedExplosiveTippedBowSystem silently launches arrow and disrupts Yautja cloak', () => {
  const bow = new DutchImprovisedExplosiveTippedBowSystem();
  const hunter = { id: 'jungle_hunter', x: 1.0, z: 1.0, health: 200, cloakActive: true };

  const shot = bow.drawAndReleaseExplosiveArrow({ x: 1.0, z: 1.0 }, [hunter], 1.0, audioSynth);
  assert.equal(shot.fired, true);
  assert.equal(shot.silentLaunchNoMuzzleFlash, true);
  assert.equal(hunter.cloakActive, false);
  assert.equal(hunter.thermalVisionDazzled, true);
});

test('Chantier 6 (v149): GunnisonPowerPlantGridBlackoutSector triggers city-wide blackout when transformers explode', () => {
  const plant = new GunnisonPowerPlantGridBlackoutSector();
  plant.overloadTransformerWithPlasma('transformer_bank_west', [], audioSynth);
  assert.equal(plant.getStatus().cityGridOnline, true);

  const finalBlast = plant.overloadTransformerWithPlasma('transformer_bank_east', [], audioSynth);
  assert.equal(finalBlast.cityBlackoutTriggered, true);
  assert.equal(plant.getStatus().nationalGuardSearchlightsActive, false);
  assert.ok(plant.getStatus().stealthVisibilityMultiplier <= 0.25);
});

test('Chantier 7 (v149): FeralPredatorBoneMaskLaserGuidedBoltSystem bypasses cover or redirects to detached mask', () => {
  const feralLauncher = new FeralPredatorBoneMaskLaserGuidedBoltSystem();
  const naru = { id: 'naru', health: 100, behindTreeOrRockCover: true };
  const feral = { id: 'feral_predator', health: 180 };

  const guidedHit = feralLauncher.fireLaserGuidedBolt(naru, [naru, feral], audioSynth);
  assert.equal(guidedHit.guidedBypassCover, true);
  assert.ok(naru.health < 20);

  // Naru places the detached mask pointing at Feral
  feralLauncher.setBoneMaskState(false, 'feral_predator');
  const redirectHit = feralLauncher.fireLaserGuidedBolt(naru, [naru, feral], audioSynth);
  assert.equal(redirectHit.redirectedByDetachedBoneMask, true);
  assert.equal(redirectHit.struckTargetId, 'feral_predator');
  assert.ok(feral.health < 50);
});

test('Chantier 8 (v149): ValVerdeWaterfallMudSlideEscapeSector negates fall damage and applies cold clay camouflage', () => {
  const waterfall = new ValVerdeWaterfallMudSlideEscapeSector();
  const dutch = { burning: true, mudCamouflageRatio: 0.5 };

  const plunge = waterfall.executeMudSlideWaterfallPlunge(dutch, audioSynth);
  assert.equal(plunge.plunged, true);
  assert.equal(plunge.fallDamageTaken, 0);
  assert.equal(dutch.burning, false);

  const clay = waterfall.crawlOntoRootClayBankAndApplyMud(dutch);
  assert.equal(clay.applied, true);
  assert.equal(dutch.invisibleToYautjaThermalVision, true);
});

test('Chantier 9 (v149): YautjaClanHonorCodeBadBloodTribunalDirector rewards sparing pregnant target and punishes Bad Blood', () => {
  const tribunal = new YautjaClanHonorCodeBadBloodTribunalDirector();
  const leona = { id: 'leona_cantrell', isArmed: true, isPregnant: true };

  const spareRes = tribunal.evaluateTargetEngagement(leona, 'SPARE_TARGET', 'WRISTBLADES', audioSynth);
  assert.equal(spareRes.honorableDecision, true);
  assert.ok(tribunal.getStatus().honorScore > 500);

  const violation = tribunal.evaluateTargetEngagement(leona, 'LETHAL_STRIKE', 'PLASMACASTER', audioSynth);
  assert.equal(violation.honorableDecision, false);
  assert.equal(violation.badBloodMarked, true);
  assert.equal(violation.enforcerHunterDispatched, true);
});

test('Chantier 10 (v149): AudioSynthesizer exposes all 15 v149 procedural Web Audio methods', () => {
  const methods = [
    'playCanopyAnkleSnareHoistWhoosh',
    'playSnareTelemetryBeaconPing',
    'playQueenCryoChamberHissRelease',
    'playQueenRestraintChainSnapBoom',
    'playBerserkerRotaryPlasmacasterSpin',
    'playTriLaserRapidSalvoBlast',
    'playPyramidDrawbridgeChainSeverClang',
    'playDrawbridgeStoneSlabChasmCrash',
    'playDutchExplosiveArrowBowTwang',
    'playExplosiveArrowDelayedDetonation',
    'playGunnisonGridTransformerExplosion',
    'playCityWideBlackoutPowerDownHum',
    'playFeralLaserGuidedBoltWhistle',
    'playWaterfallMudSlideSplashPlunge',
    'playBadBloodTribunalWarningHorn'
  ];

  for (const methodName of methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `Missing AudioSynthesizer.${methodName}`);
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});
