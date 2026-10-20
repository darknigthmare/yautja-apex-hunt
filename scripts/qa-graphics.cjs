/* Deterministic photo references of the actual game, with its HUD hidden. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const directory = process.env.GRAPHICS_OUTPUT || '/tmp/yautja-graphics/current';
  fs.mkdirSync(directory, { recursive: true });
  const { preview } = await import('vite');
  const server = await preview({ build: { outDir: process.env.GRAPHICS_BUILD_DIR || 'dist' }, preview: { host: '127.0.0.1', port: 4280, strictPort: true } });
  let browser;
  const errors = [];
  const results = [];
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
    const page = await browser.newPage({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(60000);
    await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    await page.goto('http://127.0.0.1:4280/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!window.__YAUTJA_APEX_HUNT__, null, { polling: 100 });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '#hud-container,#helmet-frame,#vision-overlay,#scanline-overlay,[role=dialog],[role=alertdialog]{display:none!important}' });
    const shots = process.env.GRAPHICS_SHOTS?.split(',') || ['hero', 'forest', 'boss', 'urban', 'hub'];
    for (const shot of shots) {
      await page.evaluate(shot => {
        const g = window.__YAUTJA_APEX_HUNT__;
        g.isGameStarted = true;
        g.settings.reducedMotion = true;
        if (g.graphics) g.graphics.setQuality('high');
        g.renderer.setPixelRatio(1);
        g.graphics?.resize(960, 600);
        if (shot === 'hub') {
          g.returnToMothershipHub();
          g.camera.position.set(0, 8, 34);
          g.camera.lookAt(0, 5, -20);
        } else {
          g.startHunt(shot === 'urban' ? 'city_hunter' : 'goliath', shot === 'urban' ? 'los_angeles_1997' : 'jungle');
          g.player.activeVisionMode = 'normal';
          g.activeBoss?.setVisionMode?.('normal');
          g.activeEnemies.forEach(enemy => enemy.setVisionMode('normal'));
          g.environment.update(0, 'normal', { player: g.player });
          g.player.mesh.rotation.y = 0;
          if (shot === 'hero') {
            g.player.position.x += 12;
            g.player.position.z -= 14;
            g.player.position.y = g.environment.sampleHeight(g.player.position.x, g.player.position.z);
            g.player.mesh.position.copy(g.player.position);
            const p = g.player.position;
            g.camera.position.set(p.x + 5.5, p.y + 6.5, p.z + 15);
            g.camera.lookAt(p.x, p.y + 5, p.z);
          } else if (shot === 'boss') {
            const p = g.activeBoss.position;
            g.player.position.set(p.x + 20, p.y, p.z + 20);
            g.environment.update(0, 'normal', { player: g.player });
            g.camera.position.set(p.x + 21, p.y + 10, p.z + 24);
            g.camera.lookAt(p.x, p.y + 6, p.z);
          } else {
            const p = g.player.position;
            g.camera.position.set(p.x + 12, p.y + 14, p.z + 12);
            g.camera.lookAt(p.x - 30, p.y + 3, p.z - 100);
          }
        }
        g.player.mesh.visible = shot === 'hero';
        g.camera.updateMatrixWorld();
        if (g.graphics) g.graphics.render('normal');
        else g.renderer.render(g.scene, g.camera);
      }, shot);
      await page.waitForLoadState('networkidle');
      const result = await page.evaluate(shot => {
        const g = window.__YAUTJA_APEX_HUNT__;
        if (g.graphics) g.graphics.render('normal');
        else g.renderer.render(g.scene, g.camera);
        let triangles = 0, meshes = 0, sceneDraws = 0;
        g.scene.traverseVisible(object => {
          if (!object.isMesh || !object.geometry) return;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          if (materials.every(material => material.visible === false)) return;
          const instances = object.isInstancedMesh ? object.count : 1;
          triangles += (object.geometry.index?.count || object.geometry.attributes.position.count) / 3 * instances;
          meshes++;
          sceneDraws += Array.isArray(object.material) ? Math.max(1, object.geometry.groups.length) : 1;
        });
        return { shot, triangles, meshes, sceneDraws, render: { ...g.renderer.info.render }, pipeline: g.graphics?.getMetrics?.() || null };
      }, shot);
      await page.screenshot({ path: path.join(directory, `${shot}.png`), timeout: 60000 });
      results.push(result);
      console.log('[GRAPHICS]', JSON.stringify(result));
    }
    const qualityChecks = await page.evaluate(() => {
      const g = window.__YAUTJA_APEX_HUNT__;
      if (!g.graphics) return [];
      const checks = [];
      for (const quality of ['performance', 'balanced', 'high', 'ultra', 'high']) {
        const input = document.getElementById('setting-graphics-quality');
        input.value = quality;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        g.graphics.resize(960, 600);
        g.graphics.render('normal');
        const normal = g.graphics.getMetrics();
        g.graphics.render('thermal');
        const thermal = g.graphics.getMetrics();
        g.graphics.render('tech');
        const tech = g.graphics.getMetrics();
        checks.push({ quality, saved: g.settings.graphicsQuality, normal, thermal, tech });
      }
      g.graphics.hdrSupported = false;
      g.graphics.setQuality('ultra');
      g.graphics.render('normal');
      const fallback = g.graphics.getMetrics();
      g.graphics.hdrSupported = true;
      g.graphics.setQuality('high');
      return { checks, fallback };
    });
    if (!Array.isArray(qualityChecks)) {
      for (const check of qualityChecks.checks) {
        assert.equal(check.saved, check.quality);
        assert.equal(check.normal.quality, check.quality);
        assert.equal(check.normal.postProcessed, check.quality !== 'performance');
        assert.equal(check.normal.ambientOcclusion, ['high', 'ultra'].includes(check.quality));
        assert.equal(check.thermal.postProcessed, false);
        assert.equal(check.tech.postProcessed, false);
      }
      assert.equal(qualityChecks.fallback.quality, 'performance');
      assert.equal(qualityChecks.fallback.postProcessed, false);
      console.log('[GRAPHICS] quality presets, vision bypass and capability fallback verified');
    }
    assert.deepEqual(errors, [], 'erreurs dans les références graphiques');
    fs.writeFileSync(path.join(directory, 'metrics.json'), JSON.stringify({ completedAt: new Date().toISOString(), results, qualityChecks, errors }, null, 2));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
