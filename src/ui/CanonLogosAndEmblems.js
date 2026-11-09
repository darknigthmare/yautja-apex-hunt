import { getAdditionalCraftIconSvg } from './EquipmentIcons.js';

/**
 * Signaux SVG des factions, contrats et équipements du catalogue.
 * Ces dessins d'interface ne constituent pas des tracés d'assets officiels.
 */

export const CANON_FACTION_COLORS = Object.freeze({
  yautjaRed: '#ff2a14',
  yautjaGold: '#e5a93b',
  weylandGold: '#e5b324',
  weylandSteel: '#7a8b99',
  uscmBlue: '#1a3d6d',
  uscmGold: '#d4af37',
  engineerCyan: '#38efdf',
  engineerBiomech: '#1b262c',
  xenoAcid: '#88ff00',
  batmanYellow: '#ffe600',
  jokerPurple: '#7b1fa2',
  terminatorRed: '#ff0033',
  dreddGold: '#ffd700',
  supermanBlue: '#0044cc',
  supermanRed: '#cc0000',
  tarzanGreen: '#689f38',
  magnusCyan: '#00b4d8',
  grendelCrimson: '#d50000',
  theMaskToxic: '#76ff03',
  buffyMagenta: '#e91e63',
  archieGold: '#fbc02d',
  owlfCyan: '#00e5ff',
  stargazerRed: '#ff1744',
  theDarknessGreen: '#1b5e20',
  robocopSteel: '#78909c',
  kanoRed: '#b71c1c',
  xfilesCyan: '#0288d1',
  greenLanternEmerald: '#00e676',
  grifterRed: '#c62828',
  jlaGold: '#ffd700',
  bloodlinesCrimson: '#880e4f',
  seegsonWhite: '#eceff1',
  borgiaCyan: '#00e5ff',
});

/**
 * Emblème 1:1 du Clan Yautja — La Marque de l'Initié (Clan Oram-gai / Scar Mark).
 * Le glyphe sacré gravé à l'acide sur le casque et l'os frontal des Jeunes Sangs.
 */
export function getYautjaClanLogo(size = 64, color = CANON_FACTION_COLORS.yautjaRed) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="canon-logo logo-yautja" role="img" aria-label="Emblème du Clan Yautja">
      <defs>
        <filter id="glow-yautja-${size}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="grad-yautja-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff5533" />
          <stop offset="60%" stop-color="${color}" />
          <stop offset="100%" stop-color="#880e04" />
        </linearGradient>
      </defs>
      <!-- Fond bouclier d'alliage Yautja -->
      <polygon points="50,4 92,24 82,82 50,98 18,82 8,24" fill="#0d1117" stroke="#2c3540" stroke-width="2.5" />
      <polygon points="50,10 86,28 78,78 50,92 22,78 14,28" fill="none" stroke="${color}" stroke-width="1" opacity="0.45" />
      
      <!-- Faisceau de visée Tri-Laser triangulaire Yautja -->
      <circle cx="50" cy="22" r="3.2" fill="#ff1100" filter="url(#glow-yautja-${size})" />
      <circle cx="36" cy="46" r="3.2" fill="#ff1100" filter="url(#glow-yautja-${size})" />
      <circle cx="64" cy="46" r="3.2" fill="#ff1100" filter="url(#glow-yautja-${size})" />
      <path d="M50 22 L36 46 L64 46 Z" fill="none" stroke="#ff2200" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.65" />

      <!-- Glyphe Sacré du Sang (Oram-gai Slash Mark) -->
      <g filter="url(#glow-yautja-${size})">
        <path d="M42 34 L58 68 L64 64 L50 30 Z" fill="url(#grad-yautja-${size})" />
        <path d="M34 52 L66 52 L62 58 L38 58 Z" fill="url(#grad-yautja-${size})" />
        <path d="M48 64 L52 82 L46 82 Z" fill="url(#grad-yautja-${size})" />
      </g>
      <!-- Glyphes numériques Yautja latéraux -->
      <path d="M24 38 L30 38 M24 44 L28 44 M26 50 L30 50" stroke="${color}" stroke-width="1.8" stroke-linecap="round" />
      <path d="M76 38 L70 38 M76 44 L72 44 M74 50 L70 50" stroke="${color}" stroke-width="1.8" stroke-linecap="round" />
    </svg>
  `.trim();
}

/**
 * Logo Officiel 1:1 Weyland-Yutani Corp — "Building Better Worlds".
 * Les ailes angulaires imbriquées 'W' et 'Y' en or et acier brossé.
 */
export function getWeylandYutaniLogo(size = 80, showText = true) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="${size * 2}" height="${size}" class="canon-logo logo-weyland-yutani" role="img" aria-label="Logo Weyland-Yutani Corp">
      <defs>
        <linearGradient id="wy-gold-${size}" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="#fff1aa" />
          <stop offset="45%" stop-color="#d4af37" />
          <stop offset="100%" stop-color="#8a6812" />
        </linearGradient>
        <linearGradient id="wy-steel-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#495563" />
          <stop offset="100%" stop-color="#1e252e" />
        </linearGradient>
      </defs>
      <!-- W-Y Interlocking Wings Architecture -->
      <g transform="translate(10, 4)">
        <!-- Aile Gauche 'W' -->
        <polygon points="10,8 34,8 52,50 38,50 26,22 14,50 0,50" fill="url(#wy-gold-${size})" stroke="#121820" stroke-width="1.2" />
        <!-- Aile Droite 'W' -->
        <polygon points="130,8 106,8 88,50 102,50 114,22 126,50 140,50" fill="url(#wy-gold-${size})" stroke="#121820" stroke-width="1.2" />
        <!-- Poutre Centrale 'Y' imbriquée -->
        <polygon points="54,8 86,8 78,26 62,26" fill="url(#wy-gold-${size})" />
        <polygon points="62,26 78,26 76,50 64,50" fill="url(#wy-steel-${size})" stroke="url(#wy-gold-${size})" stroke-width="1.2" />
        <!-- Chevrons sous-jacents -->
        <polygon points="46,30 94,30 70,54" fill="#0b1016" stroke="url(#wy-gold-${size})" stroke-width="1.8" />
        <polygon points="56,33 84,33 70,48" fill="url(#wy-gold-${size})" />
      </g>
      ${showText ? `
        <!-- Typographie officielle Weyland-Yutani -->
        <text x="80" y="66" font-family="'Orbitron', 'Rajdhani', sans-serif" font-size="10.5" font-weight="900" fill="#e5b324" letter-spacing="3" text-anchor="middle">WEYLAND-YUTANI</text>
        <text x="80" y="76" font-family="'Rajdhani', sans-serif" font-size="6.5" font-weight="700" fill="#99aab8" letter-spacing="2" text-anchor="middle">BUILDING BETTER WORLDS</text>
      ` : ''}
    </svg>
  `.trim();
}

/**
 * Emblème Officiel 1:1 United States Colonial Marines (USCM).
 * Aigle américain stylisé aux ailes déployées et globe terrestre central.
 */
export function getUSCMLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="canon-logo logo-uscm" role="img" aria-label="Insigne USCM Colonial Marines">
      <defs>
        <linearGradient id="uscm-eagle-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8d468" />
          <stop offset="100%" stop-color="#a67c1e" />
        </linearGradient>
      </defs>
      <!-- Cercle écusson marine -->
      <circle cx="50" cy="50" r="46" fill="#0c1829" stroke="#1f447a" stroke-width="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#d4af37" stroke-width="1.2" />
      
      <!-- Aigle stylisé USCM -->
      <path d="M50 16 L56 26 L66 22 L72 32 L84 28 L86 42 L74 52 L78 64 L66 60 L60 72 L50 66 L40 72 L34 60 L22 64 L26 52 L14 42 L16 28 L28 32 L34 22 L44 26 Z" fill="url(#uscm-eagle-${size})" opacity="0.95" />
      
      <!-- Globe Terrestre / Vaisseau -->
      <circle cx="50" cy="46" r="15" fill="#17355e" stroke="#f8d468" stroke-width="1.5" />
      <ellipse cx="50" cy="46" rx="15" ry="6" fill="none" stroke="#68a5e8" stroke-width="1" />
      <line x1="50" y1="31" x2="50" y2="61" stroke="#68a5e8" stroke-width="1" />
      
      <!-- Bannière USCM -->
      <path d="M22 76 Q50 84 78 76 L74 88 Q50 94 26 88 Z" fill="#0b1726" stroke="#d4af37" stroke-width="1.5" />
      <text x="50" y="85" font-family="'Orbitron', sans-serif" font-size="7.5" font-weight="900" fill="#f8d468" letter-spacing="1.5" text-anchor="middle">U.S.C.M.</text>
    </svg>
  `.trim();
}

/**
 * Emblème Primordial 1:1 des Ingénieurs / Architectes (Prometheus).
 * L'Urne Sacrificielle, le Pathogène Chimique A0-3959X.91-15 et la Fresque Astrolabe.
 */
export function getEngineerLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="canon-logo logo-engineer" role="img" aria-label="Sigil des Ingénieurs Architectes">
      <defs>
        <linearGradient id="eng-biom-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38efdf" />
          <stop offset="70%" stop-color="#0e6973" />
          <stop offset="100%" stop-color="#041820" />
        </linearGradient>
      </defs>
      <!-- Disque d'Obsidienne Primordiale -->
      <circle cx="50" cy="50" r="46" fill="#060c10" stroke="#1f4e5b" stroke-width="2.5" />
      
      <!-- Anneaux Concentriques de l'Astrolabe de Navigation Derelict -->
      <circle cx="50" cy="50" r="38" fill="none" stroke="#23828f" stroke-width="1.2" stroke-dasharray="4,3" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#38efdf" stroke-width="0.9" opacity="0.6" />
      
      <!-- Silhouette de l'Urne Sacrificielle en Vase d'Ampoules Noires -->
      <path d="M38 32 Q50 24 62 32 L60 62 Q50 72 40 62 Z" fill="url(#eng-biom-${size})" stroke="#38efdf" stroke-width="1.8" />
      <ellipse cx="50" cy="32" rx="12" ry="4" fill="#1b262c" stroke="#38efdf" stroke-width="1.2" />
      
      <!-- Gouttelettes du Pathogène Noir (Black Goo Mutagen) -->
      <circle cx="50" cy="46" r="3.5" fill="#00ffff" />
      <path d="M50 40 Q53 46 50 52 Q47 46 50 40" fill="#00e5ff" />
      <circle cx="44" cy="54" r="2" fill="#00b4d8" />
      <circle cx="56" cy="54" r="2" fill="#00b4d8" />
      
      <!-- Glyphes Cunéiformes Bio-Mécaniques des Ingénieurs -->
      <path d="M50 12 L50 20 M50 80 L50 88 M12 50 L20 50 M80 50 L88 50" stroke="#38efdf" stroke-width="2" stroke-linecap="round" />
    </svg>
  `.trim();
}

/**
 * Emblème 1:1 de la Ruche Xénomorphe (Aliens).
 * Silhouette biomécanique de l'œuf ovomorph, de la crête royale et du dard caudal.
 */
