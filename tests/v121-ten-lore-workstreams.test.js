import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { audioSynth } from '../src/AudioSynthesizer.js';
import {
  MIMICRY_PROFILES,
  getMimicryProfileById,
  createMimicryState,
  recordAcousticSample,
  updateMimicryCooldowns,
  canTriggerMimicry,
  triggerMimicryLure,
} from '../src/gameplay/YautjaMimicrySystem.js';
import {
  TRI_LASER_LOCK_STATES,
  createTriBeamTargeter,
  updateTriBeamTargeter,
  resetTriBeamLock,
  getTriLaserDotOffsets,
  getBallisticHitResult,
} from '../src/gameplay/TriBeamTargeterSystem.js';
import {
  RITUAL_PHASES,
  TROPHY_PREPARATION_RECIPES,
  createTrophyRitualState,
  queueRawTrophy,
  startTrophyRitual,
  advanceRitualStep,
} from '../src/gameplay/TrophyRitualSystem.js';
import {
  SELF_DESTRUCT_STATES,
  getYautjaGlyphString,
  createSelfDestructState,
  armSelfDestruct,
  abortSelfDestruct,
  updateSelfDestruct,
} from '../src/gameplay/SelfDestructGauntletSystem.js';
import {
  SMART_DISC_STATES,
  createSmartDiscFlight,
  updateSmartDiscFlight,
  catchSmartDisc,
} from '../src/gameplay/SmartDiscPhysics.js';
import {
  createCloakDisruptionTracker,
  evaluateEnvironmentalMoisture,
  updateCloakDisruption,
} from '../src/gameplay/CloakEnvironmentalDisruption.js';
import {
  createWeaponCorrosionState,
  isWeaponAcidResistant,
  applyAcidBloodSplash,
  getWeaponCorrosionDamageFactor,
  neutralizeWeaponAcid,
} from '../src/gameplay/AcidCorrosionSystem.js';
import {
  YAUTJA_CLAN_RANKS,
  CLAN_SCAR_MARKS,
  getClanRankByHonorAndKills,
  createClanPrestigeState,
  applyBloodedRitualMark,
  calculateClanPrestigeBonus,
} from '../src/gameplay/BloodedClanRitualSystem.js';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { getLoreEntryById } from '../src/data/LoreCodex.js';
import { HUDManager } from '../src/HUDManager.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

function createHudStub() {
  const hud = Object.create(HUDManager.prototype);
  hud.logTimeoutId = null;
  hud.logBanner = { textContent: '' };
  hud.setText = (el, val) => { el.textContent = String(val); };
  hud.setClassState = () => {};
  return hud;
}

test('Chantier 1 — Audio & Système d’imitation vocale (Mimicry Lore 1:1)', () => {
  // 1. Nouvelles synthèses audio diégétiques
  const requiredMethods = [
    'playMimicryBillyLaugh',
    'playMimicryWantSomeCandy',
    'playMimicryAnytime',
    'playMimicryRecordBeep',
    'playTriLaserConvergedTone',
    'playSelfDestructCoverOpen',
    'playSelfDestructAscendingHum',
    'playSelfDestructDetonation',
    'playBoneCarvingEtch',
    'playSolventBoil',
    'playSmartDiscFlightHum',
    'playSmartDiscSlice',
    'playSmartDiscCatch',
    'playCloakShortCircuit',
  ];
  requiredMethods.forEach((method) => {
    assert.equal(typeof audioSynth[method], 'function', `${method} doit être implémenté sur audioSynth`);
    assert.doesNotThrow(() => audioSynth[method]());
  });

  // 2. Profils d'imitation vocale
  assert.equal(MIMICRY_PROFILES.length, 5);
  const billy = getMimicryProfileById('billy_laugh');
  assert.equal(billy.tacticalEffect, 'panic');
  assert.ok(billy.sources.includes('predator1987'));

  const candy = getMimicryProfileById('want_some_candy');
  assert.equal(candy.tacticalEffect, 'disorient');
  assert.ok(candy.sources.includes('predator2'));

  // 3. Cycle de gameplay du leurre
  const state = createMimicryState();
  assert.equal(canTriggerMimicry(state, 'over_here'), true);
  assert.equal(canTriggerMimicry(state, 'billy_laugh'), false); // verrouillé au départ

  recordAcousticSample(state, 'billy_laugh');
  assert.equal(canTriggerMimicry(state, 'billy_laugh'), true);

  const mockNpc = {
    position: { x: 10, y: 0, z: 10 },
    isDead: false,
    fearApplied: false,
    applyFear(duration) { this.fearApplied = true; this.fearDuration = duration; },
  };

  const lureResult = triggerMimicryLure(state, 'billy_laugh', { x: 0, z: 0 }, [mockNpc]);
  assert.equal(lureResult.success, true);
  assert.equal(lureResult.affectedNpcs.length, 1);
  assert.equal(mockNpc.fearApplied, true);

  // Vérification cooldown
  assert.equal(canTriggerMimicry(state, 'billy_laugh'), false);
  updateMimicryCooldowns(state, 15.0);
  assert.equal(canTriggerMimicry(state, 'billy_laugh'), true);
});

