import React, {
    PropsWithChildren,
    createContext,
    createRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Application, ViewContainer } from "pixi.js";
import { StageConfig, Stage } from "./types";

export type StageContextContextProviderOptions = {
    config: StageConfig;
};

export const StageContext = createContext<Stage>({} as unknown as Stage);

export const StageContextProvider: React.FC<PropsWithChildren & StageContextContextProviderOptions> = ({
    config,
    children
}) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const canvasRef = createRef<HTMLDivElement>();

    const application = useRef(new Application());

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

    const addObject = useCallback(
        (thing: ViewContainer) => {
            application.current.stage.addChild(thing);
            if (application.current.renderer) {
                application.current.render();
            }
        },
        [isInitialized]
    );

    const removeObject = useCallback(
        (thing: ViewContainer) => {
            application.current.stage.removeChild(thing);
            if (application.current.renderer) {
                application.current.render();
            }
        },
        [isInitialized]
    );

    const conextValue = useMemo<Stage>(
        () => ({
            config,
            application: application.current,
            addObject,
            removeObject
        }),
        [isInitialized, config]
    );

    useEffect(() => {
        application.current.stage.eventMode = config.eventMode;
    }, [config.eventMode]);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        canvasRef.current?.appendChild(application.current.canvas);

        return () => {
            canvasRef.current?.removeChild(application.current.canvas);
        };
    }, [canvasRef.current, isInitialized]);

    return (
        <StageContext.Provider value={conextValue}>
            {children}
            <div style={{ width: "100%", height: "100%" }} ref={canvasRef} />
        </StageContext.Provider>
    );
};
