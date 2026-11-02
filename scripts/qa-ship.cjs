/* Real ship photographs and optional diegetic-service integration checks. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const SHOTS = [
  ['01-nexus-approach', [0, 7.3, 31], [0, 5.5, -8]],
  ['02-nexus-port', [0, 6.2, 11], [-23, 5, -6]],
  ['03-bridge', [0, 6.2, -51], [0, 5, -75]],
  ['04-cryo', [-49, 6.2, -8], [-49, 4.8, -29]],
  ['05-medbay', [49, 6.2, -8], [49, 4.8, -28]],
  ['06-forge', [39, 6.2, 24], [53, 4.8, 10]],
  ['07-hangar', [-23, 7.3, 77], [-43, 5, 54]],
  ['08-core', [26, 7.3, 47], [45, 8, 65]],
  ['09-airlock', [8, 6.2, 65], [0, 5, 82]],
  ['10-vault', [0, 6.2, -19], [0, 5.8, -34]],
];
(async () => {
  const url = process.env.QA_BASE_URL;
  if (!url) throw new Error('QA_BASE_URL must point to an existing built preview');
  const output = process.env.QA_ARTIFACT_DIR || '/tmp/yautja-ship-qa';
  fs.mkdirSync(output, { recursive: true }); fs.rmSync(path.join(output, 'results.json'), { force: true });
  const startedAt = new Date().toISOString();
  const errors = [], resources = [], shots = [];
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(90000);
    await page.addInitScript(() => { window.requestAnimationFrame = () => 0;
      let seed = 1987; Math.random = () => ((seed = Math.imul(seed, 1664525) + 1013904223 >>> 0) / 4294967296); });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => resources.push({ url: r.url(), error: r.failure()?.errorText }));
    page.on('response', r => { if (r.status() >= 400) resources.push({ url: r.url(), status: r.status() }); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!window.__YAUTJA_APEX_HUNT__);
    await page.evaluate(async () => {
      const g = window.__YAUTJA_APEX_HUNT__; const body = await g.player.heroBodyReady;
      const assertBody = Boolean(body?.isSkinnedMesh);
      if (!assertBody) throw new Error('Hero body failed to load');
      await document.fonts.ready; g.requestPointerLockSafely = () => false;
      g.isGameStarted = true; g.settings.reducedMotion = true;
      g.graphics.setQuality('high'); g.renderer.setPixelRatio(1); g.graphics.resize(1200, 800);
      g.hub.setShadowQuality?.('high');
      g.gameState = 'HUB'; g.environment.setVisible(false); g.hub.setVisible(true); g.player.mesh.visible = false;
    });
    const hide = await page.addStyleTag({ content: '#hud-container,#helmet-frame,#vision-overlay,#scanline-overlay,[role=dialog],[role=alertdialog],#ship-waypoint-hud,#ship-zone-hud{display:none!important}' });
    for (const [name, position, target] of SHOTS) {
      const result = await page.evaluate(({ position, target }) => {
        const g = window.__YAUTJA_APEX_HUNT__;
        g.player.position.set(position[0], 0, position[2]);
        g.player.mesh.position.copy(g.player.position);
        g.hub.update(0, true);
        g.camera.fov = 65; g.camera.aspect = 1.5; g.camera.updateProjectionMatrix();
        g.camera.position.set(...position); g.camera.lookAt(...target);
        g.scene.updateMatrixWorld(true); g.camera.updateMatrixWorld(true); g.graphics.render('normal');
        return { camera: g.camera.position.toArray(), target, fov: 65,
          calls: g.renderer.info.render.calls, triangles: g.renderer.info.render.triangles,
          stationCount: g.hub.getStations().length, performance: g.hub.getPerformanceSnapshot() };
      }, { position, target });
      assert.ok(result.calls > 0 && result.triangles > 0);
      await page.screenshot({ path: path.join(output, name + '.png') }); shots.push({ name, ...result });
    }
    assert.deepEqual(errors, []); assert.deepEqual(resources, []);
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify({ status: 'passed', startedAt,
      completedAt: new Date().toISOString(), url, shots, errors, resources }, null, 2));
    console.log(JSON.stringify({ status: 'passed', shots: shots.length, output }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
