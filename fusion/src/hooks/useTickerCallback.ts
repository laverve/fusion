import { useEffect } from "react";
import { TickerCallback } from "pixi.js";

import { useWorld } from "../hooks";

export const useTickerCallback = <T = unknown>({
    isEnabled = true,
    callback
}: {
    isEnabled?: boolean;
    callback: TickerCallback<T>;
}) => {
    const { application } = useWorld();

    useEffect(() => {
        if (!application || !isEnabled) {
            return;
        }

        application.ticker.add(callback);
        return () => {
            application.ticker.remove(callback);
        };
    }, [isEnabled, application, callback]);
};
