import test from 'node:test';
import assert from 'node:assert/strict';

import { ThePredator2018StargazerCleanRoomDelugeSector } from '../src/gameplay/ThePredator2018StargazerCleanRoomDelugeSector.js';
import { ThePredator2018TreeCanopySniperPerchSector } from '../src/gameplay/ThePredator2018TreeCanopySniperPerchSector.js';
import { ThePredator2018HighSchoolBaseballDiamondSector } from '../src/gameplay/ThePredator2018HighSchoolBaseballDiamondSector.js';
import { ThePredator2018PlasmaArmoryTestBenchSector } from '../src/gameplay/ThePredator2018PlasmaArmoryTestBenchSector.js';
import { ThePredator2018BiomorphicCocoonBaySector } from '../src/gameplay/ThePredator2018BiomorphicCocoonBaySector.js';
import { ThePredator2018UpgradeRetinalOpticSector } from '../src/gameplay/ThePredator2018UpgradeRetinalOpticSector.js';
import { ThePredator2018YautjaDefeatStargazerCleanRoomProtocolSector } from '../src/gameplay/ThePredator2018YautjaDefeatStargazerCleanRoomProtocolSector.js';
import { HumanQaThePredator2018FacilityHUDDirector } from '../src/gameplay/HumanQaThePredator2018FacilityHUDDirector.js';
import { HumanQaThePredator2018FacilityMasterAuditor } from '../src/gameplay/HumanQaThePredator2018FacilityMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v189 Chantier LD 1: ThePredator2018StargazerCleanRoomDelugeSector breaches suite, activates deluge, and blinds automated turrets', () => {
  const sector = new ThePredator2018StargazerCleanRoomDelugeSector({ delugeFlowRateLpm: 4000.0 });

  const breach = sector.breachCleanRoomSuite();
  assert.strictEqual(breach.status, 'CLEAN_ROOM_SURGICAL_SUITE_BREACHED');
  assert.strictEqual(sector.cleanRoomBreached, true);

  const deluge = sector.triggerEmergencyDelugeShowers(6.0);
  assert.strictEqual(deluge.status, 'EMERGENCY_DELUGE_SHOWERS_DISCHARGING');
  assert.strictEqual(sector.delugeShowersActivated, true);
  assert.strictEqual(deluge.totalLitersDischarged, 400);

  const hydraulic = sector.severHydraulicPressureLines();
  assert.strictEqual(hydraulic.status, 'HYDRAULIC_LINES_RUPTURED_AEROSOL_FLOOD');
  assert.strictEqual(sector.automatedTurretsBlinded, true);
  assert.ok(sector.aerosolMistDensityPct > 80.0);

  const scalpel = sector.overloadLaserScalpelGrid();
  assert.strictEqual(scalpel.status, 'LASER_SCALPEL_GRID_SHORT_CIRCUITED');
  assert.strictEqual(sector.scalpelGridOverloaded, true);
});

test('v189 Chantier LD 2: ThePredator2018TreeCanopySniperPerchSector traverses branches, cuts trip-flares, and eliminates canopy snipers', () => {
  const sector = new ThePredator2018TreeCanopySniperPerchSector({ platformElevationM: 24.0, tripFlaresArmed: 4 });

  const traverse = sector.traverseCanopyBranches(0.92);
  assert.strictEqual(traverse.status, 'CANOPY_BRANCH_TRAVERSAL_SECURED');
  assert.strictEqual(sector.canopyBranchTraversed, true);

  const disarm = sector.disarmTripFlares(2);
  assert.strictEqual(disarm.status, 'TRIP_FLARE_WIRES_SEVERED_SILENTLY');
  assert.strictEqual(sector.tripFlaresDisarmed, 2);
  assert.strictEqual(sector.tripFlaresArmed, 2);

  const flare = sector.igniteMagnesiumTripFlare();
  assert.strictEqual(flare.status, 'MAGNESIUM_TRIP_FLARE_IGNITED');
  assert.strictEqual(sector.magnesiumFlareIgnited, true);

  const snipers = sector.neutralizeCanopySnipers(2);
  assert.strictEqual(snipers.status, 'CANOPY_SNIPERS_NEUTRALIZED');
  assert.strictEqual(sector.canopySnipersEliminated, 2);
  assert.strictEqual(sector.perchPlatformSecured, true);
});

