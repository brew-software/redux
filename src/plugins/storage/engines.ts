import { StorageEngine } from "./+types";

export class LocalStorageEngine implements StorageEngine {
	get(key: string) {
		return localStorage.getItem(key);
	}

	save(key: string, value: string) {
		return localStorage.setItem(key, value);
	}

	delete(key: string) {
		return localStorage.removeItem(key);
	}

	empty() {
		return localStorage.clear();
	}
}
