/**
 * HumanQaPredatorFranchiseTranscendantApexHUDDirector (v226)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Transcendant Apex (1987-2025).
 */
import { Predator1987DillonDualMp5AmbushAndThermalDecoySector } from './Predator1987DillonDualMp5AmbushAndThermalDecoySector.js';
import { Predator21990SubwayStrobeLightCleaveAndBatteryRegenSector } from './Predator21990SubwayStrobeLightCleaveAndBatteryRegenSector.js';
import { Avp2004SacrificialPyramidShiftingLabyrinthAndNetTrapSector } from './Avp2004SacrificialPyramidShiftingLabyrinthAndNetTrapSector.js';
import { AvpRequiem2007HospitalRooftopHeliportRainStandoffSector } from './AvpRequiem2007HospitalRooftopHeliportRainStandoffSector.js';
import { Predators2010HanzoKatanaDuelAndPlasmaNetDispersalSector } from './Predators2010HanzoKatanaDuelAndPlasmaNetDispersalSector.js';
import { Prey2022SariBarkMedicineColdWrapAndTranscendantSanctumSector } from './Prey2022SariBarkMedicineColdWrapAndTranscendantSanctumSector.js';
import { PredatorFranchiseTranscendantApexYautjaDefeatProtocolSector } from './PredatorFranchiseTranscendantApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseTranscendantApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987DillonDualMp5AmbushAndThermalDecoySector(),
      predator21990: new Predator21990SubwayStrobeLightCleaveAndBatteryRegenSector(),
      avp2004: new Avp2004SacrificialPyramidShiftingLabyrinthAndNetTrapSector(),
      avpRequiem2007: new AvpRequiem2007HospitalRooftopHeliportRainStandoffSector(),
      predators2010: new Predators2010HanzoKatanaDuelAndPlasmaNetDispersalSector(),
      prey2022: new Prey2022SariBarkMedicineColdWrapAndTranscendantSanctumSector(),
      defeatProtocol: new PredatorFranchiseTranscendantApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dillon_DualMP5_87', role: 'Dual MP5 Flanking & Involuntary Burst Specialist', verified: true },
      { name: 'Jerry_SubwayStrobe_90', role: 'Strobe-Lit Transit Cleave & Third-Rail Siphon Specialist', verified: true },
      { name: 'Celtic_ShiftingLabyrinth_04', role: 'Shifting Stone Gear & Acidic Wire Melt Specialist', verified: true },
      { name: 'Wolf_HeliportRain_07', role: 'Storm Rooftop Heliport & Predalien Jaw Extraction Specialist', verified: true },
      { name: 'Hanzo_KatanaMeadow_10', role: 'Ancestral Katana Iaido & Electrified Net Grid Specialist', verified: true }
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
      version: 'v226',
      pantheon: 'Transcendant Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v226-transcendant-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v226-transcendant-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="transcendant-apex-hud-header">
        <span class="transcendant-glyph-badge">᚛-ᚈ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON TRANSCENDANT APEX (1987-2025)</h3>
        <span class="transcendant-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="transcendant-apex-hud-body">
        <div class="transcendant-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Dual MP5 Ambush & Refraction Analysis</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="transcendant-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Subway Strobe Cleave & Third-Rail Recharge</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="transcendant-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Shifting Labyrinth & Acidic Net Wire Melt</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="transcendant-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Rooftop Heliport Gale & Predalien Jaw Tear</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="transcendant-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Hanzo Katana Duel & Electrified Net Grid</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="transcendant-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Sàa-ri Flower Cold Wrap & Transcendant Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="transcendant-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Transcendant Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="transcendant-apex-hud-footer">
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
