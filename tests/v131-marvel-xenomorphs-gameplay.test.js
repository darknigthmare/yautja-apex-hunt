import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  ALPHA_CONSTANTS,
  createAlphaXenomorphState,
  updateAlphaXenomorphDirector,
  executeAlphaTailCleave,
} from '../src/gameplay/AlphaXenomorphBossDirector.js';
import {
  SWARMLET_CONSTANTS,
  createSwarmletBroodState,
  spawnSwarmletPack,
  updateSwarmletBrood,
  shakeOffOrMeleeSwarmlets,
} from '../src/gameplay/XenomorphSwarmletBroodSystem.js';
import {
  SPITTER_CONSTANTS,
  createSpitterState,
  fireAcidGlobe,
  updateSpitterSystem,
} from '../src/gameplay/AcidSpitterGlandSystem.js';
import {
  CRUSHER_CONSTANTS,
  CRUSHER_STATES,
  createCrusherState,
  beginCrusherCharge,
  updateCrusherSystem,
  processCrusherDamage,
} from '../src/gameplay/ArmoredCrusherChargeSystem.js';
import {
  RESIN_WEB_CONSTANTS,
  createHiveResinWebbingState,
  updateHiveResinWebs,
  burnOrDissolveWeb,
} from '../src/gameplay/HiveResinWebbingSector.js';
import {
  SCRAMBLER_CONSTANTS,
  createPheromonalScramblerState,
  activatePheromonalScrambler,
  updatePheromonalScrambler,
} from '../src/gameplay/PheromonalScramblerGauntlet.js';
import {
  TENDRIL_CONSTANTS,
  createTendrilXenomorphState,
  lashTendrilAtTarget,
  updateTendrilXenomorph,
  severTendrilGrapple,
} from '../src/gameplay/TendrilXenomorphLashSystem.js';
import {
  GEYSER_CONSTANTS,
  createAcidMistGeyserState,
  updateAcidMistGeysers,
  igniteGeyserVolatiles,
} from '../src/gameplay/AcidMistGeyserSector.js';
import {
  SYNAPTIC_SHRIEK_CONSTANTS,
  createSynapticShriekState,
  executeAlphaSynapticShriek,
  updateSynapticShriekDirector,
} from '../src/gameplay/AlphaSynapticShriekDirector.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('Chantier 1 — Boss Xénomorphe Alpha et brume acide des conduits dorsaux (Lore 1:1 Marvel)', () => {
  const alpha = createAlphaXenomorphState({ x: 0, y: 0, z: -20 });
  assert.equal(alpha.health, ALPHA_CONSTANTS.MAX_HEALTH);
  assert.equal(alpha.isEnraged, false);

  const hunter = { id: 'player_hunter', x: 0, y: 0, z: -18, health: 300, takeDamage(d) { this.health -= d; } };

  // Coup de queue barbelée balayant l'arc frontal
  const cleave = executeAlphaTailCleave(alpha, hunter, audioSynth);
  assert.ok(cleave);
  assert.equal(cleave.damageDealt, ALPHA_CONSTANTS.SWEEP_TAIL_DAMAGE);
  assert.equal(hunter.isKnockedProne, true);

  // Passage sous les 50% de santé : Enrage et brume acide active
  alpha.health = ALPHA_CONSTANTS.MAX_HEALTH * 0.45;
  const updateResult = updateAlphaXenomorphDirector(alpha, 1.0, hunter, [], audioSynth);
  assert.equal(alpha.isEnraged, true);
  assert.equal(updateResult.isVenting, true);
  assert.ok(hunter.health < (300 - ALPHA_CONSTANTS.SWEEP_TAIL_DAMAGE), 'La brume acide doit blesser le chasseur au corps-à-corps');
});

test('Chantier 2 — Essaim de Swarmlets, agrippement aux chevilles et ralentissement (Lore 1:1 Marvel)', () => {
  const state = createSwarmletBroodState();
  const origin = { x: 0, y: 0, z: -10 };

  const pack = spawnSwarmletPack(state, origin, 6, audioSynth);
  assert.equal(pack.length, 6);
  assert.equal(state.swarmlets.length, 6);

  const hunter = { id: 'player_hunter', x: 0, y: 0, z: -9.5, health: 250, takeDamage(d) { this.health -= d; } };

  // Les petits s'agrippent et mordent
  updateSwarmletBrood(state, 0.5, hunter, audioSynth);
  assert.ok(state.totalLatchedCount > 0);
  assert.ok(hunter.moveSpeedModifier < 1.0, 'La vitesse du chasseur doit être ralentie par l\'essaim');

  // Balayage de lame pour se débarrasser des swarmlets
  const killed = shakeOffOrMeleeSwarmlets(state, 50.0);
  assert.ok(killed > 0);
});

