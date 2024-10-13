import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { Asset, AssetsManagerContext, AssetsManagerContextValue } from "./AssetsManager.context";
import { Assets } from "pixi.js";

export const AssetsManager: React.FC<PropsWithChildren> = ({ children }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [isFetched, setIsFetched] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<unknown>();

    useEffect(() => {
        Assets.cache.reset();
    }, []);

    const load = useCallback(
        async (groupId: string, localAsset: Asset[]) => {
            try {
                Assets.addBundle(groupId, localAsset);
                await Assets.loadBundle(groupId);
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

    const unload = useCallback((groupId: string) => {
        Assets.unloadBundle(groupId);
    }, []);

    const getAsset = useCallback((alias: string) => {
        return Assets.get(alias);
    }, []);

    const conextValue = useMemo<AssetsManagerContextValue>(
        () => ({
            load,
            unload,
            getAsset,
            isFetching,
            isFetched,
            isError,
            error
        }),
        [load, unload, getAsset, isFetching, isFetched, isError, error]
    );

    return <AssetsManagerContext.Provider value={conextValue}>{children}</AssetsManagerContext.Provider>;
};
