import { BingoSystem } from "bingo-systems";

import { Display } from "../contexts/createDisplay.js";

/**
 * Internal context in Bingo areas that rely on a CLI-style directory or display.
 */
export interface SystemContext extends BingoSystem {
	directory: string;
	display: Display;
}
