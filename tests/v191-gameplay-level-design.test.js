import test from 'node:test';
import assert from 'node:assert/strict';

import { Prey1719MountainLionCliffsideSector } from '../src/gameplay/Prey1719MountainLionCliffsideSector.js';
import { Prey1719BoneMaskLaserTrapSector } from '../src/gameplay/Prey1719BoneMaskLaserTrapSector.js';
import { Prey1719OrangeFlowerThermalSuppressionSector } from '../src/gameplay/Prey1719OrangeFlowerThermalSuppressionSector.js';
import { Prey1719ComancheVillageTrainingSector } from '../src/gameplay/Prey1719ComancheVillageTrainingSector.js';
import { Prey1719FeralCombistickSplitDaggerSector } from '../src/gameplay/Prey1719FeralCombistickSplitDaggerSector.js';
import { Prey1719CanineCompanionTacticalSector } from '../src/gameplay/Prey1719CanineCompanionTacticalSector.js';
import { Prey1719YautjaDefeatClimaxMudPitProtocolSector } from '../src/gameplay/Prey1719YautjaDefeatClimaxMudPitProtocolSector.js';
import { HumanQaPrey1719ClimaxHUDDirector } from '../src/gameplay/HumanQaPrey1719ClimaxHUDDirector.js';
import { HumanQaPrey1719ClimaxMasterAuditor } from '../src/gameplay/HumanQaPrey1719ClimaxMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v191 Chantier LD 1: Prey1719MountainLionCliffsideSector discovers cougar tracks, reaches pine perch, and survives ledge fall', () => {
  const sector = new Prey1719MountainLionCliffsideSector({ cliffElevationM: 18.0 });

  const tracks = sector.discoverCougarTracksWithCanine(0.95);
  assert.strictEqual(tracks.status, 'COUGAR_PAW_TRACKS_PINPOINTED');
  assert.strictEqual(sector.pawTracksDiscovered, true);

  const perch = sector.reachOverhangingPinePerch();
  assert.strictEqual(perch.status, 'OVERHANGING_PINE_PERCH_REACHED');
  assert.strictEqual(sector.overhangPerchReached, true);

  const fall = sector.triggerCougarAmbushAndLedgeFall();
  assert.strictEqual(fall.status, 'COUGAR_POUNCE_CAUSED_LEDGE_FALL');
  assert.strictEqual(sector.cliffLedgeFallSurvived, true);

  const trophy = sector.observeFeralCougarTrophyHarvest();
  assert.strictEqual(trophy.status, 'FERAL_COUGAR_TROPHY_HARVEST_WITNESSED');
  assert.strictEqual(sector.feralCougarTrophyObserved, true);
});

test('v191 Chantier LD 2: Prey1719BoneMaskLaserTrapSector plants mask in mud, aligns 180 deg retroaction, and delivers self-inflicted kill', () => {
  const sector = new Prey1719BoneMaskLaserTrapSector({ mudPitDepthM: 1.2 });

  const plant = sector.plantBoneMaskInMudWall();
  assert.strictEqual(plant.status, 'BONE_MASK_EMBEDDED_IN_MUD_WALL');
  assert.strictEqual(sector.boneMaskPlantedInMud, true);

  const align = sector.alignTriLaserToPredatorCranium({ x: 10, y: 2, z: 8 });
  assert.strictEqual(align.status, 'TRI_LASER_ALIGNED_TO_PREDATOR_SKULL');
  assert.strictEqual(sector.triLaserAlignedToPredatorCranium, true);

  const lure = sector.lureFeralPredatorIntoMudPit();
  assert.strictEqual(lure.status, 'FERAL_PREDATOR_TRAPPED_IN_MUD_MIRE');
  assert.strictEqual(sector.feralPredatorLuredIntoPit, true);

  const kill = sector.triggerGuidedFlechetteSelfInflictedKill();
  assert.strictEqual(kill.status, 'GUIDED_FLECHETTE_CURVED_INTO_PREDATOR_SKULL');
  assert.strictEqual(sector.boltgunFiredByPredator, true);
  assert.strictEqual(sector.selfInflictedImpaleLethal, true);
});

