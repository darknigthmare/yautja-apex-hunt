import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  HuntNPC,
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  HUNT_NPC_LOD_PROFILES,
  HUNT_NPC_FSM_STATES,
  getNpcWeaponProfile,
  NPC_WEAPON_BALLISTIC_PROFILES,
} from '../src/entities/HuntNPC.js';
import { MegafaunaBoss } from '../src/MegafaunaBoss.js';
import { audioSynth } from '../src/AudioSynthesizer.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { WORLD_UNITS_PER_METER, metersToWorldUnits, getVisualBounds, NPC_PHYSICAL_PROFILES } from '../src/utils/worldScale.js';

test('the common metre conversion preserves the existing 2.4m hunter and documented catalogue dimensions', () => {
  assert.equal(WORLD_UNITS_PER_METER, 3);
  assert.ok(Math.abs(metersToWorldUnits(2.4) - 7.2) < 1e-12);
  for (const [type, profile] of Object.entries(NPC_PHYSICAL_PROFILES)) {
    if (!profile.catalogId) continue;
    const source = CANON_PREY_CATALOG.find(({ id }) => id === profile.catalogId);
    assert.ok(source, `${type}: missing scale reference ${profile.catalogId}`);
    assert.equal(profile.meters, source.sizeMeters, `${type}: authored size drifted from its catalogue reference`);
  }
});

test('bounds use actual instance transforms and omit hidden geometry', () => {
  const root = new THREE.Group();
  root.position.set(20, 7, -30);
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial(), 1);
  mesh.setMatrixAt(0, new THREE.Matrix4().compose(new THREE.Vector3(10, 3, -4), new THREE.Quaternion(), new THREE.Vector3(0.25, 0.5, 0.2)));
  root.add(mesh);
  const local = getVisualBounds(root, { local: true });
  assert.ok(Math.abs(local.min.x - 9.75) < 1e-6);
  assert.ok(Math.abs(local.min.y - 2.5) < 1e-6);
  assert.ok(Math.abs(getVisualBounds(root).min.x - 29.75) < 1e-6);
  mesh.visible = false;
  assert.equal(getVisualBounds(root).isEmpty(), true);
  assert.equal(getVisualBounds(root, { includeHidden: true }).isEmpty(), false);
  mesh.geometry.dispose(); mesh.material.dispose();
});

test('a full-sized human has adult head proportions and remains shorter than the hunter', () => {
  const npc = new HuntNPC('human_fireteam');
  try {
    const bounds = getVisualBounds(npc.mesh);
    const height = bounds.max.y - bounds.min.y;
    assert.ok(Math.abs(height - 5.4) < 1e-5);
    assert.ok(7.2 / height > 1.25 && 7.2 / height < 1.4, 'the hunter must not be three times a human height');
    const head = npc.mesh.children.find(child => child.userData.physicalPart === 'head' && child.geometry?.type === 'SphereGeometry');
    assert.ok(head);
    const headHeight = getVisualBounds(head).getSize(new THREE.Vector3()).y;
    assert.ok(height / headHeight >= 7 && height / headHeight <= 8.2, `Human head count=${height / headHeight}`);
    assert.ok(npc.colliderRadius > 1 && npc.colliderRadius < 1.6);
    const neck = npc.mesh.getObjectByName('anatomy:human_fireteam:neck');
    assert.ok(neck, 'resizing the skull must not leave a floating head');
    const neckBounds = getVisualBounds(neck);
    assert.ok(neckBounds.intersectsBox(getVisualBounds(head)));
    assert.ok(neckBounds.intersectsBox(getVisualBounds(npc.mesh.children[0])));
  } finally { npc.dispose(); }
});

test('all grounded NPCs and their distant silhouettes keep the same terrain contact', () => {
  for (const type of Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type, { position: new THREE.Vector3(7, 11, -8) });
    try {
      const near = getVisualBounds(npc.mesh);
      if (HUNT_NPC_LOD_PROFILES[type].family !== 'drone') {
        assert.ok(Math.abs(near.min.y - 11) < 1e-5, `${type}: feet at ${near.min.y}`);
      } else assert.ok(near.min.y > 11.5, 'a sentry drone must keep its hovering clearance');
      npc.update(0, { player: { position: new THREE.Vector3(7, 11, 300) } });
      const distant = getVisualBounds(npc.mesh);
      assert.ok(Math.abs(distant.min.y - near.min.y) < 1e-5, `${type}: LOD floats/sinks at the switch`);
      const point = npc.getAimPoint();
      assert.ok([point.x, point.y, point.z].every(Number.isFinite));
      assert.ok(point.y > npc.position.y);
    } finally { npc.dispose(); }
  }
});

test('a scaled melee creature can still reach a hunter stopped at collision distance', () => {
  for (const type of Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type);
    try {
      if (npc.attackKind !== 'projectile') {
        assert.ok(npc.attackRange >= npc.colliderRadius + 1.8,
          `${type}: attack range ${npc.attackRange} is blocked by collision radius ${npc.colliderRadius}`);
      }
    } finally { npc.dispose(); }
  }
});

test('ranged signals originate at the scaled weapon instead of the actor feet', () => {
  const npc = new HuntNPC('human_fireteam', { position: new THREE.Vector3(4, 5, -7) });
  try {
    npc.mesh.rotation.y = Math.PI / 2;
    const origin = npc.getProjectileOrigin();
    assert.ok(origin.y > npc.position.y + 3 && origin.y < npc.position.y + 4);
    assert.ok(origin.x > npc.position.x + 2, 'forward barrel offset must rotate with the actor');
    const signals = npc.update(0, { player: { position: new THREE.Vector3(14, 5, -7) } });
    const attack = signals.find(signal => signal.projectile);
    assert.ok(attack?.projectile.origin.distanceTo(origin) < 1e-6);
    npc.attackCooldown = 0;
    npc.mesh.rotation.y = 0;
    const turned = npc.update(0, { player: { position: new THREE.Vector3(14, 5, -7) } }).find(signal => signal.projectile);
    assert.ok(turned?.projectile.origin.distanceTo(origin) < 1e-6, 'a stationary shooter must turn the visible weapon toward its target');
  } finally { npc.dispose(); }
});

