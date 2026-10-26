/**
 * Chantier 1 (v203) : Briefing du Général Phillips, Poignée de Bras Dutch/Dillon & Camion Enflammé (Predator - 1987)
 * Complète en fidélité 1:1 l'ouverture militaire de Predator (1987) : poignée de bras aérienne
 * iconique entre Dutch et Dillon (1 450 N, « Dillon! You son of a bitch! ») au QG du général Homer
 * Phillips, lancement du camion diesel enflammé à 46 km/h contre le mirador rebelle, levage du
 * pick-up Toyota (1 650 kg) sur béquille par Dutch et salve de 6 grenades de Poncho (« Knock, knock! »).
 */
export class Predator1987ValVerdeGeneralPhillipsBriefingAndGuerrillaTruckSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_PHILLIPS_BRIEFING_AND_GUERRILLA_TRUCK_BREACH';
    this.filmReference = 'Predator (1987) - Dutch/Dillon Arm-Wrestle, Flaming Cargo Truck & Knock-Knock Breach';
    this.reset();
  }

  reset() {
    this.dutchDillonArmWrestleCompleted = false;
    this.flamingTruckLaunched = false;
    this.watchtowerCollapsed = false;
    this.pickupTruckDroppedOnGuerrillas = false;
    this.commandCabinBreachedWithGrenades = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  completeDutchAndDillonArmWrestleBriefing({
    gripForceNewtons = 1450,
    ciaMissionAccepted = true
  } = {}) {
    const force = Math.max(0, Number(gripForceNewtons) || 0);
    this.dutchDillonArmWrestleCompleted =
      force >= 1200 && Boolean(ciaMissionAccepted);
    this.eventLog.push({
      step: 'DUTCH_DILLON_ARM_WRESTLE_BRIEFING',
      gripForceNewtons: force,
      dutchDillonArmWrestleCompleted: this.dutchDillonArmWrestleCompleted
    });
    return {
      dutchDillonArmWrestleCompleted: this.dutchDillonArmWrestleCompleted,
      gripForceNewtons: force
    };
  }

  launchFlamingDieselTruckIntoWatchtower({
    truckSpeedKmh = 46,
    watchtowerCollapsed = true
  } = {}) {
    if (!this.dutchDillonArmWrestleCompleted) {
      throw new Error('General Phillips briefing must complete before launching the flaming diesel truck.');
    }
    const speed = Math.max(0, Number(truckSpeedKmh) || 0);
    this.watchtowerCollapsed = speed >= 35 && Boolean(watchtowerCollapsed);
    this.flamingTruckLaunched = this.watchtowerCollapsed;
    this.eventLog.push({
      step: 'FLAMING_DIESEL_TRUCK_WATCHTOWER_CRASH',
      truckSpeedKmh: speed,
      watchtowerCollapsed: this.watchtowerCollapsed
    });
    return {
      flamingTruckLaunched: this.flamingTruckLaunched,
      watchtowerCollapsed: this.watchtowerCollapsed
    };
  }

  hoistPickupTruckOnPoleJackAndDrop({
    liftedMassKg = 1650,
    guerrillasCrushed = 2
  } = {}) {
    if (!this.flamingTruckLaunched) {
      throw new Error('Flaming diesel truck must breach the perimeter before hoisting the pickup truck on the pole-jack.');
    }
    const mass = Math.max(0, Number(liftedMassKg) || 0);
    const crushed = Math.max(0, Math.floor(Number(guerrillasCrushed) || 0));
    this.pickupTruckDroppedOnGuerrillas = mass >= 1400 && crushed >= 2;
    this.eventLog.push({
      step: 'PICKUP_TRUCK_POLE_JACK_DROP',
      liftedMassKg: mass,
      guerrillasCrushed: crushed,
      pickupTruckDroppedOnGuerrillas: this.pickupTruckDroppedOnGuerrillas
    });
    return {
      pickupTruckDroppedOnGuerrillas: this.pickupTruckDroppedOnGuerrillas,
      guerrillasCrushed: crushed
    };
  }

  breachCommandCabinWithKnockKnockGrenadeVolley({
    grenadeRoundsFired = 6,
    intelligencePhotosCaptured = true
  } = {}) {
    if (!this.pickupTruckDroppedOnGuerrillas) {
      throw new Error('Yard perimeter must be cleared before breaching the command cabin with the 6-round grenade volley.');
    }
    const rounds = Math.max(0, Math.floor(Number(grenadeRoundsFired) || 0));
    this.commandCabinBreachedWithGrenades =
      rounds >= 6 && Boolean(intelligencePhotosCaptured);
    if (this.commandCabinBreachedWithGrenades) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'KNOCK_KNOCK_GRENADE_CABIN_BREACH',
      grenadeRoundsFired: rounds,
      commandCabinBreachedWithGrenades: this.commandCabinBreachedWithGrenades,
      honorAwarded: this.honorAwarded
    });
    return {
      commandCabinBreachedWithGrenades: this.commandCabinBreachedWithGrenades,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      dutchDillonArmWrestleCompleted: this.dutchDillonArmWrestleCompleted,
      flamingTruckLaunched: this.flamingTruckLaunched,
      pickupTruckDroppedOnGuerrillas: this.pickupTruckDroppedOnGuerrillas,
      commandCabinBreachedWithGrenades: this.commandCabinBreachedWithGrenades,
      honorAwarded: this.honorAwarded
    };
  }
}
