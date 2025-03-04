import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { runTemplateCLI } from "./runTemplateCLI.js";
import { CLIStatus } from "./status.js";

const mockLog = {
	error: vi.fn(),
	info: vi.fn(),
	message: vi.fn(),
	step: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	get log() {
		return mockLog;
	},
	spinner: () => ({
		start: vi.fn(),
		stop: vi.fn(),
	}),
}));

vi.mock("../packageData.js", () => ({
	packageData: {
		name: "bingo",
		version: "1.2.3",
	},
}));

const mockGetTemplatePackageData = vi.fn();

vi.mock("./getTemplatePackageData.js", () => ({
	get getTemplatePackageData() {
		return mockGetTemplatePackageData;
	},
}));

vi.mock("./loggers/logOutro.js");

const mockParseProcessArgv = vi.fn();

vi.mock("./parseProcessArgv.js", () => ({
	get parseProcessArgv() {
		return mockParseProcessArgv;
	},
}));

const template = createTemplate({
	options: {},
	produce: vi.fn(),
});

const mockConsole = {
	error: vi.fn(),
	log: vi.fn(),
};

describe("runTemplateCLI", () => {
	beforeEach(() => {
		Object.assign(console, mockConsole);
	});

	it("returns the error when loading template package data errors", async () => {
		const error = new Error("Oh no!");
		mockGetTemplatePackageData.mockResolvedValueOnce(error);

		const actual = await runTemplateCLI(template);

		expect(mockConsole.error).toHaveBeenCalledWith(error);
		expect(actual).toBe(CLIStatus.Error);
	});

	it("logs versions with loaded template package data when parsed process argv includes version and package data is not provided", async () => {
		mockParseProcessArgv.mockReturnValueOnce({ values: { version: true } });
		mockGetTemplatePackageData.mockResolvedValueOnce({
			name: "create-example",
			version: "0.1.2",
		});

		const actual = await runTemplateCLI(template);

		expect(mockConsole.log.mock.calls).toEqual([
			["bingo@1.2.3"],
			["create-example@0.1.2"],
		]);
		expect(actual).toBe(CLIStatus.Success);
	});

	it("logs versions with the template package data when parsed process argv includes version and package data is provided", async () => {
		mockParseProcessArgv.mockReturnValueOnce({ values: { version: true } });

		const actual = await runTemplateCLI(template, {
			name: "create-example",
			version: "0.1.2",
		});

		expect(mockConsole.log.mock.calls).toEqual([
			["bingo@1.2.3"],
			["create-example@0.1.2"],
		]);
		expect(actual).toBe(CLIStatus.Success);
	});

	it("logs a link when template.about.repository is defined", async () => {
		mockParseProcessArgv.mockReturnValueOnce({ args: [], values: {} });

		await runTemplateCLI(
			createTemplate({
				about: {
					repository: {
						owner: "example-owner",
						repository: "create-example",
					},
				},
				produce: vi.fn(),
			}),
			{
				name: "create-example",
				version: "0.1.2",
			},
		);

		expect(mockLog.info).toHaveBeenCalledWith(
			`Learn more on:\n  https://github.com/example-owner/create-example`,
		);
	});
});
