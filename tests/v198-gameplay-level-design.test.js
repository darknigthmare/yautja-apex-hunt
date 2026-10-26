import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { PredatorBadlands2025RazorGrassBoneyardFieldSector } from '../src/gameplay/PredatorBadlands2025RazorGrassBoneyardFieldSector.js';
import { PredatorBadlands2025WeylandYutaniBioLabCompoundSector } from '../src/gameplay/PredatorBadlands2025WeylandYutaniBioLabCompoundSector.js';
import { PredatorBadlands2025AcidSwampGeyserCrossingSector } from '../src/gameplay/PredatorBadlands2025AcidSwampGeyserCrossingSector.js';
import { PredatorBadlands2025KaliskCoopDropShipSiegeSector } from '../src/gameplay/PredatorBadlands2025KaliskCoopDropShipSiegeSector.js';
import { PredatorBadlands2025TessaFinalDuelExecutionSector } from '../src/gameplay/PredatorBadlands2025TessaFinalDuelExecutionSector.js';
import { PredatorBadlands2025YautjaPrimeNjohrrRedemptionReturnSector } from '../src/gameplay/PredatorBadlands2025YautjaPrimeNjohrrRedemptionReturnSector.js';
import { PredatorBadlands2025YautjaDefeatBoneyardProtocolSector } from '../src/gameplay/PredatorBadlands2025YautjaDefeatBoneyardProtocolSector.js';
import { HumanQaPredatorBadlands2025BoneyardHUDDirector } from '../src/gameplay/HumanQaPredatorBadlands2025BoneyardHUDDirector.js';
import { HumanQaPredatorBadlands2025BoneyardMasterAuditor } from '../src/gameplay/HumanQaPredatorBadlands2025BoneyardMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v198 Predator: Badlands (2025) Boneyard, WY Bio-Lab, Tessa Duel & Njohrr Return Suite', () => {
  it('Chantier 1: Genna Razor-Grass wind-ripple telegraph, leviathan ribcage shelter, blade harvest, and Bone-Stalker ambush', () => {
    const sector = new PredatorBadlands2025RazorGrassBoneyardFieldSector();
    const ripple = sector.readWindRippleTelegraph({ windGustKmh: 68, silicateEdgeHardnessHV: 820 });
    assert.equal(ripple.windRippleTelegraphRead, true);
    assert.equal(ripple.warningLeadTimeSeconds, 2.2);

    const shelter = sector.crouchBehindMegafaunaRibcage({ ribBoneThicknessMm: 185, gustsDeflected: 4 });
    assert.equal(shelter.shelteredUnderLeviathanRibcage, true);

    const harvest = sector.harvestSilicateGrassBlades({ harvestedBlades: 8, edgeSharpnessIndex: 0.96 });
    assert.equal(harvest.harvestedSilicateBlades, 8);

    const ambush = sector.clearBoneyardAmbushPredators({ boneStalkersNeutralized: 5 });
    assert.equal(ambush.boneyardAmbushCleared, true);
    assert.equal(ambush.honorAwarded, 350);
  });

  it('Chantier 2: Weyland-Yutani Bio-Lab cryo pod breach, Power Loader sabotage, IFF turret spoof, and Kwei heirloom extraction', () => {
    const sector = new PredatorBadlands2025WeylandYutaniBioLabCompoundSector();
    const breach = sector.breachCryoSpecimenStasisPod({ podPressureBar: 14.5, shatteredReinforcedGlass: true });
    assert.equal(breach.cryoStasisPodBreached, true);

    const loader = sector.sabotagePowerLoaderExosuitBay({
      loaderModel: 'P-5000_HEAVY_BIO',
      hydraulicLinesSevered: 4,
      impactJoules: 5400
    });
    assert.equal(loader.powerLoaderBaySabotaged, true);

    const turrets = sector.overrideAutomatedSentryTurrets({ turretCount: 6, iffTransponderSpoofed: true });
    assert.equal(turrets.sentryTurretsOverridden, true);
    assert.equal(turrets.turretsTurnedAgainstMercs, 6);

    const extract = sector.extractConfiscatedYautjaClanHeirlooms({
      recoveredPlasmaSwordCore: true,
      kweiCloakFragmentRecovered: true
    });
    assert.equal(extract.clanHeirloomsExtracted, true);
    assert.equal(extract.honorAwarded, 400);
  });

  it('Chantier 3: Sulfuric acid bog thermal crust scan, spore-puffball chain detonation, Bud mire rescue, and sludge coating', () => {
    const sector = new PredatorBadlands2025AcidSwampGeyserCrossingSector();
    const scan = sector.scanSulfuricBogThermalCrust({
      surfaceTempCelsius: 94,
      acidPhLevel: 0.8,
      safeBasaltStonesFound: 9
    });
    assert.equal(scan.thermalCrustScanned, true);

    const blast = sector.triggerChainDetonationOfSporePuffballs({
      thrownStoneMassKg: 1.8,
      detonatedPuffballs: 12,
      blastPressureKpa: 180
    });
    assert.equal(blast.puffballChainDetonated, true);
    assert.equal(blast.wyReconDronesVaporized, 3);

    const rescue = sector.rescueBudFromSinkingMire({ mireSuctionNewtons: 1450, vineLashPull: true });
    assert.equal(rescue.budRescuedFromMire, true);

    const coat = sector.coatArrowsInSulfuricSludge({ coatedProjectiles: 6, armorMeltBonusPercent: 45 });
    assert.equal(coat.honorAwarded, 300);
  });

  it('Chantier 4: Dek & Kalisk co-op dropship siege via Bud 420 Hz whistle, strut ram, spine vault, and VTOL turbine explosion', () => {
    const sector = new PredatorBadlands2025KaliskCoopDropShipSiegeSector();
    const sync = sector.coordinateBudWhistleSignalWithKalisk({
      acousticFreqHz: 420,
      kaliskAggroSynced: true
    });
    assert.equal(sync.kaliskAggroSynced, true);

    const ram = sector.kaliskBatteringRamDropshipStrut({
      chargeMomentumKn: 145,
      landingGearCollapsed: true
    });
    assert.equal(ram.landingGearCollapsed, true);
    assert.equal(ram.dropshipTiltDegrees, 28);

    const vault = sector.dekVaultOffKaliskBackToEngineNacelle({
      vaultHeightMeters: 9.5,
      plasmaBladeInsertedInTurbine: true
    });
    assert.equal(vault.vaultedIntoVtolNacelle, true);

    const detonate = sector.detonateDropshipFuelManifold({
      turbineExplosionJoules: 18500,
      wySquadEliminated: 14
    });
    assert.equal(detonate.dropshipGrounded, true);
    assert.equal(detonate.honorAwarded, 450);
  });

  it('Chantier 5: Final duel against sister synthetic Tessa, Thia phase-cancel stall, optic core severance, and Genna data purge', () => {
    const sector = new PredatorBadlands2025TessaFinalDuelExecutionSector();
    const parry = sector.parryTessaOverclockedBladeFlurry({
      strikeFrequencyHz: 14,
      parriedEnergyJoules: 4600
    });
    assert.equal(parry.bladeFlurryParried, true);

    const stall = sector.thiaAcousticFeedbackStall({
      sharedModelSerialPrefix: 'WY-SYNTH-TF',
      harmonicStutterMs: 1400
    });
    assert.equal(stall.tessaServoStalled, true);

    const sever = sector.severTessaSyntheticSpineAndOpticCore({
      spinalFluidWhiteLatexPressure: 8.4,
      decapitationComplete: true
    });
    assert.equal(sever.tessaOpticCoreSevered, true);

    const claim = sector.claimTessaSkullAndWeylandDataCore({
      trophySkullClaimed: true,
      gennaCoordinatesPurgedFromWyNetwork: true
    });
    assert.equal(claim.trophySkullClaimed, true);
    assert.equal(claim.gennaCoordinatesPurged, true);
    assert.equal(claim.honorAwarded, 450);
  });

  it('Chantier 6: Return to Yautja Prime citadel, Genna apex trophy display, Njohrr duel with Kwei counter-feint, and Kwei memorial rune', () => {
    const sector = new PredatorBadlands2025YautjaPrimeNjohrrRedemptionReturnSector();
    const land = sector.descendIntoYautjaPrimeCitadel({
      vesselClass: 'HYBRID_YAUTJA_WY_SCOUT',
      clanGuardsShocked: 12
    });
    assert.equal(land.landedAtCitadel, true);

    const display = sector.castDownGennaApexTrophies({
      kaliskRegenCrownHornDisplayed: true,
      tessaChromeSkullDisplayed: true
    });
    assert.equal(display.gennaTrophiesDisplayed, true);

    const duel = sector.duelClanFatherNjohrrForKweiHonor({
      njohrrHeavyGlaiveParriedJoules: 6200,
      kweiSignatureCounterUsed: true
    });
    assert.equal(duel.njohrrDuelWon, true);

    const seal = sector.claimClanLeadershipAndHonorKweiMemory({
      njohrrDefeated: true,
      kweiMemorialRuneCarved: true,
      thiaAndBudAcceptedAsPack: true
    });
    assert.equal(seal.kweiMemorialRuneCarved, true);
    assert.equal(seal.thiaAndBudAcceptedAsPack, true);
    assert.equal(seal.honorAwarded, 500);
  });

  it('Chantier 7: Strict User Rule 3 verification in Genna Boneyard (isYautja && health <= 0 && config === PREDATOR_BADLANDS_2025_BONEYARD_COMPOUND)', () => {
    const sector = new PredatorBadlands2025YautjaDefeatBoneyardProtocolSector();

    const nonYautja = sector.evaluateAndTriggerProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_BONEYARD_COMPOUND'
    });
    assert.equal(nonYautja.protocolArmed, false);
    assert.equal(nonYautja.rejectionReason, 'REJECTED_NOT_YAUTJA');

    const yautjaAlive = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 25,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_BONEYARD_COMPOUND'
    });
    assert.equal(yautjaAlive.protocolArmed, false);
    assert.equal(yautjaAlive.rejectionReason, 'REJECTED_YAUTJA_STILL_ALIVE');

    const wrongLevel = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'KILLER_OF_KILLERS_841_AD_FJORD'
    });
    assert.equal(wrongLevel.protocolArmed, false);
    assert.equal(wrongLevel.rejectionReason, 'REJECTED_WRONG_CONFIGURATION');

    const validTrigger = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_BONEYARD_COMPOUND'
    });
    assert.equal(validTrigger.protocolArmed, true);
    assert.deepEqual(validTrigger.glyphsEntered, ['᚛', 'ᚓ', 'ᚔ', 'ᚕ', '᚜']);
    assert.equal(validTrigger.wyBoneyardCompoundVaporized, true);
    assert.equal(validTrigger.honorAwarded, 500);
  });

  it('Chantier 8: HumanQaPredatorBadlands2025BoneyardHUDDirector telemetry and defeat widget update', () => {
    const auditor = new HumanQaPredatorBadlands2025BoneyardMasterAuditor();
    const cert = auditor.runFullCertification();
    const hud = new HumanQaPredatorBadlands2025BoneyardHUDDirector();
    assert.equal(hud.qaPlaytesterAudits.length, 5);
    assert.equal(cert.hudState.panelClass, 'predator-badlands-2025-boneyard-hud-panel');
    assert.equal(cert.hudState.defeatWidgetVisible, true);
    assert.equal(cert.hudState.defeatGlyphBanner, '᚛-ᚓ-ᚔ-ᚕ-᚜');
    assert.equal(cert.hudState.totalHonorDisplayed, 2950);
  });

  it('Chantier 9: HumanQaPredatorBadlands2025BoneyardMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaPredatorBadlands2025BoneyardMasterAuditor();
    const result = auditor.runFullCertification();
    assert.equal(result.allSectorsCertified, true);
    assert.equal(result.rule3StrictVerified, true);
    assert.equal(result.webglDrawCalls.withinBudget, true);
    assert.ok(result.webglDrawCalls.estimated <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v198 SFX triggers', () => {
    const synth = audioSynth;
    const grassAcoustics = synth.computeRazorGrassWindShearAcoustics({
      windGustKmh: 68,
      silicateEdgeHardnessHV: 820,
      grassHeightMeters: 2.4
    });
    assert.ok(grassAcoustics.whistleFrequencyHz > 1500);
    assert.ok(grassAcoustics.shearHarmonicGain > 0);
    assert.ok(grassAcoustics.leadWarningSeconds >= 2.0);

    const tessaAcoustics = synth.computeTessaSyntheticServoStutterAcoustics({
      strikeFrequencyHz: 14,
      harmonicStutterMs: 1400
    });
    assert.ok(tessaAcoustics.phaseCancelCarrierHz > 2000);
    assert.equal(tessaAcoustics.lockWindowSeconds, 1.4);

    const sfxMethods = [
      'playRazorGrassWindRippleWhistleSFX',
      'playLeviathanRibcageDeflectSFX',
      'playSilicateGrassBladeHarvestSFX',
      'playCryoSpecimenStasisPodShatterSFX',
      'playPowerLoaderHydraulicSeverSFX',
      'playWeylandSentryTurretIffSpoofSFX',
      'playSulfuricBogBubbleHissSFX',
      'playSporePuffballChainBlastSFX',
      'playBudMireVineRescueSFX',
      'playKaliskDropshipStrutRamSFX',
      'playDekVtolTurbinePlasmaJamSFX',
      'playTessaHighFreqBladeParrySFX',
      'playThiaPhaseCancelServoStallSFX',
      'playNjohrrGlaiveKweiCounterParrySFX',
      'playPredatorBadlandsBoneyardNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof synth[method], 'function', `Missing SFX method: ${method}`);
      assert.doesNotThrow(() => synth[method]());
    }
  });
});
