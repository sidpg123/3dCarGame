// FallingCube.tsx
import React from "react";
import { useBox } from "@react-three/cannon";
import { Shape } from "../utils/types";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

interface FallingCubeProps {
  shape: Shape;
}

const FallingCube: React.FC<FallingCubeProps> = ({ shape }) => {
  const [ref] = useBox(() => ({
    mass: shape.mass,
    position: shape.position,
    args: [shape.size + 1, shape.size + 1, shape.size + 1],
  }));
  const colorMap = useLoader(TextureLoader, '/pyramid.jpg');

  return (
    <mesh ref={ref}>
      <coneGeometry args={[shape.size, shape.size, shape.size]} />
      <meshStandardMaterial map={colorMap}/>
    </mesh>
  );
};

export default FallingCube;