test('canonical 1:1 creature dimensions strictly conform to lore specifications', () => {
  // Predator nominal stature: 2.4m -> 7.2 world units
  assert.equal(WORLD_UNITS_PER_METER, 3);
  assert.ok(Math.abs(metersToWorldUnits(2.4) - 7.2) < 1e-12);
  
  // Drone Xenomorph: 2.1m -> 6.3 world units
  assert.equal(NPC_PHYSICAL_PROFILES.xeno_drone.meters, 2.1);
  assert.ok(Math.abs(metersToWorldUnits(NPC_PHYSICAL_PROFILES.xeno_drone.meters) - 6.3) < 1e-12);

  // Warrior Xenomorph: 2.3m -> 6.9 world units
  assert.equal(NPC_PHYSICAL_PROFILES.xeno_warrior.meters, 2.3);
  assert.ok(Math.abs(metersToWorldUnits(NPC_PHYSICAL_PROFILES.xeno_warrior.meters) - 6.9) < 1e-12);

  // Runner Xenomorph: 2.1m standing, pose ratio 0.55 -> ~1.155m quadruped wither height
  assert.equal(NPC_PHYSICAL_PROFILES.xeno_runner.meters, 2.1);
  assert.equal(NPC_PHYSICAL_PROFILES.xeno_runner.poseRatio, 0.55);
  const runnerWitherMeters = NPC_PHYSICAL_PROFILES.xeno_runner.meters * NPC_PHYSICAL_PROFILES.xeno_runner.poseRatio;
  assert.ok(Math.abs(runnerWitherMeters - 1.155) < 1e-4);

  // Facehugger: 0.9m length
  assert.equal(NPC_PHYSICAL_PROFILES.xeno_facehugger.meters, 0.9);
  assert.equal(NPC_PHYSICAL_PROFILES.xeno_facehugger.dimension, 'length');

  // Hell Hound / tracker: 1.4m
  assert.equal(NPC_PHYSICAL_PROFILES.hunting_hound.meters, 1.4);
  assert.equal(NPC_PHYSICAL_PROFILES.hell_hound_alpha.meters, 1.4);

  // Armored War Hound: 1.1m
  assert.equal(NPC_PHYSICAL_PROFILES.modified_predator_hound.meters, 1.1);

  // Human reference: 1.8m -> 5.4 world units
  const humanNpc = new HuntNPC('human_fireteam');
  try {
    const bounds = getVisualBounds(humanNpc.mesh);
    const height = bounds.max.y - bounds.min.y;
    assert.ok(Math.abs(height - 5.4) < 1e-4);
  } finally { humanNpc.dispose(); }

  // Megafauna / Goliath: 5.5m in certified profiles
  assert.equal(NPC_PHYSICAL_PROFILES.megafauna.meters, 5.5);
  assert.equal(NPC_PHYSICAL_PROFILES.goliath.meters, 5.5);
  assert.equal(metersToWorldUnits(5.5), 16.5);
});

test('MegafaunaBoss: perfect terrain contact, multi-part hitboxes, exhaustion, topple and carving', () => {
  const scene = new THREE.Scene();
  const boss = new MegafaunaBoss(scene);
  try {
    // 1. Terrain clamping
    boss.position.set(25, 8.5, -45);
    boss.mesh.position.copy(boss.position);
    boss.mesh.updateMatrixWorld(true);
    const bounds = getVisualBounds(boss.mesh);
    assert.ok(Math.abs(bounds.min.y - 8.5) < 0.04, `MegafaunaBoss minY=${bounds.min.y} should clamp to 8.5`);

    // 2. Multi-part hitboxes (core, horn, tail)
    const corePos = boss.getCoreWorldPosition();
    const hornPos = boss.getHornWorldPosition();
    const tailPos = boss.getTailWorldPosition();
    assert.ok(corePos.isVector3 && hornPos.isVector3 && tailPos.isVector3);

    // Finite projectile collision: distant projectile does not hit prematurely
    const distantStart = hornPos.clone().add(new THREE.Vector3(0, 0, 75));
    const distantEnd = distantStart.clone().add(new THREE.Vector3(0, 0, -2));
    assert.equal(boss.resolveProjectileImpact(distantEnd, 0.1, distantStart), null);

    // Direct hit on horn
    assert.ok(boss.resolveProjectileImpact(hornPos, 0.5, hornPos));

    // Severed tail trophy contact with terrain
    const tailProp = boss.spawnSeveredTail();
    assert.ok(tailProp?.isGroup);
    assert.ok(Math.abs(getVisualBounds(tailProp).min.y - 8.5) < 1e-4, 'Severed tail must rest on terrain');
    assert.equal(tailProp.userData.isCarveable, true);

    // 3. Topple state & duration recovery in update
    boss.triggerTopple(3.0);
    assert.equal(boss.isToppled, true);
    assert.equal(boss.aiState, 'toppled');
    boss.update(1.5, new THREE.Vector3(25, 8.5, -40), false);
    assert.equal(boss.isToppled, true);
    assert.equal(boss.aiState, 'toppled');
    boss.update(1.6, new THREE.Vector3(25, 8.5, -40), false);
    assert.equal(boss.isToppled, false);
    assert.equal(boss.aiState, 'chase');

    // 4. Stamina and exhaustion
    boss.stamina = 0;
    boss.update(0.1, new THREE.Vector3(25, 8.5, -40), false);
    assert.equal(boss.isExhausted, true);

    // Enrage clears exhaustion and restores stamina
    boss.takeDamage(boss.maxHealth * 0.6, boss.position);
    assert.equal(boss.isEnraged, true);
    assert.equal(boss.isExhausted, false);
    assert.equal(boss.stamina, boss.maxStamina);

    // 5. Carving ritual
    assert.equal(boss.canCarve(), false);
    boss.takeDamage(boss.maxHealth * 2, boss.position);
    assert.equal(boss.isDead, true);
    assert.equal(boss.canCarve(), true);
    const trophy = boss.carveTrophy();
    assert.ok(trophy && trophy.trophyType);
    assert.equal(boss.canCarve(), false);
  } finally { boss.dispose(); }
});

