import { Texture } from "pixi.js";
import { createContext } from "react";

export type Asset = {
    src: string;
    alias: string;
};

export type AssetsManagerContextValue = {
    isFetching: boolean;
    isFetched: boolean;
    isError: boolean;
    error?: unknown;
    load: (groupId: string, asset: Asset[]) => Promise<void>;
    unload: (groupIdOrAlias: string) => void;
    getAsset: (alias: string) => Texture | undefined;
};

export const AssetsManagerContext = createContext<AssetsManagerContextValue>({
    isFetching: false,
    isFetched: false,
    isError: false
} as unknown as AssetsManagerContextValue);
