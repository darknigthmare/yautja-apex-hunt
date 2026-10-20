import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GRAPHICS_PRESETS, resolveGraphicsQuality, sanitizeGraphicsQuality } from './graphicsQuality.js';

// Depth-only contact shading must not turn plasma, glass or the sky into walls.
export class ContactOcclusionPass extends SSAOPass {
  render(renderer, ...buffers) {
    const override = this.scene.overrideMaterial;
    const autoClear = renderer.autoClear;
    const clearColor = renderer.getClearColor(new THREE.Color()).clone();
    const clearAlpha = renderer.getClearAlpha();
    const target = renderer.getRenderTarget();
    const shadowAutoUpdate = renderer.shadowMap?.autoUpdate;
    if (renderer.shadowMap) renderer.shadowMap.autoUpdate = false;
    try {
      super.render(renderer, ...buffers);
    } finally {
      if (this._visibilityCache.size) this.restoreVisibility();
      this.scene.overrideMaterial = override;
      renderer.autoClear = autoClear;
      renderer.setClearColor(clearColor, clearAlpha);
      renderer.setRenderTarget(target);
      if (renderer.shadowMap) renderer.shadowMap.autoUpdate = shadowAutoUpdate;
    }
  }

  dispose() {
    // Three r160's pass does not release these two owned GPU resources.
    this.ssaoMaterial.dispose();
    this.noiseTexture.dispose();
    super.dispose();
  }

  renderOverride(renderer, material, target, clearColor, clearAlpha) {
    const hidden = [];
    this.scene.traverseVisible(object => {
      if (!object.isMesh) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      if (materials.every(entry => entry.transparent || entry.depthWrite === false || entry.wireframe)) {
        hidden.push(object);
        object.visible = false;
      }
    });
    try {
      super.renderOverride(renderer, material, target, clearColor, clearAlpha);
    } finally {
      hidden.forEach(object => { object.visible = true; });
    }
  }
}

export class GraphicsRenderer {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    const size = renderer.getSize(new THREE.Vector2());
    this.width = size.x;
    this.height = size.y;
    this.hdrSupported = renderer.capabilities.isWebGL2 && renderer.extensions.has('EXT_color_buffer_float');

    // Local, neutral studio reflections; no remote HDR dependency or extra scene lights.
    if (this.hdrSupported) {
      const generator = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment(renderer);
      this.environmentTarget = generator.fromScene(room, 0.04);
      scene.environment = this.environmentTarget.texture;
      room.dispose();
      generator.dispose();
    }
    this.setQuality('auto');
  }

  setQuality(value) {
    const requested = sanitizeGraphicsQuality(value);
    const resolved = resolveGraphicsQuality(requested, {
      coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
      deviceMemory: navigator.deviceMemory ?? 8,
      hdrSupported: this.hdrSupported,
    });
    this.requestedQuality = requested;
    if (this.quality === resolved) return;
    this.disposeComposer();
    this.quality = resolved;
    const preset = GRAPHICS_PRESETS[resolved];
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.pixelRatio));
    if (preset.post) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      if (preset.aoScale) {
        this.ao = new ContactOcclusionPass(this.scene, this.camera, 1, 1, 16);
        this.ao.kernelRadius = 1.35;
        this.ao.minDistance = 0.00004;
        this.ao.maxDistance = 0.002;
        this.composer.addPass(this.ao);
      }
      if (preset.bloom) {
        this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.18, 0.3, 1.65);
        this.composer.addPass(this.bloom);
      }
      this.composer.addPass(new OutputPass());
      this.fxaa = new ShaderPass(FXAAShader);
      this.composer.addPass(this.fxaa);
    }
    this.resize(this.width, this.height);
  }

  resize(width, height) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.renderer.setSize(this.width, this.height, false);
    const ratio = this.renderer.getPixelRatio();
    this.composer?.setPixelRatio(ratio);
    this.composer?.setSize(this.width, this.height);
    const aoScale = GRAPHICS_PRESETS[this.quality].aoScale;
    this.ao?.setSize(Math.max(1, Math.round(this.width * ratio * aoScale)), Math.max(1, Math.round(this.height * ratio * aoScale)));
    this.fxaa?.uniforms.resolution.value.set(1 / (this.width * ratio), 1 / (this.height * ratio));
  }

  render(visionMode = 'normal') {
    // Thermal and tech use their own calibrated shader palette.
    const post = this.composer && visionMode === 'normal';
    this.lastPostProcessed = Boolean(post);
    const autoReset = this.renderer.info.autoReset;
    const state = post ? {
      target: this.renderer.getRenderTarget(), autoClear: this.renderer.autoClear,
      clearColor: this.renderer.getClearColor(this._frameClearColor ??= new THREE.Color()),
      clearAlpha: this.renderer.getClearAlpha(), overrideMaterial: this.scene.overrideMaterial,
    } : null;
    this.renderer.info.autoReset = false;
    this.renderer.info.reset();
    try {
      if (post) {
        if (this.ao) {
          this.ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix);
          this.ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse);
          this.ao.ssaoMaterial.uniforms.cameraNear.value = this.camera.near;
          this.ao.ssaoMaterial.uniforms.cameraFar.value = this.camera.far;
        }
        this.composer.render(0);
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    } finally {
      this.renderer.info.autoReset = autoReset;
      if (state) {
        this.scene.overrideMaterial = state.overrideMaterial;
        this.renderer.autoClear = state.autoClear;
        this.renderer.setClearColor(state.clearColor, state.clearAlpha);
        this.renderer.setRenderTarget(state.target);
      }
    }
  }

  getMetrics() {
    return {
      requested: this.requestedQuality, quality: this.quality, pixelRatio: this.renderer.getPixelRatio(),
      hdrSupported: this.hdrSupported, postProcessed: this.lastPostProcessed,
      reflections: Boolean(this.scene.environment),
      ambientOcclusion: this.lastPostProcessed && Boolean(this.ao), bloom: this.lastPostProcessed && Boolean(this.bloom),
      aoResolution: this.ao ? [this.ao.width, this.ao.height] : null,
    };
  }

  disposeComposer() {
    // Likewise, UnrealBloomPass r160 omits the bright-pixel filter material.
    this.bloom?.materialHighPassFilter.dispose();
    this.composer?.passes.forEach(pass => pass.dispose?.());
    this.composer?.dispose();
    this.composer = this.ao = this.bloom = this.fxaa = null;
  }

  dispose() {
    this.disposeComposer();
    if (this.environmentTarget && this.scene.environment === this.environmentTarget.texture) this.scene.environment = null;
    this.environmentTarget?.dispose();
  }
}
