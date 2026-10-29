/**
 * HumanQaPredatorFranchiseCelesteApexHUDDirector (v221)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Céleste Apex (1987-2025).
 */
import { Predator1987TriLaserThermalCalibrationAndLogSacrificeSector } from './Predator1987TriLaserThermalCalibrationAndLogSacrificeSector.js';
import { Predator21990PenthouseSkylightSmashAndVoodooSacrificeSector } from './Predator21990PenthouseSkylightSmashAndVoodooSacrificeSector.js';
import { Avp2004CountdownSarcophagusAndAcidTailParrySector } from './Avp2004CountdownSarcophagusAndAcidTailParrySector.js';
import { AvpRequiem2007NationalGuardArmoryAndDualPistolStandSector } from './AvpRequiem2007NationalGuardArmoryAndDualPistolStandSector.js';
import { Predators2010RiverbedQuicksandAndFugitiveEnergyBarrierSector } from './Predators2010RiverbedQuicksandAndFugitiveEnergyBarrierSector.js';
import { Prey2022FurTrapperBoneTreeSnareAndCelesteApexSanctumSector } from './Prey2022FurTrapperBoneTreeSnareAndCelesteApexSanctumSector.js';
import { PredatorFranchiseCelesteApexYautjaDefeatProtocolSector } from './PredatorFranchiseCelesteApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseCelesteApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987TriLaserThermalCalibrationAndLogSacrificeSector(),
      predator21990: new Predator21990PenthouseSkylightSmashAndVoodooSacrificeSector(),
      avp2004: new Avp2004CountdownSarcophagusAndAcidTailParrySector(),
      avpRequiem2007: new AvpRequiem2007NationalGuardArmoryAndDualPistolStandSector(),
      predators2010: new Predators2010RiverbedQuicksandAndFugitiveEnergyBarrierSector(),
      prey2022: new Prey2022FurTrapperBoneTreeSnareAndCelesteApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseCelesteApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Billy_Sacrifice_87', role: 'Gorge Log Resolute Stand & Machete Specialist', verified: true },
      { name: 'Harrigan_Voodoo_90', role: 'Penthouse Skylight Breach Detective', verified: true },
      { name: 'Scar_Sarcophagus_04', role: 'Countdown Sarcophagus & Acid Parry Master', verified: true },
      { name: 'Wolf_Armory_07', role: 'National Guard Armory Dual Rifle Sweeper', verified: true },
      { name: 'Royce_Quicksand_10', role: 'Riverbed Volcanic Mud Survivalist', verified: true }
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
      version: 'v221',
      pantheon: 'Céleste Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v221-celeste-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v221-celeste-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="celeste-apex-hud-header">
        <span class="celeste-glyph-badge">᚛-ᚊ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON CÉLESTE APEX (1987-2025)</h3>
        <span class="celeste-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="celeste-apex-hud-body">
        <div class="celeste-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Tri-Laser Calibration & Log Sacrifice</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="celeste-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Penthouse Skylight & Voodoo Dagger</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="celeste-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Countdown Sarcophagus & Acid Tail</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="celeste-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Armory Stand & Dual Plasma Rifle</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="celeste-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Quicksand Mud & Energy Barrier</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="celeste-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Timber Snare Deflection & Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="celeste-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Céleste Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="celeste-apex-hud-footer">
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
