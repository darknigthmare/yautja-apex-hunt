import test from 'node:test';
import assert from 'node:assert/strict';

import { Prey1719BeaverDamRiverRapidsSector } from '../src/gameplay/Prey1719BeaverDamRiverRapidsSector.js';
import { Prey1719GrizzlyBearShowdownSector } from '../src/gameplay/Prey1719GrizzlyBearShowdownSector.js';
import { Prey1719FrenchVoyageurCampSector } from '../src/gameplay/Prey1719FrenchVoyageurCampSector.js';
import { Prey1719ColdMudBogInfiltrationSector } from '../src/gameplay/Prey1719ColdMudBogInfiltrationSector.js';
import { Prey1719FeralCuticleShieldFlechetteSector } from '../src/gameplay/Prey1719FeralCuticleShieldFlechetteSector.js';
import { Prey1719HorsebackBuffaloStampedeSector } from '../src/gameplay/Prey1719HorsebackBuffaloStampedeSector.js';
import { Prey1719YautjaDefeatRitualProtocolSector } from '../src/gameplay/Prey1719YautjaDefeatRitualProtocolSector.js';
import { HumanQaPrey1719MasterHUDDirector } from '../src/gameplay/HumanQaPrey1719MasterHUDDirector.js';
import { HumanQaPrey1719MasterAuditor } from '../src/gameplay/HumanQaPrey1719MasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v190 Chantier LD 1: Prey1719BeaverDamRiverRapidsSector balances on logs, dives into reeds, and tracks apex hierarchy', () => {
  const sector = new Prey1719BeaverDamRiverRapidsSector({ riverCurrentVelocityMps: 2.8 });

  const traverse = sector.traverseBeaverDamLogs(0.88);
  assert.strictEqual(traverse.status, 'BEAVER_DAM_LOGS_TRAVERSED_STABLY');
  assert.strictEqual(sector.damTraversalActive, true);
  assert.strictEqual(sector.balanceStabilized, true);

  const dive = sector.diveSubAquaticReeds(25.0);
  assert.strictEqual(dive.status, 'SUB_AQUATIC_REED_CONCEALMENT_ACTIVE');
  assert.strictEqual(sector.subAquaticDiveExecuted, true);
  assert.strictEqual(dive.thermalDiffusionUnderwater, true);

  const hierarchy = sector.advanceFoodChainObservation('FERAL_PREDATOR');
  assert.strictEqual(hierarchy.status, 'FOOD_CHAIN_APEX_TIER_RECORDED');
  assert.strictEqual(sector.apexFoodChainTierObserved, 4);
  assert.strictEqual(hierarchy.apexApexThreatIdentified, true);
});

test('v190 Chantier LD 2: Prey1719GrizzlyBearShowdownSector shelters in log, executes Feral lift, and fractures skull', () => {
  const sector = new Prey1719GrizzlyBearShowdownSector({ bearWeightKg: 800.0 });

  const shelter = sector.takeShelterInHollowLog();
  assert.strictEqual(shelter.status, 'HOLLOW_LOG_SHELTER_OCCUPIED');
  assert.strictEqual(sector.hollowLogSheltered, true);

  const charge = sector.triggerGrizzlyCharge();
  assert.strictEqual(charge.status, 'GRIZZLY_BEAR_CHARGE_UNLEASHED');
  assert.strictEqual(sector.bearChargeInitiated, true);

  const lift = sector.executeFeralPredatorSingleHandLift();
  assert.strictEqual(lift.status, 'FERAL_PREDATOR_SINGLE_HAND_LIFT_EXECUTED');
  assert.strictEqual(sector.bearLiftedSingleHanded, true);

  const punch = sector.deliverSkullFracturingPunch();
  assert.strictEqual(punch.status, 'GRIZZLY_SKULL_FRACTURED_INSTANT_KILL');
  assert.strictEqual(sector.hydraulicPunchDelivered, true);
  assert.strictEqual(sector.cloakBloodWashoutActive, true);
});

