/**
 * HumanQaPredatorFranchiseZenithSupremeApexHUDDirector (v232)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Zénith Suprême Apex (1987-2025).
 */
import { Predator1987MudHeatDissipationTorchStandoffSector } from './Predator1987MudHeatDissipationTorchStandoffSector.js';
import { Predator21990SlaughterhouseNitrogenHalonSector } from './Predator21990SlaughterhouseNitrogenHalonSector.js';
import { Avp2004AltarAcidSpectrumMatrixSector } from './Avp2004AltarAcidSpectrumMatrixSector.js';
import { AvpRequiem2007RooftopFlareStandoffSector } from './AvpRequiem2007RooftopFlareStandoffSector.js';
import { Predators2010CampCageTrapEmissarySector } from './Predators2010CampCageTrapEmissarySector.js';
import { Prey2022BearTrapKineticShieldBadlandsSector } from './Prey2022BearTrapKineticShieldBadlandsSector.js';
import { PredatorFranchiseZenithSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchiseZenithSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseZenithSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987MudHeatDissipationTorchStandoffSector(),
      predator21990: new Predator21990SlaughterhouseNitrogenHalonSector(),
      avp2004: new Avp2004AltarAcidSpectrumMatrixSector(),
      avpRequiem2007: new AvpRequiem2007RooftopFlareStandoffSector(),
      predators2010: new Predators2010CampCageTrapEmissarySector(),
      prey2022: new Prey2022BearTrapKineticShieldBadlandsSector(),
      defeatProtocol: new PredatorFranchiseZenithSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_MudDecoy_87', role: 'Riverbed Mud Cooling & Bonfire Perimeter Specialist', verified: true },
      { name: 'Keyes_CryoSprinkler_90', role: 'Meat Locker Nitrogen Freeze & UV Valve Rupture Specialist', verified: true },
      { name: 'Lex_BloodSigil_04', role: 'Sacrificial Altar & Acidic Neuro-Electric Tracking Specialist', verified: true },
      { name: 'Wolf_FlareHelipad_07', role: 'Rooftop Magnesium Flare & Tail Parry Specialist', verified: true },
      { name: 'Naru_KineticShield_22', role: 'Bear Trap Wrench & Kinetic Bone Shield Specialist', verified: true }
    ];
  }

  calculateTotalHonor() {
    return Object.values(this.sectors).reduce((acc, s) => acc + (s.honorAwarded || 0), 0);
  }

  isAllSectorsCompleted() {
    return Object.values(this.sectors).every(s => s.isFullyCompleted());
  }

  getTelemetrySnapshot() {
    return {
      version: 'v232',
      pantheon: 'Zénith Suprême Apex (1987-2025)',
      totalHonor: this.calculateTotalHonor(),
      allCompleted: this.isAllSectorsCompleted(),
      sectors: {
        predator1987: {
          completed: this.sectors.predator1987.isFullyCompleted(),
          honor: this.sectors.predator1987.honorAwarded
        },
        predator21990: {
          completed: this.sectors.predator21990.isFullyCompleted(),
          honor: this.sectors.predator21990.honorAwarded
        },
        avp2004: {
          completed: this.sectors.avp2004.isFullyCompleted(),
          honor: this.sectors.avp2004.honorAwarded
        },
        avpRequiem2007: {
          completed: this.sectors.avpRequiem2007.isFullyCompleted(),
          honor: this.sectors.avpRequiem2007.honorAwarded
        },
        predators2010: {
          completed: this.sectors.predators2010.isFullyCompleted(),
          honor: this.sectors.predators2010.honorAwarded
        },
        prey2022: {
          completed: this.sectors.prey2022.isFullyCompleted(),
          honor: this.sectors.prey2022.honorAwarded
        },
        defeatProtocol: {
          completed: this.sectors.defeatProtocol.isFullyCompleted(),
          honor: this.sectors.defeatProtocol.honorAwarded
        }
      },
      playtesters: this.playtesters
    };
  }

  render(container = null) {
    const targetContainer = container || this.container;
    if (typeof document === 'undefined') {
      return { rendered: false, reason: 'DOM environment not present (Node SSR safe).' };
    }

    if (!targetContainer) {
      return { rendered: false, reason: 'No DOM container provided.' };
    }

    let panel = targetContainer.querySelector('.predator-franchise-v232-zenith-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v232-zenith-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="hud-header">
        <h3>PANTHÉON ZÉNITH SUPRÊME APEX (1987-2025)</h3>
        <span class="hud-status-badge ${telemetry.allCompleted ? 'completed' : 'in-progress'}">
          ${telemetry.allCompleted ? 'ZENITH_SANCTUM_MASTERED' : 'HUNT_IN_PROGRESS'}
        </span>
      </div>
      <div class="hud-telemetry">
        <div class="telemetry-item">Total Honor: <strong>${telemetry.totalHonor}</strong> / 3000</div>
        <div class="telemetry-item">All 7 Sectors Cleared: <strong>${telemetry.allCompleted}</strong></div>
        <div class="telemetry-item">Rule 3 Defeat Purge: <strong>${telemetry.sectors.defeatProtocol.completed ? 'CONSECRATED' : 'READY'}</strong></div>
      </div>
      <div class="hud-playtesters">
        <h4>ELITE QA PLAYTESTERS</h4>
        <ul>
          ${this.playtesters.map(pt => `<li><strong>${pt.name}</strong> - <em>${pt.role}</em> [${pt.verified ? 'PASSED' : 'PENDING'}]</li>`).join('')}
        </ul>
      </div>
    `;

    this.hudElement = panel;
    return {
      rendered: true,
      element: panel,
      telemetry
    };
  }

  mountHUD(container = null) {
    return this.render(container);
  }

  unmountHUD() {
    if (this.hudElement && this.hudElement.parentNode) {
      this.hudElement.parentNode.removeChild(this.hudElement);
      this.hudElement = null;
    }
  }
}
