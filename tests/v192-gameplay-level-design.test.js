import test from 'node:test';
import assert from 'node:assert/strict';

import { Prey1719PrairieSnakeWolfMeadowSector } from '../src/gameplay/Prey1719PrairieSnakeWolfMeadowSector.js';
import { Prey1719VoyageurTreeBaitSector } from '../src/gameplay/Prey1719VoyageurTreeBaitSector.js';
import { Prey1719RaphaelAdoliniFlintlockSector } from '../src/gameplay/Prey1719RaphaelAdoliniFlintlockSector.js';
import { Prey1719FeralObsidianWristbladesWireSector } from '../src/gameplay/Prey1719FeralObsidianWristbladesWireSector.js';
import { Prey1719BurntForestCanopyParkourSector } from '../src/gameplay/Prey1719BurntForestCanopyParkourSector.js';
import { Prey1719TaabeSacrificialDuelSector } from '../src/gameplay/Prey1719TaabeSacrificialDuelSector.js';
import { Prey1719YautjaDefeatBurntForestProtocolSector } from '../src/gameplay/Prey1719YautjaDefeatBurntForestProtocolSector.js';
import { HumanQaPrey1719BurntForestHUDDirector } from '../src/gameplay/HumanQaPrey1719BurntForestHUDDirector.js';
import { HumanQaPrey1719BurntForestMasterAuditor } from '../src/gameplay/HumanQaPrey1719BurntForestMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v192 Chantier LD 1: Prey1719PrairieSnakeWolfMeadowSector detects snake warning rattle, harvests venom, and tracks wolf', () => {
  const sector = new Prey1719PrairieSnakeWolfMeadowSector({ grassHeightCm: 95.0 });

  const detect = sector.detectRattlesnakeWarning(0.9);
  assert.strictEqual(detect.status, 'RATTLESNAKE_WARNING_RATTLE_IDENTIFIED');
  assert.strictEqual(sector.rattlesnakeWarningDetected, true);
  assert.strictEqual(detect.strikeAvoided, true);

  const venom = sector.harvestRattlesnakeVenom();
  assert.strictEqual(venom.status, 'RATTLESNAKE_NEUROTOXIN_HARVESTED');
  assert.strictEqual(sector.snakeVenomHarvested, true);
  assert.strictEqual(sector.paralyticArrowCoatingApplied, true);

  const wolf = sector.trackTimberWolfPredation();
  assert.strictEqual(wolf.status, 'TIMBER_WOLF_PREDATION_WITNESSED');
  assert.strictEqual(sector.timberWolfSpotted, true);
});

test('v192 Chantier LD 2: Prey1719VoyageurTreeBaitSector saws hemp rope bindings and triggers predator canopy ambush', () => {
  const sector = new Prey1719VoyageurTreeBaitSector({ hempRopeThicknessMm: 22.0 });

  const saw1 = sector.sawHempRopeBindings(2);
  assert.strictEqual(saw1.severed, false);
  assert.strictEqual(sector.ropeIntegrityPct, 50.0);

  const saw2 = sector.sawHempRopeBindings(2);
  assert.strictEqual(saw2.severed, true);
  assert.strictEqual(sector.bindingsSevered, true);
  assert.strictEqual(sector.boundToDeadTree, false);

  const ambush = sector.triggerPredatorNocturnalAmbush();
  assert.strictEqual(ambush.status, 'FERAL_PREDATOR_CANOPY_DROP_AMBUSH');
  assert.strictEqual(sector.predatorNocturnalAssaultActive, true);
  assert.strictEqual(sector.trappersAnnihilated, true);
  assert.strictEqual(ambush.escapeWindowOpened, true);
});

test('v192 Chantier LD 3: Prey1719RaphaelAdoliniFlintlockSector triages Raphael, authenticates 1715 inscription, primes, and discharges pistol', () => {
  const sector = new Prey1719RaphaelAdoliniFlintlockSector();

  const triage = sector.administerTriageToRaphael();
  assert.strictEqual(triage.status, 'RAPHAEL_ADOLINI_TRIAGE_COMPLETED');
  assert.strictEqual(sector.triageHerbsAdministered, true);

  const inspect = sector.inspectPistolInscription();
  assert.strictEqual(inspect.status, 'PISTOL_INSCRIPTION_AUTHENTICATED');
  assert.strictEqual(inspect.engraving, 'Raphael Adolini 1715');
  assert.strictEqual(sector.inscriptionRead, true);

  const load = sector.loadAndPrimeFlintlockPistol();
  assert.strictEqual(load.status, 'FLINTLOCK_PISTOL_FULLY_PRIMED_AND_COCKED');
  assert.strictEqual(sector.pistolReadyToFire, true);

  const shot = sector.dischargeFlintlockPistol();
  assert.strictEqual(shot.status, 'FLINTLOCK_PISTOL_DISCHARGED_LETHAL_HIT');
  assert.strictEqual(sector.pistolReadyToFire, false);
});

test('v192 Chantier LD 4: Prey1719FeralObsidianWristbladesWireSector extends blades, fires cut-clamp wire snare, and executes decapitation', () => {
  const sector = new Prey1719FeralObsidianWristbladesWireSector({ wristbladeLengthCm: 48.0 });

  const extend = sector.extendObsidianWristblades();
  assert.strictEqual(extend.status, 'OBSIDIAN_WRISTBLADES_EXTENDED');
  assert.strictEqual(sector.wristbladesExtended, true);

  const wire = sector.fireCutClampWireSnare(8.0);
  assert.strictEqual(wire.status, 'CUT_CLAMP_WIRE_SNARE_WRAPPED_AND_CINCHED');
  assert.strictEqual(sector.wireSnareFired, true);
  assert.strictEqual(sector.targetEntangledAndCut, true);

  const decap = sector.executeScissorDecapitation();
  assert.strictEqual(decap.status, 'SCISSOR_DECAPITATION_LETHAL_STRIKE');
  assert.strictEqual(sector.scissorDecapitationExecuted, true);
});

