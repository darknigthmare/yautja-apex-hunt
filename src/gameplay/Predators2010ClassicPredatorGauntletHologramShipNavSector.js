/**
 * Chantier 5 (v201) : Hologramme Stellaire Terrestre du Classic Predator (2010) & Décryptage de Rory McKenna (2018)
 * Complète en fidélité 1:1 la libération du Classic Predator crucifié dans Predators (2010) avec
 * projection holographique 3D de la carte stellaire vers la Terre, ainsi que le décryptage par
 * Rory McKenna de la matrice linguistique du gantelet Yautja et le ravitaillement des Loonies dans
 * The Predator (2018).
 */
export class Predators2010ClassicPredatorGauntletHologramShipNavSector {
  constructor() {
    this.sectorId = 'PREDATORS_2010_2018_GAUNTLET_STARMAP_AND_RORY_DECRYPTION';
    this.filmReference = 'Predators (2010) & The Predator (2018) - Classic Gauntlet Earth Hologram & Rory Matrix Decryption';
    this.reset();
  }

  reset() {
    this.classicPredatorFreedFromTotem = false;
    this.earthStarChartProjected = false;
    this.roryGauntletMatrixDecrypted = false;
    this.glyphPermutationsSolved = 0;
    this.looniesSquadResupplied = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  severCrucifiedClassicPredatorTotemChains({
    chainsCut = 4,
    honorTruceAcceptedByClassic = true
  } = {}) {
    const cut = Math.max(0, Math.floor(Number(chainsCut) || 0));
    this.classicPredatorFreedFromTotem =
      cut >= 4 && Boolean(honorTruceAcceptedByClassic);
    this.eventLog.push({
      step: 'CRUCIFIED_CLASSIC_PREDATOR_FREED',
      chainsCut: cut,
      classicPredatorFreedFromTotem: this.classicPredatorFreedFromTotem
    });
    return {
      classicPredatorFreedFromTotem: this.classicPredatorFreedFromTotem,
      chainsCut: cut
    };
  }

  projectThreeDimensionalEarthStarChartHologram({
    earthCoordinatesLocked = true,
    scoutShipAutopilotSet = true
  } = {}) {
    if (!this.classicPredatorFreedFromTotem) {
      throw new Error('Crucified Classic Predator must be freed before projecting the 3D Earth star-chart hologram.');
    }
    this.earthStarChartProjected =
      Boolean(earthCoordinatesLocked) && Boolean(scoutShipAutopilotSet);
    this.eventLog.push({
      step: 'EARTH_3D_STAR_CHART_HOLOGRAM_PROJECTED',
      earthStarChartProjected: this.earthStarChartProjected
    });
    return {
      earthStarChartProjected: this.earthStarChartProjected
    };
  }

  roryMcKennaDecryptYautjaGauntletLanguageMatrix({
    glyphPermutationsSolved = 64,
    stargazerAlertTriggered = true
  } = {}) {
    if (!this.earthStarChartProjected) {
      throw new Error('Earth star-chart hologram must be projected before Rory decrypts the gauntlet language matrix.');
    }
    this.glyphPermutationsSolved = Math.max(0, Math.floor(Number(glyphPermutationsSolved) || 0));
    this.roryGauntletMatrixDecrypted =
      this.glyphPermutationsSolved >= 48 && Boolean(stargazerAlertTriggered);
    this.eventLog.push({
      step: 'RORY_MCKENNA_GAUNTLET_MATRIX_DECRYPTED',
      glyphPermutationsSolved: this.glyphPermutationsSolved,
      roryGauntletMatrixDecrypted: this.roryGauntletMatrixDecrypted
    });
    return {
      roryGauntletMatrixDecrypted: this.roryGauntletMatrixDecrypted,
      glyphPermutationsSolved: this.glyphPermutationsSolved
    };
  }

  resupplyLooniesSquadForFinalIntercept({
    improvisedOrdnanceLoaded = 6,
    teamCohesionIndex = 0.95
  } = {}) {
    if (!this.roryGauntletMatrixDecrypted) {
      throw new Error('Gauntlet language matrix must be decrypted before the Loonies squad resupplies for the final intercept.');
    }
    const ordnance = Math.max(0, Math.floor(Number(improvisedOrdnanceLoaded) || 0));
    const cohesion = Math.min(1, Math.max(0, Number(teamCohesionIndex) || 0));
    this.looniesSquadResupplied = ordnance >= 5 && cohesion >= 0.85;
    if (this.looniesSquadResupplied) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'LOONIES_SQUAD_RESUPPLIED',
      improvisedOrdnanceLoaded: ordnance,
      teamCohesionIndex: cohesion,
      looniesSquadResupplied: this.looniesSquadResupplied,
      honorAwarded: this.honorAwarded
    });
    return {
      looniesSquadResupplied: this.looniesSquadResupplied,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      classicPredatorFreedFromTotem: this.classicPredatorFreedFromTotem,
      earthStarChartProjected: this.earthStarChartProjected,
      roryGauntletMatrixDecrypted: this.roryGauntletMatrixDecrypted,
      looniesSquadResupplied: this.looniesSquadResupplied,
      honorAwarded: this.honorAwarded
    };
  }
}
