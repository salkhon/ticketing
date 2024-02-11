"use client"; // server sends back clearing cookie, so has to run on client
import { useRouter } from "next/navigation";
import useRequest from "../../hooks/use-request";
import { useEffect } from "react";
import { revalidatePath } from "next/cache";

export default function SignOut() {
	const router = useRouter();
	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "POST",
		onSuccess: () => {
			router.push("/");
		},
	});

	useEffect(() => {
		doRequest({});
	}, []);

	return <div>Signing out...</div>;
}
