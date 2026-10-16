// Secteur de barricades de fils barbelés et fils monofilament rasoir (Lore 1:1)
// Référence canonique : Predators (2010) - Périmètre piégé de Royce avec câbles d'acier tranchants

import { audioSynth } from '../AudioSynthesizer.js';

export const RAZOR_CONSTANTS = {
  WIRE_DAMAGE: 95.0,
  BLEED_DPS: 16.0,
  BLEED_DURATION: 5.0,
};

export function createRazorWireSector() {
  return {
    wires: [],
  };
}

export function stringRazorWire(sector, pointA, pointB) {
  if (!sector || !pointA || !pointB) return null;
  const wire = {
    id: `wire_${sector.wires.length + 1}`,
    p1: { x: pointA.x, y: pointA.y || 1.2, z: pointA.z },
    p2: { x: pointB.x, y: pointB.y || 1.2, z: pointB.z },
    isCut: false,
  };
  sector.wires.push(wire);
  return wire;
}

export function checkRazorWireBreach(sector, startPos, endPos, entity, audio = audioSynth) {
  if (!sector || !startPos || !endPos || !entity) return false;

  for (const wire of sector.wires) {
    if (!wire.isCut) {
      // Intersection 2D simplifiée (X, Z) entre le déplacement et le câble
      const crossed = doSegmentsIntersect(startPos, endPos, wire.p1, wire.p2);
      if (crossed) {
        if (typeof entity.applyDamage === 'function') {
          entity.applyDamage(RAZOR_CONSTANTS.WIRE_DAMAGE, 'monofilament_wire_laceration');
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - RAZOR_CONSTANTS.WIRE_DAMAGE);
        }

        entity.isBleeding = true;
        entity.isKnockedProne = true;

        if (audio && typeof audio.playMonofilamentSlice === 'function') {
          audio.playMonofilamentSlice();
        }
        return true;
      }
    }
  }
  return false;
}

function doSegmentsIntersect(p1, p2, p3, p4) {
  function ccw(A, B, C) {
    return (C.z - A.z) * (B.x - A.x) > (B.z - A.z) * (C.x - A.x);
  }
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}
