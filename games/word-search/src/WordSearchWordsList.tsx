import React, { useContext, useMemo } from "react";
import classnames from "classnames";
import { parseToRgba, toHex, readableColor } from "color2k";
import { Chip } from "@nextui-org/react";
import { WordSearchContext } from "./WordSearch.context";

export type WordSearchWordsListProps = {
    classNames?: string;
};

export const WordSearchWordsList: React.FC<WordSearchWordsListProps> = ({ classNames }: WordSearchWordsListProps) => {
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
            className={classnames("box-border", "justify-center", "items-center", "flex-1", "gap-1", classNames)}
        >
            {words.map((word) => (
                <Chip
                    key={word}
                    data-testid={`testid-${word.toLowerCase()}`}
                    className="m-1"
                    style={{
                        ...(selectedWordsColorsWithoutOpacity.length > 0 && isWordSelected(word)
                            ? {
                                  backgroundColor: getSelectedWordColor(word),
                                  color: readableColor(getSelectedWordColor(word))
                              }
                            : {})
                    }}
                >
                    <span className={classnames({ "line-through": isWordSelected(word) })}>{word}</span>
                </Chip>
            ))}
        </div>
    );
};
