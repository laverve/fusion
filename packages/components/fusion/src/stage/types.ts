import { Application } from "@pixi/app";
import { EventMode } from "@pixi/events";
import { DisplayObject } from "@pixi/display";

export type StageConfig = {
    world: {
        width: number;
        height: number;
    };
    eventMode: EventMode;
};

export type Stage = {
    readonly config: StageConfig;
    readonly application: Application<HTMLCanvasElement>;
    addObject: (body: DisplayObject) => void;
    removeObject: (body: DisplayObject) => void;
};
