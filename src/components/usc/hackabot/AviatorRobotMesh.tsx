import { useEffect, useMemo } from "react";
import * as THREE from "three";

interface AviatorRobotMeshProps {
  leftPupilRef: React.RefObject<THREE.Mesh | null>;
  rightPupilRef: React.RefObject<THREE.Mesh | null>;
  leftEyeGroupRef: React.RefObject<THREE.Group | null>;
  rightEyeGroupRef: React.RefObject<THREE.Group | null>;
  leftArmRef: React.RefObject<THREE.Group | null>;
  rightArmRef: React.RefObject<THREE.Group | null>;
}

/**
 * Procedural 3D Aviator Bot mascot exclusively for the HACK-A-BOT 3.0 stage:
 * teal-cyan spherical chassis, brown leather pilot cap with star badge & riveted
 * ear flaps, gold-rimmed tan leather goggles with red strap, yellow rear loop,
 * friendly smile, and orange gesturing arms.
 */
function createUscForeheadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 1280, 300);

    // Subtle translucent fill + crisp white border box around USC KIIT
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

export function AviatorRobotMesh({
  leftPupilRef,
  rightPupilRef,
  leftEyeGroupRef,
  rightEyeGroupRef,
  leftArmRef,
  rightArmRef,
}: AviatorRobotMeshProps) {
  const uscForeheadTexture = useMemo(() => createUscForeheadTexture(), []);
  const {
    leftArmGeo,
    rightArmGeo,
    yellowLoopGeo,
    redStrapGeo,
    starBadgeGeo,
    earFlapGeo,
  } = useMemo(() => {
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.96, -0.1, 0.04),
      new THREE.Vector3(-1.28, -0.36, 0.24),
      new THREE.Vector3(-1.08, -0.62, 0.56),
    ]);
    const rightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.96, -0.04, 0.04),
      new THREE.Vector3(1.3, 0.06, 0.22),
      new THREE.Vector3(1.36, 0.34, 0.4),
    ]);
    const loopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0.44, -0.82),
      new THREE.Vector3(-1.26, 0.58, -0.56),
      new THREE.Vector3(-1.46, 0.08, -0.36),
      new THREE.Vector3(-1.14, -0.38, -0.52),
      new THREE.Vector3(-0.46, -0.4, -0.8),
    ]);
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.7, 0.14, 0.72),
      new THREE.Vector3(-1.06, 0.16, 0.18),
      new THREE.Vector3(-0.9, 0.18, -0.62),
      new THREE.Vector3(0, 0.2, -1.07),
      new THREE.Vector3(0.9, 0.18, -0.62),
      new THREE.Vector3(1.06, 0.16, 0.18),
      new THREE.Vector3(0.7, 0.14, 0.72),
    ]);

    // 4-point aviator star badge shape
    const starShape = new THREE.Shape();
    const outerR = 0.14;
    const innerR = 0.045;
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / 4;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    // Tapered leather ear-flap silhouette
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.26, 0.24);
    flapShape.quadraticCurveTo(0.0, 0.3, 0.26, 0.24);
    flapShape.lineTo(0.18, -0.62);
    flapShape.quadraticCurveTo(0.0, -0.76, -0.18, -0.62);
    flapShape.closePath();

    return {
      leftArmGeo: new THREE.TubeGeometry(leftCurve, 22, 0.095, 14, false),
      rightArmGeo: new THREE.TubeGeometry(rightCurve, 22, 0.095, 14, false),
      yellowLoopGeo: new THREE.TubeGeometry(loopCurve, 32, 0.055, 14, false),
      redStrapGeo: new THREE.TubeGeometry(strapCurve, 44, 0.068, 10, false),
      starBadgeGeo: new THREE.ExtrudeGeometry(starShape, {
        depth: 0.025,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 2,
      }),
      earFlapGeo: new THREE.ExtrudeGeometry(flapShape, {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      leftArmGeo.dispose();
      rightArmGeo.dispose();
      yellowLoopGeo.dispose();
      redStrapGeo.dispose();
      starBadgeGeo.dispose();
      earFlapGeo.dispose();
      uscForeheadTexture.dispose();
    };
  }, [leftArmGeo, rightArmGeo, yellowLoopGeo, redStrapGeo, starBadgeGeo, earFlapGeo, uscForeheadTexture]);

  return (
    <group>
      {/* Core Teal / Cyan-Blue Spherical Chassis */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 48, 36]} />
        <meshPhysicalMaterial
          color="#139BB7"
          roughness={0.22}
          metalness={0.08}
          clearcoat={0.78}
          clearcoatRoughness={0.14}
        />
      </mesh>

      {/* Subtle Teal Top Crest Peeking Above Helmet Crown */}
      <mesh position={[0, 1.01, -0.05]} rotation={[-0.2, 0, 0]} scale={[0.85, 0.55, 1.15]}>
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshPhysicalMaterial color="#139BB7" roughness={0.22} clearcoat={0.75} />
      </mesh>

      {/* Dark Brown Leather Aviator Pilot Cap */}
      <group rotation={[-0.36, 0, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.045, 48, 28, 0, Math.PI * 2, 0, Math.PI * 0.47]} />
          <meshStandardMaterial color="#523527" roughness={0.78} metalness={0.04} />
        </mesh>
        {/* Subtle Stitched Brow Trim */}
        <mesh position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.04, 0.022, 10, 64]} />
          <meshStandardMaterial color="#3E261B" roughness={0.82} />
        </mesh>
      </group>

      {/* Gold 4-Point Aviator Star Emblem on Upper Cap Crown */}
      <mesh
        geometry={starBadgeGeo}
        position={[0, 0.87, 0.6]}
        rotation={[-0.92, 0, 0]}
        scale={0.78}
      >
        <meshPhysicalMaterial
          color="#FACC15"
          emissive="#D97706"
          emissiveIntensity={0.22}
          metalness={0.92}
          roughness={0.16}
          clearcoat={1}
        />
      </mesh>

      {/* USC KIIT (white box) + Under Department of Training & Placement below the star */}
      <mesh position={[0, 0.63, 0.86]} rotation={[-0.58, 0, 0]}>
        <planeGeometry args={[0.98, 0.23]} />
        <meshStandardMaterial
          map={uscForeheadTexture}
          transparent
          depthWrite={false}
          roughness={0.4}
        />
      </mesh>

      {/* Left & Right Hanging Leather Ear Flaps with Gold Rivet Buttons */}
      <group position={[-1.02, -0.22, 0.05]} rotation={[0.06, -Math.PI / 2 + 0.16, -0.14]}>
        <mesh geometry={earFlapGeo} castShadow>
          <meshStandardMaterial color="#523527" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh position={[0, -0.56, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 0.032, 20]} />
          <meshPhysicalMaterial color="#FACC15" metalness={0.95} roughness={0.15} clearcoat={1} />
        </mesh>
      </group>

      <group position={[1.02, -0.22, 0.05]} rotation={[0.06, Math.PI / 2 - 0.16, 0.14]}>
        <mesh geometry={earFlapGeo} castShadow>
          <meshStandardMaterial color="#523527" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh position={[0, -0.56, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 0.032, 20]} />
          <meshPhysicalMaterial color="#FACC15" metalness={0.95} roughness={0.15} clearcoat={1} />
        </mesh>
      </group>

      {/* Bright Yellow Rear Aviator Cable / Loop */}
      <mesh geometry={yellowLoopGeo} castShadow>
        <meshPhysicalMaterial
          color="#FACC15"
          emissive="#EAB308"
          emissiveIntensity={0.18}
          roughness={0.25}
          clearcoat={0.7}
        />
      </mesh>

      {/* Crimson-Red Goggle Elastic Strap Wrapping Around Helmet */}
      <mesh geometry={redStrapGeo} scale={[1, 0.72, 1]}>
        <meshStandardMaterial color="#E11D48" roughness={0.55} metalness={0.06} />
      </mesh>

      {/* Cursor-Tracking Expressive Eyes Behind Goggles */}
      <group ref={leftEyeGroupRef} position={[-0.31, 0.13, 0.87]} rotation={[0, -0.25, 0]}>
        <mesh scale={[0.92, 1.08, 0.55]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#FAF6EE" emissive="#E0F2FE" emissiveIntensity={0.38} />
        </mesh>
        <mesh ref={leftPupilRef} position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshPhysicalMaterial color="#090A0F" roughness={0.08} clearcoat={1} />
        </mesh>
        <mesh position={[0.032, 0.036, 0.165]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      <group ref={rightEyeGroupRef} position={[0.31, 0.13, 0.87]} rotation={[0, 0.25, 0]}>
        <mesh scale={[0.92, 1.08, 0.55]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#FAF6EE" emissive="#E0F2FE" emissiveIntensity={0.38} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshPhysicalMaterial color="#090A0F" roughness={0.08} clearcoat={1} />
        </mesh>
        <mesh position={[0.032, 0.036, 0.165]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Tan Leather Aviator Goggles + Shiny Metallic Gold Bezels & Bridge */}
      <group>
        {/* Tan Leather Nose Bridge Cushion */}
        <mesh position={[0, 0.13, 0.94]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.1, 0.22, 8, 16]} />
          <meshStandardMaterial color="#9E5B34" roughness={0.62} />
        </mesh>

        {/* Left Goggle Assembly */}
        <group position={[-0.34, 0.13, 0.9]} rotation={[0, -0.24, 0]}>
          <mesh scale={[1.14, 0.98, 1.25]}>
            <torusGeometry args={[0.255, 0.078, 16, 40]} />
            <meshStandardMaterial color="#9E5B34" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0, 0.055]} scale={[1.1, 0.95, 1.28]}>
            <torusGeometry args={[0.235, 0.04, 18, 44]} />
            <meshPhysicalMaterial
              color="#F59E0B"
              metalness={0.96}
              roughness={0.12}
              clearcoat={1}
            />
          </mesh>
          <mesh position={[0, 0, 0.068]} scale={[1.05, 0.9, 1]}>
            <circleGeometry args={[0.215, 32]} />
            <meshPhysicalMaterial
              color="#E0F2FE"
              transparent
              opacity={0.16}
              roughness={0.05}
              clearcoat={1}
              depthWrite={false}
            />
          </mesh>
          {/* Silver Strap Buckle Clip */}
          <mesh position={[-0.36, 0, -0.05]} rotation={[0, -0.2, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.08]} />
            <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Right Goggle Assembly */}
        <group position={[0.34, 0.13, 0.9]} rotation={[0, 0.24, 0]}>
          <mesh scale={[1.14, 0.98, 1.25]}>
            <torusGeometry args={[0.255, 0.078, 16, 40]} />
            <meshStandardMaterial color="#9E5B34" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0, 0.055]} scale={[1.1, 0.95, 1.28]}>
            <torusGeometry args={[0.235, 0.04, 18, 44]} />
            <meshPhysicalMaterial
              color="#F59E0B"
              metalness={0.96}
              roughness={0.12}
              clearcoat={1}
            />
          </mesh>
          <mesh position={[0, 0, 0.068]} scale={[1.05, 0.9, 1]}>
            <circleGeometry args={[0.215, 32]} />
            <meshPhysicalMaterial
              color="#E0F2FE"
              transparent
              opacity={0.16}
              roughness={0.05}
              clearcoat={1}
              depthWrite={false}
            />
          </mesh>
          {/* Silver Strap Buckle Clip */}
          <mesh position={[0.36, 0, -0.05]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.08]} />
            <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Metallic Top Hinge Bridge Bar Between Lenses */}
        <mesh position={[0, 0.34, 0.99]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.34, 14]} />
          <meshPhysicalMaterial color="#FDE047" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.34, 0.99]}>
          <boxGeometry args={[0.065, 0.065, 0.05]} />
          <meshStandardMaterial color="#E5E7EB" metalness={0.92} roughness={0.2} />
        </mesh>
      </group>

      {/* Cheerful Curved Smile on Lower Face */}
      <mesh position={[-0.02, -0.25, 0.93]} rotation={[0.2, -0.05, Math.PI * 1.18]}>
        <torusGeometry args={[0.22, 0.018, 10, 32, Math.PI * 0.62]} />
        <meshStandardMaterial color="#090A0F" roughness={0.35} />
      </mesh>

      {/* Orange Tubular Arms + Gloved Hands (Left resting inward, Right waving salute) */}
      <group ref={leftArmRef}>
        <mesh geometry={leftArmGeo} castShadow>
          <meshPhysicalMaterial color="#FA4616" roughness={0.22} clearcoat={0.82} />
        </mesh>
        <mesh position={[-1.06, -0.63, 0.58]}>
          <sphereGeometry args={[0.135, 20, 20]} />
          <meshPhysicalMaterial color="#FA4616" roughness={0.22} clearcoat={0.82} />
        </mesh>
        <mesh position={[-0.95, -0.57, 0.62]}>
          <sphereGeometry args={[0.055, 14, 14]} />
          <meshPhysicalMaterial color="#FA4616" roughness={0.22} clearcoat={0.82} />
        </mesh>
      </group>

      <group ref={rightArmRef}>
        <mesh geometry={rightArmGeo} castShadow>
          <meshPhysicalMaterial color="#FA4616" roughness={0.22} clearcoat={0.82} />
        </mesh>
        <mesh position={[1.36, 0.37, 0.42]}>
          <sphereGeometry args={[0.135, 20, 20]} />
          <meshPhysicalMaterial color="#FA4616" roughness={0.22} clearcoat={0.82} />
        </mesh>
        <mesh position={[1.24, 0.38, 0.48]}>
          <sphereGeometry args={[0.055, 14, 14]} />
          <meshPhysicalMaterial color="#FA4616" roughness={0.22} clearcoat={0.82} />
        </mesh>
      </group>
    </group>
  );
}
