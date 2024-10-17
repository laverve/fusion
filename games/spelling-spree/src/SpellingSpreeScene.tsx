import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
    Layer,
    Camera,
    useAssetManager,
    useTickerCallback,
    useGame,
    GameStatus,
    useGlobalEventHandler,
    useCollisionDetection
} from "pixi-fusion";
import { Sprite, AnimatedSprite } from "pixi.js";
import { SpellingSpreeBoard } from "./SpellingSpreeBoard";
import { SpellingSpreeHero } from "./SpellingSpreeHero";
import { BACKGROUND_TEXTURE_ALIAS, HERO_TEXTURE_ALIAS, LETTER_BACKGROUND_ALIAS } from "./helpers";

import background from "../assets/background.jpg";
import letterBackground from "../assets/letter-background.jpg";
import hero from "../assets/hero.png";
import { SpellingSpreeLetter } from "./SpellingSpreeLetter";
import { SpellingSpreeContext } from "./SpellingSpree.context";

const MARGIN_LEFT = -120;
const LETTER_WIDTH = 30;
const MAX_SPACE_BETWEEN_LETTERS = 300;
const SPACE_BETWEEN_WORDS = 300;

export const SpellingSpreeScene: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { status, stop } = useGame();
    const [isCollided, setIsCollided] = useState(false);
    const [marginLeft, setMarginLeft] = useState(MARGIN_LEFT);
    const { unload, load, isFetched, isFetching } = useAssetManager();
    const { letters, currentLetter, onLetterSelected, maxSpeed, minSpeed } = useContext(SpellingSpreeContext);
    const [speed, setSpeed] = useState(minSpeed);
    const letterRef = useRef<Sprite | null>(null);
    const heroRef = useRef<AnimatedSprite | null>(null);

    const lettersToDraw = useMemo(() => {
        let x = marginLeft;
        let currentSpace = MAX_SPACE_BETWEEN_LETTERS;
        let lastWordIdx = letters[0].wordIdx;

        return letters.map(({ letter, uid, wordIdx }, idx) => {
            if (lastWordIdx !== wordIdx) {
                currentSpace = Math.max(currentSpace * 0.7, 5);
                x = x + LETTER_WIDTH + SPACE_BETWEEN_WORDS;
                lastWordIdx = wordIdx;
            } else {
                x = x + LETTER_WIDTH + currentSpace;
            }

            return {
                x: x,
                letter,
                uid,
                isCurrent: idx === currentLetter,
                isHidden: idx < currentLetter
            };
        });
    }, [letters, currentLetter, marginLeft]);

    useEffect(() => {
        const completionPercentage = currentLetter / letters.length;
        if (completionPercentage > 0.25 && speed > maxSpeed) {
            setSpeed(Math.min(maxSpeed * completionPercentage, maxSpeed));
        }
    }, [currentLetter, letters, speed]);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS) {
            setIsCollided(false);
            setMarginLeft(MARGIN_LEFT);
            setSpeed(minSpeed);
        }
    }, [status]);

    useTickerCallback({
        isEnabled: !isCollided && status === GameStatus.IN_PROGRESS,
        callback: () => {
            setMarginLeft((prev) => prev + speed);
        }
    });

    useEffect(() => {
        load("scene", [
            {
                src: background,
                alias: BACKGROUND_TEXTURE_ALIAS
            },
            {
                src: hero,
                alias: HERO_TEXTURE_ALIAS
            },
            {
                src: letterBackground,
                alias: LETTER_BACKGROUND_ALIAS
            }
        ]);

        return () => {
            unload("scene");
        };
    }, []);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            onLetterSelected(e.key.toLocaleUpperCase());
        },
        [onLetterSelected, currentLetter]
    );

    useGlobalEventHandler({ event: "keydown", callback: onKeyDown, isEnabled: status === GameStatus.IN_PROGRESS });

    useCollisionDetection({
        isEnabled: !isCollided,
        objectA: heroRef.current,
        objectB: letterRef.current,
        onCollide: () => {
            setIsCollided(true);
            setTimeout(() => {
                stop();
            }, 2000);
        }
    });

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS || status === GameStatus.READY) {
            inputRef.current?.focus();
            setTimeout(() => {
                inputRef?.current?.scrollIntoView();
            }, 100);
        }
    }, [status, inputRef.current]);

    if (!isFetched || isFetching) {
        return null;
    }

    return (
        <Camera>
            <SpellingSpreeBoard isEnabled={!isCollided && status === GameStatus.IN_PROGRESS} />
            <Layer>
                {lettersToDraw.map(({ uid, letter, isHidden, x, isCurrent }) => (
                    <SpellingSpreeLetter
                        ref={!isHidden && isCurrent ? letterRef : null}
                        key={`${uid}`}
                        letter={letter}
                        x={x}
                        isHidden={isHidden}
                    />
                ))}
                <SpellingSpreeHero ref={heroRef} isCollided={isCollided} />
            </Layer>
            <input type="text" ref={inputRef} style={{ opacity: 0, bottom: 0, position: "absolute", zIndex: -1 }} />
        </Camera>
    );
};
