/**
 * Chantier 3 (v199) : Abordage du Convoi Blindé Bio-Harvester Weyland-Yutani (Predator: Badlands - 2025)
 * Modélise en fidélité 1:1 l'attaque du transporteur de spécimens à 8 roues WY-AT800 roulant à
 * 58 km/h sur les plaines de cendres de Genna : grappin de liane sur le bogie (4 800 N),
 * élimination des 5 voltigeurs d'escorte par ricochet au bouclier de chitine, piratage du bus CAN
 * (500 kbps) par la prise dorsale de Thia et mise en portefeuille à 75° libérant 3 pods de faune.
 */
export class PredatorBadlands2025WeylandHarvesterCrawlerConvoySector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_WY_HARVESTER_CRAWLER_CONVOY';
    this.filmReference = 'Predator: Badlands (2025) - Weyland-Yutani WY-AT800 Bio-Harvester Crawler Hijack';
    this.crawlerModel = 'WY-AT800_SPECIMEN_TRANSPORT';
    this.reset();
  }

  reset() {
    this.boardedCrawlerBogie = false;
    this.crawlerSpeedKmh = 0;
    this.outridersCleared = false;
    this.outridersNeutralized = 0;
    this.steeringBusHotwired = false;
    this.crawlerJackknifed = false;
    this.rescuedMegafaunaPods = 0;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  grappleOntoCrawlerTreadBogie({
    crawlerSpeedKmh = 58,
    grappleTensionNewtons = 4800
  } = {}) {
    this.crawlerSpeedKmh = Math.max(0, Number(crawlerSpeedKmh) || 0);
    const tension = Math.max(0, Number(grappleTensionNewtons) || 0);
    this.boardedCrawlerBogie = this.crawlerSpeedKmh >= 45 && tension >= 4000;
    this.eventLog.push({
      step: 'CRAWLER_TREAD_BOGIE_BOARDED',
      crawlerSpeedKmh: this.crawlerSpeedKmh,
      grappleTensionNewtons: tension,
      boardedCrawlerBogie: this.boardedCrawlerBogie
    });
    return {
      boardedCrawlerBogie: this.boardedCrawlerBogie,
      crawlerSpeedKmh: this.crawlerSpeedKmh
    };
  }

  clearExteriorOutriderEscort({
    outridersNeutralized = 5,
    chitinShieldRicochetUsed = true
  } = {}) {
    if (!this.boardedCrawlerBogie) {
      throw new Error('Must grapple onto the crawler tread bogie before clearing the exterior outrider escort.');
    }
    this.outridersNeutralized = Math.max(0, Math.floor(Number(outridersNeutralized) || 0));
    this.outridersCleared =
      this.outridersNeutralized >= 4 && Boolean(chitinShieldRicochetUsed);
    this.eventLog.push({
      step: 'EXTERIOR_OUTRIDERS_CLEARED',
      outridersNeutralized: this.outridersNeutralized,
      chitinShieldRicochetUsed: Boolean(chitinShieldRicochetUsed),
      outridersCleared: this.outridersCleared
    });
    return {
      outridersCleared: this.outridersCleared,
      outridersNeutralized: this.outridersNeutralized
    };
  }

  thiaHotwireCrawlerSteeringBus({
    canBusBaudRate = 500000,
    brakeLineLocked = true
  } = {}) {
    if (!this.outridersCleared) {
      throw new Error('Exterior outrider escort must be cleared before Thia can hotwire the crawler CAN-bus.');
    }
    const baud = Math.max(0, Number(canBusBaudRate) || 0);
    this.steeringBusHotwired = baud >= 250000 && Boolean(brakeLineLocked);
    this.eventLog.push({
      step: 'CRAWLER_STEERING_BUS_HOTWIRED',
      canBusBaudRate: baud,
      steeringBusHotwired: this.steeringBusHotwired
    });
    return {
      steeringBusHotwired: this.steeringBusHotwired,
      canBusBaudRate: baud
    };
  }

  jackknifeCrawlerIntoBasaltRavine({
    skidAngleDegrees = 75,
    rescuedMegafaunaPods = 3
  } = {}) {
    if (!this.steeringBusHotwired) {
      throw new Error('Crawler steering bus must be hotwired before jackknifing the convoy into the basalt ravine.');
    }
    const angle = Math.max(0, Number(skidAngleDegrees) || 0);
    this.rescuedMegafaunaPods = Math.max(0, Math.floor(Number(rescuedMegafaunaPods) || 0));
    this.crawlerJackknifed = angle >= 60 && this.rescuedMegafaunaPods >= 3;
    if (this.crawlerJackknifed) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CRAWLER_JACKKNIFED_AND_PODS_FREED',
      skidAngleDegrees: angle,
      rescuedMegafaunaPods: this.rescuedMegafaunaPods,
      crawlerJackknifed: this.crawlerJackknifed,
      honorAwarded: this.honorAwarded
    });
    return {
      crawlerJackknifed: this.crawlerJackknifed,
      rescuedMegafaunaPods: this.rescuedMegafaunaPods,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      boardedCrawlerBogie: this.boardedCrawlerBogie,
      outridersCleared: this.outridersCleared,
      steeringBusHotwired: this.steeringBusHotwired,
      crawlerJackknifed: this.crawlerJackknifed,
      rescuedMegafaunaPods: this.rescuedMegafaunaPods,
      honorAwarded: this.honorAwarded
    };
  }
}
