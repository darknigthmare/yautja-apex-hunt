import { formatWorldDistance } from './distanceFormat.js';
import { bindShipDialog, setShipText, shipEscape as escape } from './ShipInterfaceDom.js';
import { getShipMedicalRecovery, renderShipRecoveryNotice, refreshShipRecoveryNotice } from './ShipConsoleView.js';

const point = value => value && Number.isFinite(value.x) && Number.isFinite(value.z);
const coordinate = value => Number(value).toFixed(2);

export function getShipNavigationModel({ hub, player, selectedStationId = '' } = {}) {
  const stations = [...(hub?.getStations?.() ?? [])];
  const zones = [...(hub?.getZones?.() ?? [])];
  const station = stations.find(item => item.id === selectedStationId) ?? null;
  const route = station && point(player?.position)
    ? hub?.getNavigationRoute?.(player.position, station.id, { radius: 1.8 }) ?? null : null;
  const routeReady = route?.status === 'ready' && route.stationId === station?.id
    && Number.isFinite(route.distanceUnits) && route.distanceUnits >= 0;
  return { stations, zones, station, route, routeReady, playerPosition: player?.position,
    zone: point(player?.position) ? hub?.getZoneAt?.(player.position) ?? null : null,
    bounds: hub?.getBounds?.(), doors: [...(hub?.getDoors?.() ?? [])], recovery: getShipMedicalRecovery({ hub, player }),
    distance: routeReady ? formatWorldDistance(route.distanceUnits, { fractionDigits: 1 }) : 'Trajet indisponible',
  };
}

/** The plan is drawn from real compartment bounds and collision-safe route points. */
export function renderShipNavigationPlan(model) {
  const bounds = model.bounds;
  if (!bounds || ![bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ].every(Number.isFinite)
    || bounds.maxX <= bounds.minX || bounds.maxZ <= bounds.minZ) {
    return '<p class="ship-empty">Plan du croiseur indisponible.</p>';
  }
  const { minX, maxX, minZ, maxZ } = bounds;
  const zones = model.zones.filter(zone => zone.bounds && Object.values(zone.bounds).every(Number.isFinite));
  const route = model.routeReady ? (model.route.points ?? []).filter(point) : [];
  const station = model.station;
  return `<svg class="ship-plan" viewBox="${minX - 5} ${minZ - 5} ${maxX - minX + 10} ${maxZ - minZ + 10}" aria-hidden="true">
    ${zones.map(zone => {
      const b = zone.bounds;
      const selected = zone.id === station?.zoneId;
      return `<rect class="ship-plan-room${selected ? ' is-destination' : ''}${zone.id === model.zone?.id ? ' is-current' : ''}" x="${b.minX}" y="${b.minZ}" width="${b.maxX - b.minX}" height="${b.maxZ - b.minZ}" rx="1.1"/><text class="ship-plan-label" x="${(b.minX + b.maxX) / 2}" y="${(b.minZ + b.maxZ) / 2}">${escape(zone.label.split(' ').slice(0, 2).join(' '))}</text>`;
    }).join('')}
    ${model.doors.filter(door => point(door.position)).map(door => `<circle class="ship-plan-door" cx="${coordinate(door.position.x)}" cy="${coordinate(door.position.z)}" r="0.8"/>`).join('')}
    ${route.length > 1 ? `<polyline class="ship-plan-route" points="${route.map(value => `${coordinate(value.x)},${coordinate(value.z)}`).join(' ')}"/>` : ''}
    ${model.stations.filter(value => point(value.position)).map(value => `<circle class="ship-plan-station${value.id === station?.id ? ' is-destination' : ''}" cx="${coordinate(value.position.x)}" cy="${coordinate(value.position.z)}" r="${value.id === station?.id ? 2 : 0.9}"/>`).join('')}
    ${point(model.playerPosition) ? `<circle class="ship-plan-player" cx="${coordinate(model.playerPosition.x)}" cy="${coordinate(model.playerPosition.z)}" r="1.6"/>` : ''}
  </svg>`;
}

