import React, { PropsWithChildren, useCallback, useContext, useEffect, useMemo } from "react";
import { Container, ContainerOptions } from "pixi.js";
import { StageContext } from "../stage/Stage.context";
import { LayerContext, LayerContextValue } from "./Layer.context";

export type LayerOptions = {
    options?: Omit<ContainerOptions, "parent">;
};

export const Layer: React.FC<PropsWithChildren & LayerOptions> = ({ options, children }) => {
    const { addObject: addObjectIntoStage, removeObject: removeObjectFromStaeg } = useContext(StageContext);
    const { addObject: addObjectIntoParent, removeObject: removeObjectFromParent } = useContext(LayerContext);

    const container = useMemo(() => {
        return new Container(options);
    }, [options]);

    useEffect(() => {
        if (addObjectIntoParent) {
            addObjectIntoParent(container);

            return () => {
                removeObjectFromParent(container);
            };
        }

        addObjectIntoStage(container);

        return () => {
            removeObjectFromStaeg(container);
        };
    }, [container?.uid]);

    const addObject = useCallback(
        (thing: Container) => {
            container.addChild(thing);
        },
        [container?.uid]
    );

    const removeObject = useCallback(
        (thing: Container) => {
            container.removeChild(thing);
        },
        [container?.uid]
    );

    const conextValue = useMemo<LayerContextValue>(
        () => ({
            addObject,
            removeObject
        }),
        [container?.uid]
    );

    return <LayerContext.Provider value={conextValue}>{children}</LayerContext.Provider>;
};
