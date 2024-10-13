import { EventMode, Cursor } from "pixi.js";
import { DisplayObjectType } from "./DisplayObjectType";

export type GameObjectDisaplyObjectAsset = {
    alias: string;
    src?: string;
};

export type GameObjectDisaplyObjectFrame = {
    alias: string;
    src?: string;
};

export type GameObjectDisplayObjectConfig = {
    type: DisplayObjectType;
    angle?: number;
    position?: { x: number; y: number };
    eventMode?: EventMode;
    cursor?: Cursor;
    width?: number;
    height?: number;
    alpha?: number;
    scale?: { x: number; y: number };
    anchor?: { x: number; y: number };
    asset?: GameObjectDisaplyObjectAsset;
    frames?: GameObjectDisaplyObjectFrame;
};
