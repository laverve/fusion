import { useContext, useEffect } from "react";
import { TickerCallback } from "@pixi/core";

import { StageContext } from "./Stage.context";

export const useStageTickerCallback = <T = unknown>({
    isEnabled = true,
    callback
}: {
    isEnabled?: boolean;
    callback: TickerCallback<T>;
}) => {
    const { application } = useContext(StageContext);

    useEffect(() => {
        application.ticker.add(callback);
        return () => {
            application.ticker.remove(callback);
        };
    }, [isEnabled, callback]);
};
