import { forwardRef, useEffect, useState } from "react";
import { useSprite, useTickerCallback } from "pixi-fusion";

import { LETTER_BACKGROUND_ALIAS } from "./helpers";

import { TextStyle, Text, Sprite } from "pixi.js";

type SpellingSpreeLetterProps = {
    letter: string;
    isHidden: boolean;
    x: number;
};

export const SpellingSpreeLetter = forwardRef<Sprite, SpellingSpreeLetterProps>(({ letter, x, isHidden }, ref) => {
    const [position, setPosition] = useState({ x, y: 150 });
    const [skew, setSkew] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(true);

    const sprite = useSprite({
        texture: LETTER_BACKGROUND_ALIAS,
        anchor: { x: 0.5, y: 0.5 },
        scale: 1,
        position,
        skew,
        visible: isVisible
    });

    const style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 28,
        stroke: { color: "#4a1850", width: 1 }
    });

    useEffect(() => {
        setPosition(({ y }) => ({ x, y }));
    }, [x]);

    useEffect(() => {
        sprite?.addChild(
            new Text({
                text: letter,
                style,
                anchor: { x: 0.5, y: 0.5 }
            })
        );
    }, [sprite]);

    useEffect(() => {
        if (ref && sprite) {
            if (typeof ref === "function") {
                ref(sprite);
            } else {
                ref.current = sprite;
            }
        }
    }, [ref, sprite]);

    useTickerCallback({
        isEnabled: isHidden,
        callback: () => {
            if (sprite) {
                setSkew(({ x, y }) => ({ x, y: y + 0.1 }));
                setPosition(({ x, y }) => ({ x, y: y - 1 }));
                if (position.y === -100) {
                    setIsVisible(false);
                }
            }
        }
    });

    return null;
});

SpellingSpreeLetter.displayName = "SpellingSpreeLetter";
