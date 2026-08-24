import * as THREE from 'three';
import { Environment } from './world/Environment.js';
import { YautjaPlayer } from './entities/YautjaPlayer.js';
import { HuntNPC } from './entities/HuntNPC.js';
import { createBoss } from './gameplay/BossFactory.js';
import { LevelEventDirector } from './gameplay/LevelEventDirector.js';
import { FacehuggerEggCluster } from './entities/FacehuggerEgg.js';
import { disposeObject3D } from './utils/materialState.js';
import { MothershipHub } from './world/MothershipHub.js';
import { HUDManager } from './HUDManager.js';
import { audioSynth } from './AudioSynthesizer.js';
import { saveManager } from './engine/SaveManager.js';
import { DEFAULT_SETTINGS, HUNT_DEFINITIONS, resolveHuntBiome } from './data/GameConfig.js';
import { ALL_LORE_ENTRIES, LORE_SOURCE_TIERS, LORE_SOURCES } from './data/LoreCodex.js';
import { resolveMeleeStrike } from './gameplay/combatRules.js';
import { getPlayableWeaponByKey } from './data/RuntimeEquipment.js';

const DEFAULT_CAMERA_FOV = 65;
const SCOPE_CAMERA_FOV = THREE.MathUtils.radToDeg(
  2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(DEFAULT_CAMERA_FOV) / 2) / 4),
);
const HUNT_START_POSITION = new THREE.Vector3(0, 0, 60);
const HUB_PLAYER_POSITION = new THREE.Vector3(0, 0, 20);
const VICTORY_DELAY_SECONDS = 3;
const GOLIATH_CHARGE_WINDOW_SECONDS = 4;
const GOLIATH_CHARGE_IMPACT_RANGE = 10;
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
});
const ENEMY_ATTACK_TELEGRAPHS = Object.freeze({
  attack_tail: 'BALAYAGE DE QUEUE DÉTECTÉ — ESQUIVEZ !',
  acid_spray: 'PRESSION ACIDE : LA REINE ARME UNE PROJECTION !',
  acid_frenzy: 'FRÉNÉSIE ACIDE DU PREDALIEN — ROMPEZ LE CONTACT !',
  wolf_whip: 'FOUET SEGMENTÉ DE WOLF — SORTEZ DU BALAYAGE !',
  kalisk_charge: 'CHARGE DU KALISK — QUITTEZ SON AXE !',
  kalisk_impale: 'EMPALAGE DU KALISK — ROMPEZ LE CONTACT !',
});


export class Game {
  constructor() {
    this.container = document.getElementById('game-canvas');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(DEFAULT_CAMERA_FOV, this.width / this.height, 0.1, 1000);
    
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
    this.timeScale = 1.0;

    this.hub = new MothershipHub(this.scene);
    this.environment = new Environment(this.scene);
    this.player = new YautjaPlayer(this.scene);
    this.hud = new HUDManager();
    this.eventDirector = new LevelEventDirector(this.scene);

    const loadResult = saveManager.load(this.player);
    this.settings = { ...DEFAULT_SETTINGS, ...loadResult.settings };
    this.player.applyCustomization(this.player.customization);
    this.hud.syncCustomization(this.player.customization);
    this.player.resetForHunt(HUB_PLAYER_POSITION);
    this.hub.setTrophyState(this.player.completedHunts);
    this.hub.setVisible(true);
    this.environment.setVisible(false);

    this.activeBoss = null;
    this.activeEnemies = [];
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.eggClusters = [];

    // Inputs
    this.inputDir = { x: 0, z: 0, isSprinting: false };
    this.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
    this.cameraPitch = 0.2;
    this.cameraYaw = 0;
    this.isPointerLocked = false;
    this.isGameStarted = false;
    this.trophyHarvested = false;
    this.isPaused = false;
    this.isScopeZooming = false;
    this.huntResultShown = false;
    this.enemyDamageCooldown = 0;
    this.victoryCountdown = null;
    this.gamepadAttackPressed = false;
    this.gamepadAxes = { x: 0, z: 0 };
    this.activeFacehuggerCluster = null;
    this.goliathChargeWindow = 0;
    this.goliathChargeLatched = false;

    this.applySettings(false);
    this.renderLoreCodex();
    this.initEventListeners();
    this.setupUIButtons();
    this.hud.updateVitals(this.player);
    this.hud.setVisionModeUI(this.player.activeVisionMode);
  }

