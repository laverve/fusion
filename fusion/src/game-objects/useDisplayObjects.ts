import { useEffect, useMemo } from "react";

import { Sprite, ViewContainer } from "pixi.js";
import { GameObjectDisaplyObjectAsset, GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { displayObjectFactory } from "./displayObjectFactory";
import { Nullable } from "../types";
import { useAssets } from "../assets-manager";
import { useLayerContext } from "../hooks/useLayerContext";

export type UseDisplayObjectsFromConfigOptions = {
    objects: GameObjectDisplayObjectConfig[];
};

export const useDisplayObjects = <DisplayObjectType extends Nullable<ViewContainer> = Sprite>({
    objects
}: UseDisplayObjectsFromConfigOptions) => {
    const { addObject, removeObject } = useLayerContext();

    const assetsToLoad = useMemo(() => {
        return objects
            .map(({ asset }) => asset)
            .filter((a) => a && !!a.src) as Required<GameObjectDisaplyObjectAsset>[];
    }, [objects]);

    const { isError, isFetched, isFetching, get } = useAssets({ assets: assetsToLoad });

    const displayObjects = useMemo(() => {
        if (isFetching || !isFetched || isError) {
            return { objects: [], allObjects: [] };
        }
        const allObjects = objects.map((displayObjectConfig) =>
            displayObjectFactory<DisplayObjectType>(displayObjectConfig, get(displayObjectConfig.asset?.alias ?? ""))
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