test('v190 Chantier LD 3: Prey1719FrenchVoyageurCampSector infiltrates camp, springs bear trap, and eliminates musketeers', () => {
  const sector = new Prey1719FrenchVoyageurCampSector({ bearTrapsConcealed: 6, musketeersCount: 12 });

  const infiltrate = sector.infiltrateVoyageurCamp();
  assert.strictEqual(infiltrate.status, 'VOYAGEUR_CAMP_INFILTRATED_SILENTLY');
  assert.strictEqual(sector.campInfiltrated, true);

  const trap = sector.triggerConcealedBearTrap(true);
  assert.strictEqual(trap.status, 'STEEL_JAW_BEAR_TRAP_SNAPPED');
  assert.strictEqual(sector.bearTrapsSprung, 1);
  assert.strictEqual(sector.bearTrapsConcealed, 5);

  const volley = sector.unleashFlintlockMusketVolley();
  assert.strictEqual(volley.status, 'BLACK_POWDER_MUSKET_VOLLEY_DISCHARGED');
  assert.strictEqual(sector.blackPowderSmokeDensityPct, 85.0);

  const eliminate = sector.eliminateVoyageurMusketeers(12);
  assert.strictEqual(eliminate.status, 'VOYAGEUR_MUSKETEERS_ELIMINATED');
  assert.strictEqual(sector.musketeersEliminated, 12);
  assert.strictEqual(eliminate.campNeutralized, true);
});

test('v190 Chantier LD 4: Prey1719ColdMudBogInfiltrationSector traps in bog, anchors tomahawk, and achieves 100% thermal invisibility', () => {
  const sector = new Prey1719ColdMudBogInfiltrationSector({ mudPitDepthM: 1.6 });

  const trap = sector.fallIntoQuicksandBog();
  assert.strictEqual(trap.status, 'TRAPPED_IN_QUICKSAND_MUD_BOG');
  assert.strictEqual(sector.quicksandSuctionActive, true);

  const escape = sector.anchorTomahawkAndEscapeBog(0.95);
  assert.strictEqual(escape.status, 'TETHERED_TOMAHAWK_ANCHORED_ESCAPE_ACHIEVED');
  assert.strictEqual(sector.mudExtractionSuccess, true);

  const mask = sector.applyColdMudThermalMask();
  assert.strictEqual(mask.status, 'COLD_MUD_THERMAL_MASK_APPLIED');
  assert.strictEqual(sector.coldMudThermalMaskActive, true);
  assert.strictEqual(sector.bodyTemperatureC, 13.5);
  assert.strictEqual(sector.thermalVisibilityPct, 0.0);
  assert.strictEqual(mask.infraredTrackingBlind, true);
});

test('v190 Chantier LD 5: Prey1719FeralCuticleShieldFlechetteSector deploys shield, parries musket ball, and fires guided bolt', () => {
  const sector = new Prey1719FeralCuticleShieldFlechetteSector({ shieldRadiusCm: 65.0 });

  const deploy = sector.deployCollapsibleCuticleShield();
  assert.strictEqual(deploy.status, 'COLLAPSIBLE_CUTICLE_SHIELD_DEPLOYED');
  assert.strictEqual(sector.shieldDeployed, true);

  const parry = sector.parryKineticProjectileWithShield(1400.0);
  assert.strictEqual(parry.status, 'PROJECTILE_DEFLECTED_BY_CUTICLE_SHIELD');
  assert.strictEqual(sector.musketBallDeflected, true);

  const laser = sector.activateBoneMaskTriLaser({ x: 22, y: 1.8, z: 30 });
  assert.strictEqual(laser.status, 'BONE_MASK_TRI_LASER_LOCKED');
  assert.strictEqual(sector.triLaserTrackingActive, true);

  const bolt = sector.fireGuidedFlechetteBolt();
  assert.strictEqual(bolt.status, 'GUIDED_FLECHETTE_BOLT_DISCHARGED');
  assert.strictEqual(sector.flechetteBoltFired, true);
  assert.strictEqual(sector.flechettesRemaining, 7);
});

