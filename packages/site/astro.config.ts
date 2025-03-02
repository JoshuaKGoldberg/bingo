import starlight from "@astrojs/starlight";
import { konamiEmojiBlast } from "@konami-emoji-blast/astro";
import { defineConfig } from "astro/config";
import { remarkHeadingId } from "remark-custom-heading-id";
import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";

export default defineConfig({
	integrations: [
		konamiEmojiBlast(),
		starlight({
			components: {
				Footer: "src/components/Footer.astro",
				Head: "src/components/Head.astro",
			},
			customCss: ["src/styles.css"],
			favicon: "/favicon.png",
			logo: {
				src: "src/assets/favicon.png",
			},
			plugins: [
				starlightLinksValidator(),
				starlightSidebarTopics([
					{
						icon: "open-book",
						items: [
							{ label: "About Bingo", link: "about" },
							{ label: "CLI", link: "cli" },
							{ label: "Configuration", link: "configuration" },
							{ label: "Execution", link: "execution" },
							{ label: "FAQs", link: "faqs" },
						],
						label: "About",
						link: "/about",
					},
					{
						icon: "pen",
						items: [
							{ label: "About", link: "build/about" },
							{ label: "CLI", link: "build/cli" },
							{
								items: [
									{ label: "Creations", link: "build/concepts/creations" },
									{ label: "Inputs", link: "build/concepts/inputs" },
									{ label: "Modes", link: "build/concepts/modes" },
									{ label: "Templates", link: "build/concepts/templates" },
								],
								label: "Concepts",
							},
							{
								items: [
									{ label: "Contexts", link: "build/details/contexts" },
									{ label: "Merging", link: "build/details/merging" },
								],
								label: "Details",
							},
							{
								items: [
									{
										label: "createInput",
										link: "build/apis/create-input",
									},
									{
										label: "createTemplate",
										link: "build/apis/create-template",
									},
									{
										label: "prepareOptions",
										link: "build/apis/prepare-options",
									},
									{
										label: "produceTemplate",
										link: "build/apis/produce-template",
									},
									{
										label: "runInput",
										link: "build/apis/run-input",
									},
									{
										label: "runTemplate",
										link: "build/apis/run-template",
									},
									{
										label: "runTemplateCLI",
										link: "build/apis/run-template-cli",
									},
								],
								label: "APIs",
							},
							{
								items: [
									{ label: "bingo", link: "build/packages/bingo" },
									{ label: "bingo-fs", link: "build/packages/bingo-fs" },
									{
										label: "bingo-systems",
										link: "build/packages/bingo-systems",
									},
									{
										label: "bingo-testers",
										link: "build/packages/bingo-testers",
									},
								],
								label: "Packages",
							},
							{ label: "FAQs", link: "build/faqs" },
						],
						label: "Building Templates",
						link: "/build/about",
					},
					{
						icon: "setting",
						items: [
							{ label: "About", link: "engines/about" },
							{
								collapsed: true,
								items: [
									{ label: "About", link: "engines/handlebars/about" },
									{
										label: "handlebars",
										link: "engines/handlebars/handlebars",
									},
									{
										label: "loadHandlebars",
										link: "engines/handlebars/load-handlebars",
									},
								],
								label: "Handlebars",
							},
							{
								collapsed: true,
								items: [
									{ label: "About", link: "engines/stratum/about" },
									{
										items: [
											{
												label: "Bases",
												link: "engines/stratum/concepts/bases",
											},
											{
												label: "Blocks",
												link: "engines/stratum/concepts/blocks",
											},
											{
												label: "Presets",
												link: "engines/stratum/concepts/presets",
											},
											{
												label: "Templates",
												link: "engines/stratum/concepts/templates",
											},
										],
										label: "Concepts",
									},
									{
										items: [
											{
												label: "Block Creations",
												link: "engines/stratum/details/block-creations",
											},
											{
												label: "Configurations",
												link: "engines/stratum/details/configurations",
											},
											{
												label: "Contexts",
												link: "engines/stratum/details/contexts",
											},
											{
												label: "Execution",
												link: "engines/stratum/details/execution",
											},
										],
										label: "Details",
									},
									{
										items: [
											{
												label: "createBase",
												link: "engines/stratum/apis/create-base",
											},
											{
												label: "Producers",
												link: "engines/stratum/apis/producers",
											},
											{
												label: "Runners",
												link: "engines/stratum/apis/runners",
											},
										],
										label: "APIs",
									},
									{
										items: [
											{
												label: "bingo-stratum",
												link: "engines/stratum/packages/bingo-stratum",
											},
											{
												label: "bingo-stratum-testers",
												link: "engines/stratum/packages/bingo-stratum-testers",
											},
										],
										label: "Packages",
									},
									{ label: "FAQs", link: "engines/stratum/faqs" },
								],
								label: "Stratum",
							},
						],
						label: "Templating Engines",
						link: "/engines/about",
					},
				]),
			],
			social: {
				github: "https://github.com/JoshuaKGoldberg/bingo",
			},
			tableOfContents: {
				maxHeadingLevel: 4,
			},
			title: "Bingo",
		}),
	],
	markdown: {
		remarkPlugins: [remarkHeadingId],
	},
	site: "https://create.bingo",
});
