import AuthForm from "../components/AuthForm";

export default function SignIn() {
	return <AuthForm title="Sign In" postUrl="/api/users/signin" />;
}
