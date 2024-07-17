import React, { PropsWithChildren, createContext, createRef, useCallback, useEffect, useMemo } from "react";
import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { StageConfig, Stage } from "./types";

export type StageContextContextProviderOptions = {
    config: StageConfig;
};

export const StageContext = createContext<Stage>({} as unknown as Stage);

export const StageContextProvider: React.FC<PropsWithChildren & StageContextContextProviderOptions> = ({
    config,
    children
}) => {
    const canvasRef = createRef<HTMLDivElement>();

    const application = useMemo(() => {
        return new Application<HTMLCanvasElement>({
            width: config.world.width,
            height: config.world.height
        });
    }, [config.world.width, config.world.height]);

    const addObject = useCallback(
        (thing: DisplayObject) => {
            application.stage.addChild(thing);
            application.render();
        },
        [application]
    );

    const removeObject = useCallback(
        (thing: DisplayObject) => {
            application.stage.removeChild(thing);
        },
        [application]
    );

    const conextValue = useMemo<Stage>(
        () => ({
            config,
            application,
            addObject,
            removeObject
        }),
        [application, config]
    );

    useEffect(() => {
        application.stage.eventMode = config.eventMode;
    }, [config.eventMode]);

    useEffect(() => {
        canvasRef.current?.appendChild(application.view);

        return () => {
            canvasRef.current?.removeChild(application.view);
        };
    }, [canvasRef, application]);

    return (
        <StageContext.Provider value={conextValue}>
            {children}
            <div ref={canvasRef} />
        </StageContext.Provider>
    );
};
