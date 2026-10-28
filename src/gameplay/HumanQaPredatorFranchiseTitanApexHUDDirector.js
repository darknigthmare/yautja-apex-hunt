/**
 * HumanQaPredatorFranchiseTitanApexHUDDirector (v217)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Titan Apex (1987-2025).
 */
import { Predator1987CanopyMedicompShriekAndCauterizationSector } from './Predator1987CanopyMedicompShriekAndCauterizationSector.js';
import { Predator21990SlaughterhouseNitrogenTrapAndMultispectralShiftSector } from './Predator21990SlaughterhouseNitrogenTrapAndMultispectralShiftSector.js';
import { Avp2004SarcophagusCasterTheftAndAcidClanMarkSector } from './Avp2004SarcophagusCasterTheftAndAcidClanMarkSector.js';
import { AvpRequiem2007ScoutShipPurgeAndDualPistolConvergenceSector } from './AvpRequiem2007ScoutShipPurgeAndDualPistolConvergenceSector.js';
import { Predators2010AncientDeadfallTrapAndStargazerBreachSector } from './Predators2010AncientDeadfallTrapAndStargazerBreachSector.js';
import { Prey2022GrizzlyBearBloodBathAndTetheredTomahawkSector } from './Prey2022GrizzlyBearBloodBathAndTetheredTomahawkSector.js';
import { PredatorFranchiseTitanApexYautjaDefeatProtocolSector } from './PredatorFranchiseTitanApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseTitanApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987CanopyMedicompShriekAndCauterizationSector(),
      predator21990: new Predator21990SlaughterhouseNitrogenTrapAndMultispectralShiftSector(),
      avp2004: new Avp2004SarcophagusCasterTheftAndAcidClanMarkSector(),
      avpRequiem2007: new AvpRequiem2007ScoutShipPurgeAndDualPistolConvergenceSector(),
      predators2010: new Predators2010AncientDeadfallTrapAndStargazerBreachSector(),
      prey2022: new Prey2022GrizzlyBearBloodBathAndTetheredTomahawkSector(),
      defeatProtocol: new PredatorFranchiseTitanApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Commando_87', role: 'Canopy Survivalist', verified: true },
      { name: 'Harrigan_LAPD_90', role: 'Slaughterhouse Tactician', verified: true },
      { name: 'Lex_Woods_04', role: 'Branded Xenomorph Slayer', verified: true },
      { name: 'Wolf_Cleaner_07', role: 'Master Cleaner Specialist', verified: true },
      { name: 'Naru_Comanche_22', role: 'Tethered Tomahawk Champion', verified: true }
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
      version: 'v217',
      pantheon: 'Titan Apex (1987-2025)',
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
    containerElement.className = 'predator-franchise-v217-titan-apex-hud-panel';
    containerElement.innerHTML = `
      <div class="titan-apex-header">
        <h3>PANTHÉON TITAN APEX (1987-2025) — v217</h3>
        <span class="titan-honor-score">HONOR: ${snap.totalHonor} / 3000</span>
      </div>
      <div class="titan-sectors-grid">
        <div class="sector-badge ${snap.sectors.predator1987.completed ? 'done' : ''}">P1987: Medicomp Shriek (+350)</div>
        <div class="sector-badge ${snap.sectors.predator21990.completed ? 'done' : ''}">P2 1990: Nitrogen UV Shift (+400)</div>
        <div class="sector-badge ${snap.sectors.avp2004.completed ? 'done' : ''}">AVP 2004: Acid Clan Mark (+400)</div>
        <div class="sector-badge ${snap.sectors.avpRequiem2007.completed ? 'done' : ''}">AVPR 2007: Scout Meltdown (+400)</div>
        <div class="sector-badge ${snap.sectors.predators2010.completed ? 'done' : ''}">P2010: Stargazer Breach (+450)</div>
        <div class="sector-badge ${snap.sectors.prey2022.completed ? 'done' : ''}">PREY 2022: Grizzly Blood Shower (+500)</div>
        <div class="sector-badge rule3 ${snap.sectors.defeatProtocol.completed ? 'done' : ''}">RULE 3: Titan Self-Destruct (+500)</div>
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
      panel.className = 'predator-franchise-v217-titan-apex-hud-panel';
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
