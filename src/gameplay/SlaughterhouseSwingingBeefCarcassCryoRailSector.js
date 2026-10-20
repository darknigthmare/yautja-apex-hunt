import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 3 (v156) — Boucherie Suspendue & Crochets à Carcasses Oscillants de l'Abattoir de Los Angeles (*Predator 2 1990*)
 * Reproduit la chambre froide principale de l'abattoir où l'équipe OWLF de Peter Keyes tend son embuscade :
 * - Rails métalliques au plafond supportant des rangées de carcasses de bœuf congelées (`-4 °C`).
 * - Les carcasses absorbent les projectiles balistiques et les jets d'azote liquide tout en oscillant avec inertie sur leurs crochets.
 * - Le City Hunter peut bondir sur les rails supérieurs pour contourner les faisceaux de lampes halogènes UV.
 */
export class SlaughterhouseSwingingBeefCarcassCryoRailSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_slaughterhouse_hanging_carcass_hall';
    this.carcassRowsCount = options.carcassRowsCount ?? 6;
    this.ambientChamberTempC = -4.0;
    this.swingMomentum = 0;
  }

  absorbIncomingFireWithFrozenCarcass(shotPayload = {}) {
    const incomingDamage = Number(shotPayload.damage ?? 60);
    this.swingMomentum = Math.min(1.0, this.swingMomentum + 0.35);

    audioSynth.playFrozenCarcassMeatHookChainSwing?.();

    return {
      interceptedByCarcass: true,
      damageToHunterBehindCarcass: 0,
      blockedDamage: incomingDamage,
      swingMomentum: Number(this.swingMomentum.toFixed(2)),
      thermalBackdropTempC: this.ambientChamberTempC
    };
  }
}
