export type StorageOptions<T> = {
	[P in keyof T]: StoragePropertyOptions<T[P]>;
};

export type StoragePropertyOptions<T> = {
	defaults?: T;
	correct?: (current: T, defaults: T) => T;
	valid?: (current: T, defaults: T) => boolean;
};

export interface StorageEngine {
	get(key: string): string | null;
	save(key: string, value: string): void;
	delete(key: string): void;
	empty(): void;
}
