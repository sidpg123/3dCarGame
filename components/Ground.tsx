import { usePlane } from "@react-three/cannon";

const Ground: React.FC = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow name="ground">
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#708090" />
    </mesh>
  );
};

export default Ground;
