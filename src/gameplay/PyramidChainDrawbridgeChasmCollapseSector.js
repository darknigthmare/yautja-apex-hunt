/**
 * PyramidChainDrawbridgeChasmCollapseSector.js
 * Chantier 4 (v149) : Pont-levis à chaînes de la pyramide & contrepoids en pierre (AVP 2004).
 * Passerelle monumentale en pierre au-dessus du gouffre souterrain de Bouvetøya :
 * - Soutenue par deux chaînes maîtresses en alliage ancien (Nord et Sud).
 * - Sectionner les deux maillons porteurs au Smart Disc ou au Shuriken fait basculer le tablier,
 *   précipitant toutes les unités présentes sur le pont dans l'abîme et coupant l'accès direct.
 */

export class PyramidChainDrawbridgeChasmCollapseSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'bouvetoya_chasm_chain_drawbridge';
    this.bridgeBounds = options.bridgeBounds ?? { minX: -12, maxX: 12, minZ: -3, maxZ: 3 };

    this.state = {
      northChainIntact: true,
      southChainIntact: true,
      bridgeCollapsed: false,
      chasmCrossingRequiresGrappleOrLeap: false,
      totalUnitsPlungedIntoChasm: 0
    };
  }

  severSupportChain(chainSide = 'NORTH', unitsOnBridge = [], audioSynthesizer = null) {
    if (this.state.bridgeCollapsed) {
      return { severed: false, reason: 'bridge_already_collapsed' };
    }

    const normalized = String(chainSide).toUpperCase();
    if (normalized === 'NORTH') {
      this.state.northChainIntact = false;
    } else if (normalized === 'SOUTH') {
      this.state.southChainIntact = false;
    } else {
      return { severed: false, reason: 'invalid_chain_side' };
    }

    if (audioSynthesizer && typeof audioSynthesizer.playPyramidDrawbridgeChainSeverClang === 'function') {
      audioSynthesizer.playPyramidDrawbridgeChainSeverClang(1.0);
    }

    const plungedUnitIds = [];
    if (!this.state.northChainIntact && !this.state.southChainIntact) {
      this.state.bridgeCollapsed = true;
      this.state.chasmCrossingRequiresGrappleOrLeap = true;

      if (audioSynthesizer && typeof audioSynthesizer.playDrawbridgeStoneSlabChasmCrash === 'function') {
        audioSynthesizer.playDrawbridgeStoneSlabChasmCrash(1.2);
      }

      for (const unit of unitsOnBridge) {
        const x = Number(unit.x ?? 0);
        const z = Number(unit.z ?? 0);
        const onSlab =
          x >= this.bridgeBounds.minX &&
          x <= this.bridgeBounds.maxX &&
          z >= this.bridgeBounds.minZ &&
          z <= this.bridgeBounds.maxZ;

        if (onSlab) {
          unit.health = 0;
          unit.plungedIntoChasm = true;
          plungedUnitIds.push(unit.id ?? 'unit');
          this.state.totalUnitsPlungedIntoChasm += 1;
        }
      }
    }

    return {
      severed: true,
      chainSide: normalized,
      bridgeCollapsed: this.state.bridgeCollapsed,
      plungedUnitIds
    };
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      northChainIntact: this.state.northChainIntact,
      southChainIntact: this.state.southChainIntact,
      bridgeCollapsed: this.state.bridgeCollapsed,
      chasmCrossingRequiresGrappleOrLeap: this.state.chasmCrossingRequiresGrappleOrLeap,
      totalUnitsPlungedIntoChasm: this.state.totalUnitsPlungedIntoChasm
    };
  }
}
