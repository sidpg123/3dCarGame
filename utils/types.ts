// types.ts
export type ShapeType = "cube" | "sphere" | "pyramid" | "mars" | "jupiter" | "venus" | "moon" | ;

export interface Shape {
  id: string;
  type: ShapeType;
  position: [number, number, number];
  size: number;
  mass: number;
}
