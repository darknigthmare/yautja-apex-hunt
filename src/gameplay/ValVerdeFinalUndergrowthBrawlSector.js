/**
 * ValVerdeFinalUndergrowthBrawlSector.js
 * 
 * Chantier Level Design #6 - Arène du Duel Final au Corps-à-Corps sous les Racines Géantes.
 * Canonical 1:1 Predator (1987) fidelity:
 * - The iconic bare-knuckle clash between Major Alan "Dutch" Schaefer and the unmasked Jungle Hunter.
 * - The Jungle Hunter disengages his plasma caster and bio-mask, emitting his ferocious guttural roar.
 * - Physical disparity: Yautja height 2.32m, mass 195kg, skeletal and muscle tissue 3.5x denser than human tissue.
 * - Dutch lands desperate heavy punches and branch club swings, dealing minimal blunt damage but luring the Hunter into the deadfall killzone.
 * - Hunter delivers backhand strikes, lifting Dutch by the neck before being baited beneath the counterweighted deadfall log.
 */

export class ValVerdeFinalUndergrowthBrawlSector {
  /**
   * @param {Object} options
   * @param {number} [options.hunterMassKg=195.0]
   * @param {number} [options.dutchMassKg=105.0]
   */
  constructor(options = {}) {
    this.hunterMassKg = options.hunterMassKg ?? 195.0;
    this.dutchMassKg = options.dutchMassKg ?? 105.0;

    this.hunterMaskRemoved = false;
    this.plasmaCasterDiscarded = false;
    this.hunterHealth = 100;
    this.dutchHealth = 100;
    this.hunterBaitPositionedUnderDeadfall = false;
  }

  /**
   * Hunter strips bio-mask and shoulder weapon for ritualistic honorable hand-to-hand combat.
   * @returns {Object} Unmasking ritual telemetry
   */
  initiateUnmaskedHonorableDuel() {
    this.hunterMaskRemoved = true;
    this.plasmaCasterDiscarded = true;

    return {
      success: true,
      hunterMaskRemoved: true,
      plasmaCasterDiscarded: true,
      famousQuote: 'You are one ugly mother...',
      mandibleSpreadAngleDeg: 48,
      gutturalRoarAcousticDb: 104,
      honorChallengeActive: true
    };
  }

  /**
   * Resolves a punch or club strike from Dutch against the unmasked hunter.
   * @param {string} strikeType - 'BARE_FIST' | 'HEAVY_TREE_BRANCH_CLUB'
   * @returns {Object} Strike outcome
   */
  resolveDutchMeleeStrike(strikeType = 'BARE_FIST') {
    let damageDealt = 0;
    let kineticJoules = 0;
    let hunterFlinch = false;

    if (strikeType === 'BARE_FIST') {
      kineticJoules = 280;
      damageDealt = 4; // Dense reptilian muscle absorbs almost all human fist impact
      hunterFlinch = false;
    } else {
      // HEAVY_TREE_BRANCH_CLUB
      kineticJoules = 850;
      damageDealt = 14;
      hunterFlinch = true;
    }

    this.hunterHealth = Math.max(0, this.hunterHealth - damageDealt);

    return {
      strikeType,
      kineticJoules,
      damageDealt,
      hunterHealthRemaining: this.hunterHealth,
      hunterFlinch,
      dutchHandDamage: strikeType === 'BARE_FIST' ? 'BRUISED_KNUCKLES' : 'NONE'
    };
  }

  /**
   * Resolves the Hunter's brutal counter-attack.
   * @param {string} attackType - 'BACKHAND_SLAP' | 'THROAT_CHOKE_LIFT'
   * @returns {Object} Hunter attack outcome
   */
  resolveHunterCounterAttack(attackType = 'BACKHAND_SLAP') {
    let damageDealt = 0;
    let launchDistanceM = 0;

    if (attackType === 'BACKHAND_SLAP') {
      damageDealt = 28;
      launchDistanceM = 4.2;
    } else {
      // THROAT_CHOKE_LIFT
      damageDealt = 35;
      launchDistanceM = 2.0;
    }

    this.dutchHealth = Math.max(0, this.dutchHealth - damageDealt);

    return {
      attackType,
      damageDealt,
      launchDistanceM,
      dutchHealthRemaining: this.dutchHealth,
      dutchSlammedIntoMud: true
    };
  }

  /**
   * Dutch crawls backwards into the deadfall trench to bait the Hunter directly under the 1.2-ton log.
   * @returns {Object} Bait positioning status
   */
  baitHunterUnderDeadfallTrench() {
    this.hunterBaitPositionedUnderDeadfall = true;

    return {
      success: true,
      hunterBaitPositionedUnderDeadfall: true,
      hunterDistanceToDeadfallLogM: 0.8,
      triggerLianaWithinReach: true,
      readyToDropDeadfall: true
    };
  }
}
