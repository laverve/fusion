import React, { useContext } from "react";
import classnames from "classnames";
import { Button } from "@nextui-org/react";
import { SpellingSpreeContext } from "./SpellingSpree.context";

export type SpellingSpreeWordsListProps = {
    onWordClick?: (event: { word: string }) => unknown;
};

export const SpellingSpreeWordsList: React.FC<SpellingSpreeWordsListProps> = ({
    onWordClick
}: SpellingSpreeWordsListProps) => {
    const { completedWords } = useContext(SpellingSpreeContext);

    return (
        <div
            data-testid="testid-wordsearch-words-list"
            className={classnames("box-border", "justify-center", "items-center", "flex-1", "gap-1")}
        >
            {completedWords.map((word) => (
                <Button
                    key={word}
                    color="default"
                    radius="full"
                    size="sm"
                    data-testid={`testid-${word.toLowerCase()}`}
                    className="m-1 px-2 py-1 !min-h-auto !h-auto !min-w-0 !w-auto"
                    onClick={() => onWordClick?.({ word })}
                >
                    {word}
                </Button>
            ))}
        </div>
    );
};
