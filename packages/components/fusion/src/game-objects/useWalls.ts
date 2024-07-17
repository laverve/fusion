import { useContext, useEffect, useMemo } from "react";
import { Bodies, Body, Composite } from "matter-js";
import { MatterPhysicsContext } from "../physics/MatterPhysics.context";

type WallOptions = {
    thikness: number;
};

type UseWallsOptions = {
    left?: Partial<WallOptions> | boolean;
    right?: Partial<WallOptions> | boolean;
    top?: Partial<WallOptions> | boolean;
    bottom?: Partial<WallOptions> | boolean;
};

const DEFAULT_WALL_CONFIG: WallOptions = {
    thikness: 10
};

export const useWalls = ({ left = true, right = true, top = true, bottom = true }: UseWallsOptions = {}) => {
    const { config } = useContext(MatterPhysicsContext);
    const { height, width } = config.world;
    const center = {
        x: width / 2,
        y: height / 2
    };

    const { addBody, removeBody } = useContext(MatterPhysicsContext);

    const body = useMemo(() => {
        const walls = Composite.create();
        const parts: Body[] = [];

        if (left) {
            const leftWallConfig = Object.assign(DEFAULT_WALL_CONFIG, typeof left === "boolean" ? {} : { ...left });
            const leftWallPosition = { x: 0, y: center.y };
            parts.push(
                Bodies.rectangle(leftWallPosition.x, leftWallPosition.y, leftWallConfig.thikness, height, {
                    isStatic: true,
                    label: "left-wall"
                })
            );
        }

        if (right) {
            const rightWallConfig = Object.assign(DEFAULT_WALL_CONFIG, typeof right === "boolean" ? {} : { ...right });
            const rightWallPosition = { x: width, y: center.y };
            parts.push(
                Bodies.rectangle(rightWallPosition.x, rightWallPosition.y, rightWallConfig.thikness, height, {
                    isStatic: true,
                    label: "right-wall"
                })
            );
        }

        if (top) {
            const topWallConfig = Object.assign(DEFAULT_WALL_CONFIG, typeof top === "boolean" ? {} : { ...top });
            const topWallPosition = { x: center.x, y: 0 };
            parts.push(
                Bodies.rectangle(topWallPosition.x, topWallPosition.y, width, topWallConfig.thikness, {
                    isStatic: true,
                    label: "top-wall"
                })
            );
        }

        if (bottom) {
            const bottomWallConfig = Object.assign(
                DEFAULT_WALL_CONFIG,
                typeof bottom === "boolean" ? {} : { ...bottom }
            );
            const bottomWallPosition = { x: center.x, y: height };
            parts.push(
                Bodies.rectangle(bottomWallPosition.x, bottomWallPosition.y, width, bottomWallConfig.thikness, {
                    isStatic: true,
                    label: "bottom-wall"
                })
            );
        }

        Composite.add(walls, parts);

        return walls;
    }, [width, height]);

    useEffect(() => {
        addBody(body);

        return () => {
            removeBody(body);
        };
    }, [body.id]);
};