test('v192 Chantier LD 5: Prey1719BurntForestCanopyParkourSector leaps charred trunks, tracks acoustic breathing, and drops on sentry', () => {
  const sector = new Prey1719BurntForestCanopyParkourSector({ charredTrunkHeightM: 22.0 });

  const leap = sector.executeCharredTrunkLeap(11.0);
  assert.strictEqual(leap.status, 'CHARRED_TRUNK_LEAP_LANDED_SILENTLY');
  assert.strictEqual(sector.trunkLeapActive, true);

  const listen = sector.engageAcousticListeningThroughAsh();
  assert.strictEqual(listen.status, 'ACOUSTIC_TRACKING_PENETRATED_ASH_DRIFT');
  assert.strictEqual(sector.acousticListeningEngaged, true);
  assert.strictEqual(listen.sentryTargetsPinpointed, 3);

  const drop = sector.executeVerticalDropTakedown();
  assert.strictEqual(drop.status, 'VERTICAL_DROP_TAKEDOWN_EXECUTED');
  assert.strictEqual(sector.sentriesTargetedFromCanopy, 1);
});

test('v192 Chantier LD 6: Prey1719TaabeSacrificialDuelSector impales spine, clashes knives, and delivers dying laser homing revelation', () => {
  const sector = new Prey1719TaabeSacrificialDuelSector();

  const spine = sector.impalePredatorSpineFromBehind();
  assert.strictEqual(spine.status, 'YAUTJA_SPINE_IMPALED_BY_COMANCHE_SPEAR');
  assert.strictEqual(sector.rearSpineSpearImpaled, true);

  const knife = sector.engageCloseQuartersKnifeCombat();
  assert.strictEqual(knife.status, 'CLOSE_QUARTERS_KNIFE_CLASH_ENGAGED');
  assert.strictEqual(sector.knifeMeleeClashExecuted, true);

  const dying = sector.deliverDyingWeaknessRevelation();
  assert.strictEqual(dying.status, 'TAABE_HEROIC_SACRIFICE_AND_REVELATION');
  assert.strictEqual(sector.taabeSacrificeLethal, true);
  assert.strictEqual(sector.laserWeaknessRevealedToNaru, true);
  assert.strictEqual(dying.whisperedRevelation, 'IT_CANNOT_SEE_YOU_WEAPON_HOMES_ON_ITS_OWN_LIGHT');
});

test('v192 Chantier LD 7: Prey1719YautjaDefeatBurntForestProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new Prey1719YautjaDefeatBurntForestProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'PREY_1719_BURNT_FOREST' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 50, configuration: 'PREY_1719_BURNT_FOREST' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Mauvaise arène -> inerte
  const arenaCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_ARK_HULL' });
  assert.strictEqual(arenaCheck.armed, false);
  assert.strictEqual(arenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

  // Condition 4: Chasseur Yautja perd (HP <= 0) en arène Prey Burnt Forest -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREY_1719_BURNT_FOREST' });
  assert.strictEqual(defeatCheck.status, 'PREY_BURNT_FOREST_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.archaicSpringCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(11.0);
  assert.strictEqual(blast.status, 'PREY_BURNT_FOREST_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v192 Chantier LD 8: HumanQaPrey1719BurntForestHUDDirector mounts burnt forest HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaPrey1719BurntForestHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 6.5,
    activeGlyph: 'ᚒ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᚒ');
});

test('v192 Chantier LD 9: AudioSynthesizer computes rattlesnake & flintlock acoustics and executes 15 new v192 SFX methods', () => {
  const rattleAcoustics = audioSynth.computeRattlesnakeWarningAcoustics(4200.0, 2.5);
  assert.ok(rattleAcoustics.rattleFreqHz > 0);
  assert.ok(rattleAcoustics.buzzIntensityDb > 0);

  const flintlockAcoustics = audioSynth.computeFlintlockPistolPrimingAcoustics(76.0, 65.0);
  assert.ok(flintlockAcoustics.frizzenSnapDb > 0);
  assert.ok(flintlockAcoustics.hammerCockPitchHz > 0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playPrairieRattlesnakeBuzzerSFX',
    'playTimberWolfStalkPawsSFX',
    'playHempRopeSawingFrictionSFX',
    'playPinePitchTorchFlickerSFX',
    'playAdoliniPowderFlaskPourSFX',
    'playRamrodLeadBallSeatThudSFX',
    'playFlintlockFrizzenCockClickSFX',
    'playAdoliniPistolMuzzleReportSFX',
    'playObsidianWristbladeExtendChirpSFX',
    'playCutClampWireSnareLaunchSFX',
    'playScissorDecapitationSeveringSliceSFX',
    'playCharredTrunkParkourLandSFX',
    'playAshStormWindDriftSFX',
    'playTaabeSpineSpearImpaleGroanSFX',
    'playPreyBurntForestMicroNuclearPurgeSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v192 Chantier LD 10: HumanQaPrey1719BurntForestMasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaPrey1719BurntForestMasterAuditor();
  const report = auditor.runFullPrey1719BurntForestMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
