import { ShipServiceRuntime } from './ShipServiceRuntime.js';
import { HUNT_DEFINITIONS } from '../data/GameConfig.js';
import { getLoadoutItemById } from './HuntLoadoutSystem.js';
import { getShipStationServices, getShipInspectionReference, getShipInspectionSourceIds } from '../ui/ShipConsoleView.js';
import { getNearbyShipDisplay } from '../world/ShipDisplayInspection.js';

/** Couples physical ship posts, real services and their bio-mask projections. */
export class ShipInteractionController {
  constructor(game) {
    this.game = game;
    this.services = new ShipServiceRuntime(game.player, { onChange: () => game.saveProgress?.() });
    this.stationId = null;
    this.waypointId = null;
    this.route = null;
    this.routeOrigin = null;
    this.routeElapsed = 0;
    this.terminalElapsed = 0;
    this.displayElapsed = 1;
    this.displayOrigin = null;
    this.displayHit = null;
    this.inspectionStation = null;
    game.hud.setShipInterfaceActionHandler?.(action => this.handleAction(action));
  }

  isOpen() { return this.game.hud.isShipInterfaceOpen?.() === true; }
  getStation(id) {
    if (this.inspectionStation?.id === id) return this.inspectionStation;
    return this.game.hub.getStation?.(id)
      ?? this.game.hub.getStations?.().find(station => station.id === id) ?? null;
  }

  releaseInput() {
    const g = this.game;
    g.resetKeyboardInput?.(); g.resetCameraTouchInput?.(); g.resetHubTouchInput?.();
    g.gamepadAxes = { x: 0, z: 0 };
    g.syncInputDirection?.(); g.setHubTouchControlsVisible?.(false);
    if (typeof document !== 'undefined' && document.pointerLockElement) document.exitPointerLock?.();
    g.hud.hideActionPrompt?.(); g.renderDirty = true;
  }

  syncTerminal(station = this.getStation(this.stationId)) {
    const g = this.game, p = g.player;
    const slots = g.activeHuntLoadout?.slots ?? {};
    const ids = Object.values(slots).flat().filter(id => typeof id === 'string');
    const loadoutItems = [...new Set(ids)].map(id => getLoadoutItemById(id)?.name).filter(Boolean);
    const selectedHunt = station?.huntId ?? g.pendingHunt?.huntType;
    g.hub.setTerminalContext?.({ stationId: station?.id ?? '', zoneId: station?.zoneId ?? '',
      stationTitle: station?.label ?? 'CROISEUR · SYSTÈMES DE BORD',
      honorScore: p.honorScore, health: p.health, maxHealth: p.maxHealth, energy: p.energy,
      loadoutItems, targetLabel: HUNT_DEFINITIONS[selectedHunt]?.name ?? 'Aucun contrat préparé',
      routeLabel: this.route?.status === 'ready' ? this.getStation(this.waypointId)?.label ?? '' : '' });
  }

  openStation(station) {
    const g = this.game;
    if (g.gameState !== 'HUB' || !g.isHubExploring || !station
      || g.hub.getNearbyStation(g.player.position)?.id !== station.id) return false;
    this.releaseInput(); this.stationId = station.id;
    if (station.huntId) {
      const entry = g.hub.shipEquipmentDisplays?.entries.find(item => item.itemId === station.huntId
        && ['contract', 'contract_projection'].includes(item.inspectionType));
      if (entry) station = { ...station, inspection: this.inspectionMetadata(entry) };
    }
    const opened = g.hud.showShipConsole?.({ hub: g.hub, player: g.player, station,
      notice: g.player.requiresMedicalRecovery ? 'Stabilisation d’urgence : traitement au laboratoire requis avant le départ.' : '' }) === true;
    this.syncTerminal(station);
    return opened;
  }

