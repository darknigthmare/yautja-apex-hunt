import * as THREE from 'three';
import { Environment } from './Environment.js';
import { YautjaPlayer } from './entities/YautjaPlayer.js';
import { MegafaunaBoss } from './MegafaunaBoss.js';
import { XenomorphQueen } from './entities/XenomorphQueen.js';
import { BadBloodRival } from './entities/BadBloodRival.js';
import { PredalienBoss } from './entities/PredalienBoss.js';
import { FacehuggerEggCluster } from './entities/FacehuggerEgg.js';
import { MothershipHub } from './world/MothershipHub.js';
import { HUDManager } from './HUDManager.js';
import { audioSynth } from './AudioSynthesizer.js';
import { saveManager } from './engine/SaveManager.js';

class Game {
  constructor() {
    this.container = document.getElementById('game-canvas');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Three.js Core
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 1000);
    
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

    saveManager.load(this.player);

    this.activeBoss = null;
    this.eggClusters = [];

    // Inputs
    this.inputDir = { x: 0, z: 0, isSprinting: false };
    this.cameraPitch = 0.2;
    this.cameraYaw = 0;
    this.isPointerLocked = false;
    this.isGameStarted = false;
    this.trophyHarvested = false;

    this.initEventListeners();
    this.setupUIButtons();
  }

  initEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    document.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked || !this.isGameStarted) return;
      this.cameraYaw -= e.movementX * 0.0025;
      this.cameraPitch -= e.movementY * 0.0025;
      this.cameraPitch = Math.max(-0.6, Math.min(0.8, this.cameraPitch));
    });

    this.container.addEventListener('click', () => {
      if (this.isGameStarted && !this.isPointerLocked) {
        this.container.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.container);
    });

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    window.addEventListener('mousedown', (e) => {
      if (!this.isGameStarted || this.gameState === 'HUB') return;
      audioSynth.init();

      if (this.player.inQTE) {
        if (e.button === 2 || e.button === 0) {
          this.player.resolveQTE(true);
          this.hud.showLogMessage("FACEHUGGER TRANCHÉ AVEC SUCCÈS! +150 PTS");
        }
        return;
      }

      if (e.button === 0 && this.activeBoss) {
        const targetPos = this.activeBoss.position.clone().add(new THREE.Vector3(0, 3.5, 0));
        const res = this.player.attack(targetPos);

        if (res === 'death_from_above') {
          this.hud.showLogMessage("ATTAQUE EN PIQUÉ DEPUIS LA CANOPÉE EXÉCUTÉE! +500 DÉGÂTS!");
          this.activeBoss.takeDamage(500, this.player.position);
          this.spawnBloodSpatterVFX(targetPos, 0x00ff44, 30);
          this.player.addHonor(300);
        } else if (res === 'whip_slash') {
          const dist = this.player.position.distanceTo(this.activeBoss.position);
          if (dist < 18.0) {
            this.activeBoss.takeDamage(60, this.player.position);
            this.spawnBloodSpatterVFX(targetPos, 0x00ff44, 15);
            this.player.addHonor(100);
          }
        }
      }
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
        this.scene.remove(v.mesh);
        this.vfxParticles.splice(i, 1);
      }
    }
  }

  setupUIButtons() {
    document.getElementById('btn-start-game').addEventListener('click', () => {
      document.getElementById('controls-modal').classList.add('hidden');
      this.isGameStarted = true;
      audioSynth.init();
      audioSynth.playYautjaClick();
      this.container.requestPointerLock();
      this.showMissionSelectionModal();
    });

    document.getElementById('btn-restart-game').addEventListener('click', () => {
      document.getElementById('endgame-modal').classList.add('hidden');
      this.returnToMothershipHub();
    });

    const tabMissions = document.getElementById('tab-btn-missions');
    const tabArmory = document.getElementById('tab-btn-armory');
    const contentMissions = document.getElementById('tab-content-missions');
    const contentArmory = document.getElementById('tab-content-armory');

    tabMissions.addEventListener('click', () => {
      tabMissions.classList.add('active');
      tabArmory.classList.remove('active');
      contentMissions.classList.remove('hidden');
      contentArmory.classList.add('hidden');
    });

    tabArmory.addEventListener('click', () => {
      tabArmory.classList.add('active');
      tabMissions.classList.remove('active');
      contentArmory.classList.remove('hidden');
      contentMissions.classList.add('hidden');
    });

    document.querySelectorAll('.skin-card').forEach(card => {
      card.addEventListener('click', () => {
        const skinId = card.getAttribute('data-skin-id');
        this.player.setSkin(skinId);
        document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        audioSynth.playYautjaClick();
        this.hud.showLogMessage(`ARMURE SÉLECTIONNÉE: ${card.querySelector('.skin-title').textContent}`);
      });
    });

    document.querySelectorAll('.btn-launch-hunt').forEach(btn => {
      btn.addEventListener('click', () => {
        const huntType = btn.getAttribute('data-hunt');
        const planetType = document.getElementById('planet-selector').value;
        document.getElementById('mission-modal').classList.add('hidden');
        this.startHunt(huntType, planetType);
        this.container.requestPointerLock();
      });
    });

    document.getElementById('btn-buy-tribeam').addEventListener('click', () => {
      if (this.player.honorScore >= 500 && !this.player.hasTriBeam) {
        this.player.honorScore -= 500;
        this.player.hasTriBeam = true;
        saveManager.save(this.player);
        audioSynth.playTrophyHarvest();
        alert("TIR TRI-FAISCEAU À PLASMA ACQUIS!");
      }
    });

    document.getElementById('btn-buy-antiacid').addEventListener('click', () => {
      if (this.player.honorScore >= 800 && !this.player.hasAntiAcidCloak) {
        this.player.honorScore -= 800;
        this.player.hasAntiAcidCloak = true;
        saveManager.save(this.player);
        audioSynth.playTrophyHarvest();
        alert("CAMOUFLAGE ANTI-ACIDE ACQUIS!");
      }
    });

    document.getElementById('btn-buy-scope').addEventListener('click', () => {
      if (this.player.honorScore >= 400 && !this.player.hasScopeZoom) {
        this.player.honorScore -= 400;
        this.player.hasScopeZoom = true;
        saveManager.save(this.player);
        audioSynth.playTrophyHarvest();
        alert("ZOOM SCOPE THERMIQUE 4X ACQUIS!");
      }
    });

    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const wepId = parseInt(slot.getAttribute('data-wep'));
        this.player.selectedWeapon = wepId;
        audioSynth.playYautjaClick();
      });
    });
  }

  showMissionSelectionModal() {
    document.getElementById('mission-modal').classList.remove('hidden');
    document.exitPointerLock();
  }

  startHunt(huntType, planetType) {
    this.gameState = 'HUNT';
    this.currentHuntType = huntType;
    this.currentPlanet = planetType;
    this.hub.setVisible(false);
    this.trophyHarvested = false;

    this.environment.setBiome(planetType);
    this.player.position.set(0, 0, 60);

    if (this.activeBoss) this.scene.remove(this.activeBoss.mesh);
    this.eggClusters.forEach(e => this.scene.remove(e.mesh));
    this.eggClusters = [];

    if (huntType === 'goliath') {
      this.activeBoss = new MegafaunaBoss(this.scene);
      this.hud.showLogMessage("CHASSE DU GOLIATH XENO-AKUMO COMMENCÉE!", 4000);
    } else if (huntType === 'xeno_queen') {
      this.activeBoss = new XenomorphQueen(this.scene);
      this.hud.showLogMessage("MASSACRE DE LA REINE XÉNOMORPHE!", 4000);
    } else if (huntType === 'bad_blood') {
      this.activeBoss = new BadBloodRival(this.scene);
      this.hud.showLogMessage("DUEL CONTRE LE YAUTJA BAD BLOOD!", 4000);
    } else if (huntType === 'predalien') {
      this.activeBoss = new PredalienBoss(this.scene);
      this.hud.showLogMessage("CHASSE DU PREDALIEN ULTIME!", 4000);
    }

    if (planetType === 'hive_lv426' || huntType === 'xeno_queen') {
      for (let i = 0; i < 4; i++) {
        const eggPos = new THREE.Vector3((Math.random() - 0.5) * 120, 0, (Math.random() - 0.5) * 120);
        this.eggClusters.push(new FacehuggerEggCluster(this.scene, eggPos));
      }
    }
  }

  returnToMothershipHub() {
    this.gameState = 'HUB';
    this.hub.setVisible(true);
    this.environment.setBiome('jungle');
    this.showMissionSelectionModal();
  }

  onKeyDown(e) {
    if (!this.isGameStarted) return;

    if (this.player.inQTE && e.code === 'Space') {
      this.player.resolveQTE(true);
      this.hud.showLogMessage("FACEHUGGER TRANCHÉ AVEC SUCCÈS! +150 PTS");
      return;
    }

    switch (e.code) {
      case 'KeyW': case 'ArrowUp': this.inputDir.z = -1; break;
      case 'KeyS': case 'ArrowDown': this.inputDir.z = 1; break;
      case 'KeyA': case 'ArrowLeft': this.inputDir.x = -1; break;
      case 'KeyD': case 'ArrowRight': this.inputDir.x = 1; break;
      case 'ShiftLeft': case 'ShiftRight': this.inputDir.isSprinting = true; break;

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
        if (this.activeBoss) this.activeBoss.setVisionMode(mode);
        break;

      case 'KeyC':
        const cloaked = this.player.toggleCloak();
        this.hud.showLogMessage(cloaked ? "CAMOUFLAGE OPTIQUE ACTIVÉ" : "CAMOUFLAGE DÉSACTIVÉ");
        break;

      case 'KeyE':
        this.attemptTrophyHarvest();
        break;

      case 'KeyX':
        this.player.triggerSelfDestruct();
        this.hud.showLogMessage("AUTO-DESTRUCTION D'HONNEUR ACTIVÉE!", 4000);
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
      case 'KeyW': case 'ArrowUp': if (this.inputDir.z === -1) this.inputDir.z = 0; break;
      case 'KeyS': case 'ArrowDown': if (this.inputDir.z === 1) this.inputDir.z = 0; break;
      case 'KeyA': case 'ArrowLeft': if (this.inputDir.x === -1) this.inputDir.x = 0; break;
      case 'KeyD': case 'ArrowRight': if (this.inputDir.x === 1) this.inputDir.x = 0; break;
      case 'ShiftLeft': case 'ShiftRight': this.inputDir.isSprinting = false; break;
    }
  }

  updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (!gp) return;

    if (Math.abs(gp.axes[0]) > 0.15) this.inputDir.x = gp.axes[0];
    if (Math.abs(gp.axes[1]) > 0.15) this.inputDir.z = gp.axes[1];

    if (Math.abs(gp.axes[2]) > 0.15) this.cameraYaw -= gp.axes[2] * 0.03;
    if (Math.abs(gp.axes[3]) > 0.15) {
      this.cameraPitch -= gp.axes[3] * 0.03;
      this.cameraPitch = Math.max(-0.6, Math.min(0.8, this.cameraPitch));
    }

    if (gp.buttons[7] && gp.buttons[7].pressed && this.activeBoss) {
      this.player.attack(this.activeBoss.position);
    }
  }

  attemptTrophyHarvest() {
    if (!this.activeBoss) return;
    const distToBoss = this.player.position.distanceTo(this.activeBoss.position);
    if (this.activeBoss.isDead && distToBoss < 14.0 && !this.trophyHarvested) {
      this.trophyHarvested = true;
      this.timeScale = 0.2;

      let honorGained = 3000;
      if (!this.player.isCloaked) honorGained += 500;
      this.player.addHonor(honorGained);

      saveManager.save(this.player);

      audioSynth.playTrophyHarvest();
      this.hud.showLogMessage("TROPHÉE D'HONNEUR LÉGENDAIRE ARRACHÉ! +3500 PTS", 5000);

      setTimeout(() => {
        this.timeScale = 1.0;
        this.triggerVictoryScreen();
      }, 3000);
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

  checkCollisions() {
    if (!this.activeBoss) return;

    const playerPos = this.player.position;
    const bossPos = this.activeBoss.position;

    if (!this.activeBoss.isDead && Math.random() < 0.2) {
      this.environment.addThermalFootprint(bossPos);
    }

    this.eggClusters.forEach(egg => {
      egg.update(0.016, playerPos);
      if (egg.facehugger && egg.facehugger.mesh.position.distanceTo(playerPos) < 2.5) {
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

        if ((this.currentHuntType === 'xeno_queen' || this.currentHuntType === 'predalien') && dist < 12.0) {
          this.player.applyAcidCorrosion();
        }

        this.scene.remove(p.mesh);
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
        this.scene.remove(m.mesh);
        this.player.mines.splice(i, 1);
      }
    }

    if (!this.activeBoss.isDead && (this.activeBoss.aiState === 'attack_claw' || this.activeBoss.aiState === 'attack_jaw' || this.activeBoss.aiState === 'charge')) {
      const dist = playerPos.distanceTo(bossPos);
      if (dist < 9.5) {
        this.player.takeDamage(20);
        this.spawnBloodSpatterVFX(playerPos, 0xffff00, 15);
      }
    }
  }

  updateCamera() {
    const cameraDistance = 14.0;
    const cameraHeight = 5.5;

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
      } else if (!this.activeBoss.isDead) {
        this.hud.hideActionPrompt();
      }
    } else {
      audioSynth.updateAdaptiveBGM('stealth');
    }
  }

  triggerVictoryScreen() {
    const modal = document.getElementById('endgame-modal');
    document.getElementById('endgame-title').textContent = "CHASSE ACCOMPLIE !";
    document.getElementById('endgame-desc').textContent = "La proie colossale a succombé à votre puissance Yautja.";
    document.getElementById('final-honor-score').textContent = `${this.player.honorScore} PTS`;
    document.getElementById('final-yautja-rank').textContent = this.player.ranks[this.player.honorRankIndex];
    
    modal.classList.remove('hidden');
    document.exitPointerLock();
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
    const delta = Math.min(rawDelta, 0.1) * this.timeScale;

    if (this.isGameStarted) {
      this.updateGamepad(delta);
      this.updateVFX(delta);

      if (this.gameState === 'HUB') {
        this.hub.update(delta);
        this.updateCamera();
      } else {
        this.player.update(delta, this.inputDir, this.cameraYaw);
        if (this.activeBoss) this.activeBoss.update(delta, this.player.position, this.player.isCloaked);
        this.environment.update(delta, this.player.activeVisionMode);

        this.handlePhysicalCollisions();
        this.checkCollisions();
        this.updateCamera();
        this.updateHUD();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.animate();
});