  saveProgress() {
    return saveManager.save(this.player, this.settings);
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
    this.inputDir.x = this.gamepadAxes.x !== 0 ? this.gamepadAxes.x : this.keyboardInputDir.x;
    this.inputDir.z = this.gamepadAxes.z !== 0 ? this.gamepadAxes.z : this.keyboardInputDir.z;
    this.inputDir.isSprinting = this.keyboardInputDir.isSprinting;
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
    this.eventDirector?.stop();
    this.activeHazard = null;
    this.hazardPulseTimer = 0;

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

  getCombatTargets() {
    return [this.activeBoss, ...(this.activeEnemies ?? [])]
      .filter((target) => target && !target.isDead && target.position?.isVector3);
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

  resolveCombatTarget() {
    const livingEnemies = (this.activeEnemies ?? [])
      .filter((enemy) => !enemy.isDead)
      .sort((a, b) => this.player.position.distanceTo(a.position) - this.player.position.distanceTo(b.position));
    const nearestEnemy = livingEnemies[0];
    if (nearestEnemy && this.player.position.distanceTo(nearestEnemy.position) <= 65) return nearestEnemy;
    return this.activeBoss?.isDead ? nearestEnemy ?? null : this.activeBoss;
  }

  getTargetBloodColor(target) {
    if (['human_fireteam', 'thermal_trapper', 'grizzly_territorial'].includes(target?.type)) return 0xb41616;
    if (target?.type === 'combat_synthetic') return 0xf1f2df;
    return 0x00ff44;
  }

  handleNpcDefeat(enemy, honorBase = 90) {
    const index = (this.activeEnemies ?? []).indexOf(enemy);
    if (index < 0) return;
    const honorGained = this.player.addHonor(honorBase);
    this.hud.showLogMessage(`${enemy.name.toUpperCase()} NEUTRALISÉ · +${honorGained} PTS`, 1800);
    enemy.dispose();
    this.activeEnemies.splice(index, 1);
  }

  spawnEncounterNpc(signal) {
    const encounterTypes = {
      xeno: 'xeno_drone',
      xeno_warrior: 'xeno_warrior',
      hound: 'hunting_hound',
      grizzly: 'grizzly_territorial',
      thermal_trapper: 'thermal_trapper',
      genna_stalker: 'genna_stalker',
      synthetic: 'combat_synthetic',
    };
    const type = encounterTypes[signal.enemyType]
      ?? (signal.ordinal >= 3 ? 'combat_synthetic' : 'human_fireteam');
    const enemy = new HuntNPC(type, { position: signal.position });
    this.scene.add(enemy.mesh);
    enemy.setVisionMode(this.player.activeVisionMode);
    this.activeEnemies.push(enemy);
    this.hud.showLogMessage(`ÉVÉNEMENT: ${enemy.name.toUpperCase()} ENTRE DANS LA CHASSE`, 2200);
    return enemy;
  }

  spawnEnemyTracer(origin, target, color = 0xffb84a) {
    if (!origin?.isVector3 || !target?.isVector3) return;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      origin.clone().add(new THREE.Vector3(0, 1.2, 0)),
      target.clone().add(new THREE.Vector3(0, 2.4, 0)),
    ]);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const tracer = new THREE.Line(geometry, material);
    this.scene.add(tracer);
    this.vfxParticles.push({ mesh: tracer, isTracer: true, lifetime: 0.16 });
  }

