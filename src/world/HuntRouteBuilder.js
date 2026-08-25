import * as THREE from 'three';

const ROUTE_STYLE = Object.freeze({
  jungle: { route: 0x243c37, marker: 0x7de7d1, event: 0xffb347 },
  hive_lv426: { route: 0x1c3026, marker: 0x8cff9d, event: 0xc7ff45 },
  ryushi_desert: { route: 0x6f4c2d, marker: 0xffce7a, event: 0xff7138 },
  yautja_prime: { route: 0x432522, marker: 0xff8f70, event: 0x76f6ff },
  genna_deathworld: { route: 0x2f3823, marker: 0xcaff73, event: 0xff9454 },
  bouvetoya_pyramid: { route: 0x303b42, marker: 0x8feaff, event: 0xc58a52 },
});

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
  const segmentCount = Math.max(14, Math.min(30, Math.ceil(distance / 22)));
  const positions = [];
  const indices = [];
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
    side.set(-tangent.z, 0, tangent.x).multiplyScalar(routeWidth * 0.5);
    const elevation = sampleHeight(center.x, center.z) + 0.11;
    positions.push(center.x + side.x, elevation, center.z + side.z);
    positions.push(center.x - side.x, elevation, center.z - side.z);
    if (index < segmentCount) {
      const base = index * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.userData.routeTriangleCount = indices.length / 3;
  return geometry;
}