  inspectionMetadata(entry) {
    const nested = Object.getOwnPropertyDescriptor(entry ?? {}, 'metadata')?.value;
    const metadata = nested && typeof nested === 'object' ? nested : entry;
    const value = key => Object.getOwnPropertyDescriptor(metadata ?? {}, key)?.value;
    const object = Object.getOwnPropertyDescriptor(entry ?? {}, 'object')?.value;
    const userData = Object.getOwnPropertyDescriptor(object ?? {}, 'userData')?.value;
    const liveUnlocked = Object.getOwnPropertyDescriptor(userData ?? {}, 'unlocked')?.value;
    return { itemId: value('itemId') ?? entry.itemId, label: value('label') ?? entry.label,
      source: getShipInspectionReference(metadata, { huntId: entry.huntId ?? entry.itemId }),
      sources: getShipInspectionSourceIds(metadata),
      implementationSource: value('implementationSource') ?? value('source'),
      sourceBossType: value('sourceBossType'), modelStatus: value('modelStatus'),
      unlocked: typeof liveUnlocked === 'boolean' ? liveUnlocked : value('unlocked') };
  }

  getNearbyExhibit(force = false) {
    const g = this.game;
    if (g.gameState !== 'HUB' || !g.isHubExploring) return null;
    if (!force && this.displayOrigin && this.displayElapsed < 0.35
      && this.displayOrigin.distanceTo(g.player.position) < 0.5) return this.displayHit;
    this.displayHit = getNearbyShipDisplay(g.hub, g.player.position, { lineOfSight: true });
    this.displayOrigin = g.player.position.clone(); this.displayElapsed = 0;
    return this.displayHit;
  }

  openExhibit(hit) {
    const g = this.game, current = this.getNearbyExhibit(true);
    if (!hit?.entry || current?.entry.id !== hit.entry.id) return false;
    const entry = hit.entry;
    const types = { equipment: 'equipment_inspection', trophy: 'trophy_inspection',
      contract: 'contract_inspection', contract_projection: 'contract_inspection' };
    if (!types[entry.inspectionType]) return false;
    this.releaseInput();
    const station = { id: entry.id, label: entry.label, zoneId: entry.zone,
      interactionType: types[entry.inspectionType], position: hit.point.clone(),
      inspection: this.inspectionMetadata(entry),
      ...(HUNT_DEFINITIONS[entry.itemId] ? { huntId: entry.itemId } : {}) };
    this.inspectionStation = station; this.stationId = station.id;
    this.syncTerminal(station);
    return g.hud.showShipConsole?.({ hub: g.hub, player: g.player, station }) === true;
  }

  openNavigation() {
    const g = this.game;
    if (g.gameState !== 'HUB' || !g.isGameStarted || !g.isHubExploring) return false;
    this.releaseInput(); this.stationId = null;
    g.hud.hideShipInterfaces?.();
    const opened = g.hud.showShipNavigation?.({ hub: g.hub, player: g.player,
      selectedStationId: this.waypointId ?? undefined }) === true;
    this.syncTerminal();
    return opened;
  }

  hide() {
    this.game.hud.hideShipInterfaces?.();
    this.stationId = null;
    this.inspectionStation = null;
  }

  close() {
    const g = this.game;
    this.hide(); this.releaseInput();
    g.setHubTouchControlsVisible?.(g.gameState === 'HUB' && g.isHubExploring);
    g.container?.focus?.(); g.renderDirty = true;
    if (g.gameState === 'HUB' && g.isHubExploring) g.requestPointerLockSafely?.();
    this.update(0);
  }

  setWaypoint(id) {
    const g = this.game;
    if (g.gameState !== 'HUB') return false;
    if (id == null) {
      this.waypointId = null; this.route = null; this.routeOrigin = null;
      g.hub.setNavigationRoute?.(null); this.syncTerminal(); this.close(); return true;
    }
    const station = this.getStation(id);
    if (!station) return false;
    const route = g.hub.getNavigationRoute?.(g.player.position, id, { radius: 1.8 });
    if (route?.status !== 'ready' || route.stationId !== id) return false;
    this.waypointId = id; this.route = route; this.routeOrigin = g.player.position.clone();
    this.routeElapsed = 0; g.hub.setNavigationRoute?.(route); this.syncTerminal(station);
    this.close(); return true;
  }

