import * as THREE from 'three';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { applySurfaceDetail } from '../utils/surfaceDetail.js';
import { createSceneryCoverGeometry } from './SceneryGeometry.js';

const ROUTE_STYLE = Object.freeze({
  jungle: { route: 0xa89b7a, marker: 0x91b49b, event: 0xcba568, texture: 'jungle-ground', surface: 'soil', cover: 'wood', accent: 'foliage' },
  hive_lv426: { route: 0x81866b, marker: 0xa6b88a, event: 0xb0bf75, texture: 'hive-resin', surface: 'resin', cover: 'resin', accent: 'resin' },
  ryushi_desert: { route: 0xc4ad83, marker: 0xc9ae7c, event: 0xc69b69, texture: 'ryushi-sand', surface: 'sand', cover: 'stone', accent: 'stone' },
  yautja_prime: { route: 0x9f8873, marker: 0xc1a07a, event: 0x9cb6b3, texture: 'yautja-stone', surface: 'stone', cover: 'stone', accent: 'metal' },
  genna_deathworld: { route: 0xa19e75, marker: 0xa7b77b, event: 0xc4a875, texture: 'genna-deathworld-ground', surface: 'soil', cover: 'wood', accent: 'foliage' },
  stargazer_blacksite: { route: 0xa3abad, marker: 0x8aafb9, event: 0xc4a581, texture: 'stargazer-tactical-composite', surface: 'stone', cover: 'stone', accent: 'metal' },
  los_angeles_1997: { route: 0xb3a99c, marker: 0xc4ad91, event: 0x96b5ba, texture: 'los-angeles-heatwave-urban', surface: 'stone', cover: 'stone', accent: 'metal' },
  bouvetoya_pyramid: { route: 0xb8c4c6, marker: 0xa4bdc3, event: 0xba9a75, texture: 'bouvetoya-ice-rock', surface: 'ice', cover: 'ice', accent: 'ice' },
  gunnison_outbreak: { route: 0xa4aaa8, marker: 0x9aafb7, event: 0xb4ba8d, texture: 'gunnison-rain-urban', surface: 'stone', cover: 'stone', accent: 'metal' },
});

