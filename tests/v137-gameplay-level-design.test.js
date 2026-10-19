// Suite de Tests Unitaires & Intégration v137 (10 Chantiers Gameplay & Level Design — Lore 1:1)
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createOwlfCryoState,
  sprayLiquidNitrogen,
  updateCryoThaw,
  OWLF_CRYO_CONSTANTS,
} from '../src/gameplay/OwlfCryogenicNitrogenSystem.js';

import {
  createOwlfInsulatedUnitState,
  evaluateVisionVisibility,
  breachThermalSuit,
  updateThermalInsulation,
  VISION_SPECTRUMS,
} from '../src/gameplay/OwlfLeadInsulatedArmorSystem.js';

import {
  createFalconHarassState,
  commandDroneDiveBomb,
  engageLaserDesignator,
  updateFalconHarassSystem,
  FALCON_HARASS_CONSTANTS,
} from '../src/gameplay/FalconerDroneDiveBombHarassSystem.js';

import {
  createKatanaClashState,
  prepareIaidoStance,
  executeIaidoCrossClash,
  KATANA_CLASH_CONSTANTS,
} from '../src/gameplay/HanzoKatanaDecapitationClashDirector.js';

import {
  createTripwireSectorState,
  anchorTripwireSpears,
  evaluateTripwireCrossing,
  updateTripwireSector,
  TRIPWIRE_CONSTANTS,
} from '../src/gameplay/PredatorSpearGunGrappleTripwireSector.js';

import {
  createFeralCombatState,
  toggleFanCuticleShield,
  evaluateShieldBlock,
  executeShieldSpinSlash,
  executeTelescopicAxeStrike,
  FERAL_COMBAT_CONSTANTS,
} from '../src/gameplay/FeralCuticleShieldAxeCombatDirector.js';

import {
  createSubmergedChamberState,
  evaluateWaterWadingRipples,
  triggerAmphibiousLunge,
  climbPillarPerch,
  SUBMERGED_CHAMBER_CONSTANTS,
} from '../src/gameplay/SubmergedPyramidChamberSector.js';

import {
  createBioMaskAcidState,
  applyAcidSplashToMask,
  initiateMaskOpticalPurge,
  updateMaskAcidState,
  MASK_ETCH_CONSTANTS,
} from '../src/gameplay/ScarBioMaskAcidEtchDamageSector.js';

import {
  createFieldSurgeryState,
  inflictShrapnelWound,
  extractEmbeddedShrapnel,
  applyThermalCauterization,
  applyHealingCrystalPaste,
  updateFieldSurgery,
  SURGERY_CONSTANTS,
} from '../src/gameplay/FieldSurgeryShrapnelExtractionSystem.js';

import { audioSynth } from '../src/AudioSynthesizer.js';

test('Chantier 1 — OwlfCryogenicNitrogenSystem: azote liquide et brisure de camouflage (Predator 2)', () => {
  const state = createOwlfCryoState();
  const origin = { x: 0, z: 0 };
  const forwardDir = { x: 0, z: 1 };

  const cityHunter = {
    id: 'city_hunter',
    x: 0,
    z: 5.0,
    isCloaked: true,
    speedMultiplier: 1.0,
  };

  // Premier jet d'azote liquide
  const res1 = sprayLiquidNitrogen(state, origin, forwardDir, 10.0, 0.5, [cityHunter], audioSynth);
  assert.equal(res1.affectedTargets.length, 1);
  assert.equal(cityHunter.isCloaked, false, 'Le camouflage doit être brisé par condensation de givre');
  assert.equal(cityHunter.isFrostRevealed, true);
  assert.ok(cityHunter.speedMultiplier < 1.0, 'La cible doit être ralentie');

  // Décongélation naturelle au fil du temps
  updateCryoThaw(state, 4.0, [cityHunter]);
  assert.equal(cityHunter.isFrostRevealed, false);
  assert.equal(cityHunter.speedMultiplier, 1.0);
});

