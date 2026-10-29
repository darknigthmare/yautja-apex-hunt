/**
 * HumanQaPredatorFranchiseOmnipotentApexHUDDirector (v227)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Omnipotent Apex (1987-2025).
 */
import { Predator1987MacShavingRazorTrackingAndClayTrapSector } from './Predator1987MacShavingRazorTrackingAndClayTrapSector.js';
import { Predator21990CityHunterNetCutterAndRooftopChasmLeapSector } from './Predator21990CityHunterNetCutterAndRooftopChasmLeapSector.js';
import { Avp2004CelticBattleAxeTailSeverAndFacehuggerNettingSector } from './Avp2004CelticBattleAxeTailSeverAndFacehuggerNettingSector.js';
import { AvpRequiem2007SewerTunnelMinefieldAndDualWhipLashSector } from './AvpRequiem2007SewerTunnelMinefieldAndDualWhipLashSector.js';
import { Predators2010BerserkerArmoredMaskHUDAndPlasmaCannonRipSector } from './Predators2010BerserkerArmoredMaskHUDAndPlasmaCannonRipSector.js';
import { Prey2022SnakeDecapitationAndOmnipotentSanctumSector } from './Prey2022SnakeDecapitationAndOmnipotentSanctumSector.js';
import { PredatorFranchiseOmnipotentApexYautjaDefeatProtocolSector } from './PredatorFranchiseOmnipotentApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseOmnipotentApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987MacShavingRazorTrackingAndClayTrapSector(),
      predator21990: new Predator21990CityHunterNetCutterAndRooftopChasmLeapSector(),
      avp2004: new Avp2004CelticBattleAxeTailSeverAndFacehuggerNettingSector(),
      avpRequiem2007: new AvpRequiem2007SewerTunnelMinefieldAndDualWhipLashSector(),
      predators2010: new Predators2010BerserkerArmoredMaskHUDAndPlasmaCannonRipSector(),
      prey2022: new Prey2022SnakeDecapitationAndOmnipotentSanctumSector(),
      defeatProtocol: new PredatorFranchiseOmnipotentApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Mac_RazorVendetta_87', role: 'Broken Razor Snapping & Clay Decoy Trench Specialist', verified: true },
      { name: 'Harrigan_RooftopChasm_90', role: 'Net-Cutter Shears & 16m Rooftop Chasm Leap Specialist', verified: true },
      { name: 'Celtic_BattleAxe_04', role: 'Titanium Battle Axe & Mid-Air Facehugger Net Specialist', verified: true },
      { name: 'Wolf_SewerMinefield_07', role: 'Sewer Tunnel Minefield & Dual Whip Bulkhead Specialist', verified: true },
      { name: 'Royce_BerserkerRip_10', role: 'Berserker Jaw Bio-Mask & Ripped Cannon Blast Specialist', verified: true }
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
      version: 'v227',
      pantheon: 'Omnipotent Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v227-omnipotent-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v227-omnipotent-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="omnipotent-apex-hud-header">
        <span class="omnipotent-glyph-badge">᚛-ᚉ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON OMNIPOTENT APEX (1987-2025)</h3>
        <span class="omnipotent-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="omnipotent-apex-hud-body">
        <div class="omnipotent-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Razor Vendetta & Clay Decoy Trench</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="omnipotent-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Net-Cutter Shears & Rooftop Chasm Leap</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="omnipotent-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Celtic Battle Axe & Facehugger Netting</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="omnipotent-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Sewer Minefield & Dual Whip Bulkhead</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="omnipotent-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Jaw Bio-Mask & Ripped Cannon Discharge</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="omnipotent-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Snake Decapitation & Omnipotent Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="omnipotent-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Omnipotent Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="omnipotent-apex-hud-footer">
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
