import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { SkyscraperServiceElevatorCableSeverSector } from '../src/gameplay/SkyscraperServiceElevatorCableSeverSector.js';
import { PyramidQueenNestWristbandTacticalImplosionSector } from '../src/gameplay/PyramidQueenNestWristbandTacticalImplosionSector.js';
import { ElderGreybackLostTribeHonorEscortDirector } from '../src/gameplay/ElderGreybackLostTribeHonorEscortDirector.js';
import { ValVerdeBambooPunjiSpikePitTrapSector } from '../src/gameplay/ValVerdeBambooPunjiSpikePitTrapSector.js';
import { FrenchVoyageurFlintlockMusketVolleyLineDirector } from '../src/gameplay/FrenchVoyageurFlintlockMusketVolleyLineDirector.js';
import { HumanQaPlaytesterUiUxAuditDirector } from '../src/gameplay/HumanQaPlaytesterUiUxAuditDirector.js';
import { HumanQaDiegeticImmersionAuditor } from '../src/gameplay/HumanQaDiegeticImmersionAuditor.js';
import { HumanQaGameplayFairnessAntiSoftlockAuditor } from '../src/gameplay/HumanQaGameplayFairnessAntiSoftlockAuditor.js';
import { HumanQaLevelDesignFlowUnstuckAuditor } from '../src/gameplay/HumanQaLevelDesignFlowUnstuckAuditor.js';

test('Chantier 1 (v153): SkyscraperServiceElevatorCableSeverSector infiltrates roof hatch, severs hoist cables and drops cab', () => {
  const sector = new SkyscraperServiceElevatorCableSeverSector();
  const infil = sector.infiltrateCabRoofHatch();
  assert.equal(infil.infiltrated, true);
  assert.equal(infil.ceilingHatchOpen, true);

  const occupants = [{ id: 'agent_1', health: 150 }, { id: 'agent_2', health: 150 }];
  const drop = sector.severHoistCablesAndDropCab(occupants, audioSynth);
  assert.equal(drop.dropped, true);
  assert.equal(drop.finalFloor, 0);
  assert.equal(occupants[0].crushedInElevatorDrop, true);
  assert.equal(sector.getStatus().totalOccupantsNeutralized, 2);
});

test('Chantier 2 (v153): PyramidQueenNestWristbandTacticalImplosionSector arms Scar wristband and implodes Queen nest', () => {
  const sector = new PyramidQueenNestWristbandTacticalImplosionSector();
  const armed = sector.detachAndArmWristbandInNest();
  assert.equal(armed.armed, true);

  const xenos = [{ id: 'drone_1', health: 100 }, { id: 'drone_2', health: 100 }];
  const survivors = [{ id: 'scar_and_lex', distanceFromEpicenterMeters: 220, health: 100 }];
  const blast = sector.detonateBlueCondensationImplosion(xenos, survivors, audioSynth);
  assert.equal(blast.detonated, true);
  assert.equal(blast.blueCondensationWaveTriggered, true);
  assert.equal(blast.nestDestroyed, true);
  assert.equal(blast.xenomorphsVaporizedCount, 2);
  assert.ok(blast.escapedSurvivorIds.includes('scar_and_lex'));
});

test('Chantier 3 (v153): ElderGreybackLostTribeHonorEscortDirector manifests 10 Lost Tribe hunters and enforces honor truce', () => {
  const director = new ElderGreybackLostTribeHonorEscortDirector();
  const victor = { id: 'harrigan' };
  const res = director.manifestLostTribeHonorCircle(victor, audioSynth);
  assert.equal(res.manifested, true);
  assert.equal(res.tribeMembersCount, 10);
  assert.equal(res.honorTruceEnforced, true);
  assert.equal(victor.recognizedByLostTribe, true);
});

test('Chantier 4 (v153): ValVerdeBambooPunjiSpikePitTrapSector bypasses pit via tech vision or impales unwary walker', () => {
  const trap = new ValVerdeBambooPunjiSpikePitTrapSector();
  const yautja = { x: -8, z: 12, visionMode: 'ELECTROMAGNETIC_TECH', health: 200 };
  const bypass = trap.evaluateStepOverPunjiPit(yautja, audioSynth);
  assert.equal(bypass.triggered, false);
  assert.equal(bypass.bypassedSafely, true);

  const rebel = { x: -8, z: 12, visionMode: 'NAKED_EYE', health: 120 };
  const step = trap.evaluateStepOverPunjiPit(rebel, audioSynth);
  assert.equal(step.triggered, true);
  assert.equal(rebel.impaledInBambooPit, true);
  assert.equal(rebel.health, 35);
});

test('Chantier 5 (v153): FrenchVoyageurFlintlockMusketVolleyLineDirector fires synchronized volley and opens reload window', () => {
  const line = new FrenchVoyageurFlintlockMusketVolleyLineDirector({ lineSize: 5, reloadDurationSec: 4.0 });
  const volley = line.fireSynchronizedVolley({ feralShieldRaised: true });
  assert.equal(volley.fired, true);
  assert.equal(volley.deflectedBalls, 5);
  assert.equal(volley.damageToPredator, 0);
  assert.equal(volley.counterAttackWindowOpen, true);

  const midReload = line.update(2.0);
  assert.equal(midReload.readyCount, 0);

  const finishedReload = line.update(2.5);
  assert.equal(finishedReload.readyCount, 5);
  assert.equal(finishedReload.counterAttackWindowOpen, false);
});