test('v190 Chantier LD 6: Prey1719HorsebackBuffaloStampedeSector gallops circle, releases flint arrow, and triggers herd stampede', () => {
  const sector = new Prey1719HorsebackBuffaloStampedeSector({ horseGallopSpeedMps: 15.0 });

  const circle = sector.executeHorsebackCircleManeuver();
  assert.strictEqual(circle.status, 'COMANCHE_HORSEBACK_CIRCLE_MANEUVER_ACTIVE');
  assert.strictEqual(sector.gallopCircleManeuverActive, true);

  const arrow = sector.releaseHorsebackFlintArrow(0.95);
  assert.strictEqual(arrow.status, 'FLINT_ARROW_LODGED_IN_YAUTJA_FLESH');
  assert.strictEqual(sector.flintArrowHitsScored, 1);

  const stampede = sector.triggerBuffaloHerdStampede();
  assert.strictEqual(stampede.status, 'THUNDERING_BUFFALO_STAMPEDE_ENGULFED_ARENA');
  assert.strictEqual(sector.buffaloStampedeTriggered, true);
  assert.strictEqual(sector.feralPredatorStaggered, true);
});

test('v190 Chantier LD 7: Prey1719YautjaDefeatRitualProtocolSector strictly validates user rule 3 (dormant if alive or human, armed on Yautja defeat)', () => {
  const protocol = new Prey1719YautjaDefeatRitualProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'PREY_1719_COMANCHE_PLAINS' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 50, configuration: 'PREY_1719_COMANCHE_PLAINS' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Mauvaise arène -> inerte
  const arenaCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_FOREST' });
  assert.strictEqual(arenaCheck.armed, false);
  assert.strictEqual(arenaCheck.reason, 'INVALID_ARENA_CONFIGURATION');

  // Condition 4: Chasseur Yautja perd (HP <= 0) en arène Prey 1719 -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'PREY_1719_COMANCHE_PLAINS' });
  assert.strictEqual(defeatCheck.status, 'PREY_1719_YAUTJA_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.archaicSpringCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(11.0);
  assert.strictEqual(blast.status, 'PREY_1719_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v190 Chantier LD 8: HumanQaPrey1719MasterHUDDirector mounts 1719 HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaPrey1719MasterHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 8.5,
    activeGlyph: 'ᚑ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᚑ');
});

test('v190 Chantier LD 9: AudioSynthesizer computes roar & shield acoustics and executes 15 new v190 SFX methods', () => {
  const roarAcoustics = audioSynth.computeGrizzlyBearRoarAcoustics(800.0, 15.0);
  assert.ok(roarAcoustics.gutturalResonanceHz > 0);
  assert.ok(roarAcoustics.roarIntensityDb > 0);

  const shieldAcoustics = audioSynth.computeCuticleShieldExpansionAcoustics(12, 14.5);
  assert.ok(shieldAcoustics.metalFrictionChirpHz > 0);
  assert.ok(shieldAcoustics.deploymentTimeMs > 0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playRiverRapidsWaterChurnSFX',
    'playBeaverDamWoodCreakSFX',
    'playGrizzlyBearGutturalRoarSFX',
    'playFeralSingleHandLiftStirSFX',
    'playFeralHydraulicSkullPunchSFX',
    'playBearTrapSteelJawSnapSFX',
    'playFlintlockMusketBlackPowderBlastSFX',
    'playQuicksandViscousMudSuctionSFX',
    'playTomahawkRopeAnchorThudSFX',
    'playCuticleShieldFanDeploySFX',
    'playCuticleShieldBulletDeflectChimeSFX',
    'playBoneMaskTriLaserHomingChirpSFX',
    'playComancheHorseGallopRumbleSFX',
    'playBuffaloStampedeSeismicEarthquakeSFX',
    'playPrey1719ArchaicNuclearCleansingPurgeSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v190 Chantier LD 10: HumanQaPrey1719MasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaPrey1719MasterAuditor();
  const report = auditor.runFullPrey1719MasterAudit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
