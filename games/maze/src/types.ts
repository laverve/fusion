export const I18N_NAMESPACE = "@laverve/games-maze";

export type MazeAssetType =
    | "crossIntersection"
    | "hero"
    | "tIntersectionRight"
    | "tIntersectionLeft"
    | "tIntersectionTop"
    | "tIntersectionBottom"
    | "horizontal"
    | "vertical"
    | "topRightCorner"
    | "bottomRightCorner"
    | "topLeftCorner"
    | "bottomLeftCorner"
    | "closureRight"
    | "closureLeft"
    | "closureTop"
    | "closureBottom"
    | "exitPoint"
    | "resource"
    | "predator"
    | "background";

export type MazeAssets = Record<MazeAssetType, string>;

export type MazeMoveDirection = "up" | "down" | "right" | "left";
export type MazePoint = { x: number; y: number };
export type MazeObject = {
    location: MazePoint;
};

export type MazeGridCell = 0 | 1;
export type MazeGrid = MazeGridCell[][];

export type MazeHero = MazeObject;
export type MazeResource = MazeObject & { isFound?: boolean };
export type MazePredator = MazeObject & {
    trajectory: MazeMoveDirection[];
};
