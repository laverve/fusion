import { useEffect, useContext } from "react";

import { DisplayObject } from "@pixi/display";
import { StageContext } from "../stage/Stage.context";
import { Nullable } from "../types";

export const useDisplayObject = ({ displayObject }: { displayObject: Nullable<DisplayObject> }) => {
    const { addObject, removeObject } = useContext(StageContext);

    useEffect(() => {
        if (!displayObject) {
            return () => {};
        }

        addObject(displayObject);

        return () => {
            removeObject(displayObject);
        };
    }, [displayObject]);

    return {
        displayObject
    };
};
