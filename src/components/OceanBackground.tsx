import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 1500; // Reduced for better performance

  const [positions, speeds, sizes, initialPos] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const siz = new Float32Array(count);
    const init = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 15;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;
      spd[i] = Math.random() * 0.3 + 0.2;
      siz[i] = Math.random() * 0.08 + 0.04;
    }
    return [pos, spd, siz, init];
  }, []);

  const initialPositions = useRef<Float32Array>(initialPos);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = mesh.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const baseX = initialPositions.current[i3];
      const baseY = initialPositions.current[i3 + 1];
      const baseZ = initialPositions.current[i3 + 2];
      
      // Smooth floating animation - reset to base position first
      posArray[i3] = baseX + Math.sin(time * speeds[i] + i * 0.1) * 2;
      posArray[i3 + 1] = baseY + Math.cos(time * speeds[i] * 0.8 + i * 0.1) * 2;
      posArray[i3 + 2] = baseZ + Math.sin(time * speeds[i] * 0.6 + i * 0.1) * 1.5;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    // Gentle rotation
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.15) * 0.08;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#4db8b8"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WaveField() {
  const mesh = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    if (!mesh.current || !geometryRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = geometryRef.current.attributes.position;
    
    // Smoother, more visible wave animation
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = 
        Math.sin(x * 0.3 + time * 0.8) * 0.6 +
        Math.cos(y * 0.28 + time * 0.7) * 0.5 +
        Math.sin((x + y) * 0.2 + time * 0.9) * 0.3;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 3.5, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry ref={geometryRef} args={[35, 35, 100, 100]} />
      <meshStandardMaterial
        color="#4db8b8"
        wireframe
        transparent
        opacity={0.4}
        emissive="#4db8b8"
        emissiveIntensity={0.5}
        wireframeLinewidth={1.5}
      />
    </mesh>
  );
}

export default function OceanBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 65 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#4db8b8" />
        <Particles />
        <WaveField />
      </Canvas>
    </div>
  );
}
