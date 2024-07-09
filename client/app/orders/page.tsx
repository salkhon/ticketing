import { getUserOrders } from "../services/api/orders/GET";

export default async function OrderIndex() {
	const orders = await getUserOrders();

	return (
		<div>
			<ul>
				{orders.map((order) => {
					return (
						<li key={order.id}>
							{order.ticket.title} - {order.status}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
