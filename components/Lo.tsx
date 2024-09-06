import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { useLoader } from "@react-three/fiber";

const Earth = () => {
  const texture = useLoader(TextureLoader, "/earthmap1k.jpg");
  const earthRef = useRef<THREE.Mesh>(null);

  // Rotate Earth
  useEffect(() => {
    gsap.to(earthRef.current!.rotation, {
      y: Math.PI * 2,
      duration: 60,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <mesh ref={earthRef} scale={1.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const LandingPage = () => {
  const howToPlayRef = useRef(null);

  useEffect(() => {
    // GSAP animations for landing text and button
    gsap.from(".title", { opacity: 0, y: 50, duration: 1, ease: "power2.out" });
    gsap.from(".tagline", { opacity: 0, y: 50, delay: 0.5, duration: 1 });
    gsap.from(".start-button", { opacity: 0, scale: 0, delay: 1, duration: 1 });

    // "How to Play" animation on scroll
    gsap.from(howToPlayRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: { trigger: howToPlayRef.current, start: "top 80%" },
    });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Starry Background */}
      <Canvas className="absolute top-0 left-0 w-full h-full z-0">
        <OrbitControls enableZoom={false} enablePan={false} />
        <Stars radius={100} depth={50} count={10000} factor={4} />
        <ambientLight intensity={0.5} />
        <Earth />
      </Canvas>

      {/* Landing Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="title text-5xl md:text-6xl font-bold">Cosmic Chase</h1>
        <p className="tagline mt-2 text-xl md:text-2xl">"Race through the cosmos, but avoid the falling stars!"</p>
        <button className="start-button mt-8 px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-full text-white text-lg">
          Start Game
        </button>
      </div>

      {/* How to Play Section */}
      <section ref={howToPlayRef} className="relative z-10 how-to-play py-16 bg-gray-900 text-center">
        <h2 className="text-3xl font-semibold">How to Play</h2>
        <div className="mt-6 mx-auto w-10/12 md:w-8/12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="step flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">1</span>
            </div>
            <p className="text-lg">Use the mouse or arrow keys to control your vehicle's direction.</p>
          </div>
          <div className="step flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">2</span>
            </div>
            <p className="text-lg">Avoid falling obstacles while racing through space.</p>
          </div>
          <div className="step flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">3</span>
            </div>
            <p className="text-lg">Collect stars to increase your score.</p>
          </div>
          <div className="step flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">4</span>
            </div>
            <p className="text-lg">Reach the finish line before time runs out!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
