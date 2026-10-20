import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 6 + Audit Testeur Humain QA #1 (v158) — Persona "Joueur Manette / Clavier : Roue d'Arsenal Radiale & Ralenti Tactique"
 * Corrige la rigidité de sélection d'armement en combat rapproché :
 * 1. Ralenti temporel tactique (Bullet-Time TimeScale 0,2) déclenché au maintien de la touche TAB ou L1.
 * 2. Sélection octogonale 360° par vecteur angulaire (8 slots : Wristblades, Plasmacaster, Smart Disc, Combi-Stick, Netgun, Speargun, Shuriken, Medi-Kit).
 * 3. Restauration instantanée de la vitesse nominale (TimeScale 1,0) à la relâche.
 */
export class HumanQaRadialWeaponWheelTacticalSlowdownDirector {
  constructor(options = {}) {
    this.bulletTimeScale = options.bulletTimeScale ?? 0.2;
    this.currentTimeScale = 1.0;
    this.wheelOpen = false;
    this.weaponSlots = [
      'wristblades',
      'plasmacaster',
      'smart_disc',
      'combistick',
      'netgun',
      'speargun',
      'shuriken',
      'medikit'
    ];
    this.selectedSlotIndex = 0;
  }

  openWeaponWheel() {
    this.wheelOpen = true;
    this.currentTimeScale = this.bulletTimeScale;
    audioSynth.playWeaponWheelBulletTimeWhoosh?.();

    return {
      wheelOpen: true,
      timeScale: this.currentTimeScale,
      totalSlots: this.weaponSlots.length
    };
  }

  pointSelectorVector(angleDeg = 0) {
    if (!this.wheelOpen) {
      return { slotIndex: this.selectedSlotIndex, selectedWeapon: this.weaponSlots[this.selectedSlotIndex] };
    }

    const normalizedDeg = ((angleDeg % 360) + 360) % 360;
    // 8 segments de 45 deg
    const index = Math.floor((normalizedDeg + 22.5) / 45) % 8;

    if (index !== this.selectedSlotIndex) {
      this.selectedSlotIndex = index;
      audioSynth.playWeaponWheelRadialSlotTick?.();
    }

    return {
      slotIndex: this.selectedSlotIndex,
      selectedWeapon: this.weaponSlots[this.selectedSlotIndex],
      angleDeg: normalizedDeg
    };
  }

  confirmWeaponSelection() {
    this.wheelOpen = false;
    this.currentTimeScale = 1.0;

    return {
      wheelOpen: false,
      timeScale: this.currentTimeScale,
      equippedWeapon: this.weaponSlots[this.selectedSlotIndex]
    };
  }
}
