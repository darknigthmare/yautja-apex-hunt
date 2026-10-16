// Secteur du Caveau des Trophées du Vaisseau Mère Yautja (Lore 1:1)
// Références canoniques : Predator 2 (1990) - Salle des trophées du vaisseau City Hunter ; AVP (2004)

export function createTrophyArchiveSector() {
  return {
    pedestals: [
      { id: 'pedestal_xeno_warrior', species: 'Xenomorph Warrior', skullMaterial: 'Chitin Black', honorValue: 120, isUnlocked: true },
      { id: 'pedestal_human_commando', species: 'Homo Sapiens Elite', skullMaterial: 'Polished Bone', honorValue: 95, isUnlocked: true },
      { id: 'pedestal_engineer_specimen', species: 'Engineer / Space Jockey', skullMaterial: 'Pale Calcified', honorValue: 200, isUnlocked: false },
    ],
    customHarvestedTrophies: [],
    totalCollectionHonor: 215,
  };
}

export function mountHarvestedTrophy(sector, trophy) {
  if (!sector || !trophy) return null;

  const entry = {
    id: `archive_trophy_${Date.now()}`,
    species: trophy.species || 'Unknown Prey',
    honorRating: Number(trophy.honorRating) || 80,
    weaponUsed: trophy.weaponUsed || 'Wristblades',
    harvestTimestamp: Date.now(),
  };

  sector.customHarvestedTrophies.push(entry);
  sector.totalCollectionHonor += entry.honorRating;
  return entry;
}

export function inspectTrophyPedestal(sector, pedestalId) {
  if (!sector) return null;
  const item = sector.pedestals.find(p => p.id === pedestalId);
  if (!item) return null;

  return {
    id: item.id,
    species: item.species,
    material: item.skullMaterial,
    honorValue: item.honorValue,
    status: item.isUnlocked ? 'PRESERVED_IN_VAULT' : 'LOCKED_AWAITING_HUNT',
  };
}

export function getArchiveCollectionSummary(sector) {
  if (!sector) return { totalTrophies: 0, totalHonor: 0 };
  const count = sector.pedestals.filter(p => p.isUnlocked).length + sector.customHarvestedTrophies.length;
  return {
    totalTrophies: count,
    totalHonor: sector.totalCollectionHonor,
    vaultRank: sector.totalCollectionHonor >= 300 ? 'Master Elder Arbiter' : 'Blooded Hunter',
  };
}
