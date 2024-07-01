import mongoose from "mongoose";
import { OrderStatus } from "@salkhon-ticketing/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// TS side
interface IOrder extends mongoose.Document {
	userId: string;
	version: number;
	status: OrderStatus;
	price: number;
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
		price: {
			type: Number,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
export { OrderStatus };