function createSectorInstances(layout, sampleHeight, style) {
  const padGeometry = new THREE.CylinderGeometry(7, 8.5, 0.35, 16);
  const padMaterial = new THREE.MeshStandardMaterial({
    color: style.route,
    emissive: style.marker,
    emissiveIntensity: 0.12,
    roughness: 0.84,
    metalness: 0.12,
  });
  const pads = new THREE.InstancedMesh(padGeometry, padMaterial, layout.sectors.length);
  pads.name = 'hunt-sector-ground-markers';
  pads.receiveShadow = true;
  pads.userData.huntSectorBatch = true;

  const beaconGeometry = new THREE.CylinderGeometry(0.55, 1.25, 7, 8);
  const beaconMaterial = new THREE.MeshStandardMaterial({
    color: style.marker,
    emissive: style.marker,
    emissiveIntensity: 0.58,
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

    transform.position.set(x, ground + 3.5, z);
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

function createOuterCoverInstances(layout, sampleHeight, style) {
  const geometryByBiome = {
    jungle: new THREE.CylinderGeometry(2.4, 4.8, 30, 10),
    hive_lv426: new THREE.ConeGeometry(4.6, 30, 9),
    ryushi_desert: new THREE.DodecahedronGeometry(7.5, 1),
    yautja_prime: new THREE.BoxGeometry(7, 30, 7, 2, 6, 2),
    genna_deathworld: new THREE.ConeGeometry(4.2, 27, 8),
    bouvetoya_pyramid: new THREE.CylinderGeometry(3.6, 5.2, 28, 6),
  };
  const accentGeometryByBiome = {
    jungle: new THREE.DodecahedronGeometry(9, 1),
    hive_lv426: new THREE.TorusGeometry(4.8, 0.75, 8, 18),
    ryushi_desert: new THREE.OctahedronGeometry(5.2, 1),
    yautja_prime: new THREE.OctahedronGeometry(3.2, 1),
    genna_deathworld: new THREE.SphereGeometry(4.8, 12, 8),
    bouvetoya_pyramid: new THREE.OctahedronGeometry(4.2, 1),
  };
  const placements = [];
  layout.sectors.forEach((sector, sectorIndex) => {
    const [centerX, , centerZ] = sector.center;
    const coverCount = sector.role === 'camp' ? 3 : 5;
    for (let index = 0; index < coverCount; index += 1) {
      const angle = sectorIndex * 1.37 + index * 2.399963229728653;
      const distance = 28 + ((sectorIndex * 17 + index * 13) % 25);
      const x = centerX + Math.cos(angle) * distance;
      const z = centerZ + Math.sin(angle) * distance;
      if (Math.hypot(x, z) > layout.playableRadius - 18) continue;
      placements.push({
        id: `${sector.id}-cover-${index + 1}`,
        sectorId: sector.id,
        x,
        z,
        ground: sampleHeight(x, z),
        angle,
        scale: 0.76 + ((sectorIndex + index) % 5) * 0.09,
      });
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
    color: style.route,
    emissive: style.marker,
    emissiveIntensity: 0.035,
    roughness: 0.9,
    metalness: ['yautja_prime', 'bouvetoya_pyramid'].includes(layout.biomeId) ? 0.26 : 0.04,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: style.marker,
    emissive: style.marker,
    emissiveIntensity: layout.biomeId === 'genna_deathworld' ? 0.36 : 0.08,
    roughness: 0.72,
    metalness: layout.biomeId === 'hive_lv426' ? 0.36 : 0.08,
  });
  const cover = new THREE.InstancedMesh(
    geometryByBiome[layout.biomeId] ?? geometryByBiome.jungle,
    coverMaterial,
    placements.length,
  );
  const accents = new THREE.InstancedMesh(
    accentGeometryByBiome[layout.biomeId] ?? accentGeometryByBiome.jungle,
    accentMaterial,
    placements.length,
  );
  cover.name = 'hunt-outer-sector-cover';
  accents.name = 'hunt-outer-sector-accents';
  cover.castShadow = true;
  cover.receiveShadow = true;
  cover.userData.huntCoverBatch = true;
  accents.userData.huntCoverBatch = true;
  const transform = new THREE.Object3D();
  const tallCover = layout.biomeId !== 'ryushi_desert';
  placements.forEach((placement, index) => {
    const baseHeight = tallCover ? 30 : 12;
    transform.position.set(placement.x, placement.ground + baseHeight * placement.scale * 0.5, placement.z);
    transform.rotation.set(
      layout.biomeId === 'ryushi_desert' ? placement.angle * 0.11 : 0,
      placement.angle,
      ['hive_lv426', 'genna_deathworld', 'bouvetoya_pyramid'].includes(layout.biomeId)
        ? Math.sin(placement.angle) * 0.13
        : 0,
    );
    transform.scale.setScalar(placement.scale);
    transform.updateMatrix();
    cover.setMatrixAt(index, transform.matrix);
    transform.position.y = placement.ground + (tallCover ? 28 : 9) * placement.scale;
    transform.scale.setScalar(placement.scale * (layout.biomeId === 'jungle' ? 1 : 0.72));
    if (layout.biomeId === 'hive_lv426') transform.rotation.x = Math.PI / 2;
    transform.updateMatrix();
    accents.setMatrixAt(index, transform.matrix);
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
      radius: (tallCover ? 4.5 : 7.5) * placement.scale,
      height: (tallCover ? 34 : 15) * placement.scale,
      baseY: placement.ground,
      blocksProjectiles: true,
      sourceId: placement.id,
      sectorId: placement.sectorId,
      type: 'hunt-sector-cover',
    })),
    perches: tallCover
      ? placements.map((placement) => new THREE.Vector3(
        placement.x,
        placement.ground + 31 * placement.scale,
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
    emissive: style.marker,
    emissiveIntensity: 0.012,
    roughness: 0.99,
    metalness: 0.01,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  let routeTriangles = 0;
  for (const route of layout.routes) {
    if (!sectorMap.has(route.from) || !sectorMap.has(route.to)) continue;
    const geometry = createRouteGeometry(route, sectorMap, sampleRouteHeight);
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

  const sectorBatches = createSectorInstances(layout, sampleRouteHeight, style);
  const eventBatch = createEventNodeInstances(layout, sampleRouteHeight, style);
  const outerCover = createOuterCoverInstances(layout, sampleRouteHeight, style);
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
