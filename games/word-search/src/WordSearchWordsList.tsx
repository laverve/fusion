import React, { useContext, useMemo } from "react";
import classnames from "classnames";
import { parseToRgba, toHex, readableColor } from "color2k";
import { Button } from "@nextui-org/react";
import { WordSearchContext } from "./WordSearch.context";

export type WordSearchWordsListProps = {
    onWordClick?: (event: { word: string }) => unknown;
};

export const WordSearchWordsList: React.FC<WordSearchWordsListProps> = ({ onWordClick }: WordSearchWordsListProps) => {
    const { words, foundWords, selectedWordsColors } = useContext(WordSearchContext);

    const lowerCasedFoundWords = useMemo(() => foundWords.map((w) => w.toLowerCase()), [foundWords]);

    const isWordSelected = (word: string) => lowerCasedFoundWords.findIndex((w) => w === word.toLowerCase()) > -1;

    const selectedWordsColorsWithoutOpacity = useMemo(
        () =>
            selectedWordsColors.map((color) => {
                const [r, g, b] = parseToRgba(color);
                return toHex(`rgb(${r},${g},${b})`);
            }),
        [selectedWordsColors]
    );

    const getSelectedWordColor = (word: string) => {
        const idx = lowerCasedFoundWords.findIndex((w) => w === word.toLowerCase());
        return selectedWordsColorsWithoutOpacity[idx % selectedWordsColorsWithoutOpacity.length];
    };

    return (
        <div
            data-testid="testid-wordsearch-words-list"
            className={classnames("box-border", "justify-center", "items-center", "flex-1", "gap-1")}
        >
            {words.map((word) => (
                <Button
                    key={word}
                    color="default"
                    radius="full"
                    size="sm"
                    data-testid={`testid-${word.toLowerCase()}`}
                    className="m-1 px-2 py-1 !min-h-auto !h-auto !min-w-0 !w-auto"
                    style={{
                        ...(selectedWordsColorsWithoutOpacity.length > 0 && isWordSelected(word)
                            ? {
                                  backgroundColor: getSelectedWordColor(word),
                                  color: readableColor(getSelectedWordColor(word))
                              }
                            : {})
                    }}
                    onClick={() => onWordClick?.({ word })}
                >
                    <span className={classnames({ "line-through": isWordSelected(word) })}>{word}</span>
                </Button>
            ))}
        </div>
    );
};
