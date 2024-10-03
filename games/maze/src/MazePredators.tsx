import React, { useContext, useMemo } from "react";
import { DisplayObjectType, GameObjectDisplayObjectConfig, useDisplayObjects } from "@laverve/fusion";
import { MazeContext } from "./Maze.context";

export const MazePredators: React.FC = () => {
    const { padding, tileSize, predators } = useContext(MazeContext);

    const gameObjects = useMemo<GameObjectDisplayObjectConfig[]>(
        () =>
            predators.map(
                (resource) =>
                    ({
                        asset: { src: resource.asset, alias: "predator" },
                        type: DisplayObjectType.SPRITE,
                        anchor: { x: 0.5, y: 0.5 },
                        position: {
                            x: padding.x + resource.location.x * tileSize.width + tileSize.width / 2,
                            y: padding.y + resource.location.y * tileSize.height + tileSize.height / 2
                        }
                    }) as GameObjectDisplayObjectConfig
            ),
        [predators]
    );

    useDisplayObjects({ objects: gameObjects });
    return null;
};
