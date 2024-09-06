import React from "react";
import { useSphere } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { Shape } from "../utils/types";
import * as THREE from "three"
interface FallingSphereProps {
  shape: Shape;
}

const FallingSphere: React.FC<FallingSphereProps> = ({ shape }) => {
  // Ensure the texture file is located in the /public directory
  const colorMap = useLoader(TextureLoader, '/earthmap1k.jpg');

  const [ref] = useSphere<THREE.Mesh>(() => ({
    mass: shape.mass,
    position: shape.position,
    args: [shape.size / 2], // The radius of the sphere
  }));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[shape.size / 2, 32, 32]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
};

export default FallingSphere;