  handleAction(action = {}) {
    const g = this.game;
    if (g.gameState !== 'HUB') return false;
    if (action.type === 'close') { this.close(); return true; }
    if (action.type === 'medicomp' && g.isHubExploring) {
      this.hide(); this.releaseInput(); g.openMedbay(false); return true;
    }
    if (action.type === 'navigation') return this.openNavigation();
    if (action.type === 'waypoint') return this.setWaypoint(action.stationId);
    if (action.type !== 'service' || action.stationId !== this.stationId) return false;
    const station = this.getStation(action.stationId);
    if (!station) return false;
    if (this.inspectionStation?.id === station.id) {
      if (this.getNearbyExhibit(true)?.entry.id !== station.id) return false;
    } else if (g.hub.getNearbyStation(g.player.position)?.id !== station.id) return false;
    const available = getShipStationServices(station, g.player)
      .find(service => service.id === action.serviceId && !service.disabled);
    if (!available) return false;
    const result = this.services.perform(action.serviceId, { gameState: g.gameState, station });
    if (!result.success) return false;
    this.syncTerminal(station); g.hud.updateVitals?.(g.player); g.renderDirty = true;
    if (result.openTab) {
      this.hide(); g.showMissionSelectionModal(result.openTab);
      if (result.huntId && HUNT_DEFINITIONS[result.huntId]) {
        const hunt = HUNT_DEFINITIONS[result.huntId];
        g.prepareHunt(hunt.id, hunt.recommendedBiome ?? 'jungle', 'standard_hunt');
      }
    } else if (result.openMedbay) {
      this.hide(); g.openMedbay(true);
    } else {
      // Refresh in place so a successful service never destroys keyboard focus.
      g.hud.updateShipHUD?.({ hub: g.hub, player: g.player, visible: false,
        waypointStationId: this.waypointId, route: this.route, notice: result.message });
      g.hud.shipConsoleView?.refresh?.({ player: g.player, notice: result.message });
      if (result.message) g.hud.showLogMessage?.(result.message, 3000);
    }
    return true;
  }

  update(delta = 0) {
    const g = this.game;
    const elapsed = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    this.routeElapsed += elapsed;
    this.displayElapsed += elapsed;
    this.terminalElapsed += elapsed;
    if (g.gameState === 'HUB' && this.terminalElapsed >= 1) {
      this.syncTerminal(); this.terminalElapsed = 0;
    }
    if (g.gameState === 'HUB' && this.waypointId && this.routeElapsed >= 1) {
      const moved = !this.routeOrigin || this.routeOrigin.distanceTo(g.player.position) >= 2;
      if (moved) {
        this.route = g.hub.getNavigationRoute?.(g.player.position, this.waypointId, { radius: 1.8 }) ?? null;
        this.routeOrigin = g.player.position.clone();
        g.hub.setNavigationRoute?.(this.route); this.syncTerminal();
      }
      this.routeElapsed = 0;
    }
    g.hud.updateShipHUD?.({ hub: g.hub, player: g.player, waypointStationId: this.waypointId,
      route: this.route, visible: g.gameState === 'HUB' && g.isHubExploring && !this.isOpen() });
  }

  placeAtMedicalArrival(arrival) {
    const g = this.game;
    if (!arrival?.requiresMedicalRecovery) return false;
    const medical = g.hub.getStations?.().find(station => station.interactionType === 'cleaner_lab');
    const point = medical?.approachPosition ?? medical?.position;
    if (!point) return false;
    g.player.position.copy(point); g.hub.constrainPlayer?.(g.player.position, 1.8);
    g.player.mesh?.position?.copy(g.player.position);
    g.shipArrivalNotice = 'STABILISATION D’URGENCE — TRAITEMENT REQUIS AU LABORATOIRE CLEANER';
    return true;
  }
}
