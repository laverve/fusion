import Matter from "matter-js";

export type MatterPhysicsDebugConvexHullConfig = {
    strokeColor?: string;
    strokeWidth?: number;
};

export type MatterPhysicsConfig = {
    world: {
        width: number;
        height: number;
    };
    debug?: {
        convexHull?: MatterPhysicsDebugConvexHullConfig;
        showConvexHull?: boolean;
    };
};

export type MatterPhysics = {
    readonly config: MatterPhysicsConfig;
    readonly runner: Matter.Runner;
    readonly engine: Matter.Engine;
    run: () => void;
    stop: () => void;
    addBody: (body: Matter.Body | Matter.Composite) => void;
    removeBody: (body: Matter.Body | Matter.Composite) => void;
};
