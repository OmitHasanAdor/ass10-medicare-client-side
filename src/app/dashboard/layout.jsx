import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
    const user = await getUserSession();

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <DashboardSidebar />
          <div className="flex-1">{children}</div>
        </div>
    );
}