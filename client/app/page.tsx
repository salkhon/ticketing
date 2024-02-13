import React from "react";
import { getCurrentUser } from "./data/getCurrentUser";
import Navigation from "./components/Navigation";

export default async function App() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<Navigation currentUser={currentUser} />
			<h1 className="text-3xl">Landing Page</h1>
			{currentUser ? (
				<h2>You are signed in as {currentUser.email}</h2>
			) : (
				<h2>You are not signed in</h2>
			)}
		</>
	);
}
