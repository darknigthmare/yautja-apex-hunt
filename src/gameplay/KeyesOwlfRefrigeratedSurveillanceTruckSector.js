import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 2 (v154) — Convoi Militaire de Keyes & Camion Frigorifique de Surveillance Mobile (*Predator 2 1990*)
 * Reproduit le poste de commandement mobile de l'OWLF (Other World Life Forms) dirigé par Peter Keyes devant l'abattoir de Los Angeles :
 * - Semi-remorque frigorifique tapissé d'écrans de télémétrie multi-spectrale qui relaie en temps réel la position de l'équipe d'assaut équipée de combinaisons isolantes.
 * - Tant que l'antenne du camion est active, les agents OWLF bénéficient d'une coordination tactique (partage des alertes).
 * - Le City Hunter peut repérer le faisceau électromagnétique du camion en mode `ELECTROMAGNETIC_TECH` et saboter le relais pour plonger l'escouade de Keyes dans le brouillard radio.
 */
export class KeyesOwlfRefrigeratedSurveillanceTruckSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_slaughterhouse_owlf_surveillance_truck';
    this.telemetryUplinkActive = true;
    this.videoFeedsOnline = options.videoFeedsOnline ?? 8;
    this.owlfSquadCoordinationBonus = 0.35;
    this.sabotaged = false;
  }

  broadcastOwlfTacticalSweep(playerState = {}) {
    if (this.sabotaged || !this.telemetryUplinkActive) {
      return {
        sweepActive: false,
        reason: 'uplink_sabotaged',
        owlfSquadCoordinationBonus: 0
      };
    }

    audioSynth.playKeyesSurveillanceTruckTelemetrySweep?.();

    const detectedByEmVision = playerState.visionMode === 'ELECTROMAGNETIC_TECH';
    return {
      sweepActive: true,
      videoFeedsOnline: this.videoFeedsOnline,
      owlfSquadCoordinationBonus: this.owlfSquadCoordinationBonus,
      truckBeamRevealedToHunter: detectedByEmVision
    };
  }

  sabotageSurveillanceRelay(method = 'plasmacaster_dish_strike') {
    this.sabotaged = true;
    this.telemetryUplinkActive = false;
    this.videoFeedsOnline = 0;
    this.owlfSquadCoordinationBonus = 0;

    audioSynth.playOwlfMobileCommandFeedStaticShort?.();

    return {
      sabotaged: true,
      method,
      videoFeedsOnline: 0,
      owlfSquadBlinded: true
    };
  }
}
