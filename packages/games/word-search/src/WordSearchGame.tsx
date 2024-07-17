import React from "react";

import { GameContextProvider, GameContextProviderProps } from "@laverve/fusion";
import {
    WordSearchContextValue,
    WordSearchContextProvider,
    WordSearchContextProviderProps
} from "./WordSearch.context";
import { WordSearchBoard } from "./WordSearchBoard";
import { WordSearchGameControls } from "./WordSearchGameControls";
import { WordSearchStats } from "./WordSearchStats";
import { WordSearchWordsListProps } from "./WordSearchWordsList";
import { WordSearchSidebar } from "./WordSearchSidebar";
import { Layout, LayoutProps } from "./Layout";

export type WordSearchGameProps = {
    events?: WordSearchContextProviderProps["events"] & GameContextProviderProps["events"];
    timeout?: number;
    boardConfig?: Pick<LayoutProps["boardConfig"], "width" | "height">;
    sidebarConfig?: Pick<LayoutProps["sidebarConfig"], "placement" | "layoutVariant">;
    wordsListConfig?: Pick<WordSearchWordsListProps, "classNames">;
} & Required<Pick<WordSearchContextValue, "grid" | "words">> &
    Partial<Pick<WordSearchContextValue, "selectedWordsColors">>;

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
    events,
    words,
    grid,
    timeout = 0,
    selectedWordsColors = ["#5FE1ED", "#EFDC5F", "#E26D70", "#707BD3", "#96DB6F", "#B3B3B3"],
    boardConfig: { width: boardWidth = 300, height: boardHeight = 300 } = {},
    sidebarConfig = {},
    wordsListConfig = {}
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
            <WordSearchContextProvider
                words={words}
                grid={grid}
                selectedWordsColors={selectedWordsColors}
                events={{ onWordFound: events?.onWordFound }}
            >
                <Layout
                    boardConfig={{
                        children: (
                            <>
                                <WordSearchBoard width={boardWidth} height={boardHeight} />
                                <WordSearchGameControls statsSlot={<WordSearchStats />} />
                            </>
                        ),
                        width: boardWidth,
                        height: boardHeight
                    }}
                    sidebarConfig={{
                        ...sidebarConfig,
                        children: <WordSearchSidebar wordsListConfig={wordsListConfig} />
                    }}
                    containerConfig={{}}
                />
            </WordSearchContextProvider>
        </GameContextProvider>
    );
};
