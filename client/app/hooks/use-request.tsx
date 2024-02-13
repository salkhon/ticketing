"use client";
import { useState } from "react";
import "../globals.css";

export default function useRequest({
	url,
	method,
	onSuccess,
}: {
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	onSuccess?: ((resp: Response) => void) | undefined;
}) {
	const [errors, setErrors] = useState(null);

	async function doRequest(body: object) {
		try {
			const resp = await fetch(url, {
				method,
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!resp.ok) {
				throw await resp.json();
			}

			setErrors(null);
			if (onSuccess) {
				onSuccess(resp);
			}
			return resp.json();
		} catch (err) {
			setErrors(
				<div className="border rounded-lg border-red-500 p-3 mb-2">
					<h4 className="text-red-500">Ooops...</h4>
					<ul className="list-disc ml-7 text-red-500">
						{err.errors.map((err, idx) => (
							<li key={idx}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	}

	return { doRequest, errors };
}
