import { useEffect, useContext, useMemo } from "react";

import { Sprite, ViewContainer } from "pixi.js";
import { StageContext } from "../stage/Stage.context";
import { GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { displayObjectFactory } from "./displayObjectFactory";
import { Nullable } from "../types";
import { useAssets } from "../assets";

export const useDisplayObject = <DisplayObjectType extends Nullable<ViewContainer> = Sprite>(
    gameObjectDisplayObject: GameObjectDisplayObjectConfig | null
) => {
    const { addObject, removeObject } = useContext(StageContext);

    const assetsToLoad = useMemo(() => {
        return gameObjectDisplayObject?.asset ? [gameObjectDisplayObject?.asset] : [];
    }, [gameObjectDisplayObject?.asset]);

    const { isFetching, isFetched, assets } = useAssets({
        assets: assetsToLoad
    });

    const asset = useMemo(() => {
        return assets[gameObjectDisplayObject?.asset?.alias ?? ""];
    }, [assets]);

    const displayObject = useMemo(
        () =>
            gameObjectDisplayObject && isFetched && !isFetching
                ? displayObjectFactory<DisplayObjectType>(gameObjectDisplayObject, asset)
                : null,
        [asset, isFetched, isFetching]
    );

    useEffect(() => {
        if (!displayObject || !asset) {
            return () => {};
        }

        addObject(displayObject);

        return () => {
            removeObject(displayObject);
        };
    }, [displayObject, asset]);

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
