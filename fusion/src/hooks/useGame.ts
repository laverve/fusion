import { useContext } from "react";
import { GameContext } from "../game-context";

export const useGame = () => {
    return useContext(GameContext);
};
