import test from 'node:test';
import assert from 'node:assert/strict';

import { audioSynth } from '../src/AudioSynthesizer.js';
import { LosAngelesStormDrainPumpingStationSector } from '../src/gameplay/LosAngelesStormDrainPumpingStationSector.js';
import { BouvetoyaGlacialChasmSnowBridgeSector } from '../src/gameplay/BouvetoyaGlacialChasmSnowBridgeSector.js';
import { ComancheNightRainCampAmbushSector } from '../src/gameplay/ComancheNightRainCampAmbushSector.js';
import { StargazerExosuitHangarBipedalMechSector } from '../src/gameplay/StargazerExosuitHangarBipedalMechSector.js';
import { ValVerdeCanopyTreetopPursuitSector } from '../src/gameplay/ValVerdeCanopyTreetopPursuitSector.js';
import { HumanQaAcousticSensorPulseHUDDirector } from '../src/gameplay/HumanQaAcousticSensorPulseHUDDirector.js';
import { HumanQaDiegeticExplosionSootWipeAuditor } from '../src/gameplay/HumanQaDiegeticExplosionSootWipeAuditor.js';
import { HumanQaGameplayJudoCombiCounterThrowAuditor } from '../src/gameplay/HumanQaGameplayJudoCombiCounterThrowAuditor.js';
import { HumanQaLevelDesignViolentHydroCurrentAuditor } from '../src/gameplay/HumanQaLevelDesignViolentHydroCurrentAuditor.js';

test('Chantier 1 (v168): LosAngelesStormDrainPumpingStationSector operates motorized sluice gate, models submerged combi-stick melee drag, and resolves grate debris impact', () => {
  const sector = new LosAngelesStormDrainPumpingStationSector({
    waterFlowRateLpm: 40000.0,
    channelWaterDepthM: 1.8
  });

  // Open motorized sluice gate
  const sluice = sector.operateMotorizedSluiceGate(true);
  assert.equal(sluice.success, true);
  assert.equal(sluice.sluiceGateOpen, true);
  assert.equal(sluice.flowVelocityMps, 6.2);
  assert.ok(sluice.acousticRumbleDecibels > 90);

  // Submerged Combi-stick melee (hydrodynamic staff low drag)
  const combiMelee = sector.resolveSubmergedWeaponMelee('COMBI_STICK', 18.0);
  assert.equal(combiMelee.submergedCombatActive, true);
  assert.equal(combiMelee.isHydrodynamicStaff, true);
  assert.ok(combiMelee.effectiveSwingVelocityMps >= 15.0);

  // Grate debris impact
  const grate = sector.resolveFiltrationGrateImpact(150.0, 5.0);
  assert.ok(grate.impactEnergyJoules > 1800);
  assert.ok(grate.filtrationGrateIntegrity < 1.0);
});

test('Chantier 2 (v168): BouvetoyaGlacialChasmSnowBridgeSector triggers snow bridge collapse under heavy weight (>220 kg), emergency ice grapple anchoring, and falling stalactite impact', () => {
  const sector = new BouvetoyaGlacialChasmSnowBridgeSector({
    chasmDepthM: 50.0,
    snowBridgeMaxCapacityKg: 220.0
  });

  // Heavy armored sprint across fragile bridge triggers collapse
  const cross = sector.crossSnowBridge(240.0, true);
  assert.equal(cross.triggersCollapse, true);
  assert.equal(cross.snowBridgeCollapsed, true);
  assert.equal(cross.fallIntoChasmRisk, true);

  // Emergency ice grapple anchor arrest
  const anchor = sector.anchorEmergencyIceGrapple(8.5);
  assert.equal(anchor.success, true);
  assert.equal(anchor.grappleAnchoredToIce, true);
  assert.equal(anchor.savedFromBottomlessFall, true);

  // Stalactite fall impact
  const stalactite = sector.resolveStalactiteFallImpact(120.0, 22.0);
  assert.ok(stalactite.impactKineticEnergyJoules > 20000);
  assert.ok(stalactite.piercingDamage > 250);
});

test('Chantier 3 (v168): ComancheNightRainCampAmbushSector ignites buffalo hide teepees, models mud camouflage rain erosion (12 mm/hr), and resolves wet melee clashing', () => {
  const sector = new ComancheNightRainCampAmbushSector({
    rainIntensityMmHr: 12.0,
    teepeeCount: 8
  });

  // Fire arrow ignition
  const fire = sector.igniteTeepeeFire(650);
  assert.equal(fire.ignited, true);
  assert.equal(fire.burningTeepeesCount, 1);
  assert.ok(fire.thermalIlluminationRadiusM > 8.0);

  // Rain washing mud camouflage
  const wash = sector.washMudCamouflageUnderRain(1.0, 10.0);
  assert.ok(wash.remainingMudIntegrity < 1.0);
  assert.ok(wash.rainThrumDecibels > 70);

  // Wet melee clash in rain
  const clash = sector.resolveWetMeleeClash(45);
  assert.equal(clash.clashSuccessful, true);
  assert.equal(clash.sparkExtinguishedByRain, true);
});

