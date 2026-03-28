import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

// Generate synthetic Alps-like terrain heightmap
function generateTerrain(width, height) {
  const data = new Float32Array(width * height);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const x = j / width;
      const y = i / height;
      // Combine multiple sine waves for mountain-like terrain
      let h = 0;
      h += Math.sin(x * 6) * Math.cos(y * 4) * 0.4;
      h += Math.sin(x * 12 + 1) * Math.cos(y * 8 + 2) * 0.2;
      h += Math.sin(x * 24 + 3) * Math.cos(y * 16 + 1) * 0.1;
      h += Math.cos(x * 3 + y * 5) * 0.3;
      // Ridge line through center
      const distFromCenter = Math.abs(y - 0.5);
      h += Math.max(0, 0.5 - distFromCenter * 2) * 0.6;
      data[i * width + j] = h;
    }
  }
  return data;
}

// Color based on elevation and snow coverage
function getSnowColor(elevation, snowFactor) {
  const color = new THREE.Color();
  if (elevation > 0.6) {
    // High peaks - always some snow, but less over time
    color.lerpColors(
      new THREE.Color('#8B7355'), // rock brown
      new THREE.Color('#F8FAFC'), // snow white
      0.3 + snowFactor * 0.7
    );
  } else if (elevation > 0.3) {
    // Mid elevation - variable snow
    color.lerpColors(
      new THREE.Color('#6B8E5A'), // alpine green
      new THREE.Color('#E2E8F0'), // light snow
      snowFactor * 0.8
    );
  } else {
    // Low elevation - grass/forest, minimal snow
    color.lerpColors(
      new THREE.Color('#4A7C3F'), // forest green
      new THREE.Color('#CBD5E1'), // frost
      snowFactor * 0.3
    );
  }
  return color;
}

function Terrain({ year }) {
  const meshRef = useRef();
  const width = 128;
  const height = 80;

  const { geometry, terrain } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 6, width - 1, height - 1);
    const terrainData = generateTerrain(width, height);

    // Displace vertices by heightmap
    const positions = geo.attributes.position.array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 2] = terrainData[i] * 2;
    }
    geo.computeVertexNormals();

    return { geometry: geo, terrain: terrainData };
  }, []);

  // Update colors based on year (snow factor decreases over time)
  useMemo(() => {
    if (!geometry) return;

    // Snow factor: 1.0 in 2000, decreasing ~0.02/year
    const snowFactor = Math.max(0.1, 1.0 - (year - 2000) * 0.025);

    const colors = new Float32Array(terrain.length * 3);
    for (let i = 0; i < terrain.length; i++) {
      const elevation = (terrain[i] + 0.5) / 1.5; // normalize to 0-1
      const color = getSnowColor(elevation, snowFactor);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [year, geometry, terrain]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -0.5;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function Snow3D() {
  const [year, setYear] = useState(2000);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 4, 6], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #E0F2FE 0%, #FAFBFC 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <directionalLight position={[-3, 5, -3]} intensity={0.3} />
        <fog attach="fog" args={['#E0F2FE', 8, 18]} />
        <Terrain year={year} />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.2}
        />
        <Text
          position={[0, 3, 0]}
          fontSize={0.4}
          color="#1E3A5F"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {year}
        </Text>
      </Canvas>

      {/* Year slider */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-xl px-6 py-3 shadow-lg flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">2000</span>
        <input
          type="range"
          min={2000}
          max={2024}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-48 accent-blue-600"
        />
        <span className="text-sm font-medium text-slate-500">2024</span>
        <span className="text-sm font-bold text-blue-600 w-12 text-center">{year}</span>
      </div>
    </div>
  );
}
