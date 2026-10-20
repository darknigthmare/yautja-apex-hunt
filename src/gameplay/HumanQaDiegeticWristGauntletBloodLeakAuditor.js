import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 8 + Audit Testeur Humain QA #3 (v156) — Persona "Puriste Lore Yautja : Diagnostic Épigraphique du Gantelet & Alerte de Fuite de Sang Vert Luminescent"
 * Dans *Predator (1987)* ("If it bleeds, we can kill it") et *Predator 2 (1990)* :
 * - Lorsque la santé du Predator tombe sous `65 %` sans cautérisation, il perd des gouttes de sang vert phosphorescent sur les feuilles ou le béton, réduisant l'efficacité furtive du `Cloak` à courte portée.
 * - Dès que le chasseur utilise le Medi-Kit (`cauterizedWithMedikit: true`), l'hémorragie luminescente s'arrête et la furtivité totale est restaurée.
 */
export class HumanQaDiegeticWristGauntletBloodLeakAuditor {
  constructor(options = {}) {
    this.bleedHealthThreshold = options.bleedHealthThreshold ?? 65;
  }

  evaluateLuminescentBloodTrailState(hunterState = {}) {
    const health = Number(hunterState.health ?? 100);
    const cauterized = Boolean(hunterState.cauterizedWithMedikit);

    if (health < this.bleedHealthThreshold && !cauterized) {
      audioSynth.playWristGauntletLuminescentBloodLeakBeep?.();
      return {
        bleedingLuminescentGreen: true,
        cloakStealthEffectiveness: 0.45,
        wristGauntletWarningGlyph: '⟁🩸⟁ CAUTERIZE REQUIRED',
        remedyAction: 'use_medikit_cauterizer'
      };
    }

    return {
      bleedingLuminescentGreen: false,
      cloakStealthEffectiveness: 1.0,
      wristGauntletWarningGlyph: '◈ NOMINAL ◈',
      remedyAction: null
    };
  }
}
