import { useContext } from "react";

import { WorldContext } from "../world/World.context";

export const useWorld = () => {
    return useContext(WorldContext);
};
