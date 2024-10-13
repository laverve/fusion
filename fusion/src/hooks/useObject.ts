import { Sprite, SpriteOptions, TilingSprite } from "pixi.js";
import { useLayerContext } from "./useLayerContext";
import { useEffect } from "react";

type UseObjectOptions = Omit<SpriteOptions, "texture"> & {
    object: Sprite | TilingSprite | null;
};

export const useObject = ({
    object,
    anchor,
    position,
    skew,
    scale,
    width,
    angle,
    alpha,
    visible = true
}: UseObjectOptions) => {
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
        if (anchor !== undefined && object) {
            object.anchor = anchor;
        }
    }, [anchor, object?.uid]);

    useEffect(() => {
        if (angle !== undefined && object) {
            object.angle = angle;
        }
    }, [angle, object?.uid]);

    useEffect(() => {
        if (object && position !== undefined) {
            object.position = position;
        }
    }, [position, object?.uid]);

    useEffect(() => {
        if (object && skew !== undefined) {
            object.skew = skew;
        }
    }, [skew, object?.uid]);

    useEffect(() => {
        if (object && alpha !== undefined) {
            object.alpha = alpha;
        }
    }, [alpha, object?.uid]);

    useEffect(() => {
        if (object && scale !== undefined) {
            object.scale = scale;
        }
    }, [scale, object?.uid]);

    useEffect(() => {
        if (object) {
            object.visible = visible;
        }
    }, [visible, object?.uid]);

    useEffect(() => {
        if (object && width !== undefined) {
            object.width = width;
        }
    }, [width, object?.uid]);
};
