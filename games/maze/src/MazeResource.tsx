import React from "react";
import { useSprite } from "pixi-fusion";
import { RESOURCE_TEXTURE_ALIAS } from "./helpers";

type MazeResourceProps = {
    position: { x: number; y: number };
    alpha: number;
};

export const MazeResource: React.FC<MazeResourceProps> = ({ position, alpha }) => {
    useSprite({
        texture: RESOURCE_TEXTURE_ALIAS,
        anchor: { x: 0.5, y: 0.5 },
        position,
        alpha
    });
    return null;
};
