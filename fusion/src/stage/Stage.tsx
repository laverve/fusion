import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "pixi.js";
import { StageContext, StageContextValue } from "./Stage.context";
import { useWorld } from "../hooks";
import { Layer } from "../layer";

export const Stage: React.FC<PropsWithChildren> = ({ children }) => {
    const { application, isInitialized } = useWorld();
    const [things, setThings] = useState<Container[]>([]);

    const addObject = useCallback(
        (thing: Container) => {
            setThings((oldThings) => [...oldThings, thing]);
        },
        [things]
    );

    const removeObject = useCallback(
        (thing: Container) => {
            setThings((oldThings) => oldThings.filter(({ uid }) => uid === thing.uid));
        },
        [application]
    );

    const conextValue = useMemo<StageContextValue>(
        () => ({
            addObject,
            removeObject
        }),
        [addObject, removeObject]
    );

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        application.stage.addChild(...things);

        return () => {
            application.stage.removeChild(...things);
        };
    }, [things, isInitialized]);

    return (
        <StageContext.Provider value={conextValue}>
            <Layer>{children}</Layer>
        </StageContext.Provider>
    );
};
