import { LayoutSideContentLeft, Gear, House, Magnifier, Person, CreditCard, FileText } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { Calendar, Stethoscope, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";

export async function DashboardSidebar() {

    // 🔥 Testing purpose only
    // কোনো session না, কোনো fetch না

    const currentRole = "patient";

    const patientNavLinks = [
        { icon: House, href: "/dashboard/patient", label: "Overview" },
        { icon: Magnifier, href: "/find-doctors", label: "Find Doctors" },
        { icon: Calendar, href: "/dashboard/patient/appointments", label: "My Appointments" },
        { icon: CreditCard, href: "/dashboard/patient/payments", label: "Billing & Payments" },
        { icon: Gear, href: "/dashboard/patient/reviews", label: "Feedback & Reviews" },
    ];

    const doctorNavLinks = [
        { icon: House, href: "/dashboard/doctor", label: "Overview" },
        { icon: Calendar, href: "/dashboard/doctor/schedules", label: "Manage Schedules" },
        { icon: Stethoscope, href: "/dashboard/doctor/consultations", label: "Consultate Appointments" },
        { icon: Person, href: "/dashboard/doctor/prescription", label: "Prescription" },
        { icon: Gear, href: "/dashboard/doctor/credentials", label: "Profile Credentials" },
    ];

    const adminNavLinks = [
        { icon: House, href: "/dashboard/admin", label: "Ecosystem Analytics" },
        { icon: Users, href: "/dashboard/admin/users", label: "Manage Users" },
        { icon: ShieldCheck, href: "/dashboard/admin/verifications", label: "Verify Doctors" },
        { icon: FileText, href: "/dashboard/admin/appointments", label: "Clinical Appointments" },
        { icon: CreditCard, href: "/dashboard/admin/payments", label: "Stripe Cash Flows" },
    ];

    const navLinksMap = {
        patient: patientNavLinks,
        doctor: doctorNavLinks,
        admin: adminNavLinks,
    };

    const navItems = navLinksMap[currentRole];

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const IconComponent = item.icon;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-gray-100"
                    >
                        <IconComponent className="size-5" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            <aside className="hidden lg:block w-64 border-r p-4">
                <h2 className="mb-6 text-xl font-bold">
                    MediCare Connect
                </h2>

                {navContent}
            </aside>

            <Drawer>
                <Button className="lg:hidden">
                    <LayoutSideContentLeft />
                    Menu
                </Button>

                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />

                            <Drawer.Header>
                                <Drawer.Heading>
                                    MediCare Connect
                                </Drawer.Heading>
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