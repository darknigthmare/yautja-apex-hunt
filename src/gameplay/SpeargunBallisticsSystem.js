// Balistique de précision et récupération des traits du Speargun (Lore 1:1)
// Référence canonique : Predator 2 (1990) (fusil-harpon et analyse balistique d'OWLF)

import { audioSynth } from '../AudioSynthesizer.js';

export function createSpearBoltProjectile(origin, direction, options = {}) {
  const dir = {
    x: direction?.x ?? 0,
    y: direction?.y ?? 0,
    z: direction?.z ?? 1,
  };
  const len = Math.hypot(dir.x, dir.y, dir.z) || 1;
  const normDir = { x: dir.x / len, y: dir.y / len, z: dir.z / len };

  const isStealth = Boolean(options.isCloaked);
  const baseDmg = Number(options.baseDamage) || 88;
  const finalDamage = Math.round(baseDmg * (isStealth ? 2.25 : 1.0));

  return {
    position: { x: origin?.x ?? 0, y: (origin?.y ?? 1.6), z: origin?.z ?? 0 },
    direction: normDir,
    speed: Number(options.speed) || 115.0,
    gravity: 3.2, // Faible chute balistique sur longue distance
    damage: finalDamage,
    isStealthShot: isStealth,
    isEmbedded: false,
    embeddedLocation: null,
    lifetime: 3.0,
    reclaimed: false,
  };
}

export function updateSpearBoltProjectile(bolt, delta, candidateTargets = []) {
  if (!bolt || bolt.isEmbedded || bolt.reclaimed) return bolt?.isEmbedded;
  const dt = Math.max(0, Number(delta) || 0);

  bolt.lifetime -= dt;
  if (bolt.lifetime <= 0) {
    bolt.isEmbedded = true;
    bolt.embeddedLocation = { ...bolt.position };
    return true;
  }

  const prevX = bolt.position.x;
  const prevZ = bolt.position.z;

  // Déplacement avec légère gravité balistique
  bolt.position.x += bolt.direction.x * bolt.speed * dt;
  bolt.position.y += (bolt.direction.y * bolt.speed - bolt.gravity * (3.0 - bolt.lifetime)) * dt;
  bolt.position.z += bolt.direction.z * bolt.speed * dt;

  // Détection d'impact sur cible avec balayage continu de segment (CCD)
  if (Array.isArray(candidateTargets)) {
    const segDx = bolt.position.x - prevX;
    const segDz = bolt.position.z - prevZ;
    const segLenSq = segDx * segDx + segDz * segDz;
    const hitRadiusSq = 2.2 * 2.2;

    for (const target of candidateTargets) {
      if (!target || target.isDead) continue;
      const tPos = target.position ?? target.mesh?.position;
      if (!tPos) continue;

      let distSq;
      if (segLenSq === 0) {
        distSq = (tPos.x - prevX) ** 2 + (tPos.z - prevZ) ** 2;
      } else {
        let t = ((tPos.x - prevX) * segDx + (tPos.z - prevZ) * segDz) / segLenSq;
        t = Math.max(0, Math.min(1, t));
        const projX = prevX + t * segDx;
        const projZ = prevZ + t * segDz;
        distSq = (tPos.x - projX) ** 2 + (tPos.z - projZ) ** 2;
      }

      if (distSq <= hitRadiusSq) {
        bolt.isEmbedded = true;
        bolt.embeddedLocation = { ...tPos };

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(bolt.damage);
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - bolt.damage);
          if (target.health <= 0) target.isDead = true;
        }

        return true;
      }
    }
  }

  return false;
}

export function tryReclaimEmbeddedBolt(bolt, playerPos, audio = audioSynth) {
  if (!bolt || !bolt.isEmbedded || bolt.reclaimed || !bolt.embeddedLocation) return false;

  const dx = playerPos.x - bolt.embeddedLocation.x;
  const dz = playerPos.z - bolt.embeddedLocation.z;
  const dist = Math.hypot(dx, dz);

  if (dist <= 2.2) {
    bolt.reclaimed = true;
    if (audio && typeof audio.playSpearBoltRetrieve === 'function') {
      audio.playSpearBoltRetrieve();
    }
    return true;
  }

  return false;
}
