import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 5 (v153) — French Voyageur Flintlock Musket Volley Line & Black Powder Smoke Bank (*Prey 2022*)
 * Reproduit la ligne de salve de mousquets à silex (Charleville / Kentucky rifle) des trappeurs français de Big Beard :
 * - Tir en ligne synchronisé à poudre noire avec panache dense de fumée chaude masquant temporairement la signature thermique.
 * - Fenêtre de vulnérabilité longue (rechargement à la baguette de 5.5 s) permettant au Feral Predator de contre-attaquer au bouclier pliable ou au Cut Clamp.
 * - Déviation balistique des balles en plomb de calibre .69 sur le bouclier métallique ou le bio-masque osseux.
 */
export class FrenchVoyageurFlintlockMusketVolleyLineDirector {
  constructor(options = {}) {
    this.lineSize = options.lineSize ?? 6;
    this.musketeers = Array.from({ length: this.lineSize }, (_, idx) => ({
      id: `voyageur-musketeer-${idx + 1}`,
      loaded: true,
      reloadRemainingSec: 0,
      alive: true,
      stance: 'kneeling_aim'
    }));
    this.reloadDurationSec = options.reloadDurationSec ?? 5.5;
    this.smokeBankDensity = 0; // 0..1
    this.smokeThermalAttenuation = 0;
    this.volleysFired = 0;
  }

  fireSynchronizedVolley(options = {}) {
    const readyShooters = this.musketeers.filter(m => m.alive && m.loaded);
    if (readyShooters.length === 0) {
      return { fired: false, reason: 'reloading_in_progress', readyCount: 0 };
    }

    readyShooters.forEach(shooter => {
      shooter.loaded = false;
      shooter.reloadRemainingSec = this.reloadDurationSec;
      shooter.stance = 'ramrod_reloading';
    });

    this.volleysFired += 1;
    this.smokeBankDensity = Math.min(1.0, this.smokeBankDensity + readyShooters.length * 0.16);
    this.smokeThermalAttenuation = Number((this.smokeBankDensity * 0.65).toFixed(2));

    audioSynth.playFrenchVoyageurMusketVolleyBoom?.();

    const shieldRaised = Boolean(options.feralShieldRaised);
    const leadBallsFired = readyShooters.length;
    const deflectedBalls = shieldRaised ? leadBallsFired : Math.min(1, leadBallsFired);
    const damageToPredator = shieldRaised ? 0 : (leadBallsFired - deflectedBalls) * 9;

    return {
      fired: true,
      volleysFired: this.volleysFired,
      leadBallsFired,
      deflectedBalls,
      damageToPredator,
      smokeBankDensity: Number(this.smokeBankDensity.toFixed(2)),
      smokeThermalAttenuation: this.smokeThermalAttenuation,
      counterAttackWindowOpen: true,
      reloadWindowSec: this.reloadDurationSec
    };
  }

  update(dt = 0.016) {
    let newlyReloaded = 0;
    for (const shooter of this.musketeers) {
      if (!shooter.alive || shooter.loaded) continue;
      shooter.reloadRemainingSec = Math.max(0, shooter.reloadRemainingSec - dt);
      if (shooter.reloadRemainingSec === 0) {
        shooter.loaded = true;
        shooter.stance = 'kneeling_aim';
        newlyReloaded += 1;
      }
    }

    if (newlyReloaded > 0) {
      audioSynth.playBlackPowderRamrodReloadClink?.();
    }

    if (this.smokeBankDensity > 0) {
      this.smokeBankDensity = Math.max(0, this.smokeBankDensity - dt * 0.12);
      this.smokeThermalAttenuation = Number((this.smokeBankDensity * 0.65).toFixed(2));
    }

    const readyCount = this.musketeers.filter(m => m.alive && m.loaded).length;
    return {
      readyCount,
      newlyReloaded,
      smokeBankDensity: Number(this.smokeBankDensity.toFixed(2)),
      smokeThermalAttenuation: this.smokeThermalAttenuation,
      counterAttackWindowOpen: readyCount === 0
    };
  }
}
