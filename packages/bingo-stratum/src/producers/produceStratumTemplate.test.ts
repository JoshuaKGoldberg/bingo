import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { produceStratumTemplate } from "./produceStratumTemplate.js";

describe("produceStratumTemplate", () => {
	it("passes addons to the preset when provided", () => {
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

		const presetUsingOption = baseWithOption.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const template = baseWithOption.createStratumTemplate({
			presets: [presetUsingOption],
		});

		const actual = produceStratumTemplate(template, {
			options: {
				preset: "test",
				value: "abc",
			},
		});

		expect(actual).toEqual({
			files: {
				"value.txt": "abc",
			},
		});
	});

	it("passes options to the preset when provided", () => {
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

		const presetUsingOption = baseWithOption.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const template = baseWithOption.createStratumTemplate({
			presets: [presetUsingOption],
		});

		const actual = produceStratumTemplate(template, {
			options: {
				preset: "test",
				value: "abc",
			},
		});

		expect(actual).toEqual({
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

		const presetWithoutOption = baseWithoutOption.createPreset({
			about: { name: "Test Without Option" },
			blocks: [blockWithoutOption],
		});

		const template = baseWithoutOption.createStratumTemplate({
			presets: [presetWithoutOption],
		});

		const actual = produceStratumTemplate(template, {
			offline: true,
			options: {
				preset: "test-without-option",
			},
		});

		expect(actual).toEqual({
			files: {
				"offline.txt": "true",
			},
		});
	});

	it("throws an error when a preset string cannot be matched to its name", () => {
		const base = createBase({
			options: {},
		});

		const blockUsingOption = base.createBlock({
			produce() {
				return {
					files: {
						"value.txt": "abc",
					},
				};
			},
		});

		const presetUsingOption = base.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const template = base.createStratumTemplate({
			presets: [presetUsingOption],
		});

		const act = () =>
			produceStratumTemplate(template, {
				options: {
					preset: "other",
				},
			});

		expect(act).toThrow("other is not one of: test");
	});
});
