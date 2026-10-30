/**
 * HumanQaPredatorFranchiseDivinSupremeApexHUDDirector (v235)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Divin Suprême Apex (1987-2025).
 */
import { Predator1987OldPainlessCanopyDefoliationSector } from './Predator1987OldPainlessCanopyDefoliationSector.js';
import { Predator21990SmartDiscMeleeBuzzsawSector } from './Predator21990SmartDiscMeleeBuzzsawSector.js';
import { Avp2004LexXenoChitinShieldForgeSector } from './Avp2004LexXenoChitinShieldForgeSector.js';
import { AvpRequiem2007LaserMeshTripwireSector } from './AvpRequiem2007LaserMeshTripwireSector.js';
import { Predators2010PredatorKillerNanotechSuitSector } from './Predators2010PredatorKillerNanotechSuitSector.js';
import { Prey2022FlechetteCrossboltVoyageurSector } from './Prey2022FlechetteCrossboltVoyageurSector.js';
import { PredatorFranchiseDivinSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchiseDivinSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseDivinSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987OldPainlessCanopyDefoliationSector(),
      predator21990: new Predator21990SmartDiscMeleeBuzzsawSector(),
      avp2004: new Avp2004LexXenoChitinShieldForgeSector(),
      avpRequiem2007: new AvpRequiem2007LaserMeshTripwireSector(),
      predators2010: new Predators2010PredatorKillerNanotechSuitSector(),
      prey2022: new Prey2022FlechetteCrossboltVoyageurSector(),
      defeatProtocol: new PredatorFranchiseDivinSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Mac_OldPainless_87', role: 'Blood Fern Tracking & Minigun Defoliation Specialist', verified: true },
      { name: 'Harrigan_Buzzsaw_90', role: 'Mother Ship Catwalk & Smart Disc Melee Specialist', verified: true },
      { name: 'Lex_ChitinShield_04', role: 'Pyramid Forge & Xenomorph Cranial Shield Specialist', verified: true },
      { name: 'Wolf_PoolLaserMesh_07', role: 'Pool Dome Breach & Quad Laser Tripmine Specialist', verified: true },
      { name: 'Fugitive_NanotechSuit_18', role: 'Stargazer Vault & Predator Killer Exosuit Specialist', verified: true }
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
      version: 'v235',
      pantheon: 'Divin Suprême Apex (1987-2025)',
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

    let panel = targetContainer.querySelector('.predator-franchise-v235-divin-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v235-divin-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="hud-header">
        <h3>PANTHÉON DIVIN SUPRÊME APEX (1987-2025)</h3>
        <span class="hud-status-badge ${telemetry.allCompleted ? 'completed' : 'in-progress'}">
          ${telemetry.allCompleted ? 'DIVIN_SANCTUM_MASTERED' : 'HUNT_IN_PROGRESS'}
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
