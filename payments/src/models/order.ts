import mongoose from "mongoose";
import { OrderStatus } from "@salkhon-ticketing/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// TS side
interface IOrder extends mongoose.Document {
	id: string;
	userId: string;
	version: number;
	status: OrderStatus;
	price: number;
  paymentIntentId?: string;
}

// provides type checking for static methods
interface OrderModel extends mongoose.Model<IOrder> {
	/**
	 * @returns {Promise<typeof Order | null>} the order with the given id and version - 1
	 * or null if it doesn't exist
	 */
	findByEvent(event: { id: string; version: number }): Promise<IOrder | null>;
}

// Mongoose side
const orderSchema = new mongoose.Schema<IOrder>(
	{
		id: {
			type: String,
			required: true,
			default: new mongoose.Types.ObjectId().toHexString(),
		},
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
    paymentIntentId: {
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
		statics: {
			findByEvent(event: {
				id: string;
				version: number;
			}): Promise<IOrder | null> {
				return Order.findOne({
					_id: event.id,
					version: event.version - 1,
				});
			},
		},
	}
);

orderSchema.pre("save", function (done) {
	this._id = this.id;
	done();
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export const Order = mongoose.model<IOrder, OrderModel>("Order", orderSchema);
export { OrderStatus };
