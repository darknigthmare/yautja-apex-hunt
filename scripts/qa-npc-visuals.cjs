/* Unretouched photographs of the actual NPCs in the game's lighting. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const output = process.env.QA_ARTIFACT_DIR || '/tmp/yautja-npc-visuals';
  const url = process.env.QA_BASE_URL;
  if (!url) throw new Error('QA_BASE_URL must point to an existing built preview');
  fs.mkdirSync(output, { recursive: true });
  fs.rmSync(path.join(output, 'results.json'), { force: true });
  const errors = [], resources = [], shots = [];
  const startedAt = new Date().toISOString();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(90000);
    await page.addInitScript(() => { window.requestAnimationFrame = () => 0;
      let seed = 1987; Math.random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296); });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => resources.push({ url: r.url(), error: r.failure()?.errorText }));
    page.on('response', r => { if (r.status() >= 400) resources.push({ url: r.url(), status: r.status() }); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!window.__YAUTJA_APEX_HUNT__);
    await page.addStyleTag({ content: '#hud-container,#helmet-frame,#vision-overlay,#scanline-overlay,[role=dialog],[role=alertdialog]{display:none!important}' });
    await page.evaluate(async () => {
      const g = window.__YAUTJA_APEX_HUNT__; await g.player.heroBodyReady; await document.fonts.ready;
      g.requestPointerLockSafely = () => false; g.isGameStarted = true; g.settings.reducedMotion = true;
      g.graphics.setQuality('high'); g.renderer.setPixelRatio(1); g.graphics.resize(1000, 700);
      g.startHunt('goliath', 'jungle'); g.player.mesh.visible = false; g.activeBoss.mesh.visible = false;
      g.activeEnemies.forEach(e => e.dispose()); g.activeEnemies = [];
      g.qaPhotoActors = {};
      for (const [id, type] of [['human', 'human_fireteam'], ['drone', 'xeno_drone'], ['warrior', 'xeno_warrior']]) {
        const npc = g.spawnEncounterNpc({ enemyType: type, position: { x: 0, y: 0, z: 460 } });
        npc.position.set(0, g.environment.sampleHeight(0, 460), 460);
        npc.mesh.position.copy(npc.position); npc.mesh.rotation.set(0, 0, 0); npc.setVisionMode('normal');
        g.qaPhotoActors[id] = npc;
      }
      g.environment.update(0, 'normal', { player: g.player });
    });
    await page.waitForLoadState('networkidle');
    for (const id of ['human', 'drone', 'warrior']) for (const angle of ['front', 'side']) {
      const metrics = await page.evaluate(({ id, angle }) => {
        const g = window.__YAUTJA_APEX_HUNT__, npc = g.qaPhotoActors[id];
        for (const [key, actor] of Object.entries(g.qaPhotoActors)) actor.mesh.visible = key === id;
        const p = npc.position;
        // Fixed world framing; no studio lights, altered textures or retouching.
        g.camera.fov = 35; g.camera.aspect = 1000 / 700; g.camera.updateProjectionMatrix();
        const distance = id === 'human' ? 11.5 : angle === 'side' ? 18 : 15;
        g.camera.position.set(p.x + (angle === 'side' ? distance : 0), p.y + 3.6,
          p.z + (angle === 'front' ? distance : 0));
        g.camera.lookAt(p.x, p.y + (id === 'human' ? 2.8 : 3.1),
          p.z - (id === 'human' ? 0 : angle === 'side' ? 1.8 : 0.7));
        g.scene.updateMatrixWorld(true); g.camera.updateMatrixWorld(true); g.graphics.render('normal');
        return { id, angle, camera: g.camera.position.toArray(), fov: g.camera.fov,
          drawCalls: g.renderer.info.render.calls, triangles: g.renderer.info.render.triangles,
          targetMeters: npc.physicalScale?.nominalMeters, colliderRadius: npc.colliderRadius,
          npcTriangles: npc.mesh.userData.npcVisualMetrics ?? null };
      }, { id, angle });
      assert.ok(metrics.drawCalls > 0 && metrics.triangles > 0);
      await page.screenshot({ path: path.join(output, `${id}-${angle}.png`) }); shots.push(metrics);
    }
    assert.deepEqual(errors, []); assert.deepEqual(resources, []);
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ status: 'passed', startedAt,
      completedAt: new Date().toISOString(), url, shots, errors, resources }, null, 2));
    console.log(JSON.stringify({ status: 'passed', shots: shots.length, output }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
