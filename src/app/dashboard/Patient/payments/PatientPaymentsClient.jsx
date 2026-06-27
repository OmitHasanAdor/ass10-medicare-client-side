"use client";

import { useState } from "react";
import { CreditCard, ArrowUpRight, Copy, Check } from "lucide-react";

const PatientPaymentsClient = ({ initialPayments }) => {
  const [payments] = useState(initialPayments);
  const [copiedId, setCopiedId] = useState(null);

  // ট্রানজেকশন আইডি কপিয়ার ফাংশন
  const handleCopy = (txId) => {
    navigator.clipboard.writeText(txId);
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ডেট ফরম্যাটার ইউটিলিটি
  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    const dateStr = dateObj.$date || dateObj;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8 text-gray-400">
        <CreditCard className="size-12 mx-auto mb-3 opacity-30 text-emerald-500" />
        <p className="text-sm font-medium">No payment history found.</p>
        <p className="text-xs text-gray-400 mt-1">Transactions will appear here once you make an appointment booking.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      
      {/* 🖥️ ডেস্কটপ ও ট্যাবলেট ভিউ (বড় স্ক্রিনের জন্য প্রফেশনাল টেবিল) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/70 border-b text-gray-400 font-bold text-[11px] uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Paid Practitioner</th>
              <th className="px-6 py-4 font-semibold">Stripe Charge / TXID</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm text-gray-700">
            {payments.map((pay) => (
              <tr key={pay._id} className="hover:bg-zinc-50/50 transition-colors">
                {/* ডাক্তার নাম */}
                <td className="px-6 py-4.5 font-bold text-gray-800">
                  {pay.doctorDetails?.doctorName || "Medical Specialist"}
                </td>
                
                {/* ট্রানজেকশন আইডি বাটনসহ */}
                <td className="px-6 py-4.5 font-mono text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 group max-w-50">
                    <span className="truncate">{pay.transactionId}</span>
                    <button 
                      onClick={() => handleCopy(pay.transactionId)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition text-gray-400 hover:text-gray-700"
                      title="Copy Transaction ID"
                    >
                      {copiedId === pay.transactionId ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </td>
                
                {/* অ্যামাউন্ট */}
                <td className="px-6 py-4.5 font-extrabold text-emerald-600">
                  ${pay.amount}
                </td>
                
                {/* পেমেন্ট ডেট */}
                <td className="px-6 py-4.5 text-gray-500 text-xs">
                  {formatDate(pay.paymentDate)}
                </td>
                
                {/* স্ট্যাটাস ব্যাজ */}
                <td className="px-6 py-4.5 text-center">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                    Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 মোবাইল ভিউ (ছোট স্ক্রিনে এটি কার্ড লিস্টে কনভার্ট হয়ে যাবে) */}
      <div className="block sm:hidden divide-y">
        {payments.map((pay) => (
          <div key={pay._id} className="p-4 space-y-3 bg-white hover:bg-zinc-50/50 transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800 text-base">{pay.doctorDetails?.doctorName || "Medical Specialist"}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Date: {formatDate(pay.paymentDate)}</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                Success
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-zinc-50 p-2.5 rounded-xl border text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Transaction ID</span>
                <span className="font-mono text-gray-600 break-all block pr-2">{pay.transactionId}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Amount</span>
                <span className="font-extrabold text-emerald-600 text-sm">${pay.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PatientPaymentsClient;