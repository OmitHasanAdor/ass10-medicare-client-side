import ManagePaymentsClient from "./ManagePaymentsClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Stripe Cash Flows | MediCare Connect",
    description: "Track payment transactions, consultation revenues, refunds, and Stripe-powered financial activities securely.",
    keywords: ["Stripe Payments", "Revenue", "Payment Management", "Healthcare Finance"],
};

async function getPaymentsFromExpress() {
  try {
    // আপনার এক্সপ্রেস ব্যাকএন্ডের URL (যেমন: http://localhost:5000) এনভায়রনমেন্ট ভ্যারিয়েবল থেকে নিন
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/payments-ledger`, {
      cache: "no-store", // রিয়েল-টাইম ডাটা নিশ্চিত করতে ক্যাশ অফ রাখা হলো
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
      {/* এক্সপ্রেস থেকে আসা ডাটা ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে */}
      <ManagePaymentsClient initialPayments={paymentsData} />
    </div>
  );
}