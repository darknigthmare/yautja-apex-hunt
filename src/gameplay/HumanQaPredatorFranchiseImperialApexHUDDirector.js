/**
 * HumanQaPredatorFranchiseImperialApexHUDDirector (v224)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Impérial Apex (1987-2025).
 */
import { Predator1987MedicompFieldSurgeryAndLogDecoySector } from './Predator1987MedicompFieldSurgeryAndLogDecoySector.js';
import { Predator21990PenthouseNetGunAndSpireLightningSector } from './Predator21990PenthouseNetGunAndSpireLightningSector.js';
import { Avp2004CryoChamberQueenChainBreachSector } from './Avp2004CryoChamberQueenChainBreachSector.js';
import { AvpRequiem2007CemeteryCrawlAndBlueDissolverStreamSector } from './AvpRequiem2007CemeteryCrawlAndBlueDissolverStreamSector.js';
import { Predators2010NikolaiClaymoreAndExoskeletonShieldSector } from './Predators2010NikolaiClaymoreAndExoskeletonShieldSector.js';
import { Prey2022RiverRapidsBeaverDamAndImperialSanctumSector } from './Prey2022RiverRapidsBeaverDamAndImperialSanctumSector.js';
import { PredatorFranchiseImperialApexYautjaDefeatProtocolSector } from './PredatorFranchiseImperialApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseImperialApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987MedicompFieldSurgeryAndLogDecoySector(),
      predator21990: new Predator21990PenthouseNetGunAndSpireLightningSector(),
      avp2004: new Avp2004CryoChamberQueenChainBreachSector(),
      avpRequiem2007: new AvpRequiem2007CemeteryCrawlAndBlueDissolverStreamSector(),
      predators2010: new Predators2010NikolaiClaymoreAndExoskeletonShieldSector(),
      prey2022: new Prey2022RiverRapidsBeaverDamAndImperialSanctumSector(),
      defeatProtocol: new PredatorFranchiseImperialApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Medicomp_Decoy_87', role: 'Shrapnel Extraction & River Log Decoy Specialist', verified: true },
      { name: 'Harrigan_Penthouse_Spire_90', role: 'Net-Gun Constriction & Lightning Rod Specialist', verified: true },
      { name: 'Scar_Queen_Cryo_04', role: 'Defrost Cycle & Hydraulic Queen Shackle Specialist', verified: true },
      { name: 'Wolf_Cemetery_Dissolver_07', role: 'Creek Purification & Mausoleum Cross Specialist', verified: true },
      { name: 'Royce_Claymore_Exo_10', role: 'Dual Claymore Trap & Exoskeleton Force Shield Specialist', verified: true }
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
      version: 'v224',
      pantheon: 'Impérial Apex (1987-2025)',
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
      playtesters: [...this.playtesters]
    };
  }

  render(container = this.container) {
    if (typeof document === 'undefined') {
      return {
        rendered: false,
        reason: 'DOM environment not present (SSR/Node runner).'
      };
    }

    const targetContainer = container || document.body;
    let panel = targetContainer.querySelector('.predator-franchise-v224-imperial-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v224-imperial-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="imperial-apex-hud-header">
        <span class="imperial-glyph-badge">᚛-ᚃ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON IMPÉRIAL APEX (1987-2025)</h3>
        <span class="imperial-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="imperial-apex-hud-body">
        <div class="imperial-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Medicomp Field Surgery & Floating Log Decoy</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="imperial-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Penthouse Net-Gun & Spire Lightning Strike</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="imperial-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Cryo Chamber Defrost & Queen Shackle Rupture</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="imperial-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Creek Bed Dissolver & Mausoleum Cross Ambush</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="imperial-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Dual Claymore Trap & Exoskeleton Force Shield</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="imperial-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Beaver Dam Submersion & Impérial Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="imperial-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Impérial Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="imperial-apex-hud-footer">
        <span>Status: ${telemetry.allCompleted ? 'CONSECRATED' : 'ACTIVE HUNT'}</span>
      </div>
    `;

    this.hudElement = panel;
    return {
      rendered: true,
      element: panel
    };
  }

  renderToDom(containerElement) {
    return this.render(containerElement);
  }
}
