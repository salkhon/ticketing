import mongoose from "mongoose";

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String, // capital String is a JS constructor function, not TS type string
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model("User", userSchema);

// User factory function (instead of new User({ email, password }) for TypeScript)
export function createUser(attrs: UserAttrs) {
	return new User(attrs);
}

export { User };
