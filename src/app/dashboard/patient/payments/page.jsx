import { getUserSession } from "@/lib/core/session";
import PatientPaymentsClient from "./PatientPaymentsClient";


export const metadata = {
    title: "Billing & Payments | MediCare Connect",
    description: "Securely manage consultation fees, billing history, payment records, and online healthcare transactions.",
    keywords: ["Billing", "Payments", "Medical Payments", "Consultation Fees", "Healthcare Billing"],
};

const PatientPaymentsPage = async () => {
  const user = await getUserSession();
  const patientId = user?._id || user?.id; // MongoDB user ID from your session template

  let payments = [];
  if (patientId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/patient/${patientId}`, {
        cache: "no-store", // Cache disabled to guarantee real-time data fetching
      });
      if (res.ok) {
        payments = await res.json();
      }
    } catch (error) {
      console.error("Failed to load payment history in server component:", error);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Stripe Payment Transactions</h1>
        <p className="text-xs text-gray-500 mt-0.5">View and monitor your historical bills, receipts, and digital transaction logs.</p>
      </div>

      {/* Client Table Rendering */}
      <PatientPaymentsClient initialPayments={payments} />
    </div>
  );
};

export default PatientPaymentsPage;