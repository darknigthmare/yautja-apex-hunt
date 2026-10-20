import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 5 (v157) — Glaise Froide de Rivière & Camouflage Thermique de Dutch (*Predator 1987*)
 * Reproduit la découverte tactique historique du Major Dutch Schaefer sur la berge de Val Verde :
 * - Enduire le corps de boue et d'argile fluviale froide (18 °C) aligne la température superficielle sur le substrat rocheux.
 * - Le Jungle Hunter ne perçoit aucun contraste infrarouge en mode THERMAL_INFRA, permettant à la proie d'échapper au balayage même à 2 mètres de distance.
 * - La couche de boue sèche progressivement au fil du temps (taux accéléré près des feux de camp et torches), nécessitant une réapplication périodique sur les berges d'argile.
 */
export class ValVerdeColdClayMudCamouflageSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_riverbank_cold_clay_deposit';
    this.clayBankDepositAvailable = true;
    this.mudLayerCoverageRatio = 0.0;
    this.mudDryingRatePerSec = options.mudDryingRatePerSec ?? 0.015;
    this.riverMudTempCelsius = 18.0;
  }

  slatherBodyWithColdClayDeposit(targetEntity = {}) {
    this.mudLayerCoverageRatio = 1.0;
    targetEntity.coatedInColdMud = true;
    targetEntity.surfaceTemperatureCelsius = this.riverMudTempCelsius;
    targetEntity.invisibleToThermalInfrared = true;

    audioSynth.playMudCamouflageClaySlatherSquish?.();
    audioSynth.playDutchColdClayThermalConcealHum?.();

    return {
      slathered: true,
      mudLayerCoverageRatio: this.mudLayerCoverageRatio,
      surfaceTemperatureCelsius: this.riverMudTempCelsius,
      invisibleToThermalInfrared: true
    };
  }

  updateMudDrying(dtSeconds = 1.0, nearTorchFire = false, targetEntity = {}) {
    if (this.mudLayerCoverageRatio <= 0) {
      return { mudActive: false, coverageRatio: 0 };
    }

    const dryingMultiplier = nearTorchFire ? 3.5 : 1.0;
    this.mudLayerCoverageRatio = Math.max(0, this.mudLayerCoverageRatio - this.mudDryingRatePerSec * dtSeconds * dryingMultiplier);

    if (this.mudLayerCoverageRatio < 0.25) {
      targetEntity.coatedInColdMud = false;
      targetEntity.surfaceTemperatureCelsius = 37.0;
      targetEntity.invisibleToThermalInfrared = false;
    }

    return {
      mudActive: this.mudLayerCoverageRatio >= 0.25,
      coverageRatio: Number(this.mudLayerCoverageRatio.toFixed(3)),
      surfaceTemperatureCelsius: targetEntity.surfaceTemperatureCelsius ?? 37.0,
      invisibleToThermalInfrared: Boolean(targetEntity.invisibleToThermalInfrared)
    };
  }
}
