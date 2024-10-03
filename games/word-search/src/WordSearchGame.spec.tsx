/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from "@jest/globals";
import React from "react";

import { render, fireEvent, RenderResult } from "@testing-library/react";

import { WordSearchGame, WordSearchGameProps } from "./WordSearchGame";

const selectWord = (component: RenderResult, arr: string[]) => {
    fireEvent.mouseDown(component.getByTestId(`testid-${arr[0]}`), {
        bubbles: true
    });

    for (let i = 1; i < arr.length; i++) {
        fireEvent.mouseMove(component.getByTestId(`testid-${arr[i]}`), {
            bubbles: true
        });
    }

    fireEvent.mouseUp(component.getByTestId(`testid-${arr[arr.length - 1]}`), {
        bubbles: true
    });
};

describe("WordSearchGame", () => {
    const WORDS = ["dig", "boat", "dog", "doc", "cat"];
    const GRID = [
        ["b", "d", "i", "g"],
        ["d", "o", "g", "o"],
        ["u", "c", "a", "t"],
        ["x", "y", "z", "t"]
    ];

    const renderComponentUderTest = ({
        props = { grid: GRID, words: WORDS, boardConfig: { width: 300, height: 300 } }
    }: {
        props?: WordSearchGameProps;
    } = {}) => {
        return render(<WordSearchGame {...props} />);
    };

    const PROPS = { grid: GRID, words: WORDS, boardConfig: { width: 300, height: 300 }, timeout: 0 };

    it("should render game in READY state", () => {
        const component = renderComponentUderTest({
            props: PROPS
        });

        expect(component.queryByTestId("testid-game-control-start")).toBeTruthy();
        expect(component.queryByTestId("testid-wordsearch-board")).toBeTruthy();
        expect(component.getByTestId("testid-wordsearch-board").className).toContain("blur-sm");
        expect(component.queryByTestId("testid-wordsearch-words-list")).toBeTruthy();
        expect(component.queryByTestId("testid-wordsearch-stats")).toBeFalsy();
    });

    it("should allow user to start a game and render it in IN_PROGRESS state", () => {
        const component = renderComponentUderTest({
            props: PROPS
        });

        fireEvent.click(component.getByTestId("testid-game-control-start"));

        expect(component.queryByTestId("testid-game-control-start")).toBeFalsy();
        expect(component.queryByTestId("testid-wordsearch-board")).toBeTruthy();
        expect(component.getByTestId("testid-wordsearch-board").className).not.toContain("blur-sm");
        expect(component.queryByTestId("testid-wordsearch-words-list")).toBeTruthy();
        expect(component.queryByTestId("testid-wordsearch-stats")).toBeFalsy();
        expect(component.queryByTestId("testid-game-control-start")).toBeFalsy();
    });

    it("should render stats when game is finished and all words were found", () => {
        const component = renderComponentUderTest({
            props: PROPS
        });

        fireEvent.click(component.getByTestId("testid-game-control-start"));

        selectWord(component, ["0-0", "1-1", "2-2", "3-3"]);
        selectWord(component, ["0-1", "0-2", "0-3"]);
        selectWord(component, ["1-0", "1-1", "1-2"]);
        selectWord(component, ["0-1", "1-1", "2-1"]);
        selectWord(component, ["2-1", "2-2", "2-3"]);

        expect(component.queryByTestId("testid-game-control-start")).toBeFalsy();
        expect(component.queryByTestId("testid-wordsearch-board")).toBeTruthy();
        expect(component.getByTestId("testid-wordsearch-board").className).toContain("blur-sm");
        expect(component.queryByTestId("testid-wordsearch-words-list")).toBeTruthy();
        expect(component.queryByTestId("testid-wordsearch-stats")).toBeTruthy();
        expect(component.queryByTestId("testid-game-control-start")).toBeFalsy();
    });
});
