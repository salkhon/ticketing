import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

export interface ITicket {
	title: string;
	price: number;

	/**
	 * @returns {Promise<boolean>} true if the ticket is associated with a non-cancelled order
	 */
	isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema<ITicket>(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
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
		methods: {
			isReserved: async function () {
				const existingOrder = await Order.findOne({
					ticket: this,
					status: {
						$ne: OrderStatus.CANCELLED,
					},
				});
				return !!existingOrder;
			},
		},
	}
);

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
