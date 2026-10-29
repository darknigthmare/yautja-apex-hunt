/**
 * HumanQaPredatorFranchiseAstralSupremeApexHUDDirector (v231)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Astral Suprême Apex (1987-2025).
 */
import { Predator1987CeibaTreeCanopyAmbushSector } from './Predator1987CeibaTreeCanopyAmbushSector.js';
import { Predator21990LostTribeAdoliniFlintlockSector } from './Predator21990LostTribeAdoliniFlintlockSector.js';
import { Avp2004AncientPyramidSwarmFlashbackSector } from './Avp2004AncientPyramidSwarmFlashbackSector.js';
import { AvpRequiem2007YautjaPrimeDistressDispatchSector } from './AvpRequiem2007YautjaPrimeDistressDispatchSector.js';
import { Predators2010NikolaiClaymoreSacrificeSector } from './Predators2010NikolaiClaymoreSacrificeSector.js';
import { Prey2022MudPitMaskReflectionClashSector } from './Prey2022MudPitMaskReflectionClashSector.js';
import { PredatorFranchiseAstralSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchiseAstralSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseAstralSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987CeibaTreeCanopyAmbushSector(),
      predator21990: new Predator21990LostTribeAdoliniFlintlockSector(),
      avp2004: new Avp2004AncientPyramidSwarmFlashbackSector(),
      avpRequiem2007: new AvpRequiem2007YautjaPrimeDistressDispatchSector(),
      predators2010: new Predators2010NikolaiClaymoreSacrificeSector(),
      prey2022: new Prey2022MudPitMaskReflectionClashSector(),
      defeatProtocol: new PredatorFranchiseAstralSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Hawkins_CeibaDrag_87', role: 'Ceiba Bough Silent Drag & Demon Trophy Lore Specialist', verified: true },
      { name: 'Harrigan_LostTribe_90', role: 'Mother Ship Trophy Wall & 1715 Adolini Flintlock Specialist', verified: true },
      { name: 'Ancient_GodsSummit_04', role: 'Megalithic Pyramid Summit Swarm Defense Specialist', verified: true },
      { name: 'Wolf_PrimeDispatch_07', role: 'Yautja Prime Holographic Beacon & Solo Insertion Specialist', verified: true },
      { name: 'Nikolai_ClaymoreRig_10', role: 'Wrist Blade Lock & Dual Claymore Mutual Blast Specialist', verified: true }
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
      version: 'v231',
      pantheon: 'Astral Suprême Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v231-astral-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v231-astral-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="astral-supreme-apex-hud-header">
        <span class="astral-glyph-badge">᚛-ᚐ-ᚑ-ᚄ-᚜</span>
        <h3>PANTHÉON ASTRAL SUPRÊME APEX (1987-2025)</h3>
        <span class="astral-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="astral-supreme-apex-hud-body">
        <div class="astral-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Ceiba Tree Canopy Vigil & Silent Drag</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="astral-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Lost Tribe Trophy Wall & 1715 Adolini Flintlock</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="astral-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Ancient Gods Pyramid Flashback & Swarm Defense</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="astral-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Yautja Prime Distress Beacon & Cleaner Launch</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="astral-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Nikolai Wrist Lock & Dual Claymore Blast</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="astral-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Mud Pit Mask Reflection & Astral Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="astral-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Astral Suprême Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="astral-supreme-apex-hud-footer">
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
