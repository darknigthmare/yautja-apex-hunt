import test from 'node:test';
import assert from 'node:assert/strict';

import { Predator2MeatLockerNitrogenAmbushSector } from '../src/gameplay/Predator2MeatLockerNitrogenAmbushSector.js';
import { Predator2SubwayStrobeMassacreSector } from '../src/gameplay/Predator2SubwayStrobeMassacreSector.js';
import { Predator2KingWillieAlleyDuelSector } from '../src/gameplay/Predator2KingWillieAlleyDuelSector.js';
import { Predator2UrbanPlasmacasterPredictiveSector } from '../src/gameplay/Predator2UrbanPlasmacasterPredictiveSector.js';
import { Predator2EasternColumbiaRooftopGargoyleSector } from '../src/gameplay/Predator2EasternColumbiaRooftopGargoyleSector.js';
import { Predator2BathroomMedicompSurgerySector } from '../src/gameplay/Predator2BathroomMedicompSurgerySector.js';
import { Predator2UndergroundLostTrophyShipSector } from '../src/gameplay/Predator2UndergroundLostTrophyShipSector.js';
import { HumanQaPredator2TacticalHUDDirector } from '../src/gameplay/HumanQaPredator2TacticalHUDDirector.js';
import { HumanQaPredator2LosAngelesAuditor } from '../src/gameplay/HumanQaPredator2LosAngelesAuditor.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('v178 Chantier LD 1: Predator2MeatLockerNitrogenAmbushSector discharges nitrogen fog, blinds infrared, and tracks OWLF via UV spectrum', () => {
  const sector = new Predator2MeatLockerNitrogenAmbushSector({ roomTempC: -18.0 });

  const spray = sector.dischargeLiquidNitrogenSpray(12.0);
  assert.strictEqual(spray.success, true);
  assert.strictEqual(spray.nitrogenGasActive, true);
  assert.strictEqual(spray.cityHunterFrostedVisible, true);
  assert.strictEqual(spray.infraredVisionBlindedByColdVapor, true);

  // Standard infrared is blinded
  const irVision = sector.evaluateSlaughterhouseVisionMode('STANDARD_INFRARED');
  assert.strictEqual(irVision.targetAcquired, false);
  assert.strictEqual(irVision.reason, 'THERMAL_WHITEOUT_SUB_ZERO_VAPOR');

  // Ultraviolet / Electromagnetic tracks battery packs
  const uvVision = sector.evaluateSlaughterhouseVisionMode('ULTRAVIOLET_ELECTROMAGNETIC');
  assert.strictEqual(uvVision.targetAcquired, true);
  assert.strictEqual(uvVision.detectionConfidencePct, 98);

  // Smart disc slice through carcasses
  const disc = sector.throwSmartDiscThroughCarcasses(42.0);
  assert.strictEqual(disc.success, true);
  assert.ok(disc.carcassesSliced >= 5);
  assert.ok(disc.owlfNeutralized >= 1);
});

test('v178 Chantier LD 2: Predator2SubwayStrobeMassacreSector executes 4Hz strobe lighting and fetal scan (140 bpm) triggering honor taboo', () => {
  const sector = new Predator2SubwayStrobeMassacreSector({ trainSpeedKmh: 70.0, strobeFrequencyHz: 4.0 });

  const state = sector.getCarriageAtmosphericState();
  assert.strictEqual(state.trainSpeedKmh, 70.0);
  assert.strictEqual(state.strobeFrequencyHz, 4.0);
  assert.strictEqual(state.intermittentDarknessMs, 125);

  // Scan Detective Leona Cantrell: fetus detected at 140 bpm -> honor code forbids kill
  const leonaScan = sector.executeBioMaskPhysiologicalScan('LEONA_CANTRELL');
  assert.strictEqual(leonaScan.gestationDetected, true);
  assert.strictEqual(leonaScan.embryonicHeartRateBpm, 140);
  assert.strictEqual(leonaScan.mandatedAction, 'RELEASE_UNHARMED_PREGNANT_FEMALE');
  assert.strictEqual(leonaScan.yautjaHonorCodeViolationIfKilled, true);

  // Scan armed combatant Jerry Lambert
  const jerryScan = sector.executeBioMaskPhysiologicalScan('JERRY_LAMBERT');
  assert.strictEqual(jerryScan.gestationDetected, false);
  assert.strictEqual(jerryScan.mandatedAction, 'ENGAGE_HONORABLE_ARMED_COMBATANT');

  // Jerry Lambert's last stand
  const lastStand = sector.resolveJerryLambertLastStand(15);
  assert.strictEqual(lastStand.success, true);
  assert.strictEqual(lastStand.jerryClaimedAsTrophy, true);
  assert.strictEqual(lastStand.trophyType, 'SPINE_AND_SKULL_TROPHY');
});

