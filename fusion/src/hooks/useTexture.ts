import { useMemo } from "react";

import { Texture } from "pixi.js";
import { useAssetManager } from "../assets-manager";

export const useTextures = ({ keys = [] }: { keys?: string[] }) => {
    const { getAsset, isFetched, isFetching, isError } = useAssetManager();

    const textures = useMemo(() => {
        return isFetched ? keys.map((key) => getAsset(key) as Texture) : [];
    }, [keys, isFetched, isFetching, isError]);

    return useMemo(
        () => ({
            textures: textures,
            isFetched,
            isFetching,
            isError
        }),
        [textures, isFetched, isError, isFetching]
    );
};
