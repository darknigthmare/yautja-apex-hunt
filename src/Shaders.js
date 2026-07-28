import * as THREE from 'three';

// Shaders for Thermal Vision, Cloaking Camouflage, and Plasma Energy Effects

export class ShaderManager {
  // Creates Thermal Vision Shader Material for prey and environment objects
  static createThermalMaterial(baseColor, heatValue = 0.5) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uHeat: { value: heatValue },
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(baseColor) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uHeat;
        uniform float uTime;
        uniform vec3 uBaseColor;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        // Thermal rainbow ramp mapper: 0.0 (Cold Blue) -> 0.5 (Green/Yellow) -> 1.0 (Burning Red/White)
        vec3 getThermalColor(float h) {
          if (h < 0.2) return mix(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.4, 0.8), h / 0.2);
          if (h < 0.4) return mix(vec3(0.0, 0.4, 0.8), vec3(0.0, 0.8, 0.2), (h - 0.2) / 0.2);
          if (h < 0.7) return mix(vec3(0.0, 0.8, 0.2), vec3(1.0, 0.8, 0.0), (h - 0.4) / 0.3);
          if (h < 0.9) return mix(vec3(1.0, 0.8, 0.0), vec3(1.0, 0.0, 0.0), (h - 0.7) / 0.2);
          return mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), (h - 0.9) / 0.1);
        }

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
          
          float dynamicHeat = clamp(uHeat + fresnel * 0.3, 0.0, 1.0);
          vec3 thermalCol = getThermalColor(dynamicHeat);

          gl_FragColor = vec4(thermalCol, 1.0);
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
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        uniform float uTime;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 displacedPos = position + normal * sin(position.y * 10.0 + uTime * 5.0) * 0.04;
          vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
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
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;

        void main() {
          float pulse = sin(uTime * 20.0) * 0.2 + 0.8;
          vec3 coreColor = vec3(0.1, 0.7, 1.0);
          vec3 rimColor = vec3(0.8, 0.1, 1.0);

          float rim = pow(1.0 - max(dot(vec3(0.0, 0.0, 1.0), vNormal), 0.0), 2.0);
          vec3 finalCol = mix(coreColor, rimColor, rim) * pulse * 2.0;

          gl_FragColor = vec4(finalCol, 0.9);
        }
      `
    });
  }
}