test('HuntNPC FSM transitions across all 8 canonical modern AAA states', () => {
  assert.deepEqual(HUNT_NPC_FSM_STATES, [
    'patrol',
    'alert',
    'investigate',
    'stalk',
    'engage',
    'flank',
    'wounded_retreat',
    'cover',
  ]);

  const npc = new HuntNPC('human_fireteam', { ambient: true });
  try {
    assert.equal(npc.fsmState, 'patrol');
    assert.equal(npc.mesh.userData.fsmState, 'patrol');

    for (const state of HUNT_NPC_FSM_STATES) {
      assert.equal(npc.transitionTo(state, `testing_${state}`), true);
      assert.equal(npc.fsmState, state);
      assert.equal(npc.mesh.userData.fsmState, state);
    }

    assert.throws(() => npc.transitionTo('non_existent_state'), /Invalid HuntNPC FSM state/);
  } finally { npc.dispose(); }
});

test('PNJs react diegetically to acoustic events (plasma shots, roars, footsteps)', () => {
  const rifleman = new HuntNPC('stargazer_rifleman', { position: new THREE.Vector3(0, 0, 0) });
  const soldier = new HuntNPC('human_fireteam', { position: new THREE.Vector3(0, 0, 0) });
  const xeno = new HuntNPC('xeno_drone', { position: new THREE.Vector3(0, 0, 0) });

  try {
    // 1. Footstep sound -> investigate
    const footstepOrigin = new THREE.Vector3(12, 0, 0);
    assert.equal(rifleman.hearSound('footsteps', footstepOrigin), true);
    assert.equal(rifleman.fsmState, 'investigate');
    assert.equal(rifleman.mesh.userData.investigatingLure, true);

    // 2. Plasma shot sound -> cover for rifleman, alert for soldier, stalk for xeno
    const plasmaOrigin = new THREE.Vector3(45, 0, 0);
    assert.equal(rifleman.hearSound('plasma_shot', plasmaOrigin), true);
    assert.equal(rifleman.fsmState, 'cover');

    assert.equal(soldier.hearSound('plasma_shot', plasmaOrigin), true);
    assert.equal(soldier.fsmState, 'alert');

    assert.equal(xeno.hearSound('plasma_shot', plasmaOrigin), true);
    assert.equal(xeno.fsmState, 'stalk');

    // 3. Yautja Roar sound -> panic retreat for critically wounded human
    soldier.health = 20; // < 45%
    const roarOrigin = new THREE.Vector3(50, 0, 0);
    assert.equal(soldier.hearSound('yautja_roar', roarOrigin), true);
    assert.equal(soldier.fsmState, 'wounded_retreat');

    // 4. Distant sound beyond hearing radius is ignored
    const farSound = new THREE.Vector3(200, 0, 0);
    assert.equal(soldier.hearSound('footsteps', farSound), false);
  } finally {
    rifleman.dispose();
    soldier.dispose();
    xeno.dispose();
  }
});

test('Xenomorphs execute pounce telegraphs and react to pain and dismemberment', () => {
  const xeno = new HuntNPC('xeno_drone', { position: new THREE.Vector3(0, 0, 0) });
  const player = { position: new THREE.Vector3(0, 0, 6.5), isCloaked: false };

  try {
    // 1. Pounce telegraph
    const signals = xeno.update(0.1, { player });
    const telegraph = signals.find(s => s.type === 'telegraph' && s.attackKind === 'pounce');
    assert.ok(telegraph, 'Xenomorph must telegraph pounce when in leap range');
    assert.equal(xeno.mesh.userData.isTelegraphingPounce, true);
    assert.equal(xeno.fsmState, 'stalk');

    // Complete windup and pounce travel
    xeno.update(0.4, { player });
    assert.equal(xeno.mesh.userData.isTelegraphingPounce, false);

    // 2. Pain reaction on heavy damage
    const hit = xeno.takeDamage(35);
    assert.equal(hit.damage, 35);
    assert.equal(xeno.mesh.userData.painReaction, true);
    assert.equal(xeno.mesh.userData.isFlinching, true);

    // 3. Severe damage triggers dismemberment and acid spray
    xeno.takeDamage(50); // HP drops below 40%
    assert.equal(xeno.mesh.userData.dismembered, true);
    assert.equal(xeno.mesh.userData.tailSevered, true);
    assert.equal(xeno.mesh.userData.acidSplash, true);
  } finally {
    xeno.dispose();
  }
});

test('Vague 8 & Vague 9 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const canonicalWeapons = [
    'wpn_tartarus_heavy_plasma',
    'wpn_starseer_solar_staff',
    'wpn_anacharsis_rivet_turret',
    'wpn_moriah_pulse_carbine',
    'wpn_anchorpoint_incinerator_mk2',
    'wpn_freya_mining_laser_drill',
    'wpn_rage_war_boarding_cannon',
    'wpn_stern_biodome_tranq_lance',
    'wpn_yellowstone_ranger_45_70_lever',
    'wpn_kleist_charon_shock_baton',
    'wpn_mayakovsky_cyber_ant_laser',
    'wpn_gideon_lee_reverse_plasma_rifle',
    'wpn_perses_security_flechette_smg',
    'weapon_dark_river_machete_flint',
    'weapon_nemesis_webley_revolver',
    'weapon_pala_tranq_dart_rifle',
    'weapon_phalanx_obsidian_spear',
    'weapon_extinction_iron_bear_gauss',
    'weapon_kseries_acid_tail_spurt',
  ];

  assert.ok(Object.isFrozen(NPC_WEAPON_BALLISTIC_PROFILES));

  for (const weaponId of canonicalWeapons) {
    const profile = getNpcWeaponProfile(weaponId);
    assert.ok(profile && typeof profile === 'object', `${weaponId} must resolve to a profile object`);
    assert.equal(profile.id, weaponId);
    assert.ok(profile.damage > 0, `${weaponId} must have non-zero damage`);
    assert.ok(profile.cooldown > 0, `${weaponId} must have non-zero cooldown`);
    assert.ok(profile.rangeM > 0, `${weaponId} must have non-zero rangeM`);
    assert.ok(profile.soundRadiusM > 0, `${weaponId} must have non-zero soundRadiusM`);
    assert.ok(profile.projectileColor > 0, `${weaponId} must have non-zero projectileColor`);
    assert.ok(typeof profile.archetype === 'string' && profile.archetype.length > 0);
    assert.ok(typeof profile.cadence === 'string' && profile.cadence.length > 0);
  }
});

