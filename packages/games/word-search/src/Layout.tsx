import React from "react";
import classnames from "classnames";

export type LayoutVariant = "vertical" | "horizontal";
export type ElementPlacement = "top" | "bottom" | "right" | "left";

export type LayoutProps = {
    sidebarConfig: {
        layoutVariant?: LayoutVariant;
        children?: React.ReactNode;
        className?: string;
        placement?: ElementPlacement;
    };
    boardConfig: {
        children?: React.ReactNode;
        width?: number;
        className?: string;
        height?: number;
    };
    containerConfig: {
        className?: string;
    };
};

export const Layout = ({
    boardConfig: { children: boardSlot = null, width = 300, height = 300, className: boardClassName = "" } = {},
    sidebarConfig: {
        className: sidebarClassName = "",
        children: sidebarChildren = null,
        placement: sidebarPlacement = "right",
        layoutVariant: sidebarLayoutVariant = "horizontal"
    } = {},
    containerConfig = { className: "" }
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
                containerConfig.className
            )}
        >
            <div
                className={classnames(
                    "flex",
                    "items-center",
                    "relative",
                    "select-none",
                    "text-content1",
                    "justify-center",
                    boardClassName
                )}
            >
                <div style={{ width, height }} className="relative overflow-hidden">
                    {boardSlot}
                </div>
            </div>
            {sidebarChildren && (
                <div
                    className={classnames(
                        "flex",
                        {
                            "flex-col": sidebarLayoutVariant === "vertical",
                            "flex-row": sidebarLayoutVariant === "horizontal"
                        },
                        "gap-1",
                        sidebarClassName
                    )}
                >
                    {sidebarChildren}
                </div>
            )}
        </div>
    );
};
