import { useEffect, useContext, useMemo } from "react";

import { DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { StageContext } from "../stage/Stage.context";
import { GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { displayObjectFactory } from "./displayObjectFactory";
import { Nullable } from "../types";

export type UseDisplayObjectsFromConfigOptions = {
    objects: GameObjectDisplayObjectConfig[];
};

export const useDisplayObjectsFromConfig = <DisplayObjectType extends Nullable<DisplayObject> = Sprite>({
    objects
}: UseDisplayObjectsFromConfigOptions) => {
    const { addObject, removeObject } = useContext(StageContext);

    const displayObjects = useMemo(() => {
        const allObjects = objects.map((displayObjectConfig) =>
            displayObjectFactory<DisplayObjectType>(displayObjectConfig)
        );
        return { objects: allObjects.filter((displayObject) => displayObject), allObjects };
    }, []);

    useEffect(() => {
        displayObjects.objects.forEach((displayObject) => displayObject && addObject(displayObject));

        return () => {
            displayObjects.objects.forEach((displayObject) => displayObject && removeObject(displayObject));
        };
    }, [displayObjects]);

    const mutableProperties = objects
        .map((objectConfig) =>
            [objectConfig.angle, objectConfig.position?.x, objectConfig.position?.y, objectConfig.alpha].join(",")
        )
        .join(";");

    useEffect(() => {
        if (!displayObjects.objects.length) {
            return;
        }

        objects.forEach((objectConfig, idx) => {
            const displayObject = displayObjects.allObjects[idx];
            if (displayObject) {
                displayObject.x = objectConfig?.position?.x ?? 0;
                displayObject.y = objectConfig?.position?.y ?? 0;
                displayObject.angle = objectConfig?.angle ?? 0;
                displayObject.alpha = objectConfig?.alpha ?? 1;
            }
        });
    }, [mutableProperties]);

    return {
        displayObjects
    };
};