export class ShipNavigationView {
  constructor({ root, onAction = () => {} } = {}) {
    this.root = root; this.onAction = onAction; this.context = null;
    this.dialog = bindShipDialog(root, () => this.onAction({ type: 'close' }));
    if (!this.dialog) return;
    root.innerHTML = `<div class="ship-panel ship-navigation-panel">
      <header class="ship-dialog-header"><div><p class="ship-eyebrow">BIO-MASQUE · LIAISON CROISEUR</p><h2 id="ship-navigation-title" class="ship-dialog-title" tabindex="-1">Plan du croiseur</h2><p id="ship-navigation-location" class="ship-location"></p></div><button type="button" class="ship-close" data-ship-nav-action="close" aria-label="Fermer le plan et reprendre l’exploration">FERMER <span>ÉCHAP</span></button></header>
      ${renderShipRecoveryNotice('ship-navigation-recovery', 'data-ship-nav-action')}
      <div class="ship-navigation-layout"><figure class="ship-plan-frame"><div class="ship-plan-orientation">AVANT</div><div id="ship-navigation-map"></div><div class="ship-plan-orientation">ARRIÈRE</div><figcaption><span class="ship-plan-key is-current"></span> Votre position <span class="ship-plan-key is-route"></span> Itinéraire <span class="ship-plan-key is-target"></span> Destination</figcaption></figure>
      <section class="ship-destination-panel" aria-label="Destination dans le croiseur"><label for="ship-destination-select">REJOINDRE UN POSTE</label><select id="ship-destination-select"><option value="">Choisir une destination…</option></select><p id="ship-navigation-destination" class="ship-destination-name"></p><p id="ship-navigation-distance" class="ship-route-distance"></p><p id="ship-navigation-route-status" class="ship-route-status" role="status" aria-live="polite"></p><button type="button" id="ship-navigation-guide" class="ship-primary" data-ship-nav-action="waypoint" disabled>ACTIVER LE REPÈRE</button><p class="ship-control-hint">Le repère reste visible dans le bio-masque pendant le déplacement.</p></section></div>
    </div>`;
    this.select = root.querySelector('#ship-destination-select');
    this.select.addEventListener('change', () => this.renderSelection(this.select.value));
    root.addEventListener('click', event => {
      const button = event.target.closest?.('[data-ship-nav-action]');
      if (!button || button.disabled) return;
      if (button.dataset.shipNavAction === 'close') this.onAction({ type: 'close' });
      else if (button.dataset.shipNavAction === 'medical-waypoint') {
        if (this.model?.recovery.required && this.model.recovery.stationId) this.onAction({ type: 'waypoint', stationId: this.model.recovery.stationId });
      } else if (this.model?.routeReady && this.model.station) this.onAction({ type: 'waypoint', stationId: this.model.station.id });
    });
  }
  get isOpen() { return this.dialog?.isOpen ?? false; }
  show(context = {}) {
    if (!this.dialog) return false;
    this.context = context;
    const model = getShipNavigationModel(context);
    const knownZones = new Map(model.zones.map(zone => [zone.id, zone.label]));
    const groups = new Map();
    for (const station of model.stations) {
      const label = knownZones.get(station.zoneId) ?? 'Postes du croiseur';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(station);
    }
    this.select.innerHTML = '<option value="">Choisir une destination…</option>' + [...groups].map(([label, stations]) => `<optgroup label="${escape(label)}">${stations.map(station => `<option value="${escape(station.id)}">${escape(station.label)}</option>`).join('')}</optgroup>`).join('');
    this.select.value = model.station?.id ?? '';
    this.renderSelection(this.select.value);
    this.dialog.open(); return true;
  }
  renderSelection(stationId) {
    this.model = getShipNavigationModel({ ...this.context, selectedStationId: stationId });
    const model = this.model;
    this.root.querySelector('#ship-navigation-map').innerHTML = renderShipNavigationPlan(model);
    setShipText(this.root.querySelector('#ship-navigation-location'), model.zone?.label ?? 'Position dans le croiseur non identifiée');
    setShipText(this.root.querySelector('#ship-navigation-destination'), model.station?.label ?? 'Aucune destination sélectionnée');
    setShipText(this.root.querySelector('#ship-navigation-distance'), model.station ? model.distance : '');
    const doorCount = model.route?.doorIds?.length ?? 0;
    const message = !model.station ? 'Choisissez un poste pour afficher son itinéraire.' : model.routeReady
      ? `Itinéraire tracé${doorCount ? ` · ${doorCount} passage${doorCount > 1 ? 's' : ''} de cloison` : ''}.`
      : 'Aucun itinéraire praticable trouvé. Choisissez un autre poste.';
    setShipText(this.root.querySelector('#ship-navigation-route-status'), message);
    this.root.querySelector('#ship-navigation-guide').disabled = !model.routeReady;
    refreshShipRecoveryNotice(this.root.querySelector('#ship-navigation-recovery'), model.recovery);
  }
  refresh({ player = this.context?.player } = {}) {
    if (!this.isOpen || !this.context || !this.model) return;
    this.context.player = player;
    this.model.recovery = getShipMedicalRecovery({ hub: this.context.hub, player });
    refreshShipRecoveryNotice(this.root.querySelector('#ship-navigation-recovery'), this.model.recovery);
  }
  close(options) { this.dialog?.close(options); }
}
