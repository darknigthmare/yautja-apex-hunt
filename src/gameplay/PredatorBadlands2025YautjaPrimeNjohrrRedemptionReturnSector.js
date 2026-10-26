/**
 * Chantier 6 (v198) : Retour Triomphal sur Yautja Prime — Confrontation avec Njohrr & Vengeance de Kwei (Predator: Badlands - 2025)
 * Modélise en fidélité 1:1 le retour d'exil de Dek sur Yautja Prime accompagné de Thia et Bud :
 * atterrissage sur la plateforme d'obsidienne, présentation de la couronne régénérative du Kalisk
 * et du crâne chromé de Tessa, duel d'honneur contre le père Njohrr en utilisant la feinte enseignée
 * par Kwei, et gravure de la rune de Kwei sur le trône du clan.
 */
export class PredatorBadlands2025YautjaPrimeNjohrrRedemptionReturnSector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_NJOHRR_REDEMPTION_RETURN';
    this.filmReference = 'Predator: Badlands (2025) - Dek Return to Yautja Prime, Njohrr Duel & Kwei Tribute';
    this.clanHomeworld = 'YAUTJA_PRIME_OBSIDIAN_CITADEL';
    this.reset();
  }

  reset() {
    this.landedAtCitadel = false;
    this.clanGuardsShocked = 0;
    this.gennaTrophiesDisplayed = false;
    this.njohrrDuelWon = false;
    this.njohrrGlaiveParriedJoules = 0;
    this.kweiSignatureCounterUsed = false;
    this.kweiMemorialRuneCarved = false;
    this.thiaAndBudAcceptedAsPack = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  descendIntoYautjaPrimeCitadel({
    vesselClass = 'HYBRID_YAUTJA_WY_SCOUT',
    clanGuardsShocked = 12
  } = {}) {
    this.clanGuardsShocked = Math.max(0, Math.floor(Number(clanGuardsShocked) || 0));
    this.landedAtCitadel =
      vesselClass === 'HYBRID_YAUTJA_WY_SCOUT' && this.clanGuardsShocked >= 8;
    this.eventLog.push({
      step: 'CITADEL_LANDING_COMPLETE',
      vesselClass,
      clanGuardsShocked: this.clanGuardsShocked,
      landedAtCitadel: this.landedAtCitadel
    });
    return {
      landedAtCitadel: this.landedAtCitadel,
      clanGuardsShocked: this.clanGuardsShocked
    };
  }

  castDownGennaApexTrophies({
    kaliskRegenCrownHornDisplayed = true,
    tessaChromeSkullDisplayed = true
  } = {}) {
    if (!this.landedAtCitadel) {
      throw new Error('Must land at the Yautja Prime citadel before casting down the Genna apex trophies.');
    }
    this.gennaTrophiesDisplayed =
      Boolean(kaliskRegenCrownHornDisplayed) && Boolean(tessaChromeSkullDisplayed);
    this.eventLog.push({
      step: 'GENNA_APEX_TROPHIES_DISPLAYED',
      kaliskRegenCrownHornDisplayed: Boolean(kaliskRegenCrownHornDisplayed),
      tessaChromeSkullDisplayed: Boolean(tessaChromeSkullDisplayed),
      gennaTrophiesDisplayed: this.gennaTrophiesDisplayed
    });
    return {
      gennaTrophiesDisplayed: this.gennaTrophiesDisplayed
    };
  }

  duelClanFatherNjohrrForKweiHonor({
    njohrrHeavyGlaiveParriedJoules = 6200,
    kweiSignatureCounterUsed = true
  } = {}) {
    if (!this.gennaTrophiesDisplayed) {
      throw new Error('Genna apex trophies must be displayed before challenging Clan Father Njohrr.');
    }
    this.njohrrGlaiveParriedJoules = Math.max(0, Number(njohrrHeavyGlaiveParriedJoules) || 0);
    this.kweiSignatureCounterUsed = Boolean(kweiSignatureCounterUsed);
    this.njohrrDuelWon =
      this.njohrrGlaiveParriedJoules >= 5500 && this.kweiSignatureCounterUsed;
    this.eventLog.push({
      step: 'NJOHRR_DUEL_WON_WITH_KWEI_FEINT',
      njohrrGlaiveParriedJoules: this.njohrrGlaiveParriedJoules,
      kweiSignatureCounterUsed: this.kweiSignatureCounterUsed,
      njohrrDuelWon: this.njohrrDuelWon
    });
    return {
      njohrrDuelWon: this.njohrrDuelWon,
      njohrrGlaiveParriedJoules: this.njohrrGlaiveParriedJoules
    };
  }

  claimClanLeadershipAndHonorKweiMemory({
    njohrrDefeated = true,
    kweiMemorialRuneCarved = true,
    thiaAndBudAcceptedAsPack = true
  } = {}) {
    if (!this.njohrrDuelWon) {
      throw new Error('Njohrr must be defeated in the blood-right duel before carving Kwei memorial rune.');
    }
    this.kweiMemorialRuneCarved = Boolean(njohrrDefeated) && Boolean(kweiMemorialRuneCarved);
    this.thiaAndBudAcceptedAsPack = Boolean(thiaAndBudAcceptedAsPack);
    if (this.kweiMemorialRuneCarved && this.thiaAndBudAcceptedAsPack) {
      this.honorAwarded = 500;
    }
    this.eventLog.push({
      step: 'CLAN_LEADERSHIP_AND_KWEI_MEMORIAL_SEALED',
      kweiMemorialRuneCarved: this.kweiMemorialRuneCarved,
      thiaAndBudAcceptedAsPack: this.thiaAndBudAcceptedAsPack,
      honorAwarded: this.honorAwarded
    });
    return {
      kweiMemorialRuneCarved: this.kweiMemorialRuneCarved,
      thiaAndBudAcceptedAsPack: this.thiaAndBudAcceptedAsPack,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      landedAtCitadel: this.landedAtCitadel,
      gennaTrophiesDisplayed: this.gennaTrophiesDisplayed,
      njohrrDuelWon: this.njohrrDuelWon,
      kweiMemorialRuneCarved: this.kweiMemorialRuneCarved,
      thiaAndBudAcceptedAsPack: this.thiaAndBudAcceptedAsPack,
      honorAwarded: this.honorAwarded
    };
  }
}
