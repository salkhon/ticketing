import { cookies, headers } from "next/headers";

export async function getCurrentUser(): Promise<{
	email: string;
	id: string;
} | null> {
	const session = cookies().get("session");

	const currentUserData = await fetch(
		"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
		{
			headers: {
				"Content-Type": "application/json",
				Cookie: `session=${session?.value};path=/;domain=https://ticketing.dev;secure;httponly`,
			}, // acting as a proxy
			next: {
				tags: ["currentuser"], // to revalidate
			},
		}
	);
  
	return (await currentUserData.json()).currentUser;
}
