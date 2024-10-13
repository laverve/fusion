import React, {
    useState,
    TouchEvent,
    MouseEvent,
    useContext,
    useEffect,
    useRef,
    useMemo,
    useLayoutEffect
} from "react";
import classnames from "classnames";
import { v4 as uuid } from "uuid";
import { parseToRgba, toHex } from "color2k";
import { GameContext, GameStatus } from "@laverve/fusion";
import { WordSearchContext } from "./WordSearch.context";
import { generatePath, generateSVGPath } from "./lib/path";
import { WordSearchBoardCell } from "./types";

export type WordSearchBoardProps = {
    classNames?: Record<"container" | "cell", string>;
    width: number;
    height: number;
};

export const WordSearchBoard: React.FC<WordSearchBoardProps> = ({
    width,
    height,
    classNames = { container: "", cell: "" }
}: WordSearchBoardProps) => {
    const { foundWords, onMiss, onWordFound, grid, gridCells, words, selectedWordsColors } =
        useContext(WordSearchContext);
    const { status } = useContext(GameContext);

    const lowerCasedWords = useMemo(() => words.map((w) => w.toLowerCase()), [words]);
    const lowerCasedFoundWords = useMemo(() => foundWords.map((w) => w.toLowerCase()), [foundWords]);

    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [selectedCells, setSelectedCells] = useState<Map<string, boolean>>(new Map());
    const [startCellBlock, setStartCellBlock] = useState<HTMLDivElement | null>(null);
    const [endCellBlock, setEndCellBlock] = useState<HTMLDivElement | null>(null);
    const [selectedPathWidth, setSelectedPathWidth] = useState<number>(1);
    const [hScale, setHScale] = useState<number>(1);
    const [vScale, setVScale] = useState<number>(1);
    const [highlightedPath, setHighlightedPath] = useState("");
    const [selectedPaths, setSelectedPaths] = useState<
        { key: string; path: string; startCell?: WordSearchBoardCell; endCell?: WordSearchBoardCell }[]
    >([]);

    const selectedWordsColorsWithOpacity = useMemo(
        () =>
            selectedWordsColors.map((color) => {
                const [r, g, b] = parseToRgba(color);
                return toHex(`rgba(${r},${g},${b},0.5)`);
            }),
        [selectedWordsColors]
    );

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS || status === GameStatus.READY) {
            setSelectedPaths([]);
            setSelectedCells(new Map());
            setStartCellBlock(null);
            setEndCellBlock(null);
            setHighlightedPath("");
        }
    }, [status]);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const w = containerRef.current.children?.[0]?.getBoundingClientRect()?.width ?? 4;
            const h = containerRef.current.children?.[0]?.getBoundingClientRect()?.height ?? 4;
            const min = Math.min(w, h);
            if (selectedPathWidth !== min / 1.5) {
                setSelectedPathWidth(min / 1.5);
            }
        }
    }, [containerRef?.current?.getBoundingClientRect()]);

    useEffect(() => {
        if (!svgRef.current) {
            return;
        }

        const onResize = () => {
            if (!svgRef.current) {
                return;
            }
            const { width: svgWidth, height: svgHeight } = svgRef.current?.getBoundingClientRect() ?? {
                width,
                height
            };
            const newHScale = svgWidth / width;
            const newVScale = svgHeight / height;
            if (newHScale !== hScale) {
                setHScale(newHScale);
            }
            if (newVScale !== vScale) {
                setVScale(newVScale);
            }
        };

        onResize();

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [svgRef, containerRef, hScale, vScale, width, height, selectedPathWidth, selectedPaths]);

    useEffect(() => {
        const onResize = () => {
            if (!containerRef?.current) {
                return;
            }

            setSelectedPaths(
                selectedPaths.map((selectedPath) => {
                    return {
                        ...selectedPath,
                        path: generateSVGPath({
                            vScale,
                            hScale,
                            startCell: containerRef?.current?.querySelector(
                                `[data-key="${selectedPath.startCell?.row}-${selectedPath.startCell?.col}"]`
                            ),
                            endCell: containerRef?.current?.querySelector(
                                `[data-key="${selectedPath.endCell?.row}-${selectedPath.endCell?.col}"]`
                            ),
                            container: containerRef.current
                        })
                    };
                })
            );
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [containerRef.current, hScale, vScale, selectedPaths]);

    const updateSelectedPath = ({
        startCell,
        endCell
    }: {
        startCell?: HTMLDivElement | null;
        endCell?: HTMLDivElement | null;
    }) => {
        setHighlightedPath(generateSVGPath({ vScale, hScale, startCell, endCell, container: containerRef.current }));
    };

    const updateSelectedCells = (path: string[]) => {
        path.forEach((key) => selectedCells.set(key, true));
        setSelectedCells(selectedCells);
    };

    const isGameInProgress = () => {
        return status === GameStatus.IN_PROGRESS;
    };

    const onMouseUp = () => {
        if (!isGameInProgress()) {
            return;
        }

        const startCell = gridCells.get(startCellBlock?.getAttribute("data-key") ?? "");
        const endCell = gridCells.get(endCellBlock?.getAttribute("data-key") ?? "");
        const path = generatePath(startCell, endCell);

        if (path.length > 0) {
            const word = path
                .map((key) => gridCells.get(key)?.label.toLowerCase())
                .filter((c) => c)
                .join("");

            const foundIdx = lowerCasedWords.findIndex((w) => w === word);
            const foundEarlierIdx = lowerCasedFoundWords.findIndex((w) => w === word);

            if (foundIdx > -1 && foundEarlierIdx < 0) {
                onWordFound(words[foundIdx]);
                updateSelectedCells(path);
                setSelectedPaths([...selectedPaths, { key: uuid(), path: highlightedPath, startCell, endCell }]);
            }
        }

        onMiss();

        setIsSelecting(false);
        setEndCellBlock(null);
    };

    const onInteractionStart = (event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
        if (!isGameInProgress()) {
            return;
        }

        const target = event.target as HTMLDivElement;
        const key = target.getAttribute("data-key");
        if (key && containerRef.current) {
            setIsSelecting(true);
            setStartCellBlock(target);
            updateSelectedPath({
                startCell: target,
                endCell: target
            });
        }
    };

    const updateSelectedPathFromEventTarget = (target: HTMLDivElement) => {
        if (!isSelecting || !target.getAttribute("data-key")) {
            return;
        }

        const key = target.getAttribute("data-key");

        if (!key) {
            return;
        }

        const cell = gridCells.get(key);

        if (!cell) {
            return;
        }

        updateSelectedPath({
            startCell: startCellBlock,
            endCell: target
        });

        setEndCellBlock(target);
    };

    const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!isGameInProgress()) {
            return;
        }

        updateSelectedPathFromEventTarget(event.target as HTMLDivElement);
    };

    const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
        if (!isGameInProgress()) {
            return;
        }

        const cells = event.currentTarget.children;
        const { clientX, clientY } = event.touches[0];

        for (let i = 0; i < cells.length; i++) {
            const cell = cells.item(i);
            if (cell) {
                const bbox = cell.getBoundingClientRect();
                if (
                    clientX >= bbox.left &&
                    clientX <= bbox.left + bbox.width &&
                    clientY >= bbox.top &&
                    clientY <= bbox.top + bbox.height
                ) {
                    updateSelectedPathFromEventTarget(cell as HTMLDivElement);
                    break;
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("touchend", onMouseUp);
        return () => {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("touchend", onMouseUp);
        };
    }, [onMouseUp]);

    const highlightColor = selectedWordsColorsWithOpacity[selectedPaths.length % selectedWordsColorsWithOpacity.length];

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            className="touch-none"
            ref={svgRef}
            style={{
                width: width,
                height: height
            }}
        >
            <foreignObject x="0" y="0" width={width} height={height}>
                <div
                    data-testid="testid-wordsearch-board"
                    className={classnames(
                        "bg-divider",
                        "border-divider",
                        "border-0",
                        "p-1",
                        "gap-1",
                        classNames?.container ?? "",
                        "grid",
                        "box-border",
                        { "blur-sm": !isGameInProgress() }
                    )}
                    style={{
                        height,
                        width,
                        gridTemplateColumns: `repeat(${grid?.[0]?.length || 1}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${grid?.length || 1}, minmax(0, 1fr))`
                    }}
                    onMouseDown={onInteractionStart}
                    onMouseMove={onMouseMove}
                    onTouchStart={onInteractionStart}
                    onTouchMove={onTouchMove}
                    role="button"
                    tabIndex={0}
                    ref={containerRef}
                >
                    {grid.flatMap((row, rowId) =>
                        row.map((char, colId) => (
                            <div
                                key={gridCells.get(`${rowId}-${colId}`)?.key}
                                data-testid={`testid-${rowId}-${colId}`}
                                className={classnames(
                                    "uppercase",
                                    "cursor-pointer",
                                    "bg-content1",
                                    classNames.cell,
                                    "flex",
                                    "items-center",
                                    "justify-center"
                                )}
                                data-key={`${rowId}-${colId}`}
                            >
                                {char}
                            </div>
                        ))
                    )}
                </div>
            </foreignObject>
            {selectedPaths.map(({ key, path }, i) => (
                <path
                    key={key}
                    d={path}
                    stroke={selectedWordsColorsWithOpacity[i % selectedWordsColorsWithOpacity.length]}
                    strokeWidth={selectedPathWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    pointerEvents="none"
                />
            ))}
            {isSelecting && (
                <path
                    d={highlightedPath}
                    stroke={highlightColor}
                    strokeWidth={selectedPathWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    pointerEvents="none"
                />
            )}
        </svg>
    );
};
