import React, { useEffect } from "react";

import { GameContextProvider, GameContextProviderProps } from "@laverve/fusion";
import {
    WordSearchContextValue,
    WordSearchContextProvider,
    WordSearchContextProviderProps
} from "./WordSearch.context";
import { WordSearchBoard, WordSearchBoardProps } from "./WordSearchBoard";
import { WordSearchGameControls } from "./WordSearchGameControls";
import { WordSearchStats } from "./WordSearchStats";
import { WordSearchWordsList, WordSearchWordsListProps } from "./WordSearchWordsList";
import { Layout, PublicLayoutProps } from "./Layout";
import { I18nextProvider } from "react-i18next";
import { i18n as i18nInstance } from "./i18n";
import { WordSearchTimer, WordSearchTimerProps } from "./WordSearchTimer";
import { useParentSize } from "@laverve/use-parent-size";

export type WordSearchGameProps = {
    layout?: PublicLayoutProps;
    lng: string;
    events?: WordSearchContextProviderProps["events"] &
        GameContextProviderProps["events"] & { onPlayAgain?: () => unknown };
    timeout?: number;
    board?: WordSearchBoardProps;
    wordsList?: WordSearchWordsListProps;
    timer?: WordSearchTimerProps;
} & Required<Pick<WordSearchContextValue, "grid" | "words">> &
    Partial<Pick<WordSearchContextValue, "selectedWordsColors">>;

const DEFAULT_SELECTED_COLORS = ["#5FE1ED", "#EFDC5F", "#E26D70", "#707BD3", "#96DB6F", "#B3B3B3"];

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
    lng,
    events,
    words,
    grid,
    timeout = 0,
    selectedWordsColors = DEFAULT_SELECTED_COLORS,
    layout,
    board,
    wordsList,
    timer
}) => {
    useEffect(() => {
        i18nInstance.changeLanguage(lng);
    }, [lng]);

    const { ref, height, width } = useParentSize();

    return (
        <I18nextProvider i18n={i18nInstance}>
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
                        {...layout}
                        boardSlot={
                            <div className="relative overflow-hidden h-full w-full" ref={ref}>
                                <WordSearchBoard height={height} width={width} {...board} />
                                <WordSearchGameControls
                                    onPlayAgain={events?.onPlayAgain}
                                    statsSlot={<WordSearchStats />}
                                />
                            </div>
                        }
                        wordsListSlot={<WordSearchWordsList {...wordsList} />}
                        timerSlot={<WordSearchTimer {...timer} />}
                    />
                </WordSearchContextProvider>
            </GameContextProvider>
        </I18nextProvider>
    );
};
