import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { RhynthBoss } from '../src/entities/RhynthBoss.js';
import { XenomorphKingBoss } from '../src/entities/XenomorphKingBoss.js';
import { VydrachBoss } from '../src/entities/VydrachBoss.js';
import { MegafaunaBoss } from '../src/MegafaunaBoss.js';
import { XenomorphQueen } from '../src/entities/XenomorphQueen.js';
import { createBoss, BOSS_CONSTRUCTORS } from '../src/gameplay/BossFactory.js';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { CURRENT_HUNTS } from '../src/data/LoreCodex.js';
import { getRecommendedHuntLoadout } from '../src/gameplay/HuntLoadoutSystem.js';
import { MonsterHunterEcologySystem } from '../src/gameplay/MonsterHunterEcologySystem.js';
import { MonsterHunterVFX } from '../src/graphics/MonsterHunterVFX.js';
import { MonsterHunterHUD } from '../src/ui/MonsterHunterHUD.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

test('1. RhynthBoss: 1:1 canon Ryushi megafauna, breakable horns, dorsal armor, club tail & topple', () => {
  const scene = new THREE.Scene();
  const boss = new RhynthBoss(scene);

  assert.equal(boss.colliderRadius, 7.8);
  assert.equal(boss.maxHealth, 2850);
  assert.equal(boss.hornIntact, true);
  assert.equal(boss.armorPlatesIntact, true);
  assert.equal(boss.tailIntact, true);

  // Rotation-invariant local-to-world hitboxes
  boss.mesh.rotation.y = Math.PI / 2;
  const hornPos = boss.getHornWorldPosition();
  assert.ok(hornPos.isVector3);
  assert.ok(boss.getTailWorldPosition().isVector3);

  // resolveProjectileImpact on horn
  const impact = boss.resolveProjectileImpact(hornPos, 0.5, hornPos);
  assert.ok(impact);
  assert.equal(impact.distanceTo(hornPos), 0);

  // Damage horn until break
  boss.takeDamage(400, hornPos);
  assert.equal(boss.hornIntact, false);

  // Damage armor plates until fracture, exposing core
  boss.takeDamage(600, boss.position);
  assert.equal(boss.armorPlatesIntact, false);
  assert.equal(boss.coreExposed, true);

  // Sever tail
  const tailPos = boss.getTailWorldPosition();
  boss.takeDamage(500, tailPos);
  assert.equal(boss.tailIntact, false);
  assert.ok(boss.severedTailMesh);
  assert.equal(boss.severedTailMesh.userData.isCarveable, true);

  // Trigger Topple
  boss.triggerTopple(7.5);
  assert.equal(boss.isToppled, true);
  assert.equal(boss.aiState, 'toppled');

  boss.dispose();
});

test('2. XenomorphKingBoss: 1:1 canon Rogue Titan, trident crown, acid core, dual-bladed tail', () => {
  const scene = new THREE.Scene();
  const boss = new XenomorphKingBoss(scene);

  assert.equal(boss.colliderRadius, 8.0);
  assert.equal(boss.maxHealth, 3400);
  assert.equal(boss.crownIntact, true);
  assert.equal(boss.ribcageIntact, true);
  assert.equal(boss.tailIntact, true);

  // Rotation test
  boss.mesh.rotation.y = Math.PI;
  const crownPos = boss.getCrownWorldPosition();
  assert.ok(crownPos.isVector3);

  // Projectile impact on crown
  const hit = boss.resolveProjectileImpact(crownPos, 0.5, crownPos);
  assert.ok(hit);

  // Break crown
  boss.takeDamage(450, crownPos);
  assert.equal(boss.crownIntact, false);

  // Sever double-bladed tail
  const tailPos = boss.getTailWorldPosition();
  boss.takeDamage(550, tailPos);
  assert.equal(boss.tailIntact, false);
  assert.ok(boss.severedTailMesh);
  assert.equal(boss.severedTailMesh.userData.trophyType, 'KING_SEVERED_DUAL_BLADES');

  // Break ribcage to expose core
  boss.takeDamage(700, boss.position);
  assert.equal(boss.ribcageIntact, false);
  assert.equal(boss.coreExposed, true);

  // Critical damage on exposed core
  const corePos = boss.getCoreWorldPosition();
  const hpBefore = boss.health;
  boss.takeDamage(100, corePos);
  assert.equal(hpBefore - boss.health, 280); // 2.8x multiplier

  boss.dispose();
});

test('3. VydrachBoss: 1:1 Yautja Prime winged dragon, multi-part hitboxes & tail stinger', () => {
  const scene = new THREE.Scene();
  const boss = new VydrachBoss(scene);

  assert.equal(boss.colliderRadius, 8.5);
  assert.equal(boss.maxHealth, 3200);

  // Multi-part resolveProjectileImpact
  const crestPos = boss.getCrestWorldPosition();
  assert.ok(boss.resolveProjectileImpact(crestPos, 0.5, crestPos));

  // Deal full damage to sever tail (tailHealth is 450)
  const tailPos = boss.getTailWorldPosition();
  boss.takeDamage(500, tailPos);
  assert.equal(boss.tailIntact, false);
  assert.ok(boss.severedTailMesh);

  boss.dispose();
});

