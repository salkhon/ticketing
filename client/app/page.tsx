import React from "react";
import { headers } from "next/headers";

async function getCurrentUser() {
	const headerList = headers();
	const currentUser = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
		{
			headers: headerList, // acting as a proxy
		}
	);
	return (await currentUser.json()).currentUser;
}

export default async function App() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<h1 className="text-3xl">Landing Page</h1>
			{currentUser ? (
				<h2>You are signed in as {currentUser.email}</h2>
			) : (
				<h2>You are not signed in</h2>
			)}
		</>
	);
}
