import React, { useMemo } from "react";

import { GameContextProvider, GameContextProviderProps, StageContextProvider, StageConfig } from "@laverve/fusion";
import { MazeContextValue, MazeContextProvider, MazeContextProviderProps } from "./Maze.context";
import { MazeBoard, MazeBoardProps } from "./MazeBoard";
import { MazeHero } from "./MazeHero";
import { MazeResources } from "./MazeResources";
import { MazePredators } from "./MazePredators";
import { MazeGameControls } from "./MazeGameControls";
import { MazeStats } from "./MazeStats";
import { MazeSidebar } from "./MazeSidebar";
import { Layout, LayoutProps } from "./Layout";

export type MazeGameProps = {
    events?: MazeContextProviderProps["events"] & GameContextProviderProps["events"];
    timeout?: number;
    boardConfig?: Partial<Pick<LayoutProps["boardConfig"], "width" | "height">> &
        Pick<MazeBoardProps, "assets"> &
        Pick<MazeContextProviderProps, "tileSize" | "minPadding">;
    sidebarConfig?: Pick<LayoutProps["sidebarConfig"], "placement" | "layoutVariant">;
} & Pick<MazeContextValue, "grid" | "exitPoint" | "resources" | "hero" | "predators">;

export const MazeGame: React.FC<MazeGameProps> = ({
    events,
    grid,
    exitPoint,
    hero,
    resources,
    predators,
    timeout = 0,
    boardConfig: {
        minPadding = 10,
        width: boardWidth = 300,
        height: boardHeight = 300,
        assets = {},
        tileSize = { width: 10, height: 10 }
    } = {},
    sidebarConfig = {}
}) => {
    const worldConfig = useMemo(() => ({ width: boardWidth, height: boardHeight }), []);

    const sceneConfig: StageConfig = useMemo(() => ({ world: worldConfig, eventMode: "dynamic" }), []);

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
                                <StageContextProvider config={sceneConfig}>
                                    <MazeBoard assets={assets} />
                                    <MazeResources />
                                    <MazeHero />
                                    <MazePredators />
                                </StageContextProvider>
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
