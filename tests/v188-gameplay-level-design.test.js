import test from 'node:test';
import assert from 'node:assert/strict';

import { ThePredator2018ArkShipHullAscentSector } from '../src/gameplay/ThePredator2018ArkShipHullAscentSector.js';
import { ThePredator2018HalloweenSuburbanHuntSector } from '../src/gameplay/ThePredator2018HalloweenSuburbanHuntSector.js';
import { ThePredator2018LooniesTacticalRVSector } from '../src/gameplay/ThePredator2018LooniesTacticalRVSector.js';
import { ThePredator2018HolographicStarMapSector } from '../src/gameplay/ThePredator2018HolographicStarMapSector.js';
import { ThePredator2018SwampMudClimaxShowdownSector } from '../src/gameplay/ThePredator2018SwampMudClimaxShowdownSector.js';
import { ThePredator2018CaseyBracketTranquilizerSector } from '../src/gameplay/ThePredator2018CaseyBracketTranquilizerSector.js';
import { ThePredator2018YautjaDefeatArkHullProtocolSector } from '../src/gameplay/ThePredator2018YautjaDefeatArkHullProtocolSector.js';
import { HumanQaThePredator2018ArkHUDDirector } from '../src/gameplay/HumanQaThePredator2018ArkHUDDirector.js';
import { HumanQaThePredator2018ArkMasterAuditor } from '../src/gameplay/HumanQaThePredator2018ArkMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v188 Chantier LD 1: ThePredator2018ArkShipHullAscentSector clenches sloped hull, reaches dorsal intake, and collapses forcefield', () => {
  const sector = new ThePredator2018ArkShipHullAscentSector({ airspeedKmh: 180.0, altitudeM: 1200.0 });

  const cling = sector.clingToArkShipSlopedHull(0.92);
  assert.strictEqual(cling.status, 'ARK_HULL_CLINGING_STABILIZED');
  assert.strictEqual(sector.hullClingingActive, true);
  assert.strictEqual(cling.gForceToleranceSecured, true);

  const intake = sector.reachDorsalIntakeConduit();
  assert.strictEqual(intake.status, 'DORSAL_INTAKE_CONDUIT_REACHED');
  assert.strictEqual(sector.dorsalIntakeReached, true);
  assert.ok(sector.altitudeM > 1200.0);

  const overload = sector.overloadForcefieldShieldGenerator(3.0);
  assert.strictEqual(overload.status, 'ARK_FORCEFIELD_SHIELD_COLLAPSED');
  assert.strictEqual(sector.forcefieldOverloaded, true);
  assert.strictEqual(sector.shieldDisrupted, true);

  const stabilize = sector.stabilizeAscentAerodynamics(1.8);
  assert.strictEqual(stabilize.status, 'AERODYNAMIC_STABILIZATION_ACHIEVED');
});

test('v188 Chantier LD 2: ThePredator2018HalloweenSuburbanHuntSector locks tri-laser target, detonates bully porch, and evades van', () => {
  const sector = new ThePredator2018HalloweenSuburbanHuntSector({ streetLampCount: 16 });

  const lock = sector.activateAutomatedMaskTargeting({ x: 15.0, y: 1.5, z: 20.0 });
  assert.strictEqual(lock.status, 'MASK_TRI_LASER_TARGET_LOCKED');
  assert.strictEqual(sector.maskTargetLockActive, true);
  assert.strictEqual(lock.targetAcquired, true);

  const breach = sector.neutralizeBullyPorchThreat(1800.0);
  assert.strictEqual(breach.status, 'BULLY_PORCH_BLOWN_OPEN_BY_PLASMA');
  assert.strictEqual(sector.bullyPorchBreached, true);
  assert.strictEqual(breach.civilianCasualtiesPrevented, true);

  const evade = sector.evadeNeighborhoodCostumeCrowd(0.85);
  assert.strictEqual(evade.status, 'STARGAZER_SURVEILLANCE_VAN_EVADED');
  assert.strictEqual(evade.success, true);
});

