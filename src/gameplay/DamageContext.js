/** Preserve the attack's declared damage family before inferring legacy signals. */
export function getIncomingDamageType(signal = {}) {
  const declared = signal.damageType;
  if (declared === 'corrosion' || declared === 'acid') return 'acid';
  if (['energy', 'plasma', 'fire', 'ballistic'].includes(declared)) return declared;
  const statuses = Array.isArray(signal.status) ? signal.status : [signal.status];
  if (statuses.includes('corrosion')) return 'acid';
  return signal.projectile ? 'ballistic' : 'generic';
}
