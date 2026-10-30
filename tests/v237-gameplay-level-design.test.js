import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987PonchoTreeFallTrapCounterSector } from '../src/gameplay/Predator1987PonchoTreeFallTrapCounterSector.js';
import { Predator21990AlleywayNetgunPinnedVictimSector } from '../src/gameplay/Predator21990AlleywayNetgunPinnedVictimSector.js';
import { Avp2004WhalingStationDecontaminationVatSector } from '../src/gameplay/Avp2004WhalingStationDecontaminationVatSector.js';
import { AvpRequiem2007PowerPlantSubstationElectrocutionSector } from '../src/gameplay/AvpRequiem2007PowerPlantSubstationElectrocutionSector.js';
import { Predators2010RiverRapidsWaterfallLeapSector } from '../src/gameplay/Predators2010RiverRapidsWaterfallLeapSector.js';
import { Prey2022MudCamouflageBogStandoffSector } from '../src/gameplay/Prey2022MudCamouflageBogStandoffSector.js';
import {
  PredatorFranchiseInegaleSupremeApexYautjaDefeatProtocolSector,
  INEGALE_SANCTUM_CONFIG_ID
} from '../src/gameplay/PredatorFranchiseInegaleSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseInegaleSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseInegaleSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseInegaleSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseInegaleSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v237 - Predator Franchise Inégalé Suprême Apex Pantheon (1987-2025)', () => {

  test('1. Predator (1987): log trap rigging, bird decoy whistle, canopy shimmer lock & counter-ambush (+350 Honor)', () => {
    const sector = new Predator1987PonchoTreeFallTrapCounterSector();
    assert.equal(sector.sectorId, 'SECTOR_1987_PONCHO_TREE_FALL_TRAP_COUNTER');

    const rig = sector.rigTreeFallCounterTrap(1200, 0.95);
    assert.equal(rig.status, 'TRAP_RIGGED');
    assert.equal(rig.cordTensionN, 1200);

    const decoy = sector.activateAcousticBirdDecoy(2400, 3);
    assert.equal(decoy.status, 'DECOY_TRANSMITTING');
    assert.equal(decoy.acousticDecoyDb, 42);

    const shimmer = sector.detectCanopyShimmer(0.40);
    assert.equal(shimmer.status, 'CANOPY_SHIMMER_ACQUIRED');
    assert.equal(shimmer.opticalDistortionDetected, true);

    const ambush = sector.releaseLogCounterAmbush();
    assert.equal(ambush.status, 'COUNTER_AMBUSH_EXECUTED');
    assert.ok(ambush.kineticImpactJoules > 50000);
    assert.equal(ambush.totalSectorHonor, 350);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('2. Predator 2 (1990): fire escape climb, netgun target lock, 4-anchor constriction & disarm (+400 Honor)', () => {
    const sector = new Predator21990AlleywayNetgunPinnedVictimSector();
    assert.equal(sector.sectorId, 'SECTOR_1990_ALLEYWAY_NETGUN_PINNED_VICTIM');

    const vantage = sector.ascendFireEscapeLadder(12.5);
    assert.equal(vantage.status, 'VANTAGE_OCCUPIED');

    const lock = sector.acquireAlleywayTarget('JAMAICAN_VOODOO_ENFORCER', 18.0);
    assert.equal(lock.status, 'NETGUN_TARGET_LOCKED');

    const net = sector.dischargeNetgun();
    assert.equal(net.status, 'NETGUN_DISCHARGED_PINNED');
    assert.equal(net.anchorsEmbedded, 4);
    assert.equal(net.constrictionPressureN, 1850);

    const finisher = sector.performMicroSerratedDisarmOrFinisher('CEREMONIAL_DISARM');
    assert.equal(finisher.status, 'NET_ENGAGEMENT_COMPLETED');
    assert.equal(finisher.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('3. AVP (2004): droppod descent, whaling boiler steam rupture, blizzard stalk & combi-stick pin (+400 Honor)', () => {
    const sector = new Avp2004WhalingStationDecontaminationVatSector();
    assert.equal(sector.sectorId, 'SECTOR_2004_WHALING_STATION_DECONTAMINATION_VAT');

    const landing = sector.confirmDroppodLanding('YOUNG_BLOOD_DESCENT_POD_BOUVET');
    assert.equal(landing.status, 'LANDING_CONFIRMED');
    assert.equal(landing.ambientTempC, -45.0);

    const steam = sector.ruptureWhaleOilBoilerSteamVent(180);
    assert.equal(steam.status, 'BOILER_STEAM_VENTED');
    assert.equal(steam.mercenaryThermalSensorsBlinded, true);

    const stalk = sector.stalkThroughFrozenRenderingTanks(0.96);
    assert.equal(stalk.status, 'BLUBBER_VATS_INFILTRATED');

    const impale = sector.hurlCeremonialCombiStickImpale(22.0);
    assert.equal(impale.status, 'COMBI_STICK_IMPALE_CONFIRMED');
    assert.equal(impale.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('4. AVP: Requiem (2007): substation infiltration, 115 kV insulators shattered, whip busbar pull & blackout (+400 Honor)', () => {
    const sector = new AvpRequiem2007PowerPlantSubstationElectrocutionSector();
    assert.equal(sector.sectorId, 'SECTOR_2007_POWER_PLANT_SUBSTATION_ELECTROCUTION');

    const infil = sector.infiltrateSubstationPerimeter(0.08);
    assert.equal(infil.status, 'SUBSTATION_PERIMETER_OCCUPIED');

    const arc = sector.shatterCeramicInsulatorsWithPlasma(2);
    assert.equal(arc.status, 'INSULATORS_SHATTERED_ARC_ACTIVE');
    assert.equal(arc.arcVoltageKv, 115.0);

    const whip = sector.executeTailWhipBusbarEntanglement('XENO_STALKER_DELTA');
    assert.equal(whip.status, 'WHIP_BUSBAR_ENTANGLEMENT_SUCCESSFUL');
    assert.equal(whip.electrocutionCurrentAmperes, 450);

    const blackout = sector.triggerRegionalGridBlackout();
    assert.equal(blackout.status, 'REGIONAL_BLACKOUT_CONFIRMED');
    assert.equal(blackout.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('5. Predators (2010) & The Predator (2018): precipice approach, 150m waterfall leap, cloak short-circuit & riverbed grapple (+450 Honor)', () => {
    const sector = new Predators2010RiverRapidsWaterfallLeapSector();
    assert.equal(sector.sectorId, 'SECTOR_2010_2018_RIVER_RAPIDS_WATERFALL_LEAP');

    const cliff = sector.approachPrecipiceUnderFire(30.0);
    assert.equal(cliff.status, 'PRECIPICE_REACHED');

    const leap = sector.executeWaterfallLeap();
    assert.equal(leap.status, 'WATERFALL_LEAP_SUCCESS');
    assert.ok(leap.terminalVelocityKmh > 100);

    const shortCircuit = sector.processWaterImmersionCloakShortCircuit();
    assert.equal(shortCircuit.status, 'CLOAK_IMMERSION_SHORT_CIRCUIT');
    assert.equal(shortCircuit.opticalCamouflageActive, false);

    const grapple = sector.resolveRiverbedRapidsGrapple(true);
    assert.equal(grapple.status, 'RAPIDS_COMBAT_VICTORY');
    assert.equal(grapple.totalSectorHonor, 450);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('6. Prey (2022) & Badlands (2025): orange medicinal mud thermal coating, Feral scan bypass, silent bow & Inégalé Sanctum (+500 Honor)', () => {
    const sector = new Prey2022MudCamouflageBogStandoffSector();
    assert.equal(sector.sectorId, 'SECTOR_2022_2025_MUD_CAMOUFLAGE_BOG_STANDOFF');

    const mud = sector.applyOrangeMedicinalMud(6.5);
    assert.equal(mud.status, 'MUD_THERMAL_COATING_APPLIED');
    assert.ok(mud.thermalDeltaCelsius <= 0.5);

    const evade = sector.evadeFeralInfraredScan(8.0);
    assert.equal(evade.status, 'FERAL_INFRARED_SCAN_EVADED');

    const bow = sector.drawAshTreeBowSilently(65);
    assert.equal(bow.status, 'ASH_BOW_DRAWN_SILENT');

    const sanctum = sector.executeLaserRedirectSanctumConsecration();
    assert.equal(sanctum.status, 'INEGALE_SANCTUM_CONSECRATED');
    assert.equal(sanctum.totalSectorHonor, 500);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const protocol = new PredatorFranchiseInegaleSupremeApexYautjaDefeatProtocolSector();
    assert.equal(protocol.targetArenaConfig, INEGALE_SANCTUM_CONFIG_ID);

    const truthTable = protocol.verifyTruthTable();
    assert.equal(truthTable.allPassed, true);
    assert.equal(truthTable.totalCases, 4);

    // Human defeated -> Reject
    const humanDefeat = protocol.triggerNuclearPurgeOnDefeat(false, 0, INEGALE_SANCTUM_CONFIG_ID);
    assert.equal(humanDefeat.status, 'PROTOCOL_REJECTED');

    // Yautja alive -> Reject
    const yautjaAlive = protocol.triggerNuclearPurgeOnDefeat(true, 50, INEGALE_SANCTUM_CONFIG_ID);
    assert.equal(yautjaAlive.status, 'PROTOCOL_REJECTED');

    // Yautja defeated wrong sanctum -> Reject
    const wrongSanctum = protocol.triggerNuclearPurgeOnDefeat(true, 0, 'OTHER_SANCTUM');
    assert.equal(wrongSanctum.status, 'PROTOCOL_REJECTED');

    // Yautja defeated EXACT sanctum -> Detonated
    const exactDetonation = protocol.triggerNuclearPurgeOnDefeat(true, 0, INEGALE_SANCTUM_CONFIG_ID);
    assert.equal(exactDetonation.status, 'NUCLEAR_PURGE_DETONATED');
    assert.equal(exactDetonation.rule3Compliant, true);
    assert.equal(exactDetonation.honorAwarded, 500);

    const snap = protocol.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const hud = new HumanQaPredatorFranchiseInegaleSupremeApexHUDDirector();
    const validation = hud.validateTelemetry();
    assert.equal(validation.directorId, 'HUD_DIRECTOR_INEGALE_SUPREME_APEX');
    assert.equal(validation.drawCallsWithinBudget, true);
    assert.equal(validation.playtesterCount, 8);

    const htmlOutput = hud.generateHtmlPanel(null);
    assert.ok(htmlOutput.includes('predator-franchise-v237-inegale-supreme-apex-hud-panel'));
  });

  test('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseInegaleSupremeApexMasterAuditor();
    const result = auditor.runFullPantheonAudit();

    assert.equal(result.version, 'v237');
    assert.equal(result.allSectorsCleared, true);
    assert.equal(result.rule3TruthTableVerified, true);
    assert.ok(result.totalHonorAwarded >= 3000);
    assert.equal(result.webglDrawCallBudget.compliant, true);
    assert.ok(result.webglDrawCallBudget.estimated <= 300);
  });

  test('10. AudioSynthesizer: Inégalé Suprême acoustic models & SFX synthesized', () => {
    const treeFallAcoustics = audioSynth.computeInegaleTreeFallAcoustics({ logMassKg: 850, cordTensionN: 1200 });
    assert.ok(treeFallAcoustics.trunkCrashBassHz > 50);
    assert.ok(treeFallAcoustics.cordSnapDecibels > 80);

    const substationAcoustics = audioSynth.computeInegaleSubstationAcoustics({ transformerVoltageKv: 115.0, rainMmH: 68.0 });
    assert.ok(substationAcoustics.arcCoronaHumHz > 100);
    assert.ok(substationAcoustics.rainConductanceDecibels > 70);

    // Validate that SFX methods exist and can be called safely without throw
    assert.doesNotThrow(() => audioSynth.playPredator1987InegalePonchoTreeFallCrashSFX());
    assert.doesNotThrow(() => audioSynth.playPredator1987InegaleAcousticBirdDecoySFX());
    assert.doesNotThrow(() => audioSynth.playPredator21990InegaleFireEscapeAscentSFX());
    assert.doesNotThrow(() => audioSynth.playPredator21990InegaleNetgunConstrictionWhirrSFX());
    assert.doesNotThrow(() => audioSynth.playAvp2004InegaleWhalingBoilerSteamVentSFX());
    assert.doesNotThrow(() => audioSynth.playAvp2004InegaleCombiStickRivetedImpaleSFX());
    assert.doesNotThrow(() => audioSynth.playAvpRequiem2007InegaleSubstationHighVoltageArcSFX());
    assert.doesNotThrow(() => audioSynth.playAvpRequiem2007InegaleWhipBusbarEntanglementSFX());
    assert.doesNotThrow(() => audioSynth.playPredators2010InegaleWaterfallRapidsImpactSFX());
    assert.doesNotThrow(() => audioSynth.playPredators2010InegaleCloakImmersionShortCircuitSFX());
    assert.doesNotThrow(() => audioSynth.playPrey2022InegaleMudThermalBogSplatterSFX());
    assert.doesNotThrow(() => audioSynth.playPrey2022InegaleAshBowSilentDrawSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseInegaleSanctumNuclearPurgeSFX());
  });

});
