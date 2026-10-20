import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 5 (v158) — Totem Électrifié & Duel Classic vs Berserker (*Predators 2010*)
 * Reproduit la libération et le combat de titans au camp des Super Predators :
 * - Le Classic Predator (Jungle Hunter de 1987) est enchaîné à un totem rituel par des câbles sous tension électrique.
 * - Le joueur sectionne les câbles, libérant le captif qui enfile son bio-masque et fait claquer ses Wristblades.
 * - Déclenche un duel à mort singulier 1:1 d'une violence inouïe entre le Classic Predator et le Berserker Predator (Mr. Black).
 */
export class SuperPredatorCampClassicTiedTotemDuelSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'game_preserve_berserker_camp_totem';
    this.cablesElectrified = true;
    this.classicLiberated = false;
    this.duelInProgress = false;
    this.duelRoundsFought = 0;
  }

  severElectrifiedTotemCables(classicState = {}) {
    this.cablesElectrified = false;
    this.classicLiberated = true;
    classicState.liberated = true;
    classicState.bioMaskEquipped = true;
    classicState.wristbladesExtended = true;

    audioSynth.playClassicTotemElectrifiedCableSnap?.();

    return {
      cablesSevered: true,
      classicLiberated: true,
      honorAllianceFormed: true
    };
  }

  engageBerserkerTitanDuel(classicState = {}, berserkerState = {}) {
    if (!this.classicLiberated) {
      return { duelStarted: false, reason: 'classic_still_tied' };
    }

    this.duelInProgress = true;
    this.duelRoundsFought += 1;
    audioSynth.playBerserkerVsClassicClawDuelRoar?.();

    classicState.health = Math.max(0, Number(classicState.health ?? 240) - 75);
    berserkerState.health = Math.max(0, Number(berserkerState.health ?? 320) - 90);

    return {
      duelInProgress: true,
      duelRound: this.duelRoundsFought,
      classicHealth: classicState.health,
      berserkerHealth: berserkerState.health,
      sparksAndRoarsActive: true
    };
  }
}
