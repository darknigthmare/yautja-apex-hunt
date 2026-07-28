import { YautjaSkinsDatabase } from './data/YautjaLoreDatabase.js';

export class HUDManager {
  constructor() {
    this.visionOverlay = document.getElementById('vision-overlay');
    this.visionModeDisplay = document.getElementById('vision-mode-display');
    this.honorRankDisplay = document.getElementById('honor-rank-display');
    this.honorScoreDisplay = document.getElementById('honor-score-display');
    this.targetScannedName = document.getElementById('target-scanned-name');

    this.hpBar = document.getElementById('hp-bar');
    this.hpVal = document.getElementById('hp-val');
    this.energyBar = document.getElementById('energy-bar');
    this.energyVal = document.getElementById('energy-val');
    this.staminaBar = document.getElementById('stamina-bar');
    this.staminaVal = document.getElementById('stamina-val');
    
    this.cloakCard = document.getElementById('cloak-status-card');
    this.cloakText = document.getElementById('cloak-state-text');
    this.canopyBadge = document.getElementById('canopy-badge');
    this.acidBadge = document.getElementById('acid-badge');

    this.qteOverlay = document.getElementById('qte-overlay');

    this.bossDisplayName = document.getElementById('boss-display-name');
    this.bossHpBar = document.getElementById('boss-hp-bar');
    this.part1Label = document.getElementById('part-1-label');
    this.part2Label = document.getElementById('part-2-label');
    this.hornStatus = document.getElementById('horn-status');
    this.tailStatus = document.getElementById('tail-status');

    this.triLaser = document.getElementById('tri-laser-container');
    this.lockonBracket = document.getElementById('lockon-bracket');
    this.lockonDistance = document.getElementById('lockon-distance');
    this.weakpointTag = document.getElementById('weakpoint-tag');

    this.actionPrompt = document.getElementById('action-prompt');
    this.actionPromptText = document.getElementById('action-prompt-text');
    this.logBanner = document.getElementById('log-banner');

    this.weaponSlots = document.querySelectorAll('.weapon-slot');
    this.skinGrid = document.getElementById('skin-catalog-grid');

    this.renderSkinCatalog();
  }

  renderSkinCatalog() {
    if (!this.skinGrid) return;
    this.skinGrid.innerHTML = '';

    YautjaSkinsDatabase.forEach(s => {
      const card = document.createElement('div');
      card.className = 'skin-card';
      card.setAttribute('data-skin-id', s.id);
      card.innerHTML = `
        <div class="skin-title">${s.name}</div>
        <div class="skin-origin">${s.origin}</div>
        <div class="skin-desc">${s.desc}</div>
      `;
      this.skinGrid.appendChild(card);
    });
  }

  updateVitals(player) {
    const hpPct = Math.max(0, (player.health / player.maxHealth) * 100);
    this.hpBar.style.width = `${hpPct}%`;
    this.hpVal.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;

    const energyPct = Math.max(0, (player.energy / player.maxEnergy) * 100);
    this.energyBar.style.width = `${energyPct}%`;
    this.energyVal.textContent = `${Math.ceil(player.energy)} / ${player.maxEnergy}`;

    const staminaPct = Math.max(0, (player.stamina / player.maxStamina) * 100);
    this.staminaBar.style.width = `${staminaPct}%`;
    this.staminaVal.textContent = `${Math.ceil(player.stamina)} / ${player.maxStamina}`;

    this.honorScoreDisplay.textContent = `${player.honorScore} PTS`;
    this.honorRankDisplay.textContent = player.ranks[player.honorRankIndex];

    if (player.isCloaked) {
      this.cloakCard.className = 'status-card cloaked';
      this.cloakText.textContent = 'ACTIF (INVISIBILITÉ)';
    } else {
      this.cloakCard.className = 'status-card uncloaked';
      this.cloakText.textContent = 'INACTIF (VISIBLE)';
    }

    if (player.isPerched) this.canopyBadge.classList.remove('hidden');
    else this.canopyBadge.classList.add('hidden');

    if (player.isAcidCorroded) this.acidBadge.classList.remove('hidden');
    else this.acidBadge.classList.add('hidden');

    if (player.inQTE) this.qteOverlay.classList.remove('hidden');
    else this.qteOverlay.classList.add('hidden');

    this.weaponSlots.forEach(slot => {
      const wepId = parseInt(slot.getAttribute('data-wep'));
      if (wepId === player.selectedWeapon) slot.classList.add('active');
      else slot.classList.remove('active');
    });
  }

