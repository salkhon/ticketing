import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface ITicket extends mongoose.Document {
	title: string;
	price: number;
	version: number;

	/**
	 * @returns {Promise<boolean>} true if the ticket is associated with a non-cancelled order
	 */
	isReserved(): Promise<boolean>;
}

// provides type checking for static methods
interface TicketModel extends mongoose.Model<ITicket> {
	/**
	 * @returns {Promise<typeof Ticket | null>} the ticket with the given id and version - 1
	 * or null if it doesn't exist
	 */
	findByEvent(event: {
		id: string;
		version: number;
	}): Promise<ITicket | null>;
}

const ticketSchema = new mongoose.Schema<ITicket, TicketModel>(
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
		statics: {
			findByEvent: function (event: { id: string; version: number }) {
				return this.findOne({
					_id: event.id,
					version: event.version - 1,
				});
			},
		},
	}
);

ticketSchema.set("versionKey", "version");
// @ts-ignore
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<ITicket, TicketModel>(
	"Ticket",
	ticketSchema
);
