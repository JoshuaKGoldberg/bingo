import { WritingFileSystem } from "bingo-systems";
import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { applyRequestsToSystem } from "./applyRequestsToSystem.js";

const mockGetRequestSender = vi.fn();

vi.mock("./getRequestSender.js", () => ({
	get getRequestSender() {
		return mockGetRequestSender;
	},
}));

function createStubSystem() {
	return {
		directory: "",
		display: {
			item: vi.fn(),
			log: vi.fn(),
		},
		fetchers: {
			fetch: vi.fn(),
			octokit: {} as Octokit,
		},
		fs: {} as WritingFileSystem,
		runner: vi.fn(),
	};
}

describe("applyRequestsToSystem", () => {
	it("does not do anything when getRequestSender returns undefined", async () => {
		mockGetRequestSender.mockReturnValueOnce(undefined);

		const act = async () => {
			await applyRequestsToSystem(
				[
					{
						type: "fetch",
						url: "https://example.com",
					},
				],
				createStubSystem(),
			);
		};

		await expect(act()).resolves.toBeUndefined();
	});

	it("does not display an error when a request  does not reject", async () => {
		const id = "abc";
		const send = vi.fn();
		const system = createStubSystem();

		mockGetRequestSender.mockReturnValueOnce({ id, send });

		await applyRequestsToSystem(
			[
				{
					type: "fetch",
					url: "https://example.com",
				},
			],
			system,
		);

		expect(system.display.item.mock.calls).toEqual([
			["request", id, { start: expect.any(Number) }],
			["request", id, { end: expect.any(Number) }],
		]);
	});

	it("displays the error when a request rejects", async () => {
		const error = new Error();
		const id = "abc";
		const send = vi.fn().mockRejectedValueOnce(error);
		const system = createStubSystem();

		mockGetRequestSender.mockReturnValueOnce({ id, send });

		await applyRequestsToSystem(
			[
				{
					type: "fetch",
					url: "https://example.com",
				},
			],
			system,
		);

		expect(system.display.item.mock.calls).toEqual([
			["request", id, { start: expect.any(Number) }],
			["request", id, { error }],
			["request", id, { end: expect.any(Number) }],
		]);
	});
});
