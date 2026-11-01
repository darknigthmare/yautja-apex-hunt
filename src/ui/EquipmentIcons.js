// Interface silhouettes identify equipment; these are not official asset traces.
const EQUIPMENT_PATHS = Object.freeze({
  wristblades: '<path d="M7 25V12l4-9v19M17 25V12l4-9v19"/><path d="M5 24h20v5H5z"/>',
  plasmacaster_single: '<path d="M8 26v-9l4-5h12v9H13v5M6 28h11M12 12V8h8v4"/><circle cx="24" cy="16" r="4"/>',
  combi_stick: '<path d="M7 25 25 7M4 28l2-8 6 6zM20 6l8-2-2 8zM11 18l3 3M15 14l3 3"/>',
  smart_disc: '<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="3"/><path d="m16 4 2 5m8 1-5 3m5 10-6-3m-4 8-1-6M6 23l6-4M6 9l6 4"/>',
  netgun: '<path d="M5 12h18v11H8v5H5zM23 14h5v7h-5M8 12V8h11v4M9 17h11M12 14v6m5-6v6"/>',
  medicomp: '<path d="M4 10h24v18H4zM11 10V6h10v4M4 18h24M12 14h8m-4-4v8"/><path d="M10 22h4m5 0h3"/>',
  plasma_mines: '<circle cx="16" cy="15" r="8"/><circle cx="16" cy="15" r="3"/><path d="m12 22-5 6m13-6 5 6M16 7V2M9 9 5 6m18 3 4-3"/>',
  whip_thorns: '<path d="M7 26c-1-7 18-4 18-12S7 5 9 12s10 3 9 0M5 28l4-5m1-16 1-4m10 5 3-3m0 13 4 2m-12 1-2 4"/>',
  yautja_bow: '<path d="M10 3c17 10 17 16 0 26l8-13zM4 16h24m-5-4 5 4-5 4"/>',
  speargun: '<path d="M4 16h23v5H14l-4 7H6l3-7H4zM9 12h12v4M27 16l3 2-3 3M5 12h4"/>',
  feral_bolt_launcher: '<path d="M7 10h18v14H7zM10 6v4m6-6v6m6-4v4M12 24v5h5v-5"/><path d="M10 15h12m-12 4h12M25 14h4v7h-4"/>',
  wolf_dual_plasma: '<path d="M4 25V11h9v14M19 25V11h9v14M8 11V6h5v5m6 0V6h5v5M4 29h24M13 20h6"/><circle cx="8.5" cy="15" r="2"/><circle cx="23.5" cy="15" r="2"/>',
  eye_of_ra: '<path d="M3 16h25v4H13l-3 8H6l3-8H3zM9 12h10v4M19 10h6v6M23 5v5m-3-3h6"/><circle cx="28" cy="18" r="2"/>',
  father_sword: '<path d="m16 2 5 7-3 13h-4L11 9zM9 22h14M16 22v7M12 29h8"/>',
  wrist_rocket: '<path d="M11 23V10l5-7 5 7v13zM11 17l-5 7h5m10-7 5 7h-5M14 24l2 6 2-6"/><circle cx="16" cy="12" r="2"/>',
  wrist_shield: '<path d="M16 3 27 7v9c0 6-6 11-11 14C11 27 5 22 5 16V7zM16 7v18M9 10h14"/>',
  scout_drone: '<path d="m16 15-4-6L3 5l3 11 10 9 10-9 3-11-9 4zM16 15v10M8 15l8 4 8-4M13 27h6"/>',
  shuriken: '<path d="m16 2 3 9 10-4-5 10 6 9-11-3-3 8-3-9-10 4 5-10-6-9 11 3z"/><circle cx="16" cy="16" r="3"/>',
  apex_decoy: '<circle cx="16" cy="8" r="4"/><path d="M10 27v-9c0-6 12-6 12 0v9M5 8c-3 5-3 11 0 16M27 8c3 5 3 11 0 16M7 29h18"/>',
  victory_roar: '<path d="m9 9 7-5 7 5-2 15-5 4-5-4zM12 13h2m4 0h2M13 21h6M5 10c-3 4-3 8 0 12M27 10c3 4 3 8 0 12"/>',
});

