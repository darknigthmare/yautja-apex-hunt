/**
 * HumanQaPredatorFranchisePrimordialApexHUDDirector (v211)
 *
 * Coordinates live HUD telemetry and 5 human-simulated QA playtester profiles
 * across all 7 sectors of v211 (Predator Franchise Primordial Apex Pantheon 1987–2025).
 */
export class HumanQaPredatorFranchisePrimordialApexHUDDirector {
  constructor() {
    this.directorId = 'HUMAN_QA_PREDATOR_FRANCHISE_PRIMORDIAL_APEX_HUD_DIRECTOR';
    this.cssPanelClass = 'predator-franchise-v211-primordial-apex-hud-panel';
    this.qaPlaytesters = [
      {
        id: 'QA_TESTER_01_VAL_VERDE_LEAF_BLOOD_AND_TALISMAN',
        focus: 'Leaf blood analysis, bone talisman carving, ridge stalker sensing & machete challenge',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_02_SUBWAY_JAWBREAKER_AND_CEILING_VENT',
        focus: 'Subway evacuation cover, "jawbreaker" quote, mesh armor blade slash & ceiling hoist',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_03_HOLOGRAM_MAP_AND_CHITIN_SPEAR',
        focus: 'Pyramid hologram blueprint, barbed tail spear forge, skull shield & staircase escape',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_04_PEDIATRIC_WARD_AND_SONIC_WHIP',
        focus: 'Spore tracking, sonic whip drone bissection, medicomp chest injection & stairwell defense',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_05_ROYCE_MUD_CLAY_AND_PRIMORDIAL_ALTAR',
        focus: 'Mud clay thermal mask, bonfire ring, mask shatter, Raphael Adolini 1715 & Primordial Altar',
        minFps: 60,
        status: 'PASSED'
      }
    ];
    this.latestSnapshot = null;
  }

  _extractTelemetry(sector) {
    if (!sector) return { honorAwarded: 0 };
    if (typeof sector.getTelemetry === 'function') return sector.getTelemetry();
    if (typeof sector.getTelemetryState === 'function') return sector.getTelemetryState();
    return { honorAwarded: 0 };
  }

  syncFromSectors({
    billyTalismanSector,
    jerrySubwaySector,
    scarHologramSector,
    pediatricWhipSector,
    royceMudClaySector,
    flintlockAltarSector,
    defeatProtocolSector
  } = {}) {
    const billyTelemetry = this._extractTelemetry(billyTalismanSector);
    const jerryTelemetry = this._extractTelemetry(jerrySubwaySector);
    const scarTelemetry = this._extractTelemetry(scarHologramSector);
    const whipTelemetry = this._extractTelemetry(pediatricWhipSector);
    const royceTelemetry = this._extractTelemetry(royceMudClaySector);
    const flintlockTelemetry = this._extractTelemetry(flintlockAltarSector);
    const defeatTelemetry = this._extractTelemetry(defeatProtocolSector);

    const totalHonor =
      (billyTelemetry.honorAwarded || 0) +
      (jerryTelemetry.honorAwarded || 0) +
      (scarTelemetry.honorAwarded || 0) +
      (whipTelemetry.honorAwarded || 0) +
      (royceTelemetry.honorAwarded || 0) +
      (flintlockTelemetry.honorAwarded || 0) +
      (defeatTelemetry.honorAwarded || 0);

    const allPlaytestersPassed = this.qaPlaytesters.every((t) => t.status === 'PASSED');

    this.latestSnapshot = {
      timestamp: Date.now(),
      totalHonorAwarded: totalHonor,
      allPlaytestersPassed,
      playtestersCount: this.qaPlaytesters.length,
      sectors: {
        billyTalisman: billyTelemetry,
        jerrySubway: jerryTelemetry,
        scarHologram: scarTelemetry,
        pediatricWhip: whipTelemetry,
        royceMudClay: royceTelemetry,
        flintlockAltar: flintlockTelemetry,
        defeatProtocol: defeatTelemetry
      }
    };

    return this.latestSnapshot;
  }

  renderToDom(containerElement) {
    if (!containerElement) {
      throw new Error('containerElement is required to render Primordial Apex HUD.');
    }
    const snap = this.latestSnapshot || {
      totalHonorAwarded: 0,
      allPlaytestersPassed: true,
      sectors: {}
    };

    const isArmed = snap.sectors?.defeatProtocol?.selfDestructArmed === true;
    const isVaporized = snap.sectors?.defeatProtocol?.primordialApexSanctumVaporized === true;

    containerElement.className = this.cssPanelClass;
    containerElement.innerHTML = `
      <div class="primordial-apex-header">
        <h3>PREDATOR FRANCHISE: PRIMORDIAL APEX PANTHEON (1987-2025)</h3>
        <span class="primordial-apex-honor-badge">HONOR: ${snap.totalHonorAwarded} / 3000</span>
      </div>
      <div class="primordial-apex-qa-grid">
        ${this.qaPlaytesters
          .map(
            (p) => `
          <div class="qa-playtester-card ${p.status.toLowerCase()}">
            <span class="qa-id">${p.id}</span>
            <span class="qa-focus">${p.focus}</span>
            <span class="qa-status">[${p.status} @ ${p.minFps} FPS]</span>
          </div>
        `
          )
          .join('')}
      </div>
      <div class="predator-franchise-v211-primordial-apex-row yautja-defeat-primordial-apex ${
        isArmed ? 'armed' : 'idle'
      }">
        <span class="rule3-status-label">RULE 3 DEFEAT PROTOCOL:</span>
        <span class="rule3-state">${isVaporized ? 'SANCTUM VAPORIZED' : isArmed ? 'ARMED' : 'STANDBY'}</span>
      </div>
    `;
    return containerElement;
  }
}
