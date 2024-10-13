import React from "react";
import { PREDATOR_TEXTURE_ALIAS } from "./helpers";
import { useSprite } from "pixi-fusion";

type MazePredatorProps = {
    position: { x: number; y: number };
};

export const MazePredator: React.FC<MazePredatorProps> = ({ position }) => {
    useSprite({ texture: PREDATOR_TEXTURE_ALIAS, anchor: { x: 0.5, y: 0.5 }, position });
    return null;
};
