/**
 * HumanQaPredatorFranchiseUltimeSupremeApexHUDDirector (v234)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Ultime Suprême Apex (1987-2025).
 */
import { Predator1987ExplosiveBowDeadfallAmbushSector } from './Predator1987ExplosiveBowDeadfallAmbushSector.js';
import { Predator21990SkylightTackleCauterizationSector } from './Predator21990SkylightTackleCauterizationSector.js';
import { Avp2004IceShelfQueenWhalingChainSector } from './Avp2004IceShelfQueenWhalingChainSector.js';
import { AvpRequiem2007ShurikenWallRicochetChemicalSector } from './AvpRequiem2007ShurikenWallRicochetChemicalSector.js';
import { Predators2010RoyceMudDecoyUpgradeClashSector } from './Predators2010RoyceMudDecoyUpgradeClashSector.js';
import { Prey2022OrangeFlowerHypothermiaDiscTrapSector } from './Prey2022OrangeFlowerHypothermiaDiscTrapSector.js';
import { PredatorFranchiseUltimeSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchiseUltimeSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseUltimeSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987ExplosiveBowDeadfallAmbushSector(),
      predator21990: new Predator21990SkylightTackleCauterizationSector(),
      avp2004: new Avp2004IceShelfQueenWhalingChainSector(),
      avpRequiem2007: new AvpRequiem2007ShurikenWallRicochetChemicalSector(),
      predators2010: new Predators2010RoyceMudDecoyUpgradeClashSector(),
      prey2022: new Prey2022OrangeFlowerHypothermiaDiscTrapSector(),
      defeatProtocol: new PredatorFranchiseUltimeSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_ExplosiveBow_87', role: 'Bamboo Grenade Arrow & Deadfall Log Ambush Specialist', verified: true },
      { name: 'Harrigan_Medicomp_90', role: 'Penthouse Cornice Severance & Foam Cauterize Specialist', verified: true },
      { name: 'Scar_QueenChain_04', role: 'Ice Shelf Pursuit & Whaling Winch Abyss Plunge Specialist', verified: true },
      { name: 'Wolf_SmartShuriken_07', role: 'Banked Wall Ricochet & Blue Acid Dissolution Specialist', verified: true },
      { name: 'Naru_OrangeFlower_22', role: 'Hypothermic Flower & Helmet Laser Redirect Specialist', verified: true }
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
      version: 'v234',
      pantheon: 'Ultime Suprême Apex (1987-2025)',
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

    let panel = targetContainer.querySelector('.predator-franchise-v234-ultime-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v234-ultime-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="hud-header">
        <h3>PANTHÉON ULTIME SUPRÊME APEX (1987-2025)</h3>
        <span class="hud-status-badge ${telemetry.allCompleted ? 'completed' : 'in-progress'}">
          ${telemetry.allCompleted ? 'ULTIME_SANCTUM_MASTERED' : 'HUNT_IN_PROGRESS'}
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
