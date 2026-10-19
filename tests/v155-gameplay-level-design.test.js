import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { BouvetoyaWhalingStationWaterTowerQueenChainDropSector } from '../src/gameplay/BouvetoyaWhalingStationWaterTowerQueenChainDropSector.js';
import { CityHunterScoutShipHiddenArmoryRackSector } from '../src/gameplay/CityHunterScoutShipHiddenArmoryRackSector.js';
import { TallGrassRedScorpionKatanaStandOffSector } from '../src/gameplay/TallGrassRedScorpionKatanaStandOffSector.js';
import { ValVerdeRoaringWaterfallCloakShortAndAcousticMaskSector } from '../src/gameplay/ValVerdeRoaringWaterfallCloakShortAndAcousticMaskSector.js';
import { NolandScavengedYautjaBoilerHideoutSector } from '../src/gameplay/NolandScavengedYautjaBoilerHideoutSector.js';
import { HumanQaResponsiveHudToastConsolidator } from '../src/gameplay/HumanQaResponsiveHudToastConsolidator.js';
import { HumanQaDiegeticMaskFrostAndResidualHeatAuditor } from '../src/gameplay/HumanQaDiegeticMaskFrostAndResidualHeatAuditor.js';
import { HumanQaGameplayTrapSafetyAndParryWindowAuditor } from '../src/gameplay/HumanQaGameplayTrapSafetyAndParryWindowAuditor.js';
import { HumanQaLevelDesignKillZAndLedgeReadabilityAuditor } from '../src/gameplay/HumanQaLevelDesignKillZAndLedgeReadabilityAuditor.js';

test('Chantier 1 (v155): BouvetoyaWhalingStationWaterTowerQueenChainDropSector chains Queen to water tower and plunges her into Antarctic abyss', () => {
  const sector = new BouvetoyaWhalingStationWaterTowerQueenChainDropSector();
  const queen = { id: 'antarctic_queen', neutralized: false };
  const chained = sector.hookQueenCollarChainToWaterTower(queen);
  assert.equal(chained.chained, true);

  const plunged = sector.releaseWaterTowerOverIceCliff(queen);
  assert.equal(plunged.plunged, true);
  assert.equal(plunged.finalOceanDepthMeters, 950);
  assert.equal(queen.neutralized, true);
});

test('Chantier 2 (v155): CityHunterScoutShipHiddenArmoryRackSector unlocks pneumatic rack and refills Speargun, Netgun, and Smart Disc', () => {
  const armory = new CityHunterScoutShipHiddenArmoryRackSector();
  const hunter = { speargunAmmo: 2, netgunAmmo: 0, hasSmartDisc: false };
  const refill = armory.requisitionLoadoutRefill(hunter);
  assert.equal(refill.refilled, true);
  assert.equal(hunter.speargunAmmo, 14);
  assert.equal(hunter.netgunAmmo, 4);
  assert.equal(hunter.hasSmartDisc, true);
});

test('Chantier 3 (v155): TallGrassRedScorpionKatanaStandOffSector severs Red Scorpion mid-air and resolves Hanzo vs Falconer katana duel', () => {
  const sector = new TallGrassRedScorpionKatanaStandOffSector();
  const ambush = sector.resolveRedScorpionAmbush('katana_Reflex_slice');
  assert.equal(ambush.scorpionSeveredMidAir, true);
  assert.equal(ambush.neurotoxinApplied, false);

  const clash = sector.executeTallGrassKatanaClashPass({ finalMutualPass: true });
  assert.equal(clash.duelCloakDisabled, true);
  assert.equal(clash.mutualFatalStrike, true);
  assert.equal(clash.honorEarned, 250);
});

test('Chantier 4 (v155): ValVerdeRoaringWaterfallCloakShortAndAcousticMaskSector shorts cloak under waterfall curtain and masks footsteps by 85%', () => {
  const waterfall = new ValVerdeRoaringWaterfallCloakShortAndAcousticMaskSector();
  const hunter = { cloakActive: true, acidCorroding: true };
  const res = waterfall.traverseWaterfallCurtain(hunter);
  assert.equal(res.cloakShortCircuited, true);
  assert.equal(hunter.cloakActive, false);
  assert.equal(res.acidWashedOff, true);
  assert.equal(res.footstepNoiseMultiplier, 0.15);
});

test('Chantier 5 (v155): NolandScavengedYautjaBoilerHideoutSector seals thermal airlock against hounds and resolves Tracker plasma breach', () => {
  const hideout = new NolandScavengedYautjaBoilerHideoutSector();
  const seal = hideout.sealThermalBoilerAirlock();
  assert.equal(seal.hiddenFromHounds, true);

  const noland = { health: 100 };
  const breach = hideout.executeTrackerPlasmaEntryBreach(noland);
  assert.equal(breach.breached, true);
  assert.equal(noland.eliminatedByTrackerBlast, true);
  assert.equal(breach.salvagedGearDropped.length, 3);
});

