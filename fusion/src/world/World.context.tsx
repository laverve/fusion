import { createContext } from "react";
import { Application } from "pixi.js";

export type WorldContextValue = {
    readonly size: {
        width: number;
        height: number;
    };
    application: Application | null;
};

export const WorldContext = createContext<WorldContextValue>({} as unknown as WorldContextValue);