test('v188 Chantier LD 3: ThePredator2018LooniesTacticalRVSector deploys sniper platform, jams military radio, and unleashes turret salvo', () => {
  const sector = new ThePredator2018LooniesTacticalRVSector({ rvArmorPlatingMm: 35.0 });

  const deploy = sector.deployMobileSniperPlatform();
  assert.strictEqual(deploy.status, 'LOONIES_MOBILE_SNIPER_PLATFORM_DEPLOYED');
  assert.strictEqual(sector.mobileSniperPlatformDeployed, true);
  assert.strictEqual(deploy.activeOperators, 6);

  const jammer = sector.activateTacticalRadioJammer(462.55);
  assert.strictEqual(jammer.status, 'RADIO_SCRAMBLER_EMITTING_WHITE_NOISE');
  assert.strictEqual(sector.radioJammerActive, true);
  assert.strictEqual(jammer.droneTelemetrySevered, true);

  const salvo = sector.fireTurretSuppressionSalvo(30);
  assert.strictEqual(salvo.status, 'HEAVY_CALIBER_SUPPRESSION_SALVO_UNLEASHED');
  assert.strictEqual(sector.suppressionRoundsFired, 30);
  assert.strictEqual(salvo.corridorCleared, true);
});

test('v188 Chantier LD 4: ThePredator2018HolographicStarMapSector unlocks terminal, projects extinction model, and extracts hybrid data', () => {
  const sector = new ThePredator2018HolographicStarMapSector({ starSystemsMapped: 42 });

  const unlock = sector.unlockFugitiveArchiveTerminal();
  assert.strictEqual(unlock.status, 'SCOUT_ARCHIVE_TERMINAL_UNLOCKED');
  assert.strictEqual(sector.scoutShipArchiveUnlocked, true);

  const timeline = sector.projectGalacticExtinctionTimeline();
  assert.strictEqual(timeline.status, 'EARTH_CLIMATE_EXTINCTION_TIMELINE_PROJECTED');
  assert.strictEqual(sector.volumetricDisplayActive, true);
  assert.strictEqual(timeline.tippingYear, 2028);

  const hybridData = sector.extractYautjaHybridizationData();
  assert.strictEqual(hybridData.status, 'YAUTJA_SPINAL_HARVEST_DATA_EXTRACTED');
  assert.strictEqual(sector.hybridizationDataAccessed, true);
  assert.strictEqual(sector.cargoCoordinatesDecrypted, true);
  assert.strictEqual(hybridData.starSystemsCount, 42);
});

test('v188 Chantier LD 5: ThePredator2018SwampMudClimaxShowdownSector applies thermal mud, dodges wrist harpoon, severs arm, and delivers kill', () => {
  const sector = new ThePredator2018SwampMudClimaxShowdownSector({ swampWaterDepthM: 0.85 });

  const mud = sector.coatInSwampMud(0.95);
  assert.strictEqual(mud.status, 'SWAMP_MUD_THERMAL_MASK_APPLIED');
  assert.strictEqual(sector.mudThermalMaskingActive, true);

  const dodge = sector.dodgeEjectedWristBladeHarpoon(0.25);
  assert.strictEqual(dodge.status, 'EJECTABLE_WRIST_HARPOON_EVADED');
  assert.strictEqual(sector.wristBladeHarpoonDodged, true);

  const sever = sector.severUpgradePredatorArm();
  assert.strictEqual(sever.status, 'UPGRADE_CHITIN_ARM_SEVERED');
  assert.strictEqual(sector.upgradePredatorChitinArmSevered, true);

  const kill = sector.fireSeveredArmPlasmacasterAtApex(3);
  assert.strictEqual(kill.status, 'SEVERED_ARM_PLASMACASTER_LETHAL_VOLLEY');
  assert.strictEqual(sector.severedArmPlasmacasterFired, true);
  assert.strictEqual(sector.quinnFinalStrikeLethal, true);
  assert.strictEqual(kill.apexPredatorDefeated, true);
});

