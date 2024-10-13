import React from "react";

import { GameContextProvider, GameContextProviderProps, World } from "@laverve/fusion";
import { MazeContextValue, MazeContextProvider, MazeContextProviderProps } from "./Maze.context";
import { MazeGameControls } from "./MazeGameControls";
import { MazeStats } from "./MazeStats";
import { MazeSidebar } from "./MazeSidebar";
import { Layout, LayoutProps } from "./Layout";
import { MazeScene, MazeSceneProps } from "./MazeScene";

export type MazeGameProps = {
    events?: MazeContextProviderProps["events"] & GameContextProviderProps["events"];
    timeout?: number;
    assets: MazeSceneProps["assets"];
    tileSize?: { width: number; height: number };
    minPadding?: number;
    width?: number;
    height?: number;
    sidebarConfig?: Pick<LayoutProps["sidebarConfig"], "placement" | "layoutVariant">;
} & Pick<MazeContextValue, "grid" | "exitPoint" | "resources" | "hero" | "predators">;

export const MazeGame: React.FC<MazeGameProps> = ({
    events,
    assets,
    grid,
    exitPoint,
    hero,
    resources,
    predators,
    timeout = 0,
    minPadding = 10,
    width: boardWidth = 300,
    height: boardHeight = 300,
    tileSize = { width: 10, height: 10 },
    sidebarConfig = {}
}) => {
    return (
        <GameContextProvider
            timeout={timeout || 0}
            events={{
                onReset: events?.onReset,
                onStart: events?.onStart,
                onStop: events?.onStop,
                onTimedOut: events?.onTimedOut
            }}
        >
            <MazeContextProvider
                exitPoint={exitPoint}
                grid={grid}
                hero={hero}
                events={events}
                resources={resources}
                predators={predators}
                tileSize={tileSize}
                minPadding={minPadding}
                boardSize={{ width: boardWidth, height: boardHeight }}
            >
                <Layout
                    boardConfig={{
                        children: (
                            <>
                                <World eventMode="dynamic">
                                    <MazeScene assets={assets} />
                                </World>
                                <MazeGameControls statsSlot={<MazeStats />} />
                            </>
                        ),
                        width: boardWidth,
                        height: boardHeight
                    }}
                    sidebarConfig={{
                        ...sidebarConfig,
                        children: <MazeSidebar />
                    }}
                    containerConfig={{}}
                />
            </MazeContextProvider>
        </GameContextProvider>
    );
};
