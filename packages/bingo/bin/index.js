#!/usr/bin/env node
import { runBingoCli } from "../lib/index.js";

process.exitCode = await runBingoCli(process.argv.slice(2));
