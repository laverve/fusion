import React, { useContext } from "react";
import { MazeContext } from "./Maze.context";
import { useSprite } from "pixi-fusion";

export type MazeRoadTileProps = {
    texture: string;
    position: { x: number; y: number };
};

export const MazeRoadTile: React.FC<MazeRoadTileProps> = ({ texture, position }: MazeRoadTileProps) => {
    const { tileAspectRatio } = useContext(MazeContext);

    useSprite({
        texture,
        position,
        anchor: { x: 0, y: 0 },
        scale: { x: tileAspectRatio, y: tileAspectRatio }
    });

    return null;
};
