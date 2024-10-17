import React, { useEffect, useMemo } from "react";

import { World, GameContextProvider, GameContextProviderProps } from "pixi-fusion";
import {
    SpellingSpreeContextProvider,
    SpellingSpreeContextProviderProps,
    SpellingSpreeContextValue
} from "./SpellingSpree.context";
import { SpellingSpreeGameControls } from "./SpellingSpreeGameControls";
import { SpellingSpreeStats } from "./SpellingSpreeStats";
import { SpellingSpreeWordsList, SpellingSpreeWordsListProps } from "./SpellingSpreeWordsList";
import { Layout, PublicLayoutProps } from "./Layout";
import { I18nextProvider } from "react-i18next";
import { i18n as i18nInstance } from "./i18n";
import { SpellingSpreeTimer, SpellingSpreeTimerProps } from "./SpellingSpreeTimer";
import { useParentSize } from "@laverve/use-parent-size";
import { SpellingSpreeScene } from "./SpellingSpreeScene";

export type SpellingSpreeGameProps = {
    layout?: PublicLayoutProps;
    lng: string;
    maxSpeed?: number;
    minSpeed?: number;
    events?: SpellingSpreeContextProviderProps["events"] &
        GameContextProviderProps["events"] & { onPlayAgain?: () => unknown };
    timeout?: number;
    wordsList?: SpellingSpreeWordsListProps;
    timer?: SpellingSpreeTimerProps;
} & Required<Pick<SpellingSpreeContextValue, "words">>;

export const SpellingSpreeGame: React.FC<SpellingSpreeGameProps> = ({
    lng,
    events,
    words,
    timeout = 0,
    maxSpeed = -2,
    minSpeed = -0.5,
    layout,
    wordsList,
    timer
}) => {
    useEffect(() => {
        i18nInstance.changeLanguage(lng);
    }, [lng]);

    const { ref, height, width } = useParentSize();

    const worldSize = useMemo(() => ({ width: width, height: height }), [width, height]);

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
                <SpellingSpreeContextProvider
                    words={words}
                    maxSpeed={maxSpeed}
                    minSpeed={minSpeed}
                    events={{ onMistake: events?.onMistake, onWordComplete: events?.onWordComplete }}
                >
                    <Layout
                        {...layout}
                        boardSlot={
                            <div className="relative overflow-hidden h-full w-full" ref={ref}>
                                {width && height && (
                                    <World size={worldSize}>
                                        <SpellingSpreeScene />
                                    </World>
                                )}
                                <SpellingSpreeGameControls
                                    onPlayAgain={events?.onPlayAgain}
                                    statsSlot={<SpellingSpreeStats />}
                                />
                            </div>
                        }
                        wordsListSlot={<SpellingSpreeWordsList {...wordsList} />}
                        timerSlot={<SpellingSpreeTimer {...timer} />}
                    />
                </SpellingSpreeContextProvider>
            </GameContextProvider>
        </I18nextProvider>
    );
};