function createRouteEdgeMask() {
  const width = 64;
  const pixels = new Uint8Array(width * 4);
  for (let index = 0; index < width; index += 1) {
    const edge = Math.min(index, width - index - 1) / (width * 0.2);
    const alpha = THREE.MathUtils.smoothstep(edge, 0, 1);
    pixels.set([255, Math.round(alpha * 255), 255, 255], index * 4);
  }
  const texture = new THREE.DataTexture(pixels, width, 1, THREE.RGBAFormat);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function vectorFromLayout(value) {
  return new THREE.Vector3(
    Number(value?.[0]) || 0,
    Number(value?.[1]) || 0,
    Number(value?.[2]) || 0,
  );
}

/**
 * Renvoie le relief macro porté par les secteurs (terrasse, crête, estrade).
 * Le fondu radial évite les marches verticales tout en atteignant exactement
 * l'élévation déclarée au centre du secteur.
 */
export function sampleHuntSectorElevation(layout, xValue, zValue) {
  const x = Number(xValue) || 0;
  const z = Number(zValue) || 0;
  const influenceRadius = Math.max(72, Math.min(128, (Number(layout?.playableRadius) || 560) * 0.19));
  const plateauRadius = influenceRadius * 0.24;
  let strongestElevation = 0;

  for (const sector of layout?.sectors ?? []) {
    const elevation = Number(sector?.center?.[1]) || 0;
    if (Math.abs(elevation) < 0.001) continue;
    const distance = Math.hypot(x - (Number(sector.center[0]) || 0), z - (Number(sector.center[2]) || 0));
    if (distance >= influenceRadius) continue;
    const linear = distance <= plateauRadius
      ? 1
      : 1 - (distance - plateauRadius) / (influenceRadius - plateauRadius);
    const clamped = Math.max(0, Math.min(1, linear));
    const eased = clamped * clamped * (3 - 2 * clamped);
    const contribution = elevation * eased;
    if (Math.abs(contribution) > Math.abs(strongestElevation)) strongestElevation = contribution;
  }
  return strongestElevation;
}

function quadraticPoint(start, control, end, progress, target) {
  const inverse = 1 - progress;
  target.set(
    inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    0,
    inverse * inverse * start.z + 2 * inverse * progress * control.z + progress * progress * end.z,
  );
  return target;
}

function createRouteGeometry(route, sectorMap, sampleHeight) {
  const start = vectorFromLayout(sectorMap.get(route.from)?.center);
  const end = vectorFromLayout(sectorMap.get(route.to)?.center);
  const distance = start.distanceTo(end);
  const midpoint = start.clone().lerp(end, 0.5);
  const perpendicular = new THREE.Vector3(-(end.z - start.z), 0, end.x - start.x).normalize();
  const control = midpoint.addScaledVector(perpendicular, (Number(route.bend) || 0) * distance);
  const segmentCount = Math.max(24, Math.min(140, Math.ceil(distance / 6)));
  const positions = [];
  const indices = [];
  const uvs = [];
  const colors = [];
  const seed = [...String(route.id)].reduce((total, letter) => total + letter.charCodeAt(0), 0);
  const center = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const routeWidth = Math.max(4, Number(route.width) || 8);

  for (let index = 0; index <= segmentCount; index += 1) {
    const progress = index / segmentCount;
    const aheadProgress = Math.min(1, progress + 1 / segmentCount);
    quadraticPoint(start, control, end, progress, center);
    quadraticPoint(start, control, end, aheadProgress, ahead);
    if (progress === 1) {
      quadraticPoint(start, control, end, Math.max(0, progress - 1 / segmentCount), ahead);
      tangent.copy(center).sub(ahead);
    } else {
      tangent.copy(ahead).sub(center);
    }
    tangent.normalize();
    // Les bords restent dans le gabarit réservé, avec des rives érodées
    // plutôt que deux droites parfaites évoquant un ruban lumineux.
    const wear = 0.88 + 0.08 * Math.sin(progress * distance * 0.19 + seed) + 0.035 * Math.sin(progress * distance * 0.47);
    side.set(-tangent.z, 0, tangent.x).multiplyScalar(routeWidth * 0.5 * wear);
    // Chaque rive suit le relief : une altitude centrale enterrait le bord
    // amont et faisait flotter le bord aval des rubans sur les terrasses.
    for (const direction of [1, -1]) {
      const x = center.x + side.x * direction;
      const z = center.z + side.z * direction;
      positions.push(x, sampleHeight(x, z) + 0.11, z);
      uvs.push(direction === 1 ? 0 : 1, progress * distance / 12);
      const shade = 0.91 + 0.1 * Math.sin(x * 0.27 + z * 0.19) + 0.035 * Math.cos(z * 0.73 - x * 0.37);
      colors.push(shade, shade, shade);
    }
    if (index < segmentCount) {
      const base = index * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.userData.routeTriangleCount = indices.length / 3;
  return geometry;
}

function createSectorInstances(layout, sampleHeight, style, navigationSegments) {
  const padGeometry = new THREE.CylinderGeometry(7, 8.5, 0.35, 16);
  const padMaterial = new THREE.MeshStandardMaterial({
    color: style.route,
    map: getRuntimeTexture(`/assets/textures/${style.texture}.webp`, { repeat: [2, 2] }),
    emissiveIntensity: 0,
    roughness: 0.97,
    metalness: 0,
  });
  applySurfaceDetail(padMaterial, { kind: style.surface, repeat: [2, 2], normalStrength: 0.25, roughnessStrength: 0.2 });
  const pads = new THREE.InstancedMesh(padGeometry, padMaterial, layout.sectors.length);
  pads.name = 'hunt-sector-ground-markers';
  pads.receiveShadow = true;
  pads.userData.huntSectorBatch = true;

  const beaconGeometry = new THREE.CylinderGeometry(0.55, 1.25, 7, 8);
  const beaconMaterial = new THREE.MeshStandardMaterial({
    color: style.marker,
    emissive: style.marker,
    emissiveIntensity: 0.2,
    roughness: 0.38,
    metalness: 0.62,
  });
  const beacons = new THREE.InstancedMesh(beaconGeometry, beaconMaterial, layout.sectors.length);
  beacons.name = 'hunt-sector-navigation-beacons';
  beacons.castShadow = true;
  beacons.userData.huntSectorBatch = true;

  const transform = new THREE.Object3D();
  layout.sectors.forEach((sector, index) => {
    const [x, , z] = sector.center;
    const ground = sampleHeight(x, z);
    const roleScale = sector.role === 'boss_lair' ? 1.45 : sector.role === 'camp' ? 1.2 : 1;
    transform.position.set(x, ground + 0.12, z);
    transform.scale.set(roleScale, 1, roleScale);
    transform.rotation.set(0, index * 1.618, 0);
    transform.updateMatrix();
    pads.setMatrixAt(index, transform.matrix);

    // Le mât ne doit pas traverser le chasseur au largage ni barrer un
    // carrefour. Garder le repère en bordure des voies plutôt qu'au centre.
    let beaconX = x + 16;
    let beaconZ = z;
    let clear = false;
    for (let ring = 0; ring < 3 && !clear; ring += 1) {
      const distance = 16 + ring * 8;
      for (let step = 0; step < 16; step += 1) {
        const angle = index * 1.618 + step * 2.399963229728653;
        const candidateX = x + Math.cos(angle) * distance;
        const candidateZ = z + Math.sin(angle) * distance;
        if (Math.hypot(candidateX, candidateZ) > layout.playableRadius - 6) continue;
        if (!navigationSegments.every((segment) => distanceToRouteSegment(candidateX, candidateZ, segment) > segment.halfWidth + 4)) continue;
        beaconX = candidateX;
        beaconZ = candidateZ;
        clear = true;
        break;
      }
    }
    transform.position.set(beaconX, sampleHeight(beaconX, beaconZ) + 3.5 * roleScale, beaconZ);
    transform.scale.set(roleScale, roleScale, roleScale);
    transform.updateMatrix();
    beacons.setMatrixAt(index, transform.matrix);
  });
  for (const batch of [pads, beacons]) {
    batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    batch.instanceMatrix.needsUpdate = true;
    batch.computeBoundingBox();
    batch.computeBoundingSphere();
  }
  return [pads, beacons];
}

function createEventNodeInstances(layout, sampleHeight, style) {
  const geometry = new THREE.TorusGeometry(4.4, 0.38, 8, 24);
  const material = new THREE.MeshStandardMaterial({
    color: style.event,
    emissive: style.event,
    emissiveIntensity: 0.72,
    roughness: 0.4,
    metalness: 0.42,
  });
  const nodes = new THREE.InstancedMesh(geometry, material, layout.eventNodes.length);
  nodes.name = 'hunt-event-node-markers';
  nodes.userData.huntEventNodeBatch = true;
  const transform = new THREE.Object3D();
  layout.eventNodes.forEach((event, index) => {
    const [x, , z] = event.position;
    transform.position.set(x, sampleHeight(x, z) + 0.38, z);
    transform.rotation.set(Math.PI / 2, 0, index * 0.73);
    transform.scale.setScalar(event.eventType === 'boss_trail' ? 1.3 : 1);
    transform.updateMatrix();
    nodes.setMatrixAt(index, transform.matrix);
  });
  nodes.instanceMatrix.setUsage(THREE.StaticDrawUsage);
  nodes.instanceMatrix.needsUpdate = true;
  nodes.computeBoundingBox();
  nodes.computeBoundingSphere();
  return nodes;
}

function distanceToRouteSegment(x, z, segment) {
  const dx = segment.endX - segment.startX;
  const dz = segment.endZ - segment.startZ;
  const lengthSquared = dx * dx + dz * dz;
  const progress = lengthSquared > 0
    ? THREE.MathUtils.clamp(((x - segment.startX) * dx + (z - segment.startZ) * dz) / lengthSquared, 0, 1)
    : 0;
  return Math.hypot(x - segment.startX - dx * progress, z - segment.startZ - dz * progress);
}

function createOuterCoverInstances(layout, sampleHeight, style, navigationSegments) {
  const { body: coverGeometry, accent: accentGeometry } = createSceneryCoverGeometry(layout.biomeId);
  const tallCover = layout.biomeId !== 'ryushi_desert';
  coverGeometry.computeBoundingBox();
  coverGeometry.computeBoundingSphere();
  const vertices = coverGeometry.getAttribute('position');
  let coverRadius = 0;
  for (let index = 0; index < vertices.count; index += 1) {
    coverRadius = Math.max(coverRadius, Math.hypot(vertices.getX(index), vertices.getZ(index)));
  }
  if (['hive_lv426', 'genna_deathworld', 'bouvetoya_pyramid'].includes(layout.biomeId)) {
    coverRadius += Math.max(Math.abs(coverGeometry.boundingBox.min.y), Math.abs(coverGeometry.boundingBox.max.y)) * Math.sin(0.13);
  }
  if (!tallCover) coverRadius = coverGeometry.boundingSphere.radius;
  const placements = [];
  const reservedSignals = (layout.eventNodes ?? []).filter(({ eventType }) => (
    eventType === 'cache_drop' || eventType === 'boss_trail'
  ));
  const isClearPlacement = (x, z, radius) => {
    if (Math.hypot(x, z) > layout.playableRadius - 18) return false;
    if (Math.hypot(x - layout.startCamp[0], z - layout.startCamp[2]) < radius + 20) return false;
    if (reservedSignals.some(({ position }) => Math.hypot(x - position[0], z - position[2]) < radius + 8)) return false;
    if (placements.some((placed) => Math.hypot(x - placed.x, z - placed.z) < radius + coverRadius * placed.scale + 2)) return false;
    return navigationSegments.every((segment) => distanceToRouteSegment(x, z, segment) >= radius + segment.halfWidth + 2);
  };
  layout.sectors.forEach((sector, sectorIndex) => {
    const [centerX, , centerZ] = sector.center;
    const coverCount = sector.role === 'camp' ? 3 : 5;
    for (let index = 0; index < coverCount; index += 1) {
      const baseAngle = sectorIndex * 1.37 + index * 2.399963229728653;
      const baseDistance = 28 + ((sectorIndex * 17 + index * 13) % 25);
      const scale = 0.76 + ((sectorIndex + index) % 5) * 0.09;
      let placement = null;
      // Le couvert borde les voies et ménage le camp/les signaux interactifs.
      // Des positions déterministes alternatives conservent le budget sans
      // planter un bloc opaque en travers d'une branche de navigation.
      for (let ring = 0; ring < 3 && !placement; ring += 1) {
        const distance = baseDistance + ring * 12;
        for (let attempt = 0; attempt < 16; attempt += 1) {
          const angle = baseAngle + attempt * 2.399963229728653;
          const x = centerX + Math.cos(angle) * distance;
          const z = centerZ + Math.sin(angle) * distance;
          if (!isClearPlacement(x, z, coverRadius * scale)) continue;
          placement = {
            id: `${sector.id}-cover-${index + 1}`,
            sectorId: sector.id,
            x,
            z,
            ground: sampleHeight(x, z),
            angle,
            scale,
          };
          break;
        }
      }
      if (placement) placements.push(placement);
    }
  });

  // Le premier bloc garantit une couverture physique dans chaque secteur.
  // Les candidats supplémentaires sont ensuite répartis sur toute la liste
  // jusqu'à environ un collider pour trois silhouettes rendues.
  const physicalTarget = Math.max(layout.sectors.length, Math.ceil(placements.length / 3));
  const selectedPlacementIds = new Set();
  const physicalPlacements = [];
  for (const sector of layout.sectors) {
    const placement = placements.find(({ sectorId }) => sectorId === sector.id);
    if (!placement) continue;
    physicalPlacements.push(placement);
    selectedPlacementIds.add(placement.id);
  }
  for (let index = 0; index < placements.length && physicalPlacements.length < physicalTarget; index += 3) {
    const placement = placements[index];
    if (!placement || selectedPlacementIds.has(placement.id)) continue;
    physicalPlacements.push(placement);
    selectedPlacementIds.add(placement.id);
  }
  for (const placement of placements) {
    if (physicalPlacements.length >= physicalTarget) break;
    if (selectedPlacementIds.has(placement.id)) continue;
    physicalPlacements.push(placement);
    selectedPlacementIds.add(placement.id);
  }

  const coverMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: style.cover === 'resin' ? 0.48 : 0.86,
    metalness: layout.biomeId === 'yautja_prime' ? 0.24 : 0.02,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: style.accent === 'metal' ? 0.57 : 0.82,
    metalness: style.accent === 'metal' ? 0.62 : 0.03,
  });
  if (style.cover === 'wood') coverMaterial.map = getRuntimeTexture('/assets/textures/jungle-bark.webp', { repeat: [2, 3] });
  if (layout.biomeId === 'jungle') {
    accentMaterial.map = getRuntimeTexture('/assets/textures/deathworld-alien-flora.webp');
    accentMaterial.side = THREE.DoubleSide;
    accentMaterial.roughness = 0.96;
    accentMaterial.metalness = 0;
  }
  applySurfaceDetail(coverMaterial, { kind: style.cover, repeat: [2, 5], normalStrength: style.cover === 'stone' ? 0.3 : 0.6, roughnessStrength: 0.4 });
  applySurfaceDetail(accentMaterial, { kind: style.accent, repeat: [2, 2], normalStrength: layout.biomeId === 'jungle' ? 0.3 : 0.45, roughnessStrength: 0.4 });
  const cover = new THREE.InstancedMesh(
    coverGeometry,
    coverMaterial,
    placements.length,
  );
  const accents = new THREE.InstancedMesh(
    accentGeometry,
    accentMaterial,
    placements.length,
  );
  cover.name = 'hunt-outer-sector-cover';
  accents.name = 'hunt-outer-sector-accents';
  cover.castShadow = true;
  cover.receiveShadow = true;
  cover.userData.huntCoverBatch = true;
  accents.userData.huntCoverBatch = true;
  accents.receiveShadow = true;
  const transform = new THREE.Object3D();
  const transformedBounds = new THREE.Box3();
  placements.forEach((placement, index) => {
    transform.position.set(placement.x, 0, placement.z);
    transform.rotation.set(
      layout.biomeId === 'ryushi_desert' ? placement.angle * 0.11 : 0,
      placement.angle,
      ['hive_lv426', 'genna_deathworld', 'bouvetoya_pyramid'].includes(layout.biomeId)
        ? Math.sin(placement.angle) * 0.13
        : 0,
    );
    transform.scale.setScalar(placement.scale);
    transform.updateMatrix();
    transformedBounds.copy(cover.geometry.boundingBox).applyMatrix4(transform.matrix);
    // Le couvert industriel de Gunnison mesure 16 m, contre 30 m pour un
    // arbre. Ancrer les volumes réels évite les façades flottantes.
    transform.position.y = placement.ground - transformedBounds.min.y;
    placement.coverHeight = transformedBounds.max.y - transformedBounds.min.y;
    placement.topY = placement.ground + placement.coverHeight;
    transform.updateMatrix();
    cover.setMatrixAt(index, transform.matrix);
    const accentScale = placement.scale * (['jungle', 'genna_deathworld'].includes(layout.biomeId) ? 1 : 0.72);
    const rooftop = ['stargazer_blacksite', 'los_angeles_1997', 'gunnison_outbreak'].includes(layout.biomeId);
    transform.position.y = rooftop
      ? placement.topY - accentGeometry.boundingBox.min.y * accentScale
      : placement.topY - 2 * placement.scale;
    transform.scale.setScalar(accentScale);
    transform.updateMatrix();
    accents.setMatrixAt(index, transform.matrix);
    transformedBounds.copy(accentGeometry.boundingBox).applyMatrix4(transform.matrix);
    placement.topY = Math.max(placement.topY, transformedBounds.max.y);
    placement.coverHeight = placement.topY - placement.ground;
    const tint = new THREE.Color().setScalar(0.85 + ((index * 17) % 13) * 0.018);
    cover.setColorAt(index, tint);
    accents.setColorAt(index, tint);
  });
  for (const batch of [cover, accents]) {
    batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    batch.instanceMatrix.needsUpdate = true;
    batch.computeBoundingBox();
    batch.computeBoundingSphere();
  }
  return {
    batches: [cover, accents],
    count: placements.length,
    colliders: physicalPlacements.map((placement) => ({
      x: placement.x,
      z: placement.z,
      radius: coverRadius * placement.scale,
      height: placement.coverHeight,
      baseY: placement.ground,
      blocksProjectiles: true,
      sourceId: placement.id,
      sectorId: placement.sectorId,
      type: 'hunt-sector-cover',
    })),
    perches: tallCover
      ? placements.map((placement) => new THREE.Vector3(
        placement.x,
        placement.topY + placement.scale,
        placement.z,
      ))
      : [],
  };
}

/**
 * Construit le maillage de navigation d'une chasse ouverte. Les rubans rendent
 * les boucles lisibles depuis le sol sans transformer la carte en couloir.
 */
export function buildHuntRouteNetwork(layout, sampleHeight = () => 0) {
  const root = new THREE.Group();
  root.name = `hunt-route-network:${layout.biomeId}`;
  const style = ROUTE_STYLE[layout.biomeId] ?? ROUTE_STYLE.jungle;
  const sectorMap = new Map(layout.sectors.map((sector) => [sector.id, sector]));
  const sampleRouteHeight = (x, z) => (
    sampleHeight(x, z) + sampleHuntSectorElevation(layout, x, z)
  );
  const routeMaterial = new THREE.MeshStandardMaterial({
    color: style.route,
    map: getRuntimeTexture(`/assets/textures/${style.texture}.webp`),
    emissiveIntensity: 0,
    alphaMap: createRouteEdgeMask(),
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    alphaTest: 0.06,
    depthWrite: false,
    roughness: 0.93,
    metalness: 0.01,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  applySurfaceDetail(routeMaterial, { kind: style.surface, repeat: [1, 1], normalStrength: 0.55, roughnessStrength: 0.5 });
  let routeTriangles = 0;
  const navigationSegments = [];
  for (const route of layout.routes) {
    if (!sectorMap.has(route.from) || !sectorMap.has(route.to)) continue;
    const geometry = createRouteGeometry(route, sectorMap, sampleRouteHeight);
    const positions = geometry.getAttribute('position');
    for (let index = 0; index < positions.count - 2; index += 2) {
      navigationSegments.push({
        startX: (positions.getX(index) + positions.getX(index + 1)) * 0.5,
        startZ: (positions.getZ(index) + positions.getZ(index + 1)) * 0.5,
        endX: (positions.getX(index + 2) + positions.getX(index + 3)) * 0.5,
        endZ: (positions.getZ(index + 2) + positions.getZ(index + 3)) * 0.5,
        halfWidth: Math.max(4, Number(route.width) || 8) * 0.5,
      });
    }
    const mesh = new THREE.Mesh(geometry, routeMaterial);
    mesh.name = `hunt-route:${route.id}`;
    mesh.receiveShadow = true;
    mesh.userData.huntRoute = true;
    mesh.userData.routeId = route.id;
    mesh.userData.fromSectorId = route.from;
    mesh.userData.toSectorId = route.to;
    routeTriangles += geometry.userData.routeTriangleCount;
    root.add(mesh);
  }

  const sectorBatches = createSectorInstances(layout, sampleRouteHeight, style, navigationSegments);
  const eventBatch = createEventNodeInstances(layout, sampleRouteHeight, style);
  const outerCover = createOuterCoverInstances(layout, sampleRouteHeight, style, navigationSegments);
  root.add(...sectorBatches, eventBatch, ...outerCover.batches);
  root.userData.huntCoverColliders = outerCover.colliders;
  root.userData.huntPerches = outerCover.perches;
  const ecologyInstanceEstimate = (layout.ecology ?? []).reduce(
    (total, territory) => total + Math.max(0, Number(territory.count) || 0),
    0,
  );
  const instancedMarkerCount = layout.sectors.length * 2
    + layout.eventNodes.length
    + outerCover.count * 2;
  root.userData.huntLayoutMetrics = Object.freeze({
    sectorCount: layout.sectors.length,
    elevatedSectorCount: layout.sectors.filter(({ center }) => Math.abs(Number(center?.[1]) || 0) > 0.001).length,
    maxSectorElevation: Math.max(0, ...layout.sectors.map(({ center }) => Math.abs(Number(center?.[1]) || 0))),
    routeCount: layout.routes.length,
    eventNodeCount: layout.eventNodes.length,
    routeTriangles,
    coverInstanceCount: outerCover.count,
    physicalCoverColliderCount: outerCover.colliders.length,
    physicalCoverSectorCount: new Set(outerCover.colliders.map(({ sectorId }) => sectorId)).size,
    ecologyInstanceEstimate,
    sceneElementEstimate: layout.routes.length + instancedMarkerCount + ecologyInstanceEstimate,
    instancedMarkerCount,
    drawCallEstimate: layout.routes.length + sectorBatches.length + outerCover.batches.length + 1,
  });
  return root;
}
