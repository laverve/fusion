import { MazeAssets } from "../types";

export const getCellAsset = (assets: MazeAssets, c: number, t: number, r: number, b: number, l: number) => {
    if (!c) {
        return null;
    }
    if (t && r && l && b) {
        return assets.crossIntersection || null;
    }
    if (r && t && b && !l) {
        return assets.tIntersectionRight || null;
    }
    if (l && t && b && !r) {
        return assets.tIntersectionLeft || null;
    }
    if (l && t && !b && r) {
        return assets.tIntersectionTop || null;
    }
    if (l && !t && b && r) {
        return assets.tIntersectionBottom || null;
    }
    if (t && b && !l && !r) {
        return assets.vertical || null;
    }
    if (l && r && !t && !b) {
        return assets.horizontal || null;
    }
    if (l && b && !t && !r) {
        return assets.topRightCorner;
    }
    if (r && b && !t && !l) {
        return assets.topLeftCorner;
    }
    if (l && t && !b && !r) {
        return assets.bottomRightCorner;
    }
    if (r && t && !b && !l) {
        return assets.bottomLeftCorner;
    }
    if (r) {
        return assets.closureRight;
    }
    if (t) {
        return assets.closureTop;
    }
    if (l) {
        return assets.closureLeft;
    }
    if (b) {
        return assets.closureBottom;
    }
    return null;
};
