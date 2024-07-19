const tailwindConfig = require("@laverve/design-provider/tailwind.config.js");

export default {
    ...tailwindConfig,
    content: [...tailwindConfig.content, "./stories/**/*.{js,ts,jsx,tsx}", "../../packages/**/src/**/*.{js,ts,jsx,tsx}"]
};
