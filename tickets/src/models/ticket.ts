import mongoose from "mongoose";

interface ITicket {
	title: string; // TS type
	price: number;
	userId: string;
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

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
