import { usePlane } from "@react-three/cannon";
import * as THREE from "three"
const Ground: React.FC = () => {
  const [ref] = usePlane<THREE.Mesh>(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow name="ground">
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#708090" />
    </mesh>
  );
};

export default Ground;
