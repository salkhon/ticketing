import Link from "next/link";

export default async function Navigation({
	currentUser,
}: {
	currentUser: { email: string; id: string };
}) {
	return (
		<nav className="flex justify-between p-5">
			<Link href="/" className="font-sans font-thin text-xl">Ticketing</Link>
			{/* If logged in show sign out link, if logged out show sign in, sign up */}
			<div className="flex justify-end space-x-5">
				{!!currentUser ? (
					<Link href="/auth/signout">Sign Out</Link>
				) : (
					<>
						<Link href="/auth/signin">Sign In</Link>
						<Link href="/auth/signup">Sign Up</Link>
					</>
				)}
			</div>
		</nav>
	);
}
