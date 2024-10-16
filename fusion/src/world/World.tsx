import React, { PropsWithChildren, createRef, useEffect, useMemo, useState } from "react";
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
    const canvasRef = createRef<HTMLDivElement>();

    const [applicationRef, setApplicationRef] = useState<Application | null>(null);

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

        if (!applicationRef) {
            return {
                width: 0,
                height: 0
            };
        }

        return {
            width: applicationRef.screen.width,
            height: applicationRef.screen.height
        };
    }, [size, canvasRef.current, applicationRef]);

    useEffect(() => {
        if (!applicationRef) {
            const application = new Application();
            application.init().then(() => {
                setApplicationRef(application);
            });
        }
    }, []);

    useEffect(() => {
        if (applicationRef && canvasRef.current) {
            applicationRef.resizeTo = canvasRef.current;
            applicationRef.resize();
        }
    }, [canvasRef.current, applicationRef]);

    const conextValue = useMemo<WorldContextValue>(
        () => ({
            application: applicationRef,
            size: worldSize
        }),
        [applicationRef, worldSize]
    );

    useEffect(() => {
        if (!applicationRef) {
            return;
        }
        canvasRef.current?.appendChild(applicationRef.canvas);

        return () => {
            if (applicationRef) {
                canvasRef.current?.removeChild(applicationRef.canvas);
            }
        };
    }, [canvasRef.current, applicationRef]);

    useEffect(() => {
        if (applicationRef) {
            applicationRef.stage.eventMode = eventMode;
        }
    }, [eventMode, applicationRef]);

    return (
        <WorldContext.Provider value={conextValue}>
            <AssetsManager>
                <Stage>{children}</Stage>
                <div style={{ width: "100%", height: "100%" }} ref={canvasRef} />
            </AssetsManager>
        </WorldContext.Provider>
    );
};
