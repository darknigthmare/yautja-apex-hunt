/**
 * HumanQaPredatorFranchiseInfiniApexHUDDirector (v220)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Infini Apex (1987-2025).
 */
import { Predator1987ThermalWaterDispersionAndMudReflectionSector } from './Predator1987ThermalWaterDispersionAndMudReflectionSector.js';
import { Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector } from './Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector.js';
import { Avp2004BouvetoyaWhalingStationBlizzardAndCelticClashSector } from './Avp2004BouvetoyaWhalingStationBlizzardAndCelticClashSector.js';
import { AvpRequiem2007CemeteryMudTrenchAndWhipSlicingSector } from './AvpRequiem2007CemeteryMudTrenchAndWhipSlicingSector.js';
import { Predators2010HanzoKatanaMoonlitDuelAndShurikenSector } from './Predators2010HanzoKatanaMoonlitDuelAndShurikenSector.js';
import { Prey2022BeaverDamTrapAndInfiniApexSanctumSector } from './Prey2022BeaverDamTrapAndInfiniApexSanctumSector.js';
import { PredatorFranchiseInfiniApexYautjaDefeatProtocolSector } from './PredatorFranchiseInfiniApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseInfiniApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987ThermalWaterDispersionAndMudReflectionSector(),
      predator21990: new Predator21990MeatLockerFreezerAndLiquidNitrogenAmbushSector(),
      avp2004: new Avp2004BouvetoyaWhalingStationBlizzardAndCelticClashSector(),
      avpRequiem2007: new AvpRequiem2007CemeteryMudTrenchAndWhipSlicingSector(),
      predators2010: new Predators2010HanzoKatanaMoonlitDuelAndShurikenSector(),
      prey2022: new Prey2022BeaverDamTrapAndInfiniApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseInfiniApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Mud_87', role: 'Riverbank Dielectric Camo & Thermal Mask Analyst', verified: true },
      { name: 'Keyes_OWLF_90', role: 'Meat Locker Cryogenic & UV Sector Supervisor', verified: true },
      { name: 'Celtic_Bouvet_04', role: 'Bouvetøya Sub-Zero Whaling Station Guardian', verified: true },
      { name: 'Wolf_Gunnison_07', role: 'Cemetery Mud Trench & Barbed Whip Cleaner', verified: true },
      { name: 'Hanzo_Yakuza_10', role: 'Moonlit Grass Katana Honor Champion', verified: true }
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
      version: 'v220',
      pantheon: 'Infini Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v220-infini-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v220-infini-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="infini-apex-hud-header">
        <span class="infini-glyph-badge">᚛-ᚉ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON INFINI APEX (1987-2025)</h3>
        <span class="infini-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="infini-apex-hud-body">
        <div class="infini-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Riverbank Camo Spark & Mud Mask</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="infini-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Meat Locker Cryo & UV Vision Shift</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="infini-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Bouvetøya Blizzard & Celtic Cauldron</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="infini-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Cemetery Mud & Mid-Air Whip Slice</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="infini-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Hanzo Katana Clash & Shuriken</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="infini-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Beaver Dam Fan Spin & Infini Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="infini-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Infini Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="infini-apex-hud-footer">
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
