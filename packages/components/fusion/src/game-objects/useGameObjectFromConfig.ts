import { useCallback, useState } from "react";
import { DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Body } from "matter-js";
import { useDisplayObjectFromConfig } from "./useDisplayObjectFromConfig";
import { usePhysicalObjectFromConfig } from "./usePhysicalObjectFromConfig";
import { GameObjectDisplayObjectConfig } from "./GameObjectDisplayObjectConfig";
import { GameObjectPhysicalObjectConfig } from "./GameObjectPhysicalObjectConfig";
import { usePhysicsTickerCallback } from "../physics/usePhysicsTickerCallback";
import { Nullable } from "../types";

type GameObjectConfig = {
    position?: { x: number; y: number };
    physicalObject?: Omit<GameObjectPhysicalObjectConfig, "position">;
    displayObject: Omit<GameObjectDisplayObjectConfig, "position">;
};

export const useGameObjectFromConfig = <
    DisplayObjectType extends Nullable<DisplayObject> = Sprite,
    PhysicalObjectType extends Nullable<Body> = Body
>({
    displayObject: displayObjectConfig,
    physicalObject: physicalObjectConfig,
    position
}: GameObjectConfig) => {
    const [state, setState] = useState({
        position: position || { x: 0, y: 0 },
        angle: 0
    });

    const { physicalObject } = usePhysicalObjectFromConfig<PhysicalObjectType>({
        ...physicalObjectConfig,
        position
    });

    const { displayObject } = useDisplayObjectFromConfig<DisplayObjectType>({
        ...displayObjectConfig,
        position
    });

    const onAfterUpdate = useCallback(() => {
        if (!displayObject || !physicalObject) {
            return;
        }

        displayObject.x = physicalObject.position.x;
        displayObject.y = physicalObject.position.y;
        displayObject.angle = physicalObject.angle;

        setState({
            position: physicalObject.position,
            angle: physicalObject.angle
        });
    }, [physicalObject?.id, displayObject]);

    usePhysicsTickerCallback({
        isEnabled: true,
        callback: onAfterUpdate
    });

    return {
        physicalObject,
        displayObject,
        state
    };
};
