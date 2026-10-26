import test from 'node:test';
import assert from 'node:assert/strict';

import { Predators2010RiverGhostQuadrupedChaseSector } from '../src/gameplay/Predators2010RiverGhostQuadrupedChaseSector.js';
import { Predators2010HellHoundPhalanxDefenseSector } from '../src/gameplay/Predators2010HellHoundPhalanxDefenseSector.js';
import { Predators2010CanopySniperShimmerSector } from '../src/gameplay/Predators2010CanopySniperShimmerSector.js';
import { Predators2010BoobyTrappedCorpseDisarmSector } from '../src/gameplay/Predators2010BoobyTrappedCorpseDisarmSector.js';
import { Predators2010MagnesiumThermalWhiteoutSector } from '../src/gameplay/Predators2010MagnesiumThermalWhiteoutSector.js';
import { Predators2010NolandArmoryScavengerSector } from '../src/gameplay/Predators2010NolandArmoryScavengerSector.js';
import { Predators2010YautjaDefeatThermalOverloadProtocolSector } from '../src/gameplay/Predators2010YautjaDefeatThermalOverloadProtocolSector.js';
import { HumanQaPredators2010FranchiseMasterHUDDirector } from '../src/gameplay/HumanQaPredators2010FranchiseMasterHUDDirector.js';
import { HumanQaPredators2010FranchiseMasterAuditor } from '../src/gameplay/HumanQaPredators2010FranchiseMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v185 Chantier LD 1: Predators2010RiverGhostQuadrupedChaseSector spots creature, handles mossy boulder slip hazard, and corners target', () => {
  const sector = new Predators2010RiverGhostQuadrupedChaseSector({ chaseDistanceM: 120.0 });

  const spot = sector.spotRiverGhost();
  assert.strictEqual(spot.status, 'RIVER_GHOST_SPOTTED_IN_FOLIAGE');
  assert.strictEqual(sector.riverGhostSpotted, true);

  const pursue = sector.pursueAcrossRiverBoulders(12.0, 10.0);
  assert.strictEqual(pursue.status, 'RIVER_GHOST_CORNERED_AT_WATERFALL_CHASM');
  assert.strictEqual(sector.riverGhostCornered, true);

  sector.squadSlippedOnBoulder = true;
  const recover = sector.recoverBalance();
  assert.strictEqual(recover.status, 'FOOTING_RECOVERED_ON_DRY_ROCK');
  assert.strictEqual(sector.squadSlippedOnBoulder, false);
});

test('v185 Chantier LD 2: Predators2010HellHoundPhalanxDefenseSector sounds tracker horn, forms 360 phalanx, and repels pack with minigun', () => {
  const phalanx = new Predators2010HellHoundPhalanxDefenseSector({ hellHoundsCount: 6 });

  const horn = phalanx.soundHuntingHorn();
  assert.strictEqual(horn.status, 'TRACKER_HORN_BLAST_SOUNDED');
  assert.strictEqual(phalanx.hornBlown, true);

  const form = phalanx.formDefensivePhalanx();
  assert.strictEqual(form.status, '360_DEFENSIVE_PHALANX_FORMED');
  assert.strictEqual(phalanx.phalanxFormed, true);

  const barrage = phalanx.fireMinigunSuppressionBarrage(600);
  assert.strictEqual(barrage.status, 'HELL_HOUND_PACK_COMPLETELY_REPELLED');
  assert.strictEqual(phalanx.houndsEliminated, 6);
  assert.strictEqual(phalanx.packCharging, false);
});

test('v185 Chantier LD 3: Predators2010CanopySniperShimmerSector aims SVD scope, locks optic shimmer, holds breath, and drops cloaked predator', () => {
  const sniper = new Predators2010CanopySniperShimmerSector({ canopyPerchHeightM: 28.0 });

  const aim = sniper.aimThroughSvdScope();
  assert.strictEqual(aim.status, 'SVD_SCOPE_AIMED_INTO_CANOPY');

  const lock = sniper.detectCamouflageShimmer(2.5);
  assert.strictEqual(lock.status, 'OPTICAL_SHIMMER_DISTORTION_LOCKED');
  assert.strictEqual(sniper.shimmerDetected, true);

  const breath = sniper.holdBreathForSnipe();
  assert.strictEqual(breath.status, 'BREATH_HELD_RETICLE_STABILIZED');
  assert.strictEqual(sniper.breathHeld, true);

  const fire = sniper.firePrecisionCounterSnipe();
  assert.strictEqual(fire.status, 'PREDATOR_HIT_DISRUPTED_CAMOUFLAGE_FALL');
  assert.strictEqual(sniper.predatorFellFromCanopy, true);
});

