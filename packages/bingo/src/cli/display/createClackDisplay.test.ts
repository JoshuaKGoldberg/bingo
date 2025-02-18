import { describe, expect, test } from "vitest";

import { createClackDisplay } from "./createClackDisplay.js";

describe("createClackDisplay", () => {
	test("dumpItems", () => {
		const display = createClackDisplay();

		display.item("group-a", "b1", { start: 1 });
		display.item("group-a", "b1", { end: 2 });
		display.item("group-a", "b2", { end: 4, error: ":(", start: 3 });
		display.item("group-c", "d1", { start: 5 });

		const dumped = display.dumpItems();

		expect(dumped).toEqual({
			"group-a": {
				b1: { end: 2, start: 1 },
				b2: { end: 4, error: ":(", start: 3 },
			},
			"group-c": { d1: { start: 5 } },
		});
	});
});
