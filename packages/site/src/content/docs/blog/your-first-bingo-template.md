---
authors:
  - joshuakgoldberg
date: 2025-02-20
excerpt: Bingo is a framework for delightful web repository templates.
  This guide will walk you through creating your first template with Bingo.
  You'll see how to define a template that creates a single file, run that template locally with a Bingo CLI, and give that template its own CLI.
title: Your First Bingo Template
---

Bingo is a framework for delightful web repository templates.
This guide will walk you through creating your first template with Bingo.
You'll see how to define a template that creates a single file, run that template locally with a Bingo CLI, and give that template its own CLI.

## Requirements

Bingo requires [Node.js LTS](https://nodejs.org).
As long as you can run `npm install` or an equivalent, you can develop with Bingo.

## Getting Started

Bingo templates can be defined in as little as two files:

1. [Template File](#1-template-file): defining the logic for the template
2. [Runner File](#2-runner-file): script file to run on the CLI

:::tip
For example Bingo template repositories, see:

- [create-example-minimal](https://github.com/bingo-examples/create-example-minimal): The barest bones template as created by this docs page
- [create-example](https://github.com/bingo-examples/create-example): A larger template with more options and tests

[github.com/bingo-examples](https://github.com/bingo-examples) contains more examples of Bingo templates.
:::

### 1. Template File

In a new empty directory, create a `package.json`, install `bingo` as a dependency, then create a `template.js` file:

```json title="package.json"
{
	"name": "my-template",
	"version": "0.0.0",
	"type": "module"
}
```

```shell
npm i bingo
```

```js title="template.js"
import { createTemplate } from "bingo";

const template = createTemplate({
	produce() {
		return {
			files: {
				"README.md": "# Hello, world!",
			},
		};
	},
});

export default template;

export const { createConfig } = template;
```

You can then provide the path to that file to the [`bingo` CLI](/build/cli) to create a `README.md` file in a `generated/` directory:

```shell
npx bingo template.js --directory generated
```

```plaintext
┌  ✨ bingo@... ✨
│
◇  Imported ./template.js
│
◇  Running with mode --setup
│
◇  Inferred default options from system
│
▲  Running in local-only mode. Add string-like options.owner and options.repository schemas to enable creating a repository on GitHub.
│
◇  Ran the bingo template.js template
│
◇  Prepared local repository
│
│  You've got a new repository ready to use in:
│    ./generated
│
└  Thanks for using bingo template.js! 💝
```

```md title="generated/README.md"
# Hello, world!
```

🥳 Congratulations!
You just built and ran your first template with Bingo.

### 2. Runner File

Bingo templates provide their own CLI to use instead of `bingo`.
That way end-users don't need to install any Bingo dependencies, just the template.

Create an `index.js` file with the following content:

```js title="index.js"
#!/usr/bin/env node
import { runTemplateCLI } from "bingo";

import template from "./template.js";

process.exitCode = await runTemplateCLI(template);
```

Then, add a `bin` entry for the `index.js` file to your `package.json`:

```diff lang="json" title="package.json"
  {
  	"name": "my-template",
  	"version": "0.0.0",
  	"type": "module",
+ 	"bin": "index.js",
  	"dependencies": { ... },
  }
```

You and your template's users will now be able to run your template with `npx`.

Try it out locally with:

```shell
npx . --directory generated
```

```plaintext
┌  ✨ my-template@0.0.0 ✨
│
◇  Running with mode --transition
│
◇  Inferred options from existing repository
│
◇  Ran my-template
│
└  Done. Enjoy your updated repository! 💝
```

🥳 Congratulations!
You just built and ran your first Bingo template CLI.

## Learning More

Here are the main concepts you'll want to understand:

1. **[Creations](/build/concepts/creations)**: how the pieces of a repository are described by templates in-memory
2. **[Modes](/build/concepts/modes)**: the ways Bingo can be run to create a new repository or migrate an existing one
3. **[Templates](/build/concepts/templates)**: describing how to setup or transition a repository given a set of options

See also API documentation for the functions referenced on this page:

- [`createTemplate`](/build/apis/create-template)
- [`runTemplateCLI`](/build/apis/run-template-cli)
