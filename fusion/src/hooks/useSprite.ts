import { useMemo } from "react";

import { Sprite, SpriteOptions } from "pixi.js";
import { useTextures } from "./useTexture";
import { useObject } from "../game-objects/useObject";

type UseSpriteOptions = Omit<SpriteOptions, "texture"> & {
    texture: string;
};

export const useSprite = ({ texture = "", ...options }: UseSpriteOptions) => {
    const textureKeys = useMemo(() => {
        return [...(texture ? [texture] : [])];
    }, [texture]);

    const { isFetched } = useTextures({ keys: textureKeys });

    const sprite = useMemo(() => {
        if (!isFetched) {
            return null;
        }

        if (texture) {
            return Sprite.from(texture);
        }

        return new Sprite({});
    }, [texture, frames]);

    useObject({ object: sprite, ...options });

    return sprite;
};
