import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 7 + Audit Testeur Humain QA #3 (v153) — Persona "Puriste Lore & Immersion Diégétique Bio-Masque"
 * Vérifie et applique les invariants de cohérence diégétique Yautja 1:1 :
 * 1. Court-circuit du camouflage optique (`Cloak`) en cas d'immersion profonde dans l'eau (`waterSubmersionRatio >= 0.45`) comme dans *Predator (1987)* et *Predator 2 (1990)*.
 * 2. Interdiction du zoom optique 3x et des modes d'analyse spectrale avancés lorsque le bio-masque est retiré ou fracturé (`bioMaskEquipped === false`), basculant la vue en spectre thermique brut naturel Yautja.
 * 3. Conversion des chaînes de télémétrie en glyphes diégétiques Yautja avec sous-titrage tactique concis.
 */
export class HumanQaDiegeticImmersionAuditor {
  constructor() {
    this.glyphTable = {
      CLOAK_SHORT: '⟁⧖⟁',
      RAW_OPTIC: '◈⟐◈',
      HONOR_MARK: '⛨⟁⛨',
      THERMAL_LOCK: '⌖⧗⌖'
    };
  }

  auditAndEnforceDiegeticState(playerState = {}) {
    const fixesApplied = [];
    const nextState = { ...playerState };

    const submersion = Number(nextState.waterSubmersionRatio ?? 0);
    if (nextState.cloakActive && submersion >= 0.45) {
      nextState.cloakActive = false;
      nextState.cloakShortCircuitedByWater = true;
      fixesApplied.push('water_submersion_cloak_short_circuit');
      audioSynth.playDiegeticImmersionSubmergedCloakShort?.();
    }

    const maskEquipped = nextState.bioMaskEquipped !== false;
    if (!maskEquipped) {
      if ((nextState.opticZoomLevel ?? 1) > 1) {
        nextState.opticZoomLevel = 1;
        fixesApplied.push('unmasked_optic_zoom_reset');
      }
      if (nextState.visionMode && nextState.visionMode !== 'RAW_YAUTJA_INFRA') {
        nextState.visionMode = 'RAW_YAUTJA_INFRA';
        fixesApplied.push('unmasked_raw_yautja_infrared_enforced');
      }
      if (nextState.plasmacasterLaserTriadActive) {
        nextState.plasmacasterLaserTriadActive = false;
        fixesApplied.push('unmasked_laser_triad_disabled');
      }
    }

    return {
      diegeticCompliant: fixesApplied.length === 0,
      fixesApplied,
      enforcedState: nextState
    };
  }

  formatDiegeticReadout(tagKey, numericValue) {
    const glyph = this.glyphTable[tagKey] ?? '⟁◈⟁';
    return `${glyph} [${String(numericValue).padStart(3, '0')}]`;
  }
}
