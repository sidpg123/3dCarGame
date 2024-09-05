"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Vehicle Component
const Vehicle: React.FC<{
  position: [number, number, number];
  onGameOver: () => void;
  setVehiclePosition: (pos: [number, number, number]) => void;
}> = ({ position, onGameOver, setVehiclePosition }) => {
  const [ref, api] = useBox(() => ({
    mass: 500,
    position,
    onCollide: (e) => handleCollision(e),
  }));

  useEffect(() => {
    // Subscribe to the vehicle's position updates directly from the physics API
    const unsubscribe = api.position.subscribe((newPosition) => {
      setVehiclePosition([newPosition[0], newPosition[1], newPosition[2]]);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [api.position, setVehiclePosition]);

  const wheel1 = useRef<THREE.Mesh>(null!);
  const wheel2 = useRef<THREE.Mesh>(null!);
  const wheel3 = useRef<THREE.Mesh>(null!);

  const direction = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());

  useFrame(({ mouse, camera, scene }) => {
    // Set the raycaster from the camera through the mouse position
    raycaster.current.setFromCamera(mouse, camera);

    // Find the point on the ground where the ray intersects
    const intersects = raycaster.current.intersectObject(
      scene.children.find((obj) => obj.name === "ground") as THREE.Object3D
    );

    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Calculate direction from the front wheel to the intersection point
      direction.current.subVectors(point, wheel1.current.position).normalize();

      const angle = Math.atan2(direction.current.x, direction.current.z);
      api.rotation.set(0, angle, 0);
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          api.velocity.set(
            direction.current.x * 10,
            0,
            direction.current.z * 10
          );
          break;
        case "s":
          api.velocity.set(
            -direction.current.x * 10,
            0,
            -direction.current.z * 10
          );
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
        case "s":
          api.velocity.set(0, 0, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [api]);

  const handleCollision = (e: any) => {
    if (e.body.name !== "ground") {
      console.log("Collided with:", e.body.name);
      onGameOver();
    }
  };

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1, 1, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh ref={wheel1} position={[0, -0.25, 1]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh ref={wheel2} position={[0.51, -0.5, -1]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh ref={wheel3} position={[-0.5, -0.5, -1]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};

// FallingShape Component
const FallingShape: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const [ref] = useBox(() => ({
    mass: Math.random() * 10 + 1,
    position,
    args: [Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5],
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        })`}
      />
    </mesh>
  );
};

// Ground Component
const Ground: React.FC = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow name="ground">
      <planeGeometry args={[100, 500]} />
      <meshStandardMaterial color="#708090" />
    </mesh>
  );
};

// Game Component

const GameScene: React.FC = () => {
  const [shapes, setShapes] = useState<
    { id: number; position: [number, number, number] }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [vehiclePosition, setVehiclePosition] = useState<
    [number, number, number]
  >([0, 3, 0]); // Track vehicle position

  const handleGameOver = () => {
    setGameOver(true);
  };
  const lastUpdateTime = useRef(Date.now());

  const spawnShape = useCallback(() => {
    const spawnRadius = 15; // Adjust this value to change the spawn area
    const angle = Math.random() * Math.PI * 2; // Random angle around the vehicle
    const distance = Math.random() * spawnRadius; // Random distance within the spawn radius

    const randomX = vehiclePosition[0] + Math.cos(angle) * distance;
    const randomZ = vehiclePosition[2] + Math.sin(angle) * distance;

    const spawnHeight = 20; // Ensure the shape spawns above the vehicle
    if (!gameOver) {
      setShapes((prev) => [
        ...prev,
        { id: Date.now(), position: [randomX, spawnHeight, randomZ] },
      ]);
      setScore((prev) => prev + 1);
    }
  }, [vehiclePosition]);

  const cleanupShapes = useCallback(() => {
    const maxDistance = 50; // Maximum distance before removing a shape
    setShapes((prev) =>
      prev.filter((shape) => {
        const dx = shape.position[0] - vehiclePosition[0];
        const dz = shape.position[2] - vehiclePosition[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        return distance <= maxDistance;
      })
    );
  }, [vehiclePosition]);

  useFrame(() => {
    const now = Date.now();
    if (now - lastUpdateTime.current > 2000) {
      spawnShape();
      cleanupShapes();
      lastUpdateTime.current = now;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <Physics>
        <Vehicle
          position={[0, 3, 0]}
          onGameOver={handleGameOver}
          setVehiclePosition={setVehiclePosition}
        />
        <Ground />
        {!gameOver &&
          shapes.map((shape) => (
            <FallingShape key={shape.id} position={shape.position} />
          ))}
      </Physics>
      {/* Render game-over message inside Canvas using Html */}
      {gameOver && (
        <Html center>
          <div className="game-over-screen ">
            <div className="bg-white p-8 rounded  ">
              <h2 className="text-2xl font-bold mb-4 text-red-600">
                Game Over
              </h2>
              <p className="text-xl text-gray-800">Your score: {score}</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

const Game = () => {
  return (
    <div className="h-screen w-full relative">
      <Canvas shadows>
        <GameScene />
      </Canvas>
      {/* Render the score outside the Canvas */}
      <div className="absolute top-4 left-4 text-white text-2xl">
        {/* Score: {score} */}
      </div>
    </div>
  );
};

export default Game;
