/**
 * HumanQaPredatorFranchiseEternelSupremeApexHUDDirector (v229)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Éternel Suprême Apex (1987-2025).
 */
import { Predator1987MaskRemovalPrimalMeleeSector } from './Predator1987MaskRemovalPrimalMeleeSector.js';
import { Predator21990PenthouseRaidAndFlayedCeilingSector } from './Predator21990PenthouseRaidAndFlayedCeilingSector.js';
import { Avp2004ChopperCelticStairsGrappleSector } from './Avp2004ChopperCelticStairsGrappleSector.js';
import { AvpRequiem2007CemeteryMortuaryLaserMeshSector } from './AvpRequiem2007CemeteryMortuaryLaserMeshSector.js';
import { Predators2010TrackerHoundFlushAndLabEscapeSector } from './Predators2010TrackerHoundFlushAndLabEscapeSector.js';
import { Prey2022LaserGuidedBoltAndEternelSanctumSector } from './Prey2022LaserGuidedBoltAndEternelSanctumSector.js';
import { PredatorFranchiseEternelSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchiseEternelSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseEternelSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987MaskRemovalPrimalMeleeSector(),
      predator21990: new Predator21990PenthouseRaidAndFlayedCeilingSector(),
      avp2004: new Avp2004ChopperCelticStairsGrappleSector(),
      avpRequiem2007: new AvpRequiem2007CemeteryMortuaryLaserMeshSector(),
      predators2010: new Predators2010TrackerHoundFlushAndLabEscapeSector(),
      prey2022: new Prey2022LaserGuidedBoltAndEternelSanctumSector(),
      defeatProtocol: new PredatorFranchiseEternelSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_PrimalMelee_87', role: 'Bio-Mask Pneumatic Release & Bare-Handed Brawl Specialist', verified: true },
      { name: 'Vega_PenthouseGlass_90', role: 'Terrace Glass Breach & Suspended Flayed Prey Specialist', verified: true },
      { name: 'Celtic_StairwayGrapple_04', role: 'Pyramid Stairs Tackle & Granite Balustrade Shatter Specialist', verified: true },
      { name: 'Wolf_MortuaryCleanse_07', role: 'Mortuary Basement Blue Solvent & Laser Mesh Specialist', verified: true },
      { name: 'Tracker_HoundPincer_10', role: 'Hound Whistle Flush & Cleanroom Restraint Shatter Specialist', verified: true }
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
      version: 'v229',
      pantheon: 'Éternel Suprême Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v229-eternel-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v229-eternel-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="eternel-supreme-apex-hud-header">
        <span class="eternel-glyph-badge">᚛-ᚏ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON ÉTERNEL SUPRÊME APEX (1987-2025)</h3>
        <span class="eternel-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="eternel-supreme-apex-hud-body">
        <div class="eternel-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Bio-Mask Removal & Bare-Handed Primal Melee</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="eternel-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Penthouse Terrace Glass Breach & Ceiling Flaying</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="eternel-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Pyramid Stairs Tackle & Granite Balustrade Shatter</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="eternel-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Mortuary Basement Blue Solvent & Laser Mesh Grid</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="eternel-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Hound Whistle Pincer & Lab Restraints Breakout</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="eternel-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Tri-Laser Homing Bolt & Éternel Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="eternel-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Éternel Suprême Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="eternel-supreme-apex-hud-footer">
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