test('Chantier 3 — Spitter Xénomorphe d\'artillerie et orbes d\'acide corrosif (Lore 1:1 Marvel)', () => {
  const spitter = createSpitterState({ x: 0, y: 0, z: -20 });
  const hunter = { id: 'player_hunter', x: 0, y: 0, z: 0, health: 200, takeDamage(d) { this.health -= d; } };

  // Tir balistique d'un globe d'acide
  const globe = fireAcidGlobe(spitter, { x: 0, y: 0, z: 0 }, audioSynth);
  assert.ok(globe);
  assert.equal(spitter.activeGlobes.length, 1);

  // Simulation de vol et impact
  updateSpitterSystem(spitter, 1.0, hunter, audioSynth);
  assert.ok(hunter.health < 200);
  assert.equal(spitter.acidPools.length, 1);
  assert.ok(spitter.acidPools[0].radius >= SPITTER_CONSTANTS.ACID_POOL_RADIUS);
});

test('Chantier 4 — Crusher titan cuirassé, charge d\'éperonnage et étourdissement contre mur (Lore 1:1 Marvel)', () => {
  const crusher = createCrusherState({ x: 0, y: 0, z: -20 });
  const wallObstacle = { id: 'concrete_pillar', x: 0, y: 0, z: -5, radius: 2.0 };

  // Démarrage de la charge d'éperonnage
  const charged = beginCrusherCharge(crusher, { x: 0, z: 0 }, audioSynth);
  assert.equal(charged, true);
  assert.equal(crusher.state, CRUSHER_STATES.WINDUP);

  // Transition vers CHARGING puis collision contre le pilier
  updateCrusherSystem(crusher, 1.0, null, [wallObstacle], audioSynth); // Windup termine
  updateCrusherSystem(crusher, 1.5, null, [wallObstacle], audioSynth); // Charge et percute le mur

  assert.equal(crusher.state, CRUSHER_STATES.STUNNED);
  assert.ok(crusher.stunTimer > 0);

  // Dégâts critiques infligés au ventre exposé pendant l'étourdissement
  const criticalDmg = processCrusherDamage(crusher, { x: 0, z: 1 }, 100.0);
  assert.equal(criticalDmg, 100.0 * CRUSHER_CONSTANTS.UNDERBELLY_VULNERABILITY_MULT);
});

test('Chantier 5 — Toiles de résine sécrétée de la ruche et transmission de vibrations (Lore 1:1 Marvel)', () => {
  const state = createHiveResinWebbingState();
  const alertXeno = { id: 'drone_guard', x: 5, y: 0, z: -15, isAlerted: false };

  // Passage du joueur à travers la toile
  const actorPos = { x: 0, y: 0, z: -12 };
  const check = updateHiveResinWebs(state, actorPos, [alertXeno], audioSynth);

  assert.equal(check.isInWeb, true);
  assert.equal(check.hiveAlerted, true);
  assert.equal(alertXeno.isAlerted, true);

  // Incinération de la toile
  const burned = burnOrDissolveWeb(state, 'web_arch_01');
  assert.equal(burned, true);
  assert.equal(state.webNodes[0].isIntact, false);
});

test('Chantier 6 — Brouilleur phéromonal de gantelet et frénésie fratricide (Lore 1:1 Yautja / Marvel)', () => {
  const state = createPheromonalScramblerState();
  const hunterPos = { x: 0, y: 0, z: 0 };

  const alphaXeno = { id: 'alpha_1', species: 'xenomorph_alpha', x: 5, z: 5, isDead: false };
  const droneXeno = { id: 'drone_1', species: 'xenomorph_drone', x: 4, z: 6, isDead: false };

  // Activation de la balise phéromonale
  const activated = activatePheromonalScrambler(state, hunterPos, [alphaXeno, droneXeno], audioSynth);
  assert.equal(activated, true);
  assert.equal(alphaXeno.hiveControlSevered, true);
  assert.equal(droneXeno.isInfighting, true);
  assert.equal(state.confusedXenosCount, 1);
});

