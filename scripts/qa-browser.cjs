/* Run after npm run build. Uses a local preview unless QA_BASE_URL is set. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const artifacts = process.env.QA_ARTIFACT_DIR || '/tmp/yautja-qa/final';
  fs.mkdirSync(artifacts, { recursive: true });
  const startedAt = new Date().toISOString();
  fs.rmSync(path.join(artifacts, 'results.json'), { force: true });
  let server;
  const browserErrors = [];
  const failedResources = [];
  const outcomes = [];
  let browser;
  try {
    let baseURL = process.env.QA_BASE_URL;
    if (!baseURL) {
      const { preview } = await import('vite');
      server = await preview({ preview: { host: '127.0.0.1', port: 4180, strictPort: true } });
      baseURL = 'http://127.0.0.1:4180';
    }
    const executablePath = process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
    browser = await chromium.launch({ executablePath, headless: true,
      args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
    for (const mobile of [true, false]) {
      const label = mobile ? 'mobile' : 'desktop';
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 },
        isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.setDefaultTimeout(60000);
      page.on('pageerror', (error) => browserErrors.push({ label, error: error.message }));
      page.on('requestfailed', (request) => failedResources.push({ label, error: request.failure()?.errorText, url: request.url() }));
      page.on('response', (response) => { if (response.status() >= 400) failedResources.push({ label, status: response.status(), url: response.url() }); });
      console.log(`[QA] ${label}: démarrage`);
      await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !!window.__YAUTJA_APEX_HUNT__);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.fonts.check('700 14px Orbitron') && document.fonts.check('500 14px Rajdhani')), true, 'les polices locales doivent charger');
      await page.screenshot({ path: path.join(artifacts, `${label}-briefing.png`) });
      const briefing = await page.evaluate(() => {
        const panel = document.querySelector('#controls-modal .modal-box');
        const grid = document.querySelector('.controls-grid');
        const r = panel.getBoundingClientRect();
        return { width: innerWidth, left: r.left, right: r.right,
          columns: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : null };
      });
      assert.ok(briefing.left >= -1 && briefing.right <= briefing.width + 1, `${label}: briefing hors écran`);
      if (mobile) assert.equal(briefing.columns, 1, 'briefing mobile doit rester lisible sur une colonne');
      console.log(`[QA] ${label}: briefing vérifié`);
      await page.locator('#btn-start-game').click();
      await page.locator('#mission-modal:not(.hidden)').waitFor();
      await page.locator('#btn-explore-hub').click();
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.isHubExploring), true);
      if (mobile) assert.equal(await page.evaluate(() => document.pointerLockElement), null, 'le hub tactile doit garder les boutons accessibles');
      if (mobile) await page.locator('#btn-touch-hub-console').tap();
      else await page.keyboard.press('Escape');
      await page.locator('#mission-modal:not(.hidden)').waitFor();
      await page.locator('.btn-launch-hunt[data-hunt="goliath"]').click();
      await page.locator('#btn-loadout-deploy').click();
      await page.waitForFunction(() => window.__YAUTJA_APEX_HUNT__.gameState === 'HUNT');
      if (mobile) assert.equal(await page.evaluate(() => document.pointerLockElement), null, 'la chasse tactile ne doit pas verrouiller la souris');
      if (!mobile) await page.evaluate(() => {
        document.exitPointerLock?.();
        // Pointer lock is a browser permission; the smoke checks state/input without recapturing it.
        window.__YAUTJA_APEX_HUNT__.requestPointerLockSafely = () => false;
      });
      if (mobile) await page.locator('#btn-touch-hunt-pause').tap();
      else await page.keyboard.press('KeyP');
      await page.locator('#pause-modal:not(.hidden)').waitFor();
      await page.locator('#btn-resume').click();
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.isPaused), false);
      if (mobile) await page.locator('#btn-touch-hunt-medbay').tap();
      else await page.keyboard.press('KeyM');
      await page.locator('#yautja-medbay-modal:not(.hidden)').waitFor();
      const stationary = await page.evaluate(() => {
        const game = window.__YAUTJA_APEX_HUNT__;
        const before = game.player.position.toArray();
        game.player.attackTimer = 1;
        game.onKeyDown({ code: 'KeyW' });
        return { before, input: { ...game.inputDir }, open: game.medbayOverlay.isOpen,
          focused: game.medbayOverlay.container.contains(document.activeElement) };
      });
      assert.equal(stationary.open, true);
      assert.equal(stationary.focused, true);
      assert.equal(stationary.input.z, 0);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.player.attackTimer), 1, 'le timer doit rester figé pendant plusieurs frames de soin');
      const afterMedical = await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.player.position.toArray());
      assert.deepEqual(afterMedical, stationary.before, 'le monde doit rester figé pendant le soin');
      if (mobile) await page.locator('#medbay-btn-close').tap();
      else await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.medbayOverlay.isOpen), false);
      console.log(`[QA] ${label}: parcours et fenêtre médicale vérifiés`);
      const hudClicks = await page.evaluate(() => {
        const game = window.__YAUTJA_APEX_HUNT__;
        const attack = game.performAttack;
        let calls = 0;
        game.performAttack = () => calls++;
        document.querySelector('#wep-1').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
        game.performAttack = attack;
        return calls;
      });
      assert.equal(hudClicks, 0, 'un clic HUD ne doit pas tirer');
      if (!mobile) {
        const { HUNT_DEFINITIONS, BIOME_DEFINITIONS } = await import('../src/data/GameConfig.js');
        const contracts = Object.values(HUNT_DEFINITIONS).map(hunt => ({ id: hunt.id, biome: hunt.recommendedBiome || 'jungle' }));
        const covered = new Set(contracts.map(contract => contract.biome));
        for (const biome of Object.keys(BIOME_DEFINITIONS)) {
          if (!covered.has(biome)) contracts.push({ id: 'goliath', biome });
        }
        for (const contract of contracts) {
          const result = await page.evaluate(async ({ id, biome }) => {
            const game = window.__YAUTJA_APEX_HUNT__;
            game.startHunt(id, biome || 'jungle');
            // Render the real scene with the same camera/update path as the game loop.
            game.environment.update(1 / 60, game.player.activeVisionMode, { player: game.player });
            game.updateCamera(1 / 60);
            game.renderer.render(game.scene, game.camera);
            return { id: game.currentHuntType, biome: game.currentPlanet, boss: !!game.activeBoss,
              position: game.player.position.toArray(), calls: game.renderer.info.render.calls,
              triangles: game.renderer.info.render.triangles, fatal: !document.getElementById('fatal-error').classList.contains('hidden') };
          }, contract);
          assert.equal(result.id, contract.id);
          assert.equal(result.boss, true);
          assert.equal(result.fatal, false);
          assert.ok(result.calls > 0 && result.position.every(Number.isFinite));
          outcomes.push(result);
          console.log(`[QA] scène ${result.id} / ${result.biome}: rendue`);
        }
      }
      if (mobile) {
        const overlap = await page.evaluate(() => {
          const gadgets = document.getElementById('gadget-rack').getBoundingClientRect();
          const actions = document.querySelector('.touch-hunt-actions').getBoundingClientRect();
          return gadgets.right > actions.left && gadgets.left < actions.right && gadgets.bottom > actions.top && gadgets.top < actions.bottom;
        });
        assert.equal(overlap, false, 'gadgets et actions tactiles ne doivent pas se chevaucher');
      }
      await page.screenshot({ path: path.join(artifacts, `${label}-hunt-thermal.png`) });
      if (mobile) {
        await page.locator('#btn-touch-hunt-vision').tap();
        await page.locator('#btn-touch-hunt-vision').tap();
      } else {
        await page.keyboard.press('KeyV');
        await page.keyboard.press('KeyV');
      }
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.player.activeVisionMode), 'normal');
      await page.screenshot({ path: path.join(artifacts, `${label}-hunt.png`) });
      if (mobile) await page.locator('#btn-touch-hunt-pause').tap();
      else await page.keyboard.press('KeyP');
      await page.locator('#btn-abandon-hunt').click();
      assert.equal(await page.evaluate(() => window.__YAUTJA_APEX_HUNT__.gameState), 'HUB');
      outcomes.push({ label, ui: 'briefing, hub, préparation, chasse, pause, medbay, abandon validés' });
      await context.close();
    }
    assert.deepEqual(browserErrors, [], 'erreurs JavaScript navigateur');
    assert.deepEqual(failedResources, [], 'ressources HTTP en erreur');
    fs.writeFileSync(path.join(artifacts, 'results.json'), JSON.stringify({ startedAt, completedAt: new Date().toISOString(), outcomes, browserErrors, failedResources }, null, 2));
    console.log(JSON.stringify({ status: 'passed', outcomes, browserErrors, failedResources, artifacts }, null, 2));
  } finally {
    await browser?.close();
    await new Promise(resolve => server ? server.httpServer.close(resolve) : resolve());
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
