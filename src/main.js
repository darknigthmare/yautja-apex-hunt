import * as THREE from 'three';
import { Environment } from './world/Environment.js';
import { YautjaPlayer } from './entities/YautjaPlayer.js';
import { MegafaunaBoss } from './MegafaunaBoss.js';
import { XenomorphQueen } from './entities/XenomorphQueen.js';
import { BadBloodRival } from './entities/BadBloodRival.js';
import { PredalienBoss } from './entities/PredalienBoss.js';
import { FacehuggerEggCluster } from './entities/FacehuggerEgg.js';
import { disposeObject3D } from './utils/materialState.js';
import { MothershipHub } from './world/MothershipHub.js';
import { HUDManager } from './HUDManager.js';
import { audioSynth } from './AudioSynthesizer.js';
import { saveManager } from './engine/SaveManager.js';
import { DEFAULT_SETTINGS, HUNT_DEFINITIONS } from './data/GameConfig.js';
import { ALL_LORE_ENTRIES, LORE_SOURCE_TIERS, LORE_SOURCES } from './data/LoreCodex.js';
import { resolveMeleeStrike } from './gameplay/combatRules.js';

const DEFAULT_CAMERA_FOV = 65;
const SCOPE_CAMERA_FOV = THREE.MathUtils.radToDeg(
  2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(DEFAULT_CAMERA_FOV) / 2) / 4),
);
const HUNT_START_POSITION = new THREE.Vector3(0, 0, 60);
const HUB_PLAYER_POSITION = new THREE.Vector3(0, 0, 20);
const VICTORY_DELAY_SECONDS = 3;
const GOLIATH_CHARGE_WINDOW_SECONDS = 4;
const GOLIATH_CHARGE_IMPACT_RANGE = 10;

