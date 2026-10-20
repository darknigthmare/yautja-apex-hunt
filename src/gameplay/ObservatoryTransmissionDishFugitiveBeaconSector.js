import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 1 (v158) — Tour de Transmission de l'Observatoire & Balise de Rappel du Fugitive (*The Predator 2018*)
 * Reproduit l'ascension de la station radar sommital par le Fugitive Predator :
 * - Balayage des fréquences pour aligner la parabole radar géante vers l'orbite terrestre.
 * - Émission du faisceau laser codé Yautja pour localiser la nacelle de transport et déverrouiller la capsule Predator-Killer.
 * - Défense de la plate-forme contre les mercenaires de Stargazer grimpant par les échelles extérieures.
 */
export class ObservatoryTransmissionDishFugitiveBeaconSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'stargazer_observatory_transmission_dish';
    this.dishAzimuthDeg = options.dishAzimuthDeg ?? 45;
    this.targetSatelliteAzimuthDeg = 180;
    this.dishAligned = false;
    this.beaconTransmitting = false;
    this.orbitalDropTriggered = false;
  }

  calibrateTransmissionDishAzimuth(adjustAngleDeg = 45) {
    this.dishAzimuthDeg = (this.dishAzimuthDeg + adjustAngleDeg) % 360;
    audioSynth.playObservatoryDishAlignmentBeep?.();

    if (this.dishAzimuthDeg === this.targetSatelliteAzimuthDeg) {
      this.dishAligned = true;
    }

    return {
      currentAzimuthDeg: this.dishAzimuthDeg,
      targetAzimuthDeg: this.targetSatelliteAzimuthDeg,
      dishAligned: this.dishAligned
    };
  }

  transmitFugitiveRecallBeaconLaser(gauntletConnected = true) {
    if (!this.dishAligned) {
      return { transmitted: false, reason: 'dish_not_aligned' };
    }

    this.beaconTransmitting = true;
    this.orbitalDropTriggered = true;
    audioSynth.playFugitiveRecallBeaconLaserHum?.();

    return {
      transmitted: true,
      beaconTransmitting: true,
      orbitalDropTriggered: true,
      predatorKillerCargoDecoded: true
    };
  }
}
