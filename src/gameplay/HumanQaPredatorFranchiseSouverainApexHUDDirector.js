/**
 * HumanQaPredatorFranchiseSouverainApexHUDDirector (v225)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Souverain Apex (1987-2025).
 */
import { Predator1987CanopyLeapLogSwingAndTriLaserAimSector } from './Predator1987CanopyLeapLogSwingAndTriLaserAimSector.js';
import { Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector } from './Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector.js';
import { Avp2004GashMarkingRitualAndMatriarchWhalingWinchSector } from './Avp2004GashMarkingRitualAndMatriarchWhalingWinchSector.js';
import { AvpRequiem2007SportsStoreNestLaserNetAndChestbursterExtractionSector } from './AvpRequiem2007SportsStoreNestLaserNetAndChestbursterExtractionSector.js';
import { Predators2010FalconDroneTelemetryAndShipHullForceFieldSector } from './Predators2010FalconDroneTelemetryAndShipHullForceFieldSector.js';
import { Prey2022GrizzlyBearSpearClashAndSouverainSanctumSector } from './Prey2022GrizzlyBearSpearClashAndSouverainSanctumSector.js';
import { PredatorFranchiseSouverainApexYautjaDefeatProtocolSector } from './PredatorFranchiseSouverainApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseSouverainApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987CanopyLeapLogSwingAndTriLaserAimSector(),
      predator21990: new Predator21990AlleywayCombistickThrowAndMedicompWallScaleSector(),
      avp2004: new Avp2004GashMarkingRitualAndMatriarchWhalingWinchSector(),
      avpRequiem2007: new AvpRequiem2007SportsStoreNestLaserNetAndChestbursterExtractionSector(),
      predators2010: new Predators2010FalconDroneTelemetryAndShipHullForceFieldSector(),
      prey2022: new Prey2022GrizzlyBearSpearClashAndSouverainSanctumSector(),
      defeatProtocol: new PredatorFranchiseSouverainApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Canopy_Log_87', role: 'Mahogany Canopy Leaps & Spiked Pendulum Specialist', verified: true },
      { name: 'Harrigan_Alley_Combistick_90', role: 'Rainy Alleyway Stalking & Wall Suture Specialist', verified: true },
      { name: 'Scar_Gash_Winch_04', role: 'Acid Clan Gash & Abyssal Winch Abyss Drag Specialist', verified: true },
      { name: 'Wolf_Sports_Laser_07', role: 'Sporting Goods Laser Web & Dual Corridor Sniper Specialist', verified: true },
      { name: 'Falconer_Drone_Field_10', role: 'Mechanical Falcon Telemetry & Ship Force Field Specialist', verified: true }
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
      version: 'v225',
      pantheon: 'Souverain Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v225-souverain-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v225-souverain-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="souverain-apex-hud-header">
        <span class="souverain-glyph-badge">᚛-ᚄ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON SOUVERAIN APEX (1987-2025)</h3>
        <span class="souverain-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="souverain-apex-hud-body">
        <div class="souverain-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Canopy Leaps & Spiked Log Pendulum</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="souverain-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Alleyway Combistick & Vertical Wall Suture</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="souverain-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Clan Mark Gash & Matriarch Whaling Abyss</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="souverain-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Sports Store Laser Web & Chestburster Extraction</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="souverain-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Falcon Drone Stream & Ship Force Field Overload</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="souverain-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Grizzly Spear Clash & Souverain Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="souverain-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Souverain Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="souverain-apex-hud-footer">
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
