import bcrypt from "bcrypt";

export class Password {
	static async toHash(password: string) {
		const salt = (await bcrypt.genSalt(10)).toString();
		return await bcrypt.hash(password, salt);
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		return await bcrypt.compare(suppliedPassword, storedPassword);
	}
}
