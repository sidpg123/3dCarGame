import React from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
const PanoramicSky = () => {
  const { scene } = useThree();
  const texture = useLoader(TextureLoader, "/sky.jpg    ");

  texture.mapping = THREE.EquirectangularReflectionMapping; // Set the texture mapping

  scene.background = texture; // Set the texture as the scene background

  return null; // No mesh is returned, the background is applied directly to the scene
};

const Scene = () => {
  return <PanoramicSky />;
};

export default PanoramicSky;
