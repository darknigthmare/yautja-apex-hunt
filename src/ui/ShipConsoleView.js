import { HUNTER_CLASSES } from '../data/RuntimeEquipment.js';
import { HUNT_DEFINITIONS } from '../data/GameConfig.js';
import { LORE_SOURCES, CURRENT_HUNTS } from '../data/LoreCodex.js';
import { SHIP_TRANSPORTS } from '../gameplay/ShipServiceRuntime.js';
import { bindShipDialog, setShipText, shipEscape as escape } from './ShipInterfaceDom.js';

const number = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const numeric = value => Number.isFinite(value) && value >= 0 ? number.format(value) : '—';
const count = value => Array.isArray(value) ? numeric(new Set(value).size) : '—';
const meter = (value, max) => Number.isFinite(value) && Number.isFinite(max) && max > 0 ? `${numeric(value)} / ${numeric(max)}` : '—';
const knownHuntId = value => typeof value === 'string' && Object.hasOwn(HUNT_DEFINITIONS, value) ? value : null;

/** Readouts come only from the live player; unknown values remain unknown. */
export function getShipPlayerReadout(player = {}) {
  const hunter = HUNTER_CLASSES.find(item => item.id === player.customization?.hunterClassId);
  return [
    { id: 'health', label: 'Santé', value: meter(player.health, player.maxHealth), primary: true },
    { id: 'energy', label: 'Énergie', value: meter(player.energy, player.maxEnergy), primary: true },
    { id: 'stamina', label: 'Endurance', value: meter(player.stamina, player.maxStamina), primary: true },
    { id: 'honor', label: 'Crédits d’honneur', value: numeric(player.honorScore) },
    { id: 'rank', label: 'Rang de clan', value: player.ranks?.[player.honorRankIndex] ?? '—' },
    { id: 'lifetime', label: 'Honneur cumulé', value: numeric(player.lifetimeHonor) },
    { id: 'hunts', label: 'Contrats accomplis', value: count(Array.isArray(player.completedHunts)
      ? player.completedHunts.filter(knownHuntId) : undefined) },
    { id: 'directives', label: 'Directives accomplies', value: count(player.completedDirectiveIds) },
    { id: 'discoveries', label: 'Sites découverts', value: count(player.discoveredPoiIds) },
    { id: 'class', label: 'Profil du harnais', value: hunter?.name ?? '—' },
  ];
}

const service = (id, label, description) => ({ id, label, description, disabled: false });
const ownValue = (object, key) => object && typeof object === 'object'
  ? Object.getOwnPropertyDescriptor(object, key)?.value : undefined;

export function formatShipInspectionSource(source) {
  if (typeof source === 'string') return source.trim() || 'Référence non renseignée';
  if (!source || typeof source !== 'object' || Array.isArray(source)) return 'Référence non renseignée';
  const fields = ['title', 'label', 'name', 'reference', 'work', 'media', 'originMedia', 'sourceTier', 'basisTier', 'continuity', 'year'];
  const values = fields.map(key => ownValue(source, key)).filter(value => typeof value === 'string' && value.trim()
    || typeof value === 'number' && Number.isFinite(value)).map(String);
  return [...new Set(values)].join(' · ') || 'Référence non renseignée';
}

export function getShipInspectionSourceIds(metadata) {
  const values = ownValue(metadata, 'sources');
  if (!Array.isArray(values)) return [];
  return [...new Set(Object.values(Object.getOwnPropertyDescriptors(values))
    .map(property => property.value).filter(value => typeof value === 'string' && value.trim()).slice(0, 32))];
}

