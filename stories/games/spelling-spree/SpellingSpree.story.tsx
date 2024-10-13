import React, { useMemo } from "react";

import { SpellingSpreeGame, SpellingSpreeGameProps } from "@laverve/games-spelling-spree";
import { Card, CardBody } from "@nextui-org/react";

export default {
    title: "Games/Spelling Spree/Gameplay",
    argTypes: {}
};

import "../../css/app.css";

export const SpellingSpree = ({ timeout }: SpellingSpreeGameProps): JSX.Element => {
    const words = useMemo(() => ["dog", "cat", "doc", "tree"], []);
    return (
        <Card fullWidth className="h-[90vh]">
            <CardBody className="w-full h-full">
                <SpellingSpreeGame
                    lng="en"
                    words={words}
                    timeout={timeout}
                    layout={{ sidebarVariant: "horizontal", sidebarPlacement: "top" }}
                />
            </CardBody>
        </Card>
    );
};

SpellingSpree.storyName = "Gameplay";
