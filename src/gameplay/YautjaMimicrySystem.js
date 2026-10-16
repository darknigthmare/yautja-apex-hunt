// Système d'imitation vocale et leurres audio du Biomasque Yautja (Lore 1:1)
// Référence canonique : Predator (1987) ("Over here...", rire de Billy, "Anytime..."),
// Predator 2 (1990) ("Want some candy?"), Prey (2022).

import { audioSynth } from '../AudioSynthesizer.js';

export const MIMICRY_PROFILES = Object.freeze([
  Object.freeze({
    id: 'over_here',
    name: 'Chuchotement : "Over here..."',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987']),
    lureRadius: 38,
    duration: 5.0,
    cooldown: 6.0,
    tacticalEffect: 'investigate',
    audioMethod: 'playMimicryLure',
    audioArg: 'over_here',
    description: 'Chuchotement distordu attirant les gardes isolés vers la position du leurre.',
  }),
  Object.freeze({
    id: 'want_some_candy',
    name: 'Formant radio : "Want some candy?"',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator2']),
    lureRadius: 32,
    duration: 4.5,
    cooldown: 8.0,
    tacticalEffect: 'disorient',
    audioMethod: 'playMimicryWantSomeCandy',
    audioArg: null,
    description: 'Enregistrement de Danny Boy diffusé par le haut-parleur du biomasque pour déstabiliser la cible.',
  }),
  Object.freeze({
    id: 'billy_laugh',
    name: 'Rire spectral de Billy',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987']),
    lureRadius: 45,
    duration: 6.0,
    cooldown: 12.0,
    tacticalEffect: 'panic',
    audioMethod: 'playMimicryBillyLaugh',
    audioArg: null,
    description: 'Rire saccadé glaçant semant la panique psychologique et poussant les proies faibles à la fuite.',
  }),
  Object.freeze({
    id: 'anytime',
    name: 'Grave caverneux : "Anytime..."',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987']),
    lureRadius: 30,
    duration: 4.0,
    cooldown: 7.0,
    tacticalEffect: 'provoke',
    audioMethod: 'playMimicryAnytime',
    audioArg: null,
    description: 'Provocation à voix basse incitant l\'ennemi à focaliser ses tirs dans une fausse direction.',
  }),
  Object.freeze({
    id: 'radio_chatter',
    name: 'Brouillage radio militaire',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987', 'predator2']),
    lureRadius: 50,
    duration: 5.5,
    cooldown: 5.0,
    tacticalEffect: 'investigate',
    audioMethod: 'playMimicryLure',
    audioArg: 'radio',
    description: 'Grésillement de talkie-walkie détournant les patrouilles vers le point d\'émission.',
  }),
]);

export function getMimicryProfileById(id) {
  return MIMICRY_PROFILES.find((p) => p.id === id) ?? MIMICRY_PROFILES[0];
}

export function createMimicryState() {
  return {
    unlockedProfiles: new Set(['over_here', 'radio_chatter']),
    cooldowns: {},
    activeLures: [],
  };
}

export function recordAcousticSample(state, profileId) {
  if (!state || !profileId) return false;
  const profile = MIMICRY_PROFILES.find((p) => p.id === profileId);
  if (!profile) return false;
  if (!state.unlockedProfiles.has(profileId)) {
    state.unlockedProfiles.add(profileId);
    if (typeof audioSynth?.playMimicryRecordBeep === 'function') {
      audioSynth.playMimicryRecordBeep();
    }
    return true;
  }
  return false;
}

export function updateMimicryCooldowns(state, delta) {
  if (!state?.cooldowns) return;
  const dt = Math.max(0, Number(delta) || 0);
  Object.keys(state.cooldowns).forEach((key) => {
    state.cooldowns[key] = Math.max(0, state.cooldowns[key] - dt);
    if (state.cooldowns[key] <= 0) {
      delete state.cooldowns[key];
    }
  });

  if (Array.isArray(state.activeLures)) {
    state.activeLures = state.activeLures.filter((lure) => {
      lure.remainingDuration -= dt;
      return lure.remainingDuration > 0;
    });
  }
}

export function canTriggerMimicry(state, profileId) {
  if (!state) return false;
  if (!state.unlockedProfiles?.has(profileId)) return false;
  return !(state.cooldowns && (state.cooldowns[profileId] ?? 0) > 0);
}

export function triggerMimicryLure(state, profileId, hunterPos, targetNpcs = [], audio = audioSynth) {
  const profile = getMimicryProfileById(profileId);
  if (!canTriggerMimicry(state, profile.id)) {
    return { success: false, reason: 'cooldown_or_locked', profile, affectedNpcs: [] };
  }

  // Enclenchement du cooldown
  state.cooldowns[profile.id] = profile.cooldown;

  // Déclenchement de la synthèse audio
  if (audio && typeof audio[profile.audioMethod] === 'function') {
    if (profile.audioArg) {
      audio[profile.audioMethod](profile.audioArg);
    } else {
      audio[profile.audioMethod]();
    }
  }

  // Propagation acoustique vers les NPC environnants
  const affectedNpcs = [];
  const radiusSq = profile.lureRadius * profile.lureRadius;

  if (Array.isArray(targetNpcs)) {
    targetNpcs.forEach((npc) => {
      if (!npc || npc.isDead) return;
      const npcPos = npc.position ?? npc.mesh?.position;
      if (!npcPos) return;

      const dx = npcPos.x - (hunterPos?.x ?? 0);
      const dz = npcPos.z - (hunterPos?.z ?? 0);
      const distSq = dx * dx + dz * dz;

      if (distSq <= radiusSq) {
        const dist = Math.sqrt(distSq);
        affectedNpcs.push({
          npc,
          distance: dist,
          effect: profile.tacticalEffect,
        });

        // Application de l'état tactique selon la réaction du lore
        if (profile.tacticalEffect === 'panic' && typeof npc.applyFear === 'function') {
          npc.applyFear(profile.duration);
        } else if (profile.tacticalEffect === 'disorient' && typeof npc.applyDisorientation === 'function') {
          npc.applyDisorientation(profile.duration);
        } else if (typeof npc.setInvestigationTarget === 'function') {
          npc.setInvestigationTarget({ x: hunterPos?.x ?? 0, z: hunterPos?.z ?? 0 }, profile.duration);
        }
      }
    });
  }

  const lureRecord = {
    profileId: profile.id,
    position: { x: hunterPos?.x ?? 0, z: hunterPos?.z ?? 0 },
    remainingDuration: profile.duration,
  };
  state.activeLures.push(lureRecord);

  return {
    success: true,
    profile,
    affectedNpcs,
    lureRecord,
  };
}
