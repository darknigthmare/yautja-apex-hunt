import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 6 + Audit Testeur Humain QA #1 (v153) — Persona "Joueur Clavier/Souris & Lisibilité Tactique UI/UX"
 * Corrige les frictions d'interface signalées en session de playtest humain :
 * 1. File de priorité des bannières `#log-banner` : empêche un message d'ambiance mineur (LOW/NORMAL) d'écraser une alerte critique (CRITICAL/HIGH : filet, acide, autodestruction) tant que son maintien minimal n'est pas écoulé.
 * 2. Verrou d'exclusivité des modales plein écran (`#pause-menu`, `#lore-codex-modal`, `#victory-screen`, `#game-over-screen`) pour éviter les superpositions accidentelles.
 * 3. Application dynamique du profil d'accessibilité visuelle (`prefers-reduced-motion`) réduisant le tremblement caméra et les flashs stroboscopiques.
 */
export class HumanQaPlaytesterUiUxAuditDirector {
  constructor(options = {}) {
    this.priorityWeights = {
      LOW: 1,
      NORMAL: 2,
      HIGH: 3,
      CRITICAL: 4
    };
    this.activeBanner = null;
    this.queuedBanner = null;
    this.reducedMotionEnabled = Boolean(options.reducedMotionEnabled);
    this.modalIds = ['pause-menu', 'lore-codex-modal', 'victory-screen', 'game-over-screen'];
  }

  postTacticalBanner(message, priority = 'NORMAL', holdDurationSec = 2.2, doc = null) {
    const normalizedPriority = this.priorityWeights[priority] ? priority : 'NORMAL';
    const weight = this.priorityWeights[normalizedPriority];

    if (
      this.activeBanner &&
      this.activeBanner.remainingSec > 0 &&
      weight < this.activeBanner.weight
    ) {
      // Ne pas écraser une alerte plus prioritaire en cours : mettre en attente
      if (!this.queuedBanner || weight >= this.queuedBanner.weight) {
        this.queuedBanner = {
          message,
          priority: normalizedPriority,
          weight,
          remainingSec: holdDurationSec
        };
      }
      return {
        displayed: false,
        queued: true,
        preservedActivePriority: this.activeBanner.priority,
        activeMessage: this.activeBanner.message
      };
    }

    this.activeBanner = {
      message,
      priority: normalizedPriority,
      weight,
      remainingSec: holdDurationSec
    };

    if (weight >= this.priorityWeights.CRITICAL) {
      audioSynth.playHumanQaPriorityAlertBannerBeep?.();
    }

    this._syncBannerDom(doc);

    return {
      displayed: true,
      queued: false,
      priority: normalizedPriority,
      message
    };
  }

  update(dt = 0.016, doc = null) {
    if (!this.activeBanner) return { activeBanner: null };

    this.activeBanner.remainingSec = Math.max(0, this.activeBanner.remainingSec - dt);
    if (this.activeBanner.remainingSec === 0) {
      if (this.queuedBanner) {
        this.activeBanner = this.queuedBanner;
        this.queuedBanner = null;
        this._syncBannerDom(doc);
      } else {
        this.activeBanner = null;
      }
    }

    return {
      activeBanner: this.activeBanner ? { ...this.activeBanner } : null,
      queuedBanner: this.queuedBanner ? { ...this.queuedBanner } : null
    };
  }

  enforceSingleActiveModal(preferredModalId, doc = typeof document !== 'undefined' ? document : null) {
    if (!doc) return { enforced: false, reason: 'no_document' };

    let closedDuplicates = 0;
    for (const id of this.modalIds) {
      const el = doc.getElementById(id);
      if (!el) continue;
      if (id === preferredModalId) {
        el.classList.remove('hidden');
      } else if (!el.classList.contains('hidden')) {
        el.classList.add('hidden');
        closedDuplicates += 1;
      }
    }

    return {
      enforced: true,
      activeModalId: preferredModalId,
      closedDuplicates
    };
  }

  computeScreenShakeScale(rawShakeIntensity = 1.0) {
    if (this.reducedMotionEnabled) {
      return Number((rawShakeIntensity * 0.2).toFixed(2));
    }
    return Number(rawShakeIntensity.toFixed(2));
  }

  _syncBannerDom(doc = typeof document !== 'undefined' ? document : null) {
    if (!doc || !this.activeBanner) return;
    const bannerEl = doc.getElementById('log-banner');
    if (!bannerEl) return;
    bannerEl.textContent = this.activeBanner.message;
    if (this.activeBanner.priority === 'CRITICAL') {
      bannerEl.classList.add('banner-critical');
    } else {
      bannerEl.classList.remove('banner-critical');
    }
  }
}