export class Game {
  constructor() {
    this.container = document.getElementById('game-canvas');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(DEFAULT_CAMERA_FOV, this.width / this.height, 0.1, 1000);
    
    this.renderer = new THREE.WebGLRenderer({ canvas: this.container, antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.clock = new THREE.Clock();

    // VFX Systems
    this.vfxParticles = [];

    // Game States
    this.gameState = 'HUB';
    this.currentHuntType = 'goliath';
    this.currentPlanet = 'jungle';
    this.timeScale = 1.0;

    this.hub = new MothershipHub(this.scene);
    this.environment = new Environment(this.scene);
    this.player = new YautjaPlayer(this.scene);
    this.hud = new HUDManager();

    const loadResult = saveManager.load(this.player);
    this.settings = { ...DEFAULT_SETTINGS, ...loadResult.settings };
    this.player.setSkin(this.player.currentSkinId);
    this.player.resetForHunt(HUB_PLAYER_POSITION);
    this.hub.setTrophyState(this.player.completedHunts);
    this.hub.setVisible(true);
    this.environment.setVisible(false);

    this.activeBoss = null;
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
    this.activeFacehuggerCluster = null;
    this.eggClusters.forEach((egg) => egg.dispose());
    this.eggClusters = [];

    this.activeBoss?.projectiles?.forEach((projectile) => disposeObject3D(projectile.mesh));
    if (this.activeBoss?.projectiles) this.activeBoss.projectiles = [];

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

  performAttack() {
    if (
      !this.isGameStarted
      || this.isPaused
      || this.gameState !== 'HUNT'
      || !this.activeBoss
      || this.activeBoss.isDead
      || this.isPlayerCombatDisabled()
    ) return;

    const targetPos = this.activeBoss.position.clone().add(new THREE.Vector3(0, 3.5, 0));
    const distance = this.player.position.distanceTo(this.activeBoss.position);
    const result = this.player.attack(targetPos);
    if (!['death_from_above', 'wristblades', 'whip_slash'].includes(result)) return;

    const strike = resolveMeleeStrike(this.player.selectedWeapon, distance, {
      fromCanopy: result === 'death_from_above',
    });
    if (!strike.hit) {
      this.hud.showLogMessage('ATTAQUE DE MÊLÉE HORS DE PORTÉE', 1200);
      return;
    }

    this.activeBoss.takeDamage(strike.damage, targetPos);
    this.spawnBloodSpatterVFX(targetPos, 0x00ff44, result === 'death_from_above' ? 30 : 15);
    this.player.addHonor(strike.honor);

    if (result === 'death_from_above') {
      this.hud.showLogMessage(`ATTAQUE EN PIQUÉ EXÉCUTÉE! +${strike.damage} DÉGÂTS!`);
    }
  }

  resolveFacehuggerQTE(success) {
    if (!this.player.inQTE) return false;
    const resolved = this.player.resolveQTE(success);
    this.activeFacehuggerCluster?.neutralizeFacehugger();
    this.activeFacehuggerCluster = null;
    if (success && resolved) this.hud.showLogMessage('FACEHUGGER TRANCHÉ AVEC SUCCÈS! +150 PTS');
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

  updateVFX(delta) {
    for (let i = this.vfxParticles.length - 1; i >= 0; i--) {
      const v = this.vfxParticles[i];
      v.lifetime -= delta;

      if (v.isShockwave) {
        v.mesh.scale.addScalar(delta * 25.0);
        v.mesh.material.opacity = Math.max(0, v.lifetime / 0.5);
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

    document.querySelectorAll('.btn-launch-hunt').forEach(btn => {
      btn.addEventListener('click', () => {
        const huntType = btn.getAttribute('data-hunt');
        const planetType = document.getElementById('planet-selector').value;
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

    if (this.currentHuntType === 'goliath') {
      this.activeBoss = new MegafaunaBoss(this.scene);
    } else if (this.currentHuntType === 'xeno_queen') {
      this.activeBoss = new XenomorphQueen(this.scene);
    } else if (this.currentHuntType === 'bad_blood') {
      this.activeBoss = new BadBloodRival(this.scene);
    } else if (this.currentHuntType === 'predalien') {
      this.activeBoss = new PredalienBoss(this.scene);
    }
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
    this.victoryCountdown = null;
    this.activeFacehuggerCluster = null;
    this.eggClusters.forEach((egg) => egg.dispose());
    this.eggClusters = [];

    if (this.activeBoss) {
      this.activeBoss.dispose?.();
      this.activeBoss.projectiles?.forEach((projectile) => disposeObject3D(projectile.mesh));
      if (this.activeBoss.projectiles) this.activeBoss.projectiles = [];
      disposeObject3D(this.activeBoss.mesh);
      this.activeBoss = null;
    }

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

    switch (e.code) {
      case 'KeyW': case 'ArrowUp': this.keyboardInputDir.z = -1; break;
      case 'KeyS': case 'ArrowDown': this.keyboardInputDir.z = 1; break;
      case 'KeyA': case 'ArrowLeft': this.keyboardInputDir.x = -1; break;
      case 'KeyD': case 'ArrowRight': this.keyboardInputDir.x = 1; break;
      case 'ShiftLeft': case 'ShiftRight': this.keyboardInputDir.isSprinting = true; break;

      case 'KeyR':
        this.player.triggerVictoryRoar();
        this.hud.showLogMessage("RUGISSEMENT D'HONNEUR YAUTJA! ÉNERGIE RECHARGÉE!");
        break;

      case 'KeyF':
        this.player.triggerVoiceMimicry();
        this.hud.showLogMessage("LEURRE DE MIMÉTISME VOCAL DIFFUSÉ!");
        break;

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
        break;

      case 'KeyC':
        const cloaked = this.player.toggleCloak();
        this.hud.showLogMessage(cloaked ? "CAMOUFLAGE OPTIQUE ACTIVÉ" : "CAMOUFLAGE DÉSACTIVÉ");
        break;

      case 'KeyE':
        this.attemptTrophyHarvest();
        break;

      case 'KeyX':
        if (this.player.triggerSelfDestruct()) {
          this.hud.showLogMessage("AUTO-DESTRUCTION D'HONNEUR ACTIVÉE!", 4000);
        }
        break;

      case 'Digit1': this.player.selectedWeapon = 1; audioSynth.playYautjaClick(); break;
      case 'Digit2': this.player.selectedWeapon = 2; audioSynth.playYautjaClick(); break;
      case 'Digit3': this.player.selectedWeapon = 3; audioSynth.playYautjaClick(); break;
      case 'Digit4': this.player.selectedWeapon = 4; audioSynth.playYautjaClick(); break;
      case 'Digit5': this.player.selectedWeapon = 5; audioSynth.playYautjaClick(); break;
      case 'Digit6': this.player.selectedWeapon = 6; audioSynth.playYautjaClick(); break;
      case 'Digit7': this.player.selectedWeapon = 7; audioSynth.playYautjaClick(); break;
      case 'Digit8': this.player.selectedWeapon = 8; audioSynth.playYautjaClick(); break;
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

    // 1. Player <-> Boss Radial Pushback Collision
    if (this.activeBoss) {
      const bossPos = this.activeBoss.position;
      const playerRadius = 1.8;
      const bossRadius = (this.currentHuntType === 'goliath' || this.currentHuntType === 'predalien') ? 6.5 : 4.5;
      const minDist = playerRadius + bossRadius;

      const dx = playerPos.x - bossPos.x;
      const dz = playerPos.z - bossPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDist && dist > 0.01) {
        const overlap = minDist - dist;
        const pushX = (dx / dist) * overlap;
        const pushZ = (dz / dist) * overlap;

        if (!this.player.isPerched) {
          playerPos.x += pushX;
          playerPos.z += pushZ;
        }
      }
    }

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
    });
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
      const p = this.player.projectiles[i];
      const dist = p.mesh.position.distanceTo(bossPos);

      if (dist < 7.5) {
        if (p.isNet) {
          this.activeBoss.applyNet();
          this.hud.showLogMessage("CIBLE IMMOBILISÉE DANS LE FILET!");
        } else {
          this.activeBoss.takeDamage(p.damage, p.mesh.position);
          this.spawnBloodSpatterVFX(p.mesh.position, 0x00ff44, 20);
          this.player.addHonor(100);
        }

        if (p.type === 'plasma') {
          this.spawnPlasmaShockwaveVFX(p.mesh.position);
        }

        if (
          (this.currentHuntType === 'xeno_queen' || this.currentHuntType === 'predalien')
          && playerBossDistance < 12
        ) {
          this.player.applyAcidCorrosion();
        }

        disposeObject3D(p.mesh);
        this.player.projectiles.splice(i, 1);
      }
    }

    for (let i = this.player.mines.length - 1; i >= 0; i--) {
      const m = this.player.mines[i];
      const dist = m.mesh.position.distanceTo(bossPos);
      if (dist < 8.5) {
        audioSynth.playMineExplosion();
        this.activeBoss.takeDamage(m.damage, bossPos);
        this.spawnPlasmaShockwaveVFX(m.mesh.position);
        this.hud.showLogMessage("EXPLOSION DE MINE À PLASMA RÉUSSIE! +120 DÉGÂTS!");
        disposeObject3D(m.mesh);
        this.player.mines.splice(i, 1);
      }
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

    const enemyAttackProfiles = {
      melee: { damage: 26, range: 7.5, cooldown: 1.5 },
      attack_claw: { damage: 22, range: 9.5, cooldown: 1.1 },
      attack_jaw: { damage: 30, range: 10.5, cooldown: 1.1 },
      attack_tail: { damage: 36, range: 32, cooldown: 1.6 },
      charge: { damage: 32, range: GOLIATH_CHARGE_IMPACT_RANGE, cooldown: 1.3 },
    };
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
    const attackState = chargeImpactReady ? 'charge' : this.activeBoss.aiState;
    const attackProfile = enemyAttackProfiles[attackState];
    const freshBadBloodMelee = this.currentHuntType !== 'bad_blood'
      || attackState !== 'melee'
      || this.activeBoss.attackCooldown >= 1.75;

    if (!this.activeBoss.isDead && attackProfile && this.enemyDamageCooldown <= 0 && freshBadBloodMelee) {
      if (playerBossDistance <= attackProfile.range) {
        this.player.takeDamage(attackProfile.damage);
        this.enemyDamageCooldown = attackProfile.cooldown;
        if (attackState === 'charge') this.goliathChargeWindow = 0;
        this.spawnBloodSpatterVFX(playerPos, 0xffff00, 15);
        if (
          attackState === 'attack_tail'
          && (this.currentHuntType === 'xeno_queen' || this.currentHuntType === 'predalien')
        ) {
          this.player.applyAcidCorrosion();
        }
      }
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

      const targetPos = this.activeBoss.position.clone().add(new THREE.Vector3(0, 4.0, 0));
      const distToBoss = this.player.position.distanceTo(this.activeBoss.position);

      targetPos.project(this.camera);
      const sx = (targetPos.x * 0.5 + 0.5) * this.width;
      const sy = (-(targetPos.y * 0.5) + 0.5) * this.height;

      if (targetPos.z < 1.0) {
        this.hud.updateTriLaserPosition({ x: sx, y: sy }, distToBoss, this.player.activeVisionMode === 'thermal');
      } else {
        this.hud.updateTriLaserPosition(null);
      }

      if (this.activeBoss.isDead && distToBoss < 14.0 && !this.trophyHarvested) {
        this.hud.showActionPrompt("RÉCOLTER LE TROPHÉE YAUTJA (ARRACHER CRÂNE ET COLONNE VERTÉBRALE)");
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
