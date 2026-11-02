import * as THREE from 'three';
import { HuntVehicle } from '../entities/HuntVehicle.js';

/** A chosen original transport departs from the actual insertion area. */
export function spawnShipDeploymentTransport(game) {
  const director = game.eventDirector;
  if (!director?.root?.isObject3D || !Array.isArray(director.vehicles) || !game.player?.position?.isVector3) return null;
  if (director.vehicleSpawnCount >= director.maxVehicles) return null;
  const transport = game.shipInterface?.services.getDeploymentTransport();
  if (!transport) return null;
  const preferred = game.player.position.clone().add(new THREE.Vector3(0, 0, -36));
  const safe = game.environment?.getSafeSpawnPosition?.(preferred, { clearance: 14 }) ?? preferred;
  const ground = safe.isVector3 ? safe.clone() : new THREE.Vector3(safe.x, safe.y ?? 0, safe.z);
  const colliderTop = director.getNearbyColliderTop?.(game.environment, ground) ?? ground.y;
  const hoverPoint = ground.clone(); hoverPoint.y = Math.max(ground.y + 20, colliderTop + 8);
  const vehicle = new HuntVehicle(director.root, {
    type: transport.vehicleType, state: 'leaving', hoverPoint,
    exitPoint: hoverPoint.clone().add(new THREE.Vector3(160, 70, -160)),
    durations: { leaving: transport.kind === 'pod' ? 4 : transport.kind === 'shuttle' ? 8 : 6 },
    reducedMotion: game.settings?.reducedMotion === true,
  });
  // Insertion is transport, not a freshly minted resupply/honour interaction.
  vehicle.interacted = true; vehicle.mesh.userData.interactable = false;
  vehicle.mesh.userData.deploymentTransport = { kind: transport.kind, sourceTier: 'ORIGINAL' };
  director.vehicles.push(vehicle); director.vehicleSpawnCount++;
  return vehicle;
}
