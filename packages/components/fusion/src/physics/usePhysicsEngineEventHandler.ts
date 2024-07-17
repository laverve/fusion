import { useEffect, useContext } from "react";

import { Events, IEngineCallback, IEvent, Engine } from "matter-js";
import { MatterPhysicsContext } from "./MatterPhysics.context";

type UsePhysicsEngineEventHandlerOptions = {
    isEnabled?: boolean;
    event: "beforeUpdate" | "afterUpdate";
    callback: IEngineCallback;
};

export const usePhysicsEngineEventHandler = ({
    isEnabled = true,
    event,
    callback
}: UsePhysicsEngineEventHandlerOptions) => {
    const { engine } = useContext(MatterPhysicsContext);

    useEffect(() => {
        if (!isEnabled) {
            return () => {};
        }

        Events.on(engine, event, callback as unknown as (e: IEvent<Engine>) => void);

        return () => {
            Events.off(engine, event, callback);
        };
    }, [isEnabled, event, callback]);
};
