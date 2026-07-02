import ManagePaymentsClient from "./ManagePaymentsClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Stripe Cash Flows | MediCare Connect",
    description: "Track payment transactions, consultation revenues, refunds, and Stripe-powered financial activities securely.",
    keywords: ["Stripe Payments", "Revenue", "Payment Management", "Healthcare Finance"],
};

async function getPaymentsFromExpress() {
  try {
    // Take your Express backend URL from the environment variables
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/payments-ledger`, {
      cache: "no-store", // Cache is disabled to ensure real-time data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch ledger from Express server");
    }

    return await res.json();
  } catch (error) {
    console.error("Express Fetch Error:", error);
    return [];
  }
}

export default async function PaymentsPage() {
  const paymentsData = await getPaymentsFromExpress();

  return (
    <div className="w-full min-h-screen bg-zinc-50/30 dark:bg-zinc-950/10">
      {/* Passing the data coming from Express to the client component */}
      <ManagePaymentsClient initialPayments={paymentsData} />
    </div>
  );
}