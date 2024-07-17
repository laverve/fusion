import { EventMode, Cursor } from "@pixi/events";
import { DisplayObjectType } from "./DisplayObjectType";

export type GameObjectDisplayObjectConfig = {
    type: DisplayObjectType;
    url?: string;
    angle?: number;
    position?: { x: number; y: number };
    eventMode?: EventMode;
    cursor?: Cursor;
    width?: number;
    height?: number;
    alpha?: number;
    scale?: { x: number; y: number };
    anchor?: { x: number; y: number };
};
