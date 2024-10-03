import { useEffect, useContext } from "react";

import { Engine, Events, ICollisionCallback, IEvent } from "matter-js";
import { MatterPhysicsContext } from "./MatterPhysics.context";

export type UseCollisionEventHandlerOptions = {
    isEnabled?: boolean;
    event: "collisionActive" | "collisionEnd" | "collisionStart";
    callback: ICollisionCallback;
};

export const useCollisionEventHandler = ({ isEnabled = true, event, callback }: UseCollisionEventHandlerOptions) => {
    const { engine } = useContext(MatterPhysicsContext);

    useEffect(() => {
        if (!isEnabled) {
            return () => {};
        }

        Events.on(engine, event, callback as unknown as (e: IEvent<Engine>) => void);

        return () => {
            Events.off(engine, event, callback);
        };
    }, [isEnabled, callback, event]);
};
