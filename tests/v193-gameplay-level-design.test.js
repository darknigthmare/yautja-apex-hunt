import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Prey1719BisonSkinningBargesSector } from '../src/gameplay/Prey1719BisonSkinningBargesSector.js';
import { Prey1719FeralShrapnelMineSmokeSector } from '../src/gameplay/Prey1719FeralShrapnelMineSmokeSector.js';
import { Prey1719AspenGroveAmbushSector } from '../src/gameplay/Prey1719AspenGroveAmbushSector.js';
import { Prey1719BigBeardCutlassDuelSector } from '../src/gameplay/Prey1719BigBeardCutlassDuelSector.js';
import { Prey1719AcidicBoneCleanseRitualSector } from '../src/gameplay/Prey1719AcidicBoneCleanseRitualSector.js';
import { Prey1719ComancheMedicineLodgeSector } from '../src/gameplay/Prey1719ComancheMedicineLodgeSector.js';
import { Prey1719YautjaDefeatAspenGroveProtocolSector } from '../src/gameplay/Prey1719YautjaDefeatAspenGroveProtocolSector.js';
import { HumanQaPrey1719AspenHUDDirector } from '../src/gameplay/HumanQaPrey1719AspenHUDDirector.js';
import { HumanQaPrey1719AspenMasterAuditor } from '../src/gameplay/HumanQaPrey1719AspenMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v193 Prey (2022) 1:1 Level Design & User Rule Suite', () => {
  it('Chantier 1: Bison skinning barges boarding, blood slick planks navigation, and dishonorable slaughter witness', () => {
    const sector = new Prey1719BisonSkinningBargesSector({ bargesCount: 3, skinnedBisonCount: 48 });
    const boardRes = sector.boardSkinningBarges();
    assert.strictEqual(boardRes.status, 'SKINNING_BARGES_BOARDED');
    assert.strictEqual(boardRes.bloodSlickHazardActive, true);
    assert.strictEqual(sector.bargesBoarded, true);

    const wasteRes = sector.witnessDishonorableBisonSlaughter();
    assert.strictEqual(wasteRes.status, 'DISHONORABLE_BISON_SLAUGHTER_WITNESSED');
    assert.strictEqual(wasteRes.comancheHuntingCodeViolated, true);
    assert.strictEqual(wasteRes.foreignTrapperTracksIdentified, true);
    assert.strictEqual(sector.bisonWasteWitnessed, true);

    const slipRes = sector.navigateBloodSlickPlanks(0.3);
    assert.strictEqual(slipRes.stable, false);

    const stableRes = sector.navigateBloodSlickPlanks(0.85);
    assert.strictEqual(stableRes.stable, true);
    assert.strictEqual(sector.deckBloodSlickNavigated, true);

    const flyRes = sector.disperseBlowflySwarm();
    assert.strictEqual(flyRes.visibilityRestoredPct, 100.0);
    assert.strictEqual(sector.blowflySwarmDispersed, true);
  });

  it('Chantier 2: Feral Predator spinning shrapnel disc mines and aerosol smoke dampeners', () => {
    const sector = new Prey1719FeralShrapnelMineSmokeSector({ shrapnelMinesReserve: 2, smokeDampenersReserve: 1 });
    const mineRes = sector.throwSpinningShrapnelDiscMine(6.5);
    assert.strictEqual(mineRes.status, 'SPINNING_SHRAPNEL_DISC_MINE_DETONATED');
    assert.strictEqual(mineRes.bladesEjected, 8);
    assert.strictEqual(mineRes.enemiesSeveredAtKnees, 3);
    assert.strictEqual(sector.shrapnelMineDeployed, true);
    assert.strictEqual(sector.shrapnelMinesReserve, 1);

    const smokeRes = sector.deployAerosolSmokeDampener();
    assert.strictEqual(smokeRes.status, 'AEROSOL_SMOKE_DAMPENER_DEPLOYED');
    assert.strictEqual(smokeRes.campfiresExtinguished, 2);
    assert.strictEqual(smokeRes.pitchBlackShadowCreated, true);
    assert.strictEqual(smokeRes.infraredTrackingDominanceActive, true);
    assert.strictEqual(sector.smokeDampenerActive, true);
    assert.strictEqual(sector.smokeDampenersReserve, 0);

    const depletedSmoke = sector.deployAerosolSmokeDampener();
    assert.strictEqual(depletedSmoke.success, false);
  });

  it('Chantier 3: Quaking aspen grove whistling signal arrows and optical bark refraction camouflage', () => {
    const sector = new Prey1719AspenGroveAmbushSector({ aspenTreeDensityCount: 120, windSpeedKmh: 14.0 });
    const whistleRes = sector.emitWhistlingSignalArrow();
    assert.strictEqual(whistleRes.status, 'WHISTLING_SIGNAL_ARROW_DISCHARGED');
    assert.strictEqual(whistleRes.pitchFrequencyHz, 2800.0);
    assert.strictEqual(whistleRes.huntersCoordinated, 3);
    assert.strictEqual(sector.whistlingArrowSignalEmitted, true);

    const barkRes = sector.blendCamouflageWithAspenBark();
    assert.strictEqual(barkRes.status, 'CAMOUFLAGE_BLENDED_WITH_STRIPED_ASPEN_BARK');
    assert.strictEqual(barkRes.visualShimmerSuppressionPct, 92.0);
    assert.strictEqual(sector.aspenBarkCamouflageBlended, true);

    const snatchRes = sector.triggerHangingOverheadSnatch();
    assert.strictEqual(snatchRes.status, 'HANGING_OVERHEAD_SNATCH_EXECUTED');
    assert.strictEqual(snatchRes.targetSnaredInCanopy, true);
    assert.strictEqual(sector.overheadSnatchExecuted, true);
    assert.strictEqual(sector.huntersDispersed, true);
  });

  it('Chantier 4: Big Beard French voyageur cutlass melee duel, low sweep, and tether choke disarm', () => {
    const sector = new Prey1719BigBeardCutlassDuelSector({ cutlassBladeLengthCm: 72.0, bigBeardMassKg: 115.0 });

    const prematureSweep = sector.executeLowDirtLegSweep();
    assert.strictEqual(prematureSweep.success, false);

    const parryRes = sector.parryHeavyCutlassChop(45.0);
    assert.strictEqual(parryRes.status, 'HEAVY_STEEL_CUTLASS_CHOP_DEFLECTED');
    assert.strictEqual(parryRes.sparksProduced, true);
    assert.strictEqual(sector.heavyCutlassChopDeflected, true);

    const sweepRes = sector.executeLowDirtLegSweep();
    assert.strictEqual(sweepRes.status, 'LOW_DIRT_LEG_SWEEP_EXECUTED');
    assert.strictEqual(sweepRes.bigBeardKnockedToGround, true);
    assert.strictEqual(sector.lowDirtLegSweepExecuted, true);

    const chokeRes = sector.executeTetherChokeAndDisarm();
    assert.strictEqual(chokeRes.status, 'TETHER_CHOKE_DISARM_LETHAL_EXECUTION');
    assert.strictEqual(chokeRes.cutlassDisarmedAndClaimed, true);
    assert.strictEqual(chokeRes.bigBeardDefeated, true);
    assert.strictEqual(sector.bigBeardDefeated, true);
  });

  it('Chantier 5: Acidic bone cleanse ritual and bandolier trophy polishing', () => {
    const sector = new Prey1719AcidicBoneCleanseRitualSector({ targetSkullType: 'GRIZZLY_BEAR_SKULL', acidPotencyPh: 0.5 });

    const prematureCleanse = sector.applyAcidicCleanseSolvent();
    assert.strictEqual(prematureCleanse.success, false);

    const suspendRes = sector.suspendSkullForRitual();
    assert.strictEqual(suspendRes.status, 'SKULL_SUSPENDED_FOR_RITUAL');
    assert.strictEqual(sector.skullSuspendedForCleanse, true);

    const solventRes = sector.applyAcidicCleanseSolvent();
    assert.strictEqual(solventRes.status, 'ACIDIC_SOLVENT_DISSOLVED_SOFT_TISSUE');
    assert.strictEqual(solventRes.bonePolishedWhite, true);
    assert.strictEqual(sector.softTissueDissolved, true);

    const mountRes = sector.mountTrophyToBandolierHarness();
    assert.strictEqual(mountRes.status, 'POLISHED_BONE_TROPHY_MOUNTED_TO_HARNESS');
    assert.strictEqual(mountRes.clanPrestigeAffirmed, true);
    assert.strictEqual(sector.trophyMountedToHarness, true);
  });

  it('Chantier 6: Comanche medicine lodge hearth fire, salicin willow bark tea, and deer sinew suture', () => {
    const sector = new Prey1719ComancheMedicineLodgeSector({ willowBarkSupplyGrams: 150.0, sinewSuturesCount: 4 });

    const prematureTea = sector.brewWillowBarkTea(8.0);
    assert.strictEqual(prematureTea.brewed, false);

    const fireRes = sector.kindleHearthFire();
    assert.strictEqual(fireRes.status, 'MEDICINE_HEARTH_FIRE_KINDLED');
    assert.strictEqual(fireRes.sacredSanctuarySecured, true);
    assert.strictEqual(sector.hearthFireKindled, true);

    const teaRes = sector.brewWillowBarkTea(8.0);
    assert.strictEqual(teaRes.status, 'WILLOW_BARK_SALICIN_INFUSION_CONSUMED');
    assert.strictEqual(teaRes.analgesicReliefActive, true);
    assert.strictEqual(sector.willowBarkTeaBrewed, true);

    const sutureRes = sector.sutureLacerationsWithSinew(2);
    assert.strictEqual(sutureRes.status, 'LACERATIONS_SUTURED_WITH_DEER_SINEW');
    assert.strictEqual(sutureRes.woundsStitched, 2);
    assert.strictEqual(sutureRes.suturesRemaining, 2);
    assert.strictEqual(sutureRes.hemorrhageHalted, true);
    assert.strictEqual(sector.vitalityRestoredPct, 95.0);
  });

  it('Chantier 7: Strict User Rule 3 verification in Aspen Grove (isYautja && health <= 0 && config === PREY_1719_ASPEN_GROVE)', () => {
    const protocol = new Prey1719YautjaDefeatAspenGroveProtocolSector();

    // Human player defeated -> Should NEVER trigger self-destruct
    const humanCheck = protocol.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      configuration: 'PREY_1719_ASPEN_GROVE'
    });
    assert.strictEqual(humanCheck.armed, false);
    assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

    // Yautja hunter alive -> Should NOT trigger
    const aliveCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 80,
      configuration: 'PREY_1719_ASPEN_GROVE'
    });
    assert.strictEqual(aliveCheck.armed, false);
    assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

    // Wrong arena configuration -> Should NOT trigger
    const wrongArenaCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'PREY_1719_BURNT_FOREST'
    });
    assert.strictEqual(wrongArenaCheck.armed, false);
    assert.strictEqual(wrongArenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

    // Valid defeat condition
    const validArming = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'PREY_1719_ASPEN_GROVE'
    });
    assert.strictEqual(validArming.status, 'PREY_ASPEN_GROVE_GAUNTLET_OVERLOAD_ARMED');
    assert.strictEqual(validArming.countdownSeconds, 15.0);
    assert.strictEqual(validArming.mockingLaughterDb, 105.0);
    assert.strictEqual(protocol.protocolArmed, true);

    // Delta update 5 seconds
    const midUpdate = protocol.updateCountdown(5.0);
    assert.strictEqual(midUpdate.active, true);
    assert.strictEqual(midUpdate.remainingSeconds, 10.0);

    // Final blast detonation
    const blastRes = protocol.updateCountdown(11.0);
    assert.strictEqual(blastRes.status, 'PREY_ASPEN_GROVE_MICRO_NUCLEAR_CLEANSING_BLAST');
    assert.strictEqual(blastRes.blastRadiusM, 65.0);
    assert.strictEqual(blastRes.honorScoreGranted, 500);
    assert.strictEqual(protocol.cleansingBlastExecuted, true);
    assert.strictEqual(protocol.honorPreserved, true);
  });

  it('Chantier 8: HumanQaPrey1719AspenHUDDirector telemetry and defeat widget update', () => {
    const director = new HumanQaPrey1719AspenHUDDirector();
    const mountRes = director.mount();
    assert.strictEqual(typeof mountRes, 'object');

    const updateRes = director.updateDefeatWidget({
      protocolArmed: true,
      countdownTimerRemaining: 12.4,
      activeGlyph: 'ᚑ'
    });
    assert.strictEqual(updateRes.protocolArmed, true);
    assert.strictEqual(updateRes.activeGlyph, 'ᚑ');
    assert.strictEqual(updateRes.countdownRemainingS, 12.4);

    const summary = director.getAuditsSummary();
    assert.strictEqual(summary.totalAudits, 5);
    assert.strictEqual(summary.allAuditsPassed, true);
  });

  it('Chantier 9: HumanQaPrey1719AspenMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaPrey1719AspenMasterAuditor();
    const report = auditor.runFullPrey1719AspenMasterAudit();
    assert.strictEqual(report.certified, true);
    assert.strictEqual(report.totalAudits, 9);
    assert.strictEqual(report.totalPassed, 9);

    const webglAudit = report.results.find(r => r.sector === 'WebGL_MothershipHub_DrawCall_Invariant');
    assert.ok(webglAudit);
    assert.strictEqual(webglAudit.status, 'PASSED');
    assert.ok(webglAudit.drawCalls <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v193 SFX triggers', () => {
    const windRustleAcoustics = audioSynth.computeAspenBarkWindRustleAcoustics(14.0, 0.85);
    assert.ok(windRustleAcoustics.fundamentalHz > 0);
    assert.ok(windRustleAcoustics.flutterGain > 0);

    const boneCleanseAcoustics = audioSynth.computeAcidicBoneCleanseAcoustics(0.5, 3500.0);
    assert.ok(boneCleanseAcoustics.sizzleFrequencyHz > 0);
    assert.ok(boneCleanseAcoustics.vaporGain > 0);

    // Call each of the 15 SFX methods
    assert.doesNotThrow(() => audioSynth.playBisonBargeWoodCreakSFX());
    assert.doesNotThrow(() => audioSynth.playBloodSlickPlankSlipSFX());
    assert.doesNotThrow(() => audioSynth.playBlowflySwarmBuzzSFX());
    assert.doesNotThrow(() => audioSynth.playSpinningShrapnelDiscLaunchSFX());
    assert.doesNotThrow(() => audioSynth.playShrapnelBladesWhirCutSFX());
    assert.doesNotThrow(() => audioSynth.playAerosolSmokeDampenerHissSFX());
    assert.doesNotThrow(() => audioSynth.playAspenWindRustleSFX());
    assert.doesNotThrow(() => audioSynth.playWhistlingSignalArrowFlightSFX());
    assert.doesNotThrow(() => audioSynth.playOverheadWireSnareSnapSFX());
    assert.doesNotThrow(() => audioSynth.playBigBeardCutlassParryClangSFX());
    assert.doesNotThrow(() => audioSynth.playLowDirtSweepStumbleSFX());
    assert.doesNotThrow(() => audioSynth.playTetherChokeDisarmGroanSFX());
    assert.doesNotThrow(() => audioSynth.playAcidicBoneCleanseSizzleSFX());
    assert.doesNotThrow(() => audioSynth.playComancheWillowBarkBoilSFX());
    assert.doesNotThrow(() => audioSynth.playPreyAspenMicroNuclearPurgeSFX());
  });
});
