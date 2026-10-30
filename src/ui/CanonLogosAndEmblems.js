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
      // Mystical Symbiotic Bio-Gauntlet Sigil (Overkill: Witchblade/Aliens/Predator)
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" class="crossover-logo logo-witchblade" role="img" aria-label="Sigil de la Witchblade">
          <circle cx="40" cy="40" r="36" fill="#120c1f" stroke="#8e24aa" stroke-width="2" />
          <path d="M40 8 Q56 28 48 48 Q56 64 40 72 Q24 64 32 48 Q24 28 40 8 Z" fill="#ab47bc" stroke="#e1bee7" stroke-width="1.5" />
          <circle cx="40" cy="40" r="7" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5" />
        </svg>
      `.trim();

    default:
      return getYautjaClanLogo(size);
  }
}
