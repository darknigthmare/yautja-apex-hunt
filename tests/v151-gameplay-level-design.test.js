import test from 'node:test';
import assert from 'node:assert/strict';

import { GunnisonHospitalRooftopHelipadShowdownSector } from '../src/gameplay/GunnisonHospitalRooftopHelipadShowdownSector.js';
import { UpgradeKineticShockwaveGauntletPunchSystem } from '../src/gameplay/UpgradeKineticShockwaveGauntletPunchSystem.js';
import { VoyageurBisonGraveyardAshFogAmbushSector } from '../src/gameplay/VoyageurBisonGraveyardAshFogAmbushSector.js';
import { YautjaSpinalFluidGeneticExtractorSystem } from '../src/gameplay/YautjaSpinalFluidGeneticExtractorSystem.js';
import { BlainHandheldMinigunDefoliationSuppressionSystem } from '../src/gameplay/BlainHandheldMinigunDefoliationSuppressionSystem.js';
import { SubwayTunnelHighVoltageThirdRailHazardSector } from '../src/gameplay/SubwayTunnelHighVoltageThirdRailHazardSector.js';
import { NolanScavengedYautjaCamouflageRigSystem } from '../src/gameplay/NolanScavengedYautjaCamouflageRigSystem.js';
import { PyramidHieroglyphSlidingStoneDoorMazeSector } from '../src/gameplay/PyramidHieroglyphSlidingStoneDoorMazeSector.js';
import { WristGauntletHolographicTacticalMapProjectorSystem } from '../src/gameplay/WristGauntletHolographicTacticalMapProjectorSystem.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 (v151): GunnisonHospitalRooftopHelipadShowdownSector detonates fuel barrels and disrupts cloak in rain', () => {
  const helipad = new GunnisonHospitalRooftopHelipadShowdownSector();
  const predalien = { id: 'predalien_queen_spawn', x: -5.0, z: 3.5, health: 300, cloakActive: true };

  const res = helipad.detonateHelipadFuelBarrel('barrel_helipad_north', [predalien], audioSynth);
  assert.equal(res.detonated, true);
  assert.deepEqual(res.burnedCombatantIds, ['predalien_queen_spawn']);
  assert.equal(predalien.scorchedByJetFuel, true);
  assert.equal(predalien.cloakActive, false);
});

test('Chantier 2 (v151): UpgradeKineticShockwaveGauntletPunchSystem pulverizes barricades and launches targets', () => {
  const gauntlet = new UpgradeKineticShockwaveGauntletPunchSystem();
  gauntlet.chargeKineticGauntlet(1.0, audioSynth);

  const target = { id: 'armored_merc', distanceMeters: 2.2, health: 160 };
  const wall = { id: 'concrete_barricade_1', destroyed: false };

  const punch = gauntlet.deliverKineticShockwavePunch([target], [wall], 100, audioSynth);
  assert.equal(punch.delivered, true);
  assert.deepEqual(punch.pulverizedObstacleIds, ['concrete_barricade_1']);
  assert.equal(target.launchedAirborne, true);
  assert.equal(target.health, 15);
});

test('Chantier 3 (v151): VoyageurBisonGraveyardAshFogAmbushSector conceals hunter in ash smoke and ambushes trappers', () => {
  const graveyard = new VoyageurBisonGraveyardAshFogAmbushSector();
  const feral = { id: 'feral_predator' };

  const conceal = graveyard.enterAshFogConcealment(feral, 'mound_north_carcass', audioSynth);
  assert.equal(conceal.concealed, true);
  assert.ok(feral.musketAimPenaltyAgainstHunter > 0.7);

  const trapper = { id: 'french_voyageur_1', distanceMeters: 5.5, health: 100 };
  const ambush = graveyard.executeCrossfireAshAmbush(feral, [trapper]);
  assert.equal(ambush.eliminatedCount, 1);
  assert.equal(trapper.health, 0);
});

test('Chantier 4 (v151): YautjaSpinalFluidGeneticExtractorSystem harvests elite spinal DNA and boosts hunter metabolism', () => {
  const extractor = new YautjaSpinalFluidGeneticExtractorSystem();
  const harvest = extractor.harvestEliteSpinalFluid(
    { isWorthyElitePrey: true, species: 'ALPHA_XENO', geneticTrait: 'CHITIN_DERMAL_RESILIENCE' },
    audioSynth
  );
  assert.equal(harvest.harvested, true);

  const hunter = { maxHealth: 200, health: 140, staminaRegenMultiplier: 1.0 };
  const assim = extractor.assimilateGeneticVial(hunter, audioSynth);
  assert.equal(assim.assimilated, true);
  assert.equal(hunter.maxHealth, 235);
  assert.equal(hunter.staminaRegenMultiplier, 1.25);
});

