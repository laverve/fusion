import {
    CROSS_INTERSECTION_TEXTURE_ALIAS,
    HORIZONTAL_ROAD_TEXTURE_ALIAS,
    ROAD_BOTTOM_RIGHT_CORNER_TEXTURE_ALIAS,
    T_INTERSECTION_BOTTOM_TEXTURE_ALIAS,
    T_INTERSECTION_LEFT_TEXTURE_ALIAS,
    T_INTERSECTION_RIGHT_TEXTURE_ALIAS,
    T_INTERSECTION_TOP_TEXTURE_ALIAS,
    ROAD_TOP_LEFT_CORNER_TEXTURE_ALIAS,
    ROAD_TOP_RIGHT_CORNER_TEXTURE_ALIAS,
    VERTICAL_ROAD_TEXTURE_ALIAS,
    ROAD_BOTTOM_LEFT_CORNER_TEXTURE_ALIAS,
    ROAD_CLOSURE_RIGHT_TEXTURE_ALIAS,
    ROAD_CLOSURE_TOP_TEXTURE_ALIAS,
    ROAD_CLOSURE_LEFT_TEXTURE_ALIAS,
    ROAD_CLOSURE_BOTTOM_TEXTURE_ALIAS
} from "../helpers";

export const getCellAsset = (c: number, t: number, r: number, b: number, l: number) => {
    if (!c) {
        return null;
    }
    if (t && r && l && b) {
        return CROSS_INTERSECTION_TEXTURE_ALIAS || null;
    }
    if (r && t && b && !l) {
        return T_INTERSECTION_RIGHT_TEXTURE_ALIAS || null;
    }
    if (l && t && b && !r) {
        return T_INTERSECTION_LEFT_TEXTURE_ALIAS || null;
    }
    if (l && t && !b && r) {
        return T_INTERSECTION_TOP_TEXTURE_ALIAS || null;
    }
    if (l && !t && b && r) {
        return T_INTERSECTION_BOTTOM_TEXTURE_ALIAS || null;
    }
    if (t && b && !l && !r) {
        return VERTICAL_ROAD_TEXTURE_ALIAS || null;
    }
    if (l && r && !t && !b) {
        return HORIZONTAL_ROAD_TEXTURE_ALIAS || null;
    }
    if (l && b && !t && !r) {
        return ROAD_TOP_RIGHT_CORNER_TEXTURE_ALIAS;
    }
    if (r && b && !t && !l) {
        return ROAD_TOP_LEFT_CORNER_TEXTURE_ALIAS;
    }
    if (l && t && !b && !r) {
        return ROAD_BOTTOM_RIGHT_CORNER_TEXTURE_ALIAS;
    }
    if (r && t && !b && !l) {
        return ROAD_BOTTOM_LEFT_CORNER_TEXTURE_ALIAS;
    }
    if (r) {
        return ROAD_CLOSURE_RIGHT_TEXTURE_ALIAS;
    }
    if (t) {
        return ROAD_CLOSURE_TOP_TEXTURE_ALIAS;
    }
    if (l) {
        return ROAD_CLOSURE_LEFT_TEXTURE_ALIAS;
    }
    if (b) {
        return ROAD_CLOSURE_BOTTOM_TEXTURE_ALIAS;
    }
    return null;
};
