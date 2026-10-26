/**
 * Chantier 3 (v201) : Duel d'Arène Celtic Predator contre Grid Alien & Naissance de la Cicatrice en Grille (AVP - 2004)
 * Complète en fidélité 1:1 le duel emblématique d'Alien vs. Predator (2004) dans la salle aux
 * colonnes de Bouvetøya : projection du Xénomorphe à travers 3 piliers de pierre (14 500 N),
 * capture au lance-filet balistique (38 kN) gravant par acide le motif quadrillé (« Grid ») sur le
 * crâne de l'Alien, sectionnement de la pointe de queue aux lames réversibles et contre de mâchoire.
 */
export class Avp2004CelticVsGridAlienNetMeshArenaDuelSector {
  constructor() {
    this.sectorId = 'AVP_2004_CELTIC_VS_GRID_ALIEN_ARENA_DUEL';
    this.filmReference = 'Alien vs. Predator (2004) - Celtic Predator vs Grid Alien Stone Pillar & Netgun Duel';
    this.reset();
  }

  reset() {
    this.xenomorphSlammedThroughPillars = false;
    this.brokenPillarsCount = 0;
    this.gridPatternEtchedByNet = false;
    this.netTensionKn = 0;
    this.gridTailTipSevered = false;
    this.wristbladeMeltedByAcid = false;
    this.duelClimaxLogged = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  grappleSlamXenomorphThroughStonePillars({
    brokenPillarsCount = 3,
    impactForceNewtons = 14500
  } = {}) {
    this.brokenPillarsCount = Math.max(0, Math.floor(Number(brokenPillarsCount) || 0));
    const force = Math.max(0, Number(impactForceNewtons) || 0);
    this.xenomorphSlammedThroughPillars =
      this.brokenPillarsCount >= 3 && force >= 12000;
    this.eventLog.push({
      step: 'XENOMORPH_SLAMMED_THROUGH_STONE_PILLARS',
      brokenPillarsCount: this.brokenPillarsCount,
      impactForceNewtons: force,
      xenomorphSlammedThroughPillars: this.xenomorphSlammedThroughPillars
    });
    return {
      xenomorphSlammedThroughPillars: this.xenomorphSlammedThroughPillars,
      brokenPillarsCount: this.brokenPillarsCount
    };
  }

  pinXenomorphInBallisticMeshNet({
    netTensionKn = 38,
    gridAcidPatternSlicedIntoCarapace = true
  } = {}) {
    if (!this.xenomorphSlammedThroughPillars) {
      throw new Error('Xenomorph must be slammed through the stone pillars before firing the ballistic mesh net.');
    }
    this.netTensionKn = Math.max(0, Number(netTensionKn) || 0);
    this.gridPatternEtchedByNet =
      this.netTensionKn >= 30 && Boolean(gridAcidPatternSlicedIntoCarapace);
    this.eventLog.push({
      step: 'GRID_ACID_PATTERN_ETCHED_BY_NET',
      netTensionKn: this.netTensionKn,
      gridPatternEtchedByNet: this.gridPatternEtchedByNet
    });
    return {
      gridPatternEtchedByNet: this.gridPatternEtchedByNet,
      netTensionKn: this.netTensionKn
    };
  }

  severGridAlienTailTipWithReversibleWristblade({
    tailTipSevered = true,
    wristbladeMeltedByAcid = true
  } = {}) {
    if (!this.gridPatternEtchedByNet) {
      throw new Error('Grid Alien must be pinned in the mesh net before severing its tail tip.');
    }
    this.gridTailTipSevered = Boolean(tailTipSevered);
    this.wristbladeMeltedByAcid = Boolean(wristbladeMeltedByAcid);
    this.eventLog.push({
      step: 'GRID_ALIEN_TAIL_TIP_SEVERED',
      gridTailTipSevered: this.gridTailTipSevered,
      wristbladeMeltedByAcid: this.wristbladeMeltedByAcid
    });
    return {
      gridTailTipSevered: this.gridTailTipSevered,
      wristbladeMeltedByAcid: this.wristbladeMeltedByAcid
    };
  }

  surviveGridAlienInnerJawCounterPin({
    tacticalRetreatOrTrophyLogged = true
  } = {}) {
    if (!this.gridTailTipSevered) {
      throw new Error('Grid Alien tail tip must be severed before logging the inner-jaw counter climax.');
    }
    this.duelClimaxLogged = Boolean(tacticalRetreatOrTrophyLogged);
    if (this.duelClimaxLogged) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CELTIC_GRID_DUEL_CLIMAX_LOGGED',
      duelClimaxLogged: this.duelClimaxLogged,
      honorAwarded: this.honorAwarded
    });
    return {
      duelClimaxLogged: this.duelClimaxLogged,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      xenomorphSlammedThroughPillars: this.xenomorphSlammedThroughPillars,
      gridPatternEtchedByNet: this.gridPatternEtchedByNet,
      gridTailTipSevered: this.gridTailTipSevered,
      duelClimaxLogged: this.duelClimaxLogged,
      honorAwarded: this.honorAwarded
    };
  }
}
