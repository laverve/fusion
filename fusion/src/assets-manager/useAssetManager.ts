import { useContext } from "react";

import { AssetsManagerContext } from "./AssetsManager.context";

export const useAssetManager = () => {
    return useContext(AssetsManagerContext);
};
