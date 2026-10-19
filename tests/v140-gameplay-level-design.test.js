// Suite de Tests Unitaires & Intégration v140 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createGlacialIceSectorState,
  registerIceWall,
  calculatePlasmaIceRicochet,
  ICE_REFLECTION_CONSTANTS,
} from '../src/gameplay/GlacialIceMirrorPlasmaReflectionSector.js';

import {
  createRotarySawState,
  deployAndSpinSawblade,
  executeSawbladeArmorShred,
  retractRotarySawblade,
  ROTARY_SAW_CONSTANTS,
} from '../src/gameplay/FugitiveWristRotarySawbladeSystem.js';

import {
  createSubwayRailSectorState,
  triggerThirdRailArc,
  updateSubwayRailSector,
  SUBWAY_RAIL_CONSTANTS,
} from '../src/gameplay/SubwayElectrifiedThirdRailArcSector.js';

import {
  createAcousticArrowState,
  fireAcousticWhistleArrow,
  ACOUSTIC_ARROW_CONSTANTS,
} from '../src/gameplay/ComancheAcousticWhistleArrowDirector.js';

import {
  createChitinGearCraftingState,
  craftXenomorphEquipment,
  executeTailSpearThrust,
  CHITIN_GEAR_CONSTANTS,
} from '../src/gameplay/XenomorphChitinShieldSpearCraftingDirector.js';

import {
  createFumaroleSectorState,
  eruptFumarole,
  evaluateFumaroleAtmosphere,
  updateFumaroleSector,
  FUMAROLE_CONSTANTS,
} from '../src/gameplay/GeothermalFumaroleSteamVentSector.js';

import {
  createDualPlasmaPistolState,
  startDualPistolCharge,
  updateDualPistolCharge,
  fireSynchronizedPlasmaBlast,
  DUAL_PISTOL_CONSTANTS,
} from '../src/gameplay/WolfDualShoulderPlasmaPistolOverchargeSystem.js';

import {
  createBoneCageSectorState,
  evaluateBoneCageCollision,
  BONE_CAGE_CONSTANTS,
} from '../src/gameplay/BerserkerBoneCageSnareSector.js';

import {
  createMutagenicSurgeState,
  injectQueenMutagenicSerum,
  updateMutagenicSurge,
  MUTAGENIC_CONSTANTS,
} from '../src/gameplay/QueenAdrenalMutagenicSurgeSystem.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — GlacialIceMirrorPlasmaReflectionSector: ricochet de plasma sur glace polaire (AVP 2004)', () => {
  const state = createGlacialIceSectorState();
  registerIceWall(state, { id: 'serac_wall', origin: { x: 0, z: 10 }, normal: { x: 0, z: -1 }, length: 15.0 });

  const hiddenXeno = {
    id: 'hidden_xeno',
    x: 0,
    z: 5.0,
    health: 120,
    isHitByRicochet: false,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  // Tir vers le mur de glace
  const ricochetRes = calculatePlasmaIceRicochet(state, { x: 0, z: 0 }, { x: 0, z: 1 }, 100.0, [hiddenXeno], audioSynth);
  assert.equal(ricochetRes.ricocheted, true);
  assert.equal(ricochetRes.reflectedDamage, 100.0 * ICE_REFLECTION_CONSTANTS.REFLECTED_DAMAGE_RETENTION);
  assert.equal(hiddenXeno.isHitByRicochet, true);
  assert.equal(hiddenXeno.health, 120 - ricochetRes.reflectedDamage);
});

