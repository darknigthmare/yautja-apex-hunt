/**
 * HumanQaPredatorFranchiseMythiqueApexHUDDirector (v219)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Mythique Apex (1987-2025).
 */
import { Predator1987CanopySkinnedTroopersAndThermalSilhouetteSector } from './Predator1987CanopySkinnedTroopersAndThermalSilhouetteSector.js';
import { Predator21990AlleywayScorpioMassacreAndGargoyleDecloakSector } from './Predator21990AlleywayScorpioMassacreAndGargoyleDecloakSector.js';
import { Avp2004SacrificialWheelAndFacehuggerCageBreachSector } from './Avp2004SacrificialWheelAndFacehuggerCageBreachSector.js';
import { AvpRequiem2007SewerDissolutionAndDualCasterDuelSector } from './AvpRequiem2007SewerDissolutionAndDualCasterDuelSector.js';
import { Predators2010AncientShipCockpitAndCyberHoundHuntSector } from './Predators2010AncientShipCockpitAndCyberHoundHuntSector.js';
import { Prey2022TrapperCampFirestormAndMythiqueApexSanctumSector } from './Prey2022TrapperCampFirestormAndMythiqueApexSanctumSector.js';
import { PredatorFranchiseMythiqueApexYautjaDefeatProtocolSector } from './PredatorFranchiseMythiqueApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseMythiqueApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987CanopySkinnedTroopersAndThermalSilhouetteSector(),
      predator21990: new Predator21990AlleywayScorpioMassacreAndGargoyleDecloakSector(),
      avp2004: new Avp2004SacrificialWheelAndFacehuggerCageBreachSector(),
      avpRequiem2007: new AvpRequiem2007SewerDissolutionAndDualCasterDuelSector(),
      predators2010: new Predators2010AncientShipCockpitAndCyberHoundHuntSector(),
      prey2022: new Prey2022TrapperCampFirestormAndMythiqueApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseMythiqueApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Vanguard_87', role: 'Canopy Skinned Troop Scout & Heat Analyst', verified: true },
      { name: 'Harrigan_Alley_90', role: 'Scorpio Gang Cartel Detective & Storm Observer', verified: true },
      { name: 'Scar_Pyramid_04', role: 'Hieroglyphic Calendar Wheel Navigator', verified: true },
      { name: 'Wolf_Sewer_07', role: 'Dual Plasma Caster Subterranean Cleaner', verified: true },
      { name: 'Naru_Firestorm_22', role: 'Trapper Fort Stalker & Ash Scout', verified: true }
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
      version: 'v219',
      pantheon: 'Mythique Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v219-mythique-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v219-mythique-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="mythique-apex-hud-header">
        <span class="mythique-glyph-badge">᚛-ᚇ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON MYTHIQUE APEX (1987-2025)</h3>
        <span class="mythique-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="mythique-apex-hud-body">
        <div class="mythique-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Canopy Skinned Troops & Thermal Silhouette</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="mythique-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Scorpio Gang Massacre & Gargoyle Storm</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="mythique-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Sarcophagus Wheel & Facehugger Cages</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="mythique-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Sewer Dissolver & Dual Caster Duel</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="mythique-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Ancient Ship Nav & Cyber Hound Hunt</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="mythique-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Trapper Firestorm & Mythique Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="mythique-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Mythique Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="mythique-apex-hud-footer">
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
