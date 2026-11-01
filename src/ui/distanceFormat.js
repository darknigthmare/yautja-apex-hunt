import { WORLD_UNITS_PER_METER } from '../utils/worldScale.js';

/** Display-only conversion. Gameplay positions and ranges stay in world units. */
export function formatWorldDistance(worldDistance, { fractionDigits = 0, unknown = 'DISTANCE INCONNUE' } = {}) {
  if (!Number.isFinite(worldDistance) || worldDistance < 0) return unknown;
  const digits = Number.isInteger(fractionDigits) ? Math.min(2, Math.max(0, fractionDigits)) : 0;
  return `${(worldDistance / WORLD_UNITS_PER_METER).toFixed(digits)} m`;
}