export function getXenomorphHiveLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="canon-logo logo-xenomorph" role="img" aria-label="Sigil de la Ruche Xénomorphe">
      <defs>
        <linearGradient id="xeno-acid-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#b8ff00" />
          <stop offset="60%" stop-color="#55cc00" />
          <stop offset="100%" stop-color="#113300" />
        </linearGradient>
      </defs>
      <!-- Fond hexagonal chitineux -->
      <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#070c08" stroke="#1d4420" stroke-width="2" />
      
      <!-- Crête Céphalique de Reine Xénomorphe -->
      <path d="M50 16 L74 34 L82 28 L72 52 L50 64 L28 52 L18 28 L26 34 Z" fill="#101a12" stroke="url(#xeno-acid-${size})" stroke-width="2" />
      
      <!-- Dard Caudal Biologique Barbelé Enroulé -->
      <path d="M50 64 Q68 76 56 86 Q40 88 42 78 Q44 70 50 64" fill="none" stroke="url(#xeno-acid-${size})" stroke-width="2.5" stroke-linecap="round" />
      <polygon points="56,86 64,88 58,80" fill="#b8ff00" />
      
      <!-- Projection d'Acide Moléculaire Caustique -->
      <circle cx="50" cy="40" r="4.2" fill="#b8ff00" />
      <circle cx="43" cy="48" r="2.5" fill="#88ff00" />
      <circle cx="57" cy="48" r="2.5" fill="#88ff00" />
    </svg>
  `.trim();
}

/**
 * Insignes 1:1 Vectoriels des Proies Crossover du Multivers Officiel (DC Comics, Dark Horse, 2000 AD).
 */
export function getCrossoverLogo(crossoverId, size = 64) {
  // A documented universe encounter keeps its parent's emblem, rather than
  // silently displaying the Yautja fallback for every `parent__encounter` ID.
  const normalizedId = String(crossoverId || '').split('__')[0].replace(/^crossover_/, '');
  switch (normalizedId) {
    case 'batman':
      // The Dark Knight Wayne Enterprises Bat-Insignia (Batman versus Predator)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="${size * 1.5}" height="${size * 0.9}" class="crossover-logo logo-batman" role="img" aria-label="Bat-Insignia de Batman">
          <path d="M50 18 Q54 6 58 4 Q60 14 68 18 Q82 8 98 16 Q94 36 78 44 Q66 52 50 58 Q34 52 22 44 Q6 36 2 16 Q18 8 32 18 Q40 14 42 4 Q46 6 50 18 Z" fill="#ffe600" stroke="#101418" stroke-width="2" />
          <path d="M50 20 Q53 10 56 8 Q58 16 66 20 Q78 12 92 18 Q88 34 74 42 Q64 48 50 54 Q36 48 26 42 Q12 34 8 18 Q22 12 34 20 Q42 16 44 8 Q47 10 50 20 Z" fill="#0f141a" />
        </svg>
      `.trim();

    case 'joker':
      // The Joker's Grinning Mask & Acid Flower (Batman/Aliens & Joker Crossovers)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-joker" role="img" aria-label="Emblème du Joker">
          <circle cx="40" cy="40" r="36" fill="#1b0826" stroke="#7b1fa2" stroke-width="2.5" />
          <!-- Sourire sinistre rouge aux dents pointues -->
          <path d="M16 44 Q40 72 64 44 Q40 56 16 44 Z" fill="#d32f2f" stroke="#ff1744" stroke-width="1.5" />
          <path d="M22 46 Q40 56 58 46 Q40 64 22 46 Z" fill="#ffffff" />
          <!-- Yeux déments et cheveux verts -->
          <ellipse cx="28" cy="30" rx="6" ry="8" fill="#00e676" />
          <ellipse cx="52" cy="30" rx="6" ry="8" fill="#00e676" />
          <circle cx="28" cy="30" r="3" fill="#000" />
          <circle cx="52" cy="30" r="3" fill="#000" />
          <!-- HaHaHa Stylisé -->
          <text x="40" y="20" font-family="'Orbitron', sans-serif" font-size="9" font-weight="900" fill="#ffeb3b" text-anchor="middle">HA HA HA</text>
        </svg>
      `.trim();

    case 'terminator':
    case 'terminator_t800':
      // Cyberdyne Systems T-800 Endoskeleton Skull & Red HUD (AvPvT 2000)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-terminator" role="img" aria-label="Endosquelette T-800 Cyberdyne">
          <defs>
            <linearGradient id="t800-chrome-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="40%" stop-color="#a0b2c6" />
              <stop offset="80%" stop-color="#3a4856" />
              <stop offset="100%" stop-color="#101820" />
            </linearGradient>
            <radialGradient id="t800-eye-${size}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ff8888" />
              <stop offset="40%" stop-color="#ff0000" />
              <stop offset="100%" stop-color="#660000" />
            </radialGradient>
          </defs>
          <polygon points="40,6 66,22 62,64 40,76 18,64 14,22" fill="#06090e" stroke="#485c72" stroke-width="2" />
          <!-- Crâne métallique T-800 -->
          <path d="M22 22 Q40 14 58 22 L60 42 Q40 48 20 42 Z" fill="url(#t800-chrome-${size})" stroke="#121a24" stroke-width="1.2" />
          <!-- Optiques Rouges Infrarouges -->
          <circle cx="30" cy="34" r="5.5" fill="url(#t800-eye-${size})" />
          <circle cx="50" cy="34" r="5.5" fill="url(#t800-eye-${size})" />
          <circle cx="30" cy="34" r="2" fill="#ffffff" />
          <circle cx="50" cy="34" r="2" fill="#ffffff" />
          <!-- Dents en hyper-alliage -->
          <rect x="26" y="52" width="28" height="8" rx="2" fill="#dce6f2" stroke="#22303c" stroke-width="1" />
          <line x1="33" y1="52" x2="33" y2="60" stroke="#121a24" stroke-width="1.2" />
          <line x1="40" y1="52" x2="40" y2="60" stroke="#121a24" stroke-width="1.2" />
          <line x1="47" y1="52" x2="47" y2="60" stroke="#121a24" stroke-width="1.2" />
        </svg>
      `.trim();

    case 'judge_dredd':
      // Justice Department Eagle Badge of Mega-City One (Predator vs Judge Dredd 1997)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-dredd" role="img" aria-label="Insigne du Juge Dredd">
          <defs>
            <linearGradient id="dredd-gold-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fff099" />
              <stop offset="50%" stop-color="#ffd700" />
              <stop offset="100%" stop-color="#b28900" />
            </linearGradient>
          </defs>
          <!-- Aigle stylisé du Justice Department -->
          <polygon points="40,8 52,16 68,14 74,28 64,40 70,62 50,56 40,68 30,56 10,62 16,40 6,28 12,14 28,16" fill="url(#dredd-gold-${size})" stroke="#1a1400" stroke-width="2" />
          <!-- Bouclier DREDD noir et rouge -->
          <polygon points="40,24 60,34 54,64 40,72 26,64 20,34" fill="#0d1117" stroke="#ffd700" stroke-width="1.8" />
          <rect x="23" y="38" width="34" height="14" rx="2" fill="#d32f2f" stroke="#ffd700" stroke-width="1" />
          <text x="40" y="49" font-family="'Orbitron', sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" letter-spacing="1" text-anchor="middle">DREDD</text>
        </svg>
      `.trim();

    case 'superman':
    case 'superman_red_sun':
      // House of El Kryptonian Shield of Hope (Superman vs Predator 2000)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70" width="${size * 1.3}" height="${size}" class="crossover-logo logo-superman" role="img" aria-label="Symbole de Superman">
          <!-- Pentagone Jaune -->
          <polygon points="45,4 86,22 72,62 45,68 18,62 4,22" fill="#ffd700" stroke="#b28900" stroke-width="2.5" />
          <!-- 'S' Kryptonien Rouge -->
          <path d="M22 24 L45 12 L68 24 L60 34 L48 26 L34 32 L56 38 Q68 44 64 54 L45 62 L26 54 L32 44 L44 50 L52 46 L32 40 Q20 34 22 24 Z" fill="#d32f2f" stroke="#8b0000" stroke-width="1.2" />
        </svg>
      `.trim();

    case 'witchblade':
    case 'crossover_witchblade':
      // Mystical Symbiotic Bio-Gauntlet Sigil (Overkill: Witchblade/Aliens/Predator)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-witchblade" role="img" aria-label="Sigil de la Witchblade">
          <circle cx="40" cy="40" r="36" fill="#120c1f" stroke="#8e24aa" stroke-width="2" />
          <path d="M40 8 Q56 28 48 48 Q56 64 40 72 Q24 64 32 48 Q24 28 40 8 Z" fill="#ab47bc" stroke="#e1bee7" stroke-width="1.5" />
          <circle cx="40" cy="40" r="7" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'tarzan':
    case 'crossover_tarzan':
      // Tarzan at the Earth's Core (Pellucidar 1996)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-tarzan" role="img" aria-label="Sceau de Tarzan">
          <circle cx="40" cy="40" r="36" fill="#141a0d" stroke="#689f38" stroke-width="2.5" />
          <path d="M40 10 L48 34 L72 34 L52 48 L60 72 L40 56 L20 72 L28 48 L8 34 L32 34 Z" fill="#33691e" stroke="#8bc34a" stroke-width="1.2" opacity="0.6" />
          <path d="M38 16 Q42 36 34 58 L40 64 L46 58 Q38 36 42 16 Z" fill="#f1f8e9" stroke="#33691e" stroke-width="1.5" />
          <circle cx="40" cy="66" r="3" fill="#8bc34a" />
        </svg>
      `.trim();

    case 'magnus':
    case 'crossover_magnus':
      // Magnus Robot Fighter 4000 A.D. (1992)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-magnus" role="img" aria-label="Symbole 1A de Magnus Robot Fighter">
          <polygon points="40,8 70,24 70,56 40,72 10,56 10,24" fill="#0d1b2a" stroke="#00b4d8" stroke-width="2.5" />
          <rect x="26" y="24" width="28" height="32" rx="4" fill="#1b263b" stroke="#00b4d8" stroke-width="1.8" />
          <text x="40" y="46" font-family="'Orbitron', sans-serif" font-size="16" font-weight="900" fill="#90e0ef" text-anchor="middle">1A</text>
        </svg>
      `.trim();

    case 'grendel':
    case 'crossover_grendel':
      // Grendel Hunter Rose Twin-Pronged Fork (1996)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-grendel" role="img" aria-label="Masque de Grendel">
          <circle cx="40" cy="40" r="36" fill="#000000" stroke="#e0e0e0" stroke-width="2.5" />
          <path d="M18 36 Q32 26 38 34 Q32 40 18 36 Z" fill="#ffffff" />
          <path d="M62 36 Q48 26 42 34 Q48 40 62 36 Z" fill="#ffffff" />
          <line x1="40" y1="12" x2="40" y2="68" stroke="#d50000" stroke-width="2" />
          <path d="M30 18 L40 28 L50 18" fill="none" stroke="#d50000" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'the_mask':
    case 'crossover_the_mask':
      // Loki's Norse Wood Mask (1999)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-the-mask" role="img" aria-label="Le Masque de Loki">
          <ellipse cx="40" cy="40" rx="32" ry="36" fill="#1b5e20" stroke="#76ff03" stroke-width="2.5" />
          <line x1="40" y1="10" x2="40" y2="70" stroke="#00e676" stroke-width="3" stroke-linecap="round" />
          <line x1="20" y1="36" x2="60" y2="36" stroke="#00e676" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="28" cy="36" rx="8" ry="12" fill="#eeff41" stroke="#000" stroke-width="1.5" />
          <ellipse cx="52" cy="36" rx="8" ry="12" fill="#eeff41" stroke="#000" stroke-width="1.5" />
          <circle cx="28" cy="36" r="3.5" fill="#000" />
          <circle cx="52" cy="36" r="3.5" fill="#000" />
          <path d="M22 56 Q40 74 58 56 Z" fill="#ffffff" stroke="#000" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'buffy':
    case 'crossover_buffy':
      // Buffyverse Slayer Stake & Pentagram (1998)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-buffy" role="img" aria-label="Sceau de la Tueuse">
          <circle cx="40" cy="40" r="36" fill="#210515" stroke="#e91e63" stroke-width="2.5" />
          <polygon points="40,8 48,56 40,70 32,56" fill="#d7ccc8" stroke="#8d6e63" stroke-width="1.8" />
          <circle cx="40" cy="40" r="8" fill="none" stroke="#ff4081" stroke-width="2" stroke-dasharray="3,2" />
        </svg>
      `.trim();

    case 'archie':
    case 'crossover_archie':
      // Riverdale High Crest (Archie vs Predator 2015)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-archie" role="img" aria-label="Blason de Riverdale">
          <polygon points="40,6 72,20 66,62 40,74 14,62 8,20" fill="#0d1b2a" stroke="#fbc02d" stroke-width="2.5" />
          <rect x="22" y="24" width="36" height="36" rx="4" fill="#c2185b" stroke="#fbc02d" stroke-width="1.5" />
          <text x="40" y="50" font-family="'Orbitron', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">R</text>
        </svg>
      `.trim();

    case 'the_darkness':
    case 'crossover_the_darkness':
      // The Darkness Ancient Tendrils & Emerald Sigil (Top Cow / Dark Horse 1999)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-darkness" role="img" aria-label="Symbole du Darkness">
          <circle cx="40" cy="40" r="36" fill="#050d06" stroke="#2e7d32" stroke-width="2.5" />
          <path d="M20 60 Q26 30 40 18 Q54 30 60 60 Q40 46 20 60 Z" fill="#1b5e20" stroke="#76ff03" stroke-width="1.5" />
          <path d="M24 38 Q14 26 22 14 Q32 20 28 32 Z" fill="#0a320c" stroke="#4caf50" stroke-width="1.2" />
          <path d="M56 38 Q66 26 58 14 Q48 20 52 32 Z" fill="#0a320c" stroke="#4caf50" stroke-width="1.2" />
          <circle cx="34" cy="30" r="2.5" fill="#eeff41" />
          <circle cx="46" cy="30" r="2.5" fill="#eeff41" />
        </svg>
      `.trim();

    case 'robocop':
    case 'crossover_robocop':
      // OCP Hexagon Badge & Titanium Red Visor (1993)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-robocop" role="img" aria-label="Insigne OCP RoboCop">
          <polygon points="40,6 72,24 72,56 40,74 8,56 8,24" fill="#101820" stroke="#78909c" stroke-width="2.5" />
          <polygon points="40,14 64,28 64,52 40,66 16,52 16,28" fill="#1e2936" stroke="#b0bec5" stroke-width="1.5" />
          <rect x="20" y="34" width="40" height="10" rx="2" fill="#000000" stroke="#cfd8dc" stroke-width="1" />
          <line x1="22" y1="39" x2="58" y2="39" stroke="#ff1744" stroke-width="2.5" stroke-linecap="round" />
          <text x="40" y="27" font-family="'Orbitron', sans-serif" font-size="8" font-weight="900" fill="#90a4ae" text-anchor="middle">OCP</text>
        </svg>
      `.trim();

    case 'mortal_kombat_kano':
    case 'kano':
    case 'crossover_mortal_kombat_kano':
      // Mortal Kombat Dragon Sigil & Bionic Eye (2015)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-kano" role="img" aria-label="Oeil Bionique de Kano">
          <circle cx="40" cy="40" r="36" fill="#1a0404" stroke="#d50000" stroke-width="2.5" />
          <circle cx="40" cy="40" r="28" fill="#0d0d0d" stroke="#ff1744" stroke-width="1.2" />
          <path d="M40 18 Q62 18 64 40 Q62 62 40 62 Z" fill="#37474f" stroke="#78909c" stroke-width="1.5" />
          <circle cx="48" cy="40" r="8" fill="#ff1744" />
          <circle cx="48" cy="40" r="3.5" fill="#ffffff" />
          <line x1="48" y1="20" x2="48" y2="60" stroke="#ff5252" stroke-width="1" stroke-dasharray="2,2" />
        </svg>
      `.trim();

    case 'x_files_mulder':
    case 'mulder':
    case 'crossover_x_files_mulder':
      // FBI X-Files Silhouette & UFO Tractor Beam (1997)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-xfiles" role="img" aria-label="Dossier X-Files">
          <polygon points="40,6 70,22 64,66 40,76 16,66 10,22" fill="#06121e" stroke="#0288d1" stroke-width="2.5" />
          <polygon points="40,16 60,60 20,60" fill="#00e676" opacity="0.25" />
          <ellipse cx="40" cy="18" rx="14" ry="4" fill="#0288d1" stroke="#81d4fa" stroke-width="1.2" />
          <text x="40" y="44" font-family="'Orbitron', sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">X</text>
          <text x="40" y="58" font-family="'Orbitron', sans-serif" font-size="6" font-weight="800" fill="#81d4fa" letter-spacing="1" text-anchor="middle">FBI</text>
        </svg>
      `.trim();

    case 'judge_anderson':
    case 'anderson':
    case 'crossover_judge_anderson':
      // Judge Anderson Psi-Division Gold Star (1997)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-anderson" role="img" aria-label="Insigne Juge Anderson">
          <circle cx="40" cy="40" r="36" fill="#1b002c" stroke="#ab47bc" stroke-width="2.5" />
          <polygon points="40,10 48,28 68,28 52,40 58,60 40,48 22,60 28,40 12,28 32,28" fill="#ffd700" stroke="#b28900" stroke-width="1.5" />
          <text x="40" y="44" font-family="'Orbitron', sans-serif" font-size="11" font-weight="900" fill="#4a148c" text-anchor="middle">PSI</text>
        </svg>
      `.trim();

    case 'worlds_finest':
    case 'crossover_worlds_finest':
      // World's Finest Interlocking Bat & S-Shield (2007)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70" width="${size * 1.3}" height="${size}" class="crossover-logo logo-worlds-finest" role="img" aria-label="Alliance World's Finest">
          <polygon points="45,4 86,22 72,62 45,68 18,62 4,22" fill="#0d1b2a" stroke="#ffd700" stroke-width="2.5" />
          <path d="M45 16 C38 16 30 20 20 20 C24 32 34 38 45 46 C56 38 66 32 70 20 C60 20 52 16 45 16 Z" fill="#ffd700" />
          <path d="M45 28 L40 40 L50 40 Z" fill="#d32f2f" />
        </svg>
      `.trim();

    case 't_infinity':
    case 'crossover_t_infinity':
      // Skynet T-Infinity Chrono-Liquid Endoskeleton (2000)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-t-infinity" role="img" aria-label="Skynet T-Infinity">
          <circle cx="40" cy="40" r="36" fill="#080808" stroke="#d50000" stroke-width="2.5" />
          <circle cx="40" cy="40" r="28" fill="none" stroke="#ff1744" stroke-width="1.5" stroke-dasharray="4,2" />
          <path d="M26 40 C26 34 34 34 40 40 C46 46 54 46 54 40 C54 34 46 34 40 40 C34 46 26 46 26 40 Z" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
          <circle cx="40" cy="40" r="4" fill="#ff1744" />
        </svg>
      `.trim();

    case 'machiko_noguchi':
    case 'crossover_machiko_noguchi':
      // Machiko Noguchi Blood-Marked Human Mask (1994)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-machiko" role="img" aria-label="Biomasque de Machiko Noguchi">
          <polygon points="40,8 68,22 62,68 40,76 18,68 12,22" fill="#121820" stroke="#ff9800" stroke-width="2.5" />
          <line x1="30" y1="26" x2="50" y2="26" stroke="#ff1744" stroke-width="3" stroke-linecap="round" />
          <line x1="40" y1="20" x2="40" y2="44" stroke="#ff1744" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="30" cy="48" rx="6" ry="4" fill="#ff9800" />
          <ellipse cx="50" cy="48" rx="6" ry="4" fill="#ff9800" />
        </svg>
      `.trim();

    case 'green_lantern':
    case 'crossover_green_lantern':
      // Green Lantern Corps Lantern Battery Sigil (2000)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-green-lantern" role="img" aria-label="Lanterne d'Oa Green Lantern">
          <circle cx="40" cy="40" r="36" fill="#041a0d" stroke="#00e676" stroke-width="2.5" />
          <circle cx="40" cy="40" r="28" fill="#00e676" opacity="0.2" />
          <circle cx="40" cy="40" r="14" fill="#041a0d" stroke="#00e676" stroke-width="2.5" />
          <line x1="20" y1="24" x2="60" y2="24" stroke="#00e676" stroke-width="3.5" stroke-linecap="round" />
          <line x1="20" y1="56" x2="60" y2="56" stroke="#00e676" stroke-width="3.5" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'wildcats_grifter':
    case 'grifter':
    case 'crossover_wildcats_grifter':
      // Grifter WildC.A.T.s Red/Black Mask (1998)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-grifter" role="img" aria-label="Masque de Grifter">
          <polygon points="40,6 68,22 62,68 40,76 18,68 12,22" fill="#b71c1c" stroke="#d32f2f" stroke-width="2.5" />
          <polygon points="40,6 68,22 62,68 40,76" fill="#121212" />
          <ellipse cx="28" cy="38" rx="8" ry="4" fill="#ffffff" stroke="#000" stroke-width="1" />
          <ellipse cx="52" cy="38" rx="8" ry="4" fill="#ffffff" stroke="#000" stroke-width="1" />
        </svg>
      `.trim();

    case 'jla_league':
    case 'jla':
    case 'crossover_jla_league':
      // Justice League Watchtower Star Shield (2001)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-jla" role="img" aria-label="Bouclier JLA">
          <polygon points="40,4 72,16 66,66 40,78 14,66 8,16" fill="#0d233a" stroke="#ffd700" stroke-width="2.5" />
          <polygon points="40,16 46,30 62,30 48,40 54,54 40,44 26,54 32,40 18,30 34,30" fill="#ffd700" stroke="#b28900" stroke-width="1" />
          <text x="40" y="66" font-family="'Orbitron', sans-serif" font-size="9" font-weight="900" fill="#ffffff" letter-spacing="1" text-anchor="middle">JLA</text>
        </svg>
      `.trim();

    case 'bloodlines_darkness':
    case 'crossover_bloodlines_darkness':
      // Witchblade & Darkness Symbiosis (2001)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-bloodlines" role="img" aria-label="Alliance Bloodlines">
          <circle cx="40" cy="40" r="36" fill="#140510" stroke="#880e4f" stroke-width="2.5" />
          <path d="M24 56 Q40 16 56 56 Q40 44 24 56 Z" fill="#ad1457" stroke="#e91e63" stroke-width="1.5" />
          <circle cx="40" cy="34" r="6" fill="#00e5ff" stroke="#ffffff" stroke-width="1.2" />
          <circle cx="40" cy="50" r="5" fill="#76ff03" stroke="#ffffff" stroke-width="1.2" />
        </svg>
      `.trim();

    case 'wolverine':
    case 'crossover_wolverine':
      // Wolverine Adamantium Claws Slash & Yellow Mask (2023)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-wolverine" role="img" aria-label="Griffes d'Adamantium de Wolverine">
          <circle cx="40" cy="40" r="36" fill="#141414" stroke="#ffd700" stroke-width="2.5" />
          <path d="M22 64 L30 18 M38 68 L40 14 M54 64 L50 18" stroke="#cfd8dc" stroke-width="3.5" stroke-linecap="round" />
          <path d="M22 64 L30 18 M38 68 L40 14 M54 64 L50 18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
          <polygon points="40,24 50,42 30,42" fill="#ffd700" />
        </svg>
      `.trim();

    case 'black_panther':
    case 'crossover_black_panther':
      // Black Panther Vibranium Mask & Kinetic Purple Glow (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-black-panther" role="img" aria-label="Masque de la Panthère Noire">
          <circle cx="40" cy="40" r="36" fill="#0d0414" stroke="#7b1fa2" stroke-width="2.5" />
          <polygon points="40,10 64,24 58,66 40,74 22,66 16,24" fill="#1a1a24" stroke="#9c27b0" stroke-width="2" />
          <ellipse cx="30" cy="38" rx="6" ry="4" fill="#ffffff" />
          <ellipse cx="50" cy="38" rx="6" ry="4" fill="#ffffff" />
          <path d="M40 44 L40 60 M30 52 L50 52" stroke="#e1bee7" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'spider_man':
    case 'crossover_spider_man':
      // Spider-Man Webbed Mask & Spider Emblem (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-spider-man" role="img" aria-label="Emblème de Spider-Man">
          <circle cx="40" cy="40" r="36" fill="#b71c1c" stroke="#d32f2f" stroke-width="2.5" />
          <ellipse cx="40" cy="40" rx="6" ry="10" fill="#000000" />
          <path d="M36 34 L22 22 M44 34 L58 22 M34 40 L18 40 M46 40 L62 40 M36 46 L22 58 M44 46 L58 58" stroke="#000000" stroke-width="2" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'iron_man':
    case 'crossover_iron_man':
      // Iron Man Model 70 Faceplate & Arc Reactor (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-iron-man" role="img" aria-label="Armure d'Iron Man">
          <polygon points="40,8 68,20 62,68 40,76 18,68 12,20" fill="#b71c1c" stroke="#ffd700" stroke-width="2.5" />
          <polygon points="40,16 58,24 54,60 40,68 26,60 22,24" fill="#ffd700" stroke="#b28900" stroke-width="1.5" />
          <line x1="28" y1="36" x2="38" y2="36" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" />
          <line x1="42" y1="36" x2="52" y2="36" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'captain_america':
    case 'crossover_captain_america':
      // Captain America Vibranium Star Shield (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-captain-america" role="img" aria-label="Bouclier de Captain America">
          <circle cx="40" cy="40" r="36" fill="#d32f2f" stroke="#b71c1c" stroke-width="2" />
          <circle cx="40" cy="40" r="28" fill="#ffffff" />
          <circle cx="40" cy="40" r="20" fill="#d32f2f" />
          <circle cx="40" cy="40" r="13" fill="#1976d2" />
          <polygon points="40,28 43,36 51,36 45,41 47,49 40,44 33,49 35,41 29,36 37,36" fill="#ffffff" />
        </svg>
      `.trim();

    case 'thor_asgard':
    case 'crossover_thor_asgard':
      // Thor Odinson Mjolnir Uru Hammer & Lightning (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-thor" role="img" aria-label="Mjolnir Marteau de Thor">
          <circle cx="40" cy="40" r="36" fill="#081824" stroke="#00bcd4" stroke-width="2.5" />
          <rect x="24" y="24" width="32" height="18" rx="2" fill="#cfd8dc" stroke="#455a64" stroke-width="2" />
          <line x1="40" y1="42" x2="40" y2="66" stroke="#795548" stroke-width="4" stroke-linecap="round" />
          <path d="M16 28 L24 34 M64 28 L56 34 M40 14 L40 24" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'scorpion_subzero':
    case 'crossover_scorpion_subzero':
      // Mortal Kombat Dragon, Shirai Ryu Flame & Lin Kuei Ice (2015)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-mk-kombat" role="img" aria-label="Sceau Mortal Kombat Glace et Feu">
          <circle cx="40" cy="40" r="36" fill="#120c02" stroke="#ff9800" stroke-width="2.5" />
          <path d="M40 8 A32 32 0 0 1 72 40" stroke="#00e5ff" stroke-width="3" fill="none" />
          <path d="M40 72 A32 32 0 0 1 8 40" stroke="#ff5722" stroke-width="3" fill="none" />
          <path d="M38 18 C30 18 24 24 26 34 C28 40 34 42 42 40 C48 38 52 42 50 48 C48 54 40 56 34 54 C30 52 28 48 24 48 C22 56 30 64 42 64 C56 64 64 52 62 38 C60 26 50 18 38 18 Z" fill="#ffd54f" />
          <circle cx="48" cy="28" r="2.5" fill="#d32f2f" />
        </svg>
      `.trim();

    case 'hellboy_anung':
    case 'crossover_hellboy_anung':
      // Hellboy Right Hand of Doom & Horn Stumps (1999)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-hellboy" role="img" aria-label="Main Droite de la Destruction de Hellboy">
          <circle cx="40" cy="40" r="36" fill="#1a0606" stroke="#d32f2f" stroke-width="2.5" />
          <rect x="26" y="24" width="28" height="34" rx="4" fill="#b71c1c" stroke="#5d4037" stroke-width="2" />
          <line x1="33" y1="24" x2="33" y2="44" stroke="#7f0000" stroke-width="2" />
          <line x1="40" y1="24" x2="40" y2="44" stroke="#7f0000" stroke-width="2" />
          <line x1="47" y1="24" x2="47" y2="44" stroke="#7f0000" stroke-width="2" />
          <circle cx="28" cy="18" r="5" fill="#4e342e" stroke="#8d6e63" stroke-width="1.5" />
          <circle cx="52" cy="18" r="5" fill="#4e342e" stroke="#8d6e63" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'conan_cimmerian':
    case 'crossover_conan_cimmerian':
      // Conan Cimmerian Broadsword & Savage Skull Crossguard (2019)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-conan" role="img" aria-label="Glaive Cimmérien de Conan">
          <circle cx="40" cy="40" r="36" fill="#1e1b18" stroke="#8d6e63" stroke-width="2.5" />
          <polygon points="40,10 46,50 40,54 34,50" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="1.5" />
          <rect x="22" y="52" width="36" height="6" rx="2" fill="#5d4037" stroke="#3e2723" stroke-width="1.5" />
          <rect x="37" y="58" width="6" height="14" fill="#8d6e63" />
          <circle cx="40" cy="74" r="4" fill="#d7ccc8" stroke="#5d4037" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'deadpool_wilson':
    case 'crossover_deadpool_wilson':
      // Deadpool Split Mask & Crossed Katanas (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-deadpool" role="img" aria-label="Masque de Deadpool">
          <circle cx="40" cy="40" r="36" fill="#b71c1c" stroke="#d32f2f" stroke-width="2.5" />
          <line x1="40" y1="4" x2="40" y2="76" stroke="#212121" stroke-width="3" />
          <ellipse cx="28" cy="40" rx="9" ry="14" fill="#212121" />
          <ellipse cx="52" cy="40" rx="9" ry="14" fill="#212121" />
          <polygon points="26,36 32,40 26,44" fill="#ffffff" />
          <polygon points="54,36 48,40 54,44" fill="#ffffff" />
        </svg>
      `.trim();

    case 'judge_death':
    case 'crossover_judge_death':
      // Judge Death Portcullis Visor & Deadworld Grimace (1997)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-judge-death" role="img" aria-label="Casque du Juge Mort de Deadworld">
          <circle cx="40" cy="40" r="36" fill="#0b1014" stroke="#546e7a" stroke-width="2.5" />
          <polygon points="40,12 64,26 58,68 40,74 22,68 16,26" fill="#263238" stroke="#37474f" stroke-width="2" />
          <line x1="28" y1="30" x2="52" y2="30" stroke="#cfd8dc" stroke-width="3" />
          <line x1="28" y1="36" x2="52" y2="36" stroke="#cfd8dc" stroke-width="3" />
          <line x1="32" y1="26" x2="32" y2="40" stroke="#cfd8dc" stroke-width="2" />
          <line x1="40" y1="26" x2="40" y2="40" stroke="#cfd8dc" stroke-width="2" />
          <line x1="48" y1="26" x2="48" y2="40" stroke="#cfd8dc" stroke-width="2" />
          <path d="M30 52 Q40 62 50 52" stroke="#eceff1" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'spawn_simmons':
    case 'crossover_spawn_simmons':
      // Spawn Symbiote Eyes & Necro Chains (1996)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-spawn" role="img" aria-label="Masque Infernal de Spawn">
          <circle cx="40" cy="40" r="36" fill="#0d140e" stroke="#00e676" stroke-width="2.5" />
          <polygon points="40,12 66,32 56,70 40,76 24,70 14,32" fill="#1b241c" stroke="#2e7d32" stroke-width="2" />
          <path d="M22 36 Q32 30 36 44 Q28 48 22 36 Z" fill="#ffffff" stroke="#00e676" stroke-width="1.5" />
          <path d="M58 36 Q48 30 44 44 Q52 48 58 36 Z" fill="#ffffff" stroke="#00e676" stroke-width="1.5" />
          <circle cx="40" cy="62" r="5" fill="#cfd8dc" stroke="#424242" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'riddick_furyan':
    case 'crossover_riddick_furyan':
      // Riddick Furyan Eyeshine Goggles & Dual Ulaks (2004)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-riddick" role="img" aria-label="Lunettes Furyan de Riddick">
          <circle cx="40" cy="40" r="36" fill="#080808" stroke="#78909c" stroke-width="2.5" />
          <ellipse cx="28" cy="38" rx="10" ry="8" fill="#1c252a" stroke="#80cbc4" stroke-width="2" />
          <ellipse cx="52" cy="38" rx="10" ry="8" fill="#1c252a" stroke="#80cbc4" stroke-width="2" />
          <circle cx="28" cy="38" r="4" fill="#e0f2f1" />
          <circle cx="52" cy="38" r="4" fill="#e0f2f1" />
          <line x1="38" y1="38" x2="42" y2="38" stroke="#37474f" stroke-width="3" />
          <path d="M22 62 Q40 50 58 62" stroke="#b0bec5" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'mandalorian_boba':
    case 'crossover_mandalorian_boba':
      // Boba Fett Beskar Helmet T-Visor & Rangefinder (1997)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-boba-fett" role="img" aria-label="Casque Mandalorien de Boba Fett">
          <circle cx="40" cy="40" r="36" fill="#182c1e" stroke="#388e3c" stroke-width="2.5" />
          <path d="M22 24 L58 24 L54 62 L40 68 L26 62 Z" fill="#2e7d32" stroke="#b71c1c" stroke-width="2" />
          <line x1="26" y1="36" x2="54" y2="36" stroke="#000000" stroke-width="4" />
          <line x1="40" y1="36" x2="40" y2="58" stroke="#000000" stroke-width="4" />
          <line x1="58" y1="20" x2="58" y2="34" stroke="#cfd8dc" stroke-width="2" />
          <rect x="55" y="16" width="6" height="4" fill="#ffeb3b" />
        </svg>
      `.trim();

    case 'snake_plissken':
    case 'crossover_snake_plissken':
      // Snake Plissken Eyepatch & Laser Reticle (1996)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-plissken" role="img" aria-label="Bandeau Oculaire de Snake Plissken">
          <circle cx="40" cy="40" r="36" fill="#1c2226" stroke="#78909c" stroke-width="2.5" />
          <polygon points="18,34 38,28 36,48 16,42" fill="#000000" stroke="#37474f" stroke-width="2" />
          <circle cx="54" cy="38" r="9" fill="none" stroke="#ff1744" stroke-width="2" />
          <line x1="54" y1="26" x2="54" y2="50" stroke="#ff1744" stroke-width="1.5" />
          <line x1="42" y1="38" x2="66" y2="38" stroke="#ff1744" stroke-width="1.5" />
          <circle cx="54" cy="38" r="2" fill="#ff1744" />
        </svg>
      `.trim();

    case 'caryn_delacroix':
    case 'crossover_caryn_delacroix':
      // Caryn Delacroix & Big Mama Hybrid Mask (1993)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-caryn" role="img" aria-label="Masque Hybride de Caryn Delacroix">
          <circle cx="40" cy="40" r="36" fill="#20061e" stroke="#e91e63" stroke-width="2.5" />
          <polygon points="40,12 62,30 54,66 40,74 26,66 18,30" fill="#4a148c" stroke="#ec407a" stroke-width="2" />
          <path d="M26 36 L36 40 M54 36 L44 40" stroke="#f48fb1" stroke-width="2.5" stroke-linecap="round" />
          <polygon points="40,24 44,32 36,32" fill="#d81b60" />
          <circle cx="40" cy="54" r="4" fill="#ffd54f" />
        </svg>
      `.trim();

    case 'master_chief':
    case 'crossover_master_chief':
      // Master Chief Spartan-117 Mjolnir Mark VI Helmet & Gold Visor (2001)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-master-chief" role="img" aria-label="Casque Spartan Mjolnir de Master Chief">
          <circle cx="40" cy="40" r="36" fill="#132317" stroke="#2e7d32" stroke-width="2.5" />
          <polygon points="40,14 62,24 58,66 40,74 22,66 18,24" fill="#2d4a34" stroke="#4caf50" stroke-width="2" />
          <path d="M26 32 L54 32 L50 48 L40 54 L30 48 Z" fill="#ffb300" stroke="#ff8f00" stroke-width="2" />
          <line x1="28" y1="38" x2="52" y2="38" stroke="#ffe082" stroke-width="1.5" />
          <rect x="36" y="58" width="8" height="6" fill="#1b2a1e" stroke="#66bb6a" stroke-width="1" />
        </svg>
      `.trim();

    case 'doom_slayer':
    case 'crossover_doom_slayer':
      // Doom Slayer Praetor Helmet & Mark of the Slayer (2016)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-doom-slayer" role="img" aria-label="Casque Praetor et Marque du Slayer">
          <circle cx="40" cy="40" r="36" fill="#1a0a0a" stroke="#d50000" stroke-width="2.5" />
          <polygon points="40,12 66,28 58,68 40,76 22,68 14,28" fill="#2e382b" stroke="#33691e" stroke-width="2" />
          <path d="M28 34 L52 34 L48 48 L40 52 L32 48 Z" fill="#00e676" stroke="#00b0ff" stroke-width="1.5" />
          <path d="M38 18 L42 18 L42 64 L38 64 M32 30 L48 30 M34 44 L46 44" stroke="#ff1744" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'geralt_rivia':
    case 'crossover_geralt_rivia':
      // Geralt of Rivia Wolf Medallion & Crossed Silver Blades (2015)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-geralt" role="img" aria-label="Médaillon du Loup de Geralt de Riv">
          <circle cx="40" cy="40" r="36" fill="#1b1c1d" stroke="#90a4ae" stroke-width="2.5" />
          <polygon points="40,16 52,32 58,54 40,68 22,54 28,32" fill="#37474f" stroke="#cfd8dc" stroke-width="2" />
          <polygon points="40,24 46,36 40,42 34,36" fill="#eceff1" />
          <circle cx="34" cy="34" r="2.5" fill="#ffd600" />
          <circle cx="46" cy="34" r="2.5" fill="#ffd600" />
          <line x1="20" y1="60" x2="60" y2="20" stroke="#cfd8dc" stroke-width="2" stroke-linecap="round" />
          <line x1="20" y1="20" x2="60" y2="60" stroke="#90a4ae" stroke-width="2" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'solid_snake':
    case 'crossover_solid_snake':
      // Solid Snake Olive Bandana & Solid Eye Glowing Red (1998)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-solid-snake" role="img" aria-label="Bandana et Solid Eye de Solid Snake">
          <circle cx="40" cy="40" r="36" fill="#192024" stroke="#546e7a" stroke-width="2.5" />
          <rect x="20" y="24" width="40" height="10" rx="3" fill="#33691e" stroke="#558b2f" stroke-width="1.5" />
          <path d="M58 28 L72 38 M60 32 L70 46" stroke="#33691e" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="32" cy="42" rx="7" ry="5" fill="#263238" stroke="#37474f" stroke-width="1.5" />
          <ellipse cx="48" cy="42" rx="7" ry="5" fill="#b71c1c" stroke="#ff1744" stroke-width="2" />
          <circle cx="48" cy="42" r="3" fill="#ffffff" />
        </svg>
      `.trim();

    case 'kratos_sparta':
    case 'crossover_kratos_sparta':
      // Kratos Spartan War Tattoo & Blades of Chaos (2005)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-kratos" role="img" aria-label="Tatouage Spartiate et Lames du Chaos de Kratos">
          <circle cx="40" cy="40" r="36" fill="#141414" stroke="#d50000" stroke-width="2.5" />
          <circle cx="40" cy="40" r="28" fill="#cfd8dc" stroke="#90a4ae" stroke-width="1.5" />
          <path d="M26 18 Q38 32 36 50 Q34 64 24 68" stroke="#d50000" stroke-width="5" fill="none" stroke-linecap="round" />
          <polygon points="48,26 56,36 50,56 42,48" fill="#e65100" stroke="#ffab00" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'samus_aran':
    case 'crossover_samus_aran':
      // Samus Aran Varia Helmet & Emerald T-Visor (1986)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-samus" role="img" aria-label="Casque Varia de Samus Aran">
          <circle cx="40" cy="40" r="36" fill="#1a0d05" stroke="#ff6d00" stroke-width="2.5" />
          <polygon points="40,12 64,26 58,66 40,74 22,66 16,26" fill="#d84315" stroke="#ff6d00" stroke-width="2" />
          <path d="M26 34 L54 34 L50 44 L40 56 L30 44 Z" fill="#00e676" stroke="#00b0ff" stroke-width="2" />
          <line x1="28" y1="38" x2="52" y2="38" stroke="#b9f6ca" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'ghost_rider':
    case 'crossover_ghost_rider':
      // Ghost Rider Hellfire Skull & Blazing Chains (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-ghost-rider" role="img" aria-label="Crâne Enflammé du Ghost Rider">
          <circle cx="40" cy="40" r="36" fill="#140600" stroke="#ff9100" stroke-width="2.5" />
          <path d="M24 24 Q40 8 56 24 Q68 40 54 62 Q40 76 26 62 Q12 40 24 24 Z" fill="#ff6d00" />
          <path d="M30 28 Q40 16 50 28 Q58 42 48 58 Q40 68 32 58 Q22 42 30 28 Z" fill="#ffd600" />
          <circle cx="40" cy="42" r="14" fill="#ffffff" />
          <circle cx="35" cy="40" r="3.5" fill="#000000" />
          <circle cx="45" cy="40" r="3.5" fill="#000000" />
          <polygon points="40,44 42,48 38,48" fill="#000000" />
          <line x1="34" y1="52" x2="46" y2="52" stroke="#000000" stroke-width="2" />
        </svg>
      `.trim();

    case 'isaac_clarke':
    case 'crossover_isaac_clarke':
      // Isaac Clarke R.I.G. Suit Triple Cyan Visor Slits (2008)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-isaac-clarke" role="img" aria-label="Casque R.I.G. d'Isaac Clarke">
          <circle cx="40" cy="40" r="36" fill="#0d1b22" stroke="#00e5ff" stroke-width="2.5" />
          <polygon points="40,14 62,24 58,68 40,74 22,68 18,24" fill="#37474f" stroke="#546e7a" stroke-width="2" />
          <line x1="28" y1="32" x2="52" y2="32" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" />
          <line x1="30" y1="38" x2="50" y2="38" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" />
          <line x1="34" y1="44" x2="46" y2="44" stroke="#00e5ff" stroke-width="3" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'lobo_czarnia':
    case 'crossover_lobo_czarnia':
      // Lobo Czarnian Heavy Barbed Chain & Spiked Hook (1995)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-lobo" role="img" aria-label="Crochet Barbelé de Lobo">
          <circle cx="40" cy="40" r="36" fill="#111111" stroke="#e0e0e0" stroke-width="2.5" />
          <path d="M24 58 C16 42 22 24 38 22 C52 20 62 30 60 44 C58 54 48 58 40 54" stroke="#b0bec5" stroke-width="4" fill="none" stroke-linecap="round" />
          <polygon points="20,54 24,66 12,62" fill="#e0e0e0" />
          <circle cx="40" cy="38" r="4" fill="#ff1744" />
        </svg>
      `.trim();

    case 'sarah_connor':
    case 'crossover_sarah_connor':
      // Sarah Connor Aviator Sunglasses & 50 BMG Heavy Bullet (2000)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-sarah-connor" role="img" aria-label="Lunettes et BMG de Sarah Connor">
          <circle cx="40" cy="40" r="36" fill="#241e16" stroke="#8d6e63" stroke-width="2.5" />
          <polygon points="20,32 38,30 36,46 22,44" fill="#000000" stroke="#cfd8dc" stroke-width="1.5" />
          <polygon points="42,30 60,32 58,44 44,46" fill="#000000" stroke="#cfd8dc" stroke-width="1.5" />
          <line x1="38" y1="32" x2="42" y2="32" stroke="#cfd8dc" stroke-width="2" />
          <polygon points="40,54 43,62 37,62" fill="#ffd54f" stroke="#ffb300" stroke-width="1" />
          <rect x="37" y="62" width="6" height="12" fill="#ffb300" />
        </svg>
      `.trim();

    case 'blade_daywalker':
    case 'crossover_blade_daywalker':
      // Blade Titanium Sword & Ballistic Shades (2024)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-blade" role="img" aria-label="Sabre en Titane de Blade">
          <circle cx="40" cy="40" r="36" fill="#140606" stroke="#b71c1c" stroke-width="2.5" />
          <polygon points="40,8 43,46 40,50 37,46" fill="#eceff1" stroke="#90a4ae" stroke-width="1.5" />
          <rect x="24" y="48" width="32" height="6" rx="2" fill="#212121" stroke="#d32f2f" stroke-width="1" />
          <rect x="37" y="54" width="6" height="18" fill="#424242" />
          <polygon points="22,34 36,32 34,42 20,44" fill="#000000" stroke="#d50000" stroke-width="1" />
          <polygon points="44,32 58,34 60,44 46,42" fill="#000000" stroke="#d50000" stroke-width="1" />
        </svg>
      `.trim();

    case 'dredd_incubus':
    case 'crossover_dredd_incubus':
      // Judge Dredd Lawgiver MK II & Gold Eagle Badge (1997)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-dredd-incubus" role="img" aria-label="Badge Doré du Juge Dredd">
          <circle cx="40" cy="40" r="36" fill="#111812" stroke="#ffd600" stroke-width="2.5" />
          <polygon points="40,12 62,28 56,66 40,74 24,66 18,28" fill="#1b5e20" stroke="#ffd600" stroke-width="2" />
          <polygon points="40,20 48,30 40,36 32,30" fill="#ffd600" />
          <line x1="28" y1="44" x2="52" y2="44" stroke="#d50000" stroke-width="3" />
        </svg>
      `.trim();

    case 'robocop_prime':
    case 'crossover_robocop_prime':
      // RoboCop OCP Titanium Faceplate & Auto-9 (1993)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-robocop-prime" role="img" aria-label="Visière en Titane de RoboCop Prime">
          <circle cx="40" cy="40" r="36" fill="#151b22" stroke="#90a4ae" stroke-width="2.5" />
          <polygon points="40,14 62,24 58,68 40,74 22,68 18,24" fill="#37474f" stroke="#78909c" stroke-width="2" />
          <rect x="22" y="32" width="36" height="8" rx="2" fill="#000000" stroke="#ff1744" stroke-width="1.5" />
          <line x1="24" y1="36" x2="56" y2="36" stroke="#ff1744" stroke-width="2" />
        </svg>
      `.trim();

    case 'vampirella_drakulon':
    case 'crossover_vampirella_drakulon':
      // Vampirella Gold Bat Brooch & Drakulon Fangs (2015)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-vampirella" role="img" aria-label="Chauve-Souris d'Or de Vampirella">
          <circle cx="40" cy="40" r="36" fill="#1a000d" stroke="#c2185b" stroke-width="2.5" />
          <path d="M40 32 Q54 18 64 26 Q58 42 40 54 Q22 42 16 26 Q26 18 40 32 Z" fill="#ffd700" stroke="#ffb300" stroke-width="1.5" />
          <circle cx="40" cy="38" r="4" fill="#d50000" />
        </svg>
      `.trim();

    case 'captain_nemo_nautilus':
    case 'crossover_captain_nemo_nautilus':
      // Captain Nemo Nautilus Compass & Marine Steel Scimitar (2002)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-nemo" role="img" aria-label="Compas Marin du Capitaine Nemo">
          <circle cx="40" cy="40" r="36" fill="#001e1d" stroke="#00897b" stroke-width="2.5" />
          <circle cx="40" cy="40" r="26" fill="none" stroke="#26a69a" stroke-width="1.5" stroke-dasharray="4,2" />
          <polygon points="40,16 45,35 64,40 45,45 40,64 35,45 16,40 35,35" fill="#ffd54f" stroke="#ffb300" stroke-width="1" />
        </svg>
      `.trim();

    case 'zealot_wildcats':
    case 'crossover_zealot_wildcats':
      // Zealot Kherubim Double Coda Kusarigama (1998)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-zealot" role="img" aria-label="Double Glaive Coda de Zealot">
          <circle cx="40" cy="40" r="36" fill="#1f0714" stroke="#ad1457" stroke-width="2.5" />
          <path d="M22 62 Q36 28 58 18 Q46 38 42 62 Z" fill="#e91e63" stroke="#f48fb1" stroke-width="1.5" />
          <line x1="20" y1="64" x2="60" y2="16" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'batman_beyond':
    case 'crossover_batman_beyond':
      // Batman Beyond Cyber Bat-Suit Red V-Insigne (1999)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-batman-beyond" role="img" aria-label="Insigne Néo-Gotham de Batman Beyond">
          <circle cx="40" cy="40" r="36" fill="#0d0d0d" stroke="#d50000" stroke-width="2.5" />
          <polygon points="40,28 52,14 66,22 48,56 40,70 32,56 14,22 28,14" fill="#d50000" stroke="#ff1744" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'darkness_jackie_ascendant':
    case 'crossover_darkness_jackie_ascendant':
      // Jackie Estacado Darkness Ascendant Demon Mask & Darkling Fangs (2001)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-darkness-ascendant" role="img" aria-label="Sceau Suprême du Darkness Ascendant">
          <circle cx="40" cy="40" r="36" fill="#05140a" stroke="#00e676" stroke-width="2.5" />
          <polygon points="40,10 64,26 56,68 40,76 24,68 16,26" fill="#1b2e1e" stroke="#00c853" stroke-width="2" />
          <path d="M26 34 Q34 26 38 40 Q28 44 26 34 Z" fill="#00e676" />
          <path d="M54 34 Q46 26 42 40 Q52 44 54 34 Z" fill="#00e676" />
          <circle cx="40" cy="58" r="4" fill="#ffffff" />
        </svg>
      `.trim();

    case 'terminator_t_infinity_prime':
    case 'crossover_terminator_t_infinity_prime':
      // Skynet T-Infinity Prime Liquid Metal Temporal Core (2000)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-t-infinity-prime" role="img" aria-label="Noyau Temporel du T-Infinity Prime">
          <circle cx="40" cy="40" r="36" fill="#081827" stroke="#00b0ff" stroke-width="2.5" />
          <ellipse cx="40" cy="40" rx="22" ry="12" fill="none" stroke="#00e5ff" stroke-width="2" transform="rotate(30 40 40)" />
          <ellipse cx="40" cy="40" rx="22" ry="12" fill="none" stroke="#00e5ff" stroke-width="2" transform="rotate(-30 40 40)" />
          <circle cx="40" cy="40" r="8" fill="#d50000" stroke="#ff1744" stroke-width="2" />
        </svg>
      `.trim();

    case 'predator_killer_suit':
    case 'crossover_predator_killer_suit':
      // Predator Killer Gauntlet Suit Nanotech Deployment (2018)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-predator-killer" role="img" aria-label="Gantelet Nanotech Predator Killer">
          <circle cx="40" cy="40" r="36" fill="#1e1806" stroke="#ffd600" stroke-width="2.5" />
          <polygon points="40,12 60,26 54,64 40,72 26,64 20,26" fill="#3e2723" stroke="#ffd600" stroke-width="2" />
          <line x1="28" y1="36" x2="38" y2="36" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" />
          <line x1="42" y1="36" x2="52" y2="36" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" />
          <polygon points="40,46 45,56 35,56" fill="#ffd600" />
        </svg>
      `.trim();




    default:
      return getYautjaClanLogo(size);
  }
}

/**
 * Insigne Officiel 1:1 de l'OWLF (Other World Life Forms Taskforce - Peter Keyes 1990).
 */
export function getOWLFLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-owlf" role="img" aria-label="Insigne OWLF Peter Keyes">
      <defs>
        <radialGradient id="owlf-radar-${size}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#0a192f" stop-opacity="0.9" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="url(#owlf-radar-${size})" stroke="#00e5ff" stroke-width="2" />
      <circle cx="40" cy="40" r="26" fill="none" stroke="#00e5ff" stroke-width="1" stroke-dasharray="4,3" />
      <circle cx="40" cy="40" r="14" fill="none" stroke="#00e5ff" stroke-width="1" />
      <line x1="40" y1="4" x2="40" y2="76" stroke="#00e5ff" stroke-width="1" />
      <line x1="4" y1="40" x2="76" y2="40" stroke="#00e5ff" stroke-width="1" />
      <rect x="18" y="32" width="44" height="16" rx="2" fill="#060c14" stroke="#00e5ff" stroke-width="1" />
      <text x="40" y="44" font-family="'Orbitron', sans-serif" font-size="9" font-weight="900" fill="#ffffff" letter-spacing="2" text-anchor="middle">OWLF</text>
    </svg>
  `.trim();
}

/**
 * Insigne Officiel 1:1 du Projet Stargazer (The Predator 2018).
 */
export function getStargazerLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-stargazer" role="img" aria-label="Insigne Projet Stargazer">
      <defs>
        <linearGradient id="stargazer-grad-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff1744" />
          <stop offset="100%" stop-color="#880e4f" />
        </linearGradient>
      </defs>
      <polygon points="40,6 74,68 6,68" fill="#0d1117" stroke="#ff1744" stroke-width="2" />
      <polygon points="40,16 66,62 14,62" fill="url(#stargazer-grad-${size})" opacity="0.35" />
      <circle cx="40" cy="44" r="8" fill="#ff1744" />
      <path d="M30 30 Q40 40 50 30 M30 54 Q40 44 50 54" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" />
      <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="6.5" font-weight="800" fill="#ff8a80" letter-spacing="1" text-anchor="middle">STARGAZER</text>
    </svg>
  `.trim();
}

/**
 * Signalétique des chasses déclarées ; les créations de jeu restent distinctes
 * de leurs sources d'inspiration.
 */
export function getHuntCardLogo(huntId, size = 64) {
  switch (huntId) {
    case 'goliath':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="${size * 1.5}" height="${size * 0.9}" class="canon-logo logo-hunt-goliath" role="img" aria-label="Goliath Xeno-Akumo">
          <polygon points="50,4 88,20 74,56 50,52 26,56 12,20" fill="#140a04" stroke="#ff5511" stroke-width="2" />
          <path d="M50 4 L50 38 M30 20 L50 38 L70 20" stroke="#ff8800" stroke-width="3" stroke-linecap="round" />
          <circle cx="50" cy="38" r="5" fill="#ff2200" />
        </svg>
      `.trim();

    case 'xeno_queen':
      return getXenomorphHiveLogo(size);

    case 'bad_blood':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-bad-blood" role="img" aria-label="Yautja Bad Blood">
          <polygon points="40,8 68,22 62,68 40,76 18,68 12,22" fill="#160505" stroke="#ff1744" stroke-width="2.5" />
          <line x1="18" y1="18" x2="62" y2="62" stroke="#d50000" stroke-width="4" stroke-linecap="round" />
          <circle cx="34" cy="36" r="3.5" fill="#ff5252" />
          <circle cx="48" cy="36" r="3.5" fill="#ff5252" />
        </svg>
      `.trim();

    case 'predalien':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 70" width="${size * 1.3}" height="${size}" class="canon-logo logo-hunt-predalien" role="img" aria-label="Predalien Gunnison">
          <path d="M25 18 C45 6, 65 6, 75 18 C85 32, 80 54, 66 62 L34 62 C20 54, 15 32, 25 18 Z" fill="#1f1800" stroke="#ffd000" stroke-width="2" />
          <path d="M14 38 L30 44 M86 38 L70 44 M18 54 L34 50 M82 54 L66 50" stroke="#ffaa00" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="50" cy="36" r="6" fill="#ffff00" />
        </svg>
      `.trim();

    case 'super_predator':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-berserker" role="img" aria-label="Berserker Super Predator">
          <polygon points="40,8 72,24 64,68 40,76 16,68 8,24" fill="#180404" stroke="#ff3d00" stroke-width="2.5" />
          <path d="M26 48 L40 60 L54 48" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" />
          <circle cx="50" cy="32" r="5" fill="#ff1744" />
        </svg>
      `.trim();

    case 'feral_predator':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-feral" role="img" aria-label="Feral Predator 1719">
          <polygon points="40,10 70,24 64,64 40,74 16,64 10,24" fill="#1a140a" stroke="#d7ccc8" stroke-width="2" />
          <ellipse cx="40" cy="42" rx="16" ry="24" fill="#5d4037" stroke="#bcaaa4" stroke-width="2" />
          <circle cx="34" cy="32" r="3" fill="#ffe082" />
          <circle cx="46" cy="32" r="3" fill="#ffe082" />
        </svg>
      `.trim();

    case 'wolf_cleaner':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-wolf" role="img" aria-label="Wolf Cleaner Elite">
          <polygon points="40,8 70,22 66,66 40,76 14,66 10,22" fill="#081418" stroke="#00e5ff" stroke-width="2.5" />
          <circle cx="32" cy="34" r="3.5" fill="#00e5ff" />
          <circle cx="48" cy="34" r="3.5" fill="#00e5ff" />
          <circle cx="68" cy="18" r="3" fill="#00e5ff" />
          <circle cx="12" cy="18" r="3" fill="#00e5ff" />
        </svg>
      `.trim();

    case 'kalisk':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-kalisk" role="img" aria-label="Kalisk Badlands">
          <polygon points="40,8 72,28 62,68 40,76 18,68 8,28" fill="#120c1a" stroke="#e040fb" stroke-width="2.5" />
          <polygon points="40,24 56,40 40,56 24,40" fill="#7b1fa2" stroke="#ea80fc" stroke-width="1.8" />
          <circle cx="40" cy="40" r="5" fill="#ffffff" />
        </svg>
      `.trim();

    case 'upgrade_predator':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-upgrade" role="img" aria-label="Prédateur génétiquement amélioré"><path d="M16 26 27 10h26l11 16-6 31-18 16-18-16z" fill="#201f18" stroke="#c2bc8d" stroke-width="2"/><path d="m24 34 11 3m10 0 11-3M30 47l-9 13 13-5m16-8 9 13-13-5M31 25l9-6 9 6M40 38v13" fill="none" stroke="#c2bc8d" stroke-width="2"/></svg>`;

    case 'city_hunter':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-city" role="img" aria-label="Bio-masque du City Hunter"><path d="M17 20 40 8l23 12-5 38-18 15-18-15z" fill="#261d12" stroke="#d4a464" stroke-width="2"/><path d="m25 32 10 4m10 0 10-4M34 43h12l-2 19h-8zM25 48v9m30-9v9" fill="none" stroke="#d4a464" stroke-width="2"/><g fill="#ff4932"><circle cx="57" cy="20" r="2"/><circle cx="64" cy="19" r="2"/><circle cx="61" cy="25" r="2"/></g></svg>`;

    case 'grid_alien':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-grid" role="img" aria-label="Dôme xénomorphe de Grid aux cicatrices quadrillées"><path d="M13 30C17 7 64 7 68 30c3 17-13 25-21 31l-7 12-9-13C19 54 10 46 13 30z" fill="#101b19" stroke="#8dbda4" stroke-width="2"/><path d="m21 21 29 29M18 33l24 24M29 17l30 29M52 18 23 47m38-19L32 57M29 60h19M36 64v5m7-5v5" fill="none" stroke="#b4cba0" stroke-width="1.7"/></svg>`;

    case 'vydrach_prime':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-vydrach" role="img" aria-label="Épreuve originale du Vy’drach"><path d="m40 16 7 12 26-14-8 27-17 9-8 22-8-22-17-9-8-27 26 14z" fill="#25171b" stroke="#d7a286" stroke-width="2"/><path d="m40 24 1 27M12 20l21 17m35-17L47 37M20 37l12 7m28-7-12 7" fill="none" stroke="#d7a286" stroke-width="2"/></svg>`;

    case 'rhynth_titan':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-rhynth" role="img" aria-label="Épreuve originale du Rhynth"><path d="m40 22 25 11-6 26-19 13-19-13-6-26z" fill="#241e16" stroke="#ceb38a" stroke-width="2"/><path d="M32 29 40 5l8 24M24 42l10 4m12 0 10-4M25 58l15 7 15-7M21 29 11 17l3 23m45-11 10-12-3 23" fill="none" stroke="#ceb38a" stroke-width="2"/></svg>`;

    case 'xeno_king':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-hunt-xeno-king" role="img" aria-label="Épreuve originale du Roi xénomorphe"><path d="m40 5 8 20L67 9l-6 27 12 12-22 8-11 19-11-19-22-8 12-12L13 9l19 16z" fill="#102018" stroke="#a8d381" stroke-width="2"/><path d="M31 38h18l-3 23H34zM33 45h14m-14 6h14m-14 6h14" fill="none" stroke="#a8d381" stroke-width="2"/></svg>`;

    case 'jungle_hunter_1987':
    default:
      return getYautjaClanLogo(size);
  }
}

/**
 * Rendu universel de l'emblème de faction 1:1 pour n'importe quelle faction ou organisation.
 */
/**
 * Logo Officiel 1:1 Seegson Synthetics (Alien: Isolation 2014).
 * Le chevron fléché 'S' stylisé en bleu cobalt et blanc industriel.
 */
