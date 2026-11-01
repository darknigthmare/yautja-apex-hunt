// The first five prop compositions predate the open-world layouts. Keep their
// dimensions and source identities, but place them in the districts they name.
const DISTRICTS = Object.freeze({
  "jungle": {
    "jungle-west-ritual-gate": "jungle-root-maze",
    "jungle-east-command-camp": "jungle-wreck",
    "jungle-north-trophy-tree": "jungle-trophy-grove",
    "jungle-west-cover": "jungle-low-caves",
    "jungle-east-cover": "jungle-hunt-ridge",
    "jungle-south-wreck": "jungle-wreck",
    "jungle-route-beacons": "jungle-apex-crown",
    "jungle-river-stones": "jungle-river"
  },
  "hive_lv426": {
    "hive-south-bulkhead": "hive-crossing",
    "hive-west-nursery": "hive-nursery",
    "hive-north-royal-dais": "hive-royal",
    "hive-east-colonial-wreck": "hive-machinery",
    "hive-west-rib-corridor": "hive-hosts",
    "hive-east-rib-corridor": "hive-vents",
    "hive-host-cocoons": "hive-cocoons",
    "hive-cleaner-traces": "hive-acid"
  },
  "ryushi_desert": {
    "ryushi-north-homestead": "ryushi-homestead",
    "ryushi-west-water-tower": "ryushi-pens",
    "ryushi-east-stock-pen": "ryushi-pens",
    "ryushi-south-buried-crawler": "ryushi-crawler",
    "ryushi-west-windbreak": "ryushi-canyon",
    "ryushi-east-windbreak": "ryushi-seismic",
    "ryushi-signal-masts": "ryushi-apex",
    "ryushi-bone-trail": "ryushi-tunnels"
  },
  "yautja_prime": {
    "prime-north-elder-gate": "prime-apex",
    "prime-center-blooding-dais": "prime-dais",
    "prime-west-weapon-shrine": "prime-forge",
    "prime-east-trophy-gallery": "prime-gallery",
    "prime-west-low-cover": "prime-trials",
    "prime-east-low-cover": "prime-beasts",
    "prime-clan-braziers": "prime-pillars",
    "prime-spectator-totems": "prime-dais"
  },
  "genna_deathworld": {
    "genna-west-expedition-wreck": "genna-wreck",
    "genna-north-kalisk-nest": "genna-kalisk",
    "genna-east-synthetic-array": "genna-array",
    "genna-west-spore-grove": "genna-spores",
    "genna-east-spore-grove": "genna-grazers",
    "genna-regen-nodes": "genna-regen",
    "genna-bone-arch-west": "genna-thorns",
    "genna-bone-arch-east": "genna-grazers"
  }
});

const HAZARD_ANCHORS = Object.freeze({
  'jungle-hazard-snare-vines': 'jungle-east-cover',
  'hive-hazard-acid-west': 'hive-west-rib-corridor',
  'hive-hazard-acid-east': 'hive-east-rib-corridor',
  'ryushi-hazard-heat-vent': 'ryushi-east-windbreak',
  'prime-hazard-plasma-brazier': 'prime-clan-braziers',
  'genna-hazard-spore-west': 'genna-west-spore-grove',
  'genna-hazard-spore-east': 'genna-east-spore-grove',
});

function routeSegments(layout) {
  const sectors = new Map(layout.sectors.map(sector => [sector.id, sector]));
  const segments = [];
  for (const route of layout.routes) {
    const start = sectors.get(route.from)?.center;
    const end = sectors.get(route.to)?.center;
    if (!start || !end) continue;
    const dx = end[0] - start[0], dz = end[2] - start[2];
    const distance = Math.hypot(dx, dz);
    const controlX = (start[0] + end[0]) * 0.5 - dz * (route.bend || 0);
    const controlZ = (start[2] + end[2]) * 0.5 + dx * (route.bend || 0);
    const steps = Math.max(24, Math.min(140, Math.ceil(distance / 6)));
    let previous = [start[0], start[2]];
    for (let step = 1; step <= steps; step++) {
      const t = step / steps, inverse = 1 - t;
      const next = [inverse * inverse * start[0] + 2 * inverse * t * controlX + t * t * end[0], inverse * inverse * start[2] + 2 * inverse * t * controlZ + t * t * end[2]];
      segments.push({ ax: previous[0], az: previous[1], bx: next[0], bz: next[1], halfWidth: Math.max(4, Number(route.width) || 8) * 0.5 });
      previous = next;
    }
  }
  return segments;
}

function distanceToSegment(x, z, segment) {
  const dx = segment.bx - segment.ax, dz = segment.bz - segment.az;
  const t = Math.max(0, Math.min(1, ((x - segment.ax) * dx + (z - segment.az) * dz) / Math.max(0.001, dx * dx + dz * dz)));
  return Math.hypot(x - segment.ax - t * dx, z - segment.az - t * dz);
}

function placementRadius(prop) {
  const scale = Number(prop.scale) || 1;
  const decorationRadius = ['beacon_line', 'stone_line', 'bone_line', 'rib_corridor', 'regen_node_line'].includes(prop.type) ? 24 : 18;
  return Math.max(Number(prop.colliderRadius) || decorationRadius, 6) * scale;
}