test('v188 Chantier LD 6: ThePredator2018CaseyBracketTranquilizerSector scans chitin weak spots, fires dart, and tracks metabolization', () => {
  const sector = new ThePredator2018CaseyBracketTranquilizerSector({ dartCapacity: 5 });

  const scan = sector.analyzeChitinVulnerabilitySectors();
  assert.strictEqual(scan.status, 'CHITIN_SUB_DERMAL_JUNCTIONS_MAPPED');
  assert.strictEqual(sector.chitinWeakSpotIdentified, true);

  const dart = sector.fireHighPotencyNeuroTranquilizerDart('INTERCOSTAL_VENTRAL_SEAM');
  assert.strictEqual(dart.status, 'NEURO_TRANQUILIZER_DART_EMBEDDED');
  assert.strictEqual(sector.dartsRemaining, 4);
  assert.strictEqual(sector.targetDartsEmbedded, 1);
  assert.ok(dart.currentSlowdownFactor < 1.0);

  const track = sector.trackTranquilizerMetabolization(4.0);
  assert.strictEqual(track.status, 'YAUTJA_NEURO_DISORIENTATION_ACTIVE');
  assert.strictEqual(sector.biometricDisorientationActive, true);
});

test('v188 Chantier LD 7: ThePredator2018YautjaDefeatArkHullProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new ThePredator2018YautjaDefeatArkHullProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'THE_PREDATOR_2018_ARK_HULL' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 60, configuration: 'THE_PREDATOR_2018_ARK_HULL' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Mauvaise configuration d'arène -> inerte
  const arenaCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREDATOR_1_GUATEMALA' });
  assert.strictEqual(arenaCheck.armed, false);
  assert.strictEqual(arenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

  // Condition 4: Chasseur Yautja perd (HP <= 0) en arène Ark Hull The Predator 2018 -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_ARK_HULL' });
  assert.strictEqual(defeatCheck.status, 'ARK_HULL_YAUTJA_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.pneumaticCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(11.0);
  assert.strictEqual(blast.status, 'ARK_HULL_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v188 Chantier LD 8: HumanQaThePredator2018ArkHUDDirector mounts ark HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaThePredator2018ArkHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 7.2,
    activeGlyph: 'ᛞ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᛞ');
});

test('v188 Chantier LD 9: AudioSynthesizer computes wind shear & star map acoustics and executes 15 new v188 SFX methods', () => {
  const windAcoustics = audioSynth.computeArkShipHullWindShearAcoustics(180.0, 1200.0, 480.0);
  assert.ok(windAcoustics.aerodynamicTurbulenceDb > 0);
  assert.ok(windAcoustics.windShearVortexHz > 0);
  assert.strictEqual(windAcoustics.forcefieldHarmonicHz, 480.0);

  const mapAcoustics = audioSynth.computeHolographicStarMapResonanceAcoustics(42, 14500);
  assert.ok(mapAcoustics.harmonicCarrierHz > 0);
  assert.strictEqual(mapAcoustics.volumetricLumensFlux, 14500);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playArkHullWindShearRumbleSFX',
    'playArkShieldDisruptionDischargeSFX',
    'playHalloweenPumpkinShatterSFX',
    'playRoryMaskTargetLockChirpSFX',
    'playLooniesRVTacticalTurretFireSFX',
    'playLooniesRadioJammerStaticSFX',
    'playHolographicStarMapProjectorHumSFX',
    'playGalacticHybridizationDataChimeSFX',
    'playSwampWaterPuddleSplashStalkSFX',
    'playSeveredArmPlasmacasterTriggerSFX',
    'playNeuroTranquilizerDartHissSFX',
    'playChitinArmorCrackImpactSFX',
    'playArkGauntletAlienCountdownSFX',
    'playMockingEcho105DbLaughSFX',
    'playArkMicroNuclearCleansingBoomSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v188 Chantier LD 10: HumanQaThePredator2018ArkMasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaThePredator2018ArkMasterAuditor();
  const report = auditor.runFullArkMasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
