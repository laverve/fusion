const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

export default {
    stories: ["../stories/**/*.@(story|stories).@(js|jsx|ts|tsx|mdx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-a11y"],
    staticDirs: ["../static"],
    framework: "@storybook/react-webpack5",
    babel: (config) => {
        config.presets.push(["@babel/preset-typescript", { isTSX: true, allExtensions: true }]);
        return config;
    },
    async webpackFinal(config) {
        config.resolve.plugins = [new TsconfigPathsPlugin()];
        const cssRule = config.module.rules.find((r) => r.test.test("styles.css"));
        cssRule.use.push("postcss-loader");
        return config;
    }
};
