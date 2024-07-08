"use server";

// request from nextjs server (server-less?) to indepedent server
// todo: use this? need to understand how this works
export async function createTicket(form: FormData) {
	const ticket = {
		title: form.get("title"),
		price: form.get("price"),
	};

	const response = await fetch("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets", {
		method: "POST",
		body: JSON.stringify(ticket),
		headers: {
			"Content-Type": "application/json",
		},
	});
	
  console.log(response);
  return response.json();
}