test('Chantier 4 (v168): StargazerExosuitHangarBipedalMechSector fires dual 20mm rotary vulcan cannons (3500 rpm), EMP pulse grenade disables guidance, and overloads micro-fusion reactor core', () => {
  const sector = new StargazerExosuitHangarBipedalMechSector({
    mechArmorHealth: 2400.0,
    rotaryVulcanRpm: 3500.0
  });

  // Fire rotary vulcan cannons
  const barrage = sector.fireRotaryVulcanBarrage(1.2);
  assert.equal(barrage.fired, true);
  assert.equal(barrage.roundsFired, 70);
  assert.ok(barrage.barrageDamage > 1000);

  // EMP grenade stun
  const emp = sector.detonateEmpGrenadeOnMech(2.5);
  assert.equal(emp.success, true);
  assert.equal(emp.mechEmpStunned, true);
  assert.ok(emp.stunDurationSec >= 4.0);

  // Reactor core overload
  const overload = sector.triggerReactorCoreOverload();
  assert.equal(overload.reactorOverloaded, true);
  assert.equal(overload.blastRadiusM, 25.0);
  assert.ok(overload.catastrophicDamage > 800);
});

test('Chantier 5 (v168): ValVerdeCanopyTreetopPursuitSector executes tree crown branch leap, evaluates canopy camouflage concealment (98%), and resolves vertical plunge drop (22 m/s)', () => {
  const sector = new ValVerdeCanopyTreetopPursuitSector({
    canopyElevationM: 25.0,
    branchLoadCapacityKg: 260.0
  });

  // Treetop branch leap
  const leap = sector.executeTreetopBranchLeap(6.5, 160.0);
  assert.equal(leap.success, true);
  assert.equal(leap.branchHolds, true);
  assert.equal(leap.branchSnapped, false);

  // Concealment rating in foliage
  const concealment = sector.evaluateCanopyConcealment(true);
  assert.equal(concealment.totalConcealmentRatio, 0.98);
  assert.ok(concealment.groundObserverDetectionRangeM < 2.0);

  // Canopy plunge drop assassination
  const plunge = sector.executeCanopyPlungeDrop(0.0);
  assert.equal(plunge.fallHeightM, 25.0);
  assert.ok(plunge.impactVelocityMps > 21.0);
  assert.equal(plunge.executionDamage, 650);
});

test('Chantier 6 & Audit QA #1 (v168): HumanQaAcousticSensorPulseHUDDirector registers sound emissions, calculates polar bearing and decibels, and toggles frequency filter profiles', () => {
  const director = new HumanQaAcousticSensorPulseHUDDirector({
    sensorGainDb: 24.0,
    activeFilterProfile: 'ALL_SPECTRUM'
  });

  // Register heartbeat sound event at (5, 10)
  const sound = director.registerSoundEmission({
    id: 'heartbeat-human-prey',
    sourceX: 5,
    sourceY: 10,
    rawDecibels: 42,
    frequencyHz: 65,
    type: 'HEARTBEAT'
  }, { x: 0, y: 0 });

  assert.equal(sound.audible, true);
  assert.ok(sound.distanceM > 10.0);
  assert.ok(sound.bearingDeg > 0);
  assert.ok(sound.receivedDb > 25.0);

  // Set filter profile to HEARTBEAT
  const filter = director.setFilterProfile('HEARTBEAT');
  assert.equal(filter.activeFilterProfile, 'HEARTBEAT');
  assert.equal(filter.filterBand.highCutHz, 100);

  const view = director.updateHudAcousticView(null);
  assert.equal(typeof view.rendered, 'boolean');
});

