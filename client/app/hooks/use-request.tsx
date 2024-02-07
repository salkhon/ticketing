"use client";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

export default function useRequest({
	url,
	method,
	onSuccess,
}: {
	url: string;
	method: "get" | "post" | "put" | "delete";
	onSuccess: (resp: AxiosResponse) => void;
}) {
	const [errors, setErrors] = useState(null);

	async function doRequest(body: object) {
		try {
			const resp = await axios.request({
				method,
				url,
				data: body,
			});
			
      setErrors(null);

			if (onSuccess) {
				onSuccess(resp.data);
			}
      
			return resp.data;
		} catch (err) {
			setErrors(
				<div className="border rounded-lg border-red-500 p-3 mb-2">
					<h4 className="text-red-500">Ooops...</h4>
					<ul className="list-disc ml-7 text-red-500">
						{err.response.data.errors.map((err, idx) => (
							<li key={idx}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	}

	return { doRequest, errors };
}
