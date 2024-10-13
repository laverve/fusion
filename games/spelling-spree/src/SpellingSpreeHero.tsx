import { forwardRef, useEffect, useState } from "react";
import { AnimatedSprite } from "pixi.js";
import { GameStatus, useAnimatedSprite, useCamera, useGame, useTickerCallback } from "@laverve/fusion";

import { HERO_TEXTURE_ALIAS } from "./helpers";

import spritesheet from "../assets/hero_spritesheet.json";

type SpellingSpreeHeroProps = {
    isCollided: boolean;
};

export const SpellingSpreeHero = forwardRef<AnimatedSprite, SpellingSpreeHeroProps>(({ isCollided }, ref) => {
    const { status } = useGame();
    const [isPlaying, setIsPlaying] = useState(true);
    const [position, setPosition] = useState({ x: -400, y: 125 });
    const [animation, setAnimation] = useState("walk");

    const { ensureVisible } = useCamera();

    const heroSprite = useAnimatedSprite({
        scale: 1,
        animation,
        texture: HERO_TEXTURE_ALIAS,
        spritesheet,
        animationSpeed: 0.1,
        anchor: { x: 0.5, y: 0.5 },
        position,
        isPlaying
    });

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [status]);

    useEffect(() => {
        if (isCollided) {
            setAnimation("bumped");
        } else {
            setAnimation("walk");
        }
    }, [isCollided]);

    useTickerCallback({
        isEnabled: !isCollided && status === GameStatus.IN_PROGRESS && position.x < -270,
        callback: () => {
            setPosition(({ x, y }) => ({ x: x + 1, y }));
        }
    });

    useEffect(() => {
        if (heroSprite) {
            ensureVisible(heroSprite);
        }
    }, [heroSprite?.uid]);

    useEffect(() => {
        if (ref && heroSprite) {
            if (typeof ref === "function") {
                ref(heroSprite);
            } else {
                ref.current = heroSprite;
            }
        }
    }, [ref, heroSprite?.uid]);

    return null;
});

SpellingSpreeHero.displayName = "";
