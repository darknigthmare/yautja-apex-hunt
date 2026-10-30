import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { MegafaunaBoss } from '../src/MegafaunaBoss.js';
import { XenomorphQueen } from '../src/entities/XenomorphQueen.js';
import { VydrachBoss } from '../src/entities/VydrachBoss.js';
import {
  MonsterHunterEcologySystem,
  CLUE_TYPES,
  MONSTER_STAGES
} from '../src/gameplay/MonsterHunterEcologySystem.js';
import { MonsterHunterVFX } from '../src/graphics/MonsterHunterVFX.js';
import { MonsterHunterHUD } from '../src/ui/MonsterHunterHUD.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

describe('Monster Hunter Style Giant Prey, Ecology & Level Design System', () => {

  test('1. MegafaunaBoss: local-to-world hitboxes, core critical damage, horn break & severed tail drop', () => {
    const scene = new THREE.Scene();
    const boss = new MegafaunaBoss(scene);

    // Rotate boss 90 degrees to test rotation invariance
    boss.mesh.rotation.y = Math.PI / 2;
    boss.mesh.updateWorldMatrix(true, true);

    const coreWorld = boss.getCoreWorldPosition();
    assert.ok(coreWorld.isVector3);
    const hornWorld = boss.getHornWorldPosition();
    assert.ok(hornWorld.isVector3);
    const tailWorld = boss.getTailWorldPosition();
    assert.ok(tailWorld.isVector3);

    // Critical Core Strike
    const initialHealth = boss.health;
    boss.takeDamage(100, coreWorld);
    // Should take 250 damage (x2.5 multiplier)
    assert.equal(boss.health, initialHealth - 250);
    assert.equal(boss.coreExposed, true);

    // Horn Break
    assert.equal(boss.hornIntact, true);
    boss.takeDamage(220, hornWorld);
    assert.equal(boss.hornIntact, false);

    // Tail Break & Severed Tail Drop
    assert.equal(boss.tailIntact, true);
    assert.equal(boss.severedTailSpawned, false);
    boss.takeDamage(260, tailWorld);
    assert.equal(boss.tailIntact, false);
    assert.equal(boss.severedTailSpawned, true);
    assert.ok(boss.severedTailMesh?.isGroup);
    assert.equal(boss.severedTailMesh.userData.isCarveable, true);

    // Topple state
    boss.triggerTopple(6.0);
    assert.equal(boss.isToppled, true);
    assert.equal(boss.aiState, 'toppled');

    boss.dispose();
  });

  test('2. XenomorphQueen: local-to-world hitboxes, crown break, severed tail drop & topple', () => {
    const scene = new THREE.Scene();
    const queen = new XenomorphQueen(scene);

    queen.mesh.rotation.y = -Math.PI / 4;
    queen.mesh.updateWorldMatrix(true, true);

    const crownWorld = queen.getCrownWorldPosition();
    assert.ok(crownWorld.isVector3);
    const tailWorld = queen.getTailWorldPosition();
    assert.ok(tailWorld.isVector3);

    // Crown Break
    assert.equal(queen.crownIntact, true);
    queen.takeDamage(300, crownWorld);
    assert.equal(queen.crownIntact, false);

    // Tail Sever
    assert.equal(queen.tailIntact, true);
    assert.equal(queen.severedTailSpawned, false);
    queen.takeDamage(350, tailWorld);
    assert.equal(queen.tailIntact, false);
    assert.equal(queen.severedTailSpawned, true);
    assert.ok(queen.severedTailMesh?.isGroup);

    // Topple
    queen.triggerTopple(5.0);
    assert.equal(queen.isToppled, true);
    assert.equal(queen.aiState, 'toppled');

    queen.dispose();
  });

  test('3. VydrachBoss (Yautja Prime Winged Leviathan): 1:1 scale, breakable wings, tail sever & AI', () => {
    const scene = new THREE.Scene();
    const vydrach = new VydrachBoss(scene);

    assert.equal(vydrach.colliderRadius, 8.5);
    assert.equal(vydrach.nativeHighDetail, true);
    assert.equal(vydrach.maxHealth, 3200);

    const coreWorld = vydrach.getCoreWorldPosition();
    const crestWorld = vydrach.getCrestWorldPosition();
    const tailWorld = vydrach.getTailWorldPosition();

    // Core critical
    const hp0 = vydrach.health;
    vydrach.takeDamage(100, coreWorld);
    assert.equal(vydrach.health, hp0 - 250);

    // Crest break
    vydrach.takeDamage(360, crestWorld);
    assert.equal(vydrach.crestIntact, false);

    // Tail sever
    vydrach.takeDamage(460, tailWorld);
    assert.equal(vydrach.tailIntact, false);
    assert.equal(vydrach.severedTailSpawned, true);
    assert.ok(vydrach.severedTailMesh);

    // Topple & Net
    vydrach.triggerTopple(7.0);
    assert.equal(vydrach.isToppled, true);
    vydrach.applyNet();
    assert.equal(vydrach.isNetted, true);

    // Thermal Vision
    vydrach.setVisionMode('thermal');
    vydrach.setVisionMode('normal');

    vydrach.dispose();
  });

  test('4. MonsterHunterEcologySystem: clues, scout levels, guidance trail, stamina & topple', () => {
    const scene = new THREE.Scene();
    const ecology = new MonsterHunterEcologySystem(scene, { biomeId: 'jungle' });

    const sectors = [
      { id: 'jungle-camp', center: [0, 0, 500] },
      { id: 'jungle-river', center: [-250, 0, 300] },
      { id: 'jungle-ruin', center: [0, 0, 100] },
      { id: 'jungle-caves', center: [-200, 0, -200] }
    ];

    const clues = ecology.generateBiomeClues(sectors);
    assert.equal(clues.length, 4);
    assert.equal(ecology.scoutLevel, 0);

    // Analyze Clue 1
    const res1 = ecology.analyzeClue(clues[0].id);
    assert.ok(res1);
    assert.equal(res1.pointsAwarded, 40);

    // Analyze Clue 2
    ecology.analyzeClue(clues[1].id);

    // Analyze Clue 3 -> Level Up to Scout Level 1
    const res3 = ecology.analyzeClue(clues[2].id);
    assert.ok(ecology.scoutLevel >= 1);

    // Analyze Clue 4 -> Guidance trail unlocked
    ecology.analyzeClue(clues[3].id);
    assert.ok(ecology.scoutPoints >= 150);

    // Bind monster & test stamina / exhaustion
    const boss = new MegafaunaBoss(scene);
    ecology.bindTargetMonster(boss);

    const state1 = ecology.updateMonsterEcology(10.0, 1200, 1200);
    assert.ok(state1.stamina < 1000);

    // Topple via limb stagger
    const toppleRes = ecology.inflictMonsterTopple(8.0);
    assert.equal(toppleRes.status, 'MONSTER_TOPPLED');
    assert.equal(ecology.monsterState.isToppled, true);

    boss.dispose();
  });

  test('5. MonsterHunterEcologySystem: ritual Yautja carving of severed tail and carcass (+Honor)', () => {
    const scene = new THREE.Scene();
    const ecology = new MonsterHunterEcologySystem(scene);

    ecology.recordPartBreak('head');
    ecology.recordPartBreak('tail');

    // Carve severed tail
    const tailCarve = ecology.performYautjaCarve('SEVERED_TAIL');
    assert.equal(tailCarve.status, 'CARVE_COMPLETED');
    assert.equal(tailCarve.target, 'SEVERED_TAIL');
    assert.ok(tailCarve.honorAwarded >= 500);

    // Cannot carve twice
    assert.throws(() => ecology.performYautjaCarve('SEVERED_TAIL'), /déjà été prélevé/);
  });

  test('6. Level Design Traps: environmental falling boulders and thermal camouflage mud', () => {
    const scene = new THREE.Scene();
    const ecology = new MonsterHunterEcologySystem(scene);
    const boss = new MegafaunaBoss(scene);
    boss.position.set(0, 0, -40);
    ecology.bindTargetMonster(boss);

    // 1. Falling boulder trap drops within 5m of monster -> hits and triggers Topple
    const boulderPos = new THREE.Vector3(2, 0, -38);
    const trapResult = ecology.triggerEnvironmentalFallingBoulder(boulderPos, boss.position);
    assert.equal(trapResult.monsterHit, true);
    assert.equal(trapResult.damageDealt, 850);
    assert.equal(trapResult.toppleTriggered, true);

    // 2. Thermal Mud camouflage
    const mudResult = ecology.applyThermalCamouflageMud();
    assert.equal(mudResult.status, 'THERMAL_MUD_APPLIED');
    assert.ok(mudResult.thermalDeltaCelsius <= 0.5);
    assert.equal(mudResult.invisibleToMonsterSenses, true);

    boss.dispose();
  });

  test('7. MonsterHunterVFX: acid splash, bioluminescent blood, shockwave & scout trail emitters', () => {
    const scene = new THREE.Scene();
    const vfx = new MonsterHunterVFX(scene);

    const pos = new THREE.Vector3(0, 2, 0);

    const acid = vfx.createAcidBloodSplash(pos, new THREE.Vector3(0, 1, 0), 16);
    assert.ok(acid?.isGroup);

    const blood = vfx.createBioluminescentBloodSpray(pos, 0x00ff66, 16);
    assert.ok(blood?.isGroup);

    const shockwave = vfx.createDustShockwave(pos, 1.0, 8.0);
    assert.ok(shockwave?.isMesh);

    const sparks = vfx.createCarapaceShatterSparks(pos, 14);
    assert.ok(sparks?.isGroup);

    const trail = vfx.createScoutflyGuidanceTrail(new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 20));
    assert.ok(trail?.isGroup);

    assert.equal(vfx.activeEmitters.length, 5);

    // Simulate 0.5s delta tick
    vfx.update(0.5);

    vfx.dispose();
    assert.equal(vfx.activeEmitters.length, 0);
  });

  test('8. MonsterHunterHUD: target status update, carve prompt & quest complete banner', () => {
    const hud = new MonsterHunterHUD(null); // SSR mode without crash
    assert.doesNotThrow(() => {
      hud.updateMonsterStatus({
        monsterName: "Vy'drach Céleste",
        hpPercent: 65,
        staminaPercent: 40,
        scoutLevel: 2,
        isEnraged: true,
        isExhausted: false,
        isToppled: false,
        brokenParts: { head: true, tail: false }
      });
      hud.showCarvePrompt("QUEUE DE VY'DRACH");
      hud.hideCarvePrompt();
      hud.displayQuestCompleteBanner([
        { id: 'VYDRACH_SKULL', name: 'Crâne de Vy’drach', rarity: 'LEGENDARY', honor: 500 }
      ], 500);
      hud.dispose();
    });
  });

  test('9. AudioSynthesizer: Monster Hunter acoustics, roars, bone breaks & carving SFX', () => {
    const acoustics = audioSynth.computeMonsterHunterAcoustics({ monsterMassKg: 8500, roarDecibels: 118 });
    assert.ok(acoustics.subBassRumbleHz > 40);
    assert.ok(acoustics.toppleTremorDecibels > 90);

    assert.doesNotThrow(() => audioSynth.playMonsterHunterRoar(1.0));
    assert.doesNotThrow(() => audioSynth.playMonsterHunterFootstep(1.0));
    assert.doesNotThrow(() => audioSynth.playMonsterPartBreakCrunch());
    assert.doesNotThrow(() => audioSynth.playMonsterTailSeverSwoosh());
    assert.doesNotThrow(() => audioSynth.playYautjaCarvingRitualSFX());
    assert.doesNotThrow(() => audioSynth.playEnvironmentalTrapDropCrash());
    assert.doesNotThrow(() => audioSynth.playMonsterStaggerTopple());
    assert.doesNotThrow(() => audioSynth.playMonsterFatiguePant());
    assert.doesNotThrow(() => audioSynth.playVydrachSonicScreech());
    assert.doesNotThrow(() => audioSynth.playVydrachWingGale());
  });

});
