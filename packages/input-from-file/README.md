<h1 align="center">input-from-file</h1>

<p align="center">Bingo input that reads a file as text.</p>

<p align="center">
	<a href="https://github.com/JoshuaKGoldberg/bingo/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://github.com/JoshuaKGoldberg/bingo/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/input-from-file"><img alt="📦 npm version" src="https://img.shields.io/npm/v/input-from-file?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

```shell
npm i input-from-file
```

```ts
import { inputFromFile } from "input-from-file";

await take(inputFromFile, { filePath: "data.txt" });
```

## Options

`inputFromFile` takes a single argument, `filePath`, of type `string`.

It reads the `filePath` from disk and returns either:

- [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error): If an error was caught reading the file
- `string`: The text contents of the file

See **[create.bingo > Templates > Concepts > Inputs](https://create.bingo/build/details/inputs)** for more documentation on Inputs.
