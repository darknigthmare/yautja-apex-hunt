import * as THREE from 'three';

// Shaders for Thermal Vision, Cloaking Camouflage, and Plasma Energy Effects

// Let the renderer select rigid, instanced, morph-target or skeletal variants.
// In particular, vision shaders must deform the same vertices AND normals as
// the PBR material or a moving hunter snaps back to its bind pose when cloaked.
function createEffectVertexShader({ shimmer = false } = {}) {
  return `
    #include <common>
    #include <batching_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    ${shimmer ? 'uniform float uTime;' : ''}

    void main() {
      #include <batching_vertex>
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      vNormal = normalize(transformedNormal);

      #include <begin_vertex>
      #include <morphtarget_vertex>
      #include <skinning_vertex>
      ${shimmer ? 'transformed += normalize(objectNormal) * sin(position.y * 10.0 + uTime * 5.0) * 0.04;' : ''}
      #include <project_vertex>
      vViewPosition = -mvPosition.xyz;
    }
  `;
}

export class ShaderManager {
  // Creates Thermal Vision Shader Material for prey and environment objects
  static createThermalMaterial(baseColor, heatValue = 0.5) {
    return new THREE.ShaderMaterial({
      toneMapped: false,
      uniforms: {
        uHeat: { value: heatValue },
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(baseColor) }
      },
      vertexShader: createEffectVertexShader(),
      fragmentShader: `
        uniform float uHeat;
        uniform float uTime;
        uniform vec3 uBaseColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        // Thermal rainbow ramp mapper: 0.0 (Cold Blue) -> 0.5 (Green/Yellow) -> 1.0 (Burning Red/White)
        vec3 getThermalColor(float h) {
          if (h < 0.2) return mix(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.4, 0.8), h / 0.2);
          if (h < 0.4) return mix(vec3(0.0, 0.4, 0.8), vec3(0.0, 0.8, 0.2), (h - 0.2) / 0.2);
          if (h < 0.7) return mix(vec3(0.0, 0.8, 0.2), vec3(1.0, 0.8, 0.0), (h - 0.4) / 0.3);
          if (h < 0.9) return mix(vec3(1.0, 0.8, 0.0), vec3(1.0, 0.0, 0.0), (h - 0.7) / 0.2);
          return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), (h - 0.9) / 0.1);
        }

        void main() {
          // normalMatrix and the viewing direction must share view space.
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.0);
          
          float dynamicHeat = clamp(uHeat + fresnel * 0.3, 0.0, 1.0);
          vec3 thermalCol = getThermalColor(dynamicHeat);

          gl_FragColor = vec4(thermalCol, 1.0);
          #include <colorspace_fragment>
        }
      `
    });
  }

  // Cloak Refraction Shimmer Shader Material for Yautja Active Camouflage
  static createCloakMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.25 }
      },
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      vertexShader: createEffectVertexShader({ shimmer: true }),
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float rim = 1.0 - max(dot(viewDir, normal), 0.0);
          rim = pow(rim, 3.0);

          vec3 shimmerColor = mix(vec3(0.0, 0.9, 1.0), vec3(0.8, 1.0, 0.9), sin(uTime * 10.0) * 0.5 + 0.5);
          gl_FragColor = vec4(shimmerColor, uOpacity + rim * 0.4);
          #include <colorspace_fragment>
        }
      `
    });
  }

  // Plasma Cannon Energy Spherical Shader
  static createPlasmaMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
      vertexShader: createEffectVertexShader(),
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;

        void main() {
          float pulse = sin(uTime * 20.0) * 0.2 + 0.8;
          vec3 coreColor = vec3(0.1, 0.7, 1.0);
          vec3 rimColor = vec3(0.8, 0.1, 1.0);

          float rim = pow(1.0 - max(dot(vec3(0.0, 0.0, 1.0), normalize(vNormal)), 0.0), 2.0);
          vec3 finalCol = mix(coreColor, rimColor, rim) * pulse * 2.0;

          gl_FragColor = vec4(finalCol, 0.9);
          #include <colorspace_fragment>
        }
      `
    });
  }
}
