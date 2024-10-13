import { Container } from "pixi.js";
import { createContext } from "react";

export type EnsureVisibleOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
    resizeToFit?: boolean;
};

export type CameraContextValue = {
    follow: (object: Container) => void;
    ensureVisible: (options: EnsureVisibleOptions) => void;
};

export const CameraContext = createContext<CameraContextValue>({} as unknown as CameraContextValue);
