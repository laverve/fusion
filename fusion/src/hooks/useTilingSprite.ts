import { useEffect, useMemo } from "react";

import { TilingSpriteOptions, TilingSprite } from "pixi.js";
import { useTextures } from "./useTexture";
import { useObject } from "./useObject";

type UseTilingSpriteOptions = Omit<TilingSpriteOptions, "texture"> & {
    texture: string;
};

export const useTilingSprite = ({ texture = "", tilePosition, ...options }: UseTilingSpriteOptions) => {
    const textureKeys = useMemo(() => {
        return [...(texture ? [texture] : [])];
    }, [texture]);

    const { isFetched } = useTextures({ keys: textureKeys });

    const sprite = useMemo(() => {
        if (!isFetched) {
            return null;
        }

        if (texture) {
            return TilingSprite.from(texture);
        }

        return new TilingSprite({});
    }, [texture, frames]);

    useObject({ object: sprite, ...options });

    useEffect(() => {
        if (tilePosition && sprite) {
            sprite.tilePosition = tilePosition;
        }
    }, [tilePosition, sprite?.uid]);

    return sprite;
};
