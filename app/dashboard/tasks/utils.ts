export function tempId(): string {
	return `temp-${Math.random().toString(36).slice(2, 9)}`;
}
