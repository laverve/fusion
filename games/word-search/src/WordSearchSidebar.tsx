import React from "react";

import { Timer, useTimer } from "@laverve/timer";
import { useGame, GameStatus } from "@laverve/fusion";
import { WordSearchWordsList, WordSearchWordsListProps } from "./WordSearchWordsList";

export type WordSearchSidebarProps = {
    wordsListConfig?: Pick<WordSearchWordsListProps, "classNames">;
};

export const WordSearchSidebar: React.FC<WordSearchSidebarProps> = ({ wordsListConfig }) => {
    const { status, timeout } = useGame();

    const { seconds, timeLeftPercents, minutes } = useTimer({
        type: timeout === 0 ? "countup" : "countdown",
        timeout,
        isCounting: status === GameStatus.IN_PROGRESS
    });

    return (
        <>
            <Timer seconds={seconds} minutes={minutes} timeLeftPercents={timeLeftPercents} />
            <WordSearchWordsList classNames={wordsListConfig?.classNames ?? ""} />
        </>
    );
};
