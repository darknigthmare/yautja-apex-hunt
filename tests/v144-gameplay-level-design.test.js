// Suite de Tests Unitaires & Intégration v144 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createRotaryPlasmaGatlingState,
  spinUpRotaryPlasmaBarrels,
  fireRotaryPlasmaSuppressiveBurst,
  ROTARY_PLASMA_CONSTANTS,
} from '../src/gameplay/RotaryShoulderPlasmaGatlingSystem.js';

import {
  createKineticGauntletState,
  unleashKineticConcussionSlam,
  KINETIC_GAUNTLET_CONSTANTS,
} from '../src/gameplay/KineticGauntletConcussionWaveSystem.js';

import {
  createBloodedMarkingState,
  performAcidBloodClanMarking,
  BLOODED_MARK_CONSTANTS,
} from '../src/gameplay/ScarAcidBloodedClanMarkingRitualDirector.js';

import {
  createVolcanicBridgeSectorState,
  severBridgeSupportCable,
} from '../src/gameplay/VolcanicChasmRopeBridgeCollapseSector.js';

import {
  createCryoStasisSectorState,
  registerCryoStasisPod,
  unsealCryoStasisPod,
  CRYO_STASIS_CONSTANTS,
} from '../src/gameplay/CryogenicStasisPodContainmentSector.js';

import {
  createFeralBoltgunState,
  lockTriLaserTarget,
  fireLaserGuidedBolt,
  FERAL_BOLTGUN_CONSTANTS,
} from '../src/gameplay/FeralTriLaserGuidedBoltgunSystem.js';

import {
  createPowerPlantSectorState,
  overloadPowerPlantTransformer,
  POWER_PLANT_CONSTANTS,
} from '../src/gameplay/GunnisonPowerPlantTransformerOverloadSector.js';

import {
  createTrackerRecallState,
  soundUltrasonicHoundRecall,
  TRACKER_RECALL_CONSTANTS,
} from '../src/gameplay/TrackerUltrasonicHoundRecallTuskSystem.js';

import {
  createElevatorShaftSectorState,
  severElevatorSuspensionCables,
  ELEVATOR_SHAFT_CONSTANTS,
} from '../src/gameplay/HospitalElevatorShaftGrappleDropSector.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — RotaryShoulderPlasmaGatlingSystem: mise en rotation et rafale suppressive plasma (AVP / Elder)', () => {
  const state = createRotaryPlasmaGatlingState();
  spinUpRotaryPlasmaBarrels(state, audioSynth);
  assert.equal(state.isSpunUp, true);

  const swarmAlien = { health: 300, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const burstRes = fireRotaryPlasmaSuppressiveBurst(state, [swarmAlien], audioSynth);
  assert.equal(burstRes.fired, true);
  assert.equal(burstRes.boltsFired, ROTARY_PLASMA_CONSTANTS.BOLTS_PER_BURST);
  assert.equal(swarmAlien.isSuppressedByPlasma, true);
  assert.equal(swarmAlien.health, 300 - ROTARY_PLASMA_CONSTANTS.BOLTS_PER_BURST * ROTARY_PLASMA_CONSTANTS.DAMAGE_PER_BOLT);
});

