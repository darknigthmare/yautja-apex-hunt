import * as THREE from 'three';
import { Environment } from './world/Environment.js';
import { YautjaPlayer } from './entities/YautjaPlayer.js';
import { HuntNPC, resolveHuntNpcType } from './entities/HuntNPC.js';
import { createBoss } from './gameplay/BossFactory.js';
import { LevelEventDirector } from './gameplay/LevelEventDirector.js';
import {
  HUNT_DIRECTIVES,
  createDirectiveProgress,
  getDirectiveProgressSummary,
  getHuntDirective,
  recordDirectiveNpcDefeat,
  resolveDirectiveBiome,
  resolveDirectiveReward,
} from './gameplay/HuntDirectiveSystem.js';
import { FacehuggerEggCluster } from './entities/FacehuggerEgg.js';
import { disposeObject3D } from './utils/materialState.js';
import { MothershipHub } from './world/MothershipHub.js';
import { HUDManager } from './HUDManager.js';
import { audioSynth } from './AudioSynthesizer.js';
import { saveManager } from './engine/SaveManager.js';
import { DEFAULT_SETTINGS, HUNT_DEFINITIONS, resolveHuntBiome } from './data/GameConfig.js';
import { ALL_LORE_ENTRIES, LORE_SOURCE_TIERS, LORE_SOURCES } from './data/LoreCodex.js';
import { resolveMeleeStrike } from './gameplay/combatRules.js';
import { applyPointOfInterestEffect } from './gameplay/PointOfInterestEffects.js';
import {
  HUNTER_CLASSES,
  PLAYABLE_WEAPONS,
  getPlayableWeaponByKey,
  getPlayerGadgetByKey,
} from './data/RuntimeEquipment.js';
import {
  HuntLoadoutSystem,
  LOADOUT_SLOT_DEFINITIONS,
  MANDATORY_LOADOUT_CORE,
  getEquippedLoadoutItemIds,
  getLoadoutCapacity,
  getLoadoutItemById,
  getLoadoutItemsForSlot,
  getRecommendedHuntLoadout,
  isGadgetEquipped,
  isWeaponEquipped,
  sanitizeHuntLoadout,
  validateHuntLoadout,
} from './gameplay/HuntLoadoutSystem.js';

const DEFAULT_CAMERA_FOV = 65;
const SCOPE_CAMERA_FOV = THREE.MathUtils.radToDeg(
  2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(DEFAULT_CAMERA_FOV) / 2) / 4),
);
const HUB_PLAYER_POSITION = new THREE.Vector3(0, 0, 20);
const VICTORY_DELAY_SECONDS = 3;
const GOLIATH_CHARGE_WINDOW_SECONDS = 4;
const GOLIATH_CHARGE_IMPACT_RANGE = 10;
const PLAYER_COLLIDER_RADIUS = 1.8;
const MAX_ACTIVE_HUNT_NPCS = 24;
const MAX_PENDING_DIRECTIVE_WAVES = 8;
const EXTRACTION_OUTCOME_DISPLAY_SECONDS = 4;
const NEUTRAL_PLAYER_FRAME_INPUT = Object.freeze({ x: 0, z: 0, isSprinting: false });

function showFatalGameError(message) {
  const overlay = document.getElementById('fatal-error');
  const output = document.getElementById('fatal-error-message');
  if (output && message) output.textContent = message;
  overlay?.classList.remove('hidden');
  overlay?.setAttribute('aria-hidden', 'false');
  document.getElementById('btn-reload-game')?.focus?.();
  return Boolean(overlay);
}
const KEYBOARD_MOVEMENT_BINDINGS = Object.freeze({
  KeyW: Object.freeze({ axis: 'z', value: 1 }),
  KeyZ: Object.freeze({ axis: 'z', value: 1 }),
  ArrowUp: Object.freeze({ axis: 'z', value: 1 }),
  KeyS: Object.freeze({ axis: 'z', value: -1 }),
  ArrowDown: Object.freeze({ axis: 'z', value: -1 }),
  KeyA: Object.freeze({ axis: 'x', value: 1 }),
  KeyQ: Object.freeze({ axis: 'x', value: 1 }),
  ArrowLeft: Object.freeze({ axis: 'x', value: 1 }),
  KeyD: Object.freeze({ axis: 'x', value: -1 }),
  ArrowRight: Object.freeze({ axis: 'x', value: -1 }),
});
const DIRECTIVE_BIOME_LABELS = Object.freeze({
  jungle: 'JUNGLE EXTRATERRESTRE',
  hive_lv426: 'RUCHES DE LV-426',
  ryushi_desert: 'DÉSERT DE RYUSHI',
  yautja_prime: 'DOMAINE YAUTJA',
  genna_deathworld: 'MONDE MORTEL DE GENNA',
  stargazer_blacksite: 'COMPLEXE DE CONFINEMENT STARGAZER',
  los_angeles_1997: 'LOS ANGELES 1997',
  bouvetoya_pyramid: 'BOUVETØYA — PYRAMIDE DU BLOODING',
  gunnison_outbreak: 'GUNNISON — ZONE D’INFESTATION',
});
const HIVE_EGG_OFFSETS = Object.freeze([
  Object.freeze([-19, 0, -7]),
  Object.freeze([-18, 0, 9]),
  Object.freeze([18, 0, -8]),
  Object.freeze([19, 0, 8]),
]);
const HUNT_VEHICLE_HUD_LABELS = Object.freeze({
  avp_ritual_ship: Object.freeze({
    prompt: 'SYNCHRONISER LE VAISSEAU DU RITE [E]',
    synchronized: 'VAISSEAU DU RITE SYNCHRONISÉ',
  }),
  wolf_cleaner_ship: Object.freeze({
    prompt: 'SYNCHRONISER L’APPAREIL CLEANER DE WOLF [E]',
    synchronized: 'APPAREIL CLEANER DE WOLF SYNCHRONISÉ',
  }),
  default: Object.freeze({
    prompt: 'SYNCHRONISER LA NAVETTE DE RECONNAISSANCE [E]',
    synchronized: 'NAVETTE SYNCHRONISÉE',
  }),
});
const ENEMY_ATTACK_PROFILES = Object.freeze({
  melee: { damage: 26, range: 7.5, cooldown: 1.5 },
  attack_claw: { damage: 22, range: 9.5, cooldown: 1.1 },
  attack_jaw: { damage: 30, range: 10.5, cooldown: 1.1 },
  attack_tail: { damage: 36, range: 32, cooldown: 1.6, telegraphed: true, corrosion: true },
  acid_spray: { damage: 24, range: 60, cooldown: 1.8, telegraphed: true, corrosion: true },
  acid_frenzy: { damage: 34, range: 24, cooldown: 1.8, telegraphed: true, corrosion: true },
  charge: { damage: 32, range: GOLIATH_CHARGE_IMPACT_RANGE, cooldown: 1.3 },
  wolf_whip: { damage: 42, range: 18, cooldown: 1.7, telegraphed: true },
  kalisk_charge: { damage: 48, range: 11, cooldown: 1.8, telegraphed: true },
  kalisk_impale: { damage: 44, range: 9.5, cooldown: 1.55, telegraphed: true },
  upgrade_leap: { damage: 76, range: 13, cooldown: 2.1, telegraphed: true },
  city_combistick: { damage: 46, range: 10.2, cooldown: 1.35, telegraphed: true },
  grid_bite: { damage: 34, range: 10.5, cooldown: 1.25, telegraphed: true },
  grid_pounce: { damage: 52, range: 13.5, cooldown: 1.9, telegraphed: true },
  grid_tail_sweep: { damage: 42, range: 17, cooldown: 1.65, telegraphed: true },
  grid_acid_volley: { damage: 0, range: 68, cooldown: 1, telegraphed: true, projectileOnly: true },
});
const ENEMY_ATTACK_TELEGRAPHS = Object.freeze({
  attack_tail: 'BALAYAGE DE QUEUE DÉTECTÉ — ESQUIVEZ !',
  acid_spray: 'PRESSION ACIDE : LA REINE ARME UNE PROJECTION !',
  acid_frenzy: 'FRÉNÉSIE ACIDE DU PREDALIEN — ROMPEZ LE CONTACT !',
  wolf_whip: 'FOUET SEGMENTÉ DE WOLF — SORTEZ DU BALAYAGE !',
  kalisk_charge: 'CHARGE DU KALISK — QUITTEZ SON AXE !',
  kalisk_impale: 'EMPALAGE DU KALISK — ROMPEZ LE CONTACT !',
  upgrade_leap: 'BOND D’ÉCRASEMENT DE L’ASSASSIN — QUITTEZ LA ZONE D’IMPACT !',
  city_combistick: 'BALAYAGE DU COMBISTICK URBAIN — PASSEZ SOUS SA GARDE !',
  grid_bite: 'MÂCHOIRE INTERNE DE GRID — ROMPEZ LE CONTACT !',
  grid_pounce: 'BOND DE GRID — QUITTEZ SON AXE !',
  grid_tail_sweep: 'QUEUE SEGMENTÉE DE GRID — ESQUIVEZ LE BALAYAGE !',
  grid_acid_volley: 'VOLÉE ACIDE DE GRID — CHANGEZ DE COULOIR !',
});


export class Game {
  constructor() {
    this.container = document.getElementById('game-canvas');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(DEFAULT_CAMERA_FOV, this.width / this.height, 0.1, 2000);
    
    this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.clock = new THREE.Clock();

    // VFX Systems
    this.vfxParticles = [];
    this.scanRevealedTargets = new Map();
    this.vehicleScanOrigin = null;

    // Game States
    this.gameState = 'HUB';
    this.currentHuntType = 'goliath';
    this.currentPlanet = 'jungle';
    this.currentDirectiveId = 'standard_hunt';
    this.directiveProgress = createDirectiveProgress(this.currentDirectiveId);
    this.directiveOutcome = null;
    this.timeScale = 1.0;

    this.hub = new MothershipHub(this.scene);
    this.environment = new Environment(this.scene);
    this.player = new YautjaPlayer(this.scene);
    this.hud = new HUDManager();
    this.eventDirector = new LevelEventDirector(this.scene);

    const loadResult = saveManager.load(this.player);
    this.environment.setDiscoveredPoiIds(this.player.discoveredPoiIds);
    this.settings = { ...DEFAULT_SETTINGS, ...loadResult.settings };
    this.loadoutSystem = new HuntLoadoutSystem();
    const loadoutResult = this.loadoutSystem.load({
      hunterClassId: this.player.customization?.hunterClassId,
      unlockedWeaponIds: this.player.unlockedWeaponIds,
    });
    this.activeHuntLoadout = this.resolveClassAlignedLoadout(loadoutResult.state.activeLoadout);
    const initialLoadoutResult = this.loadoutSystem.setActiveLoadout(
      this.activeHuntLoadout,
      this.getLoadoutValidationOptions(),
    );
    if (initialLoadoutResult.applied) this.activeHuntLoadout = initialLoadoutResult.validation.loadout;
    this.draftHuntLoadout = this.activeHuntLoadout;
    this.pendingHunt = null;
    this.pendingHuntRecommendation = null;
    this.player.applyCustomization(this.player.customization);
    this.hud.syncCustomization(this.player.customization);
    this.applyActiveHuntLoadout();
    this.player.resetForHunt(HUB_PLAYER_POSITION);
    this.hub.setTrophyState(this.player.completedHunts);
    this.hub.setVisible(true);
    this.environment.setVisible(false);
    this.hud.showHubTarget();

    this.activeBoss = null;
    this.activeEnemies = [];
    this.pendingDirectiveWaves = [];
    this.activeTerritoryClashes = [];
    this.bossMigrationRoute = [];
    this.bossMigrationIndex = 0;
    this.bossMigrationHold = 0;
    this.bossMigrationGrace = 0;
    this.bossMigrationHealthPhase = 0;
    this.bossRelocating = false;
    this.bossEngaged = false;
    this.bossMigrationForced = false;
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.activeExtractionObjective = null;
    this.extractionOutcome = null;
    this.eggClusters = [];

    // Inputs
    this.inputDir = { x: 0, z: 0, isSprinting: false };
    this.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
    this.pressedKeyboardCodes = new Set();
    this.cameraPitch = 0.2;
    // Le chasseur apparaît au sud des zones et regarde naturellement vers leur centre.
    this.cameraYaw = Math.PI;
    this.isPointerLocked = false;
    this.isGameStarted = false;
    this.isHubExploring = false;
    this.activateMissionTab = null;
    this.trophyHarvested = false;
    this.isPaused = false;
    this.isScopeZooming = false;
    this.huntResultShown = false;
    this.enemyDamageCooldown = 0;
    this.victoryCountdown = null;
    this.gamepadAttackPressed = false;
    this.gamepadInteractPressed = false;
    this.gamepadMenuPressed = false;
    this.gamepadWeaponCyclePressed = { previous: false, next: false };
    this.gamepadVisionPressed = false;
    this.gamepadCloakPressed = false;
    this.gamepadGadgetPressed = [false, false, false, false];
    this.gamepadNavigationPressed = [false, false, false, false];
    this.touchInputDir = { x: 0, z: 0 };
    this.activeHubTouchDirections = new Set();
    this.activeHuntTouchDirections = new Set();
    this.touchLookPointerId = null;
    this.touchLookPosition = null;
    this.gamepadAxes = { x: 0, z: 0 };
    this.activeFacehuggerCluster = null;
    this.goliathChargeWindow = 0;
    this.goliathChargeLatched = false;

    this.applySettings(false);
    this.renderLoreCodex();
    this.renderDirectiveSelector();
    this.initEventListeners();
    this.setupUIButtons();
    this.renderHuntLoadoutUI();
    this.hud.updateVitals(this.player);
    this.hud.setVisionModeUI(this.player.activeVisionMode);
  }

  saveProgress() {
    const saved = saveManager.save(this.player, this.settings);
    this.setPersistenceUnavailable(!saved);
    return saved;
  }

  setPersistenceUnavailable(unavailable, message = null) {
    const status = document.getElementById('persistence-status');
    status?.classList.toggle('hidden', !unavailable);
    if (unavailable && message && status) status.textContent = message;
    document.body?.classList.toggle('persistence-unavailable', Boolean(unavailable));
    if (unavailable && !this.persistenceWarningShown) {
      this.persistenceWarningShown = true;
      this.hud?.showLogMessage?.('SAUVEGARDE LOCALE INDISPONIBLE — PROGRESSION LIMITÉE À CETTE SESSION', 4800);
    }
    return !unavailable;
  }

  getLoadoutValidationOptions() {
    return { unlockedWeaponIds: this.player?.unlockedWeaponIds ?? null };
  }

  getCurrentHunterClassId() {
    return this.player?.customization?.hunterClassId ?? 'class_hunter';
  }

  resolveClassAlignedLoadout(loadout, missionContext = {}) {
    const hunterClassId = this.getCurrentHunterClassId();
    const candidate = sanitizeHuntLoadout({
      ...loadout,
      hunterClassId,
      slots: loadout?.slots,
    }, { fillDefaults: true });
    const validationOptions = this.getLoadoutValidationOptions();
    const validation = validateHuntLoadout(candidate, validationOptions);
    if (validation.valid) return validation.loadout;
    return getRecommendedHuntLoadout({
      ...missionContext,
      hunterClassId,
      ...validationOptions,
    }).loadout;
  }

  applyActiveHuntLoadout() {
    const loadout = this.activeHuntLoadout ?? this.loadoutSystem?.state?.activeLoadout;
    if (!loadout) return false;
    this.activeHuntLoadout = loadout;
    this.hud?.setActiveLoadout?.(loadout);
    this.player?.applyHuntLoadout?.(loadout);
    if (!isWeaponEquipped(loadout, this.player.selectedWeapon)) {
      const firstEquipped = PLAYABLE_WEAPONS.find((weapon) => isWeaponEquipped(loadout, weapon.id));
      this.player.selectedWeapon = firstEquipped?.slot ?? 1;
    }
    return true;
  }

  commitHuntLoadout(loadout) {
    const result = this.loadoutSystem.setActiveLoadout(loadout, this.getLoadoutValidationOptions());
    if (!result.applied) return result;
    this.activeHuntLoadout = result.validation.loadout;
    this.draftHuntLoadout = this.activeHuntLoadout;
    this.applyActiveHuntLoadout();
    if (result.persistence?.saved === false) {
      this.setPersistenceUnavailable(true, 'SAUVEGARDE DU LOADOUT INDISPONIBLE — cette configuration reste active uniquement pour cette session.');
    }
    return result;
  }

  syncHuntLoadoutClass() {
    const missionContext = this.pendingHunt ?? {};
    const aligned = this.resolveClassAlignedLoadout(this.activeHuntLoadout, {
      huntType: missionContext.huntType,
      biomeId: missionContext.planetType,
    });
    this.commitHuntLoadout(aligned);
    this.draftHuntLoadout = this.activeHuntLoadout;
    this.renderHuntLoadoutUI();
    return this.activeHuntLoadout;
  }

  updateDraftHuntLoadoutSlot(slotId, itemId, checked = true) {
    const source = this.draftHuntLoadout ?? this.activeHuntLoadout;
    const slots = {
      ...source.slots,
      gadgets: [...source.slots.gadgets],
    };
    if (slotId === 'gadgets') {
      const selected = new Set(slots.gadgets);
      if (checked) {
        if (!selected.has(itemId) && selected.size >= LOADOUT_SLOT_DEFINITIONS.gadgets.maxItems) {
          const status = document.getElementById('loadout-validation');
          if (status) status.textContent = 'Deux gadgets optionnels maximum peuvent être embarqués. Retirez-en un avant de poursuivre.';
          this.renderHuntLoadoutUI();
          return false;
        }
        selected.add(itemId);
      } else {
        selected.delete(itemId);
      }
      slots.gadgets = [...selected];
    } else {
      slots[slotId] = itemId;
    }
    this.draftHuntLoadout = sanitizeHuntLoadout({
      ...source,
      hunterClassId: this.getCurrentHunterClassId(),
      slots,
    });
    this.renderHuntLoadoutUI();
    return true;
  }

  renderHuntLoadoutUI() {
    const grid = document.getElementById('loadout-slot-grid');
    if (!grid) return false;
    this.draftHuntLoadout ??= this.activeHuntLoadout;
    const draft = this.draftHuntLoadout;
    const validationOptions = this.getLoadoutValidationOptions();
    const validation = validateHuntLoadout(draft, validationOptions);
    const capacity = validation.capacity ?? getLoadoutCapacity(draft);
    const classProfile = HUNTER_CLASSES.find(({ id }) => id === draft.hunterClassId)
      ?? HUNTER_CLASSES[0];

    const missionDefinition = this.pendingHunt
      ? HUNT_DEFINITIONS[this.pendingHunt.huntType] ?? HUNT_DEFINITIONS.goliath
      : null;
    const directive = this.pendingHunt ? getHuntDirective(this.pendingHunt.directiveId) : null;
    const missionTitle = document.getElementById('loadout-mission-title');
    const missionContext = document.getElementById('loadout-mission-context');
    if (missionTitle) missionTitle.textContent = missionDefinition?.name?.toUpperCase() ?? 'AUCUN CONTRAT SÉLECTIONNÉ';
    if (missionContext) {
      missionContext.textContent = missionDefinition
        ? `${DIRECTIVE_BIOME_LABELS[this.pendingHunt.planetType] ?? this.pendingHunt.planetType} · ${directive?.shortLabel ?? 'CHASSE STANDARD'}`
        : 'Choisissez d’abord une cible dans l’onglet Contrats.';
    }

    const classLabel = document.getElementById('loadout-class-label');
    if (classLabel) classLabel.textContent = `CLASSE · ${classProfile.name.toUpperCase()}`;
    const capacityLabel = document.getElementById('loadout-capacity-label');
    if (capacityLabel) capacityLabel.textContent = validation.capacityLabel;
    const capacityCard = capacityLabel?.closest('.loadout-capacity-card');
    capacityCard?.classList.toggle('overloaded', capacity.exceeded > 0);
    const capacityTrack = capacityCard?.querySelector('.loadout-capacity-track');
    capacityTrack?.setAttribute('aria-valuemax', String(capacity.budget));
    capacityTrack?.setAttribute('aria-valuenow', String(Math.min(capacity.used, capacity.budget)));
    capacityTrack?.setAttribute('aria-valuetext', validation.capacityLabel);
    const capacityFill = document.getElementById('loadout-capacity-fill');
    if (capacityFill) capacityFill.style.width = `${Math.min(100, (capacity.used / Math.max(1, capacity.budget)) * 100)}%`;
    const recommendation = document.getElementById('loadout-recommendation');
    if (recommendation) {
      recommendation.textContent = this.pendingHuntRecommendation?.reason
        ? `RECOMMANDATION DU NEXUS : ${this.pendingHuntRecommendation.reason}`
        : 'Le nexus analysera la cible et proposera un équipement adapté.';
    }

    const coreList = document.getElementById('loadout-core-list');
    if (coreList) {
      const coreItems = [
        MANDATORY_LOADOUT_CORE.wristWeaponId,
        MANDATORY_LOADOUT_CORE.biomaskGadgetId,
        MANDATORY_LOADOUT_CORE.cloakGadgetId,
      ].map((id) => {
        const item = getLoadoutItemById(id);
        const chip = document.createElement('span');
        chip.className = 'loadout-core-item';
        chip.textContent = `${item?.name ?? id} · ${item?.capacityCost ?? 0} CAP`;
        return chip;
      });
      coreList.replaceChildren(...coreItems);
    }

    const unlockedWeapons = new Set(this.player.unlockedWeaponIds ?? PLAYABLE_WEAPONS.map(({ id }) => id));
    const singleSlots = ['melee', 'secondary', 'ranged', 'support'];
    const selectedSingleItems = Object.fromEntries(singleSlots.map((slotId) => [slotId, draft.slots[slotId]]));
    const slotCards = Object.values(LOADOUT_SLOT_DEFINITIONS).map((slotDefinition) => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'loadout-slot-card';
      const legend = document.createElement('legend');
      legend.textContent = slotDefinition.id === 'gadgets'
        ? `${slotDefinition.label} · 1 À ${slotDefinition.maxItems}`
        : slotDefinition.label;
      const choices = document.createElement('div');
      choices.className = 'loadout-slot-choices';

      getLoadoutItemsForSlot(slotDefinition.id).forEach((item) => {
        const selected = slotDefinition.id === 'gadgets'
          ? draft.slots.gadgets.includes(item.id)
          : draft.slots[slotDefinition.id] === item.id;
        const usedElsewhere = slotDefinition.id !== 'gadgets'
          && Object.entries(selectedSingleItems).some(([otherSlot, selectedId]) => (
            otherSlot !== slotDefinition.id && selectedId === item.id
          ));
        const locked = item.type === 'weapon' && !unlockedWeapons.has(item.id);
        const choice = document.createElement('label');
        choice.className = 'loadout-choice';
        const input = document.createElement('input');
        input.type = slotDefinition.id === 'gadgets' ? 'checkbox' : 'radio';
        input.name = `loadout-${slotDefinition.id}`;
        input.value = item.id;
        input.checked = selected;
        input.disabled = locked || usedElsewhere;
        input.dataset.loadoutSlot = slotDefinition.id;
        input.dataset.loadoutItem = item.id;
        input.addEventListener('change', () => this.updateDraftHuntLoadoutSlot(
          slotDefinition.id,
          item.id,
          input.checked,
        ));
        const copy = document.createElement('span');
        const name = document.createElement('span');
        name.className = 'loadout-item-name';
        name.textContent = item.name;
        const meta = document.createElement('span');
        meta.className = 'loadout-item-meta';
        meta.textContent = locked
          ? 'VERROUILLÉ PAR LA PROGRESSION'
          : usedElsewhere
            ? 'DÉJÀ AFFECTÉ À UN AUTRE SLOT'
            : `${item.keyLabel ? `[${item.keyLabel}] · ` : ''}${String(item.behavior ?? 'technologie').replaceAll('_', ' ').toUpperCase()}`;
        copy.append(name, meta);
        const cost = document.createElement('span');
        cost.className = 'loadout-item-cost';
        cost.textContent = `${item.capacityCost} CAP`;
        choice.append(input, copy, cost);
        choices.append(choice);
      });
      fieldset.append(legend, choices);
      return fieldset;
    });
    grid.replaceChildren(...slotCards);

