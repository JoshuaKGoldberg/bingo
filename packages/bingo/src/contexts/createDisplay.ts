export interface Display {
	item(group: string, id: string, item: Partial<DisplayItem>): void;
	log(message: string): void;
}

export interface DisplayItem {
	end?: number;
	error?: unknown;
	start?: number;
}

export function createDisplay(): Display {
	return {
		item: (group, id, item) => {
			if (item.error) {
				console.error("Error in", group, id, item.error);
			}
		},
		log: (message) => {
			console.log(message);
		},
	};
}
