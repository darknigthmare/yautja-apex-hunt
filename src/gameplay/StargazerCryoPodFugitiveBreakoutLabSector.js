/**
 * StargazerCryoPodFugitiveBreakoutLabSector.js
 * Chantier 9 (v152) : Capsule de stase du laboratoire Stargazer & évasion furieuse du Fugitive Predator (The Predator 2018).
 * Salle blanche d'examen biologique du Projet Stargazer :
 * - Le Fugitive Predator se réveille pendant le scan, arrache ses sangles de contention métalliques,
 *   neutralise les gardes armés à mains nues avant de récupérer son gantelet et son bio-masque.
 * - Déclenche les sirènes de confinement et le verrouillage partiel des sas du laboratoire.
 */

export class StargazerCryoPodFugitiveBreakoutLabSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'stargazer_cryo_examination_lab';
    this.restraintStrength = options.restraintStrength ?? 100;

    this.state = {
      restraintsShattered: false,
      containmentBreachAlarmActive: false,
      wristGauntletRecovered: false,
      guardsNeutralizedCount: 0
    };
  }

  shatterCryoRestraintsAndBreakOut(labGuards = [], audioSynthesizer = null) {
    this.state.restraintsShattered = true;
    this.state.containmentBreachAlarmActive = true;
    this.state.wristGauntletRecovered = true;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playStargazerCryoPodRestraintShatter === 'function') {
        audioSynthesizer.playStargazerCryoPodRestraintShatter(1.15);
      }
      if (typeof audioSynthesizer.playLabContainmentBreachKlaxonSiren === 'function') {
        audioSynthesizer.playLabContainmentBreachKlaxonSiren(1.0);
      }
    }

    const neutralizedIds = [];
    for (const guard of labGuards) {
      guard.health = 0;
      guard.disarmedByFugitive = true;
      neutralizedIds.push(guard.id ?? 'lab_guard');
      this.state.guardsNeutralizedCount += 1;
    }

    return {
      brokeOut: true,
      restraintsShattered: true,
      wristGauntletRecovered: true,
      containmentBreachAlarmActive: true,
      neutralizedIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      restraintsShattered: this.state.restraintsShattered,
      containmentBreachAlarmActive: this.state.containmentBreachAlarmActive,
      wristGauntletRecovered: this.state.wristGauntletRecovered,
      guardsNeutralizedCount: this.state.guardsNeutralizedCount
    };
  }
}
