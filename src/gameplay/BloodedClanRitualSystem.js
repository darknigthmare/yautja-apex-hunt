// Système de rangs de clan et du rite de marquage du sang (Blooded Rite) (Lore 1:1)
// Référence canonique : AVP (2004) (rite de passage de Scar, Celtic et Chopper)

export const YAUTJA_CLAN_RANKS = Object.freeze([
  Object.freeze({ rankIndex: 0, id: 'unblooded', title: 'Non-Initié (Unblooded)', requiredHonor: 0, requiredXenoKills: 0, description: 'Chasseur débutant n\'ayant pas encore affronté de proie suprême.' }),
  Object.freeze({ rankIndex: 1, id: 'young_blood', title: 'Jeune Sang (Young Blood)', requiredHonor: 150, requiredXenoKills: 0, description: 'Initié envoyé pour sa première épreuve rituelle.' }),
  Object.freeze({ rankIndex: 2, id: 'blooded', title: 'Guerrier Marqué (Blooded Warrior)', requiredHonor: 400, requiredXenoKills: 1, description: 'A terrassé un Xénomorphe et porte la marque d\'acide de son clan sur son masque.' }),
  Object.freeze({ rankIndex: 3, id: 'elite', title: 'Chasseur d\'Élite (Elite Hunter)', requiredHonor: 1000, requiredXenoKills: 3, description: 'Guerrier chevronné capable de purger des contaminations en solitaire.' }),
  Object.freeze({ rankIndex: 4, id: 'clan_leader', title: 'Chef de Clan (Clan Leader)', requiredHonor: 2500, requiredXenoKills: 6, description: 'Guide d\'une nef de chasse transmettant les lois d\'honneur.' }),
  Object.freeze({ rankIndex: 5, id: 'elder', title: 'Ancien Vénéré (Elder)', requiredHonor: 5000, requiredXenoKills: 10, description: 'Maître séculaire siégeant au conseil du Vaisseau Mère.' }),
]);

export const CLAN_SCAR_MARKS = Object.freeze([
  Object.freeze({
    id: 'mark_scar_acid_rune',
    name: 'Marque d\'acide de Scar (Pyramide 2004)',
    sourceTier: 'AVP_SCREEN',
    sources: Object.freeze(['avp2004']),
    glyphSvg: 'lightning_crescent',
    prestigeMultiplier: 1.15,
    description: 'Empreinte corrosive brûlée au doigt sur l\'os frontal du masque.',
  }),
  Object.freeze({
    id: 'mark_celtic_slash',
    name: 'Cicatrices de Celtic (Antarctique)',
    sourceTier: 'AVP_SCREEN',
    sources: Object.freeze(['avp2004']),
    glyphSvg: 'double_claw_slash',
    prestigeMultiplier: 1.12,
    description: 'Double incision gravée au combat témoignant d\'un affrontement rapproché.',
  }),
  Object.freeze({
    id: 'mark_wolf_veteran_burn',
    name: 'Brûlure d\'acide de Wolf (Gunnison)',
    sourceTier: 'AVP_SCREEN',
    sources: Object.freeze(['avpRequiem2007']),
    glyphSvg: 'mandible_acid_melt',
    prestigeMultiplier: 1.22,
    description: 'Cicatrice asymétrique corrosive issue d\'une mission de confinement extrême.',
  }),
  Object.freeze({
    id: 'mark_elder_lineage',
    name: 'Sceau séculaire d\'Ancien (1715)',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator2']),
    glyphSvg: 'elder_triptych_arc',
    prestigeMultiplier: 1.30,
    description: 'Marquage d\'honneur suprême accordé par le chef du clan.',
  }),
]);

export function getClanRankByHonorAndKills(honorScore, xenoKills = 0) {
  const safeHonor = Math.max(0, Number(honorScore) || 0);
  const safeKills = Math.max(0, Number(xenoKills) || 0);

  let eligibleRank = YAUTJA_CLAN_RANKS[0];
  for (const rank of YAUTJA_CLAN_RANKS) {
    if (safeHonor >= rank.requiredHonor && safeKills >= rank.requiredXenoKills) {
      eligibleRank = rank;
    }
  }
  return eligibleRank;
}

export function createClanPrestigeState() {
  return {
    rankId: 'unblooded',
    honorScore: 0,
    xenoKills: 0,
    consecratedMarks: new Set(),
    activeMarkId: null,
  };
}

export function applyBloodedRitualMark(state, markId) {
  if (!state || !markId) return false;
  const mark = CLAN_SCAR_MARKS.find((m) => m.id === markId);
  if (!mark) return false;

  state.consecratedMarks.add(mark.id);
  state.activeMarkId = mark.id;
  return true;
}

export function calculateClanPrestigeBonus(state) {
  if (!state?.activeMarkId) return 1.0;
  const mark = CLAN_SCAR_MARKS.find((m) => m.id === state.activeMarkId);
  return mark?.prestigeMultiplier ?? 1.0;
}
