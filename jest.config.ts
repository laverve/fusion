import type { Config } from "jest";
import { jestConfig } from "@laverve/test-utils";

const config: Config = {
    ...jestConfig,
    modulePathIgnorePatterns: ["<rootDir>/packages/utils-test/"]
};

export default config;
