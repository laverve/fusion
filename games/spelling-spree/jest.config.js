import { jestConfig } from "@laverve/test-utils";

const config = {
    ...jestConfig,
    setupFilesAfterEnv: ["./test/setupTests.js"],
    moduleFileExtensions: ["mjs", "js"]
};

export default config;
