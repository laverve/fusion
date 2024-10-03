import { MazeGrid, MazeMoveDirection } from "../types";

export const move = (grid: MazeGrid, direction: MazeMoveDirection, location: { x: number; y: number }) => {
    const newLocation = { ...location };
    switch (direction) {
        case "down":
            newLocation.y += 1;
            break;
        case "up":
            newLocation.y -= 1;
            break;
        case "left":
            newLocation.x -= 1;
            break;
        case "right":
            newLocation.x += 1;
            break;
        default:
            break;
    }
    if (newLocation.x > -1 && newLocation.y > -1 && grid?.[newLocation.y]?.[newLocation.x] === 1) {
        return {
            isMoved: true,
            location: newLocation
        };
    }
    return { isMoved: false, location };
};
