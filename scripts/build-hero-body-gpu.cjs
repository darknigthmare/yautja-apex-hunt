/* Validate the exported skin with actual WebGL and the game's joint-Group API.
 * Requires a Vite development server at HERO_BODY_ORIGIN (default :5173).
 * CHROMIUM_PATH overrides the browser executable; HERO_BODY_OUTPUT selects the
 * diagnostics directory (default /tmp/yautja-realism/models). */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const executablePath = process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
  const errors = [];
  const output = path.resolve(process.env.HERO_BODY_OUTPUT || '/tmp/yautja-realism/models');
  fs.mkdirSync(output, { recursive: true });
  try {
    const page = await browser.newPage({ viewport: { width: 850, height: 1100 } });
    page.setDefaultTimeout(120000);
    await page.route('**/favicon.ico', route => route.fulfill({ status: 204, body: '' }));
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${process.env.HERO_BODY_ORIGIN || 'http://127.0.0.1:5173'}/src/entities/HeroOrganicBody.js`);
    await page.setContent('<body style="margin:0"><canvas id="body"></canvas></body>');
    const result = await page.evaluate(async () => {
      const T = await import('/node_modules/three/build/three.module.js');
      const { loadHeroOrganicBody, createOrganicBodyMesh } = await import('/src/entities/HeroOrganicBody.js');
      const asset = await loadHeroOrganicBody();
      const root = new T.Group();
      root.position.set(3, 0, -2);
      const parents = { 'joint:torso': 'joint:pelvis', 'joint:head': 'joint:torso' };
      for (const side of ['l', 'r']) {
        parents[`joint:shoulder_${side}`] = 'joint:torso';
        parents[`joint:elbow_${side}`] = `joint:shoulder_${side}`;
        parents[`joint:wrist_${side}`] = `joint:elbow_${side}`;
        parents[`joint:hip_${side}`] = 'joint:pelvis';
        parents[`joint:knee_${side}`] = `joint:hip_${side}`;
        parents[`joint:ankle_${side}`] = `joint:knee_${side}`;
      }
      const joints = new Map();
      for (const name of asset.boneNames) {
        const joint = new T.Group();
        joint.name = name;
        const position = asset.metrics.restPositions[name];
        const parentName = parents[name];
        joint.position.fromArray(position);
        if (parentName) joint.position.sub(new T.Vector3(...asset.metrics.restPositions[parentName]));
        if (name === 'joint:head') joint.scale.setScalar(0.4064);
        (joints.get(parentName) || root).add(joint);
        joints.set(name, joint);
      }
      const body = await createOrganicBodyMesh({ mesh: root });
      root.updateMatrixWorld(true);
      body.skeleton.update();
      const positions = body.geometry.getAttribute('position');
      const weights = body.geometry.getAttribute('skinWeight');
      const indices = body.geometry.getAttribute('skinIndex');
      const vertex = new T.Vector3();
      const base = new T.Vector3();
      let restError = 0, weightError = 0, maximumJoint = 0, candidate = -1;
      const elbow = asset.boneNames.indexOf('joint:elbow_l');
      for (let index = 0; index < positions.count; index++) {
        body.getVertexPosition(index, vertex);
        base.fromBufferAttribute(positions, index);
        restError = Math.max(restError, vertex.distanceTo(base));
        let sum = 0;
        for (let component = 0; component < 4; component++) {
          const joint = indices.getComponent(index, component);
          const weight = weights.getComponent(index, component);
          sum += weight;
          maximumJoint = Math.max(maximumJoint, joint);
          if (joint === elbow && weight > 0.95 && base.y < 4.15 && base.y > 3.65) candidate = index;
        }
        weightError = Math.max(weightError, Math.abs(sum - 1));
      }
      if (candidate < 0) throw new Error('No forearm skinning candidate found.');
      const before = body.getVertexPosition(candidate, new T.Vector3());
      joints.get('joint:elbow_l').rotation.x = 0.6;
      joints.get('joint:knee_r').rotation.x = -0.3;
      root.updateMatrixWorld(true);
      body.skeleton.update();
      const after = body.getVertexPosition(candidate, new T.Vector3());
      const scene = new T.Scene();
      scene.background = new T.Color(0x20282e);
      scene.add(root, new T.HemisphereLight(0xe8ece4, 0x282b26, 2.3));
      const key = new T.DirectionalLight(0xffe4c8, 3.4);
      key.position.set(8, 11, 10);
      scene.add(key);
      const rim = new T.DirectionalLight(0x9bb9c9, 1.5);
      rim.position.set(-5, 5, -8);
      scene.add(rim);
      const renderer = new T.WebGLRenderer({ canvas: document.getElementById('body'), antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(850, 1100);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      const camera = new T.PerspectiveCamera(35, 850 / 1100, 0.1, 100);
      camera.position.copy(root.position).add(new T.Vector3(5.5, 3.8, 11));
      camera.lookAt(root.position.clone().add(new T.Vector3(0, 3.3, 0)));
      renderer.render(scene, camera);
      return { metrics: asset.metrics, restError, weightError, maximumJoint, forearmMotion: before.distanceTo(after), glError: renderer.getContext().getError(), render: { ...renderer.info.render } };
    });
    assert.ok(result.restError < 0.0001, `rest shape changed while binding: ${result.restError}`);
    assert.ok(result.weightError < 0.0001, `weights not normalized: ${result.weightError}`);
    assert.ok(result.maximumJoint < result.metrics.boneCount);
    assert.ok(result.forearmMotion > 0.1, 'joint Groups must deform the continuous forearm');
    assert.equal(result.glError, 0);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `${output}/hero-organic-body-webgl.png` });
    fs.writeFileSync(`${output}/hero-organic-body-webgl-metrics.json`, JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
