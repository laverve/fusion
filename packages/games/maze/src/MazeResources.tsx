import React, { useContext, useMemo } from "react";
import {
    DisplayObjectType,
    GameObjectDisplayObjectConfig,
    useDisplayObjectsFromConfig
} from "@laverve/pixi-matter-fusion";
import { MazeContext } from "./Maze.context";

export const MazeResources: React.FC = () => {
    const { padding, tileSize, resources } = useContext(MazeContext);

    const gameObjects = useMemo<GameObjectDisplayObjectConfig[]>(
        () =>
            resources.map(
                (resource) =>
                    ({
                        url: resource.asset,
                        type: DisplayObjectType.SPRITE,
                        anchor: { x: 0.5, y: 0.5 },
                        position: {
                            x: padding.x + resource.location.x * tileSize.width + tileSize.width / 2,
                            y: padding.y + resource.location.y * tileSize.height + tileSize.height / 2
                        },
                        alpha: resource.isFound ? 0 : 1
                    }) as GameObjectDisplayObjectConfig
            ),
        [resources]
    );

    useDisplayObjectsFromConfig({ objects: gameObjects });
    return null;
};
