import React from "react";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";

import { GameStatus, useGame } from "pixi-fusion";

export type SpellingSpreeGameControlsProps = {
    classNames?: string;
    statsSlot?: React.ReactNode;
    onPlayAgain?: () => void;
};

export const SpellingSpreeGameControls: React.FC<SpellingSpreeGameControlsProps> = ({
    statsSlot,
    classNames,
    onPlayAgain
}: SpellingSpreeGameControlsProps) => {
    const { t } = useTranslation();
    const { start, status } = useGame();

    const wrap = (children: React.ReactNode, isGameOver: boolean = false) => {
        return (
            <div
                className={classnames(
                    "flex",
                    "absolute",
                    "inset-0",
                    "items-center",
                    { "justify-between": isGameOver, "justify-center": !isGameOver },
                    "bg-content1/90",
                    "flex-col",
                    "text-foreground",
                    classNames || ""
                )}
            >
                {children}
            </div>
        );
    };

    if (status === GameStatus.READY) {
        return wrap(
            <Button type="button" color="primary" data-testid="testid-game-control-start" onClick={() => start()}>
                <FontAwesomeIcon icon={faPlay} /> {t("controls.startButton")}
            </Button>
        );
    }

    if (status !== GameStatus.IN_PROGRESS) {
        return wrap(
            <>
                <div className="pt-5 pb-5">
                    {status === GameStatus.COMPLETED && (
                        <>
                            <h2 className="heading-2 text-center mb-3">
                                {t("controls.kudos.title")}
                                <br />
                                {t("controls.kudos.subtitle")}
                            </h2>
                            <div className="body-1 text-center">{t("controls.kudos.motivationalMessage")}</div>
                        </>
                    )}
                    {status === GameStatus.TIMEDOUT && (
                        <>
                            <h2 className="heading-2 text-center mb-3">{t("controls.timesup.title")}</h2>
                            <div className="body-1 text-center">
                                {t("controls.timesup.subtitle")}
                                <br />
                                {t("controls.timesup.motivationalMessage")}
                            </div>
                        </>
                    )}
                    <div className="flex flex-col mt-3 mb-3">
                        <h4 className="heading-4 text-center mb-3">{t("controls.stats.title")}</h4>
                        {statsSlot}
                    </div>
                </div>
                <Button type="button" color="primary" onClick={onPlayAgain}>
                    <FontAwesomeIcon icon={faArrowRotateLeft} /> {t("controls.playAgainButton")}
                </Button>
            </>,
            true
        );
    }
    return null;
};
