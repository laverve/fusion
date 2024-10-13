import { createContext } from "react";
import { Container } from "pixi.js";

export type StageContextValue = {
    addObject: (body: Container) => void;
    removeObject: (body: Container) => void;
};

export const StageContext = createContext<StageContextValue>({} as unknown as StageContextValue);
