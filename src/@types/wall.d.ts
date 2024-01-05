export interface WallParams {
  dom: Element | null;
  wallSize?: number;
  colors: Colors;
}

export type Colors = {
  floor: number;
  left: number;
  right: number;
};

export type Point = {
  x: number;
  y: number;
  z: number;
};