test('Chantier 2 — Visée tri-laser convergente & Balistique (Lore 1:1)', () => {
  const targeter = createTriBeamTargeter({ lockTimeRequired: 0.5 });
  assert.equal(targeter.state, TRI_LASER_LOCK_STATES.IDLE);

  const origin = { x: 0, y: 1.8, z: 0 };
  const target = { x: 0, y: 1.8, z: 20 };

  // Phase d'acquisition
  updateTriBeamTargeter(targeter, 0.25, origin, target, true);
  assert.equal(targeter.state, TRI_LASER_LOCK_STATES.CONVERGING);
  assert.ok(targeter.convergenceRatio > 0.4 && targeter.convergenceRatio < 0.6);

  // Les 3 points se resserrent
  const midOffsets = getTriLaserDotOffsets(targeter.convergenceRatio);
  assert.equal(midOffsets.length, 3);
  assert.ok(midOffsets[0].radius < 1.25);

  // Verrouillage complet (convergence = 1.0)
  updateTriBeamTargeter(targeter, 0.3, origin, target, true);
  assert.equal(targeter.state, TRI_LASER_LOCK_STATES.LOCKED_CONVERGED);
  assert.equal(targeter.convergenceRatio, 1.0);

  const lockedOffsets = getTriLaserDotOffsets(1.0);
  assert.ok(lockedOffsets[0].radius <= 0.08, 'le rayon doit être inférieur à 0.08m une fois convergé');

  // Résultat du coup critique
  const hitResult = getBallisticHitResult(targeter, 40);
  assert.equal(hitResult.isCritical, true);
  assert.equal(hitResult.damage, 60); // 40 * 1.5

  resetTriBeamLock(targeter);
  assert.equal(targeter.state, TRI_LASER_LOCK_STATES.IDLE);
});

test('Chantier 3 — Rituel de taxidermie et trophées Yautja (Trophy Flensing 1:1)', () => {
  assert.ok(TROPHY_PREPARATION_RECIPES.length >= 4);
  const state = createTrophyRitualState();

  const queued = queueRawTrophy(state, 'human_commando_skull');
  assert.ok(queued);
  assert.equal(queued.phase, RITUAL_PHASES.UNPROCESSED);
  const initialHonor = queued.honorValue;

  const ritual = startTrophyRitual(state, queued.id);
  assert.ok(ritual);
  assert.equal(ritual.phase, RITUAL_PHASES.FLENSING);

  // Étape 1 : Écorchage
  const step1 = advanceRitualStep(state, 'manual_flense');
  assert.equal(step1.success, true);
  assert.equal(ritual.phase, RITUAL_PHASES.ACID_BATH);

  // Étape 2 : Bain de solvant Cleaner
  const step2 = advanceRitualStep(state, 'cleaner_bath');
  assert.equal(step2.success, true);
  assert.equal(ritual.phase, RITUAL_PHASES.BONE_POLISHING);

  // Étape 3 : Polissage thermique
  const step3 = advanceRitualStep(state, 'thermal_polish');
  assert.equal(step3.success, true);
  assert.equal(ritual.phase, RITUAL_PHASES.CLAN_ETCHING);

  // Étape 4 : Gravure du glyphe de clan
  const step4 = advanceRitualStep(state, 'etch_clan_glyph');
  assert.equal(step4.success, true);
  assert.equal(step4.phase, RITUAL_PHASES.CONSECRATED);
  assert.equal(state.consecratedTrophies.length, 1);
  assert.ok(step4.completedTrophy.honorValue > initialHonor);
});