/** A source is the declared work, never the renderer method used to make a prop. */
export function getShipInspectionReference(metadata, { huntId = null } = {}) {
  const titles = ids => [...new Set(ids.filter(id => Object.hasOwn(LORE_SOURCES, id))
    .map(id => LORE_SOURCES[id].title).filter(Boolean))];
  const declaredTitles = titles(getShipInspectionSourceIds(metadata));
  if (declaredTitles.length) return declaredTitles.join(' · ');
  const subjectId = knownHuntId(huntId) ?? knownHuntId(ownValue(metadata, 'itemId'));
  const subject = CURRENT_HUNTS.find(entry => entry.id === subjectId);
  const subjectTitles = titles(subject?.sources ?? []);
  if (subjectTitles.length) return subjectTitles.join(' · ');
  const source = ownValue(metadata, 'source');
  const text = formatShipInspectionSource(source);
  // These are implementation bindings retained separately for diagnostics.
  const technical = typeof source === 'string' && /\b(?:YautjaPlayer|MothershipHub|ShipEquipmentDisplays)\b|\bsrc\/|\.js\b|\b(?:fire|create)[A-Z]\w*/.test(source);
  return technical ? 'Référence documentaire non renseignée' : text;
}

export function getShipInspectionModel(station) {
  if (!['equipment_inspection', 'trophy_inspection', 'contract_inspection'].includes(station?.interactionType)
    && !(station?.interactionType === 'mission_contract' && station.inspection)) return null;
  const metadata = station.inspection;
  const itemId = ownValue(metadata, 'itemId');
  const huntId = knownHuntId(station.huntId) ?? knownHuntId(itemId);
  const hunt = HUNT_DEFINITIONS[huntId];
  const modelStatus = ownValue(metadata, 'modelStatus');
  const isTrophy = station.interactionType === 'trophy_inspection';
  const isContract = ['contract_inspection', 'mission_contract'].includes(station.interactionType);
  const unlocked = ownValue(metadata, 'unlocked');
  const artifact = isTrophy ? unlocked === true ? 'Trophée acquis · étude exposée' : unlocked === false
    ? 'Projection d’étude · trophée non acquis' : 'Étude exposée · acquisition non renseignée'
    : isContract ? 'Projection du contrat de chasse' : 'Équipement exposé · configuration au harnais';
  return { label: ownValue(metadata, 'label') ?? station.label, huntId,
    source: getShipInspectionReference(metadata, { huntId }),
    representation: ['runtime_weapon_geometry', 'runtime_preset_equipment_geometry'].includes(modelStatus)
      ? 'Géométrie de l’équipement jouable · interprétation du jeu' : isTrophy
        ? 'Étude sculpturale originale' : 'Interprétation visuelle du jeu',
    subject: hunt?.name ?? Object.values(HUNT_DEFINITIONS).find(value => value.bossType === ownValue(metadata, 'sourceBossType'))?.name,
    artifact, scope: 'Fidélité visuelle 1:1 non vérifiée',
  };
}

export function getShipMedicalRecovery({ hub, player } = {}) {
  const station = hub?.getStations?.().find(item => item.interactionType === 'cleaner_lab') ?? null;
  return { required: player?.requiresMedicalRecovery === true, stationId: station?.id ?? null,
    stationLabel: station?.label ?? 'Poste médical',
    message: 'Départ suspendu : une récupération médicale au laboratoire Cleaner est nécessaire avant la prochaine chasse.',
  };
}

export function renderShipRecoveryNotice(id, actionAttribute) {
  return `<section id="${id}" class="ship-recovery-notice hidden" role="status" aria-live="polite"><div><strong>RÉCUPÉRATION MÉDICALE REQUISE</strong><p class="ship-recovery-message"></p></div><button type="button" ${actionAttribute}="medical-waypoint">GUIDER VERS LE POSTE MÉDICAL</button></section>`;
}

export function refreshShipRecoveryNotice(root, recovery) {
  if (!root) return;
  root.classList.toggle('hidden', !recovery.required);
  setShipText(root.querySelector('.ship-recovery-message'), recovery.message);
  const button = root.querySelector('button');
  if (button) {
    button.disabled = !recovery.stationId;
    button.setAttribute('aria-label', `Guider vers ${recovery.stationLabel}`);
  }
}

