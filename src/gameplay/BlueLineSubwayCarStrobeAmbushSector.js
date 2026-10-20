import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 3 (v157) — Rame de Métro Blue Line & Attaque Stroboscopique dans la Fumée (*Predator 2 1990*)
 * Reproduit la fusillade chaotique dans la rame souterraine de la Blue Line de Los Angeles 1997 :
 * - Pénombre du tunnel zébrée par les éclairs stroboscopiques de fusils d'assaut et de pistolets-mitrailleurs (8,5 Hz).
 * - Le City Hunter force les portes coulissantes pneumatiques et opère en hauteur sur les barres d'appui.
 * - Le scanner bio-médical du bio-masque détecte les armes prêtes à faire feu et identifie les non-combattants ou femmes enceintes (Leona Cantrell) à épargner selon le Code d'Honneur Yautja.
 */
export class BlueLineSubwayCarStrobeAmbushSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_blue_line_subway_strobe_car';
    this.strobeFrequencyHz = options.strobeFrequencyHz ?? 8.5;
    this.doorsPriedOpen = false;
    this.carFumigatedWithGunsmoke = false;
    this.targetsNeutralizedCount = 0;
  }

  prySubwayCarDoorOpen() {
    this.doorsPriedOpen = true;
    audioSynth.playSubwayCarDoorHydraulicPry?.();
    return {
      pried: true,
      doorsPriedOpen: true,
      roofAccessGranted: true
    };
  }

  pulseGunfireStrobeLighting(passengers = []) {
    this.carFumigatedWithGunsmoke = true;
    audioSynth.playBlueLineSubwayStrobeGunfireSparks?.();

    let armedThreats = 0;
    let pregnantOrUnarmedProtected = 0;

    for (const p of passengers) {
      if (p.pregnant || !p.weaponDrawn) {
        p.sparedByHonorCode = true;
        pregnantOrUnarmedProtected += 1;
      } else {
        p.targetedAsHostile = true;
        armedThreats += 1;
      }
    }

    return {
      strobeActive: true,
      strobeFrequencyHz: this.strobeFrequencyHz,
      carFumigatedWithGunsmoke: this.carFumigatedWithGunsmoke,
      armedThreats,
      pregnantOrUnarmedProtected
    };
  }

  neutralizeHostileInStrobeSmoke(targetHostile = {}) {
    if (targetHostile.sparedByHonorCode) {
      return { eliminated: false, sparedByHonorCode: true };
    }

    targetHostile.health = 0;
    targetHostile.neutralized = true;
    this.targetsNeutralizedCount += 1;

    return {
      eliminated: true,
      targetsNeutralizedCount: this.targetsNeutralizedCount
    };
  }
}
