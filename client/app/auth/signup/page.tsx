import AuthForm from "../components/AuthForm";

export default function Signup() {
	return <AuthForm title="Sign Up" postUrl="/api/users/signup" />;
}
