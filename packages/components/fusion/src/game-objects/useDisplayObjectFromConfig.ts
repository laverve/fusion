import { useEffect, useContext, useMemo } from "react";

import { DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { StageContext } from "../stage/Stage.context";
import { GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { displayObjectFactory } from "./displayObjectFactory";
import { Nullable } from "../types";

export const useDisplayObjectFromConfig = <DisplayObjectType extends Nullable<DisplayObject> = Sprite>(
    gameObjectDisplayObject: GameObjectDisplayObjectConfig | null
) => {
    const { addObject, removeObject } = useContext(StageContext);

    const displayObject = useMemo(
        () => (gameObjectDisplayObject ? displayObjectFactory<DisplayObjectType>(gameObjectDisplayObject) : null),
        []
    );

    useEffect(() => {
        if (!displayObject) {
            return () => {};
        }

        addObject(displayObject);

        return () => {
            removeObject(displayObject);
        };
    }, [displayObject]);

    useEffect(() => {
        if (!displayObject) {
            return;
        }

        displayObject.x = gameObjectDisplayObject?.position?.x ?? 0;
        displayObject.y = gameObjectDisplayObject?.position?.y ?? 0;
        displayObject.angle = gameObjectDisplayObject?.angle ?? 0;
    }, [gameObjectDisplayObject?.position?.x, gameObjectDisplayObject?.position?.y, gameObjectDisplayObject?.angle]);

    return {
        displayObject
    };
};
