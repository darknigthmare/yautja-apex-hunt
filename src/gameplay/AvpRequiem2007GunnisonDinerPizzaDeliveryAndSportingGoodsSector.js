/**
 * Chantier 4 (v202) : Siège de l'Armurerie Sporting Goods de Gunnison & Double Étranglement de Wolf (AVPR - 2007)
 * Complète en fidélité 1:1 la survie urbaine dans Aliens vs. Predator: Requiem (2007) : effraction
 * de l'armurerie de Gunnison par Dallas, Ricky, Kelly et le shérif Morales (6 survivants armés de
 * carabines M4 et lunettes de vision nocturne), défense contre l'assaut des vitrines (180 cartouches),
 * double étranglement à mains nues de 2 Xénomorphes par Wolf (6 400 N) et repli vers l'héliport.
 */
export class AvpRequiem2007GunnisonDinerPizzaDeliveryAndSportingGoodsSector {
  constructor() {
    this.sectorId = 'AVPR_2007_GUNNISON_SPORTING_GOODS_AND_WOLF_DUAL_CHOKE';
    this.filmReference = 'AVP: Requiem (2007) - Gunnison Sporting Goods Gun Store Siege & Wolf Barehanded Dual Chokehold';
    this.reset();
  }

  reset() {
    this.sportingGoodsArmoryBreached = false;
    this.survivorsArmedCount = 0;
    this.windowBreachRepelled = false;
    this.wolfDualChokeholdExecuted = false;
    this.helipadRouteSelected = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  breachGunnisonSportingGoodsArmory({
    survivorsArmedCount = 6,
    nightVisionOpticsDistributed = true
  } = {}) {
    this.survivorsArmedCount = Math.max(0, Math.floor(Number(survivorsArmedCount) || 0));
    this.sportingGoodsArmoryBreached =
      this.survivorsArmedCount >= 5 && Boolean(nightVisionOpticsDistributed);
    this.eventLog.push({
      step: 'GUNNISON_SPORTING_GOODS_ARMORY_BREACHED',
      survivorsArmedCount: this.survivorsArmedCount,
      sportingGoodsArmoryBreached: this.sportingGoodsArmoryBreached
    });
    return {
      sportingGoodsArmoryBreached: this.sportingGoodsArmoryBreached,
      survivorsArmedCount: this.survivorsArmedCount
    };
  }

  repelXenomorphWindowBreachBarrage({
    roundsExpended = 180,
    acidPoolAvoided = true
  } = {}) {
    if (!this.sportingGoodsArmoryBreached) {
      throw new Error('Sporting goods armory must be breached before repelling the Xenomorph window barrage.');
    }
    const rounds = Math.max(0, Math.floor(Number(roundsExpended) || 0));
    this.windowBreachRepelled = rounds >= 120 && Boolean(acidPoolAvoided);
    this.eventLog.push({
      step: 'XENOMORPH_WINDOW_BARRAGE_REPELLED',
      roundsExpended: rounds,
      windowBreachRepelled: this.windowBreachRepelled
    });
    return {
      windowBreachRepelled: this.windowBreachRepelled,
      roundsExpended: rounds
    };
  }

  wolfDualChokeholdTwoXenomorphsBarehanded({
    gripForceNewtons = 6400,
    dualThroatCrush = true
  } = {}) {
    if (!this.windowBreachRepelled) {
      throw new Error('Window breach barrage must be repelled before Wolf executes the barehanded dual chokehold.');
    }
    const force = Math.max(0, Number(gripForceNewtons) || 0);
    this.wolfDualChokeholdExecuted = force >= 5500 && Boolean(dualThroatCrush);
    this.eventLog.push({
      step: 'WOLF_DUAL_XENOMORPH_CHOKEHOLD',
      gripForceNewtons: force,
      wolfDualChokeholdExecuted: this.wolfDualChokeholdExecuted
    });
    return {
      wolfDualChokeholdExecuted: this.wolfDualChokeholdExecuted,
      gripForceNewtons: force
    };
  }

  extractSurvivorsTowardHospitalHelipad({
    militaryRadioIntercepted = true,
    helipadRouteChosen = true
  } = {}) {
    if (!this.wolfDualChokeholdExecuted) {
      throw new Error('Wolf dual chokehold must occur before extracting survivors toward the hospital helipad.');
    }
    this.helipadRouteSelected =
      Boolean(militaryRadioIntercepted) && Boolean(helipadRouteChosen);
    if (this.helipadRouteSelected) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'SURVIVORS_EXTRACTED_TOWARD_HELIPAD',
      helipadRouteSelected: this.helipadRouteSelected,
      honorAwarded: this.honorAwarded
    });
    return {
      helipadRouteSelected: this.helipadRouteSelected,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      sportingGoodsArmoryBreached: this.sportingGoodsArmoryBreached,
      windowBreachRepelled: this.windowBreachRepelled,
      wolfDualChokeholdExecuted: this.wolfDualChokeholdExecuted,
      helipadRouteSelected: this.helipadRouteSelected,
      honorAwarded: this.honorAwarded
    };
  }
}
