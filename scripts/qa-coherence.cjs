/* Actual rendered proportions plus catalogue deployment and physical salvage. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const output = process.env.QA_ARTIFACT_DIR || '/tmp/yautja-coherence';
  fs.mkdirSync(output, { recursive: true });
  fs.rmSync(path.join(output, 'results.json'), { force: true });
  let server, browser;
  const errors = [], resources = [], results = [];
  const startedAt = new Date().toISOString();
  try {
    let currentURL = process.env.QA_BASE_URL;
    if (!currentURL) {
      const { preview } = await import('vite');
      server = await preview({ preview: { host: '127.0.0.1', port: 4293, strictPort: true } });
      currentURL = 'http://127.0.0.1:4293/';
    }
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
    const stages = process.env.QA_BASELINE_URL ? [['before', process.env.QA_BASELINE_URL], ['after', currentURL]] : [['after', currentURL]];
    for (const [stage, url] of stages) {
      const context = await browser.newContext({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 1 });
      const page = await context.newPage(); page.setDefaultTimeout(90000);
      await page.addInitScript(() => {
        window.requestAnimationFrame = () => 0;
        let seed = 1987;
        Math.random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296);
      });
      page.on('pageerror', error => errors.push({ stage, message: error.message }));
      page.on('console', message => { if (message.type() === 'error') errors.push({ stage, message: message.text() }); });
      page.on('requestfailed', request => resources.push({ stage, url: request.url(), error: request.failure()?.errorText }));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => Boolean(window.__YAUTJA_APEX_HUNT__));
      const hide = await page.addStyleTag({ content: '#hud-container,#helmet-frame,#vision-overlay,#scanline-overlay,[role=dialog],[role=alertdialog]{display:none!important}' });
      const scene = await page.evaluate(async () => {
        const g = window.__YAUTJA_APEX_HUNT__;
        const loaded = await g.player.heroBodyReady;
        if (!loaded?.isSkinnedMesh || !g.player.mesh.userData.organicBodyLoaded) throw new Error('Body GLB did not load');
        await document.fonts.ready;
        g.isGameStarted = true; g.settings.reducedMotion = true;
        g.requestPointerLockSafely = () => false;
        g.graphics.setQuality('high'); g.renderer.setPixelRatio(1); g.graphics.resize(1000, 700);
        g.startHunt('goliath', 'jungle');
        g.activeBoss.mesh.visible = false;
        g.activeEnemies.forEach(enemy => enemy.dispose()); g.activeEnemies = [];
        const place = (actor, x) => {
          actor.position.set(x, g.environment.sampleHeight(x, 460), 460);
          actor.mesh.position.copy(actor.position); actor.mesh.rotation.set(0, 0, 0); actor.mesh.visible = true;
        };
        place(g.player, 0);
        const human = g.spawnEncounterNpc({ enemyType: 'human_fireteam', position: { x: -7, y: 0, z: 460 } });
        const drone = g.spawnEncounterNpc({ enemyType: 'xeno_drone', position: { x: 7, y: 0, z: 460 } });
        place(human, -7); place(drone, 7);
        human.setVisionMode('normal'); drone.setVisionMode('normal');
        g.environment.update(0, 'normal', { player: g.player });
        g.scene.updateMatrixWorld(true);
        // Measure the actual visible geometry, including instances and skin.
        g.measureVisibleBounds = root => {
          root.updateMatrixWorld(true);
          let box;
          root.traverseVisible(object => {
            if (!object.isMesh || !object.geometry?.attributes.position) return;
            if (object.isSkinnedMesh) { object.skeleton.update(); object.computeBoundingBox(); }
            else if (object.isInstancedMesh) object.computeBoundingBox();
            else object.geometry.computeBoundingBox();
            const source = object.isSkinnedMesh || object.isInstancedMesh ? object.boundingBox : object.geometry.boundingBox;
            if (!source || source.isEmpty()) return;
            const bounds = source.clone().applyMatrix4(object.matrixWorld);
            if (box) box.union(bounds); else box = bounds;
          });
          return box;
        };
        const describe = (actor, label) => {
          const bounds = g.measureVisibleBounds(actor.mesh);
          return { label, min: bounds.min.toArray(), max: bounds.max.toArray(),
            size: bounds.getSize(g.player.position.clone()).toArray(), colliderRadius: actor.colliderRadius ?? 1.8 };
        };
        g.camera.fov = 35; g.camera.aspect = 1000 / 700; g.camera.updateProjectionMatrix();
        const ground = g.player.position.y;
        g.camera.position.set(0, ground + 8.7, 482); g.camera.lookAt(0, ground + 3.4, 460); g.camera.updateMatrixWorld(true);
        g.graphics.render('normal');
        return { bodyLoaded: true, camera: g.camera.position.toArray(), fov: 35,
          models: [describe(g.player, 'hunter'), describe(human, 'human'), describe(drone, 'drone')],
          world: g.environment.getLevelDesignSnapshot(),
          props: g.environment.environmentProps.map(prop => ({ id: prop.id, type: prop.type, position: prop.position })),
          pipeline: g.graphics.getMetrics() };
      });
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.graphics.render('normal'));
      await page.screenshot({ path: path.join(output, `${stage}-proportions.png`), timeout: 90000 });
      results.push({ stage, ...scene });
      if (stage === 'after') {
        const human = scene.models.find(model => model.label === 'human');
        const drone = scene.models.find(model => model.label === 'drone');
        assert.ok(Math.abs(human.size[1] - 5.4) < 0.1, `human height ${human.size[1]}`);
        assert.ok(Math.abs(drone.size[1] - 6.3) < 0.1, `drone height ${drone.size[1]}`);
        await hide.evaluate(element => element.remove());
        await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          g.returnToMothershipHub(); g.showMissionSelectionModal('codex');
        });
        const control = page.locator('.btn-simulate-prey').first();
        assert.ok(await control.count());
        await control.click();
        const prepared = await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          return { state: g.gameState, pending: g.pendingHunt, title: document.getElementById('loadout-mission-title').textContent };
        });
        assert.equal(prepared.state, 'HUB');
        assert.equal(prepared.pending.simulationContext.kind, 'prey');
        assert.match(prepared.title, /HOLO-TRAQUE/);
        await page.locator('#btn-loadout-recommended').click();
        await page.locator('#btn-loadout-deploy').click();
        const simulation = await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          const reference = g.activeBoss.mesh.userData.simulationReference;
          const bounds = g.measureVisibleBounds(g.activeBoss.mesh);
          const size = bounds.getSize(g.player.position.clone());
          return { state: g.gameState, id: g.activePreySimulation.id, reference, size: size.toArray(),
            measured: size[reference.dimensionAxis] };
        });
        assert.equal(simulation.state, 'HUNT');
        assert.equal(simulation.id, prepared.pending.simulationContext.id);
        assert.ok(Math.abs(simulation.measured - simulation.reference.nominalMeters * 3) < 0.01);
        // A normal contract must clear the training context at deployment.
        await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          g.showMissionSelectionModal('missions'); g.prepareHunt('goliath', 'jungle');
        });
        await page.locator('#btn-loadout-recommended').click(); await page.locator('#btn-loadout-deploy').click();
        const salvage = await page.evaluate(() => {
          const g = window.__YAUTJA_APEX_HUNT__;
          if (g.activePreySimulation || g.activeCrossoverHunt) throw new Error('Training context leaked into a real hunt');
          const enemy = g.spawnEncounterNpc({ enemyType: 'xeno_warrior',
            position: g.player.position.clone().add(g.player.position.clone().set(0, 0, 12)) });
          const before = g.trophyCraftForge.state.trophyInventory.xeno_warrior ?? 0;
          enemy.takeDamage(enemy.maxHealth); g.handleNpcDefeat(enemy);
          const afterKill = g.trophyCraftForge.state.trophyInventory.xeno_warrior ?? 0;
          const body = g.trophySalvage.bodies.find(entry => entry.sourceId === 'xeno_warrior');
          if (!body) throw new Error('No physical salvage body retained');
          g.player.position.copy(body.enemy.position); g.player.mesh.position.copy(g.player.position);
          const collected = g.attemptContextInteraction();
          const afterCollection = g.trophyCraftForge.state.trophyInventory.xeno_warrior ?? 0;
          g.attemptContextInteraction();
          return { before, afterKill, afterCollection, repeated: g.trophyCraftForge.state.trophyInventory.xeno_warrior ?? 0,
            collected, remainingBodies: g.trophySalvage.bodies.length, state: g.gameState };
        });
        assert.equal(salvage.afterKill, salvage.before, 'a kill alone must not credit material');
        assert.equal(salvage.afterCollection, salvage.before + 1);
        assert.equal(salvage.repeated, salvage.afterCollection); assert.equal(salvage.collected, true);
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForFunction(() => Boolean(window.__YAUTJA_APEX_HUNT__));
        const restored = await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.trophyCraftForge.state.trophyInventory.xeno_warrior ?? 0);
        assert.equal(restored, salvage.afterCollection, 'physical inventory must survive the unified save reload');
        results.push({ stage, interactions: { prepared, simulation, salvage, restored } });
      }
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(resources, []);
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ status: 'passed', startedAt,
      completedAt: new Date().toISOString(), results, errors, resources }, null, 2));
    console.log(JSON.stringify({ status: 'passed', stages: stages.map(([stage]) => stage), output, errors, resources }));
  } finally {
    await browser?.close();
    if (server) await new Promise(resolve => server.httpServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
