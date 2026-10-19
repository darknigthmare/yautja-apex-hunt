/**
 * KingWillieVoodooAlleyPentagramStandOffSector.js
 * Chantier 8 (v152) : Ruelle brumeuse de King Willie & duel rituel à l'épée-canne sous l'orage (Predator 2).
 * Ruelle trempée de Los Angeles 1997 saturée de vapeur et d'encens vaudou :
 * - King Willie dégaine la lame dissimulée dans sa canne pour affronter le City Hunter en combat singulier.
 * - Le City Hunter désactive ses armes à distance pour honorer le duel à l'arme blanche et prélève
 *   le crâne trophée de King Willie après la victoire.
 */

export class KingWillieVoodooAlleyPentagramStandOffSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'la_1997_voodoo_alley_pentagram';
    this.alleyMistDensity = options.alleyMistDensity ?? 0.82;

    this.state = {
      swordCaneUnsheathed: false,
      honorMeleeDuelActive: false,
      kingWillieDefeated: false,
      skullTrophyClaimed: false
    };
  }

  initiateSwordCaneStandOff(audioSynthesizer = null) {
    this.state.swordCaneUnsheathed = true;
    this.state.honorMeleeDuelActive = true;

    if (audioSynthesizer && typeof audioSynthesizer.playKingWillieSwordCaneUnsheatheShink === 'function') {
      audioSynthesizer.playKingWillieSwordCaneUnsheatheShink(1.0);
    }

    return {
      standOffStarted: true,
      swordCaneUnsheathed: true,
      rangedWeaponsLockedForHonor: true
    };
  }

  resolveAlleyMeleeDuelAndClaimSkull(hunterUsedMeleeOnly = true) {
    if (!this.state.honorMeleeDuelActive) {
      this.initiateSwordCaneStandOff();
    }

    this.state.kingWillieDefeated = true;
    this.state.skullTrophyClaimed = true;
    const honorAwarded = hunterUsedMeleeOnly ? 220 : -150;

    return {
      duelResolved: true,
      kingWillieDefeated: true,
      skullTrophyClaimed: true,
      honorAwarded,
      trophyId: 'king_willie_bleached_skull_trophy'
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      swordCaneUnsheathed: this.state.swordCaneUnsheathed,
      kingWillieDefeated: this.state.kingWillieDefeated,
      skullTrophyClaimed: this.state.skullTrophyClaimed
    };
  }
}