    const presetSelect = document.getElementById('loadout-preset-select');
    if (presetSelect) {
      const preferredPresetId = this.loadoutSystem.state.activePresetId ?? presetSelect.value;
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = 'AUCUN PRESET';
      const options = this.loadoutSystem.state.presets.map((preset) => {
        const option = document.createElement('option');
        option.value = preset.id;
        option.textContent = preset.name;
        return option;
      });
      presetSelect.replaceChildren(empty, ...options);
      presetSelect.value = options.some(({ value }) => value === preferredPresetId) ? preferredPresetId : '';
    }

    const validationStatus = document.getElementById('loadout-validation');
    if (validationStatus) {
      const messages = [
        ...validation.errors.map(({ message }) => message),
        ...validation.warnings.map(({ message }) => `Avertissement : ${message}`),
      ];
      if (!this.pendingHunt) messages.unshift('Sélectionnez un contrat avant le déploiement.');
      validationStatus.textContent = messages.length > 0
        ? messages.join(' · ')
        : `Configuration valide · ${getEquippedLoadoutItemIds(draft).length} systèmes embarqués.`;
      validationStatus.classList.toggle('valid', validation.valid && Boolean(this.pendingHunt));
      validationStatus.classList.toggle('invalid', !validation.valid);
    }
    const deployButton = document.getElementById('btn-loadout-deploy');
    if (deployButton) deployButton.disabled = !validation.valid || !this.pendingHunt;
    const presetActionDisabled = this.loadoutSystem.state.presets.length === 0;
    document.getElementById('btn-loadout-activate-preset')?.toggleAttribute('disabled', presetActionDisabled);
    document.getElementById('btn-loadout-delete-preset')?.toggleAttribute('disabled', presetActionDisabled);
    return validation;
  }

  prepareHunt(huntType, planetType, directiveId = 'standard_hunt') {
    const huntDefinition = HUNT_DEFINITIONS[huntType] ?? HUNT_DEFINITIONS.goliath;
    this.pendingHunt = { huntType: huntDefinition.id, planetType, directiveId };
    this.pendingHuntRecommendation = this.loadoutSystem.recommend({
      huntType: huntDefinition.id,
      biomeId: planetType,
      hunterClassId: this.getCurrentHunterClassId(),
      ...this.getLoadoutValidationOptions(),
    });
    this.draftHuntLoadout = this.resolveClassAlignedLoadout(this.activeHuntLoadout, {
      huntType: huntDefinition.id,
      biomeId: planetType,
    });
    document.querySelectorAll('.mission-card').forEach((card) => {
      card.classList.toggle('selected-contract', card.querySelector('[data-hunt]')?.dataset.hunt === huntDefinition.id);
    });
    this.activateMissionTab?.('loadout', false);
    this.renderHuntLoadoutUI();
    document.getElementById('btn-loadout-recommended')?.focus?.();
    this.hud.showLogMessage(`CONTRAT ${huntDefinition.name.toUpperCase()} — CONFIGUREZ VOTRE ÉQUIPEMENT`, 2600);
    return this.pendingHunt;
  }

  deployPreparedHunt() {
    if (!this.pendingHunt) return false;
    const validation = validateHuntLoadout(this.draftHuntLoadout, this.getLoadoutValidationOptions());
    if (!validation.valid) {
      this.renderHuntLoadoutUI();
      return false;
    }
    const committed = this.commitHuntLoadout(validation.loadout);
    if (!committed.applied) return false;
    const pending = this.pendingHunt;
    this.pendingHunt = null;
    this.startHunt(pending.huntType, pending.planetType, pending.directiveId);
    this.requestPointerLockSafely();
    return true;
  }

  setupHuntLoadoutControls() {
    document.getElementById('loadout-form')?.addEventListener('submit', (event) => event.preventDefault());
    document.getElementById('btn-loadout-back')?.addEventListener('click', () => this.activateMissionTab?.('missions', true));
    document.getElementById('btn-loadout-recommended')?.addEventListener('click', () => {
      if (!this.pendingHuntRecommendation) return;
      this.draftHuntLoadout = this.pendingHuntRecommendation.loadout;
      audioSynth.playYautjaClick();
      this.renderHuntLoadoutUI();
    });
    document.getElementById('btn-loadout-deploy')?.addEventListener('click', () => this.deployPreparedHunt());
    document.getElementById('btn-loadout-activate-preset')?.addEventListener('click', () => {
      const presetId = document.getElementById('loadout-preset-select')?.value;
      if (!presetId) return;
      const result = this.loadoutSystem.activatePreset(presetId, this.getLoadoutValidationOptions());
      if (!result.activated) return;
      this.activeHuntLoadout = result.state.activeLoadout;
      this.draftHuntLoadout = this.activeHuntLoadout;
      this.applyActiveHuntLoadout();
      const persistence = this.loadoutSystem.save();
      if (!persistence.saved) this.setPersistenceUnavailable(true, 'SAUVEGARDE DU PRESET INDISPONIBLE — configuration active pour cette session uniquement.');
      audioSynth.playYautjaClick();
      this.renderHuntLoadoutUI();
    });
    document.getElementById('btn-loadout-delete-preset')?.addEventListener('click', () => {
      const presetId = document.getElementById('loadout-preset-select')?.value;
      if (!presetId) return;
      const result = this.loadoutSystem.deletePreset(presetId);
      if (!result.persistence.saved) this.setPersistenceUnavailable(true, 'SUPPRESSION NON PERSISTÉE — stockage local indisponible.');
      this.renderHuntLoadoutUI();
    });
    document.getElementById('btn-loadout-save-preset')?.addEventListener('click', () => {
      const nameInput = document.getElementById('loadout-preset-name');
      const result = this.loadoutSystem.savePreset({
        name: nameInput?.value ?? 'Preset de chasse',
        loadout: this.draftHuntLoadout,
      }, this.getLoadoutValidationOptions());
      if (!result.saved) {
        this.renderHuntLoadoutUI();
        return;
      }
      this.activeHuntLoadout = result.state.activeLoadout;
      this.draftHuntLoadout = this.activeHuntLoadout;
      this.applyActiveHuntLoadout();
      const persistence = this.loadoutSystem.save();
      if (!persistence.saved) this.setPersistenceUnavailable(true, 'PRESET ACTIF MAIS NON PERSISTÉ — stockage local indisponible.');
      if (nameInput) nameInput.value = '';
      audioSynth.playYautjaClick();
      this.renderHuntLoadoutUI();
    });
  }

  refreshForgeButtons() {
    const upgrades = [
      { id: 'btn-buy-tribeam', property: 'hasTriBeam', label: 'TIR TRI-FAISCEAU', cost: 500 },
      { id: 'btn-buy-antiacid', property: 'hasAntiAcidCloak', label: 'CAMOUFLAGE ANTI-ACIDE', cost: 800 },
      { id: 'btn-buy-scope', property: 'hasScopeZoom', label: 'ZOOM THERMIQUE 4×', cost: 400 },
    ];

    upgrades.forEach(({ id, property, label, cost }) => {
      const button = document.getElementById(id);
      if (!button) return;
      const owned = this.player[property] === true;
      button.disabled = owned || this.player.honorScore < cost;
      button.textContent = owned ? `${label} — ACQUIS` : `${label} (${cost} PTS)`;
      button.setAttribute(
        'aria-label',
        owned ? `${label} acquis` : `${label}, ${cost} points d'honneur`,
      );
    });
  }

  isHuntFlowActive() {
    return this.gameState === 'HUNT' || this.gameState === 'VICTORY_PENDING';
  }

  isPlayerCombatDisabled() {
    return this.player.isSelfDestructing
      || this.player.selfDestructComplete
      || this.player.isDead
      || this.player.health <= 0;
  }

  syncInputDirection() {
    const touchX = this.touchInputDir?.x ?? 0;
    const touchZ = this.touchInputDir?.z ?? 0;
    this.inputDir.x = this.gamepadAxes.x !== 0 ? this.gamepadAxes.x
      : touchX !== 0 ? touchX : this.keyboardInputDir.x;
    this.inputDir.z = this.gamepadAxes.z !== 0 ? this.gamepadAxes.z
      : touchZ !== 0 ? touchZ : this.keyboardInputDir.z;
    this.inputDir.isSprinting = this.keyboardInputDir.isSprinting;
  }

  recomputeKeyboardInputDirection() {
    this.pressedKeyboardCodes ??= new Set();
    this.keyboardInputDir ??= { x: 0, z: 0, isSprinting: false };
    let x = 0;
    let z = 0;
    this.pressedKeyboardCodes.forEach((code) => {
      const binding = KEYBOARD_MOVEMENT_BINDINGS[code];
      if (binding?.axis === 'x') x += binding.value;
      if (binding?.axis === 'z') z += binding.value;
    });
    this.keyboardInputDir.x = THREE.MathUtils.clamp(x, -1, 1);
    this.keyboardInputDir.z = THREE.MathUtils.clamp(z, -1, 1);
    this.keyboardInputDir.isSprinting = this.pressedKeyboardCodes.has('ShiftLeft')
      || this.pressedKeyboardCodes.has('ShiftRight');
    return this.keyboardInputDir;
  }

  applyKeyboardMovementInput(code, pressed) {
    const binding = KEYBOARD_MOVEMENT_BINDINGS[code];
    if (!binding) return false;
    this.pressedKeyboardCodes ??= new Set();
    if (pressed) this.pressedKeyboardCodes.add(code);
    else this.pressedKeyboardCodes.delete(code);
    this.recomputeKeyboardInputDirection();
    return true;
  }

  applyKeyboardSprintInput(code, pressed) {
    if (code !== 'ShiftLeft' && code !== 'ShiftRight') return false;
    this.pressedKeyboardCodes ??= new Set();
    if (pressed) this.pressedKeyboardCodes.add(code);
    else this.pressedKeyboardCodes.delete(code);
    this.recomputeKeyboardInputDirection();
    return true;
  }

  resetKeyboardInput() {
    this.pressedKeyboardCodes ??= new Set();
    this.pressedKeyboardCodes.clear();
    this.keyboardInputDir ??= { x: 0, z: 0, isSprinting: false };
    this.keyboardInputDir.x = 0;
    this.keyboardInputDir.z = 0;
    this.keyboardInputDir.isSprinting = false;
    return this.keyboardInputDir;
  }

  getPlayerFrameInput() {
    return this.player?.inQTE ? NEUTRAL_PLAYER_FRAME_INPUT : this.inputDir;
  }

  updatePlayerFrame(delta) {
    const frameInput = this.getPlayerFrameInput();
    this.player.update(delta, frameInput, this.cameraYaw);
    return frameInput;
  }

  getVehicleHudLabels(vehicleType) {
    return HUNT_VEHICLE_HUD_LABELS[vehicleType] ?? HUNT_VEHICLE_HUD_LABELS.default;
  }

  updateShaderUniforms(delta) {
    const shaderMaterials = new Set();
    this.scene.traverse((object) => {
      let current = object;
      while (current) {
        if (!current.visible) return;
        current = current.parent;
      }

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.filter(Boolean).forEach((material) => {
        if (material.isShaderMaterial && material.uniforms?.uTime) shaderMaterials.add(material);
      });
    });

    shaderMaterials.forEach((material) => {
      if (Number.isFinite(material.uniforms.uTime.value)) material.uniforms.uTime.value += delta;
    });
  }

  neutralizeVictoryDangers() {
    this.clearVehicleScan();
    this.activeFacehuggerCluster = null;
    this.eggClusters.forEach((egg) => egg.dispose());
    this.eggClusters = [];
    (this.activeEnemies ?? []).forEach((enemy) => enemy.dispose());
    this.activeEnemies = [];
    this.pendingDirectiveWaves = [];
    this.eventDirector?.stop();
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.clearExtractionObjective();
    this.environment?.clearWeatherEvent?.();

    this.activeBoss?.projectiles?.forEach((projectile) => disposeObject3D(projectile.mesh));
    if (this.activeBoss?.projectiles) this.activeBoss.projectiles = [];

    this.player.clearTransientGadgets();
    this.player.projectiles.forEach((projectile) => disposeObject3D(projectile.mesh));
    this.player.mines.forEach((mine) => disposeObject3D(mine.mesh));
    this.player.projectiles = [];
    this.player.mines = [];
    this.player.inQTE = false;
    this.player.qteTimer = 0;
    this.player.isAcidCorroded = false;
    this.player.acidTimer = 0;
    this.goliathChargeWindow = 0;
    this.goliathChargeLatched = false;
    this.enemyDamageCooldown = 0;
    this.hud.hideActionPrompt();
  }

  updateVictoryPending(delta) {
    if (this.gameState !== 'VICTORY_PENDING' || this.victoryCountdown === null) return false;

    if (this.isPlayerCombatDisabled()) {
      this.victoryCountdown = null;
      this.timeScale = 1;
      this.gameState = 'HUNT';
      return false;
    }

    this.victoryCountdown = Math.max(0, this.victoryCountdown - delta);
    if (this.victoryCountdown > 0) return false;

    this.victoryCountdown = null;
    this.timeScale = 1;
    this.triggerVictoryScreen();
    return true;
  }

  applySettings(persist = true) {
    const hudScale = Number(this.settings.hudScale);
    this.settings = {
      audioEnabled: this.settings.audioEnabled !== false,
      reducedMotion: this.settings.reducedMotion === true,
      highContrast: this.settings.highContrast === true,
      hudScale: Number.isFinite(hudScale) ? Math.min(1.25, Math.max(0.85, hudScale)) : DEFAULT_SETTINGS.hudScale,
    };

    document.body.classList.toggle('reduced-motion', this.settings.reducedMotion);
    document.body.classList.toggle('high-contrast', this.settings.highContrast);
    document.documentElement.style.setProperty('--hud-scale', String(this.settings.hudScale));
    this.environment.setReducedMotion(this.settings.reducedMotion);
    this.eventDirector?.setReducedMotion?.(this.settings.reducedMotion);
    audioSynth.setMuted(!this.settings.audioEnabled);
    this.syncSettingsControls();

    if (persist) this.saveProgress();
  }

  syncSettingsControls() {
    const controls = {
      'setting-audio': this.settings.audioEnabled,
      'setting-reduced-motion': this.settings.reducedMotion,
      'setting-high-contrast': this.settings.highContrast,
    };

    Object.entries(controls).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (!input) return;
      if ('checked' in input) input.checked = value;
      else input.value = String(value);
    });

    const hudScaleInput = document.getElementById('setting-hud-scale');
    if (hudScaleInput) hudScaleInput.value = String(this.settings.hudScale);
  }

  setupSettingsHooks() {
    const bindToggle = (id, settingKey) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('change', () => {
        this.settings[settingKey] = 'checked' in input ? input.checked : input.value !== 'false';
        this.applySettings(true);
      });
    };

    bindToggle('setting-audio', 'audioEnabled');
    bindToggle('setting-reduced-motion', 'reducedMotion');
    bindToggle('setting-high-contrast', 'highContrast');

    const hudScaleInput = document.getElementById('setting-hud-scale');
    if (hudScaleInput) {
      const updateHudScale = (persist) => {
        this.settings.hudScale = Number(hudScaleInput.value);
        this.applySettings(persist);
      };
      hudScaleInput.addEventListener('input', () => updateHudScale(false));
      hudScaleInput.addEventListener('change', () => updateHudScale(true));
    }

    this.syncSettingsControls();
  }

  renderLoreCodex() {
    const codexGrid = document.getElementById('codex-grid');
    if (!codexGrid) return;

    const cards = ALL_LORE_ENTRIES.map((entry) => {
      const card = document.createElement('article');
      card.className = 'codex-card';
      card.dataset.category = entry.category;

      const tier = LORE_SOURCE_TIERS[entry.sourceTier] ?? LORE_SOURCE_TIERS.ORIGINAL;
      card.style.setProperty('--lore-tier-color', tier.color);

      const header = document.createElement('div');
      header.className = 'codex-card-header';
      const title = document.createElement('h3');
      title.textContent = entry.title;
      const badge = document.createElement('span');
      badge.className = 'codex-tier';
      badge.textContent = tier.shortLabel;
      badge.title = tier.label;
      header.append(title, badge);
      card.append(header);

      const summary = document.createElement('p');
      summary.className = 'codex-summary';
      summary.textContent = entry.summary;
      card.append(summary);

      const detailText = entry.body ?? entry.canonNote;
      if (detailText) {
        const detail = document.createElement('p');
        detail.className = 'codex-body';
        detail.textContent = detailText;
        card.append(detail);
      }

      const sources = (entry.sources ?? [])
        .map((sourceId) => LORE_SOURCES[sourceId])
        .filter(Boolean);
      if (sources.length > 0) {
        const sourceList = document.createElement('div');
        sourceList.className = 'codex-sources';
        sources.forEach((source, index) => {
          const link = document.createElement('a');
          link.href = source.url;
          link.target = '_blank';
          link.rel = 'noreferrer';
          link.textContent = source.title;
          sourceList.append(link);
          if (index < sources.length - 1) sourceList.append(document.createTextNode(' · '));
        });
        card.append(sourceList);
      }

      return card;
    });

    codexGrid.replaceChildren(...cards);
  }

  renderDirectiveSelector(preferredId = this.currentDirectiveId) {
    const selector = document.getElementById('directive-selector');
    if (!selector) return null;
    const completed = new Set(this.player.completedDirectiveIds ?? []);
    const options = Object.values(HUNT_DIRECTIVES).map((directive) => {
      const option = document.createElement('option');
      option.value = directive.id;
      const cleared = directive.id !== 'standard_hunt' && completed.has(directive.id);
      option.textContent = `${cleared ? '✓ ' : ''}${directive.title.toUpperCase()} · ×${directive.rewardMultiplier.toFixed(2).replace('.', ',')}`;
      return option;
    });
    selector.replaceChildren(...options);
    selector.value = getHuntDirective(preferredId).id;
    this.updateDirectivePreview(selector.value);
    return selector.value;
  }

  updateDirectivePreview(directiveId) {
    const directive = getHuntDirective(directiveId);
    const completed = directive.id !== 'standard_hunt'
      && (this.player.completedDirectiveIds ?? []).includes(directive.id);
    const title = document.getElementById('directive-preview-title');
    const reward = document.getElementById('directive-preview-reward');
    const status = document.getElementById('directive-preview-status');
    const description = document.getElementById('directive-preview-description');
    const biome = document.getElementById('directive-preview-biome');
    const objectives = document.getElementById('directive-preview-objectives');
    if (title) title.textContent = directive.title.toUpperCase();
    if (reward) reward.textContent = `RÉCOMPENSE ×${directive.rewardMultiplier.toFixed(2).replace('.', ',')}`;
    if (status) {
      status.textContent = directive.id === 'standard_hunt' ? 'LIBRE' : completed ? 'ACCOMPLIE' : 'DISPONIBLE';
      status.classList.toggle('completed', completed);
    }
    if (description) description.textContent = directive.description;
    if (biome) {
      const biomeLabel = directive.recommendedBiomeId
        ? DIRECTIVE_BIOME_LABELS[directive.recommendedBiomeId] ?? directive.recommendedBiomeId
        : 'LIBRE';
      biome.textContent = `SECTEUR ${directive.recommendedBiomeId ? 'REQUIS' : 'CONSEILLÉ'} : ${biomeLabel}`;
    }
    if (objectives) {
      const objectiveText = directive.objectives.length > 0
        ? directive.objectives.map(({ label }) => label).join(' · ')
        : 'Prélever le trophée de la cible Apex';
      objectives.textContent = `OBJECTIFS : ${objectiveText}`;
    }
    const planetSelector = document.getElementById('planet-selector');
    if (planetSelector && directive.recommendedBiomeId) {
      planetSelector.value = directive.recommendedBiomeId;
    }
    return directive;
  }

  refreshDirectiveHud() {
    const directive = getHuntDirective(this.currentDirectiveId);
    const summary = getDirectiveProgressSummary(this.directiveProgress);
    this.hud.updateDirectiveStatus?.(directive, summary);
    return summary;
  }

  updateDirectiveResultPanel(success) {
    const panel = document.getElementById('directive-result');
    const title = panel?.querySelector?.('strong');
    const detail = panel?.querySelector?.('span');
    if (!panel || !title || !detail) return;
    const directive = getHuntDirective(this.currentDirectiveId);
    const outcome = this.directiveOutcome;
    const summary = outcome?.summary ?? getDirectiveProgressSummary(this.directiveProgress);
    title.textContent = directive.title.toUpperCase();
    if (directive.id === 'standard_hunt') {
      detail.textContent = success
        ? 'CHASSE LIBRE VALIDÉE · RÉCOMPENSE APEX STANDARD'
        : 'CHASSE LIBRE INTERROMPUE · AUCUNE PRIME';
      return;
    }
    if (!success) {
      detail.textContent = `DIRECTIVE ÉCHOUÉE · ${summary.completedObjectives}/${summary.totalObjectives} OBJECTIFS`;
      return;
    }
    if (summary.isComplete) {
      const firstCompletion = outcome?.newlyCompleted ? ' · PREMIÈRE VALIDATION' : '';
      detail.textContent = `DIRECTIVE ACCOMPLIE · +${outcome?.bonus ?? 0} HONNEUR${firstCompletion}`;
      return;
    }
    detail.textContent = `DIRECTIVE INCOMPLÈTE · ${summary.completedObjectives}/${summary.totalObjectives} OBJECTIFS · PRIME NON ACCORDÉE`;
  }

  getCombatTargets() {
    return [this.activeBoss, ...(this.activeEnemies ?? [])]
      .filter((target) => target && !target.isDead && target.position?.isVector3);
  }

  removeActiveBossProjectile(index) {
    if (this.activeBoss?.removeProjectile?.(index) === true) return true;
    const projectile = this.activeBoss?.projectiles?.[index];
    if (!projectile) return false;
    disposeObject3D(projectile.mesh);
    this.activeBoss.projectiles.splice(index, 1);
    return true;
  }

  applyPlayerBlastDamage(projectile, impactPoint) {
    if (!impactPoint?.isVector3) return [];
    const blastRadius = Math.max(0, Number(projectile?.blastRadius) || 0);
    const baseDamage = Math.max(0, Number(projectile?.damage) || 0);
    if (blastRadius === 0 || baseDamage === 0) return [];

    const outcomes = [];
    for (const target of [...this.getCombatTargets()]) {
      const dx = target.position.x - impactPoint.x;
      const dz = target.position.z - impactPoint.z;
      const distance = Math.hypot(dx, dz);
      const reach = blastRadius + Math.max(0, Number(target.colliderRadius) || 0);
      if (distance > reach) continue;

      const falloff = THREE.MathUtils.clamp(1 - (distance / Math.max(0.001, reach)) * 0.62, 0.38, 1);
      const damage = Math.max(1, Math.round(baseDamage * falloff));
      const outcome = target.takeDamage(damage, impactPoint);
      this.spawnBloodSpatterVFX(target.position, this.getTargetBloodColor(target), 14);
      this.player.addHonor(target === this.activeBoss ? 100 : 35);
      outcomes.push({ target, damage, outcome });
      if (target !== this.activeBoss && (outcome?.killed || target.isDead)) {
        this.handleNpcDefeat(target, 105);
      }
    }

    audioSynth.playMineExplosion();
    this.spawnPlasmaShockwaveVFX(impactPoint);
    this.hud.showLogMessage(
      `FUSÉE DE POIGNET — ${outcomes.length} SIGNATURE${outcomes.length > 1 ? 'S' : ''} DANS LE SOUFFLE`,
      1500,
    );
    return outcomes;
  }

  spawnHiveEggClusters(count = HIVE_EGG_OFFSETS.length) {
    const safeCount = Math.max(0, Math.min(HIVE_EGG_OFFSETS.length, Math.floor(Number(count) || 0)));
    const encounterSockets = this.environment?.getEncounterSockets?.('egg', safeCount) ?? [];
    const nursery = (this.environment?.environmentProps ?? [])
      .find((prop) => prop.type === 'egg_nursery' || prop.id === 'hive-west-nursery');
    const nurseryPosition = nursery?.mesh?.position?.isVector3
      ? nursery.mesh.position.clone()
      : Array.isArray(nursery?.position)
        ? new THREE.Vector3(...nursery.position)
        : this.currentPlanet === 'hive_lv426'
          ? new THREE.Vector3(-82, 0, 2)
          : new THREE.Vector3(-36, 0, -54);
    const rotationY = (nursery?.mesh?.rotation?.y ?? Number(nursery?.rotation)) || 0;
    const fallbackPositions = HIVE_EGG_OFFSETS.slice(0, safeCount).map((offset) => (
      new THREE.Vector3(...offset)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY)
        .add(nurseryPosition)
    ));
    const eggPositions = (encounterSockets.length > 0 ? encounterSockets : fallbackPositions)
      .slice(0, safeCount)
      .map((socket) => socket.clone());
    eggPositions.forEach((position) => {
      this.eggClusters.push(new FacehuggerEggCluster(this.scene, position));
    });
    return eggPositions;
  }

  getProjectileCollisionRadius(projectile) {
    if (Number.isFinite(projectile?.collisionRadius)) {
      return Math.max(0.05, Number(projectile.collisionRadius));
    }
    if (projectile?.isNet) return 1.25;
    if (projectile?.type === 'wrist_rocket') return 0.62;
    if (['plasma', 'heavy_plasma', 'wolf_twin_plasma'].includes(projectile?.type)) return 0.85;
    if (['disc', 'shuriken'].includes(projectile?.type)) return 0.65;
    return 0.42;
  }

  resolveSegmentSphereImpact(start, end, center, radius) {
    if (!start?.isVector3 || !end?.isVector3 || !center?.isVector3) return null;
    const segment = end.clone().sub(start);
    const fromCenter = start.clone().sub(center);
    const radiusSquared = radius * radius;
    if (segment.lengthSq() <= 1e-9) {
      return fromCenter.lengthSq() <= radiusSquared ? start.clone() : null;
    }
    if (fromCenter.lengthSq() <= radiusSquared) return start.clone();

    const a = segment.lengthSq();
    const b = 2 * fromCenter.dot(segment);
    const c = fromCenter.lengthSq() - radiusSquared;
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) return null;
    const root = Math.sqrt(discriminant);
    const first = (-b - root) / (2 * a);
    const second = (-b + root) / (2 * a);
    const time = first >= 0 && first <= 1 ? first : second >= 0 && second <= 1 ? second : null;
    return time === null ? null : start.clone().addScaledVector(segment, time);
  }

  applyEnvironmentHazardSignal(contact) {
    if (!contact || contact.type !== 'environment_hazard') return false;

    const damage = Math.max(0, Number(contact.damage) || 0);
    if (damage > 0) this.player.takeDamage(damage);
    const statusDuration = Math.max(
      0.25,
      Number(contact.statusDuration ?? contact.duration) || 2.5,
    );
    const statuses = Array.isArray(contact.status) ? contact.status : [contact.status];
    statuses.filter(Boolean).forEach((status) => {
      if (status === 'corrosion') {
        this.player.applyAcidCorrosion?.();
      } else if (status === 'venom') {
        this.player.stamina = Math.max(0, (Number(this.player.stamina) || 0) - 18);
      } else if (status === 'energy_jam') {
        this.player.energy = Math.max(0, (Number(this.player.energy) || 0) - 14);
        if (this.player.isCloaked) this.player.toggleCloak?.();
      } else if (status === 'snare') {
        this.player.applyCombatStatus?.('snare', statusDuration);
      } else if (status === 'cloak_disruption' && this.player.isCloaked) {
        this.player.toggleCloak?.();
      }
    });
    if (contact.message) this.hud.showLogMessage(contact.message, 1600);
    return true;
  }

  processEnvironmentHazardSignals(signals = []) {
    let applied = 0;
    signals.forEach((signal) => {
      if (this.applyEnvironmentHazardSignal(signal)) applied += 1;
    });
    return applied;
  }

  startExtractionObjective(signal = {}, zone = null) {
    if (signal.mechanism !== 'evacuation_countdown') return null;
    const rawPosition = zone?.position ?? signal.position;
    const position = rawPosition?.isVector3
      ? rawPosition.clone()
      : new THREE.Vector3(Number(rawPosition?.x) || 0, Number(rawPosition?.y) || 0, Number(rawPosition?.z) || 0);
    const duration = Math.max(10, Math.min(120, Number(signal.countdownSeconds ?? signal.duration) || 45));
    const radius = Math.max(8, Number(signal.radius ?? zone?.radius) || 42);
    this.activeExtractionObjective = {
      sourceId: signal.sourceId ?? signal.id ?? 'gunnison-extraction-countdown',
      label: signal.label ?? 'Extraction compromise — compte à rebours',
      position,
      radius,
      duration,
      remaining: duration,
      zone,
    };
    this.extractionOutcome = null;
    const distance = this.player?.position?.isVector3
      ? Math.hypot(this.player.position.x - position.x, this.player.position.z - position.z)
      : 0;
    this.hud?.updateLevelEventObjective?.({ ...this.activeExtractionObjective, distance, state: 'active' });
    this.hud?.showLogMessage?.(`EXTRACTION COMPROMISE — REJOIGNEZ LA BALISE EN ${Math.ceil(duration)} S`, 3200);
    return this.activeExtractionObjective;
  }

  finishExtractionObjective(state) {
    const objective = this.activeExtractionObjective;
    if (!objective || !['secured', 'failed'].includes(state)) return null;
    if (objective.zone) objective.zone.remaining = Math.min(Number(objective.zone.remaining) || 0, 0.25);
    let honorAwarded = 0;
    if (state === 'secured') {
      const before = Number(this.player?.honorScore) || 0;
      this.player?.addHonor?.(250);
      honorAwarded = Math.max(0, (Number(this.player?.honorScore) || 0) - before);
      if (this.player) {
        this.player.energy = Math.min(Number(this.player.maxEnergy) || 100, (Number(this.player.energy) || 0) + 45);
        this.player.scanPulseTimer = Math.max(Number(this.player.scanPulseTimer) || 0, 10);
        this.player.scanPulseRadius = Math.max(Number(this.player.scanPulseRadius) || 0, 150);
      }
      this.hud?.showLogMessage?.(`EXTRACTION SÉCURISÉE — +${honorAwarded} HONNEUR · SCAN LONGUE PORTÉE`, 3200);
    } else {
      this.player?.takeDamage?.(48);
      if (this.player) this.player.energy = 0;
      if (this.player?.isCloaked) this.player.toggleCloak?.();
      this.player?.applyCombatStatus?.('suppression', 6);
      this.requestBossMigration?.(objective.position, { forced: true });
      this.hud?.showLogMessage?.('FRAPPE DE CONFINEMENT — 48 DÉGÂTS · ÉNERGIE ET CAMOUFLAGE NEUTRALISÉS', 3600);
    }
    this.extractionOutcome = {
      sourceId: objective.sourceId,
      state,
      honorAwarded,
      remaining: objective.remaining,
      displayRemaining: EXTRACTION_OUTCOME_DISPLAY_SECONDS,
    };
    this.activeExtractionObjective = null;
    this.hud?.updateLevelEventObjective?.({ label: objective.label, remaining: objective.remaining, distance: 0, state });
    return this.extractionOutcome;
  }

  updateExtractionObjective(delta) {
    const objective = this.activeExtractionObjective;
    if (!Number.isFinite(delta) || delta <= 0) return objective ?? this.extractionOutcome;
    if (!objective) {
      if (!this.extractionOutcome) return null;
      this.extractionOutcome.displayRemaining = Math.max(
        0,
        (Number(this.extractionOutcome.displayRemaining) || 0) - delta,
      );
      if (this.extractionOutcome.displayRemaining <= 0) {
        this.extractionOutcome = null;
        this.hud?.hideLevelEventObjective?.();
        return null;
      }
      return this.extractionOutcome;
    }
    objective.remaining = Math.max(0, objective.remaining - delta);
    const playerPosition = this.player?.position;
    const distance = playerPosition?.isVector3
      ? Math.hypot(playerPosition.x - objective.position.x, playerPosition.z - objective.position.z)
      : Infinity;
    if (distance <= objective.radius * 0.72) return this.finishExtractionObjective('secured');
    if (objective.remaining <= 0) return this.finishExtractionObjective('failed');
    this.hud?.updateLevelEventObjective?.({ ...objective, distance, state: 'active' });
    return objective;
  }

  clearExtractionObjective() {
    this.activeExtractionObjective = null;
    this.extractionOutcome = null;
    this.hud?.hideLevelEventObjective?.();
  }

  createScanMarker(target) {
    const marker = new THREE.Group();
    const targetRadius = Math.max(1.4, (target.colliderRadius ?? 1) * 1.35);
    const markerHeight = Math.max(3.2, targetRadius * 1.8);
    const materialOptions = {
      color: 0x55ffff,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    };

    const groundRing = new THREE.Mesh(
      new THREE.TorusGeometry(targetRadius, 0.12, 8, 32),
      new THREE.MeshBasicMaterial(materialOptions),
    );
    groundRing.rotation.x = Math.PI / 2;
    groundRing.position.y = 0.18;

    const upperRing = new THREE.Mesh(
      new THREE.TorusGeometry(targetRadius * 0.62, 0.07, 8, 24),
      new THREE.MeshBasicMaterial({ ...materialOptions, opacity: 0.72 }),
    );
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = markerHeight;

    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, markerHeight, 6),
      new THREE.MeshBasicMaterial({ ...materialOptions, opacity: 0.48 }),
    );
    beacon.position.y = markerHeight / 2;

    marker.add(groundRing, upperRing, beacon);
    marker.position.copy(target.position);
    marker.renderOrder = 40;
    marker.userData.scanMarker = true;
    marker.userData.phase = this.scanRevealedTargets?.size ?? 0;
    this.scene.add(marker);
    return marker;
  }

  clearVehicleScan() {
    if (!this.scanRevealedTargets) this.scanRevealedTargets = new Map();
    this.scanRevealedTargets.forEach((marker, target) => {
      if (target?.mesh?.userData) target.mesh.userData.scanRevealed = false;
      disposeObject3D(marker);
    });
    this.scanRevealedTargets.clear();
    this.vehicleScanOrigin = null;
    if (this.player) {
      this.player.scanPulseTimer = 0;
      this.player.scanPulseRadius = 0;
    }
  }

  updateVehicleScan(delta) {
    if (!this.scanRevealedTargets) this.scanRevealedTargets = new Map();
    if (!this.player || (this.player.scanPulseTimer ?? 0) <= 0 || !this.vehicleScanOrigin) {
      if (this.scanRevealedTargets.size > 0) this.clearVehicleScan();
      return 0;
    }

    const scanRadius = this.player.scanPulseRadius ?? 85;
    this.getCombatTargets().forEach((target) => {
      if (this.vehicleScanOrigin.distanceTo(target.position) > scanRadius) return;
      if (!this.scanRevealedTargets.has(target)) {
        this.scanRevealedTargets.set(target, this.createScanMarker(target));
        if (target.mesh?.userData) target.mesh.userData.scanRevealed = true;
      }
    });

    this.scanRevealedTargets.forEach((marker, target) => {
      if (target.isDead || !target.position?.isVector3) {
        if (target?.mesh?.userData) target.mesh.userData.scanRevealed = false;
        disposeObject3D(marker);
        this.scanRevealedTargets.delete(target);
        return;
      }
      marker.position.copy(target.position);
      marker.rotation.y += delta * 1.8;
      const pulse = 1 + Math.sin((this.player.scanPulseTimer + marker.userData.phase) * 5) * 0.08;
      marker.children[0]?.scale.setScalar(pulse);
      marker.children[1]?.scale.setScalar(2 - pulse);
    });

    this.player.scanPulseTimer = Math.max(0, this.player.scanPulseTimer - delta);
    const revealedCount = this.scanRevealedTargets.size;
    if (this.player.scanPulseTimer === 0) this.clearVehicleScan();
    return revealedCount;
  }

  activateVehicleScan({ scanDuration = 6, scanRadius = 85 } = {}) {
    this.clearVehicleScan();
    this.player.scanPulseTimer = Math.max(0.1, scanDuration);
    this.player.scanPulseRadius = Math.max(1, scanRadius);
    this.vehicleScanOrigin = this.player.position.clone();
    this.spawnScanPulseVFX(this.vehicleScanOrigin, this.player.scanPulseRadius);
    return this.updateVehicleScan(0);
  }

  dispatchPointOfInterestEffect(pointOfInterest) {
    return applyPointOfInterestEffect(pointOfInterest, {
      player: this.player,
      activateScan: (options) => this.activateVehicleScan(options),
    });
  }

  resolveCombatTarget() {
    const livingEnemies = (this.activeEnemies ?? [])
      .filter((enemy) => !enemy.isDead)
      .sort((a, b) => this.player.position.distanceTo(a.position) - this.player.position.distanceTo(b.position));
    const nearestEnemy = livingEnemies[0];
    if (nearestEnemy && this.player.position.distanceTo(nearestEnemy.position) <= 65) return nearestEnemy;
    return this.activeBoss?.isDead ? nearestEnemy ?? null : this.activeBoss;
  }

  getTargetBloodColor(target) {
    if ([
      'human_fireteam',
      'thermal_trapper',
      'grizzly_territorial',
      'jungle_scout',
      'jungle_gunner',
      'jungle_trapper',
      'era_viking_raider',
      'era_feudal_duelist',
      'era_wartime_pilot',
      'stargazer_rifleman',
      'stargazer_net_trapper',
      'weyland_expedition_guard',
      'gunnison_national_guard',
    ].includes(target?.type)) return 0xb41616;
    if (target?.type === 'combat_synthetic') return 0xf1f2df;
    return 0x00ff44;
  }

  handleNpcDefeat(enemy, honorBase = 90) {
    const index = (this.activeEnemies ?? []).indexOf(enemy);
    if (index < 0) return;
    const previousSummary = getDirectiveProgressSummary(this.directiveProgress);
    this.directiveProgress = recordDirectiveNpcDefeat(this.directiveProgress, enemy.type);
    const directiveSummary = this.refreshDirectiveHud();
    const directiveAdvanced = directiveSummary.completedObjectives > previousSummary.completedObjectives;
    const honorGained = this.player.addHonor(honorBase);
    const directiveSuffix = directiveAdvanced
      ? ` · DIRECTIVE ${directiveSummary.completedObjectives}/${directiveSummary.totalObjectives}`
      : '';
    this.hud.showLogMessage(
      `${enemy.name.toUpperCase()} NEUTRALISÉ · +${honorGained} PTS${directiveSuffix}`,
      directiveAdvanced ? 2600 : 1800,
    );
    enemy.dispose();
    this.activeEnemies.splice(index, 1);
    this.retryPendingDirectiveWaves();
  }

  spawnBiomeEcology() {
    const spawnPlan = this.environment?.getAmbientSpawnPlan?.() ?? [];
    for (const entry of spawnPlan) {
      const enemy = new HuntNPC(entry.type, {
        position: entry.position,
        ambient: true,
        territoryCenter: entry.territoryCenter,
        patrolRadius: entry.patrolRadius,
        aggressionRange: entry.aggressionRange,
        leashRadius: entry.leashRadius,
      });
      enemy.mesh.userData.ecologyTerritoryId = entry.id;
      enemy.mesh.userData.ecologyTerritoryLabel = entry.label;
      this.scene.add(enemy.mesh);
      enemy.setVisionMode(this.player.activeVisionMode);
      this.activeEnemies.push(enemy);
    }
    return spawnPlan.length;
  }

  spawnPreyMigration(signal) {
    const requestedCount = Math.max(1, Math.min(6, Math.floor(Number(signal.creatureCount) || 3)));
    const capacity = Math.max(0, 24 - (this.activeEnemies?.filter((enemy) => !enemy.isDead).length ?? 0));
    const count = Math.min(requestedCount, capacity);
    if (count === 0) return [];
    const raw = signal.position;
    const center = raw?.isVector3
      ? raw.clone()
      : Array.isArray(raw)
        ? new THREE.Vector3(...raw)
        : new THREE.Vector3(Number(raw?.x) || 0, Number(raw?.y) || 0, Number(raw?.z) || 0);
    const type = signal.creatureType ?? 'xeno_runner';
    const spawned = [];
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963229728653 + (Number(signal.ordinal) || 0) * 0.63;
      const preferred = center.clone().add(new THREE.Vector3(
        Math.cos(angle) * (6 + index * 2.5),
        0,
        Math.sin(angle) * (6 + index * 2.5),
      ));
      const position = this.environment?.getSafeSpawnPosition?.(preferred, { clearance: 3 }) ?? preferred;
      const enemy = new HuntNPC(type, {
        position,
        ambient: true,
        territoryCenter: center,
        patrolRadius: Math.max(22, Number(signal.radius) || 42),
        aggressionRange: 20,
        leashRadius: Math.max(65, Number(signal.radius) * 1.8 || 76),
      });
      enemy.mesh.userData.migratingPrey = true;
      this.scene.add(enemy.mesh);
      enemy.setVisionMode(this.player.activeVisionMode);
      this.activeEnemies.push(enemy);
      spawned.push(enemy);
    }
    return spawned;
  }

  beginTerritoryClash(signal) {
    const raw = signal.position;
    const position = raw?.isVector3
      ? raw.clone()
      : Array.isArray(raw)
        ? new THREE.Vector3(...raw)
        : new THREE.Vector3(Number(raw?.x) || 0, Number(raw?.y) || 0, Number(raw?.z) || 0);
    const livingEnemies = (this.activeEnemies ?? [])
      .filter((enemy) => !enemy.isDead)
      .sort((left, right) => left.position.distanceToSquared(position) - right.position.distanceToSquared(position));
    const requestedFactions = Array.isArray(signal.factions)
      ? [...new Set(signal.factions.filter((type) => typeof type === 'string' && type.length > 0))].slice(0, 2)
      : [];
    const factionGroups = requestedFactions.map((type) => livingEnemies
      .filter((enemy) => enemy.type === type)
      .slice(0, 3));
    const hasOpposingFactions = factionGroups.length === 2 && factionGroups.every((group) => group.length > 0);
    const participants = hasOpposingFactions ? factionGroups.flat() : livingEnemies.slice(0, 6);
    const factions = hasOpposingFactions
      ? requestedFactions
      : [...new Set(participants.map((enemy) => enemy.type))].slice(0, 2);
    participants.forEach((enemy) => enemy.hearMimicry?.(position, Number(signal.duration) || 18));
    const clash = {
      id: signal.sourceId ?? `clash-${this.activeTerritoryClashes.length + 1}`,
      position,
      factions,
      participants,
      remaining: Math.max(8, Number(signal.duration) || 18),
      pulseTimer: 1.4,
      pulseIndex: 0,
    };
    this.activeTerritoryClashes.push(clash);
    return clash;
  }

  updateTerritoryClashes(delta) {
    if (!Array.isArray(this.activeTerritoryClashes)) this.activeTerritoryClashes = [];
    for (const clash of this.activeTerritoryClashes) {
      clash.remaining -= delta;
      clash.pulseTimer -= delta;
      clash.participants = clash.participants.filter((enemy) => !enemy.isDead);
      if (clash.pulseTimer > 0 || clash.participants.length < 2) continue;
      clash.pulseTimer = 2;
      const factionPools = (clash.factions ?? [])
        .map((type) => clash.participants.filter((enemy) => enemy.type === type))
        .filter((group) => group.length > 0);
      const attackingPool = factionPools.length >= 2
        ? factionPools[clash.pulseIndex % 2]
        : clash.participants;
      const defendingPool = factionPools.length >= 2
        ? factionPools[(clash.pulseIndex + 1) % 2]
        : clash.participants.filter((enemy) => enemy.type !== attackingPool[clash.pulseIndex % attackingPool.length]?.type);
      const attacker = attackingPool[clash.pulseIndex % attackingPool.length];
      const victim = defendingPool[clash.pulseIndex % Math.max(1, defendingPool.length)];
      clash.pulseIndex += 1;
      if (!attacker || !victim || attacker.type === victim.type) continue;
      const outcome = victim.takeDamage?.(6);
      this.spawnBloodSpatterVFX?.(victim.position, this.getTargetBloodColor(victim), 4);
      if (outcome?.killed || victim.isDead) {
        const index = this.activeEnemies.indexOf(victim);
        if (index >= 0) this.activeEnemies.splice(index, 1);
        victim.dispose?.();
        this.hud?.showLogMessage?.(`${victim.name.toUpperCase()} ABATTU DANS UN CONFLIT DE TERRITOIRE`, 1500);
      }
    }
    this.activeTerritoryClashes = this.activeTerritoryClashes.filter((clash) => clash.remaining > 0);
    this.retryPendingDirectiveWaves();
    return this.activeTerritoryClashes.length;
  }

  configureBossTerritory() {
    this.bossMigrationRoute = this.environment?.getBossMigrationRoute?.() ?? [];
    this.bossMigrationIndex = 0;
    this.bossMigrationHold = 22;
    this.bossMigrationGrace = 0;
    this.bossMigrationHealthPhase = 0;
    this.bossRelocating = false;
    this.bossEngaged = false;
    this.bossMigrationForced = false;
    const firstNode = this.bossMigrationRoute[0];
    if (this.activeBoss?.position && firstNode) {
      this.activeBoss.arenaBoundary = Math.max(
        120,
        (Number(this.environment?.playableRadius) || 330) - (Number(this.activeBoss.colliderRadius) || 5) - 4,
      );
      this.activeBoss.position.copy(firstNode);
      this.activeBoss.mesh?.position?.copy(firstNode);
    }
    return this.bossMigrationRoute.length;
  }

  requestBossMigration(preferredPosition = null, { forced = false } = {}) {
    if (!this.activeBoss || this.bossMigrationRoute.length === 0) return false;
    const preferred = preferredPosition?.isVector3
      ? preferredPosition
      : Array.isArray(preferredPosition)
        ? new THREE.Vector3(...preferredPosition)
        : Number.isFinite(preferredPosition?.x) && Number.isFinite(preferredPosition?.z)
          ? new THREE.Vector3(preferredPosition.x, preferredPosition.y || 0, preferredPosition.z)
          : null;
    if (preferred) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      this.bossMigrationRoute.forEach((node, index) => {
        const distance = node.distanceToSquared(preferred);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      this.bossMigrationIndex = nearestIndex === this.bossMigrationIndex
        ? (nearestIndex + 1) % this.bossMigrationRoute.length
        : nearestIndex;
    } else {
      this.bossMigrationIndex = (this.bossMigrationIndex + 1) % this.bossMigrationRoute.length;
    }
    this.bossRelocating = true;
    this.bossEngaged = false;
    this.bossMigrationForced = forced === true;
    this.bossMigrationGrace = 7;
    return true;
  }

  updateBossTerritory(delta) {
    const boss = this.activeBoss;
    if (!boss) return false;
    if (boss.isDead) {
      boss.update(delta, this.player.position, this.player.isCloaked);
      return true;
    }
    this.bossMigrationGrace = Math.max(0, this.bossMigrationGrace - delta);
    const maxHealth = Math.max(1, Number(boss.maxHealth) || Number(boss.health) || 1);
    const healthRatio = Math.max(0, Number(boss.health) || 0) / maxHealth;
    const nextHealthPhase = healthRatio <= 0.38 ? 2 : healthRatio <= 0.7 ? 1 : 0;
    if (nextHealthPhase > this.bossMigrationHealthPhase && !this.bossRelocating) {
      this.bossMigrationHealthPhase = nextHealthPhase;
      this.requestBossMigration(null, { forced: true });
      this.hud?.showLogMessage?.('LA CIBLE APEX ROMPT LE COMBAT ET MIGRE VERS UN AUTRE TERRITOIRE', 2600);
    }

    const distanceToPlayer = boss.position.distanceTo(this.player.position);
    const detectionRange = this.player.isCloaked ? 72 : 135;
    if (this.bossRelocating && !this.bossMigrationForced && distanceToPlayer <= 46) {
      this.bossRelocating = false;
      this.bossEngaged = true;
      this.bossMigrationForced = false;
    } else if (!this.bossRelocating && (
      this.bossEngaged
      || distanceToPlayer <= detectionRange
      || (healthRatio < 1 && this.bossMigrationGrace <= 0 && distanceToPlayer <= 210)
    )) {
      if (!this.bossEngaged) this.hud?.showLogMessage?.('LA CIBLE APEX A DÉTECTÉ LE CHASSEUR', 1500);
      this.bossEngaged = true;
    }
    if (this.bossEngaged && !this.bossRelocating) {
      boss.update(delta, this.player.position, this.player.isCloaked);
      return true;
    }
    boss.tickTransientState?.(delta);

    if (!this.bossRelocating) {
      this.bossMigrationHold -= delta;
      if (this.bossMigrationHold > 0) return true;
      this.requestBossMigration();
    }
    const target = this.bossMigrationRoute[this.bossMigrationIndex];
    if (!target) return true;
    const direction = target.clone().sub(boss.position);
    direction.y = 0;
    const remaining = direction.length();
    if (remaining <= 7) {
      boss.position.copy(target);
      boss.mesh?.position?.copy(target);
      this.bossRelocating = false;
      this.bossMigrationForced = false;
      this.bossMigrationHold = 18;
      this.bossMigrationGrace = 8;
      return true;
    }
    const navigationDirection = this.environment?.getNavigationDirection?.(
      boss.position,
      target,
      (boss.colliderRadius ?? 5) + 1,
    );
    if (navigationDirection?.isVector3 && navigationDirection.lengthSq() > 0.0001) {
      direction.copy(navigationDirection).normalize();
    } else {
      direction.normalize();
    }
    const step = Math.min(remaining, delta * 9.5);
    boss.position.addScaledVector(direction, step);
    boss.position.y = this.environment?.sampleHeight?.(boss.position) ?? boss.position.y;
    boss.mesh?.position?.copy(boss.position);
    if (boss.mesh?.rotation) boss.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    boss.aiState = 'migration';
    boss.isAttacking = false;
    return true;
  }

  spawnEncounterNpc(signal) {
    const livingCount = (this.activeEnemies ?? []).filter((enemy) => !enemy.isDead).length;
    if (livingCount >= MAX_ACTIVE_HUNT_NPCS) return null;
    const type = resolveHuntNpcType(signal.enemyType);
    if (!type) {
      console.warn(`Type de rencontre ignoré: ${signal.enemyType ?? 'absent'}`);
      return null;
    }
    const preferredPosition = signal.position?.isVector3
      ? signal.position.clone()
      : Array.isArray(signal.position)
        ? new THREE.Vector3(...signal.position)
        : Number.isFinite(signal.position?.x) && Number.isFinite(signal.position?.z)
          ? new THREE.Vector3(
            Number(signal.position.x),
            Number(signal.position.y) || 0,
            Number(signal.position.z),
          )
          : this.player.position.clone().add(new THREE.Vector3(18, 0, -18));
    const groupIndex = Math.max(0, Number(signal.groupIndex) || 0);
    if (groupIndex > 0) {
      const angle = groupIndex * 2.399963;
      const radius = 3.2 + groupIndex * 0.9;
      preferredPosition.add(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const spawnPosition = this.environment?.getSafeSpawnPosition?.(
      preferredPosition,
      { clearance: 3 },
    ) ?? preferredPosition;
    const enemy = new HuntNPC(type, { position: spawnPosition });
    this.scene.add(enemy.mesh);
    enemy.setVisionMode(this.player.activeVisionMode);
    this.activeEnemies.push(enemy);
    this.hud.showLogMessage(`ÉVÉNEMENT: ${enemy.name.toUpperCase()} ENTRE DANS LA CHASSE`, 2200);
    return enemy;
  }

  spawnEncounterGroup(signal) {
    const enemyTypes = Array.isArray(signal.enemyTypes)
      ? signal.enemyTypes.filter((type) => typeof type === 'string')
      : [];
    const count = Math.max(0, Math.min(
      enemyTypes.length,
      MAX_ACTIVE_HUNT_NPCS - (this.activeEnemies ?? []).filter((enemy) => !enemy.isDead).length,
    ));
    return enemyTypes.slice(0, count)
      .map((enemyType, groupIndex) => this.spawnEncounterNpc({
        ...signal,
        enemyType,
        groupIndex: (Math.max(0, Number(signal.groupIndexOffset) || 0) + groupIndex),
      }))
      .filter(Boolean);
  }

  getDirectiveWaveKey(signal = {}) {
    const explicitId = [signal.sourceId, signal.id]
      .find((value) => typeof value === 'string' && value.trim().length > 0);
    if (explicitId) return explicitId.trim();
    const enemyTypes = Array.isArray(signal.enemyTypes)
      ? signal.enemyTypes.filter((type) => typeof type === 'string').join(',')
      : '';
    return [
      signal.directiveId ?? this.currentDirectiveId ?? 'standard_hunt',
      signal.objectiveId ?? 'wave',
      Number(signal.ordinal) || 0,
      enemyTypes,
    ].join(':');
  }

  enqueueDirectiveWave(signal, enemyTypes, spawnedCount = 0) {
    if (!Array.isArray(this.pendingDirectiveWaves)) this.pendingDirectiveWaves = [];
    const remainingTypes = Array.isArray(enemyTypes) ? enemyTypes.filter(Boolean) : [];
    if (remainingTypes.length === 0) return null;
    const key = this.getDirectiveWaveKey(signal);
    const existing = this.pendingDirectiveWaves.find((entry) => entry.key === key);
    if (existing) return existing;
    if (this.pendingDirectiveWaves.length >= MAX_PENDING_DIRECTIVE_WAVES) {
      this.hud?.showLogMessage?.('FILE DE RENFORTS SATURÉE — VAGUE REJETÉE', 1800);
      return null;
    }

    const rawPosition = signal.position;
    const position = rawPosition?.isVector3
      ? rawPosition.clone()
      : Array.isArray(rawPosition)
        ? [...rawPosition]
        : rawPosition && typeof rawPosition === 'object'
          ? { ...rawPosition }
          : rawPosition;
    const entry = {
      key,
      signal: { ...signal, position },
      enemyTypes: [...remainingTypes],
      spawnedCount: Math.max(0, Number(spawnedCount) || 0),
    };
    this.pendingDirectiveWaves.push(entry);
    return entry;
  }

  processDirectiveWave(signal) {
    if (!Array.isArray(this.pendingDirectiveWaves)) this.pendingDirectiveWaves = [];
    const key = this.getDirectiveWaveKey(signal);
    const pending = this.pendingDirectiveWaves.find((entry) => entry.key === key);
    if (pending) {
      return { spawned: [], deferred: pending.enemyTypes.length, queued: true, duplicate: true };
    }

    const enemyTypes = Array.isArray(signal.enemyTypes)
      ? signal.enemyTypes.filter((type) => typeof type === 'string' && resolveHuntNpcType(type))
      : [];
    const capacity = Math.max(
      0,
      MAX_ACTIVE_HUNT_NPCS - (this.activeEnemies ?? []).filter((enemy) => !enemy.isDead).length,
    );
    const spawnCount = Math.min(capacity, enemyTypes.length);
    const spawned = this.spawnEncounterGroup({
      ...signal,
      enemyTypes: enemyTypes.slice(0, spawnCount),
      groupIndexOffset: 0,
    });
    const remainingTypes = enemyTypes.slice(spawnCount);
    const queued = remainingTypes.length > 0
      ? Boolean(this.enqueueDirectiveWave(signal, remainingTypes, spawnCount))
      : false;
    return { spawned, deferred: queued ? remainingTypes.length : 0, queued, duplicate: false };
  }

  retryPendingDirectiveWaves() {
    if (!Array.isArray(this.pendingDirectiveWaves)) this.pendingDirectiveWaves = [];
    const spawned = [];
    while (this.pendingDirectiveWaves.length > 0) {
      const livingCount = (this.activeEnemies ?? []).filter((enemy) => !enemy.isDead).length;
      const capacity = Math.max(0, MAX_ACTIVE_HUNT_NPCS - livingCount);
      if (capacity === 0) break;

      const pending = this.pendingDirectiveWaves[0];
      const spawnCount = Math.min(capacity, pending.enemyTypes.length);
      const batchTypes = pending.enemyTypes.slice(0, spawnCount);
      const batch = this.spawnEncounterGroup({
        ...pending.signal,
        enemyTypes: batchTypes,
        groupIndexOffset: pending.spawnedCount,
      });
      spawned.push(...batch);
      pending.enemyTypes.splice(0, spawnCount);
      pending.spawnedCount += spawnCount;
      if (pending.enemyTypes.length === 0) this.pendingDirectiveWaves.shift();
      if (spawnCount === 0) break;
    }
    if (spawned.length > 0) {
      this.hud?.showLogMessage?.(
        `RENFORTS DIFFÉRÉS — ${spawned.length} SIGNATURE${spawned.length > 1 ? 'S' : ''} DÉPLOYÉE${spawned.length > 1 ? 'S' : ''}`,
        1800,
      );
    }
    return spawned;
  }

  spawnEnemyTracer(origin, target, color = 0xffb84a) {
    if (!origin?.isVector3 || !target?.isVector3) return;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      origin.clone(),
      target.clone(),
    ]);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const tracer = new THREE.Line(geometry, material);
    this.scene.add(tracer);
    this.vfxParticles.push({ mesh: tracer, isTracer: true, lifetime: 0.16 });
  }

  processEncounterSignals(signals) {
    signals.forEach((signal) => {
      if (signal.type === 'pyramid_shift') {
        const shifted = this.environment?.triggerPyramidShift?.({
          ...signal,
          id: signal.sourceId,
        });
        this.hud?.showLogMessage?.(
          shifted === false
            ? 'PYRAMIDE: CYCLE ARCHITECTURAL DÉJÀ EN COURS'
            : `PYRAMIDE: ${signal.label?.toUpperCase() ?? 'LES COULOIRS SE RECONFIGURENT'}`,
          2800,
        );
      } else if (signal.type === 'localized_event') {
        const zone = this.environment?.startLocalizedEvent?.({
          ...signal,
          id: signal.sourceId,
        });
        this.startExtractionObjective(signal, zone);
        this.hud?.showLogMessage?.(`ÉVÉNEMENT LOCAL: ${signal.label?.toUpperCase() ?? 'ANOMALIE DÉTECTÉE'}`, 2400);
      } else if (signal.type === 'prey_migration') {
        const spawned = this.spawnPreyMigration(signal);
        this.hud?.showLogMessage?.(`MIGRATION: ${spawned.length} FORMES DE VIE TRAVERSENT LE SECTEUR`, 2200);
      } else if (signal.type === 'territory_clash') {
        this.beginTerritoryClash(signal);
        this.hud?.showLogMessage?.(`ÉCOSYSTÈME: ${signal.label?.toUpperCase() ?? 'CONFLIT DE TERRITOIRES'}`, 2400);
      } else if (signal.type === 'boss_migration') {
        this.requestBossMigration(signal.position, { forced: true });
        this.hud?.showLogMessage?.('PISTE APEX: LA CIBLE CHANGE DE TERRITOIRE', 2400);
      } else if (signal.type === 'spawn_enemy_group') {
        const { spawned, deferred, duplicate } = this.processDirectiveWave(signal);
        const directive = getHuntDirective(signal.directiveId ?? this.currentDirectiveId);
        const deferredSuffix = deferred > 0 ? ` · ${deferred} EN ATTENTE` : '';
        const message = duplicate
          ? `${directive.shortLabel}: VAGUE DÉJÀ EN ATTENTE`
          : `${directive.shortLabel}: ${spawned.length} NOUVELLE${spawned.length > 1 ? 'S' : ''} SIGNATURE${spawned.length > 1 ? 'S' : ''}${deferredSuffix}`;
        this.hud?.showLogMessage?.(
          message,
          2400,
        );
      } else if (signal.type === 'spawn_enemy') {
        this.spawnEncounterNpc(signal);
      } else if (signal.type === 'flyby') {
        this.hud.showLogMessage(
          signal.vehicleType === 'avp_ritual_ship'
            ? 'SURVOL YAUTJA: VAISSEAU DU RITE EN APPROCHE'
            : signal.vehicleType === 'wolf_cleaner_ship'
              ? 'SURVOL YAUTJA: APPAREIL CLEANER DE WOLF EN APPROCHE'
              : 'SURVOL YAUTJA: NAVETTE DE CHASSE EN APPROCHE',
          2200,
        );
      } else if (signal.type === 'spawn_cache') {
        this.hud.showLogMessage(
          signal.cacheType === 'ritual_weapon_pod'
            ? 'POD D’ARMES DU BLOODING DÉVERROUILLÉ · APPROCHEZ ET APPUYEZ SUR [E]'
            : 'CONTENEUR DE CHASSE LARGUÉ · APPROCHEZ ET APPUYEZ SUR [E]',
          2600,
        );
      } else if (signal.type === 'hazard') {
        this.activeHazard = signal.hazardType;
        this.hazardPulseTimer = 0;
        this.environment?.setWeatherEvent?.(signal.hazardType);
        const label = signal.hazardType === 'rain'
          ? this.currentPlanet === 'bouvetoya_pyramid'
            ? 'BLIZZARD RÉVÉLATEUR'
            : 'PLUIE RÉVÉLATRICE'
          : 'TEMPÊTE THERMIQUE';
        this.hud.showLogMessage(`ÉVÉNEMENT DE NIVEAU: ${label}`, 2600);
      } else if (signal.type === 'hazard_end') {
        this.activeHazard = null;
        this.hazardPulseTimer = 0;
        this.environment?.clearWeatherEvent?.();
        this.hud.showLogMessage('PERTURBATION ENVIRONNEMENTALE DISSIPÉE', 1800);
      }
    });
  }

  updateEncounterContent(delta) {
    this.retryPendingDirectiveWaves();
    const scheduledSignals = this.eventDirector?.update(delta, {
      player: this.player,
      boss: this.activeBoss,
      environment: this.environment,
      reducedMotion: this.settings?.reducedMotion === true,
    }) ?? [];
    this.processEncounterSignals(scheduledSignals);
    this.updateExtractionObjective(delta);
    this.eventDirector?.drainSignals();
    this.updateTerritoryClashes(delta);

    for (const enemy of [...(this.activeEnemies ?? [])]) {
      const signals = enemy.update(delta, { player: this.player, allies: this.activeEnemies });
      const terrainHeight = this.environment?.sampleHeight?.(enemy.position);
      if (Number.isFinite(terrainHeight)) enemy.position.y = terrainHeight;
      enemy.mesh?.position?.copy(enemy.position);
      signals.forEach((signal) => {
        if (signal.type === 'attack_player') {
          if (signal.projectile) {
            const projectileOrigin = signal.projectile.origin?.isVector3
              ? signal.projectile.origin
              : enemy.position?.clone?.();
            const projectileTarget = this.player.position.clone().add(new THREE.Vector3(0, 2.4, 0));
            const coverImpact = projectileOrigin
              ? this.environment?.resolveProjectileCoverImpact?.(
                projectileOrigin,
                projectileTarget,
                signal.projectile.radius ?? 0.25,
              )
              : null;
            if (projectileOrigin) {
              this.spawnEnemyTracer(
                projectileOrigin,
                coverImpact?.point?.isVector3 ? coverImpact.point : projectileTarget,
                ['combat_synthetic', 'thermal_trapper'].includes(enemy.type) ? 0x55ddff : 0xffc34d,
              );
            }
            if (coverImpact?.point?.isVector3) return;
          }

          const burstCount = signal.projectile
            ? Math.max(1, Math.min(6, Math.round(Number(signal.burstCount) || 1)))
            : 1;
          for (let round = 0; round < burstCount; round += 1) {
            this.player.takeDamage(signal.damage);
          }
          if (signal.status === 'corrosion' || signal.damageType === 'corrosion') this.player.applyAcidCorrosion();
          const applyCombatStatus = (status, duration) => {
            if (this.player.applyCombatStatus?.(status, duration) === true) return true;
            const seconds = Math.max(0, Number(duration) || 0);
            if (seconds === 0) return false;
            this.player.combatStatusTimers ??= {};
            this.player.combatStatusTimers[status] = Math.max(
              Number(this.player.combatStatusTimers[status]) || 0,
              seconds,
            );
            return true;
          };
          if (signal.status === 'snare') {
            applyCombatStatus('snare', signal.snareDuration ?? signal.statusDuration ?? 3.5);
            this.hud.showLogMessage('FILET DE CONFINEMENT — MOBILITÉ ENTRAVÉE', 1500);
          }
          if (signal.status === 'disorientation') {
            applyCombatStatus('disorientation', signal.statusDuration ?? 3.2);
            this.hud.showLogMessage('ATTAQUE FACIALE — ORIENTATION PERTURBÉE', 1500);
          }
          if (signal.suppression === true) {
            applyCombatStatus('suppression', signal.suppressionDuration ?? 2.5);
            this.hud.showLogMessage(`TIR DE SUPPRESSION — RAFALE ×${burstCount}`, 1400);
          }
          if (Number(signal.energyDrain) > 0) {
            this.player.energy = Math.max(0, this.player.energy - Number(signal.energyDrain));
          }
          if (signal.status === 'energy_jam') {
            if (this.player.isCloaked) this.player.toggleCloak();
            this.hud.showLogMessage('BROUILLAGE THERMIQUE — ÉNERGIE DRAINÉE, CAMOUFLAGE ROMPU', 1800);
          }
          if (signal.secondaryStatus === 'venom') {
            this.player.stamina = Math.max(0, this.player.stamina - 24);
            this.hud.showLogMessage('VENIN DE GENNA — ENDURANCE CONTAMINÉE', 1600);
          }
          if (signal.knockback > 0) {
            const push = this.player.position.clone().sub(enemy.position);
            push.y = 0;
            if (push.lengthSq() > 0.0001) this.player.position.addScaledVector(push.normalize(), signal.knockback);
          }
          this.spawnBloodSpatterVFX(this.player.position, 0xffff00, 8);
        } else if (signal.type === 'telegraph') {
          this.hud.showLogMessage(signal.message?.toUpperCase() ?? 'CHARGE LOURDE DÉTECTÉE', 900);
        } else if (signal.type === 'reveal_cloak') {
          if (this.player.isCloaked) this.player.toggleCloak();
          this.hud.showLogMessage('LES MOLOSSES ONT RÉVÉLÉ LE CAMOUFLAGE !', 1700);
        } else if (signal.type === 'log') {
          this.hud.showLogMessage(signal.message, 1400);
        }
      });
    }

    if (!this.activeHazard) return;
    this.hazardPulseTimer -= delta;
    if (this.hazardPulseTimer > 0) return;
    this.hazardPulseTimer = 3;
    if (this.activeHazard === 'rain') {
      this.player.energy = Math.max(0, this.player.energy - 12);
      if (this.player.isCloaked) {
        this.player.toggleCloak();
        this.hud.showLogMessage('LA PLUIE COURT-CIRCUITE LE CAMOUFLAGE !', 1700);
      }
    } else {
      this.player.energy = Math.max(0, this.player.energy - 8);
      this.player.takeDamage(4);
      this.hud.showLogMessage('TEMPÊTE THERMIQUE · -8 ÉNERGIE / -4 SANTÉ', 1300);
    }
  }

  performAttack() {
    const hasLivingEncounterEnemy = (this.activeEnemies ?? []).some((enemy) => !enemy.isDead);
    if (
      !this.isGameStarted
      || this.isPaused
      || this.gameState !== 'HUNT'
      || !this.activeBoss
      || (this.activeBoss.isDead && !hasLivingEncounterEnemy)
      || this.isPlayerCombatDisabled()
    ) return;
    if (!isWeaponEquipped(this.activeHuntLoadout, this.player.selectedWeapon)) {
      this.player.selectedWeapon = 1;
      this.hud.showLogMessage('SÉCURITÉ DU HARNAIS — ARME NON EMBARQUÉE REFUSÉE', 1800);
      return;
    }

    const target = this.resolveCombatTarget();
    if (!target) return;
    const targetHeight = target === this.activeBoss ? 3.5 : 1.2;
    const targetPos = target.getAimPoint?.()
      ?? target.position.clone().add(new THREE.Vector3(0, targetHeight, 0));
    const launchPosition = this.player.position.clone();
    const perchAnchor = this.player.currentPerchNode?.clone?.() ?? launchPosition.clone();
    const result = this.player.attack(targetPos);
    if (!['death_from_above', 'wristblades', 'whip_slash', 'father_sword'].includes(result)) return;

    const isDeathFromAbove = result === 'death_from_above';
    const distance = isDeathFromAbove
      ? Math.hypot(
        launchPosition.x - target.position.x,
        launchPosition.z - target.position.z,
      )
      : this.player.position.distanceTo(target.position);
    const wristbladeRangeMultiplier = result === 'wristblades'
      ? this.player.wristbladeRangeMultiplier ?? 1
      : 1;
    const effectiveMeleeDistance = distance / wristbladeRangeMultiplier;
    const strike = resolveMeleeStrike(this.player.selectedWeapon, effectiveMeleeDistance, {
      fromCanopy: isDeathFromAbove,
    });

    const placePlayerSafely = (preferred) => {
      const fallback = preferred.clone();
      fallback.y = 0;
      const landing = this.environment?.getSafeSpawnPosition?.(
        preferred,
        { clearance: PLAYER_COLLIDER_RADIUS + 0.5 },
      ) ?? fallback;
      this.player.position.copy(landing?.isVector3 ? landing : fallback);
      this.player.currentPerchNode = null;
    };

    if (!strike.hit) {
      if (isDeathFromAbove) placePlayerSafely(perchAnchor);
      this.hud.showLogMessage('ATTAQUE DE MÊLÉE HORS DE PORTÉE', 1200);
      return;
    }

    if (isDeathFromAbove) {
      const targetRadius = target.colliderRadius ?? (target === this.activeBoss ? 5 : 0.8);
      const dx = launchPosition.x - target.position.x;
      const dz = launchPosition.z - target.position.z;
      const launchDistance = Math.hypot(dx, dz);
      const normalX = launchDistance > 0.01 ? dx / launchDistance : 1;
      const normalZ = launchDistance > 0.01 ? dz / launchDistance : 0;
      const landingDistance = targetRadius + PLAYER_COLLIDER_RADIUS + 1;
      const preferredLanding = new THREE.Vector3(
        target.position.x + (normalX * landingDistance),
        0,
        target.position.z + (normalZ * landingDistance),
      );
      placePlayerSafely(preferredLanding);
    }

    const scaledDamage = Math.round(strike.damage * (this.player.meleeDamageMultiplier ?? 1));
    const outcome = target.takeDamage(scaledDamage, this.player.position);
    this.spawnBloodSpatterVFX(targetPos, this.getTargetBloodColor(target), isDeathFromAbove ? 30 : 15);
    this.player.addHonor(strike.honor);
    if (target !== this.activeBoss && (outcome?.killed || target.isDead)) this.handleNpcDefeat(target);

    if (isDeathFromAbove) {
      this.hud.showLogMessage('ATTAQUE EN PIQUÉ EXÉCUTÉE! +' + scaledDamage + ' DÉGÂTS!');
    }
  }

  resolveFacehuggerQTE(success) {
    if (!this.player.inQTE) return false;
    const honorBefore = Number(this.player.honorScore) || 0;
    const resolved = this.player.resolveQTE(success);
    this.player.qteTimer = 0;
    this.activeFacehuggerCluster?.neutralizeFacehugger();
    this.activeFacehuggerCluster = null;
    if (success && resolved) {
      const honorGained = Math.max(0, (Number(this.player.honorScore) || 0) - honorBefore);
      this.hud.showLogMessage(`FACEHUGGER TRANCHÉ AVEC SUCCÈS! +${honorGained} PTS`);
    }
    return resolved;
  }

  requestPointerLockSafely() {
    if (
      typeof this.container.requestPointerLock !== 'function'
      || document.pointerLockElement === this.container
      || navigator.userActivation?.isActive === false
    ) return false;

    try {
      this.container.requestPointerLock()?.catch?.(() => { this.isPointerLocked = false; });
      return true;
    } catch {
      this.isPointerLocked = false;
      return false;
    }
  }

  initEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    document.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked || !this.isGameStarted || this.isPaused) return;
      this.cameraYaw -= e.movementX * 0.0025;
      this.cameraPitch -= e.movementY * 0.0025;
      this.cameraPitch = Math.max(-0.6, Math.min(0.8, this.cameraPitch));
    });

    this.container.addEventListener('click', () => {
      const canCaptureCamera = this.gameState === 'HUNT'
        || (this.gameState === 'HUB' && this.isHubExploring);
      if (this.isGameStarted && canCaptureCamera && !this.isPaused && !this.isPointerLocked) {
        this.requestPointerLockSafely();
      }
    });
    this.container.addEventListener('contextmenu', (event) => event.preventDefault());

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.container);
    });

    this.container.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      if (this.isHuntFlowActive() && !this.isPaused) this.setPaused(true);
      showFatalGameError('Le contexte WebGL a été perdu. Rechargez le jeu pour reconstruire proprement le vaisseau, les textures et la chasse en cours.');
    });
    this.container.addEventListener('webglcontextrestored', () => {
      const message = document.getElementById('fatal-error-message');
      if (message) message.textContent = 'Le contexte graphique répond de nouveau. Rechargez afin de restaurer toutes les ressources 3D dans un état vérifié.';
    });

    this.container.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch' || this.gameState !== 'HUNT' || this.isPaused) return;
      this.touchLookPointerId = event.pointerId;
      this.touchLookPosition = { x: event.clientX, y: event.clientY };
      try {
        this.container.setPointerCapture?.(event.pointerId);
      } catch {
        // Le glissement tactile reste facultatif si la capture est refusée.
      }
    });
    this.container.addEventListener('pointermove', (event) => {
      if (event.pointerId !== this.touchLookPointerId || !this.touchLookPosition || this.isPaused) return;
      const deltaX = event.clientX - this.touchLookPosition.x;
      const deltaY = event.clientY - this.touchLookPosition.y;
      this.cameraYaw -= deltaX * 0.008;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch - (deltaY * 0.006), -0.6, 0.8);
      this.touchLookPosition = { x: event.clientX, y: event.clientY };
      event.preventDefault?.();
    });
    const releaseTouchLook = (event) => {
      if (event.pointerId !== this.touchLookPointerId) return;
      this.touchLookPointerId = null;
      this.touchLookPosition = null;
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((eventName) => {
      this.container.addEventListener(eventName, releaseTouchLook);
    });

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const dialog = this.getVisibleDialog();
      if (!dialog) return;
      const controls = [...dialog.querySelectorAll('button, select, input, [tabindex]')]
        .filter((element) => !element.disabled
          && !element.hidden
          && !element.closest('.hidden')
          && element.tabIndex >= 0);
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (!this.isGameStarted || this.gameState !== 'HUNT' || this.isPaused) return;
      audioSynth.init();

      if (this.player.inQTE) {
        if (e.button === 2 || e.button === 0) {
          e.preventDefault();
          this.resolveFacehuggerQTE(true);
        }
        return;
      }

      if (e.button === 2 && this.player.hasScopeZoom) {
        e.preventDefault();
        this.isScopeZooming = true;
        return;
      }

      if (e.button === 0) this.performAttack();
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 2) this.isScopeZooming = false;
    });

    const pauseForBackground = () => {
      this.isScopeZooming = false;
      this.resetKeyboardInput();
      this.gamepadAxes = { x: 0, z: 0 };
      this.resetHubTouchInput();
      this.resetHuntTouchInput();
      if (this.isHuntFlowActive() && !this.isPaused && !this.huntResultShown) this.setPaused(true);
    };
    window.addEventListener('blur', pauseForBackground);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseForBackground();
    });
  }

  spawnBloodSpatterVFX(pos, colorHex, count = 20) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        Math.random() * 12 + 2,
        (Math.random() - 0.5) * 15
      ));
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: colorHex, size: 0.8, transparent: true, opacity: 0.9 });
    const pMesh = new THREE.Points(geo, mat);

    this.scene.add(pMesh);
    this.vfxParticles.push({ mesh: pMesh, velocities, lifetime: 0.8 });
  }

  spawnPlasmaShockwaveVFX(pos) {
    const ringGeo = new THREE.RingGeometry(0.5, 1.2, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
    const ring = new THREE.Mesh(ringGeo, ringMat);

    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(pos).add(new THREE.Vector3(0, 0.2, 0));

    this.scene.add(ring);
    this.vfxParticles.push({ mesh: ring, isShockwave: true, lifetime: 0.5 });
  }

  spawnScanPulseVFX(pos, radius = 85) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.92, 1, 48),
      new THREE.MeshBasicMaterial({
        color: 0x55ffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(pos).add(new THREE.Vector3(0, 0.24, 0));
    this.scene.add(ring);
    this.vfxParticles.push({ mesh: ring, isScanPulse: true, lifetime: 0.9, totalLifetime: 0.9, radius });
  }

  updateVFX(delta) {
    for (let i = this.vfxParticles.length - 1; i >= 0; i--) {
      const v = this.vfxParticles[i];
      v.lifetime -= delta;

      if (v.isScanPulse) {
        const progress = 1 - Math.max(0, v.lifetime) / v.totalLifetime;
        v.mesh.scale.setScalar(Math.max(0.01, progress * v.radius));
        v.mesh.material.opacity = Math.max(0, v.lifetime / v.totalLifetime) * 0.82;
      } else if (v.isShockwave) {
        v.mesh.scale.addScalar(delta * 25.0);
        v.mesh.material.opacity = Math.max(0, v.lifetime / 0.5);
      } else if (v.isTracer) {
        v.mesh.material.opacity = Math.max(0, v.lifetime / 0.16);
      } else if (v.velocities) {
        const pos = v.mesh.geometry.attributes.position;
        for (let p = 0; p < v.velocities.length; p++) {
          pos.array[p * 3] += v.velocities[p].x * delta;
          pos.array[p * 3 + 1] += v.velocities[p].y * delta;
          pos.array[p * 3 + 2] += v.velocities[p].z * delta;
          v.velocities[p].y -= delta * 25.0;
        }
        pos.needsUpdate = true;
        v.mesh.material.opacity = Math.max(0, v.lifetime / 0.8);
      }

      if (v.lifetime <= 0) {
        disposeObject3D(v.mesh);
        this.vfxParticles.splice(i, 1);
      }
    }
  }

  setupMissionTabs() {
    const tabKeys = ['missions', 'loadout', 'armory', 'codex', 'options'];
    const tabs = tabKeys.map((key) => ({
      key,
      button: document.getElementById(`tab-btn-${key}`),
      panel: document.getElementById(`tab-content-${key}`),
    })).filter(({ button, panel }) => button && panel);
    if (tabs.length === 0) return;

    const activateTab = (activeKey, moveFocus = false) => {
      tabs.forEach(({ key, button, panel }) => {
        const isActive = key === activeKey;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.tabIndex = isActive ? 0 : -1;
        panel.classList.toggle('active', isActive);
        panel.classList.toggle('hidden', !isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
      });

      if (moveFocus) tabs.find(({ key }) => key === activeKey)?.button.focus();
    };

    this.activateMissionTab = activateTab;

    tabs.forEach(({ key, button }, index) => {
      button.addEventListener('click', () => activateTab(key));
      button.addEventListener('keydown', (event) => {
        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        activateTab(tabs[nextIndex].key, true);
      });
    });

    const initialTab = tabs.find(({ button }) => button.getAttribute('aria-selected') === 'true')
      ?? tabs.find(({ button }) => button.classList.contains('active'))
      ?? tabs[0];
    activateTab(initialTab.key);
  }

  setupUIButtons() {
    document.getElementById('btn-start-game').addEventListener('click', () => {
      document.getElementById('controls-modal').classList.add('hidden');
      this.isGameStarted = true;
      audioSynth.init();
      audioSynth.playYautjaClick();
      this.showMissionSelectionModal();
    });

    document.getElementById('btn-restart-game').addEventListener('click', () => {
      document.getElementById('endgame-modal').classList.add('hidden');
      this.returnToMothershipHub();
    });

    this.setupMissionTabs();
    this.setupHuntLoadoutControls();
    document.getElementById('btn-explore-hub')?.addEventListener('click', () => {
      this.enterHubExploration();
    });
    this.setupHubTouchControls();
    this.setupHuntTouchControls();

    document.querySelectorAll('.skin-card').forEach(card => {
      card.addEventListener('click', () => {
        const skinId = card.getAttribute('data-skin-id');
        this.player.setSkin(skinId);
        this.hud.syncCustomization(this.player.customization);
        document.querySelectorAll('.skin-card').forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        this.saveProgress();
        audioSynth.playYautjaClick();
        this.hud.showLogMessage(`ARMURE SÉLECTIONNÉE: ${card.querySelector('.skin-title').textContent}`);
      });
    });
    const selectedSkinCard = document.querySelector(`.skin-card[data-skin-id="${this.player.currentSkinId}"]`);
    selectedSkinCard?.classList.add('selected');
    selectedSkinCard?.setAttribute('aria-pressed', 'true');

    const customizationControls = {
      'custom-mask': 'maskId',
      'custom-skin-color': 'skinColorId',
      'custom-dread-color': 'dreadColorId',
      'custom-armor-color': 'armorColorId',
      'custom-armor-accent': 'armorAccentColorId',
      'custom-hunter-class': 'hunterClassId',
      'custom-dread-style': 'dreadStyleId',
      'custom-armor-finish': 'armorFinishId',
      'custom-warpaint': 'warpaintId',
    };
    Object.entries(customizationControls).forEach(([id, field]) => {
      const select = document.getElementById(id);
      select?.addEventListener('change', () => {
        this.player.applyCustomization({ [field]: select.value });
        this.hud.syncCustomization(this.player.customization);
        if (field === 'hunterClassId') this.syncHuntLoadoutClass();
        this.saveProgress();
        audioSynth.playYautjaClick();
        const status = document.getElementById('customization-status');
        if (status) status.textContent = `FORGE APPLIQUÉE: ${select.options[select.selectedIndex]?.text ?? select.value}`;
      });
    });
    this.hud.syncCustomization(this.player.customization);

    const directiveSelector = document.getElementById('directive-selector');
    directiveSelector?.addEventListener('change', () => {
      this.updateDirectivePreview(directiveSelector.value);
      audioSynth.playYautjaClick();
    });

    document.querySelectorAll('.btn-launch-hunt').forEach(btn => {
      btn.addEventListener('click', () => {
        const huntType = btn.getAttribute('data-hunt');
        const planetSelector = document.getElementById('planet-selector');
        const directiveId = directiveSelector?.value ?? 'standard_hunt';
        const requestedPlanet = resolveHuntBiome(huntType, planetSelector?.value);
        const planetType = resolveDirectiveBiome(directiveId, requestedPlanet) ?? requestedPlanet;
        if (planetSelector) planetSelector.value = planetType;
        this.prepareHunt(huntType, planetType, directiveId);
      });
    });

    document.getElementById('btn-buy-tribeam').addEventListener('click', () => {
      if (this.player.honorScore >= 500 && !this.player.hasTriBeam) {
        this.player.honorScore -= 500;
        this.player.hasTriBeam = true;
        this.saveProgress();
        this.hud.updateVitals(this.player);
        audioSynth.playTrophyHarvest();
        this.refreshForgeButtons();
        this.hud.showLogMessage("TIR TRI-FAISCEAU À PLASMA ACQUIS!");
      }
    });

    document.getElementById('btn-buy-antiacid').addEventListener('click', () => {
      if (this.player.honorScore >= 800 && !this.player.hasAntiAcidCloak) {
        this.player.honorScore -= 800;
        this.player.hasAntiAcidCloak = true;
        this.saveProgress();
        this.hud.updateVitals(this.player);
        audioSynth.playTrophyHarvest();
        this.refreshForgeButtons();
        this.hud.showLogMessage("CAMOUFLAGE ANTI-ACIDE ACQUIS!");
      }
    });

    document.getElementById('btn-buy-scope').addEventListener('click', () => {
      if (this.player.honorScore >= 400 && !this.player.hasScopeZoom) {
        this.player.honorScore -= 400;
        this.player.hasScopeZoom = true;
        this.saveProgress();
        this.hud.updateVitals(this.player);
        audioSynth.playTrophyHarvest();
        this.refreshForgeButtons();
        this.hud.showLogMessage("ZOOM SCOPE THERMIQUE 4X ACQUIS!");
      }
    });

    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const wepId = parseInt(slot.getAttribute('data-wep'));
        if (!isWeaponEquipped(this.activeHuntLoadout, wepId)) {
          this.hud.showLogMessage('ARME NON EMBARQUÉE — MODIFIEZ LE LOADOUT AVANT LA PROCHAINE CHASSE', 2400);
          return;
        }
        this.player.selectedWeapon = wepId;
        audioSynth.playYautjaClick();
      });
    });

    document.querySelectorAll('[data-gadget-key]').forEach((button) => {
      button.addEventListener('click', () => {
        this.onKeyDown({ code: button.dataset.gadgetKey, repeat: false });
      });
    });

    document.getElementById('btn-resume')?.addEventListener('click', () => this.setPaused(false));
    document.getElementById('btn-abandon-hunt')?.addEventListener('click', () => {
      this.isPaused = false;
      document.getElementById('pause-modal')?.classList.add('hidden');
      this.returnToMothershipHub();
    });

    this.setupSettingsHooks();
  }

  setupHubTouchControls() {
    const controls = document.getElementById('touch-hub-controls');
    if (!controls) return false;

    const releaseDirection = (event) => {
      event.preventDefault?.();
      this.setHubTouchDirection(event.currentTarget?.dataset?.hubMove, false);
    };

    controls.querySelectorAll('[data-hub-move]').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        if (this.gameState !== 'HUB' || !this.isHubExploring) return;
        event.preventDefault?.();
        try {
          button.setPointerCapture?.(event.pointerId);
        } catch {
          // La capture peut être refusée si le système vient d'annuler le pointeur.
        }
        this.setHubTouchDirection(button.dataset.hubMove, true);
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((eventName) => {
        button.addEventListener(eventName, releaseDirection);
      });
    });

    document.getElementById('btn-touch-hub-interact')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      if (this.gameState === 'HUB' && this.isHubExploring) this.attemptHubInteraction();
    });
    document.getElementById('btn-touch-hub-console')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      if (this.gameState === 'HUB' && this.isHubExploring) {
        this.showMissionSelectionModal('missions');
      }
    });
    return true;
  }

  setupHuntTouchControls() {
    const controls = document.getElementById('touch-hunt-controls');
    if (!controls) return false;
    const releaseDirection = (event) => {
      event.preventDefault?.();
      this.setHuntTouchDirection(event.currentTarget?.dataset?.huntMove, false);
    };
    controls.querySelectorAll('[data-hunt-move]').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        if (this.gameState !== 'HUNT' || this.isPaused) return;
        event.preventDefault?.();
        try {
          button.setPointerCapture?.(event.pointerId);
        } catch {
          // Une annulation système peut empêcher la capture sans invalider le contrôle.
        }
        this.setHuntTouchDirection(button.dataset.huntMove, true);
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((eventName) => {
        button.addEventListener(eventName, releaseDirection);
      });
    });
    document.getElementById('btn-touch-hunt-attack')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      if (this.gameState !== 'HUNT' || this.isPaused) return;
      audioSynth.init();
      if (this.player?.inQTE) this.resolveFacehuggerQTE(true);
      else this.performAttack();
    });
    document.getElementById('btn-touch-hunt-interact')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      if (this.gameState === 'HUNT' && !this.isPaused) this.attemptContextInteraction();
    });
    document.getElementById('btn-touch-hunt-vision')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      this.onKeyDown({ code: 'KeyV', repeat: false, preventDefault() {} });
    });
    document.getElementById('btn-touch-hunt-cloak')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      this.onKeyDown({ code: 'KeyC', repeat: false, preventDefault() {} });
    });
    document.getElementById('btn-touch-hunt-pause')?.addEventListener('click', (event) => {
      event.preventDefault?.();
      if (this.isHuntFlowActive()) this.togglePause();
    });
    return true;
  }

  resetHubTouchInput() {
    this.activeHubTouchDirections?.clear();
    this.touchInputDir ??= { x: 0, z: 0 };
    this.touchInputDir.x = 0;
    this.touchInputDir.z = 0;
    if (this.inputDir && this.keyboardInputDir && this.gamepadAxes) this.syncInputDirection();
  }

  setHubTouchDirection(direction, pressed) {
    if (!['up', 'down', 'left', 'right'].includes(direction)) return false;
    this.activeHubTouchDirections ??= new Set();
    this.touchInputDir ??= { x: 0, z: 0 };
    if (pressed) {
      if (this.gameState !== 'HUB' || !this.isHubExploring) return false;
      this.activeHubTouchDirections.add(direction);
    } else {
      this.activeHubTouchDirections.delete(direction);
    }
    this.touchInputDir.x = (this.activeHubTouchDirections.has('left') ? 1 : 0)
      - (this.activeHubTouchDirections.has('right') ? 1 : 0);
    this.touchInputDir.z = (this.activeHubTouchDirections.has('up') ? 1 : 0)
      - (this.activeHubTouchDirections.has('down') ? 1 : 0);
    this.syncInputDirection();
    return true;
  }

  setHubTouchControlsVisible(visible) {
    const controls = document.getElementById('touch-hub-controls');
    controls?.classList.toggle('hidden', !visible);
    if (!visible) this.resetHubTouchInput();
    return Boolean(controls);
  }


  setPaused(paused) {
    if (!this.isGameStarted || !this.isHuntFlowActive() || this.huntResultShown) return;
    this.isPaused = Boolean(paused);
    this.isScopeZooming = false;
    this.resetKeyboardInput();
    this.resetHuntTouchInput();
    this.inputDir = { x: 0, z: 0, isSprinting: false };
    const pauseModal = document.getElementById('pause-modal');
    pauseModal?.classList.toggle('hidden', !this.isPaused);

    if (this.isPaused) {
      if (document.pointerLockElement) document.exitPointerLock();
      pauseModal?.querySelector?.('.modal-box')?.focus?.();
    } else {
      this.container?.focus?.();
      this.requestPointerLockSafely();
    }
  }

  togglePause() {
    this.setPaused(!this.isPaused);
  }

  showMissionSelectionModal(tabKey = 'missions', moveFocus = true) {
    const modal = document.getElementById('mission-modal');
    modal?.classList.remove('hidden');
    modal?.setAttribute('aria-hidden', 'false');
    this.isHubExploring = false;
    this.resetKeyboardInput();
    this.gamepadAxes = { x: 0, z: 0 };
    this.setHubTouchControlsVisible(false);
    this.setHuntTouchControlsVisible(false);
    this.syncInputDirection();
    this.activateMissionTab?.(tabKey, false);
    this.renderDirectiveSelector(document.getElementById('directive-selector')?.value ?? this.currentDirectiveId);
    this.refreshForgeButtons();
    if (tabKey === 'loadout') this.renderHuntLoadoutUI();
    this.isScopeZooming = false;
    this.hud.hideActionPrompt();
    if (document.pointerLockElement) document.exitPointerLock();
    if (moveFocus) {
      const focusTarget = document.getElementById('tab-btn-' + tabKey)
        ?? modal?.querySelector?.('[tabindex], button, select');
      focusTarget?.focus?.();
    }
    return Boolean(modal);
  }

  enterHubExploration() {
    if (!this.isGameStarted || this.gameState !== 'HUB') return false;
    const modal = document.getElementById('mission-modal');
    modal?.classList.add('hidden');
    modal?.setAttribute('aria-hidden', 'true');
    this.isHubExploring = true;
    this.resetKeyboardInput();
    this.gamepadAxes = { x: 0, z: 0 };
    this.resetHubTouchInput();
    this.setHuntTouchControlsVisible(false);
    this.syncInputDirection();
    this.hud.hideActionPrompt();
    this.setHubTouchControlsVisible(true);
    this.hud.showLogMessage('EXPLORATION DU VAISSEAU-MÈRE — INTERACTION [E], [A] OU ACTION TACTILE', 3200);
    this.container?.focus?.();
    this.requestPointerLockSafely();
    return true;
  }

  updateHubHUD() {
    this.hud.updateVitals(this.player);
    if (!this.isHubExploring) {
      this.hud.hideActionPrompt();
      return null;
    }
    const station = this.hub.getNearbyStation(this.player.position);
    if (station) this.hud.showActionPrompt(station.prompt);
    else this.hud.hideActionPrompt();
    return station;
  }

  attemptHubInteraction() {
    if (this.gameState !== 'HUB' || !this.isHubExploring) return false;
    const station = this.hub.getNearbyStation(this.player.position);
    if (!station) return false;

    if (station.interactionType === 'contracts') {
      this.showMissionSelectionModal('missions');
    } else if (station.interactionType === 'forge') {
      this.showMissionSelectionModal('armory');
    } else if (station.interactionType === 'trophies') {
      this.hub.setTrophyState(this.player.completedHunts);
      const unlocked = [...this.hub.trophyDisplays.values()]
        .filter((trophy) => trophy.userData.unlocked).length;
      const total = this.hub.trophyDisplays.size;
      this.hud.showLogMessage(
        'GALERIE DU CLAN — ' + unlocked + '/' + total + ' TROPHÉES D’HONNEUR EXPOSÉS',
        3200,
      );
    } else if (station.interactionType === 'hangar') {
      const vehicleLabels = {
        scout: 'ÉCLAIREUR',
        shuttle: 'NAVETTE',
        pod: 'POD DE TRAQUE',
      };
      const vehicles = this.hub.vehicleDisplays
        .map((vehicle) => vehicleLabels[vehicle.userData.vehicleKind] ?? vehicle.userData.vehicleKind)
        .join(' · ');
      this.hud.showLogMessage(
        'HANGAR DE CHASSE — ' + vehicles + ' · NEXUS CENTRAL POUR LE DÉPLOIEMENT',
        3600,
      );
    } else if (station.interactionType === 'navigation') {
      const zoneCount = this.hub.getZones?.().length ?? 11;
      this.hud.showLogMessage(`PONT DE NAVIGATION — ${zoneCount} COMPARTIMENTS PRESSURISÉS · ROUTES DE CHASSE SYNCHRONISÉES`, 3600);
    } else if (station.interactionType === 'cryo') {
      this.player.health = this.player.maxHealth;
      this.player.stamina = this.player.maxStamina;
      this.hud.updateVitals(this.player);
      this.hud.showLogMessage('CRYOSTASE — CONSTANTES RESTAURÉES ET MÉTABOLISME STABILISÉ', 3000);
    } else if (station.interactionType === 'escape_pods') {
      this.hud.showLogMessage('BAIE DES PODS — SIX CAPSULES DE TRAQUE ET DEUX VECTEURS D’ÉVACUATION PRÊTS', 3200);
    } else if (station.interactionType === 'cleaner_lab') {
      this.player.health = this.player.maxHealth;
      this.player.energy = this.player.maxEnergy;
      this.player.isAcidCorroded = false;
      this.player.acidTimer = 0;
      this.hud.updateVitals(this.player);
      this.hud.showLogMessage('LABORATOIRE CLEANER — CONTAMINATION PURGÉE, MEDICOMP ET SOLVANTS CONTRÔLÉS', 3400);
    } else if (station.interactionType === 'core') {
      this.player.energy = this.player.maxEnergy;
      this.hud.updateVitals(this.player);
      this.hud.showLogMessage('NOYAU DU VAISSEAU — HARNAIS ÉNERGÉTIQUE RECHARGÉ À 100 %', 3000);
    } else if (station.interactionType === 'airlock') {
      this.showMissionSelectionModal('loadout');
    }
    return station;
  }

  updateHubExploration(delta) {
    if (this.gameState !== 'HUB' || !this.isHubExploring) return false;
    this.updatePlayerFrame(delta);
    this.hub.constrainPlayer(this.player.position, PLAYER_COLLIDER_RADIUS);
    this.updateCamera(delta);
    this.updateHubHUD();
    return true;
  }

  startHunt(huntType, planetType, directiveId = 'standard_hunt') {
    const huntDefinition = HUNT_DEFINITIONS[huntType] ?? HUNT_DEFINITIONS.goliath;
    const directive = getHuntDirective(directiveId);
    const resolvedPlanet = resolveDirectiveBiome(directive.id, planetType) ?? planetType;
    this.cleanupHunt();
    this.currentDirectiveId = directive.id;
    this.directiveProgress = createDirectiveProgress(directive.id);
    this.directiveOutcome = null;

    this.gameState = 'HUNT';
    this.isHubExploring = false;
    document.getElementById('mission-modal')?.classList.add('hidden');
    document.getElementById('mission-modal')?.setAttribute('aria-hidden', 'true');
    this.currentHuntType = huntDefinition.id;
    this.currentPlanet = resolvedPlanet;
    this.hub.setVisible(false);
    this.applyActiveHuntLoadout();
    this.setHuntTouchControlsVisible(true);
    this.environment.setDiscoveredPoiIds(this.player.discoveredPoiIds);
    this.environment.setBiome(resolvedPlanet);
    this.environment.setDiscoveredPoiIds(this.player.discoveredPoiIds);
    this.environment.setVisible(true);
    this.environment.setReducedMotion(this.settings.reducedMotion);
    this.environment.clearWeatherEvent?.();
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.2;
    const huntStartPosition = this.environment.getHuntStartPosition?.() ?? new THREE.Vector3(0, 0, 60);
    this.player.movementBounds = this.environment.playableRadius;
    this.player.resetForHunt(huntStartPosition);
    this.trophyHarvested = false;
    this.huntResultShown = false;
    this.isPaused = false;
    this.timeScale = 1;
    document.getElementById('pause-modal')?.classList.add('hidden');
    document.getElementById('endgame-modal')?.classList.add('hidden');

    this.activeBoss = createBoss(this.scene, huntDefinition);
    this.configureBossTerritory();
    const ecologyCount = this.spawnBiomeEcology();
    this.eventDirector.start({ huntId: this.currentHuntType, biomeId: resolvedPlanet, directiveId: directive.id });
    this.pendingDirectiveWaves = [];
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.activeBoss?.setVisionMode?.(this.player.activeVisionMode);
    this.refreshDirectiveHud();
    const huntMetrics = this.environment.getHuntMetrics?.() ?? {};
    this.hud.showLogMessage(
      `CHASSE: ${huntDefinition.name.toUpperCase()} · ${directive.shortLabel} · ${huntMetrics.sectorCount ?? 9} SECTEURS · ${ecologyCount} FORMES DE VIE`,
      5500,
    );

    if (
      resolvedPlanet === 'hive_lv426'
      || resolvedPlanet === 'bouvetoya_pyramid'
      || resolvedPlanet === 'gunnison_outbreak'
      || this.currentHuntType === 'xeno_queen'
      || this.currentHuntType === 'predalien'
      || this.currentHuntType === 'grid_alien'
    ) {
      this.spawnHiveEggClusters();
    }
  }

  cleanupHunt() {
    this.clearVehicleScan();
    this.victoryCountdown = null;
    this.activeFacehuggerCluster = null;
    this.eggClusters.forEach((egg) => egg.dispose());
    this.eggClusters = [];
    (this.activeEnemies ?? []).forEach((enemy) => enemy.dispose());
    this.activeEnemies = [];
    this.pendingDirectiveWaves = [];
    this.activeTerritoryClashes = [];
    this.eventDirector?.stop();
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.clearExtractionObjective();
    this.environment?.clearWeatherEvent?.();

    if (this.activeBoss) {
      this.activeBoss.dispose?.();
      this.activeBoss.projectiles?.forEach((projectile) => disposeObject3D(projectile.mesh));
      if (this.activeBoss.projectiles) this.activeBoss.projectiles = [];
      disposeObject3D(this.activeBoss.mesh);
      this.activeBoss = null;
    }

    this.player.clearTransientGadgets();
    this.setHuntTouchControlsVisible(false);
    this.player.projectiles.forEach((projectile) => disposeObject3D(projectile.mesh));
    this.player.mines.forEach((mine) => disposeObject3D(mine.mesh));
    this.player.projectiles = [];
    this.player.mines = [];
    this.vfxParticles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.vfxParticles = [];

    this.enemyDamageCooldown = 0;
    this.bossMigrationRoute = [];
    this.bossMigrationIndex = 0;
    this.bossMigrationHold = 0;
    this.bossMigrationGrace = 0;
    this.bossMigrationHealthPhase = 0;
    this.bossRelocating = false;
    this.bossEngaged = false;
    this.bossMigrationForced = false;
    this.goliathChargeWindow = 0;
    this.goliathChargeLatched = false;
    this.currentDirectiveId = 'standard_hunt';
    this.directiveProgress = createDirectiveProgress(this.currentDirectiveId);
    this.directiveOutcome = null;
    this.hud.updateDirectiveStatus?.(null, null);
    this.trophyHarvested = false;
    this.huntResultShown = false;
    this.isScopeZooming = false;
    this.resetKeyboardInput();
    this.gamepadAxes = { x: 0, z: 0 };
    this.inputDir = { x: 0, z: 0, isSprinting: false };
    this.timeScale = 1;
    this.hud.hideActionPrompt();
    this.hud.updateTriLaserPosition(null);
  }

  returnToMothershipHub() {
    this.cleanupHunt();
    this.gameState = 'HUB';
    this.isPaused = false;
    this.cameraYaw = Math.PI;
    this.cameraPitch = 0.2;
    this.player.movementBounds = 330;
    this.player.resetForHunt(HUB_PLAYER_POSITION);
    this.hub.setVisible(true);
    this.hub.setTrophyState(this.player.completedHunts);
    this.environment.setVisible(false);
    this.hud.showHubTarget();
    audioSynth.updateAdaptiveBGM('stealth');
    document.getElementById('pause-modal')?.classList.add('hidden');
    this.saveProgress();
    this.showMissionSelectionModal();
  }

  onKeyDown(e) {
    if (!this.isGameStarted) return;

    if (this.gameState === 'HUB') {
      if ((e.code === 'Escape' || e.code === 'KeyP') && !e.repeat) {
        e.preventDefault?.();
        this.showMissionSelectionModal('missions');
        return;
      }
      if (!this.isHubExploring) return;

      switch (e.code) {
        case 'KeyE':
          if (!e.repeat) this.attemptHubInteraction();
          break;
        default:
          break;
      }
      this.applyKeyboardSprintInput(e.code, true);
      this.applyKeyboardMovementInput(e.code, true);
      if (e.code.startsWith('Arrow')) e.preventDefault?.();
      this.syncInputDirection();
      return;
    }

    if ((e.code === 'Escape' || e.code === 'KeyP') && !e.repeat && this.isHuntFlowActive()) {
      e.preventDefault();
      this.togglePause();
      return;
    }

    if (this.isPaused || this.gameState !== 'HUNT') return;

    if (this.player.inQTE && e.code === 'Space') {
      this.resolveFacehuggerQTE(true);
      return;
    }

    const weapon = getPlayableWeaponByKey(e.code);
    if (weapon) {
      if (!isWeaponEquipped(this.activeHuntLoadout, weapon.id)) {
        this.hud.showLogMessage(`${weapon.name.toUpperCase()} NON EMBARQUÉE — MODIFIEZ LE LOADOUT AU VAISSEAU`, 2200);
        return;
      }
      this.player.selectedWeapon = weapon.slot;
      audioSynth.playYautjaClick();
      return;
    }

    const loadoutGadget = getPlayerGadgetByKey(e.code);
    if (loadoutGadget && !isGadgetEquipped(this.activeHuntLoadout, loadoutGadget.id)) {
      this.hud.showLogMessage(`${loadoutGadget.name.toUpperCase()} NON EMBARQUÉ — TECHNOLOGIE INDISPONIBLE`, 2200);
      return;
    }

    const sprintChanged = this.applyKeyboardSprintInput(e.code, true);
    switch (e.code) {

      case 'KeyR': {
        const roared = this.player.triggerVictoryRoar();
        this.hud.showLogMessage(
          roared
            ? "RUGISSEMENT D'HONNEUR YAUTJA! ÉNERGIE ET ENDURANCE RECHARGÉES!"
            : 'RUGISSEMENT DÉJÀ UTILISÉ POUR CETTE CHASSE',
        );
        break;
      }

      case 'KeyB': {
        const activated = this.player.activateWristShield();
        this.hud.showLogMessage(
          activated
            ? 'BOUCLIER DE POIGNET DÉPLOYÉ — IMPACTS FRONTAUX ABSORBÉS'
            : 'BOUCLIER DE POIGNET EN RECHARGE',
        );
        break;
      }

      case 'KeyG': {
        if (this.player.deployScoutDrone()) {
          const revealedCount = this.activateVehicleScan({ scanDuration: 7, scanRadius: 90 });
          this.hud.showLogMessage(
            `DRONE ÉCLAIREUR DÉPLOYÉ — ${revealedCount} SIGNATURE${revealedCount === 1 ? '' : 'S'} MARQUÉE${revealedCount === 1 ? '' : 'S'}`,
          );
        } else {
          this.hud.showLogMessage('DRONE ÉCLAIREUR EN RECHARGE');
        }
        break;
      }

      case 'KeyT': {
        const target = this.resolveCombatTarget();
        const targetPosition = target
          ? target.getAimPoint?.() ?? target.position.clone().add(new THREE.Vector3(0, 2, 0))
          : new THREE.Vector3(0, 2, -55)
            .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw)
            .add(this.player.position);
        const fired = this.player.fireShuriken(targetPosition);
        this.hud.showLogMessage(fired ? 'SHURIKEN YAUTJA LANCÉ' : 'SHURIKEN EN RECHARGE');
        break;
      }

      case 'KeyF': {
        const lureType = this.player.triggerVoiceMimicry();
        const lurePoint = new THREE.Vector3(0, 0, -24)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw)
          .add(this.player.position);
        const affected = (this.activeEnemies ?? []).reduce((count, enemy) => {
          if (enemy.isDead || enemy.position.distanceTo(this.player.position) > 90) return count;
          return count + (enemy.hearMimicry?.(lurePoint, 6) ? 1 : 0);
        }, 0);
        const lureLabels = { over_here: 'PAR ICI', radio: 'RADIO HUMAINE', yautja_clicks: 'CLICS YAUTJA' };
        this.hud.showLogMessage(
          `LEURRE « ${lureLabels[lureType] ?? lureType} » : ${affected} SIGNATURE${affected > 1 ? 'S' : ''} DÉTOURNÉE${affected > 1 ? 'S' : ''}`,
        );
        break;
      }

      case 'KeyY': {
        const decoyPoint = new THREE.Vector3(0, 0, -24)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw)
          .add(this.player.position);
        const sampledGroundHeight = this.environment?.sampleHeight?.(decoyPoint);
        const decoy = this.player.deployApexDecoy(decoyPoint, {
          groundHeight: Number.isFinite(sampledGroundHeight)
            ? sampledGroundHeight
            : this.player.position.y,
        });
        const affected = decoy ? (this.activeEnemies ?? []).reduce((count, enemy) => {
          if (enemy.isDead || enemy.position.distanceTo(decoy.position) > 110) return count;
          return count + (enemy.hearMimicry?.(decoy.position, 8) ? 1 : 0);
        }, 0) : 0;
        this.hud.showLogMessage(
          decoy
            ? `LEURRE APEX DÉPLOYÉ — ${affected} MENACE${affected > 1 ? 'S' : ''} DÉTOURNÉE${affected > 1 ? 'S' : ''}`
            : 'LEURRE APEX INDISPONIBLE OU EN RECHARGE',
        );
        break;
      }

      case 'Space':
        if (this.gameState === 'HUNT') {
          const wasPerched = this.player.isPerched;
          const perchAnchor = wasPerched
            ? this.player.currentPerchNode?.clone?.() ?? this.player.position.clone()
            : null;
          const traversalPerches = this.environment.getTraversalPerches?.()
            ?? this.environment.treePerches;
          const perched = this.player.jumpToCanopy(traversalPerches);
          if (wasPerched && perchAnchor) {
            const fallback = perchAnchor.clone();
            fallback.y = 0;
            const landing = this.environment?.getSafeSpawnPosition?.(
              perchAnchor,
              { clearance: PLAYER_COLLIDER_RADIUS + 0.5 },
            ) ?? fallback;
            this.player.position.copy(landing?.isVector3 ? landing : fallback);
            this.player.currentPerchNode = null;
          }
          this.hud.showLogMessage(perched ? "PERCHÉ DANS LA CANOPÉE! ATTAQUE EN PIQUÉ DISPONIBLE!" : "SAUT DE CANOPÉE");
        }
        break;

      case 'KeyV':
        const mode = this.player.cycleVisionMode();
        this.hud.setVisionModeUI(mode);
        this.activeBoss?.setVisionMode?.(mode);
        (this.activeEnemies ?? []).forEach((enemy) => enemy.setVisionMode(mode));
        break;

      case 'KeyC':
        const cloaked = this.player.toggleCloak();
        this.hud.showLogMessage(cloaked ? "CAMOUFLAGE OPTIQUE ACTIVÉ" : "CAMOUFLAGE DÉSACTIVÉ");
        break;

      case 'KeyE':
        this.attemptContextInteraction();
        break;

      case 'KeyX':
        if (this.player.triggerSelfDestruct()) {
          this.hud.showLogMessage("AUTO-DESTRUCTION D'HONNEUR ACTIVÉE!", 4000);
        }
        break;

    }
    const movementChanged = this.applyKeyboardMovementInput(e.code, true);
    if (movementChanged || sprintChanged) {
      if (e.code.startsWith('Arrow')) e.preventDefault?.();
      this.syncInputDirection();
    }
  }

  resetHuntTouchInput() {
    this.activeHuntTouchDirections?.clear();
    this.touchInputDir ??= { x: 0, z: 0 };
    this.touchInputDir.x = 0;
    this.touchInputDir.z = 0;
    if (this.inputDir && this.keyboardInputDir && this.gamepadAxes) this.syncInputDirection();
  }

  setHuntTouchDirection(direction, pressed) {
    if (!['up', 'down', 'left', 'right'].includes(direction)) return false;
    this.activeHuntTouchDirections ??= new Set();
    if (pressed) {
      if (this.gameState !== 'HUNT' || this.isPaused) return false;
      this.activeHuntTouchDirections.add(direction);
    } else {
      this.activeHuntTouchDirections.delete(direction);
    }
    this.touchInputDir.x = (this.activeHuntTouchDirections.has('left') ? 1 : 0)
      - (this.activeHuntTouchDirections.has('right') ? 1 : 0);
    this.touchInputDir.z = (this.activeHuntTouchDirections.has('up') ? 1 : 0)
      - (this.activeHuntTouchDirections.has('down') ? 1 : 0);
    this.syncInputDirection();
    return true;
  }

  setHuntTouchControlsVisible(visible) {
    if (typeof document === 'undefined') return false;
    const controls = document.getElementById('touch-hunt-controls');
    controls?.classList?.toggle?.('hidden', !visible);
    if (!visible) this.resetHuntTouchInput();
    return Boolean(controls);
  }

  onKeyUp(e) {
    this.applyKeyboardSprintInput(e.code, false);
    this.applyKeyboardMovementInput(e.code, false);
    this.syncInputDirection();
  }

  cycleEquippedWeapon(direction = 1) {
    const equipped = PLAYABLE_WEAPONS.filter((weapon) => isWeaponEquipped(this.activeHuntLoadout, weapon.id));
    if (equipped.length === 0) return null;
    const currentIndex = equipped.findIndex(({ slot }) => slot === this.player.selectedWeapon);
    const startIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (startIndex + (direction < 0 ? -1 : 1) + equipped.length) % equipped.length;
    const next = equipped[nextIndex];
    this.player.selectedWeapon = next.slot;
    audioSynth.playYautjaClick();
    this.hud.showLogMessage(`ARME EMBARQUÉE : ${next.name.toUpperCase()}`, 1200);
    return next;
  }

  getVisibleDialog() {
    if (typeof document === 'undefined') return null;
    return [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')]
      .find((dialog) => !dialog.classList.contains('hidden') && dialog.getAttribute('aria-hidden') !== 'true')
      ?? null;
  }

  moveDialogFocus(direction = 1) {
    const dialog = this.getVisibleDialog();
    if (!dialog) return false;
    const controls = [...dialog.querySelectorAll('button, select, input, [tabindex]')]
      .filter((element) => !element.disabled
        && !element.hidden
        && !element.closest('.hidden')
        && element.tabIndex >= 0);
    if (controls.length === 0) return false;
    const currentIndex = controls.indexOf(document.activeElement);
    const startIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (startIndex + (direction < 0 ? -1 : 1) + controls.length) % controls.length;
    controls[nextIndex].focus();
    return true;
  }

  updateGamepad() {
    const gamepads = typeof navigator !== 'undefined' && navigator.getGamepads
      ? navigator.getGamepads()
      : [];
    const gp = gamepads[0];
    if (!gp) {
      this.gamepadAxes.x = 0;
      this.gamepadAxes.z = 0;
      this.syncInputDirection();
      this.gamepadAttackPressed = false;
      this.gamepadInteractPressed = false;
      this.gamepadMenuPressed = false;
      this.gamepadWeaponCyclePressed = { previous: false, next: false };
      this.gamepadVisionPressed = false;
      this.gamepadCloakPressed = false;
      this.gamepadGadgetPressed = [false, false, false, false];
      this.gamepadNavigationPressed = [false, false, false, false];
      return;
    }

    const axes = gp.axes ?? [];
    const buttons = gp.buttons ?? [];
    const menuPressed = buttons[9]?.pressed === true || buttons[8]?.pressed === true;
    if (menuPressed && !this.gamepadMenuPressed) {
      if (this.isHuntFlowActive()) this.togglePause();
      else if (this.gameState === 'HUB' && this.isHubExploring) this.showMissionSelectionModal('missions');
    }
    this.gamepadMenuPressed = menuPressed;

    const dialog = this.getVisibleDialog();
    const navigationButtons = [12, 13, 14, 15].map((index) => buttons[index]?.pressed === true);
    if (dialog) {
      navigationButtons.forEach((pressed, index) => {
        if (pressed && !this.gamepadNavigationPressed[index]) {
          this.moveDialogFocus(index === 0 || index === 2 ? -1 : 1);
        }
      });
      this.gamepadNavigationPressed = navigationButtons;
      const dialogActivatePressed = buttons[0]?.pressed === true;
      if (dialogActivatePressed && !this.gamepadInteractPressed) document.activeElement?.click?.();
      this.gamepadInteractPressed = dialogActivatePressed;
      this.gamepadAxes.x = 0;
      this.gamepadAxes.z = 0;
      this.syncInputDirection();
      return;
    }
    this.gamepadNavigationPressed = navigationButtons;

    if (this.isPaused) {
      this.gamepadAxes.x = 0;
      this.gamepadAxes.z = 0;
      this.syncInputDirection();
      return;
    }

    const axisX = Number(axes[0]) || 0;
    const axisZ = Number(axes[1]) || 0;
    this.gamepadAxes.x = Math.abs(axisX) > 0.15 ? -axisX : 0;
    this.gamepadAxes.z = Math.abs(axisZ) > 0.15 ? -axisZ : 0;
    this.syncInputDirection();

    const cameraAxisX = Number(axes[2]) || 0;
    const cameraAxisY = Number(axes[3]) || 0;
    if (Math.abs(cameraAxisX) > 0.15) this.cameraYaw -= cameraAxisX * 0.03;
    if (Math.abs(cameraAxisY) > 0.15) {
      this.cameraPitch -= cameraAxisY * 0.03;
      this.cameraPitch = Math.max(-0.6, Math.min(0.8, this.cameraPitch));
    }

    const interactPressed = buttons[0]?.pressed === true;
    if (interactPressed && !this.gamepadInteractPressed) {
      if (this.gameState === 'HUB' && this.isHubExploring) this.attemptHubInteraction();
      else if (this.gameState === 'HUNT' && !this.isPaused) this.attemptContextInteraction();
    }
    this.gamepadInteractPressed = interactPressed;

    const previousWeaponPressed = buttons[4]?.pressed === true;
    const nextWeaponPressed = buttons[5]?.pressed === true;
    if (this.gameState === 'HUNT') {
      if (previousWeaponPressed && !this.gamepadWeaponCyclePressed.previous) this.cycleEquippedWeapon(-1);
      if (nextWeaponPressed && !this.gamepadWeaponCyclePressed.next) this.cycleEquippedWeapon(1);
    }
    this.gamepadWeaponCyclePressed = { previous: previousWeaponPressed, next: nextWeaponPressed };

    const visionPressed = buttons[2]?.pressed === true;
    if (visionPressed && !this.gamepadVisionPressed && this.gameState === 'HUNT') {
      this.onKeyDown({ code: 'KeyV', repeat: false, preventDefault() {} });
    }
    this.gamepadVisionPressed = visionPressed;
    const cloakPressed = buttons[3]?.pressed === true;
    if (cloakPressed && !this.gamepadCloakPressed && this.gameState === 'HUNT') {
      this.onKeyDown({ code: 'KeyC', repeat: false, preventDefault() {} });
    }
    this.gamepadCloakPressed = cloakPressed;

    const activeGadgetKeys = (this.activeHuntLoadout?.slots?.gadgets ?? [])
      .map((id) => getLoadoutItemById(id)?.key)
      .filter(Boolean);
    const gadgetKeys = [activeGadgetKeys[0], 'KeyR', 'Space', activeGadgetKeys[1]];
    navigationButtons.forEach((pressed, index) => {
      if (pressed && !this.gamepadGadgetPressed[index] && this.gameState === 'HUNT' && gadgetKeys[index]) {
        this.onKeyDown({ code: gadgetKeys[index], repeat: false, preventDefault() {} });
      }
    });
    this.gamepadGadgetPressed = navigationButtons;

    const attackPressed = buttons[7]?.pressed === true;
    if (attackPressed && !this.gamepadAttackPressed && this.gameState === 'HUNT') {
      if (this.player?.inQTE) this.resolveFacehuggerQTE(true);
      else this.performAttack();
    }
    this.gamepadAttackPressed = attackPressed;
  }

  attemptContextInteraction() {
    const trophyWasHarvested = this.trophyHarvested;
    this.attemptTrophyHarvest();
    if (!trophyWasHarvested && this.trophyHarvested) return true;

    const result = this.eventDirector?.tryInteract(this.player);
    if (result) {
      this.eventDirector.drainSignals();
      if (result.type === 'cache_opened') {
        const cacheLabel = result.cacheType === 'ritual_weapon_pod'
          ? 'POD D’ARMES DU BLOODING OUVERT'
          : 'CONTENEUR OUVERT';
        this.hud.showLogMessage(
          `${cacheLabel} · +${result.healthRestored} SANTÉ · +${result.energyRestored} ÉNERGIE · +${result.honorAwarded} HONNEUR`,
          2600,
        );
      } else if (result.type === 'vehicle_scan') {
        const revealedCount = this.activateVehicleScan(result);
        const signatureLabel = revealedCount === 1 ? 'SIGNATURE MARQUÉE' : 'SIGNATURES MARQUÉES';
        const vehicleLabel = this.getVehicleHudLabels(result.vehicleType).synchronized;
        this.hud.showLogMessage(
          `${vehicleLabel} · ${revealedCount} ${signatureLabel} · RECHARGE EFFECTUÉE`,
          2600,
        );
      }
      this.saveProgress();
      return true;
    }

    const environmentResult = this.environment?.interactWithPointOfInterest?.(this.player.position);
    if (environmentResult) {
      const poiId = typeof environmentResult.poiId === 'string' ? environmentResult.poiId : null;
      const knownPoiIds = Array.isArray(this.player.discoveredPoiIds)
        ? this.player.discoveredPoiIds
        : [];
      if (poiId && knownPoiIds.includes(poiId)) return false;
      if (poiId) {
        this.player.discoveredPoiIds = [...new Set([...knownPoiIds, poiId])];
        this.environment.setDiscoveredPoiIds?.(this.player.discoveredPoiIds);
      }
      const effect = this.dispatchPointOfInterestEffect(environmentResult);
      const honorGained = this.player.addHonor(effect.honorRequested);
      const message = environmentResult.message
        ?? `${environmentResult.label ?? 'ARCHIVE ENVIRONNEMENTALE'} ANALYSÉE`;
      this.hud.showLogMessage(
        `${message} · ${effect.detail}${honorGained > 0 ? ` · +${honorGained} HONNEUR` : ''}`,
        2800,
      );
      this.hud.updateVitals?.(this.player);
      this.saveProgress();
      return true;
    }
    return false;
  }

  attemptTrophyHarvest() {
    if (
      !this.activeBoss
      || this.trophyHarvested
      || this.huntResultShown
      || this.gameState !== 'HUNT'
      || this.player.inQTE
      || this.isPlayerCombatDisabled()
    ) return;
    const distToBoss = this.player.position.distanceTo(this.activeBoss.position);
    if (this.activeBoss.isDead && distToBoss < 14.0) {
      this.trophyHarvested = true;
      this.timeScale = 0.2;
      this.gameState = 'VICTORY_PENDING';
      this.victoryCountdown = VICTORY_DELAY_SECONDS;
      this.isScopeZooming = false;
      this.resetKeyboardInput();
      this.gamepadAxes = { x: 0, z: 0 };
      this.inputDir = { x: 0, z: 0, isSprinting: false };
      this.neutralizeVictoryDangers();

      const huntDefinition = HUNT_DEFINITIONS[this.currentHuntType];
      const baseReward = huntDefinition?.reward ?? 1200;
      const directive = getHuntDirective(this.currentDirectiveId);
      const summary = getDirectiveProgressSummary(this.directiveProgress);
      const totalReward = resolveDirectiveReward(directive.id, baseReward, this.directiveProgress);
      const bonus = Math.max(0, totalReward - baseReward);
      const previouslyCompleted = (this.player.completedDirectiveIds ?? []).includes(directive.id);
      const directiveCompleted = directive.id !== 'standard_hunt' && summary.isComplete;
      if (directiveCompleted) {
        this.player.completedDirectiveIds = [
          ...new Set([...(this.player.completedDirectiveIds ?? []), directive.id]),
        ];
      }
      this.directiveOutcome = {
        directiveId: directive.id,
        summary,
        baseReward,
        bonus,
        totalReward,
        newlyCompleted: directiveCompleted && !previouslyCompleted,
      };
      const honorGained = this.player.addHonor(totalReward);
      this.player.completedHunts = [...new Set([...this.player.completedHunts, this.currentHuntType])];
      this.hub.setTrophyState(this.player.completedHunts);

      this.saveProgress();

      audioSynth.playTrophyHarvest();
      const directiveMessage = directiveCompleted
        ? ` · ${directive.shortLabel} ACCOMPLIE${bonus > 0 ? ` (+${bonus})` : ''}`
        : directive.id === 'standard_hunt' ? '' : ' · DIRECTIVE INCOMPLÈTE';
      this.hud.showLogMessage(`TROPHÉE D'HONNEUR PRÉLEVÉ! +${honorGained} PTS${directiveMessage}`, 5000);
    }
  }

  // Real 3D Physical Collision Engine (Player <-> Boss, Player <-> Obstacles)
  handlePhysicalCollisions() {
    const playerPos = this.player.position;

    this.getCombatTargets().forEach((target) => {
      const targetPos = target.position;
      const targetRadius = target.colliderRadius ?? (target === this.activeBoss ? 5 : 0.8);
      const minDist = PLAYER_COLLIDER_RADIUS + targetRadius;
      const dx = playerPos.x - targetPos.x;
      const dz = playerPos.z - targetPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < minDist && !this.player.isPerched) {
        const overlap = minDist - dist;
        const normalX = dist > 0.01 ? dx / dist : 1;
        const normalZ = dist > 0.01 ? dz / dist : 0;
        playerPos.x += normalX * overlap;
        playerPos.z += normalZ * overlap;
      }
    });

    (this.environment?.obstacleColliders ?? []).forEach((obstacle) => {
      if (obstacle.blocksActors === false) return;
      const dx = playerPos.x - obstacle.x;
      const dz = playerPos.z - obstacle.z;
      const dist = Math.hypot(dx, dz);
      const minDist = PLAYER_COLLIDER_RADIUS + obstacle.radius;

      if (dist < minDist && !this.player.isPerched) {
        const overlap = minDist - dist;
        const normalX = dist > 0.01 ? dx / dist : 1;
        const normalZ = dist > 0.01 ? dz / dist : 0;
        playerPos.x += normalX * overlap;
        playerPos.z += normalZ * overlap;
      }

      if (this.activeBoss) {
        const bdx = this.activeBoss.position.x - obstacle.x;
        const bdz = this.activeBoss.position.z - obstacle.z;
        const bdist = Math.hypot(bdx, bdz);
        const bossRadius = this.activeBoss.colliderRadius ?? 5;
        const minBossDistance = bossRadius + obstacle.radius;
        if (bdist < minBossDistance) {
          const overlap = minBossDistance - bdist;
          const normalX = bdist > 0.01 ? bdx / bdist : 1;
          const normalZ = bdist > 0.01 ? bdz / bdist : 0;
          this.activeBoss.position.x += normalX * overlap;
          this.activeBoss.position.z += normalZ * overlap;
        }
      }

      (this.activeEnemies ?? []).forEach((enemy) => {
        const edx = enemy.position.x - obstacle.x;
        const edz = enemy.position.z - obstacle.z;
        const edist = Math.hypot(edx, edz);
        const minEnemyDistance = (enemy.colliderRadius ?? 0.8) + obstacle.radius;
        if (edist < minEnemyDistance) {
          const overlap = minEnemyDistance - edist;
          const normalX = edist > 0.01 ? edx / edist : 1;
          const normalZ = edist > 0.01 ? edz / edist : 0;
          enemy.position.x += normalX * overlap;
          enemy.position.z += normalZ * overlap;
        }
      });
    });

    if (!this.player.isPerched) {
      this.environment?.constrainToPlayableArea?.(
        playerPos,
        PLAYER_COLLIDER_RADIUS,
        { snapToGround: true },
      );
    }
    if (this.activeBoss?.position) {
      this.environment?.constrainToPlayableArea?.(
        this.activeBoss.position,
        this.activeBoss.colliderRadius ?? 5,
        { snapToGround: true },
      );
    }
    (this.activeEnemies ?? []).forEach((enemy) => {
      this.environment?.constrainToPlayableArea?.(
        enemy.position,
        enemy.colliderRadius ?? 0.8,
        { snapToGround: true },
      );
    });
    this.player.mesh?.position?.copy(playerPos);
    this.activeBoss?.mesh?.position?.copy(this.activeBoss.position);
    (this.activeEnemies ?? []).forEach((enemy) => enemy.mesh?.position?.copy(enemy.position));
  }

  applyBossHazards(playerPos) {
    const zones = this.activeBoss?.cleanerZones;
    if (!Array.isArray(zones) || !playerPos?.isVector3) return 0;

    let hitCount = 0;
    for (let index = zones.length - 1; index >= 0; index -= 1) {
      const zone = zones[index];
      if (!zone?.mesh?.position || zone.mesh.position.distanceTo(playerPos) > (zone.radius ?? 0)) continue;

      if (zone.type === 'dissolving_fluid' && (zone.tickCooldown ?? 0) <= 0) {
        this.player.takeDamage(zone.damage ?? 17);
        this.player.applyAcidCorrosion();
        zone.tickCooldown = zone.damageInterval ?? 0.7;
        hitCount += 1;
        this.spawnBloodSpatterVFX(playerPos, 0xffff00, 10);
        if (!zone.playerWarned) {
          zone.playerWarned = true;
          this.hud.showLogMessage('AGENT CLEANER — CORROSION DE ZONE !', 1400);
        }
      } else if (zone.type === 'proximity_mine' && zone.armed) {
        this.player.takeDamage(zone.damage ?? 52);
        audioSynth.playMineExplosion();
        this.spawnPlasmaShockwaveVFX(zone.mesh.position);
        this.spawnBloodSpatterVFX(playerPos, 0xffff00, 14);
        this.hud.showLogMessage('MINE CLEANER DÉCLENCHÉE — ÉLOIGNEZ-VOUS !', 1400);
        hitCount += 1;
        if (this.activeBoss.removeCleanerZone?.(zone) !== true) {
          disposeObject3D(zone.mesh);
          zones.splice(index, 1);
        }
      }
    }

    return hitCount;
  }

  checkCollisions(delta) {
    if (!this.activeBoss) return;

    const playerPos = this.player.position;
    const bossPos = this.activeBoss.position;
    const playerBossDistance = playerPos.distanceTo(bossPos);
    this.enemyDamageCooldown = Math.max(0, this.enemyDamageCooldown - delta);

    if (!this.activeBoss.isDead && Math.random() < Math.min(1, delta * 4)) {
      this.environment.addThermalFootprint(bossPos);
    }

    if (this.activeFacehuggerCluster && !this.player.inQTE) {
      this.player.qteTimer = 0;
      this.activeFacehuggerCluster.neutralizeFacehugger();
      this.activeFacehuggerCluster = null;
    }

    this.eggClusters.forEach(egg => {
      egg.update(delta, playerPos);
      if (
        egg.facehugger
        && egg.facehugger.mesh.position.distanceTo(playerPos) < 2.5
        && !egg.facehugger.contactHandled
        && !this.player.inQTE
      ) {
        egg.facehugger.contactHandled = true;
        this.activeFacehuggerCluster = egg;
        this.player.triggerQTE();
        this.hud.showLogMessage("ALERTE: FACEHUGGER AU VISAGE! RÉAGISSEZ RAPIDEMENT!");
      }
    });

    for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.player.projectiles[i];
      const currentPosition = projectile.mesh.position;
      const previousPosition = currentPosition.clone()
        .addScaledVector(projectile.dir, -(projectile.speed ?? 0) * delta);
      const projectileRadius = this.getProjectileCollisionRadius(projectile);
      const targetImpacts = this.getCombatTargets().map((candidate) => {
        let impact;
        if (typeof candidate.resolveProjectileImpact === 'function') {
          impact = candidate.resolveProjectileImpact(currentPosition, projectileRadius, previousPosition);
        } else {
          const targetHeight = candidate === this.activeBoss ? 3.5 : 1.2;
          const targetCenter = candidate.getAimPoint?.()
            ?? candidate.position.clone().add(new THREE.Vector3(0, targetHeight, 0));
          impact = this.resolveSegmentSphereImpact(
            previousPosition,
            currentPosition,
            targetCenter,
            (candidate.colliderRadius ?? 0.8) + projectileRadius,
          );
        }
        return impact
          ? {
            target: candidate,
            impact,
            distanceSquared: previousPosition.distanceToSquared(impact),
          }
          : null;
      }).filter(Boolean).sort((a, b) => a.distanceSquared - b.distanceSquared);
      const targetImpact = targetImpacts[0] ?? null;
      const coverImpact = this.environment?.resolveProjectileCoverImpact?.(
        previousPosition,
        currentPosition,
        projectileRadius,
      ) ?? null;
      const coverDistanceSquared = coverImpact
        ? coverImpact.distanceSquared ?? previousPosition.distanceToSquared(coverImpact.point)
        : Infinity;

      if (coverImpact && (!targetImpact || coverDistanceSquared <= targetImpact.distanceSquared)) {
        if (Number(projectile.blastRadius) > 0) {
          this.applyPlayerBlastDamage(projectile, coverImpact.point);
        } else if (projectile.type === 'plasma') this.spawnPlasmaShockwaveVFX(coverImpact.point);
        disposeObject3D(projectile.mesh);
        this.player.projectiles.splice(i, 1);
        continue;
      }
      if (!targetImpact) continue;
      const { target, impact } = targetImpact;

      if (projectile.isNet) {
        target.applyNet?.();
        this.hud.showLogMessage('CIBLE IMMOBILISÉE DANS LE FILET!');
      } else if (Number(projectile.blastRadius) > 0) {
        this.applyPlayerBlastDamage(projectile, impact);
      } else {
        const outcome = target.takeDamage(projectile.damage, impact);
        this.spawnBloodSpatterVFX(impact, this.getTargetBloodColor(target), 20);
        this.player.addHonor(target === this.activeBoss ? 100 : 35);
        if (target !== this.activeBoss && (outcome?.killed || target.isDead)) this.handleNpcDefeat(target);
      }

      if (projectile.type === 'plasma') {
        this.spawnPlasmaShockwaveVFX(projectile.mesh.position);
      }
      if (
        target === this.activeBoss
        && (this.currentHuntType === 'xeno_queen' || this.currentHuntType === 'predalien')
        && playerBossDistance < 12
      ) {
        this.player.applyAcidCorrosion();
      }

      disposeObject3D(projectile.mesh);
      this.player.projectiles.splice(i, 1);
    }

    for (let i = this.player.mines.length - 1; i >= 0; i--) {
      const mine = this.player.mines[i];
      const target = this.getCombatTargets().find((candidate) => (
        mine.mesh.position.distanceTo(candidate.position) < (candidate.colliderRadius ?? 6.5) + 2
      ));
      if (!target) continue;
      audioSynth.playMineExplosion();
      const outcome = target.takeDamage(mine.damage, mine.mesh.position);
      this.spawnPlasmaShockwaveVFX(mine.mesh.position);
      this.hud.showLogMessage('EXPLOSION DE MINE À PLASMA RÉUSSIE! +120 DÉGÂTS!');
      if (target !== this.activeBoss && (outcome?.killed || target.isDead)) this.handleNpcDefeat(target, 110);
      disposeObject3D(mine.mesh);
      this.player.mines.splice(i, 1);
    }

    if (Array.isArray(this.activeBoss.projectiles)) {
      for (let i = this.activeBoss.projectiles.length - 1; i >= 0; i--) {
        const projectile = this.activeBoss.projectiles[i];
        if (this.activeBoss.isDead) {
          this.removeActiveBossProjectile(i);
          continue;
        }

        const currentPosition = projectile.mesh.position;
        const previousPosition = projectile.dir?.isVector3
          ? currentPosition.clone().addScaledVector(projectile.dir, -(projectile.speed ?? 0) * delta)
          : currentPosition.clone();
        const projectileRadius = this.getProjectileCollisionRadius(projectile);
        const playerImpact = this.resolveSegmentSphereImpact(
          previousPosition,
          currentPosition,
          playerPos.clone().add(new THREE.Vector3(0, 2.4, 0)),
          3.25,
        );
        const playerDistanceSquared = playerImpact
          ? previousPosition.distanceToSquared(playerImpact)
          : Infinity;
        const coverImpact = this.environment?.resolveProjectileCoverImpact?.(
          previousPosition,
          currentPosition,
          projectileRadius,
        ) ?? null;
        const coverDistanceSquared = coverImpact
          ? coverImpact.distanceSquared ?? previousPosition.distanceToSquared(coverImpact.point)
          : Infinity;

        if (coverImpact && coverDistanceSquared <= playerDistanceSquared) {
          if (projectile.type === 'smart_disc') {
            projectile.phase = 'returning';
            projectile.outboundTimer = 0;
            projectile.dir.multiplyScalar(-1);
            continue;
          }
          if (String(projectile.type ?? '').includes('plasma')) {
            this.spawnPlasmaShockwaveVFX(coverImpact.point);
          }
          this.removeActiveBossProjectile(i);
          continue;
        }
        if (!playerImpact) continue;

        this.player.takeDamage(projectile.damage ?? 35);
        this.spawnBloodSpatterVFX(playerPos, 0xffff00, 12);
        if (projectile.signal === 'city_hunter_net' || projectile.statusEffect === 'netted') {
          this.player.applyCombatStatus?.('snare', projectile.statusDuration ?? 3);
          this.player.energy = Math.max(0, this.player.energy - 16);
          if (this.player.isCloaked) this.player.toggleCloak();
          this.hud.showLogMessage('FILET YAUTJA — MOBILITÉ ET CAMOUFLAGE ROMPUS', 1800);
          this.removeActiveBossProjectile(i);
          continue;
        }
        if (projectile.statusEffect === 'corrosion') {
          this.player.applyCombatStatus?.('corrosion', projectile.statusDuration ?? 2.8);
          this.player.energy = Math.max(0, this.player.energy - 10);
          if (this.player.isCloaked) this.player.toggleCloak();
          this.hud.showLogMessage('SANG ACIDE DE GRID — CORROSION ET CAMOUFLAGE ROMPU', 1700);
        }
        if (projectile.type === 'smart_disc' && projectile.phase === 'outbound') {
          projectile.phase = 'returning';
          projectile.outboundTimer = 0;
          projectile.mesh.position.addScaledVector(projectile.dir, 4);
          this.hud.showLogMessage('DISQUE INTELLIGENT — TRAJECTOIRE RETOUR ACTIVE', 1300);
          continue;
        }
        if (String(projectile.type ?? '').includes('plasma')) {
          this.spawnPlasmaShockwaveVFX(playerImpact);
        }
        this.removeActiveBossProjectile(i);
      }
    }

    this.applyBossHazards(playerPos);
    const isGoliathChargeFrame = this.currentHuntType === 'goliath' && this.activeBoss.aiState === 'charge';
    if (isGoliathChargeFrame && !this.goliathChargeLatched) {
      this.goliathChargeWindow = GOLIATH_CHARGE_WINDOW_SECONDS;
      this.goliathChargeLatched = true;
    } else if (!isGoliathChargeFrame) {
      this.goliathChargeLatched = false;
    }
    this.goliathChargeWindow = Math.max(0, this.goliathChargeWindow - delta);

    const chargeImpactReady = this.currentHuntType === 'goliath'
      && this.goliathChargeWindow > 0
      && playerBossDistance <= GOLIATH_CHARGE_IMPACT_RANGE;
    const isSuperPredatorCharge = this.currentHuntType === 'super_predator'
      && this.activeBoss.aiState === 'charge';
    const isFeralSpearAttack = this.currentHuntType === 'feral_predator'
      && ['charge', 'melee_windup', 'melee'].includes(this.activeBoss.aiState);
    const isWolfWhip = this.currentHuntType === 'wolf_cleaner'
      && this.activeBoss.activeAttackType === 'whip_sweep';
    const isKaliskAttack = this.currentHuntType === 'kalisk'
      && ['kalisk_charge', 'kalisk_impale'].includes(this.activeBoss.activeAttackType);
    const isCityCombistick = this.currentHuntType === 'city_hunter'
      && this.activeBoss.activeAttackType === 'combistick_sweep';
    const isUpgradeLeap = this.currentHuntType === 'upgrade_predator'
      && ['leap_crush', 'leap_impact'].includes(this.activeBoss.aiState);
    const isUpgradePredatorCharge = this.currentHuntType === 'upgrade_predator'
      && this.activeBoss.aiState === 'charge';
    const isGridAttack = this.currentHuntType === 'grid_alien'
      && ['grid_bite', 'grid_pounce', 'grid_tail_sweep', 'grid_acid_volley']
        .includes(this.activeBoss.activeAttackType);
    const attackState = isGridAttack ? this.activeBoss.activeAttackType
      : isUpgradeLeap ? 'upgrade_leap'
      : isWolfWhip ? 'wolf_whip'
      : isKaliskAttack ? this.activeBoss.activeAttackType
        : isCityCombistick ? 'city_combistick'
        : chargeImpactReady ? 'charge' : this.activeBoss.aiState;
    const attackProfile = ENEMY_ATTACK_PROFILES[attackState];
    if ((attackProfile?.telegraphed || isSuperPredatorCharge || isFeralSpearAttack || isUpgradePredatorCharge) && this.activeBoss.attackTelegraphAnnounced === false) {
      const message = isSuperPredatorCharge
        ? 'CHARGE DU SUPER PREDATOR — BRISEZ SON AXE !'
        : isUpgradePredatorCharge
          ? 'CHARGE DE L’ASSASSIN — BRISEZ SON AXE !'
        : isFeralSpearAttack
          ? this.activeBoss.aiState === 'charge'
            ? 'CHARGE À LA LANCE DU FERAL — ESQUIVEZ SON AXE !'
            : 'ESTOC DU FERAL — ROMPEZ LE CONTACT !'
          : ENEMY_ATTACK_TELEGRAPHS[attackState];
      if (message) this.hud.showLogMessage(message, 1200);
      this.activeBoss.attackTelegraphAnnounced = true;
    }
    const requiresExplicitImpact = attackProfile?.telegraphed || isSuperPredatorCharge
      || isFeralSpearAttack || isUpgradePredatorCharge;
    const impactReady = !requiresExplicitImpact || this.activeBoss.attackImpactReady === true;
    const freshBadBloodMelee = this.currentHuntType !== 'bad_blood'
      || attackState !== 'melee'
      || this.activeBoss.attackCooldown >= 1.75;

    if (
      !this.activeBoss.isDead
      && attackProfile
      && attackProfile.damage > 0
      && impactReady
      && this.enemyDamageCooldown <= 0
      && freshBadBloodMelee
      && playerBossDistance <= attackProfile.range
    ) {
      if (requiresExplicitImpact && this.activeBoss.consumeAttackImpact?.() !== true) return;
      this.player.takeDamage(attackProfile.damage);
      this.enemyDamageCooldown = attackProfile.cooldown;
      if (attackState === 'charge') this.goliathChargeWindow = 0;
      this.spawnBloodSpatterVFX(playerPos, 0xffff00, 15);
      if (attackProfile.corrosion) this.player.applyAcidCorrosion();
    }
  }

  updateCamera(delta = 0.016) {
    const cameraDistance = 14.0;
    const cameraHeight = 5.5;
    const scopeActive = this.isScopeZooming && this.player.hasScopeZoom && this.gameState === 'HUNT';
    const targetFov = scopeActive ? SCOPE_CAMERA_FOV : DEFAULT_CAMERA_FOV;
    const fovBlend = this.settings.reducedMotion ? 1 : 1 - Math.exp(-delta * 14);
    const nextFov = THREE.MathUtils.lerp(this.camera.fov, targetFov, fovBlend);
    if (Math.abs(nextFov - this.camera.fov) > 0.01) {
      this.camera.fov = nextFov;
      this.camera.updateProjectionMatrix();
    }

    const cx = this.player.position.x - Math.sin(this.cameraYaw) * cameraDistance * Math.cos(this.cameraPitch);
    const cz = this.player.position.z - Math.cos(this.cameraYaw) * cameraDistance * Math.cos(this.cameraPitch);
    const cy = this.player.position.y + cameraHeight + Math.sin(this.cameraPitch) * cameraDistance;

    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(this.player.position.x, this.player.position.y + 4.0, this.player.position.z);
  }

  updateHUD() {
    this.hud.updateVitals(this.player);
    this.hud.updateBossStatus(this.activeBoss, this.currentHuntType);

    if (this.activeBoss) {
      if (this.activeBoss.isEnraged) audioSynth.updateAdaptiveBGM('boss_enraged');
      else audioSynth.updateAdaptiveBGM('combat');

      const targetPos = this.activeBoss.getAimPoint?.()
        ?? this.activeBoss.position.clone().add(new THREE.Vector3(0, 4.0, 0));
      const distToBoss = this.player.position.distanceTo(this.activeBoss.position);

      targetPos.project(this.camera);
      const sx = (targetPos.x * 0.5 + 0.5) * this.width;
      const sy = (-(targetPos.y * 0.5) + 0.5) * this.height;

      if (targetPos.z < 1.0) {
        this.hud.updateTriLaserPosition({ x: sx, y: sy }, distToBoss, this.player.activeVisionMode === 'thermal');
      } else {
        this.hud.updateTriLaserPosition(null);
      }

      const nearbyCache = this.eventDirector?.containers?.find((cache) => (
        !cache.used && cache.mesh.position.distanceTo(this.player.position) <= cache.interactionDistance
      ));
      const nearbyVehicle = this.eventDirector?.vehicles?.find((vehicle) => (
        !vehicle.interacted
        && vehicle.mesh.userData.interactable
        && vehicle.mesh.position.distanceTo(this.player.position) <= vehicle.interactionDistance
      ));
      const nearbyPointOfInterest = this.environment?.getNearbyPointOfInterest?.(this.player.position);
      const availablePointOfInterest = nearbyPointOfInterest?.scanned ? null : nearbyPointOfInterest;
      if (this.activeBoss.isDead && distToBoss < 14.0 && !this.trophyHarvested) {
        this.hud.showActionPrompt('RÉCOLTER LE TROPHÉE YAUTJA [E]');
      } else if (nearbyCache) {
        this.hud.showActionPrompt(
          nearbyCache.cacheType === 'ritual_weapon_pod'
            ? 'OUVRIR LE POD D’ARMES DU BLOODING [E]'
            : 'OUVRIR LE CONTENEUR DE CHASSE [E]',
        );
      } else if (nearbyVehicle) {
        this.hud.showActionPrompt(this.getVehicleHudLabels(nearbyVehicle.type).prompt);
      } else if (availablePointOfInterest) {
        this.hud.showActionPrompt(`ANALYSER ${availablePointOfInterest.label.toUpperCase()} [E]`);
      } else {
        this.hud.hideActionPrompt();
      }
    } else {
      audioSynth.updateAdaptiveBGM('stealth');
    }
  }

  triggerVictoryScreen() {
    if (
      this.huntResultShown
      || this.gameState !== 'VICTORY_PENDING'
      || this.isPlayerCombatDisabled()
    ) return;
    this.huntResultShown = true;
    this.victoryCountdown = null;
    this.gameState = 'RESULT';
    this.isPaused = false;
    this.isScopeZooming = false;
    this.timeScale = 1;
    this.camera.fov = DEFAULT_CAMERA_FOV;
    this.camera.updateProjectionMatrix();

    const huntDefinition = HUNT_DEFINITIONS[this.currentHuntType];
    const modal = document.getElementById('endgame-modal');
    document.getElementById('endgame-title').textContent = "CHASSE ACCOMPLIE !";
    document.getElementById('endgame-desc').textContent = `${huntDefinition?.name ?? 'La proie'} rejoint la salle des trophées du clan.`;
    document.getElementById('final-honor-score').textContent = `${this.player.honorScore} PTS`;
    document.getElementById('final-yautja-rank').textContent = this.player.ranks[this.player.honorRankIndex];
    this.updateDirectiveResultPanel(true);
    document.getElementById('pause-modal')?.classList.add('hidden');
    modal.classList.remove('hidden');
    this.setHuntTouchControlsVisible(false);
    modal.querySelector?.('.modal-box')?.focus?.();
    this.saveProgress();
    if (document.pointerLockElement) document.exitPointerLock();
  }

  triggerDefeatScreen() {
    if (this.huntResultShown) return;
    this.victoryCountdown = null;
    this.clearVehicleScan();
    this.environment?.clearWeatherEvent?.();
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.clearExtractionObjective();
    this.player.clearTransientGadgets();

    this.huntResultShown = true;
    this.gameState = 'RESULT';
    this.isPaused = false;
    this.isScopeZooming = false;
    this.timeScale = 1;
    this.camera.fov = DEFAULT_CAMERA_FOV;
    this.camera.updateProjectionMatrix();

    const modal = document.getElementById('endgame-modal');
    document.getElementById('endgame-title').textContent = 'CHASSE ÉCHOUÉE';
    document.getElementById('endgame-desc').textContent = this.player.defeatReason === 'blessures'
      ? "Mortellement blessé, le chasseur a effacé sa technologie par l'auto-destruction. Aucun trophée n'est validé."
      : "L'auto-destruction a consumé le terrain de chasse. Aucun trophée n'est validé.";
    document.getElementById('final-honor-score').textContent = `${this.player.honorScore} PTS`;
    document.getElementById('final-yautja-rank').textContent = this.player.ranks[this.player.honorRankIndex];
    this.updateDirectiveResultPanel(false);
    document.getElementById('pause-modal')?.classList.add('hidden');
    modal.classList.remove('hidden');
    this.setHuntTouchControlsVisible(false);
    modal.querySelector?.('.modal-box')?.focus?.();
    this.saveProgress();
    if (document.pointerLockElement) document.exitPointerLock();
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const rawDelta = this.clock.getDelta();
    const frameDelta = Math.min(rawDelta, 0.1);
    const delta = frameDelta * this.timeScale;

    if (this.isGameStarted) this.updateGamepad();

    if (this.isGameStarted && !this.isPaused) {
      this.updateShaderUniforms(delta);
      this.updateVFX(delta);

      if (this.gameState === 'HUB') {
        this.hub.update(delta, this.settings.reducedMotion);
        if (!this.updateHubExploration(delta)) {
          this.updateCamera(delta);
          this.hud.hideActionPrompt();
        }
      } else if (this.gameState === 'HUNT') {
        this.updatePlayerFrame(delta);
        if (this.player.selfDestructComplete) {
          this.triggerDefeatScreen();
        } else {
          this.updateBossTerritory(delta);
          this.updateEncounterContent(delta);
          this.updateVehicleScan(delta);
          this.environment.update(delta, this.player.activeVisionMode, {
            player: this.player,
            weatherEvent: this.activeHazard,
          });
          this.processEnvironmentHazardSignals(this.environment.drainHazardSignals?.() ?? []);

          this.handlePhysicalCollisions();
          this.checkCollisions(delta);
          this.updateCamera(delta);
          this.updateHUD();
        }
      } else if (this.gameState === 'VICTORY_PENDING') {
        this.updateVictoryPending(frameDelta);
        if (this.gameState === 'VICTORY_PENDING') {
          this.environment.update(delta, this.player.activeVisionMode, { weatherEvent: null });
          this.environment.drainHazardSignals?.();
          this.updateCamera(delta);
          this.hud.updateVitals(this.player);
          this.hud.hideActionPrompt();
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-reload-game')?.addEventListener('click', () => window.location.reload());
  try {
    const game = new Game();
    window.__YAUTJA_APEX_HUNT__ = game;
    document.querySelector('#controls-modal .modal-box')?.focus?.();
    game.animate();
  } catch (error) {
    console.error('Échec du démarrage de Yautja: Apex Hunt', error);
    showFatalGameError(
      error instanceof Error
        ? `Le moteur 3D n’a pas pu démarrer : ${error.message}. Vérifiez WebGL et l’accélération matérielle, puis rechargez.`
        : 'Le moteur 3D n’a pas pu démarrer. Vérifiez WebGL et l’accélération matérielle, puis rechargez.',
    );
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Erreur asynchrone non gérée', event.reason);
  showFatalGameError('Une ressource essentielle du jeu n’a pas pu être initialisée. Rechargez la page ; si le problème persiste, vérifiez la console et l’accélération matérielle.');
});
