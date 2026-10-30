/**
 * CanonLogosAndEmblems.js - Moteur de rendu SVG 1:1 des Logos et Emblèmes Officiels.
 * Reproduit avec une fidélité vectorielle millimétrique les insignes canoniques
 * des factions Yautja, Weyland-Yutani, USCM, Ingénieurs et Crossovers du Multivers.
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
  const normalizedId = String(crossoverId || '').replace(/^crossover_/, '');
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
 * Génère un emblème vectoriel canonique 1:1 adapté pour chacune des 12 chasses.
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
      return getStargazerLogo(size);

    case 'city_hunter':
      return getOWLFLogo(size);

    case 'grid_alien':
      return getEngineerLogo(size);

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

export function renderFactionEmblem(factionName, size = 48) {
  if (!factionName) return getYautjaClanLogo(size);
  const name = String(factionName).toLowerCase();
  if (name.includes('engineer') || name.includes('ingénieur') || name.includes('architecte')) {
    return getEngineerLogo(size);
  }
  if (name.includes('xeno') || name.includes('ruche')) {
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
