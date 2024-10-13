import React, { useMemo } from "react";

import { MazeGameProps, MazeGame, MazeGrid, MazePredator, MazeResource } from "@laverve/games-maze";
import { Card, CardBody, NextUIProvider } from "@nextui-org/react";

import backgroundAsset from "../../static/assets/background.jpg";

import roadTileAssetVertical from "../../static/assets/tile-v.png";
import roadTileAssetHorizontal from "../../static/assets/tile-h.png";

import roadTileAssetTopLeftCorner from "../../static/assets/tile-c-t-l.png";
import roadTileAssetTopRightCorner from "../../static/assets/tile-c-t-r.png";
import roadTileAssetBottomRightCorner from "../../static/assets/tile-c-b-r.png";
import roadTileAssetBottomLeftCorner from "../../static/assets/tile-c-b-l.png";

import roadTileAssetTIntersectionR from "../../static/assets/tile-t-r.png";
import roadTileAssetTIntersectionL from "../../static/assets/tile-t-l.png";
import roadTileAssetTIntersectionT from "../../static/assets/tile-t-t.png";
import roadTileAssetTIntersectionB from "../../static/assets/tile-t-b.png";
import roadTileAsset4Intersection from "../../static/assets/tile-4-i.png";

import roadTileAssetEndBottom from "../../static/assets/tile-e-b.png";
import roadTileAssetEndTop from "../../static/assets/tile-e-t.png";
import roadTileAssetEndRight from "../../static/assets/tile-e-r.png";
import roadTileAssetEndLeft from "../../static/assets/tile-e-l.png";

import exitAsset from "../../static/assets/tile-exit.png";

import gasAsset from "../../static/assets/gas.png";
import heroAsset from "../../static/assets/hero.png";
import policeOfficerAsset from "../../static/assets/police-offices.png";

import "../../css/app.css";

export default {
    title: "Games/Maze/Gameplay",
    argTypes: {}
};

const ASSETS = {
    crossIntersection: roadTileAsset4Intersection,
    tIntersectionRight: roadTileAssetTIntersectionR,
    tIntersectionLeft: roadTileAssetTIntersectionL,
    tIntersectionTop: roadTileAssetTIntersectionT,
    tIntersectionBottom: roadTileAssetTIntersectionB,
    horizontal: roadTileAssetHorizontal,
    vertical: roadTileAssetVertical,
    topRightCorner: roadTileAssetTopRightCorner,
    bottomRightCorner: roadTileAssetBottomRightCorner,
    topLeftCorner: roadTileAssetTopLeftCorner,
    bottomLeftCorner: roadTileAssetBottomLeftCorner,
    closureRight: roadTileAssetEndRight,
    closureLeft: roadTileAssetEndLeft,
    closureTop: roadTileAssetEndTop,
    closureBottom: roadTileAssetEndBottom,
    exitPoint: exitAsset,
    background: backgroundAsset,
    hero: heroAsset,
    resource: gasAsset,
    predator: policeOfficerAsset
};

const MIN_PADDING = 10;

export const MazeStory = ({ timeout }: MazeGameProps): JSX.Element => {
    const grid: MazeGrid = useMemo(
        () => [
            [1, 1, 1, 1, 0, 0, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 0, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        []
    );

    const exitPoint = useMemo(() => ({ x: 8, y: 6 }), []);

    const boardSize = useMemo(() => ({ width: 800, height: 600 }), []);
    const resources = useMemo<MazeResource[]>(
        () => [
            {
                location: { x: 8, y: 0 },
                asset: gasAsset
            },
            {
                location: { x: 3, y: 4 },
                asset: gasAsset
            },
            {
                location: { x: 3, y: 2 },
                asset: gasAsset
            }
        ],
        []
    );

    const predators = useMemo<MazePredator[]>(
        () => [
            {
                location: { x: 7, y: 0 },
                trajectory: ["left", "down", "down", "down", "down", "right", "right", "up", "up", "up", "down", "left"]
            },
            {
                location: { x: 0, y: 2 },
                trajectory: ["right", "right", "right", "left", "left", "left"]
            }
        ],
        []
    );

    const tileSize = useMemo(
        () => ({
            width: 172,
            height: 172
        }),
        []
    );

    return (
        <NextUIProvider>
            <Card>
                <CardBody>
                    <MazeGame
                        resources={resources}
                        predators={predators}
                        exitPoint={exitPoint}
                        hero={{ location: { x: 1, y: 0 } }}
                        grid={grid}
                        timeout={timeout}
                        sidebarConfig={{ layoutVariant: "vertical" }}
                        tileSize={tileSize}
                        assets={ASSETS}
                        minPadding={MIN_PADDING}
                        width={boardSize.width}
                        height={boardSize.height}
                    />
                </CardBody>
            </Card>
        </NextUIProvider>
    );
};

MazeStory.storyName = "Gameplay";
