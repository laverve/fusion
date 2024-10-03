import { useMemo } from "react";

export type UseBoardMeasuresOptions = {
    tileSize: { width: number; height: number };
    boardSize: { width: number; height: number };
    minPadding: number;
    cols: number;
    rows: number;
};

export const useBoardMeasures = ({ boardSize, tileSize, minPadding, cols, rows }: UseBoardMeasuresOptions) => {
    const tileAspectRatio = useMemo(() => {
        const wAspectRatio = (boardSize.width - minPadding * 2) / cols / tileSize.width;
        const hAspectRatio = (boardSize.height - minPadding * 2) / rows / tileSize.height;
        return Math.min(wAspectRatio, hAspectRatio);
    }, [boardSize, cols, rows, tileSize]);

    const paddingX = useMemo(
        () => (boardSize.width - tileAspectRatio * tileSize.width * cols) / 2,
        [boardSize, tileSize, cols, tileAspectRatio]
    );
    const paddingY = useMemo(
        () => (boardSize.height - tileAspectRatio * tileSize.height * rows) / 2,
        [boardSize, tileSize, rows, tileAspectRatio]
    );

    const finalTileSize = useMemo(
        () => ({
            width: tileSize.width * tileAspectRatio,
            height: tileSize.height * tileAspectRatio
        }),
        [tileSize, tileAspectRatio]
    );

    return useMemo(
        () => ({
            tileAspectRatio,
            padding: { x: paddingX, y: paddingY },
            tile: finalTileSize
        }),
        [paddingX, paddingY, finalTileSize, tileAspectRatio]
    );
};
