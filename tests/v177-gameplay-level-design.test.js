import test from 'node:test';
import assert from 'node:assert/strict';

import { ValVerdePlasmaBoltThermalBallisticsSector } from '../src/gameplay/ValVerdePlasmaBoltThermalBallisticsSector.js';
import { ValVerdeCanopyHighwayAcrobaticSector } from '../src/gameplay/ValVerdeCanopyHighwayAcrobaticSector.js';
import { ValVerdeYautjaDefeatSelfDestructCinematicSector } from '../src/gameplay/ValVerdeYautjaDefeatSelfDestructCinematicSector.js';
import { ValVerdeRiverbankDetonationCordSector } from '../src/gameplay/ValVerdeRiverbankDetonationCordSector.js';
import { ValVerdeCanopyTrophyRoostSector } from '../src/gameplay/ValVerdeCanopyTrophyRoostSector.js';
import { ValVerdeMultispectralThermalOpticsSector } from '../src/gameplay/ValVerdeMultispectralThermalOpticsSector.js';
import { ValVerdeAerialRootSuspensionBridgeSector } from '../src/gameplay/ValVerdeAerialRootSuspensionBridgeSector.js';
import { HumanQaValVerdePlasmaCanopyHUDDirector } from '../src/gameplay/HumanQaValVerdePlasmaCanopyHUDDirector.js';
import { HumanQaValVerdePlasmaCanopyAuditor } from '../src/gameplay/HumanQaValVerdePlasmaCanopyAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v177 Chantier LD 1: ValVerdePlasmaBoltThermalBallisticsSector evaluates 18,500J plasma ablation cratering and capacitor heatsink cooling', () => {
  const sector = new ValVerdePlasmaBoltThermalBallisticsSector({ plasmaBoltSpeedMps: 145.0 });

  // Fire plasmacaster bolt into hardwood trunk
  const shot = sector.dischargePlasmacasterBolt(25.0, 'HARDWOOD_TRUNK');
  assert.equal(shot.success, true);
  assert.equal(shot.craterDiameterCm, 35);
  assert.equal(shot.kineticThermalYieldJ, 18500);
  assert.equal(shot.splashRadiusM, 3.2);
  assert.ok(shot.capacitorHeatPct >= 40.0);

  // Cool capacitor
  const cooling = sector.updateCapacitorCooling(1.8);
  assert.ok(cooling.capacitorHeatPct <= 15.0);
  assert.equal(cooling.readyToFire, true);
});

test('v177 Chantier LD 2: ValVerdeCanopyHighwayAcrobaticSector models 22m canopy master branches, brittle twig snaps, and 14m leaps', () => {
  const sector = new ValVerdeCanopyHighwayAcrobaticSector({ highwayElevationM: 22.0 });

  // Walk on heavy bearing bough (silent predatory stalking)
  const heavy = sector.traverseCanopyBough('HEAVY_BEARING_BOUGH', 8.0);
  assert.equal(heavy.success, true);
  assert.equal(heavy.boughSnapped, false);
  assert.ok(heavy.acousticFootstepDb <= 28);

  // Step on brittle twig (snaps and alerts)
  const brittle = sector.traverseCanopyBough('BRITTLE_TWIG_ZONE', 4.0);
  assert.equal(brittle.boughSnapped, true);
  assert.equal(brittle.acousticFootstepDb, 64);

  // Execute 14m acrobatic leap
  const leap = sector.executeCanopyAcrobaticLeap(14.0);
  assert.equal(leap.success, true);
  assert.equal(leap.leapDistanceM, 14.0);
  assert.equal(leap.landingBranchType, 'HEAVY_BEARING_BOUGH');
  assert.equal(leap.stealthMaintained, true);
});

