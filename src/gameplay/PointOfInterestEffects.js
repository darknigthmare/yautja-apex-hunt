const freezeProfile = (profile) => Object.freeze({
  healthRestore: 0,
  energyRestore: 0,
  staminaRestore: 0,
  honorMultiplier: 1,
  scan: null,
  ...profile,
  scan: profile.scan ? Object.freeze({ ...profile.scan }) : null,
});

/**
 * Profils gameplay des archives de terrain. Les chiffres sont centralisés
 * afin que le catalogue, le HUD et les tests partagent exactement les mêmes
 * effets au lieu de déduire une mécanique depuis le texte de lore.
 */
export const POINT_OF_INTEREST_EFFECT_PROFILES = Object.freeze({
  decode_record: freezeProfile({
    label: 'RÉCUPÉRATION DE TERRAIN',
    healthRestore: 30,
    energyRestore: 25,
  }),
  tune_beacon: freezeProfile({
    label: 'BALISE LONGUE PORTÉE',
    scan: { duration: 10, radius: 150 },
  }),
  scan_archive: freezeProfile({
    label: 'CARTOGRAPHIE TACTIQUE',
    energyRestore: 18,
    scan: { duration: 4, radius: 75 },
  }),
  scan_trophies: freezeProfile({
    label: 'RÉSONANCE DU CLAN',
    staminaRestore: 40,
    honorMultiplier: 1.2,
  }),
});

export const DEFAULT_POINT_OF_INTEREST_EFFECT_PROFILE = freezeProfile({
  label: 'ARCHIVE CLASSÉE',
});

const finitePositive = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const restoreBoundedStat = (player, statKey, maximumKey, requestedAmount) => {
  const requested = finitePositive(requestedAmount);
  if (!player || requested === 0) return 0;
  const current = finitePositive(player[statKey]);
  const declaredMaximum = Number(player[maximumKey]);
  const maximum = Number.isFinite(declaredMaximum)
    ? Math.max(0, declaredMaximum)
    : current;
  const normalizedCurrent = Math.min(current, maximum);
  const restored = Math.min(requested, Math.max(0, maximum - normalizedCurrent));
  player[statKey] = normalizedCurrent + restored;
  return restored;
};

const displayAmount = (value) => Math.round(finitePositive(value) * 10) / 10;

const pluralizedSignatures = (count) => (
  `${count} SIGNATURE${count === 1 ? '' : 'S'} RÉVÉLÉE${count === 1 ? '' : 'S'}`
);

export function applyPointOfInterestEffect(
  pointOfInterest,
  { player, activateScan } = {},
) {
  const interactionType = typeof pointOfInterest?.interactionType === 'string'
    ? pointOfInterest.interactionType
    : 'archive';
  const profile = POINT_OF_INTEREST_EFFECT_PROFILES[interactionType]
    ?? DEFAULT_POINT_OF_INTEREST_EFFECT_PROFILE;

  const healthRestored = restoreBoundedStat(
    player,
    'health',
    'maxHealth',
    profile.healthRestore,
  );
  const energyRestored = restoreBoundedStat(
    player,
    'energy',
    'maxEnergy',
    profile.energyRestore,
  );
  const staminaRestored = restoreBoundedStat(
    player,
    'stamina',
    'maxStamina',
    profile.staminaRestore,
  );

  let revealedCount = 0;
  if (profile.scan && typeof activateScan === 'function') {
    const revealed = Number(activateScan({
      scanDuration: profile.scan.duration,
      scanRadius: profile.scan.radius,
    }));
    revealedCount = Number.isFinite(revealed) ? Math.max(0, Math.trunc(revealed)) : 0;
  }

  const baseHonor = finitePositive(pointOfInterest?.honorAwarded ?? pointOfInterest?.honor);
  const honorRequested = Math.round(baseHonor * profile.honorMultiplier);
  const honorBonus = Math.max(0, honorRequested - Math.round(baseHonor));
  const detailParts = [profile.label];
  if (profile.healthRestore > 0) detailParts.push(`SANTÉ +${displayAmount(healthRestored)}`);
  if (profile.energyRestore > 0) detailParts.push(`ÉNERGIE +${displayAmount(energyRestored)}`);
  if (profile.staminaRestore > 0) detailParts.push(`ENDURANCE +${displayAmount(staminaRestored)}`);
  if (profile.scan) {
    detailParts.push(pluralizedSignatures(revealedCount));
    detailParts.push(`${profile.scan.duration} S / ${profile.scan.radius} M`);
  }
  if (honorBonus > 0) {
    detailParts.push(`BONUS D'HONNEUR ×${String(profile.honorMultiplier).replace('.', ',')}`);
  }

  return Object.freeze({
    interactionType,
    profile,
    healthRestored,
    energyRestored,
    staminaRestored,
    revealedCount,
    scanDuration: profile.scan?.duration ?? 0,
    scanRadius: profile.scan?.radius ?? 0,
    honorRequested,
    honorBonus,
    detail: detailParts.join(' · '),
  });
}
