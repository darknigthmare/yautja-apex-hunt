import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 3 (v154) — Treuil à Contrepoids en Rondins & Balancier d'Assaut de Dutch (*Predator 1987*)
 * Reproduit le piège mécanique massif assemblé par le Major Alan "Dutch" Schaefer dans la jungle de Val Verde :
 * - Un tronc d'arbre lourd suspendu comme contrepoids et retenu par des lianes sous haute tension.
 * - Dans le film, le Jungle Hunter repère la liane de détente et contourne l'axe, mais Dutch tranche la retenue pour faire s'abattre le contrepoids sur le Yautja (ou écraser un poursuivant imprudent).
 */
export class ValVerdeCounterweightLogPendulumTrapSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_canyon_counterweight_log_trap';
    this.logMassKg = options.logMassKg ?? 650;
    this.directSwingDamage = options.directSwingDamage ?? 160;
    this.counterweightDropDamage = options.counterweightDropDamage ?? 240;
    this.armed = true;
    this.released = false;
  }

  inspectVineTension(visionState = {}) {
    const canSeeTension =
      visionState.visionMode === 'ELECTROMAGNETIC_TECH' ||
      (visionState.distanceMeters ?? 20) <= 6.5;

    return {
      trapDetected: canSeeTension,
      armed: this.armed,
      counterweightPosition: { x: 2.5, y: 5.8, z: -1.2 }
    };
  }

  triggerPendulumRelease(targetEntity = {}) {
    if (!this.armed || this.released) {
      return { triggered: false, reason: 'already_released' };
    }

    this.armed = false;
    this.released = true;

    audioSynth.playValVerdeLogPendulumWhoosh?.();
    audioSynth.playCounterweightLogBoneCrushThud?.();

    if (targetEntity.standingUnderCounterweight) {
      targetEntity.health = Math.max(0, Number(targetEntity.health ?? 200) - this.counterweightDropDamage);
      targetEntity.crushedByCounterweightLog = true;
      return {
        triggered: true,
        hitType: 'counterweight_vertical_crush',
        damageDealt: this.counterweightDropDamage,
        remainingHealth: targetEntity.health
      };
    }

    if (targetEntity.inPendulumSweepArc) {
      targetEntity.health = Math.max(0, Number(targetEntity.health ?? 200) - this.directSwingDamage);
      targetEntity.knockedBackByLog = true;
      return {
        triggered: true,
        hitType: 'pendulum_arc_sweep',
        damageDealt: this.directSwingDamage,
        remainingHealth: targetEntity.health
      };
    }

    return {
      triggered: true,
      hitType: 'evaded_cleanly',
      damageDealt: 0
    };
  }
}