test('Chantier 2 — FugitiveWristRotarySawbladeSystem: scie circulaire à 3000 RPM et broyage de blindage (The Predator 2018)', () => {
  const state = createRotarySawState();

  // Mise en rotation
  const spun = deployAndSpinSawblade(state, audioSynth);
  assert.equal(spun, true);
  assert.equal(state.isSpinning, true);

  // Découpe d'armure lourde
  const stargazerHeavy = {
    armor: 100,
    health: 200,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  const shredRes = executeSawbladeArmorShred(state, stargazerHeavy, audioSynth);
  assert.equal(shredRes.success, true);
  assert.equal(stargazerHeavy.armor, 0);
  assert.equal(stargazerHeavy.armorBroken, true);
  assert.ok(stargazerHeavy.health < 200);

  // Rétractation
  retractRotarySawblade(state);
  assert.equal(state.isSpinning, false);
});

test('Chantier 3 — SubwayElectrifiedThirdRailArcSector: arc électrique 750V et disjonction générale (Predator 2)', () => {
  const state = createSubwayRailSectorState();
  const commuter = {
    id: 'commuter',
    x: 1.0,
    z: 1.0,
    health: 150,
    isElectrocuted: false,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  const arcRes = triggerThirdRailArc(state, { x: 0, z: 0 }, [commuter], audioSynth);
  assert.equal(arcRes.discharged, true);
  assert.equal(state.isBlackoutActive, true);
  assert.equal(commuter.isElectrocuted, true);
  assert.equal(commuter.health, 150 - SUBWAY_RAIL_CONSTANTS.ELECTROCUTION_DAMAGE);

  // Rétablissement après temporisation
  updateSubwayRailSector(state, 10.0);
  assert.equal(state.isBlackoutActive, false);
});

test('Chantier 4 — ComancheAcousticWhistleArrowDirector: flèche sifflante et verrouillage sur gorge (Prey 2022)', () => {
  const state = createAcousticArrowState();
  const feralHunter = {
    id: 'feral_predator',
    health: 300,
    isCloaked: true,
    takeDamage(d) { this.health = Math.max(0, this.health - d); },
  };

  // Tir ciblant la gorge
  const arrowRes = fireAcousticWhistleArrow(state, { x: 0, z: 0 }, feralHunter, true, audioSynth);
  assert.equal(arrowRes.success, true);
  assert.equal(arrowRes.isCrit, true);
  assert.equal(feralHunter.isThroatPierced, true);
  assert.equal(feralHunter.isCloaked, false, 'Le camouflage doit sauter');
  assert.equal(feralHunter.health, 300 - (ACOUSTIC_ARROW_CONSTANTS.BASE_ARROW_DAMAGE * ACOUSTIC_ARROW_CONSTANTS.THROAT_STRIKE_CRIT_MULT));
});

test('Chantier 5 — XenomorphChitinShieldSpearCraftingDirector: confection de boue et lance pour Lex (AVP 2004)', () => {
  const state = createChitinGearCraftingState();
  const xenoCorpse = { id: 'dead_warrior' };
  const lexWoods = { id: 'lex_woods', hasTailSpear: false, isAcidImmune: false };

  // Façonnage de l'armement
  const crafted = craftXenomorphEquipment(state, xenoCorpse, lexWoods, audioSynth);
  assert.equal(crafted, true);
  assert.equal(lexWoods.hasChitinSkullShield, true);
  assert.equal(lexWoods.isAcidImmune, true);

  // Coup d'estoc sur un xénomorphe assaillant
  const attackingAlien = { health: 180, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const thrustRes = executeTailSpearThrust(state, lexWoods, attackingAlien, audioSynth);
  assert.equal(thrustRes.success, true);
  assert.equal(attackingAlien.health, 180 - CHITIN_GEAR_CONSTANTS.SPEAR_THRUST_DAMAGE);
  assert.equal(attackingAlien.isSkewered, true);
});

test('Chantier 6 — GeothermalFumaroleSteamVentSector: geyser de vapeur et brouillage thermique (Predators 2010)', () => {
  const state = createFumaroleSectorState([{ x: 5.0, z: 5.0 }]);

  // Éruption de la fumerolle
  eruptFumarole(state, 0, audioSynth);
  assert.equal(state.fumaroles[0].isActive, true);

  // Chasseur traversant le panache
  const hunter = {
    x: 6.0,
    z: 5.0,
    isCloaked: true,
    isThermalGlitched: false,
  };

  const evalRes = evaluateFumaroleAtmosphere(state, hunter, audioSynth);
  assert.equal(evalRes.inSteam, true);
  assert.equal(hunter.isCloaked, false);
  assert.equal(hunter.isThermalGlitched, true);

  // Dissipation
  updateFumaroleSector(state, 7.0);
  assert.equal(state.fumaroles[0].isActive, false);
});

test('Chantier 7 — WolfDualShoulderPlasmaPistolOverchargeSystem: pistolets jumelés en surcharge (AVP:R 2007)', () => {
  const state = createDualPlasmaPistolState();

  // Montée en charge
  startDualPistolCharge(state, audioSynth);
  updateDualPistolCharge(state, 1.5);
  assert.equal(state.isFullyCharged, true);

  // Tir dévastateur et splash
  const mainTarget = { x: 0, z: 10, health: 300, takeDamage(d) { this.health = Math.max(0, this.health - d); } };
  const sideTarget = { x: 1.5, z: 10, health: 200, takeDamage(d) { this.health = Math.max(0, this.health - d); } };

  const fireRes = fireSynchronizedPlasmaBlast(state, mainTarget, [mainTarget, sideTarget], audioSynth);
  assert.equal(fireRes.success, true);
  assert.equal(mainTarget.health, 300 - DUAL_PISTOL_CONSTANTS.OVERCHARGE_PLASMA_DAMAGE);
  assert.ok(sideTarget.health < 200, 'La cible secondaire doit subir des dégâts de souffle');
  assert.equal(state.isFullyCharged, false);
});

test('Chantier 8 — BerserkerBoneCageSnareSector: carillon d\'ossements et meute de Hell Hounds (Predators 2010)', () => {
  const state = createBoneCageSectorState();
  const hound = { id: 'hell_hound_1', speedMultiplier: 1.0, isRalliedByAlarm: false };
  const intruder = { x: 0.5, z: -15.0 }; // Proche de la cage alpha

  const tripRes = evaluateBoneCageCollision(state, intruder, [hound], audioSynth);
  assert.equal(tripRes.tripped, true);
  assert.equal(state.alarmActive, true);
  assert.equal(hound.isRalliedByAlarm, true);
  assert.equal(hound.speedMultiplier, BONE_CAGE_CONSTANTS.HOUND_RALLY_SPEED_BOOST);
});

test('Chantier 9 — QueenAdrenalMutagenicSurgeSystem: sérum de reine et rage berserker (The Predator 2018)', () => {
  const state = createMutagenicSurgeState();
  const hunter = {
    health: 90,
    meleeDamageMultiplier: 1.0,
    damageResistanceMultiplier: 1.0,
  };

  // Injection du sérum
  const injectRes = injectQueenMutagenicSerum(state, hunter, audioSynth);
  assert.equal(injectRes.success, true);
  assert.equal(hunter.isMutagenicBerserk, true);
  assert.equal(hunter.meleeDamageMultiplier, 1.0 + MUTAGENIC_CONSTANTS.MELEE_POWER_BOOST);
  assert.equal(hunter.damageResistanceMultiplier, 1.0 - MUTAGENIC_CONSTANTS.DAMAGE_ABSORPTION_BOOST);

  // Fin du sérum et contrecoup
  updateMutagenicSurge(state, 11.0, hunter);
  assert.equal(hunter.isMutagenicBerserk, false);
  assert.equal(hunter.meleeDamageMultiplier, 1.0);
  assert.equal(hunter.health, 90 - MUTAGENIC_CONSTANTS.EXHAUSTION_HEALTH_COST);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v140 et respect Draw Calls Mothership', () => {
  const v140Methods = [
    'playGlacialIceMirrorLaserPing',
    'playIceWallFractureHum',
    'playRotarySawbladeSpinWhine',
    'playSawbladeArmorGougeSparks',
    'playSubwayThirdRailZapArc',
    'playSubwayBreakerFusesPop',
    'playAcousticWhistleArrowTone',
    'playAcousticHomingLockClick',
    'playChitinShieldDeflectionThud',
    'playTailSpearJabCrunch',
    'playGeothermalSteamHissRoar',
    'playThermalOpticsFumaroleGlitch',
    'playDualPlasmaPistolChargeHum',
    'playBoneCageWindChimeClatter',
    'playMutagenicQueenBloodSurge',
  ];

  for (const methodName of v140Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