test('HuntNPC getProceduralPostureTelemetry and lastDiegeticCue track FSM states and rig transforms', () => {
  const rifleman = new HuntNPC('stargazer_rifleman', { position: new THREE.Vector3(0, 0, 0) });
  const xeno = new HuntNPC('xeno_drone', { position: new THREE.Vector3(0, 0, 0) });
  const player = { position: new THREE.Vector3(0, 0, 6.5), isCloaked: false };

  try {
    const baseTorsoY = rifleman._rigParts.torso.userData.basePositionY;
    const baseHeadYaw = rifleman._rigParts.head.userData.baseRotationY;

    // 1. Investigate state: active head scan yaw oscillation & acoustic_investigate_turn cue
    assert.equal(rifleman.hearSound('footsteps', new THREE.Vector3(10, 0, 0)), true);
    const investigateTelemetry = rifleman.getProceduralPostureTelemetry();
    assert.equal(investigateTelemetry.state, 'investigate');
    assert.equal(investigateTelemetry.lastDiegeticCue, 'acoustic_investigate_turn');
    assert.ok(Math.abs(investigateTelemetry.headScanYawRad) > 0, 'headScanYawRad must oscillate during investigate');
    assert.ok(Math.abs(rifleman._rigParts.head.rotation.y - baseHeadYaw) > 0, '_rigParts.head must rotate during investigate');

    // 2. Cover state: crouched posture & cover_suppression_crouch cue
    assert.equal(rifleman.hearSound('plasma_shot', new THREE.Vector3(35, 0, 0)), true);
    const coverTelemetry = rifleman.getProceduralPostureTelemetry();
    assert.equal(coverTelemetry.state, 'cover');
    assert.equal(coverTelemetry.isCrouchedInCover, true);
    assert.equal(coverTelemetry.lastDiegeticCue, 'cover_suppression_crouch');
    assert.ok(rifleman._rigParts.torso.position.y < baseTorsoY, 'torso must lower when crouched in cover');

    // 3. Flank & Stalk state: predatory forward torso pitch & tactical_flank_maneuver cue
    rifleman.transitionTo('flank', 'flanking_test');
    const flankTelemetry = rifleman.getProceduralPostureTelemetry();
    assert.equal(flankTelemetry.state, 'flank');
    assert.equal(flankTelemetry.lastDiegeticCue, 'tactical_flank_maneuver');
    assert.ok(flankTelemetry.torsoPitchRad >= 0.25, 'torso must lean forward during flank');
    assert.ok(typeof flankTelemetry.flankStrideRatio === 'number' && flankTelemetry.flankStrideRatio > 0, 'flankStrideRatio must be a positive ratio during flank');

    // 4. Wounded retreat state: limping gait & wounded_retreat_limp cue
    rifleman.takeDamage(110); // drops below 35% HP
    const retreatTelemetry = rifleman.getProceduralPostureTelemetry();
    assert.equal(retreatTelemetry.state, 'wounded_retreat');
    assert.equal(retreatTelemetry.isLimping, true);
    assert.equal(retreatTelemetry.lastDiegeticCue, 'wounded_retreat_limp');

    // 5. Xenomorph pounce telegraph, pain flinch stagger, and acid spray cues
    xeno.update(0.1, { player });
    assert.equal(xeno.lastDiegeticCue, 'xeno_pounce_telegraph');
    const pounceTelemetry = xeno.getProceduralPostureTelemetry();
    assert.equal(pounceTelemetry.state, 'stalk');
    assert.equal(pounceTelemetry.lastDiegeticCue, 'xeno_pounce_telegraph');
    assert.ok(pounceTelemetry.torsoPitchRad >= 0.3, 'stalking xeno leans forward predatorily');

    xeno.takeDamage(35);
    assert.equal(xeno.lastDiegeticCue, 'pain_flinch_stagger');

    xeno.takeDamage(50);
    assert.equal(xeno.lastDiegeticCue, 'xeno_acid_spray');
    assert.equal(xeno.getProceduralPostureTelemetry().lastDiegeticCue, 'xeno_acid_spray');

    // 6. Heavy weapon recoil recovery flinch: backward torso tilt & heavy_recoil_flinch cue
    rifleman.triggerHeavyRecoilFlinch(0.35);
    const recoilTelemetry = rifleman.getProceduralPostureTelemetry();
    assert.equal(recoilTelemetry.isHeavyRecoil, true);
    assert.equal(recoilTelemetry.lastDiegeticCue, 'heavy_recoil_flinch');
    assert.ok(rifleman._rigParts.torso.rotation.x < 0, 'torso must pitch backward on heavy recoil');

    // 7. Heavy suppression & close-range plasma fire: lateral evasion & amplified flanking stride
    rifleman.triggerSuppression(2.5);
    rifleman.transitionTo('flank', 'suppression_flank');
    const suppressedFlank = rifleman.getProceduralPostureTelemetry();
    assert.equal(suppressedFlank.isUnderSuppression, true);
    assert.ok(suppressedFlank.flankStrideRatio > flankTelemetry.flankStrideRatio, 'flanking stride must accelerate under heavy suppression');
    assert.ok(suppressedFlank.lateralEvasionAngleRad !== 0, 'lateral evasion angle must be non-zero under suppression');

    rifleman.triggerClosePlasmaFire(2.5);
    const plasmaTelemetry = rifleman.getProceduralPostureTelemetry();
    assert.equal(plasmaTelemetry.isClosePlasma, true);
    assert.ok(plasmaTelemetry.lateralEvasionAngleRad !== 0, 'lateral evasion angle must react to close plasma fire');
  } finally {
    rifleman.dispose();
    xeno.dispose();
  }
});

