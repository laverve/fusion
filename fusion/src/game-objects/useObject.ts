import { Sprite, SpriteOptions, TilingSprite } from "pixi.js";
import { useLayerContext } from "../hooks/useLayerContext";
import { useEffect } from "react";

type UseObjectOptions = Omit<SpriteOptions, "texture"> & {
    object: Sprite | TilingSprite | null;
};

export const useObject = ({ object, anchor, position, skew, scale, width, visible = true }: UseObjectOptions) => {
    const { addObject, removeObject } = useLayerContext();

    useEffect(() => {
        if (!object) {
            return;
        }

        addObject(object);

        return () => {
            removeObject(object);
        };
    }, [object?.uid]);

    useEffect(() => {
        if (anchor && object) {
            object.anchor = anchor;
        }
    }, [anchor, object?.uid]);

    useEffect(() => {
        if (object && position) {
            object.position = position;
        }
    }, [position, object?.uid]);

    useEffect(() => {
        if (object && skew) {
            object.skew = skew;
        }
    }, [skew, object?.uid]);

    useEffect(() => {
        if (object && scale) {
            object.scale = scale;
        }
    }, [scale, object?.uid]);

    useEffect(() => {
        if (object) {
            object.visible = visible;
        }
    }, [visible, object?.uid]);

    useEffect(() => {
        if (object && width) {
            object.width = width;
        }
    }, [width, object?.uid]);
};
