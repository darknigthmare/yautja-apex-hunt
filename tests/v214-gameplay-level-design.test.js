import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Predator1987DecoyFireSpikeLogCounterweightSector } from '../src/gameplay/Predator1987DecoyFireSpikeLogCounterweightSector.js';
import { Predator21990MeatpackerRoofLightningAndDesertEagleSector } from '../src/gameplay/Predator21990MeatpackerRoofLightningAndDesertEagleSector.js';
import { Avp2004IceCrevasseAmbushAndFacehuggerSpearSector } from '../src/gameplay/Avp2004IceCrevasseAmbushAndFacehuggerSpearSector.js';
import { AvpRequiem2007SkylightPredalienGrappleAndStoreRooftopSector } from '../src/gameplay/AvpRequiem2007SkylightPredalienGrappleAndStoreRooftopSector.js';
import { Predators2010MonumentalCliffOverlookAndSmartShurikenSector } from '../src/gameplay/Predators2010MonumentalCliffOverlookAndSmartShurikenSector.js';
import { Prey2022FoggyPineClearingTriLaserReflectAndAstralSpireSector } from '../src/gameplay/Prey2022FoggyPineClearingTriLaserReflectAndAstralSpireSector.js';
import { PredatorFranchiseAstralApexYautjaDefeatProtocolSector } from '../src/gameplay/PredatorFranchiseAstralApexYautjaDefeatProtocolSector.js';
import { HumanQaPredatorFranchiseAstralApexHUDDirector } from '../src/gameplay/HumanQaPredatorFranchiseAstralApexHUDDirector.js';
import { HumanQaPredatorFranchiseAstralApexMasterAuditor } from '../src/gameplay/HumanQaPredatorFranchiseAstralApexMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v214 - Predator Franchise Astral Apex Pantheon (1987-2025)', () => {
  it('1. Predator (1987): counterweight vine suspension, decoy campfire, Dutch battle taunt & tripwire peg release (+350 Honor)', () => {
    const sector = new Predator1987DecoyFireSpikeLogCounterweightSector();
    assert.equal(sector.sectorId, 'PREDATOR_1987_DECOY_FIRE_SPIKE_LOG_COUNTERWEIGHT');

    const rigRes = sector.rigCounterweightVineSuspensionSystem({
      vineTensileStrengthKn: 14,
      counterweightMassKg: 320
    });
    assert.equal(rigRes.counterweightVineSuspensionRigged, true);

    const fireRes = sector.igniteDecoyCampfireToBaitThermalOptics({
      flareIntensityCelsius: 550,
      thermalDecoyEffective: true
    });
    assert.equal(fireRes.decoyBonfireIgnited, true);

    const tauntRes = sector.shoutIconicTauntAndDodgePlasmaCasterBolt({
      tauntDecibels: 110,
      plasmaBlastDodgeMarginMeters: 0.8
    });
    assert.equal(tauntRes.dutchBattleTauntShouted, true);

    const kickRes = sector.kickTripwirePegToReleaseOverheadSpikeDeadfall({
      tripwireReleaseForceNewtons: 180,
      deadfallImpactJoules: 16500
    });
    assert.equal(kickRes.tripwirePegKickedDeadfallReleased, true);
    assert.equal(kickRes.honorAwarded, 350);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 350);
    assert.equal(tele.tripwirePegKickedDeadfallReleased, true);
  });

  it('2. Predator 2 (1990): meatpacker roof lightning, blue healing syringe interrupt, Desert Eagle shot & transformer arc (+400 Honor)', () => {
    const sector = new Predator21990MeatpackerRoofLightningAndDesertEagleSector();
    assert.equal(sector.sectorId, 'PREDATOR_2_1990_MEATPACKER_ROOF_LIGHTNING_AND_DESERT_EAGLE');

    const stormRes = sector.ascendMeatpackerRoofUnderLightningStorm({
      lightningFlashLux: 14000,
      roofParapetVaulted: true
    });
    assert.equal(stormRes.meatpackerRoofVaultedUnderStorm, true);

    const syringeRes = sector.interruptCityHunterBlueHealingSyringe({
      cauterizationInterrupted: true,
      healingDisruptedPercent: 75
    });
    assert.equal(syringeRes.cauterizationSyringeInterrupted, true);

    const deagleRes = sector.dischargeDesertEaglePointBlankIntoChestMesh({
      muzzleEnergyJoules: 2200,
      meshPlatePenetrated: true
    });
    assert.equal(deagleRes.desertEaglePointBlankDischarged, true);

    const arcRes = sector.dodgeTransformerExplosionPlasmaBacklash({
      blastDistanceMeters: 3.5,
      electricalArcEvaded: true
    });
    assert.equal(arcRes.transformerPlasmaBacklashEvaded, true);
    assert.equal(arcRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
    assert.equal(tele.transformerPlasmaBacklashEvaded, true);
  });

  it('3. AVP (2004): ice crevasse tunnel, mid-air Facehugger spear, smart-disc drone bisection & geothermal countdown (+400 Honor)', () => {
    const sector = new Avp2004IceCrevasseAmbushAndFacehuggerSpearSector();
    assert.equal(sector.sectorId, 'AVP_2004_ICE_CREVASSE_AMBUSH_AND_FACEHUGGER_SPEAR');

    const tunnelRes = sector.navigateIceCrevasseTunnelTowardsSurface({
      tunnelLengthMeters: 480,
      subzeroTempCelsius: -35
    });
    assert.equal(tunnelRes.iceCrevasseTunnelNavigated, true);

    const spearRes = sector.impaleMidairLeapingFacehuggerWithCombistick({
      combistickThrustMps: 24,
      facehuggerAcidNeutralized: true
    });
    assert.equal(spearRes.midairFacehuggerImpaled, true);

    const discRes = sector.severAmbushingCrevasseDroneWithSmartDisc({
      discThrowVelocityMps: 68,
      droneBisected: true
    });
    assert.equal(discRes.crevasseDroneBisected, true);

    const purgeRes = sector.primeGeothermalPurgeGeneratorCountdown({
      generatorTempCelsius: 420,
      countdownSynchronized: true
    });
    assert.equal(purgeRes.geothermalPurgeCountdownPrimed, true);
    assert.equal(purgeRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('4. AVP: Requiem (2007): sporting goods rooftop, dual plasma snipe, skylight Predalien grapple & ventilation fluid (+400 Honor)', () => {
    const sector = new AvpRequiem2007SkylightPredalienGrappleAndStoreRooftopSector();
    assert.equal(sector.sectorId, 'AVP_REQUIEM_2007_SKYLIGHT_PREDALIEN_GRAPPLE_AND_STORE_ROOFTOP');

    const rooftopRes = sector.secureSportingGoodsRooftopPerimeter({
      perimeterBeamsArmed: 4,
      audioSensorsCalibrated: true
    });
    assert.equal(rooftopRes.rooftopPerimeterSecured, true);

    const snipeRes = sector.snipeApproachingWarriorsWithDualHandPlasma({
      shotsFired: 8,
      warriorsNeutralizedCount: 5
    });
    assert.equal(snipeRes.approachingWarriorsSniped, true);

    const grappleRes = sector.grapplePredalienAcrossReinforcedGlassSkylight({
      glassCompressionMpa: 85,
      grappleForceNewtons: 5600
    });
    assert.equal(grappleRes.skylightPredalienGrappled, true);

    const fluidRes = sector.pourDissolvingFluidIntoVentilationShaftHive({
      fluidVolumeMl: 500,
      hiveShaftSealed: true
    });
    assert.equal(fluidRes.ventilationShaftHiveSealed, true);
    assert.equal(fluidRes.honorAwarded, 400);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 400);
  });

  it('5. Predators (2010) & The Predator (2018): cliff moons survey, smart-shuriken ricochet, targets slashed & beacon overload (+450 Honor)', () => {
    const sector = new Predators2010MonumentalCliffOverlookAndSmartShurikenSector();
    assert.equal(sector.sectorId, 'PREDATORS_2010_MONUMENTAL_CLIFF_OVERLOOK_AND_SMART_SHURIKEN');

    const moonsRes = sector.scanOffworldConstellationsFromMonumentalCliff({
      celestialMoonsCount: 3,
      offworldConfirmed: true
    });
    assert.equal(moonsRes.offworldMoonsSurveyed, true);

    const salvageRes = sector.salvageFugitiveSmartShurikenAndCloakingBelt({
      batteryIntegrityPercent: 92,
      shurikenPrimed: true
    });
    assert.equal(salvageRes.smartShurikenAndCloakSalvaged, true);

    const ricochetRes = sector.executeTripleBladedShurikenRicochetStrike({
      ricochetBouncesCount: 3,
      targetsSlashed: 2
    });
    assert.equal(ricochetRes.tripleShurikenRicochetExecuted, true);

    const overloadRes = sector.overloadStargazerTrackingBeaconWithEnergyCell({
      dischargeMegawatts: 2.8,
      beaconShortCircuited: true
    });
    assert.equal(overloadRes.stargazerBeaconOverloaded, true);
    assert.equal(overloadRes.honorAwarded, 450);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 450);
  });

  it('6. Prey (2022) & Badlands (2025): orange flower heat mask, copper pelt laser reflection, Astral Spire ascent & Astral Sanctum (+500 Honor)', () => {
    const sector = new Prey2022FoggyPineClearingTriLaserReflectAndAstralSpireSector();
    assert.equal(sector.sectorId, 'PREY_2022_FOGGY_PINE_CLEARING_TRI_LASER_REFLECT_AND_ASTRAL_SPIRE');

    const flowerRes = sector.ingestMedicinalOrangeFlowerToMaskThermalHeat({
      coreTempCelsius: 29.8,
      thermalInvisibilityConfirmed: true
    });
    assert.equal(flowerRes.orangeFlowerThermalHeatMasked, true);

    const reflectRes = sector.reflectTriLaserBeamUsingCopperBeaverPelt({
      reflectionAngleDegrees: 42,
      boltRedirectedToFeralHelmet: true
    });
    assert.equal(reflectRes.triLaserBeamReflectedIntoHelmet, true);

    const ascentRes = sector.ascendAstralApexSpireWithThiaAndBud({
      spireElevationMeters: 6800,
      cyberneticTwinDuoHarmonized: true
    });
    assert.equal(ascentRes.astralApexSpireAscended, true);

    const sanctumRes = sector.consecrateAstralApexSanctumUnifyingAllNineFilms({
      astralSanctumConsecrated: true,
      nineFilmsUnified: true
    });
    assert.equal(sanctumRes.astralApexSanctumConsecrated, true);
    assert.equal(sanctumRes.honorAwarded, 500);

    const tele = sector.getTelemetry();
    assert.equal(tele.honorAwarded, 500);
  });

  it('7. Strict User Rule 3: full 4-case truth-table validation for Astral Apex defeat protocol (+500 Honor)', () => {
    const sector = new PredatorFranchiseAstralApexYautjaDefeatProtocolSector();

    // Case 1: All strict conditions met -> ARMED & SANCTUM VAPORIZED
    const c1 = sector.evaluateAstralApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ASTRAL_APEX_SANCTUM'
    });
    assert.equal(c1.selfDestructTriggered, true);
    assert.equal(c1.rejectionReason, null);
    assert.deepEqual(c1.glyphSequence, ['᚛', 'ᚎ', 'ᚓ', 'ᚏ', '᚜']);
    assert.equal(c1.roarDecibels, 124);
    assert.equal(c1.countdownSeconds, 15);
    assert.equal(c1.blastRadiusMeters, 65);
    assert.equal(c1.astralApexSanctumVaporized, true);
    assert.equal(c1.honorAwarded, 500);

    // Case 2: Player is human -> REJECTED
    const c2 = sector.evaluateAstralApexDefeatProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ASTRAL_APEX_SANCTUM'
    });
    assert.equal(c2.selfDestructTriggered, false);
    assert.equal(c2.rejectionReason, 'PLAYER_NOT_YAUTJA');

    // Case 3: Yautja is still alive -> REJECTED
    const c3 = sector.evaluateAstralApexDefeatProtocol({
      isYautja: true,
      healthPoints: 50,
      levelConfiguration: 'PREDATOR_FRANCHISE_ASTRAL_APEX_SANCTUM'
    });
    assert.equal(c3.selfDestructTriggered, false);
    assert.equal(c3.rejectionReason, 'YAUTJA_STILL_ALIVE');

    // Case 4: Wrong arena configuration -> REJECTED
    const c4 = sector.evaluateAstralApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'VAL_VERDE_JUNGLE_BASE'
    });
    assert.equal(c4.selfDestructTriggered, false);
    assert.equal(c4.rejectionReason, 'INVALID_LEVEL_CONFIGURATION');
  });

  it('8. Human QA Astral Apex HUD Director: telemetry sync (3000 Honor) & DOM rendering', () => {
    const decoy = new Predator1987DecoyFireSpikeLogCounterweightSector();
    decoy.rigCounterweightVineSuspensionSystem();
    decoy.igniteDecoyCampfireToBaitThermalOptics();
    decoy.shoutIconicTauntAndDodgePlasmaCasterBolt();
    decoy.kickTripwirePegToReleaseOverheadSpikeDeadfall();

    const meatpacker = new Predator21990MeatpackerRoofLightningAndDesertEagleSector();
    meatpacker.ascendMeatpackerRoofUnderLightningStorm();
    meatpacker.interruptCityHunterBlueHealingSyringe();
    meatpacker.dischargeDesertEaglePointBlankIntoChestMesh();
    meatpacker.dodgeTransformerExplosionPlasmaBacklash();

    const ice = new Avp2004IceCrevasseAmbushAndFacehuggerSpearSector();
    ice.navigateIceCrevasseTunnelTowardsSurface();
    ice.impaleMidairLeapingFacehuggerWithCombistick();
    ice.severAmbushingCrevasseDroneWithSmartDisc();
    ice.primeGeothermalPurgeGeneratorCountdown();

    const skylight = new AvpRequiem2007SkylightPredalienGrappleAndStoreRooftopSector();
    skylight.secureSportingGoodsRooftopPerimeter();
    skylight.snipeApproachingWarriorsWithDualHandPlasma();
    skylight.grapplePredalienAcrossReinforcedGlassSkylight();
    skylight.pourDissolvingFluidIntoVentilationShaftHive();

    const cliff = new Predators2010MonumentalCliffOverlookAndSmartShurikenSector();
    cliff.scanOffworldConstellationsFromMonumentalCliff();
    cliff.salvageFugitiveSmartShurikenAndCloakingBelt();
    cliff.executeTripleBladedShurikenRicochetStrike();
    cliff.overloadStargazerTrackingBeaconWithEnergyCell();

    const foggy = new Prey2022FoggyPineClearingTriLaserReflectAndAstralSpireSector();
    foggy.ingestMedicinalOrangeFlowerToMaskThermalHeat();
    foggy.reflectTriLaserBeamUsingCopperBeaverPelt();
    foggy.ascendAstralApexSpireWithThiaAndBud();
    foggy.consecrateAstralApexSanctumUnifyingAllNineFilms();

    const defeatProtocol = new PredatorFranchiseAstralApexYautjaDefeatProtocolSector();
    defeatProtocol.evaluateAstralApexDefeatProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_FRANCHISE_ASTRAL_APEX_SANCTUM'
    });

    const hud = new HumanQaPredatorFranchiseAstralApexHUDDirector();
    const snap = hud.syncFromSectors({
      decoyFireSector: decoy,
      meatpackerRoofSector: meatpacker,
      iceCrevasseSector: ice,
      skylightGrappleSector: skylight,
      cliffOverlookSector: cliff,
      foggyPineSector: foggy,
      defeatProtocolSector: defeatProtocol
    });

    // 350 + 400 + 400 + 400 + 450 + 500 + 500 = 3000
    assert.equal(snap.totalHonorAwarded, 3000);
    assert.equal(snap.allPlaytestersPassed, true);
    assert.equal(snap.playtestersCount, 5);

    const fakeContainer = { className: '', innerHTML: '' };
    hud.renderToDom(fakeContainer);
    assert.equal(fakeContainer.className, 'predator-franchise-v214-astral-apex-hud-panel');
    assert.ok(fakeContainer.innerHTML.includes('ASTRAL APEX PANTHEON'));
    assert.ok(fakeContainer.innerHTML.includes('3000 / 3000'));
    assert.ok(fakeContainer.innerHTML.includes('SANCTUM VAPORIZED'));
  });

  it('9. Human QA Master Auditor: end-to-end execution and draw-calls budget compliance (132 <= 300)', () => {
    const auditor = new HumanQaPredatorFranchiseAstralApexMasterAuditor();
    const res = auditor.runFullAstralApexAudit();

    assert.equal(res.allSectorsPassed, true);
    assert.equal(res.totalHonorAwarded, 3000);
    assert.equal(res.drawCallsCompliant, true);
    assert.ok(res.estimatedMothershipDrawCalls <= res.maxAllowedDrawCalls);
    assert.equal(res.estimatedMothershipDrawCalls, 132);

    assert.equal(res.rule3TruthTable.case1_Success, true);
    assert.equal(res.rule3TruthTable.case2_HumanRejected, true);
    assert.equal(res.rule3TruthTable.case3_AliveRejected, true);
    assert.equal(res.rule3TruthTable.case4_WrongArenaRejected, true);
  });

  it('10. AudioSynthesizer: spire resonance, plasma shuriken Doppler shift and 15 v214 SFX triggers', () => {
    const resonance = audioSynth.computeAstralSpireAcousticResonance({
      spireElevationMeters: 6800,
      ambientAirPressureKpa: 42
    });
    assert.equal(resonance.spireElevationMeters, 6800);
    assert.equal(resonance.ambientAirPressureKpa, 42);
    assert.ok(resonance.speedOfSoundMps > 300);
    assert.ok(resonance.fundamentalResonanceHz > 0);
    assert.equal(resonance.astralResonanceStable, true);

    const doppler = audioSynth.computeAstralPlasmaShurikenDopplerShift({
      shurikenSpeedMps: 75,
      observerAngleDegrees: 30
    });
    assert.equal(doppler.shurikenSpeedMps, 75);
    assert.equal(doppler.baseFreqHz, 3200);
    assert.ok(doppler.observedFreqHz > doppler.baseFreqHz);
    assert.equal(doppler.dopplerShiftConfirmed, true);

    // Call all 15 SFX methods (non-crashing when Web Audio context is headless/null)
    assert.doesNotThrow(() => audioSynth.playDecoyBonfireCrackleSFX());
    assert.doesNotThrow(() => audioSynth.playSpikeLogDeadfallReleaseWhooshSFX());
    assert.doesNotThrow(() => audioSynth.playSlaughterhouseLightningThunderSFX());
    assert.doesNotThrow(() => audioSynth.playDesertEagleChestMeshImpactSFX());
    assert.doesNotThrow(() => audioSynth.playIceCrevasseWindTunnelWhistleSFX());
    assert.doesNotThrow(() => audioSynth.playMidairFacehuggerSpearImpaleSFX());
    assert.doesNotThrow(() => audioSynth.playRooftopPerimeterTripwireChirpSFX());
    assert.doesNotThrow(() => audioSynth.playSkylightGlassCompressionCreakSFX());
    assert.doesNotThrow(() => audioSynth.playVentilationShaftDissolvingFluidGurgleSFX());
    assert.doesNotThrow(() => audioSynth.playMonumentalCliffWindGustSFX());
    assert.doesNotThrow(() => audioSynth.playTripleShurikenRicochetClangSFX());
    assert.doesNotThrow(() => audioSynth.playStargazerBeaconOverloadStaticSFX());
    assert.doesNotThrow(() => audioSynth.playCopperPeltTriLaserReflectionPingSFX());
    assert.doesNotThrow(() => audioSynth.playAstralApexSpireHarmonicResonanceSFX());
    assert.doesNotThrow(() => audioSynth.playPredatorFranchiseAstralApexNuclearPurgeSFX());
  });
});
