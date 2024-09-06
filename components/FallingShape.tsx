// FallingShape.tsx
import React from "react";
import { Shape } from "../utils/types";
import FallingCube from "./FallingCube";
import FallingSphere from "./FallingSphere";
import FallingPyramid from "./FallingPyramid";
import FallingMars from "./FallingMars";
import FallingJupiter from "./FallingJupiter";
import FallingMoon from "./FallingMoon";
import FallingPluto from "./FallingPluto";

interface FallingShapeProps {
  shape: Shape;
}

const FallingShape: React.FC<FallingShapeProps> = ({ shape }) => {
  switch (shape.type) {
    case "cube":
      return <FallingCube shape={shape} />;
    case "sphere":
      return <FallingSphere shape={shape} />;
    case "pyramid":
      return <FallingPyramid shape={shape} />;
    case "mars":
      return <FallingMars shape={shape} />;
    case "jupiter":
      return <FallingJupiter shape={shape} />;
    case "moon":
      return <FallingMoon shape={shape} />;
    case "pluto":
      return <FallingPluto shape={shape} />;
    default:
      return null;
  }
};

export default FallingShape;
