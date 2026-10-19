// Morsure Maxillaire Sauvage à Quatre Mandibules du Feral Predator (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Le Feral Predator écartant ses mandibules au corps à corps sauvage pour déchirer la jugulaire de sa proie et s'abreuver d'adrénaline de chasse.

import { audioSynth } from '../AudioSynthesizer.js';

export const MANDIBLE_BITE_CONSTANTS = {
  JUGULAR_BITE_DAMAGE: 175,          // Dégâts bruts de morsure maxillaire à la gorge
  ADRENALINE_HEAL_ON_BITE: 35,       // Points de vie restaurés par poussée d'adrénaline
  BLEED_DPS: 20,                     // Dégâts d'hémorragie artérielle par seconde
};

export function createMandibleBiteState() {
  return {
    isMandiblesFlared: false,
    totalJugularBites: 0,
  };
}

export function flareFeralMandibles(state, audio = audioSynth) {
  if (!state) return false;
  state.isMandiblesFlared = true;

  if (audio && typeof audio.playFeralMandibleFlareClick === 'function') {
    audio.playFeralMandibleFlareClick();
  }

  return true;
}

export function executeJugularMandibleBite(state, hunter, target, audio = audioSynth) {
  if (!state || !state.isMandiblesFlared || !target) {
    return { bitten: false, damageDealt: 0 };
  }

  if (audio && typeof audio.playMandibleJugularCrunchTear === 'function') {
    audio.playMandibleJugularCrunchTear();
  }

  state.totalJugularBites++;
  state.isMandiblesFlared = false;
  target.isJugularTorn = true;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(MANDIBLE_BITE_CONSTANTS.JUGULAR_BITE_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - MANDIBLE_BITE_CONSTANTS.JUGULAR_BITE_DAMAGE);
  }

  if (hunter && typeof hunter.health === 'number') {
    const maxHealth = hunter.maxHealth || 200;
    hunter.health = Math.min(maxHealth, hunter.health + MANDIBLE_BITE_CONSTANTS.ADRENALINE_HEAL_ON_BITE);
  }

  return {
    bitten: true,
    damageDealt: MANDIBLE_BITE_CONSTANTS.JUGULAR_BITE_DAMAGE,
    adrenalineHealed: MANDIBLE_BITE_CONSTANTS.ADRENALINE_HEAL_ON_BITE,
  };
}
