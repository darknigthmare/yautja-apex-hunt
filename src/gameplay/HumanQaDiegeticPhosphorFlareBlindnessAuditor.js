import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 8 + Audit Testeur Humain QA #3 (v157) — Persona "Puriste Lore : Éblouissement par Fusée au Phosphore Magnésium"
 * Dans le lore canonique (*Predator 1987*, *AVP: Requiem 2007*) :
 * - Une fusée de détresse militaire au phosphore blanc / magnésium brûle à plus de 2 200 °C et émet des lumens colossaux.
 * - Le mode THERMAL_INFRA du bio-masque Yautja est instantanément saturé (Whiteout sensoriel) si la fusée éclate dans le cône de vision à moins de 8 mètres.
 * - Ce dysfonctionnement temporaire désactive le tri-laser et le zoom optique pendant 2,2 secondes, incitant le joueur à basculer en mode de vision électromagnétique ou à arracher son masque pour un duel au corps-à-corps.
 */
export class HumanQaDiegeticPhosphorFlareBlindnessAuditor {
  constructor(options = {}) {
    this.blindnessDurationSec = options.blindnessDurationSec ?? 2.2;
    this.remainingBlindnessSec = 0.0;
  }

  evaluatePhosphorFlareExposure(flareEvent = {}, maskState = {}) {
    const distanceMeters = Number(flareEvent.distanceMeters ?? 15);
    const visionMode = maskState.visionMode ?? 'THERMAL_INFRA';
    const inFieldOfView = flareEvent.inFieldOfView !== false;

    if (inFieldOfView && distanceMeters <= 8.0 && visionMode === 'THERMAL_INFRA') {
      this.remainingBlindnessSec = this.blindnessDurationSec;
      audioSynth.playMagnesiumPhosphorFlareWhiteoutHiss?.();

      return {
        whiteoutTriggered: true,
        durationSec: this.blindnessDurationSec,
        triLaserDisabled: true,
        recommendedVisionMode: 'ELECTROMAGNETIC_TECH',
        opticalSensorsSaturated: true
      };
    }

    return {
      whiteoutTriggered: false,
      durationSec: 0,
      opticalSensorsSaturated: false
    };
  }

  updateBlindnessRecovery(dtSec = 0.1) {
    if (this.remainingBlindnessSec > 0) {
      this.remainingBlindnessSec = Math.max(0, this.remainingBlindnessSec - dtSec);
    }

    const whiteoutIntensity = Number((this.remainingBlindnessSec / this.blindnessDurationSec).toFixed(2));
    return {
      active: this.remainingBlindnessSec > 0,
      remainingSec: Number(this.remainingBlindnessSec.toFixed(2)),
      whiteoutIntensity
    };
  }
}
