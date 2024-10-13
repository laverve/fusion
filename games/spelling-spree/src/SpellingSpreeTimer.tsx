import React, { ReactNode, useEffect } from "react";

import { Timer, useTimer } from "@laverve/timer";
import { useGame, GameStatus } from "pixi-fusion";

type TimerOptions = { seconds: number; minutes: number; timeLeftPercents: number };

export type SpellingSpreeTimerProps = {
    children?: (options: TimerOptions) => ReactNode;
};

const DEFAULT_TIMER = (options: TimerOptions) => (
    <Timer seconds={options.seconds} minutes={options.minutes} timeLeftPercents={options.timeLeftPercents} />
);

export const SpellingSpreeTimer: React.FC<SpellingSpreeTimerProps> = ({ children = DEFAULT_TIMER }) => {
    const { status, timeout } = useGame();

    const { seconds, timeLeftPercents, minutes, reset } = useTimer({
        type: timeout === 0 ? "countup" : "countdown",
        timeout,
        isCounting: status === GameStatus.IN_PROGRESS
    });

    useEffect(() => {
        reset();
    }, [status, timeout]);

    return children?.({ seconds, minutes, timeLeftPercents }) ?? null;
};
