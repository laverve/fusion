const { nextui } = require("@nextui-org/react");
const path = require("path");
const color2k = require("color2k");
const defaultTheme = require("tailwindcss/defaultTheme");

const nextUIThemeModulePath = path.dirname(require.resolve("@nextui-org/theme"));

const COLOR_PALETTE = {
    "charcoal-gray": {
        100: "#E5E5E5",
        200: "#CCCCCC",
        300: "#B3B3B3",
        400: "#999999",
        500: "#808080", // Default
        600: "#666666",
        700: "#4D4D4D",
        800: "#333333",
        900: "#1A1A1A"
    },

    "navy-blue": {
        100: "#D0D6F7",
        200: "#A5AEF0",
        300: "#707BD3",
        400: "#454FA8",
        500: "#18206F", // Default
        600: "#11175F",
        700: "#0C114F",
        800: "#070B40",
        900: "#040735"
    },

    green: {
        100: "#E5F9D0",
        200: "#C6F3A3",
        300: "#96DB6F",
        400: "#67B747",
        500: "#318719", // Default
        600: "#207412",
        700: "#12610C",
        800: "#074E08",
        900: "#044009"
    },

    "light-blue": {
        100: "#C9FCF9",
        200: "#96F7F9",
        300: "#5FE1ED",
        400: "#38C2DC",
        500: "#0198C6", // Default
        600: "#0076AA",
        700: "#00588E",
        800: "#003F72",
        900: "#002D5F"
    },

    gold: {
        100: "#FCF7C9",
        200: "#F9EE95",
        300: "#EFDC5F",
        400: "#E0C738",
        500: "#CCAA00",
        600: "#AF8F00",
        700: "#927500",
        800: "#765C00",
        900: "#614A00"
    },

    "deep-red": {
        100: "#FAD6CF",
        200: "#F5A6A0",
        300: "#E26D70",
        400: "#C54555",
        500: "#A01634",
        600: "#891036",
        700: "#730B35",
        800: "#5C0732",
        900: "#4C042F"
    }
};

export default {
    content: [
        `${nextUIThemeModulePath}/**/*.{js,ts,jsx,tsx}`,
        "./stories/**/*.{js,ts,jsx,tsx}",
        "./games/**/src/**/*.{js,ts,jsx,tsx}"
    ],
    safelist: [
        {
            pattern: /grid-cols-(\d)+/
        },
        {
            pattern: /grid-rows-(\d)+/
        }
    ],
    theme: {
        extend: {
            fontFamily: {
                primary: defaultTheme.fontFamily.sans
            },
            colors: {
                ...COLOR_PALETTE
            }
        }
    },
    darkMode: "class",
    plugins: [
        nextui({
            prefix: "laverve",
            defaultTheme: "dark", // default theme from the themes object
            defaultExtendTheme: "dark",
            themes: {
                dark: {
                    colors: {
                        background: {
                            ...COLOR_PALETTE["navy-blue"],
                            DEFAULT: COLOR_PALETTE["navy-blue"][400]
                        },
                        foreground: {
                            ...COLOR_PALETTE["charcoal-gray"],
                            DEFAULT: color2k.readableColor(COLOR_PALETTE["charcoal-gray"][700])
                        },
                        focus: {
                            DEFAULT: COLOR_PALETTE["light-blue"][500]
                        },
                        divider: {
                            DEFAULT: "rgba(255,255,255,0.15)"
                        },
                        overlay: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][700]
                        },
                        content1: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][700],
                            foreground: "#F5F5F5"
                        },
                        content2: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][700],
                            foreground: "#F5F5F5"
                        },
                        content3: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][700],
                            foreground: "#F5F5F5"
                        },
                        content4: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][700],
                            foreground: "#F5F5F5"
                        },
                        primary: {
                            ...COLOR_PALETTE.gold,
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE.gold[500]
                        },
                        secondary: {
                            ...COLOR_PALETTE["navy-blue"],
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE["navy-blue"][500]
                        },
                        success: {
                            ...COLOR_PALETTE.green,
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE.green[500]
                        },
                        warning: {
                            ...COLOR_PALETTE["deep-red"],
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE["deep-red"][500]
                        },
                        danger: {
                            ...COLOR_PALETTE["deep-red"],
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE["deep-red"][500]
                        }
                    }
                },
                light: {
                    colors: {
                        background: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][100]
                        },
                        foreground: {
                            DEFAULT: color2k.readableColor(COLOR_PALETTE["charcoal-gray"][100])
                        },
                        focus: {
                            DEFAULT: COLOR_PALETTE["light-blue"][500]
                        },
                        divider: {
                            DEFAULT: "rgba(0,0,0,0.15)"
                        },
                        overlay: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][200]
                        },
                        content1: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][200],
                            foreground: "#F5F5F5"
                        },
                        content2: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][200],
                            foreground: "#F5F5F5"
                        },
                        content3: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][200],
                            foreground: "#F5F5F5"
                        },
                        content4: {
                            DEFAULT: COLOR_PALETTE["charcoal-gray"][200],
                            foreground: "#F5F5F5"
                        },
                        primary: {
                            ...COLOR_PALETTE["navy-blue"],
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE["navy-blue"][500]
                        },
                        secondary: {
                            ...COLOR_PALETTE["light-blue"],
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE["light-blue"][500]
                        },
                        success: {
                            ...COLOR_PALETTE.green,
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE.green[500]
                        },
                        warning: {
                            ...COLOR_PALETTE.gold,
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE.gold[500]
                        },
                        danger: {
                            ...COLOR_PALETTE["deep-red"],
                            foreground: "#F5F5F5",
                            DEFAULT: COLOR_PALETTE["deep-red"][500]
                        }
                    }
                }
            }
        })
    ]
};
