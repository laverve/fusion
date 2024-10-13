import { useEffect, useMemo } from "react";

import { AnimatedSprite, AnimatedSpriteOptions, Spritesheet, SpritesheetData } from "pixi.js";
import { useTextures } from "./useTexture";
import { useObject } from "./useObject";

type UseAnimatedSpriteOptions = Omit<AnimatedSpriteOptions, "textures" | "texture"> & {
    texture: string;
    animation: string;
    spritesheet: SpritesheetData;
    animationSpeed: number;
    isPlaying: boolean;
};

export const useAnimatedSprite = ({
    texture,
    spritesheet: spritesheetJSON,
    animation,
    animationSpeed = 1,
    isPlaying,
    ...options
}: UseAnimatedSpriteOptions) => {
    const textureKeys = useMemo(() => {
        return [...(texture ? [texture] : [])];
    }, [texture]);

    const { textures, isFetched } = useTextures({ keys: textureKeys });

    const spritesheet = useMemo(() => {
        if (isFetched) {
            const sheet = new Spritesheet(textures[0], spritesheetJSON);
            sheet.parse();
            return sheet;
        }
        return null;
    }, [spritesheetJSON]);

    const sprite = useMemo(() => {
        if (spritesheet?.animations?.[animation]) {
            return new AnimatedSprite({ textures: spritesheet?.animations?.[animation] });
        }

        return null;
    }, [texture, spritesheetJSON, animation]);

    useObject({ object: sprite, ...options });

    useEffect(() => {
        if (sprite) {
            sprite.animationSpeed = animationSpeed;
        }
    }, [animationSpeed, sprite?.uid]);

    useEffect(() => {
        if (sprite) {
            if (isPlaying) {
                sprite.play();
            } else {
                sprite.stop();
            }
        }
    }, [isPlaying, sprite?.uid]);

    return sprite;
};
