import React, { useState, TouchEvent, MouseEvent, useContext, useEffect, useRef, useMemo } from "react";
import classnames from "classnames";
import { v4 as uuid } from "uuid";
import { parseToRgba, toHex } from "color2k";
import { GameContext, GameStatus } from "@laverve/fusion";
import { WordSearchContext } from "./WordSearch.context";
import { generatePath } from "./lib/path";

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
    const { foundWords, onWordFound, grid, gridCells, words, selectedWordsColors } = useContext(WordSearchContext);
    const { status } = useContext(GameContext);

    const lowerCasedWords = useMemo(() => words.map((w) => w.toLowerCase()), [words]);
    const lowerCasedFoundWords = useMemo(() => foundWords.map((w) => w.toLowerCase()), [foundWords]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [selectedCells, setSelectedCells] = useState<Map<string, boolean>>(new Map());
    const [startCellBlock, setStartCellBlock] = useState<HTMLDivElement | null>(null);
    const [endCellBlock, setEndCellBlock] = useState<HTMLDivElement | null>(null);
    const [selectedPathWidth, setSelectedPathWidth] = useState<number>(1);
    const [highlightedPath, setHighlightedPath] = useState("");
    const [selectedPaths, setSelectedPaths] = useState<{ key: string; path: string }[]>([]);

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

    useEffect(() => {
        if (containerRef.current) {
            setSelectedPathWidth((containerRef.current.children?.[0]?.getBoundingClientRect()?.width ?? 4) / 1.5);
        }
    }, [containerRef]);

    const updateSelectedPath = ({
        startCell,
        endCell
    }: {
        startCell?: HTMLDivElement | null;
        endCell?: HTMLDivElement | null;
    }) => {
        if (!startCell || !endCell || !containerRef.current) {
            return;
        }

        const startCellBoundingClientRect = startCell.getBoundingClientRect();
        const endCellBoundingClientRect = endCell.getBoundingClientRect();
        const containerClientBoundingRect = containerRef.current.getBoundingClientRect();

        const normalizedStart = {
            x:
                startCellBoundingClientRect.x -
                (containerClientBoundingRect?.left ?? 0) +
                startCellBoundingClientRect.width * 0.5,
            y:
                startCellBoundingClientRect.y -
                (containerClientBoundingRect?.top ?? 0) +
                startCellBoundingClientRect.height * 0.5
        };

        const normalizedEnd = {
            x:
                endCellBoundingClientRect.x -
                (containerClientBoundingRect?.left ?? 0) +
                startCellBoundingClientRect.width * 0.5,
            y:
                endCellBoundingClientRect.y -
                (containerClientBoundingRect?.top ?? 0) +
                startCellBoundingClientRect.height * 0.5
        };

        setHighlightedPath(
            `M ${normalizedStart.x - 1} ${normalizedStart.y - 1} L ${normalizedEnd.x + 1} ${normalizedEnd.y - 1} `
        );
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
                setSelectedPaths([...selectedPaths, { key: uuid(), path: highlightedPath }]);
            }
        }

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
            style={{
                width: "100%"
            }}
        >
            <foreignObject x="0" y="0" width={width} height={height}>
                <div
                    data-testid="testid-wordsearch-board"
                    className={classnames(
                        "bg-divider",
                        "border-divider",
                        "p-1",
                        "gap-1",
                        classNames?.container ?? "",
                        "grid",
                        "box-border",
                        `grid-cols-${grid?.[0]?.length || 1}`,
                        `grid-rows-${grid?.length || 1}`,
                        { "blur-sm": !isGameInProgress() }
                    )}
                    style={{
                        height,
                        width,
                        borderWidth: "initial !important"
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
                                    "bg-foreground",
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
