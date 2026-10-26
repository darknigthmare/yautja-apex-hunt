import test from 'node:test';
import assert from 'node:assert/strict';

import { ThePredator2018MexicanCrashSniperSector } from '../src/gameplay/ThePredator2018MexicanCrashSniperSector.js';
import { ThePredator2018SurgicalBayBreakoutSector } from '../src/gameplay/ThePredator2018SurgicalBayBreakoutSector.js';
import { ThePredator2018HalonGasAirlockSector } from '../src/gameplay/ThePredator2018HalonGasAirlockSector.js';
import { ThePredator2018TransportBusConvoySector } from '../src/gameplay/ThePredator2018TransportBusConvoySector.js';
import { ThePredator2018HybridHoundPacificationSector } from '../src/gameplay/ThePredator2018HybridHoundPacificationSector.js';
import { ThePredator2018ShipForcefieldClimaxSector } from '../src/gameplay/ThePredator2018ShipForcefieldClimaxSector.js';
import { ThePredator2018YautjaDefeatGauntletProtocolSector } from '../src/gameplay/ThePredator2018YautjaDefeatGauntletProtocolSector.js';
import { HumanQaThePredator2018MasterHUDDirector } from '../src/gameplay/HumanQaThePredator2018MasterHUDDirector.js';
import { HumanQaThePredator2018MasterAuditor } from '../src/gameplay/HumanQaThePredator2018MasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v186 Chantier LD 1: ThePredator2018MexicanCrashSniperSector simulates pod crash, wrist gauntlet bullet deflection, and gear salvage', () => {
  const sector = new ThePredator2018MexicanCrashSniperSector({ podEntrySpeedMs: 180.0 });

  const crash = sector.triggerEscapePodCrash();
  assert.strictEqual(crash.status, 'ESCAPE_POD_CRASHED_INTO_JUNGLE');
  assert.strictEqual(sector.podCrashed, true);

  const emerge = sector.emergeFugitivePredator();
  assert.strictEqual(emerge.status, 'FUGITIVE_EMERGES_UNCLOAKED');
  assert.strictEqual(sector.fugitiveUncloaked, true);

  const shot = sector.fireSniperShotAtFugitive(7.62);
  assert.strictEqual(shot.status, 'SNIPER_ROUND_DEFLECTED_BY_WRIST_GAUNTLET');
  assert.strictEqual(sector.bulletDeflected, true);

  const salvage = sector.salvageFugitiveTechAndEvade();
  assert.strictEqual(salvage.status, 'TECH_SALVAGED_MCKENNA_EVADED');
  assert.strictEqual(sector.salvagedBioMask, true);
  assert.strictEqual(sector.salvagedGauntlet, true);
  assert.strictEqual(sector.mckennaEvadedIntoJungle, true);
});

test('v186 Chantier LD 2: ThePredator2018SurgicalBayBreakoutSector breaks sedation, snaps hydraulic clamps, spares Dr. Bracket, and shatters glass', () => {
  const sector = new ThePredator2018SurgicalBayBreakoutSector({ restraintTensileThresholdN: 3400.0 });

  const wake = sector.breakChemicalSedation();
  assert.strictEqual(wake.status, 'CHEMICAL_SEDATION_METABOLIZED');
  assert.strictEqual(sector.sedationActive, false);

  const snap = sector.snapSurgicalRestraints(4200.0);
  assert.strictEqual(snap.status, 'SURGICAL_RESTRAINTS_SNAPPED_EXPLOSIVELY');
  assert.strictEqual(sector.restraintsSnapped, true);

  const guards = sector.neutralizeOrderlies(4);
  assert.strictEqual(guards.status, 'ORDERLIES_NEUTRALIZED');
  assert.strictEqual(sector.drBracketSpared, true);

  const glass = sector.shatterObservationWindow();
  assert.strictEqual(glass.status, 'POLYCARBONATE_GLASS_SHATTERED');
  assert.strictEqual(sector.observationGlassShattered, true);
});

test('v186 Chantier LD 3: ThePredator2018HalonGasAirlockSector floods chamber with Halon gas and breaches blast door via backdraft blast', () => {
  const sector = new ThePredator2018HalonGasAirlockSector({ gasFloodPressureKpa: 450.0 });

  const flood = sector.updateAirlockAtmosphere(5.0);
  assert.strictEqual(flood.sealed, true);
  assert.ok(sector.chamberOxygenPct < 20.9);

  const cylinder = sector.grabOxygenCylinder();
  assert.strictEqual(cylinder.status, 'OXYGEN_CYLINDER_ACQUIRED');
  assert.strictEqual(sector.oxygenCylinderGrabbed, true);

  const blast = sector.detonateVentilationBackdraft();
  assert.strictEqual(blast.status, 'BACKDRAFT_EXPLOSION_BLAST_DOORS_BREACHED');
  assert.strictEqual(sector.backdraftDetonated, true);
  assert.strictEqual(sector.airlockBreached, true);
  assert.strictEqual(sector.airlockSealed, false);
});

