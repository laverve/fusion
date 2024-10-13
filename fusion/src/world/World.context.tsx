import { createContext } from "react";
import { Application } from "pixi.js";

export type WorldContextValue = {
    readonly size: {
        width: number;
        height: number;
    };
    readonly application: Application;
    readonly isInitialized: boolean;
};

export const WorldContext = createContext<WorldContextValue>({} as unknown as WorldContextValue);
