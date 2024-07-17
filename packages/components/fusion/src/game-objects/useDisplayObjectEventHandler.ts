import { useEffect } from "react";
import { AllFederatedEventMap } from "@pixi/events";
import { DisplayObject } from "@pixi/display";

export const useDisplayObjectEventHandler = <K extends keyof AllFederatedEventMap>({
    isEnabled = true,
    displayObject,
    event,
    callback
}: {
    isEnabled?: boolean;
    displayObject: DisplayObject | null;
    event: K;
    callback: (e: AllFederatedEventMap[K]) => any;
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
