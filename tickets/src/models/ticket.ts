import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket extends mongoose.Document {
	title: string; // TS type
	price: number;
	userId: string;
	version: number;
	orderId?: string; // optional
}

const ticketSchema = new mongoose.Schema<ITicket>(
	{
		title: {
			type: String, // JS constructor
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		userId: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				// ret is the object that is about to be converted to JSON
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

ticketSchema.set("versionKey", "version"); // rename __v to version
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