test('Chantier 4 — Dispositif d’autodestruction du gantelet Yautja (Lore 1:1)', () => {
  const destructState = createSelfDestructState({ totalDuration: 4.0, pointOfNoReturn: 1.5 });
  assert.equal(destructState.state, SELF_DESTRUCT_STATES.SAFE);

  // Armement
  const armed = armSelfDestruct(destructState);
  assert.equal(armed, true);
  assert.equal(destructState.state, SELF_DESTRUCT_STATES.COUNTDOWN);
  assert.equal(destructState.coverOpen, true);

  // Affichage en glyphes digitaux
  const glyphs = getYautjaGlyphString(3.4);
  assert.ok(typeof glyphs === 'string' && glyphs.length > 0);

  // Possibilité d'annulation avant le point critique
  const aborted = abortSelfDestruct(destructState);
  assert.equal(aborted, true);
  assert.equal(destructState.state, SELF_DESTRUCT_STATES.ABORTED);

  // Réarmement et passage au point de non-retour
  destructState.state = SELF_DESTRUCT_STATES.SAFE;
  armSelfDestruct(destructState);
  updateSelfDestruct(destructState, 2.8, { x: 0, y: 0, z: 0 }); // reste 1.2s < 1.5s
  assert.equal(destructState.state, SELF_DESTRUCT_STATES.POINT_OF_NO_RETURN);

  // Annulation désormais refusée
  assert.equal(abortSelfDestruct(destructState), false);

  // Détonation
  const mockEnemy = {
    position: { x: 12, y: 0, z: 15 },
    health: 500,
    isDead: false,
    takeDamage(dmg) { this.health -= dmg; if (this.health <= 0) this.isDead = true; },
  };

  updateSelfDestruct(destructState, 1.5, { x: 0, y: 0, z: 0 }, [mockEnemy]);
  assert.equal(destructState.state, SELF_DESTRUCT_STATES.COMPLETED);
  assert.equal(mockEnemy.isDead, true);
});

test('Chantier 5 — Aérodynamique et vol retour du Smart Disc (Lore 1:1)', () => {
  const origin = { x: 0, y: 1.5, z: 0 };
  const launchDir = { x: 0, y: 0, z: 1 };
  const disc = createSmartDiscFlight(origin, launchDir, { speed: 40, maxRange: 20, damage: 90 });

  assert.equal(disc.state, SMART_DISC_STATES.OUTBOUND);

  const mockTarget = {
    position: { x: 0.5, y: 1.5, z: 10 },
    health: 120,
    isDead: false,
  };

  // Vol aller avec courbure
  updateSmartDiscFlight(disc, 0.3, origin, [mockTarget]);
  assert.ok(disc.distanceTraveled > 0);
  assert.equal(mockTarget.health, 30); // 120 - 90

  // Atteinte de la portée max -> Virage d'apex puis retour
  updateSmartDiscFlight(disc, 0.4, origin);
  assert.equal(disc.state, SMART_DISC_STATES.APEX_TURN);

  updateSmartDiscFlight(disc, 0.1, origin);
  assert.equal(disc.state, SMART_DISC_STATES.RETURNING);

  // Vol retour vers le chasseur et capture
  catchSmartDisc(disc, origin);
  assert.equal(disc.state, SMART_DISC_STATES.CAUGHT);
  assert.equal(disc.isCaught, true);
});

test('Chantier 6 — Défaillance et court-circuit du camouflage sous l’eau (Lore 1:1)', () => {
  const tracker = createCloakDisruptionTracker();

  // Test en eau peu profonde (sol à y=0)
  const wetPos = { x: 10, y: 0.2, z: 15 };
  const moisture = evaluateEnvironmentalMoisture(wetPos, 'jungle', { isRaining: false });
  assert.ok(moisture >= 0.8, 'immersion aquatique détectée');

  // Camouflage standard : scintille et se désactive après 2.5s
  updateCloakDisruption(tracker, 1.5, wetPos, 'jungle', {}, { hasAntiAcidCloak: false });
  assert.equal(tracker.isFlickering, true);
  assert.equal(tracker.forcedCloakDrop, false);

  updateCloakDisruption(tracker, 1.2, wetPos, 'jungle', {}, { hasAntiAcidCloak: false });
  assert.equal(tracker.forcedCloakDrop, true);

  // Camouflage avec alliage Cleaner étanche : résiste à l'immersion
  const protectedTracker = createCloakDisruptionTracker();
  updateCloakDisruption(protectedTracker, 3.0, wetPos, 'jungle', {}, { hasAntiAcidCloak: true });
  assert.equal(protectedTracker.forcedCloakDrop, false);
});