test('AudioSynthesizer procedural Vague 9 SFX methods execute safely in headless Node environment', () => {
  const screech = audioSynth.playXenoPounceScreech();
  assert.ok(screech && screech.event === 'xeno_pounce_screech');
  assert.ok(screech.carrierPeakHz > screech.carrierStartHz);
  assert.ok(screech.durationSeconds > 0);

  const sizzle = audioSynth.playAcidSpraySizzle();
  assert.ok(sizzle && sizzle.event === 'xeno_acid_spray_sizzle');
  assert.ok(sizzle.filterStartHz > sizzle.filterEndHz);
  assert.ok(sizzle.resonanceQ > 1);

  const ping = audioSynth.playAcousticAlertPing();
  assert.ok(ping && ping.event === 'acoustic_alert_ping');
  assert.ok(ping.primaryPingHz > 0);
  assert.ok(ping.durationSeconds > 0);
});

test('Vague 10 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const vague10Weapons = [
    {
      id: 'wpn_nakai_desert_hunting_rifle',
      archetype: 'bolt_action_hunting_rifle',
      damage: 36,
      rangeM: 140,
      soundRadiusM: 92,
      projectileColor: 0xffe066,
    },
    {
      id: 'wpn_adolini_flintlock_1715',
      archetype: 'black_powder_flintlock',
      damage: 38,
      rangeM: 20,
      soundRadiusM: 85,
      projectileColor: 0xffaa44,
    },
    {
      id: 'wpn_romulus_f44aa_pulse_rifle',
      archetype: 'smart_pulse_rifle',
      damage: 22,
      rangeM: 75,
      soundRadiusM: 70,
      projectileColor: 0xff4d6d,
    },
    {
      id: 'wpn_berserker_max_autocannon',
      archetype: 'heavy_motorized_autocannon',
      damage: 46,
      rangeM: 125,
      soundRadiusM: 115,
      projectileColor: 0xff3b00,
    },
    {
      id: 'wpn_killer_clan_tusk_acid_spitter',
      archetype: 'bio_pressurized_acid_spitter',
      damage: 29,
      rangeM: 28,
      soundRadiusM: 44,
      projectileColor: 0x70e000,
    },
    {
      id: 'wpn_ryushi_ranch_harpoon_gun',
      archetype: 'pneumatic_livestock_harpoon',
      damage: 32,
      rangeM: 38,
      soundRadiusM: 36,
      projectileColor: 0xc8d6e5,
    },
  ];

  for (const expected of vague10Weapons) {
    const profile = getNpcWeaponProfile(expected.id);
    assert.ok(profile && typeof profile === 'object', `${expected.id} must resolve to a profile object`);
    assert.equal(profile.id, expected.id);
    assert.equal(profile.archetype, expected.archetype);
    assert.equal(profile.damage, expected.damage);
    assert.equal(profile.rangeM, expected.rangeM);
    assert.equal(profile.soundRadiusM, expected.soundRadiusM);
    assert.equal(profile.projectileColor, expected.projectileColor);
    assert.ok(profile.cooldown > 0, `${expected.id} must have non-zero cooldown`);
    assert.ok(typeof profile.cadence === 'string' && profile.cadence.length > 0);
  }
});

test('AudioSynthesizer procedural Vague 10 SFX methods execute safely in headless Node environment', () => {
  const cryoHiss = audioSynth.playCryoFreezeHiss();
  assert.ok(cryoHiss && cryoHiss.event === 'cryo_freeze_hiss');
  assert.ok(cryoHiss.highpassEndHz > cryoHiss.highpassStartHz);
  assert.ok(cryoHiss.resonanceQ > 1);
  assert.ok(cryoHiss.durationSeconds > 0);
  assert.equal(cryoHiss.played, false);

  const autocannon = audioSynth.playHeavyAutocannonBlast();
  assert.ok(autocannon && autocannon.event === 'heavy_autocannon_blast');
  assert.ok(autocannon.punchStartHz > autocannon.punchEndHz);
  assert.ok(autocannon.subBassHz > 0);
  assert.ok(autocannon.durationSeconds > 0);
  assert.equal(autocannon.played, false);

  const flintlock = audioSynth.playFlintlockIgnitionBoom();
  assert.ok(flintlock && flintlock.event === 'flintlock_ignition_boom');
  assert.ok(flintlock.boomStartHz > flintlock.boomEndHz);
  assert.ok(flintlock.flashSizzleDuration > 0);
  assert.ok(flintlock.durationSeconds > 0);
  assert.equal(flintlock.played, false);
});

test('MegafaunaBoss.getBossDiegeticTelemetry reports canonical 5.5m scale and live combat state', () => {
  const scene = new THREE.Scene();
  const boss = new MegafaunaBoss(scene);
  try {
    boss.position.set(12, 4.0, -30);
    const initial = boss.getBossDiegeticTelemetry();
    assert.equal(initial.canonicalHeightM, 5.5);
    assert.equal(initial.worldHeightUnits, 16.5);
    assert.equal(initial.phase, 'roam');
    assert.equal(initial.tailSevered, false);
    assert.equal(initial.enraged, false);
    assert.equal(initial.groundContactValid, true);

    // Sever tail & trigger enrage
    boss.spawnSeveredTail();
    boss.takeDamage(boss.maxHealth * 0.6, boss.position);
    const enragedState = boss.getBossDiegeticTelemetry();
    assert.equal(enragedState.tailSevered, true);
    assert.equal(enragedState.enraged, true);
    assert.equal(enragedState.phase, 'enraged');
    assert.equal(enragedState.groundContactValid, true);
  } finally {
    boss.dispose();
  }
});

