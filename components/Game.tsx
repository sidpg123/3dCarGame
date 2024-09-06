"use client";

import React, { useRef, useState, useEffect, useCallback, createContext,  useContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import GameScene from "./GameScene";
import GameContext from "@/context/GameContext";
import PanoramicSky from "./Sky";



const Game: React.FC = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <GameContext.Provider value={{ gameOver, setGameOver, score, setScore }}>
      <div className="h-screen w-full relative">
        <Canvas shadows>
          <PanoramicSky />
          <GameScene />
        </Canvas>

        {/* Game Over screen */}
        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Game Over</h2>
              <p className="text-xl text-gray-800">Your score: {score}</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Display score */}
        <div className="absolute top-4 left-4 text-white text-2xl">
          Score: {score}
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default Game;