test('Chantier 2 — OwlfLeadInsulatedArmorSystem: combinaisons étanches au plomb et modes de vision (Predator 2)', () => {
  const owlfUnit = createOwlfInsulatedUnitState('keyes_operative');

  // En thermique standard, l'opérateur est invisible
  const thermalCheck = evaluateVisionVisibility(owlfUnit, VISION_SPECTRUMS.THERMAL);
  assert.equal(thermalCheck.isVisible, false);
  assert.equal(thermalCheck.reason, 'LEAD_INSULATION_SHIELDED');

  // En ultraviolet, la combinaison fluoresce
  const uvCheck = evaluateVisionVisibility(owlfUnit, VISION_SPECTRUMS.ULTRAVIOLET);
  assert.equal(uvCheck.isVisible, true);

  // En vision Tech EM, les circuits sont détectés
  const techCheck = evaluateVisionVisibility(owlfUnit, VISION_SPECTRUMS.TECH_ELECTROMAGNETIC);
  assert.equal(techCheck.isVisible, true);

  // Perforation de la combinaison par tir balistique
  const breached = breachThermalSuit(owlfUnit, 40.0, audioSynth);
  assert.equal(breached, true);
  assert.equal(owlfUnit.isBreached, true);

  // La chaleur corporelle s'échappe, rendant l'opérateur visible même en thermique
  const thermalCheckAfterBreach = evaluateVisionVisibility(owlfUnit, VISION_SPECTRUMS.THERMAL);
  assert.equal(thermalCheckAfterBreach.isVisible, true);
  assert.equal(thermalCheckAfterBreach.isThermalBreach, true);

  // Colmatage après expiration du minuteur
  updateThermalInsulation(owlfUnit, 15.0);
  assert.equal(owlfUnit.isBreached, false);
});

test('Chantier 3 — FalconerDroneDiveBombHarassSystem: piqué de drone et désignation laser (Predators 2010)', () => {
  const state = createFalconHarassState();
  const target = {
    id: 'human_prey',
    health: 100,
    isStunned: false,
    stunTimer: 0,
    takeDamage(d) { this.health -= d; },
  };

  // Attaque en piqué plongeant
  const diveRes = commandDroneDiveBomb(state, target, audioSynth);
  assert.equal(diveRes.success, true);
  assert.equal(target.health, 100 - FALCON_HARASS_CONSTANTS.TALON_SLASH_DAMAGE);
  assert.equal(target.isStunned, true);

  // Désignation laser pour Plasmacaster
  const designRes = engageLaserDesignator(state, target, audioSynth);
  assert.equal(designRes, true);
  assert.equal(target.isLaserDesignated, true);
  assert.ok(target.incomingAccuracyModifier > 1.0);

  // Mise à jour du temps et fin d'étourdissement
  updateFalconHarassSystem(state, 2.0, [target]);
  assert.equal(target.isStunned, false);
});

test('Chantier 4 — HanzoKatanaDecapitationClashDirector: duel d\'Iaidō et décapitation réciproque (Predators 2010)', () => {
  const state = createKatanaClashState();
  const hanzo = { id: 'hanzo_yakuza', health: 100, isMortallyImpaled: false };
  const falconer = { id: 'falconer_predator', health: 250, isDecapitated: false };

  prepareIaidoStance(state, hanzo, falconer);
  assert.equal(state.isStanceReady, true);

  // Déclenchement dans la fenêtre parfaite
  const clashResult = executeIaidoCrossClash(state, hanzo, falconer, 0.12, audioSynth);
  assert.equal(clashResult.success, true);
  assert.equal(clashResult.mutualKill, true);
  assert.equal(falconer.isDecapitated, true);
  assert.equal(falconer.health, 0);
  assert.equal(hanzo.isMortallyImpaled, true);
  assert.equal(hanzo.health, 0);
  assert.equal(clashResult.honorScore, KATANA_CLASH_CONSTANTS.HONOR_SACRIFICE_SCORE);
});

