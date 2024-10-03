import { useEffect, useState, useCallback, useMemo } from "react";

import { Assets, Texture, UnresolvedAsset } from "pixi.js";

export const useAssets = ({ assets = [] }: { assets?: UnresolvedAsset[] }) => {
    const [resolvedAssets, setResolvedAssets] = useState<Record<string, Texture>>({});
    const [isFetching, setIsFetching] = useState(false);
    const [isFetched, setIsFetched] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<unknown>();

    const load = useCallback(
        async (localAsset: UnresolvedAsset[]) => {
            try {
                const resolved = await Assets.load<Texture>(localAsset);
                setResolvedAssets(resolved);
                setIsFetched(true);
            } catch (e) {
                setIsError(true);
                setIsFetched(false);
                setError(e);
            } finally {
                setIsFetching(false);
            }
        },
        [isFetching, isError, isFetched, error]
    );

    useEffect(() => {
        if (isFetching || isFetched || isError) {
            return;
        }

        if (assets) {
            setIsError(false);
            setIsFetching(true);
            setIsFetched(false);
            load(assets);
        } else {
            setIsFetched(true);
            setIsError(false);
            setIsFetching(false);
        }
    }, [assets, isFetching, isError, isFetched]);

    return useMemo(
        () => ({
            assets: resolvedAssets,
            isError,
            isFetched,
            isFetching,
            error
        }),
        [resolvedAssets, isError, isFetched, isFetched, error]
    );
};
