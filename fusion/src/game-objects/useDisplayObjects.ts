import { useEffect, useContext, useMemo } from "react";

import { Sprite, ViewContainer } from "pixi.js";
import { StageContext } from "../stage/Stage.context";
import { GameObjectDisaplyObjectAsset, GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { displayObjectFactory } from "./displayObjectFactory";
import { Nullable } from "../types";
import { useAssets } from "../assets";

export type UseDisplayObjectsFromConfigOptions = {
    objects: GameObjectDisplayObjectConfig[];
};

export const useDisplayObjects = <DisplayObjectType extends Nullable<ViewContainer> = Sprite>({
    objects
}: UseDisplayObjectsFromConfigOptions) => {
    const { addObject, removeObject } = useContext(StageContext);

    const assetsToLoad = useMemo(() => {
        return objects.map(({ asset }) => asset).filter((a) => a) as GameObjectDisaplyObjectAsset[];
    }, [objects]);

    const { isError, isFetched, isFetching, assets } = useAssets({ assets: assetsToLoad });

    const displayObjects = useMemo(() => {
        if (isFetching || !isFetched || isError) {
            return { objects: [], allObjects: [] };
        }
        const allObjects = objects.map((displayObjectConfig) =>
            displayObjectFactory<DisplayObjectType>(displayObjectConfig, assets[displayObjectConfig.asset?.alias ?? ""])
        );
        return { objects: allObjects };
    }, [isFetched, isFetching]);

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
            const displayObject = displayObjects.objects?.[idx];
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
