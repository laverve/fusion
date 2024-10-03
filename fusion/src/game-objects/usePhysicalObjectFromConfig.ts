import { Body } from "matter-js";
import { useMemo } from "react";
import { GameObjectPhysicalObjectConfig } from "./GameObjectPhysicalObjectConfig";
import { usePhysicalObject } from "./usePhysicalObject";
import { Nullable } from "../types";

export const usePhysicalObjectFromConfig = <PhysicalObjectType extends Nullable<Body> = Body>({
    position = { x: 0, y: 0 },
    ...physicalObjectConfig
}: GameObjectPhysicalObjectConfig) => {
    const physicalObject = useMemo(() => {
        if (physicalObjectConfig) {
            return Body.create({ position, ...physicalObjectConfig });
        }
        return null;
    }, []) as PhysicalObjectType;

    usePhysicalObject({ physicalObject });

    return { physicalObject };
};
