import { Body, Composite } from "matter-js";
import { useContext, useEffect } from "react";
import { MatterPhysicsContext } from "../physics";
import { Nullable } from "../types";

export const usePhysicalObject = ({ physicalObject }: { physicalObject: Nullable<Body | Composite> }) => {
    const { addBody, removeBody } = useContext(MatterPhysicsContext);

    useEffect(() => {
        if (!physicalObject) {
            return () => {};
        }

        addBody(physicalObject);

        return () => {
            removeBody(physicalObject);
        };
    }, [physicalObject?.id]);

    return {
        physicalObject
    };
};
