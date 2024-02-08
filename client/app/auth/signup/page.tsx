"use client";
import { useRef } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";

export default function Signup() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const { doRequest, errors } = useRequest({
		url: "/api/users/signup",
		method: "POST",
		onSuccess: () => router.push("/"),
	});

	function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const email = emailRef.current!.value;
		const password = passwordRef.current!.value;

		doRequest({ email, password });
	}

	return (
		<form className="max-w-sm mx-auto mt-[25vh]" onSubmit={onFormSubmit}>
			<h1 className="text-5xl text-center m-5">Sign Up</h1>
			<div className="mb-5">
				<label
					htmlFor="email"
					className="block mb-2 text-sm font-medium text-gray-900"
				>
					Your email
				</label>
				<input
					type="email"
					id="email"
					ref={emailRef}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					placeholder="name@gmail.com"
					required
				/>
			</div>
			<div className="mb-5">
				<label
					htmlFor="password"
					className="block mb-2 text-sm font-medium text-gray-900"
				>
					Your password
				</label>
				<input
					type="password"
					id="password"
					ref={passwordRef}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					required
				/>
			</div>
			<div className="flex items-start mb-5">
				<div className="flex items-center h-5">
					<input
						id="remember"
						type="checkbox"
						value=""
						className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
					/>
				</div>
				<label
					htmlFor="remember"
					className="ms-2 text-sm font-medium text-gray-900"
				>
					Remember me
				</label>
			</div>

			{errors}

			<button
				type="submit"
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				Submit
			</button>
		</form>
	);
}