test('v189 Chantier LD 3: ThePredator2018HighSchoolBaseballDiamondSector takes dugout cover, executes slide, and vaults backstop', () => {
  const sector = new ThePredator2018HighSchoolBaseballDiamondSector({ dugoutWallThicknessCm: 20.0 });

  const dugout = sector.takeDugoutBallisticCover();
  assert.strictEqual(dugout.status, 'DUGOUT_BALLISTIC_COVER_SECURED');
  assert.strictEqual(sector.dugoutShelterOccupied, true);

  const slide = sector.executeInfieldDirtSlide(5.2);
  assert.strictEqual(slide.status, 'INFIELD_DIRT_SLIDE_COMPLETED');
  assert.strictEqual(sector.infieldSlideExecuted, true);

  const vault = sector.vaultChainLinkBackstop();
  assert.strictEqual(vault.status, 'CHAIN_LINK_BACKSTOP_VAULTED');
  assert.strictEqual(sector.chainLinkFenceVaulted, true);

  const cage = sector.navigateBattingCageObstacle();
  assert.strictEqual(cage.status, 'BATTING_CAGE_OBSTACLE_NAVIGATED');
  assert.strictEqual(sector.battingCagesNavigated, true);
});

test('v189 Chantier LD 4: ThePredator2018PlasmaArmoryTestBenchSector unlocks bench, charges capacitors, and breaches bulkhead', () => {
  const sector = new ThePredator2018PlasmaArmoryTestBenchSector({ capacitorBankCapacityKj: 750.0 });

  const unlock = sector.unlockTestBenchFiringLane();
  assert.strictEqual(unlock.status, 'TEST_BENCH_FIRING_LANE_UNLOCKED');
  assert.strictEqual(sector.armoryBenchUnlocked, true);

  const charge = sector.chargePlasmaCapacitorBank(1.0);
  assert.strictEqual(charge.status, 'CAPACITOR_BANK_CHARGED');
  assert.strictEqual(sector.currentCapacitorChargeKj, 750.0);

  const shot = sector.fireTestBenchPlasmaDischarge();
  assert.strictEqual(shot.status, 'TEST_BENCH_PLASMA_BOLT_DISCHARGED');
  assert.strictEqual(sector.testBenchWeaponFired, true);

  const breach = sector.overloadCapacitorBankToBreachBulkhead();
  assert.strictEqual(breach.status, 'CAPACITOR_EXPLOSIVE_DISCHARGE_BULKHEAD_BLOWN');
  assert.strictEqual(sector.armoryBulkheadBreached, true);
});

test('v189 Chantier LD 5: ThePredator2018BiomorphicCocoonBaySector enters hold, disengages magnetic clamps, and extracts hybrid embryo', () => {
  const sector = new ThePredator2018BiomorphicCocoonBaySector({ stasisCocoonsCount: 6 });

  const enter = sector.enterBiomorphicCargoBay();
  assert.strictEqual(enter.status, 'BIOMORPHIC_CARGO_BAY_ENTERED');
  assert.strictEqual(sector.cargoBayEntered, true);

  const clamp = sector.disengageStasisMagneticClamps();
  assert.strictEqual(clamp.status, 'STASIS_MAGNETIC_CLAMPS_RELEASED');
  assert.strictEqual(sector.stasisClampsDisengaged, true);

  const extract = sector.extractHybridEmbryonicSpecimen(1);
  assert.strictEqual(extract.status, 'HYBRID_EMBRYONIC_SPECIMEN_EXTRACTED');
  assert.strictEqual(sector.embryonicSpecimenExtracted, true);
  assert.strictEqual(sector.activePodsRemaining, 5);
});

