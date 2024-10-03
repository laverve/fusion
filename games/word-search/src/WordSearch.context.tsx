import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { v4 as uuid } from "uuid";
import { GameContext, GameStatus } from "@laverve/fusion";
import { WordSearchBoardCell } from "./types";

export type WordFoundEvent = { word: string; foundWords: string[] };

export type WordSearchContextProviderEvents = {
    onWordFound?: (event: WordFoundEvent) => unknown;
};

export type WordSearchContextValue = {
    onWordFound: (word: string) => void;
    reset: () => void;
    grid: string[][];
    words: string[];
    foundWords: string[];
    selectedWordsColors: string[];
    gridCells: Map<string, WordSearchBoardCell>;
};

export const WordSearchContext = createContext<WordSearchContextValue>({
    onWordFound: () => {},
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

export const WordSearchContextProvider: React.FC<WordSearchContextProviderProps> = ({
    children,
    words,
    selectedWordsColors = ["rgba(0,0,0,0.4)"],
    grid,
    events
}) => {
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const { stop, status } = useContext(GameContext);

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

    const onWordFound = (word: string) => {
        const newFoundWords = [...foundWords, word];

        setFoundWords(newFoundWords);
        events?.onWordFound?.({ word, foundWords: newFoundWords });
    };

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
    }, [grid, words, selectedWordsColors]);

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
            reset
        }),
        [grid, gridCells, words, foundWords, selectedWordsColors]
    );

    return <WordSearchContext.Provider value={contextValue}>{children}</WordSearchContext.Provider>;
};
