/**
 * HumanQaPredatorFranchiseCosmiqueSupremeApexHUDDirector (v230)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Cosmique Suprême Apex (1987-2025).
 */
import { Predator1987MayanPyramidAcousticMimicrySector } from './Predator1987MayanPyramidAcousticMimicrySector.js';
import { Predator21990MeatLockerUltravioletScanSector } from './Predator21990MeatLockerUltravioletScanSector.js';
import { Avp2004WeylandCarcinomaScanAndTorchClashSector } from './Avp2004WeylandCarcinomaScanAndTorchClashSector.js';
import { AvpRequiem2007HospitalMaternitySteamBurstSector } from './AvpRequiem2007HospitalMaternitySteamBurstSector.js';
import { Predators2010CrucifiedClassicLiberationDuelSector } from './Predators2010CrucifiedClassicLiberationDuelSector.js';
import { Prey2022WolfSkullSkinningAndCosmiqueSanctumSector } from './Prey2022WolfSkullSkinningAndCosmiqueSanctumSector.js';
import { PredatorFranchiseCosmiqueSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchiseCosmiqueSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchiseCosmiqueSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987MayanPyramidAcousticMimicrySector(),
      predator21990: new Predator21990MeatLockerUltravioletScanSector(),
      avp2004: new Avp2004WeylandCarcinomaScanAndTorchClashSector(),
      avpRequiem2007: new AvpRequiem2007HospitalMaternitySteamBurstSector(),
      predators2010: new Predators2010CrucifiedClassicLiberationDuelSector(),
      prey2022: new Prey2022WolfSkullSkinningAndCosmiqueSanctumSector(),
      defeatProtocol: new PredatorFranchiseCosmiqueSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Dutch_MayanAltar_87', role: 'Mayan Ruin Survey & Radio Voice Mimicry Specialist', verified: true },
      { name: 'Keyes_NitrogenCold_90', role: 'Slaughterhouse Locker Nitrogen Masking & UV Switch Specialist', verified: true },
      { name: 'Weyland_TorchDefiance_04', role: 'Carcinoma Diagnostic Scan & Oxygen Blowtorch Clash Specialist', verified: true },
      { name: 'Wolf_HospitalSteam_07', role: 'Maternity Flooded Floor & High-Pressure Steam Burst Specialist', verified: true },
      { name: 'Royce_CrucifiedLiberation_10', role: 'Crucified Classic Totem Liberation & Elder Clan Duel Specialist', verified: true }
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
      version: 'v230',
      pantheon: 'Cosmique Suprême Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v230-cosmique-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v230-cosmique-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="cosmique-supreme-apex-hud-header">
        <span class="cosmique-glyph-badge">᚛-ᚉ-ᚑ-ᚄ-᚜</span>
        <h3>PANTHÉON COSMIQUE SUPRÊME APEX (1987-2025)</h3>
        <span class="cosmique-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="cosmique-supreme-apex-hud-body">
        <div class="cosmique-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Mayan Pyramid Altar Survey & Radio Mimicry</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="cosmique-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: Meat Locker Nitrogen Masking & UV Spectrum Switch</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="cosmique-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Weyland Carcinoma Diagnosis & Oxygen Torch Retaliation</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="cosmique-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Hospital Maternity Flood & Industrial Steam Rupture</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="cosmique-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Crucified Classic Liberation & Elder Clan Blood Duel</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="cosmique-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Timber Wolf Creek Bed Clash & Cosmique Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="cosmique-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Cosmique Suprême Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="cosmique-supreme-apex-hud-footer">
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