test('v189 Chantier LD 6: ThePredator2018UpgradeRetinalOpticSector switches spectrum directly, adjusts zoom, and activates voice mimicry', () => {
  const sector = new ThePredator2018UpgradeRetinalOpticSector();

  const switchSpec = sector.switchDirectRetinalSpectrum('RETINAL_UV_HALOGEN');
  assert.strictEqual(switchSpec.status, 'RETINAL_SPECTRUM_SWITCHED');
  assert.strictEqual(sector.currentSpectrum, 'RETINAL_UV_HALOGEN');
  assert.strictEqual(switchSpec.bioMaskRequired, false);

  const zoom = sector.adjustRetinalMagnification(4.5);
  assert.strictEqual(zoom.status, 'RETINAL_MAGNIFICATION_ADJUSTED');
  assert.strictEqual(sector.opticalZoomFactor, 4.5);

  const mimicry = sector.activateVocalTractMimicry('Sean Keyes');
  assert.strictEqual(mimicry.status, 'VOCAL_TRACT_MIMICRY_EMITTED');
  assert.strictEqual(sector.voiceMimicryActive, true);

  const deflect = sector.deflectConventionalProjectile(2200.0);
  assert.strictEqual(deflect.status, 'PROJECTILE_DEFLECTED_BY_CHITIN');
  assert.strictEqual(sector.deflectedRoundsCount, 1);
});

test('v189 Chantier LD 7: ThePredator2018YautjaDefeatStargazerCleanRoomProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new ThePredator2018YautjaDefeatStargazerCleanRoomProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'THE_PREDATOR_2018_CLEAN_ROOM' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 45, configuration: 'THE_PREDATOR_2018_CLEAN_ROOM' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Mauvaise arène -> inerte
  const wrongArenaCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREDATOR_2_SUBWAY' });
  assert.strictEqual(wrongArenaCheck.armed, false);
  assert.strictEqual(wrongArenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

  // Condition 4: Chasseur Yautja perd (HP <= 0) en arène Clean-Room -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_CLEAN_ROOM' });
  assert.strictEqual(defeatCheck.status, 'CLEAN_ROOM_YAUTJA_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.pneumaticCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(6.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 9.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(10.0);
  assert.strictEqual(blast.status, 'CLEAN_ROOM_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v189 Chantier LD 8: HumanQaThePredator2018FacilityHUDDirector mounts facility HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaThePredator2018FacilityHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 5.5,
    activeGlyph: 'ᚳ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᚳ');
});

test('v189 Chantier LD 9: AudioSynthesizer computes deluge & capacitor acoustics and executes 15 new v189 SFX methods', () => {
  const delugeAcoustics = audioSynth.computeDecontaminationDelugeAcoustics(4000.0, 4.5);
  assert.ok(delugeAcoustics.sprayTurbulenceDb > 0);
  assert.strictEqual(delugeAcoustics.pressureBar, 4.5);

  const capacitorAcoustics = audioSynth.computePlasmaCapacitorChargeAcoustics(100.0, 750.0);
  assert.ok(capacitorAcoustics.risingCarrierHz > 0);
  assert.strictEqual(capacitorAcoustics.arcVoltageKv, 75.0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playDecontaminationDelugeHissSFX',
    'playHydraulicMistAerosolDischargeSFX',
    'playLaserScalpelGridHumSFX',
    'playTreeBranchTraverseCreakSFX',
    'playTripFlareWireSnipClickSFX',
    'playMagnesiumForestFlareIgniteSFX',
    'playBarrett50BmgMuzzleBlastSFX',
    'playBaseballDugoutBulletPingSFX',
    'playInfieldDirtSlideSwishSFX',
    'playBattingCageChainLinkClatterSFX',
    'playPlasmaCapacitorChargeWhineSFX',
    'playTestBenchPlasmaImpactShatterSFX',
    'playBiomorphicCocoonStasisPurgeSFX',
    'playRetinalSpectrumSwitchChirpSFX',
    'playCleanRoomNuclearPurificationBlastSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v189 Chantier LD 10: HumanQaThePredator2018FacilityMasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaThePredator2018FacilityMasterAuditor();
  const report = auditor.runFullFacilityMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
