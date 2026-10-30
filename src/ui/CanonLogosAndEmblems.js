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
  return getYautjaClanLogo(size);
}
