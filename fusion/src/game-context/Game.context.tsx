import React, { PropsWithChildren, createContext, useMemo, useRef, useState } from "react";
import { GameStatus } from "../types";

export type GameContextValue = {
    readonly reset: () => void;
    readonly start: () => void;
    readonly stop: () => void;
    readonly timeout: number;
    readonly status: GameStatus;
    readonly startTime: number | null;
    readonly endTime: number | null;
};

export type GameContextProviderEvents = {
    onStart?: (event: { startTime: number | null; status: GameStatus; endTime: number | null }) => unknown;
    onStop?: (event: { startTime: number | null; status: GameStatus; endTime: number | null }) => unknown;
    onTimedOut?: (event: { startTime: number | null; status: GameStatus; endTime: number | null }) => unknown;
    onReset?: (event: { startTime: number | null; status: GameStatus; endTime: number | null }) => unknown;
};

export const GameContext = createContext<GameContextValue>({
    reset: () => {},
    start: () => {},
    stop: () => {},
    timeout: 0,
    status: GameStatus.READY,
    startTime: null,
    endTime: null
});

export type GameContextProviderProps = PropsWithChildren & {
    timeout?: number;
    events?: GameContextProviderEvents;
};

export const GameContextProvider: React.FC<GameContextProviderProps> = ({
    children,
    timeout: inputTimeout = 0,
    events
}) => {
    const timerRef = useRef<NodeJS.Timeout>();
    const timeout = Math.max(0, inputTimeout);

    const [status, setStatus] = useState(GameStatus.READY);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);

    const onTimedOut = () => {
        const newEndTime = +new Date();
        const newStatus = GameStatus.TIMEDOUT;

        setEndTime(newEndTime);
        setStatus(GameStatus.TIMEDOUT);

        events?.onTimedOut?.({
            startTime,
            endTime: newEndTime,
            status: newStatus
        });
    };

    const start = () => {
        const newStartTime = +new Date();
        const newStatus = GameStatus.IN_PROGRESS;
        const newEndTime = null;

        setStatus(newStatus);
        setStartTime(newStartTime);
        setEndTime(newEndTime);

        if (timeout !== 0) {
            timerRef.current = setTimeout(() => {
                onTimedOut();
            }, timeout * 1000);
        }

        events?.onStart?.({
            startTime: newStartTime,
            endTime: newEndTime,
            status: newStatus
        });
    };

    const reset = () => {
        const newStartTime = null;
        const newStatus = GameStatus.READY;
        const newEndTime = null;

        setStatus(newStatus);
        setStartTime(newStartTime);
        setEndTime(newEndTime);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        events?.onReset?.({
            startTime: newStartTime,
            endTime: newEndTime,
            status: newStatus
        });
    };

    const stop = () => {
        const newStatus = GameStatus.COMPLETED;
        const newEndTime = +new Date();

        clearTimeout(timerRef.current);
        setEndTime(+new Date());
        setStatus(GameStatus.COMPLETED);

        events?.onStop?.({
            startTime,
            endTime: newEndTime,
            status: newStatus
        });
    };

    const contextValue = useMemo(
        () => ({
            status,
            startTime,
            endTime,
            timeout,
            stop,
            start,
            reset
        }),
        [timeout, status, startTime, endTime]
    );

    return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};
