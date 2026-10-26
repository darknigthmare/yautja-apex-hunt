/**
 * Chantier 3 (v202) : Embuscade de Chopper Predator par Grid Alien & Marquage Blooded de Lex Woods (AVP - 2004)
 * Complète en fidélité 1:1 les scènes clés d'Alien vs. Predator (2004) : empalement dorsal de
 * Chopper Predator (lames cimeterres) à 2,6 m de haut par la queue du Grid Alien, forge par Scar
 * du bouclier crânien et de la lance caudale en chitine pour Alexa « Lex » Woods, marquage acide
 * sur la joue de Lex et remise de la lance cérémonielle par l'Ancien Predator sous le blizzard.
 */
export class Avp2004ChopperPredatorGillAmbushAndLexBloodedMarkSector {
  constructor() {
    this.sectorId = 'AVP_2004_CHOPPER_AMBUSH_AND_LEX_WOODS_BLOODED_MARK';
    this.filmReference = 'Alien vs. Predator (2004) - Chopper Tail Impalement, Lex Xeno Gear & Elder Combi-Spear Gift';
    this.reset();
  }

  reset() {
    this.chopperImpaledByGridTail = false;
    this.lexXenoGearForged = false;
    this.lexCheekMarkedBlooded = false;
    this.elderCombiSpearBestowed = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  ambushChopperPredatorWithGridAlienTailImpalement({
    tailLiftHeightMeters = 2.6,
    scimitarBladesDropped = true
  } = {}) {
    const height = Math.max(0, Number(tailLiftHeightMeters) || 0);
    this.chopperImpaledByGridTail =
      height >= 2.0 && Boolean(scimitarBladesDropped);
    this.eventLog.push({
      step: 'CHOPPER_PREDATOR_TAIL_IMPALEMENT',
      tailLiftHeightMeters: height,
      chopperImpaledByGridTail: this.chopperImpaledByGridTail
    });
    return {
      chopperImpaledByGridTail: this.chopperImpaledByGridTail,
      tailLiftHeightMeters: height
    };
  }

  forgeLexWoodsXenoHeadShieldAndTailSpear({
    carapaceAcidProofed = true,
    spearBalanceRatio = 0.94
  } = {}) {
    if (!this.chopperImpaledByGridTail) {
      throw new Error('Chopper ambush must occur before Scar forges Lex Woods Xeno-head shield and tail spear.');
    }
    const balance = Math.min(1, Math.max(0, Number(spearBalanceRatio) || 0));
    this.lexXenoGearForged = Boolean(carapaceAcidProofed) && balance >= 0.85;
    this.eventLog.push({
      step: 'LEX_WOODS_XENO_GEAR_FORGED',
      carapaceAcidProofed: Boolean(carapaceAcidProofed),
      spearBalanceRatio: balance,
      lexXenoGearForged: this.lexXenoGearForged
    });
    return {
      lexXenoGearForged: this.lexXenoGearForged,
      spearBalanceRatio: balance
    };
  }

  etchAcidBloodedClanSymbolOnLexCheek({
    acidNeutralizedOnSkin = true,
    clanSymbolVerified = 'BLOODED_WARRIOR'
  } = {}) {
    if (!this.lexXenoGearForged) {
      throw new Error('Lex Xeno gear must be forged before Scar etches the Blooded clan symbol on her cheek.');
    }
    this.lexCheekMarkedBlooded =
      Boolean(acidNeutralizedOnSkin) && clanSymbolVerified === 'BLOODED_WARRIOR';
    this.eventLog.push({
      step: 'LEX_CHEEK_MARKED_BLOODED_WARRIOR',
      clanSymbolVerified,
      lexCheekMarkedBlooded: this.lexCheekMarkedBlooded
    });
    return {
      lexCheekMarkedBlooded: this.lexCheekMarkedBlooded,
      clanSymbolVerified
    };
  }

  bestowElderCeremonialCombiSpearInBlizzard({
    mothershipDecloaked = true,
    elderHonorGiftAccepted = true
  } = {}) {
    if (!this.lexCheekMarkedBlooded) {
      throw new Error('Lex must be marked as a Blooded warrior before the Elder bestows his ceremonial Combi-Spear.');
    }
    this.elderCombiSpearBestowed =
      Boolean(mothershipDecloaked) && Boolean(elderHonorGiftAccepted);
    if (this.elderCombiSpearBestowed) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'ELDER_CEREMONIAL_COMBI_SPEAR_BESTOWED',
      elderCombiSpearBestowed: this.elderCombiSpearBestowed,
      honorAwarded: this.honorAwarded
    });
    return {
      elderCombiSpearBestowed: this.elderCombiSpearBestowed,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      chopperImpaledByGridTail: this.chopperImpaledByGridTail,
      lexXenoGearForged: this.lexXenoGearForged,
      lexCheekMarkedBlooded: this.lexCheekMarkedBlooded,
      elderCombiSpearBestowed: this.elderCombiSpearBestowed,
      honorAwarded: this.honorAwarded
    };
  }
}
