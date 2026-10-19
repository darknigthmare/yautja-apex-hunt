import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 6 + Audit Testeur Humain QA #1 (v155) — Persona "Joueur Écran Ultra-Wide 21:9 & Portable 13 pouces — Consolidation Anti-Spam Toast & Marges HUD"
 * Corrige deux problèmes d'ergonomie visuelle relevés sur écrans extrêmes :
 * 1. Consolidation des notifications répétées : lorsque le joueur ramasse plusieurs trophées ou munitions identiques en moins de `2.0 s`, fusionne le message en `Message (x2)`, `(x3)` au lieu d'inonder la file d'attente.
 * 2. Calcul automatique des marges sécurisées du HUD (`safeHorizontalInsetPx`) pour rapprocher les jauges vitales du centre de vision sur un écran 21:9 ou 32:9.
 */
export class HumanQaResponsiveHudToastConsolidator {
  constructor() {
    this.activeToast = null;
  }

  pushToastNotification(messageKey, baseLabel, windowSec = 2.0) {
    if (this.activeToast && this.activeToast.messageKey === messageKey && this.activeToast.remainingSec > 0) {
      this.activeToast.count += 1;
      this.activeToast.remainingSec = windowSec;
      this.activeToast.formattedText = `${baseLabel} (x${this.activeToast.count})`;
      audioSynth.playToastConsolidationStackChime?.();
      return {
        consolidated: true,
        count: this.activeToast.count,
        formattedText: this.activeToast.formattedText
      };
    }

    this.activeToast = {
      messageKey,
      baseLabel,
      count: 1,
      remainingSec: windowSec,
      formattedText: baseLabel
    };

    return {
      consolidated: false,
      count: 1,
      formattedText: baseLabel
    };
  }

  computeErgonomicHudInset(viewportWidth = 1920, viewportHeight = 1080) {
    const aspect = viewportWidth / Math.max(1, viewportHeight);
    if (aspect >= 2.3) {
      const targetWidth = Math.min(viewportWidth, 1720);
      const inset = Math.round((viewportWidth - targetWidth) / 2);
      return {
        ultraWideDetected: true,
        aspectRatio: Number(aspect.toFixed(2)),
        safeHorizontalInsetPx: inset
      };
    }

    return {
      ultraWideDetected: false,
      aspectRatio: Number(aspect.toFixed(2)),
      safeHorizontalInsetPx: 16
    };
  }
}
