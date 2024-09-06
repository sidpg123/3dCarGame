"use client"
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(TextureLoader, '/earthmap1k.jpg');

  // Automatically rotate the Earth
  useFrame(() => {
    earthRef.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={earthRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const LandingPage: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null!);
  const taglineRef = useRef<HTMLParagraphElement>(null!);
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const instructionsRef = useRef<HTMLDivElement>(null!);

  // GSAP animation
  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }
    );
    gsap.fromTo(
      taglineRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, delay: 0.5, duration: 1.5, ease: 'power3.out' }
    );
    gsap.fromTo(
      buttonRef.current,
      { scale: 0 },
      { scale: 1, delay: 1, duration: 1, ease: 'bounce.out' }
    );
    gsap.fromTo(
      instructionsRef.current,
      { opacity: 0 },
      { opacity: 1, delay: 1.5, duration: 1 }
    );
  }, []);

  const startGame = () => {
    // Redirect to the game scene or load the game
    window.location.href = "/game";  // Assuming '/game' is the game route
  };

  return (
    <div className="relative h-screen bg-black flex justify-center items-center">
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Earth />
      </Canvas>

      <div className="relative z-10 text-white text-center">
        <h1 ref={titleRef} className="text-5xl font-bold mb-4">Galactic Explorer</h1>
        <p ref={taglineRef} className="text-xl mb-6">Conquer the cosmos, dodge the dangers!</p>
        <button
          ref={buttonRef}
          onClick={startGame}
          className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform transform hover:scale-110 mb-8"
        >
          Start Game
        </button>

        <div ref={instructionsRef} className="text-lg">
          <h2 className="text-2xl font-semibold mb-2">How to Play:</h2>
          <p className="mb-2">Objective: Navigate your vehicle through the falling celestial objects, avoid collisions, and survive as long as possible!</p>
          <ul className="list-disc list-inside">
            <li><strong>Move Forward:</strong> Press <kbd>W</kbd></li>
            <li><strong>Move Backward:</strong> Press <kbd>S</kbd></li>
            <li><strong>Mouse Control:</strong> Move your cursor to steer your vehicle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
