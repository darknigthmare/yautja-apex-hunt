import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987BlainChewingTobaccoMiniGunStandoffSector } from '../src/gameplay/Predator1987BlainChewingTobaccoMiniGunStandoffSector.js';
import { Predator21990PenthouseScorpioRitualVoodooSector } from '../src/gameplay/Predator21990PenthouseScorpioRitualVoodooSector.js';
import { Avp2004SacrificialChamberFacehuggerSwarmSector } from '../src/gameplay/Avp2004SacrificialChamberFacehuggerSwarmSector.js';
import { AvpRequiem2007HospitalMaternityPredalienInfestationSector } from '../src/gameplay/AvpRequiem2007HospitalMaternityPredalienInfestationSector.js';
import { Predators2010AncientMonolithPredatorCampSector } from '../src/gameplay/Predators2010AncientMonolithPredatorCampSector.js';
import { Prey2022FrenchTrappersCampTreeCageSector } from '../src/gameplay/Prey2022FrenchTrappersCampTreeCageSector.js';
import {
  PredatorFranchiseMythiqueSupremeApexYautjaDefeatProtocolSector,
  MYTHIQUE_SANCTUM_CONFIG_ID
} from '../src/gameplay/PredatorFranchiseMythiqueSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseMythiqueSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseMythiqueSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseMythiqueSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseMythiqueSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v238 - Predator Franchise Mythique Suprême Apex Pantheon (1987-2025)', () => {

  test('1. Predator (1987): canopy sentry post, tobacco cadence, tri-laser chest lock & armor perforation (+350 Honor)', () => {
    const sector = new Predator1987BlainChewingTobaccoMiniGunStandoffSector();
    assert.equal(sector.sectorId, 'SECTOR_1987_BLAIN_CHEWING_TOBACCO_MINIGUN_STANDOFF');

    const sentry = sector.occupyCanopySentryPost(88);
    assert.equal(sentry.status, 'SENTRY_POST_OCCUPIED');

    const cadence = sector.logAcousticDisciplineCadence(4.5);
    assert.equal(cadence.status, 'CADENCE_ESTABLISHED');

    const lock = sector.acquireTriLaserChestLock(280);
    assert.equal(lock.status, 'TRI_LASER_LOCK_ACQUIRED');
    assert.equal(lock.reactionWindowMs, 280);

    const blast = sector.executePlasmacasterPerforation();
    assert.equal(blast.status, 'CHEST_ARMOR_PERFORATED');
    assert.ok(blast.impactEnergyJoules >= 18000);
    assert.equal(blast.totalSectorHonor, 350);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('2. Predator 2 (1990): penthouse skylight shatter, inverted rafter grip, smoke thermal filter & bank shot (+400 Honor)', () => {
    const sector = new Predator21990PenthouseScorpioRitualVoodooSector();
    assert.equal(sector.sectorId, 'SECTOR_1990_PENTHOUSE_SCORPIO_RITUAL_VOODOO');

    const breach = sector.breachSkylightTemperedGlass(4200);
    assert.equal(breach.status, 'SKYLIGHT_BREACHED');

    const rafter = sector.engageInvertedRafterSuspension();
    assert.equal(rafter.status, 'RAFTER_SUSPENSION_LOCKED');

    const filter = sector.activateThermalIncenseSmokeFilter('INFRARED_SMOKE_SUBTRACTION');
    assert.equal(filter.status, 'THERMAL_SMOKE_FILTER_ENGAGED');
    assert.equal(filter.unarmedSacrificeSparedHonorably, true);

    const bankShot = sector.executeSmartDiscPillarBankShot(45.0);
    assert.equal(bankShot.status, 'SMART_DISC_BANK_SHOT_COMPLETED');
    assert.equal(bankShot.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('3. AVP (2004): sacrificial chamber slabs, ovomorph acoustic pulse, mid-air shuriken sever & acid shield (+400 Honor)', () => {
    const sector = new Avp2004SacrificialChamberFacehuggerSwarmSector();
    assert.equal(sector.sectorId, 'SECTOR_2004_SACRIFICIAL_CHAMBER_FACEHUGGER_SWARM');

    const entry = sector.enterSacrificialChamberSlabs();
    assert.equal(entry.status, 'CHAMBER_ENTERED');
    assert.equal(entry.depthMeters, 700.0);

    const pulse = sector.detectOvomorphEggPulse(180.0);
    assert.equal(pulse.status, 'OVOMORPH_PULSE_DETECTED');

    const cleave = sector.interceptLeapingFacehuggersWithShuriken(6);
    assert.equal(cleave.status, 'SHURIKEN_INTERCEPTION_CONFIRMED');
    assert.equal(cleave.shurikenBlades, 6);

    const shield = sector.deflectAcidSplashWithGauntletShield();
    assert.equal(shield.status, 'ACID_SPLASH_SHIELD_DEFLECTED');
    assert.equal(shield.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('4. AVP: Requiem (2007): vent breach, tiled corridor slime tracking, laser tripmines & blue dissolving liquid (+400 Honor)', () => {
    const sector = new AvpRequiem2007HospitalMaternityPredalienInfestationSector();
    assert.equal(sector.sectorId, 'SECTOR_2007_HOSPITAL_MATERNITY_PREDALIEN_INFESTATION');

    const vent = sector.breachVentilationShaftGrid(1.8);
    assert.equal(vent.status, 'VENTILATION_BREACH_CONFIRMED');

    const slime = sector.trackAcidicSlimeAcrossTiledCorridor(532.0);
    assert.equal(slime.status, 'ACIDIC_SLIME_TRACKED');

    const mines = sector.armDoubleDoorLaserTripmines(2);
    assert.equal(mines.status, 'LASER_TRIPMINES_ARMED');

    const dissolve = sector.applyBlueDissolvingLiquidVials();
    assert.equal(dissolve.status, 'BIOHAZARD_DISSOLVED_QUARANTINED');
    assert.equal(dissolve.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('5. Predators (2010) & The Predator (2018): totem camp recon, crucified classic Yautja, plasma severance & covenant (+450 Honor)', () => {
    const sector = new Predators2010AncientMonolithPredatorCampSector();
    assert.equal(sector.sectorId, 'SECTOR_2010_2018_ANCIENT_MONOLITH_PREDATOR_CAMP');

    const camp = sector.scoutHuntingCampPerimeter(6);
    assert.equal(camp.status, 'HUNTING_CAMP_DISCOVERED');

    const captive = sector.locateCrucifiedClassicYautja(38.0);
    assert.equal(captive.status, 'CRUCIFIED_YAUTJA_LOCATED');

    const severance = sector.severTitaniumRestraintsWithPlasma(220);
    assert.equal(severance.status, 'TITANIUM_RESTRAINTS_SEVERED');

    const covenant = sector.establishHonorCovenantAndArmPlasma(1);
    assert.equal(covenant.status, 'HONOR_COVENANT_SEALED');
    assert.equal(covenant.totalSectorHonor, 450);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('6. Prey (2022) & Badlands (2025): tree pole cage, rawhide severance with bone knife, smoke infiltration & Mythique Sanctum (+500 Honor)', () => {
    const sector = new Prey2022FrenchTrappersCampTreeCageSector();
    assert.equal(sector.sectorId, 'SECTOR_2022_2025_FRENCH_TRAPPERS_CAMP_TREE_CAGE');

    const cage = sector.assessTreePoleCageImprisonment(2.8);
    assert.equal(cage.status, 'CAGE_ASSESSED');

    const knife = sector.severRawhideBindingsWithBoneKnife('Beaver Tooth & Deer Antler');
    assert.equal(knife.status, 'RAW_HIDE_SEVERED');

    const smoke = sector.infiltrateCampUnderSmokeScreen(0.85);
    assert.equal(smoke.status, 'SMOKE_SCREEN_INFILTRATED');

    const clash = sector.executeFeralShieldClashSanctumConsecration(3200);
    assert.equal(clash.status, 'MYTHIQUE_SANCTUM_CONSECRATED');
    assert.equal(clash.totalSectorHonor, 500);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const protocol = new PredatorFranchiseMythiqueSupremeApexYautjaDefeatProtocolSector();
    assert.equal(protocol.targetArenaConfig, MYTHIQUE_SANCTUM_CONFIG_ID);

    const truthTable = protocol.verifyTruthTable();
    assert.equal(truthTable.allPassed, true);
    assert.equal(truthTable.totalCases, 4);

    // Human defeated -> Reject
    const humanDefeat = protocol.triggerNuclearPurgeOnDefeat(false, 0, MYTHIQUE_SANCTUM_CONFIG_ID);
    assert.equal(humanDefeat.status, 'PROTOCOL_REJECTED');

    // Yautja alive -> Reject
    const yautjaAlive = protocol.triggerNuclearPurgeOnDefeat(true, 40, MYTHIQUE_SANCTUM_CONFIG_ID);
    assert.equal(yautjaAlive.status, 'PROTOCOL_REJECTED');

    // Yautja defeated wrong sanctum -> Reject
    const wrongSanctum = protocol.triggerNuclearPurgeOnDefeat(true, 0, 'DIFFERENT_SANCTUM');
    assert.equal(wrongSanctum.status, 'PROTOCOL_REJECTED');

    // Yautja defeated EXACT sanctum -> Detonated
    const exactDetonation = protocol.triggerNuclearPurgeOnDefeat(true, 0, MYTHIQUE_SANCTUM_CONFIG_ID);
    assert.equal(exactDetonation.status, 'NUCLEAR_PURGE_DETONATED');
    assert.equal(exactDetonation.rule3Compliant, true);
    assert.equal(exactDetonation.honorAwarded, 500);

    const snap = protocol.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const hud = new HumanQaPredatorFranchiseMythiqueSupremeApexHUDDirector();
    const validation = hud.validateTelemetry();
    assert.equal(validation.directorId, 'HUD_DIRECTOR_MYTHIQUE_SUPREME_APEX');
    assert.equal(validation.drawCallsWithinBudget, true);
    assert.equal(validation.playtesterCount, 8);

    const htmlOutput = hud.generateHtmlPanel(null);
    assert.ok(htmlOutput.includes('predator-franchise-v238-mythique-supreme-apex-hud-panel'));
  });

  test('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseMythiqueSupremeApexMasterAuditor();
    const result = auditor.runFullPantheonAudit();

    assert.equal(result.version, 'v238');
    assert.equal(result.allSectorsCleared, true);
    assert.equal(result.rule3TruthTableVerified, true);
    assert.ok(result.totalHonorAwarded >= 3000);
    assert.equal(result.webglDrawCallBudget.compliant, true);
    assert.ok(result.webglDrawCallBudget.estimated <= 300);
  });

  test('10. AudioSynthesizer: Mythique Suprême acoustic models & SFX synthesized', () => {
    const blainAcoustics = audioSynth.computeMythiqueBlainMinigunAcoustics({ ammoRounds: 4000, fireRateRpm: 6000 });
    assert.ok(blainAcoustics.motorSpoolHz > 100);
    assert.ok(blainAcoustics.barrelWhineDecibels > 80);

    const chamberAcoustics = audioSynth.computeMythiqueSacrificialChamberAcoustics({ depthMeters: 700.0, eggCount: 8 });
    assert.ok(chamberAcoustics.chamberReverbDecaySeconds > 3.0);
    assert.ok(chamberAcoustics.ovomorphPulseWetHz > 150);

    // Validate that SFX methods exist and can be called safely without throw
    assert.doesNotThrow(() => audioSynth.playPredator1987MythiqueBlainTriLaserLockSFX());
    assert.doesNotThrow(() => audioSynth.playPredator1987MythiqueChestArmorPerforationSFX());
    assert.doesNotThrow(() => audioSynth.playPredator21990MythiquePenthouseSkylightShatterSFX());
    assert.doesNotThrow(() => audioSynth.playPredator21990MythiqueRafterDropSpearThrustSFX());
    assert.doesNotThrow(() => audioSynth.playAvp2004MythiqueOvomorphEggPulseSFX());
    assert.doesNotThrow(() => audioSynth.playAvp2004MythiqueFacehuggerLeapInterceptSFX());
    assert.doesNotThrow(() => audioSynth.playAvpRequiem2007MythiqueMaternitySlimeDissolveSFX());
    assert.doesNotThrow(() => audioSynth.playAvpRequiem2007MythiqueDoubleDoorLaserTripwireSFX());
    assert.doesNotThrow(() => audioSynth.playPredators2010MythiqueMonolithRestraintSeveranceSFX());
    assert.doesNotThrow(() => audioSynth.playPredators2010MythiqueClassicYautjaCovenantRoarSFX());
    assert.doesNotThrow(() => audioSynth.playPrey2022MythiqueCageRawhideSeveranceSFX());
    assert.doesNotThrow(() => audioSynth.playPrey2022MythiqueCampfireShieldDeflectionSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseMythiqueSanctumNuclearPurgeSFX());
  });

});
