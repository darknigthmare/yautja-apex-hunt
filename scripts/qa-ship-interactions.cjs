/* Real DOM ship flows. Teleports and depleted-resource fixtures are explicit;
 * the animation loop is paused to isolate transitions from regeneration/AI. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const VIEWPORTS = [
  { label: 'desktop', width: 1280, height: 800, mobile: false },
  { label: 'mobile-390', width: 390, height: 844, mobile: true },
  { label: 'mobile-320', width: 320, height: 740, mobile: true },
];

(async () => {
  const url = process.env.QA_BASE_URL || 'http://127.0.0.1:4291/';
  const output = process.env.QA_ARTIFACT_DIR || '/tmp/yautja-ship-interactions';
  fs.mkdirSync(output, { recursive: true });
  fs.rmSync(path.join(output, 'results.json'), { force: true });
  const labels = process.env.QA_VIEWPORTS?.split(',').map(value => value.trim()).filter(Boolean);
  if (labels?.some(label => !VIEWPORTS.some(viewport => viewport.label === label))) throw new Error('Unknown QA_VIEWPORTS label');
  const viewports = labels?.length ? VIEWPORTS.filter(viewport => labels.includes(viewport.label)) : VIEWPORTS;
  const report = { status: 'running', startedAt: new Date().toISOString(), url,
    method: 'Real Chromium, DOM keyboard/touch actions, loaded hero GLB and actual scene rendering. RAF paused for deterministic resource assertions; explicit station teleports and depleted-resource/incapacitation fixtures. No human QA or hardware FPS claim.',
    scenarios: [], screenshots: [], browserErrors: [], failedResources: [] };
  let browser, activePage, stage = 'startup';
  const progress = text => { stage = text; console.log(`[SHIP QA] ${text}`); };
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
    for (const viewport of viewports) {
      progress(`${viewport.label}: démarrage`);
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1, isMobile: viewport.mobile, hasTouch: viewport.mobile });
      const page = await context.newPage(); activePage = page; page.setDefaultTimeout(90000);
      await page.addInitScript(() => {
        window.requestAnimationFrame = () => 0;
        let seed = 1987; Math.random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
      });
      page.on('pageerror', error => report.browserErrors.push({ viewport: viewport.label, error: error.message }));
      page.on('console', message => { if (message.type() === 'error') report.browserErrors.push({ viewport: viewport.label, error: message.text() }); });
      page.on('requestfailed', request => report.failedResources.push({ viewport: viewport.label, url: request.url(), error: request.failure()?.errorText }));
      page.on('response', response => { if (response.status() >= 400) report.failedResources.push({ viewport: viewport.label, url: response.url(), status: response.status() }); });

      const snapshot = () => page.evaluate(() => {
        const p = window.__YAUTJA_APEX_HUNT__.player;
        return { health: p.health, maxHealth: p.maxHealth, energy: p.energy, stamina: p.stamina,
          acid: p.isAcidCorroded, acidTimer: p.acidTimer, bleeding: p.isBleeding,
          shield: p.wristShieldIntegrity, requiresMedicalRecovery: p.requiresMedicalRecovery,
          charges: { ...p.medbayInventory.charges }, honor: p.honorScore,
          trophies: [...p.completedHunts], transport: p.shipServiceState.selectedTransportKind };
      });
      const act = async selector => viewport.mobile ? page.locator(selector).tap() : page.locator(selector).click();
      const nearby = async stationId => page.evaluate(id => {
        const g = window.__YAUTJA_APEX_HUNT__, station = g.hub.getStation(id);
        if (!station) throw new Error(`Unknown station ${id}`);
        g.player.position.copy(station.approachPosition); g.hub.constrainPlayer(g.player.position, 1.8);
        g.player.mesh.position.copy(g.player.position); g.container.focus(); g.updateHubHUD(1);
        return { actual: g.hub.getNearbyStation(g.player.position)?.id, position: g.player.position.toArray() };
      }, stationId);
      const interact = async () => {
        if (viewport.mobile) await act('#btn-touch-hub-interact');
        else await page.keyboard.press('KeyE');
        await page.locator('#ship-console-dialog').waitFor({ state: 'visible' });
      };
      const assertWidth = async selector => {
        const sizes = await page.locator(selector).evaluate(element => {
          const r = element.getBoundingClientRect();
          return { left: r.left, right: r.right, viewport: window.innerWidth,
            document: document.documentElement.scrollWidth, body: document.body.scrollWidth,
            client: element.clientWidth, scroll: element.scrollWidth };
        });
        assert.ok(sizes.left >= -1 && sizes.right <= sizes.viewport + 1, `${viewport.label}: dialog outside viewport ${JSON.stringify(sizes)}`);
        assert.ok(sizes.scroll <= sizes.client + 1 && sizes.document <= sizes.viewport + 1 && sizes.body <= sizes.viewport + 1,
          `${viewport.label}: horizontal overflow ${JSON.stringify(sizes)}`);
        return sizes;
      };
      const photo = async name => {
        await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          if (g.gameState === 'HUB') {
            g.hub.update(0, true); g.updateCamera(1); g.updateHubHUD(0);
          } else if (g.gameState === 'HUNT') g.updateHUD();
          g.scene.updateMatrixWorld(true); g.camera.updateMatrixWorld(true); g.graphics.render('normal');
        });
        const file = `${viewport.label}-${name}.png`;
        await page.screenshot({ path: path.join(output, file), timeout: 90000 });
        report.screenshots.push(file);
      };
      const closeConsole = async () => {
        await act('#ship-console-dialog [data-ship-console-action="close"]');
        await page.locator('#ship-console-dialog').waitFor({ state: 'hidden' });
      };
      const preparePhysicalContract = async () => {
        assert.equal((await nearby('contract-console-goliath')).actual, 'contract-console-goliath');
        await interact();
        await act('#ship-console-dialog [data-service-id="prepare_hunt"]');
        await page.locator('#btn-loadout-recommended').waitFor({ state: 'visible' });
        await act('#btn-loadout-recommended');
        assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.pendingHunt?.huntType), 'goliath');
      };

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => Boolean(window.__YAUTJA_APEX_HUNT__));
      const loaded = await page.evaluate(async ({ width, height }) => {
        const g = window.__YAUTJA_APEX_HUNT__, body = await g.player.heroBodyReady;
        await document.fonts.ready; g.requestPointerLockSafely = () => false;
        g.settings.reducedMotion = true; g.graphics.setQuality('performance');
        g.hub.setShadowQuality('performance'); g.renderer.setPixelRatio(1); g.graphics.resize(width, height);
        return { bodyLoaded: Boolean(body?.isSkinnedMesh && g.player.mesh.userData.organicBodyLoaded),
          stations: g.hub.getStations().length, quality: g.graphics.getMetrics().quality };
      }, viewport);
      assert.equal(loaded.bodyLoaded, true); assert.equal(loaded.stations, 25);
      await act('#btn-start-game');
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.isHubExploring), true);
      // Start now enters the physical ship directly. With RAF paused, submit
      // the initial HUD/camera frame that the normal loop would submit next.
      await page.evaluate(() => {
        const g = window.__YAUTJA_APEX_HUNT__;
        g.updateHubExploration(0); g.updateCamera(1); g.graphics.render('normal');
      });

      if (process.env.QA_TROPHY_ONLY === '1') {
        progress(`${viewport.label}: trophée acquis et projection non acquise`);
        for (const unlocked of [false, true]) {
          const entry = await page.evaluate(acquired => {
            const g = window.__YAUTJA_APEX_HUNT__;
            // Explicit progression fixtures exercise both render/readout states;
            // this is not a claim of winning a full hunt in the harness.
            g.player.completedHunts = acquired ? ['goliath'] : [];
            g.hub.setTrophyState(g.player.completedHunts);
            const trophy = g.hub.trophyDisplays.get('goliath');
            const centre = trophy.getWorldPosition(g.player.position.clone());
            for (const offsetZ of [4.6, 5.2, 5.8, 6.4]) for (const offsetX of [0, -0.5, 0.5]) {
              const point = g.player.position.clone().set(centre.x + offsetX, 0, centre.z + offsetZ);
              const before = point.clone(); g.hub.constrainPlayer(point, 1.8);
              if (point.distanceTo(before) > 0.01 || g.hub.getNearbyStation(point)) continue;
              g.player.position.copy(point); g.player.mesh.position.copy(point);
              const hit = g.shipInterface.getNearbyExhibit(true);
              if (hit?.entry.itemId === 'goliath' && hit.entry.inspectionType === 'trophy') {
                g.container.focus(); g.updateHubHUD(1);
                return { id: hit.entry.id, itemId: hit.entry.itemId, unlocked: hit.entry.unlocked,
                  position: point.toArray(), distanceUnits: hit.distanceUs, modelStatus: hit.entry.modelStatus };
              }
            }
            throw new Error('No clear physical approach can inspect the seeded Goliath trophy');
          }, unlocked);
          assert.equal(entry.unlocked, unlocked, 'the display registry must carry an explicit acquired state');
          const before = await snapshot(); await interact();
          const artifact = await page.locator('#ship-inspection-artifact').textContent();
          assert.match(artifact, unlocked ? /Trophée acquis/ : /trophée non acquis/);
          assert.doesNotMatch(artifact, /non renseignée/);
          assert.deepEqual(await snapshot(), before, 'inspecting an acquired/projected trophy cannot grant rewards');
          const sizes = await assertWidth('.ship-console-panel');
          await photo(unlocked ? 'trophy-02-acquired' : 'trophy-01-unacquired-projection');
          report.scenarios.push({ viewport: viewport.label, name: 'physical-trophy-acquisition-readout',
            progressionFixture: unlocked ? ['goliath'] : [], entry, artifact, sizes });
          await closeConsole();
        }
        await context.close(); activePage = null;
        progress(`${viewport.label}: trophées vérifiés`);
        continue;
      }

      progress(`${viewport.label}: plan et itinéraire réel`);
      if (viewport.mobile) await act('#btn-ship-navigation');
      else await page.keyboard.press('KeyN');
      await page.locator('#ship-navigation-dialog').waitFor({ state: 'visible' });
      await page.locator('#ship-destination-select').selectOption('cleaner-lab-control');
      const navigation = await page.evaluate(() => {
        const g = window.__YAUTJA_APEX_HUNT__, model = g.hud.shipNavigationView.model;
        const polyline = document.querySelector('.ship-plan-route');
        const visual = polyline ? Array.from({ length: polyline.points.numberOfItems }, (_, index) => {
          const point = polyline.points.getItem(index); return [point.x, point.y];
        }) : [];
        let corrected = 0;
        const route = model.route;
        for (let i = 1; i < route.points.length; i++) {
          const start = route.points[i - 1], end = route.points[i], steps = Math.max(1, Math.ceil(start.distanceTo(end)));
          for (let j = 0; j <= steps; j++) {
            const position = start.clone().lerp(end, j / steps), before = position.clone();
            g.hub.constrainPlayer(position, 1.8); if (position.distanceTo(before) > 0.0001) corrected++;
          }
        }
        return { stationId: model.station.id, status: route.status, distanceUnits: route.distanceUnits,
          distanceMeters: route.distanceMeters, points: route.points.map(point => [point.x, point.z]), visual, corrected,
          text: document.getElementById('ship-navigation-distance').textContent };
      });
      assert.equal(navigation.stationId, 'cleaner-lab-control'); assert.equal(navigation.status, 'ready');
      assert.equal(navigation.corrected, 0); assert.ok(navigation.distanceUnits > 0);
      assert.ok(Math.abs(navigation.distanceMeters * 3 - navigation.distanceUnits) < 1e-6);
      assert.equal(navigation.visual.length, navigation.points.length);
      navigation.visual.forEach((point, i) => point.forEach((value, axis) => assert.ok(Math.abs(value - navigation.points[i][axis]) <= 0.011)));
      const navWidth = await assertWidth('.ship-navigation-panel'); await photo('01-navigation');
      await act('#ship-navigation-guide');
      await page.locator('#ship-navigation-dialog').waitFor({ state: 'hidden' });
      await page.locator('#ship-waypoint-hud').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.shipInterface.waypointId), 'cleaner-lab-control');
      report.scenarios.push({ viewport: viewport.label, name: 'real-route-and-waypoint', navigation, sizes: navWidth, loaded });

      progress(`${viewport.label}: poste médical sans soin automatique`);
      assert.equal((await nearby('cleaner-lab-control')).actual, 'cleaner-lab-control');
      await page.evaluate(() => {
        const p = window.__YAUTJA_APEX_HUNT__.player;
        p.health = p.maxHealth * 0.37; p.energy = 23; p.stamina = 31;
        p.isAcidCorroded = true; p.acidTimer = 7; p.isBleeding = true; p.wristShieldIntegrity = 38;
        Object.keys(p.medbayInventory.charges).forEach(id => { p.medbayInventory.charges[id] = 0; });
      });
      const beforeMedical = await snapshot();
      await interact();
      assert.deepEqual(await snapshot(), beforeMedical, 'opening the physical medical console must not grant treatment');
      const consoleWidth = await assertWidth('.ship-console-panel'); await photo('02-medical-before-service');
      await act('#ship-console-dialog [data-service-id="medical"]');
      await page.locator('#yautja-medbay-modal').waitFor({ state: 'visible' });
      const treated = await snapshot();
      assert.equal(treated.health, treated.maxHealth); assert.equal(treated.acid, false); assert.equal(treated.bleeding, false);
      assert.equal(treated.energy, beforeMedical.energy); assert.ok(Object.values(treated.charges).every(value => value > 0));
      assert.equal(treated.honor, beforeMedical.honor); assert.deepEqual(treated.trophies, beforeMedical.trophies);
      await act('#medbay-btn-close');
      await page.locator('#yautja-medbay-modal').waitFor({ state: 'hidden' });
      const resumed = await page.evaluate(() => ({ canvasFocused: document.activeElement === window.__YAUTJA_APEX_HUNT__.container,
        touchHidden: document.getElementById('touch-hub-controls').classList.contains('hidden') }));
      assert.equal(resumed.canvasFocused, true, 'closing medical service must restore the game focus');
      if (viewport.mobile) assert.equal(resumed.touchHidden, false, 'closing medical service must restore the hub touch controls');
      report.scenarios.push({ viewport: viewport.label, name: 'explicit-medical-service-and-input-return', before: beforeMedical, treated, resumed, sizes: consoleWidth });

      progress(`${viewport.label}: transport et inspection proche`);
      assert.equal((await nearby('vehicle-hangar')).actual, 'vehicle-hangar'); await interact();
      const beforeTransport = await snapshot();
      await act('#ship-console-dialog [data-service-id="select_transport_pod"]');
      assert.equal(await page.locator('[data-service-id="select_transport_pod"]').getAttribute('aria-pressed'), 'true');
      const afterTransport = await snapshot();
      assert.equal(afterTransport.transport, 'pod');
      assert.deepEqual({ ...afterTransport, transport: beforeTransport.transport }, beforeTransport, 'transport selection cannot create resources');
      await assertWidth('.ship-console-panel');
      await closeConsole();
      const exhibit = await page.evaluate(() => {
        const g = window.__YAUTJA_APEX_HUNT__;
        for (const x of [54, 54.6, 55]) for (const z of [4, 6, 8, 10, 12, 14, 16]) {
          const position = g.player.position.clone().set(x, 0, z), before = position.clone();
          g.hub.constrainPlayer(position, 1.8); if (position.distanceTo(before) > 0.01) continue;
          g.player.position.copy(position); g.player.mesh.position.copy(position);
          if (g.hub.getNearbyStation(position)) continue;
          const hit = g.shipInterface.getNearbyExhibit(true);
          if (hit?.entry.inspectionType === 'equipment') {
            g.container.focus(); g.updateHubHUD(1);
            return { id: hit.entry.id, itemId: hit.entry.itemId, label: hit.entry.label,
              distanceUnits: hit.distanceUs, modelStatus: hit.entry.modelStatus, position: position.toArray() };
          }
        }
        throw new Error('No clear nearby equipment inspection approach was found');
      });
      const beforeInspection = await snapshot(); await interact();
      await page.locator('.ship-inspection-record').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#ship-console-title').textContent(), exhibit.label);
      assert.match(await page.locator('.ship-inspection-record').textContent(), /1:1 non vérifiée/);
      assert.deepEqual(await snapshot(), beforeInspection, 'inspecting an exhibit must not grant a weapon or trophy');
      await assertWidth('.ship-console-panel'); await photo('03-equipment-inspection'); await closeConsole();
      report.scenarios.push({ viewport: viewport.label, name: 'transport-choice-and-nearby-inspection', selectedTransport: 'pod', exhibit });

      if (!viewport.mobile) {
        progress('desktop: ressources conservées au départ et au retour');
        await preparePhysicalContract();
        await page.evaluate(() => {
          const p = window.__YAUTJA_APEX_HUNT__.player;
          p.health = p.maxHealth * 0.41; p.energy = 31; p.stamina = 26;
          p.isAcidCorroded = true; p.acidTimer = 8; p.isBleeding = true; p.wristShieldIntegrity = 54;
          const id = Object.keys(p.medbayInventory.charges)[0]; p.medbayInventory.charges[id] = 1;
        });
        const departing = await snapshot(); await act('#btn-loadout-deploy');
        const inserted = await snapshot();
        assert.deepEqual(inserted, departing, 'deployment cannot silently refill resources');
        const vehicle = await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__, v = g.departureTransport;
          if (!v) throw new Error('Deployment created no physical transport');
          g.scene.updateMatrixWorld(true);
          const centre = v.mesh.getWorldPosition(g.player.position.clone());
          g.camera.position.copy(centre).add(g.player.position.clone().set(19, 11, 23));
          g.camera.lookAt(centre); g.camera.updateMatrixWorld(true); g.graphics.render('normal');
          return { gameState: g.gameState, type: v.type, state: v.state, profile: v.mesh.userData.vehicleProfile,
            deployment: v.mesh.userData.deploymentTransport, attached: v.mesh.parent === g.eventDirector.root,
            inDirector: g.eventDirector.vehicles.includes(v), visible: v.mesh.visible,
            childMeshes: v.mesh.children.filter(object => object.isMesh).length, calls: g.renderer.info.render.calls,
            position: centre.toArray(), interacted: v.interacted };
        });
        assert.equal(vehicle.gameState, 'HUNT'); assert.equal(vehicle.type, 'hunt_drop_pod');
        assert.equal(vehicle.profile, 'original_hunt_drop_pod'); assert.equal(vehicle.deployment.kind, 'pod');
        assert.equal(vehicle.attached, true); assert.equal(vehicle.inDirector, true); assert.equal(vehicle.visible, true);
        assert.ok(vehicle.childMeshes >= 4 && vehicle.calls > 0); assert.equal(vehicle.interacted, true);
        await photo('04-selected-drop-pod-in-hunt');
        await page.keyboard.press('KeyP'); await page.locator('#pause-modal').waitFor({ state: 'visible' });
        await act('#btn-abandon-hunt');
        assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.gameState), 'HUB');
        const returned = await snapshot(); assert.deepEqual(returned, departing, 'returning to the ship cannot silently refill resources');
        report.scenarios.push({ viewport: viewport.label, name: 'resource-preservation-and-visible-insertion-transport', departing, inserted, returned, vehicle });

        progress('desktop: urgence médicale bloque le déploiement');
        const emergency = await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__; g.player.health = 0; g.player.isDead = true;
          g.returnToMothershipHub();
          return { health: g.player.health, required: g.player.requiresMedicalRecovery,
            station: g.shipInterface.stationId, position: g.player.position.toArray() };
        });
        assert.equal(emergency.health, 1); assert.equal(emergency.required, true); assert.equal(emergency.station, 'cleaner-lab-control');
        await closeConsole(); await preparePhysicalContract(); await act('#btn-loadout-deploy');
        await page.locator('#ship-navigation-dialog').waitFor({ state: 'visible' });
        const blocked = await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          return { state: g.gameState, health: g.player.health, required: g.player.requiresMedicalRecovery,
            waypointId: g.shipInterface.waypointId, vehicles: g.eventDirector.vehicles.length,
            directDeployment: g.startHunt('goliath', 'jungle') };
        });
        assert.equal(blocked.state, 'HUB'); assert.equal(blocked.health, 1); assert.equal(blocked.required, true);
        assert.equal(blocked.waypointId, 'cleaner-lab-control'); assert.equal(blocked.vehicles, 0); assert.equal(blocked.directDeployment, false);
        await page.locator('#ship-navigation-recovery').waitFor({ state: 'visible' });
        await photo('05-emergency-deployment-refused');
        await act('#ship-navigation-dialog [data-ship-nav-action="close"]');
        assert.equal((await nearby('cleaner-lab-control')).actual, 'cleaner-lab-control'); await interact();
        assert.equal((await snapshot()).health, 1, 'opening the emergency terminal still does not treat automatically');
        await act('#ship-console-dialog [data-service-id="medical"]'); await page.locator('#yautja-medbay-modal').waitFor({ state: 'visible' });
        const recovered = await snapshot(); assert.equal(recovered.requiresMedicalRecovery, false); assert.equal(recovered.health, recovered.maxHealth);
        await act('#medbay-btn-close');
        report.scenarios.push({ viewport: viewport.label, name: 'emergency-recovery-deployment-gate', emergency, blocked, recovered });
      }
      await context.close(); activePage = null;
      progress(`${viewport.label}: terminé`);
    }
    assert.deepEqual(report.browserErrors, [], 'unexpected JavaScript/console errors');
    assert.deepEqual(report.failedResources, [], 'failed HTTP resources');
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed'; report.failure = { stage, name: error.name, message: error.message, stack: error.stack };
    if (activePage) try { await activePage.screenshot({ path: path.join(output, 'failure.png'), timeout: 30000 }); } catch {}
    throw error;
  } finally {
    report.completedAt = new Date().toISOString();
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
    await browser?.close();
    console.log(JSON.stringify({ status: report.status, scenarios: report.scenarios.length, screenshots: report.screenshots.length,
      browserErrors: report.browserErrors.length, failedResources: report.failedResources.length, output }));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
