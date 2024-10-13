import React from "react";

import { GameStatus, useGame } from "@laverve/fusion";
import { Timer, useTimer } from "@laverve/timer";

export const MazeSidebar: React.FC = () => {
    const { status, timeout } = useGame();

    const { seconds, timeLeftPercents, minutes } = useTimer({
        type: timeout === 0 ? "countup" : "countdown",
        timeout,
        isCounting: status === GameStatus.IN_PROGRESS
    });

    return <Timer seconds={seconds} minutes={minutes} timeLeftPercents={timeLeftPercents} />;
};
