import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { producePreset } from "./producePreset.js";

const emptyCreation = {
	addons: [],
	files: {},
	requests: [],
	scripts: [],
	suggestions: [],
};

const system = {
	fetchers: {
		fetch: vi.fn(),
		octokit: {} as Octokit,
	},
	fs: {
		readDirectory: vi.fn(),
		readFile: vi.fn(),
		writeDirectory: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
};

describe("producePreset", () => {
	it("passes options to the preset when provided via options", () => {
		const baseWithOption = createBase({
			options: {
				value: z.string(),
			},
		});

		const blockUsingOption = baseWithOption.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const preset = baseWithOption.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const actual = producePreset(preset, {
			...system,
			options: {
				value: "abc",
			},
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"value.txt": "abc",
			},
		});
	});

	it("passes offline to the preset when provided", () => {
		const baseWithoutOption = createBase({
			options: {},
		});

		const blockWithoutOption = baseWithoutOption.createBlock({
			produce({ offline }) {
				return {
					files: {
						"offline.txt": String(offline),
					},
				};
			},
		});

		const preset = baseWithoutOption.createPreset({
			about: { name: "Test" },
			blocks: [blockWithoutOption],
		});

		const actual = producePreset(preset, {
			...system,
			offline: true,
			options: {},
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"offline.txt": "true",
			},
		});
	});

	it("uses the template's blocks for refinement if a template is provided", () => {
		const baseWithoutOption = createBase({
			options: {},
		});

		const blockA = baseWithoutOption.createBlock({
			about: { name: "A" },
			produce() {
				return {
					files: {
						"a.txt": "a",
					},
				};
			},
		});

		const blockB = baseWithoutOption.createBlock({
			about: { name: "B" },
			produce() {
				return {
					files: {
						"b.txt": "b",
					},
				};
			},
		});

		const presetA = baseWithoutOption.createPreset({
			about: { name: "A" },
			blocks: [blockA],
		});
		const presetAB = baseWithoutOption.createPreset({
			about: { name: "AB" },
			blocks: [blockA, blockB],
		});

		const template = baseWithoutOption.createStratumTemplate({
			presets: [presetA, presetAB],
		});

		const actual = producePreset(presetA, {
			...system,
			options: {
				"add-b": true,
			},
			template,
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"a.txt": "a",
				"b.txt": "b",
			},
		});
	});
});
