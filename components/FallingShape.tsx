// FallingShape.tsx
import React from "react";
import { Shape } from "../utils/types";
import FallingCube from "./FallingCube";
import FallingSphere from "./FallingSphere";
import FallingPyramid from "./FallingPyramid";
import FallingMars from "./FallingMars";

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
    case "mars" :
      return <FallingMars shape={shape} />
    default:
      return null;
  }
};

export default FallingShape;
