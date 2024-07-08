"use client"; // server sends back clearing cookie, so has to run on client
import { useRouter } from "next/navigation";
import useRequest from "../../hooks/use-request";
import { useEffect } from "react";
import revalidateCurrentUserTag from "../actions";

export default function SignOut() {
	const router = useRouter();
	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "POST",
		onSuccess: () => {
			router.push("/");
			router.refresh();
		},
	});

	useEffect(() => {
		const signOut = async () => {
			await revalidateCurrentUserTag(); // revalidate current user cache on server
			doRequest({});
		};
		signOut();
	}, []);

	return <div>Signing out...</div>;
}
