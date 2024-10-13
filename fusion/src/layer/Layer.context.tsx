import { createContext } from "react";
import { Container } from "pixi.js";

export type LayerContextValue = {
    addObject: (body: Container) => void;
    removeObject: (body: Container) => void;
};

export const LayerContext = createContext<LayerContextValue>({} as unknown as LayerContextValue);
