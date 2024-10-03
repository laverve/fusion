/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from "@jest/globals";
import React, { useContext, useState } from "react";
import snapshotDiff from "snapshot-diff";

import { render, fireEvent } from "@testing-library/react";

import { WordSearchContextProvider, WordSearchContext } from "./WordSearch.context";
import { WordSearchWordsList, WordSearchWordsListProps } from "./WordSearchWordsList";

export const TestOnWordFound: React.FC<{ words: string[] }> = ({ words }) => {
    const { onWordFound } = useContext(WordSearchContext);
    const [idx, setIdx] = useState(0);
    return (
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
    );
};

describe("WordSearchWordsList", () => {
    const renderComponentUderTest = ({
        props = {},
        selectedWords = ["cat"],
        selectedWordsColors = ["black"]
    }: {
        props?: WordSearchWordsListProps;
        selectedWords?: string[];
        selectedWordsColors?: string[];
    } = {}) => {
        const words = ["dog", "cat", "dig", "boat", "doc"];
        const grid = [
            ["b", "d", "i", "g"],
            ["d", "o", "g", "o"],
            ["u", "c", "a", "t"],
            ["x", "y", "z", "t"]
        ];

        return render(
            <WordSearchContextProvider grid={grid} words={words} selectedWordsColors={selectedWordsColors}>
                <TestOnWordFound words={selectedWords} />
                <WordSearchWordsList {...props} />
            </WordSearchContextProvider>
        );
    };

    it("should render all words as unselected", () => {
        const component = renderComponentUderTest();
        expect(component.asFragment()).toMatchSnapshot();
    });

    it("should render selected words as selected", () => {
        const component = renderComponentUderTest({ selectedWords: ["cat"] });
        const initialFragment = component.asFragment();
        fireEvent.click(component.getByTestId("test-on-word-found"));
        expect(snapshotDiff(initialFragment, component.asFragment())).toMatchSnapshot();
    });

    it("should use color without alpha channel to hightlight selected word", () => {
        const component = renderComponentUderTest({ selectedWords: ["cat"], selectedWordsColors: ["rgba(0,0,0,0.5)"] });
        const initialFragment = component.asFragment();
        fireEvent.click(component.getByTestId("test-on-word-found"));
        expect(snapshotDiff(initialFragment, component.asFragment())).toMatchSnapshot();
    });

    it("should use colors from the list in the same order as words were found", () => {
        const component = renderComponentUderTest({
            selectedWords: ["dig", "cat", "dog"],
            selectedWordsColors: ["rgba(0,0,0,0.5)", "rgba(1,1,1,0.5)", "rgba(2,2,2,0.5)"]
        });
        fireEvent.click(component.getByTestId("test-on-word-found"));
        fireEvent.click(component.getByTestId("test-on-word-found"));
        fireEvent.click(component.getByTestId("test-on-word-found"));
        expect(component.getByTestId("testid-dig").style.backgroundColor).toBe("rgb(0, 0, 0)");
        expect(component.getByTestId("testid-cat").style.backgroundColor).toBe("rgb(1, 1, 1)");
        expect(component.getByTestId("testid-dog").style.backgroundColor).toBe("rgb(2, 2, 2)");
    });
});
