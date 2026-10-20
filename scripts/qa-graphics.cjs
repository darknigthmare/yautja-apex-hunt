/* Deterministic photo references of the actual game, with its HUD hidden. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const directory = process.env.GRAPHICS_OUTPUT || '/tmp/yautja-graphics/current';
  const width = Number(process.env.GRAPHICS_WIDTH) || 960;
  const height = Number(process.env.GRAPHICS_HEIGHT) || 600;
  const heroDistance = Number(process.env.GRAPHICS_HERO_DISTANCE) || 7.2;
  const preset = process.env.GRAPHICS_PRESET || null;
  assert.ok(width >= 64 && height >= 64 && width <= 4096 && height <= 4096);
  assert.ok(heroDistance > 0 && heroDistance <= 100);
  fs.mkdirSync(directory, { recursive: true });
  fs.rmSync(path.join(directory, 'metrics.json'), { force: true });
  const { preview } = await import('vite');
  const server = await preview({ build: { outDir: process.env.GRAPHICS_BUILD_DIR || 'dist' }, preview: { host: '127.0.0.1', port: 4280, strictPort: true } });
  let browser;
  const errors = [];
  const results = [];
  try {
    browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(60000);
    await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    await page.goto('http://127.0.0.1:4280/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !!window.__YAUTJA_APEX_HUNT__, null, { polling: 100 });
    await page.evaluate(() => document.fonts.ready);
    const defaultCustomization = await page.evaluate(() => ({ ...window.__YAUTJA_APEX_HUNT__.player.customization }));
    await page.addStyleTag({ content: '#hud-container,#helmet-frame,#vision-overlay,#scanline-overlay,[role=dialog],[role=alertdialog]{display:none!important}' });
    const shots = process.env.GRAPHICS_SHOTS?.split(',').map(value => value.trim()) || ['hero-front', 'hero-back', 'hero-side', 'hero-head-front', 'hero-head-back', 'hero-head-side', 'forest', 'boss', 'urban', 'hub'];
    for (const shotKey of shots) {
      const separator = shotKey.indexOf(':');
      const shotPreset = separator > 0 ? shotKey.slice(0, separator) : preset;
      const shot = separator > 0 ? shotKey.slice(separator + 1) : shotKey;
      await page.evaluate(async ({ shot, width, height, heroDistance, preset, defaultCustomization }) => {
        const g = window.__YAUTJA_APEX_HUNT__;
        g.isGameStarted = true;
        g.settings.reducedMotion = true;
        if (g.graphics) g.graphics.setQuality('high');
        g.renderer.setPixelRatio(1);
        g.graphics?.resize(width, height);
        g.camera.aspect = width / height;
        g.camera.fov = 65;
        g.camera.updateProjectionMatrix();
        g.captureFraming = null;
        g.captureAssetReadiness = { awaited: false, resolved: null };
        const awaitHeroBody = async () => {
          if (g.player.heroBodyReady) {
            g.captureAssetReadiness.awaited = true;
            const body = await g.player.heroBodyReady;
            g.captureAssetReadiness.resolved = Boolean(body?.isSkinnedMesh) && g.player.mesh.userData.organicBodyLoaded === true;
            if (!g.captureAssetReadiness.resolved) {
              const reason = g.player.mesh.userData.organicBodyLoadError || 'Promise resolved without a loaded SkinnedMesh';
              g.captureAssetReadiness.error = reason;
              throw new Error(`Hero organic body is not ready: ${reason}`);
            }
          }
        };
        if (shot === 'hub') {
          g.returnToMothershipHub();
          await awaitHeroBody();
          g.camera.position.set(0, 8, 34);
          g.camera.lookAt(0, 5, -20);
        } else {
          g.startHunt(shot === 'urban' ? 'city_hunter' : 'goliath', shot === 'urban' ? 'los_angeles_1997' : 'jungle');
          await awaitHeroBody();
          if (preset) {
            g.player.setSkin(preset);
            if (g.player.customization.armorPresetId !== preset) throw new Error(`Unknown graphics preset: ${preset}`);
          } else g.player.applyCustomization(defaultCustomization);
          g.player.activeVisionMode = 'normal';
          g.activeBoss?.setVisionMode?.('normal');
          g.activeEnemies.forEach(enemy => enemy.setVisionMode('normal'));
          g.environment.update(0, 'normal', { player: g.player });
          g.player.mesh.rotation.y = 0;
          if (shot === 'hero' || shot.startsWith('hero-')) {
            g.player.mesh.visible = true;
            g.player.position.x += 12;
            g.player.position.z -= 14;
            g.player.position.y = g.environment.sampleHeight(g.player.position.x, g.player.position.z);
            g.player.mesh.position.copy(g.player.position);
            const p = g.player.position;
            // Measure the visible model, never hidden equipment variants. Keep
            // all actual game materials, environment, lighting and post effects.
            // SkinnedMesh refreshes bindMatrixInverse only through its
            // updateMatrixWorld override; updateWorldMatrix skips that hook.
            g.scene.updateMatrixWorld(true);
            g.player.mesh.updateMatrixWorld(true);
            const updatedSkeletons = new Set();
            g.player.mesh.traverseVisible(object => {
              if (object.isSkinnedMesh && !updatedSkeletons.has(object.skeleton)) {
                object.skeleton.update();
                updatedSkeletons.add(object.skeleton);
              }
            });
            const meshes = [];
            g.player.mesh.traverseVisible(object => {
              if (object.isMesh && object.geometry?.attributes.position) meshes.push(object);
            });
            const boxFor = filter => {
              let box = null;
              for (const object of meshes.filter(filter)) {
                if (object.isSkinnedMesh) object.computeBoundingBox();
                else object.geometry.computeBoundingBox();
                const localBounds = object.isSkinnedMesh ? object.boundingBox : object.geometry.boundingBox;
                const add = matrix => {
                  const part = localBounds.clone().applyMatrix4(matrix);
                  if (box) box.union(part); else box = part;
                };
                if (object.isInstancedMesh) {
                  const instance = object.matrixWorld.clone().identity();
                  for (let i = 0; i < object.count; i++) {
                    object.getMatrixAt(i, instance);
                    add(object.matrixWorld.clone().multiply(instance));
                  }
                } else add(object.matrixWorld);
              }
              return box;
            };
            const bodySurface = object => {
              for (let parent = object; parent && parent !== g.player.mesh; parent = parent.parent) {
                if (/^weapon:/.test(parent.name) || /wristblade|plasmacaster|plasma_caster|caster_|father_sword|wrist_shield/.test(parent.userData.equipmentRole || parent.userData.detailRole || '')) return false;
              }
              return true;
            };
            const anatomy = boxFor(bodySurface) || boxFor(() => true);
            let head = boxFor(object => object === g.player.maskMesh || object.name === 'anatomy:yautja_head' || object.name.startsWith('anatomy:mandible') || object.name.startsWith('detail:mandible_tusk'));
            const headBoundsSource = head ? 'named_visible_head_and_mask_meshes' : 'upper_body_fraction_fallback';
            if (!head) {
              // Imported single-mesh heroes may not expose a separate head. Mark
              // this crop as an estimate instead of inventing anatomical ratios.
              head = anatomy.clone();
              const height = anatomy.max.y - anatomy.min.y;
              const centerX = (anatomy.min.x + anatomy.max.x) * 0.5;
              const centerZ = (anatomy.min.z + anatomy.max.z) * 0.5;
              head.min.y = anatomy.max.y - height * 0.28;
              head.min.x = centerX - height * 0.14;
              head.max.x = centerX + height * 0.14;
              head.min.z = centerZ - height * 0.14;
              head.max.z = centerZ + height * 0.14;
            }
            const torso = boxFor(object => object.name === 'anatomy:torso');
            const pelvis = boxFor(object => object.name === 'anatomy:pelvis');
            const shoulders = boxFor(object => /^anatomy:deltoid_[lr]$/.test(object.name));
            const organicBody = boxFor(object => object.isSkinnedMesh && (object.name === 'anatomy:organic_body' || object.userData.realisticSkin === true));
            const regionSource = box => box ? 'visible_named_legacy_meshes' : organicBody ? 'unavailable_in_visible_organic_body' : 'unavailable';
            const size = box => box ? box.max.clone().sub(box.min) : null;
            const snapshot = box => box ? { min: box.min.toArray(), max: box.max.toArray(), size: size(box).toArray() } : null;
            const anatomySize = size(anatomy), headSize = size(head);
            const rootPosition = g.player.mesh.getWorldPosition(p.clone());
            const organicBodyOriginDistance = organicBody ? organicBody.getCenter(p.clone()).distanceTo(rootPosition) : null;
            if (organicBody && (!Number.isFinite(organicBodyOriginDistance) || organicBodyOriginDistance >= 10)) {
              throw new Error(`Organic body AABB is displaced from the player origin by ${organicBodyOriginDistance} world units (expected < 10)`);
            }
            const segment = (start, end) => start && end ? start.getWorldPosition(p.clone()).distanceTo(end.getWorldPosition(p.clone())) : null;
            const proportions = {
              units: 'game_world_units', method: 'visible_body_equipment_AABB_and_rig_pivots', headBoundsSource,
              anatomy: snapshot(anatomy), organicBody: snapshot(organicBody), headAndMask: snapshot(head), torso: snapshot(torso), pelvis: snapshot(pelvis), shoulders: snapshot(shoulders),
              organicBodyOriginDistance,
              regionBoundsSource: { torso: regionSource(torso), pelvis: regionSource(pelvis), shoulders: regionSource(shoulders) },
              headHeightToBody: headBoundsSource === 'named_visible_head_and_mask_meshes' ? headSize.y / anatomySize.y : null,
              bodyHeadHeights: headBoundsSource === 'named_visible_head_and_mask_meshes' ? anatomySize.y / headSize.y : null,
              shoulderWidthToPelvis: shoulders && pelvis ? size(shoulders).x / size(pelvis).x : null,
              minBodyYRelativeToPlayerOrigin: anatomy.min.y - rootPosition.y,
              rigLengths: {
                upperArm: segment(g.player.leftArmRig?.shoulder, g.player.leftArmRig?.elbow),
                forearm: segment(g.player.leftArmRig?.elbow, g.player.leftArmRig?.wrist),
                thigh: segment(g.player.leftLegRig?.hip, g.player.leftLegRig?.knee),
                shin: segment(g.player.leftLegRig?.knee, g.player.leftLegRig?.ankle),
              },
            };
            const closeup = shot.startsWith('hero-head-');
            const targetBox = closeup ? head : anatomy;
            const target = targetBox.min.clone().add(targetBox.max).multiplyScalar(0.5);
            const view = shot.endsWith('-back') ? 'back' : shot.endsWith('-side') ? 'side' : 'front';
            const direction = p.clone().set(...(view === 'back' ? [0, 0, -1] : view === 'side' ? [1, 0, 0] : [0, 0, 1]));
            const tanHalfFov = Math.tan(g.camera.fov * Math.PI / 360);
            const targetSize = size(targetBox);
            // Every full-body comparison uses the same camera distance and lens.
            // Closeups fit the actual head AABB to expose material/UV detail.
            let distance = closeup
              ? Math.max(targetSize.y / (2 * tanHalfFov), targetSize.x / (2 * tanHalfFov * g.camera.aspect)) / 0.82 + targetSize.z * 0.5
              : heroDistance;
            const project = box => {
              const points = [];
              for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
                const v = p.clone().set(x, y, z).project(g.camera);
                points.push({ x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height });
              }
              const xs = points.map(v => v.x), ys = points.map(v => v.y);
              const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
              return { left, right, top, bottom, width: right - left, height: bottom - top, imageHeightFraction: (bottom - top) / height };
            };
            if (shot === 'hero') {
              g.camera.position.set(p.x + 5.5, p.y + 6.5, p.z + 15);
              g.camera.lookAt(p.x, p.y + 5, p.z);
            } else {
              for (let attempt = 0; attempt < 20; attempt++) {
                g.camera.position.copy(target).addScaledVector(direction, distance);
                g.camera.lookAt(target);
                g.camera.updateMatrixWorld();
                const projected = project(targetBox);
                if (!closeup || (projected.left >= width * 0.08 && projected.right <= width * 0.92 && projected.top >= height * 0.08 && projected.bottom <= height * 0.92)) break;
                distance *= 1.06;
              }
            }
            g.camera.updateMatrixWorld();
            g.captureFraming = {
              lighting: 'actual_game_jungle', neutralLightingAdded: false, lensFov: g.camera.fov,
              framePolicy: shot === 'hero' ? 'legacy_camera' : closeup ? 'dynamic_head_AABB' : 'common_camera_distance',
              commonCameraDistance: closeup || shot === 'hero' ? null : heroDistance,
              view, target: target.toArray(), cameraPosition: g.camera.position.toArray(),
              bodyProjection: project(anatomy), headProjection: project(head), proportions,
            };
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
        g.player.mesh.visible = shot === 'hero' || shot.startsWith('hero-');
        g.camera.updateMatrixWorld();
        if (g.graphics) g.graphics.render('normal');
        else g.renderer.render(g.scene, g.camera);
      }, { shot, width, height, heroDistance, preset: shotPreset, defaultCustomization });
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
        return { shot, preset: g.player.customization.armorPresetId, assetReadiness: g.captureAssetReadiness, framing: g.captureFraming,
          hero: g.player.refreshVisualFidelityMetrics?.() ?? null,
          triangles, meshes, sceneDraws, render: { ...g.renderer.info.render }, pipeline: g.graphics?.getMetrics?.() || null };
      }, shot);
      const filename = shotPreset ? `${shotPreset}-${shot}` : shot;
      await page.screenshot({ path: path.join(directory, `${filename}.png`), timeout: 60000 });
      results.push(result);
      console.log('[GRAPHICS]', JSON.stringify(result));
    }
    const qualityChecks = process.env.GRAPHICS_SKIP_QUALITY_CHECKS === '1' ? { skipped: true, reason: 'GRAPHICS_SKIP_QUALITY_CHECKS=1' } : await page.evaluate(({ width, height }) => {
      const g = window.__YAUTJA_APEX_HUNT__;
      if (!g.graphics) return [];
      const checks = [];
      for (const quality of ['performance', 'balanced', 'high', 'ultra', 'high']) {
        const input = document.getElementById('setting-graphics-quality');
        input.value = quality;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        g.graphics.resize(width, height);
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
    }, { width, height });
    if (!Array.isArray(qualityChecks) && !qualityChecks.skipped) {
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
    fs.writeFileSync(path.join(directory, 'metrics.json'), JSON.stringify({ completedAt: new Date().toISOString(), reference: process.env.GRAPHICS_REFERENCE || null, preset, viewport: { width, height }, results, qualityChecks, errors }, null, 2));
    const heroFrames = results.filter(result => result.framing).map(({ shot, framing }) => ({ shot, ...framing }));
    if (heroFrames.length) fs.writeFileSync(path.join(directory, 'hero-proportions.json'), JSON.stringify({ reference: process.env.GRAPHICS_REFERENCE || null, viewport: { width, height }, frames: heroFrames }, null, 2));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