test('Chantier 7 — Xénomorphe à vrilles spinales et harponnage de proie (Lore 1:1 Marvel: Descendant)', () => {
  const state = createTendrilXenomorphState({ x: 0, y: 0, z: -5 });
  const preyHuman = { id: 'weyland_guard', x: 0, y: 0, z: 0, health: 100, takeDamage(d) { this.health -= d; } };

  // Harponnage à distance par les vrilles
  const lashed = lashTendrilAtTarget(state, preyHuman, audioSynth);
  assert.equal(lashed, true);
  assert.equal(state.isGrappling, true);
  assert.equal(preyHuman.isGrappled, true);
  assert.equal(preyHuman.health, 100 - TENDRIL_CONSTANTS.GRAB_DAMAGE);

  // Traction vers le corps du xénomorphe
  updateTendrilXenomorph(state, 0.4, audioSynth);
  assert.ok(preyHuman.z < 0, 'La victime doit être tractée vers le xénomorphe');

  // Section du tentacule
  const severed = severTendrilGrapple(state, 60.0);
  assert.equal(severed, true);
  assert.equal(state.isGrappling, false);
  assert.equal(preyHuman.isGrappled, false);
});

test('Chantier 8 — Geysers de vapeur acide et déflagration secondaire (Lore 1:1 Marvel)', () => {
  const state = createAcidMistGeyserState();
  const hunter = { id: 'player_hunter', x: -6.0, y: 0, z: -15.0, health: 150, takeDamage(d) { this.health -= d; } };

  // Déclenchement de l'éruption du geyser
  updateAcidMistGeysers(state, 1.1, [hunter], audioSynth);
  assert.equal(state.geysers[0].isErupting, true);
  assert.ok(hunter.health < 150);

  // Allumage pyrotechnique du gaz volatil
  const ignited = igniteGeyserVolatiles(state, 'geyser_alpha', [hunter], audioSynth);
  assert.equal(ignited, true);
  assert.equal(hunter.isKnockedProne, true);
});

test('Chantier 9 — Cri synaptique télépathique de l\'Alpha et panne de HUD (Lore 1:1 Marvel)', () => {
  const state = createSynapticShriekState();
  const alphaPos = { x: 0, y: 0, z: -10 };
  const hunter = { id: 'player_hunter', x: 0, y: 0, z: 0, isHudDisabled: false };
  const swarmlet = { id: 'swarm_1', x: 2, y: 0, z: -8, inFrenzy: false };

  // Déclenchement du cri synaptique
  const shrieked = executeAlphaSynapticShriek(state, alphaPos, hunter, [swarmlet], audioSynth);
  assert.equal(shrieked, true);
  assert.equal(hunter.isHudDisabled, true);
  assert.equal(swarmlet.inFrenzy, true);
  assert.equal(swarmlet.speedMultiplier, SYNAPTIC_SHRIEK_CONSTANTS.SWARM_FRENZY_SPEED_BUFF);

  // Rétablissement après la durée d'effet
  updateSynapticShriekDirector(state, SYNAPTIC_SHRIEK_CONSTANTS.HUD_SCRAMBLE_DURATION + 0.1, hunter);
  assert.equal(hunter.isHudDisabled, false);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v131 et respect Draw Calls Mothership', () => {
  const v131AudioMethods = [
    'playAlphaXenoRoar',
    'playAlphaAcidVentHiss',
    'playSwarmletScuttle',
    'playSwarmletBiteChirp',
    'playSpitterAcidGlobeLaunch',
    'playSpitterAcidSplatImpact',
    'playCrusherHeavyGallop',
    'playCrusherRamImpact',
    'playResinWebStickSnap',
    'playScramblerBeaconPulse',
    'playSwarmFrenzyHiss',
    'playTendrilLashWhip',
    'playTendrilConstrictChoke',
    'playAcidGeyserEruption',
    'playAlphaSynapticEMP',
  ];

  v131AudioMethods.forEach(method => {
    assert.equal(typeof audioSynth[method], 'function', `AudioSynthesizer.${method} doit exister`);
  });

  // Vérification stricte du plafond de draw calls (<= 300)
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);
  try {
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `Draw calls (${snapshot.drawCallEstimate}) doit être <= 300`);
  } finally {
    hub.dispose();
  }
});
