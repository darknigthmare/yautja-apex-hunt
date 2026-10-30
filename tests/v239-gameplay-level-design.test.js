import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987DillonDualMp5AmbushCrossfireSector } from '../src/gameplay/Predator1987DillonDualMp5AmbushCrossfireSector.js';
import { Predator21990CityHallRoofStrobeLightningClashSector } from '../src/gameplay/Predator21990CityHallRoofStrobeLightningClashSector.js';
import { Avp2004HieroglyphicHologramHistoryLessonSector } from '../src/gameplay/Avp2004HieroglyphicHologramHistoryLessonSector.js';
import { AvpRequiem2007SportsStoreSurvivalSupplyStandoffSector } from '../src/gameplay/AvpRequiem2007SportsStoreSurvivalSupplyStandoffSector.js';
import { Predators2010HanzoKatanaGrassyFieldDuelSector } from '../src/gameplay/Predators2010HanzoKatanaGrassyFieldDuelSector.js';
import { Prey2022BeaverDamBearAmbushSector } from '../src/gameplay/Prey2022BeaverDamBearAmbushSector.js';
import {
  PredatorFranchiseEthereSupremeApexYautjaDefeatProtocolSector,
  ETHERE_SANCTUM_CONFIG_ID
} from '../src/gameplay/PredatorFranchiseEthereSupremeApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseEthereSupremeApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseEthereSupremeApexHUDDirector.js';
import { HumanQaPredatorFranchiseEthereSupremeApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseEthereSupremeApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v239 - Predator Franchise Éthéré Suprême Apex Pantheon (1987-2025)', () => {

  test('1. Predator (1987): clearing infiltration, dual-MP5 volley, shoulder tri-laser & severed arm reflex (+350 Honor)', () => {
    const sector = new Predator1987DillonDualMp5AmbushCrossfireSector();
    assert.equal(sector.sectorId, 'SECTOR_1987_DILLON_DUAL_MP5_AMBUSH_CROSSFIRE');

    const entry = sector.infiltrateJungleClearing();
    assert.equal(entry.status, 'CLEARING_OCCUPIED');

    const volley = sector.dischargeDualMp5SynchronizedCrossfire(2.25);
    assert.equal(volley.status, 'DUAL_MP5_CROSSFIRE_DISCHARGED');
    assert.equal(volley.cyclicRateCombinedRpm, 1600);

    const lock = sector.lockTriLaserOnShoulder(240);
    assert.equal(lock.status, 'SHOULDER_TRI_LASER_ACQUIRED');

    const reflex = sector.severArmAndTriggerReflexBurst();
    assert.equal(reflex.status, 'SEVERED_ARM_REFLEX_TRIGGERED');
    assert.equal(reflex.totalSectorHonor, 350);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('2. Predator 2 (1990): roof ascent, gargoyle ledge perch, combi-stick lightning channel & roar (+400 Honor)', () => {
    const sector = new Predator21990CityHallRoofStrobeLightningClashSector();
    assert.equal(sector.sectorId, 'SECTOR_1990_CITY_HALL_ROOF_STROBE_LIGHTNING_CLASH');

    const roof = sector.ascendRooftopPerimeter(240.0);
    assert.equal(roof.status, 'ROOFTOP_ASCENDED');

    const ledge = sector.anchorGargoyleLedgeVantage('Cast Architectural Granite');
    assert.equal(ledge.status, 'GARGOYLE_VANTAGE_ANCHORED');

    const lightning = sector.channelLightningThroughCombiStick();
    assert.equal(lightning.status, 'LIGHTNING_CHANNEL_ENGAGED');
    assert.equal(lightning.currentAmperes, 300000);

    const roar = sector.emitPrimevalSkywardRoar(115.0);
    assert.equal(roar.status, 'PRIMEVAL_ROAR_ECHOED');
    assert.equal(roar.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('3. AVP (2004): control chamber, base-8 calendar glyphs, 520nm emerald hologram & purge lore (+400 Honor)', () => {
    const sector = new Avp2004HieroglyphicHologramHistoryLessonSector();
    assert.equal(sector.sectorId, 'SECTOR_2004_HIEROGLYPHIC_HOLOGRAM_HISTORY_LESSON');

    const chamber = sector.enterPyramidControlChamber();
    assert.equal(chamber.status, 'CONTROL_CHAMBER_ENTERED');

    const calendar = sector.decryptBase8HieroglyphicCalendar('CHAC_ASTRONOMICAL_GLYPHS');
    assert.equal(calendar.status, 'CALENDAR_DECRYPTED');
    assert.equal(calendar.numeralBase, 8);

    const hologram = sector.activateEmeraldHolographicProjector();
    assert.equal(hologram.status, 'EMERALD_HOLOGRAM_PROJECTED');
    assert.equal(hologram.wavelengthNm, 520.0);

    const purge = sector.decodeAncientPyramidPurgeLore();
    assert.equal(purge.status, 'PURGE_LORE_DECODED');
    assert.equal(purge.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('4. AVP: Requiem (2007): sporting goods store breach, aisle ricochets, dual-plasma & razor whip sweep (+400 Honor)', () => {
    const sector = new AvpRequiem2007SportsStoreSurvivalSupplyStandoffSector();
    assert.equal(sector.sectorId, 'SECTOR_2007_SPORTS_STORE_SURVIVAL_SUPPLY_STANDOFF');

    const breach = sector.infiltrateSportsStoreSkylight();
    assert.equal(breach.status, 'STORE_INFILTRATED');

    const ricochet = sector.mapRetailAisleBallisticRicochets(12);
    assert.equal(ricochet.status, 'AISLE_RICOCHETS_MAPPED');

    const plasma = sector.dischargeDualPlasmacasterAisleVolley();
    assert.equal(plasma.status, 'DUAL_PLASMA_VOLLEY_DISCHARGED');
    assert.equal(plasma.dispersalAngleDeg, 35.0);

    const sweep = sector.executeRazorWhipAisleSweep(4.8);
    assert.equal(sweep.status, 'RAZOR_WHIP_AISLE_SWEEP_CONFIRMED');
    assert.equal(sweep.totalSectorHonor, 400);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('5. Predators (2010) & The Predator (2018): waving grass field duel, Falconer honor disarm & katana slash (+450 Honor)', () => {
    const sector = new Predators2010HanzoKatanaGrassyFieldDuelSector();
    assert.equal(sector.sectorId, 'SECTOR_2010_2018_HANZO_KATANA_GRASSY_FIELD_DUEL');

    const arena = sector.enterGrassyFieldArena(18.0);
    assert.equal(arena.status, 'GRASSY_FIELD_ENTERED');

    const disarm = sector.confirmFalconerHonorDisarm();
    assert.equal(disarm.status, 'FALCONER_HONOR_DISARMED');
    assert.equal(disarm.shoulderPlasmacasterDeactivated, true);

    const parry = sector.executeKatanaWristBladeParry(22.0);
    assert.equal(parry.status, 'KATANA_PARRY_ENGAGED');

    const slash = sector.resolveSimultaneousLethalCounterSlash();
    assert.equal(slash.status, 'SIMULTANEOUS_SLASH_RESOLVED');
    assert.equal(slash.totalSectorHonor, 450);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('6. Prey (2022) & Badlands (2025): beaver dam root hideout, grizzly ambush, 12,500J skull crush & Éthéré Sanctum (+500 Honor)', () => {
    const sector = new Prey2022BeaverDamBearAmbushSector();
    assert.equal(sector.sectorId, 'SECTOR_2022_2025_BEAVER_DAM_BEAR_AMBUSH');

    const hideout = sector.infiltrateBeaverDamRootMatrix(98.0);
    assert.equal(hideout.status, 'ROOT_MATRIX_OCCUPIED');

    const ambush = sector.triggerGrizzlyBearRiverAmbush(96.0);
    assert.equal(ambush.status, 'GRIZZLY_AMBUSH_TRIGGERED');
    assert.equal(ambush.massKg, 450.0);

    const emergence = sector.confirmFeralWaterEmergence();
    assert.equal(emergence.status, 'FERAL_WATER_EMERGENCE_CONFIRMED');

    const crush = sector.executeMegafaunaSingleArmLiftAndSkullCrush(12500);
    assert.equal(crush.status, 'ETHERE_SANCTUM_CONSECRATED');
    assert.equal(crush.totalSectorHonor, 500);

    const snap = sector.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('7. Rule 3 Yautja Defeat Protocol: 4-case exhaustive truth-table & nuclear purge execution (+500 Honor)', () => {
    const protocol = new PredatorFranchiseEthereSupremeApexYautjaDefeatProtocolSector();
    assert.equal(protocol.targetArenaConfig, ETHERE_SANCTUM_CONFIG_ID);

    const truthTable = protocol.verifyTruthTable();
    assert.equal(truthTable.allPassed, true);
    assert.equal(truthTable.totalCases, 4);

    // Human defeated -> Reject
    const humanDefeat = protocol.triggerNuclearPurgeOnDefeat(false, 0, ETHERE_SANCTUM_CONFIG_ID);
    assert.equal(humanDefeat.status, 'PROTOCOL_REJECTED');

    // Yautja alive -> Reject
    const yautjaAlive = protocol.triggerNuclearPurgeOnDefeat(true, 60, ETHERE_SANCTUM_CONFIG_ID);
    assert.equal(yautjaAlive.status, 'PROTOCOL_REJECTED');

    // Yautja defeated wrong sanctum -> Reject
    const wrongSanctum = protocol.triggerNuclearPurgeOnDefeat(true, 0, 'NON_ETHERE_SANCTUM');
    assert.equal(wrongSanctum.status, 'PROTOCOL_REJECTED');

    // Yautja defeated EXACT sanctum -> Detonated
    const exactDetonation = protocol.triggerNuclearPurgeOnDefeat(true, 0, ETHERE_SANCTUM_CONFIG_ID);
    assert.equal(exactDetonation.status, 'NUCLEAR_PURGE_DETONATED');
    assert.equal(exactDetonation.rule3Compliant, true);
    assert.equal(exactDetonation.honorAwarded, 500);

    const snap = protocol.getSnapshot();
    assert.equal(snap.cleared, true);
  });

  test('8. HUD Director: DOM telemetry snapshot, playtester roster & rendering validation', () => {
    const hud = new HumanQaPredatorFranchiseEthereSupremeApexHUDDirector();
    const validation = hud.validateTelemetry();
    assert.equal(validation.directorId, 'HUD_DIRECTOR_ETHERE_SUPREME_APEX');
    assert.equal(validation.drawCallsWithinBudget, true);
    assert.equal(validation.playtesterCount, 8);

    const htmlOutput = hud.generateHtmlPanel(null);
    assert.ok(htmlOutput.includes('predator-franchise-v239-ethere-supreme-apex-hud-panel'));
  });

  test('9. Master Auditor: full 7-sector audit, Rule 3 compliance & WebGL budget (<= 300 draw calls)', () => {
    const auditor = new HumanQaPredatorFranchiseEthereSupremeApexMasterAuditor();
    const result = auditor.runFullPantheonAudit();

    assert.equal(result.version, 'v239');
    assert.equal(result.allSectorsCleared, true);
    assert.equal(result.rule3TruthTableVerified, true);
    assert.ok(result.totalHonorAwarded >= 3000);
    assert.equal(result.webglDrawCallBudget.compliant, true);
    assert.ok(result.webglDrawCallBudget.estimated <= 300);
  });

  test('10. AudioSynthesizer: Éthéré Suprême acoustic models & SFX synthesized', () => {
    const mp5Acoustics = audioSynth.computeEthereDualMp5Acoustics({ roundsDischarged: 60, cyclicRateCombinedRpm: 1600 });
    assert.ok(mp5Acoustics.muzzleBurstStrobeHz > 20);
    assert.ok(mp5Acoustics.canopyEchoDecibels > 80);

    const bearAcoustics = audioSynth.computeEthereBearGrappleAcoustics({ bearMassKg: 450.0, riverVelocityMs: 3.2 });
    assert.ok(bearAcoustics.megafaunaRoarBassHz > 70);
    assert.ok(bearAcoustics.riverSplashDecibels > 70);

    // Validate that SFX methods exist and can be called safely without throw
    assert.doesNotThrow(() => audioSynth.playPredator1987EthereDualMp5BurstSFX());
    assert.doesNotThrow(() => audioSynth.playPredator1987EthereSeveredArmReflexBurstSFX());
    assert.doesNotThrow(() => audioSynth.playPredator21990EthereRoofLightningChannelSFX());
    assert.doesNotThrow(() => audioSynth.playPredator21990EthereCityHallGargoyleRoarSFX());
    assert.doesNotThrow(() => audioSynth.playAvp2004EthereHologramProjectionHumSFX());
    assert.doesNotThrow(() => audioSynth.playAvp2004EthereStarChartGlyphAlignmentSFX());
    assert.doesNotThrow(() => audioSynth.playAvpRequiem2007EthereGunStoreAisleSweepSFX());
    assert.doesNotThrow(() => audioSynth.playAvpRequiem2007EthereDualPlasmacasterRackCleaveSFX());
    assert.doesNotThrow(() => audioSynth.playPredators2010EthereKatanaWristBladeClashSFX());
    assert.doesNotThrow(() => audioSynth.playPredators2010EthereFalconerHonorDisarmSFX());
    assert.doesNotThrow(() => audioSynth.playPrey2022EthereBeaverDamRootCreakSFX());
    assert.doesNotThrow(() => audioSynth.playPrey2022EthereBearGrappleSkullCrushSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseEthereSanctumNuclearPurgeSFX());
  });

});
