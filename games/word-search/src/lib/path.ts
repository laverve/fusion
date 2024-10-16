import { WordSearchBoardCell } from "../types";

export const isPathExist = (startCell?: WordSearchBoardCell | null, endCell?: WordSearchBoardCell | null) => {
    if (
        startCell &&
        endCell &&
        (startCell.row === endCell.row /* there is horizontal path */ ||
            startCell.col === endCell.col /* there is vertical path */ ||
            Math.abs(startCell.row - endCell.row) ===
                Math.abs(startCell.col - endCell.col)) /* there is diagonal path */
    ) {
        return true;
    }

    return false;
};

export const generatePath = (startCell?: WordSearchBoardCell | null, endCell?: WordSearchBoardCell | null) => {
    const path = [];
    if (startCell && endCell && isPathExist(startCell, endCell)) {
        const colDirection = startCell.col > endCell.col ? -1 : startCell.col === endCell.col ? 0 : 1;

        const rowDirection = startCell.row > endCell.row ? -1 : startCell.row === endCell.row ? 0 : 1;
        let { col } = startCell;
        let { row } = startCell;
        do {
            path.push(`${row}-${col}`);
            col += colDirection;
            row += rowDirection;
        } while (col !== endCell.col || row !== endCell.row);
        path.push(`${endCell.row}-${endCell.col}`);
    }
    return path;
};

export const generateSVGPath = ({
    startCell,
    endCell,
    container,
    hScale,
    vScale
}: {
    startCell?: HTMLDivElement | null;
    endCell?: HTMLDivElement | null;
    container?: HTMLDivElement | null;
    hScale: number;
    vScale: number;
}) => {
    if (!startCell || !endCell || !container) {
        return "";
    }

    const startCellBoundingClientRect = startCell.getBoundingClientRect();
    const endCellBoundingClientRect = endCell.getBoundingClientRect();
    const containerClientBoundingRect = container.getBoundingClientRect();

    const normalizedStart = {
        x:
            (startCellBoundingClientRect.x -
                (containerClientBoundingRect?.left ?? 0) +
                startCellBoundingClientRect.width * 0.5) /
            hScale,
        y:
            (startCellBoundingClientRect.y -
                (containerClientBoundingRect?.top ?? 0) +
                startCellBoundingClientRect.height * 0.5) /
            vScale
    };

    const normalizedEnd = {
        x:
            (endCellBoundingClientRect.x -
                (containerClientBoundingRect?.left ?? 0) +
                startCellBoundingClientRect.width * 0.5) /
            hScale,
        y:
            (endCellBoundingClientRect.y -
                (containerClientBoundingRect?.top ?? 0) +
                startCellBoundingClientRect.height * 0.5) /
            vScale
    };

    return `M ${normalizedStart.x - 1} ${normalizedStart.y - 1} L ${normalizedEnd.x + 1} ${normalizedEnd.y - 1} `;
};