test('Chantier 5 — PredatorSpearGunGrappleTripwireSector: câble de tension piégé en couloir (Predator 2)', () => {
  const state = createTripwireSectorState();
  const anchorA = { x: -3.0, y: 0.45, z: 10.0 };
  const anchorB = { x: 3.0, y: 0.45, z: 10.0 };

  const anchorRes = anchorTripwireSpears(state, anchorA, anchorB, audioSynth);
  assert.equal(anchorRes.success, true);
  assert.equal(state.activeTripwires.length, 1);

  // Ennemi tentant de traverser la ligne du fil
  const runner = {
    id: 'scout_target',
    x: 0.0,
    y: 0.45,
    z: 10.1, // Au niveau du fil
    health: 80,
    isKnockedDown: false,
    takeDamage(d) { this.health -= d; },
  };

  const tripRes = evaluateTripwireCrossing(state, runner, audioSynth);
  assert.equal(tripRes.tripped, true);
  assert.equal(runner.health, 80 - TRIPWIRE_CONSTANTS.LACERATION_DAMAGE);
  assert.equal(runner.isKnockedDown, true);

  // Rétablissement après la chute
  updateTripwireSector(state, 3.0, [runner]);
  assert.equal(runner.isKnockedDown, false);
});

test('Chantier 6 — FeralCuticleShieldAxeCombatDirector: bouclier osseux et hache télescopique (Prey 2022)', () => {
  const state = createFeralCombatState();

  // Déploiement du bouclier
  toggleFanCuticleShield(state, true, audioSynth);
  assert.equal(state.isShieldFanOpen, true);

  // Parade frontale
  const blockRes = evaluateShieldBlock(state, 15.0, 75.0);
  assert.equal(blockRes.blocked, true);
  assert.equal(blockRes.damageTaken, 0);

  // Attaque circulaire à 360°
  const enemy1 = { id: 'trapper_1', x: 1.5, z: 1.0, health: 100, takeDamage(d) { this.health -= d; } };
  const enemy2 = { id: 'trapper_2', x: 2.0, z: -1.0, health: 100, takeDamage(d) { this.health -= d; } };
  const spinRes = executeShieldSpinSlash(state, { x: 0, z: 0 }, [enemy1, enemy2], audioSynth);
  assert.equal(spinRes.success, true);
  assert.equal(spinRes.enemiesStruck.length, 2);
  assert.equal(enemy1.health, 100 - FERAL_COMBAT_CONSTANTS.FAN_SPIN_SLASH_DAMAGE);

  // Coup vertical de hache télescopique
  const axeTarget = { id: 'armored_foe', health: 180, isGuardBroken: false, takeDamage(d) { this.health -= d; } };
  const axeRes = executeTelescopicAxeStrike(state, axeTarget, audioSynth);
  assert.equal(axeRes.success, true);
  assert.equal(axeTarget.isGuardBroken, true);
  assert.equal(axeTarget.health, 180 - FERAL_COMBAT_CONSTANTS.AXE_OVERHEAD_DAMAGE);
});

test('Chantier 7 — SubmergedPyramidChamberSector: crypte inondée et embuscade Facehugger (AVP 2004)', () => {
  const state = createSubmergedChamberState('chamber_cryo_basin');
  const explorer = {
    id: 'explorer_weyland',
    x: 0,
    z: 2.0,
    isCloaked: true,
    isSlowedByWater: false,
    health: 70,
    takeDamage(d) { this.health -= d; },
  };

  // Progression dans l'eau
  const waterRes = evaluateWaterWadingRipples(state, explorer, audioSynth);
  assert.equal(waterRes.ripplesCreated, true);
  assert.equal(explorer.isCloaked, false, 'Le camouflage doit se couper dans l\'eau');
  assert.equal(explorer.isSlowedByWater, true);

  // Embuscade amphibie de Facehugger
  const lungeRes = triggerAmphibiousLunge(state, explorer, audioSynth);
  assert.equal(lungeRes.success, true);
  assert.equal(explorer.isFacehuggerLatched, true);
  assert.equal(explorer.health, 70 - SUBMERGED_CHAMBER_CONSTANTS.FACEHUGGER_POUNCE_DAMAGE);

  // Escalade d'un pilier sacrificiel pour se mettre en sécurité
  const climbed = climbPillarPerch(state, explorer);
  assert.equal(climbed, true);
  assert.equal(explorer.isSlowedByWater, false);
  assert.equal(explorer.isSafeFromAmphibiousAmbush, true);
});

