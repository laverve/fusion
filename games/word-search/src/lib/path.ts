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
