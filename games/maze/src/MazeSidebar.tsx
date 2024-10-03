import React, { useContext } from "react";

import { GameContext, GameStatus } from "@laverve/fusion";
import { Timer, useTimer } from "@laverve/timer";

export const MazeSidebar: React.FC = () => {
    const { status, timeout } = useContext(GameContext);

    const { seconds, timeLeftPercents, minutes } = useTimer({
        type: timeout === 0 ? "countup" : "countdown",
        timeout,
        isCounting: status === GameStatus.IN_PROGRESS
    });

    return <Timer seconds={seconds} minutes={minutes} timeLeftPercents={timeLeftPercents} />;
};
