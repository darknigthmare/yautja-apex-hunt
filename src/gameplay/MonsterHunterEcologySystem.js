/**
 * MonsterHunterEcologySystem.js - Architecture de Chasse Inspirée de Monster Hunter
 * Développée pour Yautja: Apex Hunt selon le concept d'origine du projet :
 * 1. Pistes & Empreintes Thermiques (Tracking / Niveau de Traque 1-3)
 * 2. États Biologiques : Endurance, Épuisement, Frénésie (Rage), Chute Lourde (Topple)
 * 3. Destruction de Parties & Section de Queue Physique (Part Breaks & Severed Tail Drop)
 * 4. Dépeçage Rituel Yautja & Prélèvement de Trophée (Carving System)
 * 5. Pièges Environnementaux : Éboulements de rochers, mares de boue thermique, piliers destructibles
 */

import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';

export const CLUE_TYPES = Object.freeze({
  GIANT_FOOTPRINT: 'GIANT_FOOTPRINT',
  CLAW_SCRATCH: 'CLAW_SCRATCH',
  ACID_MUCUS: 'ACID_MUCUS',
  PREY_CARCASS: 'PREY_CARCASS',
  DORSAL_SCALE: 'DORSAL_SCALE'
});

export const MONSTER_STAGES = Object.freeze({
  STALKING: 'STALKING',
  FEEDING: 'FEEDING',
  ENGAGED: 'ENGAGED',
  EXHAUSTED: 'EXHAUSTED',
  ENRAGED: 'ENRAGED',
  TOPPLED: 'TOPPLED',
  LIMPING_TO_LAIR: 'LIMPING_TO_LAIR',
  SLEEPING_IN_LAIR: 'SLEEPING_IN_LAIR',
  DEFEATED: 'DEFEATED'
});

