import { useEffect, useMemo } from "react";

import { Sprite, ViewContainer } from "pixi.js";
import { GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { displayObjectFactory } from "./displayObjectFactory";
import { Nullable } from "../types";
import { useAssets } from "../assets-manager";
import { useLayerContext } from "../hooks/useLayerContext";

export const useDisplayObject = <DisplayObjectType extends Nullable<ViewContainer> = Sprite>(
    gameObjectDisplayObject: GameObjectDisplayObjectConfig | null
) => {
    const { addObject, removeObject } = useLayerContext();

    const assetsToLoad = useMemo(() => {
        return gameObjectDisplayObject?.asset && gameObjectDisplayObject?.asset.src
            ? [gameObjectDisplayObject?.asset]
            : [];
    }, [gameObjectDisplayObject?.asset]);

    const { isFetching, isFetched, get } = useAssets({
        assets: assetsToLoad
    });

    const displayObject = useMemo(
        () =>
            gameObjectDisplayObject && isFetched && !isFetching
                ? displayObjectFactory<DisplayObjectType>(
                      gameObjectDisplayObject,
                      get(gameObjectDisplayObject?.asset?.alias ?? "")
                  )
                : null,
        [isFetched, isFetching]
    );

    useEffect(() => {
        if (!displayObject || isFetching) {
            return () => {};
        }

        addObject(displayObject);

        return () => {
            removeObject(displayObject);
        };
    }, [displayObject, isFetching]);

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
