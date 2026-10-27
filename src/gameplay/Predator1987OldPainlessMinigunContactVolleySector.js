/**
 * Predator1987OldPainlessMinigunContactVolleySector (v206)
 *
 * Implements iconic 1:1 set-pieces from Predator (1987):
 * 1. Blain Cooper spinning up "Old Painless" (GE M134 Minigun, 3,000 RPM, 7.62x51mm NATO),
 *    defoliating the rainforest canopy and severing massive jungle branches.
 * 2. Mac Eliot discovering Blain's plasma chest cavity wound, screaming "CONTACT!" and triggering
 *    the entire squad to unleash an 8,500-round wall of lead that completely levels half an acre of rainforest.
 * 3. Inspecting the cauterized plasma burn wound left by the Jungle Hunter's plasmacaster.
 * 4. Regrouping the remaining squad at the riverbank extraction perimeter.
 */
export class Predator1987OldPainlessMinigunContactVolleySector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_OLD_PAINLESS_MINIGUN_CONTACT_VOLLEY';
    this.filmReference = 'Predator (1987) - Old Painless 3,000 RPM Defoliation & "Contact!" Jungle Wall of Lead';
    this.reset();
  }

  reset() {
    this.oldPainlessSpunUpAndDefoliated = false;
    this.macContactVolleyExecuted = false;
    this.blainPlasmaWoundInspected = false;
    this.squadRegroupedAtPerimeter = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  spinUpOldPainlessMinigunAndDefoliateCanopy({
    rpmRate = 3000,
    roundsFired = 1200
  } = {}) {
    const rpm = Math.max(0, Number(rpmRate) || 0);
    const rounds = Math.max(0, Math.floor(Number(roundsFired) || 0));
    this.oldPainlessSpunUpAndDefoliated = rpm >= 2800 && rounds >= 1000;
    this.eventLog.push({
      step: 'OLD_PAINLESS_SPUN_UP_AND_DEFOLIATED',
      rpmRate: rpm,
      roundsFired: rounds,
      oldPainlessSpunUpAndDefoliated: this.oldPainlessSpunUpAndDefoliated
    });
    return {
      oldPainlessSpunUpAndDefoliated: this.oldPainlessSpunUpAndDefoliated,
      rpmRate: rpm,
      roundsFired: rounds
    };
  }

  executeMacContactJungleWallOfLeadVolley({
    squadRoundsExpended = 8500,
    jungleAcreMowedPercent = 95
  } = {}) {
    if (!this.oldPainlessSpunUpAndDefoliated) {
      throw new Error('Old Painless initial volley must precede the full squad Contact! barrage.');
    }
    const rounds = Math.max(0, Math.floor(Number(squadRoundsExpended) || 0));
    const percent = Math.max(0, Number(jungleAcreMowedPercent) || 0);
    this.macContactVolleyExecuted = rounds >= 7000 && percent >= 85;
    this.eventLog.push({
      step: 'MAC_CONTACT_VOLLEY_EXECUTED',
      squadRoundsExpended: rounds,
      jungleAcreMowedPercent: percent,
      macContactVolleyExecuted: this.macContactVolleyExecuted
    });
    return {
      macContactVolleyExecuted: this.macContactVolleyExecuted,
      squadRoundsExpended: rounds
    };
  }

  inspectBlainPlasmaChestCavityWound({
    plasmaBurnRadiusCm = 18,
    cauterizedWoundVerified = true
  } = {}) {
    if (!this.macContactVolleyExecuted) {
      throw new Error('Squad must conclude the Contact! barrage before inspecting Blain.');
    }
    const radius = Math.max(0, Number(plasmaBurnRadiusCm) || 0);
    this.blainPlasmaWoundInspected = radius >= 15 && Boolean(cauterizedWoundVerified);
    this.eventLog.push({
      step: 'BLAIN_PLASMA_WOUND_INSPECTED',
      plasmaBurnRadiusCm: radius,
      blainPlasmaWoundInspected: this.blainPlasmaWoundInspected
    });
    return {
      blainPlasmaWoundInspected: this.blainPlasmaWoundInspected,
      plasmaBurnRadiusCm: radius
    };
  }

  regroupSquadAtRiverbankExtractionPerimeter({
    survivorsRegrouped = 5,
    perimeterSecured = true
  } = {}) {
    if (!this.blainPlasmaWoundInspected) {
      throw new Error('Casualty inspection must conclude before regrouping at river perimeter.');
    }
    const count = Math.max(0, Math.floor(Number(survivorsRegrouped) || 0));
    this.squadRegroupedAtPerimeter = count >= 4 && Boolean(perimeterSecured);
    if (this.squadRegroupedAtPerimeter) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'SQUAD_REGROUPED_AT_PERIMETER',
      survivorsRegrouped: count,
      squadRegroupedAtPerimeter: this.squadRegroupedAtPerimeter,
      honorAwarded: this.honorAwarded
    });
    return {
      squadRegroupedAtPerimeter: this.squadRegroupedAtPerimeter,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      oldPainlessSpunUpAndDefoliated: this.oldPainlessSpunUpAndDefoliated,
      macContactVolleyExecuted: this.macContactVolleyExecuted,
      blainPlasmaWoundInspected: this.blainPlasmaWoundInspected,
      squadRegroupedAtPerimeter: this.squadRegroupedAtPerimeter,
      honorAwarded: this.honorAwarded
    };
  }
}