test('v178 Chantier LD 3: Predator2KingWillieAlleyDuelSector tracks puddle reflections, unsheathes cane sword, and executes decapitation with blue acid skull prep', () => {
  const sector = new Predator2KingWillieAlleyDuelSector();

  // Puddle reflection
  const puddle = sector.detectPuddleReflection();
  assert.strictEqual(puddle.success, true);
  assert.strictEqual(puddle.puddleReflectionRevealed, true);
  assert.strictEqual(puddle.hunterElevationM, 4.5);

  // Cannot decapitate an unarmed opponent (honor code)
  const premature = sector.executeDecapitationAndHarvestSkull();
  assert.strictEqual(premature.success, false);

  // King Willie draws sword
  const sword = sector.unsheatheCaneSword();
  assert.strictEqual(sword.success, true);
  assert.strictEqual(sword.weaponType, 'CONCEALED_SILVER_CANE_SWORD');

  // Decapitation and acid ritual
  const duel = sector.executeDecapitationAndHarvestSkull();
  assert.strictEqual(duel.success, true);
  assert.strictEqual(duel.strikeType, 'COMBISTICK_CLEAN_DECAPITATION');
  assert.strictEqual(duel.trophyPrepMethod, 'YAUTJA_BLUE_ACID_BATH');
  assert.strictEqual(duel.trophyItemAcquired, 'KING_WILLIE_SKULL_TROPHY');
});

test('v178 Chantier LD 4: Predator2UrbanPlasmacasterPredictiveSector computes lead intercept vectors against moving LAPD squad cars and resolves structural impacts', () => {
  const sector = new Predator2UrbanPlasmacasterPredictiveSector({ plasmaBoltSpeedMps: 145.0 });

  // Moving squad car at 60m, 22 m/s (approx 80 km/h), 90 deg crossing angle
  const lead = sector.computePredictiveLeadIntercept(60.0, 22.0, 90.0);
  assert.ok(lead.timeOfFlightSec > 0.4 && lead.timeOfFlightSec < 0.45);
  assert.ok(lead.leadDistanceM > 8.0 && lead.leadDistanceM < 10.0);
  assert.ok(lead.interceptProbabilityPct >= 90);

  // Resolve impact on car engine block
  const impact = sector.resolveUrbanPlasmaImpact('LAPD_SQUAD_CAR_ENGINE', 145.0);
  assert.strictEqual(impact.catastrophicExplosion, true);
  assert.strictEqual(impact.craterDiameterCm, 65);
  assert.strictEqual(impact.structuralDamageJoules, 34000);
});

test('v178 Chantier LD 5: Predator2EasternColumbiaRooftopGargoyleSector scales 40-story terracotta façade and triggers lightning trophy ritual and victory roar', () => {
  const sector = new Predator2EasternColumbiaRooftopGargoyleSector({ roofElevationM: 140.0 });

  // Scale façade
  const climb = sector.scaleTerracottaFaçade(3.5);
  assert.strictEqual(climb.success, true);
  assert.strictEqual(climb.façadeMaterial, 'TURQUOISE_GLAZED_TERRACOTTA');

  // Must perch before ritual
  const premature = sector.executeLightningTrophyRitual();
  assert.strictEqual(premature.success, false);

  // Perch on gargoyle
  const perch = sector.perchOnCornerGargoyle();
  assert.strictEqual(perch.success, true);
  assert.strictEqual(perch.perchElevationM, 146.0);

  // Lightning ritual
  const ritual = sector.executeLightningTrophyRitual();
  assert.strictEqual(ritual.success, true);
  assert.strictEqual(ritual.lightningStrikeActive, true);
  assert.strictEqual(ritual.victoryHowlEmitted, true);
  assert.strictEqual(ritual.thunderclapAcousticDb, 120);
});

