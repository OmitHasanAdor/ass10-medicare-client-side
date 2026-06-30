"use client";

import { useState } from "react";
import { Table } from "@heroui/react";
import { Search, ArrowUpDown, Calendar, Fingerprint, ShieldCheck } from "lucide-react";

export default function ManagePaymentsClient({ initialPayments }) {
  const [payments, setPayments] = useState(initialPayments || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("ascending");

  // সার্চ ফিল্টার
  const filteredPayments = payments.filter((payment) => {
    const patientName = payment.patientInfo?.name || "";
    const doctorName = payment.doctorInfo?.doctorName || "";
    const txId = payment.transactionId || "";

    return (
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // অ্যামাউন্ট সর্টিং
  const handleSort = () => {
    const nextDirection = sortDirection === "ascending" ? "descending" : "ascending";
    setSortDirection(nextDirection);

    const sorted = [...payments].sort((a, b) => {
      return nextDirection === "ascending" ? a.amount - b.amount : b.amount - a.amount;
    });
    setPayments(sorted);
  };

  // ডেট ফরম্যাট হেল্পার
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const dateStr = dateValue.$date || dateValue; // MongoDB object বা raw string উভয়ের জন্যই হ্যান্ডলার
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 sm:p-6">
      
      {/* 🏷️ ড্যাশবোর্ড হেডার ও সার্চবার গ্রুপ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck className="size-5 text-blue-600" /> Secure Stripe Co-Pay Ledger
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time infrastructure auditing for cross-network financial transactions.</p>
        </div>
        
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search accounts or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition bg-white/80 dark:bg-zinc-900 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* 🖥️ ডেস্কটপ ও ট্যাবলেট ভিউ: প্রফেশনাল HeroUI টেবিল */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Stripe Cash Flows Ledger">
              <Table.Header>
                <Table.Column className="font-bold uppercase text-[10px] tracking-wider text-zinc-400 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950">
                  Payer Patient
                </Table.Column>
                <Table.Column className="font-bold uppercase text-[10px] tracking-wider text-zinc-400 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950">
                  Clinical Doctor
                </Table.Column>
                <Table.Column className="font-bold uppercase text-[10px] tracking-wider text-zinc-400 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950">
                  Stripe Charge ID
                </Table.Column>
                <Table.Column allowsSorting className="font-bold uppercase text-[10px] tracking-wider text-zinc-400 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950">
                  {() => (
                    <Table.SortableColumnHeader 
                      sortDirection={sortDirection}
                      onClick={handleSort}
                      className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition"
                    >
                      Co-Pay Value <ArrowUpDown className="size-3" />
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column className="font-bold uppercase text-[10px] tracking-wider text-zinc-400 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950">
                  Date
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {filteredPayments.map((payment) => {
                  const id = payment._id?.$oid || payment._id;
                  
                  return (
                    <Table.Row key={id} className="border-b last:border-0 border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/40 dark:hover:bg-zinc-950/30 transition-colors">
                      <Table.Cell className="px-6 py-4 font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                        {payment.patientInfo?.name || "Patient"}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {payment.doctorInfo?.doctorName || "Dr. Professional"}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <code className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                          {payment.transactionId}
                        </code>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 text-sm">
                        ${payment.amount}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 text-xs text-zinc-500 font-medium">
                        {formatDate(payment.paymentDate)}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* 📱 মোবাইল ভিউ: রেসপনসিভ কার্ড সিস্টেম */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredPayments.map((payment) => {
          const id = payment._id?.$oid || payment._id;

          return (
            <div key={id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                  {payment.patientInfo?.name || "Patient"}
                </h3>
                <span className="font-extrabold text-zinc-900 dark:text-zinc-50 text-sm bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  ${payment.amount}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Clinical Doctor</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {payment.doctorInfo?.doctorName || "Doctor"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Fingerprint className="size-3" /> Stripe Charge ID
                  </span>
                  <code className="text-[11px] font-mono text-zinc-500 max-w-37.5 truncate">
                    {payment.transactionId}
                  </code>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Calendar className="size-3" /> Processing Date
                  </span>
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">
                    {formatDate(payment.paymentDate)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* এম্পটি স্টেট */}
      {filteredPayments.length === 0 && (
        <div className="text-center py-16 bg-zinc-50/50 dark:bg-zinc-950/20 border border-dashed rounded-2xl p-8 text-zinc-400 text-xs font-medium">
          No transactions ledger match your filter parameters.
        </div>
      )}
    </div>
  );
}