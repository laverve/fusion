import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { v4 as uuid } from "uuid";
import { useGame, GameStatus } from "pixi-fusion";
import { WordSearchBoardCell } from "./types";

export type WordFoundEvent = { word: string; foundWords: string[]; time: number };
export type MissEvent = { time: number };

export type WordSearchContextProviderEvents = {
    onWordFound?: (event: WordFoundEvent) => unknown;
    onMiss?: (event: MissEvent) => unknown;
};

export type WordSearchContextValue = {
    onWordFound: (word: string) => void;
    onMiss: () => void;
    reset: () => void;
    grid: string[][];
    words: string[];
    foundWords: string[];
    selectedWordsColors: string[];
    gridCells: Map<string, WordSearchBoardCell>;
};

export const WordSearchContext = createContext<WordSearchContextValue>({
    onWordFound: () => {},
    onMiss: () => {},
    reset: () => {},
    grid: [],
    words: [],
    gridCells: new Map(),
    selectedWordsColors: ["rgba(0,0,0,0.4)"],
    foundWords: []
});

export type WordSearchContextProviderProps = PropsWithChildren & {
    words: string[];
    selectedWordsColors?: string[];
    grid?: string[][];
    events?: WordSearchContextProviderEvents;
};

const DEFAULT_SELECTED_WORDS_COLORS = ["rgba(0,0,0,0.4)"];

export const WordSearchContextProvider: React.FC<WordSearchContextProviderProps> = ({
    children,
    words,
    selectedWordsColors = DEFAULT_SELECTED_WORDS_COLORS,
    grid,
    events
}) => {
    const [foundWords, setFoundWords] = useState<string[]>([]);

    const { stop, status, startTime, reset: resetGameContext } = useGame();

    const gridCells: Map<string, WordSearchBoardCell> = useMemo(() => {
        return (
            grid?.reduce<Map<string, WordSearchBoardCell>>((map, row, rowId) => {
                row.reduce<Map<string, WordSearchBoardCell>>((map2, col, colId) => {
                    map2.set(`${rowId}-${colId}`, {
                        key: uuid(),
                        label: row[colId],
                        col: colId,
                        row: rowId
                    });
                    return map2;
                }, map);
                return map;
            }, new Map()) ?? new Map()
        );
    }, [grid]);

    const onWordFound = useCallback(
        (word: string) => {
            const newFoundWords = [...foundWords, word];

            setFoundWords(newFoundWords);
            events?.onWordFound?.({ word, foundWords: newFoundWords, time: Date.now() - (startTime || 0) });
        },
        [startTime, foundWords, events?.onWordFound]
    );

    const onMiss = useCallback(() => {
        events?.onMiss?.({ time: Date.now() - (startTime || 0) });
    }, [startTime, events?.onMiss]);

    const reset = () => {
        setFoundWords([]);
    };

    useEffect(() => {
        if (foundWords.length === words.length) {
            stop();
        }
    }, [foundWords, words]);

    useEffect(() => {
        reset();
        resetGameContext();
    }, [gridCells, words, selectedWordsColors]);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS || status === GameStatus.READY) {
            reset();
        }
    }, [status]);

    const contextValue = useMemo(
        () => ({
            foundWords,
            words,
            selectedWordsColors,
            gridCells,
            grid: grid || [],
            onWordFound,
            onMiss,
            reset
        }),
        [grid, gridCells, words, foundWords, selectedWordsColors, onMiss, onWordFound]
    );

    return <WordSearchContext.Provider value={contextValue}>{children}</WordSearchContext.Provider>;
};
