/**
 * Predator1987UnmaskingHissAndBareKnuckleDuelSector (v207)
 *
 * Implements iconic 1:1 set-pieces from Predator (1987):
 * 1. The Jungle Hunter disconnecting his biomask pneumatic cables with an intense air hiss (380 kPa),
 *    dropping the mask into the mud to reveal his horrifying multi-segmented mandibles.
 * 2. Dutch Schaefer witnessing the alien face and delivering the legendary line: "You're one... ugly motherfucker!".
 * 3. The brutal bare-knuckle brawl: the Jungle Hunter tossing Dutch into jungle tree trunks with 7,400 N impact force.
 * 4. Dutch crawling away in agony, deliberately baiting the Jungle Hunter underneath the counterweight deadfall zone.
 */
export class Predator1987UnmaskingHissAndBareKnuckleDuelSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_UNMASKING_HISS_AND_BARE_KNUCKLE_DUEL';
    this.filmReference = 'Predator (1987) - Biomask Pneumatic Hiss, "Ugly Motherfucker" Face-Off & Bare-Knuckle Beatdown';
    this.reset();
  }

  reset() {
    this.biomaskHoseDisconnected = false;
    this.uglyMotherfuckerQuoteDelivered = false;
    this.bareKnuckleBeatdownEndured = false;
    this.hunterLuredUnderneathCounterweight = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  disconnectBiomaskHoseAndVentPneumaticHiss({
    pneumaticPressureKpa = 380,
    maskDroppedInMud = true
  } = {}) {
    const kpa = Math.max(0, Number(pneumaticPressureKpa) || 0);
    this.biomaskHoseDisconnected = kpa >= 300 && Boolean(maskDroppedInMud);
    this.eventLog.push({
      step: 'BIOMASK_HOSE_DISCONNECTED',
      pneumaticPressureKpa: kpa,
      biomaskHoseDisconnected: this.biomaskHoseDisconnected
    });
    return {
      biomaskHoseDisconnected: this.biomaskHoseDisconnected,
      pneumaticPressureKpa: kpa
    };
  }

  revealJungleHunterMandiblesAndDeliverUglyQuote({
    mandiblesSpreadAngleDegrees = 68,
    quoteDelivered = true
  } = {}) {
    if (!this.biomaskHoseDisconnected) {
      throw new Error('Biomask must be unlatched and dropped before revealing mandibles.');
    }
    const angle = Math.max(0, Number(mandiblesSpreadAngleDegrees) || 0);
    this.uglyMotherfuckerQuoteDelivered = angle >= 50 && Boolean(quoteDelivered);
    this.eventLog.push({
      step: 'UGLY_MOTHERFUCKER_QUOTE_DELIVERED',
      mandiblesSpreadAngleDegrees: angle,
      uglyMotherfuckerQuoteDelivered: this.uglyMotherfuckerQuoteDelivered
    });
    return {
      uglyMotherfuckerQuoteDelivered: this.uglyMotherfuckerQuoteDelivered,
      mandiblesSpreadAngleDegrees: angle
    };
  }

  endureBareKnuckleTreeThrowBeatdown({
    punchForceNewtons = 7400,
    dutchThrownIntoTrunk = true
  } = {}) {
    if (!this.uglyMotherfuckerQuoteDelivered) {
      throw new Error('Face-off dialog must occur before bare-knuckle brawl initiates.');
    }
    const force = Math.max(0, Number(punchForceNewtons) || 0);
    this.bareKnuckleBeatdownEndured = force >= 6000 && Boolean(dutchThrownIntoTrunk);
    this.eventLog.push({
      step: 'BARE_KNUCKLE_BEATDOWN_ENDURED',
      punchForceNewtons: force,
      bareKnuckleBeatdownEndured: this.bareKnuckleBeatdownEndured
    });
    return {
      bareKnuckleBeatdownEndured: this.bareKnuckleBeatdownEndured,
      punchForceNewtons: force
    };
  }

  lureHunterUnderneathCounterweightTrapDropZone({
    hunterPositionLocked = true,
    triggerVinePrimed = true
  } = {}) {
    if (!this.bareKnuckleBeatdownEndured) {
      throw new Error('Dutch must endure the physical beatdown before crawling toward the trap vine.');
    }
    this.hunterLuredUnderneathCounterweight =
      Boolean(hunterPositionLocked) && Boolean(triggerVinePrimed);
    if (this.hunterLuredUnderneathCounterweight) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'HUNTER_LURED_UNDERNEATH_COUNTERWEIGHT',
      hunterLuredUnderneathCounterweight: this.hunterLuredUnderneathCounterweight,
      honorAwarded: this.honorAwarded
    });
    return {
      hunterLuredUnderneathCounterweight: this.hunterLuredUnderneathCounterweight,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      biomaskHoseDisconnected: this.biomaskHoseDisconnected,
      uglyMotherfuckerQuoteDelivered: this.uglyMotherfuckerQuoteDelivered,
      bareKnuckleBeatdownEndured: this.bareKnuckleBeatdownEndured,
      hunterLuredUnderneathCounterweight: this.hunterLuredUnderneathCounterweight,
      honorAwarded: this.honorAwarded
    };
  }
}
