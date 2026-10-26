import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { PredatorBadlands2025AncientYautjaWreckReliquarySector } from '../src/gameplay/PredatorBadlands2025AncientYautjaWreckReliquarySector.js';
import { PredatorBadlands2025SpittingCobraVineGorgeSector } from '../src/gameplay/PredatorBadlands2025SpittingCobraVineGorgeSector.js';
import { PredatorBadlands2025WeylandAtmosphericProcessorSabotageSector } from '../src/gameplay/PredatorBadlands2025WeylandAtmosphericProcessorSabotageSector.js';
import { PredatorBadlands2025BudJuvenilePackStealthDistractionSector } from '../src/gameplay/PredatorBadlands2025BudJuvenilePackStealthDistractionSector.js';
import { PredatorBadlands2025TessaSyntheticCloneVaultPurgeSector } from '../src/gameplay/PredatorBadlands2025TessaSyntheticCloneVaultPurgeSector.js';
import { PredatorBadlands2025GennaEclipseApexCoronationSector } from '../src/gameplay/PredatorBadlands2025GennaEclipseApexCoronationSector.js';
import { PredatorBadlands2025YautjaDefeatCloneVaultProtocolSector } from '../src/gameplay/PredatorBadlands2025YautjaDefeatCloneVaultProtocolSector.js';
import { HumanQaPredatorBadlands2025CloneVaultHUDDirector } from '../src/gameplay/HumanQaPredatorBadlands2025CloneVaultHUDDirector.js';
import { HumanQaPredatorBadlands2025CloneVaultMasterAuditor } from '../src/gameplay/HumanQaPredatorBadlands2025CloneVaultMasterAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('v200 Predator: Badlands (2025) Ancient Wreck, Spitting Gorge, Atmos Rig, Clone Vault & Eclipse Suite', () => {
  it('Chantier 1: Ancient Yautja wreck 528 Hz Kwei clasp unseal, Elder holo-log decode, 1420 MPa Combi-Spear salvage, and ancestor tribute', () => {
    const sector = new PredatorBadlands2025AncientYautjaWreckReliquarySector();
    const unseal = sector.unsealPetrifiedBulkheadWithKweiClasp({
      claspResonanceHz: 528,
      bulkheadOpened: true
    });
    assert.equal(unseal.petrifiedBulkheadOpened, true);

    const decode = sector.decodeAncientElderHoloLog({
      holoPlaytimeSeconds: 46,
      kaliskMitosisWeaknessRevealed: true
    });
    assert.equal(decode.elderHoloLogDecoded, true);

    const salvage = sector.salvageAncientFoldingCombiSpear({
      spearAlloyTensileMpa: 1420,
      telescopingJointsRestored: 3
    });
    assert.equal(salvage.ancientCombiSpearSalvaged, true);

    const honor = sector.paySilentBloodedRespectsToFallenAncestor({
      ancestorSkullHonored: true,
      clanCrestEtched: true
    });
    assert.equal(honor.ancestorHonored, true);
    assert.equal(honor.honorAwarded, 350);
  });

  it('Chantier 2: Genna Hydra-Pitcher peristalsis tracking, Combi-Spear 480 RPM venom deflection, basalt pillar wall-run, and methane ignition', () => {
    const sector = new PredatorBadlands2025SpittingCobraVineGorgeSector();
    const track = sector.trackPitcherPeristalsisWithThiaOptics({
      pitcherCount: 9,
      peristalsisPreFireMs: 650
    });
    assert.equal(track.peristalsisTracked, true);

    const deflect = sector.deflectVenomJetsWithSpinningCombiSpear({
      deflectedJets: 7,
      rotationalRpm: 480
    });
    assert.equal(deflect.venomJetsDeflected, true);

    const wallRun = sector.wallRunWetBasaltChasmPillars({
      pillarChainCount: 5,
      wallFrictionCoeff: 0.44,
      sprintVelocityMps: 9.2
    });
    assert.equal(wallRun.basaltPillarsWallRunCompleted, true);

    const ignite = sector.ignitePitcherColonyMethaneSac({
      methaneIgnitionKelvin: 1650,
      gorgePathCleared: true
    });
    assert.equal(ignite.gorgePathCleared, true);
    assert.equal(ignite.honorAwarded, 350);
  });

  it('Chantier 3: Weyland-Yutani WY-ATMOS-09 cryo-defoliant vent infiltration, 3400 PSI valve override, femur rotor jam, and tank rupture', () => {
    const sector = new PredatorBadlands2025WeylandAtmosphericProcessorSabotageSector();
    const vent = sector.infiltrateCryoDefoliantIntakeVents({
      intakeTempCelsius: -48,
      frostBuildUpCleared: true
    });
    assert.equal(vent.intakeVentsInfiltrated, true);

    const valves = sector.thiaOverrideScrubberPressureValves({
      valvePressurePsi: 3400,
      safetyReliefDisabled: true
    });
    assert.equal(valves.pressureValvesOverridden, true);

    const jam = sector.jamCompressorTurbineWithMegafaunaFemur({
      femurShearResistanceKn: 92,
      rotorSeized: true
    });
    assert.equal(jam.compressorRotorSeized, true);

    const rupture = sector.ruptureDefoliantTankIntoWyBarracks({
      rupturedLiters: 12000,
      wyGarrisonFrozen: 11,
      valleyAirRestored: true
    });
    assert.equal(rupture.defoliantTankRuptured, true);
    assert.equal(rupture.valleyAirRestored, true);
    assert.equal(rupture.honorAwarded, 400);
  });

  it('Chantier 4: Juvenile Bud 310 Hz click command, 48 cm subfloor duct infiltration, 102 dB decoy roar, and bunker blast-door breach', () => {
    const sector = new PredatorBadlands2025BudJuvenilePackStealthDistractionSector();
    const click = sector.issueYautjaClickCommandToBud({
      clickPatternHz: 310,
      budAcknowledged: true
    });
    assert.equal(click.clickCommandIssued, true);

    const scurry = sector.budScurryThroughSubfloorServiceDucts({
      ductDiameterCm: 48,
      travelDistanceMeters: 36,
      undetectedByMotionTrackers: true
    });
    assert.equal(scurry.budInfiltratedDucts, true);

    const roar = sector.budEmitFalseApexRoarInAmmoDepot({
      amplifiedCaveResonanceDb: 102,
      smartgunnersLuredAway: 4
    });
    assert.equal(roar.falseApexRoarProjected, true);

    const breach = sector.dekBreachUnprotectedBunkerBlastDoor({
      plasmaCutJoules: 6800,
      bunkerCaptured: true
    });
    assert.equal(breach.bunkerBlastDoorBreached, true);
    assert.equal(breach.honorAwarded, 400);
  });

  it('Chantier 5: Weyland-Yutani WY-SYNTH-TF clone vault discovery, Tessa 94.2% transfer block, 18.5 kV bus sever, and Thia autonomy emblem', () => {
    const sector = new PredatorBadlands2025TessaSyntheticCloneVaultPurgeSector();
    const discover = sector.discoverDormantSyntheticChassisRow({
      dormantUnitsCount: 8,
      modelLineCode: 'WY-SYNTH-TF'
    });
    assert.equal(discover.dormantChassisRowDiscovered, true);

    const block = sector.thiaBlockTessaConsciousnessBackupTransfer({
      transferBlockedAtPercent: 94.2,
      neuralEncryptionKeyPurged: true
    });
    assert.equal(block.tessaBackupTransferBlocked, true);

    const sever = sector.dekSeverCryoRackPowerBusWithCombiSpear({
      busVoltageKv: 18.5,
      framesDeactivated: 8
    });
    assert.equal(sever.cryoRackPowerBusSevered, true);

    const emblem = sector.thiaClaimAutonomyEmblem({
      corporateSerialScratchedOff: true,
      yautjaClanMarkAdopted: true
    });
    assert.equal(emblem.thiaAutonomyEmblemClaimed, true);
    assert.equal(emblem.honorAwarded, 450);
  });

  it('Chantier 6: Genna gas-giant total eclipse, Blooded armor forging, 112 dB Kalisk salute, and 11.4 km/s departure for Yautja Prime', () => {
    const sector = new PredatorBadlands2025GennaEclipseApexCoronationSector();
    const eclipse = sector.witnessGennaTotalGasGiantEclipse({
      coronaLuminanceLux: 2.4,
      eclipseTotalitySeconds: 180
    });
    assert.equal(eclipse.eclipseTotalityWitnessed, true);

    const forge = sector.forgeBloodedArmorFromGennaRelics({
      kaliskChitinPauldronMounted: true,
      kweiCloakDraped: true,
      ancientCombiSpearHolstered: true
    });
    assert.equal(forge.bloodedArmorAssembled, true);

    const salute = sector.exchangeDistantApexSaluteWithAdultKalisk({
      kaliskRidgeDistanceMeters: 85,
      mutualRespectRoarDb: 112
    });
    assert.equal(salute.kaliskSaluteExchanged, true);

    const launch = sector.igniteHybridVesselThrustersForYautjaPrime({
      escapeVelocityKms: 11.4,
      courseLockedToYautjaPrime: true
    });
    assert.equal(launch.departedForYautjaPrime, true);
    assert.equal(launch.honorAwarded, 500);
  });

  it('Chantier 7: Strict User Rule 3 verification in Clone Vault (isYautja && health <= 0 && config === PREDATOR_BADLANDS_2025_CLONE_VAULT)', () => {
    const sector = new PredatorBadlands2025YautjaDefeatCloneVaultProtocolSector();

    const nonYautja = sector.evaluateAndTriggerProtocol({
      isYautja: false,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_CLONE_VAULT'
    });
    assert.equal(nonYautja.protocolArmed, false);
    assert.equal(nonYautja.rejectionReason, 'REJECTED_NOT_YAUTJA');

    const yautjaAlive = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 45,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_CLONE_VAULT'
    });
    assert.equal(yautjaAlive.protocolArmed, false);
    assert.equal(yautjaAlive.rejectionReason, 'REJECTED_YAUTJA_STILL_ALIVE');

    const wrongLevel = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_RELAY_SPIRE'
    });
    assert.equal(wrongLevel.protocolArmed, false);
    assert.equal(wrongLevel.rejectionReason, 'REJECTED_WRONG_CONFIGURATION');

    const validTrigger = sector.evaluateAndTriggerProtocol({
      isYautja: true,
      healthPoints: 0,
      levelConfiguration: 'PREDATOR_BADLANDS_2025_CLONE_VAULT'
    });
    assert.equal(validTrigger.protocolArmed, true);
    assert.deepEqual(validTrigger.glyphsEntered, ['᚛', 'ᚙ', 'ᚚ', 'ᚐ', '᚜']);
    assert.equal(validTrigger.cloneVaultVaporized, true);
    assert.equal(validTrigger.honorAwarded, 500);
  });

  it('Chantier 8: HumanQaPredatorBadlands2025CloneVaultHUDDirector telemetry and defeat widget update', () => {
    const auditor = new HumanQaPredatorBadlands2025CloneVaultMasterAuditor();
    const cert = auditor.runFullCertification();
    const hud = new HumanQaPredatorBadlands2025CloneVaultHUDDirector();
    assert.equal(hud.qaPlaytesterAudits.length, 5);
    assert.equal(cert.hudState.panelClass, 'predator-badlands-2025-clone-vault-hud-panel');
    assert.equal(cert.hudState.defeatWidgetVisible, true);
    assert.equal(cert.hudState.defeatGlyphBanner, '᚛-ᚙ-ᚚ-ᚐ-᚜');
    assert.equal(cert.hudState.totalHonorDisplayed, 2950);
  });

  it('Chantier 9: HumanQaPredatorBadlands2025CloneVaultMasterAuditor full certification & WebGL draw calls <= 300 invariant', () => {
    const auditor = new HumanQaPredatorBadlands2025CloneVaultMasterAuditor();
    const result = auditor.runFullCertification();
    assert.equal(result.allSectorsCertified, true);
    assert.equal(result.rule3StrictVerified, true);
    assert.equal(result.webglDrawCalls.withinBudget, true);
    assert.ok(result.webglDrawCalls.estimated <= 300);
  });

  it('Chantier 10: AudioSynthesizer procedural acoustic functions and 15 v200 SFX triggers', () => {
    const synth = audioSynth;
    const wreckAcoustics = synth.computeAncientYautjaHoloLogResonanceAcoustics({
      claspResonanceHz: 528,
      holoPlaytimeSeconds: 46
    });
    assert.equal(wreckAcoustics.carrierHarmonicHz, 1188);
    assert.ok(wreckAcoustics.reverbTailSeconds >= 2.5);
    assert.ok(wreckAcoustics.spectralClarityRatio > 0.95);

    const budDecoyAcoustics = synth.computeBudSubfloorVentEchoDecoyAcoustics({
      amplifiedCaveResonanceDb: 102,
      travelDistanceMeters: 36
    });
    assert.ok(budDecoyAcoustics.pseudoKaliskFundamentalHz > 120);
    assert.ok(budDecoyAcoustics.ductWaveguideGain > 0.8);
    assert.ok(budDecoyAcoustics.echoSpreadMeters > 50);

    const sfxMethods = [
      'playAncientYautjaBulkheadResonanceSFX',
      'playElderHoloLogDecodeChimeSFX',
      'playAncientCombiSpearTelescopeLockSFX',
      'playHydraPitcherVenomSpinDeflectSFX',
      'playBasaltChasmWallRunMethaneIgniteSFX',
      'playCryoDefoliantIntakeVentChillSFX',
      'playCompressorRotorFemurSeizeSFX',
      'playCryoDefoliantTankBarracksRuptureSFX',
      'playYautjaClickBudCommandSFX',
      'playBudAmmoDepotAmplifiedRoarDecoySFX',
      'playTessaConsciousnessUploadBlockSFX',
      'playCryoRackPowerBusSpearSeverSFX',
      'playGennaTotalEclipseCoronaHumSFX',
      'playAdultKaliskDistantApexSaluteSFX',
      'playPredatorBadlandsCloneVaultNuclearPurgeSFX'
    ];

    for (const method of sfxMethods) {
      assert.equal(typeof synth[method], 'function', `Missing SFX method: ${method}`);
      assert.doesNotThrow(() => synth[method]());
    }
  });
});