test('v177 Chantier LD 3: ValVerdeYautjaDefeatSelfDestructCinematicSector activates ONLY upon Yautja defeat pinned under deadfall', () => {
  const sector = new ValVerdeYautjaDefeatSelfDestructCinematicSector({ playerRole: 'YAUTJA' });

  // Non-qualifying condition: healthy, not pinned
  const nonQual = sector.evaluateDefeatCondition(false, 100);
  assert.equal(nonQual.qualifiesForSelfDestruct, false);

  // Qualifying condition: player is Yautja, pinned under deadfall, health critical
  const qualify = sector.evaluateDefeatCondition(true, 0);
  assert.equal(qualify.qualifiesForSelfDestruct, true);
  assert.equal(qualify.status, 'QUALIFIED_FOR_RITUAL_SELF_DESTRUCT');

  // Initiate sequence: pneumatic mask release
  const maskRelease = sector.initiateDefeatSelfDestructSequence();
  assert.equal(maskRelease.success, true);
  assert.equal(maskRelease.unmaskedFaceRevealed, true);
  assert.equal(maskRelease.maskHosesDepressurized, true);

  // Activate gauntlet glyphs and Billy's mimicked laugh
  const gauntlet = sector.activateGauntletGlyphCountDown();
  assert.equal(gauntlet.success, true);
  assert.equal(gauntlet.gauntletCoverSlidOpen, true);
  assert.equal(gauntlet.glowingRedGlyphsActive, true);
  assert.equal(gauntlet.countdownSecondsRemaining, 10);
  assert.equal(gauntlet.mimickedBillyLaughterActive, true);

  // Progress countdown to zero detonation
  const countdown = sector.updateCountdownTick(10.0);
  assert.equal(countdown.isDetonated, true);
  assert.equal(countdown.currentPhase, 'THERMONUCLEAR_OBLITERATION');
  assert.equal(countdown.blastRadiusM, 35.0);
});

test('v177 Chantier LD 4: ValVerdeRiverbankDetonationCordSector arms and triggers 7000 m/s primacord river wall blast', () => {
  const sector = new ValVerdeRiverbankDetonationCordSector({ riverSpanM: 22.0, chargesCount: 4 });
  const status = sector.getTrapStatus();
  assert.equal(status.primacordArmed, true);
  assert.equal(status.chargesCount, 4);

  // Trigger river primacord
  const blast = sector.triggerRiverDetonation(0.5);
  assert.equal(blast.success, true);
  assert.equal(blast.detonationSpeedMps, 7000.0);
  assert.equal(blast.waterGeyserHeightM, 14.5);
  assert.equal(blast.shrapnelCount, 550);
  assert.equal(blast.forcedCloakShortCircuit, true);
});

test('v177 Chantier LD 5: ValVerdeCanopyTrophyRoostSector inspects Hopper skull trophies and polishes uncleaned trophies for honor', () => {
  const sector = new ValVerdeCanopyTrophyRoostSector({ roostElevationM: 26.0 });

  // Inspect roost
  const inspection = sector.inspectCanopyRoost();
  assert.equal(inspection.roostElevationM, 26.0);
  assert.equal(inspection.totalTrophiesCount, 3);
  assert.ok(inspection.totalHonorScore >= 500);
  assert.ok(inspection.salvagedItems.includes('HOPPER_DOG_TAGS'));

  // Polish unpolished skull
  const polish = sector.polishSkullTrophy('trophy-guerrilla-chief');
  assert.equal(polish.success, true);
  assert.equal(polish.polished, true);
  assert.ok(polish.newHonorScore > 120);
});

test('v177 Chantier LD 6: ValVerdeMultispectralThermalOpticsSector cycles 3 vision modes and tracks mud, blood, and electronic targets', () => {
  const sector = new ValVerdeMultispectralThermalOpticsSector();
  assert.equal(sector.activeMode, 'STANDARD_INFRARED_HEAT');

  // Human in mud undetectable on standard infrared
  const mudScan = sector.evaluateTargetAcquisition({ coveredInColdMud: true });
  assert.equal(mudScan.detected, false);

  // Switch to Ultraviolet Fluorescence
  const uvMode = sector.cycleOpticMode('ULTRAVIOLET_FLUORESCENCE');
  assert.equal(uvMode.success, true);
  assert.equal(sector.activeMode, 'ULTRAVIOLET_FLUORESCENCE');

  // Yautja blood trail detected in UV
  const bloodScan = sector.evaluateTargetAcquisition({ bleedingYautjaBlood: true });
  assert.equal(bloodScan.detected, true);
  assert.equal(bloodScan.detectionConfidencePct, 100);

  // Switch to Electrical Resonance
  const elecMode = sector.cycleOpticMode('ELECTRICAL_DIELECTRIC_RESONANCE');
  assert.equal(elecMode.success, true);

  // Radio transmitter detected
  const radioScan = sector.evaluateTargetAcquisition({ carryingActiveRadio: true });
  assert.equal(radioScan.detected, true);
});

