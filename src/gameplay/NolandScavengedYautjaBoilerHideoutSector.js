import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 5 (v155) — Repaire Blindé de Ronald Noland dans la Foreuse Minière Abandonnée (*Predators 2010*)
 * Reproduit le refuge souterrain du soldat de cavalerie aérienne Ronald Noland sur la planète réserve de chasse :
 * - Sas étanche isolant la chaleur interne et le CO2 pour échapper aux scanners thermiques des Super Predators et des Hell-Hounds.
 * - Cache d'équipement Yautja pillé sur des chasseurs tombés (plastron, bio-masque à lames, lance-plasma).
 * - Possibilité pour le Tracker Predator de forcer le conduit de ventilation par une brèche plasma si le sas est trahi par de la fumée.
 */
export class NolandScavengedYautjaBoilerHideoutSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'game_preserve_mining_drill_noland_hideout';
    this.airlockSealed = true;
    this.thermalLeakageRatio = 0.0;
    this.scavengedGear = ['scavenged_biomask', 'dual_wristblades_gauntlet', 'shoulder_plasmacaster'];
    this.breachedByTracker = false;
  }

  sealThermalBoilerAirlock() {
    this.airlockSealed = true;
    this.thermalLeakageRatio = 0.0;
    audioSynth.playNolandBoilerAirlockSealThump?.();
    return {
      airlockSealed: true,
      thermalLeakageRatio: 0.0,
      hiddenFromHounds: true
    };
  }

  executeTrackerPlasmaEntryBreach(targetOccupant = {}) {
    this.airlockSealed = false;
    this.breachedByTracker = true;
    targetOccupant.health = 0;
    targetOccupant.eliminatedByTrackerBlast = true;

    audioSynth.playTrackerHideoutPlasmaBreachBlast?.();

    return {
      breached: true,
      salvagedGearDropped: [...this.scavengedGear],
      occupantEliminated: true
    };
  }
}