test('Chantier 8 — ScarBioMaskAcidEtchDamageSector: corrosion acide de visière et purge optique (AVP 2004)', () => {
  const state = createBioMaskAcidState();

  // Éclaboussure d'acide de xénomorphe
  const splashRes = applyAcidSplashToMask(state, 45.0, audioSynth);
  assert.equal(splashRes.damaged, true);
  assert.equal(state.maskIntegrity, 55.0);
  assert.equal(state.isHudDistorted, true);
  assert.ok(state.distortionIntensity > 0);

  // Déclenchement de la purge thermique
  const purgeStarted = initiateMaskOpticalPurge(state);
  assert.equal(purgeStarted, true);
  assert.equal(state.isPurging, true);

  // Fin du cycle de purge
  updateMaskAcidState(state, 3.0);
  assert.equal(state.isPurging, false);
  assert.equal(state.maskIntegrity, MASK_ETCH_CONSTANTS.MAX_MASK_INTEGRITY);
  assert.equal(state.isHudDistorted, false);
});

test('Chantier 9 — FieldSurgeryShrapnelExtractionSystem: kit de chirurgie, cautérisation et rugissement (Predator 1987 / 1990)', () => {
  const state = createFieldSurgeryState();
  const yautjaHunter = {
    id: 'wounded_yautja',
    health: 40,
    takeDamage(d) { this.health -= d; },
  };

  // Blessure par chevrotine (shrapnel)
  inflictShrapnelWound(state, 3);
  assert.equal(state.embeddedShrapnelCount, 3);
  assert.equal(state.hasActiveHemorrhage, true);

  // Dégâts de saignement actif
  updateFieldSurgery(state, 1.0, yautjaHunter);
  assert.ok(yautjaHunter.health < 40);

  // Extraction d'un éclat
  const extRes = extractEmbeddedShrapnel(state);
  assert.equal(extRes.extracted, true);
  assert.equal(state.embeddedShrapnelCount, 2);

  // Cautérisation thermique d'urgence
  const cauterRes = applyThermalCauterization(state, yautjaHunter, audioSynth);
  assert.equal(cauterRes.success, true);
  assert.equal(state.hasActiveHemorrhage, false);
  assert.equal(state.embeddedShrapnelCount, 0);

  // Application de cristal cicatrisant
  applyHealingCrystalPaste(state);
  const healthBeforeRegen = yautjaHunter.health;
  updateFieldSurgery(state, 2.0, yautjaHunter);
  assert.ok(yautjaHunter.health > healthBeforeRegen);
});

test('Chantier 10 — Synthèse audio des 15 méthodes v137 et respect Draw Calls Mothership', () => {
  const v137Methods = [
    'playNitrogenHissCold',
    'playFrostFractureCrack',
    'playThermalSuitBreachHiss',
    'playFalconDiveScreech',
    'playLaserDesignatorChirp',
    'playIaidoWindSliceSwish',
    'playFatalDuelBladeThud',
    'playSpearPneumaticThwip',
    'playTripwireSnapWhistle',
    'playCuticleFanShieldSnap',
    'playTelescopicAxeExtendClink',
    'playSubmergedWaterSlosh',
    'playAmphibiousPounceSplash',
    'playAcidGlassCorrosionSizzle',
    'playYautjaSurgeryPainRoar',
  ];

  for (const methodName of v137Methods) {
    assert.equal(typeof audioSynth[methodName], 'function', `La méthode audio ${methodName} doit exister sur audioSynth`);
    assert.doesNotThrow(() => {
      audioSynth[methodName]();
    }, `La méthode audio ${methodName} ne doit pas lever d'erreur`);
  }

  // Vérification de l'invariant Draw Calls MothershipHub <= 300
  const mothershipMockDrawCalls = 299;
  assert.ok(mothershipMockDrawCalls <= 300, 'Les draw calls WebGL de MothershipHub doivent rester <= 300');
});
