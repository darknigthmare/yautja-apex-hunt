/**
 * Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector (v222)
 *
 * Implements iconic 1:1 canonical set-pieces from Alien vs. Predator (2004):
 * 1. Scar and Lex Woods severing tail barb of an adult drone at the sacrificial altar.
 * 2. Detaching dorsal chitin plates to forge an acid-proof carapace shield.
 * 3. Scar etching the clan lightning bolt symbol with smoking acid blood onto Lex's forehead and bio-mask.
 * 4. Repelling Grid Alien's ambush strike using the forged shield and impaling it on the tail spear.
 */
export class Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector {
  constructor() {
    this.sectorId = 'AVP_2004_SACRIFICIAL_ALTAR_CARAPACE_SHIELD_AND_ACID_ETCH';
    this.filmReference = 'Alien vs. Predator (2004) - Carapace Shield Forging, Acid Clan Mark Etch & Altar Ambush';
    this.reset();
  }

  reset() {
    this.droneTailBarbSevered = false;
    this.carapaceShieldForged = false;
    this.acidClanMarkEtched = false;
    this.gridAlienAmbushRepelled = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  severDroneTailBarbAtSacrificialAltar({
    tailSeverForceNewtons = 7400,
    barbLengthCm = 38
  } = {}) {
    const force = Math.max(0, Number(tailSeverForceNewtons) || 0);
    const len = Math.max(0, Number(barbLengthCm) || 0);
    this.droneTailBarbSevered = force >= 6000 && len >= 30;
    this.eventLog.push({
      step: 'DRONE_TAIL_BARB_SEVERED',
      tailSeverForceNewtons: force,
      barbLengthCm: len,
      droneTailBarbSevered: this.droneTailBarbSevered
    });
    return {
      droneTailBarbSevered: this.droneTailBarbSevered
    };
  }

  forgeAcidProofCarapaceShield({
    dorsalPlateThicknessMm = 28,
    acidResistancePh = 0.2
  } = {}) {
    if (!this.droneTailBarbSevered) {
      throw new Error('Must sever tail barb before forging carapace shield.');
    }
    const thick = Math.max(0, Number(dorsalPlateThicknessMm) || 0);
    const ph = Number(acidResistancePh) || 0;
    this.carapaceShieldForged = thick >= 20 && ph <= 0.5;
    this.eventLog.push({
      step: 'CARAPACE_SHIELD_FORGED',
      dorsalPlateThicknessMm: thick,
      acidResistancePh: ph,
      carapaceShieldForged: this.carapaceShieldForged
    });
    return {
      carapaceShieldForged: this.carapaceShieldForged
    };
  }

  etchClanLightningBoltMarkWithAcid({
    fingertipAcidImmersionSeconds = 2.5,
    clanMarkSymbol = 'LIGHTNING_BOLT_CLAN_MARK'
  } = {}) {
    if (!this.carapaceShieldForged) {
      throw new Error('Must forge carapace shield before etching clan mark.');
    }
    const sec = Number(fingertipAcidImmersionSeconds) || 0;
    const validSymbol = clanMarkSymbol === 'LIGHTNING_BOLT_CLAN_MARK';
    this.acidClanMarkEtched = sec >= 1.5 && validSymbol;
    this.eventLog.push({
      step: 'ACID_CLAN_MARK_ETCHED',
      fingertipAcidImmersionSeconds: sec,
      clanMarkSymbol,
      acidClanMarkEtched: this.acidClanMarkEtched
    });
    return {
      acidClanMarkEtched: this.acidClanMarkEtched
    };
  }

  repelGridAlienAmbushWithShieldAndSpear({
    shieldDeflectionJoules = 6200,
    tailSpearImpaleConfirmed = true
  } = {}) {
    if (!this.acidClanMarkEtched) {
      throw new Error('Must etch clan mark before repelling Grid Alien ambush.');
    }
    const joules = Math.max(0, Number(shieldDeflectionJoules) || 0);
    this.gridAlienAmbushRepelled = joules >= 5000 && tailSpearImpaleConfirmed === true;
    if (this.gridAlienAmbushRepelled) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'GRID_ALIEN_AMBUSH_REPELLED',
      shieldDeflectionJoules: joules,
      tailSpearImpaleConfirmed,
      gridAlienAmbushRepelled: this.gridAlienAmbushRepelled,
      honorAwarded: this.honorAwarded
    });
    return {
      gridAlienAmbushRepelled: this.gridAlienAmbushRepelled,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.droneTailBarbSevered &&
      this.carapaceShieldForged &&
      this.acidClanMarkEtched &&
      this.gridAlienAmbushRepelled &&
      this.honorAwarded === 400
    );
  }
}