  processEncounterSignals(signals) {
    signals.forEach((signal) => {
      if (signal.type === 'spawn_enemy') {
        this.spawnEncounterNpc(signal);
      } else if (signal.type === 'flyby') {
        this.hud.showLogMessage('SURVOL YAUTJA: NAVETTE DE CHASSE EN APPROCHE', 2200);
      } else if (signal.type === 'spawn_cache') {
        this.hud.showLogMessage('CONTENEUR DE CHASSE LARGUÉ · APPROCHEZ ET APPUYEZ SUR [E]', 2600);
      } else if (signal.type === 'hazard') {
        this.activeHazard = signal.hazardType;
        this.hazardPulseTimer = 0;
        const label = signal.hazardType === 'rain' ? 'PLUIE RÉVÉLATRICE' : 'TEMPÊTE THERMIQUE';
        this.hud.showLogMessage(`ÉVÉNEMENT DE NIVEAU: ${label}`, 2600);
      } else if (signal.type === 'hazard_end') {
        this.activeHazard = null;
        this.hazardPulseTimer = 0;
        this.hud.showLogMessage('PERTURBATION ENVIRONNEMENTALE DISSIPÉE', 1800);
      }
    });
  }

  updateEncounterContent(delta) {
    const scheduledSignals = this.eventDirector?.update(delta, {
      player: this.player,
      boss: this.activeBoss,
    }) ?? [];
    this.processEncounterSignals(scheduledSignals);
    this.eventDirector?.drainSignals();

    for (const enemy of [...(this.activeEnemies ?? [])]) {
      const signals = enemy.update(delta, { player: this.player });
      signals.forEach((signal) => {
        if (signal.type === 'attack_player') {
          this.player.takeDamage(signal.damage);
          if (signal.status === 'corrosion') this.player.applyAcidCorrosion();
          if (signal.status === 'energy_jam') {
            this.player.energy = Math.max(0, this.player.energy - (signal.energyDrain || 18));
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
          if (signal.projectile) {
            this.spawnEnemyTracer(
              signal.projectile.origin,
              this.player.position,
              ['combat_synthetic', 'thermal_trapper'].includes(enemy.type) ? 0x55ddff : 0xffc34d,
            );
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

    const target = this.resolveCombatTarget();
    if (!target) return;
    const targetHeight = target === this.activeBoss ? 3.5 : 1.2;
    const targetPos = target.getAimPoint?.()
      ?? target.position.clone().add(new THREE.Vector3(0, targetHeight, 0));
    const distance = this.player.position.distanceTo(target.position);
    const result = this.player.attack(targetPos);
    if (!['death_from_above', 'wristblades', 'whip_slash'].includes(result)) return;

    const strike = resolveMeleeStrike(this.player.selectedWeapon, distance, {
      fromCanopy: result === 'death_from_above',
    });
    if (!strike.hit) {
      this.hud.showLogMessage('ATTAQUE DE MÊLÉE HORS DE PORTÉE', 1200);
      return;
    }

    const scaledDamage = Math.round(strike.damage * (this.player.meleeDamageMultiplier ?? 1));
    const outcome = target.takeDamage(scaledDamage, this.player.position);
    this.spawnBloodSpatterVFX(targetPos, this.getTargetBloodColor(target), result === 'death_from_above' ? 30 : 15);
    this.player.addHonor(strike.honor);
    if (target !== this.activeBoss && (outcome?.killed || target.isDead)) this.handleNpcDefeat(target);

    if (result === 'death_from_above') {
      this.hud.showLogMessage(`ATTAQUE EN PIQUÉ EXÉCUTÉE! +${scaledDamage} DÉGÂTS!`);
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
      if (this.isGameStarted && this.gameState === 'HUNT' && !this.isPaused && !this.isPointerLocked) {
        this.requestPointerLockSafely();
      }
    });
    this.container.addEventListener('contextmenu', (event) => event.preventDefault());

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.container);
    });

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

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

    window.addEventListener('blur', () => {
      this.isScopeZooming = false;
      this.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
      this.gamepadAxes = { x: 0, z: 0 };
      this.inputDir = { x: 0, z: 0, isSprinting: false };
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
    const tabKeys = ['missions', 'armory', 'codex', 'options'];
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
        this.saveProgress();
        audioSynth.playYautjaClick();
        const status = document.getElementById('customization-status');
        if (status) status.textContent = `FORGE APPLIQUÉE: ${select.options[select.selectedIndex]?.text ?? select.value}`;
      });
    });
    this.hud.syncCustomization(this.player.customization);

    document.querySelectorAll('.btn-launch-hunt').forEach(btn => {
      btn.addEventListener('click', () => {
        const huntType = btn.getAttribute('data-hunt');
        const planetSelector = document.getElementById('planet-selector');
        const planetType = resolveHuntBiome(huntType, planetSelector?.value);
        if (planetSelector) planetSelector.value = planetType;
        document.getElementById('mission-modal').classList.add('hidden');
        this.startHunt(huntType, planetType);
        this.requestPointerLockSafely();
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

  setPaused(paused) {
    if (!this.isGameStarted || !this.isHuntFlowActive() || this.huntResultShown) return;
    this.isPaused = Boolean(paused);
    this.isScopeZooming = false;
    this.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
    this.inputDir = { x: 0, z: 0, isSprinting: false };
    document.getElementById('pause-modal')?.classList.toggle('hidden', !this.isPaused);

    if (this.isPaused) {
      if (document.pointerLockElement) document.exitPointerLock();
    } else {
      this.requestPointerLockSafely();
    }
  }

  togglePause() {
    this.setPaused(!this.isPaused);
  }

  showMissionSelectionModal() {
    document.getElementById('mission-modal')?.classList.remove('hidden');
    this.refreshForgeButtons();
    this.isScopeZooming = false;
    if (document.pointerLockElement) document.exitPointerLock();
  }

  startHunt(huntType, planetType) {
    const huntDefinition = HUNT_DEFINITIONS[huntType] ?? HUNT_DEFINITIONS.goliath;
    this.cleanupHunt();

    this.gameState = 'HUNT';
    this.currentHuntType = huntDefinition.id;
    this.currentPlanet = planetType;
    this.hub.setVisible(false);
    this.environment.setBiome(planetType);
    this.environment.setVisible(true);
    this.environment.setReducedMotion(this.settings.reducedMotion);
    this.player.resetForHunt(HUNT_START_POSITION);
    this.trophyHarvested = false;
    this.huntResultShown = false;
    this.isPaused = false;
    this.timeScale = 1;
    document.getElementById('pause-modal')?.classList.add('hidden');
    document.getElementById('endgame-modal')?.classList.add('hidden');

    this.activeBoss = createBoss(this.scene, huntDefinition);
    this.eventDirector.start({ huntId: this.currentHuntType, biomeId: planetType });
    this.activeHazard = null;
    this.hazardPulseTimer = 0;
    this.activeBoss?.setVisionMode?.(this.player.activeVisionMode);
    this.hud.showLogMessage(`CHASSE: ${huntDefinition.name.toUpperCase()} — ${huntDefinition.objective}`, 5000);

    if (planetType === 'hive_lv426' || this.currentHuntType === 'xeno_queen') {
      for (let i = 0; i < 4; i++) {
        const eggPos = new THREE.Vector3((Math.random() - 0.5) * 120, 0, (Math.random() - 0.5) * 120);
        this.eggClusters.push(new FacehuggerEggCluster(this.scene, eggPos));
      }
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
    this.eventDirector?.stop();
    this.activeHazard = null;
    this.hazardPulseTimer = 0;

    if (this.activeBoss) {
      this.activeBoss.dispose?.();
      this.activeBoss.projectiles?.forEach((projectile) => disposeObject3D(projectile.mesh));
      if (this.activeBoss.projectiles) this.activeBoss.projectiles = [];
      disposeObject3D(this.activeBoss.mesh);
      this.activeBoss = null;
    }

    this.player.clearTransientGadgets();
    this.player.projectiles.forEach((projectile) => disposeObject3D(projectile.mesh));
    this.player.mines.forEach((mine) => disposeObject3D(mine.mesh));
    this.player.projectiles = [];
    this.player.mines = [];
    this.vfxParticles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.vfxParticles = [];

    this.enemyDamageCooldown = 0;
    this.goliathChargeWindow = 0;
    this.goliathChargeLatched = false;
    this.trophyHarvested = false;
    this.huntResultShown = false;
    this.isScopeZooming = false;
    this.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
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
      this.player.selectedWeapon = weapon.slot;
      audioSynth.playYautjaClick();
      return;
    }

    switch (e.code) {
      case 'KeyW': case 'ArrowUp': this.keyboardInputDir.z = -1; break;
      case 'KeyS': case 'ArrowDown': this.keyboardInputDir.z = 1; break;
      case 'KeyA': case 'ArrowLeft': this.keyboardInputDir.x = -1; break;
      case 'KeyD': case 'ArrowRight': this.keyboardInputDir.x = 1; break;
      case 'ShiftLeft': case 'ShiftRight': this.keyboardInputDir.isSprinting = true; break;

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

      case 'Space':
        if (this.gameState === 'HUNT') {
          const perched = this.player.jumpToCanopy(this.environment.treePerches);
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
  }

  onKeyUp(e) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': if (this.keyboardInputDir.z === -1) this.keyboardInputDir.z = 0; break;
      case 'KeyS': case 'ArrowDown': if (this.keyboardInputDir.z === 1) this.keyboardInputDir.z = 0; break;
      case 'KeyA': case 'ArrowLeft': if (this.keyboardInputDir.x === -1) this.keyboardInputDir.x = 0; break;
      case 'KeyD': case 'ArrowRight': if (this.keyboardInputDir.x === 1) this.keyboardInputDir.x = 0; break;
      case 'ShiftLeft': case 'ShiftRight': this.keyboardInputDir.isSprinting = false; break;
    }
    this.syncInputDirection();
  }

  updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (!gp) {
      this.gamepadAxes.x = 0;
      this.gamepadAxes.z = 0;
      this.syncInputDirection();
      this.gamepadAttackPressed = false;
      return;
    }

    const axisX = Number(gp.axes[0]) || 0;
    const axisZ = Number(gp.axes[1]) || 0;
    this.gamepadAxes.x = Math.abs(axisX) > 0.15 ? axisX : 0;
    this.gamepadAxes.z = Math.abs(axisZ) > 0.15 ? axisZ : 0;
    this.syncInputDirection();

    if (Math.abs(gp.axes[2]) > 0.15) this.cameraYaw -= gp.axes[2] * 0.03;
    if (Math.abs(gp.axes[3]) > 0.15) {
      this.cameraPitch -= gp.axes[3] * 0.03;
      this.cameraPitch = Math.max(-0.6, Math.min(0.8, this.cameraPitch));
    }

    const attackPressed = gp.buttons[7]?.pressed === true;
    if (attackPressed && !this.gamepadAttackPressed) this.performAttack();
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
        this.hud.showLogMessage(
          `CONTENEUR OUVERT · +${result.healthRestored} SANTÉ · +${result.energyRestored} ÉNERGIE · +${result.honorAwarded} HONNEUR`,
          2600,
        );
      } else if (result.type === 'vehicle_scan') {
        const revealedCount = this.activateVehicleScan(result);
        const signatureLabel = revealedCount === 1 ? 'SIGNATURE MARQUÉE' : 'SIGNATURES MARQUÉES';
        this.hud.showLogMessage(
          `NAVETTE SYNCHRONISÉE · ${revealedCount} ${signatureLabel} · RECHARGE EFFECTUÉE`,
          2600,
        );
      }
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
      this.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
      this.gamepadAxes = { x: 0, z: 0 };
      this.inputDir = { x: 0, z: 0, isSprinting: false };
      this.neutralizeVictoryDangers();

      const huntDefinition = HUNT_DEFINITIONS[this.currentHuntType];
      const honorGained = this.player.addHonor(huntDefinition?.reward ?? 1200);
      this.player.completedHunts = [...new Set([...this.player.completedHunts, this.currentHuntType])];
      this.hub.setTrophyState(this.player.completedHunts);

      this.saveProgress();

      audioSynth.playTrophyHarvest();
      this.hud.showLogMessage(`TROPHÉE D'HONNEUR PRÉLEVÉ! +${honorGained} PTS`, 5000);
    }
  }

  // Real 3D Physical Collision Engine (Player <-> Boss, Player <-> Obstacles)
  handlePhysicalCollisions() {
    const playerPos = this.player.position;

    // 1. Player <-> Boss / PNJ radial pushback collision
    this.getCombatTargets().forEach((target) => {
      const targetPos = target.position;
      const playerRadius = 1.8;
      const targetRadius = target.colliderRadius ?? (target === this.activeBoss ? 5 : 0.8);
      const minDist = playerRadius + targetRadius;
      const dx = playerPos.x - targetPos.x;
      const dz = playerPos.z - targetPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDist && dist > 0.01 && !this.player.isPerched) {
        const overlap = minDist - dist;
        playerPos.x += (dx / dist) * overlap;
        playerPos.z += (dz / dist) * overlap;
      }
    });

    // 2. Player <-> Environment Obstacles (Pillars, Trees, Rocks)
    this.environment.obstacleColliders.forEach(obs => {
      const dx = playerPos.x - obs.x;
      const dz = playerPos.z - obs.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = 1.8 + obs.radius;

      if (dist < minDist && dist > 0.01) {
        const overlap = minDist - dist;
        if (!this.player.isPerched) {
          playerPos.x += (dx / dist) * overlap;
          playerPos.z += (dz / dist) * overlap;
        }
      }

      // Boss <-> Environment Obstacles
      if (this.activeBoss) {
        const bdx = this.activeBoss.position.x - obs.x;
        const bdz = this.activeBoss.position.z - obs.z;
        const bdist = Math.sqrt(bdx * bdx + bdz * bdz);
        const bMinDist = 5.0 + obs.radius;

        if (bdist < bMinDist && bdist > 0.01) {
          const boverlap = bMinDist - bdist;
          this.activeBoss.position.x += (bdx / bdist) * boverlap;
          this.activeBoss.position.z += (bdz / bdist) * boverlap;
        }
      }

      // Les renforts dynamiques utilisent les mêmes volumes solides que le boss.
      (this.activeEnemies ?? []).forEach((enemy) => {
        const edx = enemy.position.x - obs.x;
        const edz = enemy.position.z - obs.z;
        const edist = Math.sqrt(edx * edx + edz * edz);
        const eMinDist = (enemy.colliderRadius ?? 0.8) + obs.radius;

        if (edist < eMinDist) {
          const overlap = eMinDist - edist;
          const normalX = edist > 0.01 ? edx / edist : 1;
          const normalZ = edist > 0.01 ? edz / edist : 0;
          enemy.position.x += normalX * overlap;
          enemy.position.z += normalZ * overlap;
        }
      });
    });
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
      const previousPosition = projectile.mesh.position.clone()
        .addScaledVector(projectile.dir, -(projectile.speed ?? 0) * delta);
      const targetImpact = this.getCombatTargets().map((candidate) => {
        const impact = typeof candidate.resolveProjectileImpact === 'function'
          ? candidate.resolveProjectileImpact(projectile.mesh.position, 1, previousPosition)
          : projectile.mesh.position.distanceTo(candidate.position) < (candidate.colliderRadius ?? 6.5) + 1
            ? projectile.mesh.position.clone()
            : null;
        return impact ? { target: candidate, impact } : null;
      }).find(Boolean);
      if (!targetImpact) continue;
      const { target, impact } = targetImpact;

      if (projectile.isNet) {
        target.applyNet?.();
        this.hud.showLogMessage('CIBLE IMMOBILISÉE DANS LE FILET!');
      } else {
        const outcome = target.takeDamage(projectile.damage, impact);
        this.spawnBloodSpatterVFX(impact, this.getTargetBloodColor(target), 20);
        this.player.addHonor(target === this.activeBoss ? 100 : 35);
        if (target !== this.activeBoss && (outcome?.killed || target.isDead)) this.handleNpcDefeat(target);
      }

      if (projectile.type === 'plasma') this.spawnPlasmaShockwaveVFX(projectile.mesh.position);
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
          disposeObject3D(projectile.mesh);
          this.activeBoss.projectiles.splice(i, 1);
          continue;
        }

        if (projectile.mesh.position.distanceTo(playerPos) < 3.25) {
          this.player.takeDamage(projectile.damage ?? 35);
          this.spawnPlasmaShockwaveVFX(projectile.mesh.position);
          this.spawnBloodSpatterVFX(playerPos, 0xffff00, 12);
          disposeObject3D(projectile.mesh);
          this.activeBoss.projectiles.splice(i, 1);
        }
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
    const attackState = isWolfWhip ? 'wolf_whip'
      : isKaliskAttack ? this.activeBoss.activeAttackType
        : chargeImpactReady ? 'charge' : this.activeBoss.aiState;
    const attackProfile = ENEMY_ATTACK_PROFILES[attackState];
    if ((attackProfile?.telegraphed || isSuperPredatorCharge || isFeralSpearAttack) && this.activeBoss.attackTelegraphAnnounced === false) {
      const message = isSuperPredatorCharge
        ? 'CHARGE DU SUPER PREDATOR — BRISEZ SON AXE !'
        : isFeralSpearAttack
          ? this.activeBoss.aiState === 'charge'
            ? 'CHARGE À LA LANCE DU FERAL — ESQUIVEZ SON AXE !'
            : 'ESTOC DU FERAL — ROMPEZ LE CONTACT !'
          : ENEMY_ATTACK_TELEGRAPHS[attackState];
      if (message) this.hud.showLogMessage(message, 1200);
      this.activeBoss.attackTelegraphAnnounced = true;
    }
    const requiresExplicitImpact = attackProfile?.telegraphed || isSuperPredatorCharge || isFeralSpearAttack;
    const impactReady = !requiresExplicitImpact || this.activeBoss.attackImpactReady === true;
    const freshBadBloodMelee = this.currentHuntType !== 'bad_blood'
      || attackState !== 'melee'
      || this.activeBoss.attackCooldown >= 1.75;

    if (
      !this.activeBoss.isDead
      && attackProfile
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
      if (this.activeBoss.isDead && distToBoss < 14.0 && !this.trophyHarvested) {
        this.hud.showActionPrompt('RÉCOLTER LE TROPHÉE YAUTJA [E]');
      } else if (nearbyCache) {
        this.hud.showActionPrompt('OUVRIR LE CONTENEUR DE CHASSE [E]');
      } else if (nearbyVehicle) {
        this.hud.showActionPrompt('SYNCHRONISER LA NAVETTE DE RECONNAISSANCE [E]');
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
    document.getElementById('pause-modal')?.classList.add('hidden');
    modal.classList.remove('hidden');
    this.saveProgress();
    if (document.pointerLockElement) document.exitPointerLock();
  }

  triggerDefeatScreen() {
    if (this.huntResultShown) return;
    this.victoryCountdown = null;
    this.clearVehicleScan();
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
    document.getElementById('pause-modal')?.classList.add('hidden');
    modal.classList.remove('hidden');
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

    if (this.isGameStarted && !this.isPaused) {
      this.updateGamepad();
      this.updateShaderUniforms(delta);
      this.updateVFX(delta);

      if (this.gameState === 'HUB') {
        this.hub.update(delta, this.settings.reducedMotion);
        this.updateCamera(delta);
      } else if (this.gameState === 'HUNT') {
        this.player.update(delta, this.inputDir, this.cameraYaw);
        if (this.player.selfDestructComplete) {
          this.triggerDefeatScreen();
        } else {
          if (this.activeBoss) this.activeBoss.update(delta, this.player.position, this.player.isCloaked);
          this.updateEncounterContent(delta);
          this.updateVehicleScan(delta);
          this.environment.update(delta, this.player.activeVisionMode);

          this.handlePhysicalCollisions();
          this.checkCollisions(delta);
          this.updateCamera(delta);
          this.updateHUD();
        }
      } else if (this.gameState === 'VICTORY_PENDING') {
        this.updateVictoryPending(frameDelta);
        if (this.gameState === 'VICTORY_PENDING') {
          this.environment.update(delta, this.player.activeVisionMode);
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
  const game = new Game();
  game.animate();
});
