const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), path.resolve(__dirname, '..')] }));

(async () => {
  const baseline = process.env.QA_BASELINE === '1';
  const url = process.env.QA_BASE_URL || (baseline ? 'http://127.0.0.1:4290/' : null);
  if (!url) throw new Error('Set QA_BASE_URL to the coordinated final build');
  const out = process.env.QA_ARTIFACT_DIR || path.join(require('node:os').tmpdir(), 'yautja-catalogue', baseline ? 'baseline' : 'final');
  fs.mkdirSync(out, { recursive: true });
  fs.rmSync(path.join(out, 'results.json'), { force: true });
  const errors = [], resources = [], results = [];
  const startedAt = new Date().toISOString();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    const page = await context.newPage(); page.setDefaultTimeout(60000);
    await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => resources.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) resources.push({ url: response.url(), status: response.status() }); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!window.__YAUTJA_APEX_HUNT__);
    await page.evaluate(async () => {
      const g = window.__YAUTJA_APEX_HUNT__; g.graphics.setQuality('performance');
      g.requestPointerLockSafely = () => false; await document.fonts.ready;
    });
    await page.locator('#btn-start-game').click();
    const initial = await page.evaluate(() => ({ exploring: window.__YAUTJA_APEX_HUNT__.isHubExploring,
      archiveVisible: !document.getElementById('mission-modal').classList.contains('hidden') }));
    if (!baseline) {
      assert.equal(initial.exploring, true, 'le jeu doit démarrer dans le croiseur 3D');
      assert.equal(initial.archiveVisible, false);
    }
    // The immutable baseline opened the archives directly; the current game
    // enters the ship. Escape remains the explicit quick access to archives.
    if (!initial.archiveVisible) await page.keyboard.press('Escape');
    await page.locator('#mission-modal:not(.hidden)').waitFor();
    if (baseline) {
      // Capture the immutable old interface without assuming search controls or
      // their absence. These are visual references, not tests of the new feature.
      let index = 0;
      for (const [label, viewport] of [
        ['desktop', { width: 1280, height: 800 }],
        ['mobile', { width: 390, height: 844 }],
      ]) {
        await page.setViewportSize(viewport);
        for (const [section, tab, heading] of [
          ['taxonomy', '#tab-btn-codex', '#taxonomy-vault-title'],
          ['multiverse', '#tab-btn-multiverse', '.multiverse-archive-section > h4'],
        ]) {
          await page.locator(tab).click();
          await page.locator(heading).evaluate(element => element.scrollIntoView({ block: 'start' }));
          const filename = `${String(++index).padStart(2, '0')}-${label}-${section}.png`;
          await page.screenshot({ path: path.join(out, filename) });
          results.push({ step: 'baseline-capture', section, viewport, filename });
        }
      }
      assert.deepEqual(errors, []); assert.deepEqual(resources, []);
      fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ status: 'captured', mode: 'baseline', url,
        startedAt, completedAt: new Date().toISOString(), results, errors, resources }, null, 2));
      console.log('CATALOGUE_UI_BASELINE_CAPTURED');
      await context.close();
      return;
    }
    await page.locator('#tab-btn-codex').click();
    assert.equal(await page.locator('#canon-taxonomy-grid [data-prey-id]').count(), 200);
    await page.locator('#taxonomy-search').fill('reine');
    const queens = await page.locator('#canon-taxonomy-grid [data-prey-id]:not([hidden])').count();
    assert.ok(queens > 0 && queens < 200);
    await page.locator('#taxonomy-search').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, '01-desktop-taxonomy-search.png') });
    results.push({ step: 'search-queens', visible: queens, status: await page.locator('#taxonomy-search-status').textContent() });
    await page.locator('#taxonomy-search').fill('zzzzaucuneproie');
    assert.equal(await page.locator('#canon-taxonomy-grid [data-prey-id]:not([hidden])').count(), 0);
    assert.equal(await page.locator('#taxonomy-search-empty').isVisible(), true);
    await page.screenshot({ path: path.join(out, '02-desktop-empty.png') });
    await page.locator('#taxonomy-search-clear').click();
    assert.equal(await page.locator('#canon-taxonomy-grid [data-prey-id]:not([hidden])').count(), 200);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'taxonomy-search');
    await page.locator('#taxonomy-search').fill('reine');
    await page.locator('[data-taxonomy-filter="minuscule"]').click();
    assert.equal(await page.locator('#taxonomy-search').inputValue(), 'reine');
    const smallQueens = await page.locator('#canon-taxonomy-grid [data-prey-id]:not([hidden])').count();
    assert.ok(smallQueens > 0);
    assert.equal(await page.locator('[data-taxonomy-filter][aria-pressed="true"]').count(), 1);
    results.push({ step: 'query-after-size-filter', visible: smallQueens, status: await page.locator('#taxonomy-search-status').textContent() });
    await page.locator('#taxonomy-search').press('Escape');
    assert.equal(await page.locator('#taxonomy-search').inputValue(), '');
    assert.equal(await page.locator('#mission-modal').isVisible(), true);

    await page.locator('#tab-btn-multiverse').click();
    await page.locator('#multiverse-search').fill('BOBA fett');
    const boba = page.locator('#multiverse-roster-grid [data-crossover-select]:not([hidden])');
    assert.equal(await boba.count(), 1);
    await boba.focus(); await boba.press('Enter');
    await page.waitForTimeout(1250);
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.crossoverSelect), 'crossover_mandalorian_boba');
    assert.equal(await page.locator('#multiverse-search').inputValue(), 'BOBA fett');
    assert.equal(await page.locator('#multiverse-roster-grid [data-crossover-select]:not([hidden])').count(), 1);
    assert.equal(await boba.getAttribute('aria-pressed'), 'true');
    await page.screenshot({ path: path.join(out, '03-desktop-selected-roster.png') });
    results.push({ step: 'selected-roster-timer', focused: await page.evaluate(() => document.activeElement.dataset.crossoverSelect), status: await page.locator('#multiverse-search-status').textContent() });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.locator('#multiverse-search').scrollIntoViewIfNeeded();
    const mobile = await page.evaluate(() => {
      const input = document.getElementById('multiverse-search').getBoundingClientRect();
      const clear = document.getElementById('multiverse-search-clear').getBoundingClientRect();
      return { width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        input: { left: input.left, right: input.right, height: input.height },
        clear: { left: clear.left, right: clear.right, height: clear.height } };
    });
    assert.equal(mobile.documentWidth, 320);
    assert.ok(mobile.input.left >= 0 && mobile.clear.right <= 320);
    assert.ok(mobile.input.height >= 44 && mobile.clear.height >= 44);
    await page.screenshot({ path: path.join(out, '04-mobile-search-320.png') });
    results.push({ step: 'mobile-search', ...mobile });
    await page.setViewportSize({ width: 1280, height: 800 });
    const physicalBefore = await page.evaluate(() => {
      const g = window.__YAUTJA_APEX_HUNT__;
      g.enterHubExploration();
      const station = g.hub.missionStations.find(s => s.huntId === 'rhynth_titan');
      g.player.position.copy(station.approachPosition ?? station.position);
      g.hub.constrainPlayer(g.player.position, 1.8);
      g.player.mesh.position.copy(g.player.position);
      g.updateHubHUD();
      return { pending: JSON.stringify(g.pendingHunt ?? null), stationId: station.id };
    });
    await page.keyboard.press('KeyE');
    await page.locator('#ship-console-dialog:not(.hidden)').waitFor();
    const inspectionState = await page.evaluate(() => {
      const g = window.__YAUTJA_APEX_HUNT__;
      return { state: g.gameState, pending: JSON.stringify(g.pendingHunt ?? null), stationId: g.shipInterface.stationId,
        title: document.getElementById('ship-console-title').textContent,
        inspection: document.querySelector('#ship-console-dialog .ship-inspection-record')?.textContent ?? null,
        archiveVisible: !document.getElementById('mission-modal').classList.contains('hidden') };
    });
    assert.equal(inspectionState.state, 'HUB');
    assert.equal(inspectionState.pending, physicalBefore.pending, 'ouvrir le poste ne doit pas préparer sa chasse');
    assert.equal(inspectionState.stationId, physicalBefore.stationId);
    assert.equal(inspectionState.archiveVisible, false);
    assert.ok(inspectionState.inspection, 'le poste de contrat doit afficher les références de sa projection');
    assert.match(inspectionState.inspection, /Fidélité visuelle 1:1 non vérifiée/);
    await page.screenshot({ path: path.join(out, '05-physical-contract-inspection.png') });
    results.push({ step: 'physical-contract-inspection', fixture: 'placement au poste physique', ...inspectionState });
    await page.locator('#ship-console-dialog [data-service-id="prepare_hunt"]').click();
    const consoleState = await page.evaluate(() => {
      const g = window.__YAUTJA_APEX_HUNT__;
      return { state: g.gameState, exploring: g.isHubExploring, pending: g.pendingHunt,
        title: document.getElementById('loadout-mission-title').textContent,
        modalVisible: !document.getElementById('mission-modal').classList.contains('hidden'),
        consoles: g.hub.missionStations.length };
    });
    assert.equal(consoleState.state, 'HUB');
    assert.equal(consoleState.exploring, false);
    assert.equal(consoleState.pending.huntType, 'rhynth_titan');
    assert.equal(consoleState.pending.simulationContext, null);
    assert.equal(consoleState.modalVisible, true);
    assert.equal(consoleState.consoles, 15);
    await page.screenshot({ path: path.join(out, '06-physical-console-preparation.png') });
    results.push({ step: 'physical-console-preparation', ...consoleState });
    await page.evaluate(() => {
      const g = window.__YAUTJA_APEX_HUNT__;
      g.enterHubExploration();
      const station = g.hub.missionStations.find(item => item.huntId === 'wolf_cleaner');
      g.player.position.copy(station.approachPosition ?? station.position);
      g.hub.constrainPlayer(g.player.position, 1.8);
      g.player.mesh.position.copy(g.player.position); g.updateHubHUD();
    });
    await page.keyboard.press('KeyE');
    await page.locator('#ship-console-dialog:not(.hidden)').waitFor();
    const wolfReference = await page.locator('#ship-console-dialog .ship-inspection-record').textContent();
    const { LORE_SOURCES } = await import('../src/data/LoreCodex.js');
    assert.ok(wolfReference.includes(LORE_SOURCES.avpRequiem2007.title), 'la référence du Wolf doit employer le titre documentaire lisible');
    assert.match(wolfReference, /Fidélité visuelle 1:1 non vérifiée/);
    assert.doesNotMatch(wolfReference, /YautjaPlayer\.|MothershipHub\.|createWristbladeAssembly|fireCombiStick/);
    results.push({ step: 'physical-wolf-reference', fixture: 'placement au poste physique', reference: wolfReference });
    assert.deepEqual(errors, []); assert.deepEqual(resources, []);
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ status: 'passed', startedAt,
      completedAt: new Date().toISOString(), results, errors, resources }, null, 2));
    console.log('CATALOGUE_UI_CHECKS_PASSED');
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