test('v185 Chantier LD 4: Predators2010BoobyTrappedCorpseDisarmSector inspects heel trap and safely snips monofilament tension wire', () => {
  const disarmSector = new Predators2010BoobyTrappedCorpseDisarmSector({ disarmTimeLimitSeconds: 4.0 });

  const inspect = disarmSector.inspectCorpseHeels();
  assert.strictEqual(inspect.status, 'HEEL_BOOBY_TRAP_DISCOVERED');
  assert.strictEqual(disarmSector.heelTrapSpotted, true);

  const tick = disarmSector.updateDisarmTimer(1.0);
  assert.strictEqual(tick.active, true);

  const snip = disarmSector.snipHeelTripwire(10.0);
  assert.strictEqual(snip.status, 'HEEL_TRIPWIRE_SAFELY_SEVERED');
  assert.strictEqual(disarmSector.wireSeveredSafely, true);
  assert.strictEqual(disarmSector.plasmaMinesDisarmed, true);
});

test('v185 Chantier LD 5: Predators2010MagnesiumThermalWhiteoutSector detonates 3000K flare, blinds IR sensors, and forces optic reboot', () => {
  const flareSector = new Predators2010MagnesiumThermalWhiteoutSector();

  const flash = flareSector.igniteMagnesiumCharge(8.0);
  assert.strictEqual(flash.status, 'MAGNESIUM_WHITEOUT_DETONATED');
  assert.strictEqual(flareSector.sensorWhiteoutActive, true);
  assert.strictEqual(flareSector.predatorStunned, true);

  const rebooting = flareSector.updateBiomaskReboot(1.0);
  assert.strictEqual(rebooting.active, true);

  const restored = flareSector.updateBiomaskReboot(2.0);
  assert.strictEqual(restored.status, 'BIOMASK_OPTICAL_REBOOT_COMPLETED');
  assert.strictEqual(flareSector.sensorWhiteoutActive, false);
});

test('v185 Chantier LD 6: Predators2010NolandArmoryScavengerSector unseals drill crawler vault and recharges Yautja cloaking capacitor', () => {
  const armorySector = new Predators2010NolandArmoryScavengerSector();

  const vault = armorySector.unlockScavengerVault(850.0);
  assert.strictEqual(vault.status, 'SCAVENGER_ARMORY_VAULT_UNSEALED');
  assert.strictEqual(armorySector.armoryVaultUnlocked, true);

  const cloak = armorySector.rechargeAndEquipCloakingEmitter(2);
  assert.strictEqual(cloak.status, 'YAUTJA_CLOAKING_EMITTER_OPERATIONAL');
  assert.strictEqual(armorySector.cloakingCapacitorRepaired, true);
  assert.strictEqual(armorySector.scavengedGearEquipped, true);
});

test('v185 Chantier LD 7: Predators2010YautjaDefeatThermalOverloadProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new Predators2010YautjaDefeatThermalOverloadProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'PREDATORS_2010_GAME_PRESERVE' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 60, configuration: 'PREDATORS_2010_GAME_PRESERVE' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Chasseur Yautja perd (HP <= 0) en arène Predators 2010 -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREDATORS_2010_GAME_PRESERVE' });
  assert.strictEqual(defeatCheck.status, 'PNEUMATIC_GAUNTLET_COVER_OPENED_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.pneumaticCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(10.5);
  assert.strictEqual(blast.status, 'THERMOBARIC_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v185 Chantier LD 8: HumanQaPredators2010FranchiseMasterHUDDirector mounts climax HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaPredators2010FranchiseMasterHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 8.5,
    activeGlyph: 'ᛟ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᛟ');
});

test('v185 Chantier LD 9: AudioSynthesizer computes river ghost gallop & magnesium flash acoustics and executes 15 new v185 SFX methods', () => {
  const gallopAcoustics = audioSynth.computeRiverGhostQuadrupedalGallopAcoustics(14.0, 0.45, 850.0);
  assert.ok(gallopAcoustics.gallopFrequencyCadenceHz > 0);
  assert.ok(gallopAcoustics.impactResonanceHz > 0);

  const flashAcoustics = audioSynth.computeMagnesiumThermalFlashAcoustics(120.0, 85000.0, 132.0);
  assert.ok(flashAcoustics.combustionHissFrequencyHz > 0);
  assert.ok(flashAcoustics.thermalShockwavePressureKpa > 0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playRiverGhostScuttleSFX',
    'playRiverGhostChitterRoarSFX',
    'playTrackerHuntingHornResonanceSFX',
    'playMinigunPhalanxSuppressionSFX',
    'playCanopyCloakOpticShimmerSFX',
    'playSvdSniperScopeFocusSFX',
    'playHeelBoobyTrapTensionClickSFX',
    'playWireCutterDisarmSnipSFX',
    'playMagnesiumFlashHissSFX',
    'playThermalOpticRebootHumSFX',
    'playScavengerArmoryVaultUnsealSFX',
    'playGauntletPneumaticCoverOpenSFX',
    'playAlienCrimsonGlyphAccelerateSFX',
    'playReverberantMockingLaughSFX',
    'playMicroNuclearThermobaricEruptionSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v185 Chantier LD 10: HumanQaPredators2010FranchiseMasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaPredators2010FranchiseMasterAuditor();
  const report = auditor.runFullFranchiseMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
