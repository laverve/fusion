import React from "react";
import classnames from "classnames";

export type SidebarVariant = "vertical" | "horizontal";
export type SideparPlacement = "top" | "bottom" | "right" | "left";
export type TimerPlacement = "sidebar-left" | "sidebar-top" | "sidebar-right" | "sidebar-bottom";

export type PublicLayoutProps = {
    classNames?: {
        container?: string;
        boardWrapper?: string;
        sidebarWrapper?: string;
    };
    sidebarVariant?: SidebarVariant;
    sidebarPlacement?: SideparPlacement;
    timerPlacement?: TimerPlacement;
};

type LayoutProps = PublicLayoutProps & {
    boardSlot: React.ReactNode;
    timerSlot: React.ReactNode;
    wordsListSlot: React.ReactNode;
};

export const Layout = ({
    classNames = {},
    boardSlot,
    wordsListSlot,
    timerSlot,
    sidebarVariant = "horizontal",
    sidebarPlacement = "right",
    timerPlacement = "sidebar-top"
}: LayoutProps) => {
    return (
        <div
            className={classnames(
                "flex",
                {
                    "flex-row": sidebarPlacement === "right",
                    "flex-row-reverse": sidebarPlacement === "left",
                    "flex-col": sidebarPlacement === "bottom",
                    "flex-col-reverse": sidebarPlacement === "top"
                },
                "gap-3",
                "h-full",
                classNames.container
            )}
        >
            <div
                className={classnames(
                    "flex",
                    "flex-1",
                    "items-center",
                    "relative",
                    "select-none",
                    "justify-center",
                    classNames.boardWrapper
                )}
            >
                {boardSlot}
            </div>
            {wordsListSlot && (
                <div
                    className={classnames(
                        "flex",
                        {
                            "flex-col": sidebarVariant === "vertical" && timerPlacement === "sidebar-top",
                            "flex-col-reverse": sidebarVariant === "vertical" && timerPlacement === "sidebar-bottom",
                            "flex-row": sidebarVariant === "horizontal" && timerPlacement === "sidebar-left",
                            "flex-row-reverse": sidebarVariant === "horizontal" && timerPlacement === "sidebar-right"
                        },
                        "gap-1",
                        classNames.sidebarWrapper
                    )}
                >
                    {timerSlot}
                    {wordsListSlot}
                </div>
            )}
        </div>
    );
};
