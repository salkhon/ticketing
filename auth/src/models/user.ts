import mongoose from "mongoose";
import { Password } from "../services/password";

/**
 * These are boilerplate code to enhace mongoose models with TypeScript typing
 */

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

// mongoose middleware to hash password before saving
userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
	email: string;
	password: string;
}

// An interface that describes the properties that a User Document has
// (inherinting all properties of mongoose.Document)
interface UserDocument extends mongoose.Document {
	email: string;
	password: string;
}

// An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDocument> {
	build(attrs: UserAttrs): UserDocument; // factory method of User Model, returns User Document
}

// User factory function (instead of new User({ email, password }) for TypeScript)
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
