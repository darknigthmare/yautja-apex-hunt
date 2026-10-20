import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 3 (v158) — Toit-Terrasse d'El Scorpio & Tyrolienne d'Évacuation (*Predator 2 1990*)
 * Reproduit la fusillade d'ouverture sur les toits caniculaires de Los Angeles 1997 :
 * - Le gang des Scorpions retranché dans le penthouse utilise des lance-grenades et des fusils d'assaut.
 * - Le chef El Scorpio tente de s'enfuir en glissant le long d'une tyrolienne d'acier reliant l'immeuble voisin.
 * - Le City Hunter bondit sur la grille d'escalier de secours, intercepte la tyrolienne ou sectionne le câble au Smart Disc.
 */
export class ElScorpioPenthouseZipWireEscapeSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_el_scorpio_penthouse_rooftop';
    this.zipWireIntact = true;
    this.scorpioEscaping = false;
    this.rooftopGratePositioned = true;
  }

  initiateElScorpioZipWireSlide(elScorpio = {}) {
    if (!this.zipWireIntact) {
      return { sliding: false, reason: 'zip_wire_severed' };
    }

    this.scorpioEscaping = true;
    elScorpio.onZipWire = true;
    audioSynth.playElScorpioPenthouseZipWireZing?.();

    return {
      sliding: true,
      scorpioEscaping: true,
      cableElevationMeters: 45
    };
  }

  severZipWireWithSmartDisc(elScorpio = {}) {
    if (!this.zipWireIntact) {
      return { severed: false, alreadySevered: true };
    }

    this.zipWireIntact = false;
    this.scorpioEscaping = false;

    if (elScorpio.onZipWire) {
      elScorpio.onZipWire = false;
      elScorpio.health = 0;
      elScorpio.plungedToAsphalt = true;
    }

    audioSynth.playRooftopEmergencyStairGrateThud?.();

    return {
      severed: true,
      zipWireIntact: false,
      scorpioPlunged: Boolean(elScorpio.plungedToAsphalt)
    };
  }
}
