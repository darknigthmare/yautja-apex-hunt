// Système d'exécutions rituelles et récolte de trophée vertébral (Lore 1:1)
// Références canoniques : Predator (1987) - Billy Sole / Jim Hopper ; Predator 2 (1990) - Jerry Lambert ; AVP (2004)

import { audioSynth } from '../AudioSynthesizer.js';

export const EXECUTION_STAGES = {
  IDLE: 'IDLE',
  THROAT_GRASP: 'THROAT_GRASP',         // Soulèvement au cou à une main
  WRISTBLADE_SEVER: 'WRISTBLADE_SEVER', // Empalement ou sectionnement lame de poignet
  SPINE_RIP: 'SPINE_RIP',               // Extraction rituelle crâne + colonne vertébrale
  TROPHY_SECURED: 'TROPHY_SECURED',     // Trophée nettoyé et ajouté à la collection
};

export const EXECUTION_DURATIONS = {
  THROAT_GRASP: 0.8,
  WRISTBLADE_SEVER: 1.0,
  SPINE_RIP: 1.5,
};

export function createTrophyExecutionState() {
  return {
    stage: EXECUTION_STAGES.IDLE,
    stageTimer: 0,
    activeTarget: null,
    harvestedTrophiesCount: 0,
    trophyInventory: [],
    isExecuting: false,
  };
}

export function canExecutePrey(prey) {
  if (!prey) return false;
  // Règles d'honneur Yautja : la proie ne doit pas être sans défense / enceinte / enfant
  if (prey.isPregnant || prey.isUnarmedCivilian) {
    return false; // Déshonneur absolu
  }
  // Condition de vulnérabilité : PV sous 30% ou chancellement / assommement
  const isCriticalHealth = (prey.health !== undefined && prey.maxHealth !== undefined)
    ? (prey.health / prey.maxHealth) <= 0.35
    : true;
  return Boolean(prey.isStaggered || prey.isPinned || isCriticalHealth);
}

export function startTrophyExecution(state, prey, audio = audioSynth) {
  if (!state || state.isExecuting || !canExecutePrey(prey)) return false;

  state.isExecuting = true;
  state.stage = EXECUTION_STAGES.THROAT_GRASP;
  state.stageTimer = 0;
  state.activeTarget = prey;

  if (typeof prey.setExecutionLocked === 'function') {
    prey.setExecutionLocked(true);
  }

  return true;
}

export function updateTrophyExecution(state, delta, audio = audioSynth) {
  if (!state || !state.isExecuting || !state.activeTarget) return state?.stage || EXECUTION_STAGES.IDLE;
  const dt = Math.max(0, Number(delta) || 0);
  state.stageTimer += dt;

  switch (state.stage) {
    case EXECUTION_STAGES.THROAT_GRASP:
      if (state.stageTimer >= EXECUTION_DURATIONS.THROAT_GRASP) {
        state.stage = EXECUTION_STAGES.WRISTBLADE_SEVER;
        state.stageTimer = 0;
        if (audio && typeof audio.playFleshSeverSlash === 'function') {
          audio.playFleshSeverSlash();
        }
      }
      break;

    case EXECUTION_STAGES.WRISTBLADE_SEVER:
      if (state.stageTimer >= EXECUTION_DURATIONS.WRISTBLADE_SEVER) {
        state.stage = EXECUTION_STAGES.SPINE_RIP;
        state.stageTimer = 0;
        if (audio && typeof audio.playSpineRipCrack === 'function') {
          audio.playSpineRipCrack();
        }
      }
      break;

    case EXECUTION_STAGES.SPINE_RIP:
      if (state.stageTimer >= EXECUTION_DURATIONS.SPINE_RIP) {
        state.stage = EXECUTION_STAGES.TROPHY_SECURED;
        state.isExecuting = false;

        const trophy = {
          id: `skull_spine_${Date.now()}`,
          species: state.activeTarget.species || 'Homo Sapiens',
          combatHonorRating: state.activeTarget.honorRating || 85,
          timestamp: Date.now(),
        };

        state.trophyInventory.push(trophy);
        state.harvestedTrophiesCount += 1;

        if (typeof state.activeTarget.kill === 'function') {
          state.activeTarget.kill();
        } else {
          state.activeTarget.health = 0;
          state.activeTarget.isDead = true;
        }
        state.activeTarget = null;
      }
      break;

    default:
      break;
  }

  return state.stage;
}

export function cancelTrophyExecution(state) {
  if (!state || !state.isExecuting) return false;
  if (state.activeTarget && typeof state.activeTarget.setExecutionLocked === 'function') {
    state.activeTarget.setExecutionLocked(false);
  }
  state.isExecuting = false;
  state.stage = EXECUTION_STAGES.IDLE;
  state.stageTimer = 0;
  state.activeTarget = null;
  return true;
}
