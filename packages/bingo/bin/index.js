#!/usr/bin/env node
import { runBingoCLI } from "../lib/index.js";

process.exitCode = await runBingoCLI(process.argv.slice(2));