/** Resolve old arena compositions once, before generating cover or colliders. */
export function resolveWorldPropLayout(plan, layout) {
  const districtIds = DISTRICTS[plan.biomeId];
  if (!districtIds || !layout?.sectors?.length) return plan;
  // A future authored open-world plan must not be expanded a second time.
  if (plan.props.some(prop => Math.hypot(prop.position[0], prop.position[2]) > layout.playableRadius * 0.4)) return plan;
  const sectors = new Map(layout.sectors.map(sector => [sector.id, sector]));
  const routes = routeSegments(layout);
  const placed = [];
  const props = plan.props.map((prop) => {
    const sector = sectors.get(districtIds[prop.id]);
    if (!sector) return { ...prop, position: [...prop.position], authoredPosition: [...prop.position] };
    const radius = placementRadius(prop);
    const seed = [...prop.id].reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
    let selected;
    for (let ring = 0; ring < 7 && !selected; ring++) {
      const distance = Math.max(40, radius + 20) + ring * 14;
      for (let step = 0; step < 24; step++) {
        const angle = seed * 0.17 + step * 2.399963229728653;
        const x = sector.center[0] + Math.cos(angle) * distance;
        const z = sector.center[2] + Math.sin(angle) * distance;
        if (Math.hypot(x, z) > layout.playableRadius - radius - 20) continue;
        if (Math.hypot(x - layout.startCamp[0], z - layout.startCamp[2]) < radius + 24) continue;
        if (routes.some(segment => distanceToSegment(x, z, segment) < radius + segment.halfWidth + 4)) continue;
        if (placed.some(other => Math.hypot(x - other.position[0], z - other.position[2]) < radius + other.layoutRadius + 8)) continue;
        selected = [x, prop.position[1], z];
        break;
      }
    }
    const result = { ...prop, position: selected || [...prop.position], authoredPosition: [...prop.position], layoutSectorId: sector.id, layoutRadius: radius, layoutResolved: Boolean(selected) };
    placed.push(result);
    return result;
  });
  const byId = new Map(props.map(prop => [prop.id, prop]));
  const relocateCompanion = entry => {
    const explicitAnchor = byId.get(HAZARD_ANCHORS[entry.id]);
    const anchor = explicitAnchor || props.reduce((nearest, prop) => {
      const distance = Math.hypot(entry.position[0] - prop.authoredPosition[0], entry.position[2] - prop.authoredPosition[2]);
      return !nearest || distance < nearest.distance ? { prop, distance } : nearest;
    }, null)?.prop;
    if (!anchor?.authoredPosition) return { ...entry, position: [...entry.position] };
    return {
      ...entry,
      authoredPosition: [...entry.position],
      position: [entry.position[0] + anchor.position[0] - anchor.authoredPosition[0], entry.position[1], entry.position[2] + anchor.position[2] - anchor.authoredPosition[2]],
      layoutAnchorId: anchor.id,
      layoutSectorId: anchor.layoutSectorId,
    };
  };
  return { ...plan, props, pointsOfInterest: plan.pointsOfInterest.map(relocateCompanion), hazardZones: plan.hazardZones.map(relocateCompanion) };
}

/** Reuse the legacy scenery budget along the actual journeys, not a tiny ring. */
export function getTravelSceneryPlacement(layout, index, count, radius, reservedFootprints = []) {
  const segments = routeSegments(layout);
  const length = segments.reduce((sum, segment) => sum + Math.hypot(segment.bx - segment.ax, segment.bz - segment.az), 0);
  if (!segments.length || length <= 0) return null;
  const reservedSignals = (layout.eventNodes || []).filter(event => ['cache_drop', 'boss_trail'].includes(event.eventType));
  for (let attempt = 0; attempt < 20; attempt++) {
    let remaining = ((index + 0.5) / count * length + attempt * 17) % length;
    let selected = segments[segments.length - 1];
    let distance = 1;
    for (const segment of segments) {
      distance = Math.hypot(segment.bx - segment.ax, segment.bz - segment.az);
      if (remaining <= distance) { selected = segment; break; }
      remaining -= distance;
    }
    const progress = Math.min(1, remaining / Math.max(0.001, distance));
    const dx = selected.bx - selected.ax, dz = selected.bz - selected.az;
    const side = (index + attempt) % 2 ? 1 : -1;
    const offset = (selected.halfWidth + radius + 5 + index % 4 * 2) * side;
    const x = selected.ax + dx * progress - dz / Math.max(0.001, distance) * offset;
    const z = selected.az + dz * progress + dx / Math.max(0.001, distance) * offset;
    if (Math.hypot(x, z) > layout.playableRadius - radius - 15) continue;
    if (layout.sectors.some(sector => Math.hypot(x - sector.center[0], z - sector.center[2]) < radius + 22)) continue;
    if (reservedSignals.some(event => Math.hypot(x - event.position[0], z - event.position[2]) < radius + 10)) continue;
    if (reservedFootprints.some(footprint => Math.hypot(x - footprint.x, z - footprint.z) < radius + (Number(footprint.radius) || 0) + 3)) continue;
    if (segments.some(segment => distanceToSegment(x, z, segment) < radius + segment.halfWidth + 3)) continue;
    return { x, z };
  }
  return null;
}
