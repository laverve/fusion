import { GameContext, GameStatus } from "@laverve/fusion";
import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { MazeGrid, MazePoint, MazeMoveDirection, MazeHero, MazeResource, MazePredator } from "./types";
import { useBoardMeasures } from "./helpers/useBoardMeasures";
import { move } from "./helpers/move";

export type ResourceFoundEvent = { resources: MazeResource[] };
export type MetPredatorEvent = { predators: MazePredator[] };

export type MazeContextProviderEvents = {
    onExitFound?: () => unknown;
    onResourceFound?: (event: ResourceFoundEvent) => unknown;
    onMetPredator?: (event: MetPredatorEvent) => unknown;
};

export type MazeContextValue = {
    move: (direction: MazeMoveDirection) => void;
    reset: () => void;
    grid: MazeGrid;
    hero: MazeHero;
    exitPoint: MazePoint;
    resources: MazeResource[];
    predators: MazePredator[];
    tileAspectRatio: number;
    padding: { x: number; y: number };
    tileSize: { width: number; height: number };
};

export const MazeContext = createContext<MazeContextValue>({
    move: () => {},
    reset: () => {},
    exitPoint: { x: 0, y: 0 },
    grid: [],
    hero: { location: { x: 0, y: 0 }, asset: "" },
    resources: [],
    predators: [],
    tileAspectRatio: 1,
    padding: { x: 0, y: 0 },
    tileSize: { width: 10, height: 10 }
});

export type MazeContextProviderProps = PropsWithChildren &
    Pick<MazeContextValue, "exitPoint" | "grid"> &
    NonNullable<Pick<MazeContextValue, "hero">> &
    Partial<Pick<MazeContextValue, "resources" | "predators">> & {
        events?: MazeContextProviderEvents;
        tileSize: { width: number; height: number };
        boardSize: { width: number; height: number };
        minPadding: number;
    };

export const MazeContextProvider: React.FC<MazeContextProviderProps> = ({
    children,
    grid,
    events,
    hero,
    exitPoint,
    resources = [],
    predators = [],
    tileSize,
    boardSize,
    minPadding
}) => {
    const [heroLocation, setHeroLocation] = useState<MazePoint>(hero.location);
    const [mazeResources, setMazeResources] = useState<MazeResource[]>(resources);
    const [mazePredators, setMazePredators] = useState<MazePredator[]>(predators);
    const { status, stop, reset } = useContext(GameContext);

    const {
        tileAspectRatio,
        padding,
        tile: finalTileSize
    } = useBoardMeasures({
        boardSize,
        tileSize,
        minPadding,
        cols: grid?.[0]?.length,
        rows: grid?.length
    });

    const moveCallback = useCallback(
        (direction: MazeMoveDirection) => {
            if (status !== GameStatus.IN_PROGRESS) {
                return;
            }

            const { isMoved, location } = move(grid, direction, heroLocation);

            if (isMoved) {
                setHeroLocation(location);
            }
        },
        [heroLocation, grid, status]
    );

    const localReset = useCallback(() => {
        reset();
        setMazeResources(resources);
        setMazePredators(predators);
        setHeroLocation(hero.location);
    }, [reset, resources, predators, hero, exitPoint, grid]);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS || status === GameStatus.READY) {
            setMazeResources(resources);
            setMazePredators(predators);
            setHeroLocation(hero.location);
        }
    }, [status]);

    // handle found resources
    useEffect(() => {
        const objectsAtLocation = mazeResources.filter(
            (object) => object.location.x === heroLocation.x && object.location.y === heroLocation.y && !object.isFound
        );

        if (objectsAtLocation.length > 0) {
            events?.onResourceFound?.({ resources: objectsAtLocation });
            setMazeResources(
                mazeResources.map((resource) => ({
                    ...resource,
                    isFound:
                        (resource.location.x === heroLocation.x && resource.location.y === heroLocation.y) ||
                        resource.isFound
                }))
            );
        }
    }, [heroLocation, mazeResources, exitPoint]);

    // handle exit
    useEffect(() => {
        if (exitPoint.x === heroLocation.x && exitPoint.y === heroLocation.y) {
            events?.onExitFound?.();
            stop();
        }
    }, [heroLocation, mazeResources, exitPoint]);

    // handle predators
    useEffect(() => {
        const objectsAtLocation = mazePredators.filter(
            (object) => object.location.x === heroLocation.x && object.location.y === heroLocation.y
        );

        if (objectsAtLocation.length > 0) {
            events?.onMetPredator?.({ predators: objectsAtLocation });
            stop();
        }
    }, [mazePredators, heroLocation, grid, exitPoint]);

    // handle moves of predators
    const iteration = useRef(0);
    useEffect(() => {
        if (status !== GameStatus.IN_PROGRESS) {
            return () => {};
        }

        const timeout = setInterval(() => {
            const newPredators = mazePredators.map((predator) => {
                const { isMoved, location } = move(
                    grid,
                    predator.trajectory[iteration.current % predator.trajectory.length],
                    predator.location
                );
                return {
                    ...predator,
                    ...(isMoved ? { location } : {})
                };
            });

            setMazePredators(newPredators);
            iteration.current++;
        }, 1000);

        return () => clearInterval(timeout);
    }, [mazePredators, status]);

    const contextValue = useMemo(
        () => ({
            reset: localReset,
            move: moveCallback,
            grid,
            exitPoint,
            hero: { ...hero, location: { ...heroLocation } },
            resources: mazeResources,
            predators: mazePredators,
            tileAspectRatio,
            padding,
            tileSize: finalTileSize
        }),
        [
            grid,
            localReset,
            moveCallback,
            mazeResources,
            mazePredators,
            heroLocation,
            hero,
            exitPoint,
            tileAspectRatio,
            padding,
            finalTileSize
        ]
    );

    return <MazeContext.Provider value={contextValue}>{children}</MazeContext.Provider>;
};
