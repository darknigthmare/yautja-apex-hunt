/**
 * HumanQaPredatorFranchisePrimordialSupremeApexHUDDirector (v228)
 *
 * Coordinates HUD telemetry, DOM panel rendering, and playtester feedback
 * across all 7 sectors of the Panthéon Primordial Suprême Apex (1987-2025).
 */
import { Predator1987BillyLogBridgeMacheteDefianceSector } from './Predator1987BillyLogBridgeMacheteDefianceSector.js';
import { Predator21990KingWillieVoodooCulDeSacSector } from './Predator21990KingWillieVoodooCulDeSacSector.js';
import { Avp2004LexChitinShieldAndTailSpearSector } from './Avp2004LexChitinShieldAndTailSpearSector.js';
import { AvpRequiem2007DualShoulderCasterFusionSector } from './AvpRequiem2007DualShoulderCasterFusionSector.js';
import { Predators2010CuchilloBoobyTrapAndExocortexHarvestSector } from './Predators2010CuchilloBoobyTrapAndExocortexHarvestSector.js';
import { Prey2022FoldingShieldDeflectionAndPrimordialSanctumSector } from './Prey2022FoldingShieldDeflectionAndPrimordialSanctumSector.js';
import { PredatorFranchisePrimordialSupremeApexYautjaDefeatProtocolSector } from './PredatorFranchisePrimordialSupremeApexYautjaDefeatProtocolSector.js';

export class HumanQaPredatorFranchisePrimordialSupremeApexHUDDirector {
  constructor({ container = null } = {}) {
    this.container = container;
    this.sectors = {
      predator1987: new Predator1987BillyLogBridgeMacheteDefianceSector(),
      predator21990: new Predator21990KingWillieVoodooCulDeSacSector(),
      avp2004: new Avp2004LexChitinShieldAndTailSpearSector(),
      avpRequiem2007: new AvpRequiem2007DualShoulderCasterFusionSector(),
      predators2010: new Predators2010CuchilloBoobyTrapAndExocortexHarvestSector(),
      prey2022: new Prey2022FoldingShieldDeflectionAndPrimordialSanctumSector(),
      defeatProtocol: new PredatorFranchisePrimordialSupremeApexYautjaDefeatProtocolSector()
    };
    this.hudElement = null;
    this.playtesters = [
      { name: 'Billy_LogBridge_87', role: 'Machete Chest Slash & Ravine Log Span Melee Specialist', verified: true },
      { name: 'Willie_VoodooSpine_90', role: 'Flooded Cul-De-Sac Cane Sword & Washed Skull Trophy Specialist', verified: true },
      { name: 'Lex_ChitinArmament_04', role: 'Acid-Proof Head Dome Shield & Tail Spear Specialist', verified: true },
      { name: 'Wolf_TwinCasters_07', role: 'Dual Shoulder Caster Fusion & Synchronized Bombardment Specialist', verified: true },
      { name: 'Royce_MimicryDisarm_10', role: 'Cuchillo Vocal Mimicry Disarm & Exocortex Harvest Specialist', verified: true }
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
      version: 'v228',
      pantheon: 'Primordial Suprême Apex (1987-2025)',
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
    let panel = targetContainer.querySelector('.predator-franchise-v228-primordial-supreme-apex-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'predator-franchise-v228-primordial-supreme-apex-hud-panel';
      targetContainer.appendChild(panel);
    }

    const telemetry = this.getTelemetrySnapshot();
    panel.innerHTML = `
      <div class="primordial-supreme-apex-hud-header">
        <span class="primordial-glyph-badge">᚛-ᚚ-ᚑ-ᚏ-᚜</span>
        <h3>PANTHÉON PRIMORDIAL SUPRÊME APEX (1987-2025)</h3>
        <span class="primordial-honor-pill">Honor: ${telemetry.totalHonor} / 3000</span>
      </div>
      <div class="primordial-supreme-apex-hud-body">
        <div class="primordial-sector-row ${telemetry.sectors.predator1987.completed ? 'completed' : ''}">
          <span>1987: Billy Log Bridge & Machete Defiance</span>
          <span>${telemetry.sectors.predator1987.honor} H</span>
        </div>
        <div class="primordial-sector-row ${telemetry.sectors.predator21990.completed ? 'completed' : ''}">
          <span>1990: King Willie Voodoo Cul-De-Sac & Spine Extraction</span>
          <span>${telemetry.sectors.predator21990.honor} H</span>
        </div>
        <div class="primordial-sector-row ${telemetry.sectors.avp2004.completed ? 'completed' : ''}">
          <span>2004: Chitin Acid-Proof Shield & Tail Spear</span>
          <span>${telemetry.sectors.avp2004.honor} H</span>
        </div>
        <div class="primordial-sector-row ${telemetry.sectors.avpRequiem2007.completed ? 'completed' : ''}">
          <span>2007: Dual Shoulder Caster Fusion & Twin Bombardment</span>
          <span>${telemetry.sectors.avpRequiem2007.honor} H</span>
        </div>
        <div class="primordial-sector-row ${telemetry.sectors.predators2010.completed ? 'completed' : ''}">
          <span>2010/2018: Cuchillo Decoy Disarm & Hound Exocortex</span>
          <span>${telemetry.sectors.predators2010.honor} H</span>
        </div>
        <div class="primordial-sector-row ${telemetry.sectors.prey2022.completed ? 'completed' : ''}">
          <span>2022/2025: Folding Arm Shield & Primordial Sanctum</span>
          <span>${telemetry.sectors.prey2022.honor} H</span>
        </div>
        <div class="primordial-sector-row ${telemetry.sectors.defeatProtocol.completed ? 'completed' : ''}">
          <span>Rule 3 Protocol: Primordial Suprême Defeat Self-Destruct</span>
          <span>${telemetry.sectors.defeatProtocol.honor} H</span>
        </div>
      </div>
      <div class="primordial-supreme-apex-hud-footer">
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