export function getSeegsonLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-seegson" role="img" aria-label="Logo Seegson Synthetics">
      <circle cx="40" cy="40" r="36" fill="#0f1923" stroke="#64b5f6" stroke-width="2" />
      <path d="M22 26 L46 26 L58 38 L34 38 Z" fill="#64b5f6" />
      <path d="M58 54 L34 54 L22 42 L46 42 Z" fill="#90caf9" />
      <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="7" font-weight="900" fill="#ffffff" letter-spacing="1" text-anchor="middle">SEEGSON</text>
    </svg>
  `.trim();
}

/**
 * Logo Officiel 1:1 Borgia Industries (Predator: Concrete Jungle 2005).
 * Double hélice cybernétique et trident technologique New Way City.
 */
export function getBorgiaIndustriesLogo(size = 64) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-borgia" role="img" aria-label="Logo Borgia Industries">
      <polygon points="40,8 70,24 70,56 40,72 10,56 10,24" fill="#06121e" stroke="#00e5ff" stroke-width="2" />
      <path d="M30 24 L50 24 L40 40 Z" fill="#00e5ff" />
      <path d="M30 56 L50 56 L40 40 Z" fill="#00b0ff" />
      <text x="40" y="66" font-family="'Orbitron', sans-serif" font-size="6.5" font-weight="900" fill="#e0f7fa" letter-spacing="1" text-anchor="middle">BORGIA</text>
    </svg>
  `.trim();
}

/**
 * Insignes & Emblèmes Vectoriels 1:1 pour les Escouades & Groupes d'Intervention.
 */
