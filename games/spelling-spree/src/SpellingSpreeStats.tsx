import React, { useContext } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import { useGame } from "pixi-fusion";
import { SpellingSpreeContext } from "./SpellingSpree.context";

export type SpellingSpreeStatsProps = { classNames?: string };

export const SpellingSpreeStats: React.FC<SpellingSpreeStatsProps> = ({ classNames = "" }) => {
    const { completedWords, amountOfMistakes } = useContext(SpellingSpreeContext);
    const { t } = useTranslation();

    const { startTime, endTime } = useGame();

    const completedInSeconds = Math.round(((endTime || 0) - (startTime || 0)) / 1000);
    const seconds = completedInSeconds % 60;
    const minutes = Math.floor(completedInSeconds / 60);

    return (
        <div className={classnames("flex", "flex-col", classNames)} data-testid="testid-wordsearch-stats">
            <div className="flex flex-row justify-stretch gap-1">
                <div className="body-2 flex-1 text-right">
                    <strong>{t("controls.stats.amountOfWords")}</strong>
                </div>
                <div className="body-2 flex-1 text-center">{completedWords.length}</div>
            </div>
            <div className="flex flex-row justify-stretch gap-1">
                <div className="body-2 flex-1 text-right">
                    <strong>{t("controls.stats.amountOfMistakes")}</strong>
                </div>
                <div className="body-2 flex-1 text-center">{amountOfMistakes}</div>
            </div>
            {startTime && endTime && (
                <div className="flex flex-row justify-stretch gap-1">
                    <div className="body-2 flex-1 text-right">
                        {" "}
                        <strong>{t("controls.stats.timeSpent")}</strong>
                    </div>
                    <div className="body-2 flex-1 text-center">
                        {minutes < 10 && "0"}
                        {minutes} {t("controls.stats.minutes")} {seconds < 10 && "0"}
                        {seconds} {t("controls.stats.seconds")}
                    </div>
                </div>
            )}
        </div>
    );
};
