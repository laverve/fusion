import React, { PropsWithChildren, createContext, useEffect, useMemo, useRef, useState } from "react";
import Matter, { Engine, Runner, World } from "matter-js";
import { MatterPhysicsConfig, MatterPhysics } from "./types";

export type MatterPhysicsContextProviderOptions = {
    isRunning?: boolean;
    config: MatterPhysicsConfig;
};

export const MatterPhysicsContext = createContext<MatterPhysics>({
    config: {
        world: {
            width: 480,
            height: 320
        }
    },
    engine: Engine.create(),
    runner: Runner.create(),
    run: () => {},
    stop: () => {},
    addBody: () => {},
    removeBody: () => {}
});

export const MatterPhysicsContextProvider: React.FC<PropsWithChildren & MatterPhysicsContextProviderOptions> = ({
    isRunning = false,
    children,
    config = { world: { width: 480, height: 320 } }
}) => {
    const isRunningRef = useRef(false);
    const [localConfig] = useState(config);

    const world = useMemo(() => {
        return World.create({
            bounds: {
                min: { x: 0, y: 0 },
                max: { x: config.world.width, y: config.world.height }
            }
        });
    }, [config.world]);

    const engine = useMemo(() => {
        return Engine.create({
            world
        });
    }, [world]);

    const runner = useMemo(() => Runner.create(), []);

    const addBody = (body: Matter.Body | Matter.Composite) => {
        if (engine?.world) {
            World.add(engine?.world, body);
        }
    };

    const removeBody = (body: Matter.Body | Matter.Composite) => {
        if (engine?.world) {
            World.remove(engine?.world, body);
        }
    };

    const run = () => {
        if (!isRunningRef.current) {
            Runner.run(runner, engine);
            isRunningRef.current = true;
        }
    };

    const stop = () => {
        if (isRunningRef.current) {
            Runner.stop(runner);
            isRunningRef.current = false;
        }
    };

    const conextValue = useMemo(
        () => ({
            config: localConfig,
            runner,
            engine,
            run,
            stop,
            addBody,
            removeBody
        }),
        [runner, engine, localConfig]
    );

    useEffect(() => {
        if (isRunning) {
            run();
        }

        return () => {
            stop();
        };
    }, [isRunning]);

    return <MatterPhysicsContext.Provider value={conextValue}>{children}</MatterPhysicsContext.Provider>;
};
