import React from "react";

import { WordSearchGameProps, WordSearchGame } from "@laverve/games-wordsearch";
import { Card, CardBody, NextUIProvider } from "@nextui-org/react";

import "../../css/app.css";

export default {
    title: "Games/WordSearch/Gameplay",
    argTypes: {}
};

export const WordSearchStory = ({ timeout, words, grid }: WordSearchGameProps): JSX.Element => {
    return (
        <NextUIProvider>
            <Card>
                <CardBody>
                    <WordSearchGame
                        words={words}
                        grid={grid}
                        timeout={timeout}
                        sidebarConfig={{ layoutVariant: "vertical" }}
                        wordsListConfig={{ classNames: "flex flex-col" }}
                    />
                </CardBody>
            </Card>
        </NextUIProvider>
    );
};

WordSearchStory.storyName = "Gameplay";
WordSearchStory.argTypes = {
    timeout: {
        name: "Timer",
        control: {
            type: "number",
            min: 0,
            max: 600
        },
        description: "Sets countdown timer for a game in seconds. If it is set to 0, then countup timer will be used."
    }
};
WordSearchStory.args = {
    words: ["dog", "cat", "dig", "boat", "doc"],
    grid: [
        ["b", "d", "i", "g"],
        ["d", "o", "g", "o"],
        ["u", "c", "a", "t"],
        ["x", "y", "z", "t"]
    ],
    timeout: 0
};