test('v177 Chantier LD 7: ValVerdeAerialRootSuspensionBridgeSector traverses 18m living bridge and resolves structural collapse under damage', () => {
  const sector = new ValVerdeAerialRootSuspensionBridgeSector({ bridgeSpanM: 18.0, gorgeDepthM: 24.0 });

  // Traverse bridge safely
  const traverse = sector.traverseRootBridge(2.0, 105.0);
  assert.equal(traverse.success, true);
  assert.ok(traverse.dynamicSwayAngleDeg <= 12.0);
  assert.equal(traverse.bridgeIntegrityPct, 100);

  // Sever 5 supporting root strands
  const sever = sector.severRootStrand(5);
  assert.equal(sever.success, true);
  assert.equal(sever.severedStrands, 5);
  assert.equal(sever.bridgeCollapsed, true);
  assert.equal(sever.dropIntoGorgeTriggered, true);
});

test('v177 Chantier LD 8: HumanQaValVerdePlasmaCanopyHUDDirector evaluates 5 QA audits and mounts Plasma Canopy HUD panel', () => {
  const director = new HumanQaValVerdePlasmaCanopyHUDDirector();

  // Evaluate 5 QA audits
  const qa = director.evaluate5PlasmaCanopyAudits();
  assert.equal(qa.auditsCount, 5);
  assert.equal(qa.allPassed, true);
  assert.ok(qa.compositeUXScore >= 99.0);

  // Mount HUD
  const mount = director.mountPlasmaCanopyHUD();
  assert.equal(mount.mounted, true);
  assert.equal(mount.panelClass, 'valverde-plasma-canopy-hud-panel');
});

test('v177 Chantier LD 9: AudioSynthesizer computes plasmacaster ablation & canopy sway acoustics and executes 15 new SFX methods', () => {
  // Test plasma ablation acoustics
  const plasmaAcoustics = audioSynth.computePlasmacasterBoltAblationAcoustics(18500, 'HARDWOOD_TRUNK', 20.0);
  assert.equal(plasmaAcoustics.plasmaFundamentalHz, 1450);
  assert.ok(plasmaAcoustics.splAtDistanceDb >= 70.0);

  // Test canopy sway acoustics
  const swayAcoustics = audioSynth.computeCanopyBranchDynamicSwayAcoustics(35.0, 195.0, 22.0);
  assert.ok(swayAcoustics.branchResonanceHz > 0);
  assert.ok(swayAcoustics.woodFibreStrainSplDb >= 45.0);

  // Verify all 15 SFX methods
  const v177Sfx = [
    'playPlasmacasterHighEnergyCharge',
    'playPlasmacasterDischargeRoar',
    'playPlasmacasterHardwoodAblationBlast',
    'playPlasmacasterCapacitorVentHiss',
    'playCanopyHeavyBoughGroan',
    'playCanopyAcrobaticBranchLeap',
    'playCanopyBrittleTwigSnap',
    'playYautjaBioMaskPneumaticDepressurize',
    'playYautjaDefeatMandibleHiss',
    'playGauntletCoverSlideClick',
    'playGauntletGlyphCountdownBeep',
    'playDetonationCordWaterWallBlast',
    'playTrophySkullPolishingFriction',
    'playMultispectralLensModeSwitch',
    'playAerialFicusRootBridgeCreak'
  ];

  for (const sfx of v177Sfx) {
    assert.equal(typeof audioSynth[sfx], 'function', `Method ${sfx} must exist`);
    assert.doesNotThrow(() => audioSynth[sfx](), `Method ${sfx} must execute without throwing`);
  }
});

test('v177 Chantier LD 10: HumanQaValVerdePlasmaCanopyAuditor audits plasma ablation, canopy highway leaps, defeat sequence, and generates consolidated report', () => {
  const auditor = new HumanQaValVerdePlasmaCanopyAuditor();

  // Audit plasma ablation
  const plasmaAudit = auditor.auditPlasmacasterBallistics({ craterDiameterCm: 35, kineticThermalYieldJ: 18500 });
  assert.equal(plasmaAudit.passes, true);

  // Audit canopy acrobatic leap
  const canopyAudit = auditor.auditCanopyHighwayAcrobatics({ highwayElevationM: 22.0, branchType: 'HEAVY_BEARING_BOUGH' });
  assert.equal(canopyAudit.passes, true);

  // Audit Yautja defeat self-destruct ritual
  const defeatAudit = auditor.auditYautjaDefeatSelfDestruct({ qualifiesForSelfDestruct: true, playerRole: 'YAUTJA', isPinnedUnderDeadfall: true });
  assert.equal(defeatAudit.passes, true);

  // Consolidated report
  const report = auditor.generateConsolidatedPlasmaCanopyReport();
  assert.equal(report.totalAuditsExecuted, 3);
  assert.equal(report.passedCount, 3);
  assert.equal(report.compliancePct, 100);
});
