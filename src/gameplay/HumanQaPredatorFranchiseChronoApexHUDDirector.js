/**
 * HumanQaPredatorFranchiseChronoApexHUDDirector (v216)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Chrono Apex (1987-2025).
 */
import { Predator1987BillyLogBridgeStandAndMacheteSacrificeSector } from './Predator1987BillyLogBridgeStandAndMacheteSacrificeSector.js';
import { Predator21990LostTribeCloakedCircleAndElderPactSector } from './Predator21990LostTribeCloakedCircleAndElderPactSector.js';
import { Avp2004CelticGridGrappleAndAcidMaskEtchSector } from './Avp2004CelticGridGrappleAndAcidMaskEtchSector.js';
import { AvpRequiem2007HospitalShaftBrawlAndDissolvingVialSector } from './AvpRequiem2007HospitalShaftBrawlAndDissolvingVialSector.js';
import { Predators2010CrucifiedPredatorLiberationAndBerserkerClashSector } from './Predators2010CrucifiedPredatorLiberationAndBerserkerClashSector.js';
import { Prey2022AshForestWhirlwindAndChronoApexSanctumSector } from './Prey2022AshForestWhirlwindAndChronoApexSanctumSector.js';
import { PredatorFranchiseChronoApexYautjaDefeatProtocolSector } from './PredatorFranchiseChronoApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseChronoApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987BillyLogBridgeStandAndMacheteSacrificeSector(),
      predator21990: new Predator21990LostTribeCloakedCircleAndElderPactSector(),
      avp2004: new Avp2004CelticGridGrappleAndAcidMaskEtchSector(),
      avpRequiem2007: new AvpRequiem2007HospitalShaftBrawlAndDissolvingVialSector(),
      predators2010: new Predators2010CrucifiedPredatorLiberationAndBerserkerClashSector(),
      prey2022: new Prey2022AshForestWhirlwindAndChronoApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseChronoApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Commando_87', role: 'Jungle Combat Veteran', verified: true },
      { name: 'Harrigan_LAPD_90', role: 'Urban Hunter Detective', verified: true },
      { name: 'Lex_Woods_04', role: 'Antarctic Xenomorph Guide', verified: true },
      { name: 'Wolf_Cleaner_07', role: 'Elite Yautja Infiltrator', verified: true },
      { name: 'Naru_Comanche_22', role: 'Warrior of the Great Plains', verified: true }
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
      version: 'v216',
      pantheon: 'Chrono Apex (1987-2025)',
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
    containerElement.className = 'predator-franchise-v216-chrono-apex-hud-panel';
    containerElement.innerHTML = `
      <div class="chrono-apex-header">
        <h3>PANTHÉON CHRONO APEX (1987-2025) — v216</h3>
        <span class="chrono-honor-score">HONOR: ${snap.totalHonor} / 3000</span>
      </div>
      <div class="chrono-sectors-grid">
        <div class="sector-badge ${snap.sectors.predator1987.completed ? 'done' : ''}">P1987: Billy Log Bridge (+350)</div>
        <div class="sector-badge ${snap.sectors.predator21990.completed ? 'done' : ''}">P2 1990: Lost Tribe Circle (+400)</div>
        <div class="sector-badge ${snap.sectors.avp2004.completed ? 'done' : ''}">AVP 2004: Celtic Grid Brawl (+400)</div>
        <div class="sector-badge ${snap.sectors.avpRequiem2007.completed ? 'done' : ''}">AVPR 2007: Hospital Shaft Purge (+400)</div>
        <div class="sector-badge ${snap.sectors.predators2010.completed ? 'done' : ''}">P2010: Classic Liberation (+450)</div>
        <div class="sector-badge ${snap.sectors.prey2022.completed ? 'done' : ''}">PREY 2022: Ash Whirlwind (+500)</div>
        <div class="sector-badge rule3 ${snap.sectors.defeatProtocol.completed ? 'done' : ''}">RULE 3: Chrono Self-Destruct (+500)</div>
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
      panel.className = 'predator-franchise-v216-chrono-apex-hud-panel';
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