  updateBossStatus(boss, huntType) {
    if (!boss) return;
    const bossHpPct = Math.max(0, (boss.health / boss.maxHealth) * 100);
    this.bossHpBar.style.width = `${bossHpPct}%`;

    if (huntType === 'goliath') {
      this.bossDisplayName.textContent = "GOLIATH XENO-AKUMO";
      this.part1Label.textContent = "CORNE GAULDOISE:";
      this.part2Label.textContent = "QUEUE ÉPINEYUSE:";
      this.hornStatus.textContent = boss.hornIntact ? "INTACTE" : "BRISÉE (TROPHÉE)";
      this.tailStatus.textContent = boss.tailIntact ? "INTACTE" : "TRANCHÉE (TROPHÉE)";
    } else if (huntType === 'xeno_queen') {
      this.bossDisplayName.textContent = "REINE XÉNOMORPHE";
      this.part1Label.textContent = "CRÊTE DE TÊTE:";
      this.part2Label.textContent = "QUEUE PERFORANTE:";
      this.hornStatus.textContent = boss.crownIntact ? "INTACTE" : "BRISÉE (TROPHÉE)";
      this.tailStatus.textContent = boss.tailIntact ? "INTACTE" : "TRANCHÉE (TROPHÉE)";
    } else if (huntType === 'bad_blood') {
      this.bossDisplayName.textContent = "YAUTJA BAD BLOOD";
      this.part1Label.textContent = "CASQUE MASQUE:";
      this.part2Label.textContent = "TÊTE DU RIVAL:";
      this.hornStatus.textContent = "MASQUÉ";
      this.tailStatus.textContent = boss.isDead ? "VAINCU" : "VIVANT";
    } else if (huntType === 'predalien') {
      this.bossDisplayName.textContent = "PREDALIEN ULTIME";
      this.part1Label.textContent = "DÔME BIOMÉCANIQUE:";
      this.part2Label.textContent = "QUEUE D'ÉPINE:";
      this.hornStatus.textContent = boss.headIntact ? "INTACTE" : "BRISÉ (TROPHÉE)";
      this.tailStatus.textContent = boss.tailIntact ? "INTACTE" : "TRANCHÉE (TROPHÉE)";
    }
  }

  setVisionModeUI(mode) {
    if (mode === 'thermal') {
      this.visionOverlay.className = 'vision-thermal';
      this.visionModeDisplay.textContent = 'THERMIQUE INFRA-ROUGE';
    } else if (mode === 'tech') {
      this.visionOverlay.className = 'vision-tech';
      this.visionModeDisplay.textContent = 'ÉLECTROMAGNÉTIQUE TECH';
    } else {
      this.visionOverlay.className = 'vision-normal';
      this.visionModeDisplay.textContent = 'MASQUE NORMAL';
    }
  }

  updateTriLaserPosition(screenPos, distance, isWeakpoint) {
    if (screenPos) {
      this.triLaser.style.left = `${screenPos.x}px`;
      this.triLaser.style.top = `${screenPos.y}px`;
      this.lockonBracket.classList.remove('hidden');
      this.lockonBracket.style.left = `${screenPos.x}px`;
      this.lockonBracket.style.top = `${screenPos.y}px`;
      this.lockonDistance.textContent = `${distance.toFixed(1)}m - SIGNAL THERMIQUE`;
      if (isWeakpoint) this.weakpointTag.classList.remove('hidden');
      else this.weakpointTag.classList.add('hidden');
    } else {
      this.lockonBracket.classList.add('hidden');
    }
  }

  showActionPrompt(text) {
    this.actionPromptText.textContent = text;
    this.actionPrompt.classList.remove('hidden');
  }

  hideActionPrompt() {
    this.actionPrompt.classList.add('hidden');
  }

  showLogMessage(msg, duration = 3000) {
    this.logBanner.textContent = msg;
    this.logBanner.classList.remove('hidden');
    setTimeout(() => {
      this.logBanner.classList.add('hidden');
    }, duration);
  }
}