test('v178 Chantier LD 6: Predator2BathroomMedicompSurgerySector grinds blue crystals and mirror glass with mortar/pestle, cauterizing stump and restoring +45 HP', () => {
  const sector = new Predator2BathroomMedicompSurgerySector();
  assert.strictEqual(sector.hunterHealth, 30);

  // Cannot grind before opening kit
  const premature = sector.grindMedicompHealingPaste();
  assert.strictEqual(premature.success, false);

  // Breach window & open kit
  const breach = sector.breachBathroomAndOpenMedicomp();
  assert.strictEqual(breach.success, true);
  assert.strictEqual(breach.medicompKitOpened, true);
  assert.ok(breach.instrumentsAvailable.includes('MINIATURE_MORTAR_PESTLE'));

  // Grind blue crystals & glass
  const paste = sector.grindMedicompHealingPaste();
  assert.strictEqual(paste.success, true);
  assert.strictEqual(paste.pasteColor, '#00b0ff');
  assert.strictEqual(paste.chemicalReactionTempC, 380.0);

  // Apply cauterizing paste
  const surgery = sector.applyCausticCauterizationToStump();
  assert.strictEqual(surgery.success, true);
  assert.strictEqual(surgery.healthRestored, 45);
  assert.strictEqual(surgery.hunterHealthRemaining, 75);
  assert.strictEqual(surgery.arterialHemorrhageSealed, true);
  assert.strictEqual(surgery.agonizedScreamAcousticDb, 102);
});

test('v178 Chantier LD 7: Predator2UndergroundLostTrophyShipSector inspects Xenomorph trophy, decloaks Lost Tribe, and awards Raphael Adolini 1715 flintlock', () => {
  const sector = new Predator2UndergroundLostTrophyShipSector();

  // Inspect trophy wall
  const inspection = sector.inspectMothershipTrophyWall();
  assert.strictEqual(inspection.success, true);
  assert.strictEqual(inspection.xenomorphSkullConfirmed, true);

  // Harrigan defeats City Hunter
  const defeat = sector.resolveCityHunterDeath();
  assert.strictEqual(defeat.success, true);
  assert.strictEqual(defeat.weaponUsed, 'RETRIEVED_SMART_DISC');

  // Lost Tribe uncloaks
  const uncloak = sector.revealLostTribeFromShadows();
  assert.strictEqual(uncloak.success, true);
  assert.strictEqual(uncloak.elderLeader, 'ELDER_GREYBACK');

  // Elder Greyback awards Raphael Adolini 1715 flintlock
  const award = sector.awardRaphaelAdoliniFlintlock();
  assert.strictEqual(award.success, true);
  assert.strictEqual(award.engravingText, 'Raphael Adolini 1715');
  assert.strictEqual(award.elderQuote, 'Take it...');

  // Takeoff
  const takeoff = sector.launchMothershipTakeoff();
  assert.strictEqual(takeoff.success, true);
  assert.strictEqual(takeoff.mothershipLiftedOff, true);
  assert.strictEqual(takeoff.campaignCompleted, true);
});

test('v178 Chantier LD 8: HumanQaPredator2TacticalHUDDirector evaluates 5 human QA audits and mounts Predator 2 Urban HUD panel', () => {
  const director = new HumanQaPredator2TacticalHUDDirector();

  const auditTelemetry = director.evaluate5Predator2Audits();
  assert.strictEqual(auditTelemetry.auditsCount, 5);
  assert.strictEqual(auditTelemetry.allPassed, true);
  assert.strictEqual(auditTelemetry.compositeUXScore, 99.5);

  const mountResult = director.mountPredator2HUD();
  assert.strictEqual(mountResult.mounted, true);
  assert.strictEqual(mountResult.panelClass, 'predator2-urban-hud-panel');
  assert.ok(mountResult.subWidgets.includes('meat-locker-nitrogen-vapor-meter'));
  assert.ok(mountResult.subWidgets.includes('subway-fetal-heartbeat-scanner'));
  assert.ok(mountResult.subWidgets.includes('lost-tribe-honor-flintlock-badge'));
});

