import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AviatorRobotMesh } from "./hackabot/AviatorRobotMesh";

export interface RobotMotionRefs {
  scrollProgress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}

interface UiPathRobot3DProps {
  motionRefs: RobotMotionRefs;
  modelUrl?: string;
  mode?: "home" | "hackabot";
}

const BLINK_INTERVAL_BASE = 3.4;
const DAMP_SPEED = 7.5;
const EYE_DAMP = 11;

function createUiEmblemTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    ctx.strokeStyle = "rgba(250, 246, 238, 0.92)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(24, 24, 208, 208, 36);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FAF6EE";
    ctx.font = "700 128px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Ui", 128, 136);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createUscForeheadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 1280, 300);

    // Subtle translucent fill + crisp white border box around USC KIIT only
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeStyle = "rgba(250, 246, 238, 0.94)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(370, 16, 540, 148, 30);
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = "rgba(10, 14, 24, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = "#FAF6EE";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "800 92px 'Space Grotesk', sans-serif";
    ctx.fillText("USC KIIT", 640, 92);

    // Subtitle below the box without any border box
    ctx.font = "700 54px 'Space Grotesk', sans-serif";
    ctx.fillText("Under Department of Training & Placement", 640, 228, 1200);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  override state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function CustomGlbRobot({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={1.15} />;
}

function ProceduralUiPathMascot({
  leftPupilRef,
  rightPupilRef,
  leftEyeGroupRef,
  rightEyeGroupRef,
  leftArmRef,
  rightArmRef,
  signalRingRefs,
}: {
  leftPupilRef: React.RefObject<THREE.Mesh | null>;
  rightPupilRef: React.RefObject<THREE.Mesh | null>;
  leftEyeGroupRef: React.RefObject<THREE.Group | null>;
  rightEyeGroupRef: React.RefObject<THREE.Group | null>;
  leftArmRef: React.RefObject<THREE.Group | null>;
  rightArmRef: React.RefObject<THREE.Group | null>;
  signalRingRefs: React.RefObject<(THREE.Mesh | null)[]>;
}) {
  const uiTexture = useMemo(() => createUiEmblemTexture(), []);
  const foreheadTexture = useMemo(() => createUscForeheadTexture(), []);
  useEffect(() => {
    return () => {
      uiTexture.dispose();
      foreheadTexture.dispose();
    };
  }, [uiTexture, foreheadTexture]);

  const { leftArmGeo, rightArmGeo } = useMemo(() => {
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.98, 0.04, 0.02),
      new THREE.Vector3(-1.32, -0.06, 0.16),
      new THREE.Vector3(-1.46, -0.34, 0.32),
    ]);
    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.98, 0.04, 0.02),
      new THREE.Vector3(1.32, 0.12, 0.18),
      new THREE.Vector3(1.48, 0.36, 0.34),
    ]);
    return {
      leftArmGeo: new THREE.TubeGeometry(leftCurve, 20, 0.105, 14, false),
      rightArmGeo: new THREE.TubeGeometry(rightCurve, 20, 0.105, 14, false),
    };
  }, []);

  useEffect(() => {
    return () => {
      leftArmGeo.dispose();
      rightArmGeo.dispose();
    };
  }, [leftArmGeo, rightArmGeo]);

  const ledConfigs: readonly { pos: [number, number, number]; color: string }[] = [
    { pos: [0.34, -0.44, 0.85], color: "#A855F7" },
    { pos: [0.45, -0.41, 0.81], color: "#3D9960" },
    { pos: [0.55, -0.46, 0.74], color: "#22D3EE" },
    { pos: [0.41, -0.53, 0.77], color: "#FACC15" },
    { pos: [0.52, -0.56, 0.69], color: "#D92B2B" },
  ];

  return (
    <group>
      {/* Top Orange Dome */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.41]} />
        <meshPhysicalMaterial
          color="#FA4616"
          roughness={0.13}
          metalness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      {/* Bottom Orange Bowl */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, Math.PI * 0.59, Math.PI * 0.41]} />
        <meshPhysicalMaterial
          color="#FA4616"
          roughness={0.13}
          metalness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      {/* Recessed Metallic Cobalt Blue Center Visor Band */}
      <mesh receiveShadow>
        <sphereGeometry args={[0.965, 48, 24, 0, Math.PI * 2, Math.PI * 0.39, Math.PI * 0.22]} />
        <meshPhysicalMaterial
          color="#0067DF"
          roughness={0.2}
          metalness={0.45}
          clearcoat={0.85}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* Subtle Glowing Rim Accents framing the visor band */}
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.955, 0.016, 12, 64]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0067DF" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.955, 0.016, 12, 64]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0067DF" emissiveIntensity={1.4} />
      </mesh>

      {/* Interactive Cursor-Tracking Eyes */}
      <group ref={leftEyeGroupRef} position={[-0.31, 0.01, 0.92]} rotation={[0, -0.28, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.06, 32]} />
          <meshStandardMaterial color="#0A1931" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.03, 32]} />
          <meshStandardMaterial color="#FAF6EE" emissive="#E0F2FE" emissiveIntensity={0.45} />
        </mesh>
        <mesh ref={leftPupilRef} position={[0, 0, 0.055]}>
          <sphereGeometry args={[0.072, 20, 20]} />
          <meshPhysicalMaterial color="#081226" roughness={0.08} clearcoat={1} />
        </mesh>
        <mesh position={[0.03, 0.03, 0.115]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      <group ref={rightEyeGroupRef} position={[0.31, 0.01, 0.92]} rotation={[0, 0.28, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.06, 32]} />
          <meshStandardMaterial color="#0A1931" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.03, 32]} />
          <meshStandardMaterial color="#FAF6EE" emissive="#E0F2FE" emissiveIntensity={0.45} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.055]}>
          <sphereGeometry args={[0.072, 20, 20]} />
          <meshPhysicalMaterial color="#081226" roughness={0.08} clearcoat={1} />
        </mesh>
        <mesh position={[0.03, 0.03, 0.115]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Tilted Upper-Left Antenna Radar Dish + 3 Pulsing Signal Arcs */}
      <group position={[-0.48, 0.88, 0.12]} rotation={[0.15, 0.1, 0.48]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 0.28, 16]} />
          <meshStandardMaterial color="#0067DF" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.27, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.24, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshPhysicalMaterial
            color="#FA4616"
            roughness={0.18}
            clearcoat={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial color="#FF6B00" emissive="#FA4616" emissiveIntensity={2.2} />
        </mesh>
        {[0, 1, 2].map((idx) => (
          <mesh
            key={idx}
            ref={(el) => {
              if (signalRingRefs.current) signalRingRefs.current[idx] = el;
            }}
            position={[0, 0.46 + idx * 0.13, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.12 + idx * 0.08, 0.012, 10, 32]} />
            <meshStandardMaterial
              color="#FF6B00"
              emissive="#FA4616"
              emissiveIntensity={3.4}
              toneMapped={false}
              transparent
              opacity={0.88 - idx * 0.16}
            />
          </mesh>
        ))}
      </group>

      {/* Embossed "Ui" Emblem on Lower-Left Belly */}
      <mesh position={[-0.36, -0.5, 0.82]} rotation={[0.5, -0.38, 0.18]}>
        <planeGeometry args={[0.27, 0.27]} />
        <meshStandardMaterial map={uiTexture} transparent roughness={0.25} metalness={0.2} />
      </mesh>

      {/* Curved "USC KIIT" Forehead Emblem on Top Orange Dome */}
      <mesh>
        <sphereGeometry args={[1.008, 32, 16, Math.PI / 2 - 0.56, 1.12, 0.74, 0.34]} />
        <meshStandardMaterial
          map={foreheadTexture}
          transparent
          roughness={0.22}
          metalness={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* 5 Glowing Multicolored Status LED Dots on Lower-Right */}
      {ledConfigs.map((led, idx) => (
        <mesh key={idx} position={led.pos}>
          <sphereGeometry args={[0.036, 14, 14]} />
          <meshStandardMaterial
            color={led.color}
            emissive={led.color}
            emissiveIntensity={3.8}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Articulated Cobalt Blue Tubular Arms + Hand Spheres */}
      <group ref={leftArmRef}>
        <mesh geometry={leftArmGeo}>
          <meshPhysicalMaterial
            color="#0067DF"
            roughness={0.2}
            metalness={0.35}
            clearcoat={0.85}
          />
        </mesh>
        <mesh position={[-1.48, -0.36, 0.34]}>
          <sphereGeometry args={[0.155, 22, 22]} />
          <meshPhysicalMaterial color="#FAF6EE" roughness={0.2} clearcoat={0.85} />
        </mesh>
      </group>

      <group ref={rightArmRef}>
        <mesh geometry={rightArmGeo}>
          <meshPhysicalMaterial
            color="#0067DF"
            roughness={0.2}
            metalness={0.35}
            clearcoat={0.85}
          />
        </mesh>
        <mesh position={[1.5, 0.39, 0.36]}>
          <sphereGeometry args={[0.155, 22, 22]} />
          <meshPhysicalMaterial color="#FAF6EE" roughness={0.2} clearcoat={0.85} />
        </mesh>
      </group>

      {/* Two Short Orange Legs with Rounded Hemisphere Shoes */}
      {([-0.34, 0.34] as const).map((xPos, idx) => (
        <group key={idx} position={[xPos, -1.04, 0.04]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.12, 0.135, 0.24, 20]} />
            <meshPhysicalMaterial color="#FA4616" roughness={0.2} clearcoat={0.88} />
          </mesh>
          <mesh position={[0, -0.1, 0.08]}>
            <sphereGeometry args={[0.19, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshPhysicalMaterial color="#FA4616" roughness={0.18} clearcoat={0.92} />
          </mesh>
          <mesh position={[0, -0.11, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.188, 24]} />
            <meshStandardMaterial color="#0A1931" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function UiPathRobot3D({ motionRefs, modelUrl, mode = "home" }: UiPathRobot3DProps) {
  const isHackabot = mode === "hackabot";
  const rootRef = useRef<THREE.Group>(null);
  const robotBodyRef = useRef<THREE.Group>(null);
  const ringOuterRef = useRef<THREE.Mesh>(null);
  const ringInnerRef = useRef<THREE.Mesh>(null);
  const cubesGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const leftEyeGroupRef = useRef<THREE.Group>(null);
  const rightEyeGroupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const signalRingRefs = useRef<(THREE.Mesh | null)[]>([]);

  const blinkTimerRef = useRef(2.2);
  const blinkProgressRef = useRef(0);
  const eyeOffsetRef = useRef({ x: 0, y: 0 });

  // Deterministic particle starfield / ember trails (no Math.random at module scope)
  const particleGeometry = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const flame = new THREE.Color("#FA4616");
    const cobalt = new THREE.Color("#0067DF");
    const emerald = new THREE.Color("#3D9960");
    const cream = new THREE.Color("#FAF6EE");

    for (let i = 0; i < count; i++) {
      const angle = i * 2.39996;
      const radius = 2.1 + (i % 19) * 0.24;
      const y = ((i * 37) % 100) / 12 - 4.1;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 0.8;

      const col = isHackabot
        ? i % 4 === 0
          ? flame
          : i % 4 === 1
            ? cobalt
            : i % 4 === 2
              ? emerald
              : cream
        : i % 3 === 0
          ? flame
          : i % 3 === 1
            ? cobalt
            : cream;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [isHackabot]);

  useEffect(() => () => particleGeometry.dispose(), [particleGeometry]);

  const cubePositions: readonly [number, number, number][] = [
    [-2.4, 0.9, -0.7],
    [2.5, -0.6, -0.5],
    [-2.1, -1.1, 0.4],
    [2.2, 1.2, 0.2],
    [0.1, 2.0, -1.2],
  ];

  const shardColors = ["#FA4616", "#0067DF", "#3D9960", "#FF6B00", "#38BDF8"] as const;

  // Single unified useFrame stepper: drives robot, eyes, blink, rings, shards/cubes, particles, and camera
  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const scroll = motionRefs.scrollProgress.current ?? 0;
    const pointer = motionRefs.pointer.current ?? { x: 0, y: 0 };

    // Responsive framing for portrait/mobile screens so robot + rings fit cleanly
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const isPortrait = aspect < 0.9;
    const mobileScale = isPortrait ? THREE.MathUtils.clamp(aspect / 0.85, 0.56, 1) : 1;
    const portraitCamZOffset = isPortrait ? (0.9 - aspect) * 2.4 : 0;

    // 3-Act scroll interpolation (Act 1: 0-45%, Act 2: 45-85%, Act 3: 85-100% for hackabot)
    const act2 = isHackabot
      ? THREE.MathUtils.clamp((scroll - 0.36) / 0.4, 0, 1)
      : THREE.MathUtils.clamp((scroll - 0.28) / 0.42, 0, 1);
    const act3 = isHackabot
      ? THREE.MathUtils.clamp((scroll - 0.82) / 0.18, 0, 1)
      : THREE.MathUtils.clamp((scroll - 0.7) / 0.3, 0, 1);

    const targetCamZ = 4.65 + portraitCamZOffset + act2 * (isHackabot ? 1.65 : 1.45) - act3 * 0.45;
    const targetCamX = Math.sin(act2 * Math.PI) * 0.45 * mobileScale - act3 * 1.35 * mobileScale;
    const targetCamY = 0.15 + act2 * 0.24 - act3 * 0.5;

    const lerpFactor = 1 - Math.exp(-DAMP_SPEED * dt);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, lerpFactor);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, lerpFactor);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, lerpFactor);
    state.camera.lookAt(act3 * 0.9 * mobileScale, act2 * 0.18 + act3 * 0.35, 0);

    if (robotBodyRef.current) {
      const mobileOffsetY = aspect < 0.85 ? -0.14 : 0;
      const hoverY =
        Math.sin(t * 1.9) * 0.11 + mobileOffsetY + act2 * (isHackabot ? 0.34 : 0.28) + act3 * 1.15;
      const targetX = act3 * 2.15 * mobileScale;
      const targetScale = mobileScale * (1 - act3 * 0.34);
      const targetRotY = act2 * Math.PI * 2 + pointer.x * 0.34;
      const targetRotX = -pointer.y * 0.18 + Math.sin(t * 1.1) * 0.04;
      const targetRotZ = -pointer.x * 0.09;

      robotBodyRef.current.position.y = THREE.MathUtils.lerp(
        robotBodyRef.current.position.y,
        hoverY,
        lerpFactor,
      );
      robotBodyRef.current.position.x = THREE.MathUtils.lerp(
        robotBodyRef.current.position.x,
        targetX,
        lerpFactor,
      );
      const nextScale = THREE.MathUtils.lerp(
        robotBodyRef.current.scale.x,
        targetScale,
        lerpFactor,
      );
      robotBodyRef.current.scale.setScalar(nextScale);
      robotBodyRef.current.rotation.y = THREE.MathUtils.lerp(
        robotBodyRef.current.rotation.y,
        targetRotY,
        lerpFactor,
      );
      robotBodyRef.current.rotation.x = THREE.MathUtils.lerp(
        robotBodyRef.current.rotation.x,
        targetRotX,
        lerpFactor,
      );
      robotBodyRef.current.rotation.z = THREE.MathUtils.lerp(
        robotBodyRef.current.rotation.z,
        targetRotZ,
        lerpFactor,
      );
    }

    // Cursor-tracking pupils + natural blink
    const eyeLerp = 1 - Math.exp(-EYE_DAMP * dt);
    eyeOffsetRef.current.x = THREE.MathUtils.lerp(eyeOffsetRef.current.x, pointer.x * 0.048, eyeLerp);
    eyeOffsetRef.current.y = THREE.MathUtils.lerp(eyeOffsetRef.current.y, pointer.y * 0.038, eyeLerp);

    if (leftPupilRef.current && rightPupilRef.current) {
      leftPupilRef.current.position.x = eyeOffsetRef.current.x;
      leftPupilRef.current.position.y = eyeOffsetRef.current.y;
      rightPupilRef.current.position.x = eyeOffsetRef.current.x;
      rightPupilRef.current.position.y = eyeOffsetRef.current.y;
    }

    blinkTimerRef.current -= dt;
    if (blinkTimerRef.current <= 0) {
      blinkProgressRef.current = 1;
      blinkTimerRef.current = BLINK_INTERVAL_BASE + (Math.sin(t * 7.3) * 0.5 + 0.5) * 2.2;
    }
    if (blinkProgressRef.current > 0) {
      blinkProgressRef.current = Math.max(0, blinkProgressRef.current - dt * 6.5);
    }
    const blinkScaleY = 1 - Math.sin(blinkProgressRef.current * Math.PI) * 0.88;
    if (leftEyeGroupRef.current && rightEyeGroupRef.current) {
      leftEyeGroupRef.current.scale.y = blinkScaleY;
      rightEyeGroupRef.current.scale.y = blinkScaleY;
    }

    // Gentle gesturing arms
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 2.1) * 0.08;
      rightArmRef.current.rotation.z = Math.sin(t * 2.1 + 1.2) * 0.11 + act2 * 0.18;
    }

    // Pulsing antenna signal rings
    signalRingRefs.current.forEach((ring, idx) => {
      if (!ring) return;
      const pulse = 0.85 + Math.sin(t * 3.8 - idx * 0.8) * 0.2;
      ring.scale.setScalar(pulse);
    });

    // Expanding holographic HUD rings in Act 2
    const ringScale = (isHackabot ? 1.02 : 0.95) + act2 * (isHackabot ? 0.78 : 0.65);
    if (ringOuterRef.current) {
      ringOuterRef.current.rotation.z = t * (isHackabot ? 0.42 : 0.32);
      ringOuterRef.current.rotation.x = Math.PI * 0.45 + act2 * 0.18;
      ringOuterRef.current.scale.setScalar(ringScale);
    }
    if (ringInnerRef.current) {
      ringInnerRef.current.rotation.z = -t * (isHackabot ? 0.55 : 0.45);
      ringInnerRef.current.rotation.x = Math.PI * 0.56 - act2 * 0.16;
      ringInnerRef.current.rotation.y = 0.22;
      ringInnerRef.current.scale.setScalar((isHackabot ? 0.96 : 0.9) + act2 * 0.62);
    }

    // Orbiting dark-glass automation cubes or glowing UN SDG shards
    if (cubesGroupRef.current) {
      cubesGroupRef.current.rotation.y = t * (isHackabot ? 0.24 : 0.18) + act2 * 1.25;
      cubesGroupRef.current.children.forEach((child, idx) => {
        child.rotation.x = t * 0.55 + idx;
        child.rotation.y = t * 0.4 + idx * 0.6;
      });
    }

    // Data/ember particles: rise smoothly in Hackabot command mode (warp downward on Act 3)
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      const direction = isHackabot && act3 < 0.25 ? 1 : -1;
      const speed = (isHackabot ? 0.35 : 0.22) + act3 * 4.8;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i) + direction * speed * dt;
        if (y < -4.2) y = 4.2;
        if (y > 4.2) y = -4.2;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      particlesRef.current.rotation.y = t * 0.08;
    }
  });

  const proceduralMesh = isHackabot ? (
    <AviatorRobotMesh
      leftPupilRef={leftPupilRef}
      rightPupilRef={rightPupilRef}
      leftEyeGroupRef={leftEyeGroupRef}
      rightEyeGroupRef={rightEyeGroupRef}
      leftArmRef={leftArmRef}
      rightArmRef={rightArmRef}
    />
  ) : (
    <ProceduralUiPathMascot
      leftPupilRef={leftPupilRef}
      rightPupilRef={rightPupilRef}
      leftEyeGroupRef={leftEyeGroupRef}
      rightEyeGroupRef={rightEyeGroupRef}
      leftArmRef={leftArmRef}
      rightArmRef={rightArmRef}
      signalRingRefs={signalRingRefs}
    />
  );

  return (
    <group ref={rootRef}>
      <group ref={robotBodyRef}>
        {modelUrl ? (
          <ModelErrorBoundary fallback={proceduralMesh}>
            <Suspense fallback={proceduralMesh}>
              <CustomGlbRobot url={modelUrl} />
            </Suspense>
          </ModelErrorBoundary>
        ) : (
          proceduralMesh
        )}

        {/* Holographic Workflow Orbital HUD Rings */}
        <mesh ref={ringOuterRef} rotation={[Math.PI * 0.45, 0, 0]}>
          <torusGeometry args={[2.15, isHackabot ? 0.018 : 0.014, 12, 96]} />
          <meshStandardMaterial
            color="#FA4616"
            emissive="#FA4616"
            emissiveIntensity={isHackabot ? 2.6 : 2.1}
            toneMapped={false}
            transparent
            opacity={isHackabot ? 0.88 : 0.78}
          />
        </mesh>
        <mesh ref={ringInnerRef} rotation={[Math.PI * 0.56, 0.22, 0]}>
          <torusGeometry args={[1.85, isHackabot ? 0.015 : 0.011, 12, 84]} />
          <meshStandardMaterial
            color="#0067DF"
            emissive="#0067DF"
            emissiveIntensity={isHackabot ? 2.6 : 2.2}
            toneMapped={false}
            transparent
            opacity={isHackabot ? 0.85 : 0.7}
          />
        </mesh>
      </group>

      {/* Orbiting Automation Cubes (home) or Translucent UN SDG Geometric Shards (hackabot) */}
      <group ref={cubesGroupRef}>
        {cubePositions.map((pos, idx) => {
          const shardColor = shardColors[idx % shardColors.length] ?? "#FA4616";
          return isHackabot ? (
            <mesh key={idx} position={pos}>
              <octahedronGeometry args={[0.21, 0]} />
              <meshPhysicalMaterial
                color={shardColor}
                roughness={0.08}
                metalness={0.15}
                clearcoat={1}
                transparent
                opacity={0.78}
                emissive={shardColor}
                emissiveIntensity={0.65}
              />
            </mesh>
          ) : (
            <mesh key={idx} position={pos}>
              <boxGeometry args={[0.24, 0.24, 0.24]} />
              <meshPhysicalMaterial
                color="#12141D"
                roughness={0.14}
                metalness={0.4}
                clearcoat={0.9}
                emissive={idx % 2 === 0 ? "#FA4616" : "#0067DF"}
                emissiveIntensity={0.35}
              />
            </mesh>
          );
        })}
      </group>

      {/* Ambient Orbiting Data / Ember Particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial size={isHackabot ? 0.056 : 0.048} vertexColors transparent opacity={0.88} sizeAttenuation />
      </points>
    </group>
  );
}