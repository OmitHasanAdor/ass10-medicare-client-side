import Link from "next/link";

export async function DashboardSidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <h2 className="font-bold mb-5">Dashboard</h2>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard/patient">Overview</Link>
        <Link href="/dashboard/patient/appointments">Appointments</Link>
        <Link href="/dashboard/patient/payments">Payments</Link>
        <Link href="/dashboard/patient/reviews">Reviews</Link>
      </nav>
    </aside>
  );
}