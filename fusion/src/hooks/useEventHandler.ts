import { useEffect } from "react";
import { AllFederatedEventMap } from "pixi.js";

import { useWorld } from "../hooks";

export const useEventHandler = <K extends keyof AllFederatedEventMap>({
    isEnabled = true,
    event,
    callback
}: {
    isEnabled?: boolean;
    event: K;
    callback: (e: AllFederatedEventMap[K]) => unknown;
}) => {
    const { application, isInitialized } = useWorld();

    useEffect(() => {
        if (!isEnabled || !isInitialized) {
            return () => {};
        }

        const internalCallback = (e: AllFederatedEventMap[K]) => {
            callback(e);
        };

        application.stage.addEventListener(event, internalCallback);

        return () => {
            application.stage.removeEventListener(event, internalCallback);
        };
    }, [isEnabled, event, application, isInitialized, callback]);
};
