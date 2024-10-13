import { useContext } from "react";
import { LayerContext } from "../layer/Layer.context";

export const useLayerContext = () => {
    return useContext(LayerContext);
};