test('v191 Chantier LD 3: Prey1719OrangeFlowerThermalSuppressionSector grinds paste, suppresses core temp to 11.2C, and blinds thermal optics', () => {
  const sector = new Prey1719OrangeFlowerThermalSuppressionSector({ flowerPetalsCount: 4 });

  const grind = sector.grindOrangeFlowerPaste();
  assert.strictEqual(grind.status, 'ORANGE_TOTOKIA_PASTE_PREPARED');
  assert.strictEqual(sector.flowerPastePrepared, true);
  assert.strictEqual(sector.flowerPetalsCount, 3);

  const admin = sector.administerOrangeFlowerPaste('Raphael Adolini');
  assert.strictEqual(admin.status, 'CORE_BODY_TEMPERATURE_SUPPRESSED');
  assert.strictEqual(sector.pasteAdministered, true);
  assert.strictEqual(sector.currentCoreTempC, 11.2);
  assert.strictEqual(sector.heartRateBpm, 24);
  assert.strictEqual(sector.infraredSignatureExtinguished, true);

  const scan = sector.evaluatePredatorThermalScan(1.0);
  assert.strictEqual(scan.status, 'TARGET_OVERLOOKED_AS_INANIMATE_STONE');
  assert.strictEqual(scan.detected, false);
});

test('v191 Chantier LD 4: Prey1719ComancheVillageTrainingSector attaches leather tether, masters recoil throws, and knaps obsidian edge', () => {
  const sector = new Prey1719ComancheVillageTrainingSector({ tetherCordLengthM: 8.5 });

  sector.inspectVillageSmokeRacks();
  assert.strictEqual(sector.smokeRacksInspected, true);

  const attach = sector.attachLeatherTetherToTomahawk();
  assert.strictEqual(attach.status, 'LEATHER_TETHER_ATTACHED_TO_TOMAHAWK');
  assert.strictEqual(sector.tetherAttachedToTomahawk, true);

  sector.practiceTetheredTomahawkThrow(5.0);
  sector.practiceTetheredTomahawkThrow(6.0);
  const thirdThrow = sector.practiceTetheredTomahawkThrow(5.5);
  assert.strictEqual(thirdThrow.status, 'TOMAHAWK_LODGED_AND_RECOILED_TO_HAND');
  assert.strictEqual(sector.rapidRecoilMastered, true);

  const knap = sector.knapObsidianFlintEdge();
  assert.strictEqual(knap.status, 'OBSIDIAN_RAZOR_EDGE_KNAPPED');
  assert.strictEqual(sector.obsidianFlintKnapped, true);
});

test('v191 Chantier LD 5: Prey1719FeralCombistickSplitDaggerSector thrusts polearm, splits twin daggers, and executes flurry combo', () => {
  const sector = new Prey1719FeralCombistickSplitDaggerSector({ extendedLengthM: 2.4 });

  const thrust = sector.executePolearmThrust(2800.0);
  assert.strictEqual(thrust.status, 'EXTENDED_POLEARM_THRUST_DELIVERED');
  assert.strictEqual(sector.polearmThrustExecuted, true);

  const split = sector.splitCombistickIntoTwinDaggers();
  assert.strictEqual(split.status, 'COMBISTICK_SPLIT_INTO_TWIN_DAGGERS');
  assert.strictEqual(sector.twinDaggersSeparated, true);
  assert.strictEqual(sector.currentMode, 'TWIN_DAGGERS');

  const flurry = sector.executeWhirlingTwinDaggerFlurry(4);
  assert.strictEqual(flurry.status, 'WHIRLING_TWIN_DAGGER_FLURRY_EXECUTED');
  assert.strictEqual(sector.whirlingFlurryComboActive, true);

  const recombine = sector.recombineIntoExtendedCombistick();
  assert.strictEqual(recombine.status, 'TWIN_DAGGERS_RECOMBINED_INTO_POLEARM');
  assert.strictEqual(sector.currentMode, 'EXTENDED_POLEARM');
});