export class MonsterHunterEcologySystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.biomeId = options.biomeId || 'jungle';

    // Niveau de recherche / traque (0 à 3)
    this.scoutLevel = 0;
    this.scoutPoints = 0;
    this.scoutPointsPerLevel = 100;
    this.maxScoutLevel = 3;

    // Registre des indices et pistes sur le terrain
    this.clues = [];
    this.discoveredClueIds = new Set();

    // Registre des pièges environnementaux
    this.environmentalTraps = [];

    // État du monstre traqué
    this.monsterState = {
      stage: MONSTER_STAGES.STALKING,
      stamina: 1000,
      maxStamina: 1000,
      isExhausted: false,
      isEnraged: false,
      isToppled: false,
      toppleDuration: 0,
      limpingHealthThreshold: 0.25,
      brokenParts: {
        head: false,
        tail: false,
        carapace: false,
        wings: false
      },
      carved: false,
      harvestedMaterials: []
    };

    // Fil conducteur thermique / Bio-Visor Trail
    this.guidanceTrailActive = false;
    this.targetMonster = null;
  }

  /**
   * Initialise les pistes de traque dans le biome selon les secteurs de la carte.
   */
  generateBiomeClues(sectors = []) {
    this.clues = [];
    const clueTemplates = [
      { type: CLUE_TYPES.GIANT_FOOTPRINT, label: 'Empreinte Thermique Gigantesque', points: 40 },
      { type: CLUE_TYPES.CLAW_SCRATCH, label: 'Marques de Griffes Colossales sur Basalte', points: 35 },
      { type: CLUE_TYPES.ACID_MUCUS, label: 'Sécrétion Acide Corrosive Récente', points: 45 },
      { type: CLUE_TYPES.PREY_CARCASS, label: 'Carcasse de Proie Dévorée par l’Apex', points: 50 },
      { type: CLUE_TYPES.DORSAL_SCALE, label: 'Écaille Dorsale Blindée Abandonnée', points: 30 }
    ];

    sectors.forEach((sec, idx) => {
      const template = clueTemplates[idx % clueTemplates.length];
      const posX = sec.center?.[0] ?? (idx * 45 - 90);
      const posZ = sec.center?.[2] ?? (idx * 50 - 100);
      const elevation = sec.center?.[1] ?? 0;

      const clue = {
        id: `clue-${sec.id || idx}-${template.type}`,
        sectorId: sec.id,
        type: template.type,
        label: template.label,
        points: template.points,
        position: new THREE.Vector3(posX, elevation + 0.2, posZ),
        analyzed: false
      };

      this.clues.push(clue);
    });

    return this.clues;
  }

  /**
   * Analyse une piste lorsque le joueur s'en approche ou l'active avec le bio-masque.
   */
  analyzeClue(clueId) {
    const clue = this.clues.find((c) => c.id === clueId);
    if (!clue || clue.analyzed) return null;

    clue.analyzed = true;
    this.discoveredClueIds.add(clue.id);
    this.scoutPoints += clue.points;

    // Calcul du niveau de traque
    const previousLevel = this.scoutLevel;
    this.scoutLevel = Math.min(this.maxScoutLevel, Math.floor(this.scoutPoints / this.scoutPointsPerLevel));

    if (this.scoutLevel >= 2) {
      this.guidanceTrailActive = true;
    }

    return {
      clueId: clue.id,
      label: clue.label,
      pointsAwarded: clue.points,
      totalScoutPoints: this.scoutPoints,
      scoutLevel: this.scoutLevel,
      levelUp: this.scoutLevel > previousLevel,
      guidanceActive: this.guidanceTrailActive
    };
  }

  /**
   * Lie le monstre actif à l'écologie.
   */
  bindTargetMonster(bossInstance) {
    this.targetMonster = bossInstance;
    return Boolean(this.targetMonster);
  }

  /**
   * Met à jour la fatigue et la biologie du monstre.
   */
  updateMonsterEcology(delta, monsterHP, maxMonsterHP) {
    if (!this.targetMonster) return this.monsterState;

    const hpRatio = monsterHP / Math.max(1, maxMonsterHP);

    // 1. Gestion de la fatigue / épuisement
    if (!this.monsterState.isEnraged && !this.monsterState.isToppled) {
      this.monsterState.stamina = Math.max(0, this.monsterState.stamina - delta * 15);
      if (this.monsterState.stamina <= 0) {
        this.monsterState.isExhausted = true;
        this.monsterState.stage = MONSTER_STAGES.EXHAUSTED;
      }
    }

    // 2. Gestion de la rage (Enrage)
    if (this.targetMonster.isEnraged && !this.monsterState.isEnraged) {
      this.monsterState.isEnraged = true;
      this.monsterState.isExhausted = false;
      this.monsterState.stamina = this.monsterState.maxStamina; // Restaure l'endurance en rage
      this.monsterState.stage = MONSTER_STAGES.ENRAGED;
      audioSynth.playMonsterRoar();
    }

    // 3. Gestion de la chute (Topple)
    if (this.monsterState.isToppled) {
      this.monsterState.toppleDuration -= delta;
      if (this.monsterState.toppleDuration <= 0) {
        this.monsterState.isToppled = false;
        this.monsterState.stage = this.monsterState.isEnraged ? MONSTER_STAGES.ENRAGED : MONSTER_STAGES.ENGAGED;
      }
    }

    // 4. Fuite en boîte / Retraite au nid (Limping)
    if (hpRatio <= this.monsterState.limpingHealthThreshold && hpRatio > 0 && !this.monsterState.isToppled) {
      this.monsterState.stage = MONSTER_STAGES.LIMPING_TO_LAIR;
    }

    // 5. Mort
    if (monsterHP <= 0 || this.targetMonster.isDead) {
      this.monsterState.stage = MONSTER_STAGES.DEFEATED;
    }

    return this.monsterState;
  }

  /**
   * Déclenche un Topple (chute lourde du monstre) suite à un stagger de membres ou un piège.
   */
  inflictMonsterTopple(durationSeconds = 7.5) {
    this.monsterState.isToppled = true;
    this.monsterState.toppleDuration = durationSeconds;
    this.monsterState.stage = MONSTER_STAGES.TOPPLED;

    if (typeof this.targetMonster?.triggerTopple === 'function') {
      this.targetMonster.triggerTopple(durationSeconds);
    }
    audioSynth.playMonsterRoar();

    return {
      status: 'MONSTER_TOPPLED',
      durationSeconds,
      vulnerableToCarvingAndCrit: true
    };
  }

  /**
   * Enregistre le bris d'une partie anatomique (Part Break).
   */
  recordPartBreak(partName = 'horn') {
    if (this.monsterState.brokenParts[partName] !== undefined) {
      this.monsterState.brokenParts[partName] = true;
    }

    // Dégâts de fatigue et stagger sur bris de partie
    this.monsterState.stamina = Math.max(0, this.monsterState.stamina - 200);
    audioSynth.playMonsterRoar();

    return {
      partBroken: partName,
      allBrokenParts: { ...this.monsterState.brokenParts },
      staminaReduction: 200
    };
  }

  /**
   * Effectue le dépeçage rituel Yautja du monstre vaincu ou de sa queue sectionnée.
   */
  performYautjaCarve(targetObject = 'CARCASS') {
    if (this.monsterState.carved) {
      throw new Error('Ce trophée a déjà été prélevé rituellement.');
    }

    this.monsterState.carved = true;
    const harvested = [];

    if (targetObject === 'SEVERED_TAIL') {
      harvested.push({ id: 'APEX_BARBED_TAIL_CHITIN', name: 'Chitine Barbelée Caudale', rarity: 'RARE', honor: 350 });
      harvested.push({ id: 'TITAN_CAUDAL_SINEW', name: 'Tendon Caudal de Titan', rarity: 'UNCOMMON', honor: 150 });
    } else {
      // Carcasse principale
      harvested.push({ id: 'COLOSSAL_APEX_SKULL', name: 'Crâne de Proie Géante Colossale', rarity: 'LEGENDARY', honor: 500 });
      harvested.push({ id: 'BIOLUMINESCENT_PRIME_BLOOD', name: 'Sang Vital Bioluminescent', rarity: 'RARE', honor: 250 });

      if (this.monsterState.brokenParts.head) {
        harvested.push({ id: 'SOVEREIGN_HORN_CREST', name: 'Crête Frontale Brisée', rarity: 'EPIC', honor: 300 });
      }
      if (this.monsterState.brokenParts.tail) {
        harvested.push({ id: 'SEVERED_STINGER_CORE', name: 'Aiguillon de Poison Pur', rarity: 'EPIC', honor: 250 });
      }
    }

    this.monsterState.harvestedMaterials = harvested;
    const totalHonor = harvested.reduce((acc, m) => acc + m.honor, 0);

    return {
      status: 'CARVE_COMPLETED',
      target: targetObject,
      materials: harvested,
      honorAwarded: totalHonor,
      yautjaRitualValidated: true
    };
  }

  /**
   * Enregistre et déclenche un piège environnemental (ex: rocher suspendu).
   */
  triggerEnvironmentalFallingBoulder(boulderPosition, targetMonsterPosition) {
    const dist = boulderPosition.distanceTo(targetMonsterPosition);
    const hit = dist <= 9.0;

    if (hit) {
      this.inflictMonsterTopple(8.0);
    }

    return {
      trapType: 'FALLING_BOULDER_STALACTITE',
      impactPosition: boulderPosition,
      monsterHit: hit,
      damageDealt: hit ? 850 : 0,
      toppleTriggered: hit
    };
  }

  /**
   * Applique la boue de camouflage thermique (Prey 2022).
   */
  applyThermalCamouflageMud() {
    return {
      status: 'THERMAL_MUD_APPLIED',
      thermalDeltaCelsius: 0.2,
      durationSeconds: 45.0,
      invisibleToMonsterSenses: true
    };
  }

  getSnapshot() {
    return {
      scoutLevel: this.scoutLevel,
      scoutPoints: this.scoutPoints,
      guidanceTrailActive: this.guidanceTrailActive,
      discoveredCluesCount: this.discoveredClueIds.size,
      totalCluesCount: this.clues.length,
      monsterState: { ...this.monsterState }
    };
  }
}
