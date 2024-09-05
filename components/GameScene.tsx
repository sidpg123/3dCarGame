// GameScene.tsx
import React, { useState, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { v4 as uuidv4 } from "uuid";
import { useFrame } from "@react-three/fiber";
import GameContext, { useGameContext } from "../context/GameContext";
import Vehicle from "./Vehicle";
import Ground from "./Ground";
import FallingShape from "./FallingShape";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Shape, ShapeType } from "@/utils/types";
import * as THREE from "three";

const GameScene: React.FC = () => {
  const { setScore, setGameOver, gameOver } = useGameContext();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [vehiclePosition, setVehiclePosition] = useState<
    [number, number, number]
  >([0, 3, 0]);

  const lastUpdateTime = useRef(Date.now());
  const handleGameOver = () => {
    setGameOver(true);
  };
  const spawnShape = useCallback(() => {
    const shapeTypes: ShapeType[] = ["cube", "sphere", "pyramid", "mars", "jupiter"];
    const randomType =
      shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const randomSize =  Math.floor(Math.random() * 5);; // Size between 0.5 and 1.5
    const randomMass = Math.random() * 10 + 1; // Mass between 1 and 10

    const spawnRadius = 15;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * spawnRadius;

    const randomX = vehiclePosition[0] + Math.cos(angle) * distance;
    const randomZ = vehiclePosition[2] + Math.sin(angle) * distance;
    const spawnHeight = 20;

    const newShape: Shape = {
      id: uuidv4(),
      type: randomType,
      position: [randomX, spawnHeight, randomZ],
      size: randomSize,
      mass: randomMass,
    };
    
    if(!gameOver) {
      setShapes((prev) => [...prev, newShape]);
      setScore((prev) => prev + 1);
    }

  }, [vehiclePosition, setScore]);

  const cleanupShapes = useCallback(() => {
    const maxDistance = 50;
    setShapes((prev) =>
      prev.filter((shape) => {
        const dx = shape.position[0] - vehiclePosition[0];
        const dz = shape.position[2] - vehiclePosition[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        return distance <= maxDistance;
      })
    );
  }, [vehiclePosition]);

  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  useFrame(() => {
    const now = Date.now();
    if (now - lastUpdateTime.current > 2000) {
      spawnShape();
      //cleanupShapes();
      lastUpdateTime.current = now;
    }

    // Adjust camera position to follow the vehicle
    if (cameraRef.current) {
      const [x, y, z] = vehiclePosition;
      // cameraRef.current.position.lerp(new THREE.Vector3(x, y + 10, z + 30), 0.1); // Smooth follow and zoom out
      cameraRef.current.lookAt(x, y, z); // Make the camera look at the vehicle
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 15, 30]} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <Physics>
        <Vehicle
          position={[0, 3, 0]}
          setVehiclePosition={setVehiclePosition}
          onGameOver={() => setGameOver(true)}
        />
        <Ground />
        {shapes.map((shape) => (
          <FallingShape key={shape.id} shape={shape} />
        ))}
      </Physics>
    </>
  );
};

export default GameScene;