test('Chantier 7 & Audit QA #2 (v168): AudioSynthesizer computes glacial ice shatter acoustics, high-flow sluice hydro acoustics, and exposes 15 v168 procedural audio methods', () => {
  assert.ok(typeof audioSynth.computeGlacialIceShatterAcoustics === 'function');
  assert.ok(typeof audioSynth.computeHighFlowSluiceGateHydroAcoustics === 'function');

  const ice = audioSynth.computeGlacialIceShatterAcoustics(120, 25.0);
  assert.equal(ice.iceMassKg, 120);
  assert.ok(ice.impactVelocityMps > 20.0);
  assert.ok(ice.fracturePeakHz > 3000);
  assert.ok(ice.iceShatterDecibels > 95);

  const hydro = audioSynth.computeHighFlowSluiceGateHydroAcoustics(40000, 8.5);
  assert.equal(hydro.flowRateLpm, 40000);
  assert.ok(hydro.hydroPowerKw > 50.0);
  assert.ok(hydro.turbulentNoiseDb > 95);

  const v168AudioMethods = [
    'playStormDrainSluiceTorrentRush',
    'playSluiceMetalGateClank',
    'playGlacialSnowBridgeCollapseCrumble',
    'playIceStalactiteShatterCrash',
    'playIceGrappleAnchorChink',
    'playComancheFireArrowIgnitionWhoosh',
    'playBuffaloHideTeepeeRainThrum',
    'playStargazerBipedalMechFootstepClank',
    'playRotaryVulcan20mmBurstRoar',
    'playMechReactorCoreOverloadWhine',
    'playCanopyTreetopBranchCreak',
    'playJungleBranchSnapPlunge',
    'playAcousticPulseSonarPing',
    'playJudoCombiCounterThrowThud',
    'playHydrodynamicCurrentDriftRoar'
  ];

  for (const method of v168AudioMethods) {
    assert.ok(typeof audioSynth[method] === 'function', `Method ${method} must exist on audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  }
});

test('Chantier 8 & Audit QA #3 (v168): HumanQaDiegeticExplosionSootWipeAuditor deposits blast soot on visor optics, simulates gauntlet wiper clearing (85%), and models rain washing', () => {
  const auditor = new HumanQaDiegeticExplosionSootWipeAuditor({
    wipeClearRatio: 0.85,
    rainWashSpeedPerSec: 0.03
  });

  // Explosion deposits soot
  const blast = auditor.registerBlastSootDeposition(3.0, 2.5);
  assert.equal(blast.sootDeposited, true);
  assert.ok(blast.currentSootOpacity > 0.4);
  assert.equal(blast.opticViewImpaired, true);

  // Manual gauntlet wipe gesture
  const wipe = auditor.wipeVisorSoot();
  assert.equal(wipe.success, true);
  assert.ok(wipe.clearedAmount > 0.3);
  assert.ok(wipe.remainingSootOpacity < 0.2);

  // Rain wash
  const rain = auditor.tickRainWash(10.0, true);
  assert.equal(rain.washedByRain, true);

  const styles = auditor.applyDiegeticSootStyles(null);
  assert.equal(typeof styles.stylesApplied, 'boolean');
});

test('Chantier 9 & Audit QA #4 (v168): HumanQaGameplayJudoCombiCounterThrowAuditor enters counter stance, executes 160ms timing window, redirects charge momentum, and slams target for 210+ damage', () => {
  const auditor = new HumanQaGameplayJudoCombiCounterThrowAuditor({
    counterWindowMs: 160.0,
    baseSlamDamage: 210.0
  });

  auditor.enterCounterStance(1000);

  const chargingHound = { id: 'hell-hound-alpha', massKg: 140, chargeSpeedMps: 14.0, rawDamage: 120, health: 400 };
  const counter = auditor.resolveChargeCounterThrow(1090, chargingHound);

  assert.equal(counter.counterSuccess, true);
  assert.equal(counter.damageTaken, 0); // 100% damage negated
  assert.ok(counter.totalSlamDamage >= 210);
  assert.equal(chargingHound.isKnockedDown, true);
  assert.equal(chargingHound.knockdownDurationSec, 2.0);
  assert.equal(counter.hunterIFramesGrantedMs, 180);
});

test('Chantier 10 & Audit QA #5 (v168): HumanQaLevelDesignViolentHydroCurrentAuditor computes fluid drag forces (8294 N), leaping trajectory deflection, and bedrock combi-stick anchor holding', () => {
  const auditor = new HumanQaLevelDesignViolentHydroCurrentAuditor({
    currentSpeedMps: 4.8,
    waterDensityKgM3: 1000.0,
    channelDepthM: 1.6
  });

  // Drag force in violent current
  const drag = auditor.computeCurrentDragForce(0.8, 0.9);
  assert.ok(drag.dragForceNewtons > 5000);
  assert.equal(drag.sweptDownstream, true);
  assert.ok(drag.downstreamDriftSpeedMps > 3.0);

  // Leap deflection across channel
  const leap = auditor.computeLeapTrajectoryDeflection(8.0, 90.0);
  assert.ok(leap.downstreamDriftM > 1.5);
  assert.ok(leap.deflectionAngleDeg > 12.0);

  // Bedrock combi-stick anchor holding
  const anchor = auditor.setCombiStickBedrockAnchor(true);
  assert.equal(anchor.isAnchored, true);
  assert.equal(anchor.maxHoldingForceN, 3500);
  assert.equal(anchor.downstreamDriftPrevented, true);
});
