/**
 * KillerOfKillers1942WildcatAerialDogfightSector.js
 *
 * Chantier de Level Design 3 (v194) - Predator: Killer of Killers (2025)
 * Segment 3: "The Bullet" - 1942 North African Aerial Dogfight
 * 1:1 Canonical Level Design:
 * - High-altitude dogfight at 6,500m over the 1942 North African theater among dense cumulonimbus clouds.
 * - US Navy fighter pilot John Torres in a weathered Grumman F4F Wildcat with Pratt & Whitney R-1830 radial engine.
 * - Six synchronized .50 caliber Browning M2 machine guns spitting lead armor-piercing tracers (850 rounds/min).
 * - High-speed pursuit of an anomalous cloaked Yautja scout fighter ("Ghost Interceptor") decloaking through cloud mist and tracer fire.
 */

export class KillerOfKillers1942WildcatAerialDogfightSector {
  /**
   * @param {Object} options
   * @param {number} [options.flightAltitudeM=6500.0] Altitude de vol du combat aérien (m)
   * @param {number} [options.airspeedKnots=265.0] Vitesse de vol du F4F Wildcat (nœuds)
   * @param {number} [options.fiftyCalAmmoRounds=1800] Réserve de munitions calibre .50 (cartouches)
   */
  constructor(options = {}) {
    this.flightAltitudeM = options.flightAltitudeM ?? 6500.0;
    this.airspeedKnots = options.airspeedKnots ?? 265.0;
    this.fiftyCalAmmoRounds = options.fiftyCalAmmoRounds ?? 1800;

    // État runtime
    this.cumulonimbusCloudEntered = false;
    this.machineGunBurstDischarged = false;
    this.yautjaScoutShipDecloaked = false;
    this.highGBarrelRollExecuted = false;
    this.alienRepulsorDriveDamaged = false;
  }

  /**
   * Plonger dans la couverture nuageuse de cumulonimbus pour échapper au verrouillage plasma
   */
  diveIntoCumulonimbusCloudDeck() {
    this.cumulonimbusCloudEntered = true;

    return {
      status: 'CUMULONIMBUS_CLOUD_DECK_ENTERED',
      altitudeM: this.flightAltitudeM,
      cloudDensityPct: 88.0,
      frostOnCanopyThicknessMm: 1.8,
      plasmaLockBroken: true,
      radialEngineRpm: 2700.0
    };
  }

  /**
   * Tirer une rafale saturante des six mitrailleuses Browning M2 calibre .50
   * @param {number} burstDurationSec Durée de la rafale (secondes)
   */
  fireSynchronizedFiftyCalBurst(burstDurationSec = 2.0) {
    const roundsFired = Math.min(this.fiftyCalAmmoRounds, Math.round(burstDurationSec * (6 * (850 / 60))));
    this.fiftyCalAmmoRounds -= roundsFired;
    this.machineGunBurstDischarged = true;

    return {
      status: 'SYNCHRONIZED_FIFTY_CAL_BURST_DISCHARGED',
      roundsFired,
      roundsRemaining: this.fiftyCalAmmoRounds,
      muzzleVelocityMps: 890.0,
      tracerLeadStreamRevealingWake: true
    };
  }

  /**
   * Démasquer le vaisseau chasseur Yautja camouflé par l'impact des balles traçantes
   */
  decloakYautjaScoutInterceptor() {
    if (!this.machineGunBurstDischarged) {
      return { status: 'FAILED_NO_TRACER_LINE_ESTABLISHED', success: false };
    }

    this.yautjaScoutShipDecloaked = true;

    return {
      status: 'YAUTJA_SCOUT_INTERCEPTOR_DECLOAKED',
      hullOpticalCamouflageShattered: true,
      alienBiomorphicAlloyExposed: true,
      triPlasmaNacellesVisible: true
    };
  }

  /**
   * Exécuter un tonneau barriqué sous fort facteur de charge (+5.5 G) et perforer les répulseurs aliens
   */
  executeHighGBarrelRollAndStrafingRun() {
    if (!this.yautjaScoutShipDecloaked) {
      return { status: 'FAILED_TARGET_NOT_ACQUIRED', success: false };
    }

    this.highGBarrelRollExecuted = true;
    this.alienRepulsorDriveDamaged = true;

    return {
      status: 'HIGH_G_BARREL_ROLL_AND_STRAFING_RUN_EXECUTED',
      gForcePulled: 5.5,
      alienRepulsorPunctured: true,
      interceptorForcedDown: true,
      honorScoreGranted: 400
    };
  }
}
