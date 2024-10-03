import { Application, EventMode, ViewContainer } from "pixi.js";

export type StageConfig = {
    world: {
        width: number;
        height: number;
    };
    eventMode: EventMode;
};

export type Stage = {
    readonly config: StageConfig;
    readonly application: Application;
    addObject: (body: ViewContainer) => void;
    removeObject: (body: ViewContainer) => void;
};