test('4. MegafaunaBoss & XenomorphQueen: Sizing fixes and multi-part hitboxes', () => {
  const scene = new THREE.Scene();
  const megafauna = new MegafaunaBoss(scene);
  const queen = new XenomorphQueen(scene);

  // Verify calibrated sizes
  assert.equal(megafauna.colliderRadius, 6.5);
  assert.equal(queen.colliderRadius, 4.5);

  // Megafauna resolveProjectileImpact
  const hornPos = megafauna.getHornWorldPosition();
  assert.ok(megafauna.resolveProjectileImpact(hornPos, 0.5, hornPos));

  // Queen resolveProjectileImpact
  const crownPos = queen.getCrownWorldPosition();
  assert.ok(queen.resolveProjectileImpact(crownPos, 0.5, crownPos));

  megafauna.dispose();
  queen.dispose();
});

test('5. BossFactory: constructs vydrach, rhynth, and xenoKing with unified interface', () => {
  for (const bossType of ['vydrach', 'rhynth', 'xenoKing']) {
    const scene = new THREE.Scene();
    const boss = createBoss(scene, { bossType });
    assert.ok(boss.mesh);
    assert.ok(boss.colliderRadius >= 7.8);
    assert.equal(typeof boss.takeDamage, 'function');
    assert.equal(typeof boss.resolveProjectileImpact, 'function');
    assert.equal(typeof boss.triggerTopple, 'function');
    boss.dispose();
  }
});

test('6. Parity: HUNT_DEFINITIONS, CURRENT_HUNTS & Loadout Recommendations', () => {
  const runtimeIds = Object.keys(HUNT_DEFINITIONS);
  const codexIds = CURRENT_HUNTS.map(({ id }) => id);
  assert.deepEqual([...runtimeIds].sort(), [...codexIds].sort());

  assert.ok(HUNT_DEFINITIONS.vydrach_prime);
  assert.ok(HUNT_DEFINITIONS.rhynth_titan);
  assert.ok(HUNT_DEFINITIONS.xeno_king);

  const vydrachRec = getRecommendedHuntLoadout({ huntType: 'vydrach_prime' });
  assert.equal(vydrachRec.validation.valid, true);

  const rhynthRec = getRecommendedHuntLoadout({ huntType: 'rhynth_titan' });
  assert.equal(rhynthRec.validation.valid, true);

  const kingRec = getRecommendedHuntLoadout({ huntType: 'xeno_king' });
  assert.equal(kingRec.validation.valid, true);
});

test('7. MonsterHunterEcologySystem: Carving ritual of severed tails & carcasses (+1000 Honor)', () => {
  const scene = new THREE.Scene();
  const ecology = new MonsterHunterEcologySystem(scene);

  const boss = new RhynthBoss(scene);
  ecology.bindTargetMonster(boss);

  // Carve severed tail
  const tailCarve = ecology.performYautjaCarve('SEVERED_TAIL');
  assert.equal(tailCarve.status, 'CARVE_COMPLETED');
  assert.equal(tailCarve.yautjaRitualValidated, true);
  assert.ok(tailCarve.materials.length > 0);

  // Carve main carcass with new ecology instance
  const ecology2 = new MonsterHunterEcologySystem(scene);
  boss.isDead = true;
  ecology2.bindTargetMonster(boss);
  const carcassCarve = ecology2.performYautjaCarve('CARCASS');
  assert.equal(carcassCarve.status, 'CARVE_COMPLETED');
  assert.equal(carcassCarve.yautjaRitualValidated, true);
  assert.ok(carcassCarve.materials.some((m) => m.name.includes('Crâne') || m.name.includes('Sang')));

  boss.dispose();
  ecology.dispose();
  ecology2.dispose();
});

test('8. Level Design Traps: Suspended boulders (topple) & Thermal mud pits', () => {
  const scene = new THREE.Scene();
  const ecology = new MonsterHunterEcologySystem(scene);

  const boss = new XenomorphKingBoss(scene);
  ecology.bindTargetMonster(boss);

  // Falling boulder trap
  const boulderPos = new THREE.Vector3(10, 0, 10);
  const monsterPos = new THREE.Vector3(10, 0, 10);
  const trapResult = ecology.triggerEnvironmentalFallingBoulder(boulderPos, monsterPos);

  assert.equal(trapResult.monsterHit, true);
  assert.equal(trapResult.damageDealt, 850);
  assert.equal(trapResult.toppleTriggered, true);
  assert.equal(boss.isToppled, true);

  // Thermal mud camouflage pit
  const mudResult = ecology.applyThermalCamouflageMud();
  assert.equal(mudResult.status, 'THERMAL_MUD_APPLIED');
  assert.ok(mudResult.durationSeconds > 0);
  assert.equal(mudResult.invisibleToMonsterSenses, true);

  boss.dispose();
  ecology.dispose();
});
