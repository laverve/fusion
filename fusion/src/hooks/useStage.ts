import { useContext } from "react";

import { StageContext } from "../stage/Stage.context";

export const useStage = () => {
    return useContext(StageContext);
};