test('Vague 11 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const vague11Weapons = [
    {
      id: 'wpn_spratly_pirate_rpg7',
      archetype: 'shoulder_rpg7_rocket',
      damage: 52,
      rangeM: 100,
      soundRadiusM: 110,
      projectileColor: 0xff5500,
    },
    {
      id: 'wpn_bolderji_mercenary_magnum',
      archetype: 'heavy_magnum_revolver',
      damage: 42,
      rangeM: 42,
      soundRadiusM: 82,
      projectileColor: 0xffca3a,
    },
    {
      id: 'wpn_stronghold_jeri_disruptor',
      archetype: 'synthetic_pulse_disruptor',
      damage: 28,
      rangeM: 65,
      soundRadiusM: 55,
      projectileColor: 0x00f0ff,
    },
    {
      id: 'wpn_cold_forge_taser_drone_prod',
      archetype: 'neuro_electric_shock_prod',
      damage: 24,
      rangeM: 12,
      soundRadiusM: 26,
      projectileColor: 0x48cae4,
    },
    {
      id: 'wpn_duel_uss_ryushi_flamethrower',
      archetype: 'pressurized_napalm_flamethrower',
      damage: 38,
      rangeM: 35,
      soundRadiusM: 65,
      projectileColor: 0xff4d00,
    },
    {
      id: 'wpn_web_magnetic_riveter',
      archetype: 'magnetic_coil_riveter',
      damage: 35,
      rangeM: 45,
      soundRadiusM: 60,
      projectileColor: 0x48bfe3,
    },
  ];

  for (const expected of vague11Weapons) {
    const profile = getNpcWeaponProfile(expected.id);
    assert.ok(profile && typeof profile === 'object', `${expected.id} must resolve to a profile object`);
    assert.equal(profile.id, expected.id);
    assert.equal(profile.archetype, expected.archetype);
    assert.equal(profile.damage, expected.damage);
    assert.equal(profile.rangeM, expected.rangeM);
    assert.equal(profile.soundRadiusM, expected.soundRadiusM);
    assert.equal(profile.projectileColor, expected.projectileColor);
    assert.ok(profile.cooldown > 0, `${expected.id} must have non-zero cooldown`);
    assert.ok(typeof profile.cadence === 'string' && profile.cadence.length > 0);
  }
});

test('AudioSynthesizer procedural Vague 11 SFX methods execute safely in headless Node environment', () => {
  const rocket = audioSynth.playRpgRocketLaunchWhoosh();
  assert.ok(rocket && rocket.event === 'rpg_rocket_launch_whoosh');
  assert.ok(rocket.launchWhooshEndHz > rocket.launchWhooshStartHz);
  assert.ok(rocket.exhaustWhistleEndHz > rocket.exhaustWhistleStartHz);
  assert.ok(rocket.durationSeconds > 0);
  assert.equal(rocket.played, false);

  const flame = audioSynth.playHeavyFlamethrowerRoar();
  assert.ok(flame && flame.event === 'heavy_flamethrower_roar');
  assert.ok(flame.roarCutoffHz > 0);
  assert.ok(flame.hissHighpassHz > flame.roarCutoffHz);
  assert.ok(flame.subRumbleHz > 0);
  assert.ok(flame.durationSeconds > 0);
  assert.equal(flame.played, false);

  const riveter = audioSynth.playMagneticRiveterThud();
  assert.ok(riveter && riveter.event === 'magnetic_riveter_thud');
  assert.ok(riveter.capacitorWhineEndHz > riveter.capacitorWhineStartHz);
  assert.ok(riveter.thudImpactStartHz > riveter.thudImpactEndHz);
  assert.ok(riveter.durationSeconds > 0);
  assert.equal(riveter.played, false);
});

test('Vague 12 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const vague12Weapons = [
    {
      id: 'wpn_hunters_arctic_anti_materiel_50',
      archetype: 'anti_materiel_sniper',
      damage: 55,
      rangeM: 140,
      soundRadiusM: 120,
      projectileColor: 0xffeeaa,
    },
    {
      id: 'wpn_narco_quad_drum_mg',
      archetype: 'quad_drum_heavy_mg',
      damage: 26,
      rangeM: 65,
      soundRadiusM: 95,
      projectileColor: 0xffaa00,
    },
    {
      id: 'wpn_berserker_max_plasma_repeater',
      archetype: 'rotary_plasma_repeater',
      damage: 48,
      rangeM: 75,
      soundRadiusM: 90,
      projectileColor: 0x00d4ff,
    },
    {
      id: 'wpn_upp_ak120_infantry_carbine',
      archetype: 'caseless_assault_carbine',
      damage: 27,
      rangeM: 55,
      soundRadiusM: 70,
      projectileColor: 0xffdd55,
    },
    {
      id: 'wpn_delacroix_harada_needle_pistol',
      archetype: 'monofilament_needle_pistol',
      damage: 30,
      rangeM: 30,
      soundRadiusM: 25,
      projectileColor: 0x9b5de5,
    },
    {
      id: 'wpn_killer_clan_blaster_carbine',
      archetype: 'salvaged_blaster_carbine',
      damage: 44,
      rangeM: 60,
      soundRadiusM: 85,
      projectileColor: 0xff2244,
    },
  ];

  for (const expected of vague12Weapons) {
    const profile = getNpcWeaponProfile(expected.id);
    assert.ok(profile && typeof profile === 'object', `${expected.id} must resolve to a profile object`);
    assert.equal(profile.id, expected.id);
    assert.equal(profile.archetype, expected.archetype);
    assert.equal(profile.damage, expected.damage);
    assert.equal(profile.rangeM, expected.rangeM);
    assert.equal(profile.soundRadiusM, expected.soundRadiusM);
    assert.equal(profile.projectileColor, expected.projectileColor);
    assert.ok(profile.cooldown > 0, `${expected.id} must have non-zero cooldown`);
    assert.ok(typeof profile.cadence === 'string' && profile.cadence.length > 0);
  }
});