test('Chantier 6 + Audit Humain QA #1 (v155): HumanQaResponsiveHudToastConsolidator stacks duplicate toasts (x2) and centers ultra-wide 21:9 HUD', () => {
  const hudQa = new HumanQaResponsiveHudToastConsolidator();
  hudQa.pushToastNotification('trophy_skull', 'Trophée Crâne Collecté');
  const second = hudQa.pushToastNotification('trophy_skull', 'Trophée Crâne Collecté');
  assert.equal(second.consolidated, true);
  assert.equal(second.count, 2);
  assert.equal(second.formattedText, 'Trophée Crâne Collecté (x2)');

  const inset = hudQa.computeErgonomicHudInset(3440, 1440);
  assert.equal(inset.ultraWideDetected, true);
  assert.ok(inset.safeHorizontalInsetPx > 400);

  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  assert.ok(cssContent.includes('min-aspect-ratio: 21/9'));
  assert.ok(cssContent.includes('.keybind-hint'));
});

test('Chantier 7 + Audit Humain QA #2 (v155): AudioSynthesizer computes wall/underwater lowpass occlusion, clamps master peak gain, and exposes 15 v155 SFX', () => {
  assert.equal(audioSynth.computeOcclusionLowpassFrequency(0, false), 20000);
  assert.equal(audioSynth.computeOcclusionLowpassFrequency(1, false), 650);
  assert.equal(audioSynth.computeOcclusionLowpassFrequency(0.5, true), 380);

  const clampedGain = audioSynth.clampMasterPeakGain(0.8, 4);
  assert.ok(clampedGain <= 0.88);
  assert.equal(clampedGain, 0.4);

  const v155SfxMethods = [
    'playBouvetoyaFrozenChainWinchratchet',
    'playWaterTowerCliffCollapsePlunge',
    'playScoutShipArmoryRackPneumaticSlide',
    'playYautjaWeaponRackLockClack',
    'playRedScorpionChitinmandibleClick',
    'playTallGrassKatanaWristbladeClashRing',
    'playValVerdeWaterfallCurtainCloakSpark',
    'playNolandBoilerAirlockSealThump',
    'playTrackerHideoutPlasmaBreachBlast',
    'playToastConsolidationStackChime',
    'playAcousticWallOcclusionMuffleTone',
    'playBioMaskVisorThermalDefrostHiss',
    'playLaserTrapIffOwnerStandbyChirp',
    'playGenerousParryWindowPerfectClang',
    'playKillZSafetyLedgeRecoveryWhoosh'
  ];

  for (const methodName of v155SfxMethods) {
    assert.equal(typeof audioSynth[methodName], 'function');
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});

test('Chantier 8 + Audit Humain QA #3 (v155): HumanQaDiegeticMaskFrostAndResidualHeatAuditor auto-defrosts visor in blizzard and decays thermal footprints', () => {
  const auditor = new HumanQaDiegeticMaskFrostAndResidualHeatAuditor();
  auditor.updateVisorFrostState({ ambientTemperatureCelsius: -35, isMoving: false });
  const secondTick = auditor.updateVisorFrostState({ ambientTemperatureCelsius: -35, isMoving: false });
  assert.equal(secondTick.defrostTriggered, true);

  const freshPrint = auditor.computeResidualFootprintThermalIntensity(2.0, 6.0);
  const oldPrint = auditor.computeResidualFootprintThermalIntensity(25.0, 6.0);
  assert.equal(freshPrint.visibleInThermalVision, true);
  assert.equal(oldPrint.visibleInThermalVision, false);
});

test('Chantier 9 + Audit Humain QA #4 (v155): HumanQaGameplayTrapSafetyAndParryWindowAuditor puts owner laser trap on IFF standby and breaks omniscient tracking on cloak', () => {
  const auditor = new HumanQaGameplayTrapSafetyAndParryWindowAuditor();
  const trapPass = auditor.evaluateLaserTrapPassage({ id: 'wolf' }, { ownerId: 'wolf', damage: 140 });
  assert.equal(trapPass.detonated, false);
  assert.equal(trapPass.iffStandbyActivated, true);

  const tracking = auditor.evaluateEnemyTrackingTarget({
    cloakActive: true,
    lateralDisplacementSinceCloakMeters: 4.2,
    lastKnownPosition: { x: 10, y: 0, z: 5 },
    currentPosition: { x: 14.2, y: 0, z: 5 }
  });
  assert.equal(tracking.omniscientTrackingBroken, true);
  assert.equal(tracking.aimTargetPosition.x, 10);

  const parry = auditor.evaluateParryTiming(0.15);
  assert.equal(parry.perfectParry, true);
});

test('Chantier 10 + Audit Humain QA #5 (v155): HumanQaLevelDesignKillZAndLedgeReadabilityAuditor rescues player below Kill-Z and highlights climbable ledges', () => {
  const auditor = new HumanQaLevelDesignKillZAndLedgeReadabilityAuditor();
  const rescue = auditor.enforceKillZSafetyNet({
    x: 4,
    y: -28,
    z: 9,
    health: 20,
    lastValidGroundPosition: { x: 2, y: 3, z: 8 }
  });
  assert.equal(rescue.outOfBoundsRecovered, true);
  assert.equal(rescue.fatalVoidFallPrevented, true);
  assert.equal(rescue.restoredPosition.y, 3);
  assert.equal(rescue.healthAfterRecovery, 15);

  const ledges = auditor.auditClimbableLedgeReadability([{ id: 'ledge_1' }]);
  assert.equal(ledges.allReadable, true);
});
