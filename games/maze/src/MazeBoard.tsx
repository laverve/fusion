import React, { useContext, useMemo } from "react";
import { DisplayObjectType, GameObjectDisplayObjectConfig, useDisplayObject, useDisplayObjects } from "@laverve/fusion";
import { MazeAssets } from "./types";
import { MazeContext } from "./Maze.context";
import { getCellAsset } from "./helpers/getCellAsset";

export type MazeBoardProps = {
    assets: MazeAssets;
};

export const MazeBoard: React.FC<MazeBoardProps> = ({ assets }: MazeBoardProps) => {
    const { grid, tileAspectRatio, padding, tileSize, exitPoint } = useContext(MazeContext);

    const background: GameObjectDisplayObjectConfig = useMemo(
        () => ({
            position: { x: 400, y: 300 },
            type: DisplayObjectType.SPRITE,
            anchor: { x: 0.5, y: 0.5 },
            asset: { alias: "background", src: assets.background || "" }
        }),
        []
    );

    const exitMarker: GameObjectDisplayObjectConfig = useMemo(
        () => ({
            anchor: { x: 0, y: 0 },
            position: { x: exitPoint.x * tileSize.width + padding.x, y: exitPoint.y * tileSize.height + padding.y },
            type: DisplayObjectType.SPRITE,
            scale: { x: tileAspectRatio, y: tileAspectRatio },
            asset: { alias: "exitPoint", src: assets.exitPoint || "" }
        }),
        []
    );

    const roadTiles = useMemo(
        () =>
            grid
                .map((row, rowIdx) =>
                    row
                        .map((cell, colIdx) =>
                            cell
                                ? {
                                      asset: {
                                          alias: `tile-${rowIdx}-${colIdx}`,
                                          src: getCellAsset(
                                              assets,
                                              cell,
                                              grid?.[rowIdx - 1]?.[colIdx],
                                              grid?.[rowIdx]?.[colIdx + 1],
                                              grid?.[rowIdx + 1]?.[colIdx],
                                              grid?.[rowIdx]?.[colIdx - 1]
                                          )
                                      },
                                      type: DisplayObjectType.SPRITE,
                                      anchor: { x: 0, y: 0 },
                                      scale: { x: tileAspectRatio, y: tileAspectRatio },
                                      position: {
                                          x: padding.x + colIdx * tileSize.width,
                                          y: padding.y + rowIdx * tileSize.height
                                      }
                                  }
                                : null
                        )
                        .filter((t) => t)
                )
                .flat() as GameObjectDisplayObjectConfig[],
        []
    );

    useDisplayObject(background);
    useDisplayObjects({ objects: roadTiles });
    useDisplayObject(exitMarker);
    return null;
};
