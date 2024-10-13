import React, { PropsWithChildren, createRef, useEffect, useMemo, useRef, useState } from "react";
import { Application, EventMode } from "pixi.js";
import { WorldContextValue, WorldContext } from "./World.context";
import { Stage } from "../stage";
import { AssetsManager } from "../assets-manager";

type WorldProps = {
    eventMode?: EventMode;
    size?: {
        width: number;
        height: number;
    };
};

export const World: React.FC<PropsWithChildren & WorldProps> = ({ children, eventMode, size }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const canvasRef = createRef<HTMLDivElement>();

    const application = useRef(new Application());

    const worldSize = useMemo(() => {
        if (size) {
            return { ...size };
        }

        if (canvasRef?.current) {
            const { width, height } = canvasRef.current.getBoundingClientRect();
            return {
                width,
                height
            };
        }

        if (!isInitialized) {
            return {
                width: 0,
                height: 0
            };
        }
        return {
            width: application.current.screen.width,
            height: application.current.screen.height
        };
    }, [size, canvasRef, isInitialized]);

    useEffect(() => {
        if (canvasRef.current && !isInitialized) {
            application.current
                .init({
                    resizeTo: canvasRef.current
                })
                .then(() => {
                    setIsInitialized(true);
                });
        }
    }, [canvasRef.current, isInitialized]);

    const conextValue = useMemo<WorldContextValue>(
        () => ({
            application: application.current,
            size: worldSize,
            isInitialized
        }),
        [isInitialized, worldSize]
    );

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        canvasRef.current?.appendChild(application.current.canvas);

        return () => {
            canvasRef.current?.removeChild(application.current.canvas);
        };
    }, [canvasRef.current, isInitialized]);

    useEffect(() => {
        if (application.current) {
            application.current.stage.eventMode = eventMode;
        }
    }, [eventMode, application.current, isInitialized]);

    return (
        <WorldContext.Provider value={conextValue}>
            <AssetsManager>
                <Stage>{children}</Stage>
                <div style={{ width: "100%", height: "100%" }} ref={canvasRef} />
            </AssetsManager>
        </WorldContext.Provider>
    );
};