export function getShipStationServices(station, player = {}) {
  const type = station?.interactionType;
  if (type === 'equipment_inspection') return [service('loadout', 'Configurer le paquetage', 'Choisir les équipements embarqués pour la prochaine chasse.'), service('armory', 'Consulter l’armurerie', 'Retrouver les variantes et les équipements du chasseur.')];
  if (type === 'trophy_inspection' || type === 'contract_inspection') {
    const inspection = getShipInspectionModel(station);
    return [...(inspection?.huntId ? [service('prepare_hunt', `Préparer ${HUNT_DEFINITIONS[inspection.huntId].name}`, 'Choisir le paquetage puis confirmer le déploiement.')] : []), service('codex', 'Consulter les références', 'Retrouver les archives et les dossiers du clan.')];
  }
  if (type === 'mission_contract') return [service('prepare_hunt', `Préparer ${station.label}`, 'Choisir le paquetage puis confirmer le déploiement.')];
  if (type === 'contracts') return [service('contracts', 'Choisir un contrat de chasse', 'Consulter les cibles, les mondes et les directives.'), service('loadout', 'Vérifier le paquetage', 'Inspecter les armes et les technologies embarquées.')];
  if (type === 'forge') return [service('armory', 'Configurer le chasseur', 'Armures, bio-masques et profil du harnais.'), service('crafting', 'Façonner les trophées', 'Employer les matériaux physiques et les crédits d’honneur.'), service('loadout', 'Préparer le paquetage', 'Choisir les équipements de la prochaine chasse.')];
  if (type === 'trophies') return [service('codex', 'Consulter les archives du clan', 'Sources, espèces et dossiers de chasse.')];
  if (type === 'hangar' || type === 'escape_pods' || type === 'airlock') {
    const transports = type === 'airlock' ? [] : Object.values(SHIP_TRANSPORTS).map(transport => ({
      ...service(`select_transport_${transport.kind}`, transport.label, 'Choisir le vecteur du prochain départ.'),
      selected: player.shipServiceState?.selectedTransportKind === transport.kind,
      sourceLabel: transport.sourceTier === 'ORIGINAL' ? 'TRANSPORT ORIGINAL DU JEU' : transport.sourceTier,
      reason: player.shipServiceState?.selectedTransportKind === transport.kind ? 'Sélectionné pour le prochain départ.' : '',
    }));
    return [...transports, service('loadout', 'Préparer la prochaine traque', 'Vérifier le paquetage avant le déploiement.'), service('contracts', 'Choisir une destination de chasse', 'Retrouver les contrats disponibles au nexus.')];
  }
  if (type === 'cleaner_lab') return [service('medical', 'Accéder au Medicomp', 'Stérilisation, soins et réapprovisionnement de la réserve médicale.')];
  if (type === 'cryo') {
    const restored = player.health >= player.maxHealth && player.stamina >= player.maxStamina;
    return [{ ...service('restore_vitals', 'Stabiliser les constantes', 'Restaurer la santé et l’endurance du chasseur.'), disabled: restored, reason: restored ? 'Santé et endurance déjà restaurées.' : '' }];
  }
  if (type === 'core') {
    const needsRepair = Number.isFinite(player.wristShieldIntegrity) && player.wristShieldIntegrity < 100;
    const needsReset = ['wristShieldCooldown', 'scoutDroneCooldown', 'shurikenCooldown', 'apexDecoyCooldown', 'waterDisruptionTimer']
      .some(key => Number.isFinite(player[key]) && player[key] > 0);
    const charged = Number.isFinite(player.maxEnergy) && player.energy >= player.maxEnergy && !needsRepair && !needsReset;
    return [{ ...service('recharge', 'Restaurer le harnais et ses systèmes', 'Recharger l’énergie, réparer le bouclier et réinitialiser les systèmes auxiliaires.'), disabled: charged, reason: charged ? 'Énergie, bouclier et systèmes auxiliaires opérationnels.' : '' }];
  }
  return [];
}

