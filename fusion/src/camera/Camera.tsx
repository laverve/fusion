import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "pixi.js";
import { Viewport as ViewportContainer } from "pixi-viewport";
import { StageContextValue } from "../stage/Stage.context";
import { Layer } from "../layer";
import { useStage, useWorld } from "../hooks";
import { LayerContext } from "../layer/Layer.context";
import { CameraContext, EnsureVisibleOptions } from "./Camera.context";

type CameraProps = {
    clampZoom?: Parameters<ViewportContainer["clampZoom"]>[0];
};

export const Camera: React.FC<CameraProps & PropsWithChildren> = ({ children, clampZoom }) => {
    const [isReady, setIsReady] = useState(false);
    const [followContainer, setFollowContainer] = useState<Container | null>(null);
    const [ensureVisibleOptions, setEnsureVisibleOptions] = useState<EnsureVisibleOptions | null>(null);
    const { application, isInitialized, size } = useWorld();
    const { addObject: addObjectToStage, removeObject: removeObjectFromStage } = useStage();
    const [things, setThings] = useState<Container[]>([]);
    const viewport = useMemo(
        () =>
            isInitialized
                ? new ViewportContainer({
                      worldHeight: size.height,
                      worldWidth: size.width,
                      screenHeight: application.canvas.height,
                      screenWidth: application.canvas.width,
                      events: application?.renderer?.events
                  })
                : null,
        [size, application, isInitialized]
    );

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
        if (viewport && clampZoom) {
            viewport.clampZoom(clampZoom);
        }
    }, [clampZoom, isInitialized]);

    useEffect(() => {
        if (viewport) {
            if (size.width) {
                viewport.width = size.width;
            }
            if (size.height) {
                viewport.height = size.height;
            }
        }
    }, [size, viewport?.uid, isInitialized]);

    useEffect(() => {
        if (!isInitialized || !viewport) {
            return;
        }
        viewport?.moveCenter(0, 0);
    }, [viewport, size, isInitialized]);

    useEffect(() => {
        if (!viewport) {
            return;
        }

        addObjectToStage(viewport);
        setIsReady(true);

        return () => {
            removeObjectFromStage(viewport);
            setIsReady(false);
        };
    }, [application, isInitialized]);

    useEffect(() => {
        if (!viewport || !isReady) {
            return;
        }

        viewport.addChild(...things);

        return () => {
            viewport.removeChild(...things);
        };
    }, [things, viewport, isReady]);

    useEffect(() => {
        if (isReady && viewport && followContainer) {
            viewport.follow(followContainer, { radius: 300 });
        }
    }, [isReady, viewport, followContainer]);

    useEffect(() => {
        if (isReady && viewport && ensureVisibleOptions) {
            viewport.ensureVisible(
                ensureVisibleOptions.x,
                ensureVisibleOptions.y,
                ensureVisibleOptions.width,
                ensureVisibleOptions.height,
                ensureVisibleOptions.resizeToFit
            );
        }
    }, [isReady, viewport, ensureVisibleOptions]);

    const followCallback = useCallback(
        (container: Container) => {
            setFollowContainer(container);
        },
        [followContainer]
    );

    const ensureVisibleCallback = useCallback(
        (options: EnsureVisibleOptions) => {
            setEnsureVisibleOptions(options);
        },
        [followContainer]
    );

    const value = useMemo(() => {
        return {
            follow: followCallback,
            ensureVisible: ensureVisibleCallback
        };
    }, [followCallback]);

    return (
        <CameraContext.Provider value={value}>
            <LayerContext.Provider value={conextValue}>
                <Layer>{children}</Layer>
            </LayerContext.Provider>
        </CameraContext.Provider>
    );
};
