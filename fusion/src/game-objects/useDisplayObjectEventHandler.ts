import { useEffect } from "react";
import { AllFederatedEventMap, ViewContainer } from "pixi.js";

export const useDisplayObjectEventHandler = <K extends keyof AllFederatedEventMap>({
    isEnabled = true,
    displayObject,
    event,
    callback
}: {
    isEnabled?: boolean;
    displayObject: ViewContainer | null;
    event: K;
    callback: (e: AllFederatedEventMap[K]) => unknown;
}) => {
    useEffect(() => {
        if (!isEnabled || !displayObject) {
            return () => {};
        }

        const internalCallback = (e: AllFederatedEventMap[K]) => {
            callback(e);
        };

        displayObject.addEventListener(event, internalCallback);

        return () => {
            displayObject.removeEventListener(event, internalCallback);
        };
    }, [isEnabled, event, callback, displayObject]);
};