test('v186 Chantier LD 4: ThePredator2018TransportBusConvoySector leaps onto 80 km/h bus roof, slashes sheet metal, and repels predator under fire', () => {
  const sector = new ThePredator2018TransportBusConvoySector({ convoySpeedKmh: 80.0 });

  const leap = sector.leapOntoBusRoof();
  assert.strictEqual(leap.status, 'PREDATOR_LANDED_ON_BUS_ROOF');
  assert.strictEqual(sector.predatorOnRoof, true);

  const slash = sector.slashRoofSheetMetal(250.0);
  assert.strictEqual(slash.status, 'BUS_ROOF_SEVERED_OPEN');
  assert.strictEqual(sector.roofSlashedOpen, true);

  const fire = sector.looniesUpwardSuppressingFire(80);
  assert.strictEqual(fire.status, 'PREDATOR_BLOWN_OFF_ROOF_BY_CONCENTRATED_VOLLEY');
  assert.strictEqual(sector.predatorKnockedOffRoof, true);
  assert.strictEqual(sector.convoyEscaped, true);
});

test('v186 Chantier LD 5: ThePredator2018HybridHoundPacificationSector charges baseball field, deflects bullets, and pacifies via neural soft spot', () => {
  const sector = new ThePredator2018HybridHoundPacificationSector({ houndSprintSpeedMs: 22.0 });

  const charge = sector.unleashHoundCharge();
  assert.strictEqual(charge.status, 'HYBRID_HOUND_SPRINTING_ACROSS_DIAMOND');
  assert.strictEqual(sector.houndCharging, true);

  const deflect = sector.deflectConventionalRounds(12);
  assert.strictEqual(deflect.status, 'ROUNDS_RICOCHETED_OFF_CHITIN_PLATE');
  assert.strictEqual(sector.roundsDeflectedCount, 12);

  const pacify = sector.targetNeuralSoftSpot(true);
  assert.strictEqual(pacify.status, 'NEURAL_SOFT_SPOT_PIERCED_HOUND_PACIFIED');
  assert.strictEqual(sector.houndPacified, true);
  assert.strictEqual(sector.houndCompanionLoyal, true);
});

test('v186 Chantier LD 6: ThePredator2018ShipForcefieldClimaxSector activates hull forcefield, executes Nebraska turbine sacrifice, and amputates titan', () => {
  const sector = new ThePredator2018ShipForcefieldClimaxSector({ shipAltitudeM: 1200.0 });

  const barrier = sector.activateHullForcefield();
  assert.strictEqual(barrier.status, 'HULL_FORCEFIELD_ENERGIZED');
  assert.strictEqual(sector.forcefieldActive, true);

  const sacrifice = sector.executeNebraskaTurbineSacrifice();
  assert.strictEqual(sacrifice.status, 'NEBRASKA_HEROIC_TURBINE_SACRIFICE_EXECUTED');
  assert.strictEqual(sector.nebraskaSacrificed, true);
  assert.strictEqual(sector.forcefieldActive, false);

  const dismember = sector.amputateUpgradeTitanLimbs();
  assert.strictEqual(dismember.status, 'UPGRADE_TITAN_DISMEMBERED_AND_EXECUTED');
  assert.strictEqual(sector.upgradeTitanDefeated, true);
});

