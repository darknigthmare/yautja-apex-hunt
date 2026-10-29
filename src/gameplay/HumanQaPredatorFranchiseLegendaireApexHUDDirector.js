/**
 * HumanQaPredatorFranchiseLegendaireApexHUDDirector (v223)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Légendaire Apex (1987-2025).
 */
import { Predator1987ThermalMudDiscoveryAndFlareStandoffSector } from './Predator1987ThermalMudDiscoveryAndFlareStandoffSector.js';
import { Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector } from './Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector.js';
import { Avp2004GauntletBombDeploymentAndWinchSledRocketSector } from './Avp2004GauntletBombDeploymentAndWinchSledRocketSector.js';
import { AvpRequiem2007PowerPlantSubstationLaserAndDualPlasmaSnipingSector } from './AvpRequiem2007PowerPlantSubstationLaserAndDualPlasmaSnipingSector.js';
import { Predators2010AncientLandingVesselCockpitAndCyberHoundWhistleSector } from './Predators2010AncientLandingVesselCockpitAndCyberHoundWhistleSector.js';
import { Prey2022AshPrairieSpringWireSnareAndLegendaireApexSanctumSector } from './Prey2022AshPrairieSpringWireSnareAndLegendaireApexSanctumSector.js';
import { PredatorFranchiseLegendaireApexYautjaDefeatProtocolSector } from './PredatorFranchiseLegendaireApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseLegendaireApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987ThermalMudDiscoveryAndFlareStandoffSector(),
      predator21990: new Predator21990SlaughterhouseNitrogenAndSmartDiscRailTossSector(),
      avp2004: new Avp2004GauntletBombDeploymentAndWinchSledRocketSector(),
      avpRequiem2007: new AvpRequiem2007PowerPlantSubstationLaserAndDualPlasmaSnipingSector(),
      predators2010: new Predators2010AncientLandingVesselCockpitAndCyberHoundWhistleSector(),
      prey2022: new Prey2022AshPrairieSpringWireSnareAndLegendaireApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseLegendaireApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Thermal_Flare_87', role: 'Thermal Clay Mask & Magnesium Optical Dazzle Specialist', verified: true },
      { name: 'Harrigan_Nitrogen_Rail_90', role: 'Sub-Zero Nitrogen Locker & Overhead Rail Disc Specialist', verified: true },
      { name: 'Scar_Rocket_Sled_04', role: 'Altar Gauntlet Bomb & 610m Ice Shaft Rocket Specialist', verified: true },
      { name: 'Wolf_Substation_07', role: 'Power Plant Grid & Dual Plasma Sniper Specialist', verified: true },
      { name: 'Royce_Vessel_Core_10', role: 'Ancient Star Map & Sub-Light Fusion Overload Specialist', verified: true }
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
      version: 'v223',
      pantheon: 'Légendaire Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v223-legendaire-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v223-legendaire-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="legendaire-apex-hud-header">
        <span class="legendaire-glyph-badge">᚛-ᚂ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON LÉGENDAIRE APEX (1987-2025)</h3>
        <span class="legendaire-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="legendaire-apex-hud-body">
        <div class="legendaire-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Thermal Clay Mask & Magnesium Flare Standoff</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="legendaire-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Slaughterhouse Nitrogen & Overhead Rail Disc Toss</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="legendaire-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Pedestal Bomb & Winch Sled 610m Shaft Ascent</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="legendaire-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Substation Laser Grid & Dual Plasma Sniping</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="legendaire-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Landing Vessel Star Map & Cyber-Hound Whistle</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="legendaire-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Ash Prairie Spring-Wire & Légendaire Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="legendaire-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Légendaire Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="legendaire-apex-hud-footer">
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
