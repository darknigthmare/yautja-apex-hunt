export const GRAPHICS_QUALITY_IDS = Object.freeze(['auto', 'performance', 'balanced', 'high', 'ultra']);

export function sanitizeGraphicsQuality(value) {
  return GRAPHICS_QUALITY_IDS.includes(value) ? value : 'auto';
}

export function resolveGraphicsQuality(value, { coarsePointer = false, deviceMemory = 8, hdrSupported = true } = {}) {
  const requested = sanitizeGraphicsQuality(value);
  if (!hdrSupported) return 'performance';
  if (requested !== 'auto') return requested;
  return coarsePointer || deviceMemory <= 4 ? 'balanced' : 'high';
}

export const GRAPHICS_PRESETS = Object.freeze({
  performance: Object.freeze({ pixelRatio: 1, post: false, aoScale: 0, bloom: false }),
  balanced: Object.freeze({ pixelRatio: 1.25, post: true, aoScale: 0, bloom: true }),
  high: Object.freeze({ pixelRatio: 1.5, post: true, aoScale: 0.5, bloom: true }),
  ultra: Object.freeze({ pixelRatio: 2, post: true, aoScale: 1, bloom: true }),
});