test('Chantier 7 — Corrosion par acide moléculaire xénomorphe (Lore 1:1)', () => {
  const state = createWeaponCorrosionState();

  // Attaque contre un ennemi non acide : aucune corrosion
  const humanHit = applyAcidBloodSplash(state, 'wristblades', 'human_commando');
  assert.equal(humanHit.corroded, false);
  assert.equal(state.corrosion.wristblades, 0);

  // Attaque contre un Xénomorphe avec lames standard
  const xenoHit = applyAcidBloodSplash(state, 'wristblades', 'xeno_warrior', 'finish_hunter_worn');
  assert.equal(xenoHit.corroded, true);
  assert.ok(state.corrosion.wristblades > 20);

  // Baisse de l'efficacité tranchante
  const damageFactor = getWeaponCorrosionDamageFactor(state, 'wristblades');
  assert.ok(damageFactor < 1.0);

  // Attaque avec alliage résistant Cleaner
  const resistantHit = applyAcidBloodSplash(state, 'wristblades', 'xeno_warrior', 'finish_cleaner_acid_resistant');
  assert.equal(resistantHit.resistant, true);
  assert.ok(resistantHit.amount < 5.0);

  // Nettoyage au réactif alcalin
  neutralizeWeaponAcid(state, 'wristblades');
  assert.ok(state.corrosion.wristblades < 20);
});

test('Chantier 8 — Progression des rangs de clan & Rite du sang (Blooded Rite 1:1)', () => {
  assert.equal(YAUTJA_CLAN_RANKS.length, 6);
  assert.equal(CLAN_SCAR_MARKS.length, 4);

  // 1. Évaluation des rangs de clan
  const unblooded = getClanRankByHonorAndKills(50, 0);
  assert.equal(unblooded.id, 'unblooded');

  const blooded = getClanRankByHonorAndKills(500, 1);
  assert.equal(blooded.id, 'blooded');

  const elite = getClanRankByHonorAndKills(1200, 4);
  assert.equal(elite.id, 'elite');

  // 2. Marquage du sang et prestige
  const prestigeState = createClanPrestigeState();
  assert.equal(calculateClanPrestigeBonus(prestigeState), 1.0);

  const marked = applyBloodedRitualMark(prestigeState, 'mark_scar_acid_rune');
  assert.equal(marked, true);
  assert.equal(prestigeState.activeMarkId, 'mark_scar_acid_rune');
  assert.ok(calculateClanPrestigeBonus(prestigeState) > 1.1);
});

test('Chantier 9 — Vaisseau Mère : Conseil des Anciens, Stèle et Budget Draw Calls', () => {
  const scene = new THREE.Scene();
  const hub = new MothershipHub(scene);

  try {
    // Vérification de la stèle du Conseil des Anciens dans le Vault
    const stela = hub.group.getObjectByName('vault-elder-council-stela');
    assert.ok(stela, 'La stèle du Conseil des Anciens doit exister');
    assert.equal(stela.userData.clanLeader, 'Greyback');
    assert.equal(stela.userData.relicId, 'adolini_1715_pistol');

    // Méthode d'inspection du Conseil des Anciens
    const councilInfo = hub.getElderCouncilInspection();
    assert.equal(councilInfo.elderRank, 'Greyback · Maître de la Nef');
    assert.equal(councilInfo.codeStatus, 'HONNEUR PRÉSERVÉ');

    // Performance snapshot : draw call estimate <= 300
    const snapshot = hub.getPerformanceSnapshot();
    assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls respecté: ${snapshot.drawCallEstimate}`);

    // Entrées Codex
    const entries = [
      'culture-rituel-marquage-sang',
      'technologie-dispositif-autodestruction',
      'technologie-viseur-trilaser',
    ];
    entries.forEach((id) => {
      const entry = getLoreEntryById(id);
      assert.ok(entry, `L'entrée de codex ${id} doit exister`);
      assert.ok(entry.body.length > 50);
    });
  } finally {
    hub.dispose();
  }
});

test('Chantier 10 — Alertes HUD & Intégration Joueur', () => {
  const hud = createHudStub();

  assert.ok(hud.showMimicryActiveAlert('chuchotement').includes('IMITATION VOCALE'));
  assert.ok(hud.showTriLaserLockedAlert(15.4).includes('VERROUILLAGE TRI-LASER'));
  assert.ok(hud.showBloodedRankAlert('Guerrier Marqué').includes('RITE DU SANG'));
  assert.ok(hud.showSmartDiscRetrievedAlert().includes('DISQUE INTELLIGENT'));

  // Test de l'autodestruction sur YautjaPlayer
  const player = new YautjaPlayer(new THREE.Scene());
  assert.equal(player.isSelfDestructing, false);
  player.triggerSelfDestruct();
  assert.equal(player.isSelfDestructing, true);
  assert.equal(player.selfDestructTimer, 4.0);

  // Avance de l'autodestruction jusqu'à explosion
  player.update(4.2, { x: 0, z: 0, isSprinting: false }, 0);
  assert.equal(player.isSelfDestructing, false);
  assert.equal(player.selfDestructComplete, true);
  assert.equal(player.isDead, true);
});
