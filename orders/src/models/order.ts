import mongoose from "mongoose";
import { OrderStatus } from "@salkhon-ticketing/common";

// TS side
interface IOrder {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: mongoose.Types.ObjectId;
}

// Mongoose side
const orderSchema = new mongoose.Schema<IOrder>(
	{
		userId: {
			type: String, // JS constructor
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.CREATED,
		},
		expiresAt: {
			type: mongoose.Schema.Types.Date,
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Ticket",
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

export const Order = mongoose.model<IOrder>("Order", orderSchema);
export { OrderStatus };