test('AudioSynthesizer procedural Vague 12 SFX methods execute safely in headless Node environment', () => {
  const boom = audioSynth.playAntiMaterielHeavyBoreBoom();
  assert.ok(boom && boom.event === 'anti_materiel_heavy_bore_boom');
  assert.ok(boom.boomFundamentalHz > 0);
  assert.ok(boom.supersonicCrackCutoffHz > boom.boomFundamentalHz);
  assert.ok(boom.brassClinkHz > 0);
  assert.ok(boom.mountainEchoDelaySeconds > 0);
  assert.ok(boom.durationSeconds > 0);
  assert.equal(boom.played, false);

  const barrage = audioSynth.playMaxPlasmaRotaryBarrage();
  assert.ok(barrage && barrage.event === 'max_plasma_rotary_barrage');
  assert.ok(barrage.motorSpinupEndHz > barrage.motorSpinupStartHz);
  assert.ok(barrage.plasmaPulseFreqHz > 0);
  assert.ok(barrage.inductiveHumHz > 0);
  assert.ok(barrage.durationSeconds > 0);
  assert.equal(barrage.played, false);

  const flechette = audioSynth.playFlechetteNeedleHiss();
  assert.ok(flechette && flechette.event === 'flechette_needle_hiss');
  assert.ok(flechette.gasWhisperCutoffHz > 0);
  assert.ok(flechette.needleZipEndHz > flechette.needleZipStartHz);
  assert.ok(flechette.monofilamentThudHz > 0);
  assert.ok(flechette.durationSeconds > 0);
  assert.equal(flechette.played, false);
});

test('Vague 13 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const vague13Weapons = [
    {
      id: 'wpn_turnabout_winchester_magnum_338',
      archetype: 'heavy_hunting_rifle',
      damage: 50,
      rangeM: 130,
      soundRadiusM: 110,
      projectileColor: 0xffddaa,
    },
    {
      id: 'wpn_ww1_lee_enfield_trench_carbine',
      archetype: 'service_bolt_carbine',
      damage: 38,
      rangeM: 85,
      soundRadiusM: 90,
      projectileColor: 0xffc482,
    },
    {
      id: 'wpn_mendel_security_shock_taser',
      archetype: 'high_voltage_dart_taser',
      damage: 22,
      rangeM: 18,
      soundRadiusM: 20,
      projectileColor: 0x38bdf8,
    },
    {
      id: 'wpn_dark_descent_sentry_slugger',
      archetype: 'automated_sentry_multitube',
      damage: 32,
      rangeM: 90,
      soundRadiusM: 100,
      projectileColor: 0xf59e0b,
    },
    {
      id: 'wpn_lv742_sniper_railgun_lance',
      archetype: 'magnetic_hypersonic_rail_lance',
      damage: 62,
      rangeM: 160,
      soundRadiusM: 125,
      projectileColor: 0x818cf8,
    },
    {
      id: 'wpn_bunda_top_knot_heavy_caster',
      archetype: 'dual_resonator_plasma_caster',
      damage: 52,
      rangeM: 100,
      soundRadiusM: 95,
      projectileColor: 0xec4899,
    },
  ];

  for (const expected of vague13Weapons) {
    const profile = getNpcWeaponProfile(expected.id);
    assert.ok(profile && typeof profile === 'object', `${expected.id} must resolve to a profile object`);
    assert.equal(profile.id, expected.id);
    assert.equal(profile.archetype, expected.archetype);
    assert.equal(profile.damage, expected.damage);
    assert.equal(profile.rangeM, expected.rangeM);
    assert.equal(profile.soundRadiusM, expected.soundRadiusM);
    assert.equal(profile.projectileColor, expected.projectileColor);
    assert.ok(profile.cooldown > 0, `${expected.id} must have non-zero cooldown`);
    assert.ok(typeof profile.cadence === 'string' && profile.cadence.length > 0);
  }
});

test('AudioSynthesizer procedural Vague 13 SFX methods execute safely in headless Node environment', () => {
  const winchester = audioSynth.playWinchesterMagnumShotEcho();
  assert.ok(winchester && winchester.event === 'winchester_magnum_shot_echo');
  assert.ok(winchester.rifleCrackHz > 0);
  assert.ok(winchester.supersonicWhistleHz > winchester.rifleCrackHz);
  assert.ok(winchester.timberResonanceHz > 0);
  assert.ok(winchester.durationSeconds > 0);
  assert.equal(winchester.played, false);

  const sentry = audioSynth.playSentrySluggerBurst();
  assert.ok(sentry && sentry.event === 'sentry_slugger_burst');
  assert.ok(sentry.motorSpinHz > 0);
  assert.ok(sentry.sluggerCrackHz > sentry.motorSpinHz);
  assert.ok(sentry.subRumbleHz > 0);
  assert.ok(sentry.durationSeconds > 0);
  assert.equal(sentry.played, false);

  const rail = audioSynth.playRailgunLanceChargeHum();
  assert.ok(rail && rail.event === 'railgun_lance_charge_hum');
  assert.ok(rail.capacitorWhineEndHz > rail.capacitorWhineStartHz);
  assert.ok(rail.hypersonicSnapHz > rail.capacitorWhineEndHz);
  assert.ok(rail.durationSeconds > 0);
  assert.equal(rail.played, false);
});