export function getEquipmentIconSvg(id, size = 24) {
  const pixels = Number.isFinite(size) ? Math.max(12, Math.min(128, size)) : 24;
  const path = EQUIPMENT_PATHS[id] ?? '<path d="M6 6h20v20H6zM11 11h10v10H11z"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${pixels}" height="${pixels}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}

export const EQUIPMENT_ICON_IDS = Object.freeze(Object.keys(EQUIPMENT_PATHS));

const EXTRA_CRAFT_ICONS = Object.freeze({
  craft_shield_kalisk_bone: ['Bouclier osseux de Kalisk', '<path d="m40 8 25 10-4 31-21 23-21-23-4-31z"/><path d="m40 15-8 14 8 8 8-8zM25 39l15 10 15-10M30 55l10 7 10-7"/>'],
  craft_shield_engineer_obsidian: ['Pavois en obsidienne', '<path d="M40 9c29 0 31 45 0 63C9 54 11 9 40 9z"/><ellipse cx="40" cy="34" rx="13" ry="18"/><path d="M40 16v42M26 34h28M28 59l12 7 12-7"/>'],
  craft_weapon_praetorian_wrist_scythe: ['Doubles faux de poignet', '<path d="M20 64V28l15-19-5 34-4 21M43 64V28L58 9l-5 34-4 21M17 64h39v8H17z"/>'],
  craft_weapon_queen_spine_harpoon: ['Harpon en épine de Reine', '<path d="m17 66 41-45M47 27 62 8l-1 14 10-1-23 18M22 56l6 5M29 48l6 5M37 40l6 5M12 70l9-4"/>'],
  craft_mask_goliath_bone: ['Bio-masque osseux à cornes', '<path d="m40 16 18 6 4 26-22 23-22-23 4-26zM23 23 12 8l2 27m43-12L68 8l-2 27M24 37l10 3m12 0 10-3M40 42v14M31 58h18"/>'],
  craft_mask_broken_tusk_rhynth: ['Bio-masque à défenses de Rhynth', '<path d="m40 10 22 14-5 31-17 15-17-15-5-31zM26 34l9 4m10 0 9-4M22 50c-13 17 9 25 10 6M58 50c13 17-9 25-10 6M40 19v8m-5-4h10"/>'],
  craft_mask_engineer_astrolabe: ['Heaume à visière UV', '<path d="M18 30C18 3 62 3 62 30v25L40 71 18 55z"/><ellipse cx="40" cy="31" rx="17" ry="8"/><path d="M24 46h32M30 53h20M40 42v21M33 12l7 6 7-6"/>'],
  craft_armor_drone_chitin_greaves: ['Grèves et brassards en chitine', '<path d="m14 11 17 3-1 48-11 8-7-8zM49 14l17-3 2 51-7 8-11-8zM14 27l16 4M13 41l17 4M50 31l16-4M50 45l17-4M21 52v10m38-10v10"/>'],
  craft_armor_vydrach_sky_cloak: ['Manteau de cuir aérien', '<path d="m32 11 8 9 8-9 13 13 10 43-19-7-12 11-12-11-19 7 10-43zM24 24l4 36m28-36-4 36M40 20v45M20 49l8-7m32 7-8-7"/>'],
  craft_armor_weyland_titanium_harness: ['Harnais renforcé en titane', '<path d="m24 10 16 9 16-9 10 16-9 38H23l-9-38zM24 13l3 24 26 21m3-45-3 24-26 21M22 45h36M27 57h26M34 33h12v14H34z"/>'],
  craft_banner_broken_tusk_machiko: ['Étendard de Machiko et Dachande', '<path d="M16 72V9h44l-7 15 7 17H16M61 10l6 7-6 7M31 18l10 8-10 8M44 18l-7 8 7 8M11 72h12"/>'],
  craft_totem_multiverse_challenger: ['Totem des champions', '<path d="M31 11h18v56H31zM24 67h32v7H24zM25 16h30M24 35h32M25 54h30"/><circle cx="40" cy="25" r="5"/><path d="m35 43 5-5 5 5-5 5zM35 60h10M40 57v7"/>'],
  craft_totem_ancestral_5_scales: ['Pilier des cinq gabarits', '<path d="M30 7h20v62H30zM22 69h36v6H22zM34 16h12M33 27h14M32 38h16M31 49h18M30 60h20"/><path d="M37 12v8m3 3v8m-3 3v8m3 3v8m-3 3v8"/>'],
});

export function getAdditionalCraftIconSvg(id, size = 56) {
  const entry = EXTRA_CRAFT_ICONS[id];
  if (!entry) return null;
  const pixels = Number.isFinite(size) ? Math.max(12, Math.min(160, size)) : 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${pixels}" height="${pixels}" class="craft-logo craft-specific" role="img" aria-label="${entry[0]}"><circle cx="40" cy="40" r="37" fill="#101a1e" stroke="#657d83"/><g fill="none" stroke="#d6bd79" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${entry[1]}</g></svg>`;
}
