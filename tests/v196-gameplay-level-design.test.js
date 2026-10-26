import { describe, it } from 'node:test';
import assert from 'node:assert';

import { KillerOfKillers841AdMeadHallSiegeSector } from '../src/gameplay/KillerOfKillers841AdMeadHallSiegeSector.js';
import { KillerOfKillers1609CastleMoatInfiltrationSector } from '../src/gameplay/KillerOfKillers1609CastleMoatInfiltrationSector.js';
import { KillerOfKillers1942YautjaShipCockpitSector } from '../src/gameplay/KillerOfKillers1942YautjaShipCockpitSector.js';
import { KillerOfKillersYautjaPrimeTribunalTrialSector } from '../src/gameplay/KillerOfKillersYautjaPrimeTribunalTrialSector.js';
import { KillerOfKillersArenaWarriorTrialDuelSector } from '../src/gameplay/KillerOfKillersArenaWarriorTrialDuelSector.js';
import { KillerOfKillersOniPlasmaCoreOverloadSector } from '../src/gameplay/KillerOfKillersOniPlasmaCoreOverloadSector.js';
import { KillerOfKillersYautjaDefeatTribunalProtocolSector } from '../src/gameplay/KillerOfKillersYautjaDefeatTribunalProtocolSector.js';
import { HumanQaKillerOfKillersTribunalHUDDirector } from '../src/gameplay/HumanQaKillerOfKillersTribunalHUDDirector.js';
import { HumanQaKillerOfKillersTribunalMasterAuditor } from '../src/gameplay/HumanQaKillerOfKillersTribunalMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v196 Predator: Killer of Killers (2025) Tribunal & Infiltration Level Design Suite', () => {
  it('Chantier 1: 841 AD Viking Mead Hall oak doors barricade, boiling fat cauldron, skjaldborg shield wall, and warband repel', () => {
    const sector = new KillerOfKillers841AdMeadHallSiegeSector({ longhouseLengthM: 38.0, shieldWallCount: 4 });

    const prematurePour = sector.pourBoilingFatCauldronFromLoft();
    assert.strictEqual(prematurePour.success, false);

    const braceRes = sector.barricadeOakDoorsWithBenchBrace(6);
    assert.strictEqual(braceRes.status, 'OAK_DOORS_BARRICADED_WITH_BENCH_BRACE');
    assert.strictEqual(braceRes.ramResistanceJoules, 5200.0);
    assert.strictEqual(sector.doorsBarricaded, true);

    const pourRes = sector.pourBoilingFatCauldronFromLoft();
    assert.strictEqual(pourRes.status, 'BOILING_FAT_CAULDRON_POURED_FROM_LOFT');
    assert.strictEqual(pourRes.boardingPartyScalded, 5);
    assert.strictEqual(sector.fatCauldronPoured, true);

    const wallRes = sector.formSkjaldborgShieldWall();
    assert.strictEqual(wallRes.status, 'SKJALDBORG_SHIELD_WALL_FORMED');
    assert.strictEqual(wallRes.doorwayHeld, true);
    assert.strictEqual(sector.shieldWallFormed, true);

    const repelRes = sector.repelRivalWarbandAtThreshold();
    assert.strictEqual(repelRes.status, 'RIVAL_WARBAND_REPELLED_AT_THRESHOLD');
    assert.strictEqual(repelRes.raidersFallen, 11);
    assert.strictEqual(sector.warbandRepelled, true);
  });

  it('Chantier 2: 1609 Castle moat reed crossing, Ishigaki wall climb with tekko-kagi, and kawara hatch breach', () => {
    const sector = new KillerOfKillers1609CastleMoatInfiltrationSector({ moatDepthM: 2.4, ishigakiHeightM: 11.0 });

    const prematureClimb = sector.scaleIshigakiWallWithTekkoKagi();
    assert.strictEqual(prematureClimb.success, false);

    const moatRes = sector.crossMoatWithReedBreathingTube();
    assert.strictEqual(moatRes.status, 'MOAT_CROSSED_WITH_REED_BREATHING_TUBE');
    assert.strictEqual(moatRes.rippleSignatureSuppressed, true);
    assert.strictEqual(sector.moatCrossed, true);

    const wallRes = sector.scaleIshigakiWallWithTekkoKagi();
    assert.strictEqual(wallRes.status, 'ISHIGAKI_WALL_SCALED_WITH_TEKKO_KAGI');
    assert.strictEqual(wallRes.handholdsBetweenStones, true);
    assert.strictEqual(sector.wallScaled, true);

    const gapRes = sector.exploitArcherWatchRotationGap(28.0);
    assert.strictEqual(gapRes.status, 'ARCHER_WATCH_ROTATION_GAP_EXPLOITED');
    assert.strictEqual(gapRes.yaguraTurretBypassed, true);
    assert.strictEqual(sector.archerGapExploited, true);

    const breachRes = sector.breachKeepThroughRoofTileHatch();
    assert.strictEqual(breachRes.status, 'KEEP_BREACHED_THROUGH_ROOF_TILE_HATCH');
    assert.strictEqual(breachRes.entryPoint, 'KAWARA_ROOF_HATCH');
    assert.strictEqual(sector.keepBreached, true);
  });

  it('Chantier 3: 1942 Yautja scout ship wing-walk boarding, iris hatch override, and glyph cockpit flight', () => {
    const sector = new KillerOfKillers1942YautjaShipCockpitSector({ boardingAltitudeM: 4200.0, slipstreamKmh: 190.0 });

    const prematureHatch = sector.overrideBiomechanicalIrisHatch();
    assert.strictEqual(prematureHatch.success, false);

    const walkRes = sector.wingWalkOntoAlienHull();
    assert.strictEqual(walkRes.status, 'WING_WALK_ONTO_ALIEN_HULL_COMPLETED');
    assert.strictEqual(walkRes.tetherRopeAnchored, true);
    assert.strictEqual(sector.hullBoarded, true);

    const hatchRes = sector.overrideBiomechanicalIrisHatch();
    assert.strictEqual(hatchRes.status, 'BIOMECHANICAL_IRIS_HATCH_OVERRIDDEN');
    assert.strictEqual(hatchRes.irisPetalsOpened, 6);
    assert.strictEqual(sector.irisHatchOverridden, true);

    const decodeRes = sector.decodeGlyphLitCockpitControls();
    assert.strictEqual(decodeRes.status, 'GLYPH_LIT_COCKPIT_CONTROLS_DECODED');
    assert.strictEqual(decodeRes.repulsorThrottleUnlocked, true);
    assert.strictEqual(sector.alienControlsDecoded, true);

    const flyRes = sector.flyAlienScoutThroughCloudCanyon();
    assert.strictEqual(flyRes.status, 'ALIEN_SCOUT_FLOWN_THROUGH_CLOUD_CANYON');
    assert.strictEqual(flyRes.pursuerEvaded, true);
    assert.strictEqual(sector.cloudCanyonFlown, true);
  });

  it('Chantier 4: Yautja Prime Elders Tribunal oath recitation, bone bridge crossing over lava, and trophy mounting', () => {
    const sector = new KillerOfKillersYautjaPrimeTribunalTrialSector({ trophyCount: 120, boneBridgeLengthM: 24.0 });

    const prematureOath = sector.reciteHunterCodexOath();
    assert.strictEqual(prematureOath.success, false);

    const standRes = sector.standBeforeElderCouncil();
    assert.strictEqual(standRes.status, 'STANDING_BEFORE_ELDER_COUNCIL');
    assert.strictEqual(standRes.judgesCount, 3);
    assert.strictEqual(sector.councilAddressed, true);

    const oathRes = sector.reciteHunterCodexOath();
    assert.strictEqual(oathRes.status, 'HUNTER_CODEX_OATH_RECITED');
    assert.strictEqual(oathRes.councilApprovalPct, 100.0);
    assert.strictEqual(sector.codexRecited, true);

    const bridgeRes = sector.crossSuspendedBoneBridgeOverLava();
    assert.strictEqual(bridgeRes.status, 'SUSPENDED_BONE_BRIDGE_CROSSED_OVER_LAVA');
    assert.strictEqual(bridgeRes.lavaTempCelsius, 1150.0);
    assert.strictEqual(sector.boneBridgeCrossed, true);

    const mountRes = sector.completeTrialAndMountTrophy();
    assert.strictEqual(mountRes.status, 'TRIAL_COMPLETED_AND_TROPHY_MOUNTED');
    assert.strictEqual(mountRes.trophyWallCountAfter, 121);
    assert.strictEqual(sector.trialPassed, true);
  });

  it('Chantier 5: Arena Warrior Trial Duel Ursa vs Kenji shield bash pin, wrist lock slip, and truce formation', () => {
    const sector = new KillerOfKillersArenaWarriorTrialDuelSector({ ringDiameterM: 30.0 });

    const prematurePin = sector.pinNinjatoWithShieldBash();
    assert.strictEqual(prematurePin.success, false);

    const ringRes = sector.enterSandRingFacingRival();
    assert.strictEqual(ringRes.status, 'SAND_RING_ENTERED_FACING_RIVAL');
    assert.strictEqual(sector.ringEntered, true);

    const pinRes = sector.pinNinjatoWithShieldBash();
    assert.strictEqual(pinRes.status, 'NINJATO_PINNED_WITH_SHIELD_BASH');
    assert.strictEqual(pinRes.bladeTrappedAgainstRim, true);
    assert.strictEqual(sector.shieldBashPinned, true);

    const slipRes = sector.slipNinjatoToWristLock();
    assert.strictEqual(slipRes.status, 'NINJATO_SLIPPED_TO_WRIST_LOCK');
    assert.strictEqual(slipRes.mutualDisarmAchieved, true);
    assert.strictEqual(sector.wristSlipExecuted, true);

    const truceRes = sector.agreeTruceAsEldersGateOpens();
    assert.strictEqual(truceRes.status, 'TRUCE_AGREED_AS_ELDER_GATE_OPENS');
    assert.strictEqual(truceRes.allianceFormed, true);
    assert.strictEqual(sector.truceAgreed, true);
  });

  it('Chantier 6: Oni Hunter plasma core location, bronze mirror bolt redirection, and floor cascade vent', () => {
    const sector = new KillerOfKillersOniPlasmaCoreOverloadSector({ coreTempK: 4800.0, overloadDelaySec: 3.0 });

    const prematureAlign = sector.alignBronzeMirrorToCore(32.0);
    assert.strictEqual(prematureAlign.success, false);

    const locateRes = sector.locateExposedPlasmaCore();
    assert.strictEqual(locateRes.status, 'EXPOSED_PLASMA_CORE_LOCATED');
    assert.strictEqual(locateRes.thermalGlowVisibleThroughLacquer, true);
    assert.strictEqual(sector.coreLocated, true);

    const alignRes = sector.alignBronzeMirrorToCore(32.0);
    assert.strictEqual(alignRes.status, 'BRONZE_MIRROR_ALIGNED_TO_CORE');
    assert.strictEqual(alignRes.reflectivityPct, 86.0);
    assert.strictEqual(sector.mirrorAligned, true);

    const redirectRes = sector.redirectPlasmaBoltIntoCore();
    assert.strictEqual(redirectRes.status, 'PLASMA_BOLT_REDIRECTED_INTO_CORE');
    assert.strictEqual(redirectRes.coreInstabilityPct, 95.0);
    assert.strictEqual(sector.boltRedirected, true);

    const ventRes = sector.ventCascadeOverloadThroughFloor();
    assert.strictEqual(ventRes.status, 'CASCADE_OVERLOAD_VENTED_THROUGH_FLOOR');
    assert.strictEqual(ventRes.tatamiFloorShattered, true);
    assert.strictEqual(sector.coreOverloaded, true);
  });

  it('Chantier 7: Strict User Rule 3 verification in Tribunal Hall (isYautja && health <= 0 && config === KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL)', () => {
    const protocol = new KillerOfKillersYautjaDefeatTribunalProtocolSector();

    const humanCheck = protocol.evaluateDefeatCondition({
      isYautja: false,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL'
    });
    assert.strictEqual(humanCheck.armed, false);
    assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

    const aliveCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 80,
      configuration: 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL'
    });
    assert.strictEqual(aliveCheck.armed, false);
    assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

    const wrongArenaCheck = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_CONVERGENCE_ARENA'
    });
    assert.strictEqual(wrongArenaCheck.armed, false);
    assert.strictEqual(wrongArenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

    const validArming = protocol.evaluateDefeatCondition({
      isYautja: true,
      healthPoints: 0,
      configuration: 'KILLER_OF_KILLERS_YAUTJA_PRIME_TRIBUNAL'
    });
    assert.strictEqual(validArming.status, 'KILLER_OF_KILLERS_TRIBUNAL_GAUNTLET_OVERLOAD_ARMED');
    assert.strictEqual(validArming.countdownSeconds, 15.0);
    assert.strictEqual(validArming.mockingLaughterDb, 105.0);
    assert.strictEqual(protocol.protocolArmed, true);

    const midUpdate = protocol.updateCountdown(5.0);
    assert.strictEqual(midUpdate.active, true);
    assert.strictEqual(midUpdate.remainingSeconds, 10.0);

    const blastRes = protocol.updateCountdown(11.0);
    assert.strictEqual(blastRes.status, 'KILLER_OF_KILLERS_TRIBUNAL_MICRO_NUCLEAR_CLEANSING_BLAST');
    assert.strictEqual(blastRes.blastRadiusM, 65.0);
    assert.strictEqual(blastRes.honorScoreGranted, 500);
    assert.strictEqual(protocol.cleansingBlastExecuted, true);
    assert.strictEqual(protocol.honorPreserved, true);
  });

  it('Chantier 8: HumanQaKillerOfKillersTribunalHUDDirector telemetry and defeat widget update', () => {
    const director = new HumanQaKillerOfKillersTribunalHUDDirector();
    const mountRes = director.mount();
    assert.strictEqual(typeof mountRes, 'object');

    const updateRes = director.updateDefeatWidget({
      protocolArmed: true,
      countdownTimerRemaining: 13.8,
      activeGlyph: 'ᚂ'
    });
    assert.strictEqual(updateRes.protocolArmed, true);
    assert.strictEqual(updateRes.activeGlyph, 'ᚂ');
    assert.strictEqual(updateRes.countdownRemainingS, 13.8);

    const summary = director.getAuditsSummary();
    assert.strictEqual(summary.totalAudits, 5);
    assert.strictEqual(summary.allAuditsPassed, true);
  });

  it('Chantier 9: HumanQaKillerOfKillersTribunalMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaKillerOfKillersTribunalMasterAuditor();
    const report = auditor.runFullKillerOfKillersTribunalMasterAudit();
    assert.strictEqual(report.certified, true);
    assert.strictEqual(report.totalAudits, 9);
    assert.strictEqual(report.totalPassed, 9);

    const webglAudit = report.results.find(r => r.sector === 'WebGL_MothershipHub_DrawCall_Invariant');
    assert.ok(webglAudit);
    assert.strictEqual(webglAudit.status, 'PASSED');
    assert.ok(webglAudit.drawCalls <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v196 SFX triggers', () => {
    const ramAcoustics = audioSynth.computeMeadHallOakDoorRamAcoustics(5200.0, 4);
    assert.ok(ramAcoustics.fundamentalHz > 0);
    assert.ok(ramAcoustics.timberDampingDb > 0);

    const vaultAcoustics = audioSynth.computeTribunalHallVaultReverbAcoustics(120, 1150.0);
    assert.ok(vaultAcoustics.vaultResonanceHz > 0);
    assert.ok(vaultAcoustics.boneDiffusionIndex > 0);

    assert.doesNotThrow(() => audioSynth.playMeadHallOakDoorRamSFX());
    assert.doesNotThrow(() => audioSynth.playBoilingFatCauldronSizzleSFX());
    assert.doesNotThrow(() => audioSynth.playSkjaldborgShieldWallBraceSFX());
    assert.doesNotThrow(() => audioSynth.playCastleMoatReedBreathBubbleSFX());
    assert.doesNotThrow(() => audioSynth.playTekkoKagiStoneScrapeSFX());
    assert.doesNotThrow(() => audioSynth.playKawaraRoofHatchCreakSFX());
    assert.doesNotThrow(() => audioSynth.playAlienHullSlipstreamRoarSFX());
    assert.doesNotThrow(() => audioSynth.playBiomechanicalIrisHatchOpenSFX());
    assert.doesNotThrow(() => audioSynth.playGlyphCockpitConsoleChimeSFX());
    assert.doesNotThrow(() => audioSynth.playTribunalElderOathResonanceSFX());
    assert.doesNotThrow(() => audioSynth.playBoneBridgeLavaSwayCreakSFX());
    assert.doesNotThrow(() => audioSynth.playArenaSandRingNinjatoPinSFX());
    assert.doesNotThrow(() => audioSynth.playBronzeMirrorPlasmaReflectSFX());
    assert.doesNotThrow(() => audioSynth.playOniPlasmaCoreCascadeVentSFX());
    assert.doesNotThrow(() => audioSynth.playKillerTribunalMicroNuclearPurgeSFX());
  });
});
