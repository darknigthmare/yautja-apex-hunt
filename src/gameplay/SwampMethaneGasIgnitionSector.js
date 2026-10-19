/**
 * SwampMethaneGasIgnitionSector.js
 * Chantier 3 (v148) : Brouillard marécageux de gaz méthane inflammable (Predators 2010 / Val Verde).
 * Poches de gaz naturel émanant des tourbières :
 * - Réduit la visibilité optique humaine tant que le gaz stagne en nappe basse.
 * - Tout tir d'arme à feu humaine ou décharge de Plasmacaster embrase la poche en déflagration.
 * - Aveugle momentanément les capteurs thermiques (mode IR saturé) tout en calcinant l'escouade.
 */

export class SwampMethaneGasIgnitionSector {
  constructor(options = {}) {
    this.sectorId = options.sectorId ?? 'val_verde_methane_peat_bog';
    this.gasPocketRadiusMeters = options.gasPocketRadiusMeters ?? 9.5;
    this.ignitionBlastDamage = options.ignitionBlastDamage ?? 145;
    this.burnDurationSeconds = options.burnDurationSeconds ?? 6.5;
    this.seepRegenerationSeconds = options.seepRegenerationSeconds ?? 18.0;

    this.pockets = (options.pockets ?? [
      { id: 'methane_pocket_west', x: -16, z: 10, concentration: 1.0, ignited: false, burnRemaining: 0, regenTimer: 0 },
      { id: 'methane_pocket_east', x: 14, z: -8, concentration: 1.0, ignited: false, burnRemaining: 0, regenTimer: 0 }
    ]).map((p) => ({ ...p }));

    this.totalIgnitions = 0;
  }

  sampleEnvironmentalVisibility(position = { x: 0, z: 0 }) {
    let opticalFogDensity = 0.15;
    let thermalWhiteoutIntensity = 0.0;

    for (const pocket of this.pockets) {
      const dist = Math.hypot((position.x ?? 0) - pocket.x, (position.z ?? 0) - pocket.z);
      if (dist <= this.gasPocketRadiusMeters) {
        const falloff = 1 - dist / this.gasPocketRadiusMeters;
        if (pocket.ignited) {
          thermalWhiteoutIntensity = Math.min(1.0, thermalWhiteoutIntensity + 0.92 * falloff);
        } else if (pocket.concentration > 0.35) {
          opticalFogDensity = Math.min(0.95, opticalFogDensity + 0.72 * pocket.concentration * falloff);
        }
      }
    }

    return {
      opticalFogDensity: Number(opticalFogDensity.toFixed(3)),
      thermalWhiteoutIntensity: Number(thermalWhiteoutIntensity.toFixed(3)),
      isThermalVisionOverloaded: thermalWhiteoutIntensity >= 0.55
    };
  }

  triggerSparkOrPlasmaAt(sparkPosition = { x: 0, z: 0 }, entities = [], audioSynthesizer = null) {
    const ignitedPockets = [];
    const affectedEntities = [];

    for (const pocket of this.pockets) {
      if (pocket.ignited || pocket.concentration < 0.4) continue;

      const distToSpark = Math.hypot((sparkPosition.x ?? 0) - pocket.x, (sparkPosition.z ?? 0) - pocket.z);
      if (distToSpark <= this.gasPocketRadiusMeters) {
        pocket.ignited = true;
        pocket.burnRemaining = this.burnDurationSeconds;
        pocket.concentration = 0;
        this.totalIgnitions += 1;
        ignitedPockets.push(pocket.id);

        if (audioSynthesizer && typeof audioSynthesizer.playSwampMethaneGasWhooshIgnite === 'function') {
          audioSynthesizer.playSwampMethaneGasWhooshIgnite(1.1);
        }

        for (const entity of entities) {
          const distEntity = Math.hypot((entity.x ?? 0) - pocket.x, (entity.z ?? 0) - pocket.z);
          if (distEntity <= this.gasPocketRadiusMeters) {
            const damageScale = 1 - (distEntity / this.gasPocketRadiusMeters) * 0.45;
            const inflicted = Math.round(this.ignitionBlastDamage * damageScale);
            entity.health = Math.max(0, Number(entity.health ?? 100) - inflicted);
            entity.burning = true;
            affectedEntities.push({
              entityId: entity.id ?? 'entity',
              damageDealt: inflicted,
              remainingHealth: entity.health
            });
          }
        }
      }
    }

    return {
      ignited: ignitedPockets.length > 0,
      ignitedPockets,
      affectedEntities
    };
  }

  update(dt = 0.016) {
    const safeDt = Math.max(0, Number(dt) || 0);
    for (const pocket of this.pockets) {
      if (pocket.ignited) {
        pocket.burnRemaining = Math.max(0, pocket.burnRemaining - safeDt);
        if (pocket.burnRemaining === 0) {
          pocket.ignited = false;
          pocket.regenTimer = this.seepRegenerationSeconds;
        }
      } else if (pocket.concentration < 1.0) {
        pocket.regenTimer = Math.max(0, pocket.regenTimer - safeDt);
        if (pocket.regenTimer === 0) {
          pocket.concentration = 1.0;
        }
      }
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      sectorId: this.sectorId,
      totalIgnitions: this.totalIgnitions,
      pockets: this.pockets.map((p) => ({
        id: p.id,
        ignited: p.ignited,
        concentration: Number(p.concentration.toFixed(2)),
        burnRemaining: Number(p.burnRemaining.toFixed(2))
      }))
    };
  }
}
