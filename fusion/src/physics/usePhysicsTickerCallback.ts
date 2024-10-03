import { useEffect, useContext } from "react";

import { Events, IRunnerCallback, IEvent, Runner } from "matter-js";
import { MatterPhysicsContext } from "./MatterPhysics.context";

type UsePhysicsTickerCallbackOptions = {
    isEnabled?: boolean;
    callback: IRunnerCallback;
};

export const usePhysicsTickerCallback = ({ isEnabled = true, callback }: UsePhysicsTickerCallbackOptions) => {
    const { runner } = useContext(MatterPhysicsContext);

    useEffect(() => {
        if (!isEnabled) {
            return () => {};
        }

        Events.on(runner, "tick", callback as unknown as (e: IEvent<Runner>) => void);

        return () => {
            Events.off(runner, "tick", callback);
        };
    }, [isEnabled, callback]);
};
