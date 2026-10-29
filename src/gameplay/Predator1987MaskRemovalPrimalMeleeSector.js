/**
 * Predator1987MaskRemovalPrimalMeleeSector (v229)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator (1987):
 * 1. Jungle Hunter uncoupling his pneumatic bio-mask hose connections (depressurization hiss 4.2 bar).
 * 2. Dropping the bio-mask into the muddy earth, flaring his mandibles in a primal, clicking roar.
 * 3. Disarming his shoulder plasma caster to grant Dutch an honorable, bare-handed duel.
 * 4. Engaging in brutal unarmed melee, hurling Dutch against ancient tree buttresses (+350 Honor).
 */
export class Predator1987MaskRemovalPrimalMeleeSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_MASK_REMOVAL_PRIMAL_MELEE';
    this.filmReference = 'Predator (1987) - Bio-Mask Pneumatic Depressurization, Mandible Snarl & Unarmed Primal Brawl';
    this.reset();
  }

  reset() {
    this.maskPneumaticsDepressurized = false;
    this.mandibleSnarlRoared = false;
    this.plasmaCasterDisarmedForDuel = false;
    this.primalMeleeBrawlExecuted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  depressurizeBioMaskHoses({
    depressurizationHissBars = 4.2,
    hoseSealDisengaged = true
  } = {}) {
    const bars = Math.max(0, Number(depressurizationHissBars) || 0);
    this.maskPneumaticsDepressurized = bars >= 3.5 && hoseSealDisengaged === true;
    this.eventLog.push({
      step: 'MASK_PNEUMATICS_DEPRESSURIZED',
      depressurizationHissBars: bars,
      hoseSealDisengaged,
      maskPneumaticsDepressurized: this.maskPneumaticsDepressurized
    });
    return {
      maskPneumaticsDepressurized: this.maskPneumaticsDepressurized
    };
  }

  flareMandiblesInPrimalSnarl({
    mandibleSpanCm = 24,
    clickingSnarlDecibels = 115
  } = {}) {
    if (!this.maskPneumaticsDepressurized) {
      throw new Error('Must depressurize bio-mask before mandible snarl.');
    }
    const span = Math.max(0, Number(mandibleSpanCm) || 0);
    const db = Math.max(0, Number(clickingSnarlDecibels) || 0);
    this.mandibleSnarlRoared = span >= 20 && db >= 100;
    this.eventLog.push({
      step: 'MANDIBLE_SNARL_ROARED',
      mandibleSpanCm: span,
      clickingSnarlDecibels: db,
      mandibleSnarlRoared: this.mandibleSnarlRoared
    });
    return {
      mandibleSnarlRoared: this.mandibleSnarlRoared
    };
  }

  disarmPlasmaCasterForHonorableDuel({
    casterDecoupledFromHarness = true,
    unarmedHonorableChallengeIssued = true
  } = {}) {
    if (!this.mandibleSnarlRoared) {
      throw new Error('Must roar mandible snarl before disarming plasma caster.');
    }
    this.plasmaCasterDisarmedForDuel = casterDecoupledFromHarness === true && unarmedHonorableChallengeIssued === true;
    this.eventLog.push({
      step: 'PLASMA_CASTER_DISARMED_FOR_DUEL',
      casterDecoupledFromHarness,
      unarmedHonorableChallengeIssued,
      plasmaCasterDisarmedForDuel: this.plasmaCasterDisarmedForDuel
    });
    return {
      plasmaCasterDisarmedForDuel: this.plasmaCasterDisarmedForDuel
    };
  }

  executePrimalMeleeThrow({
    punchKineticJoules = 7800,
    treeImpactDistanceMeters = 6.5
  } = {}) {
    if (!this.plasmaCasterDisarmedForDuel) {
      throw new Error('Must disarm plasma caster before executing primal melee brawl.');
    }
    const joules = Math.max(0, Number(punchKineticJoules) || 0);
    const dist = Math.max(0, Number(treeImpactDistanceMeters) || 0);
    this.primalMeleeBrawlExecuted = joules >= 6000 && dist >= 5.0;
    if (this.primalMeleeBrawlExecuted) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'PRIMAL_MELEE_BRAWL_EXECUTED',
      punchKineticJoules: joules,
      treeImpactDistanceMeters: dist,
      primalMeleeBrawlExecuted: this.primalMeleeBrawlExecuted,
      honorAwarded: this.honorAwarded
    });
    return {
      primalMeleeBrawlExecuted: this.primalMeleeBrawlExecuted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.maskPneumaticsDepressurized &&
      this.mandibleSnarlRoared &&
      this.plasmaCasterDisarmedForDuel &&
      this.primalMeleeBrawlExecuted &&
      this.honorAwarded === 350
    );
  }
}
