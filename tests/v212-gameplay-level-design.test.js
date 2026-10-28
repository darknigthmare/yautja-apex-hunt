import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987GuerrillaCampNightAmbushAndLogSpikeTrapSector } from '../src/gameplay/Predator1987GuerrillaCampNightAmbushAndLogSpikeTrapSector.js';
import { Predator21990AlleywayNetShredAndUndergroundTrainRumbleSector } from '../src/gameplay/Predator21990AlleywayNetShredAndUndergroundTrainRumbleSector.js';
import { Avp2004PyramidThermalGeneratorCoreAndQueenRageSector } from '../src/gameplay/Avp2004PyramidThermalGeneratorCoreAndQueenRageSector.js';
import { AvpRequiem2007PowerPlantCoolingTowerAndDualPistolOverdriveSector } from '../src/gameplay/AvpRequiem2007PowerPlantCoolingTowerAndDualPistolOverdriveSector.js';
import { Predators2010AncientPredatorShipHangarAndNanotechArmorSector } from '../src/gameplay/Predators2010AncientPredatorShipHangarAndNanotechArmorSector.js';
import { Prey2022FrenchFortInfiltrationAndMillenaryApexSanctumSector } from '../src/gameplay/Prey2022FrenchFortInfiltrationAndMillenaryApexSanctumSector.js';
import { PredatorFranchiseMillenaryApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseMillenaryApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseMillenaryApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseMillenaryApexHUDDirector.js';
import { HumanQaPredatorFranchiseMillenaryApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseMillenaryApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v212 - Predator Franchise Millenary Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): guerrilla camp infiltration, punji log spike trap, canopy claymores & riverbank shoulder charge (+350 Honor)', () => {
    const sector = new Predator1987GuerrillaCampNightAmbushAndLogSpikeTrapSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_GUERRILLA_CAMP_NIGHT_AMBUSH_AND_LOG_SPIKE_TRAP');

    const smokeRes = sector.infiltrateGuerrillaCampCompoundUnderThermalSmoke({
      smokeGrenadesDeployed: 4,
      thermalConcealmentRatio: 0.94
    });
    assert.equal(smokeRes.guerrillaCampInfiltrated, true);

    const spikeRes = sector.sharpenHardwoodSpikesForPunjiLogPitTrap({
      spikeCount: 12,
      timberHardnessMpa: 65
    });
    assert.equal(spikeRes.punjiLogSpikeTrapCrafted, true);

    const claymoreRes = sector.detonateClaymoresInCanopyPincerCrossfire({
      claymoresArmed: 6,
      canopyDefoliationPercent: 78
    });
    assert.equal(claymoreRes.canopyClaymoresDetonated, true);

    const chargeRes = sector.surviveJungleHunterShoulderChargeInWater({
      counterSlashJoules: 2400,
      waterExtinguishPlasma: true
    });
    assert.equal(chargeRes.jungleHunterChargeSurvied, true);
    assert.equal(chargeRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.jungleHunterChargeSurvied, true);
  });

  it('2. Predator 2 (1990): South Central alleyway rain, diamond mesh blade shred, subway maintenance shaft & Lost Tribe sentinels (+400 Honor)', () => {
    const sector = new Predator21990AlleywayNetShredAndUndergroundTrainRumbleSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_ALLEYWAY_NET_SHRED_AND_UNDERGROUND_TRAIN_RUMBLE');

    const rainRes = sector.navigateRainDrenchedSouthCentralAlleyways({
      rainIntensityMmHr: 45,
      thermalRefractionActive: true
    });
    assert.equal(rainRes.alleywaysNavigated, true);

    const netRes = sector.shredCaptureNetMeshWithDiamondCombatBlade({
      cuttingForceNewtons: 850,
      netMeshConstrictionMm: 12
    });
    assert.equal(netRes.captureNetMeshShredded, true);

    const subwayRes = sector.trackCityHunterIntoSubwayMaintenanceShaft({
      rumbleDecibels: 104,
      electricalArcDetected: true
    });
    assert.equal(subwayRes.subwayMaintenanceShaftTracked, true);

    const sentinelRes = sector.interceptLostTribeShadowSentinels({
      vantageHeightMeters: 18,
      cloakedSentinelsCount: 3
    });
    assert.equal(sentinelRes.lostTribeSentinelsIntercepted, true);
    assert.equal(sentinelRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.lostTribeSentinelsIntercepted, true);
  });

  it('3. AVP (2004): geothermal generator core, plasma caster swarm defense, whaling pier steel winch cables & steam vent purge (+400 Honor)', () => {
    const sector = new Avp2004PyramidThermalGeneratorCoreAndQueenRageSector();
    assert.equal(sector.sectorId, 'AVP_2004_PYRAMID_THERMAL_GENERATOR_CORE_AND_QUEEN_RAGE');

    const coreRes = sector.reachAncientSubterraneanThermalGeneratorCore({
      geothermalTempCelsius: 380,
      shiftMechanismCycles: 8
    });
    assert.equal(coreRes.thermalGeneratorCoreReached, true);

    const swarmRes = sector.defendLexAgainstXenomorphSwarmWithPlasmaCaster({
      plasmaBlastCount: 14,
      dronesIncineratedCount: 9
    });
    assert.equal(swarmRes.lexDefendedAgainstSwarm, true);

    const anchorRes = sector.anchorQueenTailWithSteelCablesOnWhalingPier({
      cableTensileStrMpa: 1250,
      winchTensionKn: 450
    });
    assert.equal(anchorRes.queenTailAnchoredOnPier, true);

    const ventRes = sector.triggerSteamVentPurgeToBlisterQueenCarapace({
      steamPressurePsi: 2200,
      carapaceThermalShockPercent: 88
    });
    assert.equal(ventRes.steamVentPurgeTriggered, true);
    assert.equal(ventRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): cooling tower storm climb, plasma pistol overdrive, catwalk Predalien duel & transformer bio purge (+400 Honor)', () => {
    const sector = new AvpRequiem2007PowerPlantCoolingTowerAndDualPistolOverdriveSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_POWER_PLANT_COOLING_TOWER_AND_DUAL_PISTOL_OVERDRIVE');

    const stormRes = sector.ascendGunnisonCoolingTowerInTorrentialThunderstorm({
      stormWindKnots: 55,
      lightningFlashCount: 12
    });
    assert.equal(stormRes.coolingTowerAscendedInStorm, true);

    const overdriveRes = sector.overdriveHandheldPlasmaPistolForWideAngleBlast({
      plasmaOverchargeJoules: 9800,
      beamSpreadDegrees: 65
    });
    assert.equal(overdriveRes.handheldPlasmaPistolOverdriven, true);

    const duelRes = sector.engagePredalienInCoolingTowerCatwalkDuel({
      parryClashCount: 7,
      innerJawDeflected: true
    });
    assert.equal(duelRes.coolingTowerCatwalkDuelWon, true);

    const bioRes = sector.deployDissolvingLiquidOnTransformerRuins({
      acidVialsPouredCount: 4,
      bioContagionNeutralized: true
    });
    assert.equal(bioRes.transformerRuinsBioNeutralized, true);
    assert.equal(bioRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): underground ship hangar, sonic mine defusal, Stargazer nanotech pod & tritium gauntlet beam (+450 Honor)', () => {
    const sector = new Predators2010AncientPredatorShipHangarAndNanotechArmorSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_ANCIENT_PREDATOR_SHIP_HANGAR_AND_NANOTECH_ARMOR');

    const hangarRes = sector.discoverUndergroundPreserveShipHangarRuins({
      hangarDepthMeters: 85,
      ancientYautjaCruiserFound: true
    });
    assert.equal(hangarRes.undergroundShipHangarDiscovered, true);

    const mineRes = sector.disarmBerserkerProximitySonicMinesInJungle({
      sonicFrequencyKHz: 38,
      minesDisarmedCount: 5
    });
    assert.equal(mineRes.berserkerSonicMinesDisarmed, true);

    const podRes = sector.interfaceWithStargazerNanotechPredatorKillerPod({
      biometricGloveEngaged: true,
      nanotechSuitSynchronized: true
    });
    assert.equal(podRes.stargazerKillerPodSynchronized, true);

    const beamRes = sector.dischargeWristGauntletTritiumBeam({
      tritiumBeamJoules: 28000,
      armorPiercingConfirmed: true
    });
    assert.equal(beamRes.wristGauntletTritiumBeamDischarged, true);
    assert.equal(beamRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): voyageur fort infiltration, feral shield sever, obsidian pinnacle ascent with Thia & Bud & Millenary Sanctum (+500 Honor)', () => {
    const sector = new Prey2022FrenchFortInfiltrationAndMillenaryApexSanctumSector();
    assert.equal(sector.sectorId, 'PREY_2022_FRENCH_FORT_INFILTRATION_AND_MILLENARY_APEX_SANCTUM');

    const fortRes = sector.infiltrateStockadeFrenchVoyageurFortification({
      stockadeHeightMeters: 4.2,
      perimeterTorchesAvoided: true
    });
    assert.equal(fortRes.frenchVoyageurFortInfiltrated, true);

    const shieldRes = sector.severFeralPredatorShieldMechanismsWithTomahawk({
      cutDepthMm: 35,
      shieldLockSevered: true
    });
    assert.equal(shieldRes.feralShieldMechanismsSevered, true);

    const ascentRes = sector.ascendMillenaryObsidianPinnacleWithThiaAndBud({
      pinnacleElevationMeters: 4200,
      syntheticTwinCompanionsUnited: true
    });
    assert.equal(ascentRes.millenaryObsidianPinnacleAscended, true);

    const sanctumRes = sector.consecrateMillenaryApexSanctumUnifyingAllNineFilms({
      millenarySanctumConsecrated: true,
      nineFilmsUnified: true
    });
    assert.equal(sanctumRes.millenaryApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Millenary Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseMillenaryApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateMillenaryApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_MILLENARY_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚌ', 'ᚓ', 'ᚏ', '᚜']);
    assert.equal(c1.roarDecibels, 122);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.millenaryApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateMillenaryApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_MILLENARY_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateMillenaryApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_MILLENARY_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateMillenaryApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Millenary Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const camp = new Predator1987GuerrillaCampNightAmbushAndLogSpikeTrapSector();
    camp.infiltrateGuerrillaCampCompoundUnderThermalSmoke();
    camp.sharpenHardwoodSpikesForPunjiLogPitTrap();
    camp.detonateClaymoresInCanopyPincerCrossfire();
    camp.surviveJungleHunterShoulderChargeInWater();

    const alley = new Predator21990AlleywayNetShredAndUndergroundTrainRumbleSector();
    alley.navigateRainDrenchedSouthCentralAlleyways();
    alley.shredCaptureNetMeshWithDiamondCombatBlade();
    alley.trackCityHunterIntoSubwayMaintenanceShaft();
    alley.interceptLostTribeShadowSentinels();

    const thermal = new Avp2004PyramidThermalGeneratorCoreAndQueenRageSector();
    thermal.reachAncientSubterraneanThermalGeneratorCore();
    thermal.defendLexAgainstXenomorphSwarmWithPlasmaCaster();
    thermal.anchorQueenTailWithSteelCablesOnWhalingPier();
    thermal.triggerSteamVentPurgeToBlisterQueenCarapace();

    const cooling = new AvpRequiem2007PowerPlantCoolingTowerAndDualPistolOverdriveSector();
    cooling.ascendGunnisonCoolingTowerInTorrentialThunderstorm();
    cooling.overdriveHandheldPlasmaPistolForWideAngleBlast();
    cooling.engagePredalienInCoolingTowerCatwalkDuel();
    cooling.deployDissolvingLiquidOnTransformerRuins();

    const hangar = new Predators2010AncientPredatorShipHangarAndNanotechArmorSector();
    hangar.discoverUndergroundPreserveShipHangarRuins();
    hangar.disarmBerserkerProximitySonicMinesInJungle();
    hangar.interfaceWithStargazerNanotechPredatorKillerPod();
    hangar.dischargeWristGauntletTritiumBeam();

    const fort = new Prey2022FrenchFortInfiltrationAndMillenaryApexSanctumSector();
    fort.infiltrateStockadeFrenchVoyageurFortification();
    fort.severFeralPredatorShieldMechanismsWithTomahawk();
    fort.ascendMillenaryObsidianPinnacleWithThiaAndBud();
    fort.consecrateMillenaryApexSanctumUnifyingAllNineFilms();

    const defeatProtocol = new PredatorFranchiseMillenaryApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateMillenaryApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_MILLENARY_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseMillenaryApexHUDDirector();
    const snap = hud.syncFromSectors({
      campSpikeSector: camp,
      alleywaySubwaySector: alley,
      thermalCoreSector: thermal,
      coolingTowerSector: cooling,
      shipHangarSector: hangar,
      frenchFortSector: fort,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v212-millenary-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('MILLENARY APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (134 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseMillenaryApexMasterAuditor();
    const res = auditor.runFullMillenaryApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 134);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: atmospheric absorption, plasma discharge impedance and 15 v212 SFX triggers', () => {
    const absorption = audioSynth.computeMillenaryAtmosphericAbsorption({
      temperatureCelsius: 22,
      relativeHumidityPercent: 85,
      distanceMeters: 65
    });
    assert.equal(absorption.temperatureCelsius, 22);
    assert.equal(absorption.relativeHumidityPercent, 85);
    assert.equal(absorption.distanceMeters, 65);
    assert.ok(absorption.absorptionCoeffDbPerM > 0);
    assert.ok(absorption.totalAttenuationDb > 0);
    assert.equal(absorption.clarityConfirmed, true);

    const impedance = audioSynth.computeMillenaryPlasmaDischargeAcousticImpedance({
      corePlasmaJoules: 28000,
      airDensityKgM3: 1.225
    });
    assert.equal(impedance.corePlasmaJoules, 28000);
    assert.equal(impedance.airDensityKgM3, 1.225);
    assert.ok(impedance.characteristicImpedanceRayls > 400);
    assert.ok(impedance.peakShockPressureKPa > 10);
    assert.equal(impedance.dischargeStabilized, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playGuerrillaSmokeHissSFX());
    assert.doesNotThrow(() => audioSynth.playPunjiWoodSpikeSharpenSFX());
    assert.doesNotThrow(() => audioSynth.playCanopyClaymoreDetonationSFX());
    assert.doesNotThrow(() => audioSynth.playAlleywayRainSizzleSFX());
    assert.doesNotThrow(() => audioSynth.playDiamondNetMeshSeverSFX());
    assert.doesNotThrow(() => audioSynth.playSubwayMaintenanceShaftEchoSFX());
    assert.doesNotThrow(() => audioSynth.playGeothermalCoreVentHissSFX());
    assert.doesNotThrow(() => audioSynth.playQueenTailSteelCableTensionSFX());
    assert.doesNotThrow(() => audioSynth.playCoolingTowerThunderstormClapSFX());
    assert.doesNotThrow(() => audioSynth.playDualPlasmaPistolOverdriveSFX());
    assert.doesNotThrow(() => audioSynth.playPreserveHangarSonicMineChirpSFX());
    assert.doesNotThrow(() => audioSynth.playTritiumGauntletBeamDischargeSFX());
    assert.doesNotThrow(() => audioSynth.playVoyageurFortTomahawkStrikeSFX());
    assert.doesNotThrow(() => audioSynth.playMillenaryObsidianPinnacleResonanceSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseMillenaryApexNuclearPurgeSFX());
  });
});
