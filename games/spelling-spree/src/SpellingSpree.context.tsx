import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { GameStatus, useGame } from "pixi-fusion";

export type WordCompleteEvent = { word: string; completedWords: string[]; time: number };
export type MistakeEvent = { word: string; position: number; letter: string; time: number };

type Letter = {
    letter: string;
    word: string;
    wordIdx: number;
    letterIdx: number;
    uid: string;
};

export type SpellingSpreeContextProviderEvents = {
    onWordComplete?: (event: WordCompleteEvent) => unknown;
    onMistake?: (event: MistakeEvent) => unknown;
};

export type SpellingSpreeContextValue = {
    onLetterSelected: (letter: string) => void;
    reset: () => void;
    maxSpeed: number;
    minSpeed: number;
    letters: Letter[];
    amountOfMistakes: number;
    currentLetter: number;
    words: string[];
    completedWords: string[];
};

export const SpellingSpreeContext = createContext<SpellingSpreeContextValue>({
    minSpeed: -0.8,
    maxSpeed: -2,
    onLetterSelected: () => {},
    reset: () => {},
    letters: [],
    amountOfMistakes: 0,
    currentLetter: 0,
    words: [],
    completedWords: []
});

export type SpellingSpreeContextProviderProps = PropsWithChildren & {
    maxSpeed?: number;
    minSpeed?: number;
    words: string[];
    events?: SpellingSpreeContextProviderEvents;
};

export const SpellingSpreeContextProvider: React.FC<SpellingSpreeContextProviderProps> = ({
    maxSpeed = -2,
    minSpeed = -0.8,
    children,
    words: incomingWords,
    events
}) => {
    const words = useMemo(() => incomingWords.map((word) => word.toLocaleLowerCase()), [incomingWords]);
    const [completedWords, setCompletedWords] = useState<string[]>([]);
    const [currentLetter, setCurrentLetter] = useState(0);
    const [amountOfMistakes, setAmountOfMistakes] = useState<number>(0);
    const [totalAmountOfMistakes, setTotalAmountOfMistakes] = useState<number>(0);

    const { stop, status, startTime, reset: resetGameContext } = useGame();

    const letters: Letter[] = useMemo(() => {
        return words.flatMap((word, wordIdx) => {
            const lettersInWord = word
                .toLocaleUpperCase()
                .split("")
                .map((letter, letterIdx) => {
                    return {
                        letter,
                        word,
                        wordIdx,
                        letterIdx,
                        uid: `${letter}-${wordIdx}-${letterIdx}`
                    };
                });
            return lettersInWord;
        });
    }, [words]);

    const onLetterSelected = useCallback(
        (letter: string) => {
            if (status !== GameStatus.IN_PROGRESS) {
                return;
            }

            const { letter: letterValue, word, wordIdx, letterIdx } = letters[currentLetter];
            const nextLetter = letters[currentLetter + 1];

            if (letterValue === letter) {
                setCurrentLetter((old) => old + 1);

                if (nextLetter?.wordIdx !== wordIdx) {
                    const newCompletedWords = [...completedWords, word];
                    setAmountOfMistakes(0);
                    setCompletedWords(newCompletedWords);
                    events?.onWordComplete?.({
                        word: word,
                        completedWords: newCompletedWords,
                        time: Date.now() - (startTime || 0)
                    });

                    if (!nextLetter) {
                        stop();
                    }
                    return;
                }

                return;
            }

            setAmountOfMistakes((old) => old + 1);
            setTotalAmountOfMistakes((old) => old + 1);
            events?.onMistake?.({
                word,
                letter,
                position: letterIdx,
                time: Date.now() - (startTime || 0)
            });
        },
        [
            startTime,
            completedWords,
            events?.onWordComplete,
            letters,
            currentLetter,
            amountOfMistakes,
            events?.onMistake,
            status,
            totalAmountOfMistakes
        ]
    );

    const reset = () => {
        setCompletedWords([]);
        setAmountOfMistakes(0);
        setCurrentLetter(0);
        setTotalAmountOfMistakes(0);
    };

    useEffect(() => {
        reset();
        resetGameContext();
    }, [words]);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS || status === GameStatus.READY) {
            reset();
        }
    }, [status]);

    const contextValue = useMemo(
        () => ({
            completedWords,
            currentLetter,
            words,
            letters,
            onLetterSelected,
            amountOfMistakes: totalAmountOfMistakes,
            maxSpeed,
            minSpeed,
            reset
        }),
        [words, completedWords, currentLetter, totalAmountOfMistakes, maxSpeed, minSpeed, letters, words]
    );

    return <SpellingSpreeContext.Provider value={contextValue}>{children}</SpellingSpreeContext.Provider>;
};
