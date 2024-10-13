import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DisplayObjectType, GameStatus, useDisplayObject, useGame, useGlobalEventHandler } from "@laverve/fusion";
import { MazeContext } from "./Maze.context";

export const MazeHero: React.FC = () => {
    const { tileSize, padding, tileAspectRatio, grid, move, hero } = useContext(MazeContext);
    const { status } = useGame();
    const heroDisplayObjectConfig = useMemo(
        () => ({
            type: DisplayObjectType.SPRITE,
            asset: { src: hero.asset, alias: "hero" },
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: tileAspectRatio, y: tileAspectRatio }
        }),
        [hero.asset]
    );

    const heroPosition = useMemo(() => {
        const x = padding.x + hero.location.x * tileSize.width + tileSize.width / 2;
        const y = padding.y + hero.location.y * tileSize.height + tileSize.height / 2;
        return { x, y };
    }, [hero.location, padding, tileSize]);

    const [direction, setDirection] = useState<number | null>(null);

    useEffect(() => {
        if (direction !== null) {
            return;
        }
        const t = grid?.[hero.location.y - 1]?.[hero.location.x];
        const b = grid?.[hero.location.y + 1]?.[hero.location.x];
        const l = grid?.[hero.location.y]?.[hero.location.x - 1];
        const r = grid?.[hero.location.y]?.[hero.location.x + 1];

        if (l) {
            setDirection(-90);
        } else if (r) {
            setDirection(90);
        } else if (t) {
            setDirection(-180);
        } else if (b) {
            setDirection(180);
        } else {
            setDirection(0);
        }
    }, [hero.location, grid, direction]);

    useDisplayObject({
        ...heroDisplayObjectConfig,
        position: heroPosition,
        angle: direction || 0
    });

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    move("up");
                    setDirection(360);
                    break;
                case "ArrowDown":
                    move("down");
                    setDirection(180);
                    break;
                case "ArrowRight":
                    move("right");
                    setDirection(90);
                    break;
                case "ArrowLeft":
                    move("left");
                    setDirection(-90);
                    break;
                default:
                    break;
            }
        },
        [hero.location]
    );

    useGlobalEventHandler({ event: "keydown", callback: onKeyDown, isEnabled: status === GameStatus.IN_PROGRESS });

    return null;
};