export function getShipConsoleModel({ hub, player, station, notice = '' } = {}) {
  if (!station) return null;
  const zone = hub?.getZones?.().find(item => item.id === station.zoneId) ?? hub?.getZoneAt?.(station.position);
  const trophies = Array.isArray(player?.completedHunts) ? [...new Set(player.completedHunts)].filter(knownHuntId)
    .map(id => HUNT_DEFINITIONS[id]?.name).filter(Boolean) : [];
  const alerts = [player?.isAcidCorroded === true ? 'Corrosion acide détectée' : null,
    player?.isBleeding === true ? 'Hémorragie détectée' : null].filter(Boolean);
  const knownMedicalState = typeof player?.isAcidCorroded === 'boolean' && typeof player?.isBleeding === 'boolean';
  return { station, zone, notice, readout: getShipPlayerReadout(player), services: getShipStationServices(station, player), trophies,
    inspection: getShipInspectionModel(station),
    recovery: getShipMedicalRecovery({ hub, player }),
    medicalStatus: alerts.length ? alerts.join(' · ') : knownMedicalState ? 'Aucune alerte médicale détectée' : 'Télémétrie médicale indisponible',
  };
}

export class ShipConsoleView {
  constructor({ root, onAction = () => {} } = {}) {
    this.root = root; this.onAction = onAction;
    this.dialog = bindShipDialog(root, () => this.onAction({ type: 'close' }));
    if (!this.dialog) return;
    root.addEventListener('click', event => {
      const button = event.target.closest?.('[data-ship-console-action]');
      if (!button || button.disabled) return;
      const action = button.dataset.shipConsoleAction;
      if (action === 'service') {
        const available = this.model?.services.find(item => item.id === button.dataset.serviceId && !item.disabled);
        if (available) this.onAction({ type: 'service', stationId: this.model.station.id, serviceId: available.id });
      } else if (action === 'medical-waypoint') {
        if (this.model?.recovery.required && this.model.recovery.stationId) this.onAction({ type: 'waypoint', stationId: this.model.recovery.stationId });
      } else this.onAction({ type: action });
    });
  }
  get isOpen() { return this.dialog?.isOpen ?? false; }
  show(context = {}) {
    if (!this.dialog) return false;
    const model = getShipConsoleModel(context);
    if (!model) return false;
    this.context = context; this.model = model;
    this.root.innerHTML = `<div class="ship-panel ship-console-panel"><header class="ship-dialog-header"><div><p class="ship-eyebrow">LIAISON AU POSTE · ${escape(model.zone?.label ?? 'CROISEUR')}</p><h2 id="ship-console-title" class="ship-dialog-title" tabindex="-1">${escape(model.station.label)}</h2></div><button type="button" class="ship-close" data-ship-console-action="close" aria-label="Quitter le poste et reprendre l’exploration">FERMER <span>ÉCHAP</span></button></header>
      ${renderShipRecoveryNotice('ship-console-recovery', 'data-ship-console-action')}
      <div class="ship-console-body"><section class="ship-service-section" aria-label="Services de ce poste">
      ${model.inspection ? `<section class="ship-inspection-record" aria-label="Exposé inspecté"><p class="ship-eyebrow">EXPOSÉ INSPECTÉ</p><h3>${escape(model.inspection.label)}</h3><dl><div><dt>Référence déclarée</dt><dd>${escape(model.inspection.source)}</dd></div><div><dt>Représentation</dt><dd>${escape(model.inspection.representation)}</dd></div>${model.inspection.subject ? `<div><dt>Sujet</dt><dd>${escape(model.inspection.subject)}</dd></div>` : ''}<div><dt>Registre du clan</dt><dd id="ship-inspection-artifact">${escape(model.inspection.artifact)}</dd></div></dl><p>${escape(model.inspection.scope)}</p></section>` : ''}
      <p class="ship-eyebrow">SERVICES DU POSTE</p><div class="ship-service-list">${model.services.map(item => `<button type="button" class="ship-service-button${item.selected ? ' is-selected' : ''}" data-ship-console-action="service" data-service-id="${escape(item.id)}"${typeof item.selected === 'boolean' ? ` aria-pressed="${item.selected}"` : ''}${item.disabled ? ' disabled' : ''}><span class="ship-service-icon" aria-hidden="true">◇</span><span><strong>${escape(item.label)}</strong><small>${escape(item.description)}</small>${item.sourceLabel ? `<small class="ship-service-source">${escape(item.sourceLabel)}</small>` : ''}<span class="ship-service-reason" data-service-reason="${escape(item.id)}">${escape(item.reason ?? '')}</span></span><span class="ship-service-arrow" aria-hidden="true">›</span></button>`).join('') || '<p class="ship-empty">Aucun service actif sur ce poste.</p>'}</div>
        ${model.station.interactionType === 'navigation' ? '<p class="ship-service-description">Le pont donne accès au plan des compartiments et aux itinéraires vers les postes du croiseur.</p>' : ''}
        ${model.station.interactionType === 'trophies' ? `<div class="ship-trophy-record"><h3>Contrats accomplis</h3><p>${model.trophies.length ? model.trophies.map(escape).join(' · ') : 'Aucun contrat accompli dans le registre actuel.'}</p></div>` : ''}
        <p id="ship-console-notice" class="ship-console-notice" role="status" aria-live="polite">${escape(model.notice)}</p></section>
      <aside class="ship-player-panel" aria-label="Constantes du chasseur"><p class="ship-eyebrow">HARNAIS DU CHASSEUR</p><dl class="ship-vitals">${model.readout.filter(item => item.primary).map(item => `<div><dt>${escape(item.label)}</dt><dd data-ship-readout="${item.id}">${escape(item.value)}</dd></div>`).join('')}</dl><p id="ship-medical-status" class="ship-medical-status">${escape(model.medicalStatus)}</p><dl class="ship-record-summary">${model.readout.filter(item => ['honor', 'rank'].includes(item.id)).map(item => `<div><dt>${escape(item.label)}</dt><dd data-ship-readout="${item.id}">${escape(item.value)}</dd></div>`).join('')}</dl><details class="ship-personal-record"><summary tabindex="0">Registre personnel</summary><dl>${model.readout.filter(item => !item.primary && !['honor', 'rank'].includes(item.id)).map(item => `<div><dt>${escape(item.label)}</dt><dd data-ship-readout="${item.id}">${escape(item.value)}</dd></div>`).join('')}</dl></details></aside></div>
      <footer class="ship-dialog-footer"><button type="button" data-ship-console-action="navigation">PLAN DU CROISEUR <span>[N]</span></button><p>Retour à la coursive : Échap ou Fermer.</p></footer></div>`;
    refreshShipRecoveryNotice(this.root.querySelector('#ship-console-recovery'), model.recovery);
    this.dialog.open(); return true;
  }
  refresh({ player = this.context?.player, notice = this.model?.notice ?? '' } = {}) {
    if (!this.isOpen || !this.context) return;
    const model = getShipConsoleModel({ ...this.context, player, notice }); this.model = model;
    for (const item of model.readout) setShipText(this.root.querySelector(`[data-ship-readout="${item.id}"]`), item.value);
    setShipText(this.root.querySelector('#ship-medical-status'), model.medicalStatus);
    setShipText(this.root.querySelector('#ship-console-notice'), notice);
    if (model.inspection) setShipText(this.root.querySelector('#ship-inspection-artifact'), model.inspection.artifact);
    refreshShipRecoveryNotice(this.root.querySelector('#ship-console-recovery'), model.recovery);
    for (const item of model.services) {
      const button = this.root.querySelector(`[data-service-id="${item.id}"]`);
      if (button) {
        button.disabled = item.disabled;
        if (typeof item.selected === 'boolean') {
          button.setAttribute('aria-pressed', String(item.selected));
          button.classList.toggle('is-selected', item.selected);
        }
      }
      setShipText(this.root.querySelector(`[data-service-reason="${item.id}"]`), item.reason ?? '');
    }
  }
  close(options) { this.dialog?.close(options); }
}
