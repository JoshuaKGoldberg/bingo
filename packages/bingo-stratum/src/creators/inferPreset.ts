import {
	AnyShape,
	InferredObject,
	mergeCreations,
	TemplatePrepareContext,
} from "bingo";
import { CreatedDirectory, CreatedEntry } from "bingo-fs";
import { Options } from "hash-object";

import {
	produceBlock,
	ProduceBlockSettings,
} from "../producers/produceBlock.js";
import { Block } from "../types/blocks.js";
import { Preset } from "../types/presets.js";
import { slugifyPresetName } from "../utils.ts/slugifyPresetName.js";

export function inferPreset<OptionsShape extends AnyShape, Refinements>(
	context: Pick<
		TemplatePrepareContext<Partial<InferredObject<OptionsShape>>, Refinements>,
		"files" | "options"
	>,
	presets: Preset<OptionsShape>[],
) {
	const blockSettings: ProduceBlockSettings<undefined, Options> = {
		...context,

		// TODO: It would be better to run the base.prepare first to generate option defaults.
		// ...
		options: context.options as Options,
	};

	let record: undefined | { percentage: number; preset: Preset<OptionsShape> };

	for (const preset of presets) {
		const allProduced = preset.blocks.map((block) => {
			try {
				return produceBlock(block as Block<undefined, Options>, blockSettings);
			} catch {
				return {};
			}
		});

		const produced = allProduced.reduce(mergeCreations);
		const counted = countMatchedFilePaths(context.files, produced.files);
		const percentage = counted.matched / counted.created;

		if (record) {
			if (percentage > record.percentage) {
				record = { percentage, preset };
			}
		} else {
			record = { percentage, preset };
		}
	}

	return (
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		record!.percentage >= 0.35
			? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				slugifyPresetName(record!.preset.about.name)
			: undefined
	);
}

function countMatchedFilePaths(
	created: CreatedEntry | undefined,
	produced: CreatedEntry | undefined,
) {
	const found = {
		created: 0,
		matched: 0,
	};

	const queue: [CreatedEntry | undefined, CreatedEntry | undefined][] = [
		[created, produced],
	];

	while (queue.length) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const [currentCreated, currentProduced] = queue.pop()!;

		if (isCreatedFile(currentCreated)) {
			found.created += 1;

			if (isCreatedFile(currentProduced)) {
				found.matched += 1;
			}

			continue;
		}

		if (
			isCreatedDirectory(currentCreated) &&
			isCreatedDirectory(currentProduced)
		) {
			for (const key of Object.keys(currentCreated)) {
				queue.push([currentCreated[key], currentProduced[key]]);
			}
		}
	}

	return found;
}

function isCreatedDirectory(
	entry: CreatedEntry | undefined,
): entry is CreatedDirectory {
	return !!entry && typeof entry === "object" && !Array.isArray(entry);
}

function isCreatedFile(entry: CreatedEntry | undefined) {
	return typeof entry === "string" || Array.isArray(entry);
}