test('Chantier 5 (v151): BlainHandheldMinigunDefoliationSuppressionSystem shreds foliage cover and grazes ground targets', () => {
  const minigun = new BlainHandheldMinigunDefoliationSuppressionSystem();
  const foliage = [{ id: 'fern_cluster_1', shredded: false, coverValue: 100 }];
  const hunterOnGround = { id: 'jungle_hunter', elevationMeters: 1.5, health: 200 };

  const burst = minigun.fireDefoliatingSuppressionBurst(foliage, [hunterOnGround], audioSynth);
  assert.equal(burst.fired, true);
  assert.equal(foliage[0].shredded, true);
  assert.equal(hunterOnGround.isBleedingGreenLuminescentBlood, true);
});

test('Chantier 6 (v151): SubwayTunnelHighVoltageThirdRailHazardSector discharges 750V arc and trips tunnel lighting', () => {
  const subway = new SubwayTunnelHighVoltageThirdRailHazardSector();
  const gangMember = { id: 'voodoo_posse_1', x: 1.0, z: 1.0, health: 120 };

  const arc = subway.triggerThirdRailContactOrArc({ x: 0, z: 0 }, [gangMember], audioSynth);
  assert.equal(arc.triggered, true);
  assert.equal(arc.tunnelEmergencyStrobeOnly, true);
  assert.equal(gangMember.health, 0);
});

test('Chantier 7 (v151): NolanScavengedYautjaCamouflageRigSystem glitches and fails when sprinting drains stability', () => {
  const rig = new NolanScavengedYautjaCamouflageRigSystem();
  rig.engageScavengedCloak();

  const status1 = rig.updateRigStability(2.5, true, audioSynth);
  assert.equal(status1.glitchingAndAudible, true);

  const status2 = rig.updateRigStability(1.0, true, audioSynth);
  assert.equal(status2.cloakEngaged, false);
  assert.equal(status2.totalGlitchFailures, 1);
});

test('Chantier 8 (v151): PyramidHieroglyphSlidingStoneDoorMazeSector crushes stationary units and spares sliding units', () => {
  const maze = new PyramidHieroglyphSlidingStoneDoorMazeSector();
  const slowMerc = { id: 'merc_slow', x: 0, z: 10, health: 100, executingEmergencySlide: false };
  const slidingHunter = { id: 'scar', x: 0.2, z: 10, health: 200, executingEmergencySlide: true };

  const slam = maze.triggerMazeReconfigurationSlam('door_sacrificial_north', [slowMerc, slidingHunter], audioSynth);
  assert.equal(slam.slammed, true);
  assert.deepEqual(slam.crushedIds, ['merc_slow']);
  assert.deepEqual(slam.escapedBySlideIds, ['scar']);
});

test('Chantier 9 (v151): WristGauntletHolographicTacticalMapProjectorSystem projects 3D map and tracks fallen clan mates', () => {
  const holo = new WristGauntletHolographicTacticalMapProjectorSystem();
  const proj = holo.projectTacticalHologramMap(['room_a', 'room_b', 'room_c'], audioSynth);
  assert.equal(proj.projected, true);
  assert.equal(proj.mappedRoomsCount, 3);

  const alert = holo.registerClanMateFallenAlert('chopper_hunter', audioSynth);
  assert.equal(alert.updated, true);
  assert.equal(alert.activeClanMatesCount, 2);
});

test('Chantier 10 (v151): AudioSynthesizer exposes all 15 v151 procedural Web Audio methods', () => {
  const methods = [
    'playHospitalHelipadRotorWashChop',
    'playHelipadFuelBarrelExplosionBoom',
    'playUpgradeKineticGauntletChargeHum',
    'playKineticGauntletShockwavePunchBoom',
    'playBisonGraveyardAshWindHowl',
    'playSpinalFluidExtractorNeedlePlunge',
    'playGeneticAssimilationMetabolicSurge',
    'playBlainMinigunOldPainlessBrrrrt',
    'playMinigunJungleCanopySplinterCrack',
    'playSubwayThirdRailHighVoltageArc',
    'playNolanScavengedCloakGlitchBuzz',
    'playPyramidStoneGuillotineDoorSlam',
    'playPyramidMazeReconfigurationRumble',
    'playWristHologramProjectorActivateChime',
    'playHologramClanMateTelemetryPing'
  ];

  for (const methodName of methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `Missing AudioSynthesizer.${methodName}`);
    assert.doesNotThrow(() => audioSynth[methodName]());
  }
});
