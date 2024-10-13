/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from "@jest/globals";
import React, { useContext, useState } from "react";

import { render, fireEvent } from "@testing-library/react";
import { GameContextProvider, GameContext } from "@laverve/fusion";

import { WordSearchContextProvider, WordSearchContext } from "./WordSearch.context";
import { WordSearchStats, WordSearchStatsProps } from "./WordSearchStats";

export const TestGameplay: React.FC<{ words: string[] }> = ({ words }) => {
    const { onWordFound } = useContext(WordSearchContext);
    const { start, stop } = useContext(GameContext);
    const [idx, setIdx] = useState(0);
    return (
        <>
            <button
                type="button"
                data-testid="test-on-word-found"
                onClick={() => {
                    onWordFound(words[idx]);
                    setIdx(idx + 1);
                }}
            >
                Find word
            </button>
            <button
                type="button"
                data-testid="test-start"
                onClick={() => {
                    start();
                }}
            >
                Start
            </button>
            <button
                type="button"
                data-testid="test-stop"
                onClick={() => {
                    stop();
                }}
            >
                Stop
            </button>
        </>
    );
};

describe("WordSearchStats", () => {
    const WORDS = ["dog", "cat", "dig", "boat", "doc"];
    const GRID = [
        ["b", "d", "i", "g"],
        ["d", "o", "g", "o"],
        ["u", "c", "a", "t"],
        ["x", "y", "z", "t"]
    ];

    const renderComponentUderTest = ({
        props = {},
        timeout = 0,
        selectedWords = ["cat"],
        selectedWordsColors = ["black"]
    }: {
        props?: WordSearchStatsProps;
        timeout?: number;
        selectedWords?: string[];
        selectedWordsColors?: string[];
    } = {}) => {
        return render(
            <GameContextProvider timeout={timeout}>
                <WordSearchContextProvider grid={GRID} words={WORDS} selectedWordsColors={selectedWordsColors}>
                    <TestGameplay words={selectedWords} />
                    <WordSearchStats {...props} />
                </WordSearchContextProvider>
            </GameContextProvider>
        );
    };

    it("should render only found words if game has not been started or stopped yet", () => {
        const component = renderComponentUderTest({
            selectedWords: WORDS
        });
        WORDS.forEach(() => {
            fireEvent.click(component.getByTestId("test-on-word-found"));
        });
        expect(component.asFragment()).toMatchSnapshot();
    });

    it("should render found words and time spent after game was started and stopped", () => {
        const component = renderComponentUderTest({
            selectedWords: WORDS
        });
        fireEvent.click(component.getByTestId("test-start"));
        WORDS.forEach(() => {
            fireEvent.click(component.getByTestId("test-on-word-found"));
        });
        fireEvent.click(component.getByTestId("test-stop"));
        expect(component.asFragment()).toMatchSnapshot();
    });
});
