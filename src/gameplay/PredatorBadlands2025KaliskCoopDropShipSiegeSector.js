/**
 * Chantier 4 (v198) : Assaut Coordonné Dek & Kalisk contre le Dropship Lourd Weyland-Yutani (Predator: Badlands - 2025)
 * Modélise en fidélité 1:1 l'alliance tactique au combat entre Dek et le Kalisk adulte (guidé par
 * le sifflement à 420 Hz de Bud) contre le vaisseau de transport lourd Weyland-Yutani : charge
 * bélier de 145 kN du Kalisk pliant le train d'atterrissage, saut d'appel de 9,5 m de Dek sur
 * l'échine du monstre et sabotage explosif de la nacelle VTOL (18 500 J).
 */
export class PredatorBadlands2025KaliskCoopDropShipSiegeSector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_KALISK_DROPSHIP_SIEGE';
    this.filmReference = 'Predator: Badlands (2025) - Dek & Kalisk Co-op Siege on Weyland-Yutani Heavy Dropship';
    this.dropshipDesignation = 'WY_CORVUS_HEAVY_LANDER';
    this.reset();
  }

  reset() {
    this.kaliskAggroSynced = false;
    this.budSignalFreqHz = 0;
    this.landingGearCollapsed = false;
    this.dropshipTiltDegrees = 0;
    this.vaultedIntoVtolNacelle = false;
    this.vaultHeightMeters = 0;
    this.dropshipGrounded = false;
    this.wySquadEliminated = 0;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  coordinateBudWhistleSignalWithKalisk({ acousticFreqHz = 420, kaliskAggroSynced = true } = {}) {
    this.budSignalFreqHz = Math.max(0, Number(acousticFreqHz) || 0);
    this.kaliskAggroSynced =
      this.budSignalFreqHz >= 380 && this.budSignalFreqHz <= 460 && Boolean(kaliskAggroSynced);
    this.eventLog.push({
      step: 'BUD_WHISTLE_KALISK_SYNC',
      budSignalFreqHz: this.budSignalFreqHz,
      kaliskAggroSynced: this.kaliskAggroSynced
    });
    return {
      kaliskAggroSynced: this.kaliskAggroSynced,
      budSignalFreqHz: this.budSignalFreqHz
    };
  }

  kaliskBatteringRamDropshipStrut({ chargeMomentumKn = 145, landingGearCollapsed = true } = {}) {
    if (!this.kaliskAggroSynced) {
      throw new Error('Kalisk aggro must be synchronized via Bud whistle signal before ramming the dropship strut.');
    }
    const momentum = Math.max(0, Number(chargeMomentumKn) || 0);
    this.landingGearCollapsed = momentum >= 120 && Boolean(landingGearCollapsed);
    this.dropshipTiltDegrees = this.landingGearCollapsed ? 28 : 0;
    this.eventLog.push({
      step: 'KALISK_RAM_DROPSHIP_STRUT',
      chargeMomentumKn: momentum,
      landingGearCollapsed: this.landingGearCollapsed,
      dropshipTiltDegrees: this.dropshipTiltDegrees
    });
    return {
      landingGearCollapsed: this.landingGearCollapsed,
      dropshipTiltDegrees: this.dropshipTiltDegrees
    };
  }

  dekVaultOffKaliskBackToEngineNacelle({
    vaultHeightMeters = 9.5,
    plasmaBladeInsertedInTurbine = true
  } = {}) {
    if (!this.landingGearCollapsed) {
      throw new Error('Dropship landing gear must be collapsed by the Kalisk before Dek can vault into the VTOL nacelle.');
    }
    this.vaultHeightMeters = Math.max(0, Number(vaultHeightMeters) || 0);
    this.vaultedIntoVtolNacelle =
      this.vaultHeightMeters >= 8.0 && Boolean(plasmaBladeInsertedInTurbine);
    this.eventLog.push({
      step: 'DEK_VAULT_INTO_VTOL_NACELLE',
      vaultHeightMeters: this.vaultHeightMeters,
      vaultedIntoVtolNacelle: this.vaultedIntoVtolNacelle
    });
    return {
      vaultedIntoVtolNacelle: this.vaultedIntoVtolNacelle,
      vaultHeightMeters: this.vaultHeightMeters
    };
  }

  detonateDropshipFuelManifold({ turbineExplosionJoules = 18500, wySquadEliminated = 14 } = {}) {
    if (!this.vaultedIntoVtolNacelle) {
      throw new Error('Dek must vault into the VTOL engine nacelle before detonating the fuel manifold.');
    }
    const joules = Math.max(0, Number(turbineExplosionJoules) || 0);
    this.wySquadEliminated = Math.max(0, Math.floor(Number(wySquadEliminated) || 0));
    this.dropshipGrounded = joules >= 15000 && this.wySquadEliminated >= 10;
    if (this.dropshipGrounded) {
      this.honorAwarded = 450;
    }
    this.eventLog.push({
      step: 'DROPSHIP_FUEL_MANIFOLD_DETONATED',
      turbineExplosionJoules: joules,
      wySquadEliminated: this.wySquadEliminated,
      dropshipGrounded: this.dropshipGrounded,
      honorAwarded: this.honorAwarded
    });
    return {
      dropshipGrounded: this.dropshipGrounded,
      wySquadEliminated: this.wySquadEliminated,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      kaliskAggroSynced: this.kaliskAggroSynced,
      landingGearCollapsed: this.landingGearCollapsed,
      vaultedIntoVtolNacelle: this.vaultedIntoVtolNacelle,
      dropshipGrounded: this.dropshipGrounded,
      honorAwarded: this.honorAwarded
    };
  }
}
