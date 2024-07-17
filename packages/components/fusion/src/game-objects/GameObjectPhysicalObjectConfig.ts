import { IBodyDefinition } from "matter-js";

type PhysicalObjectConfig = Pick<
    IBodyDefinition,
    | "vertices"
    | "label"
    | "inertia"
    | "position"
    | "friction"
    | "frictionAir"
    | "frictionStatic"
    | "parts"
    | "isStatic"
    | "isSensor"
    | "collisionFilter"
>;

export type GameObjectPhysicalObjectConfig = PhysicalObjectConfig;
