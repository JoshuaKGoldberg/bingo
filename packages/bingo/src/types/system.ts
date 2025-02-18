import { BingoSystem } from "bingo-systems";

import { Display } from "../contexts/createDisplay.js";
import { TakeInput } from "./inputs.js";

export interface SystemContext extends BingoSystem {
	directory: string;
	display: Display;
	take: TakeInput;
}
