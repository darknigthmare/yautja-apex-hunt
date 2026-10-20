import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 2 (v157) — Salle des Sarcophages des Rois Yautja & Anneaux Calendaires Aztèques (*Alien vs. Predator 2004*)
 * Reproduit la chambre funéraire rituelle souterraine de Bouvetøya :
 * - Cadran circulaire concentrique en pierre et bronze gravé de glyphes aztèques et cambodgiens.
 * - Le décodage du cadran calendaire aligne les cercles concentriques et libère les vérins du sarcophage des Rois Yautja.
 * - L'ouverture du sarcophage restitue les 3 Plasmacasters rituels dérobés par l'expédition Weyland et déclenche la reconfiguration des parois cyclopéennes de la pyramide.
 */
export class PyramidAztecCalendarWheelSarcophagusSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_pyramid_aztec_calendar_tomb';
    this.innerRingAngleDeg = options.innerRingAngleDeg ?? 0;
    this.middleRingAngleDeg = options.middleRingAngleDeg ?? 90;
    this.outerRingAngleDeg = options.outerRingAngleDeg ?? 180;
    this.alignmentTargetDeg = 0;
    this.sarcophagusUnlocked = false;
    this.plasmacastersRecovered = 0;
    this.shiftCycleActive = false;
  }

  rotateCalendarRing(ring = 'middle', stepDeg = 90) {
    if (ring === 'inner') {
      this.innerRingAngleDeg = (this.innerRingAngleDeg + stepDeg) % 360;
    } else if (ring === 'middle') {
      this.middleRingAngleDeg = (this.middleRingAngleDeg + stepDeg) % 360;
    } else if (ring === 'outer') {
      this.outerRingAngleDeg = (this.outerRingAngleDeg + stepDeg) % 360;
    }

    audioSynth.playAztecCalendarRingGearRotation?.();

    const isAligned =
      this.innerRingAngleDeg === this.alignmentTargetDeg &&
      this.middleRingAngleDeg === this.alignmentTargetDeg &&
      this.outerRingAngleDeg === this.alignmentTargetDeg;

    if (isAligned && !this.sarcophagusUnlocked) {
      this.sarcophagusUnlocked = true;
      this.shiftCycleActive = true;
      audioSynth.playPyramidSarcophagusStoneSlabSlide?.();
    }

    return {
      ringRotated: ring,
      innerRingDeg: this.innerRingAngleDeg,
      middleRingDeg: this.middleRingAngleDeg,
      outerRingDeg: this.outerRingAngleDeg,
      aligned: isAligned,
      sarcophagusUnlocked: this.sarcophagusUnlocked
    };
  }

  retrieveRitualPlasmacastersFromSarcophagus() {
    if (!this.sarcophagusUnlocked) {
      return { retrieved: false, reason: 'sarcophagus_locked' };
    }

    this.plasmacastersRecovered = 3;
    return {
      retrieved: true,
      plasmacastersRecovered: this.plasmacastersRecovered,
      plasmaCannonArsenalArmed: true,
      pyramidShiftTriggered: this.shiftCycleActive
    };
  }
}