export function getSquadLogo(squadId, size = 64) {
  if (!squadId) return getYautjaClanLogo(size);
  const id = String(squadId).toLowerCase();

  // 1. Escouade Commando Dutch 1987 (Val Verde)
  if (id.includes('dutch') || id.includes('val_verde')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-dutch" role="img" aria-label="Insigne Commando Val Verde 1987">
        <circle cx="40" cy="40" r="36" fill="#1b2418" stroke="#556b2f" stroke-width="2.5" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#d4af37" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.7" />
        <path d="M18 40 L62 40 M40 18 L40 62" stroke="#d4af37" stroke-width="1.2" opacity="0.6" />
        <circle cx="40" cy="40" r="14" fill="none" stroke="#ff3d00" stroke-width="2" />
        <circle cx="40" cy="40" r="3" fill="#ff3d00" />
        <path d="M26 58 L54 22 L58 26 L30 62 Z" fill="#cfd8dc" stroke="#37474f" stroke-width="1" />
        <path d="M24 60 L28 64 L22 66 Z" fill="#8d6e63" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="5.5" font-weight="900" fill="#aed581" letter-spacing="1" text-anchor="middle">VAL VERDE '87</text>
      </svg>
    `.trim();
  }

  // 2. Section Marines Coloniaux USCM Hadley's Hope 1986
  if (id === 'squad_uscm_hadleys_hope_1986' || ((id.includes('uscm') || id.includes('hadleys')) && !id.includes('iron_bear') && !id.includes('militia'))) {
    return getUSCMLogo(size);
  }

  // 3. Équipage USCSS Nostromo 1979
  if (id.includes('nostromo')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-nostromo" role="img" aria-label="Insigne USCSS Nostromo">
        <polygon points="40,8 72,24 72,56 40,72 8,56 8,24" fill="#0d1b2a" stroke="#415a77" stroke-width="2" />
        <path d="M20 32 Q40 16 60 32 L56 50 Q40 58 24 50 Z" fill="#1b263b" stroke="#e0a96d" stroke-width="1.5" />
        <path d="M16 38 L30 38 L36 48 L14 44 Z" fill="#e0a96d" opacity="0.8" />
        <path d="M64 38 L50 38 L44 48 L66 44 Z" fill="#e0a96d" opacity="0.8" />
        <circle cx="40" cy="38" r="6" fill="#0d1b2a" stroke="#e0a96d" stroke-width="1.5" />
        <text x="40" y="65" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#e0e1dd" letter-spacing="1" text-anchor="middle">NOSTROMO 180286</text>
      </svg>
    `.trim();
  }

  // 4. Mercenaires Betty 1997
  if (id.includes('betty')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-betty" role="img" aria-label="Insigne Mercenaires du Betty">
        <circle cx="40" cy="40" r="35" fill="#1c0f13" stroke="#b71c1c" stroke-width="2.5" />
        <path d="M22 24 L58 56 M58 24 L22 56" stroke="#78909c" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="40" cy="36" r="13" fill="#d32f2f" stroke="#ffebee" stroke-width="1.5" />
        <circle cx="36" cy="34" r="2.5" fill="#1c0f13" />
        <circle cx="44" cy="34" r="2.5" fill="#1c0f13" />
        <rect x="36" y="44" width="8" height="6" fill="#d32f2f" stroke="#ffebee" stroke-width="1" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="5.5" font-weight="900" fill="#ffcdd2" letter-spacing="1" text-anchor="middle">THE BETTY</text>
      </svg>
    `.trim();
  }

  // 5. Working Joes Seegson 2137
  if (id.includes('seegson') || id.includes('working_joe')) {
    return getSeegsonLogo(size);
  }

  // 6. Guerriers Comanches 1719
  if (id.includes('comanche')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-comanche" role="img" aria-label="Insigne Guerriers Comanches">
        <circle cx="40" cy="40" r="35" fill="#2d1e12" stroke="#c86432" stroke-width="2.5" />
        <circle cx="40" cy="40" r="24" fill="#4e342e" stroke="#e0a96d" stroke-width="1.8" />
        <line x1="20" y1="20" x2="60" y2="60" stroke="#f0e6d2" stroke-width="2" />
        <line x1="60" y1="20" x2="20" y2="60" stroke="#f0e6d2" stroke-width="2" />
        <polygon points="60,20 54,23 57,26" fill="#c86432" />
        <polygon points="20,20 26,23 23,26" fill="#c86432" />
        <path d="M40 22 C36 32 38 48 40 58 C42 48 44 32 40 22 Z" fill="#f5f5f5" stroke="#3e2723" stroke-width="1" />
        <line x1="40" y1="22" x2="40" y2="58" stroke="#c86432" stroke-width="1" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#ffcc80" letter-spacing="1" text-anchor="middle">COMANCHE 1719</text>
      </svg>
    `.trim();
  }

  // 7. Expédition Bouvetøya Weyland 2004
  if (id.includes('bouvetoya')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-bouvetoya" role="img" aria-label="Insigne Expédition Bouvetøya">
        <polygon points="40,6 74,25 74,65 40,76 6,65 6,25" fill="#0c1821" stroke="#00b4d8" stroke-width="2" />
        <polygon points="40,24 60,54 20,54" fill="#1e3d59" stroke="#90e0ef" stroke-width="1.5" />
        <polygon points="40,24 50,54 40,54" fill="#0077b6" />
        <circle cx="40" cy="24" r="3" fill="#ffb703" />
        <line x1="24" y1="34" x2="56" y2="48" stroke="#e0e1dd" stroke-width="2" />
        <text x="40" y="70" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#90e0ef" letter-spacing="1" text-anchor="middle">BOUVETØYA 2004</text>
      </svg>
    `.trim();
  }

  // 8. Commando Weyland Black-Ops Bio-Confinement
  if (id.includes('blackops') || id.includes('weyland_blackops')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-blackops" role="img" aria-label="Insigne Weyland Black-Ops">
        <polygon points="40,6 74,25 74,65 40,76 6,65 6,25" fill="#120c14" stroke="#ff1744" stroke-width="2" />
        <path d="M40 22 L58 54 L22 54 Z" fill="none" stroke="#ff1744" stroke-width="2.5" />
        <circle cx="40" cy="38" r="6" fill="#ff1744" />
        <circle cx="40" cy="38" r="2.5" fill="#120c14" />
        <path d="M30 46 L34 40 M50 46 L46 40 M40 28 L40 34" stroke="#ff1744" stroke-width="2" />
        <text x="40" y="70" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#ff8a80" letter-spacing="1" text-anchor="middle">WY BLACK-OPS</text>
      </svg>
    `.trim();
  }

  // 9. Brigade Criminelle LAPD Harrigan (Predator 2)
  if (id.includes('lapd') || id.includes('harrigan')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-lapd" role="img" aria-label="Insigne LAPD Harrigan">
        <polygon points="40,6 72,18 64,68 40,76 16,68 8,18" fill="#0d1b2a" stroke="#d4af37" stroke-width="2" />
        <polygon points="40,16 46,30 62,30 48,40 54,54 40,44 26,54 32,40 18,30 34,30" fill="#d4af37" opacity="0.9" />
        <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#ffffff" letter-spacing="1" text-anchor="middle">LAPD METRO</text>
      </svg>
    `.trim();
  }

  // 10. Cartel Vaudou King Willie (Predator 2)
  if (id.includes('king_willie') || id.includes('posse')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-voodoo" role="img" aria-label="Insigne Cartel Vaudou">
        <circle cx="40" cy="40" r="35" fill="#1a0022" stroke="#7b1fa2" stroke-width="2.5" />
        <circle cx="40" cy="36" r="14" fill="#311b92" stroke="#e040fb" stroke-width="1.8" />
        <circle cx="35" cy="34" r="2.5" fill="#ffd600" />
        <circle cx="45" cy="34" r="2.5" fill="#ffd600" />
        <path d="M30 54 L50 54 L40 64 Z" fill="#e040fb" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#ffd600" letter-spacing="1" text-anchor="middle">VOODOO POSSE</text>
      </svg>
    `.trim();
  }

  // 11. Évadés de la Réserve Royce (Predators 2010)
  if (id.includes('royce') || id.includes('survivors_2010')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-royce" role="img" aria-label="Insigne Évadés de la Réserve">
        <polygon points="40,8 72,24 68,64 40,74 12,64 8,24" fill="#1b2e1e" stroke="#689f38" stroke-width="2" />
        <path d="M22 28 Q40 14 58 28 L40 58 Z" fill="none" stroke="#cddc39" stroke-width="2" />
        <line x1="40" y1="20" x2="40" y2="58" stroke="#ffeb3b" stroke-width="1.5" />
        <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#f1f8e9" letter-spacing="1" text-anchor="middle">PRESERVE '10</text>
      </svg>
    `.trim();
  }

  // 12. Super Predators Berserkers (Predators 2010)
  if (id.includes('berserkers') || id.includes('super_clan')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-berserker" role="img" aria-label="Insigne Clan Berserker">
        <circle cx="40" cy="40" r="35" fill="#1a0505" stroke="#d50000" stroke-width="2.5" />
        <path d="M22 24 L58 24 L48 56 L32 56 Z" fill="#b71c1c" stroke="#ff1744" stroke-width="2" />
        <circle cx="40" cy="36" r="5" fill="#ff5252" />
        <path d="M26 60 L54 60 L40 70 Z" fill="#d50000" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#ff8a80" letter-spacing="1" text-anchor="middle">SUPER BERSERKER</text>
      </svg>
    `.trim();
  }

  // 13. The Loonies McKenna (The Predator 2018)
  if (id.includes('loonies')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-loonies" role="img" aria-label="Insigne The Loonies">
        <polygon points="40,8 72,28 62,68 40,74 18,68 8,28" fill="#1f2421" stroke="#81c784" stroke-width="2" />
        <circle cx="40" cy="38" r="14" fill="#2e7d32" stroke="#a5d6a7" stroke-width="2" />
        <path d="M34 38 L46 38 M40 32 L40 44" stroke="#ffffff" stroke-width="2.5" />
        <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#e8f5e9" letter-spacing="1" text-anchor="middle">THE LOONIES</text>
      </svg>
    `.trim();
  }

  // 14. Division Stargazer Strike (The Predator 2018)
  if (id.includes('stargazer_strike')) {
    return getStargazerLogo(size);
  }

  // 15. Survivants Gunnison (AVP: Requiem 2007)
  if (id.includes('gunnison_citizens')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-gunnison" role="img" aria-label="Insigne Survivants Gunnison">
        <circle cx="40" cy="40" r="35" fill="#0d1b2a" stroke="#00b4d8" stroke-width="2.5" />
        <path d="M40 18 L54 50 L26 50 Z" fill="#1b4965" stroke="#90e0ef" stroke-width="2" />
        <circle cx="40" cy="38" r="4" fill="#00e5ff" />
        <text x="40" y="70" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#caf0f8" letter-spacing="1" text-anchor="middle">GUNNISON '07</text>
      </svg>
    `.trim();
  }

  // 16. Essaim Predalien (AVP: Requiem 2007)
  if (id.includes('predalien_infestation')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-predalien" role="img" aria-label="Insigne Essaim Predalien">
        <polygon points="40,6 74,25 74,65 40,76 6,65 6,25" fill="#0f1f0a" stroke="#76ff03" stroke-width="2" />
        <path d="M26 28 Q40 12 54 28 Q60 54 40 68 Q20 54 26 28 Z" fill="#1b3a12" stroke="#ccff90" stroke-width="2" />
        <circle cx="34" cy="36" r="3" fill="#ff1744" />
        <circle cx="46" cy="36" r="3" fill="#ff1744" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#ccff90" letter-spacing="1" text-anchor="middle">CHET PREDALIEN</text>
      </svg>
    `.trim();
  }

  // 17. Éclaireuses des Badlands (Predator: Badlands 2025)
  if (id.includes('twin_outcasts') || id.includes('badlands_twin')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-badlands" role="img" aria-label="Insigne Éclaireuses des Badlands">
        <circle cx="40" cy="40" r="35" fill="#2d1e12" stroke="#ff9800" stroke-width="2.5" />
        <line x1="24" y1="20" x2="56" y2="60" stroke="#ffb74d" stroke-width="2" />
        <line x1="56" y1="20" x2="24" y2="60" stroke="#ffb74d" stroke-width="2" />
        <circle cx="40" cy="40" r="10" fill="#e65100" stroke="#ffe0b2" stroke-width="2" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#ffe082" letter-spacing="1" text-anchor="middle">BADLANDS '25</text>
      </svg>
    `.trim();
  }

  // 18. Brigade Bionique Weyland Badlands
  if (id.includes('weyland_scavenger') || id.includes('badlands_weyland')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-weyland-badlands" role="img" aria-label="Insigne Brigade Weyland Badlands">
        <polygon points="40,8 72,24 68,64 40,74 12,64 8,24" fill="#1b1c1e" stroke="#d4af37" stroke-width="2" />
        <path d="M22 28 L40 50 L58 28 L48 28 L40 38 L32 28 Z" fill="#d4af37" />
        <circle cx="40" cy="58" r="4" fill="#ff9800" />
        <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#ffd54f" letter-spacing="1" text-anchor="middle">WY SCAVENGER</text>
      </svg>
    `.trim();
  }

  // 19. Champions Historiques Killers of Killers
  if (id.includes('killers_of_killers')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-killers" role="img" aria-label="Insigne Tueurs de Tueurs">
        <polygon points="40,8 72,26 66,66 40,74 14,66 8,26" fill="#1b1b1b" stroke="#ffd700" stroke-width="2" />
        <path d="M24 24 L56 56 M56 24 L24 56" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round" />
        <circle cx="40" cy="40" r="8" fill="#b71c1c" stroke="#ffd700" stroke-width="1.5" />
        <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#ffd700" letter-spacing="1" text-anchor="middle">KILLER OF KILLERS</text>
      </svg>
    `.trim();
  }

  // 20. Syndicat Borgia Concrete Jungle
  if (id.includes('borgia_syndicate') || id.includes('concrete_jungle')) {
    return getBorgiaIndustriesLogo(size);
  }

  // 21. Trio Jeunes Sangs AVP 2004
  if (id.includes('young_bloods') || id.includes('avp_young')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-young-bloods" role="img" aria-label="Insigne Trio Jeunes Sangs">
        <polygon points="40,6 74,25 74,65 40,76 6,65 6,25" fill="#120c14" stroke="#ff5511" stroke-width="2" />
        <circle cx="40" cy="28" r="4" fill="#ff1100" />
        <circle cx="28" cy="50" r="4" fill="#ff1100" />
        <circle cx="52" cy="50" r="4" fill="#ff1100" />
        <path d="M40 28 L28 50 L52 50 Z" fill="none" stroke="#ff5511" stroke-width="1.5" stroke-dasharray="2,2" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#ffab91" letter-spacing="1" text-anchor="middle">YOUNG BLOODS</text>
      </svg>
    `.trim();
  }


  // 22. Trappeurs Français 1719 (Prey)
  if (id.includes('voyageurs') || id.includes('prey_french')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-voyageurs" role="img" aria-label="Insigne Trappeurs Français 1719">
        <circle cx="40" cy="40" r="36" fill="#2b1d0c" stroke="#bcaaa4" stroke-width="2.5" />
        <path d="M20 54 L60 26 M20 26 L60 54" stroke="#8d6e63" stroke-width="3" stroke-linecap="round" />
        <circle cx="40" cy="40" r="14" fill="#4e342e" stroke="#d7ccc8" stroke-width="1.5" />
        <path d="M35 34 L45 34 L40 46 Z" fill="#d7ccc8" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#d7ccc8" letter-spacing="1" text-anchor="middle">VOYAGEURS 1719</text>
      </svg>
    `.trim();
  }

  // 23. Détenus Fiorina 161 (Alien³)
  if (id.includes('fiorina_inmates') || id.includes('fiorina_161')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-fiorina" role="img" aria-label="Insigne Fiorina 161">
        <polygon points="40,8 72,24 72,56 40,72 8,56 8,24" fill="#1c1917" stroke="#ea580c" stroke-width="2.5" />
        <line x1="40" y1="20" x2="40" y2="52" stroke="#ea580c" stroke-width="3" />
        <line x1="28" y1="32" x2="52" y2="32" stroke="#ea580c" stroke-width="3" />
        <text x="40" y="66" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#fdba74" letter-spacing="1" text-anchor="middle">FURY 161</text>
      </svg>
    `.trim();
  }

  // 24. Dog Catchers Weyland (Alien³)
  if (id.includes('dog_catchers')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-dogcatchers" role="img" aria-label="Insigne Dog Catchers">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#eab308" stroke-width="2.5" />
        <circle cx="40" cy="40" r="22" fill="none" stroke="#eab308" stroke-width="1.5" stroke-dasharray="4,2" />
        <polygon points="40,24 52,48 28,48" fill="#eab308" opacity="0.8" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fef08a" letter-spacing="1" text-anchor="middle">DOG CATCHERS</text>
      </svg>
    `.trim();
  }

  // 25. Expédition Prometheus (Prometheus)
  if (id.includes('prometheus_expedition')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-prometheus" role="img" aria-label="Insigne Prometheus">
        <circle cx="40" cy="40" r="36" fill="#032030" stroke="#00e5ff" stroke-width="2.5" />
        <polygon points="40,16 62,38 40,60 18,38" fill="none" stroke="#00e5ff" stroke-width="2" />
        <circle cx="40" cy="38" r="6" fill="#00e5ff" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#b2ebf2" letter-spacing="1" text-anchor="middle">PROMETHEUS</text>
      </svg>
    `.trim();
  }

  // 26. Éveil des Ingénieurs (Prometheus)
  if (id.includes('engineer_awakening')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-engineers" role="img" aria-label="Insigne Ingénieurs">
        <polygon points="40,6 74,25 74,65 40,76 6,65 6,25" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
        <circle cx="40" cy="36" r="16" fill="#0f172a" stroke="#cbd5e1" stroke-width="2" />
        <circle cx="34" cy="34" r="3" fill="#cbd5e1" />
        <circle cx="46" cy="34" r="3" fill="#cbd5e1" />
        <text x="40" y="70" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#e2e8f0" letter-spacing="1" text-anchor="middle">ENGINEERS</text>
      </svg>
    `.trim();
  }

  // 27. Colons Covenant (Alien: Covenant)
  if (id.includes('covenant_colonists')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-covenant" role="img" aria-label="Insigne Covenant">
        <circle cx="40" cy="40" r="36" fill="#141e17" stroke="#22c55e" stroke-width="2.5" />
        <path d="M25 50 Q40 20 55 50" fill="none" stroke="#22c55e" stroke-width="3" />
        <circle cx="40" cy="32" r="5" fill="#4ade80" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#bbf7d0" letter-spacing="1" text-anchor="middle">COVENANT</text>
      </svg>
    `.trim();
  }

  // 28. Meute Néomorphes de David (Alien: Covenant)
  if (id.includes('neomorph_david')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-neomorph" role="img" aria-label="Insigne Néomorphe">
        <circle cx="40" cy="40" r="36" fill="#18181b" stroke="#f43f5e" stroke-width="2.5" />
        <path d="M26 30 Q40 18 54 30 Q48 52 40 56 Q32 52 26 30 Z" fill="#fdf4ff" stroke="#f43f5e" stroke-width="1.5" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fecdd3" letter-spacing="1" text-anchor="middle">NEOMORPH</text>
      </svg>
    `.trim();
  }

  // 29. Mineurs Corbelan IV (Alien: Romulus)
  if (id.includes('corbelan_scavengers')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-corbelan" role="img" aria-label="Insigne Corbelan">
        <circle cx="40" cy="40" r="36" fill="#1c1917" stroke="#f59e0b" stroke-width="2.5" />
        <polygon points="40,20 60,50 20,50" fill="none" stroke="#f59e0b" stroke-width="2.5" />
        <circle cx="40" cy="38" r="4" fill="#fbbf24" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fde68a" letter-spacing="1" text-anchor="middle">CORBELAN IV</text>
      </svg>
    `.trim();
  }

  // 30. Horreurs Romulus & Offspring (Alien: Romulus)
  if (id.includes('renaissance_offspring') || id.includes('romulus_renaissance')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-offspring" role="img" aria-label="Insigne The Offspring">
        <circle cx="40" cy="40" r="36" fill="#1e1024" stroke="#a855f7" stroke-width="2.5" />
        <circle cx="40" cy="34" r="14" fill="#2e1065" stroke="#c084fc" stroke-width="1.5" />
        <circle cx="36" cy="32" r="2.5" fill="#e9d5ff" />
        <circle cx="44" cy="32" r="2.5" fill="#e9d5ff" />
        <path d="M34 42 Q40 46 46 42" stroke="#e9d5ff" stroke-width="1.5" fill="none" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#e9d5ff" letter-spacing="1" text-anchor="middle">OFFSPRING Z-01</text>
      </svg>
    `.trim();
  }

  // 31. Fireteam OWLF Voodoo & Dutch 2025 (Hunting Grounds)
  if (id.includes('fireteam_voodoo')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-voodoo" role="img" aria-label="Insigne Fireteam Voodoo">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="40" cy="38" r="18" fill="none" stroke="#38bdf8" stroke-width="2" />
        <path d="M40 20 L40 56 M22 38 L58 38" stroke="#38bdf8" stroke-width="1.5" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bae6fd" letter-spacing="1" text-anchor="middle">OWLF VOODOO</text>
      </svg>
    `.trim();
  }

  // 32. Cercle des Légendes Yautja (Hunting Grounds)
  if (id.includes('legends_circle') || id.includes('yautja_legends')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-legends" role="img" aria-label="Insigne Légendes Yautja">
        <polygon points="40,6 74,25 74,65 40,76 6,65 6,25" fill="#1c1917" stroke="#eab308" stroke-width="2.5" />
        <circle cx="40" cy="38" r="14" fill="#451a03" stroke="#facc15" stroke-width="2" />
        <polygon points="40,28 44,36 52,38 46,44 48,52 40,48 32,52 34,44 28,38 36,36" fill="#facc15" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fef08a" letter-spacing="1" text-anchor="middle">YAUTJA LEGENDS</text>
      </svg>
    `.trim();
  }

  // 33. Marines UAS Endeavor (Aliens: Fireteam Elite)
  if (id.includes('endeavor_marines')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-endeavor" role="img" aria-label="Insigne UAS Endeavor">
        <polygon points="40,8 72,24 72,56 40,72 8,56 8,24" fill="#0f172a" stroke="#3b82f6" stroke-width="2.5" />
        <path d="M26 48 L40 26 L54 48 Z" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2" />
        <circle cx="40" cy="40" r="4" fill="#93c5fd" />
        <text x="40" y="66" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bfdbfe" letter-spacing="1" text-anchor="middle">ENDEAVOR</text>
      </svg>
    `.trim();
  }

  // 34. Essaim Rouge Monica (Aliens: Fireteam Elite)
  if (id.includes('pathogen_swarm') || id.includes('katanga_pathogen')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-monica" role="img" aria-label="Insigne Essaim Monica">
        <circle cx="40" cy="40" r="36" fill="#1c0505" stroke="#ef4444" stroke-width="2.5" />
        <path d="M28 26 Q40 14 52 26 Q56 48 40 58 Q24 48 28 26 Z" fill="#7f1d1d" stroke="#ef4444" stroke-width="2" />
        <circle cx="40" cy="34" r="5" fill="#fca5a5" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fca5a5" letter-spacing="1" text-anchor="middle">MONICA SWARM</text>
      </svg>
    `.trim();
  }
  if (id.includes('cold_war_spetsnaz')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-spetsnaz" role="img" aria-label="Insigne Spetsnaz de Sibérie">
        <circle cx="40" cy="40" r="36" fill="#0c1926" stroke="#38bdf8" stroke-width="2.5" />
        <polygon points="40,14 46,32 64,32 50,42 55,60 40,49 25,60 30,42 16,32 34,32" fill="#dc2626" stroke="#fbbf24" stroke-width="1.5" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bae6fd" letter-spacing="1" text-anchor="middle">KOLA SPETSNAZ</text>
      </svg>
    `.trim();
  }
  if (id.includes('enforcers_council')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-enforcers" role="img" aria-label="Insigne Arbitres Enforcers">
        <circle cx="40" cy="40" r="36" fill="#111827" stroke="#e5e7eb" stroke-width="2.5" />
        <polygon points="40,12 58,28 50,62 40,68 30,62 22,28" fill="#374151" stroke="#f3f4f6" stroke-width="2" />
        <circle cx="40" cy="36" r="6" fill="#ef4444" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#f9fafb" letter-spacing="1" text-anchor="middle">ENFORCERS</text>
      </svg>
    `.trim();
  }
  if (id.includes('dark_descent_cerberus')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-cerberus" role="img" aria-label="Insigne USCM Cerberus Lethe">
        <circle cx="40" cy="40" r="36" fill="#091a16" stroke="#10b981" stroke-width="2.5" />
        <rect x="24" y="22" width="32" height="32" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="2" />
        <circle cx="40" cy="38" r="8" fill="none" stroke="#a7f3d0" stroke-width="2" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#6ee7b7" letter-spacing="1" text-anchor="middle">CERBERUS LETHE</text>
      </svg>
    `.trim();
  }
  if (id.includes('charon_kleist_rogue')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-rogue" role="img" aria-label="Insigne Complexe Rogue">
        <circle cx="40" cy="40" r="36" fill="#1f091d" stroke="#d946ef" stroke-width="2.5" />
        <polygon points="40,12 60,26 54,58 40,66 26,58 20,26" fill="#4a044e" stroke="#f0abfc" stroke-width="2" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#f5d0fe" letter-spacing="1" text-anchor="middle">ROGUE KING</text>
      </svg>
    `.trim();
  }
  if (id.includes('ryushi_chian_am')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ryushi" role="img" aria-label="Insigne Ranchers de Ryushi">
        <circle cx="40" cy="40" r="36" fill="#231709" stroke="#f59e0b" stroke-width="2.5" />
        <path d="M22 34 L40 16 L58 34 L50 60 L30 60 Z" fill="#78350f" stroke="#fcd34d" stroke-width="2" />
        <line x1="40" y1="22" x2="40" y2="54" stroke="#ef4444" stroke-width="3" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fde68a" letter-spacing="1" text-anchor="middle">RYUSHI MARK</text>
      </svg>
    `.trim();
  }
  if (id.includes('yautja_prime_proving')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-proving" role="img" aria-label="Insigne Champions de Yautja Prime">
        <circle cx="40" cy="40" r="36" fill="#261205" stroke="#fbbf24" stroke-width="2.5" />
        <circle cx="40" cy="38" r="20" fill="#7c2d12" stroke="#fde047" stroke-width="2" />
        <polygon points="40,22 48,46 32,46" fill="#fef08a" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fef08a" letter-spacing="1" text-anchor="middle">PRIME ARENA</text>
      </svg>
    `.trim();
  }
  if (id.includes('predator_hunters_veterans')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-phunters" role="img" aria-label="Insigne Predator Hunters">
        <circle cx="40" cy="40" r="36" fill="#0a1f17" stroke="#10b981" stroke-width="2.5" />
        <circle cx="40" cy="38" r="18" fill="none" stroke="#34d399" stroke-width="2" />
        <line x1="20" y1="38" x2="60" y2="38" stroke="#ef4444" stroke-width="2" />
        <line x1="40" y1="18" x2="40" y2="58" stroke="#ef4444" stroke-width="2" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#a7f3d0" letter-spacing="1" text-anchor="middle">HUNTERS 2017</text>
      </svg>
    `.trim();
  }
  if (id.includes('bad_blood_renegade')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-badblood" role="img" aria-label="Insigne Meute Bad Bloods">
        <circle cx="40" cy="40" r="36" fill="#240505" stroke="#dc2626" stroke-width="2.5" />
        <polygon points="40,14 60,30 52,60 40,66 28,60 20,30" fill="#450a0a" stroke="#f87171" stroke-width="2" />
        <line x1="24" y1="22" x2="56" y2="56" stroke="#ef4444" stroke-width="3" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fca5a5" letter-spacing="1" text-anchor="middle">BAD BLOODS</text>
      </svg>
    `.trim();
  }
  if (id.includes('uss_sephora')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-sephora" role="img" aria-label="Insigne USS Sephora USCM">
        <circle cx="40" cy="40" r="36" fill="#0c192c" stroke="#60a5fa" stroke-width="2.5" />
        <polygon points="40,16 58,36 40,60 22,36" fill="#1e3a8a" stroke="#93c5fd" stroke-width="2" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bfdbfe" letter-spacing="1" text-anchor="middle">USS SEPHORA</text>
      </svg>
    `.trim();
  }
  if (id.includes('innominata_research')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-labyrinth" role="img" aria-label="Insigne Labyrinthe Innominata">
        <circle cx="40" cy="40" r="36" fill="#111b24" stroke="#a855f7" stroke-width="2.5" />
        <rect x="22" y="20" width="36" height="36" fill="none" stroke="#c084fc" stroke-width="2" />
        <rect x="30" y="28" width="20" height="20" fill="none" stroke="#e9d5ff" stroke-width="2" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#e9d5ff" letter-spacing="1" text-anchor="middle">INNOMINATA</text>
      </svg>
    `.trim();
  }
  if (id.includes('bg386_elite')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-bg386" role="img" aria-label="Insigne Clan Dark BG-386">
        <circle cx="40" cy="40" r="36" fill="#1c1608" stroke="#eab308" stroke-width="2.5" />
        <polygon points="40,14 62,56 18,56" fill="#422006" stroke="#facc15" stroke-width="2" />
        <circle cx="40" cy="42" r="5" fill="#ef4444" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fef08a" letter-spacing="1" text-anchor="middle">DARK BG-386</text>
      </svg>
    `.trim();
  }
  if (id.includes('fire_and_stone')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ahab" role="img" aria-label="Insigne Croisade Ahab LV-223">
        <circle cx="40" cy="40" r="36" fill="#18121e" stroke="#f97316" stroke-width="2.5" />
        <polygon points="40,14 58,28 52,58 40,64 28,58 22,28" fill="#431407" stroke="#fb923c" stroke-width="2" />
        <line x1="28" y1="24" x2="42" y2="44" stroke="#ef4444" stroke-width="2.5" />
        <circle cx="48" cy="34" r="3.5" fill="#fde047" />
        <text x="40" y="72" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fed7aa" letter-spacing="1" text-anchor="middle">AHAB LV-223</text>
      </svg>
    `.trim();
  }
  if (id.includes('lost_tribe_1997')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-losttribe" role="img" aria-label="Insigne Lost Tribe 1997">
        <circle cx="40" cy="40" r="36" fill="#1e1508" stroke="#f59e0b" stroke-width="2.5" />
        <polygon points="40,12 58,28 52,58 40,66 28,58 22,28" fill="#78350f" stroke="#fcd34d" stroke-width="2" />
        <circle cx="40" cy="36" r="7" fill="#fef08a" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fde68a" letter-spacing="1" text-anchor="middle">LOST TRIBE 97</text>
      </svg>
    `.trim();
  }
  if (id.includes('pine_barrens_cia')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ciapines" role="img" aria-label="Insigne CIA Pine Barrens">
        <circle cx="40" cy="40" r="36" fill="#0d1912" stroke="#22c55e" stroke-width="2.5" />
        <polygon points="40,14 48,32 66,32 52,44 57,62 40,50 23,62 28,44 14,32 32,32" fill="#14532d" stroke="#86efac" stroke-width="1.5" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bbf7d0" letter-spacing="1" text-anchor="middle">PINE BARRENS</text>
      </svg>
    `.trim();
  }
  if (id.includes('prodigy_tactical')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-prodigy" role="img" aria-label="Insigne Prodigy Corp 2120">
        <circle cx="40" cy="40" r="36" fill="#071921" stroke="#06b6d4" stroke-width="2.5" />
        <ellipse cx="40" cy="38" rx="18" ry="22" fill="#164e63" stroke="#67e8f9" stroke-width="2" />
        <circle cx="40" cy="38" r="6" fill="#a5f3fc" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#cffafe" letter-spacing="1" text-anchor="middle">PRODIGY 2120</text>
      </svg>
    `.trim();
  }
  if (id.includes('usm_auriga')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-auriga" role="img" aria-label="Insigne Garnison USM Auriga">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#3b82f6" stroke-width="2.5" />
        <rect x="22" y="20" width="36" height="36" rx="6" fill="#1e3a8a" stroke="#93c5fd" stroke-width="2" />
        <text x="40" y="43" font-family="'Orbitron', sans-serif" font-size="14" font-weight="900" fill="#eff6ff" text-anchor="middle">8</text>
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bfdbfe" letter-spacing="1" text-anchor="middle">USM AURIGA</text>
      </svg>
    `.trim();
  }
  if (id.includes('capcom_avp_sanjose')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-sanjose" role="img" aria-label="Insigne Alliance San Jose 1994">
        <circle cx="40" cy="40" r="36" fill="#171026" stroke="#facc15" stroke-width="2.5" />
        <line x1="20" y1="58" x2="60" y2="18" stroke="#38bdf8" stroke-width="3.5" />
        <line x1="20" y1="18" x2="60" y2="58" stroke="#ef4444" stroke-width="3.5" />
        <circle cx="40" cy="38" r="8" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fef08a" letter-spacing="1" text-anchor="middle">SAN JOSE 1994</text>
      </svg>
    `.trim();
  }
  if (id.includes('ny_detective_john_schaefer')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-nyschaefer" role="img" aria-label="Insigne Détective John Schaefer NYPD">
        <circle cx="40" cy="40" r="36" fill="#0c1526" stroke="#eab308" stroke-width="2.5" />
        <polygon points="40,12 56,22 52,54 40,66 28,54 24,22" fill="#1e3a8a" stroke="#fde047" stroke-width="2" />
        <circle cx="40" cy="36" r="6" fill="#fef08a" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fef08a" letter-spacing="1" text-anchor="middle">NYPD SCHAEFER</text>
      </svg>
    `.trim();
  }
  if (id.includes('killer_clan_bad_blood')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-killerclan" role="img" aria-label="Insigne Clan Killer Bad Blood">
        <circle cx="40" cy="40" r="36" fill="#1f0707" stroke="#dc2626" stroke-width="2.5" />
        <polygon points="24,16 40,30 56,16 50,58 40,66 30,58" fill="#7f1d1d" stroke="#f87171" stroke-width="2" />
        <circle cx="34" cy="38" r="3" fill="#fef08a" />
        <circle cx="46" cy="38" r="3" fill="#fef08a" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fca5a5" letter-spacing="1" text-anchor="middle">KILLER CLAN</text>
      </svg>
    `.trim();
  }
  if (id.includes('out_of_shadows_marion')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-marion" role="img" aria-label="Insigne Mineurs DSMO Marion LV-178">
        <circle cx="40" cy="40" r="36" fill="#1c1409" stroke="#f59e0b" stroke-width="2.5" />
        <polygon points="40,14 62,38 40,62 18,38" fill="#78350f" stroke="#fcd34d" stroke-width="2" />
        <circle cx="40" cy="38" r="6" fill="#38bdf8" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fde68a" letter-spacing="1" text-anchor="middle">DSMO MARION</text>
      </svg>
    `.trim();
  }
  if (id.includes('upp_space_commandos')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-upp" role="img" aria-label="Insigne Commandos Spatiaux UPP">
        <circle cx="40" cy="40" r="36" fill="#210909" stroke="#ef4444" stroke-width="2.5" />
        <polygon points="40,12 47,30 66,30 51,42 56,60 40,49 24,60 29,42 14,30 33,30" fill="#b91c1c" stroke="#fde047" stroke-width="2" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fde047" letter-spacing="1" text-anchor="middle">UPP COMMANDOS</text>
      </svg>
    `.trim();
  }
  if (id.includes('life_and_death_hasdrubal')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-hasdrubal" role="img" aria-label="Insigne Peloton USS Hasdrubal">
        <circle cx="40" cy="40" r="36" fill="#0d1a12" stroke="#10b981" stroke-width="2.5" />
        <rect x="22" y="20" width="36" height="36" rx="5" fill="#064e3b" stroke="#6ee7b7" stroke-width="2" />
        <path d="M28 48 L40 26 L52 48 Z" fill="#a7f3d0" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#a7f3d0" letter-spacing="1" text-anchor="middle">USS HASDRUBAL</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_eternal_suwa')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-suwa" role="img" aria-label="Insigne Syndicat Gideon Suwa Tokyo">
        <circle cx="40" cy="40" r="36" fill="#170d26" stroke="#c084fc" stroke-width="2.5" />
        <circle cx="40" cy="38" r="18" fill="#4c1d95" stroke="#e9d5ff" stroke-width="2" />
        <polygon points="40,24 52,46 28,46" fill="#facc15" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#e9d5ff" letter-spacing="1" text-anchor="middle">SUWA TOKYO 98</text>
      </svg>
    `.trim();
  }
  if (id.includes('london_1896_edward_soames')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-london1896" role="img" aria-label="Insigne Scotland Yard 1896">
        <circle cx="40" cy="40" r="36" fill="#18181b" stroke="#38bdf8" stroke-width="2.5" />
        <path d="M24 20 L56 20 L50 60 L40 68 L30 60 Z" fill="#0f172a" stroke="#7dd3fc" stroke-width="2" />
        <circle cx="40" cy="38" r="8" fill="#bae6fd" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#bae6fd" letter-spacing="1" text-anchor="middle">LONDON 1896</text>
      </svg>
    `.trim();
  }
  if (id.includes('south_china_sea_pirates')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-spratley" role="img" aria-label="Insigne Mercenaires Spratleys 1998">
        <circle cx="40" cy="40" r="36" fill="#052e16" stroke="#22c55e" stroke-width="2.5" />
        <polygon points="40,14 62,32 54,62 26,62 18,32" fill="#14532d" stroke="#86efac" stroke-width="2" />
        <circle cx="40" cy="40" r="6" fill="#facc15" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#86efac" letter-spacing="1" text-anchor="middle">SPRATLEY 98</text>
      </svg>
    `.trim();
  }
  if (id.includes('genocide_grant_xeno_zip')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-grant" role="img" aria-label="Insigne Expédition Grant Genocide">
        <circle cx="40" cy="40" r="36" fill="#3b0764" stroke="#e11d48" stroke-width="2.5" />
        <polygon points="40,12 60,30 40,66 20,30" fill="#be123c" stroke="#fda4af" stroke-width="2" />
        <circle cx="40" cy="34" r="5" fill="#fef08a" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fda4af" letter-spacing="1" text-anchor="middle">XENO-ZIP 2190</text>
      </svg>
    `.trim();
  }
  if (id.includes('cold_forge_rb323')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-coldforge" role="img" aria-label="Insigne Station Cold Forge RB-323">
        <circle cx="40" cy="40" r="36" fill="#022c22" stroke="#06b6d4" stroke-width="2.5" />
        <rect x="24" y="24" width="32" height="32" rx="4" fill="#042f2e" stroke="#2dd4bf" stroke-width="2" />
        <circle cx="40" cy="40" r="6" fill="#a7f3d0" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#2dd4bf" letter-spacing="1" text-anchor="middle">RB-323 FORGE</text>
      </svg>
    `.trim();
  }
  if (id.includes('bunda_war_machiko')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-bundawar" role="img" aria-label="Insigne Clan Bunda Machiko">
        <circle cx="40" cy="40" r="36" fill="#450a0a" stroke="#f59e0b" stroke-width="2.5" />
        <polygon points="40,10 64,28 54,62 40,70 26,62 16,28" fill="#78350f" stroke="#fcd34d" stroke-width="2" />
        <circle cx="40" cy="38" r="8" fill="#ef4444" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fcd34d" letter-spacing="1" text-anchor="middle">BUNDA WAR</text>
      </svg>
    `.trim();
  }
  if (id.includes('primal_hunt_ancient')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-primalhunt" role="img" aria-label="Insigne Sanctuaire LV-1201 Primal Hunt">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#8b5cf6" stroke-width="2.5" />
        <polygon points="40,8 70,30 58,66 22,66 10,30" fill="#2e1065" stroke="#c4b5fd" stroke-width="2" />
        <circle cx="40" cy="38" r="7" fill="#67e8f9" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#c4b5fd" letter-spacing="1" text-anchor="middle">LV-1201 POD</text>
      </svg>
    `.trim();
  }
  if (id.includes('andolini') || id.includes('1718')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-andolini" role="img" aria-label="Insigne Flibuste 1718 Raphael Andolini">
        <circle cx="40" cy="40" r="36" fill="#1b120c" stroke="#ffd700" stroke-width="2.5" />
        <path d="M 24 56 L 56 24 M 24 24 L 56 56" stroke="#ffb300" stroke-width="3" stroke-linecap="round" />
        <circle cx="40" cy="36" r="11" fill="#2d1c08" stroke="#ffe082" stroke-width="1.8" />
        <circle cx="36" cy="34" r="2.5" fill="#ffe082" />
        <circle cx="44" cy="34" r="2.5" fill="#ffe082" />
        <text x="40" y="70" font-family="'Orbitron', sans-serif" font-size="5" font-weight="900" fill="#ffd700" letter-spacing="1" text-anchor="middle">ANDOLINI 1718</text>
      </svg>
    `.trim();
  }
  if (id.includes('alaska') || id.includes('primal_rangers')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-alaska" role="img" aria-label="Insigne Rangers Alaska 1997">
        <polygon points="40,8 72,68 8,68" fill="#0d2818" stroke="#52b788" stroke-width="2.5" />
        <path d="M 40 28 L 52 52 L 44 52 L 55 64 L 25 64 L 36 52 L 28 52 Z" fill="#2d6a4f" stroke="#74c69d" stroke-width="1.2" />
        <circle cx="40" cy="36" r="3" fill="#d8f3dc" />
        <text x="40" y="75" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#74c69d" letter-spacing="1" text-anchor="middle">ALASKA '97</text>
      </svg>
    `.trim();
  }
  if (id.includes('defiance') || id.includes('zula_hendricks')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-defiance" role="img" aria-label="Insigne Defiance USCSS Europa 2137">
        <rect x="12" y="12" width="56" height="56" rx="6" fill="#0a192f" stroke="#00e5ff" stroke-width="2.2" />
        <circle cx="40" cy="40" r="18" fill="none" stroke="#64ffda" stroke-width="1.8" stroke-dasharray="3,2" />
        <path d="M 28 52 L 40 24 L 52 52 M 32 44 L 48 44" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <circle cx="40" cy="40" r="4" fill="#64ffda" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#64ffda" letter-spacing="1" text-anchor="middle">DEFIANCE 2137</text>
      </svg>
    `.trim();
  }
  if (id.includes('nightmare_asylum') || id.includes('spears')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-spears" role="img" aria-label="Insigne Nightmare Asylum Spears">
        <polygon points="40,10 68,26 68,54 40,70 12,54 12,26" fill="#2b0909" stroke="#ff3d00" stroke-width="2.5" />
        <polygon points="40,20 58,30 58,50 40,60 22,50 22,30" fill="#140404" stroke="#ff6e40" stroke-width="1.2" />
        <path d="M 40 26 L 40 46 M 30 36 L 50 36" stroke="#ff3d00" stroke-width="3" stroke-linecap="round" />
        <circle cx="40" cy="40" r="6" fill="#ffab91" />
        <text x="40" y="76" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#ff6e40" letter-spacing="1" text-anchor="middle">SPEARS 2192</text>
      </svg>
    `.trim();
  }
  if (id.includes('deadliest') || id.includes('big_mama')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-bigmama" role="img" aria-label="Insigne Big Mama Skyliner 2195">
        <circle cx="40" cy="40" r="36" fill="#1a0022" stroke="#ea80fc" stroke-width="2.5" />
        <polygon points="40,14 49,30 67,30 53,42 58,59 40,48 22,59 27,42 13,30 31,30" fill="#4a148c" stroke="#e040fb" stroke-width="1.6" />
        <circle cx="40" cy="38" r="6" fill="#f3e5f5" stroke="#ea80fc" stroke-width="1.5" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#ea80fc" letter-spacing="1" text-anchor="middle">BIG MAMA 2195</text>
      </svg>
    `.trim();
  }
  if (id.includes('three_world_war') || id.includes('caparis')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-threeworldwar" role="img" aria-label="Insigne Three World War Caparis VII">
        <polygon points="40,8 72,64 8,64" fill="#1a1c23" stroke="#00e676" stroke-width="2.5" />
        <circle cx="40" cy="44" r="14" fill="#003318" stroke="#69f0ae" stroke-width="1.8" />
        <path d="M 40 20 L 40 44 M 26 54 L 40 44 M 54 54 L 40 44" stroke="#00e676" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="40" cy="44" r="5" fill="#b9f6ca" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#69f0ae" letter-spacing="1" text-anchor="middle">CAPARIS VII</text>
      </svg>
    `.trim();
  }
  if (id.includes('xenogenesis') || id.includes('spearhead')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-spearhead" role="img" aria-label="Insigne Spearhead Xenogenesis 1999">
        <polygon points="40,8 72,28 72,60 40,74 8,60 8,28" fill="#0b132b" stroke="#00b4d8" stroke-width="2.5" />
        <path d="M 40 18 L 40 52 M 24 35 L 40 52 L 56 35" stroke="#90e0ef" stroke-width="3" stroke-linecap="round" fill="none" />
        <circle cx="40" cy="52" r="4.5" fill="#caf0f8" />
        <text x="40" y="68" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#00b4d8" letter-spacing="1" text-anchor="middle">SPEARHEAD</text>
      </svg>
    `.trim();
  }
  if (id.includes('blood_feud') || id.includes('juta')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-bloodfeud" role="img" aria-label="Insigne Samouraï Blood Feud Mont Fuji 1993">
        <circle cx="40" cy="40" r="36" fill="#1c0b0b" stroke="#e63946" stroke-width="2.5" />
        <circle cx="40" cy="40" r="16" fill="#e63946" opacity="0.85" />
        <line x1="16" y1="64" x2="64" y2="16" stroke="#f1faee" stroke-width="3" stroke-linecap="round" />
        <line x1="20" y1="64" x2="68" y2="16" stroke="#a8dadc" stroke-width="1.2" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#e63946" letter-spacing="1" text-anchor="middle">FUJI 1993</text>
      </svg>
    `.trim();
  }
  if (id.includes('berserker_max') || id.includes('exosuit')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-berserkermax" role="img" aria-label="Insigne Exosquelette MAX Berserker 2195">
        <rect x="12" y="12" width="56" height="56" rx="8" fill="#1b1a17" stroke="#f77f00" stroke-width="2.8" />
        <polygon points="40,20 60,34 54,62 26,62 20,34" fill="#d62828" stroke="#fcbf49" stroke-width="1.8" />
        <circle cx="40" cy="42" r="7" fill="#eae2b7" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#fcbf49" letter-spacing="1" text-anchor="middle">MAX BERSERK</text>
      </svg>
    `.trim();
  }
  if (id.includes('jeri') || (id.includes('stronghold') && !id.includes('sec_drones') && !id.includes('stronghold_sec'))) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-jeri" role="img" aria-label="Insigne Jeri Stronghold 2194">
        <circle cx="40" cy="40" r="36" fill="#0b1d13" stroke="#52b788" stroke-width="2.5" />
        <path d="M 28 32 Q 40 18 52 32 Q 48 56 40 60 Q 32 56 28 32 Z" fill="#1b4332" stroke="#74c69d" stroke-width="1.6" />
        <circle cx="36" cy="34" r="2.5" fill="#d8f3dc" />
        <circle cx="44" cy="34" r="2.5" fill="#d8f3dc" />
        <line x1="40" y1="46" x2="56" y2="44" stroke="#e9d8a6" stroke-width="2.5" stroke-linecap="round" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#52b788" letter-spacing="1" text-anchor="middle">JERI 2194</text>
      </svg>
    `.trim();
  }
  if (id.includes('sand_trap') || id.includes('ryushi_vault')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ryushivault" role="img" aria-label="Insigne Cryptes Ryushi 2192">
        <polygon points="40,8 72,68 8,68" fill="#2b1408" stroke="#f4a261" stroke-width="2.5" />
        <circle cx="40" cy="45" r="14" fill="#4a210a" stroke="#e76f51" stroke-width="1.8" />
        <polygon points="40,35 48,50 32,50" fill="#f4a261" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#f4a261" letter-spacing="1" text-anchor="middle">RYUSHI VAULT</text>
      </svg>
    `.trim();
  }
  if (id.includes('extinction_council') || id.includes('lv742')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-extinctioncouncil" role="img" aria-label="Insigne Conseil Extinction LV-742">
        <circle cx="40" cy="40" r="36" fill="#140a24" stroke="#b5179e" stroke-width="2.5" />
        <polygon points="40,12 66,28 66,56 40,68 14,56 14,28" fill="#3a0ca3" stroke="#f72585" stroke-width="1.8" />
        <circle cx="40" cy="40" r="8" fill="#4cc9f0" stroke="#f72585" stroke-width="1.5" />
        <text x="40" y="74" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#f72585" letter-spacing="1" text-anchor="middle">LV-742 COUNCIL</text>
      </svg>
    `.trim();
  }
  // --- ESCADRONS VAGUE 8 (Catalogue & Prompt) ---
  if (id.includes('dark_river_amazon_patrol')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-darkriver" role="img" aria-label="Insigne Patrouille Fluviale Amazone 1996">
        <circle cx="40" cy="40" r="36" fill="#071c15" stroke="#10b981" stroke-width="2.5" />
        <path d="M14 46 Q28 36 40 46 T66 46" fill="none" stroke="#34d399" stroke-width="3" />
        <polygon points="40,14 54,36 40,30 26,36" fill="#059669" stroke="#a7f3d0" stroke-width="1.5" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#6ee7b7" letter-spacing="0.8" text-anchor="middle">DARK RIVER '96</text>
      </svg>
    `.trim();
  }
  if (id.includes('whitechapel_constabulary_guard')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-whitechapel" role="img" aria-label="Insigne Garde Constabulaire Whitechapel 1896">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#eab308" stroke-width="2.5" />
        <polygon points="40,12 58,24 52,54 40,62 28,54 22,24" fill="#1e293b" stroke="#facc15" stroke-width="1.8" />
        <circle cx="40" cy="36" r="8" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#fde047" letter-spacing="0.8" text-anchor="middle">SCOTLAND YARD</text>
      </svg>
    `.trim();
  }
  if (id.includes('pala_station_security_detail')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-palastation" role="img" aria-label="Insigne Quarantaine Station Pala 2021">
        <polygon points="40,6 70,22 70,58 40,74 10,58 10,22" fill="#111827" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="40" cy="38" r="15" fill="#0369a1" stroke="#7dd3fc" stroke-width="1.8" />
        <path d="M32 38 L48 38 M40 30 L40 46" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#7dd3fc" letter-spacing="0.8" text-anchor="middle">PALA SEC-04</text>
      </svg>
    `.trim();
  }
  if (id.includes('hadleys_hope_colonial_militia')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-hadleymilitia" role="img" aria-label="Insigne Milice Coloniale Hadley's Hope">
        <circle cx="40" cy="40" r="36" fill="#172554" stroke="#60a5fa" stroke-width="2.5" />
        <polygon points="40,14 60,48 20,48" fill="#1e3a8a" stroke="#93c5fd" stroke-width="1.8" />
        <circle cx="40" cy="36" r="6" fill="#f59e0b" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#bfdbfe" letter-spacing="0.8" text-anchor="middle">HADLEY MILITIA</text>
      </svg>
    `.trim();
  }
  if (id.includes('ataegina_spear_phalanx')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ataegina" role="img" aria-label="Insigne Phalange Ataegina 2020">
        <circle cx="40" cy="40" r="36" fill="#1c1917" stroke="#f97316" stroke-width="2.5" />
        <circle cx="40" cy="38" r="18" fill="#431407" stroke="#fb923c" stroke-width="2" />
        <path d="M30 48 L40 24 L50 48" fill="none" stroke="#fdba74" stroke-width="3" stroke-linejoin="round" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#fed7aa" letter-spacing="0.8" text-anchor="middle">LEMNOS PHALANX</text>
      </svg>
    `.trim();
  }
  if (id.includes('iron_bear_uscm_battalion')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ironbear" role="img" aria-label="Insigne Bataillon Iron Bears USCM">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#18181b" stroke="#a1a1aa" stroke-width="2.5" />
        <polygon points="24,26 32,16 40,24 48,16 56,26 52,50 40,58 28,50" fill="#3f3f46" stroke="#f43f5e" stroke-width="1.8" />
        <circle cx="34" cy="34" r="2.5" fill="#f43f5e" />
        <circle cx="46" cy="34" r="2.5" fill="#f43f5e" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.6" font-weight="900" fill="#fda4af" letter-spacing="0.8" text-anchor="middle">IRON BEARS</text>
      </svg>
    `.trim();
  }
  if (id.includes('kseries_cloned_xeno_pack')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-kseries" role="img" aria-label="Insigne Meute Xéno K-Series">
        <circle cx="40" cy="40" r="36" fill="#1a2e05" stroke="#a3e635" stroke-width="2.5" />
        <path d="M22 46 Q40 14 58 46 Q40 60 22 46 Z" fill="#365314" stroke="#bef264" stroke-width="1.8" />
        <circle cx="40" cy="38" r="6" fill="#facc15" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.6" font-weight="900" fill="#d9f99d" letter-spacing="0.8" text-anchor="middle">K-SERIES XENO</text>
      </svg>
    `.trim();
  }
  if (id.includes('machiko_ryushi_retinue')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-machiko" role="img" aria-label="Insigne Suite Martiale Machiko Noguchi">
        <circle cx="40" cy="40" r="36" fill="#270909" stroke="#ef4444" stroke-width="2.5" />
        <path d="M40 14 L40 58 M28 24 L52 24 M32 34 L48 34" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
        <circle cx="40" cy="24" r="14" fill="none" stroke="#f87171" stroke-width="1.5" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#fde047" letter-spacing="0.8" text-anchor="middle">DA'DTOU-DI</text>
      </svg>
    `.trim();
  }
  if (id.includes('pred_tartarus_clans') || id.includes('tartarus')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-tartarus" role="img" aria-label="Insigne Clans de Tartarus">
        <circle cx="40" cy="40" r="36" fill="#230707" stroke="#dc2626" stroke-width="2.5" />
        <polygon points="40,12 64,54 16,54" fill="#450a0a" stroke="#f97316" stroke-width="2" />
        <circle cx="40" cy="38" r="7" fill="#facc15" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.6" font-weight="900" fill="#fca5a5" letter-spacing="0.8" text-anchor="middle">TARTARUS CLAN</text>
      </svg>
    `.trim();
  }
  if (id.includes('pred_crucified_clan') || id.includes('crucified')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-crucified" role="img" aria-label="Insigne Clan Crucifié">
        <circle cx="40" cy="40" r="36" fill="#1c0d06" stroke="#ea580c" stroke-width="2.5" />
        <path d="M40 12 L40 60 M20 28 L60 28" stroke="#fdba74" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="40" cy="28" r="8" fill="#7c2d12" stroke="#f97316" stroke-width="2" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#fed7aa" letter-spacing="0.8" text-anchor="middle">HONOR CRUCIBLE</text>
      </svg>
    `.trim();
  }
  if (id.includes('pred_starseer_shamans') || id.includes('starseer')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-starseer" role="img" aria-label="Insigne Chamans Starseer">
        <circle cx="40" cy="40" r="36" fill="#0f0728" stroke="#a855f7" stroke-width="2.5" />
        <polygon points="40,12 48,30 68,30 52,42 58,60 40,48 22,60 28,42 12,30 32,30" fill="#3b0764" stroke="#e9d5ff" stroke-width="1.5" />
        <circle cx="40" cy="38" r="5" fill="#38bdf8" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#d8b4fe" letter-spacing="0.8" text-anchor="middle">STARSEER SHAMAN</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_anacharsis_sec') || id.includes('anacharsis')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-anacharsis" role="img" aria-label="Insigne Sécurité Anacharsis">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#082f49" stroke="#0ea5e9" stroke-width="2.5" />
        <rect x="26" y="24" width="28" height="28" rx="4" fill="#0c4a6e" stroke="#7dd3fc" stroke-width="1.8" />
        <circle cx="40" cy="38" r="6" fill="#38bdf8" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#bae6fd" letter-spacing="0.8" text-anchor="middle">ANACHARSIS SEC</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_moriah_defenders') || id.includes('moriah')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-moriah" role="img" aria-label="Insigne Défenseurs de Moriah">
        <circle cx="40" cy="40" r="36" fill="#1c1917" stroke="#f59e0b" stroke-width="2.5" />
        <path d="M22 20 L58 20 L54 48 L40 60 L26 48 Z" fill="#451a03" stroke="#fcd34d" stroke-width="2" />
        <polygon points="40,26 46,38 34,38" fill="#fbbf24" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="900" fill="#fde68a" letter-spacing="0.8" text-anchor="middle">MORIAH GUARD</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_anchorpoint_guard') || id.includes('anchorpoint')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-anchorpoint" role="img" aria-label="Insigne Garde Anchorpoint">
        <circle cx="40" cy="40" r="36" fill="#042f2e" stroke="#14b8a6" stroke-width="2.5" />
        <circle cx="40" cy="36" r="16" fill="none" stroke="#5eead4" stroke-width="2" />
        <path d="M40 16 L40 56 M24 36 L56 36" stroke="#99f6e4" stroke-width="2" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#99f6e4" letter-spacing="0.8" text-anchor="middle">ANCHORPOINT</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_freya_prospect_sec') || id.includes('freya_prospect')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-freyaprospect" role="img" aria-label="Insigne Sécurité Freya's Prospect">
        <polygon points="40,6 70,22 70,58 40,74 10,58 10,22" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5" />
        <polygon points="40,16 58,48 22,48" fill="#312e81" stroke="#c7d2fe" stroke-width="1.8" />
        <circle cx="40" cy="38" r="5" fill="#38bdf8" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#c7d2fe" letter-spacing="0.8" text-anchor="middle">FREYA PROSPECT</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_rage_war_armada') || id.includes('rage_war')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ragewar" role="img" aria-label="Insigne Armada Rage War">
        <circle cx="40" cy="40" r="36" fill="#2a0410" stroke="#f43f5e" stroke-width="2.5" />
        <polygon points="40,10 64,46 40,38 16,46" fill="#881337" stroke="#fda4af" stroke-width="1.8" />
        <circle cx="40" cy="48" r="6" fill="#facc15" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.6" font-weight="900" fill="#fecdd3" letter-spacing="0.8" text-anchor="middle">RAGE WAR ARMADA</text>
      </svg>
    `.trim();
  }

  // --- ESCADRONS VAGUE 9 (Prompt & Extensions) ---
  if (id.includes('pred_captive_preserve_guards') || id.includes('captive_preserve')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-captivepreserve" role="img" aria-label="Insigne Gardes de la Réserve Captive">
        <circle cx="40" cy="40" r="36" fill="#052e16" stroke="#22c55e" stroke-width="2.5" />
        <polygon points="40,12 62,36 40,60 18,36" fill="#14532d" stroke="#86efac" stroke-width="1.8" />
        <circle cx="40" cy="36" r="6" fill="#ef4444" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#bbf7d0" letter-spacing="0.8" text-anchor="middle">PRESERVE GUARD</text>
      </svg>
    `.trim();
  }
  if (id.includes('pred_yellowstone_rangers') || id.includes('yellowstone')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-yellowstone" role="img" aria-label="Insigne Rangers de Yellowstone">
        <circle cx="40" cy="40" r="36" fill="#1f1606" stroke="#eab308" stroke-width="2.5" />
        <polygon points="18,52 34,24 46,42 54,30 64,52" fill="#422006" stroke="#fde047" stroke-width="1.8" />
        <circle cx="40" cy="20" r="4.5" fill="#f97316" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#fef08a" letter-spacing="0.8" text-anchor="middle">YELLOWSTONE</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_charon_rogue_marines') || id.includes('charon')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-charon" role="img" aria-label="Insigne Marines Renégats de Charon">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#18091e" stroke="#d946ef" stroke-width="2.5" />
        <circle cx="40" cy="36" r="14" fill="#4a044e" stroke="#f0abfc" stroke-width="1.8" />
        <path d="M32 32 L48 44 M48 32 L32 44" stroke="#fdf4ff" stroke-width="2.5" stroke-linecap="round" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#f5d0fe" letter-spacing="0.8" text-anchor="middle">CHARON ROGUES</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_harvest_cyber_ants') || id.includes('cyber_ants') || id.includes('harvest')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-cyberants" role="img" aria-label="Insigne Cyber-Fourmis Harvest">
        <circle cx="40" cy="40" r="36" fill="#042f2e" stroke="#06b6d4" stroke-width="2.5" />
        <circle cx="40" cy="26" r="6" fill="#0891b2" stroke="#67e8f9" stroke-width="1.5" />
        <circle cx="40" cy="38" r="5" fill="#0891b2" stroke="#67e8f9" stroke-width="1.5" />
        <circle cx="40" cy="50" r="7" fill="#0891b2" stroke="#67e8f9" stroke-width="1.5" />
        <path d="M26 30 L54 46 M26 46 L54 30" stroke="#a5f3fc" stroke-width="1.8" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#a5f3fc" letter-spacing="0.8" text-anchor="middle">CYBER HARVEST</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_eternal_tokyo_mercs') || id.includes('eternal_tokyo') || id.includes('tokyo_mercs')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-eternaltokyo" role="img" aria-label="Insigne Mercenaires Eternal Tokyo">
        <circle cx="40" cy="40" r="36" fill="#1e0614" stroke="#ec4899" stroke-width="2.5" />
        <circle cx="40" cy="36" r="14" fill="#db2777" stroke="#fbcfe8" stroke-width="1.5" />
        <path d="M22 46 L58 26 M26 26 L54 46" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#f9a8d4" letter-spacing="0.8" text-anchor="middle">ETERNAL TOKYO</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_perses_fire_stone_crew') || id.includes('perses') || id.includes('fire_stone')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-perses" role="img" aria-label="Insigne Équipage Perses Fire & Stone">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#270e04" stroke="#f97316" stroke-width="2.5" />
        <path d="M40 16 C52 28 54 44 40 56 C26 44 28 28 40 16 Z" fill="#9a3412" stroke="#fdba74" stroke-width="1.8" />
        <circle cx="40" cy="40" r="5" fill="#fef08a" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#fed7aa" letter-spacing="0.8" text-anchor="middle">PERSES CREW</text>
      </svg>
    `.trim();
  }

  // --- ESCADRONS VAGUE 10 (Prompt & Expansions) ---
  if (id.includes('pred_nakai_corpse_creek_scouts') || id.includes('nakai') || id.includes('corpse_creek')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-nakaiscouts" role="img" aria-label="Insigne Éclaireurs Nakai Corpse Creek">
        <circle cx="40" cy="40" r="36" fill="#1c120c" stroke="#f59e0b" stroke-width="2.5" />
        <polygon points="40,14 62,48 18,48" fill="#78350f" stroke="#fbbf24" stroke-width="1.8" />
        <path d="M26,38 L40,24 L54,38" fill="none" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" />
        <circle cx="40" cy="38" r="5.5" fill="#0891b2" stroke="#67e8f9" stroke-width="1.2" />
        <path d="M22,54 L58,54 M30,58 L50,58" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#fde68a" letter-spacing="0.8" text-anchor="middle">NAKAI SCOUTS</text>
      </svg>
    `.trim();
  }
  if (id.includes('pred_adolini_guinea_pirates') || id.includes('adolini') || id.includes('guinea_pirates')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-adolini" role="img" aria-label="Insigne Pirates Adolini 1718">
        <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#d97706" stroke-width="2.5" />
        <path d="M24,24 L56,52 M56,24 L24,52" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" />
        <circle cx="40" cy="34" r="10" fill="#1e293b" stroke="#fbbf24" stroke-width="1.8" />
        <circle cx="36" cy="33" r="2" fill="#d97706" /><circle cx="44" cy="33" r="2" fill="#d97706" />
        <polygon points="37,42 43,42 40,46" fill="#fbbf24" />
        <path d="M30,52 L50,52" stroke="#d97706" stroke-width="2" stroke-linecap="round" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#fde68a" letter-spacing="0.8" text-anchor="middle">ADOLINI 1718</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_renaissance_salvagers') || id.includes('renaissance_salvagers') || (id.includes('renaissance') && id.includes('salvager'))) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-renaissance" role="img" aria-label="Insigne Récupérateurs Renaissance Romulus">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#0b1726" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="33" cy="36" r="9" fill="#0c4a6e" stroke="#7dd3fc" stroke-width="1.5" />
        <circle cx="47" cy="36" r="9" fill="#0c4a6e" stroke="#7dd3fc" stroke-width="1.5" />
        <path d="M28,26 L52,46 M28,46 L52,26" stroke="#eab308" stroke-width="1.6" stroke-linecap="round" />
        <circle cx="40" cy="36" r="3.5" fill="#fde047" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#bae6fd" letter-spacing="0.8" text-anchor="middle">RENAISSANCE WY</text>
      </svg>
    `.trim();
  }
  if (id.includes('alien_genocide_red_drones') || id.includes('genocide_red') || id.includes('red_drones')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-reddrones" role="img" aria-label="Insigne Drones Rouges Genocide">
        <circle cx="40" cy="40" r="36" fill="#240404" stroke="#dc2626" stroke-width="2.5" />
        <path d="M22,46 C20,32 30,16 46,16 C58,16 62,26 56,38 C52,46 44,54 36,56 C28,58 22,52 22,46 Z" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.8" />
        <path d="M28,42 Q40,32 50,40" stroke="#fca5a5" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <path d="M44,48 L54,42 L48,54 Z" fill="#dc2626" stroke="#f87171" stroke-width="1" />
        <circle cx="42" cy="28" r="3.5" fill="#f87171" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#fca5a5" letter-spacing="0.8" text-anchor="middle">RED GENOCIDE</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_killer_clan_wardogs') || id.includes('killer_clan') || id.includes('wardogs')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-wardogs" role="img" aria-label="Insigne Chiens de Guerre Killer Clan">
        <polygon points="40,8 70,22 70,58 40,74 10,58 10,22" fill="#1a120c" stroke="#ea580c" stroke-width="2.5" />
        <circle cx="40" cy="38" r="14" fill="#431407" stroke="#fb923c" stroke-width="2" />
        <path d="M26,38 L32,32 M54,38 L48,32 M32,46 L40,40 L48,46" stroke="#fdba74" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        <polygon points="40,24 43,29 37,29" fill="#ef4444" />
        <polygon points="40,52 43,47 37,47" fill="#ef4444" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#fed7aa" letter-spacing="0.8" text-anchor="middle">KILLER WARDOGS</text>
      </svg>
    `.trim();
  }
  if (id.includes('avp_ryushi_chigusa_settlers') || id.includes('ryushi_chigusa') || id.includes('chigusa')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-chigusa" role="img" aria-label="Insigne Colons Chigusa Ryushi">
        <circle cx="40" cy="40" r="36" fill="#0c1f2e" stroke="#0ea5e9" stroke-width="2.5" />
        <circle cx="34" cy="32" r="7" fill="#0284c7" stroke="#7dd3fc" stroke-width="1.4" />
        <circle cx="48" cy="28" r="4.5" fill="#f59e0b" stroke="#fde047" stroke-width="1.2" />
        <path d="M18,52 Q40,36 62,52" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
        <polygon points="40,40 46,50 34,50" fill="#ca8a04" stroke="#fde047" stroke-width="1.2" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#bae6fd" letter-spacing="0.8" text-anchor="middle">CHIGUSA RYUSHI</text>
      </svg>
    `.trim();
  }

  // --- ESCADRONS VAGUE 11 (Prompt & Expansions) ---
  if (id.includes('spratly') || id.includes('spratly_pirates')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-spratly" role="img" aria-label="Insigne Pirates Spratly 1888">
        <circle cx="40" cy="40" r="36" fill="#08181c" stroke="#14b8a6" stroke-width="2.5" />
        <!-- Plume volcanique en arrière-plan -->
        <path d="M40,32 Q32,20 36,12 Q44,8 48,16 Q44,24 40,32 Z" fill="#475569" opacity="0.6" />
        <path d="M42,28 Q36,18 42,14 Q46,12 45,20 Z" fill="#f97316" opacity="0.4" />
        <!-- Palmiers tropicaux croisés -->
        <path d="M22,46 Q28,32 36,36 M22,46 Q30,38 34,44 M22,46 Q26,42 30,48" stroke="#10b981" stroke-width="1.6" fill="none" stroke-linecap="round" />
        <path d="M58,46 Q52,32 44,36 M58,46 Q50,38 46,44 M58,46 Q54,42 50,48" stroke="#10b981" stroke-width="1.6" fill="none" stroke-linecap="round" />
        <path d="M24,54 Q30,46 36,44" stroke="#78350f" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <path d="M56,54 Q50,46 44,44" stroke="#78350f" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <!-- Crâne pirate & dents Yautja -->
        <circle cx="40" cy="36" r="10.5" fill="#0f172a" stroke="#2dd4bf" stroke-width="1.8" />
        <circle cx="36" cy="34" r="2" fill="#2dd4bf" /><circle cx="44" cy="34" r="2" fill="#2dd4bf" />
        <path d="M37,42 L43,42 M38,45 L42,45" stroke="#2dd4bf" stroke-width="1.2" stroke-linecap="round" />
        <polygon points="35,39 37,41 33,42" fill="#f43f5e" /><polygon points="45,39 43,41 47,42" fill="#f43f5e" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#2dd4bf" letter-spacing="0.8" text-anchor="middle">SPRATLY 1888</text>
      </svg>
    `.trim();
  }
  if (id.includes('bolderji') || id.includes('bolder_ji')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-bolderji" role="img" aria-label="Insigne Mercenaires Bolder'ji">
        <circle cx="40" cy="40" r="36" fill="#220905" stroke="#ea580c" stroke-width="2.5" />
        <!-- Caldeira volcanique et magma -->
        <polygon points="18,52 32,30 48,30 62,52 40,58" fill="#431407" stroke="#f97316" stroke-width="1.8" />
        <ellipse cx="40" cy="32" rx="9" ry="3.5" fill="#ef4444" stroke="#fbbf24" stroke-width="1" />
        <path d="M36,32 Q40,24 44,32" stroke="#fef08a" stroke-width="2" fill="none" />
        <!-- Éclair de plasma oblique (plasma bolt) -->
        <polygon points="36,12 48,12 40,28 50,28 32,56 38,34 30,34" fill="#06b6d4" stroke="#67e8f9" stroke-width="1.2" filter="drop-shadow(0 0 3px #06b6d4)" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#fdba74" letter-spacing="0.8" text-anchor="middle">BOLDER'JI MERCS</text>
      </svg>
    `.trim();
  }
  if (id.includes('stronghold') || id.includes('sec_drones') || id.includes('caspar_ernst')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-stronghold" role="img" aria-label="Insigne Drones Cybernétiques Stronghold">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#061822" stroke="#06b6d4" stroke-width="2.5" />
        <!-- Châssis de drone sentinelle cybernétique Dr. Ernst -->
        <circle cx="40" cy="38" r="16" fill="#082b3a" stroke="#22d3ee" stroke-width="1.8" />
        <circle cx="40" cy="38" r="7" fill="#0e7490" stroke="#67e8f9" stroke-width="1.5" />
        <circle cx="40" cy="38" r="3" fill="#a5f3fc" />
        <!-- Capteurs optiques & bras d'armement -->
        <line x1="22" y1="38" x2="14" y2="38" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" />
        <line x1="58" y1="38" x2="66" y2="38" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" />
        <line x1="40" y1="20" x2="40" y2="12" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" />
        <circle cx="26" cy="26" r="2" fill="#ef4444" /><circle cx="54" cy="26" r="2" fill="#ef4444" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.1" font-weight="900" fill="#a5f3fc" letter-spacing="0.8" text-anchor="middle">STRONGHOLD SEC</text>
      </svg>
    `.trim();
  }
  if (id.includes('lv178') || id.includes('lv_178') || id.includes('galveston')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-lv178" role="img" aria-label="Insigne Mineurs Trimonite LV-178">
        <polygon points="40,8 70,22 70,58 40,74 10,58 10,22" fill="#1e1808" stroke="#eab308" stroke-width="2.5" />
        <!-- Pique de mineur & marteau pneumatique croisés -->
        <path d="M24,24 L56,56 M56,24 L24,56" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
        <polygon points="56,20 62,24 58,30" fill="#f59e0b" />
        <polygon points="24,20 18,24 22,30" fill="#f59e0b" />
        <!-- Shard de Trimonite luminescent -->
        <polygon points="40,24 48,38 40,52 32,38" fill="#ca8a04" stroke="#fde047" stroke-width="1.6" />
        <line x1="40" y1="24" x2="40" y2="52" stroke="#fef08a" stroke-width="1.2" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="#fef08a" letter-spacing="0.8" text-anchor="middle">LV-178 MINERS</text>
      </svg>
    `.trim();
  }
  if (id.includes('uss_ryushi') || (id.includes('ryushi') && id.includes('marine'))) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-ussryushi" role="img" aria-label="Insigne Marines Coloniaux USS Ryushi">
        <circle cx="40" cy="40" r="36" fill="#081424" stroke="#38bdf8" stroke-width="2.5" />
        <!-- Ailes d'intervention navale USCM et ancre de secours -->
        <path d="M16,36 Q28,24 40,34 Q52,24 64,36 Q54,46 40,42 Q26,46 16,36 Z" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.6" />
        <!-- Chevron Colonial Marines & balise de sauvetage -->
        <polygon points="40,18 47,32 40,28 33,32" fill="#f59e0b" stroke="#fde047" stroke-width="1" />
        <circle cx="40" cy="40" r="4.5" fill="#0284c7" stroke="#e0f2fe" stroke-width="1.2" />
        <path d="M30,50 L40,56 L50,50" stroke="#38bdf8" stroke-width="2" fill="none" stroke-linecap="round" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="900" fill="#bae6fd" letter-spacing="0.8" text-anchor="middle">USS RYUSHI</text>
      </svg>
    `.trim();
  }
  if (id.includes('web_shipyard') || id.includes('shipyard_riggers') || (id.includes('web') && id.includes('rigger'))) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-webshipyard" role="img" aria-label="Insigne Riggers Chantier Orbital Web">
        <polygon points="40,6 72,22 72,58 40,74 8,58 8,22" fill="#140a24" stroke="#a855f7" stroke-width="2.5" />
        <!-- Catapulte magnétique orbitale et anneaux d'accélération -->
        <circle cx="40" cy="38" r="17" fill="none" stroke="#c084fc" stroke-width="1.8" stroke-dasharray="4,2" />
        <circle cx="40" cy="38" r="10" fill="#3b0764" stroke="#e879f9" stroke-width="1.4" />
        <!-- Chevrons industriels de riggers et pinces magnétiques -->
        <path d="M26,38 L32,38 M48,38 L54,38 M40,24 L40,30 M40,46 L40,52" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />
        <polygon points="40,34 44,42 36,42" fill="#facc15" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="900" fill="#e9d5ff" letter-spacing="0.8" text-anchor="middle">WEB RIGGERS</text>
      </svg>
    `.trim();
  }
  if (id.startsWith('squad_') && !id.includes('lv742_kainde_amedha')) {
    const cleanTag = id.replace(/^squad_(pred_|alien_|avp_)?/, '').replace(/_/g, ' ').slice(0, 14).toUpperCase();
    const h = Math.abs(hashCode(id));
    const hues = ['#00e5ff', '#ff6d00', '#76ff03', '#ffd700', '#f50057', '#d500f9'];
    const strokeCol = hues[h % hues.length];
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-custom-${id.replace(/[^a-z0-9_-]/g, '')}" role="img" aria-label="Insigne Tactique ${cleanTag}">
        <polygon points="40,6 70,22 70,58 40,74 10,58 10,22" fill="#0b131e" stroke="${strokeCol}" stroke-width="2.5" />
        <circle cx="40" cy="36" r="15" fill="#132235" stroke="${strokeCol}" stroke-width="1.6" />
        <polygon points="40,24 49,42 31,42" fill="${strokeCol}" opacity="0.85" />
        <text x="40" y="71" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="900" fill="${strokeCol}" letter-spacing="0.7" text-anchor="middle">${cleanTag}</text>
      </svg>
    `.trim();
  }
  if (id.includes('lv742_kainde_amedha')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="canon-logo logo-squad-lv742" role="img" aria-label="Insigne Sanctuaire LV-742">
        <circle cx="40" cy="40" r="36" fill="#230b04" stroke="#f97316" stroke-width="2.5" />
        <polygon points="40,12 62,56 18,56" fill="#7c2d12" stroke="#fdba74" stroke-width="2" />
        <circle cx="40" cy="40" r="7" fill="#fef08a" />
        <text x="40" y="73" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="#fed7aa" letter-spacing="1" text-anchor="middle">SHRINE LV-742</text>
      </svg>
    `.trim();
  }
  return getYautjaClanLogo(size);
}

export function getFactionLogo(factionName, size = 24) {
  return renderFactionEmblem(factionName, size);
}

export function renderFactionEmblem(factionName, size = 48) {
  if (!factionName) return getYautjaClanLogo(size);
  const name = String(factionName).toLowerCase();
  if (name.includes('faune')) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" class="canon-logo logo-fauna" role="img" aria-label="Biosignature de faune"><circle cx="32" cy="32" r="28" fill="#10241d" stroke="#8cc9a0" stroke-width="2"/><path d="M19 42c0-7 7-15 13-15s13 8 13 15c0 6-7 5-13 2-6 3-13 4-13-2Z" fill="#8cc9a0"/><path d="m16 30-3-13 8 9m7-5 2-14 5 14m8 4 8-10-3 15" fill="none" stroke="#b9dcc3" stroke-width="4" stroke-linecap="round"/></svg>`;
  }
  if (name.includes('engineer') || name.includes('ingénieur') || name.includes('architecte')) {
    return getEngineerLogo(size);
  }
  if (name.includes('xeno') || name.includes('ruche') || name.includes('alien')) {
    return getXenomorphHiveLogo(size);
  }
  if (name.includes('weyland') || name.includes('uscm') || name.includes('marine') || name.includes('synthétique') || name.includes('human')) {
    return getWeylandYutaniLogo(Math.round(size * 0.75));
  }
  if (name.includes('owlf')) {
    return getOWLFLogo(size);
  }
  if (name.includes('stargazer')) {
    return getStargazerLogo(size);
  }
  if (name.includes('seegson')) {
    return getSeegsonLogo(size);
  }
  if (name.includes('borgia')) {
    return getBorgiaIndustriesLogo(size);
  }
  return getYautjaClanLogo(size);
}