test('v191 Chantier LD 6: Prey1719CanineCompanionTacticalSector scents threat, barks diversion, bites ankle, and retrieves tomahawk', () => {
  const sector = new Prey1719CanineCompanionTacticalSector({ canineName: 'Sarii' });

  const scent = sector.scentAlienPresence(22.0);
  assert.strictEqual(scent.status, 'CANINE_SCENT_THREAT_DETECTED');
  assert.strictEqual(sector.threatScentDetected, true);

  const bark = sector.emitDiversionBark();
  assert.strictEqual(bark.status, 'DIVERSION_BARK_EMITTED_SUCCESSFULLY');
  assert.strictEqual(sector.diversionBarkEmitted, true);

  const bite = sector.executeAnkleBiteHarass();
  assert.strictEqual(bite.status, 'CANINE_ANKLE_BITE_LANDED');
  assert.strictEqual(sector.ankleBiteExecuted, true);

  const retrieve = sector.retrieveDroppedTomahawkToNaru();
  assert.strictEqual(retrieve.status, 'TOMAHAWK_FETCHED_AND_DELIVERED');
  assert.strictEqual(sector.tomahawkRetrievedByMouth, true);
});

test('v191 Chantier LD 7: Prey1719YautjaDefeatClimaxMudPitProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new Prey1719YautjaDefeatClimaxMudPitProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'PREY_1719_CLIMAX_MUD_PIT' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 60, configuration: 'PREY_1719_CLIMAX_MUD_PIT' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Mauvaise arène -> inerte
  const arenaCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_ARK_HULL' });
  assert.strictEqual(arenaCheck.armed, false);
  assert.strictEqual(arenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

  // Condition 4: Chasseur Yautja perd (HP <= 0) en arène Prey Climax Mud Pit -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREY_1719_CLIMAX_MUD_PIT' });
  assert.strictEqual(defeatCheck.status, 'PREY_CLIMAX_MUD_PIT_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.archaicSpringCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(11.0);
  assert.strictEqual(blast.status, 'PREY_CLIMAX_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v191 Chantier LD 8: HumanQaPrey1719ClimaxHUDDirector mounts climax HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaPrey1719ClimaxHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 7.5,
    activeGlyph: 'ᚓ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᚓ');
});

test('v191 Chantier LD 9: AudioSynthesizer computes mountain lion & combistick acoustics and executes 15 new v191 SFX methods', () => {
  const lionAcoustics = audioSynth.computeMountainLionGrowlAcoustics(180.0, 12.0);
  assert.ok(lionAcoustics.growlFrequencyHz > 0);
  assert.ok(lionAcoustics.cliffReverbDb > 0);

  const combistickAcoustics = audioSynth.computeCombistickSplitMechanicalAcoustics(18.0, 2400.0);
  assert.ok(combistickAcoustics.bladeResonanceHz > 0);
  assert.ok(combistickAcoustics.splitSeparationDurationMs > 0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playMountainLionSnarlSFX',
    'playLimestoneCliffRockfallSFX',
    'playCougarPeltSkinningHissSFX',
    'playBoneMaskMudEmbedThumpSFX',
    'playTriLaserAlignBeepSFX',
    'playFlechetteCurvatureWhooshSFX',
    'playPredatorCranialImpaleSFX',
    'playTotokiaPestleGrindSFX',
    'playHypothermicHeartbeatDropSFX',
    'playTomahawkLeatherTetherSnapSFX',
    'playObsidianKnappingChirpSFX',
    'playCombistickPneumaticSplitSFX',
    'playTwinDaggersFlurrySwishSFX',
    'playCanineWarningGrowlBarkSFX',
    'playPreyClimaxMudPitVitrificationBlastSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v191 Chantier LD 10: HumanQaPrey1719ClimaxMasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaPrey1719ClimaxMasterAuditor();
  const report = auditor.runFullPrey1719ClimaxMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
