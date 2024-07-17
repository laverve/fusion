import { DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Graphics } from "@pixi/graphics";
import { GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { DisplayObjectType } from "./DisplayObjectType";
import { Nullable } from "../types";

const displayObjectInternalFactory = <T extends Nullable<DisplayObject>>(
    displayObjectConfig?: GameObjectDisplayObjectConfig
): T => {
    switch (displayObjectConfig?.type) {
        case DisplayObjectType.SPRITE:
            // eslint-disable-next-line no-case-declarations
            const sprite = displayObjectConfig.url ? Sprite.from(displayObjectConfig.url) : new Sprite();
            if (displayObjectConfig.anchor) {
                sprite.anchor.set(displayObjectConfig.anchor.x, displayObjectConfig.anchor.y);
            }
            if (displayObjectConfig.width !== undefined) {
                sprite.width = displayObjectConfig.width;
            }
            if (displayObjectConfig.height !== undefined) {
                sprite.height = displayObjectConfig.height;
            }
            if (displayObjectConfig.scale !== undefined) {
                sprite.scale = displayObjectConfig.scale;
            }
            return sprite as unknown as T;
        case DisplayObjectType.GRAPHICS:
            return new Graphics() as unknown as T;
        default:
            return null as T;
    }
};

export const displayObjectFactory = <T extends Nullable<DisplayObject>>(
    displayObjectConfig?: GameObjectDisplayObjectConfig
): T => {
    const displayObject = displayObjectInternalFactory<T>(displayObjectConfig);

    if (!displayObject) {
        return null as T;
    }

    if (displayObjectConfig?.position) {
        displayObject.x = displayObjectConfig.position.x;
        displayObject.y = displayObjectConfig.position.y;
    }

    if (displayObjectConfig?.eventMode) {
        displayObject.eventMode = displayObjectConfig.eventMode;
    }

    if (displayObjectConfig?.alpha) {
        displayObject.alpha = displayObjectConfig.alpha;
    }

    if (displayObjectConfig?.cursor) {
        displayObject.cursor = displayObjectConfig.cursor;
    }

    return displayObject;
};