test('v186 Chantier LD 7: ThePredator2018YautjaDefeatGauntletProtocolSector strictly enforces user rule 3 (dormant if alive/human, armed on Yautja defeat)', () => {
  const protocol = new ThePredator2018YautjaDefeatGauntletProtocolSector({ countdownDurationSeconds: 15.0 });

  // Condition 1: Joueur humain -> inerte
  const humanCheck = protocol.evaluateDefeatCondition({ isYautja: false, healthPoints: 0, configuration: 'THE_PREDATOR_2018_STARGAZER' });
  assert.strictEqual(humanCheck.armed, false);
  assert.strictEqual(humanCheck.reason, 'HUMAN_PLAYER_IMMUNE_TO_YAUTJA_PROTOCOL');

  // Condition 2: Chasseur Yautja en vie -> inerte
  const aliveCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 80, configuration: 'THE_PREDATOR_2018_STARGAZER' });
  assert.strictEqual(aliveCheck.armed, false);
  assert.strictEqual(aliveCheck.reason, 'YAUTJA_HUNTER_STILL_ALIVE');

  // Condition 3: Chasseur Yautja perd (HP <= 0) en arène Stargazer The Predator 2018 -> armement
  const defeatCheck = protocol.evaluateDefeatCondition({ isYautja: true, healthPoints: 0, configuration: 'THE_PREDATOR_2018_STARGAZER' });
  assert.strictEqual(defeatCheck.status, 'STARGAZER_YAUTJA_GAUNTLET_OVERLOAD_ARMED');
  assert.strictEqual(protocol.protocolArmed, true);
  assert.strictEqual(protocol.pneumaticCoverOpened, true);
  assert.strictEqual(protocol.laughterLoopEchoing, true);

  // Tick countdown
  const tick = protocol.updateCountdown(5.0);
  assert.strictEqual(tick.active, true);
  assert.ok(tick.remainingSeconds <= 10.0);

  // Cleansing blast
  const blast = protocol.updateCountdown(10.5);
  assert.strictEqual(blast.status, 'STARGAZER_MICRO_NUCLEAR_CLEANSING_BLAST');
  assert.strictEqual(protocol.cleansingBlastExecuted, true);
  assert.strictEqual(protocol.honorPreserved, true);
  assert.strictEqual(blast.honorScoreGranted, 500);
});

test('v186 Chantier LD 8: HumanQaThePredator2018MasterHUDDirector mounts Stargazer HUD panel and updates defeat critical alert', () => {
  const director = new HumanQaThePredator2018MasterHUDDirector();
  const summary = director.getAuditsSummary();

  assert.strictEqual(summary.allAuditsPassed, true);
  assert.strictEqual(summary.totalAudits, 5);

  const updated = director.updateDefeatWidget({
    protocolArmed: true,
    countdownTimerRemaining: 7.2,
    activeGlyph: 'ᛟ'
  });
  assert.strictEqual(updated.protocolArmed, true);
  assert.strictEqual(updated.activeGlyph, 'ᛟ');
});

test('v186 Chantier LD 9: AudioSynthesizer computes pod crash & chitin bullet bounce acoustics and executes 15 new v186 SFX methods', () => {
  const crashAcoustics = audioSynth.computeEscapePodCrashAtmosphericAcoustics(180.0, 14.0, 101.3);
  assert.ok(crashAcoustics.sonicBoomOverpressureKpa > 0);
  assert.ok(crashAcoustics.atmosphericDissipationDb > 0);

  const bounceAcoustics = audioSynth.computeUpgradeChitinBulletBounceAcoustics(3800.0, 42.0, 8.5);
  assert.ok(bounceAcoustics.ricochetPingFrequencyHz > 0);
  assert.ok(bounceAcoustics.audioClackDb > 0);

  // Verify that all 15 SFX methods execute cleanly
  const sfxList = [
    'playPodCanopyCrashRoarSFX',
    'playSniperBulletArmorRicochetSFX',
    'playSurgicalRestraintHydraulicSnapSFX',
    'playHalonGasVentHissSFX',
    'playTransportBusRoofSlashSFX',
    'playHybridHoundChargeRoarSFX',
    'playHoundCranialRicochetClackSFX',
    'playUpgradeTitanHeavyFootstepSFX',
    'playChitinArmorKineticBounceSFX',
    'playShipForcefieldEnergyHumSFX',
    'playTurbineEngineDisruptionBoomSFX',
    'playGauntletHologramLidPopSFX',
    'playCrimsonCountdownBeepCadenceSFX',
    'playDigitizedMockingLaughEchoSFX',
    'playMicroNuclearPlasmaCleansingBlastSFX'
  ];

  sfxList.forEach(sfxName => {
    assert.strictEqual(typeof audioSynth[sfxName], 'function', `Missing method: ${sfxName}`);
    assert.doesNotThrow(() => audioSynth[sfxName]());
  });
});

test('v186 Chantier LD 10: HumanQaThePredator2018MasterAuditor audits all 7 sectors, verifies strict defeat rule, and certifies WebGL invariant', () => {
  const auditor = new HumanQaThePredator2018MasterAuditor();
  const report = auditor.runFullThePredator2018Audit();

  assert.strictEqual(report.certified, true);
  assert.strictEqual(report.totalPassed, report.totalAudits);
  assert.ok(report.totalAudits >= 8);
});
