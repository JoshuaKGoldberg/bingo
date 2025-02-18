import { describe, expect, it } from "vitest";

import { packageData } from "./packageData.js";

describe("packageData", () => {
	it("equals the root package.json", () => {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		expect(packageData).toEqual(require("../package.json"));
	});
});
