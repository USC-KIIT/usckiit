import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { UiPathRobot3D, type RobotMotionRefs } from "./UiPathRobot3D";

interface HeroStage3DProps {
  motionRefs: RobotMotionRefs;
  modelUrl?: string;
  onReady?: () => void;
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

function StaticRobotFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center" data-scene-ready="fallback">
      <div className="relative flex h-52 w-52 items-center justify-center sm:h-80 sm:w-80">
        <div className="absolute inset-0 rounded-full bg-flame/25 blur-3xl" />
        <svg viewBox="0 0 240 240" className="relative h-44 w-44 drop-shadow-2xl sm:h-68 sm:w-68" aria-label="USC KIIT UiPath Robot">
          <defs>
            <linearGradient id="botOrange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="55%" stopColor="#FA4616" />
              <stop offset="100%" stopColor="#D92B2B" />
            </linearGradient>
            <linearGradient id="botBlue" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#004BB5" />
              <stop offset="50%" stopColor="#0067DF" />
              <stop offset="100%" stopColor="#004BB5" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="122" r="72" fill="url(#botOrange)" />
          <rect x="49" y="101" width="142" height="36" rx="18" fill="url(#botBlue)" />
          <circle cx="96" cy="119" r="13" fill="#FAF6EE" />
          <circle cx="144" cy="119" r="13" fill="#FAF6EE" />
          <circle cx="98" cy="119" r="6" fill="#090A0F" />
          <circle cx="146" cy="119" r="6" fill="#090A0F" />
          <path d="M84 58 L70 36" stroke="#0067DF" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="66" cy="33" rx="18" ry="8" transform="rotate(-24 66 33)" fill="#FA4616" />
          <text x="86" y="166" fill="#FAF6EE" fontSize="20" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
            Ui
          </text>
          <circle cx="146" cy="158" r="3" fill="#3D9960" />
          <circle cx="155" cy="162" r="3" fill="#22D3EE" />
          <circle cx="138" cy="165" r="3" fill="#FACC15" />
        </svg>
      </div>
    </div>
  );
}

export default function HeroStage3D({ motionRefs, modelUrl, onReady }: HeroStage3DProps) {
  const [webglReady, setWebglReady] = useState<boolean | null>(null);
  const [sceneDrawn, setSceneDrawn] = useState(false);

  useEffect(() => {
    const supported = checkWebGLSupport();
    setWebglReady(supported);
    if (!supported) onReady?.();
  }, [onReady]);

  if (webglReady === false) {
    return <StaticRobotFallback />;
  }

  return (
    <div
      className="h-full w-full"
      data-scene-ready={sceneDrawn ? "true" : undefined}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.15, 4.65], fov: 40, near: 0.1, far: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={() => {
          requestAnimationFrame(() => {
            setSceneDrawn(true);
            onReady?.();
          });
        }}
      >
        <ambientLight intensity={0.45} color="#FAF6EE" />
        {/* Dramatic Flame Orange Rim Light from the Right */}
        <directionalLight position={[5, 3, 2]} intensity={3.2} color="#FF6B00" />
        {/* Cobalt Blue Fill Light from the Left */}
        <directionalLight position={[-5, 1.5, 3]} intensity={2.2} color="#0067DF" />
        {/* Warm Key Light from Front-Top */}
        <pointLight position={[0, 3.5, 4.5]} intensity={12} color="#FAF6EE" distance={14} />
        {/* Subtle KIIT Emerald Under-Bounce */}
        <pointLight position={[0, -3.2, 2]} intensity={3.5} color="#3D9960" distance={9} />

        {/* Local Lightformers (no external HDR CDN fetch) */}
        <Environment resolution={256}>
          <Lightformer intensity={3.2} color="#FAF6EE" position={[0, 6, 3]} scale={[12, 4, 1]} />
          <Lightformer intensity={2.2} color="#FFF3E0" position={[3, 4, 5]} scale={[6, 3, 1]} />
          <Lightformer
            intensity={3.8}
            color="#FF6B00"
            position={[6, 1, -2]}
            rotation-y={-Math.PI / 2}
            scale={[9, 5, 1]}
          />
          <Lightformer
            intensity={3.0}
            color="#0067DF"
            position={[-6, 0, -1]}
            rotation-y={Math.PI / 2}
            scale={[9, 5, 1]}
          />
          <Lightformer
            intensity={1.6}
            color="#3D9960"
            position={[0, -4, 2]}
            rotation-x={-Math.PI / 2}
            scale={[10, 10, 1]}
          />
        </Environment>

        <UiPathRobot3D motionRefs={motionRefs} {...(modelUrl ? { modelUrl } : {})} />
        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.45}
          scale={7}
          blur={2.4}
          far={3.5}
          color="#090A0F"
        />
      </Canvas>
    </div>
  );
}