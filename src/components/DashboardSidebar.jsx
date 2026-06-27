import { getUserSession } from "@/lib/core/session";
import { LayoutSideContentLeft, Gear, House, Magnifier, Person, CreditCard, FileText } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Calendar, Stethoscope, Users, BarChart3, ShieldCheck } from "lucide-react";
import Link from "next/link";

export async function DashboardSidebar() {

    const user = await getUserSession();

    // 1. Patient Navigation Links
    const patientNavLinks = [
        { icon: House, href: "/dashboard/patient", label: "Dashboard" },
        { icon: Magnifier, href: "/find-doctors", label: "Find Doctors" },
        { icon: Calendar, href: "/dashboard/patient/appointments", label: "My Appointments" },
        { icon: CreditCard, href: "/dashboard/patient/payments", label: "Billing & Payments" },
        { icon: Person, href: "/profile", label: "Medical Profile" },
        { icon: Gear, href: "/settings", label: "Settings" },
    ];

    // 2. Doctor Navigation Links
    const doctorNavLinks = [
        { icon: House, href: "/dashboard/doctor", label: "Overview" },
        { icon: Calendar, href: "/dashboard/doctor/appointments", label: "Manage Schedules" },
        { icon: Stethoscope, href: "/dashboard/doctor/consultations", label: "Consultations" },
        { icon: Person, href: "/profile", label: "Professional Profile" },
        { icon: Gear, href: "/settings", label: "Settings" },
    ];

    // 3. Admin Navigation Links
    const adminNavLinks = [
        { icon: House, href: "/dashboard/admin", label: "Admin Panel" },
        { icon: Users, href: "/dashboard/admin/users", label: "Manage Users" },
        { icon: ShieldCheck, href: "/dashboard/admin/verifications", label: "Verify Doctors" },
        { icon: FileText, href: "/dashboard/admin/appointments", label: "All Appointments" },
        { icon: CreditCard, href: "/dashboard/admin/payments", label: "Monitor Payments" },
        { icon: BarChart3, href: "/dashboard/admin/reports", label: "Reports & Analytics" },
        { icon: Gear, href: "/dashboard/admin/settings", label: "System Settings" },
    ];

    // Map your role based arrays here
    const navLinksMap = {
        patient: patientNavLinks,
        doctor: doctorNavLinks,
        admin: adminNavLinks
    };

    // Safely get the items, fallback to 'patient' layout if role is missing
    const currentRole = user?.role || 'patient';
    const navItems = navLinksMap[currentRole] || patientNavLinks;

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                    <Link
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                        href={item.href}
                    >
                        <IconComponent className="size-5 text-muted" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                <div className="mb-6 px-3 py-2">
                    <span className="text-lg font-bold text-primary">MediCare Connect</span>
                </div>
                {navContent}
            </aside>

            {/* Mobile Drawer Trigger & Layout */}
            <Drawer>
                <Button className="lg:hidden" variant="secondary">
                    <LayoutSideContentLeft />
                    Menu
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>MediCare Connect Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {navContent}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}