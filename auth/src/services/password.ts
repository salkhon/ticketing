import bcrypt from "bcrypt";

export class Password {
	static async toHash(password: string) {
		const salt = (await bcrypt.genSalt(10)).toString();
		return bcrypt.hash(password, salt);
	}

	static compare(storedPassword: string, suppliedPassword: string) {
		return bcrypt.compare(suppliedPassword, storedPassword);
	}
}
