import { headers } from "next/headers";

export async function getCurrentUser(): Promise<{
	email: string;
	id: string;
} | null> {
	const headerList = headers();
	const currentUserData = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
		{
			headers: headerList, // acting as a proxy
		}
	);
	return (await currentUserData.json()).currentUser;
}
