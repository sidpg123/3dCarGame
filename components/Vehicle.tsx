import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three"



const Vehicle: React.FC<{
  position: [number, number, number];
  onGameOver: () => void;
  setVehiclePosition: (pos: [number, number, number]) => void;
}> = ({ position, onGameOver, setVehiclePosition }) => {
  const [ref, api] = useBox<THREE.Group>(() => ({
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

export default Vehicle;