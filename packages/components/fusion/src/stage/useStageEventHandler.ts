import { useContext, useEffect } from "react";
import { AllFederatedEventMap } from "@pixi/events";

import { StageContext } from "./Stage.context";

export const useStageEventHandler = <K extends keyof AllFederatedEventMap>({
    isEnabled = true,
    event,
    callback
}: {
    isEnabled?: boolean;
    event: K;
    callback: (e: AllFederatedEventMap[K]) => any;
}) => {
    const { application } = useContext(StageContext);
    useEffect(() => {
        if (!isEnabled) {
            return () => {};
        }

        const internalCallback = (e: AllFederatedEventMap[K]) => {
            callback(e);
        };

        application.stage.addEventListener(event, internalCallback);

        return () => {
            application.stage.removeEventListener(event, internalCallback);
        };
    }, [isEnabled, event, callback]);
};
