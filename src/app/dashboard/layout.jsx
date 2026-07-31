import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children }) {

    return (
        <div className="flex flex-col md:flex-row  min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <DashboardSidebar />
          <div className="flex-1">{children}</div>
        </div>
    );
}