test('Vague 14 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const vague14Weapons = [
    {
      id: 'wpn_south_china_sea_pirate_scattergun',
      archetype: 'heavy_10gauge_scattergun',
      damage: 46,
      rangeM: 25,
      soundRadiusM: 80,
      projectileColor: 0xffaa00,
    },
    {
      id: 'wpn_civil_war_springfield_1861_musket',
      archetype: 'rifled_minie_musket',
      damage: 44,
      rangeM: 140,
      soundRadiusM: 90,
      projectileColor: 0xd4a373,
    },
    {
      id: 'wpn_sevastopol_working_joe_stun_prod',
      archetype: 'high_voltage_stun_prod',
      damage: 32,
      rangeM: 3.5,
      soundRadiusM: 20,
      projectileColor: 0x00f0ff,
    },
    {
      id: 'wpn_defiance_zula_carbine_rig',
      archetype: 'exoskeleton_compact_carbine',
      damage: 34,
      rangeM: 85,
      soundRadiusM: 70,
      projectileColor: 0x38bdf8,
    },
    {
      id: 'wpn_booty_pirate_pneumatic_nailer',
      archetype: 'pneumatic_spike_riveter',
      damage: 36,
      rangeM: 35,
      soundRadiusM: 30,
      projectileColor: 0x94a3b8,
    },
    {
      id: 'wpn_tokyo_cyber_yakuza_katana',
      archetype: 'monomolecular_hf_katana',
      damage: 48,
      rangeM: 3.0,
      soundRadiusM: 15,
      projectileColor: 0xec4899,
    },
  ];

  for (const expected of vague14Weapons) {
    const profile = getNpcWeaponProfile(expected.id);
    assert.ok(profile && typeof profile === 'object', `${expected.id} must resolve to a profile object`);
    assert.equal(profile.id, expected.id);
    assert.equal(profile.archetype, expected.archetype);
    assert.equal(profile.damage, expected.damage);
    assert.equal(profile.rangeM, expected.rangeM);
    assert.equal(profile.soundRadiusM, expected.soundRadiusM);
    assert.equal(profile.projectileColor, expected.projectileColor);
    assert.ok(profile.cooldown > 0, `${expected.id} must have non-zero cooldown`);
    assert.ok(typeof profile.cadence === 'string' && profile.cadence.length > 0);
  }
});

test('AudioSynthesizer procedural Vague 14 SFX methods execute safely in headless Node environment', () => {
  const scatter = audioSynth.playPirateJunkScattergunBlast();
  assert.ok(scatter && scatter.event === 'pirate_junk_scattergun_blast');
  assert.ok(scatter.concussionHz > 0);
  assert.ok(scatter.pelletHissHz > scatter.concussionHz);
  assert.ok(scatter.durationSeconds > 0);
  assert.equal(scatter.played, false);

  const prod = audioSynth.playSevastopolStunBatonDischarge();
  assert.ok(prod && prod.event === 'sevastopol_stun_baton_discharge');
  assert.ok(prod.carrierHz > 0);
  assert.ok(prod.arcModulationHz > 0);
  assert.ok(prod.durationSeconds > 0);
  assert.equal(prod.played, false);

  const harpoon = audioSynth.playZeroGHarpoonPneumaticLaunch();
  assert.ok(harpoon && harpoon.event === 'zerog_harpoon_pneumatic_launch');
  assert.ok(harpoon.whooshStartHz > harpoon.whooshEndHz);
  assert.ok(harpoon.metallicClickHz > 0);
  assert.ok(harpoon.durationSeconds > 0);
  assert.equal(harpoon.played, false);
});

test('Vague 15 canonical NPC weapons resolve to rich ballistic and acoustic profiles', () => {
  const vague15Weapons = [
    {
      id: 'wpn_fleener_creek_remington_1100',
      archetype: 'semi_auto_shotgun',
      damage: 38,
      rangeM: 35,
      soundRadiusM: 80,
      projectileColor: 0xffaa44,
    },
    {
      id: 'wpn_demons_gold_mp40_smg',
      archetype: 'submachine_gun',
      damage: 24,
      rangeM: 55,
      soundRadiusM: 70,
      projectileColor: 0xffcc66,
    },
    {
      id: 'wpn_female_war_heavy_incinerator',
      archetype: 'heavy_napalm_incinerator',
      damage: 65,
      rangeM: 30,
      soundRadiusM: 55,
      projectileColor: 0xff4500,
    },
    {
      id: 'wpn_nightmare_spears_tactical_carbine',
      archetype: 'subsonic_tactical_carbine',
      damage: 32,
      rangeM: 75,
      soundRadiusM: 25,
      projectileColor: 0x66aaff,
    },
    {
      id: 'wpn_requiem_morales_benelli_m4',
      archetype: 'combat_shotgun_slug',
      damage: 52,
      rangeM: 45,
      soundRadiusM: 85,
      projectileColor: 0xff8833,
    },
    {
      id: 'wpn_xenogenesis_hyperbaric_harpoon_gun',
      archetype: 'supercavitating_harpoon',
      damage: 78,
      rangeM: 60,
      soundRadiusM: 40,
      projectileColor: 0x00e5ff,
    },
  ];

  for (const expected of vague15Weapons) {
    const profile = NPC_WEAPON_BALLISTIC_PROFILES[expected.id];
    assert.ok(profile, `Le profil balistique de ${expected.id} doit exister dans NPC_WEAPON_BALLISTIC_PROFILES`);
    assert.equal(profile.id, expected.id);
    assert.equal(profile.archetype, expected.archetype);
    assert.equal(profile.damage, expected.damage);
    assert.equal(profile.rangeM, expected.rangeM);
    assert.equal(profile.soundRadiusM, expected.soundRadiusM);
    assert.equal(profile.projectileColor, expected.projectileColor);
  }
});

test('AudioSynthesizer procedural Vague 15 SFX methods execute safely in headless Node environment', () => {
  const remington = audioSynth.playRemingtonAutoShotgunBlast();
  assert.ok(remington && remington.event === 'remington_auto_shotgun_blast');
  assert.ok(remington.concussionHz > 0);
  assert.ok(remington.metallicBoltHz > remington.concussionHz);
  assert.ok(remington.durationSeconds > 0);
  assert.equal(remington.played, false);

  const napalm = audioSynth.playNapalmIncineratorRoar();
  assert.ok(napalm && napalm.event === 'napalm_incinerator_roar');
  assert.ok(napalm.ignitionBassHz > 0);
  assert.ok(napalm.hissNoiseHz > napalm.ignitionBassHz);
  assert.ok(napalm.durationSeconds > 0);
  assert.equal(napalm.played, false);

  const harpoon = audioSynth.playSupercavitatingHarpoonDischarge();
  assert.ok(harpoon && harpoon.event === 'supercavitating_harpoon_discharge');
  assert.ok(harpoon.cavitationPopHz > 0);
  assert.ok(harpoon.bubbleCollapseHz > harpoon.cavitationPopHz);
  assert.ok(harpoon.durationSeconds > 0);
  assert.equal(harpoon.played, false);
});

