/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from "@jest/globals";
import React, { useContext } from "react";

import snapshotDiff from "snapshot-diff";

import { render, fireEvent, waitFor } from "@testing-library/react";
import { GameContextProvider, GameContext } from "@laverve/fusion";

import { WordSearchContextProvider } from "./WordSearch.context";
import { WordSearchBoard, WordSearchBoardProps } from "./WordSearchBoard";

let stopSpy: jest.SpyInstance;

export const TestGameplay: React.FC = () => {
    const context = useContext(GameContext);
    stopSpy = jest.spyOn(context, "stop");
    stopSpy.mockImplementationOnce(() => {});

    return (
        <>
            <button
                type="button"
                data-testid="test-start"
                onClick={() => {
                    context.start();
                }}
            >
                Start
            </button>
            <button
                type="button"
                data-testid="test-stop"
                onClick={() => {
                    context.stop();
                }}
            >
                Stop
            </button>
        </>
    );
};

describe("WordSearchBoard", () => {
    const WORDS = ["dig", "boat"];
    const GRID = [
        ["b", "d", "i", "g"],
        ["d", "o", "g", "o"],
        ["u", "c", "a", "t"],
        ["x", "y", "z", "t"]
    ];

    const renderComponentUderTest = ({
        props = { width: 300, height: 300 },
        timeout = 0,
        selectedWordsColors = ["black"]
    }: {
        props?: WordSearchBoardProps;
        timeout?: number;
        selectedWordsColors?: string[];
    } = {}) => {
        return render(
            <GameContextProvider timeout={timeout}>
                <WordSearchContextProvider grid={GRID} words={WORDS} selectedWordsColors={selectedWordsColors}>
                    <TestGameplay />
                    <WordSearchBoard {...props} />
                </WordSearchContextProvider>
            </GameContextProvider>
        );
    };

    it("should render when game is not started", () => {
        const component = renderComponentUderTest();
        expect(component.asFragment()).toMatchSnapshot();
    });

    it("should disregard selected words before game is started", () => {
        const component = renderComponentUderTest();
        const initialSnapshot = component.asFragment();

        fireEvent.mouseDown(component.getByTestId("testid-0-0"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-1-1"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-2-2"), {
            bubbles: true
        });
        expect(snapshotDiff(initialSnapshot, component.asFragment())).toMatchSnapshot();
    });

    it("should unblur board once game is started", () => {
        const component = renderComponentUderTest();
        const initialSnapshot = component.asFragment();

        fireEvent.click(component.getByTestId("test-start"));
        expect(snapshotDiff(initialSnapshot, component.asFragment())).toMatchSnapshot();
    });

    it("should highlight path that is being selected", () => {
        const component = renderComponentUderTest();
        const initialSnapshot = component.asFragment();

        fireEvent.click(component.getByTestId("test-start"));

        fireEvent.mouseDown(component.getByTestId("testid-0-0"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-1-1"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-2-2"), {
            bubbles: true
        });
        expect(snapshotDiff(initialSnapshot, component.asFragment())).toMatchSnapshot();
    });

    it("should highlight selected word and path that is being selected", () => {
        const component = renderComponentUderTest();
        const initialSnapshot = component.asFragment();

        fireEvent.click(component.getByTestId("test-start"));

        fireEvent.mouseDown(component.getByTestId("testid-0-0"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-1-1"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-2-2"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-3-3"), {
            bubbles: true
        });

        fireEvent.mouseUp(component.getByTestId("testid-3-3"), {
            bubbles: true
        });

        fireEvent.mouseDown(component.getByTestId("testid-0-1"), {
            bubbles: true
        });

        fireEvent.mouseMove(component.getByTestId("testid-0-2"), {
            bubbles: true
        });
        expect(snapshotDiff(initialSnapshot, component.asFragment())).toMatchSnapshot();
    });

    it("should stop the game once all words are selected", async () => {
        const component = renderComponentUderTest();

        fireEvent.click(component.getByTestId("test-start"));

        expect(stopSpy).not.toHaveBeenCalled();

        [
            ["0-0", "1-1", "2-2", "3-3"],
            ["0-1", "0-2", "0-3"],
            ["1-0", "2-0", "3-0"]
        ].forEach((arr) => {
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
        });

        await waitFor(() => expect(stopSpy).toHaveBeenCalled(), { timeout: 10000 });
    });
});
