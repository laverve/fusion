import { useContext } from "react";
import { CameraContext } from "../camera";

export const useCamera = () => {
    return useContext(CameraContext);
};
