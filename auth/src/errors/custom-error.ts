export abstract class CustomError extends Error {
	abstract status: number; // abstract means that subclasses must implement this property

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): { message: string; field?: string }[];
}
