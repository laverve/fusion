import React, { useContext } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import { GameContext } from "@laverve/fusion";
import { MazeContext } from "./Maze.context";
import { I18N_NAMESPACE } from "./types";

export type MazeStatsProps = { classNames?: string };

export const MazeStats: React.FC<MazeStatsProps> = ({ classNames = "" }) => {
    const { resources } = useContext(MazeContext);
    const { t } = useTranslation(I18N_NAMESPACE);

    const { startTime, endTime } = useContext(GameContext);

    const completedInSeconds = Math.round(((endTime || 0) - (startTime || 0)) / 1000);
    const seconds = completedInSeconds % 60;
    const minutes = Math.floor(completedInSeconds / 60);

    return (
        <div className={classnames("flex", "flex-col", classNames)} data-testid="testid-wordsearch-stats">
            <div className="flex flex-row justify-stretch gap-1">
                <p className="body-2 flex-1 text-right whitespace-nowrap">
                    <strong>{t("controls.stats.gatheredResources")}</strong>
                </p>
                <p className="body-2 flex-1 text-center">{resources.filter((r) => r.isFound).length}</p>
            </div>
            {startTime && endTime && (
                <div className="flex flex-row justify-stretch gap-1">
                    <p className="body-2 flex-1 text-right">
                        {" "}
                        <strong>{t("controls.stats.timeSpent")}</strong>
                    </p>
                    <p className="body-2 flex-1 text-center">
                        {minutes < 10 && "0"}
                        {minutes} {t("controls.stats.minutes")} {seconds < 10 && "0"}
                        {seconds} {t("controls.stats.seconds")}
                    </p>
                </div>
            )}
        </div>
    );
};
