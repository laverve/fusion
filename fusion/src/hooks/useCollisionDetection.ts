import { Container } from "pixi.js";
import { useTickerCallback } from "./useTickerCallback";
import { useCallback } from "react";

type UseCollisionDetectionOptions = {
    objectA?: Container | null;
    objectB?: Container | null;
    isEnabled: boolean;
    onCollide: () => void;
};

export const useCollisionDetection = ({ objectA, objectB, onCollide, isEnabled }: UseCollisionDetectionOptions) => {
    const testForAABB = useCallback(() => {
        if (!objectA || !objectB) {
            return;
        }

        const bounds1 = objectA.getBounds();
        const bounds2 = objectB.getBounds();

        if (
            bounds1.x < bounds2.x + bounds2.width &&
            bounds1.x + bounds1.width > bounds2.x &&
            bounds1.y < bounds2.y + bounds2.height &&
            bounds1.y + bounds1.height > bounds2.y
        ) {
            onCollide();
        }
    }, [objectA, objectB, onCollide]);

    useTickerCallback({
        isEnabled: isEnabled,
        callback: testForAABB
    });
};
