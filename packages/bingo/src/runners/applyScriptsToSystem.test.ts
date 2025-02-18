import { describe, expect, it, test, vi } from "vitest";

import { applyScriptsToSystem } from "./applyScriptsToSystem.js";

function createStubSystem() {
	return {
		display: {
			item: vi.fn(),
			log: vi.fn(),
		},
		runner: vi.fn(),
	};
}

describe("applyCommandsToSystem", () => {
	it("displays the error when a standalone command results in an error", async () => {
		const command = "abc";
		const error = new Error("Oh no!");

		const system = createStubSystem();
		system.runner.mockReturnValueOnce(error);

		await applyScriptsToSystem([command], system);

		expect(system.display.item.mock.calls).toEqual([
			["script", command, { start: expect.any(Number) }],
			["script", command, { end: expect.any(Number) }],
			["script", command, { error }],
		]);
	});

	it("displays the error when a phased command without the silent option results in an error", async () => {
		const command = "abc";
		const error = new Error("Oh no!");

		const system = createStubSystem();
		system.runner.mockReturnValueOnce(error);

		await applyScriptsToSystem([{ commands: [command], phase: 0 }], system);

		expect(system.display.item.mock.calls).toEqual([
			["script", command, { start: expect.any(Number) }],
			["script", command, { end: expect.any(Number) }],
			["script", command, { error }],
		]);
	});

	it("does not display the error when a phased command with silent: true results in an error", async () => {
		const command = "abc";
		const error = new Error("Oh no!");

		const system = createStubSystem();
		system.runner.mockReturnValueOnce(error);

		await applyScriptsToSystem(
			[{ commands: [command], phase: 0, silent: true }],
			system,
		);

		expect(system.display.item.mock.calls).toEqual([
			["script", command, { start: expect.any(Number) }],
			["script", command, { end: expect.any(Number) }],
		]);
	});

	it("runs phase commands in different phases in order of phase", async () => {
		const scripts = [
			{ commands: ["c", "d"], phase: 1 },
			{ commands: ["a", "b"], phase: 0 },
		];
		const system = createStubSystem();

		await applyScriptsToSystem(scripts, system);

		expect(system.runner.mock.calls).toEqual([["a"], ["b"], ["c"], ["d"]]);
	});

	it("runs phase commands in the same phase in series", async () => {
		const scripts = [
			{ commands: ["a", "b"], phase: 0 },
			{ commands: ["c", "d"], phase: 0 },
		];
		const system = createStubSystem();

		await applyScriptsToSystem(scripts, system);

		expect(system.runner.mock.calls).toEqual([["a"], ["c"], ["b"], ["d"]]);
	});

	it("runs out-of-phase commands in parallel to phase commands when they exist", async () => {
		const scripts = ["a", { commands: ["b", "d"], phase: 0 }, "d"];
		const system = createStubSystem();

		await applyScriptsToSystem(scripts, system);

		expect(system.runner.mock.calls).toEqual([["a"], ["d"], ["b"], ["d"]]);
	});

	test("mixed phase commands", async () => {
		const scripts = [
			{ commands: ["a", "b"], phase: 2 },
			{ commands: ["c", "d", "e"], phase: 1 },
			{ commands: ["f", "g"], phase: 1 },
			{ commands: ["h"], phase: 0 },
		];
		const system = createStubSystem();

		await applyScriptsToSystem(scripts, system);

		expect(system.runner.mock.calls).toEqual([
			["h"],
			["c"],
			["f"],
			["d"],
			["g"],
			["e"],
			["a"],
			["b"],
		]);
	});
});