test('v178 Chantier LD 9: AudioSynthesizer computes nitrogen ablation & mothership antigrav acoustics and executes 15 new Predator 2 SFX methods', () => {
  // Test mathematical acoustics
  const nitrogenAcoustics = audioSynth.computeNitrogenGasThermalAblationAcoustics(12.0, 24.0, -196.0);
  assert.strictEqual(nitrogenAcoustics.nozzlePressureBar, 24.0);
  assert.ok(nitrogenAcoustics.cavitationHissFrequencyHz > 3000);
  assert.strictEqual(nitrogenAcoustics.thermalShockIndex, 0.94);

  const mothershipAcoustics = audioSynth.computeMothershipAntigravLiftAcoustics(1800.0, 0.95, 15.0);
  assert.strictEqual(mothershipAcoustics.shipMassTonnes, 1800.0);
  assert.strictEqual(mothershipAcoustics.infrasonicHoverFundamentalHz, 20);
  assert.strictEqual(mothershipAcoustics.antigravHumFrequencyHz, 118.0);

  // Test 15 procedural audio methods exist and don't throw
  const audioMethods = [
    'playNitrogenGasSprayHiss',
    'playFrozenMeatCarcassImpactThud',
    'playSubwayTrackClickClackRhythm',
    'playSubwayFlickeringFluorescentStrobe',
    'playFetalHeartbeatBioScan',
    'playKingWillieSwordDrawZing',
    'playKingWillieDecapitationCleanSlash',
    'playEasternColumbiaLightningThunderclap',
    'playCityHunterVictoryHowlRoar',
    'playMedicompGlassMortarGrind',
    'playMedicompBluePasteBurnScream',
    'playSmartDiscWallRicochetZip',
    'playLostTribeCloakRevealHum',
    'playRaphaelAdoliniFlintlockCock',
    'playYautjaSpaceshipSubterraneanTakeoffRumble'
  ];

  audioMethods.forEach((method) => {
    assert.strictEqual(typeof audioSynth[method], 'function', `${method} should be a function`);
    assert.doesNotThrow(() => audioSynth[method]());
  });
});

test('v178 Chantier LD 10: HumanQaPredator2LosAngelesAuditor audits nitrogen ambush, subway strobe, duel, predictive aiming, medicomp, and generates report', () => {
  const auditor = new HumanQaPredator2LosAngelesAuditor();

  const audit1 = auditor.auditMeatLockerAmbush({ nitrogenFogActive: true, uvFlashlightTracking: true, thermalAblationRate: 0.85 });
  assert.strictEqual(audit1.passes, true);

  const audit2 = auditor.auditSubwayStrobeAndPregnancyScan({ strobeFreqHz: 4.0, fetalHeartbeatDetected: true, sparePregnantTarget: true });
  assert.strictEqual(audit2.passes, true);

  const audit3 = auditor.auditKingWillieAlleyDuel({ alleyPuddleReflections: true, swordClashDeflected: true, cleanDecapitation: true });
  assert.strictEqual(audit3.passes, true);

  const audit4 = auditor.auditPredictiveTriLaserTargeting({ leadTimeS: 0.45, targetSpeedKmh: 60, vectorCalculated: true });
  assert.strictEqual(audit4.passes, true);

  const audit5 = auditor.auditEasternColumbiaRooftopGargoyleClimb({ buildingHeightStories: 40, gargoylePerchReached: true, lightningRodTrophyHoisted: true });
  assert.strictEqual(audit5.passes, true);

  const audit6 = auditor.auditBathroomMedicompSurgery({ mortarPestleUsed: true, blueCrystalPounded: true, woundCauterized: true });
  assert.strictEqual(audit6.passes, true);

  const audit7 = auditor.auditUndergroundLostTrophyShip({ xenomorphSkullOnWall: true, flintlockInscription: 'Raphael Adolini 1715', lostTribeDeparture: true });
  assert.strictEqual(audit7.passes, true);

  const report = auditor.generateConsolidatedPredator2Report();
  assert.strictEqual(report.version, 'v178');
  assert.strictEqual(report.totalAuditsExecuted, 7);
  assert.strictEqual(report.passedCount, 7);
  assert.strictEqual(report.compliancePct, 100);
  assert.ok(report.drawCallsInvariant.includes('<= 300'));
});
