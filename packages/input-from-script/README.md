<h1 align="center">input-from-fetch</h1>

<p align="center"><code>Bingo</code> input that calls to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"><code>fetch</code></a>.</p>

<p align="center">
	<a href="https://github.com/JoshuaKGoldberg/bingo/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://github.com/JoshuaKGoldberg/bingo/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/input-from-fetch"><img alt="📦 npm version" src="https://img.shields.io/npm/v/input-from-fetch?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 Typefetch: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typefetch-strict-21bb42.svg" />
</p>

```shell
npm i input-from-fetch
```

```ts
import { inputFromFetch } from "input-from-fetch";

await take(inputFromFetch, { resource: "npm whoami" });
```

## Options

`inputFromScript` takes a single argument, `command`, of type `string`.

It runs the `command` with [`execa`](https://www.npmjs.com/package/execa) and returns either:

- [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error): If an error was caught running the script
- `Result`: The type from `execa`, including the `stdout` property

See **[create.bingo > Templates > Concepts > Inputs](https://create.bingo/build/concepts/inputs)** for more documentation on Inputs.