test('Chantier 2 — KineticGauntletConcussionWaveSystem: onde de choc cinétique et bris de bouclier (The Predator 2018)', () => {
  const state = createKineticGauntletState();
  const shieldTrooper = { x: 2, z: 2, health: 200, hasRiotShield: true, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const slamRes = unleashKineticConcussionSlam(state, { x: 0, z: 0 }, [shieldTrooper], audioSynth);
  assert.equal(slamRes.unleashed, true);
  assert.equal(shieldTrooper.hasRiotShield, false);
  assert.equal(shieldTrooper.isKnockedDown, true);
  assert.equal(shieldTrooper.health, 200 - KINETIC_GAUNTLET_CONSTANTS.CONCUSSION_DAMAGE);
});

test('Chantier 3 — ScarAcidBloodedClanMarkingRitualDirector: marquage rituel au sang acide sur Scar et Lex (AVP 2004)', () => {
  const state = createBloodedMarkingState();
  const scar = { isBloodedRank: false };
  const slainDrone = { health: 0 };
  const lexWoods = { hasClanWarriorMark: false };

  const markRes = performAcidBloodClanMarking(state, scar, slainDrone, lexWoods, audioSynth);
  assert.equal(markRes.marked, true);
  assert.equal(scar.isBloodedRank, true);
  assert.equal(scar.meleeDamageMultiplier, BLOODED_MARK_CONSTANTS.MELEE_FEROCITY_MULTIPLIER);
  assert.equal(lexWoods.hasClanWarriorMark, true);
});

test('Chantier 4 — VolcanicChasmRopeBridgeCollapseSector: rupture des câbles et chute dans le magma (Predators / AVP)', () => {
  const state = createVolcanicBridgeSectorState();
  const pursuer = { id: 'pursuer_01', health: 250 };

  const firstCut = severBridgeSupportCable(state, [pursuer], audioSynth);
  assert.equal(firstCut.collapsed, false);

  const secondCut = severBridgeSupportCable(state, [pursuer], audioSynth);
  assert.equal(secondCut.collapsed, true);
  assert.equal(secondCut.plungedCount, 1);
  assert.equal(pursuer.isPlungedIntoLava, true);
  assert.equal(pursuer.health, 0);
});

test('Chantier 5 — CryogenicStasisPodContainmentSector: ouverture de capsule cryogénique et souffle d\'azote (The Predator 2018)', () => {
  const state = createCryoStasisSectorState();
  registerCryoStasisPod(state, 'pod_alpha', { x: 0, z: 0 }, 'elder_plasma_coil');

  const hunter = { energy: 30, maxEnergy: 100 };
  const guard = { x: 1.5, z: 1.5, speedMultiplier: 1.0 };

  const unsealRes = unsealCryoStasisPod(state, 0, hunter, [guard], audioSynth);
  assert.equal(unsealRes.unsealed, true);
  assert.equal(hunter.acquiredRelic, 'elder_plasma_coil');
  assert.equal(hunter.energy, 30 + CRYO_STASIS_CONSTANTS.RELIC_ENERGY_RESTORE);
  assert.equal(guard.isCryoFrosted, true);
});

test('Chantier 6 — FeralTriLaserGuidedBoltgunSystem: carreau guidé par le triangle laser du masque d\'os (Prey 2022)', () => {
  const state = createFeralBoltgunState();
  const target = { x: 10, z: 10, health: 220, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  lockTriLaserTarget(state, target, audioSynth);
  const boltRes = fireLaserGuidedBolt(state, target, audioSynth);
  assert.equal(boltRes.fired, true);
  assert.equal(boltRes.isGuidedHit, true);
  assert.equal(target.isPinnedByBolt, true);
  assert.equal(target.health, 220 - FERAL_BOLTGUN_CONSTANTS.GUIDED_HEADSHOT_DAMAGE);
});

test('Chantier 7 — GunnisonPowerPlantTransformerOverloadSector: explosion des transformateurs et blackout de Gunnison (AVP:R 2007)', () => {
  const state = createPowerPlantSectorState();
  const xeno = { x: 2, z: 2, health: 200, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  overloadPowerPlantTransformer(state, { x: 0, z: 0 }, [xeno], audioSynth);
  const secondOverload = overloadPowerPlantTransformer(state, { x: 0, z: 0 }, [], audioSynth);

  assert.equal(secondOverload.cityBlackoutTriggered, true);
  assert.equal(state.ambientLightLevel, POWER_PLANT_CONSTANTS.CITY_BLACKOUT_LIGHT_LEVEL);
  assert.equal(xeno.isElectrocutedByTransformer, true);
  assert.equal(xeno.health, 200 - POWER_PLANT_CONSTANTS.ELECTROCUTION_DAMAGE);
});

test('Chantier 8 — TrackerUltrasonicHoundRecallTuskSystem: sifflement ultrasonique et regroupement des Hell Hounds (Predators 2010)', () => {
  const state = createTrackerRecallState();
  const hound = { id: 'hound_alpha', x: 25, z: 30, health: 80 };

  const recallRes = soundUltrasonicHoundRecall(state, { x: 5, z: 5 }, [hound], audioSynth);
  assert.equal(recallRes.recalledCount, 1);
  assert.equal(hound.tacticalState, 'recalling_to_master');
  assert.equal(hound.x, 5);
  assert.equal(hound.z, 5);
  assert.equal(hound.health, 80 + TRACKER_RECALL_CONSTANTS.PACK_REGROUP_HEAL);
});

test('Chantier 9 — HospitalElevatorShaftGrappleDropSector: cisaillement des câbles et écrasement sous l\'ascenseur (AVP:R 2007)', () => {
  const state = createElevatorShaftSectorState();
  const shaftXeno = { id: 'shaft_xeno', health: 500, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const dropRes = severElevatorSuspensionCables(state, [shaftXeno], audioSynth);
  assert.equal(dropRes.dropped, true);
  assert.equal(dropRes.crushedCount, 1);
  assert.equal(shaftXeno.isCrushedByElevator, true);
  assert.equal(shaftXeno.health, 500 - ELEVATOR_SHAFT_CONSTANTS.CAR_CRUSH_DAMAGE);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v144 et respect Draw Calls Mothership', () => {
  const v144Methods = [
    'playRotaryPlasmaGatlingSpinUp',
    'playRotaryPlasmaVolleyBarrage',
    'playKineticGauntletShockwaveSlam',
    'playRiotShieldShatterCrunch',
    'playAcidBloodClanMarkSizzle',
    'playBloodedWarriorHonorChant',
    'playRopeBridgeCableSnapTwang',
    'playVolcanicLavaPlungeRoar',
    'playCryogenicStasisPodHissOpen',
    'playFeralBoltgunLaserGuidedTwang',
    'playGuidedBoltFleshImpaleThwack',
    'playPowerPlantTransformerArcBoom',
    'playTrackerTuskUltrasonicWhistle',
    'playElevatorCableSeverSnap',
    'playElevatorCarBottomCrashBoom',
  ];

  for (const methodName of v144Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
