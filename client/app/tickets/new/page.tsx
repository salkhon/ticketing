"use client"; // client component; because using useRequest, useRouter, and event handlers
import { FormEvent } from "react";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/navigation";

export default function NewTicket() {
	const router = useRouter();
	const { doRequest, errors } = useRequest({
		url: "/api/tickets",
		method: "POST",
		onSuccess: () => router.push("/"),
	});

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		doRequest({
			title: event.target["title"].value,
			price: parseFloat(event.target["price"].value),
		});
	}

	return (
		<div className="container pl-10">
			<h1 className="text-3xl font-semibold text-gray-900 my-5">
				Create A Ticket
			</h1>

			<form onSubmit={onSubmit}>
				<div className="space-y-12">
					<div className="sm:col-span-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Title
						</label>
						<div className="mt-2">
							<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
								<input
									id="title"
									name="title"
									type="text"
									placeholder="Coldplay Concert"
									autoComplete="title"
									className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
									required
								/>
							</div>
						</div>
					</div>

					<div className="sm:col-span-4">
						<label
							htmlFor="price"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Price
						</label>
						<div className="mt-2">
							<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
								<input
									id="price"
									name="price"
									type="number"
									min="0"
									onBlur={(e) => {
										e.target.value = parseFloat(e.target.value).toFixed(2);
									}}
									placeholder="20"
									autoComplete="price"
									className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>

					{errors}

					<div className="mt-6 flex items-center justify-start gap-x-6">
						<button
							type="submit"
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Save
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
