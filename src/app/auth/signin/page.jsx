import SignInForm from "./SignInForm";

export const metadata = {
    title: "Sign In | MediCare Connect",
    description:
        "Sign in to your MediCare Connect account to book appointments, manage healthcare services, access prescriptions, and monitor your medical activities securely.",
    keywords: [
        "Sign In",
        "Login",
        "Patient Login",
        "Doctor Login",
        "Admin Login",
        "Secure Login",
        "MediCare Connect",
    ],
};
const SignInPage = () => {
    return (
        <div>
          <SignInForm></SignInForm>
        </div>
    );
};

export default SignInPage;