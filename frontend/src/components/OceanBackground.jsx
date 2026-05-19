'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OceanWaves = () => {
  const mesh = useRef(null);
  
  const geometry = useMemo(() => new THREE.PlaneGeometry(15, 15, 64, 64), []);
  
  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = Math.sin(x * 1.5 + time * 0.8) * 0.2 + Math.cos(y * 1.5 + time * 0.5) * 0.2;
      positions.setZ(i, z);
    }
    
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2, -3]}>
      <meshStandardMaterial 
        color="#0d9488" 
        wireframe={true} 
        transparent={true} 
        opacity={0.3} 
      />
    </mesh>
  );
};

export default function OceanBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <OceanWaves />
      </Canvas>
    </div>
  );
}