/**
 * Générateur SVG Vectoriel 1:1 pour les Équipements Forgés à partir de Trophées.
 */
export function getCraftsmanshipItemSvg(recipeId, size = 56) {
  const additional = getAdditionalCraftIconSvg(recipeId, size);
  if (additional) return additional;
  switch (recipeId) {
    case 'craft_shield_xeno_warrior':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield" role="img" aria-label="Bouclier Dôme Xénomorphe">
          <circle cx="40" cy="40" r="36" fill="#0d140e" stroke="#2e7d32" stroke-width="2" />
          <path d="M22 28 Q40 12 58 28 Q62 58 40 70 Q18 58 22 28 Z" fill="#1b2e1e" stroke="#76ff03" stroke-width="2.5" />
          <ellipse cx="40" cy="38" rx="10" ry="14" fill="#0a120b" stroke="#76ff03" stroke-width="1.5" />
          <line x1="32" y1="46" x2="48" y2="46" stroke="#aed581" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_shield_xeno_queen':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-royal" role="img" aria-label="Égide Royale de Reine">
          <circle cx="40" cy="40" r="36" fill="#120c02" stroke="#ffd700" stroke-width="2.5" />
          <polygon points="40,12 64,22 68,48 40,72 12,48 16,22" fill="#261b0a" stroke="#ffd700" stroke-width="2" />
          <polygon points="40,20 54,26 56,44 40,62 24,44 26,26" fill="#ffd54f" stroke="#ffb300" stroke-width="1.5" />
          <circle cx="40" cy="40" r="6" fill="#d50000" />
        </svg>
      `.trim();

    case 'craft_weapon_tail_blade_glaive':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-glaive" role="img" aria-label="Combi-Glaive Queue Xéno">
          <circle cx="40" cy="40" r="36" fill="#140606" stroke="#d32f2f" stroke-width="2" />
          <line x1="20" y1="60" x2="52" y2="28" stroke="#78909c" stroke-width="4" stroke-linecap="round" />
          <polygon points="52,28 66,14 62,24 72,16 58,34" fill="#cfd8dc" stroke="#ff1744" stroke-width="1.5" />
          <line x1="24" y1="64" x2="16" y2="72" stroke="#ffb300" stroke-width="3" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'craft_weapon_cleaner_spinal_whip':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-whip" role="img" aria-label="Fouet Rachidien Wolf">
          <circle cx="40" cy="40" r="36" fill="#0d1b22" stroke="#00e5ff" stroke-width="2" />
          <path d="M22 62 C34 44 28 32 44 26 C56 22 64 34 66 18" stroke="#90a4ae" stroke-width="3.5" fill="none" stroke-linecap="round" />
          <circle cx="22" cy="62" r="4" fill="#00e5ff" />
          <polygon points="66,18 72,14 68,22" fill="#00e5ff" />
        </svg>
      `.trim();

    case 'craft_mask_xeno_jaw_berserker':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-jaw" role="img" aria-label="Masque Mâchoire Xéno">
          <circle cx="40" cy="40" r="36" fill="#1a110a" stroke="#e65100" stroke-width="2" />
          <polygon points="40,12 60,24 54,58 40,68 26,58 20,24" fill="#2d1b11" stroke="#ff6d00" stroke-width="2" />
          <path d="M28 52 Q40 64 52 52" stroke="#cfd8dc" stroke-width="3" fill="none" stroke-linecap="round" />
          <line x1="34" y1="52" x2="34" y2="58" stroke="#ffffff" stroke-width="1.5" />
          <line x1="40" y1="55" x2="40" y2="61" stroke="#ffffff" stroke-width="1.5" />
          <line x1="46" y1="52" x2="46" y2="58" stroke="#ffffff" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'craft_armor_queen_carapace_cuirass':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-queen" role="img" aria-label="Cuirasse Carapace Reine">
          <circle cx="40" cy="40" r="36" fill="#0e171b" stroke="#00e5ff" stroke-width="2" />
          <polygon points="40,16 62,28 56,66 40,74 24,66 18,28" fill="#1b2a30" stroke="#00e5ff" stroke-width="2" />
          <line x1="28" y1="36" x2="52" y2="36" stroke="#76ff03" stroke-width="2.5" />
          <line x1="30" y1="46" x2="50" y2="46" stroke="#76ff03" stroke-width="2.5" />
          <line x1="34" y1="56" x2="46" y2="56" stroke="#76ff03" stroke-width="2.5" />
        </svg>
      `.trim();

    case 'craft_banner_xeno_queen_crest':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-banner-queen" role="img" aria-label="Étendard Reine Xéno">
          <circle cx="40" cy="40" r="36" fill="#1c0f06" stroke="#ff9100" stroke-width="2" />
          <line x1="40" y1="12" x2="40" y2="72" stroke="#ffab00" stroke-width="3" stroke-linecap="round" />
          <polygon points="40,16 66,28 40,40" fill="#b71c1c" stroke="#ff1744" stroke-width="1.5" />
          <circle cx="40" cy="14" r="5" fill="#ffd700" />
        </svg>
      `.trim();


    case 'craft_shield_xeno_crusher':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-crusher" role="img" aria-label="Pavois Crâne Crusher">
          <circle cx="40" cy="40" r="36" fill="#17120a" stroke="#d7ccc8" stroke-width="2" />
          <path d="M16 24 Q40 10 64 24 L68 56 Q40 76 12 56 Z" fill="#2d2218" stroke="#8d6e63" stroke-width="2.5" />
          <line x1="40" y1="16" x2="40" y2="70" stroke="#bcaaa4" stroke-width="3" />
          <polygon points="40,24 50,38 30,38" fill="#d7ccc8" stroke="#8d6e63" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'craft_shield_praetorian_crest':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-praetorian" role="img" aria-label="Rondache Prétorien">
          <circle cx="40" cy="40" r="36" fill="#0b130e" stroke="#00e676" stroke-width="2" />
          <polygon points="40,14 62,24 68,48 54,68 26,68 12,48 18,24" fill="#1b2e22" stroke="#76ff03" stroke-width="2" />
          <circle cx="40" cy="42" r="12" fill="#0d1f14" stroke="#00e676" stroke-width="2" />
          <line x1="40" y1="30" x2="40" y2="54" stroke="#76ff03" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_shield_skynet_hk_alloy':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-hk" role="img" aria-label="Pavois Titane HK Skynet">
          <circle cx="40" cy="40" r="36" fill="#101418" stroke="#78909c" stroke-width="2" />
          <polygon points="20,18 60,18 66,62 40,74 14,62" fill="#263238" stroke="#b0bec5" stroke-width="2.5" />
          <rect x="26" y="32" width="28" height="6" fill="#d50000" rx="2" />
          <line x1="40" y1="42" x2="40" y2="66" stroke="#90a4ae" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_shield_mgalekgolo_carapace':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-mgalekgolo" role="img" aria-label="Égide Mgalekgolo Halo">
          <circle cx="40" cy="40" r="36" fill="#07111a" stroke="#0288d1" stroke-width="2.5" />
          <path d="M22 20 Q40 12 58 20 L64 60 Q40 74 16 60 Z" fill="#0d2b3e" stroke="#29b6f6" stroke-width="2" />
          <ellipse cx="40" cy="42" rx="14" ry="18" fill="#081c28" stroke="#ff9100" stroke-width="2" />
          <circle cx="40" cy="42" r="5" fill="#ff6d00" />
        </svg>
      `.trim();

    case 'craft_weapon_xeno_mandible_tomahawk':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-tomahawk" role="img" aria-label="Hache Mâchoire Xéno">
          <circle cx="40" cy="40" r="36" fill="#1a120c" stroke="#ff8f00" stroke-width="2" />
          <line x1="22" y1="64" x2="52" y2="24" stroke="#8d6e63" stroke-width="4.5" stroke-linecap="round" />
          <path d="M48 20 Q64 12 66 32 Q54 36 46 30 Z" fill="#cfd8dc" stroke="#ff6d00" stroke-width="2" />
          <line x1="52" y1="26" x2="56" y2="30" stroke="#d50000" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'craft_weapon_runner_tail_scythe':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-runner" role="img" aria-label="Vouge Runner Fiorina">
          <circle cx="40" cy="40" r="36" fill="#140a08" stroke="#ff3d00" stroke-width="2" />
          <line x1="16" y1="68" x2="48" y2="28" stroke="#78909c" stroke-width="3.5" stroke-linecap="round" />
          <path d="M48 28 Q64 12 68 36 Q56 34 46 32 Z" fill="#bf360c" stroke="#ff9e80" stroke-width="2" />
          <polygon points="68,36 72,44 64,42" fill="#ff3d00" />
        </svg>
      `.trim();

    case 'craft_weapon_acid_flail_vertebrae':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-flail" role="img" aria-label="Fléau Acide Xéno">
          <circle cx="40" cy="40" r="36" fill="#0d140b" stroke="#76ff03" stroke-width="2" />
          <line x1="20" y1="64" x2="38" y2="44" stroke="#78909c" stroke-width="3" stroke-linecap="round" />
          <path d="M38 44 C44 38 48 34 56 26" stroke="#90a4ae" stroke-width="2" stroke-dasharray="3,3" fill="none" />
          <circle cx="60" cy="22" r="9" fill="#1b5e20" stroke="#76ff03" stroke-width="2" />
          <circle cx="60" cy="22" r="4" fill="#ccff90" />
        </svg>
      `.trim();

    case 'craft_weapon_mgalekgolo_fuel_cannon':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-fuel-cannon" role="img" aria-label="Canon Combustible Mgalekgolo">
          <circle cx="40" cy="40" r="36" fill="#061612" stroke="#00e676" stroke-width="2.5" />
          <rect x="22" y="28" width="38" height="24" fill="#003322" stroke="#00e676" stroke-width="2" rx="4" />
          <line x1="60" y1="36" x2="68" y2="36" stroke="#76ff03" stroke-width="4" stroke-linecap="round" />
          <line x1="60" y1="44" x2="68" y2="44" stroke="#76ff03" stroke-width="4" stroke-linecap="round" />
          <circle cx="34" cy="40" r="5" fill="#76ff03" />
        </svg>
      `.trim();

    case 'craft_mask_xeno_crest_matriarch':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-crest" role="img" aria-label="Bio-Masque Crête Reine">
          <circle cx="40" cy="40" r="36" fill="#1a1106" stroke="#ffd700" stroke-width="2" />
          <polygon points="40,10 64,22 56,58 40,68 24,58 16,22" fill="#2d1f0d" stroke="#ffb300" stroke-width="2" />
          <polygon points="40,14 56,22 50,34 40,30 30,34 24,22" fill="#ffd54f" />
          <circle cx="34" cy="42" r="2.5" fill="#00e5ff" />
          <circle cx="46" cy="42" r="2.5" fill="#00e5ff" />
        </svg>
      `.trim();

    case 'craft_mask_xeno_skull_dome':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-dome" role="img" aria-label="Masque Dôme Big Chap">
          <circle cx="40" cy="40" r="36" fill="#0a1014" stroke="#80deea" stroke-width="2" />
          <ellipse cx="40" cy="38" rx="20" ry="24" fill="#12252e" stroke="#00acc1" stroke-width="2" />
          <path d="M26 44 Q40 52 54 44" stroke="#4dd0e1" stroke-width="2.5" fill="none" />
          <ellipse cx="40" cy="32" rx="10" ry="12" fill="#071318" opacity="0.6" />
        </svg>
      `.trim();

    case 'craft_mask_crusher_bone_visor':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-crusher" role="img" aria-label="Masque Visière Crusher">
          <circle cx="40" cy="40" r="36" fill="#14100c" stroke="#a1887f" stroke-width="2" />
          <polygon points="40,14 62,26 54,64 40,70 26,64 18,26" fill="#2e2118" stroke="#8d6e63" stroke-width="2" />
          <rect x="28" y="38" width="24" height="4" fill="#ffab00" rx="1" />
          <line x1="40" y1="18" x2="40" y2="34" stroke="#d7ccc8" stroke-width="2.5" />
        </svg>
      `.trim();

    case 'craft_mask_cyber_ed209_optics':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-ed209" role="img" aria-label="Visière ED-209">
          <circle cx="40" cy="40" r="36" fill="#0e1318" stroke="#90a4ae" stroke-width="2" />
          <rect x="20" y="24" width="40" height="34" fill="#263238" stroke="#b0bec5" stroke-width="2" rx="4" />
          <rect x="26" y="36" width="28" height="6" fill="#d50000" rx="1" />
          <circle cx="32" cy="48" r="2" fill="#00e5ff" />
          <circle cx="48" cy="48" r="2" fill="#00e5ff" />
        </svg>
      `.trim();

    case 'craft_armor_xeno_ribcage_vest':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-ribcage" role="img" aria-label="Plastron Cage Thoracique">
          <circle cx="40" cy="40" r="36" fill="#0a1410" stroke="#76ff03" stroke-width="2" />
          <path d="M26 22 Q40 18 54 22 L50 64 Q40 70 30 64 Z" fill="#13261c" stroke="#00e676" stroke-width="2" />
          <line x1="28" y1="30" x2="52" y2="30" stroke="#76ff03" stroke-width="2" />
          <line x1="30" y1="40" x2="50" y2="40" stroke="#76ff03" stroke-width="2" />
          <line x1="32" y1="50" x2="48" y2="50" stroke="#76ff03" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_armor_praetorian_pauldrons':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-pauldrons" role="img" aria-label="Épaulières Prétorien">
          <circle cx="40" cy="40" r="36" fill="#0d1114" stroke="#00e5ff" stroke-width="2" />
          <polygon points="14,32 36,20 38,54 20,62" fill="#18252c" stroke="#00e5ff" stroke-width="2" />
          <polygon points="66,32 44,20 42,54 60,62" fill="#18252c" stroke="#00e5ff" stroke-width="2" />
          <circle cx="40" cy="38" r="4" fill="#ffd700" />
        </svg>
      `.trim();

    case 'craft_armor_tail_vertebrae_belt':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-belt" role="img" aria-label="Ceinturon Vertèbres Xéno">
          <circle cx="40" cy="40" r="36" fill="#16120c" stroke="#ffab00" stroke-width="2" />
          <rect x="16" y="34" width="48" height="12" fill="#2d2216" stroke="#ffa000" stroke-width="2" rx="3" />
          <circle cx="26" cy="40" r="3" fill="#cfd8dc" />
          <circle cx="35" cy="40" r="3" fill="#cfd8dc" />
          <circle cx="45" cy="40" r="3" fill="#cfd8dc" />
          <circle cx="54" cy="40" r="3" fill="#cfd8dc" />
        </svg>
      `.trim();

    case 'craft_armor_cyberdemon_cuirass':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-cyberdemon" role="img" aria-label="Cuirasse Cyberdemon">
          <circle cx="40" cy="40" r="36" fill="#1c0707" stroke="#ff1744" stroke-width="2.5" />
          <polygon points="40,16 62,26 56,66 40,74 24,66 18,26" fill="#361010" stroke="#ff5252" stroke-width="2" />
          <circle cx="40" cy="42" r="10" fill="#212121" stroke="#00e5ff" stroke-width="2" />
          <circle cx="40" cy="42" r="4" fill="#00e5ff" />
        </svg>
      `.trim();

    case 'craft_banner_hive_conquest_spire':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-banner-spire" role="img" aria-label="Spire Conquête Ruche">
          <circle cx="40" cy="40" r="36" fill="#0f1912" stroke="#00e676" stroke-width="2" />
          <line x1="40" y1="12" x2="40" y2="70" stroke="#81c784" stroke-width="3" stroke-linecap="round" />
          <polygon points="40,16 58,26 40,36" fill="#2e7d32" stroke="#76ff03" stroke-width="1.5" />
          <ellipse cx="40" cy="44" rx="6" ry="4" fill="#cfd8dc" />
          <ellipse cx="40" cy="54" rx="6" ry="4" fill="#cfd8dc" />
        </svg>
      `.trim();

    case 'craft_banner_tail_trophy_flag':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-banner-tail-flag" role="img" aria-label="Étendard Queues Xéno">
          <circle cx="40" cy="40" r="36" fill="#140d1a" stroke="#ba68c8" stroke-width="2" />
          <line x1="26" y1="14" x2="26" y2="70" stroke="#ab47bc" stroke-width="3" />
          <path d="M26 18 Q46 22 58 32 Q46 42 26 46 Z" fill="#4a148c" stroke="#e1bee7" stroke-width="1.5" />
          <line x1="38" y1="46" x2="38" y2="64" stroke="#ce93d8" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_totem_matriarch_throne':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-totem-matriarch" role="img" aria-label="Trône Crâne Matriarche">
          <circle cx="40" cy="40" r="36" fill="#1a1205" stroke="#ffd700" stroke-width="2.5" />
          <polygon points="40,12 62,24 58,46 40,68 22,46 18,24" fill="#2e1f08" stroke="#ffb300" stroke-width="2" />
          <circle cx="40" cy="38" r="8" fill="#ffd700" />
          <line x1="26" y1="62" x2="54" y2="62" stroke="#ffab00" stroke-width="3" stroke-linecap="round" />
        </svg>
      `.trim();

    case 'craft_totem_multiverse_titans':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-totem-titans" role="img" aria-label="Pilier Titans Multivers">
          <circle cx="40" cy="40" r="36" fill="#140a18" stroke="#e040fb" stroke-width="2.5" />
          <rect x="30" y="16" width="20" height="52" fill="#240c2b" stroke="#ea80fc" stroke-width="2" rx="3" />
          <circle cx="40" cy="28" r="5" fill="#ffd700" />
          <circle cx="40" cy="42" r="5" fill="#00e5ff" />
          <circle cx="40" cy="56" r="5" fill="#76ff03" />
        </svg>
      `.trim();

    case 'craft_shield_offspring_chitin':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-offspring" role="img" aria-label="Bouclier Offspring">
          <circle cx="40" cy="40" r="36" fill="#141416" stroke="#b0bec5" stroke-width="2.5" />
          <polygon points="40,10 65,25 58,62 40,74 22,62 15,25" fill="#263238" stroke="#eceff1" stroke-width="2" />
          <line x1="40" y1="20" x2="40" y2="65" stroke="#78909c" stroke-width="2.5" />
          <circle cx="40" cy="38" r="7" fill="#37474f" stroke="#b0bec5" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'craft_shield_working_joe_hazard':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-shield-joe" role="img" aria-label="Pavois Seegson Hazmat">
          <circle cx="40" cy="40" r="36" fill="#1c1a14" stroke="#ffeb3b" stroke-width="2.5" />
          <rect x="22" y="18" width="36" height="44" rx="6" fill="#37321e" stroke="#fff176" stroke-width="2" />
          <path d="M40 24 L32 38 L42 38 L36 54 L48 38 L38 38 Z" fill="#ffeb3b" stroke="#fbc02d" stroke-width="1" />
        </svg>
      `.trim();

    case 'craft_weapon_neomorph_fang_daggers':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-neomorph" role="img" aria-label="Dagues Néomorphe">
          <circle cx="40" cy="40" r="36" fill="#161719" stroke="#cfd8dc" stroke-width="2" />
          <path d="M28 62 Q34 38 48 18 Q44 42 34 62 Z" fill="#eceff1" stroke="#b0bec5" stroke-width="1.5" />
          <path d="M52 62 Q46 38 32 18 Q36 42 46 62 Z" fill="#cfd8dc" stroke="#90a4ae" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'craft_weapon_dutch_cyborg_blade':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-weapon-dutch" role="img" aria-label="Combi-Lame Cyborg Dutch">
          <circle cx="40" cy="40" r="36" fill="#181310" stroke="#ff6d00" stroke-width="2.5" />
          <rect x="36" y="28" width="8" height="40" fill="#3e2723" stroke="#ffab40" stroke-width="1.5" />
          <polygon points="40,10 48,32 32,32" fill="#ff9100" stroke="#ffd180" stroke-width="2" />
          <line x1="28" y1="42" x2="52" y2="42" stroke="#ff6d00" stroke-width="3" />
        </svg>
      `.trim();

    case 'craft_mask_alien_earth_prodigy':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-prodigy" role="img" aria-label="Masque Prodigy Earth">
          <circle cx="40" cy="40" r="36" fill="#0d1b1e" stroke="#00e5ff" stroke-width="2.5" />
          <ellipse cx="40" cy="40" rx="18" ry="24" fill="#00363a" stroke="#18ffff" stroke-width="2" />
          <circle cx="34" cy="36" r="4" fill="#00e5ff" />
          <circle cx="46" cy="36" r="4" fill="#00e5ff" />
          <line x1="40" y1="20" x2="40" y2="60" stroke="#84ffff" stroke-width="1.5" />
        </svg>
      `.trim();

    case 'craft_mask_working_joe_blank':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-mask-joe" role="img" aria-label="Masque Working Joe">
          <circle cx="40" cy="40" r="36" fill="#1e1e24" stroke="#9e9e9e" stroke-width="2.5" />
          <ellipse cx="40" cy="40" rx="16" ry="22" fill="#424242" stroke="#e0e0e0" stroke-width="2" />
          <circle cx="33" cy="36" r="3" fill="#ffffff" />
          <circle cx="47" cy="36" r="3" fill="#ffffff" />
          <line x1="34" y1="52" x2="46" y2="52" stroke="#eeeeee" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_armor_power_loader_chassis':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-loader" role="img" aria-label="Exo-Armure Power Loader">
          <circle cx="40" cy="40" r="36" fill="#1b170c" stroke="#ffab00" stroke-width="2.5" />
          <rect x="24" y="22" width="32" height="36" fill="#3e2f0a" stroke="#ffd600" stroke-width="2.5" />
          <line x1="18" y1="28" x2="24" y2="34" stroke="#ffab00" stroke-width="3" />
          <line x1="62" y1="28" x2="56" y2="34" stroke="#ffab00" stroke-width="3" />
          <rect x="32" y="32" width="16" height="16" fill="#ffd600" />
        </svg>
      `.trim();

    case 'craft_armor_davis01_tactical_rig':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-armor-davis" role="img" aria-label="Harnais Davis 01">
          <circle cx="40" cy="40" r="36" fill="#101918" stroke="#00bfa5" stroke-width="2.5" />
          <polygon points="40,18 58,30 52,62 40,68 28,62 22,30" fill="#004d40" stroke="#64ffda" stroke-width="2" />
          <line x1="40" y1="22" x2="40" y2="64" stroke="#1de9b6" stroke-width="2.5" />
          <line x1="30" y1="36" x2="50" y2="36" stroke="#64ffda" stroke-width="2" />
        </svg>
      `.trim();

    case 'craft_banner_nostromo_sacrifice':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-banner-nostromo" role="img" aria-label="Étendard Nostromo">
          <circle cx="40" cy="40" r="36" fill="#11161d" stroke="#29b6f6" stroke-width="2.5" />
          <line x1="40" y1="12" x2="40" y2="68" stroke="#81d4fa" stroke-width="3" />
          <polygon points="40,16 66,28 40,42" fill="#0277bd" stroke="#4fc3f7" stroke-width="2" />
          <circle cx="40" cy="14" r="4" fill="#ffd700" />
        </svg>
      `.trim();

    case 'craft_totem_romulus_renaissance':
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-totem-romulus" role="img" aria-label="Totem Romulus Renaissance">
          <circle cx="40" cy="40" r="36" fill="#1a111a" stroke="#f06292" stroke-width="2.5" />
          <rect x="32" y="16" width="16" height="50" fill="#4a148c" stroke="#ba68c8" stroke-width="2" rx="4" />
          <circle cx="40" cy="26" r="5" fill="#f48fb1" />
          <polygon points="36,46 44,46 40,36" fill="#ea80fc" />
          <line x1="26" y1="64" x2="54" y2="64" stroke="#e1bee7" stroke-width="3" />
        </svg>
      `.trim();

    default:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="craft-logo craft-default" role="img" aria-label="Équipement de Forge Yautja">
          <circle cx="40" cy="40" r="36" fill="#14181a" stroke="#ffd700" stroke-width="2" />
          <polygon points="40,14 64,28 56,68 40,74 24,68 16,28" fill="#263238" stroke="#ffd700" stroke-width="2" />
          <circle cx="40" cy="42" r="8" fill="#ff6d00" />
        </svg>
      `.trim();
  }
}


/**
 * Calcul déterministe d'un hash entier pour garantir des IDs uniques et isolés dans les balises SVG.
 */
