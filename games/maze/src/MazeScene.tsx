import React, { useContext, useEffect, useMemo } from "react";

import { v4 as uuidv4 } from "uuid";

import { Layer, useAssetManager } from "@laverve/fusion";
import { MazeBoard } from "./MazeBoard";
import { MazeHero } from "./MazeHero";
import { MazeResource } from "./MazeResource";
import { MazePredator } from "./MazePredator";
import { MazeRoadTile } from "./MazeRoadTile";
import { MazeAssets } from "./types";
import {
    BACKGROUND_TEXTURE_ALIAS,
    ROAD_BOTTOM_LEFT_CORNER_TEXTURE_ALIAS,
    ROAD_BOTTOM_RIGHT_CORNER_TEXTURE_ALIAS,
    ROAD_CLOSURE_BOTTOM_TEXTURE_ALIAS,
    ROAD_CLOSURE_LEFT_TEXTURE_ALIAS,
    ROAD_CLOSURE_RIGHT_TEXTURE_ALIAS,
    ROAD_CLOSURE_TOP_TEXTURE_ALIAS,
    CROSS_INTERSECTION_TEXTURE_ALIAS,
    EXIT_POINT_TEXTURE_TEXTURE_ALIAS,
    HERO_TEXTURE_ALIAS,
    HORIZONTAL_ROAD_TEXTURE_ALIAS,
    PREDATOR_TEXTURE_ALIAS,
    RESOURCE_TEXTURE_ALIAS,
    T_INTERSECTION_BOTTOM_TEXTURE_ALIAS,
    T_INTERSECTION_LEFT_TEXTURE_ALIAS,
    T_INTERSECTION_RIGHT_TEXTURE_ALIAS,
    T_INTERSECTION_TOP_TEXTURE_ALIAS,
    ROAD_TOP_LEFT_CORNER_TEXTURE_ALIAS,
    ROAD_TOP_RIGHT_CORNER_TEXTURE_ALIAS,
    VERTICAL_ROAD_TEXTURE_ALIAS
} from "./helpers";
import { MazeContext } from "./Maze.context";
import { getCellAsset } from "./helpers/getCellAsset";
import { MazeExitMarker } from "./MazeExitMarker";

export type MazeSceneProps = {
    assets: MazeAssets;
};

export const MazeScene: React.FC<MazeSceneProps> = ({ assets }) => {
    const { load, unload } = useAssetManager();

    const { padding, tileSize, predators, resources, grid } = useContext(MazeContext);

    useEffect(() => {
        load("maze-scene", [
            {
                src: assets.background,
                alias: BACKGROUND_TEXTURE_ALIAS
            },
            {
                src: assets.bottomLeftCorner,
                alias: ROAD_BOTTOM_LEFT_CORNER_TEXTURE_ALIAS
            },
            {
                src: assets.bottomRightCorner,
                alias: ROAD_BOTTOM_RIGHT_CORNER_TEXTURE_ALIAS
            },
            {
                src: assets.closureBottom,
                alias: ROAD_CLOSURE_BOTTOM_TEXTURE_ALIAS
            },
            {
                src: assets.closureLeft,
                alias: ROAD_CLOSURE_LEFT_TEXTURE_ALIAS
            },
            {
                src: assets.closureRight,
                alias: ROAD_CLOSURE_RIGHT_TEXTURE_ALIAS
            },
            {
                src: assets.closureTop,
                alias: ROAD_CLOSURE_TOP_TEXTURE_ALIAS
            },
            {
                src: assets.crossIntersection,
                alias: CROSS_INTERSECTION_TEXTURE_ALIAS
            },
            {
                src: assets.exitPoint,
                alias: EXIT_POINT_TEXTURE_TEXTURE_ALIAS
            },
            {
                src: assets.horizontal,
                alias: HORIZONTAL_ROAD_TEXTURE_ALIAS
            },
            {
                src: assets.tIntersectionBottom,
                alias: T_INTERSECTION_BOTTOM_TEXTURE_ALIAS
            },
            {
                src: assets.tIntersectionLeft,
                alias: T_INTERSECTION_LEFT_TEXTURE_ALIAS
            },
            {
                src: assets.tIntersectionRight,
                alias: T_INTERSECTION_RIGHT_TEXTURE_ALIAS
            },
            {
                src: assets.tIntersectionTop,
                alias: T_INTERSECTION_TOP_TEXTURE_ALIAS
            },
            {
                src: assets.topLeftCorner,
                alias: ROAD_TOP_LEFT_CORNER_TEXTURE_ALIAS
            },
            {
                src: assets.topRightCorner,
                alias: ROAD_TOP_RIGHT_CORNER_TEXTURE_ALIAS
            },
            {
                src: assets.vertical,
                alias: VERTICAL_ROAD_TEXTURE_ALIAS
            },
            {
                src: assets.hero,
                alias: HERO_TEXTURE_ALIAS
            },
            {
                src: assets.predator,
                alias: PREDATOR_TEXTURE_ALIAS
            },
            {
                src: assets.resource,
                alias: RESOURCE_TEXTURE_ALIAS
            }
        ]);

        return () => {
            unload("maze-scene");
        };
    }, [assets]);

    const predatorsConfig = useMemo(
        () =>
            predators.map((resource) => ({
                uid: uuidv4(),
                position: {
                    x: padding.x + resource.location.x * tileSize.width + tileSize.width / 2,
                    y: padding.y + resource.location.y * tileSize.height + tileSize.height / 2
                }
            })),
        [predators]
    );

    const resourcesConfig = useMemo(
        () =>
            resources.map((resource) => ({
                uid: uuidv4(),
                position: {
                    x: padding.x + resource.location.x * tileSize.width + tileSize.width / 2,
                    y: padding.y + resource.location.y * tileSize.height + tileSize.height / 2
                },
                alpha: resource.isFound ? 0 : 1
            })),
        [resources]
    );

    const roadTiles = useMemo(
        () =>
            grid
                .map((row, rowIdx) =>
                    row
                        .map((cell, colIdx) =>
                            cell
                                ? {
                                      uid: uuidv4(),
                                      texture: getCellAsset(
                                          cell,
                                          grid?.[rowIdx - 1]?.[colIdx],
                                          grid?.[rowIdx]?.[colIdx + 1],
                                          grid?.[rowIdx + 1]?.[colIdx],
                                          grid?.[rowIdx]?.[colIdx - 1]
                                      ),
                                      position: {
                                          x: padding.x + colIdx * tileSize.width,
                                          y: padding.y + rowIdx * tileSize.height
                                      }
                                  }
                                : null
                        )
                        .filter((t) => t)
                )
                .flat() as Array<{ uid: string; texture: string; position: { x: number; y: number } }>,
        []
    );

    return (
        <Layer>
            <Layer>
                <MazeBoard />
                {roadTiles.map(({ uid, position, texture }) => (
                    <MazeRoadTile key={uid} position={position} texture={texture} />
                ))}
                <MazeExitMarker />
            </Layer>
            <Layer>
                {resourcesConfig.map(({ uid, position, alpha }) => (
                    <MazeResource key={uid} position={position} alpha={alpha} />
                ))}
                {predatorsConfig.map(({ uid, position }) => (
                    <MazePredator key={uid} position={position} />
                ))}
                <MazeHero />
            </Layer>
        </Layer>
    );
};
