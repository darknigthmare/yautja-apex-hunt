/**
 * Chantier 2 (v200) : Gorge des Flores Cracheuses Neurotoxiques & Parkour sur Piliers de Basalte (Predator: Badlands - 2025)
 * Modélise en fidélité 1:1 la traversée du gouffre de basalte défendu par 9 plantes Hydra-Pitcher
 * crachant des jets de neuro-venin à 18 bars : détection péristaltique anticipée de 650 ms par
 * Thia, déviation de 7 jets par moulinet du Combi-Spear (480 tr/min), course murale sur 5 piliers
 * humides (9,2 m/s) et embrasement de la poche de méthane centrale (1 650 K).
 */
export class PredatorBadlands2025SpittingCobraVineGorgeSector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_SPITTING_FLORA_GORGE';
    this.filmReference = 'Predator: Badlands (2025) - Genna Neurotoxic Hydra-Pitcher Gorge & Basalt Pillar Wall-Run';
    this.venomJetPressureBar = 18;
    this.reset();
  }

  reset() {
    this.peristalsisTracked = false;
    this.peristalsisPreFireMs = 0;
    this.venomJetsDeflected = false;
    this.deflectedJetsCount = 0;
    this.basaltPillarsWallRunCompleted = false;
    this.sprintVelocityMps = 0;
    this.gorgePathCleared = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  trackPitcherPeristalsisWithThiaOptics({
    pitcherCount = 9,
    peristalsisPreFireMs = 650
  } = {}) {
    const count = Math.max(0, Math.floor(Number(pitcherCount) || 0));
    this.peristalsisPreFireMs = Math.max(0, Number(peristalsisPreFireMs) || 0);
    this.peristalsisTracked = count >= 8 && this.peristalsisPreFireMs >= 500;
    this.eventLog.push({
      step: 'PITCHER_PERISTALSIS_TRACKED',
      pitcherCount: count,
      peristalsisPreFireMs: this.peristalsisPreFireMs,
      peristalsisTracked: this.peristalsisTracked
    });
    return {
      peristalsisTracked: this.peristalsisTracked,
      peristalsisPreFireMs: this.peristalsisPreFireMs
    };
  }

  deflectVenomJetsWithSpinningCombiSpear({
    deflectedJets = 7,
    rotationalRpm = 480
  } = {}) {
    if (!this.peristalsisTracked) {
      throw new Error('Pitcher peristalsis must be tracked before deflecting neuro-venom jets.');
    }
    this.deflectedJetsCount = Math.max(0, Math.floor(Number(deflectedJets) || 0));
    const rpm = Math.max(0, Number(rotationalRpm) || 0);
    this.venomJetsDeflected = this.deflectedJetsCount >= 6 && rpm >= 400;
    this.eventLog.push({
      step: 'VENOM_JETS_DEFLECTED_BY_SPEAR_SPIN',
      deflectedJetsCount: this.deflectedJetsCount,
      rotationalRpm: rpm,
      venomJetsDeflected: this.venomJetsDeflected
    });
    return {
      venomJetsDeflected: this.venomJetsDeflected,
      deflectedJetsCount: this.deflectedJetsCount
    };
  }

  wallRunWetBasaltChasmPillars({
    pillarChainCount = 5,
    wallFrictionCoeff = 0.44,
    sprintVelocityMps = 9.2
  } = {}) {
    if (!this.venomJetsDeflected) {
      throw new Error('Venom jets must be deflected before wall-running the wet basalt chasm pillars.');
    }
    const pillars = Math.max(0, Math.floor(Number(pillarChainCount) || 0));
    const mu = Math.max(0, Number(wallFrictionCoeff) || 0);
    this.sprintVelocityMps = Math.max(0, Number(sprintVelocityMps) || 0);
    this.basaltPillarsWallRunCompleted =
      pillars >= 5 && mu >= 0.35 && this.sprintVelocityMps >= 8.5;
    this.eventLog.push({
      step: 'BASALT_PILLARS_WALL_RUN_COMPLETED',
      pillarChainCount: pillars,
      wallFrictionCoeff: mu,
      sprintVelocityMps: this.sprintVelocityMps,
      basaltPillarsWallRunCompleted: this.basaltPillarsWallRunCompleted
    });
    return {
      basaltPillarsWallRunCompleted: this.basaltPillarsWallRunCompleted,
      sprintVelocityMps: this.sprintVelocityMps
    };
  }

  ignitePitcherColonyMethaneSac({
    methaneIgnitionKelvin = 1650,
    gorgePathCleared = true
  } = {}) {
    if (!this.basaltPillarsWallRunCompleted) {
      throw new Error('Basalt pillars wall-run must be completed before igniting the central methane sac.');
    }
    const kelvin = Math.max(0, Number(methaneIgnitionKelvin) || 0);
    this.gorgePathCleared = kelvin >= 1400 && Boolean(gorgePathCleared);
    if (this.gorgePathCleared) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'PITCHER_COLONY_METHANE_SAC_IGNITED',
      methaneIgnitionKelvin: kelvin,
      gorgePathCleared: this.gorgePathCleared,
      honorAwarded: this.honorAwarded
    });
    return {
      gorgePathCleared: this.gorgePathCleared,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      peristalsisTracked: this.peristalsisTracked,
      venomJetsDeflected: this.venomJetsDeflected,
      basaltPillarsWallRunCompleted: this.basaltPillarsWallRunCompleted,
      gorgePathCleared: this.gorgePathCleared,
      honorAwarded: this.honorAwarded
    };
  }
}
