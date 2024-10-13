import React, { useContext } from "react";
import { useSprite } from "@laverve/fusion";
import { MazeContext } from "./Maze.context";
import { EXIT_POINT_TEXTURE_TEXTURE_ALIAS } from "./helpers";

export const MazeExitMarker: React.FC = () => {
    const { tileAspectRatio, padding, tileSize, exitPoint } = useContext(MazeContext);

    useSprite({
        anchor: { x: 0, y: 0 },
        position: { x: exitPoint.x * tileSize.width + padding.x, y: exitPoint.y * tileSize.height + padding.y },
        scale: { x: tileAspectRatio, y: tileAspectRatio },
        texture: EXIT_POINT_TEXTURE_TEXTURE_ALIAS
    });

    return null;
};
