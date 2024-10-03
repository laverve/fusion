import { describe, it, expect } from "@jest/globals";
import { isPathExist, generatePath } from "./path";

describe("Path Module", () => {
    describe("isPathExist", () => {
        it("should return false if there is no straight path between start and end cells", () => {
            expect(
                isPathExist({ row: 1, col: 1, label: "A", key: "1" }, { row: 2, col: 3, label: "A", key: "2" })
            ).toBeFalsy();

            expect(
                isPathExist({ row: 2, col: 3, label: "A", key: "1" }, { row: 1, col: 1, label: "A", key: "2" })
            ).toBeFalsy();
        });

        it("should return false if start cell is not defined", () => {
            expect(isPathExist(null, { row: 2, col: 3, label: "A", key: "2" })).toBeFalsy();
        });

        it("should return false if end cell is not defined", () => {
            expect(isPathExist({ row: 2, col: 3, label: "A", key: "1" }, null)).toBeFalsy();
        });

        it("should return true if start and end cells are on the same horizontal line", () => {
            expect(
                isPathExist({ row: 1, col: 1, label: "A", key: "1" }, { row: 1, col: 3, label: "A", key: "2" })
            ).toBeTruthy();

            expect(
                isPathExist({ row: 1, col: 3, label: "A", key: "1" }, { row: 1, col: 1, label: "A", key: "2" })
            ).toBeTruthy();
        });

        it("should return true if start and end cells are on the same vertical line", () => {
            expect(
                isPathExist({ row: 1, col: 1, label: "A", key: "1" }, { row: 3, col: 1, label: "A", key: "2" })
            ).toBeTruthy();

            expect(
                isPathExist({ row: 3, col: 1, label: "A", key: "1" }, { row: 1, col: 1, label: "A", key: "2" })
            ).toBeTruthy();
        });

        it("should return true if start and end cells are on the same diagonal line", () => {
            expect(
                isPathExist({ row: 1, col: 1, label: "A", key: "1" }, { row: 3, col: 3, label: "A", key: "2" })
            ).toBeTruthy();

            expect(
                isPathExist({ row: 3, col: 3, label: "A", key: "1" }, { row: 1, col: 1, label: "A", key: "2" })
            ).toBeTruthy();

            expect(
                isPathExist({ row: 3, col: 1, label: "A", key: "1" }, { row: 1, col: 3, label: "A", key: "2" })
            ).toBeTruthy();

            expect(
                isPathExist({ row: 1, col: 3, label: "A", key: "1" }, { row: 3, col: 1, label: "A", key: "2" })
            ).toBeTruthy();
        });
    });

    describe("generatePath", () => {
        it("should return empty path if there is no path between start and end points", () => {
            const startCell = { row: 2, col: 2, label: "A", key: "1" };
            const endCell = { row: 3, col: 5, label: "A", key: "2" };
            expect(generatePath(startCell, endCell)).toEqual([]);
        });

        it("horizontal", () => {
            const startCell = { row: 2, col: 2, label: "A", key: "1" };
            const endCell = { row: 2, col: 4, label: "A", key: "2" };
            expect(generatePath(startCell, endCell)).toEqual(["2-2", "2-3", "2-4"]);
        });

        it("vertical", () => {
            const startCell = { row: 2, col: 2, label: "A", key: "1" };
            const endCell = { row: 4, col: 2, label: "A", key: "2" };
            expect(generatePath(startCell, endCell)).toEqual(["2-2", "3-2", "4-2"]);
        });

        it("diagonal from top to bottom", () => {
            const startCell = { row: 2, col: 2, label: "A", key: "1" };
            const endCell = { row: 4, col: 4, label: "A", key: "2" };
            expect(generatePath(startCell, endCell)).toEqual(["2-2", "3-3", "4-4"]);
        });

        it("diagonal from bottom to top", () => {
            const startCell = { row: 4, col: 4, label: "A", key: "1" };
            const endCell = { row: 2, col: 2, label: "A", key: "2" };
            expect(generatePath(startCell, endCell)).toEqual(["4-4", "3-3", "2-2"]);
        });
    });
});
