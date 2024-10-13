import React, { useMemo } from "react";
import { DisplayObjectType, GameObjectDisplayObjectConfig, useDisplayObject } from "@laverve/fusion";
import { MazeAssets } from "./types";

export type MazeBoardProps = {
    assets: MazeAssets;
};

export const MazeBoard: React.FC<MazeBoardProps> = ({ assets }: MazeBoardProps) => {
    const background: GameObjectDisplayObjectConfig = useMemo(
        () => ({
            position: { x: 400, y: 300 },
            type: DisplayObjectType.SPRITE,
            anchor: { x: 0.5, y: 0.5 },
            asset: { alias: "background", src: assets.background || "" }
        }),
        []
    );

    useDisplayObject(background);
    return null;
};
