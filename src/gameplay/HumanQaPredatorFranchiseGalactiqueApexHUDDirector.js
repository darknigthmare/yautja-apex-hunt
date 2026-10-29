/**
 * HumanQaPredatorFranchiseGalactiqueApexHUDDirector (v222)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Galactique Apex (1987-2025).
 */
import { Predator1987MudCamoReapplicationAndWaterfallPlungeSector } from './Predator1987MudCamoReapplicationAndWaterfallPlungeSector.js';
import { Predator21990SubCarriageTrackSweepAndJerryMacheteSector } from './Predator21990SubCarriageTrackSweepAndJerryMacheteSector.js';
import { Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector } from './Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector.js';
import { AvpRequiem2007MaternityWardNestAndDissolverBombSector } from './AvpRequiem2007MaternityWardNestAndDissolverBombSector.js';
import { Predators2010BerserkerGatlingOverloadAndClassicLiberationSector } from './Predators2010BerserkerGatlingOverloadAndClassicLiberationSector.js';
import { Prey2022QuicksandDecoyAndGalactiqueApexSanctumSector } from './Prey2022QuicksandDecoyAndGalactiqueApexSanctumSector.js';
import { PredatorFranchiseGalactiqueApexYautjaDefeatProtocolSector } from './PredatorFranchiseGalactiqueApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseGalactiqueApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987MudCamoReapplicationAndWaterfallPlungeSector(),
      predator21990: new Predator21990SubCarriageTrackSweepAndJerryMacheteSector(),
      avp2004: new Avp2004SacrificialAltarCarapaceShieldAndAcidEtchSector(),
      avpRequiem2007: new AvpRequiem2007MaternityWardNestAndDissolverBombSector(),
      predators2010: new Predators2010BerserkerGatlingOverloadAndClassicLiberationSector(),
      prey2022: new Prey2022QuicksandDecoyAndGalactiqueApexSanctumSector(),
      defeatProtocol: new PredatorFranchiseGalactiqueApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_Waterfall_87', role: 'Waterfall Plunge & Mineral Mud Packing Specialist', verified: true },
      { name: 'Harrigan_Subway_90', role: 'Third-Rail Arc & Commuter Catwalk Guard', verified: true },
      { name: 'Scar_Shield_04', role: 'Altar Carapace Forger & Acid Mark Etcher', verified: true },
      { name: 'Wolf_Maternity_07', role: 'Maternity Ward Dissolver Purge Technician', verified: true },
      { name: 'Classic_Royce_10', role: 'Totem Liberation & Plasma Overload Striker', verified: true }
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
      version: 'v222',
      pantheon: 'Galactique Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v222-galactique-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v222-galactique-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="galactique-apex-hud-header">
        <span class="galactique-glyph-badge">᚛-ᚌ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON GALACTIQUE APEX (1987-2025)</h3>
        <span class="galactique-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="galactique-apex-hud-body">
        <div class="galactique-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Waterfall Plunge & Mud Packing</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="galactique-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Third-Rail Arcs & Undercarriage Disc</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="galactique-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Carapace Shield Forge & Acid Mark</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="galactique-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Maternity Ward & Dissolver Purge</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="galactique-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Classic Liberation & Gatling Duel</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="galactique-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Quicksand Decoy & 180° Flechette</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="galactique-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Galactique Apex Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="galactique-apex-hud-footer">
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
