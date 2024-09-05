import React from "react";
import { useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { Shape } from "../utils/types";

interface FallingCubeProps {
  shape: Shape;
}

const FallingCube: React.FC<FallingCubeProps> = ({ shape }) => {
  const rockyMap = useLoader(TextureLoader, '/wall_texture.jpg');

  const [ref] = useBox(() => ({
    mass: shape.mass,
    position: shape.position,
    args: [shape.size, shape.size, shape.size], // Cube dimensions
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry args={[shape.size, shape.size, shape.size]} />
      <meshStandardMaterial map={rockyMap} />
    </mesh>
  );
};

export default FallingCube;
