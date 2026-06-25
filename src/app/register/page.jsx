import RegisterClient from "@/components/RegisterClient";


export const metadata = {
  title: "Register | MediCare Connect",
  description: "Create your MediCare Connect account",
};

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <RegisterClient />
    </div>
  );
};

export default RegisterPage;