test('Chantier 6 + Audit Humain QA #1 (v153): HumanQaPlaytesterUiUxAuditDirector preserves CRITICAL banners over LOW messages and CSS rules', () => {
  const uiQa = new HumanQaPlaytesterUiUxAuditDirector({ reducedMotionEnabled: true });
  const crit = uiQa.postTacticalBanner('ALERTE CRITIQUE : FILET ACTIF', 'CRITICAL', 3.0);
  assert.equal(crit.displayed, true);

  const low = uiQa.postTacticalBanner('Ambiance jungle calme', 'LOW', 1.5);
  assert.equal(low.displayed, false);
  assert.equal(low.queued, true);
  assert.equal(low.preservedActivePriority, 'CRITICAL');

  uiQa.update(3.1);
  assert.equal(uiQa.activeBanner.priority, 'LOW');
  assert.equal(uiQa.computeScreenShakeScale(1.0), 0.2);

  const cssContent = fs.readFileSync('src/style.css', 'utf8');
  assert.ok(cssContent.includes('#log-banner.banner-critical'));
  assert.ok(cssContent.includes('prefers-reduced-motion: reduce'));
});

test('Chantier 7 + Audit Humain QA #3 (v153): HumanQaDiegeticImmersionAuditor shorts cloak in deep water and enforces raw vision unmasked', () => {
  const auditor = new HumanQaDiegeticImmersionAuditor();
  const result = auditor.auditAndEnforceDiegeticState({
    cloakActive: true,
    waterSubmersionRatio: 0.65,
    bioMaskEquipped: false,
    opticZoomLevel: 3,
    visionMode: 'XENO_ELECTRO',
    plasmacasterLaserTriadActive: true
  });

  assert.equal(result.diegeticCompliant, false);
  assert.equal(result.enforcedState.cloakActive, false);
  assert.equal(result.enforcedState.opticZoomLevel, 1);
  assert.equal(result.enforcedState.visionMode, 'RAW_YAUTJA_INFRA');
  assert.equal(result.enforcedState.plasmacasterLaserTriadActive, false);
  assert.ok(auditor.formatDiegeticReadout('CLOAK_SHORT', 7).includes('[007]'));
});

test('Chantier 8 + Audit Humain QA #4 (v153): HumanQaGameplayFairnessAntiSoftlockAuditor prevents offensive softlock and stunlock chains', () => {
  const fairness = new HumanQaGameplayFairnessAntiSoftlockAuditor({ staggerGraceDurationSec: 1.2 });
  const rescue = fairness.auditCombatLoadoutFairness({
    energy: 0,
    wristbladesDurability: 0,
    rangedAmmo: 0
  });
  assert.equal(rescue.softlockDetected, true);
  assert.equal(rescue.restoredEnergy, 18);
  assert.equal(rescue.acidImmuneFallback, true);

  const firstHit = fairness.evaluateIncomingHeavyKnockdown({ causesHeavyKnockdown: true, damage: 30 });
  assert.equal(firstHit.knockdownApplied, true);

  const secondHitDuringGrace = fairness.evaluateIncomingHeavyKnockdown({ causesHeavyKnockdown: true, damage: 30 });
  assert.equal(secondHitDuringGrace.knockdownApplied, false);
  assert.equal(secondHitDuringGrace.stunlockPrevented, true);
});

test('Chantier 9 + Audit Humain QA #5 (v153): HumanQaLevelDesignFlowUnstuckAuditor relocates stuck player and validates vertical escape routes', () => {
  const flowQa = new HumanQaLevelDesignFlowUnstuckAuditor({ stuckThresholdSec: 1.0 });
  flowQa.samplePlayerMovement({ dt: 0.6, moveIntentMagnitude: 0.9, displacementMeters: 0.02, position: { x: 3, y: 1, z: 3 } });
  const step2 = flowQa.samplePlayerMovement({ dt: 0.6, moveIntentMagnitude: 0.9, displacementMeters: 0.01, position: { x: 3, y: 1, z: 3 } });
  assert.equal(step2.unstuckTriggered, true);
  assert.equal(step2.relocatedTo.id, 'temple-plinth-center');

  const verticalAudit = flowQa.auditSectorVerticalEscapeRoutes([
    { id: 'ground-rock', type: 'boulder', elevation: 1.0 },
    { id: 'high-bough', type: 'tree_bough', elevation: 7.5 }
  ]);
  assert.equal(verticalAudit.validVerticalFlow, true);
});

test('Chantier 10 + Audit Humain QA #2 (v153): AudioSynthesizer enforces SFX rate limiter, clean BGM stop, and 15 v153 procedural SFX', () => {
  assert.equal(typeof audioSynth.stopAdaptiveBGM, 'function');
  assert.equal(typeof audioSynth.canTriggerSfx, 'function');

  const firstAllowed = audioSynth.canTriggerSfx('unit_test_sfx', 120);
  const immediateDuplicate = audioSynth.canTriggerSfx('unit_test_sfx', 120);
  assert.equal(firstAllowed, true);
  assert.equal(immediateDuplicate, false);

  const v153SfxMethods = [
    'playElevatorHoistCableSeverSnap',
    'playServiceElevatorCabFreefallCrash',
    'playScarWristbandBlueCondensationWave',
    'playPyramidQueenNestTacticalImplosion',
    'playLostTribeHonorCircleDecloakHum',
    'playGreybackGoldenArmorCeremonialStep',
    'playValVerdeBambooPunjiPitSnap',
    'playFrenchVoyageurMusketVolleyBoom',
    'playBlackPowderRamrodReloadClink',
    'playHumanQaPriorityAlertBannerBeep',
    'playHumanQaSfxLimiterAttenuationClick',
    'playDiegeticImmersionSubmergedCloakShort',
    'playAntiSoftlockEmergencyCapacitorPulse',
    'playStaggerGraceShieldResonanceHum',
    'playLevelFlowUnstuckAnchorTeleportWhoosh'
  ];

  for (const methodName of v153SfxMethods) {
    assert.equal(typeof audioSynth[methodName], 'function');
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});
