import React, { useState } from "react";
import { useTickerCallback, useTilingSprite, useWorld } from "@laverve/fusion";
import { BACKGROUND_TEXTURE_ALIAS } from "./helpers";

type SpellingSpreeBoardProps = {
    isEnabled: boolean;
};

export const SpellingSpreeBoard: React.FC<SpellingSpreeBoardProps> = ({ isEnabled }) => {
    const { size } = useWorld();
    const [tilePosition, setTilePosition] = useState({ x: 0, y: 0 });

    useTilingSprite({
        texture: BACKGROUND_TEXTURE_ALIAS,
        anchor: { x: 0.5, y: 0.5 },
        width: size.width,
        tilePosition
    });

    useTickerCallback({
        isEnabled: isEnabled,
        callback: () => {
            setTilePosition(({ x, y }) => ({ x: x - 1, y }));
        }
    });

    return null;
};