function hashCode(str) {
  let hash = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Icône vectorielle SVG distincte pour chaque catégorie de cible, armement et secteur tactique.
 * @param {string} category Nom de la catégorie (MILITARY, SECURITY, MERCENARY, CARTEL, SCIENTIFIC, TRIBAL, SPECIAL_OPS, CIVILIANS, FAUNA, ARSENAL, BIOME, CODEX, etc.)
 * @param {number} size Dimension en pixels (défaut 16)
 * @returns {string} Markup SVG
 */
export function getCategoryIconSvg(category = '', size = 16) {
  const cat = String(category || '').trim().toUpperCase();

  // 1. MILITARY (COMMANDO, MARINES, USCM)
  if (cat.includes('MILITARY') || cat.includes('COMMANDO') || cat.includes('MARINE') || cat.includes('USCM')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-military" role="img" aria-label="Catégorie Militaire">
        <polygon points="12,2 14.5,7 20,7.5 16,11.5 17.5,17 12,14.2 6.5,17 8,11.5 4,7.5 9.5,7" fill="#ffd54f" />
        <path d="M4 17 L12 22 L20 17 M4 19.5 L12 24.5 L20 19.5" fill="none" stroke="#64b5f6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  // 2. SECURITY & LAW ENFORCEMENT
  if (cat.includes('SECURITY') || cat.includes('LAW') || cat.includes('POLICE') || cat.includes('ENFORCEMENT')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-security" role="img" aria-label="Catégorie Sécurité">
        <path d="M12 2 L20 5 V11 C20 16.5 16.5 21 12 22 C7.5 21 4 16.5 4 11 V5 Z" fill="#0d2438" stroke="#00e5ff" stroke-width="1.6" />
        <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15,17 12,15.2 9,17 9.5,13.5 7,11 10.5,10.5" fill="#ffd700" />
      </svg>
    `.trim();
  }

  // 3. MERCENARY & SYNDICATES
  if (cat.includes('MERCENARY') || cat.includes('SYNDICATE') || cat.includes('PIRATE')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-mercenary" role="img" aria-label="Catégorie Mercenaire">
        <path d="M5 19 L19 5 M19 19 L5 5" stroke="#ff7043" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="10" r="5" fill="#1b242e" stroke="#ffab00" stroke-width="1.5"/>
        <circle cx="10" cy="9.5" r="1.2" fill="#ffab00"/><circle cx="14" cy="9.5" r="1.2" fill="#ffab00"/>
        <rect x="10.5" y="13" width="3" height="2" rx="0.5" fill="#ffab00"/>
      </svg>
    `.trim();
  }

  // 4. CARTEL & CRIME
  if (cat.includes('CARTEL') || cat.includes('CRIME') || cat.includes('GANG')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-cartel" role="img" aria-label="Catégorie Cartel">
        <path d="M12 2 L12 17 M9 6 L15 6 M9 10 L15 10 M12 22 L12 18" stroke="#ff3d00" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 7 Q 12 12, 17 7 Q 12 18, 7 14" fill="none" stroke="#d50000" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="12" cy="4" r="1.4" fill="#ff1744"/>
      </svg>
    `.trim();
  }

  // 5. SCIENTIFIC & CORPORATE (WEYLAND, CREW)
  if (cat.includes('SCIENTIFIC') || cat.includes('WEYLAND') || cat.includes('SPACESHIP') || cat.includes('CORPORATE') || cat.includes('SCIENCE')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-scientific" role="img" aria-label="Catégorie Scientifique">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" fill="none" stroke="#00e5ff" stroke-width="1.5"/>
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" fill="none" stroke="#00e5ff" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="2.5" fill="#ffd700"/>
      </svg>
    `.trim();
  }

  // 6. TRIBAL & WAR PARTIES
  if (cat.includes('TRIBAL') || cat.includes('WAR_PARTY') || cat.includes('RITUAL')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-tribal" role="img" aria-label="Catégorie Tribale">
        <polygon points="12,2 17,9 14,14 12,22 10,14 7,9" fill="#2d1c0b" stroke="#ff9100" stroke-width="1.6" stroke-linejoin="round"/>
        <line x1="12" y1="2" x2="12" y2="22" stroke="#ffd54f" stroke-width="1.2"/>
        <line x1="8" y1="11" x2="16" y2="11" stroke="#ff3d00" stroke-width="1.5"/>
        <line x1="9" y1="15" x2="15" y2="15" stroke="#ff3d00" stroke-width="1.5"/>
      </svg>
    `.trim();
  }

  // 7. SPECIAL_OPS & STEALTH
  if (cat.includes('SPECIAL_OPS') || cat.includes('SPEC_OPS') || cat.includes('STEALTH') || cat.includes('BLACK_OPS')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-special-ops" role="img" aria-label="Catégorie Opérations Spéciales">
        <circle cx="12" cy="12" r="8" fill="none" stroke="#00e676" stroke-width="1.4" stroke-dasharray="2,2"/>
        <polygon points="12,6 17,16 7,16" fill="none" stroke="#76ff03" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="2" fill="#ff1744"/>
        <line x1="12" y1="2" x2="12" y2="6" stroke="#00e676" stroke-width="1.5"/>
        <line x1="12" y1="18" x2="12" y2="22" stroke="#00e676" stroke-width="1.5"/>
        <line x1="2" y1="12" x2="6" y2="12" stroke="#00e676" stroke-width="1.5"/>
        <line x1="18" y1="12" x2="22" y2="12" stroke="#00e676" stroke-width="1.5"/>
      </svg>
    `.trim();
  }

  // 8. CIVILIANS & SURVIVORS
  if (cat.includes('CIVILIAN') || cat.includes('SURVIVOR')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-civilians" role="img" aria-label="Catégorie Civils">
        <circle cx="12" cy="6" r="3" fill="#80d8ff"/>
        <path d="M6 18 C6 14, 9 12, 12 12 C15 12, 18 14, 18 18" fill="none" stroke="#80d8ff" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M3 21 L8 21 L10 18 L12 23 L14 19 L16 21 L21 21" fill="none" stroke="#ff5252" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `.trim();
  }

  // 9. FAUNA & BEASTS
  if (cat.includes('FAUNA') || cat.includes('BEAST') || cat.includes('OUTCAST')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-fauna" role="img" aria-label="Catégorie Faune">
        <path d="M6 4 Q 8 13 5 20 M12 3 Q 13 13 11 21 M18 5 Q 18 13 17 19" fill="none" stroke="#ff5252" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    `.trim();
  }

  // 10. ARSENAL & WEAPONS
  if (cat.includes('ARSENAL') || cat.includes('WEAPON') || cat.includes('BALLISTIC')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-arsenal" role="img" aria-label="Catégorie Arsenal">
        <path d="M10 3 L14 3 L14 6 L10 6 Z M9 6 L15 6 L15 17 L9 17 Z M8 17 L16 17 L16 20 L8 20 Z" fill="#ffd54f" stroke="#ff8f00" stroke-width="1"/>
        <circle cx="12" cy="11.5" r="7.5" fill="none" stroke="#00e5ff" stroke-width="1.2" stroke-dasharray="3,2"/>
        <line x1="12" y1="2" x2="12" y2="21" stroke="#00e5ff" stroke-width="0.8"/>
        <line x1="2" y1="11.5" x2="22" y2="11.5" stroke="#00e5ff" stroke-width="0.8"/>
      </svg>
    `.trim();
  }

  // 11. BIOME & MAPS
  if (cat.includes('BIOME') || cat.includes('MAP') || cat.includes('TERRITORY')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-biome" role="img" aria-label="Catégorie Biome">
        <circle cx="12" cy="12" r="8.5" fill="#041b1d" stroke="#00e5ff" stroke-width="1.5"/>
        <ellipse cx="12" cy="12" rx="8.5" ry="3.5" fill="none" stroke="#80cbc4" stroke-width="1.2"/>
        <line x1="12" y1="3.5" x2="12" y2="20.5" stroke="#80cbc4" stroke-width="1.2"/>
        <path d="M6 9 Q 12 6, 18 11 M5 15 Q 12 18, 19 14" fill="none" stroke="#00e676" stroke-width="1.2"/>
      </svg>
    `.trim();
  }

  // 12. CODEX & LORE
  if (cat.includes('CODEX') || cat.includes('LORE') || cat.includes('ARCHIVE')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-codex" role="img" aria-label="Catégorie Codex">
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#0a192f" stroke="#64ffda" stroke-width="1.6" stroke-linejoin="round"/>
        <line x1="12" y1="2" x2="12" y2="22" stroke="#64ffda" stroke-width="1"/>
        <line x1="3" y1="7" x2="12" y2="12" stroke="#64ffda" stroke-width="1"/>
        <line x1="21" y1="7" x2="12" y2="12" stroke="#64ffda" stroke-width="1"/>
        <circle cx="12" cy="12" r="2" fill="#ffd700"/>
      </svg>
    `.trim();
  }

  // 13. YAUTJA / HONOR CLAN / SUPER PREDATORS
  if (cat.includes('PREDATOR') || cat.includes('YAUTJA') || cat.includes('HONOR')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-yautja" role="img" aria-label="Catégorie Yautja">
        <circle cx="12" cy="5" r="2.2" fill="#ff1744"/>
        <circle cx="6" cy="17" r="2.2" fill="#ff1744"/>
        <circle cx="18" cy="17" r="2.2" fill="#ff1744"/>
        <polygon points="12,5 6,17 18,17" fill="none" stroke="#ff5252" stroke-width="1.2" stroke-dasharray="2,2"/>
      </svg>
    `.trim();
  }

  // 14. XENOMORPH
  if (cat.includes('XENO')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-xeno" role="img" aria-label="Catégorie Xénomorphe">
        <path d="M4 14 C4 8, 10 4, 18 5 C22 5.5, 23 8, 20 10 C16 12, 14 15, 9 16 C6 16.5, 4 16, 4 14 Z" fill="#1b2e10" stroke="#76ff03" stroke-width="1.5"/>
        <path d="M8 14 L12 14 M7 12 L10 12" stroke="#ccff90" stroke-width="1.2"/>
      </svg>
    `.trim();
  }

  // 14B. BESTIARY / PREY BIO-SCAN
  if (cat.includes('BESTIARY') || cat.includes('PREY')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-bestiary" role="img" aria-label="Catégorie Bestiaire">
        <circle cx="12" cy="12" r="9" fill="#071a12" stroke="#00e676" stroke-width="1.5" stroke-dasharray="3,1.5"/>
        <path d="M8 7 Q10 12 7 17 M12 6 Q13 12 11 18 M16 7 Q17 12 15 17" fill="none" stroke="#76ff03" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="2" fill="#ff1744"/>
      </svg>
    `.trim();
  }

  // 14C. LOADOUT / SKIN / ARMOR
  if (cat.includes('LOADOUT') || cat.includes('SKIN') || cat.includes('ARMOR')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-loadout" role="img" aria-label="Catégorie Armurerie Yautja">
        <polygon points="12,2 19,6 17,16 12,21 7,16 5,6" fill="#1f0d05" stroke="#ffd700" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M7 10 L11 11.5 L7 12.5 Z M17 10 L13 11.5 L17 12.5 Z" fill="#00e5ff"/>
        <line x1="12" y1="5" x2="12" y2="9" stroke="#ff3d00" stroke-width="1.4"/>
      </svg>
    `.trim();
  }

  // 15. SYNTHETIC
  if (cat.includes('SYNTH')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-synthetic" role="img" aria-label="Catégorie Synthétique">
        <circle cx="12" cy="11" r="7" fill="#081e2b" stroke="#00e5ff" stroke-width="1.5"/>
        <circle cx="9.5" cy="10" r="1.4" fill="#ffffff"/>
        <circle cx="14.5" cy="10" r="1.4" fill="#ffffff"/>
        <path d="M12 4 V7 M12 15 V18 M5 11 H8 M16 11 H19" stroke="#80d8ff" stroke-width="1.4"/>
      </svg>
    `.trim();
  }

  // 16. VAULT DOMAINS (TECHNOLOGY, VEHICLES, ENEMIES, EVENTS, BOSSES, SUPPORT, MEDIA)
  if (cat.includes('TECHNOLOGY') || cat.includes('TECH')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-technology" role="img" aria-label="Catégorie Technologie">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="#031f33" stroke="#00e5ff" stroke-width="1.5" />
        <circle cx="12" cy="12" r="3" fill="#00e5ff" />
        <line x1="12" y1="2" x2="12" y2="4" stroke="#00e5ff" stroke-width="1.5" />
        <line x1="12" y1="20" x2="12" y2="22" stroke="#00e5ff" stroke-width="1.5" />
        <line x1="2" y1="12" x2="4" y2="12" stroke="#00e5ff" stroke-width="1.5" />
        <line x1="20" y1="12" x2="22" y2="12" stroke="#00e5ff" stroke-width="1.5" />
      </svg>
    `.trim();
  }

  if (cat.includes('VEHICLE')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-vehicle" role="img" aria-label="Catégorie Véhicule">
        <polygon points="12,2 20,16 16,16 12,13 8,16 4,16" fill="#082236" stroke="#38bdf8" stroke-width="1.5" stroke-linejoin="round" />
        <line x1="9" y1="16" x2="9" y2="21" stroke="#f97316" stroke-width="1.8" />
        <line x1="15" y1="16" x2="15" y2="21" stroke="#f97316" stroke-width="1.8" />
      </svg>
    `.trim();
  }

  if (cat.includes('ENEMI') || cat.includes('ENEMY')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-enemy" role="img" aria-label="Catégorie Ennemis">
        <circle cx="12" cy="12" r="8" fill="#1e0a0a" stroke="#ef4444" stroke-width="1.5" />
        <polygon points="12,6 15,11 18,17 12,14 6,17 9,11" fill="#dc2626" stroke="#f87171" stroke-width="1" />
        <circle cx="10" cy="11" r="1" fill="#fef08a" /><circle cx="14" cy="11" r="1" fill="#fef08a" />
      </svg>
    `.trim();
  }

  if (cat.includes('EVENT')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-event" role="img" aria-label="Catégorie Événement">
        <polygon points="12,3 21,19 3,19" fill="#241403" stroke="#f59e0b" stroke-width="1.6" stroke-linejoin="round" />
        <line x1="12" y1="8" x2="12" y2="13" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
        <circle cx="12" cy="16" r="1.2" fill="#ef4444" />
      </svg>
    `.trim();
  }

  if (cat.includes('BOSS')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-boss" role="img" aria-label="Catégorie Boss">
        <polygon points="12,2 15,8 21,5 18,14 12,21 6,14 3,5 9,8" fill="#240404" stroke="#ff1744" stroke-width="1.5" stroke-linejoin="round" />
        <circle cx="12" cy="12" r="2.5" fill="#ffd700" />
      </svg>
    `.trim();
  }

  if (cat.includes('SUPPORT')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-support" role="img" aria-label="Catégorie Support">
        <rect x="5" y="5" width="14" height="14" rx="3" fill="#04261b" stroke="#10b981" stroke-width="1.5" />
        <path d="M12,8 V16 M8,12 H16" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
      </svg>
    `.trim();
  }

  if (cat.includes('MEDIA') || cat.includes('FILM')) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-media" role="img" aria-label="Catégorie Média">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="#13141f" stroke="#d4af37" stroke-width="1.5" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="#d4af37" stroke-width="1" stroke-dasharray="2,2" />
        <line x1="3" y1="15" x2="21" y2="15" stroke="#d4af37" stroke-width="1" stroke-dasharray="2,2" />
        <polygon points="10,10.5 15,12 10,13.5" fill="#fde047" />
      </svg>
    `.trim();
  }

  // DEFAULT
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="category-icon cat-default" role="img" aria-label="Catégorie Tactique">
      <polygon points="12,3 21,12 12,21 3,12" fill="#0d1b2a" stroke="#ffd700" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="2.8" fill="#ff5252"/>
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle SVG tactique haute fidélité pour chaque carte / territoire média.
 * Intègre grille holographique, radar orbital, courbes de niveau et colorimétrie adaptée au biome.
 * @param {Object|string} map Objet carte média ou identifiant de biome
 * @returns {string} Markup SVG tactique
 */
export function getMapMiniatureSvg(map) {
  const mapObj = typeof map === 'object' && map !== null ? map : { id: String(map || 'map_unknown') };
  const biomeId = String(mapObj.biomeId || mapObj.id || '').toLowerCase();
  const name = String(mapObj.name || 'Secteur Tactique Inconnu');
  const sectorsCount = Array.isArray(mapObj.tacticalSectors) ? mapObj.tacticalSectors.length : 4;
  const uid = 'map-hud-' + Math.abs(hashCode(mapObj.id || name));

  // Thème colorimétrique diégétique selon le biome
  let theme = {
    primary: '#00e676',
    secondary: '#1b5e20',
    dark: '#03140a',
    accent: '#76ff03',
    label: 'JUNGLE HUMIDE'
  };

  if (biomeId.includes('los_angeles') || biomeId.includes('urban') || biomeId.includes('gunnison')) {
    theme = {
      primary: '#ff3d00',
      secondary: '#bf360c',
      dark: '#1f0703',
      accent: '#ffab00',
      label: 'SECTEUR URBAIN FLIR'
    };
  } else if (biomeId.includes('antarctic') || biomeId.includes('bouvetoya') || biomeId.includes('arctic')) {
    theme = {
      primary: '#00e5ff',
      secondary: '#01579b',
      dark: '#021324',
      accent: '#80d8ff',
      label: 'CRYO PYRAMIDE -40°C'
    };
  } else if (biomeId.includes('hive') || biomeId.includes('lv426') || biomeId.includes('derelict')) {
    theme = {
      primary: '#88ff00',
      secondary: '#33691e',
      dark: '#0e1f04',
      accent: '#ccff90',
      label: 'RUCHES BIO-ACIDE'
    };
  } else if (biomeId.includes('space') || biomeId.includes('stargazer') || biomeId.includes('nostromo') || biomeId.includes('temple')) {
    theme = {
      primary: '#00b4d8',
      secondary: '#023e8a',
      dark: '#031726',
      accent: '#90e0ef',
      label: 'COMPLEXE ORBITAL'
    };
  } else if (biomeId.includes('desert') || biomeId.includes('ryushi')) {
    theme = {
      primary: '#ffb300',
      secondary: '#e65100',
      dark: '#211302',
      accent: '#ffe082',
      label: 'DÉSERT ARIDE SOLAIRE'
    };
  } else if (biomeId.includes('yautja') || biomeId.includes('genna')) {
    theme = {
      primary: '#ff1744',
      secondary: '#880e4f',
      dark: '#210307',
      accent: '#ffd700',
      label: 'YAUTJA PRIME CITADELLE'
    };
  }

  // Topographie / courbes de niveau spécifiques
  let topographyPath = '';
  if (biomeId.includes('jungle')) {
    topographyPath = `
      <path d="M0,58 Q 30,42 60,52 T 120,40" fill="none" stroke="${theme.primary}" stroke-width="1.2" opacity="0.65" />
      <path d="M0,66 Q 40,54 80,62 T 120,50" fill="none" stroke="${theme.primary}" stroke-width="0.8" opacity="0.4" />
      <path d="M10,25 Q 45,15 75,32 T 120,18" fill="none" stroke="${theme.accent}" stroke-width="0.9" stroke-dasharray="3,2" opacity="0.55" />
      <path d="M5,72 C 35,60 55,68 85,55 C 105,46 115,50 120,48" fill="none" stroke="${theme.accent}" stroke-width="1.8" opacity="0.75" />
    `;
  } else if (biomeId.includes('los_angeles') || biomeId.includes('urban') || biomeId.includes('gunnison')) {
    topographyPath = `
      <path d="M10,68 L50,42 L90,62 L120,44" fill="none" stroke="${theme.primary}" stroke-width="1.2" opacity="0.7" />
      <path d="M25,58 L45,46 L70,60" fill="none" stroke="${theme.accent}" stroke-width="1.4" opacity="0.6" />
      <rect x="42" y="32" width="16" height="14" fill="none" stroke="${theme.primary}" stroke-width="1" opacity="0.8" />
      <rect x="74" y="44" width="22" height="16" fill="none" stroke="${theme.primary}" stroke-width="0.8" opacity="0.5" />
      <circle cx="50" cy="39" r="3" fill="${theme.accent}" opacity="0.8" />
    `;
  } else if (biomeId.includes('antarctic') || biomeId.includes('bouvetoya')) {
    topographyPath = `
      <polygon points="60,18 96,64 24,64" fill="none" stroke="${theme.primary}" stroke-width="1.5" opacity="0.85" />
      <line x1="33" y1="52" x2="87" y2="52" stroke="${theme.accent}" stroke-width="1" opacity="0.7" />
      <line x1="42" y1="40" x2="78" y2="40" stroke="${theme.accent}" stroke-width="1" opacity="0.7" />
      <line x1="51" y1="29" x2="69" y2="29" stroke="${theme.accent}" stroke-width="1" opacity="0.7" />
      <line x1="60" y1="18" x2="60" y2="64" stroke="${theme.primary}" stroke-width="1" stroke-dasharray="2,2" opacity="0.6" />
    `;
  } else if (biomeId.includes('hive') || biomeId.includes('lv426')) {
    topographyPath = `
      <path d="M20,68 Q 60,24 100,68" fill="none" stroke="${theme.primary}" stroke-width="1.6" opacity="0.8" />
      <path d="M32,68 Q 60,36 88,68" fill="none" stroke="${theme.accent}" stroke-width="1.2" opacity="0.65" />
      <path d="M44,68 Q 60,48 76,68" fill="none" stroke="${theme.primary}" stroke-width="0.9" opacity="0.5" />
      <circle cx="60" cy="30" r="3.5" fill="${theme.accent}" opacity="0.75" />
      <circle cx="45" cy="54" r="2" fill="${theme.primary}" />
      <circle cx="75" cy="54" r="2" fill="${theme.primary}" />
    `;
  } else {
    topographyPath = `
      <path d="M5,35 Q 35,20 65,38 T 115,28" fill="none" stroke="${theme.primary}" stroke-width="1.2" opacity="0.65" />
      <path d="M5,52 Q 45,38 75,58 T 115,48" fill="none" stroke="${theme.primary}" stroke-width="0.9" opacity="0.45" />
      <rect x="36" y="28" width="48" height="26" fill="none" stroke="${theme.accent}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.6" />
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" class="tactical-map-miniature" role="img" aria-label="Miniature tactique de la carte ${name}">
      <defs>
        <linearGradient id="bg-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${theme.dark}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#020508" stop-opacity="0.98" />
        </linearGradient>
        <linearGradient id="radar-sweep-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.primary}" stop-opacity="0.45" />
          <stop offset="70%" stop-color="${theme.primary}" stop-opacity="0.08" />
          <stop offset="100%" stop-color="${theme.primary}" stop-opacity="0" />
        </linearGradient>
        <pattern id="grid-${uid}" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${theme.primary}" stroke-width="0.35" opacity="0.22" />
        </pattern>
        <filter id="glow-${uid}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Fond cartographique & Grille diégétique -->
      <rect width="120" height="80" fill="url(#bg-${uid})" />
      <rect width="120" height="80" fill="url(#grid-${uid})" />

      <!-- Relief & Topographie du Biome -->
      <g class="terrain-topography">
        ${topographyPath}
      </g>

      <!-- Radar Orbital & Système de Balayage Holographique -->
      <g class="orbital-radar" filter="url(#glow-${uid})">
        <circle cx="60" cy="42" r="34" fill="none" stroke="${theme.primary}" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.4" />
        <circle cx="60" cy="42" r="22" fill="none" stroke="${theme.primary}" stroke-width="0.8" opacity="0.5" />
        <circle cx="60" cy="42" r="10" fill="none" stroke="${theme.primary}" stroke-width="0.9" opacity="0.65" />
        <line x1="60" y1="8" x2="60" y2="76" stroke="${theme.primary}" stroke-width="0.5" opacity="0.35" />
        <line x1="20" y1="42" x2="100" y2="42" stroke="${theme.primary}" stroke-width="0.5" opacity="0.35" />
        <path d="M60,42 L88,22 A34,34 0 0,0 60,8 Z" fill="url(#radar-sweep-${uid})" />
        <circle cx="76" cy="26" r="2" fill="${theme.accent}" />
        <circle cx="76" cy="26" r="4.5" fill="none" stroke="${theme.accent}" stroke-width="0.6" opacity="0.8" />
        <circle cx="44" cy="52" r="1.6" fill="${theme.primary}" />
      </g>

      <!-- Waypoints tactiques -->
      <polygon points="32,32 35,28 38,32 35,36" fill="${theme.accent}" opacity="0.85" />
      <polygon points="86,52 89,48 92,52 89,56" fill="${theme.accent}" opacity="0.85" />

      <!-- Barre d'en-tête de télémétrie HUD -->
      <rect x="0" y="0" width="120" height="11" fill="#000000" fill-opacity="0.65" />
      <line x1="0" y1="11" x2="120" y2="11" stroke="${theme.primary}" stroke-width="0.5" opacity="0.5" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="800" fill="${theme.primary}" letter-spacing="0.5">SCAN // ${theme.label}</text>
      <text x="114" y="8" font-family="'Rajdhani', sans-serif" font-size="5" font-weight="700" fill="#cfd8dc" text-anchor="end">ORBIT 840KM</text>

      <!-- Télémétrie inférieure -->
      <rect x="0" y="69" width="120" height="11" fill="#000000" fill-opacity="0.65" />
      <line x1="0" y1="69" x2="120" y2="69" stroke="${theme.primary}" stroke-width="0.5" opacity="0.5" />
      <text x="6" y="77" font-family="'Rajdhani', sans-serif" font-size="5" font-weight="600" fill="#90a4ae">SECT. ACTIFS : ${sectorsCount}</text>
      <text x="114" y="77" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="800" fill="${theme.accent}" text-anchor="end">▲ GRID ACQ</text>

      <!-- Coins tactiques (Corner Brackets) -->
      <path d="M3,8 L3,3 L8,3" fill="none" stroke="${theme.primary}" stroke-width="1.3" />
      <path d="M112,3 L117,3 L117,8" fill="none" stroke="${theme.primary}" stroke-width="1.3" />
      <path d="M3,72 L3,77 L8,77" fill="none" stroke="${theme.primary}" stroke-width="1.3" />
      <path d="M112,77 L117,77 L117,72" fill="none" stroke="${theme.primary}" stroke-width="1.3" />
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle SVG blueprint / silhouette technique pour chaque arme PNJ ou variante Yautja.
 * Représente le schéma mécanique, calibre, réticule de visée et composants balistiques ou cristaux plasma.
 * @param {Object} weapon Objet arme
 * @returns {string} Markup SVG technique blueprint
 */
export function getWeaponMiniatureSvg(weapon) {
  const wep = typeof weapon === 'object' && weapon !== null ? weapon : { id: 'unknown_weapon', name: 'Arme Inconnue' };
  const isYautja = Boolean(wep.armorPresetId || wep.baseWeaponId || (wep.sources && wep.sources.some(s => String(s).toLowerCase().includes('avp') || String(s).toLowerCase().includes('predator'))));
  const id = String(wep.id || '').toLowerCase();
  const baseId = String(wep.baseWeaponId || '').toLowerCase();
  const name = String(wep.name || '').toLowerCase();
  const caliber = String(wep.caliber || (isYautja ? 'Technologie Plasma / Duralumin' : 'Standard 10mm'));
  const uid = 'wep-sch-' + Math.abs(hashCode(wep.id || name));

  let theme = {
    primary: '#00e5ff',
    secondary: '#0077b6',
    dark: '#031422',
    accent: '#80d8ff',
    grid: '#07253d',
    type: 'BLUEPRINT // USCM-ORDNANCE'
  };

  if (isYautja) {
    theme = {
      primary: '#ff3d00',
      secondary: '#b71c1c',
      dark: '#1e0503',
      accent: '#ffd700',
      grid: '#330a06',
      type: 'YAUTJA // ARSENAL SACRÉ'
    };
  } else if (wep.faction === 'OWLF' || wep.faction === 'MERCENARY' || wep.damageType === 'ballistic' || caliber.includes('NATO') || caliber.includes('12 Gauge') || caliber.includes('Magnum')) {
    theme = {
      primary: '#ffb300',
      secondary: '#bf360c',
      dark: '#1c1003',
      accent: '#ffe082',
      grid: '#2b1a05',
      type: 'BALLISTIQUE // CALIBRE'
    };
  }

  let weaponSilhouette = '';

  if (baseId.includes('wristblades') || id.includes('wristblade') || name.includes('lame') || name.includes('scimitar')) {
    weaponSilhouette = `
      <rect x="14" y="26" width="22" height="20" rx="3" fill="#1b1d24" stroke="${theme.primary}" stroke-width="1.4" />
      <line x1="20" y1="26" x2="20" y2="46" stroke="${theme.accent}" stroke-width="1" />
      <line x1="28" y1="26" x2="28" y2="46" stroke="${theme.accent}" stroke-width="1" />
      <polygon points="36,29 104,27 110,31 92,34 36,34" fill="#2d3748" stroke="${theme.primary}" stroke-width="1.3" />
      <line x1="40" y1="31.5" x2="98" y2="29" stroke="${theme.accent}" stroke-width="1" />
      <polygon points="36,38 98,40 104,44 88,46 36,44" fill="#2d3748" stroke="${theme.primary}" stroke-width="1.3" />
      <line x1="40" y1="41" x2="92" y2="42" stroke="${theme.accent}" stroke-width="1" />
      <circle cx="106" cy="29" r="2.2" fill="${theme.accent}" />
      <circle cx="100" cy="42" r="2.2" fill="${theme.accent}" />
    `;
  } else if (baseId.includes('plasmacaster') || id.includes('plasmacaster') || name.includes('plasma') || name.includes('canon')) {
    weaponSilhouette = `
      <rect x="18" y="38" width="16" height="16" rx="2" fill="#1b1d24" stroke="${theme.primary}" stroke-width="1.3" />
      <circle cx="26" cy="46" r="4" fill="none" stroke="${theme.accent}" stroke-width="1.2" />
      <path d="M26,38 L36,26 L52,26" fill="none" stroke="${theme.primary}" stroke-width="2.5" stroke-linecap="round" />
      <rect x="50" y="20" width="34" height="14" rx="3" fill="#263238" stroke="${theme.primary}" stroke-width="1.4" />
      <rect x="54" y="23" width="8" height="8" rx="1" fill="${theme.accent}" opacity="0.8" />
      <line x1="68" y1="17" x2="68" y2="20" stroke="${theme.primary}" stroke-width="1.5" />
      <line x1="74" y1="17" x2="74" y2="20" stroke="${theme.primary}" stroke-width="1.5" />
      <line x1="80" y1="17" x2="80" y2="20" stroke="${theme.primary}" stroke-width="1.5" />
      <polygon points="84,21 98,24 98,30 84,33" fill="#37474f" stroke="${theme.primary}" stroke-width="1.2" />
      <circle cx="102" cy="27" r="2.5" fill="#ff1744" />
      <circle cx="98" cy="24" r="1.3" fill="#ff1744" />
      <circle cx="98" cy="30" r="1.3" fill="#ff1744" />
    `;
  } else if (baseId.includes('combistick') || id.includes('combistick') || name.includes('lance') || name.includes('spear')) {
    weaponSilhouette = `
      <line x1="12" y1="52" x2="108" y2="20" stroke="${theme.primary}" stroke-width="3" stroke-linecap="round" />
      <line x1="52" y1="39" x2="68" y2="33.5" stroke="${theme.accent}" stroke-width="4.5" />
      <polygon points="108,20 94,18 100,28 116,17" fill="#cfd8dc" stroke="${theme.primary}" stroke-width="1.2" />
      <polygon points="12,52 26,54 20,44 4,55" fill="#cfd8dc" stroke="${theme.primary}" stroke-width="1.2" />
      <circle cx="116" cy="17" r="2" fill="${theme.accent}" />
    `;
  } else if (baseId.includes('smartdisc') || id.includes('disc') || name.includes('disque')) {
    weaponSilhouette = `
      <ellipse cx="60" cy="36" rx="36" ry="16" fill="#1b242e" stroke="${theme.primary}" stroke-width="1.8" />
      <ellipse cx="60" cy="36" rx="24" ry="10" fill="none" stroke="${theme.accent}" stroke-width="1.2" stroke-dasharray="3,2" />
      <circle cx="52" cy="36" r="3" fill="#03080e" stroke="${theme.primary}" stroke-width="1" />
      <circle cx="68" cy="36" r="3" fill="#03080e" stroke="${theme.primary}" stroke-width="1" />
      <path d="M24,36 L18,33 M96,36 L102,33 M60,20 L60,14 M60,52 L60,58" stroke="${theme.accent}" stroke-width="2" stroke-linecap="round" />
    `;
  } else if (id.includes('pulse_rifle') || name.includes('pulse rifle') || name.includes('m41a')) {
    weaponSilhouette = `
      <polygon points="20,44 32,44 36,36 74,36 76,30 102,30 104,36 76,36 74,44 56,44 52,52 44,52 46,44 20,44" fill="#263238" stroke="${theme.primary}" stroke-width="1.3" />
      <path d="M38,30 L42,20 L72,20 L76,30" fill="none" stroke="${theme.primary}" stroke-width="1.5" />
      <line x1="76" y1="33" x2="108" y2="33" stroke="${theme.primary}" stroke-width="2" />
      <rect x="70" y="38" width="28" height="5" rx="1" fill="#37474f" stroke="${theme.accent}" stroke-width="1" />
      <rect x="42" y="38" width="9" height="5" rx="1" fill="#110000" stroke="#ff1744" stroke-width="0.8" />
      <text x="46.5" y="42" font-family="'Orbitron', monospace" font-size="3.2" font-weight="900" fill="#ff1744" text-anchor="middle">95</text>
      <path d="M50,44 L54,58 L48,59 L45,44" fill="#1b242e" stroke="${theme.primary}" stroke-width="1" />
    `;
  } else if (id.includes('smartgun') || name.includes('smartgun') || name.includes('m56')) {
    weaponSilhouette = `
      <rect x="48" y="28" width="52" height="10" rx="2" fill="#212121" stroke="${theme.primary}" stroke-width="1.3" />
      <circle cx="56" cy="33" r="1.5" fill="${theme.accent}" /><circle cx="64" cy="33" r="1.5" fill="${theme.accent}" />
      <circle cx="72" cy="33" r="1.5" fill="${theme.accent}" /><circle cx="80" cy="33" r="1.5" fill="${theme.accent}" />
      <rect x="100" y="27" width="8" height="12" fill="#37474f" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M20,48 L32,38 L48,38" fill="none" stroke="${theme.primary}" stroke-width="2.5" />
      <circle cx="32" cy="38" r="3" fill="#ff5252" />
      <line x1="42" y1="36" x2="38" y2="48" stroke="${theme.accent}" stroke-width="2" />
    `;
  } else if (id.includes('minigun') || name.includes('painless') || name.includes('m134')) {
    weaponSilhouette = `
      <rect x="22" y="28" width="24" height="16" rx="2" fill="#212529" stroke="${theme.primary}" stroke-width="1.3" />
      <path d="M24,28 L30,18 L40,18 L42,28" fill="none" stroke="${theme.accent}" stroke-width="2" />
      <line x1="46" y1="30" x2="108" y2="30" stroke="${theme.primary}" stroke-width="1.5" />
      <line x1="46" y1="33" x2="108" y2="33" stroke="${theme.accent}" stroke-width="1.5" />
      <line x1="46" y1="36" x2="108" y2="36" stroke="${theme.primary}" stroke-width="1.5" />
      <line x1="46" y1="39" x2="108" y2="39" stroke="${theme.accent}" stroke-width="1.5" />
      <line x1="46" y1="42" x2="108" y2="42" stroke="${theme.primary}" stroke-width="1.5" />
      <rect x="66" y="28" width="4" height="16" fill="${theme.primary}" />
      <rect x="88" y="28" width="4" height="16" fill="${theme.primary}" />
      <rect x="104" y="28" width="5" height="16" fill="${theme.accent}" />
    `;
  } else if (name.includes('shotgun') || name.includes('pompe') || name.includes('spas') || name.includes('ithaca')) {
    weaponSilhouette = `
      <line x1="38" y1="31" x2="104" y2="31" stroke="${theme.primary}" stroke-width="2.5" />
      <line x1="48" y1="36" x2="98" y2="36" stroke="${theme.primary}" stroke-width="2" />
      <rect x="58" y="34" width="18" height="5" rx="1" fill="${theme.accent}" stroke="${theme.primary}" stroke-width="1" />
      <polygon points="20,44 38,44 48,34 38,30 20,38" fill="#2d3748" stroke="${theme.primary}" stroke-width="1.3" />
    `;
  } else if (name.includes('sniper') || name.includes('précision') || name.includes('barrett')) {
    weaponSilhouette = `
      <line x1="36" y1="34" x2="102" y2="34" stroke="${theme.primary}" stroke-width="2" />
      <polygon points="102,31 110,30 110,38 102,37" fill="${theme.accent}" stroke="${theme.primary}" stroke-width="1" />
      <rect x="42" y="22" width="28" height="6" rx="1" fill="#1a202c" stroke="${theme.primary}" stroke-width="1.2" />
      <line x1="46" y1="28" x2="48" y2="34" stroke="${theme.primary}" stroke-width="1.5" />
      <line x1="64" y1="28" x2="62" y2="34" stroke="${theme.primary}" stroke-width="1.5" />
      <circle cx="42" cy="25" r="3" fill="${theme.accent}" opacity="0.8" />
      <line x1="82" y1="35" x2="74" y2="52" stroke="${theme.primary}" stroke-width="1.4" />
      <line x1="82" y1="35" x2="90" y2="52" stroke="${theme.primary}" stroke-width="1.4" />
      <polygon points="14,46 36,44 38,34 26,34 16,40" fill="#2d3748" stroke="${theme.primary}" stroke-width="1.2" />
    `;
  } else {
    weaponSilhouette = `
      <polygon points="22,46 38,46 44,36 84,36 88,32 104,32 104,36 86,38 78,46 54,46 50,56 42,56 44,46 22,46" fill="#2d3748" stroke="${theme.primary}" stroke-width="1.3" />
      <line x1="86" y1="34" x2="108" y2="34" stroke="${theme.accent}" stroke-width="2" />
      <rect x="52" y="28" width="22" height="4" rx="1" fill="#1a202c" stroke="${theme.primary}" stroke-width="1" />
    `;
  }

  const cleanCaliber = caliber.length > 28 ? caliber.slice(0, 26) + '…' : caliber;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" class="tactical-weapon-miniature" role="img" aria-label="Schéma technique de l'arme ${wep.name}">
      <defs>
        <linearGradient id="bg-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${theme.dark}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#02070e" stop-opacity="0.98" />
        </linearGradient>
        <pattern id="grid-${uid}" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="${theme.primary}" stroke-width="0.35" opacity="0.18" />
        </pattern>
        <filter id="glow-${uid}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="120" height="70" fill="url(#bg-${uid})" />
      <rect width="120" height="70" fill="url(#grid-${uid})" />

      <g class="ballistic-reticle" opacity="0.35">
        <circle cx="60" cy="35" r="26" fill="none" stroke="${theme.primary}" stroke-width="0.6" stroke-dasharray="2,2" />
        <circle cx="60" cy="35" r="14" fill="none" stroke="${theme.primary}" stroke-width="0.8" />
        <line x1="60" y1="6" x2="60" y2="64" stroke="${theme.primary}" stroke-width="0.5" />
        <line x1="15" y1="35" x2="105" y2="35" stroke="${theme.primary}" stroke-width="0.5" />
      </g>

      <g class="weapon-blueprint" filter="url(#glow-${uid})">
        ${weaponSilhouette}
      </g>

      <line x1="18" y1="14" x2="102" y2="14" stroke="${theme.accent}" stroke-width="0.6" opacity="0.6" />
      <line x1="18" y1="12" x2="18" y2="16" stroke="${theme.accent}" stroke-width="0.8" />
      <line x1="102" y1="12" x2="102" y2="16" stroke="${theme.accent}" stroke-width="0.8" />
      <text x="60" y="12" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="${theme.accent}" text-anchor="middle" letter-spacing="0.5">${cleanCaliber}</text>

      <rect x="0" y="58" width="120" height="12" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="58" x2="120" y2="58" stroke="${theme.primary}" stroke-width="0.5" opacity="0.5" />
      <text x="6" y="66" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="800" fill="${theme.primary}" letter-spacing="0.5">${theme.type}</text>
      <text x="114" y="66" font-family="'Rajdhani', sans-serif" font-size="5" font-weight="700" fill="#cfd8dc" text-anchor="end">${wep.effectiveRangeMeters ? wep.effectiveRangeMeters + 'M PORTÉE' : 'CADENCE OPTIMALE'}</text>

      <path d="M3,7 L3,3 L7,3" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M113,3 L117,3 L117,7" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M3,63 L3,67 L7,67" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M113,67 L117,67 L117,63" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle d'escouade tactique en formation d'assaut.
 * Intègre les silhouettes des membres en formation chevron/wedge, visières HUD luminescentes,
 * réticules d'acquisition de cible, insignes et télémétrie de menace.
 * @param {Object} squad Objet escouade
 * @returns {string} Markup SVG tactique
 */
export function getSquadMiniatureSvg(squad) {
  const sq = typeof squad === 'object' && squad !== null ? squad : { id: 'unknown_squad', name: 'Escouade Inconnue' };
  const total = sq.totalMembers || (Array.isArray(sq.members) ? sq.members.length : 5);
  const cat = String(sq.category || '').toUpperCase();
  const uid = 'sqd-hud-' + Math.abs(hashCode(sq.id || sq.name || 'squad'));

  let theme = {
    primary: '#00e5ff',
    secondary: '#0077b6',
    visor: '#ffd700',
    dark: '#03121f',
    label: 'FORMATION EN V // ASSAUT'
  };

  if (cat.includes('CARTEL') || cat.includes('CRIME')) {
    theme = {
      primary: '#ff3d00',
      secondary: '#b71c1c',
      visor: '#ff1744',
      dark: '#1c0603',
      label: 'MEUTE DE COMBAT // HOSTILE'
    };
  } else if (cat.includes('MERCENARY') || cat.includes('SYNDICATE')) {
    theme = {
      primary: '#ffab00',
      secondary: '#e65100',
      visor: '#ffd54f',
      dark: '#1a1002',
      label: 'SYNDICAT // CONTRAT SANG'
    };
  } else if (cat.includes('TRIBAL') || cat.includes('FAUNA')) {
    theme = {
      primary: '#76ff03',
      secondary: '#2e7d32',
      visor: '#ffff00',
      dark: '#0a1a05',
      label: 'TROUPEAU RITUEL // PISTE'
    };
  } else if (cat.includes('PREDATOR') || cat.includes('HONOR')) {
    theme = {
      primary: '#ff1744',
      secondary: '#880e4f',
      visor: '#ffd700',
      dark: '#1f0307',
      label: 'CLAN YAUTJA // CHASSE ROYALE'
    };
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 75" class="tactical-squad-miniature" role="img" aria-label="Formation tactique de l'escouade ${sq.name}">
      <defs>
        <linearGradient id="bg-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${theme.dark}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#02060c" stop-opacity="0.98" />
        </linearGradient>
        <pattern id="grid-${uid}" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${theme.primary}" stroke-width="0.35" opacity="0.18" />
        </pattern>
        <filter id="glow-${uid}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="120" height="75" fill="url(#bg-${uid})" />
      <rect width="120" height="75" fill="url(#grid-${uid})" />

      <path d="M15,62 A55,55 0 0,1 105,62" fill="none" stroke="${theme.primary}" stroke-width="0.6" stroke-dasharray="3,3" opacity="0.4" />
      <path d="M30,62 A38,38 0 0,1 90,62" fill="none" stroke="${theme.primary}" stroke-width="0.8" opacity="0.5" />

      <g class="squad-formation" filter="url(#glow-${uid})">
        <!-- 1. LEADER AU CENTRE EN POINTE AVANT -->
        <g class="operative-leader" transform="translate(60, 24)">
          <polygon points="0,-10 -3.5,-15 3.5,-15" fill="${theme.visor}" />
          <ellipse cx="0" cy="0" rx="5.5" ry="5.5" fill="#1b2533" stroke="${theme.primary}" stroke-width="1.1" />
          <line x1="-3.5" y1="0.5" x2="3.5" y2="0.5" stroke="${theme.visor}" stroke-width="1.6" stroke-linecap="round" />
          <polygon points="-7.5,6 7.5,6 6,20 -6,20" fill="#111822" stroke="${theme.primary}" stroke-width="0.9" />
          <line x1="2" y1="8" x2="14" y2="2" stroke="${theme.primary}" stroke-width="1.8" stroke-linecap="round" />
          <rect x="11" y="0" width="6" height="2" fill="${theme.accent || theme.primary}" />
        </g>

        <!-- 2. FLANC GAUCHE -->
        <g class="operative-left-flank" transform="translate(36, 33)">
          <polygon points="0,-8 -3,-12 3,-12" fill="${theme.primary}" opacity="0.8" />
          <ellipse cx="0" cy="0" rx="5" ry="5" fill="#151e29" stroke="${theme.primary}" stroke-width="1" />
          <line x1="-3" y1="0.5" x2="3" y2="0.5" stroke="${theme.visor}" stroke-width="1.4" stroke-linecap="round" />
          <polygon points="-6.5,5 6.5,5 5,18 -5,18" fill="#0f151e" stroke="${theme.primary}" stroke-width="0.8" />
          <line x1="-2" y1="8" x2="-12" y2="2" stroke="${theme.primary}" stroke-width="1.6" />
        </g>

        <!-- 3. FLANC DROIT -->
        <g class="operative-right-flank" transform="translate(84, 33)">
          <polygon points="0,-8 -3,-12 3,-12" fill="${theme.primary}" opacity="0.8" />
          <ellipse cx="0" cy="0" rx="5" ry="5" fill="#151e29" stroke="${theme.primary}" stroke-width="1" />
          <line x1="-3" y1="0.5" x2="3" y2="0.5" stroke="${theme.visor}" stroke-width="1.4" stroke-linecap="round" />
          <polygon points="-6.5,5 6.5,5 5,18 -5,18" fill="#0f151e" stroke="${theme.primary}" stroke-width="0.8" />
          <line x1="2" y1="8" x2="14" y2="3" stroke="${theme.primary}" stroke-width="1.6" />
        </g>

        <!-- 4. ARRIÈRE-GARDE GAUCHE -->
        ${total >= 4 ? `
          <g class="operative-rear-left" transform="translate(18, 42)">
            <ellipse cx="0" cy="0" rx="4.5" ry="4.5" fill="#111822" stroke="${theme.primary}" stroke-width="0.8" />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="${theme.visor}" stroke-width="1.2" />
            <polygon points="-5,5 5,5 4,16 -4,16" fill="#0c1017" stroke="${theme.primary}" stroke-width="0.7" />
          </g>
        ` : ''}

        <!-- 5. ARRIÈRE-GARDE DROITE -->
        ${total >= 5 ? `
          <g class="operative-rear-right" transform="translate(102, 42)">
            <ellipse cx="0" cy="0" rx="4.5" ry="4.5" fill="#111822" stroke="${theme.primary}" stroke-width="0.8" />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="${theme.visor}" stroke-width="1.2" />
            <polygon points="-5,5 5,5 4,16 -4,16" fill="#0c1017" stroke="${theme.primary}" stroke-width="0.7" />
          </g>
        ` : ''}
      </g>

      <g class="tri-laser-lock" opacity="0.9">
        <circle cx="58" cy="20" r="1.8" fill="#ff1744" />
        <circle cx="62" cy="20" r="1.8" fill="#ff1744" />
        <circle cx="60" cy="16" r="1.8" fill="#ff1744" />
        <polygon points="58,20 62,20 60,16" fill="none" stroke="#ff1744" stroke-width="0.6" stroke-dasharray="1.5,1.5" />
      </g>

      <rect x="0" y="0" width="120" height="11" fill="#000000" fill-opacity="0.65" />
      <line x1="0" y1="11" x2="120" y2="11" stroke="${theme.primary}" stroke-width="0.5" opacity="0.5" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.5" font-weight="800" fill="${theme.primary}" letter-spacing="0.5">${theme.label}</text>
      <text x="114" y="8" font-family="'Rajdhani', sans-serif" font-size="5" font-weight="700" fill="${theme.visor}" text-anchor="end">[ ${total} COMBATTANTS ]</text>

      <rect x="0" y="63" width="120" height="12" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="63" x2="120" y2="63" stroke="${theme.primary}" stroke-width="0.5" opacity="0.5" />
      <text x="6" y="71" font-family="'Rajdhani', sans-serif" font-size="5" font-weight="600" fill="#cfd8dc">${cat}</text>
      <text x="114" y="71" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="800" fill="#ff5252" text-anchor="end">CIBLES VERROUILLÉES</text>

      <path d="M3,7 L3,3 L7,3" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M113,3 L117,3 L117,7" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M3,67 L3,71 L7,71" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
      <path d="M113,71 L117,71 L117,67" fill="none" stroke="${theme.primary}" stroke-width="1.2" />
    </svg>
  `.trim();
}


/**
 * Miniature vectorielle SVG tactique 180x76 pour chaque proie / spécimen du Bestiaire.
 * Affiche la silhouette bio-scan par espèce (Xenomorph/Alien, Yautja/Predator, Synthetic/Android,
 * Engineer/Space Jockey, Megafauna/Quadruped/Beast, ou Human/Marine), la palette régime/menace,
 * l'échelle télémétrique de hauteur (prey.heightM / prey.sizeMeters) et le réticule bio-radar.
 * @param {Object} prey Objet proie du bestiaire
 * @returns {string} Markup SVG 180x76
 */
export function getPreyMiniatureSvg(prey = {}) {
  const p = typeof prey === 'object' && prey !== null ? prey : { id: String(prey || 'prey_unknown'), name: 'Spécimen Inconnu' };
  const rawBlob = `${p.id || ''} ${p.name || ''} ${p.species || ''} ${p.category || ''} ${p.faction || ''} ${p.universe || ''}`.toLowerCase();
  const dietBlob = `${p.diet || ''} ${p.threatLevel || ''} ${p.danger || ''}`.toLowerCase();
  const heightNum = Number.isFinite(Number(p.heightM ?? p.sizeMeters)) && Number(p.heightM ?? p.sizeMeters) > 0
    ? Number(p.heightM ?? p.sizeMeters)
    : 2.1;
  const heightLabel = `${heightNum.toFixed(1)}M`;
  const barRatio = Math.max(0.18, Math.min(1, heightNum / 4.5));
  const barHeight = Math.round(barRatio * 42);
  const barY = 58 - barHeight;
  const uid = 'prey-bio-' + Math.abs(hashCode(p.id || p.name || 'prey'));

  let archetype = 'HUMAN_MARINE';
  if (
    rawBlob.includes('xeno') ||
    rawBlob.includes('neomorph') ||
    rawBlob.includes('deacon') ||
    rawBlob.includes('praetorian') ||
    rawBlob.includes('queen') ||
    rawBlob.includes('facehugger') ||
    rawBlob.includes('chestburster') ||
    rawBlob.includes('predalien') ||
    rawBlob.includes('crusher') ||
    rawBlob.includes('runner') ||
    rawBlob.includes('spitter') ||
    rawBlob.includes('k-series') ||
    rawBlob.includes('xx121')
  ) {
    archetype = 'XENOMORPH';
  } else if (
    rawBlob.includes('yautja') ||
    rawBlob.includes('predator') ||
    rawBlob.includes('bad_blood') ||
    rawBlob.includes('super_predator') ||
    rawBlob.includes('berserker') ||
    rawBlob.includes('falconer') ||
    rawBlob.includes('tracker') ||
    rawBlob.includes('hish')
  ) {
    archetype = 'YAUTJA';
  } else if (
    rawBlob.includes('synth') ||
    rawBlob.includes('android') ||
    rawBlob.includes('working_joe') ||
    rawBlob.includes('cyborg') ||
    rawBlob.includes('bishop') ||
    rawBlob.includes('david') ||
    rawBlob.includes('walter') ||
    rawBlob.includes('ash') ||
    rawBlob.includes('call') ||
    rawBlob.includes('dean') ||
    rawBlob.includes('skynet') ||
    rawBlob.includes('terminator') ||
    rawBlob.includes('ed-209') ||
    rawBlob.includes('ed209') ||
    rawBlob.includes('combat_android')
  ) {
    archetype = 'SYNTHETIC';
  } else if (
    rawBlob.includes('engineer') ||
    rawBlob.includes('ingénieur') ||
    rawBlob.includes('jockey') ||
    rawBlob.includes('mala') ||
    rawBlob.includes('architect')
  ) {
    archetype = 'ENGINEER';
  } else if (
    rawBlob.includes('fauna') ||
    rawBlob.includes('faune') ||
    rawBlob.includes('megafauna') ||
    rawBlob.includes('beast') ||
    rawBlob.includes('quadruped') ||
    rawBlob.includes('hellhound') ||
    rawBlob.includes('hound') ||
    rawBlob.includes('river_ghost') ||
    rawBlob.includes('arachnid') ||
    rawBlob.includes('scorpion') ||
    rawBlob.includes('worm') ||
    rawBlob.includes('leviathan') ||
    rawBlob.includes('rhino') ||
    rawBlob.includes('boar') ||
    rawBlob.includes('caiman') ||
    rawBlob.includes('crocodile') ||
    rawBlob.includes('lion') ||
    rawBlob.includes('panther') ||
    rawBlob.includes('ape') ||
    rawBlob.includes('mutant') ||
    rawBlob.includes('trilobite') ||
    rawBlob.includes('hammerpede') ||
    rawBlob.includes('rat') ||
    rawBlob.includes('ant')
  ) {
    archetype = 'MEGAFAUNA';
  }

  let palette = {
    primary: '#29b6f6',
    secondary: '#0288d1',
    accent: '#ffd54f',
    dark: '#031322',
    scanLabel: 'BIO-SCAN // TACTICAL HUMAN'
  };

  if (archetype === 'XENOMORPH') {
    palette = {
      primary: '#76ff03',
      secondary: '#00e676',
      accent: '#ccff90',
      dark: '#051a08',
      scanLabel: 'BIO-SCAN // XX121 ACIDE'
    };
  } else if (archetype === 'YAUTJA') {
    palette = {
      primary: '#ff3d00',
      secondary: '#d50000',
      accent: '#ffd700',
      dark: '#1f0503',
      scanLabel: 'BIO-SCAN // YAUTJA APEX'
    };
  } else if (archetype === 'SYNTHETIC') {
    palette = {
      primary: '#00e5ff',
      secondary: '#0097a7',
      accent: '#e0f7fa',
      dark: '#02161f',
      scanLabel: 'TECH-SCAN // SYNTHÉTIQUE'
    };
  } else if (archetype === 'ENGINEER') {
    palette = {
      primary: '#b388ff',
      secondary: '#651fff',
      accent: '#00e5ff',
      dark: '#0f0624',
      scanLabel: 'ARCANE-SCAN // MALA\'KAK'
    };
  } else if (archetype === 'MEGAFAUNA') {
    palette = {
      primary: '#ff9100',
      secondary: '#ff3d00',
      accent: '#ffd740',
      dark: '#1c0c02',
      scanLabel: 'FAUNA-SCAN // MÉGAFAUNE'
    };
  }

  if (dietBlob.includes('extrême') || dietBlob.includes('extreme') || dietBlob.includes('apex') || dietBlob.includes('reine')) {
    palette.accent = '#ff1744';
  }

  let silhouetteSvg = '';
  if (archetype === 'XENOMORPH') {
    silhouetteSvg = `
      <g class="prey-bioscan-silhouette" data-species-archetype="XENOMORPH">
        <!-- Crâne allongé biomécanique -->
        <path d="M58,25 C58,16 78,13 98,16 C108,18 112,22 104,26 C94,29 82,29 72,30 Z" fill="${palette.dark}" stroke="${palette.primary}" stroke-width="1.5" />
        <path d="M64,21 C76,18 90,18 100,21" fill="none" stroke="${palette.accent}" stroke-width="0.9" opacity="0.8" />
        <!-- Mâchoire interne pharyngienne -->
        <line x1="58" y1="26" x2="49" y2="27" stroke="${palette.accent}" stroke-width="1.4" stroke-linecap="round" />
        <polygon points="48,25 44,27 48,29" fill="${palette.accent}" />
        <!-- Tubes dorsaux & Torse chitineux -->
        <path d="M84,26 L94,16 M88,29 L99,20 M91,33 L103,26" stroke="${palette.primary}" stroke-width="1.5" stroke-linecap="round" />
        <path d="M72,29 C68,38 70,48 76,54 L88,52 C86,44 86,35 84,28 Z" fill="#0d2612" stroke="${palette.primary}" stroke-width="1.3" />
        <line x1="72" y1="35" x2="84" y2="34" stroke="${palette.accent}" stroke-width="0.9" />
        <line x1="73" y1="40" x2="85" y2="39" stroke="${palette.accent}" stroke-width="0.9" />
        <line x1="74" y1="45" x2="86" y2="44" stroke="${palette.accent}" stroke-width="0.9" />
        <!-- Bras griffus & Queue segmentée en lame -->
        <path d="M72,33 L58,41 L52,38" fill="none" stroke="${palette.primary}" stroke-width="1.5" stroke-linecap="round" />
        <path d="M88,52 C104,56 120,52 126,38 C129,31 122,24 114,22" fill="none" stroke="${palette.primary}" stroke-width="1.8" stroke-linecap="round" />
        <polygon points="114,22 106,19 111,26" fill="${palette.accent}" />
      </g>
    `;
  } else if (archetype === 'YAUTJA') {
    silhouetteSvg = `
      <g class="prey-bioscan-silhouette" data-species-archetype="YAUTJA">
        <!-- Dreadlocks & Crâne -->
        <path d="M72,22 C64,28 62,40 64,50 M100,22 C108,28 110,40 108,50 M75,18 C67,26 66,38 68,48 M97,18 C105,26 106,38 104,48" fill="none" stroke="${palette.primary}" stroke-width="1.8" stroke-linecap="round" />
        <!-- Biomasque Yautja -->
        <polygon points="86,15 98,21 95,36 86,42 77,36 74,21" fill="#2a0a06" stroke="${palette.primary}" stroke-width="1.5" />
        <polygon points="78,25 84,27 78,29" fill="${palette.accent}" />
        <polygon points="94,25 88,27 94,29" fill="${palette.accent}" />
        <!-- Torse cuirassé & Plasmacaster d'épaule -->
        <polygon points="68,38 104,38 110,58 62,58" fill="#1e0805" stroke="${palette.primary}" stroke-width="1.4" />
        <rect x="62" y="29" width="10" height="6" rx="1" fill="#37474f" stroke="${palette.accent}" stroke-width="1.1" />
        <line x1="62" y1="32" x2="52" y2="32" stroke="${palette.accent}" stroke-width="1.8" />
        <circle cx="96" cy="21" r="1.4" fill="#ff1744" />
        <circle cx="99" cy="21" r="1.4" fill="#ff1744" />
        <circle cx="97.5" cy="18.5" r="1.4" fill="#ff1744" />
      </g>
    `;
  } else if (archetype === 'SYNTHETIC') {
    silhouetteSvg = `
      <g class="prey-bioscan-silhouette" data-species-archetype="SYNTHETIC">
        <!-- Châssis crânien cybernétique -->
        <ellipse cx="86" cy="26" rx="11" ry="13" fill="#06222e" stroke="${palette.primary}" stroke-width="1.5" />
        <line x1="77" y1="25" x2="95" y2="25" stroke="${palette.accent}" stroke-width="1.8" />
        <circle cx="82" cy="25" r="2" fill="#ffffff" />
        <circle cx="90" cy="25" r="2" fill="#ffffff" />
        <path d="M86,13 L86,19 M80,33 L92,33" stroke="${palette.primary}" stroke-width="1.1" />
        <!-- Endosquelette thoracique & Servomoteurs -->
        <polygon points="68,40 104,40 108,58 64,58" fill="#071d29" stroke="${palette.primary}" stroke-width="1.4" />
        <circle cx="86" cy="48" r="5" fill="none" stroke="${palette.accent}" stroke-width="1.3" />
        <circle cx="86" cy="48" r="2" fill="${palette.accent}" />
        <line x1="72" y1="45" x2="80" y2="48" stroke="${palette.primary}" stroke-width="1.1" />
        <line x1="100" y1="45" x2="92" y2="48" stroke="${palette.primary}" stroke-width="1.1" />
      </g>
    `;
  } else if (archetype === 'ENGINEER') {
    silhouetteSvg = `
      <g class="prey-bioscan-silhouette" data-species-archetype="ENGINEER">
        <!-- Heaume Space Jockey à trompe ossifiée -->
        <ellipse cx="86" cy="25" rx="12" ry="13" fill="#160a30" stroke="${palette.primary}" stroke-width="1.6" />
        <ellipse cx="81" cy="23" rx="3" ry="2.2" fill="${palette.accent}" />
        <ellipse cx="91" cy="23" rx="3" ry="2.2" fill="${palette.accent}" />
        <path d="M86,28 C86,35 80,41 73,43" fill="none" stroke="${palette.primary}" stroke-width="2.4" stroke-linecap="round" />
        <!-- Épaulières biomécaniques monumentales -->
        <path d="M58,58 C60,40 72,36 86,36 C100,36 112,40 114,58 Z" fill="#120726" stroke="${palette.primary}" stroke-width="1.5" />
        <path d="M68,42 Q86,50 104,42 M72,49 Q86,56 100,49" fill="none" stroke="${palette.accent}" stroke-width="1.1" />
      </g>
    `;
  } else if (archetype === 'MEGAFAUNA') {
    silhouetteSvg = `
      <g class="prey-bioscan-silhouette" data-species-archetype="MEGAFAUNA">
        <!-- Silhouette de bête quadrupède / prédateur alpha à cornes et épines dorsales -->
        <path d="M54,36 L64,26 L76,28 L104,28 L116,36 L112,52 L104,56 L102,46 L72,46 L68,56 L60,56 L62,42 Z" fill="#261103" stroke="${palette.primary}" stroke-width="1.5" stroke-linejoin="round" />
        <!-- Cornes & Épines dorsales -->
        <path d="M60,28 L50,18 M66,26 L58,16 M80,28 L84,20 M90,28 L94,20 M100,28 L104,21" stroke="${palette.accent}" stroke-width="1.6" stroke-linecap="round" />
        <!-- Oeil thermique & Coeur -->
        <circle cx="60" cy="33" r="2" fill="#ff1744" />
        <circle cx="84" cy="36" r="4.5" fill="${palette.accent}" opacity="0.75" />
      </g>
    `;
  } else {
    silhouetteSvg = `
      <g class="prey-bioscan-silhouette" data-species-archetype="HUMAN_MARINE">
        <!-- Casque tactique USCM / Commando & Visière HUD -->
        <path d="M75,24 C75,16 97,16 97,24 L99,29 L73,29 Z" fill="#0b2236" stroke="${palette.primary}" stroke-width="1.4" />
        <rect x="77" y="25" width="18" height="4.5" rx="1" fill="${palette.accent}" opacity="0.9" />
        <ellipse cx="86" cy="29" rx="8.5" ry="9" fill="#081a2b" stroke="${palette.primary}" stroke-width="1.2" />
        <!-- Plastron balistique M3 & Lampe d'épaule -->
        <polygon points="66,40 106,40 110,58 62,58" fill="#071826" stroke="${palette.primary}" stroke-width="1.4" />
        <rect x="103" y="33" width="6" height="6" rx="1" fill="${palette.accent}" stroke="${palette.primary}" stroke-width="1" />
        <!-- Silhouette Pulse Rifle en joue -->
        <line x1="56" y1="48" x2="112" y2="44" stroke="${palette.accent}" stroke-width="2.2" stroke-linecap="round" />
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="tactical-miniature prey-miniature-svg" viewBox="0 0 180 76" role="img" aria-label="Bio-scan tactique ${p.name || 'Spécimen'}">
      <defs>
        <linearGradient id="bg-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.dark}" stop-opacity="0.96" />
          <stop offset="100%" stop-color="#02060d" stop-opacity="0.99" />
        </linearGradient>
        <pattern id="grid-${uid}" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M 9 0 L 0 0 0 9" fill="none" stroke="${palette.primary}" stroke-width="0.35" opacity="0.2" />
        </pattern>
      </defs>

      <rect width="180" height="76" fill="url(#bg-${uid})" />
      <rect width="180" height="76" fill="url(#grid-${uid})" />

      <!-- Réticule Bio-Radar Gauche/Centre -->
      <g class="bio-radar-reticle" opacity="0.85">
        <circle cx="26" cy="38" r="16" fill="none" stroke="${palette.primary}" stroke-width="0.9" stroke-dasharray="3,2" />
        <circle cx="26" cy="38" r="9" fill="none" stroke="${palette.primary}" stroke-width="0.7" opacity="0.7" />
        <circle cx="26" cy="38" r="2.5" fill="${palette.accent}" />
        <line x1="8" y1="38" x2="44" y2="38" stroke="${palette.primary}" stroke-width="0.6" opacity="0.6" />
        <line x1="26" y1="20" x2="26" y2="56" stroke="${palette.primary}" stroke-width="0.6" opacity="0.6" />
        <circle cx="86" cy="38" r="25" fill="none" stroke="${palette.primary}" stroke-width="0.6" stroke-dasharray="2,2" opacity="0.45" />
      </g>

      <!-- Silhouette Bio-Scan de la Proie -->
      ${silhouetteSvg}

      <!-- Jauge Télémétrique de Hauteur (prey.heightM) -->
      <g class="height-telemetry-bar">
        <line x1="146" y1="16" x2="146" y2="58" stroke="${palette.primary}" stroke-width="1" opacity="0.7" />
        <line x1="143" y1="16" x2="149" y2="16" stroke="${palette.primary}" stroke-width="1" />
        <line x1="144" y1="30" x2="148" y2="30" stroke="${palette.primary}" stroke-width="0.7" />
        <line x1="144" y1="44" x2="148" y2="44" stroke="${palette.primary}" stroke-width="0.7" />
        <line x1="143" y1="58" x2="149" y2="58" stroke="${palette.primary}" stroke-width="1" />
        <rect x="151" y="16" width="6" height="42" rx="1.5" fill="#050b12" stroke="${palette.primary}" stroke-width="0.8" opacity="0.8" />
        <rect x="151" y="${barY}" width="6" height="${barHeight}" rx="1.2" fill="${palette.accent}" />
        <text x="161" y="36" font-family="'Orbitron', sans-serif" font-size="4.8" font-weight="900" fill="${palette.accent}">${heightLabel}</text>
        <text x="161" y="44" font-family="'Rajdhani', sans-serif" font-size="4.2" font-weight="700" fill="#90a4ae">HAUTEUR</text>
      </g>

      <!-- Bandeaux Télémétrie Haut & Bas -->
      <rect x="0" y="0" width="180" height="11" fill="#000000" fill-opacity="0.7" />
      <line x1="0" y1="11" x2="180" y2="11" stroke="${palette.primary}" stroke-width="0.5" opacity="0.55" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="800" fill="${palette.primary}" letter-spacing="0.5">${palette.scanLabel}</text>
      <text x="174" y="8" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="${palette.accent}" text-anchor="end">${archetype}</text>

      <rect x="0" y="65" width="180" height="11" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="65" x2="180" y2="65" stroke="${palette.primary}" stroke-width="0.5" opacity="0.55" />
      <text x="6" y="73" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="#cfd8dc">${String(p.diet || p.category || 'SPÉCIMEN ACTIF').slice(0, 26).toUpperCase()}</text>
      <text x="174" y="73" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="800" fill="${palette.accent}" text-anchor="end">HONNEUR +${p.honorValue ?? 200}</text>
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle SVG 180x76 pour chaque dossier d'archive du Codex Lore.
 * Illustre un cristal de données holographique MU-TH-UR / Yautja, une télémétrie d'onde (waveform),
 * le glyphe d'univers (PREDATOR, ALIEN ou AVP) et le motif de catégorie (CLAN, XENOMORPH, FACTION, LOCATION, HISTORY, TECHNOLOGY, etc.).
 * @param {Object} entry Entrée du Codex Lore
 * @returns {string} Markup SVG 180x76
 */
export function getLoreMiniatureSvg(entry = {}) {
  const e = typeof entry === 'object' && entry !== null ? entry : { id: String(entry || 'lore_unknown'), title: 'Archive Classifiée' };
  const rawBlob = `${e.id || ''} ${e.title || ''} ${e.category || ''} ${e.universe || ''}`.toLowerCase();
  const cat = String(e.category || 'ARCHIVE').toUpperCase();
  const uid = 'lore-holo-' + Math.abs(hashCode(e.id || e.title || 'lore'));

  let universe = String(e.universe || '').toUpperCase();
  if (!universe || (universe !== 'PREDATOR' && universe !== 'ALIEN' && universe !== 'AVP')) {
    if (rawBlob.includes('avp') || rawBlob.includes('machiko') || rawBlob.includes('bouvet') || rawBlob.includes('ryushi') || rawBlob.includes('bg-386')) {
      universe = 'AVP';
    } else if (rawBlob.includes('xeno') || rawBlob.includes('weyland') || rawBlob.includes('nostromo') || rawBlob.includes('lv-426') || rawBlob.includes('uscm') || rawBlob.includes('engineer') || rawBlob.includes('seegson') || rawBlob.includes('alien')) {
      universe = 'ALIEN';
    } else {
      universe = 'PREDATOR';
    }
  }

  let theme = {
    primary: '#ff3d00',
    secondary: '#ffd700',
    dark: '#1c0603',
    terminalLabel: 'YAUTJA // CODEX CRYSTAL'
  };
  if (universe === 'ALIEN') {
    theme = {
      primary: '#00e676',
      secondary: '#00e5ff',
      dark: '#031911',
      terminalLabel: 'MU-TH-UR 6000 // DATASTREAM'
    };
  } else if (universe === 'AVP') {
    theme = {
      primary: '#ffab00',
      secondary: '#e040fb',
      dark: '#180821',
      terminalLabel: 'CONVERGENCE // ARCHIVE AVP'
    };
  }

  // Glyphe d'univers à gauche
  let universeGlyph = '';
  if (universe === 'ALIEN') {
    universeGlyph = `
      <g class="lore-universe-glyph" data-universe="ALIEN" transform="translate(28, 38)">
        <polygon points="-14,-8 -8,-8 -4,2 0,-6 4,2 8,-8 14,-8 6,8 2,8 0,2 -2,8 -6,8" fill="none" stroke="${theme.primary}" stroke-width="1.4" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="${theme.secondary}" stroke-width="0.8" stroke-dasharray="2,2" />
      </g>
    `;
  } else if (universe === 'AVP') {
    universeGlyph = `
      <g class="lore-universe-glyph" data-universe="AVP" transform="translate(28, 38)">
        <polygon points="0,-14 14,10 -14,10" fill="none" stroke="${theme.primary}" stroke-width="1.4" />
        <circle cx="0" cy="2" r="5" fill="none" stroke="${theme.secondary}" stroke-width="1.3" />
        <circle cx="0" cy="2" r="1.8" fill="${theme.primary}" />
      </g>
    `;
  } else {
    universeGlyph = `
      <g class="lore-universe-glyph" data-universe="PREDATOR" transform="translate(28, 38)">
        <circle cx="0" cy="-9" r="2.2" fill="${theme.primary}" />
        <circle cx="-8" cy="7" r="2.2" fill="${theme.primary}" />
        <circle cx="8" cy="7" r="2.2" fill="${theme.primary}" />
        <polygon points="0,-9 -8,7 8,7" fill="none" stroke="${theme.secondary}" stroke-width="1.1" stroke-dasharray="2,1.5" />
      </g>
    `;
  }

  // Motif de catégorie au centre du cristal holographique
  let categoryMotif = '';
  if (cat.includes('CLAN') || cat.includes('HONOR') || cat.includes('YAUTJA')) {
    categoryMotif = `<polygon points="82,25 89,38 82,51 75,38" fill="${theme.secondary}" opacity="0.85" />`;
  } else if (cat.includes('XENO') || cat.includes('BIOLOGY') || cat.includes('FAUNA')) {
    categoryMotif = `<path d="M74,40 C74,30 88,28 90,36 C92,42 82,46 76,44 Z" fill="none" stroke="${theme.secondary}" stroke-width="1.6" />`;
  } else if (cat.includes('LOCATION') || cat.includes('PLANET') || cat.includes('WORLD') || cat.includes('SECTOR')) {
    categoryMotif = `<circle cx="82" cy="38" r="8" fill="none" stroke="${theme.secondary}" stroke-width="1.4" /><ellipse cx="82" cy="38" rx="12" ry="4" fill="none" stroke="${theme.primary}" stroke-width="1" />`;
  } else if (cat.includes('TECH') || cat.includes('ARSENAL') || cat.includes('WEAPON')) {
    categoryMotif = `<rect x="76" y="32" width="12" height="12" rx="2" fill="none" stroke="${theme.secondary}" stroke-width="1.4" /><circle cx="82" cy="38" r="2.5" fill="${theme.primary}" />`;
  } else {
    categoryMotif = `<circle cx="82" cy="38" r="6" fill="none" stroke="${theme.secondary}" stroke-width="1.5" /><line x1="82" y1="28" x2="82" y2="48" stroke="${theme.primary}" stroke-width="1.2" />`;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="tactical-miniature lore-miniature-svg" viewBox="0 0 180 76" role="img" aria-label="Cristal d'archive ${e.title || 'Codex'}">
      <defs>
        <linearGradient id="bg-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.dark}" stop-opacity="0.96" />
          <stop offset="100%" stop-color="#02050a" stop-opacity="0.99" />
        </linearGradient>
        <pattern id="grid-${uid}" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${theme.primary}" stroke-width="0.35" opacity="0.2" />
        </pattern>
      </defs>

      <rect width="180" height="76" fill="url(#bg-${uid})" />
      <rect width="180" height="76" fill="url(#grid-${uid})" />

      <!-- Glyphe d'Univers -->
      ${universeGlyph}

      <!-- Cristal de Données Holographique & Motif de Catégorie -->
      <g class="holo-data-crystal">
        <polygon points="82,15 100,28 96,52 82,61 68,52 64,28" fill="#08121e" fill-opacity="0.8" stroke="${theme.primary}" stroke-width="1.5" />
        <line x1="82" y1="15" x2="82" y2="61" stroke="${theme.secondary}" stroke-width="0.8" opacity="0.65" />
        <line x1="64" y1="28" x2="100" y2="28" stroke="${theme.primary}" stroke-width="0.8" opacity="0.55" />
        <line x1="68" y1="52" x2="96" y2="52" stroke="${theme.primary}" stroke-width="0.8" opacity="0.55" />
        <g class="lore-category-motif" data-category="${cat}">
          ${categoryMotif}
        </g>
      </g>

      <!-- Télémétrie d'Onde (Waveform Telemetry) -->
      <g class="waveform-telemetry">
        <path d="M112,38 L118,38 L122,24 L126,50 L130,30 L134,45 L138,20 L142,52 L146,34 L150,42 L154,28 L158,38 L172,38" fill="none" stroke="${theme.secondary}" stroke-width="1.4" stroke-linejoin="round" />
        <line x1="112" y1="55" x2="172" y2="55" stroke="${theme.primary}" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.7" />
        <text x="142" y="21" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="800" fill="${theme.primary}" text-anchor="middle">${cat}</text>
      </g>

      <!-- Bandeaux Télémétrie Haut & Bas -->
      <rect x="0" y="0" width="180" height="11" fill="#000000" fill-opacity="0.7" />
      <line x1="0" y1="11" x2="180" y2="11" stroke="${theme.primary}" stroke-width="0.5" opacity="0.55" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="800" fill="${theme.primary}" letter-spacing="0.5">${theme.terminalLabel}</text>
      <text x="174" y="8" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="${theme.secondary}" text-anchor="end">${universe}</text>

      <rect x="0" y="65" width="180" height="11" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="65" x2="180" y2="65" stroke="${theme.primary}" stroke-width="0.5" opacity="0.55" />
      <text x="6" y="73" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="#cfd8dc">RANG REQUIS : ${e.unlockRank ?? 1}</text>
      <text x="174" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="800" fill="${theme.secondary}" text-anchor="end">${String(e.period || 'CANON ARCHIVE').slice(0, 18)}</text>
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle SVG 180x76 pour chaque armure / skin Yautja dans l'armurerie.
 * Illustre le buste détaillé du chasseur Yautja (biomasque, dreadlocks, épaulières, plasmacaster)
 * colorisé dynamiquement avec la palette réelle du skin (skin.palette?.armor, trim, visor, glow, skin)
 * et un cadre de rang (tier framing).
 * @param {Object} skin Objet skin Yautja
 * @returns {string} Markup SVG 180x76
 */
export function getSkinMiniatureSvg(skin = {}) {
  const s = typeof skin === 'object' && skin !== null ? skin : { id: String(skin || 'skin_default'), name: 'Armure Yautja' };
  const hexFromNum = typeof s.col === 'number' ? '#' + s.col.toString(16).padStart(6, '0') : null;
  const tier = String(s.tier || 'Blooded');

  const armorCol = s.palette?.armor || hexFromNum || '#8c969e';
  const trimCol = s.palette?.trim || (tier.toLowerCase().includes('elder') || tier.toLowerCase().includes('ancient') || tier.toLowerCase().includes('king') ? '#ffd700' : '#d4af37');
  const visorCol = s.palette?.visor || '#ff3d00';
  const glowCol = s.palette?.glow || '#00e5ff';
  const skinCol = s.palette?.skin || '#4a5d3f';
  const uid = 'skin-bust-' + Math.abs(hashCode(s.id || s.name || 'skin'));

  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="tactical-miniature skin-miniature-svg" viewBox="0 0 180 76" role="img" aria-label="Portrait d'armure ${s.name || 'Yautja'}">
      <defs>
        <linearGradient id="bg-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#140c08" stop-opacity="0.96" />
          <stop offset="100%" stop-color="#04070d" stop-opacity="0.99" />
        </linearGradient>
        <pattern id="grid-${uid}" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M 9 0 L 0 0 0 9" fill="none" stroke="${trimCol}" stroke-width="0.35" opacity="0.2" />
        </pattern>
      </defs>

      <rect width="180" height="76" fill="url(#bg-${uid})" />
      <rect width="180" height="76" fill="url(#grid-${uid})" />

      <!-- Cadre de Rang (Tier Framing) -->
      <g class="skin-tier-frame" data-tier="${tier}">
        <rect x="4" y="13" width="172" height="50" rx="3" fill="none" stroke="${trimCol}" stroke-width="1" opacity="0.55" />
        <path d="M4,21 L4,13 L12,13 M168,13 L176,13 L176,21 M4,55 L4,63 L12,63 M168,63 L176,63 L176,55" fill="none" stroke="${glowCol}" stroke-width="1.6" />
      </g>

      <!-- Buste Yautja Dynamique (Biomasque, Dreadlocks, Cuirasse & Épaulières) -->
      <g class="yautja-armor-bust">
        <!-- Dreadlocks & Anneaux Cérémoniels -->
        <path d="M72,20 C60,28 58,44 60,58 M68,25 C56,34 54,48 56,60 M108,20 C120,28 122,44 120,58 M112,25 C124,34 126,48 124,60" fill="none" stroke="#181412" stroke-width="4" stroke-linecap="round" />
        <path d="M72,20 C60,28 58,44 60,58 M108,20 C120,28 122,44 120,58" fill="none" stroke="${trimCol}" stroke-width="1.2" stroke-dasharray="2,5" />

        <!-- Cou & Peau Reptilienne Yautja -->
        <ellipse cx="90" cy="43" rx="14" ry="8" fill="${skinCol}" stroke="${trimCol}" stroke-width="0.9" />

        <!-- Épaulières Articulées & Plastron -->
        <polygon points="48,62 56,42 78,40 90,48 102,40 124,42 132,62" fill="${armorCol}" stroke="${trimCol}" stroke-width="1.5" stroke-linejoin="round" />
        <polygon points="74,44 90,56 106,44 102,62 78,62" fill="#151921" stroke="${trimCol}" stroke-width="1.1" />
        <line x1="54" y1="50" x2="72" y2="48" stroke="${trimCol}" stroke-width="1.3" />
        <line x1="126" y1="50" x2="108" y2="48" stroke="${trimCol}" stroke-width="1.3" />

        <!-- Plasmacaster d'Épaule Gauche -->
        <rect x="56" y="31" width="13" height="7" rx="1.5" fill="${armorCol}" stroke="${trimCol}" stroke-width="1.1" />
        <circle cx="56" cy="34.5" r="2.2" fill="${glowCol}" />

        <!-- Biomasque Sculpté -->
        <polygon points="90,14 106,20 103,37 90,45 77,37 74,20" fill="${armorCol}" stroke="${trimCol}" stroke-width="1.5" stroke-linejoin="round" />
        <line x1="90" y1="14" x2="90" y2="25" stroke="${trimCol}" stroke-width="1.3" />
        <!-- Lentilles de Visière Luminescentes -->
        <polygon points="78,26 87,28 86,31 77,29" fill="${visorCol}" />
        <polygon points="102,26 93,28 94,31 103,29" fill="${visorCol}" />
        <!-- Respirateurs Mandibulaires & Tri-Laser -->
        <path d="M83,35 L87,41 M97,35 L93,41 M86,39 L94,39" stroke="${trimCol}" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="100" cy="21" r="1.2" fill="${glowCol}" />
        <circle cx="103" cy="21" r="1.2" fill="${glowCol}" />
        <circle cx="101.5" cy="18.8" r="1.2" fill="${glowCol}" />
      </g>

      <!-- Échantillons de Palette (Swatches) à Gauche -->
      <g class="skin-palette-telemetry">
        <rect x="10" y="20" width="7" height="7" rx="1.5" fill="${armorCol}" stroke="#ffffff" stroke-width="0.5" />
        <rect x="10" y="30" width="7" height="7" rx="1.5" fill="${trimCol}" stroke="#ffffff" stroke-width="0.5" />
        <rect x="10" y="40" width="7" height="7" rx="1.5" fill="${visorCol}" stroke="#ffffff" stroke-width="0.5" />
        <rect x="10" y="50" width="7" height="7" rx="1.5" fill="${glowCol}" stroke="#ffffff" stroke-width="0.5" />
      </g>

      <!-- Bandeaux Télémétrie Haut & Bas -->
      <rect x="0" y="0" width="180" height="11" fill="#000000" fill-opacity="0.7" />
      <line x1="0" y1="11" x2="180" y2="11" stroke="${trimCol}" stroke-width="0.5" opacity="0.6" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.4" font-weight="800" fill="${trimCol}" letter-spacing="0.5">ARMURERIE // BIOMASQUE</text>
      <text x="174" y="8" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="${glowCol}" text-anchor="end">TIER : ${tier.toUpperCase()}</text>

      <rect x="0" y="65" width="180" height="11" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="65" x2="180" y2="65" stroke="${trimCol}" stroke-width="0.5" opacity="0.6" />
      <text x="6" y="73" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="#cfd8dc">${String(s.origin || 'Yautja Prime').slice(0, 26)}</text>
      <text x="174" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="800" fill="${visorCol}" text-anchor="end">${armorCol.toUpperCase()}</text>
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle SVG 180x76 pour chaque élément du Vault de Référence Partagée.
 * Illustre le domaine du catalogue (schéma technologique, blueprint véhicule,
 * profil de créature, événement de combat, profil de boss, ou bobine d'archive média)
 * avec un encadrement holographique Weyland/Yautja et télémétrie diégétique.
 * @param {Object} item Entrée du catalogue
 * @param {string} collection Type de collection ('technology', 'vehicles', 'enemies', 'levelEvents', 'huntBosses', 'support', 'media')
 * @returns {string} Markup SVG 180x76
 */
export function getVaultCardMiniatureSvg(item = {}, collection = '') {
  const it = typeof item === 'object' && item !== null ? item : { id: String(item || 'vault_entry') };
  const rawCol = String(collection || '').toLowerCase();
  const idStr = String(it.id || '').toLowerCase();
  const itemName = String(it.name || it.title || it.id || 'ÉLÉMENT CATALOGUE').slice(0, 24);
  const uid = 'vault-mini-' + Math.abs(hashCode(it.id || it.name || it.title || rawCol || 'entry'));

  // Déterminer le domaine thématique
  let domain = 'technology';
  if (rawCol.includes('veh') || idStr.startsWith('vehicle_')) {
    domain = 'vehicles';
  } else if (rawCol.includes('enemi') || rawCol.includes('enemy') || idStr.startsWith('enemy_')) {
    domain = 'enemies';
  } else if (rawCol.includes('event') || idStr.startsWith('event_')) {
    domain = 'events';
  } else if (rawCol.includes('boss') || idStr === 'goliath' || idStr.includes('boss')) {
    domain = 'bosses';
  } else if (rawCol.includes('supp') || idStr.startsWith('support_')) {
    domain = 'support';
  } else if (rawCol.includes('media') || idStr.startsWith('film_') || it.medium) {
    domain = 'media';
  }

  let theme = {
    primary: '#00e5ff',
    secondary: '#38bdf8',
    dark: '#031422',
    accent: '#fde047',
    label: 'SCHÉMA TECHNOLOGIQUE',
    code: String(it.id || 'TECH-001').toUpperCase().slice(0, 16),
  };

  let centralIllustration = '';

  switch (domain) {
    case 'vehicles':
      theme = {
        primary: '#38bdf8',
        secondary: '#7dd3fc',
        dark: '#041728',
        accent: '#f97316',
        label: 'BLUEPRINT VÉHICULE',
        code: String(it.id || 'VEH-001').toUpperCase().slice(0, 16),
      };
      centralIllustration = `
        <!-- Châssis aérodynamique et vecteurs de poussée -->
        <polygon points="90,16 122,34 130,48 112,46 90,42 68,46 50,48 58,34" fill="#08283f" stroke="${theme.primary}" stroke-width="1.5" stroke-linejoin="round" />
        <line x1="90" y1="16" x2="90" y2="42" stroke="${theme.secondary}" stroke-width="1.2" stroke-dasharray="3,2" />
        <line x1="42" y1="36" x2="138" y2="36" stroke="${theme.primary}" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.5" />
        <!-- Tuyères réacteurs -->
        <rect x="73" y="44" width="8" height="5" rx="1" fill="#1e293b" stroke="${theme.accent}" stroke-width="1.2" />
        <rect x="99" y="44" width="8" height="5" rx="1" fill="#1e293b" stroke="${theme.accent}" stroke-width="1.2" />
        <polygon points="74,49 77,57 80,49" fill="${theme.accent}" opacity="0.85" />
        <polygon points="100,49 103,57 106,49" fill="${theme.accent}" opacity="0.85" />
        <!-- Balises de cockpit & dérive -->
        <circle cx="90" cy="24" r="2.5" fill="#fde047" />
        <circle cx="66" cy="36" r="1.8" fill="${theme.secondary}" />
        <circle cx="114" cy="36" r="1.8" fill="${theme.secondary}" />
      `;
      break;

    case 'enemies':
      theme = {
        primary: '#4ade80',
        secondary: '#88ff00',
        dark: '#051f0d',
        accent: '#ff1744',
        label: 'PROFIL BIOLOGIQUE',
        code: String(it.id || 'BIO-001').toUpperCase().slice(0, 16),
      };
      centralIllustration = `
        <!-- Réticule radar et silhouette bio-organique -->
        <circle cx="90" cy="38" r="20" fill="#082b13" stroke="${theme.primary}" stroke-width="1.2" stroke-dasharray="4,2" />
        <path d="M80,26 C84,22 96,22 100,26 C105,32 103,42 97,46 C94,49 92,51 90,52 C88,51 86,49 83,46 C77,42 75,32 80,26 Z" fill="#11401d" stroke="${theme.secondary}" stroke-width="1.5" />
        <!-- Onde vitale EKG latérale -->
        <path d="M38,48 L52,48 L56,41 L60,55 L64,43 L68,48 L76,48" stroke="${theme.primary}" stroke-width="1.3" fill="none" stroke-linejoin="round" />
        <path d="M104,48 L112,48 L116,41 L120,55 L124,43 L128,48 L142,48" stroke="${theme.primary}" stroke-width="1.3" fill="none" stroke-linejoin="round" />
        <!-- Marqueur thermique vital -->
        <circle cx="90" cy="36" r="4.2" fill="${theme.accent}" opacity="0.85" />
        <line x1="90" y1="28" x2="90" y2="44" stroke="${theme.accent}" stroke-width="1" />
        <line x1="82" y1="36" x2="98" y2="36" stroke="${theme.accent}" stroke-width="1" />
      `;
      break;

    case 'events':
      theme = {
        primary: '#f59e0b',
        secondary: '#fbbf24',
        dark: '#1e1104',
        accent: '#ef4444',
        label: 'ÉVÉNEMENT COMBAT',
        code: String(it.id || 'EVENT-001').toUpperCase().slice(0, 16),
      };
      centralIllustration = `
        <!-- Radar de zone et triangle de signal d'alerte -->
        <circle cx="90" cy="38" r="22" fill="#291605" stroke="${theme.primary}" stroke-width="1.2" stroke-dasharray="3,3" />
        <polygon points="90,19 108,49 72,49" fill="#451a03" stroke="${theme.accent}" stroke-width="1.8" stroke-linejoin="round" />
        <line x1="90" y1="28" x2="90" y2="39" stroke="${theme.secondary}" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="90" cy="44" r="1.6" fill="${theme.secondary}" />
        <!-- Vecteurs de déploiement tactique -->
        <path d="M46,28 L64,35 M46,38 L68,38 M46,48 L64,41" stroke="${theme.primary}" stroke-width="1.5" stroke-linecap="round" />
        <path d="M134,28 L116,35 M134,38 L112,38 M134,48 L116,41" stroke="${theme.accent}" stroke-width="1.5" stroke-linecap="round" />
      `;
      break;

    case 'bosses':
      theme = {
        primary: '#ef4444',
        secondary: '#ff5252',
        dark: '#240606',
        accent: '#ffd700',
        label: 'PROFIL APEX BOSS',
        code: String(it.id || 'BOSS-001').toUpperCase().slice(0, 16),
      };
      centralIllustration = `
        <!-- Verrouillage cible et couronne Apex Boss -->
        <circle cx="90" cy="38" r="23" fill="#330808" stroke="${theme.primary}" stroke-width="1.5" />
        <polygon points="90,17 104,27 108,44 90,55 72,44 76,27" fill="#4f0a0a" stroke="${theme.accent}" stroke-width="1.6" stroke-linejoin="round" />
        <!-- Cornes et couronne -->
        <path d="M76,27 L69,18 M104,27 L111,18 M83,21 L81,14 M97,21 L99,14" stroke="${theme.accent}" stroke-width="1.8" stroke-linecap="round" />
        <!-- Cornières de visée laser -->
        <path d="M58,24 L52,24 L52,30 M122,24 L128,24 L128,30 M58,52 L52,52 L52,46 M122,52 L128,52 L128,46" stroke="${theme.primary}" stroke-width="1.8" fill="none" />
        <text x="90" y="41" font-family="'Orbitron', sans-serif" font-size="7" font-weight="900" fill="${theme.secondary}" text-anchor="middle">APEX</text>
      `;
      break;

    case 'support':
      theme = {
        primary: '#10b981',
        secondary: '#34d399',
        dark: '#032015',
        accent: '#fbbf24',
        label: 'LOGISTIQUE SUPPORT',
        code: String(it.id || 'SUPP-001').toUpperCase().slice(0, 16),
      };
      centralIllustration = `
        <!-- Conteneur orbital et croix logistique -->
        <rect x="75" y="21" width="30" height="34" rx="4" fill="#063523" stroke="${theme.primary}" stroke-width="1.6" />
        <polygon points="75,25 90,16 105,25" fill="#0f5139" stroke="${theme.secondary}" stroke-width="1.4" stroke-linejoin="round" />
        <path d="M90,29 L90,45 M82,37 L98,37" stroke="${theme.accent}" stroke-width="3.2" stroke-linecap="round" />
        <!-- Lignes de fixation latérales -->
        <line x1="65" y1="31" x2="75" y2="31" stroke="${theme.secondary}" stroke-width="2" stroke-linecap="round" />
        <line x1="65" y1="43" x2="75" y2="43" stroke="${theme.secondary}" stroke-width="2" stroke-linecap="round" />
        <line x1="105" y1="31" x2="115" y2="31" stroke="${theme.secondary}" stroke-width="2" stroke-linecap="round" />
        <line x1="105" y1="43" x2="115" y2="43" stroke="${theme.secondary}" stroke-width="2" stroke-linecap="round" />
      `;
      break;

    case 'media':
      theme = {
        primary: '#d4af37',
        secondary: '#fde047',
        dark: '#161305',
        accent: '#38bdf8',
        label: 'ARCHIVE MÉDIA',
        code: String(it.id || 'MEDIA-001').toUpperCase().slice(0, 16),
      };
      centralIllustration = `
        <!-- Pellicule cinéma 35mm et perforations -->
        <rect x="42" y="23" width="96" height="30" rx="2" fill="#181507" stroke="${theme.primary}" stroke-width="1.6" />
        <!-- Perforations supérieures -->
        <rect x="46" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="56" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="66" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="76" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="86" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="96" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="106" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="116" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="126" y="25" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <!-- Perforations inférieures -->
        <rect x="46" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="56" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="66" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="76" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="86" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="96" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="106" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="116" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <rect x="126" y="47" width="5" height="4" rx="0.6" fill="${theme.secondary}" />
        <!-- Fenêtre centrale et bobine -->
        <rect x="68" y="31" width="44" height="14" fill="#0b0a03" stroke="${theme.secondary}" stroke-width="1" />
        <circle cx="90" cy="38" r="4.5" fill="none" stroke="${theme.primary}" stroke-width="1.3" />
        <circle cx="90" cy="38" r="1.5" fill="${theme.secondary}" />
      `;
      break;

    default: // 'technology'
      centralIllustration = `
        <!-- Schéma électronique et nœuds de bus holographiques -->
        <circle cx="90" cy="38" r="15" fill="#06273f" stroke="${theme.primary}" stroke-width="1.5" />
        <circle cx="90" cy="38" r="7.5" fill="none" stroke="${theme.accent}" stroke-width="1.2" stroke-dasharray="3,2" />
        <circle cx="90" cy="38" r="2.8" fill="${theme.primary}" />
        <path d="M52,38 L75,38 M105,38 L128,38 M90,23 L90,13 M90,53 L90,63" stroke="${theme.secondary}" stroke-width="1.4" stroke-linecap="round" />
        <path d="M60,26 L73,38 L60,50 M120,26 L107,38 L120,50" stroke="${theme.primary}" stroke-width="1" fill="none" stroke-linejoin="round" />
        <circle cx="52" cy="38" r="2" fill="${theme.accent}" />
        <circle cx="128" cy="38" r="2" fill="${theme.accent}" />
      `;
      break;
  }

  const statusLabel = String(it.runtimeStatus || it.status || (it.year ? String(it.year) : 'ARCHIVE')).toUpperCase();

  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="tactical-miniature vault-miniature-svg" viewBox="0 0 180 76" role="img" aria-label="Schéma de référence ${itemName}">
      <defs>
        <linearGradient id="vault-bg-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.dark}" stop-opacity="0.96" />
          <stop offset="100%" stop-color="#02070e" stop-opacity="0.99" />
        </linearGradient>
        <pattern id="vault-grid-${uid}" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${theme.primary}" stroke-width="0.3" opacity="0.2" />
        </pattern>
      </defs>

      <rect width="180" height="76" fill="url(#vault-bg-${uid})" />
      <rect width="180" height="76" fill="url(#vault-grid-${uid})" />

      <!-- Encadrement Holographique Weyland / Yautja -->
      <g class="vault-holo-frame">
        <rect x="4" y="11" width="172" height="54" rx="2" fill="none" stroke="${theme.primary}" stroke-width="0.6" opacity="0.35" />
        <path d="M4,19 L4,11 L12,11 M168,11 L176,11 L176,19 M4,57 L4,65 L12,65 M168,65 L176,65 L176,57" fill="none" stroke="${theme.secondary}" stroke-width="1.6" />
      </g>

      <!-- Illustration Centrale du Domaine -->
      <g class="vault-domain-illustration" data-domain="${domain}">
        ${centralIllustration}
      </g>

      <!-- Bandeaux Télémétrie Haut & Bas -->
      <rect x="0" y="0" width="180" height="11" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="11" x2="180" y2="11" stroke="${theme.primary}" stroke-width="0.5" opacity="0.6" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="800" fill="${theme.primary}" letter-spacing="0.5">${theme.label}</text>
      <text x="174" y="8" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="${theme.secondary}" text-anchor="end">${theme.code}</text>

      <rect x="0" y="65" width="180" height="11" fill="#000000" fill-opacity="0.75" />
      <line x1="0" y1="65" x2="180" y2="65" stroke="${theme.primary}" stroke-width="0.5" opacity="0.6" />
      <text x="6" y="73" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="#cfd8dc">${itemName}</text>
      <text x="174" y="73" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="800" fill="${theme.primary}" text-anchor="end">${statusLabel}</text>
    </svg>
  `.trim();
}

/**
 * Miniature vectorielle SVG 180x76 pour chaque carte d'artisanat / recette de trophée.
 * Illustre l'équipement rituel Yautja forgé (bouclier, arme tranchante/hast, masque/biomasque,
 * cuirasse de carapace, étendard de clan ou totem des ancêtres) avec des braises de forge
 * incandescentes, des runes d'honneur géométriques et la télémétrie de blueprint rituel.
 * @param {Object} recipe Recette de forge rituelle
 * @returns {string} Markup SVG 180x76
 */
export function getCraftCardMiniatureSvg(recipe = {}) {
  const r = typeof recipe === 'object' && recipe !== null ? recipe : { id: String(recipe || 'craft_recipe') };
  const idStr = String(r.id || '').toLowerCase();
  const cat = String(r.category || '').toUpperCase();
  const name = String(r.name || r.id || 'ÉQUIPEMENT RITUEL').slice(0, 26);
  const honorCost = Number(r.requiredHonor || 0);
  const material = String(r.requiredTrophies?.[0] || r.requiredTrophy || 'Trophée de Chasse').slice(0, 24);
  const uid = 'craft-mini-' + Math.abs(hashCode(r.id || r.name || cat || 'forge'));

  // Déterminer le type d'équipement rituel
  let itemType = 'weapon';
  if (cat === 'SHIELDS' || idStr.includes('shield') || idStr.includes('egide')) {
    itemType = 'shield';
  } else if (cat === 'MASKS' || idStr.includes('mask') || idStr.includes('biomask') || idStr.includes('jaw')) {
    itemType = 'mask';
  } else if (cat === 'ARMOR' || idStr.includes('armor') || idStr.includes('cuirass') || idStr.includes('carapace')) {
    itemType = 'armor';
  } else if (cat === 'BANNERS' || idStr.includes('banner') || idStr.includes('totem') || idStr.includes('crest')) {
    itemType = 'banner';
  } else if (cat === 'WEAPONS' || idStr.includes('weapon') || idStr.includes('blade') || idStr.includes('spear') || idStr.includes('glaive') || idStr.includes('whip')) {
    itemType = 'weapon';
  }

  // Palettes et accents selon la catégorie
  let typeLabel = 'ARME RITUELLE';
  let primaryCol = '#ff5722';
  let secondaryCol = '#ffab00';
  let emberCol = '#ff3d00';
  let runeCol = '#ffd54f';
  let centralArt = '';

  switch (itemType) {
    case 'shield':
      typeLabel = 'BOUCLIER // ÉGIDE';
      primaryCol = '#4caf50';
      secondaryCol = '#81c784';
      emberCol = '#ff6d00';
      runeCol = '#aed581';
      centralArt = `
        <!-- Bouclier / Égide de chitine & alliage -->
        <polygon points="90,17 114,27 118,47 90,61 62,47 66,27" fill="#142416" stroke="${primaryCol}" stroke-width="1.8" stroke-linejoin="round" />
        <polygon points="90,23 106,31 108,45 90,54 72,45 74,31" fill="#1e3820" stroke="${secondaryCol}" stroke-width="1.2" />
        <!-- Umbo central renforcé & fentes de déflexion acide -->
        <circle cx="90" cy="38" r="7" fill="#0d1b0f" stroke="${runeCol}" stroke-width="1.4" />
        <line x1="84" y1="38" x2="96" y2="38" stroke="${runeCol}" stroke-width="1.6" />
        <line x1="90" y1="32" x2="90" y2="44" stroke="${runeCol}" stroke-width="1.6" />
        <!-- Griffes / pointes de parade latérales -->
        <path d="M62,35 L54,31 L64,42" fill="${secondaryCol}" opacity="0.85" />
        <path d="M118,35 L126,31 L116,42" fill="${secondaryCol}" opacity="0.85" />
      `;
      break;

    case 'mask':
      typeLabel = 'BIOMASQUE // RELIQUE';
      primaryCol = '#00e5ff';
      secondaryCol = '#38bdf8';
      emberCol = '#ff3d00';
      runeCol = '#f59e0b';
      centralArt = `
        <!-- Biomasque sculpté en crâne de trophée -->
        <polygon points="90,18 108,24 104,44 90,56 76,44 72,24" fill="#0c1f2b" stroke="${primaryCol}" stroke-width="1.8" stroke-linejoin="round" />
        <!-- Visières thermiques holographiques -->
        <polygon points="78,30 87,32 86,36 77,34" fill="#ff1744" />
        <polygon points="102,30 93,32 94,36 103,34" fill="#ff1744" />
        <!-- Tri-laser de ciblage intégré -->
        <circle cx="101" cy="22" r="1.3" fill="#ff1744" />
        <circle cx="104" cy="22" r="1.3" fill="#ff1744" />
        <circle cx="102.5" cy="19.5" r="1.3" fill="#ff1744" />
        <!-- Dents mandibulaires & conduits respiratoires -->
        <path d="M83,43 L87,50 M97,43 L93,50" stroke="${secondaryCol}" stroke-width="1.4" stroke-linecap="round" />
        <line x1="85" y1="46" x2="95" y2="46" stroke="${runeCol}" stroke-width="1.2" />
        <!-- Anneaux dreadlocks latéraux -->
        <circle cx="68" cy="28" r="2.5" fill="#1e293b" stroke="${runeCol}" stroke-width="1" />
        <circle cx="112" cy="28" r="2.5" fill="#1e293b" stroke="${runeCol}" stroke-width="1" />
      `;
      break;

    case 'armor':
      typeLabel = 'CUIRASSE // CARAPACE';
      primaryCol = '#0284c7';
      secondaryCol = '#38bdf8';
      emberCol = '#f97316';
      runeCol = '#fbbf24';
      centralArt = `
        <!-- Cuirasse articulée en plaques de chitine -->
        <polygon points="68,20 90,25 112,20 120,40 106,60 90,63 74,60 60,40" fill="#0d1f2d" stroke="${primaryCol}" stroke-width="1.8" stroke-linejoin="round" />
        <!-- Segments pectoraux & rainures d'évacuation acide -->
        <path d="M72,30 L90,36 L108,30" fill="none" stroke="${secondaryCol}" stroke-width="1.5" />
        <path d="M74,40 L90,46 L106,40" fill="none" stroke="${secondaryCol}" stroke-width="1.5" />
        <path d="M78,50 L90,54 L102,50" fill="none" stroke="${secondaryCol}" stroke-width="1.5" />
        <!-- Noyau central d'ancrage d'honneur -->
        <polygon points="90,33 95,40 90,47 85,40" fill="#0284c7" stroke="${runeCol}" stroke-width="1.2" />
        <!-- Épaulettes renforcées -->
        <polygon points="62,22 54,32 64,36" fill="#1e293b" stroke="${primaryCol}" stroke-width="1" />
        <polygon points="118,22 126,32 116,36" fill="#1e293b" stroke="${primaryCol}" stroke-width="1" />
      `;
      break;

    case 'banner':
      typeLabel = 'ÉTENDARD // TOTEM CLAN';
      primaryCol = '#eab308';
      secondaryCol = '#fde047';
      emberCol = '#ef4444';
      runeCol = '#f97316';
      centralArt = `
        <!-- Mât de lance cérémoniel et traverse en os -->
        <line x1="90" y1="14" x2="90" y2="64" stroke="#e2e8f0" stroke-width="2.5" stroke-linecap="round" />
        <polygon points="90,12 94,22 86,22" fill="#ef4444" stroke="${runeCol}" stroke-width="1" />
        <line x1="66" y1="24" x2="114" y2="24" stroke="${secondaryCol}" stroke-width="2" stroke-linecap="round" />
        <!-- Voile de trophées / peaux d'honneur suspendues -->
        <polygon points="70,26 110,26 104,56 90,52 76,56" fill="#291606" stroke="${primaryCol}" stroke-width="1.6" />
        <!-- Crâne trophée monté sur le mât -->
        <circle cx="90" cy="34" r="5" fill="#f8fafc" stroke="#475569" stroke-width="1" />
        <circle cx="88.5" cy="33.5" r="1" fill="#0f172a" /><circle cx="91.5" cy="33.5" r="1" fill="#0f172a" />
        <!-- Runes d'honneur gravées sur l'étoffe -->
        <path d="M84,43 L96,43 M86,47 L94,47 M90,40 L90,50" stroke="${secondaryCol}" stroke-width="1.3" stroke-linecap="round" />
      `;
      break;

    case 'weapon':
    default:
      typeLabel = 'ARME // COMBISTICK & LAME';
      primaryCol = '#f97316';
      secondaryCol = '#fbbf24';
      emberCol = '#dc2626';
      runeCol = '#fde047';
      centralArt = `
        <!-- Fût de Combistick / manche de glaive en alliage Yautja -->
        <line x1="62" y1="56" x2="118" y2="20" stroke="#71717a" stroke-width="3" stroke-linecap="round" />
        <line x1="64" y1="54" x2="80" y2="44" stroke="${secondaryCol}" stroke-width="3.5" stroke-linecap="round" />
        <!-- Lame dentelée en queue / griffe de xénomorphe trempée -->
        <polygon points="114,23 134,14 125,27 138,20 120,33" fill="#e4e4e7" stroke="${primaryCol}" stroke-width="1.5" stroke-linejoin="round" />
        <!-- Pointe arrière et contrepoids de combat -->
        <polygon points="64,55 52,63 59,51" fill="#e4e4e7" stroke="${primaryCol}" stroke-width="1.2" />
        <!-- Anneaux d'émission énergétique & glyphes de forge -->
        <circle cx="90" cy="38" r="3.5" fill="#ef4444" stroke="${secondaryCol}" stroke-width="1.2" />
        <line x1="86" y1="35" x2="94" y2="41" stroke="${runeCol}" stroke-width="1.4" />
      `;
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="tactical-miniature craft-miniature-svg" viewBox="0 0 180 76" role="img" aria-label="Miniature rituelle de forge ${name}">
      <defs>
        <linearGradient id="craft-bg-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#180a06" stop-opacity="0.97" />
          <stop offset="50%" stop-color="#0f0604" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#050202" stop-opacity="0.99" />
        </linearGradient>
        <pattern id="craft-grid-${uid}" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="${primaryCol}" stroke-width="0.3" opacity="0.18" />
        </pattern>
        <radialGradient id="forge-glow-${uid}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${emberCol}" stop-opacity="0.35" />
          <stop offset="60%" stop-color="#ea580c" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <filter id="ember-filter-${uid}" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Fond foyer de forge Yautja & grille technique -->
      <rect width="180" height="76" fill="url(#craft-bg-${uid})" />
      <rect width="180" height="76" fill="url(#craft-grid-${uid})" />
      <ellipse cx="90" cy="38" rx="55" ry="24" fill="url(#forge-glow-${uid})" />

      <!-- Encadrement d'établi & repères de calibrage rituel -->
      <g class="craft-blueprint-frame">
        <rect x="4" y="11" width="172" height="54" rx="2" fill="none" stroke="${primaryCol}" stroke-width="0.7" opacity="0.4" />
        <path d="M4,19 L4,11 L12,11 M168,11 L176,11 L176,19 M4,57 L4,65 L12,65 M168,65 L176,65 L176,57" fill="none" stroke="${secondaryCol}" stroke-width="1.6" />
        <!-- Réticule d'alignement d'alliage -->
        <line x1="90" y1="12" x2="90" y2="16" stroke="${primaryCol}" stroke-width="0.8" opacity="0.6" />
        <line x1="90" y1="60" x2="90" y2="64" stroke="${primaryCol}" stroke-width="0.8" opacity="0.6" />
        <line x1="6" y1="38" x2="10" y2="38" stroke="${primaryCol}" stroke-width="0.8" opacity="0.6" />
        <line x1="170" y1="38" x2="174" y2="38" stroke="${primaryCol}" stroke-width="0.8" opacity="0.6" />
      </g>

      <!-- Braises incandescentes de la forge Yautja -->
      <g class="forge-fire-embers" filter="url(#ember-filter-${uid})">
        <circle cx="34" cy="24" r="1.6" fill="#fde047" />
        <circle cx="48" cy="52" r="1.3" fill="${emberCol}" />
        <circle cx="132" cy="22" r="1.8" fill="#fbbf24" />
        <circle cx="146" cy="46" r="1.4" fill="${emberCol}" />
        <circle cx="114" cy="56" r="1.2" fill="#fde047" />
        <circle cx="68" cy="18" r="1" fill="#f97316" />
      </g>

      <!-- Runes d'Honneur Yautja latérales gravées au plasma -->
      <g class="honor-runes" stroke="${runeCol}" stroke-width="1.4" stroke-linecap="round" opacity="0.85">
        <path d="M16,24 L22,24 M16,30 L25,30 M18,36 L23,36 M16,42 L21,42 M19,48 L25,48 M17,54 L22,54" />
        <path d="M164,24 L158,24 M164,30 L155,30 M162,36 L157,36 M164,42 L159,42 M161,48 L155,48 M163,54 L158,54" />
      </g>

      <!-- Illustration Centrale de l'Équipement Rituel -->
      <g class="craft-item-illustration" data-craft-type="${itemType}">
        ${centralArt}
      </g>

      <!-- Bandeaux Télémétrie Haut & Bas -->
      <rect x="0" y="0" width="180" height="11" fill="#000000" fill-opacity="0.8" />
      <line x1="0" y1="11" x2="180" y2="11" stroke="${primaryCol}" stroke-width="0.6" opacity="0.7" />
      <text x="6" y="8" font-family="'Orbitron', sans-serif" font-size="4.3" font-weight="800" fill="${primaryCol}" letter-spacing="0.5">FORGE RITUELLE // ${typeLabel}</text>
      <text x="174" y="8" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="${secondaryCol}" text-anchor="end">${honorCost > 0 ? `${honorCost} HONNEUR` : 'RELIC BLUEPRINT'}</text>

      <rect x="0" y="65" width="180" height="11" fill="#000000" fill-opacity="0.8" />
      <line x1="0" y1="65" x2="180" y2="65" stroke="${primaryCol}" stroke-width="0.6" opacity="0.7" />
      <text x="6" y="73" font-family="'Rajdhani', sans-serif" font-size="4.8" font-weight="700" fill="#f5f5f5">${material}</text>
      <text x="174" y="73" font-family="'Orbitron', sans-serif" font-size="4.2" font-weight="800" fill="${primaryCol}" text-anchor="end">CLAN CRAFT</text>
    </svg>
  `.trim();
}
