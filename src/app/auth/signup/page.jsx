
import SignUpForm from './SignUpForm';

export const metadata = {
    title: "Sign Up | MediCare Connect",
    description:
        "Create your MediCare Connect account to book doctor appointments, manage healthcare records, and access secure medical services online.",
    keywords: [
        "Sign Up",
        "Register",
        "Create Account",
        "Patient Registration",
        "Doctor Registration",
        "Healthcare Platform",
        "MediCare Connect",
    ],
};
const SignUpPage = () => {
    return (
        <div>
            <SignUpForm></SignUpForm>
        </div>
    );
};

export default SignUpPage;