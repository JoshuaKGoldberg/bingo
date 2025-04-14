---
authors:
  - joshuakgoldberg
date: 2025-04-14
excerpt: Hello, world! 💝
  <br />
  <br />
  Bingo is a repostitory template framework.
  It allows you to build delightful templates for web repositories.
  I'm happy to announce that Bingo is _"early adopter ready"_.
  If you maintain any kind of repository template, Bingo is ready for you to try out.
  <br />
  <br />
  What's Bingo, you ask?
  What does early adoption mean?
  Great questions - read on to learn more!
title: Bingo is Early Adopter Ready
---

Hello, world! 💝
Bingo is a repostitory template framework.
It allows you to build delightful templates for web repositories.

Today, I'm happy to announce that Bingo is _"early adopter ready"_.
If you maintain any kind of repository template, Bingo is ready for you to try out.

What's Bingo, you ask?
What does early adoption mean?
Great questions - read on to learn more!

## Why a Template Framework?

Building web templates like [create-typescript-app](https:/github.com/JoshuaKGoldberg) are surprisingly difficult to create and maintain.
Templates need to do more than just copy and paste static files into a new Git repository.
Popular templates generally at least:

- Provide configurable options such as what framework(s) or language to include
- Prompt for details such as repository name from the running user
- Substitute in those details into the appropriate files based on selected options

Plus, many teams need to configure more than just the files in their repositories.
GitHub repository settings such as branch rulesets and labels are often must-haves for many teams.
Those can be painstaking to configure manually, especially for settings such as required status checks that can be different depending on the script(s) used in a repository.

## Bingo?

Bingo is a framework for delightful web repository templates.
It provides rich scaffolding for flexible repository templates that describe the files and settings for projects.

You can think of Bingo as a framework the same way that Express.js or React are frameworks.
Instead of giving it a description of a UI (à la React) or an HTTP server (à la Express), Bingo takes in a description of how to create the files to scaffold a repository.

:::tip
The closest equivalents to Bingo are [Plop](https://plopjs.com) and [Yeoman](https://yeoman.io).
See [FAQs > Ecosystem Comparisons](https://www.create.bingo/faqs/#ecosystem-comparisons) to learn how Bingo compares with other tools.
:::

Templates built with Bingo can do as little as define a small set of files and as much as describe the API calls and shell scripts that must be run with initializing a new repository and/or migrating it to a newer version of its Bingo template.

A straightforward Bingo template will generally at least define: an `option` schema describing what configurable options they take in, along with a `produce()` function to turn those options into files.
Files are represented as in-memory strings.

This template defines `owner` and `repository` options that are turned into `package.json` and `README.md` files:

```ts title
import { createTemplate } from "bingo";
import { z } from "zod";

export default createTemplate({
	options: {
		owner: z.string(),
		repository: z.string(),
	},
	produce({ options }) {
		return {
			"package.json": JSON.stringify({
				name: options.name,
				repository: `github:${options.owner}/${options.repository}`,
			}),
			"README.md": `# ${options.repository}\n\nHello, world!`,
		};
	},
});
```

That's all you have to do define your first Bingo template! ✨

Bingo templates can onboard many more features, including:

- [Additionally defining network requests and/or shell scripts](/build/concepts/creations)
- [Defining files with Handlebars templates](/engines/handlebars/about)
- [Presets of configurable, swappable "Blocks" of features](/engines/stratum/about)
- [Unit testing template creations](/build/packages/bingo-testers)

:::tip
For more examples of templates built with Bingo, see: [bingo-examples](https://github.com/bingo-examples).
:::

## Early Adopter Ready?

Bingo is ready for you to use.

The 2.x version of [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app) ("CTA") for several months.
CTA's 2.x graduated from beta to stable last month.
It was able to do so because Bingo is generally stable at runtime: it does not crash in common usage scenarios and its APIs are documented.

However, keep in mind that Bingo is still early stage and pre-1.x.
It hasn't been used by any other projects beyond CTA.
Some APIs will likely change over the next year as early adopters put Bingo through its paces.
There will likely be many bugs, documentation issues, and important features to be resolved before Bingo stabilizes.

The benefit of being an early adopter is that you'll get hands-on support from me, the creator, as you try Bingo out.
Bugs and missing features you discover will be prioritized early on so you can have as great a repository template as possible built on Bingo.

## Getting Started

The Bingo framework is a huge step forward in how to define repository frameworks.
I hope you'll join me in trying it out.
[Your First Bingo Template](/blog/your-first-bingo-template) will walk you through building your first template with Bingo.

Please, try Bingo out and give feedback:

- [Bingo's Discord](https://discord.gg/Jh85eMGQnV): Join if you'd like to chat about Bingo and/or get help with templates
- [github.com/JoshuaKGoldberg/bingo](https://github.com/JoshuaKGoldberg/bingo) is always open for bug reports, documentation suggestions, and feature requests

Thanks for reading, and I look forward to seeing what you build with Bingo! 💝
