/**
 * MonsterHunterHUD.js - Interface Utilisateur Dédiée aux Chasses de Proies Géantes
 * Offre le contrat visuel Monster Hunter : Jauge d'endurance, bris de parties,
 * niveau de traque de pistes, invite de dépeçage et bannière de trophée.
 */

export class MonsterHunterHUD {
  constructor(containerDocument = null) {
    this.doc = containerDocument || (typeof document !== 'undefined' ? document : null);
    this.panelId = 'monster-hunter-boss-hud-overlay';
    this.promptId = 'monster-hunter-carve-prompt';
    this.bannerId = 'monster-hunter-quest-banner';
    this.panelElement = null;
    this.promptElement = null;
    this.bannerElement = null;

    if (this.doc) {
      this.initElements();
    }
  }

  initElements() {
    if (!this.doc) return;

    // 1. Panneau Supérieur de Cible Monstre
    let panel = this.doc.getElementById(this.panelId);
    if (!panel) {
      panel = this.doc.createElement('div');
      panel.id = this.panelId;
      panel.className = 'monster-hunter-hud-panel';
      this.doc.body.appendChild(panel);
    }
    this.panelElement = panel;

    // 2. Invite d'Action Dépeçage
    let prompt = this.doc.getElementById(this.promptId);
    if (!prompt) {
      prompt = this.doc.createElement('div');
      prompt.id = this.promptId;
      prompt.className = 'monster-hunter-carve-prompt';
      prompt.style.display = 'none';
      this.doc.body.appendChild(prompt);
    }
    this.promptElement = prompt;

    // 3. Bannière de Quête Réussie
    let banner = this.doc.getElementById(this.bannerId);
    if (!banner) {
      banner = this.doc.createElement('div');
      banner.id = this.bannerId;
      banner.className = 'monster-hunter-quest-banner';
      banner.style.display = 'none';
      this.doc.body.appendChild(banner);
    }
    this.bannerElement = banner;
  }

  updateMonsterStatus(data = {}) {
    if (!this.panelElement) return;

    const {
      monsterName = 'Proie Géante Apex',
      hpPercent = 100,
      staminaPercent = 100,
      scoutLevel = 0,
      isEnraged = false,
      isExhausted = false,
      isToppled = false,
      brokenParts = {}
    } = data;

    let statusBadge = '<span class="mh-badge normal">ACTIF</span>';
    if (isToppled) {
      statusBadge = '<span class="mh-badge toppled">À TERRE (TOPPLE)</span>';
    } else if (isEnraged) {
      statusBadge = '<span class="mh-badge enraged">ENRAGÉ (FRENZY)</span>';
    } else if (isExhausted) {
      statusBadge = '<span class="mh-badge exhausted">ÉPUISÉ (DROOLING)</span>';
    }

    const html = `
      <div class="mh-header">
        <h4>${monsterName}</h4>
        ${statusBadge}
      </div>
      <div class="mh-bars">
        <div class="mh-bar-container hp">
          <div class="mh-bar-fill hp" style="width: ${Math.max(0, Math.min(100, hpPercent))}%;"></div>
        </div>
        <div class="mh-bar-container stamina">
          <div class="mh-bar-fill stamina" style="width: ${Math.max(0, Math.min(100, staminaPercent))}%;"></div>
        </div>
      </div>
      <div class="mh-parts">
        <span class="mh-part ${brokenParts.head ? 'broken' : 'intact'}">TÊTE: ${brokenParts.head ? 'BRISÉE' : 'INTACTE'}</span>
        <span class="mh-part ${brokenParts.tail ? 'broken' : 'intact'}">QUEUE: ${brokenParts.tail ? 'SECTIONNÉE' : 'INTACTE'}</span>
        <span class="mh-scout">TRAQUE: NIVEAU ${scoutLevel}/3</span>
      </div>
    `;

    this.panelElement.innerHTML = html;
    this.panelElement.style.display = 'block';
  }

  showCarvePrompt(targetName = 'CARCASSE APEX') {
    if (!this.promptElement) return;
    this.promptElement.innerHTML = `
      <div class="carve-prompt-box">
        <span class="key-indicator">[E]</span>
        <span class="action-text">PRÉLEVER LE TROPHÉE RITUEL (${targetName})</span>
      </div>
    `;
    this.promptElement.style.display = 'block';
  }

  hideCarvePrompt() {
    if (this.promptElement) {
      this.promptElement.style.display = 'none';
    }
  }

  displayQuestCompleteBanner(materials = [], honor = 0) {
    if (!this.bannerElement) return;

    const materialsHtml = materials
      .map((m) => `<li><span class="rarity-${m.rarity.toLowerCase()}">[${m.rarity}]</span> ${m.name} (+${m.honor} Honneur)</li>`)
      .join('');

    this.bannerElement.innerHTML = `
      <div class="quest-complete-inner">
        <h2>PROIE GÉANTE TRAQUÉE ET PRÉLEVÉE</h2>
        <h3>CHASSE DE PRESTIGE YAUTJA ACCOMPLIE</h3>
        <p class="honor-gain">+${honor} POINTS D'HONNEUR DU CLAN</p>
        <ul class="harvested-materials-list">
          ${materialsHtml}
        </ul>
      </div>
    `;

    this.bannerElement.style.display = 'block';
    setTimeout(() => {
      if (this.bannerElement) this.bannerElement.style.display = 'none';
    }, 6000);
  }

  dispose() {
    if (this.panelElement && this.doc?.body.contains(this.panelElement)) {
      this.doc.body.removeChild(this.panelElement);
    }
    if (this.promptElement && this.doc?.body.contains(this.promptElement)) {
      this.doc.body.removeChild(this.promptElement);
    }
    if (this.bannerElement && this.doc?.body.contains(this.bannerElement)) {
      this.doc.body.removeChild(this.bannerElement);
    }
  }
}
