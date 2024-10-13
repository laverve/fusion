import React from "react";
import { useSprite } from "@laverve/fusion";
import { BACKGROUND_TEXTURE_ALIAS } from "./helpers";

export const MazeBoard: React.FC = () => {
    useSprite({
        position: { x: 400, y: 300 },
        anchor: { x: 0.5, y: 0.5 },
        texture: BACKGROUND_TEXTURE_ALIAS
    });
    return null;
};
