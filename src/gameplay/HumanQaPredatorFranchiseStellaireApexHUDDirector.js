/**
 * HumanQaPredatorFranchiseStellaireApexHUDDirector (v218)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Stellaire Apex (1987-2025).
 */
import { Predator1987RiverMudSubmersionAndReedBreathingSector } from './Predator1987RiverMudSubmersionAndReedBreathingSector.js';
import { Predator21990SubwayStrobeMassacreAndJerryStandoffSector } from './Predator21990SubwayStrobeMassacreAndJerryStandoffSector.js';
import { Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector } from './Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector.js';
import { AvpRequiem2007LaserTripwirePerimeterAndPowerGridClashSector } from './AvpRequiem2007LaserTripwirePerimeterAndPowerGridClashSector.js';
import { Predators2010WaterfallCliffLeapAndHellHoundBottleneckSector } from './Predators2010WaterfallCliffLeapAndHellHoundBottleneckSector.js';
import { Prey2022AshPrairieExpandingNetAndStellaireApexSanctumSector } from './Prey2022AshPrairieExpandingNetAndStellaireApexSanctumSector.js';
import { PredatorFranchiseStellaireApexYautjaDefeatProtocolSector } from './PredatorFranchiseStellaireApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseStellaireApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987RiverMudSubmersionAndReedBreathingSector(),
      predator21990: new Predator21990SubwayStrobeMassacreAndJerryStandoffSector(),
      avp2004: new Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector(),
      avpRequiem2007: new AvpRequiem2007LaserTripwirePerimeterAndPowerGridClashSector(),
      predators2010: new Predators2010WaterfallCliffLeapAndHellHoundBottleneckSector(),
      prey2022: new Prey2022AshPrairieExpandingNetAndStellaireApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseStellaireApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Commando_87', role: 'Cold Mud Thermal Camouflage Specialist', verified: true },
      { name: 'Harrigan_LAPD_90', role: 'Subway Emergency Tunnel Detective', verified: true },
      { name: 'Lex_Woods_04', role: 'Pyramid Winch Sled Navigator', verified: true },
      { name: 'Wolf_Cleaner_07', role: 'Triangular Laser Grid Engineer', verified: true },
      { name: 'Naru_Comanche_22', role: 'Comanche Prairie Stalker', verified: true }
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
      version: 'v218',
      pantheon: 'Stellaire Apex (1987-2025)',
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
          honor: this.sectors.defeatProtocol.honorAwarded,
          rule3Strict: true
        }
      },
      playtestersVerified: this.playtesters.every(p => p.verified)
    };
  }

  renderToDom(containerElement) {
    if (!containerElement) return null;
    const snap = this.getTelemetrySnapshot();
    containerElement.className = 'predator-franchise-v218-stellaire-apex-hud-panel';
    containerElement.innerHTML = `
      <div class="stellaire-apex-header">
        <h3>PANTHÉON STELLAIRE APEX (1987-2025) — v218</h3>
        <span class="stellaire-honor-score">HONOR: ${snap.totalHonor} / 3000</span>
      </div>
      <div class="stellaire-sectors-grid">
        <div class="sector-badge ${snap.sectors.predator1987.completed ? 'done' : ''}">P1987: River Mud Reed Submersion (+350)</div>
        <div class="sector-badge ${snap.sectors.predator21990.completed ? 'done' : ''}">P2 1990: Subway Strobe Standoff (+400)</div>
        <div class="sector-badge ${snap.sectors.avp2004.completed ? 'done' : ''}">AVP 2004: Matriarch Sled Escape (+400)</div>
        <div class="sector-badge ${snap.sectors.avpRequiem2007.completed ? 'done' : ''}">AVPR 2007: Laser Grid Power Clash (+400)</div>
        <div class="sector-badge ${snap.sectors.predators2010.completed ? 'done' : ''}">P2010: Waterfall Cliff Bottleneck (+450)</div>
        <div class="sector-badge ${snap.sectors.prey2022.completed ? 'done' : ''}">PREY 2022: Expanding Net Sanctum (+500)</div>
        <div class="sector-badge rule3 ${snap.sectors.defeatProtocol.completed ? 'done' : ''}">RULE 3: Stellaire Self-Destruct (+500)</div>
      </div>
      <div class="qa-playtesters-summary">
        <h4>QA Playtesters Validation</h4>
        <ul>
          ${this.playtesters.map(p => `<li>${p.name} (${p.role}): ${p.verified ? 'CERTIFIED' : 'PENDING'}</li>`).join('')}
        </ul>
      </div>
    `;
    this.hudElement = containerElement;
    return containerElement;
  }

  render(container = this.container) {
    if (!container) return null;
    if (typeof document !== 'undefined' && document.createElement) {
      const panel = document.createElement('div');
      panel.className = 'predator-franchise-v218-stellaire-apex-hud-panel';
      this.renderToDom(panel);
      container.appendChild(panel);
      this.hudElement = panel;
      return panel;
    }
    return this.renderToDom(container);
  }

  destroy() {
    if (this.hudElement && this.hudElement.parentNode) {
      this.hudElement.parentNode.removeChild(this.hudElement);
    }
    this.hudElement = null;
  }
}
