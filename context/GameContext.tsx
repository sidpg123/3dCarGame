// GameContext.tsx
import React, { createContext, useContext } from "react";

interface GameContextProps {
  gameOver: boolean;
  setGameOver: (value: boolean) => void;
  score: number;
  setScore: (value: number) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameContext.Provider");
  }
  return context;
};

export default GameContext;
