import { useEffect } from "react";

export const useGlobalEventHandler = <K extends keyof DocumentEventMap>({
    isEnabled = true,
    event,
    callback
}: {
    isEnabled?: boolean;
    event: K;
    callback: (e: DocumentEventMap[K]) => any;
}) => {
    useEffect(() => {
        if (!isEnabled) {
            return () => {};
        }

        const internalCallback = (e: DocumentEventMap[K]) => {
            callback(e);
        };

        document.addEventListener(event, internalCallback);

        return () => {
            document.removeEventListener(event, internalCallback);
        };
    }, [isEnabled, event, callback]);
};
